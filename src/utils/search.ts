import { getCollection, getEntries, type CollectionEntry, type CollectionKey } from "astro:content"
import getBlogPosts, { getDiary } from "$utils/getCollection"
import formatDate from "$utils/formatting/formatDate"
import type { GraphEntry } from "./graph"

type SearchEntry = GraphEntry & {
	slug: string
	title: string
	date?: string
	categories?: string[] // soon to be replaced by tags
	tags?: CollectionEntry<"tags">["slug"][]
	description?: string
}

const mapToSearchEntry = (opts: {
	entry: CollectionEntry<CollectionKey>
	slug: string
	parentSlug?: string
	categories?: string[]
	date?: Date
	graphLinks?: string[]
	optionalNode?: boolean
	title?: string
}): SearchEntry => {
	const data = "data" in opts.entry ? opts.entry.data : opts.entry
	opts.title ??= data.title
	opts.date ??= "date" in data ? data.date : undefined
	return {
		slug: opts.slug,
		title: opts.title.replaceAll("*", ""),
		date: opts.date ? formatDate(opts.date, true) : undefined,
		categories: opts.categories || [],
		description: "description" in data ? data.description : undefined,
		links: [...(opts.parentSlug ? [opts.parentSlug] : []), ...(opts.graphLinks || [])],
		optional: opts.optionalNode,
	}
}

const searchEntryLinks = (
	data: CollectionEntry<"blog" | "diary" | "pages" | "portfolio">["data"]
) => {
	return [
		...data.tags.map((t) => `tags/${t.slug}`),
		...data.games.map((g) => `games/${g}`),
		...data.places.map((p) => `places/${p.slug}`),
		...data.gear.map((g) => `gear/${g.slug}`),
		...data.muses.map((m) => `muses/${m.slug}`),
	]
}

export const getSearchEntries = async (): Promise<SearchEntry[]> => {
	const tags = await getCollection("tags")
	const possibleTags: CollectionEntry<"tags">["slug"][] = [
		"personal-projects",
		"photos",
		"tutorial",
		"mixtape",
	]
	const blogPosts = await getBlogPosts()
	return [
		{
			slug: "",
			title: "Accueil",
			links: [
				"blog",
				"portfolio",
				"website",
				"diary",
				"places",
				"games",
				"gear",
				"kitchen",
				"wiki",
			],
		},
		{ slug: "blog", title: "Blog" },
		{ slug: "portfolio", title: "Portfolio" },
		{ slug: "diary", title: "Journal" },
		{ slug: "gear", title: "Mes appareils" },
		{ slug: "places", title: "Lieux" },
		{ slug: "kitchen", title: "Cuisine" },
		{ slug: "games", title: "Jeux" },
		{ slug: "wiki", title: "Wiki" },
		{ slug: "tags", title: "Tags" },
		{ slug: "muses", title: "Muses" },
		...tags.map((tag) => ({
			slug: `tags/${tag.slug}`,
			title: tag.data.title,
			categories: ["Tag"],
			links: ["tags"],
		})),
		...(await getCollection("muses")).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: `muses/${entry.slug}`,
				parentSlug: "muses",
				categories: ["Muse"],
				graphLinks: ["muses"],
			})
		),
		...(await Promise.all(
			blogPosts.map(async (entry) => {
				const tags = (
					await getEntries(entry.data.tags.filter((tag) => possibleTags.includes(tag.slug)))
				).map((tag) => tag.data.title)
				return mapToSearchEntry({
					entry: entry,
					slug: `${entry.slug}`,
					parentSlug: "blog",
					categories: tags.length > 0 ? tags : ["Article"],
					graphLinks: searchEntryLinks(entry.data),
				})
			})
		)),
		...(await getCollection("portfolio")).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: `portfolio/${entry.slug}`,
				parentSlug: "portfolio",
				categories: ["Portfolio"],
				date: entry.data.date,
				graphLinks: searchEntryLinks(entry.data),
			})
		),
		...(await getCollection("pages", ({ data }) => !data.draft)).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: entry.slug,
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
				slug: `diary/${entry.slug}`,
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
					slug: `gear/${entry.slug}`,
					parentSlug: "gear",
					categories: ["Mon appareil"],
					date: entry.data.obtained,
				})
			),
		...(await getCollection("places")).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: `places/${entry.slug}`,
				parentSlug: "places",
				categories: ["Lieu"],
			})
		),
		...(await getCollection("recipes")).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: `kitchen/${entry.slug}`,
				parentSlug: "kitchen",
				categories: ["Recette"],
				graphLinks: entry.data.ingredients.map(
					(i) => "kitchen/" + (Array.isArray(i) ? i[0] : i).slug
				),
			})
		),
		...(await getCollection("ingredients")).map((entry) =>
			mapToSearchEntry({
				entry: entry,
				slug: `kitchen/${entry.slug}`,
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
	]
}
