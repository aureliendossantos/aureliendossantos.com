import getGames from "$utils/notion/getGames"
import fs from "node:fs"
import { pathToFileURL } from "node:url"

/**
 * Fetches the games in my Notion database according to custom filters then
 * saves the results in a `games.json` file that can be read by `getGamesData()`.
 * @returns The number of games in the new data file.
 */
export default async function updateGames() {
	const rootPath = pathToFileURL(process.cwd() + "/")
	const filePath = new URL(`node_modules/.my-cache/games.json`, rootPath)
	const games = await getGames({
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
	})
	fs.writeFileSync(filePath, JSON.stringify(games, null, 2))
	return games.length
}
