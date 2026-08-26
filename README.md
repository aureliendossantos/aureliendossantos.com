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

| Path                           | What it is                                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `src/utils/fit/profile.ts`     | **Where to add facts about me.** Employment, education, ramp-up context, per-project notes. Nothing else needs to change. |
| `src/utils/fit/evidence.ts`    | Adapter over the `portfolio` collection: trusted metadata for the browser, fuller record for the model.                   |
| `src/utils/fit/prompt.ts`      | System prompt and dossier assembly.                                                                                       |
| `src/utils/fit/schema.ts`      | The streamed report's shape. Field order **is** generation order.                                                         |
| `src/utils/fit/models.ts`      | Model selection and reasoning effort.                                                                                     |
| `src/utils/fit/limits.ts`      | Input, body and output caps.                                                                                              |
| `src/components/fit/`          | The React island. React is used **only** here.                                                                            |
| `src/components/fit/labels.ts` | Every visible label, in French and English.                                                                               |

Projects are referenced by the folder slug under `src/content/portfolio/`
(`koimori`, `qrpg`, …). The model may only emit those IDs; titles, dates and
links are resolved from local data, and an unknown ID drops the card instead of
rendering invented metadata.

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
schema's field order matches the intended streaming order, and that model
selection behaves per the table above.

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
