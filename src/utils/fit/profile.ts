/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE PLACE TO ADD "ALL THE BORING DETAILS".
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Everything the model is allowed to claim about Aurélien comes from two
 * sources: the `portfolio` content collection (projects, via `evidence.ts`) and
 * this file (everything a project card cannot express).
 *
 * Nothing here is rendered on the site. It is a factual record written for a
 * model to reason over, so favour precision over prose: exact dates, exact
 * scopes, exact tools, and an honest note when something is thin.
 *
 * To enrich the assessment later, add entries below — no application code needs
 * to change. To attach extra facts to an existing portfolio project (details
 * that do not belong on the public card), use `projectNotes` at the bottom.
 *
 * Kept deliberately close to `src/content/resume/*` and `src/pages/cv.astro`;
 * if you edit those, edit this too.
 */

export interface ExperienceEntry {
	/** Stable ID. Referenced by nothing yet, but keeps future edits unambiguous. */
	id: string
	/** Employer, client or organisation. */
	organisation: string
	/** Job or role title, in English. */
	role: string
	/** Free-form period, e.g. "2021–2022" or "2012–present". */
	period: string
	/** "employment" | "freelance" | "association" | "volunteer" */
	kind: string
	/** Factual description. What was actually done, at what scale. */
	summary: string
	/** Concrete tools, languages and frameworks genuinely used here. */
	tools?: string[]
}

export interface EducationEntry {
	id: string
	credential: string
	institution: string
	period: string
	notes?: string
}

/** One-paragraph framing. Kept short; the evidence does the arguing. */
export const headline =
	"Full-stack web and multimedia developer, and instructional designer. Works across design and implementation: web development (TypeScript, React, Astro, Node.js), game development (Unity, C#), instructional design, and video production."

export const location =
	"France. Comfortable working remotely; French and English speaking contexts."

/**
 * Learning and ramp-up context.
 *
 * This exists so the model can calibrate gaps — NOT so it can claim experience.
 * The prompt instructs it to treat these as evidence about how quickly he could
 * ramp up, never as evidence that he already knows something.
 */
export const learningContext = [
	"Most of his technical skill is self-taught. He learns new tools by building real, shipped things rather than by taking courses.",
	"He has knowledgeable technical friends and peers he consults when he hits the edge of his own knowledge.",
	"He is generally comfortable adapting to unfamiliar languages, frameworks and toolchains, and has repeatedly done so (RPG Maker → Unity/C#; PHP → React/Next.js → Astro; REST APIs → Prisma/Postgres).",
	"He has no documented experience of independently owning complex production infrastructure, on-call rotations, or large-team engineering process.",
]

export const experience: ExperienceEntry[] = [
	{
		id: "insolence-project-manager",
		organisation: "Agence Insolence",
		role: "Project manager (chargé de projet)",
		period: "2021–2022",
		kind: "employment",
		summary:
			"Recruited and supported thirty specialist authors across the production of three online CAP certification pathways for the food trades (cooking, baking, pastry). Built writing and video production guidelines, designed internal onboarding, and restructured the communication and project management tooling.",
		tools: ["Jira", "Notion"],
	},
	{
		id: "insolence-instructional-designer",
		organisation: "Agence Insolence",
		role: "Instructional designer (ingénieur pédagogique)",
		period: "2022–2023",
		kind: "employment",
		summary:
			"Designed short certifying training programmes for individuals and professionals. Produced videos and built interactive activities and self-assessment quizzes.",
		tools: ["Articulate Storyline", "Adobe Premiere Pro", "After Effects", "Photoshop"],
	},
	{
		id: "insolence-web-developer",
		organisation: "Agence Insolence",
		role: "Web developer (Next.js), alongside his main role",
		period: "2021–2023",
		kind: "employment",
		summary:
			"Improved the agency's internal tooling in parallel with his main assignments: Ubuntu server and Moodle administration, marketing sites, bespoke internal management web apps, and a gateway to the agency's data through the Notion API.",
		tools: ["Next.js", "React", "TypeScript", "Ubuntu", "Moodle", "Notion API"],
	},
	{
		id: "degica-translator",
		organisation: "Degica Publishing",
		role: "English translator",
		period: "2018",
		kind: "employment",
		summary:
			"Translated 100,000 words of documentation, tutorials and user interface for RPG Maker, a game development tool, respecting the established technical vocabulary of the series and its community.",
	},
	{
		id: "freelance-video",
		organisation: "Self-employed (entreprise individuelle)",
		role: "Video director",
		period: "2015–2018",
		kind: "freelance",
		summary:
			"Wrote, shot and edited corporate films for ESC Pau, Technopole Hélioparc, Pôle Avenia and ADN Startup, among others.",
		tools: ["Adobe Premiere Pro", "After Effects"],
	},
	{
		id: "gda-president",
		organisation: "Game Dev Alliance",
		role: "President of the association",
		period: "2019–present",
		kind: "association",
		summary:
			"Game Dev Alliance takes part in the French-speaking independent game development scene, running events and one of the largest French-speaking communities on the subject on Discord.",
	},
	{
		id: "gda-web-developer",
		organisation: "Game Dev Alliance",
		role: "Web developer (Hugo, Vue.js, GraphQL)",
		period: "2018–2021",
		kind: "association",
		summary:
			"Team development of a wiki and a tutorial site, FaireDesJeux.fr. Managed community contributions on GitHub.",
		tools: ["Hugo", "Vue.js", "GraphQL", "GitHub"],
	},
	{
		id: "gda-video",
		organisation: "Game Dev Alliance",
		role: "Video creator",
		period: "2012–present",
		kind: "association",
		summary:
			"Has been making video tutorials on game creation since the age of 15. His first series, on RPG Maker, became a French-speaking reference with a cumulative 1 million views. He then co-directed theory and industry-news videos, gathering 30,000 subscribers.",
		tools: ["Adobe Premiere Pro"],
	},
]

export const education: EducationEntry[] = [
	{
		id: "master-toulouse",
		credential:
			"Master's in Training Engineering, Digital Resource Design track (Ingénierie de Formation, parcours Conception de Ressources Numériques)",
		institution: "Université Toulouse Jean Jaurès",
		period: "2021–2023",
		notes:
			"Coursework: instructional design, multimedia learning design (Storyline, Rise, Genially, Vyond), web development (HTML/CSS, JavaScript, PHP, SQL, React, Next.js, Elixir), serious games and applications (Unity/C#, Ren'Py/Python), Adobe suite.",
	},
	{
		id: "licence-pau",
		credential: "Bachelor's in English language, literature and civilisation",
		institution: "Université de Pau",
		period: "2018–2021",
	},
	{
		id: "iut-pau",
		credential:
			"IUT in Computer Science and Decision Statistics (Informatique et Statistique Décisionnelle)",
		institution: "IUT de Pau",
		period: "2014–2016",
		notes: "Two-year technical degree. Not completed as a full engineering degree.",
	},
]

export const languages = [
	"French — native.",
	"English — full professional proficiency. TOEIC 955/990 (2016) and a bachelor's degree in English (2021).",
	"Spanish and Portuguese — basics only.",
]

/** Public links a visitor can follow. The UI owns how these are displayed. */
export const links = {
	portfolio: "/portfolio",
	email: "mailto:aureliendsantos@gmail.com",
	linkedin: "https://www.linkedin.com/in/aureliendossantos/",
	github: "https://github.com/aureliendossantos",
	youtube: "https://www.youtube.com/@GameDevAlliance",
}

/**
 * Extra factual detail attached to a portfolio project, keyed by its project ID
 * (the folder name under `src/content/portfolio/`).
 *
 * Use this for things too granular or too internal for the public card:
 * team size, what he personally wrote versus reviewed, measured outcomes,
 * what went wrong, what he would not claim as expertise.
 */
export const projectNotes: Record<string, string[]> = {
	site: [
		"Solo project, still actively maintained. This is the codebase the /fit feature itself is built into.",
		"Static Astro output on Vercel, Tailwind, content collections backed by a private git submodule, custom Vite/remark plugins, D3 for the navigation graph, Prisma + Neon Postgres for the catalogue section.",
	],
	koimori: [
		"Commercial product shipped on Steam for Windows and macOS. Localised into 16 languages.",
		"He owned game design and development; art is hand-drawn source material turned into procedural variants.",
	],
	qrpg: [
		"Team project. He handled project management, design documentation, and Unity gameplay systems including QR scanning (ZXing) and internal editor tooling.",
	],
	"cap-cuisine": [
		"Coordination role rather than an engineering role: 700 written lessons and video capsules across three certification pathways, thirty external authors.",
	],
	grimoire: [
		"Migrated an existing React/TypeScript codebase to Astro, with measured performance improvements. Supports all seven languages of the Bungie.net API.",
	],
	"jeu-de-survie-navigateur": [
		"Full-stack: Next.js client plus an API backed by Prisma and Postgres. Multiplayer state, not real-time networking.",
	],
}
