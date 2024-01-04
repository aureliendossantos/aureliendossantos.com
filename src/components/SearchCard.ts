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
		<li>
			<a class="result" href="/${this.slug}">
		  		<div class="title">
              		${this.title}
			  	</div>
				${
					this.tags || this.date
						? `<span class="info">
            			${this.tags} · ${this.date}
            			</span>`
						: ""
				}
          	</a>
		</li>`
		this.appendChild(template.content)
	}
}
