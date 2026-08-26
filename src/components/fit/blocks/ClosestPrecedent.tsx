import type { FitReport } from "$utils/fit/schema"
import { Section } from "../Section"
import type { Labels } from "../labels"

interface Props {
	t: Labels
	precedent: Partial<FitReport["precedent"]> | undefined
}

/** One labelled column of short points. Hidden until it has something in it. */
function Column({ title, points }: { title: string; points: Array<string | undefined> }) {
	const items = points.filter((point): point is string => Boolean(point?.trim()))
	if (items.length === 0) return null
	return (
		<div className="fit-enter">
			<h3 className="mb-2 font-google-sans-code text-[11px] font-medium uppercase tracking-[0.14em] text-fi-base-500">
				{title}
			</h3>
			<ul className="space-y-2">
				{items.map((point, index) => (
					<li
						key={index}
						className="text-pretty border-l border-fi-ui-2 pl-3 text-sm leading-relaxed text-fi-tx-2"
					>
						{point}
					</li>
				))}
			</ul>
		</div>
	)
}

/**
 * The closest analogous work, or the patterns that carry across several
 * projects when nothing single comes close.
 *
 * The three columns are the interesting reasoning: what was similar, what
 * transfers, and — the honest one — what was different.
 */
export function ClosestPrecedent({ t, precedent }: Props) {
	const headline = precedent?.headline?.trim() ?? ""
	const hasPoints = Boolean(
		precedent?.similar?.length || precedent?.transfers?.length || precedent?.different?.length,
	)

	return (
		<Section
			label={
				precedent?.mode === "patterns" ? t.sections.precedentPatterns : t.sections.precedentSingle
			}
			when={headline.length > 0 || hasPoints}
		>
			{headline && <p className="text-pretty text-lg leading-relaxed text-fi-tx">{headline}</p>}
			<div className="mt-6 grid grid-cols-3 gap-x-8 gap-y-6 mediumlarge:grid-cols-1">
				<Column title={t.similar} points={precedent?.similar ?? []} />
				<Column title={t.transfers} points={precedent?.transfers ?? []} />
				<Column title={t.different} points={precedent?.different ?? []} />
			</div>
		</Section>
	)
}
