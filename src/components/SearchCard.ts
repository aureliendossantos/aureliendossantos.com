/**
 * A component to display a search result.
 * @see `src/pages/search.astro`
 * @param {string} slug - Link slug without the leading slash
 * @param {string} title - Search entry title
 * @param {string} date - Search entry date
 * @param {string} tags - Tags list in a single string
 */
export class SearchCard extends HTMLElement {
	slug: string
	title: string
	date: string | null
	tags: string | null
	constructor() {
		super()
		this.slug = this.getAttribute("slug") || ""
		this.title = this.getAttribute("title") || ""
		this.date = this.getAttribute("date")
		this.tags = this.getAttribute("tags")
	}

	connectedCallback() {
		const template = document.createElement("template")
		template.innerHTML = `
		<a class="border-x-0 flex flex-col w-full bg-black px-3 py-[6px] leading-tight text-white hover:bg-white hover:text-black" href="/${
			this.slug
		}">
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
