import type { DeepPartial, FitSection } from "$utils/fit/schema"
import { Section } from "../Section"
import type { Labels } from "../labels"

type PrecedentBlock = DeepPartial<Extract<FitSection, { kind: "precedent" }>>

interface Props {
	t: Labels
	block: PrecedentBlock
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
export function ClosestPrecedent({ t, block }: Props) {
	const headline = block.headline?.trim() ?? ""

	return (
		<Section
			label={block.mode === "patterns" ? t.sections.precedentPatterns : t.sections.precedentSingle}
		>
			{headline && <p className="text-pretty text-lg leading-relaxed text-fi-tx">{headline}</p>}
			<div className="mt-6 grid grid-cols-3 gap-x-8 gap-y-6 mediumlarge:grid-cols-1">
				<Column title={t.similar} points={block.similar ?? []} />
				<Column title={t.transfers} points={block.transfers ?? []} />
				<Column title={t.different} points={block.different ?? []} />
			</div>
		</Section>
	)
}
