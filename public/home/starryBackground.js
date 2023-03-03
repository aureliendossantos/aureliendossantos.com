particlesJS("particles-js", {
	particles: {
		number: {
			value: 100,
			density: {
				enable: true,
				value_area: 789.1476416322727,
			},
		},
		color: {
			value: "#ffffff",
		},
		shape: {
			type: "circle",
			stroke: {
				width: 0,
				color: "#000000",
			},
		},
		opacity: {
			value: 0.48927153781200905,
			random: false,
			anim: {
				enable: true,
				speed: 0.2,
				opacity_min: 0,
				sync: false,
			},
		},
		size: {
			value: 2,
			random: true,
			anim: {
				enable: true,
				speed: 2,
				size_min: 0,
				sync: false,
			},
		},
		line_linked: {
			enable: false,
		},
		move: {
			enable: true,
			speed: 0.2,
			direction: "none",
			random: true,
			straight: false,
			out_mode: "out",
			bounce: false,
			attract: {
				enable: false,
				rotateX: 600,
				rotateY: 1200,
			},
		},
	},
	interactivity: {
		detect_on: "window",
		events: {
			onhover: {
				enable: true,
				mode: "bubble",
			},
			resize: true,
		},
		modes: {
			bubble: {
				distance: 120,
				size: 1,
				duration: 3,
				opacity: 1,
				speed: 3,
			},
		},
	},
	retina_detect: true,
})
