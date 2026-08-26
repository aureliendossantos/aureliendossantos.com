import type { EvidenceItem } from "$utils/fit/evidence"
import type { FitReport } from "$utils/fit/schema"
import { Section } from "../Section"
import { EvidenceCard } from "./EvidenceCard"
import type { Labels } from "../labels"

type PartialEvidence = Partial<FitReport["evidence"][number]> | undefined

interface Props {
	t: Labels
	evidence: Array<PartialEvidence> | undefined
	/** Trusted project metadata, keyed by project ID. */
	projects: Map<string, EvidenceItem>
}

export function EvidenceList({ t, evidence, projects }: Props) {
	// A projectId the model invented resolves to nothing and its card is simply
	// dropped: the report loses an argument rather than gaining a fake project.
	// A half-streamed ID resolves to nothing too, so the card appears a moment
	// later instead of flickering through a wrong match.
	const resolved = (evidence ?? []).flatMap((item, index) => {
		const project = item?.projectId ? projects.get(item.projectId) : undefined
		return project ? [{ key: `${item!.projectId}-${index}`, project, item: item! }] : []
	})

	return (
		<Section label={t.sections.evidence} when={resolved.length > 0}>
			<div className="grid gap-6">
				{resolved.map(({ key, project, item }) => (
					<EvidenceCard
						key={key}
						t={t}
						project={project}
						relevance={item.relevance}
						caveat={item.caveat}
					/>
				))}
			</div>
		</Section>
	)
}
