import { defineCollection, z } from "astro:content"
import { Palettes } from "$utils/palettes"
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
				opengraph: image().optional(),
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
				places: z.array(z.string()).default([]),
			}),
	}),
	pages: defineCollection({
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				description: z.string().optional(),
				opengraph: image().optional(),
				image: image().optional(),
				imageAnchorTop: z.boolean().optional(),
				cover: z.boolean().default(false),
				customLayout: z.boolean().default(false),
				toc: z.boolean().default(false),
				depth: z.onumber(),
				draft: z.boolean().default(false),
				palette: z.nativeEnum(Palettes).default(Palettes.default),
				layouts: z.array(z.string()).default(["classic"]),
			}),
	}),
	diary: defineCollection({
		schema: () =>
			z.object({
				title: z.string(),
				date: z.date().optional(),
				draft: z.boolean().default(false),
				places: z.array(z.string()).default([]),
				mapLat: z.number().optional(),
				mapLng: z.number().optional(),
				mapZoom: z.number().optional(),
				customLayout: z.boolean().default(false),
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
	places: defineCollection({
		schema: z.object({
			title: z.string(),
			id: z.string(),
			status: z.enum(["todo", "done"]),
			review: z.enum(["loved", "liked", "okay"]).optional(),
			hide: z.boolean().default(false),
		}),
	}),
	gear: defineCollection({
		schema: z.object({
			name: z.string(),
			etat: z.string(),
			utilisation: z.string().optional(),
			obtained: z.date().optional(),
			obtainedInfo: z.string().optional(),
			price: z.string().optional(),
			clickable: z.boolean().default(false),
		}),
	}),
}
