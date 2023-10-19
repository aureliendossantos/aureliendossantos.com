/** @type {import("@types/prettier").Options} */
export default {
	printWidth: 100,
	useTabs: true,
	tabWidth: 2,
	trailingComma: "es5",
	semi: false,
	plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
	astroAllowShorthand: false,
	tailwindConfig: "./tailwind.config.ts",
	overrides: [
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
	],
}
