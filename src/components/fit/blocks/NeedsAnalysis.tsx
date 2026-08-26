import type { FitReport } from "$utils/fit/schema"
import { Section } from "../Section"
import type { Labels } from "../labels"

type PartialNeed = Partial<FitReport["needs"][number]> | undefined

interface Props {
	t: Labels
	needs: Array<PartialNeed> | undefined
}

/**
 * The report's proof that it read the brief before reciting a CV.
 *
 * Numbered rather than bulleted: these are the axes the rest of the report is
 * argued against, so they read better as a short enumerated list.
 */
export function NeedsAnalysis({ t, needs }: Props) {
	const items = (needs ?? []).filter((need): need is Partial<FitReport["needs"][number]> =>
		Boolean(need?.label),
	)

	return (
		<Section label={t.sections.needs} when={items.length > 0}>
			<ol className="grid grid-cols-2 gap-x-10 gap-y-7 mediumlarge:grid-cols-1 mediumlarge:gap-y-6">
				{items.map((need, index) => (
					<li key={index} className="fit-enter flex gap-4">
						<span
							aria-hidden
							className="mt-[3px] font-google-sans-code text-[11px] font-medium text-fi-base-400"
						>
							{String(index + 1).padStart(2, "0")}
						</span>
						<div>
							<h3 className="font-medium text-fi-tx">{need.label}</h3>
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
