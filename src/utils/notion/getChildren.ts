import { Client } from "@notionhq/client"

export default async function getChildren(blockId: string, firstResults = false) {
	const notion = new Client({
		auth: import.meta.env.NOTION_SECRET,
	})
	let results = []
	let data = await notion.blocks.children.list({
		block_id: blockId,
	})
	results = [...data.results]
	while (!firstResults && data.has_more) {
		data = await notion.blocks.children.list({
			block_id: blockId,
			start_cursor: data.next_cursor || undefined,
		})
		results = [...results, ...data.results]
	}
	return results
}
