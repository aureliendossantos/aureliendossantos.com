import { useState } from "react"
import type { EvidenceItem } from "$utils/fit/evidence"
import { isSection, type PartialFitReport, type PartialFitSection } from "$utils/fit/schema"
import { FitSummary } from "./blocks/FitSummary"
import { NeedsAnalysis } from "./blocks/NeedsAnalysis"
import { EvidenceList } from "./blocks/EvidenceList"
import { ClosestPrecedent } from "./blocks/ClosestPrecedent"
import { GapAnalysis } from "./blocks/GapAnalysis"
import { DiscussionQuestions } from "./blocks/DiscussionQuestions"
import { NoteBlock } from "./blocks/NoteBlock"
import { ProjectModal } from "./ProjectModal"
import { labels, type Labels, type UiLocale } from "./labels"

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
 * Assembles the report as its blocks arrive.
 *
 * The verdict is pinned at the top; everything after it is an ordered stream
 * the model composes itself, so the page grows strictly downwards. Nothing
 * reorders, nothing is reserved for a block that may never come, and no
 * skeleton of future sections is shown.
 */
export function FitReport({ report, projects, pageLocale, isLoading, contactHref }: Props) {
	// The model reports the brief's language first; the app renders every label
	// in that language, so a French brief on the English page reads as French.
	const t = labels[report.language ?? pageLocale]
	const [openProject, setOpenProject] = useState<EvidenceItem | null>(null)
	const finished = !isLoading

	return (
		<div className="mt-12">
			<FitSummary t={t} level={report.fitLevel} summary={report.fitSummary} />

			{(report.sections ?? []).map((section, index) => (
				<ReportBlock
					key={index}
					t={t}
					section={section}
					projects={projects}
					contactHref={contactHref}
					finished={finished}
					onOpenProject={setOpenProject}
				/>
			))}

			{finished && (
				<p className="fit-enter mt-14 border-t border-fi-ui pt-5 text-sm leading-relaxed text-fi-base-500">
					{t.disclaimer}
				</p>
			)}

			<ProjectModal project={openProject} t={t} onClose={() => setOpenProject(null)} />
		</div>
	)
}

interface BlockProps {
	t: Labels
	section: PartialFitSection | undefined
	projects: Map<string, EvidenceItem>
	contactHref: string
	finished: boolean
	onOpenProject: (project: EvidenceItem) => void
}

/**
 * Renders one streamed block.
 *
 * `kind` arrives before the block's contents, and a half-written discriminant
 * matches nothing — so a block appears the moment it is identifiable, with its
 * heading, and fills in underneath.
 */
function ReportBlock({ t, section, projects, contactHref, finished, onOpenProject }: BlockProps) {
	if (isSection(section, "needs")) return <NeedsAnalysis t={t} items={section.items} />

	if (isSection(section, "evidence")) {
		return (
			<EvidenceList t={t} items={section.items} projects={projects} onOpenProject={onOpenProject} />
		)
	}

	if (isSection(section, "precedent")) return <ClosestPrecedent t={t} block={section} />

	if (isSection(section, "gaps")) return <GapAnalysis t={t} items={section.items} />

	if (isSection(section, "questions")) {
		return (
			<DiscussionQuestions
				t={t}
				items={section.items}
				contactHref={contactHref}
				showContact={finished}
			/>
		)
	}

	if (isSection(section, "note")) {
		// The heading is the block's whole identity, so it waits for one.
		if (!section.heading?.trim()) return null
		return <NoteBlock heading={section.heading} paragraphs={section.paragraphs} />
	}

	return null
}
