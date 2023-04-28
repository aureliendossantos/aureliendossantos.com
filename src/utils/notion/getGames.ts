import type { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints"
import getDatabase from "./getDatabase"

export default async function getGames(
	filter: QueryDatabaseParameters["filter"],
	firstResults = false
) {
	const notionResponse = await getDatabase(import.meta.env.NOTION_GAMES_DB, filter, firstResults)
	const games = notionResponse.map((game) => {
		return {
			title: game.properties.Nom.title[0].text.content,
			slug: game.properties.slug.rich_text[0] && game.properties.slug.rich_text[0].plain_text,
			quickReview: game.properties.Appréciation.select && game.properties.Appréciation.select.name,
			review:
				game.properties.Commentaire.rich_text[0] &&
				game.properties.Commentaire.rich_text[0].plain_text,
			firstPlayedYear: game.properties["Année de découverte"].number,
			progress: game.properties.Progression.status && game.properties.Progression.status.name,
			multiplayer: game.properties.Multijoueur.multi_select.map((item) => item.name),
			myPlatforms: game.properties.Support.multi_select.map((item) => item.name),
		}
	})
	return { games, notionResponse }
}
