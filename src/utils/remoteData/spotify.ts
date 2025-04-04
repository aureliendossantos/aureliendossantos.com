/**
 * Convert a Spotify date to a JavaScript Date.
 * @param date example values: "1981", "1981-12", "1981-12-15"
 * @param date_precision allowed values: "year", "month", "day"
 * @returns a JavaScript Date object
 */
export const getSpotifyDate = (date: string, date_precision: "year" | "month" | "day") => {
	const [year, month, day] = date.split("-").map((n) => parseInt(n))
	switch (date_precision) {
		case "year":
			return new Date(year, 0, 1)
		case "month":
			return new Date(year, month - 1, 1)
		case "day":
			return new Date(year, month - 1, day)
	}
}

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
) => {
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
