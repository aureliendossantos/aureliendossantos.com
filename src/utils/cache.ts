import "dotenv/config"
import fs from "node:fs"
import { pathToFileURL } from "node:url"

/**
 * This function is useful to get any kind of data from the Internet that can (or should) be cached.
 * Gets the data from the cache if it exists and is not too old, otherwise fetches it and caches it.
 * @param title The filename of the cache
 * @param folder The folder name indicating some kind of category, useful to avoid name conflicts
 * @param fetchFunction A function that returns a promise of the data to be fetched. The return value can be of any type, and will be stored as JSON.
 * @param cacheDays The duration of the cache in days. Default is 100 days, which is good for Google Maps. 10 days is good for Wikipedia. A day is 86400000 ms.
 * @returns
 */
export async function getCacheOrFetch<T>(
	title: string,
	folder: string,
	fetchFunction: () => Promise<T>,
	cacheDays = 100
): Promise<T | null> {
	ensureCacheFolderExists()
	ensureFolderExists(`node_modules/.my-cache/${folder}`, "create")
	title = title.slice(0, 200) // Maximum 200 chars for the filename. Hope it doesn't create conflicts.
	const rootPath = pathToFileURL(process.cwd() + "/")
	const filePath = new URL(`node_modules/.my-cache/${folder}/${title}.json`, rootPath)
	// Gets the current json, if it exists, and maybe use its data
	let cache: { data: T; fetchDate: number } | null = null
	if (fs.existsSync(filePath)) {
		cache = JSON.parse((await fs.promises.readFile(filePath)).toString()) as {
			data: T
			fetchDate: number
		}
		if (cache.fetchDate > Date.now() - cacheDays * 86400000) return cache.data
	}
	console.log(`Fetching ${folder}/${title}...`)
	let data: T
	try {
		data = await fetchFunction()
		if (!data) throw new Error(`No data fetched for ${folder}/${title}.`)
	} catch (error) {
		console.error(`Error fetching ${folder}/${title}:`, error)
		if (cache) {
			console.log(`Using old cache for ${folder}/${title}`)
			return cache.data
		}
		return null
	}
	// writing the data and fetch date to a file
	fs.writeFileSync(filePath, JSON.stringify({ fetchDate: Date.now(), data: data }, null, 2))
	return data
}

export function ensureFolderExists(folderPath: string, behavior: "create" | "throw" = "throw") {
	const rootPath = pathToFileURL(process.cwd() + "/")
	const dir = new URL(folderPath, rootPath)
	if (!fs.existsSync(dir)) {
		if (behavior === "throw") throw new Error(`Path ${folderPath} doesn't exist.`)
		console.warn(`Folder ${folderPath} doesn't exist. Creating it...`)
		fs.mkdirSync(dir)
	}
}

export function ensureCacheFolderExists() {
	ensureFolderExists("node_modules/.my-cache", "create")
}
