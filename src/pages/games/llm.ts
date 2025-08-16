import type { APIContext } from "astro"
import { getCollection } from "astro:content"

export const prerender = false

export async function GET(_context: APIContext): Promise<Response> {
	try {
		const games = await getCollection("games")

		// Sort similarly to index for consistency (by quickReview order then title)
		const reviewsOrder = [
			"Coup de cœur",
			"Aimé",
			"Sympa un moment",
			"Pas pour moi",
			"Mitigé",
			"Whatever",
			"Décevant",
			"J'aime pas",
			"Mauvais",
			null,
		]

		games.sort(
			({ data: a }, { data: b }) =>
				reviewsOrder.indexOf((a as any).quickReview || null) -
					reviewsOrder.indexOf((b as any).quickReview || null) || a.title.localeCompare(b.title)
		)

		// Build plain text dataset.
		const lines: string[] = []
		lines.push(
			"Page compacte destinée aux LLM. Catalogue des jeux auxquels j’ai joué, trié par appréciation. " +
				"Chaque ligne représente un jeu avec mon appréciation et ma progression dans le jeu."
		)
		lines.push(
			"Utilisez cette liste pour inférer mes goûts et suggérer des recommandations cohérentes avec mes sentiments exprimés. " +
				"Échelle d'appréciation : Coup de cœur, Aimé, Sympa un moment, Mitigé, Décevant, J'aime pas, Mauvais..."
		)
		lines.push("")
		lines.push("Structure : Titre (année) - Appréciation rapide - Progression - Notes optionnelles")

		for (const { data } of games) {
			const releaseYear = (data as any).igdb?.release_dates?.[0]?.y
			const title = releaseYear ? `${data.title} (${releaseYear})` : data.title
			const quickReview = data.quickReview || ""
			const progress = data.progress || ""
			const review = (data.review || "").replace(/\s+/g, " ").trim()
			const blocksText = extractPlainText(data.blocks || []).replace(/\n/g, "\\n")
			const notes = [review, blocksText].filter(Boolean).join(review && blocksText ? "\\n\\n" : "")
			lines.push(`* ${title} - ${quickReview} - ${progress}${notes ? ` - ${notes}` : ""}`)
		}

		const body = lines.join("\n")

		return new Response(body, {
			status: 200,
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
			},
		})
	} catch (err) {
		console.error("GET /games/llm failed:", err)
		return new Response("Unable to load catalogue", {
			status: 500,
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		})
	}
}

// Helper to flatten Notion-like block content if present.
function extractPlainText(blocks: any[]): string {
	if (!blocks || blocks.length === 0) return ""
	try {
		return blocks
			.map((b: any) => {
				if (!b) return ""
				// Common Notion block shapes: { type: 'paragraph', paragraph: { rich_text: [{ plain_text }] } }
				const type = b.type
				const container = b[type]
				if (container && Array.isArray(container.rich_text)) {
					return container.rich_text.map((t: any) => t.plain_text || t.text?.content || "").join("")
				}
				if (b.plain_text) return b.plain_text
				return ""
			})
			.filter(Boolean)
			.join("\n")
			.replace(/\n{3,}/g, "\n\n")
			.trim()
	} catch {
		return ""
	}
}
