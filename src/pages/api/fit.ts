import type { APIRoute } from "astro"
import { createOpenAI } from "@ai-sdk/openai"
import { createTextStreamResponse, Output, streamText, toTextStream } from "ai"
import { AI_MATCH_MODEL, OPENAI_API_KEY } from "astro:env/server"
import {
	MAX_BODY_BYTES,
	MAX_INPUT_CHARS,
	MAX_OUTPUT_TOKENS,
	MIN_INPUT_CHARS,
} from "$utils/fit/limits"
import { REASONING_EFFORT, describeModelChoice, resolveModelId } from "$utils/fit/models"
import { fitReportSchema } from "$utils/fit/schema"
import { buildCandidateDossier, buildUserMessage, systemPrompt } from "$utils/fit/prompt"

/**
 * Streams a structured fit assessment.
 *
 * This is the only on-demand route of the feature: `/fit` itself stays static.
 * The OpenAI key and the candidate dossier never leave this function — the
 * browser only ever receives the streamed report object.
 *
 * Abuse safeguards implemented here are the cheap, deterministic ones: method,
 * content type, body size, input length, output token cap. Per-IP rate limiting
 * is deliberately NOT faked in memory — a serverless function has no shared
 * state to enforce it with. See README ("Fit assessment") for the
 * deployment-level configuration that still has to be set up by hand.
 */
export const prerender = false

/** Error codes, not sentences: the island localises them. */
type FitError =
	| "method_not_allowed"
	| "bad_request"
	| "input_too_short"
	| "input_too_long"
	| "not_configured"
	| "upstream_error"

const fail = (code: FitError, status: number) =>
	new Response(code, {
		status,
		headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
	})

export const GET: APIRoute = () => fail("method_not_allowed", 405)

export const POST: APIRoute = async ({ request }) => {
	if (!request.headers.get("content-type")?.includes("application/json")) {
		return fail("bad_request", 415)
	}

	// Reject on the declared size before reading, then on the real size after:
	// Content-Length is a hint, not a promise.
	const declaredLength = Number(request.headers.get("content-length") ?? 0)
	if (declaredLength > MAX_BODY_BYTES) return fail("input_too_long", 413)

	const raw = await request.text()
	if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return fail("input_too_long", 413)

	let brief: unknown
	try {
		brief = (JSON.parse(raw) as { brief?: unknown }).brief
	} catch {
		return fail("bad_request", 400)
	}
	if (typeof brief !== "string") return fail("bad_request", 400)

	const trimmed = brief.trim()
	if (trimmed.length < MIN_INPUT_CHARS) return fail("input_too_short", 422)
	if (trimmed.length > MAX_INPUT_CHARS) return fail("input_too_long", 413)

	if (!OPENAI_API_KEY) {
		console.warn("[fit] OPENAI_API_KEY is not set — the endpoint is disabled.")
		return fail("not_configured", 503)
	}

	const modelId = resolveModelId({ override: AI_MATCH_MODEL })
	const openai = createOpenAI({ apiKey: OPENAI_API_KEY })

	let dossier: string
	try {
		dossier = await buildCandidateDossier()
	} catch (error) {
		console.error("[fit] Could not build the candidate dossier:", error)
		return fail("upstream_error", 500)
	}

	const result = streamText({
		model: openai(modelId),
		system: `${systemPrompt}\n\n${dossier}`,
		prompt: buildUserMessage(trimmed),
		output: Output.object({ schema: fitReportSchema }),
		maxOutputTokens: MAX_OUTPUT_TOKENS,
		// Lets the visitor's "Stop" actually cancel the upstream call.
		abortSignal: request.signal,
		providerOptions: {
			openai: { reasoningEffort: REASONING_EFFORT },
		},
		onError({ error }) {
			// Errors raised after the response headers are sent can only be logged;
			// the island detects the truncated object and shows an error state.
			console.error("[fit] Stream error:", error)
		},
	})

	// With an object output the JSON arrives as text deltas, which is exactly the
	// partial-JSON stream `useObject` parses on the other end.
	return createTextStreamResponse({
		stream: toTextStream({ stream: result.stream }),
		headers: {
			"cache-control": "no-store",
			// Handy when checking which tier a deployment is actually using.
			"x-fit-model": `${modelId} (${describeModelChoice(modelId)})`,
		},
	})
}
