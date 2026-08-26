import { useRef, type ReactNode } from "react"

/**
 * Latches a condition to `true` for the lifetime of the component.
 *
 * Streamed fields can briefly disappear as the partial JSON is re-parsed. A
 * section that has already earned its place on the page must not blink out of
 * existence, so once a section is mounted it stays mounted. Remount the whole
 * report (a new `key`) to reset every latch for the next run.
 */
export function useLatch(condition: boolean) {
	const latched = useRef(false)
	if (condition) latched.current = true
	return latched.current
}

interface SectionProps {
	/** Small technical label above the section. Written by the app, never the model. */
	label: string
	/** Mounts the section as soon as it has enough to say. */
	when: boolean
	children: ReactNode
	/** The gaps section earns a stronger frame; everything else is quiet. */
	tone?: "plain" | "framed"
}

export function Section({ label, when, children, tone = "plain" }: SectionProps) {
	if (!useLatch(when)) return null
	return (
		<section
			className={
				tone === "framed"
					? "fit-enter mt-14 border-t-2 border-fi-tx pt-6"
					: "fit-enter mt-14 border-t border-fi-ui pt-6"
			}
		>
			<h2 className="mb-5 font-google-sans-code text-[11px] font-medium uppercase tracking-[0.14em] text-fi-base-500">
				{label}
			</h2>
			{children}
		</section>
	)
}
