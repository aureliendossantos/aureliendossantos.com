import { defineConfig } from "astro/config"
import AutoImport from "astro-auto-import"
import tailwind from "@astrojs/tailwind"
import mdx from "@astrojs/mdx"

// https://astro.build/config
export default defineConfig({
	experimental: { assets: true },
	image: {
		service: "astro/assets/services/sharp",
	},
	site: "https://blog.aureliendossantos.com",
	integrations: [
		tailwind({
			config: { applyBaseStyles: false },
		}),
		AutoImport({
			imports: [
				"$components/mdx/ArticleRef.astro",
				"$components/mdx/Figure.astro",
				"$components/mdx/Gallery.astro",
				"$components/mdx/Note.astro",
				"$components/mdx/PhotoGallery.astro",
				"$components/mdx/Sidenote.astro",
				"$components/mdx/Tabs.astro",
				"$components/mdx/Video.astro",
				{ "astro-embed": ["YouTube"] },
			],
		}),
		mdx(),
	],
	markdown: {
		shikiConfig: {
			// https://github.com/shikijs/shiki/blob/main/docs/themes.md
			theme: "slack-ochin", // "vitesse-light", //"slack-ochin", //github-light //dark: nord
		},
		remarkRehype: { footnoteLabel: "Notes et références" },
		smartypants: true,
	},
})
