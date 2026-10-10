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

There are two kinds, and the difference matters when deploying:

- **Build-time** — the `NEXT_PUBLIC_*` variables. Next inlines these into the bundle
  during `next build`, so the value is fixed when the image is built and **cannot** be
  changed by restarting the container. They must be set before the build starts, and in
  Docker they are build args (`--build-arg`), not runtime environment variables.
- **Runtime** — everything else. The server reads these from `process.env` while it is
  running, so they can be supplied with `docker run -e …` or by your platform's
  environment settings, and changing one needs only a restart, not a rebuild.

| Variable                          | Read at   | Purpose                                                                                                                                                          |
| --------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DISCOURSE_HOST`                  | Runtime   | Discourse instance hostname (no `https://`). Used by the contact form and by the media release / blog reader. Defaults to `forum.bettertransportqueensland.org`. |
| `DISCOURSE_API_KEY`               | Runtime   | API key from Discourse Admin > API > New API Key. Contact form only.                                                                                             |
| `DISCOURSE_API_USERNAME`          | Runtime   | Discourse user that creates the topics. Contact form only.                                                                                                       |
| `DISCOURSE_CONTACT_CATEGORY_ID`   | Runtime   | Optional category for contact form submissions.                                                                                                                  |
| `DISCOURSE_WEBHOOK_SECRET`        | Runtime   | Shared secret for `/api/discourse-webhook`. The route returns 503 while unset. See [Media releases and blog](#media-releases-and-blog).                          |
| `DISCOURSE_CACHE_DIR`             | Runtime   | Where the topic cache is written. Defaults to `<tmpdir>/btq-discourse-cache`.                                                                                    |
| `DISCOURSE_TOPIC_MAX_AGE_SECONDS` | Runtime   | Backstop: refetch a cached article once it is this old. Default `86400` (one day) — the webhook is the normal refresh.                                           |
| `DISCOURSE_CATEGORY_TTL_SECONDS`  | Runtime   | Backstop: how long a category listing is trusted. Default `86400` (one day).                                                                                     |
| `DISCOURSE_PREFETCH_ON_START`     | Runtime   | Set to `false` to skip warming the topic cache at startup. Default `true`.                                                                                       |
| `NEXT_PUBLIC_IS_BETA`             | **Build** | Enables beta-only pages and components. See [Beta mode](#beta-mode).                                                                                             |

Only the contact form needs credentials. Without `DISCOURSE_API_KEY` /
`DISCOURSE_API_USERNAME` the contact form section hides itself rather than failing, and
the media release and blog pages keep working — they read public endpoints anonymously.

## Media releases and blog

These pages read Discourse's JSON API rather than its RSS feeds. The category listing
(`/c/<path>/<id>.json`) is metadata only, so it is cheap to poll; an individual topic
(`/t/<slug>/<id>.json`) is fetched only when its first post may have changed. Articles
render the first post and drop replies.

Topics are cached on disk with a short in-memory tier in front, under
`$DISCOURSE_CACHE_DIR/v1/`. The on-disk record is the source of truth and the
in-memory copy is trusted for only ten seconds, because module state is not shared
between a route handler and a page render — so a webhook deleting a disk record takes
effect across the app within about ten seconds rather than instantly. The cache is warmed at startup, and a fetch failure serves
the stale copy rather than caching the failure, so a forum outage degrades to slightly
stale content instead of 404s. If the directory is not writable the app logs one warning
and runs memory-only.

The cache is deliberately long-lived — a day for both listings and articles — because
the **webhook** is the refresh mechanism, not polling. The two max-age settings exist
only as a backstop for a webhook delivery that never arrived.

Reads are **stale-while-revalidate**: a cached copy is returned immediately and any
refresh runs behind the response, so a page render never waits on the forum even when
its cache has expired. A reader can therefore see a slightly stale listing, but only if
the webhook has stopped delivering — and the refresh it triggers lands for the next
visitor. The webhook also repopulates what it invalidates, so nobody pays for the
refetch. The only request that waits is one for content that has never been cached.

That makes webhook health important: if deliveries stop, content can lag by up to a day.
Discourse's webhook event log shows the response for every delivery, and the route echoes
what it invalidated (including the serving process's `pid`) so a re-sent event doubles as
a diagnostic — a changing `pid` across deliveries means requests are spread over several
instances, and an invalidation only reaches the one that received it.

Reads also carry a unique query parameter to defeat Discourse's **anonymous response
cache**: it has been observed returning `x-discourse-cached: true` with a category
listing that omitted a topic created minutes earlier. Without that bypass a stale read
would be stored for the full day.

In Docker, `DISCOURSE_CACHE_DIR` is set to `/app/.cache/discourse` and owned by the
runtime user. Mount a volume there to keep the cache warm across container replacement:

```bash
docker run -p 3000:3000 -v btq-discourse-cache:/app/.cache/discourse btq-website
```

### Discourse webhook

Set `DISCOURSE_WEBHOOK_SECRET`, then add a webhook in Discourse (Admin > API >
Webhooks > New Webhook):

| Field                 | Value                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| Payload URL           | `https://www.bettertransportqueensland.org/api/discourse-webhook`                                           |
| Content Type          | `application/json`                                                                                          |
| Secret                | `openssl rand -hex 32`, matching `DISCOURSE_WEBHOOK_SECRET`                                                 |
| Which events          | the **Topic Event** and **Post Event** groups                                                               |
| Categories            | leave empty — the route filters server-side, because destroy and move events do not carry a usable category |
| Check TLS certificate | enabled                                                                                                     |
| Active                | enabled                                                                                                     |

Requests are authenticated with an HMAC-SHA256 signature over the raw body. A post event
only refreshes an article when it is the first post; a reply refreshes the listing order
alone. Use the admin UI's **Ping** button to confirm a `200`, and Discourse's webhook
event log to see the response for every delivery.

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

### Docker

The `dockerfile` builds on `node:24-alpine` in two stages and serves the
standalone output as the non-root `node` user on port 3000:

```bash
docker build -t btq-website .
docker run -p 3000:3000 btq-website
```

The two kinds of variable are supplied differently here — build-time ones as
`--build-arg` at image build, runtime ones as `-e` at container start:

```bash
docker build --build-arg NEXT_PUBLIC_IS_BETA=true -t btq-website:beta .

docker run -p 3000:3000 \
  -e DISCOURSE_WEBHOOK_SECRET=<secret> \
  -v btq-discourse-cache:/app/.cache/discourse \
  btq-website
```

Passing `NEXT_PUBLIC_IS_BETA` with `-e` has no effect: by then it has already been
inlined into the bundle.

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
