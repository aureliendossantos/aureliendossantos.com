/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
module.exports = {
	content: ["./src/**/*.{astro,md,mdx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				"work-sans": ["Work Sans", ...defaultTheme.fontFamily.sans],
				mono: "monospace",
				"sofia-sans": ["Sofia Sans", ...defaultTheme.fontFamily.sans],
				"space-grotesk": ["Space Grotesk", ...defaultTheme.fontFamily.sans],
				"space-mono": ["Space Mono", ...defaultTheme.fontFamily.mono],
			},
			opacity: {
				15: ".15",
			},
			textUnderlineOffset: {
				3: "3px",
			},
			backgroundSize: {
				"size-200": "200% 200%",
			},
			backgroundPosition: {
				"pos-0": "0% 0%",
				"pos-100": "100% 100%",
			},
		},
		screens: {
			mediumlarge: { max: "860px" },
			medium: { max: "600px" },
			small: { max: "430px" },
		},
	},
	plugins: [require("@tailwindcss/typography")],
}
