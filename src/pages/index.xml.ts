import rss from "@astrojs/rss"
import type { APIContext } from "astro"
import { getCollection } from "astro:content"
import sanitizeHtml from "sanitize-html"
import MarkdownIt from "markdown-it"
const parser = new MarkdownIt()

export async function get(context: APIContext) {
	const blog = await getCollection("blog", ({ data }) => {
		return data.draft !== true
	})
	blog.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
	return rss({
		title: "Aurélien Dos Santos",
		description: "Contenu récent sur le blog d'Aurélien Dos Santos.",
		site: context.site + "",
		customData: `<language>fr-fr</language>`,
		items: blog.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.description,
			customData: `<language>fr-fr</language>`,
			// Compute RSS link from post `slug`
			// This example assumes all posts are rendered as `/blog/[slug]` routes
			link: `/${post.slug}/`,
			// Note: this will not process components or JSX expressions in MDX files.
			content: sanitizeHtml(parser.render(post.body)),
		})),
	})
}
