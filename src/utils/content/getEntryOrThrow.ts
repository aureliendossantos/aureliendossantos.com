import { type AnyEntryMap, type CollectionEntry, type DataEntryMap, getEntry } from "astro:content"

export default async function getEntryOrThrow<C extends keyof AnyEntryMap>(
	collection: C,
	id: string
): Promise<CollectionEntry<C> | DataEntryMap[C][string]> {
	if (!id) throw new Error(`Invalid ID: ${collection} → ${id}`)
	const entry = await getEntry(collection, id)
	if (!entry) throw new Error(`Entry not found: ${collection} → ${id}`)
	return entry
}
