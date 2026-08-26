import type { EvidenceItem } from "$utils/fit/evidence"
import type { Labels } from "../labels"

interface Props {
	t: Labels
	/** Trusted, locally resolved project metadata. Never model output. */
	project: EvidenceItem
	/** The one part the model actually writes. */
	relevance: string | undefined
	caveat: string | undefined
}

/**
 * An editorial evidence panel.
 *
 * The card mounts as soon as its `projectId` resolves against local data, so
 * the title, dates, roles and link are on screen while the model is still
 * writing the only bespoke part — why this project matters for this brief.
 */
export function EvidenceCard({ t, project, relevance, caveat }: Props) {
	return (
		<article className="fit-enter border border-fi-ui bg-fi-bg-2/50 p-6 medium:p-5">
			<header className="border-b border-fi-ui pb-4">
				<h3 className="text-xl font-medium text-fi-tx">{project.title}</h3>
				<p className="mt-1 font-google-sans-code text-[11px] uppercase tracking-[0.1em] text-fi-base-500">
					{[project.client, project.dateLabel].filter(Boolean).join(" · ")}
				</p>
				{project.lede && (
					<p className="mt-3 text-pretty text-sm leading-relaxed text-fi-tx-2">{project.lede}</p>
				)}
				{(project.roles.length > 0 || project.tools.length > 0) && (
					<ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-google-sans-code text-[11px] text-fi-base-500">
						{[...project.roles, ...project.tools].map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				)}
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

			<footer className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
				<a
					href={project.href}
					className="text-fi-tx-2 underline decoration-fi-ui-2 underline-offset-3 transition hover:text-fi-orange hover:decoration-fi-orange-400"
				>
					{t.viewProject}
				</a>
				{project.links.map((link) => (
					<a
						key={link.url}
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-fi-tx-2 underline decoration-fi-ui-2 underline-offset-3 transition hover:text-fi-orange hover:decoration-fi-orange-400"
					>
						{link.title} <span aria-hidden>↗</span>
					</a>
				))}
			</footer>
		</article>
	)
}
