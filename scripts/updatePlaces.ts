import "dotenv/config"
import fs from "node:fs"
import { pathToFileURL } from "node:url"
import matter from "gray-matter"
import { getContentDirs } from "./updateRemoteData"
import { getPlacesData, type PlaceWithFetchDate } from "$utils/remoteData/googleMaps"

/**
 * For each file in the `places` content collection, fetches Google Maps data
 * if it doesn't already exist. If the data is older than 100 days, fetches again.
 * The data is saved to a `maps.json` file that can be read by `getPlacesData()`.
 * @returns The number of places in the new data file.
 * @reminder Places need to be stored in their own folder and named `index.mdx`.
 */
export default async function updatePlaces() {
	const rootPath = pathToFileURL(process.cwd() + "/")
	const filePath = new URL(`node_modules/.my-cache/maps.json`, rootPath)
	// Gets a list of place IDs in the content collection.
	const placeDirs = getContentDirs("places")
	const placeIDs = placeDirs.map((dir) => {
		const markdownContent = fs.readFileSync(new URL("index.mdx", dir)).toString()
		return matter(markdownContent).data.id as string
	})
	// Gets the current json, if it exists, to check if the data already exists.
	const oldData = await getPlacesData()
	// For each place ID, fetches new data or use the existing data
	const newData = await Promise.all(
		placeIDs.map(async (id) => {
			const oldPlaceData = oldData.find((data) => data.place_id == id)
			// 8640000000 ms = 100 days
			if (oldPlaceData && oldPlaceData.fetchDate > Date.now() - 8640000000) return oldPlaceData
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&language=fr&key=${process.env.GOOGLE_MAPS_TOKEN}`
			).then((response) => response.json())
			response.result.fetchDate = Date.now()
			console.log(
				"Fetched Place Details for " + response.result.name + " at " + response.result.fetchDate
			)
			return response.result as PlaceWithFetchDate
		})
	)
	fs.writeFileSync(filePath, JSON.stringify(newData, null, 2))
	return newData.length
}
