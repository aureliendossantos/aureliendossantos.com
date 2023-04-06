export default function formatDate(date: Date, yearOnly: boolean = false): string {
	const options: Intl.DateTimeFormatOptions = yearOnly
		? { year: "numeric" }
		: {
				day: "numeric",
				month: "long",
				year: "numeric",
		  }
	return date.toLocaleDateString("fr-FR", options)
}
