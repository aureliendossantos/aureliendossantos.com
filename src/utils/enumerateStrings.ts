export default function enumerate(strings: string[]) {
	if (strings.length == 0) return "Aucun"
	if (strings.length == 1) return strings[0]
	return `${strings.slice(0, -1).join(", ")} et ${strings[strings.length - 1]}`
}
