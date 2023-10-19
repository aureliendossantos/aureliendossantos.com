import process from "node:process"
import { pathToFileURL } from "node:url"
import fs from "node:fs"
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
export async function getPlacesData() {
	const rootPath = pathToFileURL(process.cwd() + "/")
	const filePath = new URL(`node_modules/.my-cache/maps.json`, rootPath)
	if (!fs.existsSync(filePath)) return []
	return JSON.parse((await fs.promises.readFile(filePath)).toString()) as PlaceWithFetchDate[]
}

/**
 * Gets the data from `games.json`.
 * @see `updateRemoteData.ts`
 * @param publicDirURL The URL of the `public` folder.
 * @returns A list of all games.
 */
export async function getGamesData() {
	const rootPath = pathToFileURL(process.cwd() + "/")
	const filePath = new URL(`node_modules/.my-cache/games.json`, rootPath)
	return JSON.parse((await fs.promises.readFile(filePath)).toString()) as Awaited<
		ReturnType<typeof getGames>
	>
}
