import type { CollectionEntry } from "astro:content"
import getBlogPosts from "./getCollection"

/**
 * Returns the 3 most related articles to the given article.
 * It uses a scoring system based on several criteria.
 */
export default async function getRelatedArticles(article: CollectionEntry<"blog">) {
	const articles = (await getBlogPosts()).filter((a) => a.id != article.id && !a.data.draft)

	const scoredArticles = articles.map((article) => {
		return { article: article, score: 0 }
	})
	// Tag +30
	article.data.tags.forEach((currentTag) => {
		scoredArticles.forEach((currentArticle) => {
			if (currentArticle.article.data.tags.map((t) => t.slug).includes(currentTag.slug))
				currentArticle.score += 30
		})
	})
	// Location +10
	article.data.places.forEach((currentPlace) => {
		scoredArticles.forEach((currentArticle) => {
			if (currentArticle.article.data.places.map((p) => p.slug).includes(currentPlace.slug))
				currentArticle.score += 10
		})
	})
	// Palette +5
	scoredArticles.forEach((currentArticle) => {
		if (currentArticle.article.data.palette == article.data.palette) currentArticle.score += 5
	})
	// Date: -3 pts per year older
	scoredArticles.forEach((currentArticle) => {
		const yearDifference =
			currentArticle.article.data.date.getFullYear() - article.data.date.getFullYear()
		if (yearDifference < 0) currentArticle.score += yearDifference * 3
	})
	const result = scoredArticles
		.sort((a, b) => b.score - a.score)
		.slice(0, 3)
		.filter((a) => a.score > 20)
	return result
}
