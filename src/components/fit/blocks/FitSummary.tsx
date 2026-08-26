import type { FitLevel } from "$utils/fit/schema"
import type { Labels } from "../labels"

/**
 * The verdict, and the first thing on the page.
 *
 * Deliberately not a gauge, a meter or a percentage: the qualitative word is
 * the whole claim, and a number would invent precision the model does not have.
 */

const levelStyles: Record<FitLevel, string> = {
	strong: "border-fi-green-150 bg-fi-green-50 text-fi-green-700",
	promising: "border-fi-cyan-150 bg-fi-cyan-50 text-fi-cyan-700",
	mixed: "border-fi-yellow-150 bg-fi-yellow-50 text-fi-yellow-800",
	weak: "border-fi-red-150 bg-fi-red-50 text-fi-red-700",
}

interface Props {
	t: Labels
	level: FitLevel | undefined
	summary: string | undefined
}

export function FitSummary({ t, level, summary }: Props) {
	return (
		<div className="fit-enter">
			{level && (
				<div
					className={`mb-5 inline-block border px-3 py-1 font-google-sans-code text-[11px] font-medium uppercase tracking-[0.14em] ${levelStyles[level]}`}
				>
					{t.fitLevels[level]}
				</div>
			)}
			{summary && (
				<p className="text-pretty text-2xl leading-[1.45] text-fi-tx medium:text-xl">{summary}</p>
			)}
		</div>
	)
}
