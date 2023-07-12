import "dotenv/config"
import { Client } from "@notionhq/client"
import type { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints"

export default async function getDatabase(
	id: string,
	filter: QueryDatabaseParameters["filter"],
	firstResults = false,
	numberOfItems: number | undefined = undefined
) {
	const notion = new Client({
		auth: import.meta.env ? import.meta.env.NOTION_SECRET : process.env.NOTION_SECRET,
	})
	let results = []
	let data = await notion.databases.query({
		database_id: id,
		filter: filter,
		page_size: numberOfItems,
	})
	results = [...data.results]
	while (!firstResults && data.has_more) {
		data = await notion.databases.query({
			database_id: id,
			filter: filter,
			start_cursor: data.next_cursor || undefined,
		})
		results = [...results, ...data.results]
	}
	return results
}
