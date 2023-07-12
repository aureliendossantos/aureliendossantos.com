import fs from "node:fs"
import fsp from "node:fs/promises"
import type getGames from "$utils/notion/getGames"

export function getContentDirs(type: "places"): URL[] {
	const dirPath = new URL(`../src/content/${type}/`, import.meta.url)
	const mainDirs = fs
		.readdirSync(dirPath, { withFileTypes: true })
		.filter((dir) => dir.isDirectory())
		.map((dir) => new URL(dir.name + "/", dirPath))
	const subDirs = mainDirs.map((mainDir) =>
		fs
			.readdirSync(mainDir, { withFileTypes: true })
			.filter((dir) => dir.isDirectory())
			.map((dir) => new URL(dir.name + "/", mainDir))
	)
	const flattenDirs = [...new Set(subDirs.flat())]
	return flattenDirs
}

export async function getPlacesData() {
	const filePath = new URL(`../public/data/maps.json`, import.meta.url)
	return JSON.parse((await fsp.readFile(filePath)).toString()) as google.maps.places.PlaceResult[]
}

export async function getGamesData() {
	const filePath = new URL(`../public/data/games.json`, import.meta.url)
	return JSON.parse((await fsp.readFile(filePath)).toString()) as Awaited<
		ReturnType<typeof getGames>
	>
}
