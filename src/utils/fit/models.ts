/**
 * Model selection for the "Would I be a good fit?" endpoint.
 *
 * The one place that decides which model a deployment talks to, so there is no
 * `import.meta.env.PROD` scattered across the feature. Request and response
 * size limits live in `limits.ts`, which the browser can also import.
 *
 * Default behaviour:
 *
 * | environment              | model         |
 * | ------------------------ | ------------- |
 * | local dev / `astro dev`  | GPT-5.6 Luna  |
 * | Vercel Preview           | GPT-5.6 Luna  |
 * | Vercel Production        | GPT-5.6 Sol   |
 * | `AI_MATCH_MODEL` set     | that model    |
 *
 * A preview deployment is still testing, so it deliberately stays on the cheap
 * model even though `NODE_ENV` is `production` there.
 */

/** https://developers.openai.com/api/docs/models — verified model IDs. */
export const MODELS = {
	/** Cheapest of the GPT-5.6 family. Development and preview default. */
	development: "gpt-5.6-luna",
	/** Frontier tier. Production default. */
	production: "gpt-5.6-sol",
} as const

/**
 * Reasoning effort passed to the OpenAI Responses API.
 *
 * The task is a bounded comparison between one short brief and a small trusted
 * dossier: it benefits from real reasoning, but not from the expensive tiers.
 * Accepted values: none | minimal | low | medium | high | xhigh | max.
 */
export const REASONING_EFFORT = "low"

/**
 * Resolves the model ID for the current deployment.
 *
 * @param env - Overridable for tests. Defaults to the runtime environment.
 */
export function resolveModelId(
	env: {
		override?: string
		vercelEnv?: string
		isDev?: boolean
	} = {},
): string {
	const override = env.override ?? process.env.AI_MATCH_MODEL
	if (override) return override.trim()

	// `VERCEL_ENV` is "production" | "preview" | "development" on Vercel and
	// undefined anywhere else. Only a real production deployment gets Sol.
	const vercelEnv = env.vercelEnv ?? process.env.VERCEL_ENV
	if (vercelEnv === "production") return MODELS.production

	return MODELS.development
}

/** Human-readable label for logs and the debug header. */
export function describeModelChoice(modelId: string) {
	if (modelId === MODELS.production) return "production"
	if (modelId === MODELS.development) return "development"
	return "override"
}
