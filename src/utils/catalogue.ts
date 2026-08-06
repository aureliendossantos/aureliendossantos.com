import type { Prisma, WorkType } from "generated/prisma/client"

import { prisma } from "$prisma/prisma"

const workTypes: WorkType[] = [
	"VideoGame",
	"BoardGame",
	"Movie",
	"TvShow",
	"Book",
	"MusicAlbum",
	"MusicTrack",
]

export const catalogueWorkTypeOptions = [
	{ value: "VideoGame", label: "Jeux vidéo" },
	{ value: "BoardGame", label: "Jeux de société" },
	{ value: "Movie", label: "Films" },
	{ value: "TvShow", label: "Séries" },
	{ value: "Book", label: "Livres" },
	{ value: "MusicAlbum", label: "Albums" },
	{ value: "MusicTrack", label: "Morceaux" },
] as const

export const catalogueScoreOptions = [
	{ value: 0, label: "Pas de score" },
	{ value: 1, label: "Détesté" },
	{ value: 2, label: "Déçu" },
	{ value: 3, label: "Aimé" },
	{ value: 4, label: "Coup de cœur" },
	{ value: 5, label: "Chef-d'œuvre" },
] as const

export const catalogueSortOptions = [
	{ value: "createdAt-desc", label: "Plus récent" },
	{ value: "createdAt-asc", label: "Plus ancien" },
	{ value: "score-desc", label: "Score décroissant" },
	{ value: "score-asc", label: "Score croissant" },
	{ value: "title-asc", label: "Titre A → Z" },
	{ value: "title-desc", label: "Titre Z → A" },
] as const

type CatalogueSortField = "createdAt" | "score" | "title"
type CatalogueSortOrder = "asc" | "desc"

export type CatalogueFilters = {
	q: string
	types: WorkType[]
	scores: number[]
	emotions: number[]
	sortField: CatalogueSortField
	sortOrder: CatalogueSortOrder
}

const multiValue = (searchParams: URLSearchParams, key: string) =>
	searchParams
		.getAll(key)
		.flatMap((v) => v.split(","))
		.map((v) => v.trim())
		.filter(Boolean)

const parseSort = (
	value: string | null
): {
	field: CatalogueSortField
	order: CatalogueSortOrder
} => {
	if (!value) return { field: "createdAt", order: "desc" }
	const [field, order] = value.split("-")
	if (!field || !order) return { field: "createdAt", order: "desc" }
	if (!["createdAt", "score", "title"].includes(field)) return { field: "createdAt", order: "desc" }
	if (!["asc", "desc"].includes(order)) return { field: "createdAt", order: "desc" }
	return {
		field: field as CatalogueSortField,
		order: order as CatalogueSortOrder,
	}
}

export const parseCatalogueFilters = (searchParams: URLSearchParams): CatalogueFilters => {
	const { field: sortField, order: sortOrder } = parseSort(searchParams.get("sort"))
	return {
		q: (searchParams.get("q") || "").trim(),
		types: multiValue(searchParams, "type").filter((t): t is WorkType => workTypes.includes(t as WorkType)),
		scores: multiValue(searchParams, "score")
			.map((n) => Number.parseInt(n, 10))
			.filter((n) => Number.isInteger(n) && n >= 0 && n <= 5),
		emotions: multiValue(searchParams, "emotion")
			.map((n) => Number.parseInt(n, 10))
			.filter((n) => Number.isInteger(n) && n > 0),
		sortField,
		sortOrder,
	}
}

export const toSortValue = (filters: Pick<CatalogueFilters, "sortField" | "sortOrder">) =>
	`${filters.sortField}-${filters.sortOrder}`

export const getCatalogueReviews = async (filters: CatalogueFilters) => {
	const where: Prisma.ReviewWhereInput = {
		AND: [
			...(filters.q
				? [
						{
							OR: [
								{ content: { contains: filters.q, mode: "insensitive" } },
								{ work: { title: { contains: filters.q, mode: "insensitive" } } },
							],
						} satisfies Prisma.ReviewWhereInput,
					]
				: []),
			...(filters.types.length
				? [{ work: { type: { in: filters.types } } } satisfies Prisma.ReviewWhereInput]
				: []),
			...(filters.scores.length ? [{ score: { in: filters.scores } } satisfies Prisma.ReviewWhereInput] : []),
			...(filters.emotions.length
				? [{ emotions: { some: { id: { in: filters.emotions } } } } satisfies Prisma.ReviewWhereInput]
				: []),
		],
	}

	let orderBy: Prisma.ReviewOrderByWithRelationInput
	if (filters.sortField === "title") {
		orderBy = { work: { title: filters.sortOrder } }
	} else {
		orderBy = { [filters.sortField]: filters.sortOrder }
	}

	const reviews = await prisma.review.findMany({
		where,
		orderBy,
		include: {
			work: true,
			emotions: true,
		},
	})

	return reviews
}
