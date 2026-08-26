import { defineConfig, envField } from "astro/config"
import { unified } from "@astrojs/markdown-remark"
import AutoImport from "astro-auto-import"
import vercel from "@astrojs/vercel"
import tailwindcss from "@tailwindcss/vite"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import expressiveCode from "astro-expressive-code"
import { remarkConvertImports } from "./src/utils/remark/convertImports"
import { remarkAbbr } from "./src/utils/remark/detectAbbr"
import { existsSync, readdirSync } from "node:fs"
import type { Plugin } from "vite"

const serverField = envField.string({ context: "server", access: "secret" })
const optionalServerField = envField.string({
	context: "server",
	access: "secret",
	optional: true,
})

/**
 * @vercel/nft traces the content submodule into the /_render function (1.3 GB,
 * over Vercel's limit), but nothing reads those files at request time.
 */
const contentFiles = () =>
	existsSync("src/content")
		? readdirSync("src/content", { recursive: true, withFileTypes: true })
				.filter((entry) => entry.isFile())
				.map((entry) => `${entry.parentPath}/${entry.name}`.replaceAll("\\", "/"))
		: []

/**
 * `@vitejs/plugin-react` hands Vite 8's option shape to the native Rolldown
 * Fast Refresh wrapper. On the Vite 7.3 that Astro 6.4 depends on, that throws
 * "Missing field `moduleType`" for every module in `astro dev` — the whole dev
 * server, not just the React island.
 *
 * Removing `applyToEnvironment` takes the same path the plugin uses when the
 * native wrapper is unavailable: its own JS transform, which works on both.
 * Delete this once Astro moves to Vite 8 (and @astrojs/react can go back to 6.x).
 */
const reactFastRefreshOnVite7 = (): Plugin => ({
	name: "astro-react-refresh-vite7-fallback",
	apply: "serve",
	configResolved(config) {
		const wrapper = config.plugins.find((plugin) => plugin.name === "vite:react:refresh-wrapper")
		if (wrapper) delete (wrapper as { applyToEnvironment?: unknown }).applyToEnvironment
	},
})

// https://astro.build/config
export default defineConfig({
	output: "static",
	adapter: vercel({
		webAnalytics: { enabled: true },
		excludeFiles: contentFiles(),
		// /api/fit streams a model response and is the only on-demand route.
		// 60s is within every Vercel plan's limit and well above a normal run.
		maxDuration: 60,
	}),
	prefetch: { prefetchAll: true },
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
		domains: [
			"prod-files-secure.s3.us-west-2.amazonaws.com",
			"upload.wikimedia.org",
			"koimori.aureliendossantos.com",
		],
		service: {
			entrypoint: "$utils/imageService.ts",
		},
	},
	site: "https://aureliendossantos.com",
	vite: {
		plugins: [tailwindcss(), reactFastRefreshOnVite7()],
	},
	integrations: [
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
		// React exists for the /fit assessment island only. Every other page of
		// the site stays plain Astro, and no React ships to them.
		react({ include: ["**/components/fit/**"] }),
		mdx(),
	],
	markdown: {
		processor: unified({
			remarkPlugins: [remarkConvertImports, remarkAbbr],
			remarkRehype: {
				footnoteLabel: "Notes",
			},
			smartypants: true,
		}),
		shikiConfig: {
			theme: "slack-ochin",
		},
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
			TMDB_READ_ACCESS_TOKEN: serverField,
			SPOTIFY_CLIENT_ID: serverField,
			SPOTIFY_CLIENT_SECRET: serverField,
			GITHUB_TOKEN: serverField,
			/** Fit assessment. Optional so the site still builds without it. */
			OPENAI_API_KEY: optionalServerField,
			/** Optional model override, e.g. "gpt-5.6-sol". See src/utils/fit/models.ts. */
			AI_MATCH_MODEL: optionalServerField,
		},
	},
})
