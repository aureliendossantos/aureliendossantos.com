import rss, { type RSSFeedItem } from "@astrojs/rss"
import type { APIContext } from "astro"
import sanitizeHtml from "sanitize-html"
import MarkdownIt from "markdown-it"
import getBlogPosts, { getDiary } from "$utils/getBlogPosts"
import { getImage } from "astro:assets"
const parser = new MarkdownIt()

export async function GET(context: APIContext) {
	const blog: RSSFeedItem[] = await Promise.all(
		(await getBlogPosts()).map(async (post) => {
			const link = `/${post.slug}/`
			const image = post.data.opengraph || post.data.image
			const optimizedImage =
				image && (await getImage({ src: image, width: Math.min(1920, image.width), format: "jpg" }))
			return {
				title: post.data.title,
				author: "Aurélien Dos Santos",
				pubDate: post.data.date,
				description: post.data.description,
				customData: `<language>fr-fr</language>`,
				link: link,
				// content: optimizedImage ? `<img src="${optimizedImage.src}" />` : undefined,
				// Note: this will not process components or JSX expressions in MDX files.
				content: sanitizeHtml(
					`<a href="${link}" target="_blank">${
						optimizedImage
							? `<p><img src="${optimizedImage.src}" alt="Image de couverture" /></p>`
							: ""
					}<p>Lire sur le site pour une meilleure expérience</p></a>` + parser.render(post.body),
					{
						allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
					}
				),
			}
		})
	)
	const diary: RSSFeedItem[] = (await getDiary())
		.filter((post) => post.data.date)
		.map((post) => {
			const link = `/diary/${post.finalSlug}/`
			return {
				title: post.data.title,
				author: "Aurélien Dos Santos",
				pubDate: post.data.date as Date,
				description: "Entrée de journal",
				customData: `<language>fr-fr</language>`,
				link: link,
				// Note: this will not process components or JSX expressions in MDX files.
				content: sanitizeHtml(
					`<p><a href="${link}" target="_blank">Lire sur le site pour une meilleure expérience</a></p>` +
						parser.render(post.body),
					{
						allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
					}
				),
			}
		})
	return rss({
		stylesheet: "/rss/pretty-feed-v3.xsl",
		title: "Aurélien Dos Santos",
		description: "Contenu récent sur le site d'Aurélien Dos Santos.",
		site: context.site + "",
		customData: `<language>fr-fr</language>`,
		items: [...blog, ...diary].sort((a, b) => (a.pubDate > b.pubDate ? -1 : 1)),
	})
}
