/**
 * Offline checks for the /fit assessment pipeline.
 *
 * Run with `pnpm check:fit`. No OpenAI credentials and no network: the model is
 * mocked, so this can run on every change without spending anything.
 *
 * It covers the parts that are easy to break and expensive to notice:
 *
 * - the server pipeline (`streamText` + `Output.object` + `toTextStream`)
 *   really does emit the partial JSON that `useObject` parses;
 * - partial objects stay parseable at every intermediate chunk, which is what
 *   the deep-partial components rely on;
 * - the schema's field order matches the intended streaming order;
 * - model selection picks Luna everywhere except a real production deployment.
 *
 * Modules that touch `astro:content` (evidence, prompt) cannot be imported
 * outside an Astro build, so they are verified by the build itself.
 */

import assert from "node:assert/strict"
import { Output, streamText, toTextStream } from "ai"
import { MockLanguageModelV4, simulateReadableStream } from "ai/test"
import { parsePartialJson } from "ai"
import { fitReportSchema } from "../src/utils/fit/schema"
import { MODELS, resolveModelId } from "../src/utils/fit/models"

let failures = 0
function check(name: string, run: () => void | Promise<void>) {
	return Promise.resolve()
		.then(run)
		.then(() => console.log(`  ok  ${name}`))
		.catch((error) => {
			failures++
			console.error(`FAIL  ${name}\n      ${error instanceof Error ? error.message : error}`)
		})
}

/** A complete, schema-valid report, used as the mocked model output. */
const sampleReport = {
	language: "en",
	fitLevel: "mixed",
	fitSummary: "Real overlap on the front-end work, no evidence for the infrastructure half.",
	needs: [
		{
			label: "Design-to-implementation ownership",
			detail: "One person carrying a feature end to end.",
		},
		{
			label: "Production infrastructure",
			detail: "Independent ownership of deployment and scaling.",
		},
	],
	evidence: [
		{ projectId: "site", relevance: "Static generation and custom tooling, solo.", caveat: "" },
		{
			projectId: "grimoire",
			relevance: "A framework migration with measured gains.",
			caveat: "No team context.",
		},
	],
	precedent: {
		mode: "single",
		headline: "The Grimoire Archive migration is the closest analogue.",
		similar: ["An existing codebase moved to a new rendering model."],
		transfers: ["Incremental migration under a live product."],
		different: ["No infrastructure ownership was involved."],
	},
	gaps: [
		{
			requirement: "AWS platform engineering",
			level: "none",
			assessment: "Nothing in the record covers this.",
		},
		{
			requirement: "Team leadership",
			level: "adjacent",
			assessment: "Coordination experience, not engineering management.",
		},
	],
	contribution: "",
	questions: [
		{
			question: "How much of the infrastructure work is genuinely owned solo?",
			why: "It decides whether the gap is fatal.",
		},
	],
} satisfies unknown

/** Splits the JSON into many small deltas, the way a real stream arrives. */
function chunkJson(json: string, size = 24) {
	const chunks: string[] = []
	for (let i = 0; i < json.length; i += size) chunks.push(json.slice(i, i + size))
	return chunks
}

async function streamMockedReport() {
	const json = JSON.stringify(sampleReport)
	const deltas = chunkJson(json)

	const model = new MockLanguageModelV4({
		doStream: async () => ({
			stream: simulateReadableStream({
				chunkDelayInMs: 0,
				initialDelayInMs: 0,
				chunks: [
					{ type: "stream-start" as const, warnings: [] },
					{ type: "text-start" as const, id: "0" },
					...deltas.map((delta) => ({ type: "text-delta" as const, id: "0", delta })),
					{ type: "text-end" as const, id: "0" },
					{
						type: "finish" as const,
						finishReason: "stop" as const,
						usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
					},
				],
			}),
		}),
	})

	const result = streamText({
		model,
		system: "trusted dossier",
		prompt: "untrusted brief",
		output: Output.object({ schema: fitReportSchema }),
	})

	const snapshots: unknown[] = []
	let accumulated = ""
	for await (const text of toTextStream({ stream: result.stream })) {
		accumulated += text
		// Exactly what useObject does with each chunk it receives.
		const { value } = await parsePartialJson(accumulated)
		snapshots.push(value)
	}
	return { accumulated, snapshots }
}

await check("the stream yields partial JSON that useObject can parse", async () => {
	const { accumulated, snapshots } = await streamMockedReport()
	assert.ok(snapshots.length > 5, "expected many streamed snapshots")
	assert.deepEqual(JSON.parse(accumulated), sampleReport)
})

await check("every intermediate snapshot is a usable partial object", async () => {
	const { snapshots } = await streamMockedReport()
	for (const snapshot of snapshots) {
		assert.ok(
			snapshot === undefined || typeof snapshot === "object",
			"a partial snapshot was neither undefined nor an object",
		)
	}
	// The verdict must be readable long before the report finishes.
	const firstWithVerdict = snapshots.findIndex(
		(snapshot) => (snapshot as { fitLevel?: string } | undefined)?.fitLevel !== undefined,
	)
	assert.ok(firstWithVerdict >= 0, "the verdict never appeared")
	assert.ok(
		firstWithVerdict < snapshots.length / 2,
		"the verdict should stream near the start, not near the end",
	)
})

await check("the finished object validates against the schema", async () => {
	const { accumulated } = await streamMockedReport()
	fitReportSchema.parse(JSON.parse(accumulated))
})

await check("schema field order matches the intended streaming order", () => {
	assert.deepEqual(Object.keys(fitReportSchema.shape), [
		"language",
		"fitLevel",
		"fitSummary",
		"needs",
		"evidence",
		"precedent",
		"gaps",
		"contribution",
		"questions",
	])
})

await check("model selection: dev, preview, production and override", () => {
	assert.equal(resolveModelId({ vercelEnv: undefined }), MODELS.development)
	assert.equal(resolveModelId({ vercelEnv: "development" }), MODELS.development)
	assert.equal(resolveModelId({ vercelEnv: "preview" }), MODELS.development)
	assert.equal(resolveModelId({ vercelEnv: "production" }), MODELS.production)
	assert.equal(
		resolveModelId({ vercelEnv: "production", override: "gpt-5.6-luna" }),
		"gpt-5.6-luna",
	)
})

console.log(failures === 0 ? "\nAll fit checks passed." : `\n${failures} check(s) failed.`)
process.exit(failures === 0 ? 0 : 1)
