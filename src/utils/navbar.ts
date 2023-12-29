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
	const homeButton = document.querySelector("#blog-home-navbar-toggle") as HTMLButtonElement
	// If this button is found, we are on the homepage and we should make the button :active for a short time to animate it
	if (homeButton) {
		homeButton.classList.add("active")
		setTimeout(() => {
			homeButton.classList.remove("active")
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
