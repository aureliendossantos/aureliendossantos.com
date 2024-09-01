import type { CollectionEntry, z } from "astro:content"
import { useTranslations, type SupportedLocale } from "./i18n"
import { date, months, period, type multilingualText } from "$content/config"
import formatDate from "./formatting/formatDate"

export const title = (
	title: string | CollectionEntry<"pieces">["data"]["title"],
	currentLocale: SupportedLocale
) => {
	const t = useTranslations(currentLocale)
	if (title === false) return t("m-untitled")
	if (!title) return t("m-unknown title")
	return multiText(title, currentLocale)
}

export const author = (piece: CollectionEntry<"pieces">, currentLocale: SupportedLocale) => {
	const t = useTranslations(currentLocale)
	if (!piece.data.author) return t("m-unknown author")
	return multiText(piece.data.author, currentLocale)
}

export const multiText = (
	text: string | z.infer<typeof multilingualText>,
	currentLocale: SupportedLocale
) => {
	if (typeof text == "string") return text
	const langPriority = [currentLocale, "en"] // then original language
	for (const lang of langPriority) if (text[lang]) return text[lang]
	return text[text.original]
}

const formatCustomDate = (d: z.infer<typeof date>, locale: SupportedLocale) => {
	const month = typeof d.m == "string" ? months.indexOf(d.m) + 1 : d.m
	if (!d.precision && d.y && month && d.d) {
		const jsDate = new Date(d.y, month, d.d)
		return formatDate(jsDate, false, false, false, locale)
	}
	if (d.precision == "decade") return locale == "fr" ? `Années ${d.y}` : `${d.y}s`
	const dateString = `${d.d ? `${d.d} ` : ""}${d.m ? `${d.m} ` : ""}${d.y}`
	if (d.precision == "around")
		return locale == "fr" ? `Vers ${d.d ? "le " : ""}${dateString}` : `Around ${dateString}`
	return dateString
}

export const formatCustomPeriod = (
	d: z.infer<typeof period> | z.infer<typeof date>,
	locale: SupportedLocale
) => {
	if (Array.isArray(d)) return d.map((date) => formatCustomDate(date, locale)).join(" – ")
	return formatCustomDate(d, locale)
}
