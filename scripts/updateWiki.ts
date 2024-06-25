import fs from "node:fs"
import { pathToFileURL } from "node:url"
import getChildren from "$utils/notion/getChildren"
import { fetchWikiPages } from "$utils/notion/wiki"

/**
 * Fetches pages in my Notion database according to custom filters then
 * saves the results as data entries in the wiki collection.
 * @returns The number of pages in the collection.
 */
export default async function updateWiki() {
	const rootPath = pathToFileURL(process.cwd() + "/")
	const pages = await fetchWikiPages()
	await Promise.all(
		pages.map(async (page) => {
			page.blocks = await getChildren(page.id)
		})
	)
	// Create content collection folder if it doesn't exist or empty its contents
	const wikiDir = new URL(`src/content/wiki`, rootPath)
	if (fs.existsSync(wikiDir)) fs.rmSync(wikiDir, { recursive: true })
	fs.mkdirSync(wikiDir)
	// Write the data to a JSON file for each game
	pages.forEach((page) => {
		const entryPath = new URL(`src/content/wiki/${page.slug}.json`, rootPath)
		fs.writeFileSync(entryPath, JSON.stringify(page, null, 2))
	})
	return pages.length
}
