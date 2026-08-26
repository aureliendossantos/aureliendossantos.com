import { getCollection, type CollectionEntry } from "astro:content"
import { formatCustomPeriod } from "$utils/museum"
import { projectNotes } from "./profile"

/**
 * The portfolio collection as grounding evidence for the model.
 *
 * Server-side only, and deliberately free of images, videos and `astro:assets`:
 * this module is bundled into the `/api/fit` function, where pulling media in
 * would bloat the deployment for no benefit. The browser-facing view, which
 * does need media, lives in `evidence.ts`.
 *
 * The collection stores each project twice — `<slug>/index.mdx` in French and
 * `<slug>/en.mdx` in English — and every fact lives in frontmatter. The stable
 * project ID is the folder slug (`koimori`, `qrpg`, …), which is also the
 * French entry's collection ID.
 */

/** Roles are authored as "Game design [g]" — the marker drives card colours. */
export const stripRoleMarker = (role: string) => role.replace(/\[.\]/g, "").trim()

/** `appearIn` values, mapped to something a model can read without a legend. */
export const categoryLabels: Record<string, string> = {
	pedagogique: "instructional design / e-learning",
	web: "web development",
	jeux: "game development",
}

export type PortfolioEntry = CollectionEntry<"portfolio">
export type PortfolioVersions = { fr?: PortfolioEntry; en?: PortfolioEntry }

/** Splits the collection into `{ slug: { fr, en } }`, most recent first. */
export async function loadPortfolioBySlug() {
	const entries = await getCollection("portfolio")
	const bySlug = new Map<string, PortfolioVersions>()
	for (const entry of entries) {
		const isEnglish = entry.id.endsWith("/en")
		const slug = isEnglish ? entry.id.slice(0, -"/en".length) : entry.id
		const existing = bySlug.get(slug) ?? {}
		bySlug.set(slug, { ...existing, [isEnglish ? "en" : "fr"]: entry })
	}

	return new Map(
		[...bySlug].sort(([slugA, a], [slugB, b]) => {
			const byRecency = endYear(b.fr ?? b.en) - endYear(a.fr ?? a.en)
			return byRecency !== 0 ? byRecency : slugA.localeCompare(slugB)
		}),
	)
}

/** Freshest work leads, so the dossier and the page agree on ordering. */
function endYear(entry: PortfolioEntry | undefined) {
	const date = entry?.data.date
	const last = Array.isArray(date) ? date[1] : date
	return last?.y ?? 0
}

/** The factual record handed to the model. Never leaves the server. */
export interface CandidateProject {
	id: string
	title: string
	frenchTitle: string
	period: string
	client?: string
	categories: string[]
	roles: string[]
	tools: string[]
	description: string
	lede: string
	/** `overview` is authored as [heading, ...points] per section. */
	sections: { heading: string; points: string[] }[]
	links: { url: string; title: string }[]
	/** Extra facts from `profile.ts`, keyed by project ID. */
	notes: string[]
}

/**
 * Every portfolio project as grounding evidence, English text preferred.
 *
 * The whole set is small enough (a dozen projects, frontmatter only) that
 * sending all of it beats any retrieval machinery.
 */
export async function getCandidateProjects(): Promise<CandidateProject[]> {
	const bySlug = await loadPortfolioBySlug()

	const projects: CandidateProject[] = []
	for (const [slug, versions] of bySlug) {
		const entry = versions.en ?? versions.fr
		if (!entry) continue
		const data = entry.data
		projects.push({
			id: slug,
			title: data.title,
			frenchTitle: versions.fr?.data.title ?? data.title,
			period: formatCustomPeriod(data.date, "en", true, false, false),
			client: data.client,
			categories: data.appearIn.map((key) => categoryLabels[key] ?? key),
			roles: data.roles.map(stripRoleMarker),
			tools: [...data.tools, ...data.moreTools],
			description: data.description ?? "",
			lede: data.lede ?? "",
			sections: (data.overview ?? []).map(([heading, ...points]) => ({ heading, points })),
			links: data.links,
			notes: projectNotes[slug] ?? [],
		})
	}
	return projects
}
