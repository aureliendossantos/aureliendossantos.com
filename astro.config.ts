import { defineConfig } from "astro/config"
import AutoImport from "astro-auto-import"
import tailwind from "@astrojs/tailwind"
import mdx from "@astrojs/mdx"
import vercel from "@astrojs/vercel/serverless"
import icon from "astro-icon"
import expressiveCode from "astro-expressive-code"
import { remarkConvertImports } from "./src/utils/remark/convertImports"
import { remarkAbbr } from "./src/utils/remark/detectAbbr"

// https://astro.build/config
export default defineConfig({
	output: "hybrid",
	// Remove this when https://github.com/withastro/compiler/issues/852 is fixed
	compressHTML: false,
	image: {
		domains: ["prod-files-secure.s3.us-west-2.amazonaws.com"],
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
		expressiveCode(),
		AutoImport({
			imports: [
				"$components/mdx/customComponents/Age.astro",
				"$components/mdx/Tufte/MarginNote.astro",
				"$components/mdx/Tufte/MarginImage.astro",
				"$components/mdx/Tufte/Sidenote.astro",
				"$components/mdx/Tufte/TufteFigure.astro",
				"$components/mdx/Tufte/TufteGallery.astro",
				"$components/mdx/figures/Figure.astro",
				"$components/mdx/figures/Gallery.astro",
				"$components/mdx/figures/PhotoGallery.astro",
				"$components/mdx/figures/Video.astro",
				"$components/mdx/mediaBlocks/Application.astro",
				"$components/mdx/mediaBlocks/Book.astro",
				"$components/mdx/mediaBlocks/Discogs.astro",
				"$components/mdx/mediaBlocks/Game.astro",
				"$components/mdx/mediaBlocks/Garden.astro",
				"$components/mdx/mediaBlocks/GoogleMaps.astro",
				"$components/mdx/mediaBlocks/Movie.astro",
				"$components/mdx/mediaBlocks/SpotifyTrack.astro",
				"$components/mdx/mediaBlocks/Wiki.astro",
				"$components/mdx/references/BlogRef.astro",
				"$components/mdx/references/DiaryRef.astro",
				"$components/mdx/references/FileRef.astro",
				"$components/mdx/references/MapsMention.astro",
				"$components/mdx/references/Ref.astro",
				"$components/mdx/Note.astro",
				"$components/mdx/Popup.astro",
				"$components/mdx/Translate.astro",
				"$components/portfolio/PortfolioGallery.astro",
				// Tabs is not imported by default because it loads a CSS file
				// on every page. It seems complicated to change the code to
				// remove the CSS... Same for YouTube/Vimeo/Tweet from astro-embed.
			],
		}),
		mdx(),
		icon({
			include: {
				bi: ["stars"],
				carbon: ["network-1"],
				charm: ["home"],
				ic: [
					"baseline-check",
					"baseline-launch",
					"baseline-link",
					"baseline-search",
					"baseline-toc",
					"baseline-ios-share",
					"outline-file-download",
				],
				ion: ["footsteps", "eye"],
				logos: ["spotify-icon"],
				lucide: ["library-square", "scan"],
				"material-symbols": ["close-rounded", "update-rounded", "label-rounded"],
				"material-symbols-light": [
					"keyboard-double-arrow-down-rounded",
					"keyboard-double-arrow-up-rounded",
				],
				mdi: ["github", "campfire", "plus-circle-outline"],
				ph: ["share-network"],
				"radix-icons": ["notion-logo"],
				tabler: ["copy"],
				tdesign: ["map-collection"],
			},
		}),
	],
	markdown: {
		shikiConfig: {
			theme: "slack-ochin",
		},
		remarkRehype: {
			footnoteLabel: "Notes",
		},
		smartypants: true,
		remarkPlugins: [remarkConvertImports, remarkAbbr],
	},
	adapter: vercel(),
})
