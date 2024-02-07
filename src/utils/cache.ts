import "dotenv/config"
import fs from "node:fs"
import { pathToFileURL } from "node:url"

// 10 days  = 864000000 ms (wikipedia cache duration)
// 100 days = 8640000000 ms (google maps cache duration)
export async function getCacheOrFetch<T>(
	title: string,
	folder: string,
	fetchFunction: () => Promise<T>,
	cacheDays = 100
): Promise<T> {
	ensureCacheFolderExists()
	ensureFolderExists(`node_modules/.my-cache/${folder}`)
	const rootPath = pathToFileURL(process.cwd() + "/")
	const filePath = new URL(`node_modules/.my-cache/${folder}/${title}.json`, rootPath)
	// Gets the current json, if it exists, and maybe use its data
	if (fs.existsSync(filePath)) {
		const oldData = JSON.parse((await fs.promises.readFile(filePath)).toString()) as T & {
			fetchDate: number
		}
		if (oldData.fetchDate > Date.now() - cacheDays * 86400000) return oldData
	}
	console.log(`Fetching ${folder}/${title}...`)
	const data = await fetchFunction()
	// writing the data and fetch date to a file
	fs.writeFileSync(filePath, JSON.stringify({ ...data, fetchDate: Date.now() }, null, 2))
	return data
}

function ensureFolderExists(folderPath: string) {
	const rootPath = pathToFileURL(process.cwd() + "/")
	const dir = new URL(folderPath, rootPath)
	if (!fs.existsSync(dir)) {
		console.warn(`Folder ${folderPath} doesn't exist. Creating it...`)
		fs.mkdirSync(dir)
	}
}

export function ensureCacheFolderExists() {
	ensureFolderExists("node_modules/.my-cache")
}
