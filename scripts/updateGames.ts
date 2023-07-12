import getGames from "$utils/notion/getGames"
import fs from "node:fs"

export async function updateGames() {
	const filePath = new URL(`../public/data/games.json`, import.meta.url)
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
