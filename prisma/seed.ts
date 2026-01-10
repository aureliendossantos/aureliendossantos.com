import { prisma } from "./prisma"

const emotions = [
	{ id: 1, emoji: "💪", englishTitle: "empowered", frenchTitle: "autonomisé" },
	{ id: 2, emoji: "💅", englishTitle: "sassy", frenchTitle: "insolent" },
	{ id: 3, emoji: "🤣", englishTitle: "amused", frenchTitle: "amusé" },
	{ id: 4, emoji: "☺️", englishTitle: "relaxed", frenchTitle: "détendu" },
	{ id: 5, emoji: "🥺", englishTitle: "moved", frenchTitle: "ému" },
	{ id: 6, emoji: "🥰", englishTitle: "comforted", frenchTitle: "réconforté" },
	{ id: 7, emoji: "🤩", englishTitle: "breathtaked", frenchTitle: "émerveillé" },
	{ id: 8, emoji: "😊", englishTitle: "satisfied", frenchTitle: "satisfait" },
	{ id: 9, emoji: "😯", englishTitle: "captivated", frenchTitle: "captivé" },
	{ id: 10, emoji: "😮", englishTitle: "contemplative", frenchTitle: "contemplatif" },
	{ id: 11, emoji: "🤯", englishTitle: "mind-blown", frenchTitle: "stupéfié" },
	{ id: 12, emoji: "🧐", englishTitle: "puzzled", frenchTitle: "perplexe" },
	{ id: 13, emoji: "😔", englishTitle: "melancholic", frenchTitle: "mélancolique" },
	{ id: 14, emoji: "😎", englishTitle: "proud", frenchTitle: "fier" },
	{ id: 15, emoji: "😏", englishTitle: "saucy", frenchTitle: "coquin" },
	{ id: 16, emoji: "😈", englishTitle: "challenged", frenchTitle: "défié" },
	{ id: 17, emoji: "🤬", englishTitle: "angered", frenchTitle: "énervé" },
	{ id: 18, emoji: "🤢", englishTitle: "disgusted", frenchTitle: "dégoûté" },
	{ id: 19, emoji: "🤨", englishTitle: "skeptical", frenchTitle: "sceptique" },
	{ id: 20, emoji: "🙄", englishTitle: "annoyed", frenchTitle: "agacé" },
	{ id: 21, emoji: "🥱", englishTitle: "bored", frenchTitle: "ennuyé" },
	{ id: 22, emoji: "😕", englishTitle: "confused", frenchTitle: "confus" },
	{ id: 23, emoji: "🫥", englishTitle: "emptied", frenchTitle: "vidé" },
	{ id: 24, emoji: "😫", englishTitle: "strained", frenchTitle: "tendu" },
	{ id: 25, emoji: "😱", englishTitle: "scared", frenchTitle: "effrayé" },
	{ id: 26, emoji: "😟", englishTitle: "worried", frenchTitle: "inquiet" },
	{ id: 27, emoji: "🥸", englishTitle: "ironic", frenchTitle: "ironique" },
	{ id: 28, emoji: "😒", englishTitle: "frustrated", frenchTitle: "frustré" },
	{ id: 29, emoji: "📼", englishTitle: "nostalgic", frenchTitle: "nostalgique" },
	{ id: 30, emoji: "😅", englishTitle: "cringe", frenchTitle: "gêné" },
	{ id: 31, emoji: "😵‍💫", englishTitle: "overstimulated", frenchTitle: "surstimuné" },
	{ id: 32, emoji: "🌱", englishTitle: "inspired", frenchTitle: "inspiré" },
	{ id: 33, emoji: "🤤", englishTitle: "addicted", frenchTitle: "accro" },
	{ id: 34, emoji: "😞", englishTitle: "disappointed", frenchTitle: "déçu" },
]

async function main() {
	const e = await prisma.emotion.createMany({
		data: emotions,
		skipDuplicates: true,
	})
	console.log(`Seeded ${e.count} emotions.`)
}
main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
