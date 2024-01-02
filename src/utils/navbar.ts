export const navbarIsOpened = () => {
	return !(document.querySelector("#navbar") as HTMLDivElement).classList.contains("invisible")
}

export const toggleNavbar = () => {
	const navbar = document.querySelector("#navbar") as HTMLDivElement
	if (navbar.classList.contains("invisible")) {
		navbar.classList.remove("invisible")
		setTimeout(() => {
			navbar.classList.remove("-bottom-7")
			navbar.classList.add("bottom-0")
		}, 10)
	} else {
		navbar.classList.add("-bottom-7")
		navbar.classList.remove("bottom-0")
		setTimeout(() => {
			navbar.classList.add("invisible")
		}, 160)
	}
}

export const closePopupNavbar = () => {
	;(document.querySelector("#navbar-popup-actions") as HTMLDivElement).classList.add("hidden")
	;(document.querySelector("#navbar-main-actions") as HTMLDivElement).classList.remove("hidden")
}

export const openPopupNavbar = (
	title: string,
	librarySlug?: string,
	links?: { title: string; shortTitle?: string; url: string }[]
) => {
	// Toggle visibility
	;(document.querySelector("#navbar-main-actions") as HTMLDivElement).classList.add("hidden")
	;(document.querySelector("#navbar-popup-actions") as HTMLDivElement).classList.remove("hidden")
	// Title
	const titleParent = document.querySelector("#navbar-popup-title-parent") as HTMLDivElement
	const titleText = document.querySelector("#navbar-popup-title-text") as HTMLDivElement
	titleText.innerText = title
	// If there are two links or more, the title would take too much space so we hide it on mobile
	if (links && links.length >= 2) titleParent.classList.add("medium:hidden")
	else titleParent.classList.remove("medium:hidden")
	// Library link
	const libraryLink = document.querySelector("#navbar-popup-library") as HTMLLinkElement
	if (librarySlug) {
		libraryLink.classList.remove("hidden")
		libraryLink.href = `/games/${librarySlug}`
	} else {
		libraryLink.classList.add("hidden")
	}
	// External links
	;[0, 1, 2].forEach((i) => {
		const link = document.querySelector(`#navbar-popup-link-${i + 1}`) as HTMLLinkElement
		const text = document.querySelector(`#navbar-popup-link-${i + 1}-text`) as HTMLDivElement
		const shortText = document.querySelector(
			`#navbar-popup-link-${i + 1}-short-text`
		) as HTMLDivElement
		if (links && links[i]) {
			link.classList.remove("hidden")
			link.href = links[i].url
			text.innerText = links[i].title
			shortText.innerText = links[i].shortTitle || links[i].title
		} else {
			link.classList.add("hidden")
		}
	})
}

export const isMac = () => {
	const platform = navigator.platform.toLowerCase()
	return platform.includes("mac")
}

export const isTouchScreen = () => {
	const platform = navigator.platform.toLowerCase()
	const touchPlatforms = ["iphone", "ipod", "ipad", "android", "blackberry"]
	return touchPlatforms.some((p) => platform.includes(p))
}

export const getToggleText = (touchScreenText: string) => {
	if (isTouchScreen()) return touchScreenText
	if (isMac()) return "⌘K"
	return "Ctrl+K"
}

export const toast = (message: string, number = 2500, position: "left" | "right" = "left") => {
	const toast = document.querySelector("#toast") as HTMLDivElement
	if (position === "left") {
		toast.classList.add("left-0")
		toast.classList.remove("right-0")
	} else {
		toast.classList.remove("left-0")
		toast.classList.add("right-0")
	}
	toast.innerText = message
	toast.classList.remove("invisible")
	toast.classList.remove("opacity-0")
	toast.classList.add("opacity-100")
	if (!window.toastsOpened) window.toastsOpened = 1
	else window.toastsOpened += 1
	setTimeout(() => {
		window.toastsOpened -= 1
		if (window.toastsOpened > 0) return
		toast.classList.add("opacity-0")
		toast.classList.remove("opacity-100")
		setTimeout(() => {
			toast.classList.add("invisible")
		}, 160)
	}, number)
}
