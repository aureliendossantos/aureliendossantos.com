/**
 * Offline checks for the /fit assessment pipeline.
 *
 * Run with `pnpm check:fit`. No OpenAI credentials and no network: the model is
 * mocked and the provider's own fetch is intercepted, so this can run on every
 * change without spending anything.
 *
 * It covers the parts that are easy to break and expensive to notice:
 *
 * - the server pipeline (`streamText` + `Output.object` + `toTextStream`)
 *   really does emit the partial JSON that `useObject` parses;
 * - partial objects stay parseable at every intermediate chunk, which is what
 *   the deep-partial components rely on;
 * - the block schema survives OpenAI's strict structured-output rules, which
 *   the model-ordered union of block types could plausibly violate;
 * - the verdict still streams before the body;
 * - model selection picks Luna everywhere except a real production deployment.
 *
 * Modules that touch `astro:content` (evidence, dossier, prompt) cannot be
 * imported outside an Astro build, so they are verified by the build itself.
 */

import assert from "node:assert/strict"
import { Output, parsePartialJson, streamText, toTextStream } from "ai"
import { MockLanguageModelV4, simulateReadableStream } from "ai/test"
import { createOpenAI } from "@ai-sdk/openai"
import { fitReportSchema, type FitReport } from "../src/utils/fit/schema"
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

/**
 * A complete, schema-valid report used as the mocked model output.
 *
 * Deliberately not in the suggested order, and with a free-text note in the
 * middle: that is exactly what the block stream is meant to allow.
 */
const sampleReport: FitReport = {
	language: "en",
	fitLevel: "mixed",
	fitSummary: "Real overlap on the product side, no evidence for the infrastructure half.",
	sections: [
		{
			kind: "note",
			heading: "Two roles in one",
			paragraphs: [
				"The brief describes two jobs: someone who can carry a design system end to end, and someone who can run the infrastructure under it. They are worth assessing separately.",
			],
		},
		{
			kind: "needs",
			items: [
				{
					label: "Design-to-implementation ownership",
					detail: "One person carrying a feature end to end.",
				},
				{
					label: "Production infrastructure",
					detail: "Independent ownership of deployment and scaling.",
				},
			],
		},
		{
			kind: "evidence",
			items: [
				{ projectId: "site", relevance: "Static generation and custom tooling, solo.", caveat: "" },
				{
					projectId: "grimoire",
					relevance: "A framework migration with measured gains.",
					caveat: "No team context.",
				},
			],
		},
		{
			kind: "gaps",
			items: [
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
		},
		{
			kind: "precedent",
			mode: "single",
			headline: "The Grimoire Archive migration is the closest analogue.",
			similar: ["An existing codebase moved to a new rendering model."],
			transfers: ["Incremental migration under a live product."],
			different: ["No infrastructure ownership was involved."],
		},
		{
			kind: "questions",
			items: [
				{
					question: "How much of the infrastructure work is genuinely owned solo?",
					why: "It decides whether the gap is fatal.",
				},
			],
		},
	],
}

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

type Snapshot = { fitLevel?: string; sections?: Array<{ kind?: string }> } | undefined

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
})

await check("the verdict streams before the body", async () => {
	const { snapshots } = await streamMockedReport()
	const firstVerdict = snapshots.findIndex((s) => (s as Snapshot)?.fitLevel !== undefined)
	const firstBlock = snapshots.findIndex((s) => ((s as Snapshot)?.sections?.length ?? 0) > 0)
	assert.ok(firstVerdict >= 0, "the verdict never appeared")
	assert.ok(firstBlock > firstVerdict, "a body block appeared before the verdict")
})

await check("blocks only ever grow, so nothing on screen can disappear", async () => {
	const { snapshots } = await streamMockedReport()
	let previous = 0
	let previousKinds: string[] = []
	for (const snapshot of snapshots) {
		const sections = (snapshot as Snapshot)?.sections ?? []
		assert.ok(sections.length >= previous, "the block list shrank mid-stream")
		// A kind, once fully streamed, must never change under a mounted block.
		previousKinds.forEach((kind, index) => {
			const current = sections[index]?.kind
			assert.equal(current, kind, `block ${index} changed kind from ${kind} to ${current}`)
		})
		previous = sections.length
		previousKinds = sections
			.map((section) => section?.kind)
			.filter((kind): kind is string => typeof kind === "string")
	}
})

await check("the finished object validates against the schema", async () => {
	const { accumulated } = await streamMockedReport()
	fitReportSchema.parse(JSON.parse(accumulated))
})

/**
 * The union of block types is the part most likely to trip OpenAI's strict
 * structured-output rules, so this asserts against the real request body the
 * provider builds — captured by a fetch that never leaves the process.
 */
await check("the schema OpenAI receives satisfies strict structured-output rules", async () => {
	let body: any
	const openai = createOpenAI({
		apiKey: "test-key-never-sent",
		fetch: async (_url, init) => {
			body = JSON.parse(String(init?.body))
			return new Response('{"error":{"message":"intercepted"}}', {
				status: 400,
				headers: { "content-type": "application/json" },
			})
		},
	})

	const result = streamText({
		model: openai(MODELS.development),
		system: "trusted dossier",
		prompt: "untrusted brief",
		output: Output.object({ schema: fitReportSchema }),
		// The interception fails the call by design; that is not a test failure.
		onError: () => {},
	})
	// Drain so the request is actually issued.
	await result.consumeStream({ onError: () => {} })

	assert.ok(body, "the provider never issued a request")
	const format = body.text?.format ?? body.response_format
	assert.equal(format?.type, "json_schema", "structured output was not requested")
	assert.equal(format?.strict, true, "strict mode was not requested")

	const schema = format.schema ?? format.json_schema?.schema
	const problems: string[] = []
	const walk = (node: any, path: string) => {
		if (!node || typeof node !== "object") return
		if (node.type === "object" && node.properties) {
			const properties = Object.keys(node.properties)
			const required: string[] = node.required ?? []
			const missing = properties.filter((key) => !required.includes(key))
			if (missing.length) problems.push(`${path}: not required: ${missing.join(", ")}`)
			if (node.additionalProperties !== false) {
				problems.push(`${path}: additionalProperties is not false`)
			}
			for (const [key, value] of Object.entries(node.properties)) walk(value, `${path}.${key}`)
		}
		if (node.items) walk(node.items, `${path}[]`)
		for (const key of ["anyOf", "oneOf", "allOf"] as const) {
			if (Array.isArray(node[key])) {
				node[key].forEach((entry: unknown, index: number) =>
					walk(entry, `${path}.${key}[${index}]`),
				)
			}
		}
		for (const value of Object.values(node.$defs ?? {})) walk(value, `${path}.$defs`)
	}
	walk(schema, "root")
	assert.equal(problems.length, 0, `strict-mode problems:\n      ${problems.join("\n      ")}`)

	// The block stream must reach OpenAI as a union, not as a collapsed object.
	const sections = schema.properties?.sections
	const variants = sections?.items?.anyOf ?? sections?.items?.oneOf
	assert.ok(Array.isArray(variants) && variants.length >= 6, "the block union did not survive")
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
