import { getCollection, type CollectionEntry, type CollectionKey } from "astro:content"
import getBlogPosts, { getDiary, getWikiCache } from "$utils/getCollection"
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

const mapToSearchEntry = (
	entry: CollectionEntry<CollectionKey>,
	slug: string,
	parentSlug?: string,
	categories?: string[],
	date?: Date,
	graphLinks?: string[],
	optionalNode?: boolean,
	title?: string
): SearchEntry => {
	const data = "data" in entry ? entry.data : entry
	title ??= data.title
	date ??= "date" in data ? data.date : undefined
	return {
		slug: slug,
		title: title,
		date: date ? formatDate(date, true) : undefined,
		categories: categories,
		description: "description" in data ? data.description : undefined,
		links: [...(parentSlug ? [parentSlug] : []), ...(graphLinks || [])],
		optional: optionalNode,
	}
}

export const getSearchEntries = async (): Promise<SearchEntry[]> => {
	const tags = await getCollection("tags")
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
		...tags.map((tag) => ({
			slug: `tags/${tag.slug}`,
			title: tag.data.title,
			categories: ["Tag"],
			links: ["tags"],
		})),
		...(await Promise.all(
			blogPosts.map(async (entry) =>
				mapToSearchEntry(entry, `${entry.slug}`, "blog", undefined, undefined, [
					...entry.data.tags.map((t) => `tags/${t.slug}`),
					...entry.data.places.map((p) => `places/${p.slug.split("/")[1]}`),
					...entry.data.games.map((g) => `games/${g}`),
				])
			)
		)),
		...(await getCollection("portfolio")).map((entry) =>
			mapToSearchEntry(
				entry,
				`portfolio/${entry.slug}`,
				"portfolio",
				["Portfolio"],
				entry.data.release
			)
		),
		...(await getCollection("pages", ({ data }) => !data.draft)).map((entry) =>
			mapToSearchEntry(entry, entry.slug, undefined, ["Page"], undefined, [
				...(entry.data.parent || []),
				...entry.data.seeAlso,
			])
		),
		...(await getDiary()).map((entry) =>
			mapToSearchEntry(
				entry as CollectionEntry<"diary">,
				`diary/${entry.finalSlug}`,
				"diary",
				["Journal"],
				entry.data.date || new Date(entry.year, 12, 29),
				entry.data.places.map((p) => `places/${p.slug.split("/")[1]}`)
			)
		),
		...(await getCollection("gear"))
			.filter((gear) => gear.data.clickable)
			.map((entry) =>
				mapToSearchEntry(
					entry,
					`gear/${entry.slug.split("/")[1]}`,
					"gear",
					["Mon appareil"],
					entry.data.obtained
				)
			),
		...(await getCollection("places")).map((entry) =>
			mapToSearchEntry(entry, `places/${entry.slug.split("/")[1]}`, "places", ["Lieu"])
		),
		...(await getCollection("recipes")).map((entry) =>
			mapToSearchEntry(
				entry,
				`kitchen/${entry.slug}`,
				"kitchen",
				["Recette"],
				undefined,
				entry.data.ingredients.map((i) => "kitchen/" + (Array.isArray(i) ? i[0] : i).slug)
			)
		),
		...(await getCollection("ingredients")).map((entry) =>
			mapToSearchEntry(entry, `kitchen/${entry.slug}`, "kitchen", ["Ingrédient"])
		),
		...(await getCollection("games"))
			.filter((game) => game.data.slug)
			.map((game) =>
				mapToSearchEntry(
					game,
					`games/${game.data.slug}`,
					"games",
					["Jeu"],
					undefined,
					undefined,
					true // !game.data.review && game.data.blocks.length == 0
				)
			),
		// Notion results are cached, else this is queried for each page during build
		...(await getWikiCache()),
	]
}
