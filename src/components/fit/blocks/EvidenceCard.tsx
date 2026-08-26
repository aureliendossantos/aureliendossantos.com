import type { EvidenceItem } from "$utils/fit/evidence"
import { MediaFrame } from "../MediaFrame"
import type { Labels } from "../labels"

interface Props {
	t: Labels
	/** Trusted, locally resolved project metadata. Never model output. */
	project: EvidenceItem
	/** The one part the model actually writes. */
	relevance: string | undefined
	caveat: string | undefined
	onOpen: () => void
}

/**
 * An editorial evidence panel.
 *
 * The card mounts as soon as its `projectId` resolves against local data, so
 * the thumbnail, title, dates and roles are on screen while the model is still
 * writing the only bespoke part — why this project matters for this brief.
 *
 * It stays deliberately thin: identity, then relevance. Everything else about
 * the project (its description, its media, what was actually built) lives one
 * click away in the modal, so the report reads as an argument rather than as a
 * stack of project pages.
 *
 * Only the header opens the modal. A button stretched over the whole card would
 * make the prose unselectable, and a recruiter copying a line out of the
 * assessment is exactly the behaviour worth protecting.
 */
export function EvidenceCard({ t, project, relevance, caveat, onOpen }: Props) {
	return (
		<article className="fit-enter border border-fi-ui bg-fi-bg-2/50 p-6 medium:p-5">
			<header className="group relative flex items-start gap-5 border-b border-fi-ui pb-4 medium:gap-4">
				{project.thumbnail && (
					<MediaFrame
						media={project.thumbnail}
						className="h-[84px] w-[112px] shrink-0 border border-fi-ui bg-fi-bg-2 object-cover transition group-hover:border-fi-ui-3 medium:h-[60px] medium:w-[80px]"
					/>
				)}
				<div className="min-w-0 flex-1">
					<h3 className="text-pretty text-xl font-medium text-fi-tx transition group-hover:text-fi-orange-700">
						{project.title}
					</h3>
					<p className="mt-1 font-google-sans-code text-[11px] uppercase tracking-[0.1em] text-fi-base-500">
						{[project.client, project.dateLabel].filter(Boolean).join(" · ")}
					</p>
					{(project.roles.length > 0 || project.tools.length > 0) && (
						<ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-google-sans-code text-[11px] text-fi-base-500">
							{[...project.roles, ...project.tools].map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					)}
					<p
						aria-hidden
						className="mt-2 font-google-sans-code text-[11px] uppercase tracking-[0.14em] text-fi-base-400 transition group-hover:text-fi-orange"
					>
						{t.projectDetails} →
					</p>
				</div>
				{/* Stretched over the header only, so the analysis below stays selectable. */}
				<button
					type="button"
					onClick={onOpen}
					aria-label={t.openProject(project.title)}
					className="absolute inset-0 cursor-pointer rounded-[2px] outline-offset-4"
				/>
			</header>

			<div className="pt-4">
				<h4 className="font-google-sans-code text-[11px] font-medium uppercase tracking-[0.14em] text-fi-orange-600">
					{t.whyItMatters}
				</h4>
				{relevance && <p className="mt-2 text-pretty leading-relaxed text-fi-tx">{relevance}</p>}
				{caveat && caveat.trim().length > 0 && (
					<p className="mt-3 text-pretty border-l-2 border-fi-ui-3 pl-3 text-sm leading-relaxed text-fi-tx-2">
						<span className="font-google-sans-code text-[11px] uppercase tracking-[0.1em] text-fi-base-500">
							{t.caveat}.{" "}
						</span>
						{caveat}
					</p>
				)}
			</div>
		</article>
	)
}
