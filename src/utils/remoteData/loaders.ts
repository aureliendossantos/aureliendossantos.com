import type { Loader, LoaderContext } from "astro/loaders"
import { z } from "astro:content"
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import getChildren, {
	getBlock,
	type BlockObjectResponseWithChildren,
} from "$utils/notion/getChildren"
import { fetchWikiPages } from "$utils/notion/wiki"
import getGames from "$utils/notion/getGames"

/**
 * Returns true if the block is an image or its children contain an image.
 * @param block A Notion block object.
 */
const recursiveCheckImages = (block: BlockObjectResponse | BlockObjectResponseWithChildren) => {
	if (block.type == "image") return true
	if (block.children) return block.children.some(recursiveCheckImages)
	return false
}

const recursiveUpdateImages = async (
	blocks: BlockObjectResponse[] | BlockObjectResponseWithChildren[]
): Promise<any> => {
	return await Promise.all(
		blocks.map(async (block) => {
			if (block.type == "image") return await getBlock(block.id)
			if (block.children) {
				const children = await recursiveUpdateImages(block.children)
				return { ...block, children }
			}
			return block
		})
	)
}

/**
 * Fetches pages in my Notion database according to custom filters then
 * saves the results as data entries in the wiki collection.
 */
export function notionWikiLoader(options: { forceUpdate: boolean }): Loader {
	return {
		name: "notion-wiki-loader",

		load: async (context: LoaderContext): Promise<void> => {
			const lastModified = context.meta.get("lastModified")
			const quickUpdate = Boolean(
				import.meta.env.DEV &&
					!options.forceUpdate &&
					lastModified &&
					Date.now() - new Date(lastModified).getTime() < 3600000
			) // <1h ago
			if (quickUpdate) {
				context.logger.info("Skipping update")
				return
			}
			context.logger.info("Fetching wiki pages...")
			const emptyPages = await fetchWikiPages({}, context.logger.info)

			console.time("Notion pages fetched in")
			const pages = await Promise.all(
				emptyPages.map(async (page) => {
					const oldPage = context.store.get(page.slug)?.data
					// If old page is unedited, skip update...
					if (
						oldPage &&
						oldPage.hasImages !== undefined &&
						page.editedTime.getTime() == oldPage.editedTime.getTime()
					) {
						// ...unless the page has images, in which case their URL must be updated.
						// Check if hasImages is true, then recursively find all blocks of type "image" and call getBlock on them
						if (oldPage.hasImages) {
							context.logger.info(`(images only) ${page.slug}...`)
							oldPage.blocks = await recursiveUpdateImages(oldPage.blocks)
							return oldPage
						}
						return oldPage
					}
					context.logger.info((oldPage ? "(updated)" : "(new)") + ` ${page.slug}...`)
					page.blocks = await getChildren(page.id)
					// Recursively check if there is at least a block of type "image"
					page.hasImages = page.blocks.some(recursiveCheckImages)
					return page
				})
			)
			console.timeEnd("Notion pages fetched in")

			for (const page of pages) {
				const data = await context.parseData({ id: page.slug, data: page })
				const digest = context.generateDigest(data)
				context.store.set({
					id: page.slug,
					data,
					digest,
				})
			}
			context.logger.info(`Stored ${pages.length} pages`)
			context.meta.set("lastModified", new Date().toISOString())
		},

		schema: async () =>
			z.object({
				id: z.string(),
				slug: z.string(),
				title: z.string(),
				description: z.string(),
				related: z.array(z.string()),
				tags: z.array(z.string()),
				editedTime: z.date(),
				status: z.object({
					icon: z.string(),
					text: z.string(),
				}),
				blocks: z.array(z.any()),
				hasImages: z.boolean().optional(),
			}),
	}
}

export function gamesLibraryLoader(options: { forceUpdate?: boolean }): Loader {
	return {
		name: "games-library-loader",

		load: async (context: LoaderContext): Promise<void> => {
			const lastModified = context.meta.get("lastModified")
			const quickUpdate = Boolean(
				import.meta.env.DEV &&
					!options.forceUpdate &&
					lastModified &&
					Date.now() - new Date(lastModified).getTime() < 86400000
			) // <24h ago
			if (quickUpdate) {
				context.logger.info("Skipping update")
				return
			}
			if (quickUpdate) context.logger.info("Running in quick update mode")
			const games = await getGames(
				{
					firstResults: quickUpdate,
					filter: {
						and: [
							{ property: "Nom", title: { is_not_empty: true } },
							{ property: "Type", select: { equals: "Jeu" } },
							{
								or: [
									{ property: "Progression", status: { does_not_equal: "À essayer" } },
									{ property: "Appréciation", select: { is_not_empty: true } },
									{ property: "Multijoueur", multi_select: { is_not_empty: true } },
								],
							},
						],
					},
				},
				(msg) => context.logger.info(msg)
			)

			for (const game of games) {
				const data = await context.parseData({ id: game.id, data: game })
				const digest = context.generateDigest(data)
				context.store.set({
					id: game.id,
					data,
					digest,
				})
			}
			context.meta.set("lastModified", new Date().toISOString())
		},

		schema: async () =>
			z.object({
				title: z.string(),
				slug: z.string().nullish(),
				quickReview: z
					.enum([
						"Coup de cœur",
						"Aimé",
						"Sympa un moment",
						"Whatever",
						"Mitigé",
						"Décevant",
						"J'aime pas",
						"Mauvais",
						"Pas pour moi",
					])
					.nullish(),
				review: z.string().nullish(),
				firstPlayedYear: z.number().nullish(),
				progress: z.string(),
				multiplayer: z.array(z.enum(["En ligne", "Local", "Coop", "Versus"])),
				myPlatforms: z.array(z.string()),
				blocks: z.array(z.any()),
				notionUrl: z.string(),
				lastEditedTime: z.string(),
				igdb: z.any().nullish(),
			}),
	}
}

export type Logger = (message: string) => void
