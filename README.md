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
