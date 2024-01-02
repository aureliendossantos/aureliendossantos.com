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

export type Palette = {
	mainColor: Color
	secondaryColor: Color
	popupBorderColor?: Color
	popupLabelActiveBgColor?: Color
	specialColor: Color
	backgroundColor: Color
	mentionColor?: Color
	mentionHoverColor?: Color
	headingsFont: string
	mainFont: string
	specialFont?: string
	fontSize?: string
	lineHeight?: string
}

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
	cormorant = "cormorant",
	snow = "snow",
	notebook = "notebook",
	"green-notes" = "green-notes",
	whiteboard = "whiteboard",
	desolate = "desolate",
}

export default function getPalette(name: PaletteName | undefined): Palette {
	switch (name) {
		default:
			return {
				mainColor: "#000000",
				secondaryColor: "#636363",
				popupBorderColor: "#636363",
				popupLabelActiveBgColor: "#b1b1b1",
				specialColor: "#515bcd",
				backgroundColor: "#f5f5fa",
				headingsFont: "serif",
				mainFont: "serif",
				specialFont: "monospace",
			}
		case "air":
			return {
				mainColor: "#000000",
				secondaryColor: "#636363",
				specialColor: "#515bcd",
				backgroundColor: "#fafafc",
				headingsFont: "'Work Sans', sans-serif",
				mainFont: "'Work Sans', sans-serif",
				specialFont: "'Work Sans', monospace",
				lineHeight: "1.5",
			}
		case "black":
			return {
				mainColor: "#e2e2ee",
				secondaryColor: "#636363",
				specialColor: "#6d75d3",
				backgroundColor: "#000000",
				headingsFont: "sans-serif",
				mainFont: "serif",
				specialFont: "monospace",
			}
		case "white":
			return {
				mainColor: "#000000",
				secondaryColor: "#8a8a94",
				specialColor: "#6d75d3",
				popupBorderColor: "#6d75d3",
				popupLabelActiveBgColor: "#9ba0de",
				backgroundColor: "#ffffff",
				headingsFont: "sans-serif",
				mainFont: "serif",
				specialFont: "monospace",
			}
		case "darkgrey":
			return {
				mainColor: "#e2e2ee",
				secondaryColor: "#555555",
				specialColor: "#cccccc",
				backgroundColor: "#222222",
				headingsFont: "sans-serif",
				mainFont: "serif",
				specialFont: "monospace",
			}
		case "blue":
			return {
				mainColor: "#d1d3eC",
				secondaryColor: "#81839C",
				specialColor: "#B66DC2",
				backgroundColor: "#27314D",
				headingsFont: "'Anek Latin', sans-serif",
				mainFont: "'Urbanist', sans-serif",
				specialFont: "'Urbanist', monospace",
				fontSize: "17px",
				lineHeight: "1.55",
			}
		case "brown":
			return {
				mainColor: "#e6e6e7",
				secondaryColor: "#8c7569",
				popupBorderColor: "#8c7569",
				popupLabelActiveBgColor: "#8c7569",
				specialColor: "#939293",
				backgroundColor: "#584a44",
				headingsFont: "sans-serif",
				mainFont: "serif",
				specialFont: "monospace",
			}
		case "green":
			return {
				mainColor: "white",
				secondaryColor: "lightgrey",
				specialColor: "#BFA97C",
				backgroundColor: "#458f44",
				headingsFont: "sans-serif",
				mainFont: "serif",
				specialFont: "monospace",
			}
		case "tufte":
			return {
				mainColor: { light: "#111111", dark: "#dddddd" },
				secondaryColor: { light: "#111111", dark: "#dddddd" },
				specialColor: { light: "#111111", dark: "#dddddd" },
				popupLabelActiveBgColor: { light: "#11111138", dark: "#dddddd50" },
				backgroundColor: { light: "#fffff8", dark: "#151515" },
				headingsFont: "'Source Serif Subhead', 'Source Serif', serif",
				mainFont: "'Source Serif', serif",
			}
		case "guidebook":
			return {
				mainColor: "#333333",
				secondaryColor: "#686868",
				specialColor: "#5c80c4",
				backgroundColor: "#f9f9f9",
				headingsFont: "'Nunito', sans-serif",
				mainFont: "'Lato', sans-serif",
				specialFont: "'Lato', monospace",
				fontSize: "17px",
				lineHeight: "1.6",
			}
		case "nature":
			return {
				mainColor: "#000000",
				secondaryColor: "#8a8a94",
				specialColor: "#91d36d",
				backgroundColor: "#ffffff",
				mentionColor: "#ebfcde",
				mentionHoverColor: "#dcf7cd",
				headingsFont: "Vollkorn, serif",
				mainFont: "Lora, serif",
				specialFont: "monospace",
				fontSize: "18px",
				lineHeight: "1.325",
			}
		case "source-serif":
			return {
				mainColor: "#000000",
				secondaryColor: "#8a8a94",
				popupBorderColor: "#d4d4d8",
				popupLabelActiveBgColor: "#e4e4e7",
				specialColor: "#91d36d",
				backgroundColor: "#ffffff",
				mentionColor: "#ebfcde",
				mentionHoverColor: "#dcf7cd",
				headingsFont: "'Source Serif', serif",
				mainFont: "'Source Serif', serif",
				specialFont: "monospace",
				fontSize: "18px",
				lineHeight: "1.45",
			}
		case "cormorant":
			return {
				mainColor: "#121212",
				secondaryColor: "#121212",
				popupBorderColor: "#d4d4d8",
				popupLabelActiveBgColor: "#e4e4e7",
				specialColor: "#121212",
				backgroundColor: "#ffffff",
				mentionColor: "#ebfcde",
				mentionHoverColor: "#dcf7cd",
				headingsFont: "'Cormorant', serif",
				mainFont: "'Cormorant', serif",
				specialFont: "monospace",
				fontSize: "18px",
				lineHeight: "1.30",
			}
		case "snow":
			return {
				mainColor: "#e9dcd0",
				secondaryColor: "#eeab8e",
				specialColor: "#eeab8e",
				backgroundColor: "#353336",
				mentionColor: "#ebfcde",
				mentionHoverColor: "#dcf7cd",
				headingsFont: "'Source Serif', serif",
				mainFont: "'Source Serif', serif",
				specialFont: "monospace",
				fontSize: "18px",
				lineHeight: "1.45",
			}
		case "notebook":
			return {
				mainColor: "#404040",
				secondaryColor: "#686868",
				specialColor: "#c45c7f",
				popupBorderColor: "#a1a1aa",
				popupLabelActiveBgColor: "#d4d4d8",
				backgroundColor: "#f0efdd",
				headingsFont: "'Work Sans', sans-serif",
				mainFont: "'Work Sans', 'Noto Sans', sans-serif",
				specialFont: "'Work Sans', monospace",
				fontSize: "18px",
				lineHeight: "1.5",
			}
		case "green-notes":
			return {
				mainColor: "#F4F1DE",
				secondaryColor: "#C6D499", // "#97B754",
				specialColor: "#C6D499",
				popupBorderColor: "#65818C",
				popupLabelActiveBgColor: "#65818C",
				backgroundColor: "#516174", // "#3D405B", // #65818C couleur entre les deux,
				headingsFont: "'Work Sans', sans-serif",
				mainFont: "'Lato', sans-serif",
				specialFont: "'Lato', monospace",
				fontSize: "17px",
				lineHeight: "1.6",
			}
		case "whiteboard":
			return {
				mainColor: "#404040",
				secondaryColor: "#686868",
				specialColor: "#c45c7f",
				backgroundColor: "#ffffff",
				headingsFont: "'Space Grotesk', sans-serif",
				mainFont: "'Space Grotesk', 'Noto Sans', sans-serif",
				specialFont: "'Space Grotesk', monospace",
				fontSize: "18px",
				lineHeight: "1.5",
			}
		case "desolate":
			return {
				mainColor: "#d0d9d7",
				secondaryColor: "#9aaca9",
				specialColor: "#927961",
				backgroundColor: "#24272f",
				headingsFont: "'Work Sans', sans-serif",
				mainFont: "'Work Sans', 'Noto Sans', sans-serif",
				specialFont: "'Work Sans', monospace",
				fontSize: "18px",
				lineHeight: "1.5",
			}
	}
}
