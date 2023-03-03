import { getCollection } from "astro:content"

// Get all articles that are blog posts (blog and tufte collections, but not the page collection)
export default async function getBlogPosts() {
	const blog = await getCollection("blog", ({ data }) => {
		return data.draft !== true
	})
	const tufte = await getCollection("tufte", ({ data }) => {
		return data.draft !== true
	})
	return [...blog, ...tufte].sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}
