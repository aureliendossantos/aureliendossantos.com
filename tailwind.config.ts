import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"

export default {
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
			colors: {
				"space-blue": "#17182f",
				"space-100": "#eceff4",
				"space-200": "#e5e7eb",
				"space-300": "#d1d5db",
				"space-500": "#9ca3af",
				"space-600": "#656f7e",
				"space-700": "#5f6979",
				"space-800": "#566272",
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
			typography: {
				quoteless: {
					css: {
						"blockquote p:first-of-type::before": { content: "none" },
						"blockquote p:first-of-type::after": { content: "none" },
					},
				},
			},
		},
		screens: {
			"3xl": { max: "1620px" },
			"2xl": { max: "1250px" },
			xl: { max: "1100px" },
			mediumlarge: { max: "860px" },
			medium: { max: "600px" },
			small: { max: "430px" },
		},
	},
	plugins: [require("@tailwindcss/typography")],
} satisfies Config
