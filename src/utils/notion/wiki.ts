import type { ResponseResult, Title, RichText, Relation } from "$utils/notion/types"

export type CategoriesEntry = ResponseResult & {
	properties: {
		Nom: Title
		Description: RichText
	}
}

export type PagesEntry = ResponseResult & {
	properties: {
		Nom: Title
		Description: RichText
		Catégorie: Relation
	}
}
