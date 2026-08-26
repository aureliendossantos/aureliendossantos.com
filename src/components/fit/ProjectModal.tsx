import { useEffect, useRef } from "react"
import type { EvidenceItem } from "$utils/fit/evidence"
import { MediaFrame } from "./MediaFrame"
import type { Labels } from "./labels"

interface Props {
	/** The project to show, or null when the modal is closed. */
	project: EvidenceItem | null
	t: Labels
	onClose: () => void
}

/**
 * The full portfolio entry, behind an evidence card.
 *
 * Built on the native `<dialog>`: Escape, the focus trap, background inertness
 * and returning focus to the card that opened it all come for free, which is a
 * lot of correctness for no dependency and no bespoke keyboard handling.
 *
 * The dialog element is always mounted so its ref stays stable; only the
 * content is conditional.
 */
export function ProjectModal({ project, t, onClose }: Props) {
	const dialogRef = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) return
		if (project && !dialog.open) dialog.showModal()
		else if (!project && dialog.open) dialog.close()
	}, [project])

	return (
		<dialog
			ref={dialogRef}
			className="fit-dialog"
			aria-label={project ? project.title : undefined}
			onClose={onClose}
			// A click that lands on the dialog itself is a click on the backdrop:
			// the content sits in a child element that stops it going further.
			onClick={(event) => {
				if (event.target === dialogRef.current) onClose()
			}}
		>
			{project && (
				<article className="bg-fi-paper text-fi-black">
					<header className="sticky top-0 z-10 flex items-start gap-4 border-b border-fi-ui bg-fi-paper px-8 pb-4 pt-7 medium:px-5 medium:pt-5">
						<div className="min-w-0 flex-1">
							<p className="font-google-sans-code text-[11px] uppercase tracking-[0.14em] text-fi-base-500">
								{t.projectDetails}
							</p>
							<h2 className="mt-1 text-pretty text-3xl font-medium medium:text-2xl">
								{project.title}
							</h2>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="-mr-2 shrink-0 px-2 py-1 font-google-sans-code text-[11px] uppercase tracking-[0.14em] text-fi-tx-2 transition hover:text-fi-orange"
						>
							{t.closeProject}
						</button>
					</header>

					<div className="px-8 pb-10 pt-6 medium:px-5">
						<p className="font-google-sans-code text-[11px] uppercase tracking-[0.1em] text-fi-base-500">
							{[project.client, project.dateLabel, ...project.categories]
								.filter(Boolean)
								.join(" · ")}
						</p>

						{project.detail.lede && (
							<p className="mt-4 text-pretty text-lg leading-relaxed text-fi-tx">
								{project.detail.lede}
							</p>
						)}

						{(project.roles.length > 0 || project.tools.length > 0) && (
							<ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-google-sans-code text-[11px] text-fi-base-500">
								{[...project.roles, ...project.tools].map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						)}

						{project.detail.sections.map((section) => (
							<section key={section.heading} className="mt-8">
								<h3 className="mb-3 font-google-sans-code text-[11px] font-medium uppercase tracking-[0.14em] text-fi-orange-600">
									{section.heading}
								</h3>
								<ul className="space-y-3">
									{section.points.map((point, index) => (
										<li
											key={index}
											className="text-pretty border-l border-fi-ui-2 pl-4 leading-relaxed text-fi-tx-2"
											// Inline Markdown from the content collection, rendered and
											// sanitised at build time. Never model output.
											dangerouslySetInnerHTML={{ __html: point }}
										/>
									))}
								</ul>
							</section>
						))}

						{project.detail.media.length > 0 && (
							<div className="mt-8 space-y-4">
								{project.detail.media.map((media, index) => (
									<MediaFrame
										key={index}
										media={media}
										controls={media.type === "video"}
										className="w-full border border-fi-ui bg-fi-bg-2 object-cover"
									/>
								))}
							</div>
						)}

						<footer className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-fi-ui pt-5 text-sm">
							<a
								href={project.href}
								className="text-fi-tx-2 underline decoration-fi-ui-2 underline-offset-3 transition hover:text-fi-orange hover:decoration-fi-orange-400"
							>
								{t.viewProject}
							</a>
							{project.detail.links.map((link) => (
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
					</div>
				</article>
			)}
		</dialog>
	)
}
