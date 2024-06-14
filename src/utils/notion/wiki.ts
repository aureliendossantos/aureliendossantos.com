import type { Title, RichText } from "$utils/notion/types"
import type {
	MultiSelectPropertyItemObjectResponse,
	PageObjectResponse,
	SelectPropertyItemObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"

export type PagesEntry = PageObjectResponse & {
	properties: {
		Nom: Title
		Description: RichText
		Slug: RichText
		Related: MultiSelectPropertyItemObjectResponse
		Status: SelectPropertyItemObjectResponse
	}
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
