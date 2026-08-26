import { getImage } from "astro:assets"
import MarkdownIt from "markdown-it"
import sanitizeHtml from "sanitize-html"
import { formatCustomPeriod } from "$utils/museum"
import type { SupportedLocale } from "$utils/i18n"
import {
	categoryLabels,
	loadPortfolioBySlug,
	stripRoleMarker,
	type PortfolioEntry,
} from "./dossier"

/**
 * The portfolio collection as the browser is allowed to see it.
 *
 * Built once at page-build time and serialised into the island's props. The
 * model streams a `projectId`; the island resolves it here, so a title, a date,
 * an image or a URL never originates from the model.
 *
 * Everything is public information that already appears on `/portfolio` — this
 * module just reshapes it: a small card view for the report, and the full entry
 * for the modal behind it.
 *
 * Media resolution lives here rather than in `dossier.ts` so that images and
 * videos are never traced into the `/api/fit` serverless function.
 */

/** One image or video from an entry, already sized for where it is shown. */
export type Media =
	| { type: "image"; src: string; width: number; height: number; objectPosition: string }
	| { type: "video"; src: string; fallback?: string; objectPosition: string }

/** A heading plus its points, from the entry's `overview` frontmatter. */
export interface ProjectSection {
	heading: string
	/** Points are authored with inline Markdown; rendered and sanitised here. */
	points: string[]
}

/** Trusted project metadata. Safe to serialise into the page for the island. */
export interface EvidenceItem {
	id: string
	title: string
	/** Shown on the card. The rest of the entry lives behind the modal. */
	thumbnail?: Media
	client?: string
	roles: string[]
	tools: string[]
	dateLabel: string
	categories: string[]
	/** Where the visitor can see the project on the portfolio page. */
	href: string
	/** Full entry, used by the modal. */
	detail: {
		lede: string
		description: string
		media: Media[]
		sections: ProjectSection[]
		links: { url: string; title: string }[]
	}
}

/**
 * Portfolio videos, keyed by `<slug>/<file>`.
 *
 * Frontmatter references them by bare filename (`qrpg.webm`), and Vite renames
 * them on build, so they have to be matched through the glob's own keys. The
 * `/portfolio` page searches the emitted URLs instead, which can match the
 * wrong folder; keying on the source path cannot.
 */
const videoFiles = Object.fromEntries(
	Object.entries(
		import.meta.glob<{ default: string }>("/src/content/portfolio/*/*.{webm,mp4}", {
			eager: true,
		}),
	).map(([path, module]) => {
		const [slug, file] = path.split("/").slice(-2)
		return [`${slug}/${file}`, module.default]
	}),
)

const resolveVideo = (slug: string, file: string | undefined) =>
	file ? videoFiles[`${slug}/${file.replace(/^\.?\//, "")}`] : undefined

/** Frontmatter anchors, as a CSS `object-position`. Defaults to centred. */
const objectPosition = (item: { anchorTop?: number; anchorLeft?: number }) =>
	`${item.anchorLeft ?? 50}% ${item.anchorTop ?? 50}%`

/**
 * Inline Markdown from the content collection, rendered at build time.
 *
 * The points use `**emphasis**`, which the portfolio page renders the same way.
 * This is trusted local content, but it is sanitised anyway so that a stray tag
 * in a future entry can never turn into markup in the report.
 */
const markdown = new MarkdownIt()
const renderPoint = (point: string) =>
	sanitizeHtml(markdown.renderInline(point), {
		allowedTags: ["strong", "em", "code", "a", "br"],
		allowedAttributes: { a: ["href", "title"] },
	})

type CarouselItem = NonNullable<PortfolioEntry["data"]["carousel"]>[number]

/** Turns one frontmatter carousel entry into a sized, renderable media item. */
async function toMedia(
	slug: string,
	item: CarouselItem,
	width: number,
): Promise<Media | undefined> {
	if ("file" in item) {
		const optimised = await getImage({ src: item.file, width, format: "webp" })
		return {
			type: "image",
			src: optimised.src,
			width: optimised.attributes.width ?? width,
			height: optimised.attributes.height ?? width,
			objectPosition: objectPosition(item),
		}
	}
	const src = resolveVideo(slug, item.hq)
	if (!src) return undefined
	return {
		type: "video",
		src,
		fallback: resolveVideo(slug, item.compatible),
		objectPosition: objectPosition(item),
	}
}

/**
 * The card thumbnail: the entry's cover image when it has one, otherwise the
 * first thing in its carousel. Two entries have no `image` in frontmatter, so
 * the fallback is not theoretical.
 */
async function toThumbnail(slug: string, entry: PortfolioEntry): Promise<Media | undefined> {
	const { image, carousel } = entry.data
	if (image) return toMedia(slug, image, 260)
	const first = carousel?.[0]
	return first ? toMedia(slug, first, 260) : undefined
}

/** The trusted metadata for every portfolio project, in the given locale. */
export async function getEvidenceIndex(locale: SupportedLocale): Promise<EvidenceItem[]> {
	const bySlug = await loadPortfolioBySlug()
	const portfolioPath = locale === "en" ? "/en/portfolio" : "/portfolio"

	const items: EvidenceItem[] = []
	for (const [slug, versions] of bySlug) {
		// The French entry is the canonical one; English is a translation that
		// may not exist yet for a newly added project.
		const entry = (locale === "en" ? versions.en : versions.fr) ?? versions.fr ?? versions.en
		if (!entry) continue
		const data = entry.data

		const media = (
			await Promise.all((data.carousel ?? []).map((item) => toMedia(slug, item, 900)))
		).filter((item): item is Media => item !== undefined)

		items.push({
			id: slug,
			title: data.title,
			thumbnail: await toThumbnail(slug, entry),
			client: data.client,
			roles: data.roles.map(stripRoleMarker),
			tools: [...data.tools, ...data.moreTools],
			dateLabel: formatCustomPeriod(data.date, locale, true, false, false),
			categories: data.appearIn.map((key) => categoryLabels[key] ?? key),
			href: `${portfolioPath}#${slug}`,
			detail: {
				lede: data.lede ?? "",
				description: data.description ?? "",
				media,
				sections: (data.overview ?? []).map(([heading, ...points]) => ({
					heading,
					points: points.map(renderPoint),
				})),
				links: data.links,
			},
		})
	}
	return items
}
