import getGames from "$utils/notion/getGames"
import fs from "node:fs"
import crypto from "node:crypto"
import { pathToFileURL } from "node:url"

/**
 * Fetches the games in my Notion database according to custom filters then
 * saves the results as data entries in the games collection.
 * @returns The number of games in the collection.
 */
export default async function updateGames() {
	const rootPath = pathToFileURL(process.cwd() + "/")
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
	// Create content collection folder if it doesn't exist or empty its contents
	const gamesDir = new URL(`src/content/games`, rootPath)
	if (fs.existsSync(gamesDir)) fs.rmSync(gamesDir, { recursive: true })
	fs.mkdirSync(gamesDir)
	// Write the data to a JSON file for each game
	games.forEach((game) => {
		const filename = game.igdb ? game.igdb.slug : crypto.randomUUID()
		const entryPath = new URL(`src/content/games/${filename}.json`, rootPath)
		fs.writeFileSync(entryPath, JSON.stringify(game, null, 2))
	})
	return games.length
}
