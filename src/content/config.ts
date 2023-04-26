import { defineCollection, z } from "astro:content"
import { Palettes } from "$utils/palettes"
import { Places } from "$utils/places"
// Export a single `collections` object to register your collection(s)
// This key should match your collection directory name in "src/content"
export const collections = {
	blog: defineCollection({
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				description: z.string().optional(),
				date: z.date(),
				categories: z.array(z.string()).default([]),
				tags: z.array(z.string()).default([]),
				image: image().optional(),
				imageAnchorTop: z.boolean().optional(),
				cover: z.boolean().default(false),
				license: z.string().optional(),
				customLayout: z.boolean().default(false),
				toc: z.boolean().default(false),
				depth: z.onumber(),
				draft: z.boolean().default(false),
				palette: z.nativeEnum(Palettes).default(Palettes.default),
				layouts: z.array(z.string()).default(["classic"]),
				games: z.array(z.string()).default([]),
				books: z.array(z.string()).default([]),
				places: z.array(z.nativeEnum(Places)).default([]),
			}),
	}),
	tufte: defineCollection({
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				description: z.string().optional(),
				date: z.date(),
				categories: z.array(z.string()).default([]),
				tags: z.array(z.string()).default([]),
				image: image().optional(),
				imageAnchorTop: z.boolean().optional(),
				draft: z.boolean().default(false),
				palette: z.nativeEnum(Palettes).default(Palettes.default),
				games: z.array(z.string()).optional(),
				books: z.array(z.string()).optional(),
				places: z.array(z.nativeEnum(Places)).default([]),
			}),
	}),
	pages: defineCollection({
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				description: z.string().optional(),
				image: image().optional(),
				cover: z.boolean().default(false),
				toc: z.boolean().default(false),
				depth: z.onumber(),
				draft: z.boolean().default(false),
				palette: z.nativeEnum(Palettes).default(Palettes.default),
				layouts: z.array(z.string()).default(["classic"]),
			}),
	}),
	portfolio: defineCollection({
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				description: z.string().optional(),
				lede: z.string().optional(),
				release: z.date().optional(),
				client: z.string().optional(),
				roles: z.array(z.string()).default([]),
				moreRoles: z.array(z.string()).default([]),
				tools: z.array(z.string()).default([]),
				moreTools: z.array(z.string()).default([]),
				link: z.string().optional(),
				linkTitle: z.string().optional(),
				image: image().optional(),
			}),
	}),
}
