// This script contains types and functions that can be imported client-side

export default function getTMDBimageUrl(
	size: BackdropSize | LogoSize | PosterSize | ProfileSize | StillSize,
	path: string
) {
	return `https://image.tmdb.org/t/p/${size == "original" ? size : `w${size}`}${path}`
}

const iso_639_1_toLocale = (iso_639_1: string | null) => {
	switch (iso_639_1) {
		case "en":
			return "en"
		case "fr":
			return "fr"
		case null:
			return "any"
		default:
			console.warn(`Unsupported ISO 639-1 code: ${iso_639_1}`)
			return null
	}
}

export type TMDBData = {
	adult: boolean
	backdrop_path: string
	belongs_to_collection: string
	budget: number
	genres: Array<{ id: number; name: string }>
	homepage: string
	id: number
	imdb_id: string
	original_language: string
	original_title: string
	overview: string
	popularity: number
	poster_path: string
	production_companies: Array<{
		id: number
		logo_path: string
		name: string
		origin_country: string
	}>
	production_countries: Array<{
		iso_3166_1: string
		name: string
	}>
	release_date: string
	revenue: number
	runtime: number
	spoken_languages: Array<{
		english_name: string
		iso_639_1: string
		name: string
	}>
	status: string
	tagline: string
	title: string
	video: boolean
	vote_average: number
	vote_count: number
}

type TMDBImages = {
	backdrops: Array<{
		aspect_ratio: number
		height: number
		iso_639_1: string
		file_path: string
		vote_average: number
		vote_count: number
		width: number
	}>
	id: number
	logos: Array<{
		aspect_ratio: number
		height: number
		iso_639_1: string
		file_path: string
		vote_average: number
		vote_count: number
		width: number
	}>
	posters: Array<{
		aspect_ratio: number
		height: number
		iso_639_1: string
		file_path: string
		vote_average: number
		vote_count: number
		width: number
	}>
}

type TMDBCredits = {
	cast: Array<{
		adult: boolean
		gender: number
		id: number
		known_for_department: string
		name: string
		original_name: string
		popularity: number
		profile_path: string | null
		cast_id: number
		character: string
		credit_id: string
		order: number
	}>
	crew: Array<{
		adult: boolean
		gender: number
		id: number
		known_for_department: string
		name: string
		original_name: string
		popularity: number
		profile_path: string | null
		credit_id: string
		department: string
		job: string
	}>
}

export type TMDBResponse = TMDBData & { images: TMDBImages; credits: TMDBCredits }

export type TMDBSearchResult = {
	adult: boolean
	backdrop_path: string | null
	genre_ids: number[]
	id: number
	original_language: string
	original_title: string
	overview: string
	popularity: number
	poster_path: string | null
	release_date: string
	title: string
	video: boolean
	vote_average: number
	vote_count: number
}

type BackdropSize = 300 | 780 | 1280 | 1920 | "original"
type LogoSize = 45 | 92 | 154 | 185 | 300 | 500 | "original"
type PosterSize = 92 | 154 | 185 | 342 | 500 | 780 | "original"
type ProfileSize = 45 | 185 | 632 | "original"
type StillSize = 92 | 185 | 300 | "original"
