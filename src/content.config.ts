import { defineCollection, reference, z, type ImageFunction } from "astro:content"
import { parse as parseCsv } from "csv-parse/sync"
import { PaletteName } from "$utils/design/palettes"
import { Layouts } from "$utils/design/layouts"
import { glob, file } from "astro/loaders"
import { gamesLibraryLoader, notionWikiLoader } from "$utils/remoteData/loaders"

enum Lang {
	fr = "fr",
	en = "en",
	es = "es",
	jp = "jp",
	it = "it",
}
export const multilingualText = z.object({
	...Object.fromEntries(Object.values(Lang).map((lang) => [lang, z.string().optional()])),
	original: z.nativeEnum(Lang),
})

export const months = [
	"jan",
	"feb",
	"mar",
	"apr",
	"may",
	"jun",
	"jul",
	"aug",
	"sep",
	"oct",
	"nov",
	"dec",
] as const
export const date = z.object({
	y: z.number().optional(),
	m: z.number().or(z.enum(months)).optional(),
	d: z.number().optional(),
	precision: z.enum(["decade", "around"]).optional(),
})
export const period = z.array(date).length(2)

const sidenotesOptions = z.object({
	label: z.enum(["number", "symbol", "none"]).default("none"),
	toggle: z.boolean().default(false),
	visible: z.boolean().default(true),
	removeFootnotes: z.boolean().default(true),
	layoutOnly: z.boolean().default(false),
})

const links = {
	tags: z.array(reference("tags")).default([]),
	games: z.array(z.string()).default([]),
	books: z.array(z.string()).default([]),
	movies: z.array(z.number()).default([]),
	places: z.array(reference("places")).default([]),
	gear: z.array(reference("gear")).default([]),
	muses: z.array(reference("muses")).default([]),
}

const articleView = {
	title: z.string(),
	description: z.string().optional(),
	longDesc: z.string().optional(),
	date: z.date().optional(),
	license: z.string().optional(),
	imageAnchorTop: z.boolean().optional(),
	cover: z.boolean().default(false),
	toc: z.boolean().default(false),
	depth: z.onumber(),
	palette: z.nativeEnum(PaletteName).default(PaletteName.default),
	layouts: z.array(z.nativeEnum(Layouts)).default([Layouts.classic]),
	customLayout: z.boolean().default(false),
	forceNarrow: z.boolean().default(false),
	sidenotes: sidenotesOptions.optional(),
	draft: z.boolean().default(false),
}
// TODO: generate slug for diary etc: https://github.com/Princesseuh/erika.florist/blob/c4145d68d58fb0b0855b169ed56a23a233922ede/src/content/config.ts#L45
// TODO: later (after first content commit) move collection folders to subfolders

/**
 * Loader for Markdown and MDX files not starting with an underscore.
 */
const mdLoader = (folder: string) =>
	glob({ pattern: "**/[^_]*.md*", base: `src/content/${folder}` })

const imageInfo = (image: ImageFunction) =>
	z.object({
		file: image(),
		anchorTop: z.number().optional(),
		anchorLeft: z.number().optional(),
		desktopVersion: z.string().optional(),
		paperEffect: z.boolean().default(false),
	})
const videoInfo = z.object({
	hq: z.string(),
	compatible: z.string().optional(),
	anchorTop: z.number().optional(),
	anchorLeft: z.number().optional(),
})

export const collections = {
	tags: defineCollection({
		loader: file("src/content/tags.csv", {
			parser: (text) =>
				parseCsv(text, { columns: true, skipEmptyLines: true, relaxColumnCountLess: true }),
		}),
		schema: z.object({
			title: z.string(),
			plural: z.string().optional(),
			type: z.enum(["tool", "type"]).optional(),
		}),
	}),
	muses: defineCollection({
		loader: file("src/content/muses.csv", {
			parser: (text) =>
				parseCsv(text, { columns: true, skipEmptyLines: true, relaxColumnCountLess: true }),
		}),
		schema: z.object({
			title: z.string(),
			fullTitle: z.string().optional(),
		}),
	}),
	blog: defineCollection({
		loader: mdLoader("blog"),
		schema: ({ image }) =>
			z.object({
				...articleView,
				date: z.date(),
				highlight: z.boolean().default(false),
				image: image().optional(),
				opengraph: image().optional(),
				...links,
			}),
	}),
	pages: defineCollection({
		loader: mdLoader("pages"),
		schema: ({ image }) =>
			z.object({
				...articleView,
				image: image().optional(),
				opengraph: image().optional(),
				parent: z.string().optional(),
				seeAlso: z.array(z.string()).default([]),
				...links,
			}),
	}),
	diary: defineCollection({
		loader: mdLoader("diary"),
		schema: ({ image }) =>
			z.object({
				...articleView,
				end: z.date().optional(),
				highlight: z.boolean().default(false),
				image: image().optional(),
				mapLat: z.number().optional(),
				mapLng: z.number().optional(),
				mapZoom: z.number().optional(),
				hidePlaces: z.boolean().default(false),
				palette: z.nativeEnum(PaletteName).optional(),
				customLayout: z.boolean().default(false),
				...links,
			}),
	}),
	portfolio: defineCollection({
		loader: mdLoader("portfolio"),
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				description: z.string().optional(),
				toc: z.boolean().default(false),
				lede: z.string().optional(),
				date: date.or(period),
				client: z.string().optional(),
				roles: z.array(z.string()).default([]),
				moreRoles: z.array(z.string()).default([]),
				tools: z.array(z.string()).default([]),
				moreTools: z.array(z.string()).default([]),
				links: z.array(z.object({ url: z.string(), title: z.string() })).default([]),
				linkTitle: z.string().optional(),
				image: imageInfo(image).optional(),
				video: videoInfo.optional(),
				carousel: z.array(imageInfo(image).or(videoInfo)).optional(),
				carouselAspect: z.string().optional(),
				overview: z.array(z.array(z.string()).nonempty()).optional(),
				appearIn: z.array(z.enum(["pedagogique", "web", "jeux"])),
				...links,
			}),
	}),
	resume: defineCollection({
		loader: mdLoader("resume"),
		schema: z.object({
			title: z.string(),
		}),
	}),
	places: defineCollection({
		loader: mdLoader("places"),
		schema: z.object({
			title: z.string(),
			id: z.string(),
			status: z.enum(["todo", "done"]),
			review: z.enum(["loved", "liked", "okay", "disliked"]).optional(),
			hide: z.boolean().default(false),
		}),
	}),
	gear: defineCollection({
		loader: mdLoader("gear"),
		schema: z.object({
			title: z.string(),
			etat: z.string(),
			utilisation: z.string().optional(),
			obtained: z.date().optional(),
			obtainedInfo: z.string().optional(),
			price: z.string().optional(),
			clickable: z.boolean().default(false),
		}),
	}),
	collections: defineCollection({
		loader: mdLoader("collections"),
		schema: z.object({
			title: z.string().or(multilingualText),
			highlight: reference("pieces"),
		}),
	}),
	pieces: defineCollection({
		loader: mdLoader("pieces"),
		schema: ({ image }) =>
			z.object({
				// If a work is untitled: false. It the title is unknown: undefined.
				title: z.string().or(z.literal(false)).or(multilingualText).optional(),
				author: z.string().or(multilingualText).optional(),
				date: date.or(period).optional(),
				collections: z.array(reference("collections")).default([]),
				image: image().optional(),
				audio: z.string().optional(),
				audioFormat: z.enum(["mp3", "flac"]).optional(),
				fileSource: z.string().url().optional(),
				type: z.nativeEnum(PieceType),
				technique: z
					.enum([
						"oil",
						"oil-cardboard",
						"watercolor",
						"pencil-and-watercolor",
						"graphite-on-tracing-paper",
					])
					.optional(),
				style: z.enum(["color", "black-and-white"]).optional(),
				subjects: z
					.array(z.enum(["portrait", "nude", "landscape", "still-life", "abstract"]))
					.optional(),
				album: z.string().optional(),
			}),
	}),
	wiki: defineCollection({
		loader: notionWikiLoader({ forceUpdate: false }),
	}),
	games: defineCollection({
		loader: gamesLibraryLoader({ forceUpdate: false }),
	}),
	recipes: defineCollection({
		loader: mdLoader("recipes"),
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				ingredients: z
					.array(
						reference("ingredients").or(z.tuple([reference("ingredients"), z.string().nullish()]))
					)
					.default([]),
				tags: z.array(z.string()).default([]),
				cover: image().optional(),
				draft: z.boolean().default(false),
			}),
	}),
	ingredients: defineCollection({
		loader: mdLoader("ingredients"),
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				tags: z.array(z.string()).default([]),
				icon: image().optional(),
			}),
	}),
}

export enum PieceType {
	painting = "painting",
	drawing = "drawing",
	photo = "photo",
	digital = "digital",
	album = "album",
	track = "track",
	movie = "movie",
}
