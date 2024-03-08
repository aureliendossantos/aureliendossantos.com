import { getCollection, type CollectionEntry, type CollectionKey } from "astro:content"
import getBlogPosts, { getDiary, getWikiPages } from "$utils/getCollection"
import formatDate from "$utils/formatting/formatDate"
import { getCacheOrFetch } from "./cache"

interface SearchEntry {
	slug: string
	title: string
	date?: string
	categories?: string[]
	description?: string
}

const mapToSearchEntry = (
	entry: CollectionEntry<CollectionKey>,
	slug: string,
	categories?: string[],
	date?: Date,
	title?: string
): SearchEntry => {
	const data = "data" in entry ? entry.data : entry
	title ??= data.title
	date ??= "date" in data ? data.date : undefined
	categories ??= "categories" in data ? data.categories : undefined
	return {
		slug: slug,
		title: title,
		date: date ? formatDate(date, true) : undefined,
		categories: categories,
		description: "description" in data ? data.description : undefined,
	}
}

export const getSearchEntries = async (): Promise<SearchEntry[]> => [
	{ slug: "", title: "Blog" },
	{ slug: "portfolio", title: "Portfolio" },
	{ slug: "diary", title: "Journal" },
	{ slug: "gear", title: "Mes appareils" },
	{ slug: "places", title: "Lieux" },
	{ slug: "kitchen", title: "Cuisine" },
	{ slug: "games", title: "Jeux" },
	...(await getBlogPosts()).map((entry) => mapToSearchEntry(entry, `blog/${entry.slug}`)),
	...(await getCollection("portfolio")).map((entry) =>
		mapToSearchEntry(entry, `portfolio/${entry.slug}`, ["Portfolio"], entry.data.release)
	),
	...(await getCollection("pages", ({ data }) => !data.draft)).map((entry) =>
		mapToSearchEntry(entry, entry.slug, ["Page"])
	),
	...(await getDiary()).map((entry) =>
		mapToSearchEntry(
			entry as CollectionEntry<"diary">,
			`diary/${entry.finalSlug}`,
			["Journal"],
			entry.data.date || new Date(entry.year, 12, 29)
		)
	),
	...(await getCollection("gear"))
		.filter((gear) => gear.data.clickable)
		.map((entry) =>
			mapToSearchEntry(
				entry,
				`gear/${entry.slug.split("/")[1]}`,
				["Mon appareil"],
				entry.data.obtained
			)
		),
	...(await getCollection("places")).map((entry) =>
		mapToSearchEntry(entry, `places/${entry.slug.split("/")[1]}`, ["Lieu"])
	),
	...(await getCollection("recipes")).map((entry) =>
		mapToSearchEntry(entry, `kitchen/${entry.slug}`, ["Recette"])
	),
	...(await getCollection("ingredients")).map((entry) =>
		mapToSearchEntry(entry, `kitchen/${entry.slug}`, ["Ingrédient"])
	),
	...(await getCollection("games"))
		.filter((game) => game.data.slug)
		.map((game) => mapToSearchEntry(game, `games/${game.data.slug}`, ["Jeu"], undefined)),
	// Notion results are cached, else this is queried for each page during build
	...(
		await getCacheOrFetch(
			"search-results",
			"notion",
			async () => ({
				results: (await getWikiPages()).map((page) => {
					console.log("doing something")
					return {
						slug: `wiki/${page.slug}`,
						title: page.title,
						categories: [`Wiki · ${page.category}`],
					}
				}),
			}),
			1
		)
	).results,
]
