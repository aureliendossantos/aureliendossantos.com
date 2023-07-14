import { getCollection } from "astro:content"

// Get all articles that are blog posts
export default async function getBlogPosts() {
	const blog = await getCollection("blog", ({ data }) => {
		return data.draft !== true || import.meta.env.DEV
	})
	return blog.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export async function getDiary() {
	return (await getCollection("diary", ({ data }) => !data.draft))
		.map(({ slug, ...rest }) => ({
			slug: slug,
			finalSlug: slug.split("/")[2],
			year: Number(slug.split("/")[1]),
			category: slug.split("/")[0],
			...rest,
		}))
		.sort((a, b) =>
			b.data.date && a.data.date ? b.data.date.getTime() - a.data.date.getTime() : 0
		)
}
