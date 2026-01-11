import type { SpotifyAlbum, SpotifyTrack, SpotifySearchResults } from "./spotifyClient"

export const getSpotifyToken = async () => {
	const token = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: `grant_type=client_credentials&client_id=${
			process.env.SPOTIFY_CLIENT_ID
		}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`,
	})
		.then((response) => response.json())
		.then((response) => response.access_token)
		.catch((err) => console.error(err))
	return token
}

export const fetchSpotifyEndpoint = async (
	endpoint: "albums" | "tracks",
	id: string,
	market?: string
): Promise<SpotifyAlbum | SpotifyTrack> => {
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${await getSpotifyToken()}`,
		},
	}
	const response = await fetch(
		`https://api.spotify.com/v1/${endpoint}/${id}${market ? `?market=${market}` : ""}`,
		options
	)
		.then((response) => {
			if (response.status == 200) return response.json()
			throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
		})
		.catch((err) => console.error(err))
	return response
}

export async function getSpotifyAlbumById(id: string) {
	return (await fetchSpotifyEndpoint("albums", id)) as SpotifyAlbum
}

export async function getSpotifyTrackById(id: string) {
	return (await fetchSpotifyEndpoint("tracks", id)) as SpotifyTrack
}

/**
 * Search Spotify for albums and tracks.
 * @param searchQuery Search query string
 * @param limit Maximum number of results per type
 * @returns Object containing albums and tracks arrays
 */
export async function searchSpotify(
	searchQuery: string,
	limit: number = 10
): Promise<{ albums: SpotifyAlbum[]; tracks: SpotifyTrack[] }> {
	const token = await getSpotifyToken()
	const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=album,track&limit=${limit}`

	const results: SpotifySearchResults = await fetch(searchUrl, {
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			if (response.status === 200) return response.json()
			throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
		})
		.catch((err) => {
			console.error(err)
			return { albums: { items: [] }, tracks: { items: [] } }
		})

	const albums = results.albums?.items || []
	const tracks = results.tracks?.items || []
	console.log(`Found ${albums.length} album(s) and ${tracks.length} track(s) for: ${searchQuery}`)
	return { albums, tracks }
}
