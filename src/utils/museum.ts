import type { CollectionEntry } from "astro:content"
import { useTranslations } from "./i18n"

export const title = (piece: CollectionEntry<"pieces">, lang?: string) => {
	const t = useTranslations(lang)
	return piece.data.title === false ? t("m-untitled") : piece.data.title || t("m-unknown title")
}

export const author = (piece: CollectionEntry<"pieces">, lang?: string) => {
	const t = useTranslations(lang)
	return piece.data.author || t("m-unknown author")
}
