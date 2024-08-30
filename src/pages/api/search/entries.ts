import { getSearchEntries } from "$utils/search"

// TODO [...lang] param
export async function GET() {
	return new Response(JSON.stringify(await getSearchEntries()))
}
