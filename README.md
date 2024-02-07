# Personal website

Personal website powered by [Astro](https://astro.build) and [Tailwind](https://tailwindcss.com/).

Live at [aureliendossantos.com](https://aureliendossantos.com)

## Contents submodule

The website contents (blog articles and other pages, images, videos...), which should be located in `src/content`, are stored in a private git submodule. To keep the submodule private, its address is not stored in this repo, but in an environment variable on Vercel. The `.gitmodules` file is created during the build so that git can fetch the content.

This allows me to work on various drafts without worrying about them going public, and to add secret pages that may need you to jump through some hoops before you stumble on them. Unfortunately, this also means that the website might not work locally if you pull this main repo. Nevertheless, feel free to take a look at it and steal a component or two.

## Commands

| Command                     | Action                                     |
| :-------------------------- | :----------------------------------------- |
| `pnpm install`              | Install dependencies                       |
| `pnpm run dev`              | Start local dev server at `localhost:4321` |
| `pnpm run build`            | Build the production site to `./dist/`     |
| `pnpm run preview`          | Preview the build locally                  |
| `pnpm dlx @astrojs/upgrade` | Upgrade Astro version                      |
