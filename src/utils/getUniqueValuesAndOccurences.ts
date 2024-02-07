import type { PlaceWithFetchDate } from "./remoteData/googleMaps"

// Takes a list of strings and returns an list of unique strings and their number of occurences.
export default function getUniqueValuesAndOccurences(strings: (string[] | undefined)[]) {
	const filteredStrings = strings.flat().filter((category): category is string => !!category)
	const uniqueStrings = [...new Set(filteredStrings)]
	return Object.fromEntries(
		uniqueStrings.map((string) => [string, filteredStrings.filter((s) => s == string).length])
	)
}

export function getUniquePlacesAndOccurences(places: PlaceWithFetchDate[][]) {
	const flattenedPlaces = places.flat()
	const uniquePlaces = [...new Set(flattenedPlaces)]
	return Object.fromEntries(
		uniquePlaces.map((place) => [place, flattenedPlaces.filter((p) => p == place).length])
	)
}
