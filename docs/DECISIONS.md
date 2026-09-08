# Decisions

Lightweight ADRs. Newer entries win when they explicitly supersede an older one.

## ADR-001 — Cloudflare Workers + TypeScript

The README image must be cheap, global, and cacheable. A Worker with TypeScript is the runtime and the language. No Node HTTP server.

## ADR-002 — pnpm workspace monorepo

The repo is one deployable Worker plus testable libraries. The workspace isolates domain, SVG, and config. It is not a platform of services.

## ADR-003 — Contribution calendar rather than public Events API

`/users/{username}/events/public` can be empty while the contribution calendar still shows anonymized private work. Gitty cares about activity, not public event noise.

## ADR-004 — D1 for persistent lifecycle

Class, birth, and growth must survive deploys. D1 is SQLite with in-process bindings. No ORM. `UNIQUE(github_username)` is the lookup key.

A `contribution_days` table is not in the MVP schema. Last-known activity fields on `pets` are enough until growth needs durable distinct-day history after parser failures. Raw GitHub HTML is never stored.

## ADR-005 — No per-view D1 analytics

Cloudflare cache hits never execute Worker code. `UPDATE pets SET views = views + 1` would undercount README impressions and write on the hot path. Analytics is a non-blocking port: structured logs now.

## ADR-006 — Growth based on active days

Account age must not grow the pet. Distinct active contribution days after adoption are the care unit. Commit volume inside a day may change mood, not skip stages.

## ADR-007 — Gitty never dies; inactivity becomes hibernation

Permanent death would punish vacations. Hibernation is reversible. Weekends are rest, not neglect.

## ADR-008 — Earth/Water/Air/Fire normal; Psy rare

The four elemental classes are identities of equal prestige. Psy is a rare identity, not a veteran rank.

## ADR-009 — Age-weighted deterministic Psy probability

Psy chance rises with GitHub age, then the remainder splits equally among the four normal classes. The roll is hashed from a versioned seed. Once stored, class never rerolls.

## ADR-010 — Clickable README via Markdown wrapper

GitHub may proxy SVGs and drop internal links. The product snippet wraps `/{username}.svg` in a Markdown link to `/{username}`.

## ADR-011 — Same Worker serves landing, share pages, and SVG

The viral loop is two paired URLs. One origin, one deploy, one username validator.

## ADR-012 — Workers Caching in front of the SVG entrypoint

README traffic should miss GitHub and D1. Enable Workers Caching on a dedicated `PetSvg` entrypoint and keep the gateway uncached so username validation and query-string stripping always run. Honor RFC 9111 `Cache-Control`. Contribution freshness lives on the pet row; GitHub HTML subrequests also use a 20-minute edge TTL. The Cache API is not the primary store: it still invokes the Worker on every request and does not collapse concurrent misses.
