export default function formatDate(
	date: Date,
	yearOnly: boolean = false,
	noYear: boolean = false,
	monthShort: boolean = false
): string {
	const month = monthShort ? "short" : "long"
	const year = noYear ? undefined : "numeric"
	const options: Intl.DateTimeFormatOptions = yearOnly
		? { year: "numeric" }
		: {
				day: "numeric",
				month: month,
				year: year,
		  }
	return date.toLocaleDateString("fr-FR", options)
}
