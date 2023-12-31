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

export const toast = (message: string, number = 2500) => {
	const toast = document.querySelector("#toast") as HTMLDivElement
	toast.innerText = message
	toast.classList.remove("invisible")
	toast.classList.remove("opacity-0")
	toast.classList.add("opacity-100")
	setTimeout(() => {
		toast.classList.add("opacity-0")
		toast.classList.remove("opacity-100")
		setTimeout(() => {
			toast.classList.add("invisible")
		}, 160)
	}, number)
}
