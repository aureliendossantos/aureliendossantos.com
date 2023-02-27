import { defineConfig } from "astro/config"

// https://astro.build/config
import tailwind from "@astrojs/tailwind"

// https://astro.build/config
import mdx from "@astrojs/mdx"

// https://astro.build/config
export default defineConfig({
	site: "https://blog.aureliendossantos.com",
	integrations: [tailwind(), mdx()],
	markdown: {
		shikiConfig: {
			// https://github.com/shikijs/shiki/blob/main/docs/themes.md
			theme: "slack-ochin", // "vitesse-light", //"slack-ochin", //github-light //dark: nord
		},
	},
})
