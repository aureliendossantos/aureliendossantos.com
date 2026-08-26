# Personal website

Personal website powered by [Astro](https://astro.build) and [Tailwind](https://tailwindcss.com/).

Live at [aureliendossantos.com](https://aureliendossantos.com)

## Contents submodule

The website contents (blog articles and other pages, images, videos...), which should be located in `src/content`, are stored in a private git submodule. To keep the submodule private, its address is not stored in this repo, but in an environment variable on Vercel. The `.gitmodules` file is created during the build so that git can fetch the content.

This allows me to work on various drafts without worrying about them going public, and to add secret pages that may need you to jump through some hoops before you stumble on them. Unfortunately, this also means that the website might not work locally if you pull this main repo. Nevertheless, feel free to take a look at it and steal a component or two.

## Development

```sh
node ./scripts/writeGitmodules.ts # needs private env variable
git pull --recurse-submodules
pnpm install
pnpm prisma generate
pnpm dev
```

`pnpm dev` serves the site at `https://blog.localhost` through
[portless](https://portless.sh). Use `PORTLESS=0 pnpm dev` to bypass the proxy and
get the usual `localhost:4321` — needed in cloud environments, where portless has
no TTY to prompt from.

Building:

```sh
pnpm build
```

## Fit assessment (`/fit`)

`/fit` asks visitors to paste a job listing or a project brief and streams back a
grounded assessment of how well my documented experience matches it — gaps
included. The page itself is static; only `/api/fit` runs on demand.

```
browser → /api/fit (Vercel function) → OpenAI → streamed object → React island
```

The OpenAI key and the candidate dossier stay server-side. The browser only ever
receives the structured report, plus the portfolio metadata that is already
public on `/portfolio`.

### Where things live

| Path                           | What it is                                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `src/utils/fit/profile.ts`     | **Where to add facts about me.** Employment, education, ramp-up context, per-project notes. Nothing else needs to change.           |
| `src/utils/fit/dossier.ts`     | The `portfolio` collection as grounding for the model. Server-only, and free of media so nothing heavy is traced into the function. |
| `src/utils/fit/evidence.ts`    | The same collection as the browser sees it: card metadata, thumbnails, and the full entry behind the modal.                         |
| `src/utils/fit/prompt.ts`      | System prompt and dossier assembly.                                                                                                 |
| `src/utils/fit/schema.ts`      | The streamed report's shape: a pinned verdict, then a model-ordered stream of blocks.                                               |
| `src/utils/fit/models.ts`      | Model selection and reasoning effort.                                                                                               |
| `src/utils/fit/limits.ts`      | Input, body and output caps.                                                                                                        |
| `src/components/fit/`          | The React island. React is used **only** here.                                                                                      |
| `src/components/fit/labels.ts` | Every visible label, in French and English.                                                                                         |

Projects are referenced by the folder slug under `src/content/portfolio/`
(`koimori`, `qrpg`, …). The model may only emit those IDs; titles, dates, images
and links are resolved from local data, and an unknown ID drops the card instead
of rendering invented metadata.

### What the model controls, and what it does not

The report is a short fixed head — language, verdict, summary — followed by
`sections`, **an ordered stream of blocks the model composes itself**. It picks
which blocks to use and what order to put them in, so the report can follow the
shape of the brief rather than a fixed template.

Block types: `needs`, `evidence`, `precedent`, `gaps`, `questions`, and `note`.
A `note` is free prose with the model's own heading — the escape hatch for
analysis a pre-made block would distort. The prompt names a default order,
requires a `gaps` block in every report, and forbids repeating a block type.

The application still owns every block's typography, spacing, colour, animation
and all project metadata. The model owns the analysis, the prose and the running
order. It never emits HTML, Markdown, links, titles or dates.

### Evidence cards and the project modal

An evidence card stays deliberately thin: a thumbnail, the project's identity,
and why it matters for this brief. Clicking its header opens the full portfolio
entry — description, overview sections, images and videos, links — in a native
`<dialog>`, so a reader can dig into a project without losing the report.

That means `getEvidenceIndex` ships all thirteen entries' details into the page
(~37 KB of JSON, most of it text). If that grows uncomfortable, the natural next
step is to move the modal's `detail` payload behind a prerendered JSON route and
fetch it on open; the card-level fields are what the report itself needs.

Thumbnails come from the entry's `image` frontmatter, falling back to the first
carousel item — two entries have no `image`, so the fallback is load-bearing.
Videos are resolved through the glob's own source paths (`<slug>/<file>`) rather
than by searching emitted URLs the way `/portfolio` does, which cannot
accidentally match a same-named file in another project's folder.

### Environment variables

| Variable         | Required   | What it does                                                                                                                      |
| ---------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `OPENAI_API_KEY` | for `/fit` | Server-only. Without it the site still builds and `/fit` renders; the endpoint returns 503 and the page shows a friendly message. |
| `AI_MATCH_MODEL` | no         | Overrides the model, e.g. `gpt-5.6-sol`. Highest priority.                                                                        |

Model selection (`src/utils/fit/models.ts`):

| Environment                               | Model                  |
| ----------------------------------------- | ---------------------- |
| local `pnpm dev`                          | `gpt-5.6-luna` (cheap) |
| Vercel **Preview** (`VERCEL_ENV=preview`) | `gpt-5.6-luna` (cheap) |
| Vercel **Production**                     | `gpt-5.6-sol`          |
| `AI_MATCH_MODEL` set                      | whatever it says       |

A preview deployment is still testing, so it stays on the cheap model even
though `NODE_ENV` is `production` there. Reasoning effort is a single constant
(`REASONING_EFFORT`, currently `low`) next to the model IDs.

The response includes an `x-fit-model` header naming the model a deployment
actually used.

### Checks

```sh
pnpm check:fit
```

Runs the streaming pipeline against a mocked model — no network, no credentials.
It verifies that partial JSON stays parseable throughout the stream, that the
verdict streams before the body, that blocks only ever grow (so nothing already
on screen can vanish or change type), and that model selection behaves per the
table above.

It also intercepts the OpenAI provider's own `fetch` to assert the exact request
body, checking that the block union survives OpenAI's strict structured-output
rules — every object `additionalProperties: false` with all properties required.
That is the part of the schema most likely to break silently, and it is cheap to
catch here rather than in production.

### Abuse safeguards — still to configure

The endpoint enforces what a stateless function can enforce on its own: POST +
JSON only, a 64 KB body cap, a 12 000-character input cap, and a capped output
budget. Duplicate concurrent submissions are blocked in the UI, which is a
usability measure, not a security one.

There is deliberately **no in-memory rate limiter**: serverless instances do not
share memory, so one would give a false sense of safety. Before leaving `/fit`
publicly reachable, configure, outside the app:

1. a **spending limit on the OpenAI project** that holds `OPENAI_API_KEY`;
2. **rate limiting at the edge** — Vercel Firewall (Web Application Firewall →
   Rate Limiting) on `/api/fit`, e.g. a handful of requests per IP per minute.

If a persistent store is ever wired up for this, the natural place to enforce it
is the top of `POST` in `src/pages/api/fit.ts`, before the model call.

### Known dependency pin

`@astrojs/react` is held at 5.x because 6.x requires Vite 8, while Astro 6.4
still runs Vite 7.3. `astro.config.ts` also carries a small workaround
(`reactFastRefreshOnVite7`) so React Fast Refresh does not break `astro dev`.
Both can go once Astro moves to Vite 8.
