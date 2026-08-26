import type { Media } from "$utils/fit/evidence"

interface Props {
	media: Media
	className?: string
	/** Videos autoplay muted as thumbnails, and get controls in the modal. */
	controls?: boolean
}

const videoType = (src: string) => (src.split("?")[0].endsWith(".mp4") ? "video/mp4" : "video/webm")

/**
 * One image or video from a portfolio entry.
 *
 * Both come from the content collection with build-time dimensions and an
 * anchor, so the frame never has to guess a size or a crop — which is what
 * keeps the report from shifting as thumbnails decode.
 */
export function MediaFrame({ media, className, controls = false }: Props) {
	if (media.type === "image") {
		return (
			<img
				src={media.src}
				width={media.width}
				height={media.height}
				alt=""
				loading="lazy"
				decoding="async"
				className={className}
				style={{ objectPosition: media.objectPosition }}
			/>
		)
	}

	return (
		<video
			className={className}
			style={{ objectPosition: media.objectPosition }}
			muted
			loop
			playsInline
			autoPlay
			controls={controls}
			preload="metadata"
		>
			<source src={media.src} type={videoType(media.src)} />
			{media.fallback && <source src={media.fallback} type={videoType(media.fallback)} />}
		</video>
	)
}
