import { getCollection, getEntries, type CollectionEntry, type CollectionKey } from "astro:content"
import getBlogPosts, { getDiary } from "$utils/getCollection"
import formatDate from "$utils/formatting/formatDate"
import type { GraphEntry } from "./graph"
import { title } from "./museum"
import { checkLocale, useTranslations, type SupportedLocale } from "./i18n"

export type SearchEntry = GraphEntry & {
	slug: string
	title: string
	date?: string
	categories?: string[] // soon to be replaced by tags
	tags?: string[]
	description?: string
	links?: string[]
	optional?: boolean
}

function useMapToSearchEntry(locale: SupportedLocale) {
	return function mapToSearchEntry(opts: {
		entry: CollectionEntry<CollectionKey>
		slug: string
		parentSlug?: string
		categories?: string[]
		date?: Date
		description?: string
		graphLinks?: string[]
		optionalNode?: boolean
		title?: string
	}): SearchEntry {
		const data = "data" in opts.entry ? opts.entry.data : opts.entry
		opts.title ??= title(data.title, locale) || undefined
		// TODO: handle custom dates
		opts.date ??= "date" in data && data.date instanceof Date ? data.date : undefined
		return {
			slug: opts.slug,
			title: opts.title?.replaceAll("*", "") || "Sans titre",
			date: opts.date ? formatDate(opts.date, true) : undefined,
			categories: opts.categories || [],
			description: "description" in data ? data.description : opts.description,
			// beware, parentSlug can be "" which is falsy
			links: [
				...(opts.parentSlug != undefined ? [opts.parentSlug] : []),
				...(opts.graphLinks || []),
			],
			optional: opts.optionalNode,
		}
	}
}

const searchEntryLinks = (
	data: CollectionEntry<"blog" | "diary" | "pages" | "portfolio">["data"]
) => {
	return [
		...data.tags.map((t) => `tags/${t.id}`),
		...data.games.map((g) => `games/${g}`),
		...data.places.map((p) => `places/${p.id}`),
		...data.gear.map((g) => `gear/${g.id}`),
		...data.muses.map((m) => `muses/${m.id}`),
	]
}

export const getSearchEntries = async (lang?: string): Promise<SearchEntry[]> => {
	const locale = checkLocale(lang)
	const t = useTranslations(locale)
	const mapToSearchEntry = useMapToSearchEntry(locale)
	const tags = await getCollection("tags")
	const possibleTags = ["personal-projects", "photos", "tutorial", "mixtape"]
	const blogPosts = await getBlogPosts()
	return [
		{ slug: "", title: "Blog" },
		{ slug: "portfolio", title: "Portfolio", links: [""] },
		{ slug: "diary", title: "Journal" },
		{ slug: "gear", title: "Mes appareils" },
		{ slug: "places", title: "Lieux", links: ["diary"] },
		{ slug: "kitchen", title: "Cuisine" },
		{ slug: "games", title: "Jeux" },
		{ slug: "tags", title: "Tags", links: [""] },
		{ slug: "museum", title: "Musée" },
		{ slug: "museum/all", title: "Collection", categories: ["Musée"], links: ["museum"] },
		{ slug: "museum/collections", title: "Sélections", categories: ["Musée"], links: ["museum"] },
		{ slug: "muses", title: "Muses" },
		...tags.map((tag) => ({
			slug: `tags/${tag.id}`,
			title: tag.data.title,
			categories: ["Tag"],
			links: ["tags"],
		})),
		...(await getCollection("muses")).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: `muses/${entry.id}`,
				parentSlug: "muses",
				categories: ["Muse"],
				graphLinks: ["muses"],
			})
		),
		...(await Promise.all(
			blogPosts.map(async (entry) => {
				const tags = (
					await getEntries(entry.data.tags.filter((tag) => possibleTags.includes(tag.id)))
				).map((tag) => tag.data.title)
				return mapToSearchEntry({
					entry: entry,
					slug: `${entry.id}`,
					parentSlug: "",
					categories: tags.length > 0 ? tags : ["Article"],
					graphLinks: searchEntryLinks(entry.data),
				})
			})
		)),
		...(await getCollection("portfolio")).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: `portfolio`,
				parentSlug: "portfolio",
				categories: ["Portfolio"],
				date: Array.isArray(entry.data.date)
					? new Date(entry.data.date[1].y!, 0)
					: new Date(entry.data.date.y!, 0),
				graphLinks: searchEntryLinks(entry.data),
			})
		),
		...(await getCollection("pages", ({ data }) => !data.draft)).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: entry.id,
				categories: ["Page"],
				graphLinks: [
					...(entry.data.parent || []),
					...entry.data.seeAlso,
					...searchEntryLinks(entry.data),
				],
			})
		),
		...(await getDiary()).map((entry) =>
			mapToSearchEntry({
				entry: entry as CollectionEntry<"diary">,
				slug: `diary/${entry.id}`,
				parentSlug: "diary",
				categories: ["Journal"],
				date: entry.data.date || new Date(entry.year, 12, 29),
				graphLinks: searchEntryLinks(entry.data),
			})
		),
		...(await getCollection("gear"))
			.filter((gear) => gear.data.clickable)
			.map((entry) =>
				mapToSearchEntry({
					entry: entry,
					slug: `gear/${entry.id}`,
					parentSlug: "gear",
					categories: ["Mon appareil"],
					date: entry.data.obtained,
				})
			),
		...(await getCollection("places")).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: `places/${entry.id}`,
				parentSlug: "places",
				categories: ["Lieu"],
			})
		),
		...(await getCollection("recipes")).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: `kitchen/${entry.id}`,
				parentSlug: "kitchen",
				categories: ["Recette"],
				graphLinks: entry.data.ingredients.map(
					(i) => "kitchen/" + (Array.isArray(i) ? i[0].id : i.id)
				),
			})
		),
		...(await getCollection("ingredients")).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: `kitchen/${entry.id}`,
				parentSlug: "kitchen",
				categories: ["Ingrédient"],
			})
		),
		...(await getCollection("games"))
			.filter((game) => game.data.slug)
			.map((game) =>
				mapToSearchEntry({
					entry: game,
					slug: `games/${game.data.slug}`,
					parentSlug: "games",
					categories: ["Jeu"],
					optionalNode: true, // TODO: tester !game.data.review && game.data.blocks.length == 0
				})
			),
		...(await getCollection("wiki")).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: entry.data.slug,
				categories: ["Jardin"],
				graphLinks: [...entry.data.tags.map((t) => `tags/${t}`), ...entry.data.related],
			})
		),
		...(await getCollection("pieces")).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: `museum/${entry.id}`,
				parentSlug: "museum/all",
				// The description (hidden but indexed by search) includes title and author in all available languages
				description: `${
					typeof entry.data.title == "object"
						? Object.entries(entry.data.title)
								.filter(([k, _]) => k != "original")
								.map(([_, v]) => v)
								.join("/")
						: ""
				}${
					entry.data.author
						? typeof entry.data.author == "object"
							? Object.entries(entry.data.author)
									.filter(([k, v]) => k != "original")
									.map(([k, v]) => v)
									.join("/")
							: entry.data.author
						: ""
				}`,
				categories: [t(entry.data.type), t("m-museum")],
				graphLinks: entry.data.collections.map((c) => `museum/${c}`),
			})
		),
		...(await getCollection("collections")).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: `museum/${entry.id}`,
				parentSlug: "museum/collections",
				categories: ["Sélection", t("m-museum")],
			})
		),
	]
}
