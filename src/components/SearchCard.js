/**
 * A JS vanilla component to display search's results
 * @see `src/pages/search.astro`
 * @param {string} slug - Search entry slug
 * @param {string} title - Search entry title
 * @param {string} date - Search entry date
 * @param {string} tags - Tags list in a single string
 * @param {string} description - Hidden for now
 */
export class SearchCard extends HTMLElement {
	constructor() {
		super()
		this.slug = this.attributes.slug.value
		this.title = this.attributes.title.value
		this.date = this.attributes.date.value
		this.tags = this.attributes.tags.value
		this.description = this.attributes.description.value
	}

	connectedCallback() {
		const template = document.createElement("template")
		template.innerHTML = `
		<li>
			<a class="result" href="${this.slug}">
		  		<div class="title">
              		${this.title}
			  	</div>
				${
					this.tags != "undefined" || this.date != "undefined"
						? `<span class="info">
            			${this.tags != "undefined" ? this.tags : ""}
						·
						${this.date != "undefined" ? this.date : ""}
            			</span>`
						: ""
				}
          	</a>
		</li>`
		this.appendChild(template.content)
	}
}
