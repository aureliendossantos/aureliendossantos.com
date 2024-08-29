export const languages = {
	fr: "Français",
	en: "English",
}

const defaultLanguage = "fr"

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
		"m-customize": "Personnaliser",
		"m-untitled": "Sans titre",
		"m-unknown title": "Inconnu",
		"m-unknown author": "Inconnu",
		painting: "Peinture",
		album: "Album",
		track: "Piste",
		oil: "Huile sur toile",
		watercolor: "Aquarelle",
	},
	en: {
		"m-title": "Personal Museum of Arts and Culture",
		"m-customize": "Customize",
		"m-untitled": "Untitled",
		"m-unknown title": "Unknown",
		"m-unknown artist": "Unknown",
		painting: "Painting",
		album: "Album",
		track: "Track",
		oil: "Oil on canvas",
		watercolor: "Watercolor",
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
