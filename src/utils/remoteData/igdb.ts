import "dotenv/config"
import enumerate from "../formatting/enumerateStrings"

export type IGDBImage = {
	image_id: string
	width: number
	height: number
}

export type IGDBData = {
	name: string
	slug: string
	cover: IGDBImage
	screenshots: IGDBImage[]
	platforms: { abbreviation: string }[]
	first_release_date: number
	release_dates: { y: number }[]
	involved_companies: { developer: boolean; publisher: boolean; company: { name: string } }[]
	websites: { category: number; url: string }[]
	url: string
	developers: string
	publishers: string
}

export default async function getIGDBgames(slugs: string[]) {
	//console.log("wait")
	//await new Promise((resolve) => setTimeout(resolve, Math.random() * 4000))
	console.log(`Getting IGDB data for ${slugs.length == 1 ? slugs[0] : `${slugs.length} games`}...`)
	const authentication = await fetch(
		`https://id.twitch.tv/oauth2/token?client_id=${
			import.meta.env ? import.meta.env.TWITCH_ID : process.env.TWITCH_ID
		}&client_secret=${
			import.meta.env ? import.meta.env.TWITCH_SECRET : process.env.TWITCH_SECRET
		}&grant_type=client_credentials`,
		{
			method: "POST",
		}
	).then((response) => response.json())
	const token = authentication.access_token

	function parameters(body: string): RequestInit {
		return {
			method: "POST",
			headers: {
				"Client-ID": import.meta.env ? import.meta.env.TWITCH_ID : process.env.TWITCH_ID,
				Authorization: `Bearer ${token}`,
			},
			body: body,
		}
	}

	const games: IGDBData[] = await fetch(
		`https://api.igdb.com/v4/games`,
		parameters(
			`fields name, slug, cover.image_id, cover.width, cover.height, screenshots.image_id, screenshots.width, screenshots.height, platforms.abbreviation, first_release_date, release_dates.y, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, websites.category, websites.url, url; where slug = (${slugs
				.map((slug) => `"${slug}"`)
				.join()}); limit 500;`
		)
	).then((response) => response.json())

	// Check if games is undefined, is [] or has no name
	if (!games || games.length == 0 || !("name" in games[0])) {
		throw new Error(`Game not found: ${slugs[0]}: ${JSON.stringify(games)}`)
	}

	games.forEach((game) => {
		game.developers = enumerate(
			game.involved_companies.filter((i) => i.developer).map((i) => i.company.name)
		)
		game.publishers = enumerate(
			game.involved_companies.filter((i) => i.publisher).map((i) => i.company.name)
		)
	})
	console.log(`Loaded ${slugs.length == 1 ? slugs[0] : `${slugs.length} games`}`)
	return games
}
