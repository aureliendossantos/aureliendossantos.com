import { getCacheOrFetch } from "$utils/cache"
import wiki, { type wikiSummary } from "wikipedia"

export interface WikiSummaryWithFetchDate extends wikiSummary {
	fetchDate: number
}

// Rewrite the previous function using the `getCacheOrFetch` function
export default async function getWikipediaPage(
	title: string,
	lang = "fr"
): Promise<wikiSummary | null> {
	return getCacheOrFetch(
		title,
		"wikipedia",
		async () => {
			// fetch wikipedia page
			const html = await fetch(
				`https://${lang}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&titles=${title}`,
				{
					headers: {
						"User-Agent": "Aurélien Dos Santos (aureliendsantos@gmail.com)",
					},
				}
			)
				.then((response) => response.json())
				.then((response) => {
					const pages = response.query.pages
					const pageId = Object.keys(pages)[0]
					return pages[pageId].extract
				})
			await wiki.setLang(lang)
			await wiki.setUserAgent("Aurélien Dos Santos (aureliendsantos@gmail.com)") // https://meta.wikimedia.org/wiki/User-Agent_policy
			const summary: WikiSummaryWithFetchDate = {
				...(await wiki.summary(title)),
				extract_html: html,
				fetchDate: Date.now(),
			}
			return summary
		},
		10
	)
}
