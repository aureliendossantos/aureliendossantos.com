import type { DeepPartial, FitSection, GapLevel } from "$utils/fit/schema"
import { Section } from "../Section"
import type { Labels } from "../labels"

type GapItem = DeepPartial<Extract<FitSection, { kind: "gaps" }>["items"][number]>

/** Muted, deliberately unalarming: a gap is information, not a failure state. */
const levelStyles: Record<GapLevel, string> = {
	adjacent: "border-fi-cyan-150 text-fi-cyan-700",
	"ramp-up": "border-fi-yellow-150 text-fi-yellow-800",
	none: "border-fi-red-150 text-fi-red-700",
}

interface Props {
	t: Labels
	items: GapItem[] | undefined
}

/**
 * The credibility block, and the reason to trust the rest of the page.
 *
 * It gets the strongest frame on the page on purpose: an assessment that can
 * only flatter is worth nothing to a visitor, and this is where the report is
 * allowed to say that the answer is no.
 */
export function GapAnalysis({ t, items }: Props) {
	const gaps = (items ?? []).filter((gap): gap is GapItem => Boolean(gap?.requirement))

	return (
		<Section label={t.sections.gaps} tone="framed">
			<ul className="divide-y divide-fi-ui">
				{gaps.map((gap, index) => (
					<li
						key={index}
						className="fit-enter grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-2 py-5 first:pt-0 medium:grid-cols-1"
					>
						<h3 className="text-pretty text-lg font-medium text-fi-tx medium:order-2">
							{gap.requirement}
						</h3>
						{gap.level && levelStyles[gap.level] && (
							<span
								className={`justify-self-end whitespace-nowrap border-b-2 pb-[2px] font-google-sans-code text-[11px] font-medium uppercase tracking-[0.1em] medium:order-1 medium:justify-self-start ${levelStyles[gap.level]}`}
							>
								{t.gapLevels[gap.level]}
							</span>
						)}
						{gap.assessment && (
							<p className="col-span-2 text-pretty leading-relaxed text-fi-tx-2 medium:order-3 medium:col-span-1">
								{gap.assessment}
							</p>
						)}
					</li>
				))}
			</ul>
		</Section>
	)
}
