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

- `@gittygotchi/worker` — HTTP, GitHub adapters, D1 repository, SVG cache, and the live pet path
- `@gittygotchi/domain` — types and deterministic rules
- `@gittygotchi/svg` — approved prototype renderer; HTTP draws stored pet state
- `@gittygotchi/config` — TTLs, growth thresholds, class bands, public origin

## Request lifecycle

```text
GET /{username}.svg
  validate username
  gateway (uncached)
  PetSvg entrypoint cache
    hit: return SVG
    miss:
      D1 lookup
      fetch public GitHub user and adopt if missing
      refresh contributions if stale
      calculate visible state
      persist if growth changed
      render SVG from stored VisiblePetState
      store for 10 minutes
```

Cache hits on `PetSvg` skip that entrypoint, so the first miss must adopt. The gateway still validates the username so query strings cannot poison the key. HTML `/{username}` is `no-store` and uses the same adopt/refresh path.

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

Class is rolled once from a stable seed, persisted, and never recalculated. The seed is `username + githubCreatedAt + gittygotchi-class-v1`. SHA-256 supplies 53 bits of mantissa, divided by `2^53` to get a unit interval. If that roll is below the age-weighted Psy probability, the class is Psy. Otherwise the remainder splits equally among Earth, Water, Air, and Fire in that order. Age uses 365.25-day years at adoption time.

Earth/Water/Air/Fire are equal. Psy is rare and never guaranteed. Growth requires both elapsed time and distinct active days after adoption. Account age does not grow the pet. Gitty never dies: long weekday inactivity becomes hibernation, and weekends are not neglect.

## Caching and stale behavior

Cache constants live in `packages/config/src/cache.ts`. SVG TTL is 10 minutes. Contribution freshness is 20 minutes. GitHub `created_at` is stored forever after adoption.

Workers Caching sits in front of the `PetSvg` entrypoint. The default gateway is uncached: it validates the username, strips query strings, and dispatches `GET /{username}.svg` to `PetSvg`. Cache keys use the normalized lowercase path, not hostname or query string. HTML, health, and 503 error SVGs are `no-store`. Invalid-username images may be cached. GitHub 404 images use a 60-second TTL.

If GitHub is down, serve known state. Order: fresh SVG cache, stored pet, stale contribution timestamps on the pet row, then upstream GitHub. Parser failure is not zero activity. Image routes always return SVG. When no pet is stored yet, first-visit GitHub or D1 failure renders a preview egg instead of the hiding-error face.

GitHub contribution fetches ask Cloudflare to cache the HTML for the freshness TTL (`cf.cacheTtl` + `cacheEverything`) so repeated origin misses do not all hit GitHub. Do not log every healthy cache hit.

## First-view adoption

Requesting `/{username}` or `/{username}.svg` creates that Gitty on first visit. That does not prove GitHub account ownership. Another person can trigger the first creation. Optional verification can be added later without changing the README snippet.

`github_created_at` is the public GitHub account timestamp. `born_at` / `created_at` are adoption time (first visit). Class is rolled once from username + `github_created_at` at adoption. Growth and egg reveal use elapsed time plus active days after `born_at`, not account age. First visit is an egg unless those adoption-time thresholds are already met, which they are not.

Class is written once and never appears in lifecycle updates. Unchanged growth fields are not rewritten.

## Concurrency

Two first requests may both try to insert. The unique username constraint decides. The loser re-reads. No distributed lock.

## Analytics

Do not `UPDATE pets SET views = views + 1`. Cache hits never reach the Worker. Analytics is a port: structured logs now, Cloudflare-native later, never on the SVG critical path.

## SVG architecture

Gitty is composed from the approved prototype renderer: shared species anatomy, class treatments, faces, behavior props, and stage-aware effects. HTTP renders stored visible state. Eggs stay visually unrevealed and omit hunger, mood, and sleep on the share page.

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

- Phase 2: GitHub adapter and parser — done
- Phase 3: domain engine — done
- Phase 4: D1 repository — done
- Phase 5: SVG foundation — done
- Phase 6: cache — done; first `PetSvg` miss adopts
- Phase 7: landing/share polish — done
- Phase 8: visual polish — done
- Phase 9: production domain, ruleset, protected deploys
- Phase 10: live HTTP path — first visit inserts a pet; later visits refresh, grow, and render stored state
