// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content"
// 2. Define a schema for each collection you'd like to validate.
const blogCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		date: z.date(),
		categories: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		image: z.string().optional(),
		draft: z.boolean().default(false),
	}),
})
// 3. Export a single `collections` object to register your collection(s)
export const collections = {
	blog: blogCollection,
}
