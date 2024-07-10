import type { AstroBuiltinAttributes } from "astro"

export const borderClasses: AstroBuiltinAttributes["class:list"] =
	"border border-solid border-[--border-color] dark:border-[--dark-border-color]"

export const paperClasses: AstroBuiltinAttributes["class:list"] = [
	borderClasses,
	"mix-blend-multiply dark:mix-blend-screen dark:hue-rotate-180 dark:invert",
]
