export type Palette = {
	mainColor: string
	secondaryColor: string
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
	black = "black",
	white = "white",
	darkgrey = "darkgrey",
	blue = "blue",
	brown = "brown",
	green = "green",
	guidebook = "guidebook",
	nature = "nature",
	notebook = "notebook",
	whiteboard = "whiteboard",
	desolate = "desolate",
}

export default function getPalette(name: Palettes | undefined): Palette {
	switch (name) {
		default:
			return {
				mainColor: "#000000",
				secondaryColor: "#636363",
				specialColor: "#515bcd",
				backgroundColor: "#f5f5fa",
				headingsFont: "serif",
				mainFont: "serif",
				specialFont: "monospace",
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
				lineHeight: "1.275",
			}
		case "notebook":
			return {
				mainColor: "#404040",
				secondaryColor: "#686868",
				specialColor: "#c45c7f",
				backgroundColor: "#f0efdd",
				headingsFont: "'Work Sans', sans-serif",
				mainFont: "'Work Sans', 'Noto Sans', sans-serif",
				specialFont: "'Work Sans', monospace",
				fontSize: "18px",
				lineHeight: "1.5",
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
