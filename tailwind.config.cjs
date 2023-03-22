/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
module.exports = {
	content: ["./src/**/*.{astro,md,mdx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Work Sans", ...defaultTheme.fontFamily.sans],
				mono: "monospace",
			},
			opacity: {
				15: ".15",
			},
			textUnderlineOffset: {
				3: "3px",
			},
		},
		screens: {
			mediumlarge: { max: "860px" },
			medium: { max: "600px" },
			small: { max: "430px" },
		},
	},
	plugins: [],
}
