import enumerate from "./enumerateStrings"

export default async function getIGDBgame(slug: string) {
	console.log("Getting IGDB data: " + slug)
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

	const request = await fetch(
		`https://api.igdb.com/v4/games`,
		parameters(
			`fields name, cover.image_id, cover.width, cover.height, screenshots.image_id, screenshots.width, screenshots.height, platforms.abbreviation, first_release_date, release_dates.y, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, websites.category, websites.url, url; where slug = "${slug}";`
		)
	).then((response) => response.json())
	const game = request[0]
	game.developers = enumerate(
		game.involved_companies.filter((i: any) => i.developer).map((i: any) => i.company.name)
	)
	game.publishers = enumerate(
		game.involved_companies.filter((i: any) => i.publisher).map((i: any) => i.company.name)
	)
	return game
}
