import fs from "node:fs"
import { pathToFileURL } from "node:url"
import updateGames from "./updateGames"
import updatePlaces from "./updatePlaces"

// Creates the cache folder if it doesn't exist
const rootPath = pathToFileURL(process.cwd() + "/")
const cacheDir = new URL(`node_modules/.my-cache`, rootPath)
if (!fs.existsSync(cacheDir)) {
	console.warn("Cache folder doesn't exist. Creating it...")
	fs.mkdirSync(cacheDir)
} else {
	console.log("Cache folder found.")
}

// When this script is ran (see package.json), runs all the scripts updating remote data.
const [gameCount, placesCount] = await Promise.all([updateGames(), updatePlaces()])

console.log(`Got data for ${gameCount} games & ${placesCount} places.`)

/**
 * Get a list of all directories in a given content collection.
 * @param type The name of a content collection.
 * @returns A flattened list of the URLs of all dirs and subdirs in the content collection folder.
 */
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
