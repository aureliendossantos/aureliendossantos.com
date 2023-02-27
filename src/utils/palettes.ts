type Palette = {
	mainColor: string
	secondaryColor: string
	specialColor: string
	backgroundColor: string
	headingsFont: string
	mainFont: string
	specialFont?: string
	fontSize?: string
	lineHeight?: string
}

export enum Palettes {
	default = "default",
	black = "black",
	darkgrey = "darkgrey",
	blue = "blue",
	brown = "brown",
	green = "green",
	guidebook = "guidebook",
	notebook = "notebook",
	whiteboard = "whiteboard",
}

export function getTailwindPalette(name: Palettes): Palette {
	const pal = getPalette(name)
	return {
		mainColor: `text-[${pal.mainColor}]`,
		secondaryColor: `text-[${pal.secondaryColor}]`,
		specialColor: `text-[${pal.specialColor}]`,
		backgroundColor: `text-[${pal.backgroundColor}]`,
		headingsFont: `font-[${pal.headingsFont}]`,
		mainFont: `font-[${pal.headingsFont}]`,
		specialFont: pal.specialFont && `font-[${pal.headingsFont}]`,
		fontSize: pal.fontSize && `text-[${pal.headingsFont}]`,
		lineHeight: pal.lineHeight && `leading-[${pal.headingsFont}]`,
	}
}

export default function getPalette(name: Palettes): Palette {
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
				secondaryColor: "#8a8a94",
				specialColor: "#6d75d3",
				backgroundColor: "#000000",
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
				specialColor: "grey",
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
				backgroundColor: "#fff",
				headingsFont: "'Space Grotesk', sans-serif",
				mainFont: "'Space Grotesk', 'Noto Sans', sans-serif",
				specialFont: "'Space Grotesk', monospace",
				fontSize: "18px",
				lineHeight: "1.5",
			}
	}
}
