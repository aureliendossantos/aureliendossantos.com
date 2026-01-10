// This script contains types and functions that can be imported client-side, so they cannot be in igdb.ts which imports dotenv/config, causing issues in client-side code.

export default function getIGDBimageUrl(
	imageId: string,
	size: IGDBImageSize,
	retina: boolean = false
) {
	return `https://images.igdb.com/igdb/image/upload/t_${size}${retina ? "_2x" : ""}/${imageId}.jpg`
}

export type IGDBData = {
	id: number
	name: string
	slug: string
	cover: IGDBImage
	screenshots: IGDBImage[]
	platforms: { abbreviation: string }[]
	first_release_date: number
	release_dates: {
		id: number
		date?: number
		y?: number
		status?: { id: number; name: string }
		platform: { id: number; abbreviation: string }
	}[]
	involved_companies?: { developer: boolean; publisher: boolean; company: { name: string } }[]
	websites: { category: number; url: string }[]
	url: string
	developers?: string
	publishers?: string
}

export type IGDBImage = {
	image_id: string
	width: number
	height: number
}

/* cover_small	90 x 128	Fit
screenshot_med	569 x 320	Lfill, Center gravity
cover_big	264 x 374	Fit
logo_med	284 x 160	Fit
screenshot_big	889 x 500	Lfill, Center gravity
screenshot_huge	1280 x 720	Lfill, Center gravity
thumb	90 x 90	Thumb, Center gravity
micro	35 x 35	Thumb, Center gravity
720p	1280 x 720	Fit, Center gravity
1080p	1920 x 1080	Fit, Center gravity */
// By appending _2x to any size, you can get retina (DPR 2.0) sizes

export type IGDBImageSize =
	| "cover_small"
	| "screenshot_med"
	| "cover_big"
	| "logo_med"
	| "screenshot_big"
	| "screenshot_huge"
	| "thumb"
	| "micro"
	| "720p"
	| "1080p"
	| "original"
