import { getCollection, type CollectionEntry } from "astro:content"
import { getPlace } from "./remoteData/googleMaps"
import { dateSort } from "./sort"
import getEntryOrThrow from "./content/getEntryOrThrow"

// Get all articles that are blog posts
export default async function getBlogPosts(drafts = true) {
	const blog = await getCollection("blog", ({ data }) => {
		return !data.draft || (import.meta.env.DEV && drafts)
	})
	return blog
		.sort((a, b) => dateSort(a.data.date, b.data.date))
		.map((a, i) => ({ ...a, index: blog.length - i }))
}

export const getDiaryData = (entry: CollectionEntry<"diary">) => ({
	year: Number(entry.filePath!.split("/")[4]),
	category: entry.filePath!.split("/")[3],
	...entry,
})

export async function getDiary(drafts = true) {
	return (
		await getCollection("diary", ({ data }) => !data.draft || (import.meta.env.DEV && drafts))
	)
		.map((entry) => getDiaryData(entry))
		.sort((a, b) => dateSort(a.data.date, b.data.date))
}

export async function getDiaryEntry(id: string) {
	const entry = await getEntryOrThrow("diary", id)
	return getDiaryData(entry)
}

async function getPlaceEntryData(entry: CollectionEntry<"places">) {
	const articles = await getBlogPosts()
	const diaryEntries = await getDiary()
	return {
		category: entry.filePath!.split("/")[3],
		maps: await getPlace(entry.data.id),
		articles: articles.filter((a) => a.data.places.includes(entry)).length,
		diaryEntries: diaryEntries.filter((a) => a.data.places.includes(entry)).length,
		...entry,
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

export async function getPlaceEntry(id: string) {
	const entry = await getEntryOrThrow("places", id)
	return getPlaceEntryData(entry)
}

export const getContentEntries = async () => {
	const articles = await getBlogPosts()
	const portfolio = await getCollection("portfolio")
	const pages = await getCollection("pages")
	const diary = await getDiary()
	const wiki = await getCollection("wiki")
	return [
		...articles,
		...portfolio.map((entry) => ({ ...entry, slug: `portfolio/${entry.id}` })),
		...pages,
		...diary.map((entry) => ({ ...entry, slug: `diary/${entry.id}` })),
		...wiki.map((entry) => ({ ...entry.data, data: entry.data })),
	]
}

export const getAnyEntry = async (ids: string[]) => {
	return (await getContentEntries()).filter((e) => ids.includes(e.id))
}
