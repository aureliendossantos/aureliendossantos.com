/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import("medium-zoom").then((module) => {
	window.mediumZoom = module.default
})

interface Window {
	mediumZoom: Zoom
	popupZindex: number
	nextPageIsLoading: boolean
	toastsOpened: number
	initAllMaps: () => void
}
