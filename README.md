# BTQ Website

## Getting started

To get started with this template, first install the npm dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

`npm run dev` runs with [beta mode](#beta-mode) enabled, so beta-only pages and
features are visible locally. Use `npm run prod` to see the site as production
visitors do.

## Customizing

You can start editing this by modifying the files in the `/app` folder. The site will auto-update as you edit these files.

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values you need. `.env.local` is
gitignored, so local credentials stay out of commits.

```bash
cp .env.example .env.local
```

| Variable                        | Purpose                                                                     |
| ------------------------------- | --------------------------------------------------------------------------- |
| `DISCOURSE_HOST`                | Discourse instance hostname (no `https://`). Required for the contact form. |
| `DISCOURSE_API_KEY`             | API key from Discourse Admin > API > New API Key.                           |
| `DISCOURSE_API_USERNAME`        | Discourse user that creates the topics.                                     |
| `DISCOURSE_CONTACT_CATEGORY_ID` | Optional category for contact form submissions.                             |
| `NEXT_PUBLIC_IS_BETA`           | Enables beta-only pages and components. See [Beta mode](#beta-mode).        |

Without the Discourse variables the contact form section hides itself rather than
failing, so the site still runs for local development.

## Building for production

To build and serve the site exactly as production visitors see it — beta
features off:

```bash
npm run prod
```

That is a build followed by a server start. To run the two steps separately, or
to serve a build you already have:

```bash
npm run build
npm start
```

Note that bare `npm run build` and `npm start` inherit whatever
`NEXT_PUBLIC_IS_BETA` is in your environment or `.env.local`, whereas
`npm run prod` pins it off.

`next.config.mjs` sets `output: 'standalone'`, so the build produces a
self-contained server bundle in `.next/standalone` alongside static assets in
`.next/static`. Production deployments run `node server.js` from that bundle
rather than `npm start`.

### Available scripts

| Script               | What it does                                                           |
| -------------------- | ---------------------------------------------------------------------- |
| `npm run dev`        | Development server with hot reload on port 3000, **beta mode on**.     |
| `npm run prod`       | Production build and server, **beta mode off** — the production build. |
| `npm run build`      | Production build only (standalone output).                             |
| `npm start`          | Serves an existing production build.                                   |
| `npm run lint`       | Runs `next lint`.                                                      |
| `npm run fetch-gtfs` | Refreshes the GTFS data used by the transport maps.                    |
| `npm run typegen`    | Regenerates Sanity schema types.                                       |

### Docker

The `dockerfile` builds on `node:24-alpine` in two stages and serves the
standalone output as the non-root `node` user on port 3000:

```bash
docker build -t btq-website .
docker run -p 3000:3000 btq-website
```

Beta builds take a build arg — see below.

### Continuous deployment

`.github/workflows/docker-publish.yml` builds and publishes the image on
release, signs the digest with cosign, and sets `NEXT_PUBLIC_IS_BETA` from
whether the GitHub release is marked as a prerelease.

## Beta mode

Beta mode gates unfinished pages and features. It is driven by
`NEXT_PUBLIC_IS_BETA=true`. Because Next.js inlines `NEXT_PUBLIC_*` variables at
build time, the flag must be set **before** the dev or build process starts — it
cannot be flipped at runtime, and beta-only code is simply absent from
production bundles.

### Running in beta mode

`npm run dev` already sets the flag, so local development is in beta mode by
default. To check how something looks with beta features off, use `npm run prod`
(which pins the flag off) or set the variable explicitly:

```bash
NEXT_PUBLIC_IS_BETA=false next dev
```

For a beta production build:

```bash
NEXT_PUBLIC_IS_BETA=true npm run build && npm start
```

Restart an already-running server after changing the flag — it is read once, at
process start.

Docker, where it is a build arg rather than a runtime variable:

```bash
docker build --build-arg NEXT_PUBLIC_IS_BETA=true -t btq-website:beta .
```

In CI this is automatic: a GitHub release marked **prerelease** produces a beta
image, and a normal release produces a production one.

### Gating features on beta

`lib/beta.ts` exposes the flag as `IS_BETA`, plus three ways to use it:

| Gate                                                  | Use for                                                                                                   |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `<BetaOnly>…</BetaOnly>` (`components/beta-only.tsx`) | Banners, buttons, or sections — renders nothing in production.                                            |
| `requireBeta()` at the top of a Server Component page | Whole beta-only routes — triggers `notFound()` in production, so the page is never accessible or indexed. |
| `beta: true` on a nav item in `data/nav-links.ts`     | Hiding nav links; groups left empty are dropped too.                                                      |

Do not set `NEXT_PUBLIC_IS_BETA=true` for production deployments. The inline
`VAR=value` syntax in the `dev` and `prod` scripts is POSIX shell; on Windows use
WSL or Git Bash.

## License

Copyright (C) 2025 Better Transport Queensland Inc.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

## Learn more

To learn more about the technologies used in this site template, see the following resources:

- [Tailwind CSS](https://tailwindcss.com/docs) - the official Tailwind CSS documentation
- [Next.js](https://nextjs.org/docs) - the official Next.js documentation
- [Headless UI](https://headlessui.dev) - the official Headless UI documentation
