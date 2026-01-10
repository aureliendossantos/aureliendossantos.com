import "dotenv/config"
import enumerate from "../formatting/enumerateStrings"
import type { Logger } from "./loaders"
import type { IGDBData, IGDBImage } from "./igdbClient"

export default async function getIGDBgames(
	slugs?: string[],
	searchedName?: string,
	limit: number = 500,
	logger: Logger = console.log
) {
	if (!slugs && !searchedName) {
		logger("Error: No query parameters")
		return []
	}
	if (slugs)
		logger(`Getting IGDB data for ${slugs.length == 1 ? slugs[0] : `${slugs.length} games`}...`)

	const authentication = await fetch(
		`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_ID}&client_secret=${
			process.env.TWITCH_SECRET
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
				"Client-ID": process.env.TWITCH_ID!,
				Authorization: `Bearer ${token}`,
			},
			body: body,
		}
	}

	const slugQuery = slugs ? `where slug = (${slugs.map((slug) => `"${slug}"`).join()});` : ""
	const searchQuery = searchedName ? `search "${searchedName}";` : ""

	const games: IGDBData[] = await fetch(
		`https://api.igdb.com/v4/games`,
		parameters(
			`fields id, name, slug, cover.image_id, cover.width, cover.height, screenshots.image_id, screenshots.width, screenshots.height, platforms.abbreviation, first_release_date, release_dates.date, release_dates.y, release_dates.status.name, release_dates.platform.abbreviation, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, websites.category, websites.url, url; ${slugQuery} ${searchQuery} limit ${limit};`
		)
	).then((response) => response.json())

	// Throw if games searched by slug but result is undefined, [] or has no name. Does not throw if it is a search query.
	if (slugs && (!games || games.length == 0 || !("name" in games[0]))) {
		throw new Error(`Game not found: ${slugs?.[0]}: ${JSON.stringify(games)}`)
	}

	games.forEach((game) => {
		game.developers = enumerate(
			game.involved_companies?.filter((i) => i.developer).map((i) => i.company.name) || []
		)
		game.publishers = enumerate(
			game.involved_companies?.filter((i) => i.publisher).map((i) => i.company.name) || []
		)
	})
	logger(`Loaded ${slugs?.length == 1 ? slugs[0] : `${slugs?.length} games`}`)
	return games
}
