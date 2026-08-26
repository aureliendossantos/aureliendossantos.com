/**
 * Hard limits for the fit assessment.
 *
 * Kept apart from `models.ts` because the browser needs the input limits (to
 * show a counter and refuse an oversized submit) while model selection must
 * stay server-side. Nothing here reads the environment, so it is safe to bundle
 * into the island.
 */

/** Enough for a long job listing, small enough to keep a public endpoint cheap. */
export const MAX_INPUT_CHARS = 12_000

/** Below this there is nothing to assess, and we save a model call. */
export const MIN_INPUT_CHARS = 40

/** Hard ceiling on the raw request body, checked before JSON parsing. */
export const MAX_BODY_BYTES = 64 * 1024

/**
 * Cap on generated tokens. Reasoning tokens count against this budget, hence
 * the headroom over the ~1200 tokens the report itself needs.
 */
export const MAX_OUTPUT_TOKENS = 4000
