import * as d3 from "d3"
import type { TransitionBeforePreparationEvent } from "astro:transitions/client"
import { navigate } from "astro:transitions/client"

export type GraphEntry = {
	slug: string
	title: string
	links?: string[]
	tags?: string[]
	optional?: boolean
}

const removeLeadingSlash = (s: string) => (s.startsWith("/") ? s.substring(1) : s)
// decodeURIComponent translates %C3%A9 to é
const cleanPath = (s: string) => removeLeadingSlash(decodeURIComponent(s))
const getCurrentSlug = () => cleanPath(window.location.pathname)

function registerEscapeHandler(outsideContainer: HTMLElement | null, cb: () => void) {
	if (!outsideContainer) return
	function click(this: HTMLElement, e: HTMLElementEventMap["click"]) {
		if (e.target !== this) return
		e.preventDefault()
		cb()
	}
	function esc(e: HTMLElementEventMap["keydown"]) {
		if (!e.key.startsWith("Esc")) return
		e.preventDefault()
		cb()
	}
	outsideContainer?.addEventListener("click", click)
	document.addEventListener("keydown", esc)
}

function removeAllChildren(node: HTMLElement) {
	while (node.firstChild) {
		node.removeChild(node.firstChild)
	}
}

type NodeData = {
	id: string
	text: string
	// tags: string[]
	optional?: boolean
} & d3.SimulationNodeDatum

type LinkData = {
	source: string
	target: string
}

const localStorageKey = "graph-visited"
function getVisited(): Set<string> {
	return new Set(JSON.parse(localStorage.getItem(localStorageKey) ?? "[]"))
}

function addToVisited(slug: string) {
	const visited = getVisited()
	visited.add(slug)
	localStorage.setItem(localStorageKey, JSON.stringify([...visited]))
}

async function renderGraph(container: string, currentSlug: string) {
	// TODO: do i want to color visited nodes differently? weird if they are updated
	const visited = getVisited()
	const graph = document.getElementById(container)
	if (!graph) return
	removeAllChildren(graph)

	let {
		drag: enableDrag,
		pan: enablePanning,
		zoom: enableZoom,
		depth,
		scale,
		repelForce,
		centerForce,
		linkDistance,
		fontSize,
		opacityScale,
		focusOnHover,
	} = JSON.parse(graph.dataset["cfg"]!)

	// On SSR pages, window.entries is initially [] then populated with the data after some time. This script should wait for the data to be available.
	if (window.entries.length == 0) {
		await new Promise((resolve) => {
			const interval = setInterval(() => {
				if (window.entries.length > 0) {
					clearInterval(interval)
					resolve(null)
				}
			}, 200)
		})
	}
	// globalData contains all search entries and their links, whereas graphData will contain only the ones in the neighbourhood
	const globalData = window.entries
	const globalLinks: LinkData[] = []

	// HACK: I don't know why but at some point during the code, source and target of global links in the neighbourhood become objects instead of strings, so I need to check for source.id and target.id
	const numberOfGlobalLinksWith = (slug: string) =>
		globalLinks.filter(
			(l) => l.source == slug || l.target == slug || l.source.id == slug || l.target.id == slug
		).length

	const existingSlugs = new Set(globalData.map((entry) => entry.slug))

	globalData.forEach((entry) => {
		entry.links?.forEach((slug) => {
			if (existingSlugs.has(slug)) {
				globalLinks.push({ source: entry.slug, target: slug })
			}
		})
	})

	// HACK: what does the term "wl" mean?
	const neighbourhood = new Set<string>()
	const wl: string[] = [currentSlug, "__SENTINEL"]
	if (depth >= 0) {
		while (depth >= 0 && wl.length > 0) {
			const cur = wl.shift()!
			if (cur === "__SENTINEL") {
				// arrived at the end of the current depth
				depth--
				wl.push("__SENTINEL")
			} else {
				// computing the neighbourhood
				neighbourhood.add(cur)
				const outgoingLinks = globalLinks.filter((l) => l.source === cur)
				const incomingLinks = globalLinks.filter((l) => l.target === cur)
				wl.push(...outgoingLinks.map((l) => l.target), ...incomingLinks.map((l) => l.source))
			}
		}
	} else {
		// If depth is -1 (infinite), add all nodes
		existingSlugs.forEach((id) => neighbourhood.add(id))
	}

	// If there are more than 30 nodes in the neighbourhood, remove nodes tagged as optional if they are linked to <= 1 node
	if (neighbourhood.size > 30) {
		const optionalNodes = Array.from(neighbourhood).filter(
			(id) => globalData.find((entry) => entry.slug == id).optional
		)
		for (const id of optionalNodes) {
			const numLinks = numberOfGlobalLinksWith(id)
			if (numLinks <= 1) {
				neighbourhood.delete(id)
			}
		}
	}

	const graphData: { nodes: NodeData[]; links: LinkData[] } = {
		nodes: [...neighbourhood].map((slug) => {
			const entry = globalData.find((entry) => entry.slug == slug)
			const text = (slug.startsWith("tags/") ? "#" : "") + entry?.title ?? slug
			return {
				id: slug,
				text: text,
				tags: entry?.tags ?? [],
			}
		}),
		links: globalLinks.filter((l) => neighbourhood.has(l.source) && neighbourhood.has(l.target)),
	}

	const simulation: d3.Simulation<NodeData, LinkData> = d3
		.forceSimulation(graphData.nodes)
		.force("charge", d3.forceManyBody().strength(-100 * repelForce))
		.force(
			"link",
			d3
				.forceLink(graphData.links)
				.id((d: any) => d.id)
				.distance(linkDistance)
		)
		.force("center", d3.forceCenter().strength(centerForce))

	const height = Math.max(graph.offsetHeight, 256)
	const width = graph.offsetWidth

	const svg = d3
		.select<HTMLElement, NodeData>("#" + container)
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [-width / 2 / scale, -height / 2 / scale, width / scale, height / scale])

	// draw links between nodes
	const link = svg
		.append("g")
		.selectAll("line")
		.data(graphData.links)
		.join("line")
		.attr("class", "link")
		.attr("stroke", "var(--graph-secondary)")
		.attr("stroke-width", 1)

	// svg groups
	const graphNode = svg.append("g").selectAll("g").data(graphData.nodes).enter().append("g")

	// calculate color
	const color = (d: NodeData) => {
		const isCurrent = d.id === currentSlug
		if (isCurrent) {
			return "var(--graph-main)"
		} else if (visited.has(d.id)) {
			return "var(--graph-secondary)" // "var(--graph-special)"
		} else if (d.id.startsWith("tags/")) {
			return "var(--graph-secondary)"
		} else {
			return "var(--graph-secondary)"
		}
	}

	const drag = (simulation: d3.Simulation<NodeData, LinkData>) => {
		function dragstarted(event: any, d: NodeData) {
			if (!event.active) simulation.alphaTarget(1).restart()
			d.fx = d.x
			d.fy = d.y
		}

		function dragged(event: any, d: NodeData) {
			d.fx = event.x
			d.fy = event.y
		}

		function dragended(event: any, d: NodeData) {
			if (!event.active) simulation.alphaTarget(0)
			d.fx = null
			d.fy = null
		}

		const noop = () => {}
		return d3
			.drag<Element, NodeData>()
			.on("start", enableDrag ? dragstarted : noop)
			.on("drag", enableDrag ? dragged : noop)
			.on("end", enableDrag ? dragended : noop)
	}

	function nodeRadius(d: NodeData) {
		// HACK: why the hell does this work
		// this filter is used elsewhere btw, check for numLinks variables
		let numLinks = numberOfGlobalLinksWith(d.id)
		// HACK: the best thing to do would be to reduce size of nodes (like "Jeux") when they are linked to optional (hidden) nodes
		// Impossible to update the above filter with graphData.links because it only contains visible nodes
		if (d.id == "games") return 6
		return 2 + Math.sqrt(numLinks)
	}

	let connectedNodes: string[] = []

	// draw individual nodes
	const node = graphNode
		.append("circle")
		.attr("class", "node")
		.attr("id", (d) => d.id)
		.attr("r", nodeRadius)
		.attr("fill", color)
		.style("cursor", "pointer")
		.on("click", (_, d) => {
			navigate("/" + d.id)
		})
		.on("mouseover", function (_, d) {
			const currentId = d.id
			const linkNodes = d3
				.selectAll(".link")
				.filter((d: any) => d.source.id === currentId || d.target.id === currentId)
			const parent = this.parentNode as HTMLElement

			if (focusOnHover) {
				// fade out non-neighbour nodes
				connectedNodes = linkNodes.data().flatMap((d: any) => [d.source.id, d.target.id])

				d3.selectAll<HTMLElement, NodeData>(".link")
					.transition()
					.duration(200)
					.style("opacity", 0.2)
				d3.selectAll<HTMLElement, NodeData>(".node")
					.filter((d) => !connectedNodes.includes(d.id))
					.transition()
					.duration(200)
					.style("opacity", 0.2)

				d3.selectAll<HTMLElement, NodeData>(".node")
					.filter((d) => !connectedNodes.includes(d.id))
					.nodes()
					.map((it) => d3.select(it.parentNode as HTMLElement).select("text"))
					.forEach((it) => {
						let opacity = parseFloat(it.style("opacity"))
						it.attr("opacityOld", opacity).style("opacity", Math.min(opacity, 0.2))
					})

				// show text for self
				d3.select<HTMLElement, NodeData>(parent)
					.raise()
					.select("text")
					.attr("opacityOld", d3.select(parent).select("text").style("opacity"))
					.style("opacity", 1)
			}

			// highlight links
			linkNodes.attr("stroke", "var(--graph-main)").attr("stroke-width", 1)

			const titleDiv = document.getElementById("graph-title") as HTMLDivElement
			titleDiv.innerText = d.text

			// highlight circle for hovered node
			d3.select<HTMLElement, NodeData>(parent)
				.filter((d) => !d.id.startsWith("tags/"))
				.select("circle")
				.attr("fill", "var(--graph-main)")
			d3.select<HTMLElement, NodeData>(parent)
				.filter((d) => d.id.startsWith("tags/"))
				.select("circle")
				.attr("stroke", "var(--graph-main)")
		})
		.on("mouseleave", function (_, d) {
			if (focusOnHover) {
				d3.selectAll<HTMLElement, NodeData>(".link").transition().duration(200).style("opacity", 1)
				d3.selectAll<HTMLElement, NodeData>(".node").transition().duration(200).style("opacity", 1)

				d3.selectAll<HTMLElement, NodeData>(".node")
					.filter((d) => !connectedNodes.includes(d.id))
					.nodes()
					.map((it) => d3.select(it.parentNode as HTMLElement).select("text"))
					.forEach((it) => it.style("opacity", it.attr("opacityOld")))

				const parent = this.parentNode as HTMLElement
				d3.select<HTMLElement, NodeData>(parent)
					.select("text")
					.style("opacity", d3.select(parent).select("text").attr("opacityOld"))
			}
			const currentId = d.id
			const linkNodes = d3
				.selectAll(".link")
				.filter((d: any) => d.source.id === currentId || d.target.id === currentId)
			linkNodes.attr("stroke", "var(--graph-secondary)")
			const circleNodes = d3.selectAll(".node").filter((d) => d.id == currentId)
			circleNodes.filter((d) => !d.id.startsWith("tags/")).attr("fill", color)
			circleNodes.filter((d) => d.id.startsWith("tags/")).attr("stroke", "var(--graph-secondary)")

			const titleDiv = document.getElementById("graph-title") as HTMLDivElement
			titleDiv.innerText = ""
		})
		// @ts-ignore
		.call(drag(simulation))

	// make tags hollow circles
	node
		.filter((d) => d.id.startsWith("tags/"))
		.attr("stroke", color)
		.attr("stroke-width", 2)
		.attr("fill", "var(--graph-bg)")

	// draw labels (texts) for nodes
	// they are only shown when focusOnHover is true
	const labels = graphNode
		.append("text")
		.attr("dx", 0)
		.attr("dy", (d) => -nodeRadius(d) - 4 + "px")
		.attr("text-anchor", "middle")
		// no text if it's the current page node, or if there are lots of nodes in graphData and the node has few links
		// truncate after 15 characters
		.text((d) => {
			if (d.id === currentSlug) return ""
			const numLinks = numberOfGlobalLinksWith(d.id)
			if (graphData.nodes.length > 25 && numLinks <= 6) return ""
			if (graphData.nodes.length > 14 && numLinks <= 4) return ""
			if (graphData.nodes.length > 6 && numLinks <= 2) return ""
			return d.text.substring(0, 15).trim() + (d.text.length > 15 ? "…" : "")
		})
		.style("fill", "var(--graph-secondary)")
		.style("font-family", "Work Sans")
		.style("opacity", 1) // (d) => (opacityScale - 1) / 3.75)
		.style("pointer-events", "none")
		.style("font-size", fontSize + "px")
		.raise()
		// @ts-ignore
		.call(drag(simulation))

	// set panning and zooming
	if (enablePanning) {
		svg.call(
			d3
				.zoom<SVGSVGElement, NodeData>()
				.extent([
					[0, 0],
					[width, height],
				])
				.scaleExtent(enableZoom ? [0.25, 4] : [1, 1])
				// "zoom" is a d3 event that is triggered when the user zooms or pans
				.on("zoom", ({ transform }) => {
					link.attr("transform", transform)
					node.attr("transform", transform)
					const scale = transform.k * opacityScale
					const scaledOpacity = 1 // Math.max((scale - 1) / 3.75, 0)
					labels.attr("transform", transform).style("opacity", scaledOpacity)
				})
		)
	}

	// progress the simulation
	simulation.on("tick", () => {
		link
			.attr("x1", (d: any) => d.source.x)
			.attr("y1", (d: any) => d.source.y)
			.attr("x2", (d: any) => d.target.x)
			.attr("y2", (d: any) => d.target.y)
		node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)
		labels.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)
	})
}

function renderGlobalGraph() {
	const currentSlug = getCurrentSlug()
	// TODO: jcrois que peu m'importe ce qu'il fait à outer et sidebar
	const container = document.getElementById("global-graph-outer") as HTMLElement
	container.classList.add("inline-block")
	container.classList.remove("hidden")

	renderGraph("global-graph-container", currentSlug)

	function hideGlobalGraph() {
		container.classList.remove("inline-block")
		container.classList.add("hidden")
		const graph = document.getElementById("global-graph-container")
		if (!graph) return
		removeAllChildren(graph)
	}

	registerEscapeHandler(container, hideGlobalGraph)
}

document.addEventListener("astro:before-preparation", async (ev) => {
	const event = ev as TransitionBeforePreparationEvent
	const slug = cleanPath(event.to.pathname)
	addToVisited(slug)
	await renderGraph("graph-container", slug)
})

const currentSlug = getCurrentSlug()
renderGraph("graph-container", currentSlug)
const containerIcon = document.getElementById("global-graph-icon")
containerIcon?.addEventListener("click", renderGlobalGraph)
