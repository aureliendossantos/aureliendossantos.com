import { getCacheOrFetch } from "$utils/cache"

// https://meta.wikimedia.org/wiki/User-Agent_policy
const userAgent = "Aurélien Dos Santos (aureliendsantos@gmail.com)"

interface WikiImage {
	source: string
	width: number
	height: number
}

/**
 * The part of the REST summary response this site uses.
 * @see https://{lang}.wikipedia.org/api/rest_v1/page/summary/{title}
 */
export interface WikiSummary {
	title: string
	description?: string
	extract: string
	extract_html: string
	thumbnail?: WikiImage
	originalimage?: WikiImage
	content_urls: {
		desktop: { page: string }
		mobile: { page: string }
	}
}

export interface WikiSummaryWithFetchDate extends WikiSummary {
	fetchDate: number
}

/**
 * Fetches an article summary, which already includes `extract_html` and the images,
 * so a single request covers everything the popup needs.
 */
export default async function getWikipediaPage(
	title: string,
	lang = "fr"
): Promise<WikiSummary | null> {
	return getCacheOrFetch(
		title,
		"wikipedia",
		async () => {
			const response = await fetch(
				`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
				{ headers: { "User-Agent": userAgent } }
			)
			if (!response.ok) throw new Error(`Wikipedia answered ${response.status} for "${title}"`)
			const summary: WikiSummaryWithFetchDate = {
				...((await response.json()) as WikiSummary),
				fetchDate: Date.now(),
			}
			return summary
		},
		10
	)
}
