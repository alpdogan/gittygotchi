# Architecture

GittyGotchi is a persistent virtual creature that lives in a GitHub profile README. The product is playful. The engineering is not.

## Goals

- Serve a tiny SVG from the edge with high cache hit rate
- Keep GitHub and D1 off the hot path whenever possible
- Make class assignment feel random while remaining deterministic
- Grow from activity after adoption, not from account age
- Stay cheap, observable, and cheap to operate
- Let someone adopt Gitty from another README without reading this file

## Non-goals

- OAuth, PATs, GitHub Apps, or GitHub Actions for the basic experience
- A Node HTTP server, Docker, Kubernetes, or a separate web frontend
- Per-view D1 counters
- An enterprise microservice split
- Final creature illustration in Phase 1

## Why Cloudflare Workers

The README image is requested from GitHub's image proxy around the world. A Worker can terminate most of those requests at the edge cache, talk to D1 in-process, and return SVG without a regionful origin.

## Why TypeScript

The domain rules must be typed, exhaustive, and tested. SVG output is a string. The Worker runtime is JavaScript. TypeScript is the smallest honest stack for all three.

## Why D1

The Gitty is persistent: class, birth time, growth, and last known activity. D1 is SQLite at the edge with no extra process. There is no Redis, Postgres, or ORM. Prepared statements are enough.

## Why no Redis

The hot path should hit Cloudflare's cache. Contribution freshness can live as timestamps on the pet row. A second cache product would add cost and failure modes without helping README latency.

## Why the same Worker serves HTML and SVG

The discovery loop is `/{username}.svg` next to `/{username}`. Splitting those onto two apps would duplicate routing, username validation, and origin configuration. One Worker is the product.

## Monorepo rationale

This is not a microservices repo. The workspace exists so domain rules, SVG rendering, and config constants can be tested without the Worker runtime, while the Worker remains the only deployable.

- `@gittygotchi/worker` — HTTP, later GitHub/D1 adapters
- `@gittygotchi/domain` — types and deterministic rules
- `@gittygotchi/svg` — rendering
- `@gittygotchi/config` — TTLs, growth thresholds, class bands, public origin

## Request lifecycle

Phase 1 and 2:

```text
GET /{username}.svg
  validate username
  return placeholder SVG
```

The GitHub adapter exists and is tested. Routes do not call it yet.

Later:

```text
GET /{username}.svg
  validate username
  edge cache
  D1 lookup
  adopt if missing
  refresh contributions if stale
  calculate visible state
  render SVG
  cache
```

Most README requests should terminate at the cache.

## Domain boundaries

GitHub URLs, HTML, and headers stay in the Worker adapter. Domain code receives usernames, contribution days, and timestamps. Time is injected. `Math.random()` is not used for class assignment.

## GitHub adapters

Two public sources:

- `GET https://api.github.com/users/{username}` for `created_at`
- `GET https://github.com/users/{username}/contributions` for anonymized activity

The public Events API is the wrong source because private-repo work can be invisible there while still appearing on the contribution calendar.

The contribution HTML is undocumented. Parser failure is not "zero activity". It is an error, and stored state wins. The parser lives in `apps/worker/src/github/` and is covered by fixtures under `fixtures/github/`. CI never calls live GitHub.

## Class and growth

Class is rolled once from a stable seed, persisted, and never recalculated. Earth/Water/Air/Fire are equal. Psy is rare and age-weighted. Growth requires both elapsed time and distinct active days after adoption.

## Caching and stale behavior

Cache constants live in `packages/config/src/cache.ts`. If GitHub is down, serve known state. Image routes always return SVG.

## First-view adoption

Requesting `/{username}` or `/{username}.svg` may create that Gitty in later phases. That does not prove GitHub account ownership. Another person can trigger the first creation. Optional verification can be added later without changing the README snippet.

## Concurrency

Two first requests may both try to insert. The unique username constraint decides. The loser re-reads. No distributed lock.

## Analytics

Do not `UPDATE pets SET views = views + 1`. Cache hits never reach the Worker. Analytics is a port: structured logs now, Cloudflare-native later, never on the SVG critical path.

## SVG architecture

Gitty is composed from body, class, face, behavior, and effects layers. Phase 1 only ships a placeholder egg so routing and README embedding can be demonstrated. Animation is CSS/SMIL progressive enhancement.

## Clickable README strategy

GitHub may proxy SVGs in ways that ignore internal links. The product snippet is:

```markdown
[![GittyGotchi](https://gittygotchi.alpdogan.co/USERNAME.svg)](https://gittygotchi.alpdogan.co/USERNAME)
```

## Discovery loop

Someone sees Gitty on a profile, clicks it, lands on `/{username}`, copies a snippet, and adds it to their own README.

## Security

Username validation is the SSRF boundary. Upstream GitHub URLs are built internally. SVG text is escaped. D1 uses bound parameters. Image errors never include stack traces or SQL.

## Future evolution

- Phase 2: GitHub adapter and parser
- Phase 3: domain engine
- Phase 4: D1 repository
- Phase 5: SVG foundation after character design
- Phase 6: cache
- Phase 7: landing/share polish
- Phase 8: visual polish by approval
- Phase 9: production domain, ruleset, protected deploys
