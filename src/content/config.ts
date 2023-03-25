import { image, defineCollection, z } from "astro:content"
import { Palettes } from "$utils/palettes"
// Export a single `collections` object to register your collection(s)
// This key should match your collection directory name in "src/content"
export const collections = {
	blog: defineCollection({
		schema: z.object({
			title: z.string(),
			description: z.string().optional(),
			date: z.date(),
			location: z.string().optional(),
			categories: z.array(z.string()).optional(),
			tags: z.array(z.string()).optional(),
			image: image().optional(),
			cover: z.boolean().default(false),
			license: z.string().optional(),
			customLayout: z.boolean().default(false),
			draft: z.boolean().default(false),
			palette: z.nativeEnum(Palettes).default(Palettes.default),
		}),
	}),
	tufte: defineCollection({
		schema: z.object({
			title: z.string(),
			description: z.string().optional(),
			date: z.date(),
			location: z.string().optional(),
			categories: z.array(z.string()).optional(),
			tags: z.array(z.string()).optional(),
			image: image().optional(),
			draft: z.boolean().default(false),
			palette: z.nativeEnum(Palettes).default(Palettes.default),
		}),
	}),
	pages: defineCollection({
		schema: z.object({
			title: z.string(),
			description: z.string().optional(),
			image: image().optional(),
			cover: z.boolean().default(false),
			draft: z.boolean().default(false),
			palette: z.nativeEnum(Palettes).default(Palettes.default),
		}),
	}),
	portfolio: defineCollection({
		schema: z.object({
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
