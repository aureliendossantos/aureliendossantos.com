/**
 * A component to display a search result.
 * @see `src/pages/search.astro`
 * @param {string} slug - Link slug without the leading slash
 * @param {string} url - Absolute URL, for entries hosted elsewhere (wiki pages live in Notion)
 * @param {string} title - Search entry title
 * @param {string} date - Search entry date
 * @param {string} tags - Tags list in a single string
 */
export class SearchCard extends HTMLElement {
	slug: string
	url: string | null
	title: string
	date: string | null
	tags: string | null
	constructor() {
		super()
		this.slug = this.getAttribute("slug") || ""
		this.url = this.getAttribute("url")
		this.title = this.getAttribute("title") || ""
		this.date = this.getAttribute("date")
		this.tags = this.getAttribute("tags")
	}

	connectedCallback() {
		const template = document.createElement("template")
		template.innerHTML = `
		<a class="border-x-0 flex flex-col w-full px-3 py-[6px] leading-tight navbar-hover-colors" href="${
			this.url || `/${this.slug}`
		}"${this.url ? ` target="_blank" rel="noreferrer"` : ""}>
			<div class="line-clamp-2">
				${this.title}
			</div>
			${
				this.tags || this.date
					? `<div class="text-neutral-500 line-clamp-1">
					${this.tags}${this.date ? ` · ${this.date}` : ""}
					</div>`
					: ""
			}
		</a>`
		this.appendChild(template.content)
	}
}
