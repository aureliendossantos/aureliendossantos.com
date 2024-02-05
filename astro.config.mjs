import { defineConfig } from "astro/config"
import AutoImport from "astro-auto-import"
import tailwind from "@astrojs/tailwind"
import mdx from "@astrojs/mdx"
import vercel from "@astrojs/vercel/serverless"
import icon from "astro-icon"

// https://astro.build/config
export default defineConfig({
	output: "hybrid",
	// Remove this when https://github.com/withastro/compiler/issues/852 is fixed
	compressHTML: false,
	image: {
		service: {
			entrypoint: "$utils/imageService.ts",
		},
	},
	site: "https://aureliendossantos.com",
	integrations: [
		tailwind({
			applyBaseStyles: false,
			nesting: true,
		}),
		AutoImport({
			imports: [
				"$components/mdx/Tufte/Blockquote.astro",
				"$components/mdx/Tufte/Epigraph.astro",
				"$components/mdx/Tufte/MarginNote.astro",
				"$components/mdx/Tufte/MarginImage.astro",
				"$components/mdx/Tufte/Sidenote.astro",
				"$components/mdx/Tufte/TufteFigure.astro",
				"$components/mdx/Age.astro",
				"$components/mdx/Application.astro",
				"$components/mdx/BlogRef.astro",
				"$components/mdx/Book.astro",
				"$components/mdx/Discogs.astro",
				"$components/mdx/Figure.astro",
				"$components/mdx/Gallery.astro",
				"$components/mdx/Game.astro",
				"$components/mdx/GoogleMaps.astro",
				"$components/mdx/MapsMention.astro",
				"$components/mdx/Movie.astro",
				"$components/mdx/Note.astro",
				"$components/mdx/OpenGraph.astro",
				"$components/mdx/PhotoGallery.astro",
				"$components/mdx/Popup.astro",
				"$components/mdx/Ref.astro",
				"$components/mdx/SpotifyTrack.astro",
				"$components/mdx/Video.astro",
				"$components/mdx/Wikipedia.astro",
				// Tabs is not imported by default because it loads a CSS file
				// on every page. It seems complicated to change the code to
				// remove the CSS... Same for YouTube/Vimeo/Tweet from astro-embed.
			],
		}),
		mdx(),
		icon({
			include: {
				bi: ["stars"],
				ic: [
					"baseline-check",
					"baseline-launch",
					"baseline-link",
					"baseline-search",
					"baseline-toc",
					"outline-file-download",
				],
				ion: ["footsteps", "eye"],
				logos: ["spotify-icon"],
				lucide: ["library-square", "scan"],
				"material-symbols": ["update-rounded"],
				"material-symbols-light": [
					"keyboard-double-arrow-down-rounded",
					"keyboard-double-arrow-up-rounded",
				],
				tdesign: ["map-collection"],
			},
		}),
	],
	markdown: {
		shikiConfig: {
			// https://github.com/shikijs/shiki/blob/main/docs/themes.md
			theme: "slack-ochin", // "vitesse-light", //"slack-ochin", //github-light //dark: nord
		},
		remarkRehype: {
			footnoteLabel: "Notes et références",
		},
		smartypants: true,
	},
	adapter: vercel(),
})
