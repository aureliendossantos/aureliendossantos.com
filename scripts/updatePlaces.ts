import "dotenv/config"
import fs from "node:fs"
import matter from "gray-matter"
import { getContentDirs } from "./updateRemoteData"

export async function updatePlaces() {
	const filePath = new URL(`../public/data/maps.json`, import.meta.url)
	const placeDirs = getContentDirs("places")
	console.log("Reminder: Places need to be stored in a folder and named index.mdx")
	const placeIDs = placeDirs.map((dir) => {
		const markdownContent = fs.readFileSync(new URL("index.mdx", dir)).toString()
		return matter(markdownContent).data.id as string
	})
	const data = await Promise.all(
		placeIDs.map(async (id) => {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&language=fr&key=${process.env.GOOGLE_MAPS_TOKEN}`
			).then((response) => response.json())
			console.log("Got Place Details for " + response.result.name)
			return response.result as google.maps.Place
		})
	)
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
	return data.length
}
