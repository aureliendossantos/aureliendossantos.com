import { defineConfig, envField } from "astro/config"
import AutoImport from "astro-auto-import"
import vercel from "@astrojs/vercel"
import tailwind from "@astrojs/tailwind"
import mdx from "@astrojs/mdx"
import icon from "astro-icon"
import expressiveCode from "astro-expressive-code"
import { remarkConvertImports } from "./src/utils/remark/convertImports"
import { remarkAbbr } from "./src/utils/remark/detectAbbr"

const serverField = envField.string({ context: "server", access: "secret" })

// https://astro.build/config
export default defineConfig({
	output: "static",
	adapter: vercel({
		webAnalytics: { enabled: true },
	}),
	experimental: {
		contentIntellisense: true,
		svg: true,
	},
	i18n: {
		defaultLocale: "fr",
		locales: ["fr", "en"],
		fallback: {
			en: "fr",
		},
	},
	// Remove this when https://github.com/withastro/compiler/issues/852 is fixed
	compressHTML: false,
	image: {
		domains: ["prod-files-secure.s3.us-west-2.amazonaws.com", "upload.wikimedia.org"],
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
				"$components/portfolio/resume/ResumeRef.astro",
				// Tabs is not imported by default because it loads a CSS file
				// on every page. It seems complicated to change the code to
				// remove the CSS... Same for YouTube/Vimeo/Tweet from astro-embed.
			],
		}),
		mdx(),
		icon(),
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
	env: {
		schema: {
			GOOGLE_MAPS_TOKEN: serverField,
			TWITCH_ID: serverField,
			TWITCH_SECRET: serverField,
			DISCOGS_PERSONAL_ACCESS_TOKEN: serverField,
			NOTION_SECRET: serverField,
			NOTION_GAMES_DB: serverField,
			NOTION_WIKI_PAGES_DB: serverField,
			NOTION_WIKI_CATEGORIES_DB: serverField,
			TMDB_READ_ACCESS_TOKEN: serverField,
			SPOTIFY_CLIENT_ID: serverField,
			SPOTIFY_CLIENT_SECRET: serverField,
			FORTNITE_FESTIVAL_PAGE_ID: serverField,
			COFFEE_PAGE_ID: serverField,
			GITHUB_TOKEN: serverField,
		},
	},
})
