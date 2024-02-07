import { getEntry } from "astro:content"
import type { NavBarProps } from "./navbar"

function capitalize(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * "See also" is like "related articles" but for pages. Unlike articles, it's a list of manually defined slugs.
 * If the slug corresponds to an entry in the pages collection, we display its title.
 * If the entry can't be found, it's assumed that it's an `.astro` page. We simply capitalize the slug and hope that the result will look good.
 * @param slugs slugs from the pages collection or from a .astro page
 * @see `getRelatedArticles.ts`
 */
export default async function getSeeAlso(slugs: string[]): Promise<NavBarProps["related"]> {
	return await Promise.all(
		slugs.map(async (slug) => {
			const entry = await getEntry("pages", slug)
			if (entry) return { title: entry.data.title, href: `/${slug}` }
			return { title: capitalize(slug), href: `/${slug}` }
		})
	)
}
