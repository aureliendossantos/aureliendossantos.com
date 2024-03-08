import { getCollection, getEntryBySlug, type CollectionEntry } from "astro:content"
import { getPlace } from "./remoteData/googleMaps"
import { dateSort } from "./sort"
import getDatabase from "./notion/getDatabase"
import type { CategoriesEntry, PagesEntry } from "./notion/wiki"
import slugify from "slugify"

// Get all articles that are blog posts
export default async function getBlogPosts(drafts = true) {
	const blog = await getCollection("blog", ({ data }) => {
		return data.draft !== true || (import.meta.env.DEV && drafts)
	})
	return blog.sort((a, b) => dateSort(a.data.date, b.data.date))
}

export function getDiaryData(entry: CollectionEntry<"diary">) {
	const { slug, ...rest } = entry
	return {
		slug: slug,
		finalSlug: slug.split("/")[2],
		year: Number(slug.split("/")[1]),
		category: slug.split("/")[0],
		...rest,
	}
}

export async function getDiary(drafts = true) {
	return (
		await getCollection(
			"diary",
			({ data }) => data.draft !== true || (import.meta.env.DEV && drafts)
		)
	)
		.map((entry) => getDiaryData(entry))
		.sort((a, b) => dateSort(a.data.date, b.data.date))
}

export async function getDiaryEntry(slug: string) {
	const entry = await getEntryBySlug("diary", slug)
	if (!entry) throw new Error(`No diary entry found for slug: ${slug}`)
	return getDiaryData(entry)
}

async function getPlaceEntryData(entry: CollectionEntry<"places">) {
	const { slug, ...rest } = entry
	const articles = await getBlogPosts()
	const diaryEntries = await getDiary()
	return {
		slug: entry.slug.split("/")[1],
		category: entry.slug.split("/")[0],
		maps: await getPlace(entry.data.id),
		articles: articles.filter((a) => a.data.places.includes(entry.slug)).length,
		diaryEntries: diaryEntries.filter((a) => a.data.places.includes(entry.slug)).length,
		...rest,
	}
}

export async function getPlaceCollection(hidden = false) {
	const reviewsOrder = ["loved", "liked", "okay", null]
	const collection = await Promise.all(
		(await getCollection("places", ({ data }) => !data.hide || hidden)).map(
			async (entry) => await getPlaceEntryData(entry)
		)
	)
	return collection
		.sort(
			(a, b) =>
				reviewsOrder.indexOf(a.data.review || null) - reviewsOrder.indexOf(b.data.review || null)
		)
		.sort((a, b) => a.data.status.localeCompare(b.data.status))
		.sort((a, b) => a.maps.icon?.localeCompare(b.maps.icon || "") || 0)
}

export async function getPlaceCollectionEntry(slug: string) {
	const entry = await getEntryBySlug("places", slug)
	if (!entry) throw new Error(`No place collection entry found for slug: ${slug}`)
	return getPlaceEntryData(entry)
}

export const getWikiCategories = async () => {
	return ((await getDatabase(import.meta.env.NOTION_WIKI_CATEGORIES_DB)) as CategoriesEntry[]).map(
		(page) => ({
			id: page.id,
			title: page.properties.Nom.title[0].plain_text,
			description: page.properties.Description.rich_text[0]
				? page.properties.Description.rich_text[0].plain_text
				: null,
		})
	)
}

export const getWikiPages = async () => {
	const categories = await getWikiCategories()
	return ((await getDatabase(import.meta.env.NOTION_WIKI_PAGES_DB)) as PagesEntry[])
		.map((page) => {
			const title = page.properties.Nom.title[0].plain_text
			const categoryId = page.properties.Catégorie.relation[0].id
			return {
				id: page.id,
				slug: slugify(title, { remove: /[*+~.()'"!:@«»]/g, lower: true }),
				title: title,
				description: page.properties.Description.rich_text[0]
					? page.properties.Description.rich_text[0].plain_text
					: "",
				categoryId: categoryId,
				category: categories.find((c) => c.id == categoryId)?.title,
				editedTime: new Date(page.last_edited_time),
			}
		})
		.sort((a, b) => dateSort(a.editedTime, b.editedTime))
}
