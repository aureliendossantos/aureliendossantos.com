// Takes a list of strings and returns an list of unique strings and their number of occurences.
export default function getOccurences(strings: (string | undefined)[]) {
	const filteredStrings = strings.filter((category): category is string => !!category)
	const uniqueStrings = [...new Set(filteredStrings)]
	const counts = uniqueStrings.map((string) => filteredStrings.filter((s) => s == string).length)
	return {
		unique: uniqueStrings,
		counts: counts,
	}
}
