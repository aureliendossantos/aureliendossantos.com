import type { CollectionEntry, z } from "astro:content"
import { checkLocale, defaultLanguage, useTranslations } from "./i18n"
import { date, months, period, type multilingualText } from "$content/config"
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
	const preferredLocale = checkLocale(lang)
	const langPriority = [preferredLocale, "en"] // then original language
	for (const lang of langPriority) if (text[lang]) return text[lang]
	return text[text.original]
}

export const author = (piece: CollectionEntry<"pieces">, lang?: string) => {
	const t = useTranslations(lang)
	if (!piece.data.author) return t("m-unknown author")
	return multiText(piece.data.author, lang)
}

const formatCustomDate = (d: z.infer<typeof date>, lang: "fr" | "en") => {
	const month = typeof d.m == "string" ? months.indexOf(d.m) + 1 : d.m
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

export const formatCustomPeriod = (
	d: z.infer<typeof period> | z.infer<typeof date>,
	lang?: string
) => {
	const locale = checkLocale(lang)
	if (Array.isArray(d)) return d.map((date) => formatCustomDate(date, locale)).join(" – ")
	return formatCustomDate(d, locale)
}
