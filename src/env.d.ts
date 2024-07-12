/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
	mediumZoom: import("medium-zoom").Zoom
	popupsOpened: number
	popupZindex: number
	nextPageIsLoading: boolean
	toastsOpened: number
	initAllMaps: () => void
	diaryFilters: {
		[key: string]: boolean
	}
	entries: SearchEntry[]
	previousUrl: string
	previousTitle: string
	changeGameState: (
		state: "intro" | "create" | "login" | "overview" | "fullscreen" | "error",
		characterId?: "string" | null,
		message?: "string"
	) => void
	gameState: "intro" | "create" | "login" | "overview" | "fullscreen"
}
