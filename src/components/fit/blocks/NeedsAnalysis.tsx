import type { DeepPartial, FitSection } from "$utils/fit/schema"
import { Section } from "../Section"
import type { Labels } from "../labels"

type NeedItem = DeepPartial<Extract<FitSection, { kind: "needs" }>["items"][number]>

interface Props {
	t: Labels
	items: NeedItem[] | undefined
}

/**
 * The report's proof that it read the brief before reciting a CV.
 *
 * Numbered rather than bulleted: these are the axes the rest of the report is
 * argued against, so they read better as a short enumerated list.
 */
export function NeedsAnalysis({ t, items }: Props) {
	const needs = (items ?? []).filter((need): need is NeedItem => Boolean(need?.label))

	return (
		<Section label={t.sections.needs}>
			<ol className="grid grid-cols-2 gap-x-10 gap-y-7 mediumlarge:grid-cols-1 mediumlarge:gap-y-6">
				{needs.map((need, index) => (
					<li key={index} className="fit-enter flex gap-4">
						<span
							aria-hidden
							className="mt-[3px] font-google-sans-code text-[11px] font-medium text-fi-base-400"
						>
							{String(index + 1).padStart(2, "0")}
						</span>
						<div>
							<h3 className="text-pretty font-medium text-fi-tx">{need.label}</h3>
							{need.detail && (
								<p className="mt-1 text-pretty leading-relaxed text-fi-tx-2">{need.detail}</p>
							)}
						</div>
					</li>
				))}
			</ol>
		</Section>
	)
}
