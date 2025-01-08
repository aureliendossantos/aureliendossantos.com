import { getEntry } from "astro:content"
import type { NavBarProps } from "./navbar"

function capitalize(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * "See also" is like "related articles" but for pages. Unlike articles, it's a list of manually defined IDs.
 * If the ID corresponds to an entry in the pages collection, we display its title.
 * If the entry can't be found, it's assumed that it's an `.astro` page slug. We simply capitalize the ID and hope that the result will look good.
 * @param ids IDs from the pages collection or an .astro page slug
 * @see `getRelatedArticles.ts`
 */
export default async function getSeeAlso(ids: string[]): Promise<NavBarProps["related"]> {
	return await Promise.all(
		ids.map(async (id) => {
			const entry = await getEntry("pages", id)
			if (entry) return { title: entry.data.title, href: `/${id}` }
			return { title: capitalize(id), href: `/${id}` }
		})
	)
}
