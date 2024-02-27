import { getCacheOrFetch } from "$utils/cache"

export interface PlaceWithFetchDate extends google.maps.places.PlaceResult {
	fetchDate: number
}

// Response format: https://developers.google.com/maps/documentation/places/web-service/details
export async function getPlace(id: string) {
	return await getCacheOrFetch(id, "google-maps-place", async () => {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&language=fr&key=${
				import.meta.env.GOOGLE_MAPS_TOKEN
			}`
		).then((response) => response.json())
		return response.result as PlaceWithFetchDate
	})
}

function dayOfWeekAsString(dayIndex: number): string {
	return ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"][dayIndex]
}

function getClosedDays(openedDays: Array<number>): string {
	let daysNumbers = [1, 2, 3, 4, 5, 6, 0]
	let closedDays = daysNumbers
		.filter((dayNumber) => !openedDays.includes(dayNumber))
		.map((x) => dayOfWeekAsString(x))
	if (closedDays.length == 0) return "Ouvert tous les jours."
	if (closedDays.length == 1) return `Fermé le ${closedDays[0]}.`
	return `Fermé le ${closedDays.slice(0, -1).join(", ")} et le ${
		closedDays[closedDays.length - 1]
	}.`
}

export function getClosedStatus(place: PlaceWithFetchDate) {
	if (place.business_status == "CLOSED_TEMPORARILY") return "Fermé temporairement."
	if (place.business_status == "CLOSED_PERMANENTLY") return "Fermé définitivement."
	if (place.current_opening_hours)
		return getClosedDays(place.opening_hours.periods.map((period: any) => period.open.day))
	return null
}

export async function getGoogleImage(maxWidth: number, photoReference: string): Promise<string> {
	const path = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${
		import.meta.env.GOOGLE_MAPS_TOKEN
	}`
	// this path redirects to an image url without the token exposed
	return await fetch(path).then((res) => res.url)
}
