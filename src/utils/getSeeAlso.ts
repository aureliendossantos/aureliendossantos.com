import { getEntry } from "astro:content"
import type { NavBarProps } from "./navbar"

function capitalize(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * If the slug can't be found in the pages collection, it's assumed that it's a .astro page.
 * @param slugs slugs from the pages collection or from a .astro page
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
