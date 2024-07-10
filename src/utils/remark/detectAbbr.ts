import { visit } from "unist-util-visit"

export function remarkAbbr() {
	return (tree: any) => {
		visit(tree, "text", (node, index, parent) => {
			const regex = /\b(?<!<abbr>)(?=[A-Z]+)[A-Z0-9'-]{2,}(?:\.[A-Z0-9'-]+)*\b/g
			let match
			const children = []
			let lastIndex = 0
			while ((match = regex.exec(node.value)) !== null) {
				if (match.index > lastIndex) {
					children.push({
						type: "text",
						value: node.value.slice(lastIndex, match.index),
					})
				}
				children.push({
					type: "html",
					value: `<abbr>${match[0]}</abbr>`,
				})
				lastIndex = regex.lastIndex
			}
			if (lastIndex < node.value.length) {
				children.push({
					type: "text",
					value: node.value.slice(lastIndex),
				})
			}
			// Replace the text node with the new children if matches were found
			if (children.length > 0) {
				parent.children.splice(index, 1, ...children)
				return [visit.SKIP, index + children.length]
			}
		})
	}
}
