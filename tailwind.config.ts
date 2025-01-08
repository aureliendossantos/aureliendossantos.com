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
				bricolage: ["Bricolage Grotesque Variable", ...defaultTheme.fontFamily.sans],
				"work-sans": ["Work Sans", ...defaultTheme.fontFamily.sans],
				mono: "monospace",
				"sofia-sans": ["Sofia Sans", ...defaultTheme.fontFamily.sans],
				"space-grotesk": ["Space Grotesk", ...defaultTheme.fontFamily.sans],
				"space-mono": ["Space Mono", ...defaultTheme.fontFamily.mono],
				inter: ["InterVariable", ...defaultTheme.fontFamily.sans],
			},
			colors: {
				script: "#4a7dbf",
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
				"diary-100": "#DBC9AF",
				"diary-accent": "#AD603E",
				"diary-800": "#4B3328",
				"diary-900": "#26211F",
				"ryb-bg": "#EFECEB",
				"ryb-400": "#D98047",
				"ryb-500": "#DC8144",
				"ryb-600": "#CC7D41",
				"ryb-700": "#A16939",
				"ryb-800": "#6B4E2E",
				"ryb-900": "#3C342C",
				"mdrn-dark": "#4e3b31",
				"mdrn-light": "#EADAC8",
				"mdrn-orange": "#ff773a",
				combo: {
					a: {
						light: "#EFEEE9",
						alt: "#DC5D47",
						dark: "#1A3F2C",
					},
					b: {
						light: "#EFECE3",
						alt: "#438EAC",
						dark: "#651C26",
					},
					c: {
						light: "#F5EFE8",
						alt: "#8980C1",
						dark: "#20392C",
					},
				},
				// flexoki
				fi: {
					// Semantic
					bg: "#FFFCF0", // paper - main background
					"bg-2": "#F2F0E5", // base-50 - secondary background
					ui: "#E6E4D9", // base-100 - borders
					"ui-2": "#DAD8CE", // base-150 - hovered borders
					"ui-3": "#CECDC3", // base-200 - active borders
					tx: "#100F0F", // black - primary text
					"tx-2": "#6F6E69", // base-600 - punctuation, operators
					"tx-3": "#B7B5AC", // base-300 - comments, faint text
					dark: {
						bg: "#100F0F", // black
						"bg-2": "#1C1B1A", // base-950
						ui: "#282726", // base-900
						"ui-2": "#343331", // base-850
						"ui-3": "#403E3C", // base-800
						tx: "#CECDC3", // base-200
						"tx-2": "#878580", // base-500
						"tx-3": "#575653", // base-700
						red: "#D14D41", // red-400
						orange: "#DA702C", // orange-400
						yellow: "#D0A215", // yellow-400
						green: "#879A39", // green-400
						cyan: "#3AA99F", // cyan-400
						blue: "#4385BE", // blue-400
						purple: "#8B7EC8", // purple-400
						magenta: "#CE5D97", // magenta-400
					},
					// Palette
					black: "#100F0F",
					paper: "#FFFCF0",
					base: {
						"50": "#F2F0E5",
						"100": "#E6E4D9",
						"150": "#DAD8CE",
						"200": "#CECDC3",
						"300": "#B7B5AC",
						"400": "#9F9D96",
						"500": "#878580",
						"600": "#6F6E69",
						"700": "#575653",
						"800": "#403E3C",
						"850": "#343331",
						"900": "#282726",
						"950": "#1C1B1A",
					},
					red: {
						DEFAULT: "#AF3029",
						"50": "#FFE1D5",
						"100": "#FFCABB",
						"150": "#FDB2A2",
						"200": "#F89A8A",
						"300": "#E8705F",
						"400": "#D14D41",
						"500": "#C03E35",
						"600": "#AF3029",
						"700": "#942822",
						"800": "#6C201C",
						"850": "#551B18",
						"900": "#3E1715",
						"950": "#261312",
					},
					orange: {
						DEFAULT: "#BC5215",
						"50": "#FFE7CE",
						"100": "#FED3AF",
						"150": "#FCC192",
						"200": "#F9AE77",
						"300": "#EC8B49",
						"400": "#DA702C",
						"500": "#CB6120",
						"600": "#BC5215",
						"700": "#9D4310",
						"800": "#71320D",
						"850": "#59290D",
						"900": "#40200D",
						"950": "#27180E",
					},
					yellow: {
						DEFAULT: "#AD8301",
						"50": "#FAEEC6",
						"100": "#F6E2A0",
						"150": "#F1D67E",
						"200": "#ECCB60",
						"300": "#DFB431",
						"400": "#D0A215",
						"500": "#BE9207",
						"600": "#AD8301",
						"700": "#8E6B01",
						"800": "#664D01",
						"850": "#503D02",
						"900": "#3A2D04",
						"950": "#241E08",
					},
					green: {
						DEFAULT: "#66800B",
						"50": "#EDEECF",
						"100": "#DDE2B2",
						"150": "#CDD597",
						"200": "#BEC97E",
						"300": "#A0AF54",
						"400": "#879A39",
						"500": "#768D21",
						"600": "#66800B",
						"700": "#536907",
						"800": "#3D4C07",
						"850": "#313D07",
						"900": "#252D09",
						"950": "#1A1E0C",
					},
					cyan: {
						DEFAULT: "#24837B",
						"50": "#DDF1E4",
						"100": "#BFE8D9",
						"150": "#A2DECE",
						"200": "#87D3C3",
						"300": "#5ABDAC",
						"400": "#3AA99F",
						"500": "#2F968D",
						"600": "#24837B",
						"700": "#1C6C66",
						"800": "#164F4A",
						"850": "#143F3C",
						"900": "#122F2C",
						"950": "#101F1D",
					},
					blue: {
						DEFAULT: "#205EA6",
						"50": "#E1ECEB",
						"100": "#C6DDE8",
						"150": "#ABCFE2",
						"200": "#92BFDB",
						"300": "#66A0C8",
						"400": "#4385BE",
						"500": "#3171B2",
						"600": "#205EA6",
						"700": "#1A4F8C",
						"800": "#163B66",
						"850": "#133051",
						"900": "#12253B",
						"950": "#101A24",
					},
					purple: {
						DEFAULT: "#5E409D",
						"50": "#F0EAEC",
						"100": "#E2D9E9",
						"150": "#D3CAE6",
						"200": "#C4B9E0",
						"300": "#A699D0",
						"400": "#8B7EC8",
						"500": "#735EB5",
						"600": "#5E409D",
						"700": "#4F3685",
						"800": "#3C2A62",
						"850": "#31234E",
						"900": "#261C39",
						"950": "#1A1623",
					},
					magenta: {
						DEFAULT: "#A02F6F",
						"50": "#FEE4E5",
						"100": "#FCCFDA",
						"150": "#F9B9CF",
						"200": "#F4A4C2",
						"300": "#E47DA8",
						"400": "#CE5D97",
						"500": "#B74583",
						"600": "#A02F6F",
						"700": "#87285E",
						"800": "#641F46",
						"850": "#4F1B39",
						"900": "#39172B",
						"950": "#24131D",
					},
				},
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
				fenceless: {
					css: {
						"code::before": { content: "none" },
						"code::after": { content: "none" },
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
