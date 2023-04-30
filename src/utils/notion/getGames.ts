import type {
	BlockObjectResponse,
	QueryDatabaseParameters,
	QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints"
import getDatabase from "./getDatabase"
import getChildren from "./getChildren"

type ResponseResult = Extract<
	QueryDatabaseResponse["results"][number],
	{ properties: Record<string, unknown> }
>
type PropertyMap = ResponseResult["properties"]
type Property = PropertyMap[string]
type PropertyType = Property["type"]
type ExtractedProperty<TType extends PropertyType> = Extract<Property, { type: TType }>

type Title = ExtractedProperty<"title">
type RichText = ExtractedProperty<"rich_text">
type Select = ExtractedProperty<"select">
type MultiSelect = ExtractedProperty<"multi_select">
type Status = ExtractedProperty<"status">
type Number = ExtractedProperty<"number">
type Checkbox = ExtractedProperty<"checkbox">

type GameEntry = ResponseResult & {
	properties: {
		Nom: Title
		slug: RichText
		Appréciation: Select
		Commentaire: RichText
		"Année de découverte": Number
		Progression: Status
		Multijoueur: MultiSelect
		Support: MultiSelect
		"La suite": Select
		Type: Select
		Soirée: Checkbox
		"Récupérer les blocs": Checkbox
	}
}

export default async function getGames(
	filter: QueryDatabaseParameters["filter"],
	firstResults = false
) {
	const notionResponse = await getDatabase(import.meta.env.NOTION_GAMES_DB, filter, firstResults)
	const typedEntries: GameEntry[] = notionResponse.map((game) => game as GameEntry)
	const games = await Promise.all(
		typedEntries.map(async (game) => {
			const p = game.properties
			return {
				title: p.Nom.title[0].type == "text" ? p.Nom.title[0].text.content : "default",
				slug: p.slug.rich_text[0] && p.slug.rich_text[0].plain_text,
				quickReview: p.Appréciation.select && p.Appréciation.select.name,
				review: p.Commentaire.rich_text[0] && p.Commentaire.rich_text[0].plain_text,
				firstPlayedYear: p["Année de découverte"].number,
				progress: p.Progression.status && p.Progression.status.name,
				multiplayer: p.Multijoueur.multi_select.map((item) => item.name),
				myPlatforms: p.Support.multi_select.map((item) => item.name),
				blocks: p["Récupérer les blocs"].checkbox ? await getChildren(game.id) : [],
				notionUrl: game.url,
				lastEditedTime: game.last_edited_time,
			}
		})
	)
	return { games, notionResponse }
}
