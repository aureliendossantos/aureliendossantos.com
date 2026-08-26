import { Section } from "../Section"

interface Props {
	heading: string | undefined
	paragraphs: Array<string | undefined> | undefined
}

/**
 * Free prose the model placed here itself.
 *
 * The escape hatch for analysis that a pre-made block would distort: context
 * that reframes the brief, a thread running across several projects, a caveat
 * about the request. The model writes the heading and chooses the position;
 * the application still owns how both look, so a note reads as part of the
 * report rather than as a chat message that wandered in.
 */
export function NoteBlock({ heading, paragraphs }: Props) {
	const items = (paragraphs ?? []).filter((text): text is string => Boolean(text?.trim()))

	return (
		<Section label={heading?.trim() || "—"}>
			<div className="max-w-[62ch] space-y-4">
				{items.map((paragraph, index) => (
					<p key={index} className="text-pretty leading-relaxed text-fi-tx">
						{paragraph}
					</p>
				))}
			</div>
		</Section>
	)
}
