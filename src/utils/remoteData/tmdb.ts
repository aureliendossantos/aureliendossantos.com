import "dotenv/config"
import enumerate from "../formatting/enumerateStrings"
import type { Logger } from "./loaders"
import type { TMDBResponse, TMDBSearchResult } from "./tmdbClient"

const baseUrl = "https://api.themoviedb.org/3"
const options: RequestInit = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
	},
}

export async function searchTMDBmovies(searchedTitle: string, limit: number = 20) {
	const search = await fetch(
		`${baseUrl}/search/movie?query=${encodeURIComponent(searchedTitle)}&language=fr-FR`,
		options
	)
		.then((response) => response.json())
		.catch((err) => console.error(err))
	return search.results?.slice(0, limit) as TMDBSearchResult[]
}

export default async function getTMDBmovie(id: number) {
	const movie = await fetch(
		`${baseUrl}/movie/${id}?language=fr-FR&append_to_response=credits,images&include_image_language=fr,en,null`,
		options
	)
		.then((response) => response.json())
		.catch((err) => console.error(err))
	if (movie.success == false) {
		console.error("Error. TMDB response:", movie)
		return null
	}
	return movie as TMDBResponse
}
