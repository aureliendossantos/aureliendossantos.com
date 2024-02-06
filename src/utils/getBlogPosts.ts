import { getCollection, getEntryBySlug, type CollectionEntry } from "astro:content"

// Get all articles that are blog posts
export default async function getBlogPosts(drafts = true) {
	const blog = await getCollection("blog", ({ data }) => {
		return data.draft !== true || (import.meta.env.DEV && drafts)
	})
	return blog.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

function getDiaryData(entry: CollectionEntry<"diary">) {
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
		.sort((a, b) =>
			a.data.date ? (b.data.date ? b.data.date.getTime() - a.data.date.getTime() : -1) : 1
		)
}

export async function getDiaryEntry(slug: string) {
	const entry = await getEntryBySlug("diary", slug)
	if (!entry) throw new Error(`No diary entry found for slug: ${slug}`)
	return getDiaryData(entry)
}
