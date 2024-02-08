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

export function formatInterval(
	start: Date,
	end: Date,
	noYear: boolean = false,
	monthShort: boolean = false
) {
	if (start.getFullYear() != end.getFullYear()) {
		return `${formatDate(start, false, noYear, monthShort)} – ${formatDate(
			end,
			false,
			noYear,
			monthShort
		)}`
	}
	if (start.getMonth() != end.getMonth()) {
		return `${formatDate(start, false, true, monthShort)} – ${formatDate(
			end,
			false,
			noYear,
			monthShort
		)}`
	}
	return `${start.getUTCDate()}–${formatDate(end, false, noYear, monthShort)}`
}
