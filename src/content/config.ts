import { z, defineCollection } from "astro:content"
import { Palettes } from "src/utils/palettes"
// Export a single `collections` object to register your collection(s)
// This key should match your collection directory name in "src/content"
export const collections = {
	blog: defineCollection({
		schema: z.object({
			title: z.string(),
			description: z.string().optional(),
			date: z.date(),
			categories: z.array(z.string()).optional(),
			tags: z.array(z.string()).optional(),
			image: z.string().optional(),
			cover: z.boolean().default(false),
			draft: z.boolean().default(false),
			palette: z.nativeEnum(Palettes).default(Palettes.default),
		}),
	}),
}
