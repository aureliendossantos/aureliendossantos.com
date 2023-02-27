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
		},
	},
	plugins: [],
}
