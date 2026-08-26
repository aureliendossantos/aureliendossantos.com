import { useEffect, useMemo, useState } from "react"
import { useObject } from "@ai-sdk/react"
import type { EvidenceItem } from "$utils/fit/evidence"
import { fitReportSchema, type PartialFitReport } from "$utils/fit/schema"
import { FitInput } from "./FitInput"
import { FitReport } from "./FitReport"
import { errorMessage, labels, type UiLocale } from "./labels"

interface Props {
	/** Trusted portfolio metadata, resolved at build time on the Astro page. */
	evidenceIndex: EvidenceItem[]
	locale: UiLocale
	contactHref: string
}

/**
 * The interactive island.
 *
 * Server-rendered with the page, so the prompt and the textarea exist in the
 * initial HTML and accept typing immediately; hydration only adds the submit
 * action and the streaming report.
 */
export function FitMatcher({ evidenceIndex, locale, contactHref }: Props) {
	const t = labels[locale]

	// Nothing about the submit action is offered until the code behind it is
	// running. `ready` flips on the first client effect.
	const [ready, setReady] = useState(false)
	useEffect(() => setReady(true), [])

	// Bumped per run so every section latch in the report resets cleanly.
	const [runId, setRunId] = useState(0)
	const [streamFailed, setStreamFailed] = useState(false)

	const projects = useMemo(
		() => new Map(evidenceIndex.map((item) => [item.id, item])),
		[evidenceIndex],
	)

	const { object, submit, stop, isLoading, error } = useObject({
		api: "/api/fit",
		schema: fitReportSchema,
		onError: () => setStreamFailed(true),
		onFinish({ object: finalObject, error: validationError }) {
			// A report cut short by the output cap is still worth reading, so a
			// validation error only counts as a failure when nothing usable
			// arrived at all.
			if (validationError && !finalObject) setStreamFailed(true)
		},
	})

	const report = object as PartialFitReport | undefined
	const hasContent = Boolean(report && Object.keys(report).length > 0)
	const message = errorMessage(t, error) ?? (streamFailed ? t.errors.generic : undefined)
	// A stream that failed before producing anything readable has nothing to show.
	const failedEmpty = Boolean(message) && !report?.fitSummary

	return (
		<div>
			<FitInput
				t={t}
				ready={ready}
				isLoading={isLoading}
				hasReport={hasContent && !isLoading}
				onSubmit={(brief) => {
					setStreamFailed(false)
					setRunId((id) => id + 1)
					submit({ brief })
				}}
				onStop={stop}
			/>

			{message && (
				<p
					role="status"
					className="fit-enter mt-6 border-l-2 border-fi-red-200 py-1 pl-4 text-fi-red-700"
				>
					{message}
				</p>
			)}

			{isLoading && !hasContent && (
				<p
					role="status"
					className="fit-pulse mt-8 font-google-sans-code text-[11px] uppercase tracking-[0.14em] text-fi-base-400"
				>
					{t.working}
				</p>
			)}

			{hasContent && !failedEmpty && (
				<FitReport
					key={runId}
					report={report!}
					projects={projects}
					pageLocale={locale}
					isLoading={isLoading}
					contactHref={contactHref}
				/>
			)}
		</div>
	)
}
