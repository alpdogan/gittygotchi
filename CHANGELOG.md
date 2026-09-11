# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

### Changed

- Live HTTP draws stored pet state. Eggs stay visually unrevealed (the earlier adult Earth SVG was a hardcoded preview). Share pages show Class Hidden and Stage Egg only; hunger, mood, and sleep stay off eggs so chips fit the 240px Gitty card.
- Hatched Gitty SVGs draw hunger, mood, and sleep on the 240×240 card so GitHub README embeds can show them.

### Added

- Live HTTP path: first `/{username}` or `/{username}.svg` visit fetches public GitHub `created_at`, inserts a D1 pet, and renders stored egg state. Later visits refresh contributions, run growth, and draw the stored Gitty instead of the hardcoded preview.
- `pnpm dev` applies local D1 migrations so the `pets` table exists before Wrangler starts. A missing `pets` table now throws a migration hint instead of a raw SQLITE_ERROR.

### Fixed

- First-visit `/alpdogan.svg` rendered the hiding-error face because a detached Workers `fetch` threw `Illegal invocation` and was mapped to `github_unavailable`. GitHub calls now invoke the platform binding with the correct `this`, send `GittyGotchi/1.0 (+repo URL)` plus `X-GitHub-Api-Version`, and fall back to a preview egg when GitHub/D1 fails before a pet exists.
- Phase 8 visual polish: distinct Egg through Mature silhouettes, richer class traits, extra faces, motion, SVG compacting, and README screenshots. Live class and growth are not connected yet.
- Phase 7 landing and share polish: discovery-focused landing, public share page, username generator with copy and no-JS fallback, and Open Graph tags. Live class and growth are not connected yet.
- Phase 6 cache: Workers Caching on the SVG entrypoint, 10-minute SVG TTL, 20-minute contribution freshness, stale GitHub fallback policy, and contribution HTML subrequest cache. Live class and growth are not connected yet.
- Phase 5 SVG foundation: composable egg and hatchling renderer with class accents, four faces, and subtle motion. Live class and growth are not connected yet.
- Phase 4 D1 repository: adoption, class persistence, unique-constraint races, and meaningful lifecycle updates. Routes still serve the placeholder SVG.
- Phase 3 domain engine: deterministic class roll, growth from elapsed time plus active days, hunger/mood/behavior, weekend rest, hibernation, and recovery. Routes still serve the placeholder SVG.
- Phase 2 GitHub adapter: public user API client, contribution calendar fetcher, HTML parser, fixtures, and typed errors. Routes still serve the placeholder SVG.
- Phase 1 repository foundation: pnpm workspace, Worker HTTP routes, placeholder landing and share pages, D1 schema, CI, and documentation.
