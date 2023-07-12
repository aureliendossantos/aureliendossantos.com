import fs from "node:fs/promises"
import type getGames from "$utils/notion/getGames"

export async function getPlacesData(baseURL: string) {
	const filePath = new URL(`../../public/data/maps.json`, baseURL)
	return JSON.parse((await fs.readFile(filePath)).toString()) as google.maps.places.PlaceResult[]
}

export async function getGamesData(baseURL: string) {
	const filePath = new URL(`../../public/data/games.json`, baseURL)
	return JSON.parse((await fs.readFile(filePath)).toString()) as Awaited<
		ReturnType<typeof getGames>
	>
}
