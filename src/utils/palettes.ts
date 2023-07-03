export type Palette = {
	mainColor: string
	secondaryColor: string
	popupColor?: string
	popupActiveColor?: string
	specialColor: string
	backgroundColor: string
	mentionColor?: string
	mentionHoverColor?: string
	headingsFont: string
	mainFont: string
	specialFont?: string
	fontSize?: string
	lineHeight?: string
}

export enum Palettes {
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
	snow = "snow",
	notebook = "notebook",
	"green-notes" = "green-notes",
	whiteboard = "whiteboard",
	desolate = "desolate",
}

export default function getPalette(name: Palettes | undefined): Palette {
	switch (name) {
		default:
			return {
				mainColor: "#000000",
				secondaryColor: "#636363",
				popupColor: "#636363",
				popupActiveColor: "#b1b1b1",
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
				popupColor: "#6d75d3",
				popupActiveColor: "#9ba0de",
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
				popupColor: "#8c7569",
				popupActiveColor: "#8c7569",
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
				mainColor: "#111111",
				secondaryColor: "#111111",
				specialColor: "#111111",
				backgroundColor: "#fffff8",
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
				popupColor: "#d4d4d8",
				popupActiveColor: "#e4e4e7",
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
				popupColor: "#a1a1aa",
				popupActiveColor: "#d4d4d8",
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
				popupColor: "#65818C",
				popupActiveColor: "#65818C",
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
