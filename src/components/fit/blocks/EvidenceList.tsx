import type { EvidenceItem } from "$utils/fit/evidence"
import type { DeepPartial, FitSection } from "$utils/fit/schema"
import { Section } from "../Section"
import { EvidenceCard } from "./EvidenceCard"
import type { Labels } from "../labels"

type EvidenceEntry = DeepPartial<Extract<FitSection, { kind: "evidence" }>["items"][number]>

interface Props {
	t: Labels
	items: EvidenceEntry[] | undefined
	/** Trusted project metadata, keyed by project ID. */
	projects: Map<string, EvidenceItem>
	onOpenProject: (project: EvidenceItem) => void
}

export function EvidenceList({ t, items, projects, onOpenProject }: Props) {
	// A projectId the model invented resolves to nothing and its card is simply
	// dropped: the report loses an argument rather than gaining a fake project.
	// A half-streamed ID resolves to nothing too, so the card appears a moment
	// later instead of flickering through a wrong match.
	const resolved = (items ?? []).flatMap((item, index) => {
		const project = item?.projectId ? projects.get(item.projectId) : undefined
		return project ? [{ key: `${item!.projectId}-${index}`, project, item: item! }] : []
	})

	return (
		<Section label={t.sections.evidence}>
			<div className="grid gap-6">
				{resolved.map(({ key, project, item }) => (
					<EvidenceCard
						key={key}
						t={t}
						project={project}
						relevance={item.relevance}
						caveat={item.caveat}
						onOpen={() => onOpenProject(project)}
					/>
				))}
			</div>
		</Section>
	)
}
