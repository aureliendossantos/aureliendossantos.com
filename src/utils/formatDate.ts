export default function formatDate(
	date: Date,
	yearOnly: boolean = false,
	noYear: boolean = false
): string {
	const options: Intl.DateTimeFormatOptions = yearOnly
		? { year: "numeric" }
		: noYear
		? { day: "numeric", month: "long" }
		: {
				day: "numeric",
				month: "long",
				year: "numeric",
		  }
	return date.toLocaleDateString("fr-FR", options)
}
