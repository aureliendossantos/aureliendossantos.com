import fs from "node:fs/promises"
import type getGames from "$utils/notion/getGames"

export interface PlaceWithFetchDate extends google.maps.places.PlaceResult {
	fetchDate: number
}

/**
 * Gets the data from `maps.json`.
 * @see `updateRemoteData.ts`
 * @param publicDirURL The URL of the `public` folder.
 * @returns A list of all places.
 */
export async function getPlacesData(publicDirURL: string) {
	const filePath = new URL(`data/maps.json`, publicDirURL)
	return JSON.parse((await fs.readFile(filePath)).toString()) as PlaceWithFetchDate[]
}

/**
 * Gets the data from `games.json`.
 * @see `updateRemoteData.ts`
 * @param publicDirURL The URL of the `public` folder.
 * @returns A list of all games.
 */
export async function getGamesData(publicDirURL: string) {
	const filePath = new URL(`data/games.json`, publicDirURL)
	return JSON.parse((await fs.readFile(filePath)).toString()) as Awaited<
		ReturnType<typeof getGames>
	>
}
