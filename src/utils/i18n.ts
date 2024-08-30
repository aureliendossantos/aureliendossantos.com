export const languages = {
	fr: "Français",
	en: "English",
}

export const defaultLanguage = "fr"

export const langParams = [undefined, "en"] // undefined is root, the default language

export const localePaths = langParams.map((lang) => ({
	params: { lang: lang },
	props: { t: useTranslations(lang) },
}))

export function useTranslations(lang?: string) {
	lang ??= defaultLanguage
	if (lang !== "en" && lang !== "fr") throw new Error("Invalid language: " + lang)
	return function t(key: keyof (typeof translations)[typeof defaultLanguage]) {
		return translations[lang][key] || translations[defaultLanguage][key]
	}
}

const museum = {
	fr: {
		"m-title": "Musée Personnel des Arts et de la Culture",
		"m-museum": "Musée",
		"m-collection": "Collection",
		"m-customize": "Personnaliser",
		"m-original-title": "Titre original",
		"m-untitled": "Sans titre",
		"m-unknown title": "Inconnu",
		"m-author": "Auteur",
		"m-unknown author": "Inconnu",
		"m-play-music": "Écouter",
		painting: "Peinture",
		drawing: "Dessin",
		digital: "Numérique",
		photo: "Photographie",
		album: "Album",
		track: "Musique",
		movie: "Film",
		oil: "Huile sur toile",
		"oil-cardboard": "carton (huile)",
		"graphite-on-tracing-paper": "Mine de plomb/Graphite sur calque",
		watercolor: "Aquarelle",
		"pencil-and-watercolor": "Crayon et aquarelle",
	},
	en: {
		"m-title": "Personal Museum of Arts and Culture",
		"m-museum": "Museum",
		"m-customize": "Customize",
		"m-collection": "Collection",
		"m-original-title": "Original title",
		"m-untitled": "Untitled",
		"m-unknown title": "Unknown",
		"m-author": "Author",
		"m-unknown author": "Unknown",
		"m-play-music": "Play",
		painting: "Painting",
		drawing: "Drawing",
		digital: "Digital",
		photo: "Photography",
		album: "Album",
		track: "Track",
		movie: "Movie",
		oil: "Oil on canvas",
		"oil-cardboard": "oil, cardboard",
		"graphite-on-tracing-paper": "Pencil/Graphite on tracing paper",
		watercolor: "Watercolor",
		"pencil-and-watercolor": "Pencil and watercolor",
	},
}

const navbar = {
	fr: {
		"n-explore": "Explorer",
		"n-search": "Rechercher",
	},
	en: {
		"n-explore": "Explore",
		"n-search": "Search",
	},
}

// create a const combining museum and navbar

const translations = {
	fr: { ...museum.fr, ...navbar.fr },
	en: { ...museum.en, ...navbar.en },
}
