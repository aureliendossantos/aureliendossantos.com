import "dotenv/config"
import fs from "node:fs"
import { pathToFileURL } from "node:url"
import wiki, { type wikiSummary } from "wikipedia"

export interface WikiSummaryWithFetchDate extends wikiSummary {
	fetchDate: number
}

export default async function getWikipediaPage(title: string, lang = "fr"): Promise<wikiSummary> {
	const rootPath = pathToFileURL(process.cwd() + "/")
	const filePath = new URL(`node_modules/.my-cache/${title}.json`, rootPath)
	// Gets the current json, if it exists, and maybe use its data
	if (fs.existsSync(filePath)) {
		const oldPage = JSON.parse(
			(await fs.promises.readFile(filePath)).toString()
		) as WikiSummaryWithFetchDate
		// 864000000 ms = 10 days
		if (oldPage.fetchDate > Date.now() - 864000000) return oldPage
	}
	// fetch wikipedia page
	await wiki.setLang(lang)
	await wiki.setUserAgent("Aurélien Dos Santos (aureliendsantos@gmail.com)") // https://meta.wikimedia.org/wiki/User-Agent_policy
	const summary: WikiSummaryWithFetchDate = {
		...(await wiki.summary(title)),
		fetchDate: Date.now(),
	}
	// writing to file
	console.log("Fetched Wikipedia page: " + summary.title)
	fs.writeFileSync(filePath, JSON.stringify(summary, null, 2))
	return summary
}
