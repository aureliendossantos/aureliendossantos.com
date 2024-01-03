import type {
	QueryDatabaseResponse,
	RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints"

// The following code is inspired by:
// https://www.alanjohn.dev/blog/Building-a-Developer-Portfolio-Creating-a-NextJS-blog-in-typescript-using-Notion-API

export type ResponseResult = Extract<
	QueryDatabaseResponse["results"][number],
	{ properties: Record<string, unknown> }
>
type PropertyMap = ResponseResult["properties"]
type Property = PropertyMap[string]
type PropertyType = Property["type"]
type ExtractedProperty<TType extends PropertyType> = Extract<Property, { type: TType }>

// Pour produire ces types, écrire d'abord quelque chose comme ceci :
// `export type Title = ExtractedProperty<"title">`
// Hover sur `Title` affiche ceci :
// type Title = {
//     type: "title";
//     title: RichTextItemResponse[];
//     id: string;
// } | TitleDatabasePropertyConfigResponse
// Retirer `| TitleDatabasePropertyConfigResponse`.
// This allows to skip tedious checks later. So far I haven't got any issue with this.

export type Title = {
	type: "title"
	title: RichTextItemResponse[]
	id: string
}
export type RichText = {
	type: "rich_text"
	rich_text: RichTextItemResponse[]
	id: string
}
export type Select = ExtractedProperty<"select">
export type MultiSelect = ExtractedProperty<"multi_select">
export type Status = ExtractedProperty<"status">
export type Number = ExtractedProperty<"number">
export type Checkbox = ExtractedProperty<"checkbox">
export type Relation = {
	type: "relation"
	relation: {
		id: string
	}[]
	id: string
}
