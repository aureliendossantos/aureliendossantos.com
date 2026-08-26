import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { MAX_INPUT_CHARS } from "$utils/fit/limits"
import type { Labels } from "./labels"

interface Props {
	t: Labels
	/** Set once the island has hydrated; gates the submit action. */
	ready: boolean
	isLoading: boolean
	/** True once a report has been generated, so the button can offer a rerun. */
	hasReport: boolean
	onSubmit: (brief: string) => void
	onStop: () => void
}

/** The id the page's inline focus script targets before hydration. */
export const FIT_TEXTAREA_ID = "fit-brief"

/**
 * The input, rendered on the server and hydrated in place.
 *
 * The textarea is deliberately **uncontrolled**: `defaultValue` means React
 * adopts whatever the visitor has already typed into the server-rendered
 * markup instead of resetting it to an empty controlled state. Everything that
 * needs to know about the text (the counter, the submit guard) reads the DOM
 * node, so nothing depends on hydration having happened.
 *
 * The submit button ships `disabled` and is enabled by `ready`, so the action
 * is never offered before the code that performs it exists.
 */
export function FitInput({ t, ready, isLoading, hasReport, onSubmit, onStop }: Props) {
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const [length, setLength] = useState(0)

	/** Grows the textarea with its content, up to a readable maximum. */
	const resize = () => {
		const node = textareaRef.current
		if (!node) return
		node.style.height = "auto"
		node.style.height = `${Math.min(node.scrollHeight, 520)}px`
	}

	// Adopt anything typed before hydration: sync the counter and the height
	// from the live DOM value rather than from React state.
	useEffect(() => {
		setLength(textareaRef.current?.value.length ?? 0)
		resize()
	}, [])

	const submit = () => {
		const brief = textareaRef.current?.value.trim() ?? ""
		// Guarding here as well as on the button keeps ⌘+Enter from starting a
		// second concurrent run while one is already streaming.
		if (!ready || isLoading || brief.length === 0) return
		onSubmit(brief)
	}

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault()
		submit()
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
			event.preventDefault()
			submit()
		}
	}

	const tooLong = length > MAX_INPUT_CHARS

	return (
		<form onSubmit={handleSubmit} noValidate>
			<label htmlFor={FIT_TEXTAREA_ID} className="sr-only">
				{t.inputLabel}
			</label>
			<textarea
				id={FIT_TEXTAREA_ID}
				ref={textareaRef}
				name="brief"
				rows={7}
				defaultValue=""
				spellCheck={false}
				placeholder={t.placeholder}
				onInput={(event) => {
					setLength(event.currentTarget.value.length)
					resize()
				}}
				onKeyDown={handleKeyDown}
				className="block w-full resize-none border border-fi-ui-2 bg-fi-paper p-5 text-lg leading-relaxed text-fi-tx caret-fi-orange outline-none transition-colors placeholder:text-fi-base-400 focus:border-fi-tx-3 medium:p-4 medium:text-base"
			/>

			<div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
				{isLoading ? (
					<button
						type="button"
						onClick={onStop}
						className="border border-fi-ui-3 px-5 py-[10px] font-google-sans-code text-[11px] font-medium uppercase tracking-[0.14em] text-fi-tx-2 transition hover:border-fi-tx-3 hover:text-fi-tx"
					>
						{t.stop}
					</button>
				) : (
					<button
						type="submit"
						disabled={!ready || length === 0 || tooLong}
						className="border border-fi-tx bg-fi-tx px-5 py-[10px] font-google-sans-code text-[11px] font-medium uppercase tracking-[0.14em] text-fi-paper transition hover:border-fi-orange-700 hover:bg-fi-orange-700 disabled:cursor-not-allowed disabled:border-fi-ui-3 disabled:bg-transparent disabled:text-fi-base-400"
					>
						{ready ? (hasReport ? t.again : t.submit) : t.preparing}
					</button>
				)}

				<span className="font-google-sans-code text-[11px] uppercase tracking-[0.1em] text-fi-base-400">
					{t.hint}
				</span>

				<span
					className={`ml-auto font-google-sans-code text-[11px] tabular-nums ${
						tooLong ? "text-fi-red-600" : "text-fi-base-400"
					}`}
				>
					{t.counter(length, MAX_INPUT_CHARS)}
				</span>
			</div>
		</form>
	)
}
