// Takes a list of strings and returns an list of unique strings and their number of occurences.
export default function getUniqueValuesAndOccurences(strings: (string[] | undefined)[]) {
	const filteredStrings = strings.flat().filter((category): category is string => !!category)
	const uniqueStrings = [...new Set(filteredStrings)]
	return Object.fromEntries(
		uniqueStrings.map((string) => [string, filteredStrings.filter((s) => s == string).length])
	)
}
