/**
 * Whether the order is ascending or descending, if one of the dates is undefined, it will be at the end of the list.
 */
export function dateSort(a: Date | undefined, b: Date | undefined, order: "asc" | "desc" = "desc") {
	if (a == b) return 0
	if (!a && b) return 1
	if (a && !b) return -1
	return (a as Date) > (b as Date) ? (order == "desc" ? -1 : 1) : order == "desc" ? 1 : -1
}
