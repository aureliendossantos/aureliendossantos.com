import slugify from "slugify"
import { dateSort } from "$utils/sort"
import type { Title, RichText } from "$utils/notion/types"
import type {
	BlockObjectResponse,
	MultiSelectPropertyItemObjectResponse,
	PageObjectResponse,
	SelectPropertyItemObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"
import getDatabase from "./getDatabase"
import type { BlockObjectResponseWithChildren } from "./getChildren"
import type { Logger } from "$utils/remoteData/loaders"

export type PageResponse = PageObjectResponse & {
	properties: {
		Nom: Title
		Description: RichText
		Slug: RichText
		Related: MultiSelectPropertyItemObjectResponse
		Status: SelectPropertyItemObjectResponse
	}
}

type WikiPageStatus =
	| "🔒 Private"
	| "🌱 Seedlings"
	| "🌿 Budding"
	| "🌲 Evergreen"
	| "🍂 Withered"
	| undefined

const getWikiPageStatus = (status: WikiPageStatus) => {
	switch (status) {
		case "🔒 Private":
			return { icon: "🔒", text: "Privé" }
		case "🌱 Seedlings":
			return { icon: "🌱", text: "Pousse" }
		case "🌿 Budding":
			return { icon: "🌿", text: "En bourgeon" }
		case "🌲 Evergreen":
			return { icon: "🌲", text: "Pérenne" }
		// Withered
		case "🍂 Withered":
			return { icon: "🍂", text: "Fané" }
		default:
			return undefined
	}
}

const slugifyRegex = /[*+~.()'"!:@«»→,;]/g

/**
 * Wiki pages are no longer rendered on this site; they link out to Notion instead.
 * `public_url` is only set once a page is published to the web, so we fall back to
 * the canonical notion.so link, which redirects logged-out visitors to the published
 * version (and 404s if the page was never published).
 */
const getNotionUrl = (page: PageResponse) =>
	page.public_url ?? `https://www.notion.so/${page.id.replaceAll("-", "")}`

export const fetchWikiPages = async (
	opts?: { includePrivate?: boolean },
	logger: Logger = console.log
) => {
	return (
		(await getDatabase(
			process.env.NOTION_WIKI_PAGES_DB!,
			{
				filter: opts?.includePrivate
					? undefined
					: {
							property: "Status",
							select: { does_not_equal: "🔒 Private" },
						},
			},
			logger
		)) as PageResponse[]
	)
		.map((page) => {
			const title = page.properties.Nom.title[0].plain_text
			const related = page.properties.Related.multi_select.map((s) => s.name)
			const slug = page.properties.Slug.rich_text[0]
				? page.properties.Slug.rich_text[0].plain_text
				: ""
			const status = ((page.properties.Status.select && page.properties.Status.select.name) ||
				undefined) as WikiPageStatus

			return {
				id: page.id,
				slug: slug != "" ? slug : slugify(title, { remove: slugifyRegex, lower: true }),
				title: title,
				notionUrl: getNotionUrl(page),
				published: page.public_url != null,
				description: page.properties.Description.rich_text[0]
					? page.properties.Description.rich_text[0].plain_text
					: "",
				related: related.filter((r) => !r.startsWith("tags/")),
				tags: related.filter((r) => r.startsWith("tags/")).map((r) => r.replace("tags/", "")),
				editedTime: new Date(page.last_edited_time),
				status: getWikiPageStatus(status),
				blocks: [] as BlockObjectResponse[] | BlockObjectResponseWithChildren[],
				// Only set for pages we actually fetch blocks for
				hasImages: undefined as boolean | undefined,
			}
		})
		.sort((a, b) => dateSort(a.editedTime, b.editedTime))
}

export const getBackgroundColor = (color: string) => {
	switch (color) {
		case "default":
			return "bg-neutral-100 dark:bg-neutral-800"
		case "gray":
			return "bg-neutral-200 dark:bg-neutral-800"
		case "brown":
			return "bg-brown-100 dark:bg-brown-900"
		case "orange":
			return "bg-orange-100 dark:bg-orange-900"
		case "yellow":
			return "bg-yellow-100 dark:bg-yellow-900"
		case "green":
			return "bg-green-100 dark:bg-green-900"
		case "blue":
			return "bg-blue-100 dark:bg-blue-900"
		case "purple":
			return "bg-purple-100 dark:bg-purple-900"
		case "pink":
			return "bg-pink-100 dark:bg-pink-900"
		case "red":
			return "bg-red-100 dark:bg-red-900"
		case "gray_background":
			return "bg-neutral-100 dark:bg-neutral-800"
		case "brown_background":
			return "bg-brown-100 dark:bg-brown-900"
		case "orange_background":
			return "bg-orange-100 dark:bg-orange-900"
		case "yellow_background":
			return "bg-yellow-100 dark:bg-yellow-900"
		case "green_background":
			return "bg-green-100 dark:bg-green-900"
		case "blue_background":
			return "bg-blue-100 dark:bg-blue-900"
		case "purple_background":
			return "bg-purple-100 dark:bg-purple-900"
		case "pink_background":
			return "bg-pink-100 dark:bg-pink-900"
		case "red_background":
			return "bg-red-100 dark:bg-red-900"
		default:
			return "bg-neutral-100 dark:bg-neutral-800"
	}
}
