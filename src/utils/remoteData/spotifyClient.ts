export type SpotifyAlbum = {
	id: string
	name: string
	album_type: "album" | "single" | "compilation"
	artists: SpotifyArtist[]
	release_date: string
	release_date_precision: "year" | "month" | "day"
	total_tracks: number
	images: SpotifyImage[]
	external_urls: { spotify: string }
	label?: string
}

export type SpotifyTrack = {
	id: string
	name: string
	artists: SpotifyArtist[]
	album: {
		id: string
		name: string
		release_date: string
		release_date_precision: "year" | "month" | "day"
		images: SpotifyImage[]
	}
	duration_ms: number
	external_urls: { spotify: string }
}

export type SpotifyArtist = {
	id: string
	name: string
	external_urls: { spotify: string }
}

export type SpotifyImage = {
	url: string
	height: number
	width: number
}

// Albums are supposed to be SimplifiedAlbumObjects here, the types have been AI generated
export type SpotifySearchResults = {
	albums?: {
		items: SpotifyAlbum[]
	}
	tracks?: {
		items: SpotifyTrack[]
	}
}

/**
 * Convert a Spotify date to a JavaScript Date.
 * @param spotifyDate example values: "1981", "1981-12", "1981-12-15"
 * @param date_precision allowed values: "year", "month", "day"
 * @returns a JavaScript Date object
 */
export const getSpotifyDate = (spotifyDate: string, date_precision: "year" | "month" | "day") => {
	const [year, month, day] = spotifyDate.split("-").map((n) => parseInt(n))
	switch (date_precision) {
		case "year":
			return new Date(year, 0, 1)
		case "month":
			return new Date(year, month - 1, 1)
		case "day":
			return new Date(year, month - 1, day)
	}
}
