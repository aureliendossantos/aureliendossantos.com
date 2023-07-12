import fs from "node:fs"
import { updateGames } from "./updateGames"
import { updatePlaces } from "./updatePlaces"

const [gameCount, placesCount] = await Promise.all([updateGames(), updatePlaces()])

console.log(`Got data for ${gameCount} games & ${placesCount} places.`)

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
