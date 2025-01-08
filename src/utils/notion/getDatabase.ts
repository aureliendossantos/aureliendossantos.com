import "dotenv/config"
import { Client } from "@notionhq/client"
import type { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints"
import type { Logger } from "$utils/remoteData/loaders"

/**
 * Fetches pages of a Notion database. Does not fetch the children of each page.
 * @param id Database ID.
 * @param opts - `firstResults`: if true, the results will be sorted by last edited time in descending order. That way, you can quickly get the most recent results of a database, without querying all the pages.
 * - `numberOfItems`: sets the page_size (default is 100, max is 100).
 * @param logger
 * @returns
 */
export default async function getDatabase(
	id: string,
	opts?: {
		filter?: QueryDatabaseParameters["filter"]
		firstResults?: boolean
		numberOfItems?: number
	},
	logger: Logger = console.log
) {
	const notion = new Client({
		auth: process.env.NOTION_SECRET,
	})
	let results = []
	let data = await notion.databases.query({
		database_id: id,
		filter: opts?.filter,
		page_size: opts?.numberOfItems,
		sorts: opts?.firstResults
			? [{ timestamp: "last_edited_time", direction: "descending" }]
			: undefined,
	})
	results = [...data.results]
	while (!opts?.firstResults && data.has_more) {
		logger("Getting next page...")
		data = await notion.databases.query({
			database_id: id,
			filter: opts?.filter,
			page_size: opts?.numberOfItems,
			start_cursor: data.next_cursor || undefined,
		})
		results = [...results, ...data.results]
	}
	return results
}
