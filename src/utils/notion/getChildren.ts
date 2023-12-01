import "dotenv/config"
import { Client } from "@notionhq/client"
import type {
	BlockObjectResponse,
	PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"
import getDatabase from "./getDatabase"

export type BlockObjectResponseWithChildren = BlockObjectResponse & {
	children: BlockObjectResponseWithChildren[] | PageObjectResponse[]
}

export default async function getChildren(blockId: string, recursive = true, firstResults = false) {
	const notion = new Client({
		auth: import.meta.env ? import.meta.env.NOTION_SECRET : process.env.NOTION_SECRET,
	})
	let results: BlockObjectResponse[] | BlockObjectResponseWithChildren[] = []
	let data = await notion.blocks.children.list({
		block_id: blockId,
	})
	results = [...data.results] as BlockObjectResponse[]
	while (!firstResults && data.has_more) {
		data = await notion.blocks.children.list({
			block_id: blockId,
			start_cursor: data.next_cursor || undefined,
		})
		results = [...results, ...data.results] as BlockObjectResponse[]
	}
	// All first level children are in results. Now we will add a "children" property to them.
	if (recursive) results = await recursivelyGetChildren(results)
	return results
}

async function recursivelyGetChildren(
	blocks: BlockObjectResponse[]
): Promise<BlockObjectResponseWithChildren[] | BlockObjectResponse[]> {
	const result = await Promise.all(
		blocks.map(async (block) => {
			if (block.has_children) {
				console.log(`Notion: getting children of ${block.type} ${block.id}`)
				const children = await getChildren(block.id)
				const recursiveChildren = await recursivelyGetChildren(children)
				return {
					...block,
					children: recursiveChildren,
				}
			}
			if (block.type == "child_database") {
				const children = (await getDatabase(block.id)) as PageObjectResponse[]
				return {
					...block,
					children: children,
				}
			}
			return block
		})
	)
	return result
}
