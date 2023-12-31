export const toggleNavbar = () => {
	const navbar = document.querySelector("#navbar") as HTMLDivElement
	if (navbar.classList.contains("invisible")) {
		window.mediumZoom.update({
			container: {
				height: window.innerHeight - 28,
			},
		})
		navbar.classList.remove("invisible")
		setTimeout(() => {
			navbar.classList.remove("-bottom-7")
			navbar.classList.add("bottom-0")
		}, 10)
	} else {
		window.mediumZoom.update({
			container: {
				height: window.innerHeight,
			},
		})
		navbar.classList.add("-bottom-7")
		navbar.classList.remove("bottom-0")
		setTimeout(() => {
			navbar.classList.add("invisible")
		}, 160)
	}
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
