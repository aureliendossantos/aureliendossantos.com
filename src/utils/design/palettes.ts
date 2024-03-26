import type { ShikiConfig } from "astro"

/**
 * A color is either a string that applies to both light and dark modes, or an object with a `light` and `dark` key.
 */
export type Color =
	| {
			light: string
			dark: string
	  }
	| string

/**
 * Get the relevant HTML color from a Color object. Either the light or dark variant, or
 * the only one existing, if there is only one color for both themes.
 * @param color Color object
 * @param theme `light` or `dark` variant of the Color.
 */
export function getColor(color: Color | undefined, theme: "light" | "dark" = "light") {
	if (!color) return undefined
	if (typeof color === "string") return color
	return color[theme]
}

/**
 * Get an object with both variants of the Color. The two values
 * will be identical if there is only one color for both themes.
 */
export function getBothColors(color: Color | undefined) {
	return { light: getColor(color, "light"), dark: getColor(color, "dark") }
}

/**
 * `_Color` values are for text, while `_BgColor` values are for background and `_BorderColor` are for borders.
 * If an optional color isn't given, the `baseColor` is used.
 * If a `special` or `headings` font isn't given, the `baseFont` is used.
 * The `displayFont` is only for the main heading. It falls back to the `headingsFont` or `baseFont` if not given.
 * `fontSize` must be in pixels. The value will be -1 on mobile (with a minimum of 16px).
 * `lineHeight` is a number. The value will be slightly higher on mobile (×1.1) to compensate for the smaller text.
 */
type PaletteDeclaration = {
	name?: PaletteName
	baseColor: Color
	secondaryColor?: Color
	specialColor?: Color
	bgColor: Color
	popupBorderColor?: Color
	popupLabelActiveBgColor?: Color
	mentionBgColor?: Color
	mentionHoverBgColor?: Color
	codeTheme?: ShikiConfig["theme"]
	baseFont: string
	headingsFont?: string
	displayFont?: string
	specialFont?: string
	codeFont?: string
	fontSize?: `${string}px`
	titleWeight?: number
	lineHeight?: number
	pageWidth?: `${number}ch`
	internalLinks?: "solid" | "dotted"
}

/**
 * A `Palette` has all its optional values filled in (except for `fontSize` and `lineHeight`) according to the rules in `PaletteDeclaration`.
 */
export type Palette = Required<PaletteDeclaration>

export enum PaletteName {
	default = "default",
	air = "air",
	tufte = "tufte",
	black = "black",
	white = "white",
	darkgrey = "darkgrey",
	blue = "blue",
	brown = "brown",
	green = "green",
	guidebook = "guidebook",
	nature = "nature",
	sourceSerif = "source-serif",
	louize = "louize",
	cormorant = "cormorant",
	snow = "snow",
	notebook = "notebook",
	"green-notes" = "green-notes",
	whiteboard = "whiteboard",
	desolate = "desolate",
}

export default function getPalette(name: PaletteName | undefined): Palette {
	const p = getPaletteDeclaration(name)
	return {
		name: name || PaletteName.default,
		baseColor: p.baseColor,
		secondaryColor: p.secondaryColor || p.baseColor,
		specialColor: p.specialColor || p.baseColor,
		bgColor: p.bgColor,
		popupBorderColor: p.popupBorderColor || p.baseColor,
		popupLabelActiveBgColor: p.popupLabelActiveBgColor || p.baseColor,
		mentionBgColor: p.mentionBgColor || p.bgColor,
		mentionHoverBgColor: p.mentionHoverBgColor || p.bgColor,
		codeTheme: p.codeTheme || "min-light",
		baseFont: p.baseFont,
		headingsFont: p.headingsFont || p.baseFont,
		displayFont: p.displayFont || p.headingsFont || p.baseFont,
		specialFont: p.specialFont || p.baseFont,
		codeFont: p.codeFont || "monospace",
		fontSize: p.fontSize || "16px",
		titleWeight: p.titleWeight || 700,
		lineHeight: p.lineHeight || 1.25,
		pageWidth: p.pageWidth || "65ch",
		internalLinks: p.internalLinks || "dotted",
	}
}

const getPaletteDeclaration = (name: PaletteName | undefined): PaletteDeclaration => {
	switch (name) {
		default:
			return {
				baseColor: "#000000",
				secondaryColor: "#636363",
				popupBorderColor: "#898989",
				popupLabelActiveBgColor: "#c2c2c2",
				specialColor: "#515bcd",
				bgColor: "#f5f5fa",
				headingsFont: "serif",
				baseFont: "serif",
				specialFont: "monospace",
			}
		case "air":
			return {
				baseColor: "#000000",
				secondaryColor: "#636363",
				specialColor: "#515bcd",
				bgColor: "#fafafc",
				headingsFont: "'Work Sans', sans-serif",
				baseFont: "'Work Sans', sans-serif",
				specialFont: "'Work Sans', monospace",
				lineHeight: 1.5,
			}
		case "black":
			return {
				baseColor: "#e2e2ee",
				secondaryColor: "#636363",
				specialColor: "#6d75d3",
				bgColor: "#000000",
				headingsFont: "sans-serif",
				baseFont: "serif",
				specialFont: "monospace",
			}
		case "white":
			return {
				baseColor: "#000000",
				secondaryColor: "#8a8a94",
				specialColor: "#6d75d3",
				popupBorderColor: "#6d75d3",
				popupLabelActiveBgColor: "#9ba0de",
				bgColor: "#ffffff",
				headingsFont: "sans-serif",
				baseFont: "serif",
				specialFont: "monospace",
			}
		case "darkgrey":
			return {
				baseColor: "#e2e2ee",
				secondaryColor: "#555555",
				specialColor: "#cccccc",
				bgColor: "#222222",
				headingsFont: "sans-serif",
				baseFont: "serif",
				specialFont: "monospace",
			}
		case "blue":
			return {
				baseColor: "#d1d3eC",
				secondaryColor: "#81839C",
				specialColor: "#B66DC2",
				bgColor: "#27314D",
				headingsFont: "'Urbanist', sans-serif",
				baseFont: "'Urbanist', sans-serif",
				specialFont: "'Urbanist', monospace",
				fontSize: "17px",
				lineHeight: 1.55,
				titleWeight: 400,
			}
		case "brown":
			return {
				baseColor: "#e6e6e7",
				secondaryColor: "#8c7569",
				popupBorderColor: "#8c7569",
				popupLabelActiveBgColor: "#8c7569",
				specialColor: "#939293",
				bgColor: "#584a44",
				headingsFont: "sans-serif",
				baseFont: "serif",
				specialFont: "monospace",
			}
		case "green":
			return {
				baseColor: "white",
				secondaryColor: "lightgrey",
				specialColor: "#BFA97C",
				bgColor: "#458f44",
				headingsFont: "sans-serif",
				baseFont: "serif",
				specialFont: "monospace",
			}
		case "tufte":
			return {
				baseColor: { light: "#111111", dark: "#dddddd" },
				secondaryColor: { light: "#111111", dark: "#dddddd" },
				specialColor: { light: "#111111", dark: "#dddddd" },
				popupLabelActiveBgColor: { light: "#11111138", dark: "#dddddd50" },
				bgColor: { light: "#fffff8", dark: "#151515" },
				codeTheme: "vitesse-dark",
				displayFont: '"Source Serif Display", "Source Serif", serif',
				headingsFont: "'Source Serif Subhead', 'Source Serif', serif",
				baseFont: "'Source Serif', serif",
				fontSize: "19px",
				titleWeight: 400,
				lineHeight: 1.46,
			}
		case "guidebook":
			return {
				baseColor: "#333333",
				secondaryColor: "#686868",
				specialColor: "#5c80c4",
				bgColor: "#f9f9f9",
				codeTheme: "slack-ochin",
				headingsFont: "'Nunito', sans-serif",
				baseFont: "'Lato', sans-serif",
				specialFont: "'Lato', monospace",
				fontSize: "17px",
				lineHeight: 1.6,
			}
		case "nature":
			return {
				baseColor: "#000000",
				secondaryColor: "#8a8a94",
				specialColor: "#91d36d",
				bgColor: "#ffffff",
				mentionBgColor: "#ebfcde",
				mentionHoverBgColor: "#dcf7cd",
				headingsFont: "Vollkorn, serif",
				baseFont: "Lora, serif",
				specialFont: "monospace",
				fontSize: "18px",
				lineHeight: 1.325,
			}
		case "source-serif":
			return {
				baseColor: "#000000",
				secondaryColor: "#8a8a94",
				popupBorderColor: "#d4d4d8",
				popupLabelActiveBgColor: "#e4e4e7",
				specialColor: "#91d36d",
				bgColor: "#ffffff",
				mentionBgColor: "#ebfcde",
				mentionHoverBgColor: "#dcf7cd",
				codeTheme: "vitesse-light",
				baseFont: "'Source Serif', serif",
				displayFont: '"Source Serif Display", "Source Serif", serif',
				codeFont: '"Source Code Pro", monospace',
				fontSize: "18px",
				titleWeight: 600,
				lineHeight: 1.45,
				internalLinks: "dotted",
			}
		case "louize":
			return {
				baseColor: "#000000",
				secondaryColor: "#8a8a94",
				popupBorderColor: "#d4d4d8",
				popupLabelActiveBgColor: "#e4e4e7",
				specialColor: "#91d36d",
				bgColor: "#ffffff",
				mentionBgColor: "#ebfcde",
				mentionHoverBgColor: "#dcf7cd",
				codeTheme: "vitesse-light",
				baseFont: "Louize, serif",
				displayFont: '"Louize Display", Louize, serif',
				codeFont: '"Source Code Pro", monospace',
				fontSize: "20px",
				titleWeight: 400,
				lineHeight: 1.45,
				pageWidth: "55ch",
				internalLinks: "dotted",
			}
		case "cormorant":
			return {
				baseColor: "#121212",
				secondaryColor: "#121212",
				popupBorderColor: "#d4d4d8",
				popupLabelActiveBgColor: "#e4e4e7",
				specialColor: "#121212",
				bgColor: "#ffffff",
				mentionBgColor: "#ebfcde",
				mentionHoverBgColor: "#dcf7cd",
				headingsFont: "'Cormorant', serif",
				baseFont: "'Cormorant', serif",
				specialFont: "monospace",
				fontSize: "18px",
				pageWidth: "75ch",
				lineHeight: 1.3,
			}
		case "snow":
			return {
				baseColor: "#e9dcd0",
				secondaryColor: "#eeab8e",
				specialColor: "#eeab8e",
				bgColor: "#353336",
				mentionBgColor: "#ebfcde",
				mentionHoverBgColor: "#dcf7cd",
				headingsFont: "'Source Serif', serif",
				baseFont: "'Source Serif', serif",
				specialFont: "monospace",
				fontSize: "18px",
				lineHeight: 1.45,
			}
		case "notebook":
			return {
				baseColor: "#404040",
				secondaryColor: "#686868",
				specialColor: "#c45c7f",
				popupBorderColor: "#a1a1aa",
				popupLabelActiveBgColor: "#d4d4d8",
				bgColor: "#f0efdd",
				headingsFont: "'Work Sans', sans-serif",
				baseFont: "'Work Sans', 'Noto Sans', sans-serif",
				specialFont: "'Work Sans', monospace",
				fontSize: "18px",
				lineHeight: 1.5,
			}
		case "green-notes":
			return {
				baseColor: "#F4F1DE",
				secondaryColor: "#C6D499", // "#97B754",
				specialColor: "#C6D499",
				popupBorderColor: "#65818C",
				popupLabelActiveBgColor: "#65818C",
				bgColor: "#516174", // "#3D405B", // #65818C couleur entre les deux,
				headingsFont: "'Work Sans', sans-serif",
				baseFont: "'Lato', sans-serif",
				specialFont: "'Lato', monospace",
				fontSize: "17px",
				lineHeight: 1.6,
			}
		case "whiteboard":
			return {
				baseColor: "#404040",
				secondaryColor: "#686868",
				specialColor: "#c45c7f",
				bgColor: "#ffffff",
				codeTheme: "github-light",
				headingsFont: "'Space Grotesk', sans-serif",
				baseFont: "'Space Grotesk', 'Noto Sans', sans-serif",
				specialFont: "'Space Grotesk', monospace",
				fontSize: "18px",
				lineHeight: 1.5,
			}
		case "desolate":
			return {
				baseColor: "#d0d9d7",
				secondaryColor: "#9aaca9",
				specialColor: "#927961",
				bgColor: "#24272f",
				headingsFont: "'Work Sans', sans-serif",
				baseFont: "'Work Sans', 'Noto Sans', sans-serif",
				specialFont: "'Work Sans', monospace",
				fontSize: "18px",
				lineHeight: 1.5,
			}
	}
}
