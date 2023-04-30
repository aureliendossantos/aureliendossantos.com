import enumerate from "./enumerateStrings"

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
	first_release_date: string
	release_dates: { y: number }[]
	involved_companies: { developer: boolean; publisher: boolean; company: { name: string } }[]
	websites: { category: number; url: string }[]
	url: string
	developers: string
	publishers: string
}

export default async function getIGDBgames(slugs: string[]) {
	console.log(`Getting IGDB data for ${slugs.length} games...`)
	const authentication = await fetch(
		`https://id.twitch.tv/oauth2/token?client_id=${import.meta.env.TWITCH_ID}&client_secret=${
			import.meta.env.TWITCH_SECRET
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
				"Client-ID": import.meta.env.TWITCH_ID,
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
	games.forEach((game) => {
		game.developers = enumerate(
			game.involved_companies.filter((i: any) => i.developer).map((i: any) => i.company.name)
		)
		game.publishers = enumerate(
			game.involved_companies.filter((i: any) => i.publisher).map((i: any) => i.company.name)
		)
	})
	console.log(`Loaded ${games.length} games`)
	return games
}
