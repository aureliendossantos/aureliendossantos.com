import rss from "@astrojs/rss"
import type { APIContext } from "astro"
import { getCollection } from "astro:content"
import sanitizeHtml from "sanitize-html"
import MarkdownIt from "markdown-it"
import getBlogPosts, { getDiary } from "$utils/getBlogPosts"
const parser = new MarkdownIt()

export async function GET(context: APIContext) {
	const blog = await getBlogPosts()
	const diary = (await getDiary()).filter((post) => post.data.date)
	return rss({
		stylesheet: "/rss/pretty-feed-v3.xsl",
		title: "Aurélien Dos Santos",
		description: "Contenu récent sur le site d'Aurélien Dos Santos.",
		site: context.site + "",
		customData: `<language>fr-fr</language>`,
		items: [
			...blog.map((post) => ({
				title: post.data.title,
				pubDate: post.data.date,
				description: post.data.description,
				customData: `<language>fr-fr</language>`,
				link: `/blog/${post.slug}/`,
				// Note: this will not process components or JSX expressions in MDX files.
				// content: sanitizeHtml(parser.render(post.body)),
			})),
			...diary.map((post) => ({
				title: post.data.title,
				pubDate: post.data.date as Date,
				description: "Entrée de journal",
				customData: `<language>fr-fr</language>`,
				link: `/diary/${post.finalSlug}/`,
				// Note: this will not process components or JSX expressions in MDX files.
				// content: sanitizeHtml(parser.render(post.body)),
			})),
		].sort((a, b) => (a.pubDate > b.pubDate ? -1 : 1)),
	})
}
