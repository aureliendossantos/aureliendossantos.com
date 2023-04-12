export type Place = {
	slug: string
	customTitle: string
	googleMapsId: string
}

export enum Places {
	eauxChaudes = "eaux-chaudes",
	grotteEauxChaudes = "grotte-eaux-chaudes",
	valleeDAspe = "vallee-d-aspe",
	pau = "pau",
	gourette = "gourette",
	pyreneesAriegeoises = "pyrenees-ariegeoises",
	toulouse = "toulouse",
}

// Place ID finder: https://developers.google.com/maps/documentation/places/web-service/place-id

export default function getPlace(slug: Places): Place | undefined {
	switch (slug) {
		case "eaux-chaudes":
			return {
				slug: slug,
				customTitle: "Eaux-Chaudes",
				googleMapsId: "ChIJNf6KbUW7Vw0RIWjJRhhlBiY",
			}
		case "grotte-eaux-chaudes":
			return {
				slug: slug,
				customTitle: "Eaux-Chaudes",
				googleMapsId: "ChIJ9bnyiKW8Vw0RK5G0VFFtt9U",
			}
		case "vallee-d-aspe":
			return {
				slug: slug,
				customTitle: "Vallée d'Aspe",
				googleMapsId: "ChIJb17pamGnVw0RY4EJf_ogmt4",
			}
		case "pau":
			return {
				slug: slug,
				customTitle: "Pau",
				googleMapsId: "ChIJ6XpctIVIVg0RsJQTSBdlBgQ",
			}
		case "gourette":
			return {
				slug: slug,
				customTitle: "Gourette",
				googleMapsId: "ChIJdZxQEMO4Vw0RL-sgn441jQw",
			}
		case "pyrenees-ariegeoises":
			return {
				slug: slug,
				customTitle: "Pyrénées ariégeoises",
				googleMapsId: "ChIJ5VJCrBU1rxIRRMfwvWVPYbM",
			}
		case "toulouse":
			return {
				slug: slug,
				customTitle: "Toulouse",
				googleMapsId: "ChIJ_1J17G-7rhIRMBBBL5z2BgQ",
			}
	}
}
