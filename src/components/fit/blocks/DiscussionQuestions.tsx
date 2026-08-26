import type { FitReport } from "$utils/fit/schema"
import { Section } from "../Section"
import type { Labels } from "../labels"

type PartialQuestion = Partial<FitReport["questions"][number]> | undefined

interface Props {
	t: Labels
	questions: Array<PartialQuestion> | undefined
	/** Existing contact destination on the site. */
	contactHref: string
	/** Only offered once the report is finished, so it never rushes the reader. */
	showContact: boolean
}

export function DiscussionQuestions({ t, questions, contactHref, showContact }: Props) {
	const items = (questions ?? []).filter((item): item is Partial<FitReport["questions"][number]> =>
		Boolean(item?.question),
	)

	return (
		<Section label={t.sections.questions} when={items.length > 0}>
			<ul className="space-y-6">
				{items.map((item, index) => (
					<li key={index} className="fit-enter">
						<p className="text-pretty text-lg leading-snug text-fi-tx">{item.question}</p>
						{item.why && (
							<p className="mt-1 text-pretty text-sm leading-relaxed text-fi-tx-2">{item.why}</p>
						)}
					</li>
				))}
			</ul>
			{showContact && (
				<a
					href={contactHref}
					className="fit-enter mt-8 inline-block border border-fi-tx-2 px-4 py-2 font-google-sans-code text-[11px] font-medium uppercase tracking-[0.14em] text-fi-tx-2 transition hover:border-fi-orange hover:text-fi-orange"
				>
					{t.contact}
				</a>
			)}
		</Section>
	)
}
