import type { EvidenceItem } from "$utils/fit/evidence"
import type { PartialFitReport } from "$utils/fit/schema"
import { Section } from "./Section"
import { FitSummary } from "./blocks/FitSummary"
import { NeedsAnalysis } from "./blocks/NeedsAnalysis"
import { EvidenceList } from "./blocks/EvidenceList"
import { ClosestPrecedent } from "./blocks/ClosestPrecedent"
import { GapAnalysis } from "./blocks/GapAnalysis"
import { DiscussionQuestions } from "./blocks/DiscussionQuestions"
import { labels, type UiLocale } from "./labels"

interface Props {
	report: PartialFitReport
	/** Trusted project metadata resolved from the content collection. */
	projects: Map<string, EvidenceItem>
	/** Page language, used until the model reports the brief's language. */
	pageLocale: UiLocale
	isLoading: boolean
	contactHref: string
}

/**
 * Assembles the report in a fixed order as the fields arrive.
 *
 * Every block decides for itself whether it has enough to render, and latches
 * once it does — so the page grows downwards and never reorders, reflows a
 * finished section, or shows a skeleton of sections that may never exist.
 */
export function FitReport({ report, projects, pageLocale, isLoading, contactHref }: Props) {
	// The model reports the brief's language first; the app renders every label
	// in that language, so a French brief on the English page reads as French.
	const t = labels[report.language ?? pageLocale]
	const contribution = report.contribution?.trim() ?? ""
	const finished = !isLoading

	return (
		<div className="mt-12">
			<FitSummary t={t} level={report.fitLevel} summary={report.fitSummary} />
			<NeedsAnalysis t={t} needs={report.needs} />
			<EvidenceList t={t} evidence={report.evidence} projects={projects} />
			<ClosestPrecedent t={t} precedent={report.precedent} />
			<GapAnalysis t={t} gaps={report.gaps} />
			<Section label={t.sections.contribution} when={contribution.length > 0}>
				<p className="text-pretty text-lg leading-relaxed text-fi-tx">{contribution}</p>
			</Section>
			<DiscussionQuestions
				t={t}
				questions={report.questions}
				contactHref={contactHref}
				showContact={finished}
			/>
			{finished && (
				<p className="fit-enter mt-14 border-t border-fi-ui pt-5 text-sm leading-relaxed text-fi-base-500">
					{t.disclaimer}
				</p>
			)}
		</div>
	)
}
