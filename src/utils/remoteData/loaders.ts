import fs from "node:fs"
import path from "node:path"
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

const gardenTagRegex = /<Garden\s[^>]*id="([^"]+)"/g

/**
 * Wiki pages aren't rendered as site pages anymore, so their Notion blocks are only
 * needed for the ones displayed inline by a `<Garden>` popup. Fetching blocks means
 * one recursive request tree per page, so scanning the content for `<Garden id="...">`
 * keeps the build to a single database query in the common case.
 */
const getSlugsNeedingBlocks = () => {
	const slugs = new Set<string>()
	const root = path.join(process.cwd(), "src/content")
	if (!fs.existsSync(root)) return slugs
	for (const file of fs.readdirSync(root, { recursive: true }) as string[]) {
		if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue
		const contents = fs.readFileSync(path.join(root, file), "utf8")
		for (const match of contents.matchAll(gardenTagRegex)) slugs.add(match[1])
	}
	return slugs
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

			const slugsNeedingBlocks = getSlugsNeedingBlocks()
			console.time("Notion pages fetched in")
			let imagesOnlyPages = 0
			const pages = await Promise.all(
				emptyPages.map(async (page) => {
					// Pages nobody embeds are link-only: keep the metadata, skip the block requests.
					if (!slugsNeedingBlocks.has(page.slug)) return page
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
							imagesOnlyPages += 1
							oldPage.blocks = await recursiveUpdateImages(oldPage.blocks)
						}
						// The metadata still comes from the fresh query, in case the page was
						// renamed or published since the blocks were cached.
						return { ...page, blocks: oldPage.blocks, hasImages: oldPage.hasImages }
					}
					context.logger.info((oldPage ? "(updated)" : "(new)") + ` ${page.slug}...`)
					page.blocks = await getChildren(page.id)
					// Recursively check if there is at least a block of type "image"
					page.hasImages = page.blocks.some(recursiveCheckImages)
					return page
				})
			)
			if (imagesOnlyPages > 0) context.logger.info(`(images only) Updated ${imagesOnlyPages} pages`)
			console.timeEnd("Notion pages fetched in")
			context.logger.info(
				`Fetched blocks for ${slugsNeedingBlocks.size} embedded page(s); ${
					pages.length - slugsNeedingBlocks.size
				} link-only`
			)

			const unpublished = pages.filter((page) => !page.published)
			if (unpublished.length > 0)
				context.logger.warn(
					`${unpublished.length} page(s) are not published to the web, so their links will 404: ` +
						unpublished.map((page) => page.slug).join(", ")
				)

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
				notionUrl: z.string(),
				published: z.boolean(),
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
