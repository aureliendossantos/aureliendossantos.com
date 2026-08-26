import { z } from "zod"

/**
 * The structured report the model streams back.
 *
 * The shape is a short fixed head followed by an **ordered stream of blocks**:
 *
 * - The head (`language`, `fitLevel`, `fitSummary`) is pinned, so the verdict
 *   is on screen within the first moment of generation whatever else follows.
 * - `sections` is written in whatever order the model judges best, and can
 *   include free-text `note` blocks for context or insight that would read
 *   badly squeezed into a pre-made block. The application still owns every
 *   block's typography, spacing and layout — the model owns the analysis and
 *   the running order.
 *
 * Two constraints carry over from the fixed-section version:
 *
 * 1. **No `.optional()`.** Strict JSON-schema mode requires every property, and
 *    a missing key is indistinguishable from a not-yet-streamed one on the
 *    client. Blocks with nothing to say use empty strings or empty arrays.
 * 2. This file is shared by the server (`Output.object`) and the browser
 *    (`useObject`), so it must stay free of server-only imports.
 */

export const fitLevels = ["strong", "promising", "mixed", "weak"] as const
export type FitLevel = (typeof fitLevels)[number]

/**
 * How well the documented evidence covers one requirement.
 *
 * The internal ladder is direct → transferable → plausible ramp-up →
 * unsupported. "direct" never appears here: a requirement he demonstrably
 * meets is evidence, not a gap.
 */
export const gapLevels = ["adjacent", "ramp-up", "none"] as const
export type GapLevel = (typeof gapLevels)[number]

/** What the visitor actually seems to need, in their terms. */
const needsBlock = z.object({
	kind: z.literal("needs"),
	items: z
		.array(
			z.object({
				label: z.string().describe("Short noun phrase, 2 to 6 words."),
				detail: z
					.string()
					.describe("One or two sentences on what this requirement really implies."),
			}),
		)
		.describe("Two to four characteristics extracted from the visitor's brief."),
})

/**
 * Portfolio items that support the case. `projectId` is resolved against
 * trusted local data — the model never writes a title, a date or a URL.
 */
const evidenceBlock = z.object({
	kind: z.literal("evidence"),
	items: z
		.array(
			z.object({
				projectId: z
					.string()
					.describe("A projectId copied exactly from the trusted dossier. Never invented."),
				relevance: z
					.string()
					.describe("Two to four sentences on why this project matters for THIS brief."),
				caveat: z
					.string()
					.describe(
						"Optional limit of this evidence for the brief, or an empty string if there is none.",
					),
			}),
		)
		.describe("Two to four pieces of supporting evidence, most relevant first."),
})

/**
 * The closest analogous thing already done, or — when no single project comes
 * close — the patterns that carry across several of them.
 */
const precedentBlock = z.object({
	kind: z.literal("precedent"),
	mode: z
		.enum(["single", "patterns"])
		.describe("'single' for one closest precedent, 'patterns' for transferable patterns."),
	headline: z.string().describe("One sentence naming the precedent or the patterns."),
	similar: z.array(z.string()).describe("What was similar. Zero to three short points."),
	transfers: z.array(z.string()).describe("What transfers to this brief. One to three points."),
	different: z.array(z.string()).describe("What was materially different. One to three points."),
})

/** The credibility block. Weak points, missing evidence, unmet requirements. */
const gapsBlock = z.object({
	kind: z.literal("gaps"),
	items: z
		.array(
			z.object({
				requirement: z.string().describe("The requested skill or responsibility, in a few words."),
				level: z
					.enum(gapLevels)
					.describe(
						"'adjacent' = closely related documented experience; 'ramp-up' = no direct evidence but a real bridge and a modest requested level; 'none' = no supporting evidence at all.",
					),
				assessment: z.string().describe("One to three honest sentences. Never explain a gap away."),
			}),
		)
		.describe("Two to five real gaps, most important first."),
})

/** What the visitor should actually ask if a conversation happens. */
const questionsBlock = z.object({
	kind: z.literal("questions"),
	items: z
		.array(
			z.object({
				question: z.string().describe("A question the visitor could ask Aurélien."),
				why: z.string().describe("One short sentence on why this question is worth asking."),
			}),
		)
		.describe("Two to four questions arising from the brief and from the uncertainties above."),
})

/**
 * The escape hatch: free prose the model places wherever it belongs.
 *
 * For anything a pre-made block would distort — context about the domain, an
 * observation that cuts across several projects, a caveat about the brief
 * itself, where he would contribute most. The model writes the heading, since
 * only it knows what the block is about; the application still owns how that
 * heading looks.
 */
const noteBlock = z.object({
	kind: z.literal("note"),
	heading: z
		.string()
		.describe("Two to five words naming this block, in the visitor's language. Plain text."),
	paragraphs: z
		.array(z.string())
		.describe("One to three short paragraphs of plain prose. No Markdown, no lists, no links."),
})

export const fitSectionSchema = z.discriminatedUnion("kind", [
	needsBlock,
	evidenceBlock,
	precedentBlock,
	gapsBlock,
	questionsBlock,
	noteBlock,
])

export type FitSection = z.infer<typeof fitSectionSchema>
export type FitSectionKind = FitSection["kind"]

export const fitReportSchema = z.object({
	/**
	 * Language of the visitor's brief, and therefore of this report. The
	 * application renders its own labels in the same language, so the model
	 * never writes UI chrome. Generated first: it is one token and it unblocks
	 * every label on the page.
	 */
	language: z.enum(["fr", "en"]).describe("Language of the pasted brief: 'fr' or 'en'."),

	/** Qualitative verdict. Never a percentage or a score. */
	fitLevel: z.enum(fitLevels).describe("Qualitative verdict on the match."),

	/** 2–4 sentences justifying the verdict, in the visitor's language. */
	fitSummary: z
		.string()
		.describe("Two to four sentences explaining the verdict. Concrete, no flattery."),

	/** The body of the report, in the order the model chooses to write it. */
	sections: z
		.array(fitSectionSchema)
		.describe("The report body. Order matters: blocks are rendered exactly as ordered here."),
})

export type FitReport = z.infer<typeof fitReportSchema>

/**
 * The shape the browser actually sees while the object is still streaming:
 * every field may be absent, every string may be half-written, and every array
 * may be short. Distributes over the block union, so narrowing a partial block
 * on `kind` still works.
 */
export type DeepPartial<T> = T extends (infer U)[]
	? DeepPartial<U>[]
	: T extends object
		? { [K in keyof T]?: DeepPartial<T[K]> }
		: T

export type PartialFitReport = DeepPartial<FitReport>
export type PartialFitSection = DeepPartial<FitSection>

/** Narrows a still-streaming block once its discriminant has fully arrived. */
export function isSection<K extends FitSectionKind>(
	section: PartialFitSection | undefined,
	kind: K,
): section is Extract<PartialFitSection, { kind?: K }> {
	return section?.kind === kind
}
