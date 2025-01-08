import type { CollectionEntry, z } from "astro:content"
import { useTranslations, type SupportedLocale } from "./i18n"
import { date as dateType, months, period, type multilingualText } from "src/content.config"
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

const formatCustomDate = (
	date: z.infer<typeof dateType>,
	locale: SupportedLocale,
	y = true,
	m = true,
	d = true
) => {
	const month = typeof date.m == "string" ? months.indexOf(date.m) + 1 : date.m
	if (!date.precision && y && date.y && m && month && d && date.d) {
		const jsDate = new Date(date.y, month, date.d)
		return formatDate(jsDate, false, false, false, locale)
	}
	if (date.precision == "decade") return locale == "fr" ? `Années ${date.y}` : `${date.y}s`
	const dateString = `${d && date.d ? `${date.d} ` : ""}${m && date.m ? `${date.m} ` : ""}${y && date.y}`
	if (date.precision == "around")
		return locale == "fr" ? `Vers ${d && date.d ? "le " : ""}${dateString}` : `Around ${dateString}`
	return dateString
}

export const formatCustomPeriod = (
	dateOrPeriod: z.infer<typeof period> | z.infer<typeof dateType>,
	locale: SupportedLocale,
	y?: boolean,
	m?: boolean,
	d?: boolean
) => {
	if (Array.isArray(dateOrPeriod))
		return dateOrPeriod.map((date) => formatCustomDate(date, locale, y, m, d)).join(" – ")
	return formatCustomDate(dateOrPeriod, locale, y, m, d)
}
