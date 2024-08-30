import type { CollectionEntry, z } from "astro:content"
import { defaultLanguage, useTranslations } from "./i18n"
import { date, months, type multilingualText } from "$content/config"
import formatDate from "./formatting/formatDate"

export const title = (
	title: string | CollectionEntry<"pieces">["data"]["title"],
	lang?: string
) => {
	const t = useTranslations(lang)
	if (title === false) return t("m-untitled")
	if (!title) return t("m-unknown title")
	return multiText(title, lang)
}

export const multiText = (text: string | z.infer<typeof multilingualText>, lang?: string) => {
	if (typeof text == "string") return text
	lang ??= defaultLanguage
	const langPriority = [lang, "en"] // then original language
	for (const lang of langPriority) if (text[lang]) return text[lang]
	return text[text.original]
}

export const author = (piece: CollectionEntry<"pieces">, lang?: string) => {
	const t = useTranslations(lang)
	if (!piece.data.author) return t("m-unknown author")
	return multiText(piece.data.author, lang)
}

export const formatCustomDate = (d: z.infer<typeof date>, lang: string) => {
	const month = typeof d.m == "string" ? months.indexOf(d.m) + 1 : d.m
	console.log(d.y, month, d.d)
	if (!d.precision && d.y && month && d.d) {
		const jsDate = new Date(d.y, month, d.d)
		return formatDate(jsDate, false, false, false, lang)
	}
	if (d.precision == "decade") return lang == "fr" ? `Années ${d.y}` : `${d.y}s`
	const dateString = `${d.d ? `${d.d} ` : ""}${d.m ? `${d.m} ` : ""}${d.y}`
	if (d.precision == "around")
		return lang == "fr" ? `Vers ${d.d ? "le " : ""}${dateString}` : `Around ${dateString}`
	return dateString
}
