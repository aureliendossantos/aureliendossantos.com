import { defineEcConfig } from "astro-expressive-code"
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections"

export default defineEcConfig({
	useDarkModeMediaQuery: false,
	themes: ["github-light", "min-light", "slack-ochin", "vitesse-light"],
	defaultProps: {
		wrap: true,
	},
	styleOverrides: {
		frames: {
			frameBoxShadowCssValue: "unset",
		},
	},
	plugins: [pluginCollapsibleSections()],
})
