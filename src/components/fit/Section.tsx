import type { ReactNode } from "react"

interface SectionProps {
	/**
	 * The block's heading. App-owned for the structured blocks; written by the
	 * model, in the visitor's language, for free-text notes.
	 */
	label: string
	children: ReactNode
	/** The gaps block earns a stronger frame; everything else stays quiet. */
	tone?: "plain" | "framed"
}

/**
 * The shell every block shares: a rule, a small technical label, the content.
 *
 * Blocks arrive in a stream that only ever grows, so a mounted block never
 * needs to guard against its own content disappearing — it renders whatever
 * has arrived and fills in as the rest streams.
 */
export function Section({ label, children, tone = "plain" }: SectionProps) {
	return (
		<section
			className={
				tone === "framed"
					? "fit-enter mt-14 border-t-2 border-fi-tx pt-6"
					: "fit-enter mt-14 border-t border-fi-ui pt-6"
			}
		>
			<h2 className="mb-5 text-pretty font-google-sans-code text-[11px] font-medium uppercase tracking-[0.14em] text-fi-base-500">
				{label}
			</h2>
			{children}
		</section>
	)
}
