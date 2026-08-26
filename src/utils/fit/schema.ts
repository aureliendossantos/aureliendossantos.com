import { z } from "zod"

/**
 * The structured report the model streams back.
 *
 * Two rules shape this file:
 *
 * 1. **Field order is generation order.** OpenAI structured outputs emit
 *    properties in schema order, so the visitor sees the verdict first and the
 *    follow-up questions last. Reordering these keys reorders the streaming UX.
 *
 * 2. **No `.optional()`.** Strict JSON-schema mode requires every property, and
 *    a missing key is indistinguishable from a not-yet-streamed one on the
 *    client. Sections that may have nothing to say use an empty string or an
 *    empty array instead, and the UI hides them.
 *
 * This schema is shared by the server (`Output.object`) and the browser
 * (`useObject`), so it must stay free of server-only imports.
 */

export const fitLevels = ["strong", "promising", "mixed", "weak"] as const
export type FitLevel = (typeof fitLevels)[number]

/**
 * How well the documented evidence covers one requirement.
 *
 * The internal ladder is direct → transferable → plausible ramp-up →
 * unsupported. "direct" never appears in the gaps section: a requirement he
 * demonstrably meets is evidence, not a gap.
 */
export const gapLevels = ["adjacent", "ramp-up", "none"] as const
export type GapLevel = (typeof gapLevels)[number]

export const fitReportSchema = z.object({
	/**
	 * Language of the visitor's brief, and therefore of this report. The
	 * application renders its own section labels in the same language, so the
	 * model never writes UI chrome. Generated first: it is one token and it
	 * unblocks every label on the page.
	 */
	language: z.enum(["fr", "en"]).describe("Language of the pasted brief: 'fr' or 'en'."),

	/** Qualitative verdict. Never a percentage or a score. */
	fitLevel: z.enum(fitLevels).describe("Qualitative verdict on the match."),

	/** 2–4 sentences justifying the verdict, in the visitor's language. */
	fitSummary: z
		.string()
		.describe("Two to four sentences explaining the verdict. Concrete, no flattery."),

	/**
	 * What the visitor actually seems to need. Proves the brief was understood
	 * before any CV is recited.
	 */
	needs: z
		.array(
			z.object({
				label: z.string().describe("Short noun phrase, 2 to 6 words."),
				detail: z
					.string()
					.describe("One or two sentences on what this requirement really implies."),
			}),
		)
		.describe("Two to four characteristics extracted from the visitor's brief."),

	/**
	 * Portfolio items that support the case. `projectId` is resolved against
	 * trusted local data — the model never writes a title or a URL.
	 */
	evidence: z
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

	/**
	 * The closest analogous thing already done, or — when no single project
	 * comes close — the patterns that carry across several of them.
	 */
	precedent: z.object({
		mode: z
			.enum(["single", "patterns"])
			.describe("'single' for one closest precedent, 'patterns' for transferable patterns."),
		headline: z
			.string()
			.describe("One sentence naming the precedent or the patterns. Empty string if none apply."),
		similar: z.array(z.string()).describe("What was similar. Zero to three short points."),
		transfers: z.array(z.string()).describe("What transfers to this brief. One to three points."),
		different: z.array(z.string()).describe("What was materially different. One to three points."),
	}),

	/**
	 * The credibility section. Weak points, missing evidence, requested skills
	 * with no demonstrated experience.
	 */
	gaps: z
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
		.describe("Two to five real gaps. An empty array is only valid for a flawless match."),

	/**
	 * Optional. Where he would plausibly add the most value. Empty string when
	 * the analysis does not genuinely support one.
	 */
	contribution: z
		.string()
		.describe(
			"Optional: one or two sentences on where he would contribute most. Empty string if the analysis does not support it.",
		),

	/** What the visitor should actually ask if a conversation happens. */
	questions: z
		.array(
			z.object({
				question: z.string().describe("A question the visitor could ask Aurélien."),
				why: z.string().describe("One short sentence on why this question is worth asking."),
			}),
		)
		.describe("Two to four questions arising from the brief and from the uncertainties above."),
})

export type FitReport = z.infer<typeof fitReportSchema>

/** The shape the browser actually sees while the object is still streaming. */
export type PartialFitReport = {
	[K in keyof FitReport]?: FitReport[K] extends Array<infer E>
		? Array<Partial<E> | undefined> | undefined
		: FitReport[K] extends object
			? Partial<FitReport[K]>
			: FitReport[K]
}
