import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"
import { scopedPreflightStyles, isolateOutsideOfContainer } from "tailwindcss-scoped-preflight"

export default {
	content: ["./src/**/*.{astro,md,mdx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				adelle: ["Adelle", ...defaultTheme.fontFamily.sans],
				"adelle-sans": ["Adelle Sans", ...defaultTheme.fontFamily.sans],
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
				"snow-1": "#e9dcd0",
				"snow-2": "#595555",
				"snow-3": "#353336",
				"dandelion-1": "#2C3744",
				"dandelion-2": "#2c443e",
				"dandelion-3": "#E7E9B7",
				"dandelion-4": "##FBF4EA",
				"fi-black": "#100F0F", // text
				"fi-base-600": "#6F6E69", // muted text
				"fi-base-300": "#B7B5AC", // faint text
				"fi-base-200": "#CECDC3", // active borders
				"fi-base-150": "#DAD8CE", // hovered borders
				"fi-base-100": "#E6E4D9", // borders
				"fi-base-50": "#F2F0E5", // bg-2
				"fi-paper": "#FFFCF0", // bg
				"fi-orange-400": "#DA702C", // warning / functions
				"fi-green-400": "#879A39", // success / keywords
				"fi-cyan-400": "#3AA99F", // links, active states / strings
				"fi-blue-400": "#4385BE", // variables, attributes
				"fi-purple-400": "#8B7EC8", // numbers
				"fi-magenta-400": "#CE5D97", // language features
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
	plugins: [
		require("@tailwindcss/typography"),
		scopedPreflightStyles({
			isolationStrategy: isolateOutsideOfContainer(".notw"),
		}),
	],
} satisfies Config
