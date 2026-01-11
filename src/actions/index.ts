import { ActionError, defineAction } from "astro:actions"
import { z } from "astro:schema"
import { prisma } from "$prisma/prisma"
import slugify from "slugify"
import getIGDBgames from "$utils/remoteData/igdb"
import getTMDBmovie, { searchTMDBmovies } from "$utils/remoteData/tmdb"

export const server = {
	getEmotions: defineAction({
		handler: async () => {
			const emotions = await prisma.emotion.findMany({
				orderBy: { id: "asc" },
			})
			return { emotions }
		},
	}),
	searchWorks: defineAction({
		input: z.object({
			query: z.string(),
		}),
		handler: async (input) => {
			const works = await prisma.work.findMany({
				where: {
					title: {
						contains: input.query,
						mode: "insensitive",
					},
				},
				select: {
					id: true,
					title: true,
					authors: true,
					date: true,
					sourceCover: true,
				},
				take: 10,
				orderBy: {
					title: "asc",
				},
			})
			return { works }
		},
	}),
	searchInAPIs: defineAction({
		input: z.object({
			query: z.string(),
		}),
		handler: async (input) => {
			const [igdb, tmdb] = await Promise.all([
				getIGDBgames(undefined, input.query, 6),
				searchTMDBmovies(input.query, 4),
			])
			return { igdb, tmdb }
		},
	}),
	getIGDBdata: defineAction({
		input: z.object({
			slug: z.string(),
		}),
		handler: async (input) => {
			const igdb = await getIGDBgames([input.slug])
			return { igdb: igdb[0] }
		},
	}),
	getTMDBdata: defineAction({
		input: z.object({
			id: z.number(),
		}),
		handler: async (input) => {
			const tmdb = await getTMDBmovie(input.id)
			if (!tmdb) {
				throw new ActionError({ code: "NOT_FOUND", message: "TMDB movie not found" })
			}
			return { tmdb }
		},
	}),
	createWorkFromIGDB: defineAction({
		input: z.object({
			slug: z.string(),
		}),
		handler: async (input) => {
			const igdb = (await getIGDBgames([input.slug]))[0]
			const slug = await createWorkSlug({
				shortTitle: igdb.name,
				// First developer in the list
				author: igdb.involved_companies?.filter((i) => i.developer)[0]?.company.name,
				year: igdb.first_release_date && new Date(igdb.first_release_date * 1000).getFullYear(),
			})
			const work = await prisma.work.create({
				data: {
					id: slug,
					title: igdb.name,
					type: "VideoGame",
					sourceName: "IGDB",
					sourceId: igdb.id.toString(),
					sourceUrl: igdb.url,
					authors:
						igdb.involved_companies?.filter((i) => i.developer).map((i) => i.company.name) || [],
					publishers:
						igdb.involved_companies?.filter((i) => i.publisher).map((i) => i.company.name) || [],
					// Only take the first release date for each release type
					date: igdb.release_dates
						.sort((a, b) => (Number(a.date) || 0) - (Number(b.date) || 0))
						.reduce(
							(acc, date) => {
								const status = date.status?.name || "Full Release"
								// Remove releases that don't have a year (human error) or that are Advanced Access (AAA promotion strategy)
								if (date.y && status != "Advanced Access" && !acc[status]) acc[status] = date
								return acc
							},
							{} as Record<string, (typeof igdb.release_dates)[number]>
						),
					sourceCover: `https://images.igdb.com/igdb/image/upload/t_original/${igdb.cover.image_id}.jpg`,
					sourceScreenshots:
						igdb.screenshots?.map(
							(screenshot) =>
								`https://images.igdb.com/igdb/image/upload/t_original/${screenshot.image_id}.jpg`
						) || [],
				},
			})
			return { work }
		},
	}),
	createWorkFromTMDB: defineAction({
		input: z.object({
			id: z.number(),
		}),
		handler: async (input) => {
			const tmdb = await getTMDBmovie(input.id)
			if (!tmdb) {
				throw new ActionError({ code: "NOT_FOUND", message: "TMDB movie not found" })
			}
			const year = tmdb.release_date ? new Date(tmdb.release_date).getFullYear() : undefined
			const directors = tmdb.credits.crew.filter((c) => c.job === "Director").map((c) => c.name)
			const slug = await createWorkSlug({
				shortTitle: tmdb.title,
				author: directors[0],
				year,
			})
			const work = await prisma.work.create({
				data: {
					id: slug,
					title: tmdb.title,
					type: "Movie",
					sourceName: "TMDB",
					sourceId: tmdb.id.toString(),
					sourceUrl: `https://www.themoviedb.org/movie/${tmdb.id}`,
					authors: directors,
					publishers: tmdb.production_companies.map((c) => c.name),
					date: year ? { Release: { y: year } } : undefined,
					sourceCover: tmdb.poster_path
						? `https://image.tmdb.org/t/p/original${tmdb.poster_path}`
						: null,
					sourceScreenshots: tmdb.images.backdrops
						? tmdb.images.backdrops
								.slice(0, 10)
								.map((img) => `https://image.tmdb.org/t/p/original${img.file_path}`)
						: [],
				},
			})
			return { work }
		},
	}),
	createReview: defineAction({
		input: z.object({
			workId: z.string(),
			emotionIds: z.array(z.number()),
			content: z.string().optional(),
			score: z.number().min(0).max(5),
			createdAt: z.date().optional(),
		}),
		handler: async (input) => {
			const work = await prisma.work.findUnique({ where: { id: input.workId } })
			if (!work) {
				throw new ActionError({ code: "NOT_FOUND", message: "Work not found" })
			}
			const review = await prisma.review.create({
				data: {
					workId: input.workId,
					content: input.content || null,
					score: input.score,
					...(input.createdAt && { createdAt: input.createdAt }),
					emotions: {
						connect: input.emotionIds.map((id) => ({ id })),
					},
				},
			})
			return { id: review.id }
		},
	}),
}

/**
 * Creates a unique slug for a new work.
 * Tries `title-year`, then `title-author-year`, then `title-author-year-2`, etc.
 * If no year is given, tries `title-author`, then `title-author-2`, etc.
 * @param shortTitle the English title of the work, without subtitles.
 * @param author the last name of the author, eg. "Bergman".
 * @returns the slug.
 */
const createWorkSlug = async (params: { shortTitle: string; author?: string; year?: number }) => {
	const { shortTitle, author, year } = params
	const regex = /[*+~.()'"!:@«»]/g
	const t = slugify(shortTitle, { remove: regex, lower: true })
	const a = author && slugify(author, { remove: regex, lower: true })
	const y = year && year.toString().length == 4 ? year : undefined
	const shortSlug = y ? `${t}-${y}` : a ? `${t}-${a}` : t
	if (!(await doesSlugExist(shortSlug))) return shortSlug
	const longStart = a ? `${t}-${a}` : t
	const longEnd = y ? `-${y}` : ""
	const longSlug = `${longStart}${longEnd}`
	if (!(await doesSlugExist(longSlug))) return longSlug
	let i = 2
	while (true) {
		const numberedSlug = `${longSlug}-${i}`
		if (!(await doesSlugExist(numberedSlug))) return numberedSlug
		i += 1
	}
}

const doesSlugExist = async (slug: string) => {
	console.log(`Checking if slug exists: ${slug}`)
	return Boolean(await prisma.work.findUnique({ where: { id: slug } }))
}
