import { getCollection, type CollectionEntry } from "astro:content"
import { formatCustomPeriod } from "$utils/museum"
import type { SupportedLocale } from "$utils/i18n"
import { projectNotes } from "./profile"

/**
 * Adapter over the `portfolio` content collection.
 *
 * The collection stores each project twice — `<slug>/index.mdx` in French and
 * `<slug>/en.mdx` in English — and every fact lives in frontmatter. This module
 * turns that into two views:
 *
 * - {@link getEvidenceIndex}: the trusted metadata the browser is allowed to
 *   render. The model streams a `projectId`; the client resolves it here. A
 *   title or a URL therefore never originates from the model.
 * - {@link getCandidateProjects}: the fuller factual record handed to the model
 *   as grounding, server-side only.
 *
 * The stable project ID is the folder slug (`koimori`, `qrpg`, …), which is
 * also the French entry's collection ID.
 */

/** Roles are authored as "Game design [g]" — the marker drives card colours. */
const stripRoleMarker = (role: string) => role.replace(/\[.\]/g, "").trim()

/** `appearIn` values, mapped to something a model can read without a legend. */
const categoryLabels: Record<string, string> = {
	pedagogique: "instructional design / e-learning",
	web: "web development",
	jeux: "game development",
}

/** Trusted project metadata. Safe to serialise into the page for the island. */
export interface EvidenceItem {
	id: string
	title: string
	lede: string
	client?: string
	roles: string[]
	tools: string[]
	dateLabel: string
	categories: string[]
	/** Where the visitor can see the project on this site. */
	href: string
	links: { url: string; title: string }[]
}

type PortfolioEntry = CollectionEntry<"portfolio">

/** Splits the collection into `{ slug: { fr, en } }`. */
async function loadPortfolioBySlug() {
	const entries = await getCollection("portfolio")
	const bySlug = new Map<string, { fr?: PortfolioEntry; en?: PortfolioEntry }>()
	for (const entry of entries) {
		const isEnglish = entry.id.endsWith("/en")
		const slug = isEnglish ? entry.id.slice(0, -"/en".length) : entry.id
		const existing = bySlug.get(slug) ?? {}
		bySlug.set(slug, { ...existing, [isEnglish ? "en" : "fr"]: entry })
	}
	return bySlug
}

/** Most recent first, so the freshest work leads the dossier. */
function endYear(entry: PortfolioEntry) {
	const date = entry.data.date
	const last = Array.isArray(date) ? date[1] : date
	return last?.y ?? 0
}

/**
 * The trusted metadata for every portfolio project, in the given locale.
 *
 * Built at page-build time and serialised into the island's props: it is public
 * information that already appears on `/portfolio`.
 */
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
		items.push({
			id: slug,
			title: data.title,
			lede: data.lede ?? data.description ?? "",
			client: data.client,
			roles: data.roles.map(stripRoleMarker),
			tools: [...data.tools, ...data.moreTools],
			dateLabel: formatCustomPeriod(data.date, locale, true, false, false),
			categories: data.appearIn.map((key) => categoryLabels[key] ?? key),
			href: `${portfolioPath}#${slug}`,
			links: data.links,
		})
	}
	return items.sort((a, b) => b.id.localeCompare(a.id))
}

/** The fuller record used to ground the model. Never leaves the server. */
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
 * sending all of it beats any retrieval machinery for V1.
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
	return projects.sort((a, b) => {
		const byRecency =
			endYear(bySlug.get(b.id)!.fr ?? bySlug.get(b.id)!.en!) -
			endYear(bySlug.get(a.id)!.fr ?? bySlug.get(a.id)!.en!)
		return byRecency !== 0 ? byRecency : a.id.localeCompare(b.id)
	})
}
