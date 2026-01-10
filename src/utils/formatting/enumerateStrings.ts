export default function enumerate(strings: string[]) {
	if (strings.length == 0) return undefined
	if (strings.length == 1) return strings[0]
	return `${strings.slice(0, -1).join(", ")} et ${strings[strings.length - 1]}`
}

export function capitalize(string: string) {
	return String(string).charAt(0).toUpperCase() + String(string).slice(1)
}
