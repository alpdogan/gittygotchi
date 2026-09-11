# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

### Added

- Live HTTP path: first `/{username}` or `/{username}.svg` visit fetches public GitHub `created_at`, inserts a D1 pet, and renders stored egg state. Later visits refresh contributions, run growth, and draw the stored Gitty instead of the hardcoded preview.
- Phase 8 visual polish: distinct Egg through Mature silhouettes, richer class traits, extra faces, motion, SVG compacting, and README screenshots. Live class and growth are not connected yet.
- Phase 7 landing and share polish: discovery-focused landing, public share page, username generator with copy and no-JS fallback, and Open Graph tags. Live class and growth are not connected yet.
- Phase 6 cache: Workers Caching on the SVG entrypoint, 10-minute SVG TTL, 20-minute contribution freshness, stale GitHub fallback policy, and contribution HTML subrequest cache. Live class and growth are not connected yet.
- Phase 5 SVG foundation: composable egg and hatchling renderer with class accents, four faces, and subtle motion. Live class and growth are not connected yet.
- Phase 4 D1 repository: adoption, class persistence, unique-constraint races, and meaningful lifecycle updates. Routes still serve the placeholder SVG.
- Phase 3 domain engine: deterministic class roll, growth from elapsed time plus active days, hunger/mood/behavior, weekend rest, hibernation, and recovery. Routes still serve the placeholder SVG.
- Phase 2 GitHub adapter: public user API client, contribution calendar fetcher, HTML parser, fixtures, and typed errors. Routes still serve the placeholder SVG.
- Phase 1 repository foundation: pnpm workspace, Worker HTTP routes, placeholder landing and share pages, D1 schema, CI, and documentation.
