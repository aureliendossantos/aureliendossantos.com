import { visit } from "unist-util-visit"

/**
 * Convert paths in `src` attributes to import expressions. Only works when the attribute is a simple string.
 */
export function remarkConvertImports() {
	return function (tree: any) {
		visit(tree, (node) => {
			// If the node isn't valid, it may be a parent, e.g. a paragraph, that contains a valid node.
			if (!checkNode(node)) {
				node.children?.forEach((child: any) => {
					checkNode(child)
				})
			}
		})
	}
}

const validNodes = new Set(["Image", "Figure", "Video", "TufteFigure", "MarginImage"])

/**
 * `node.type` can either be `mdxJsxFlowElement` or `mdxJsxTextElement`.
 * `node.name` must be one of the `validNodes`.
 * If the node is valid, replace the `src` attribute with an import expression.
 */
function checkNode(node: any) {
	if (!validNodes.has(node.name)) return false
	replaceAttributeValue(node, "src")
	if (node.name === "Video") {
		replaceAttributeValue(node, "compat")
		replaceAttributeValue(node, "poster")
	}
	return true
}

function replaceAttributeValue(node: any, attributeName: string) {
	const attributeIndex = node.attributes.findIndex((attr: any) => attr.name === attributeName)
	if (attributeIndex === -1) return

	const attributeValue = node.attributes[attributeIndex].value

	if (typeof attributeValue === "string") {
		node.attributes[attributeIndex].value = getImportExpression(attributeValue)
	}
}

function getImportExpression(path: string) {
	return {
		type: "mdxJsxAttributeValueExpression",
		value: `import("${path}")`,
		data: {
			estree: {
				type: "Program",
				body: [
					{
						type: "ExpressionStatement",
						expression: {
							type: "ImportExpression",
							source: {
								type: "Literal",
								value: path,
								raw: `"${path}"`,
							},
						},
					},
				],
			},
		},
	}
}
