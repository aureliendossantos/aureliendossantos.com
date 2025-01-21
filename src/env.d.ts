/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
	mediumZoom: import("medium-zoom").Zoom
	popupsOpened: number
	popupZindex: number
	nextPageIsLoading: boolean
	toastsOpened: number
	entries: import("$utils/search").SearchEntry[]
}
