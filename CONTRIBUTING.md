# Contributing

Thanks for helping GittyGotchi grow.

## Prerequisites

- Node 24 (see `.node-version`)
- [pnpm](https://pnpm.io/) 12 (`packageManager` in `package.json`)
- A Cloudflare account only if you are deploying or creating D1

```bash
corepack enable
corepack prepare pnpm@12.3.4 --activate
pnpm install
lefthook install
```

## Scripts

```bash
pnpm format
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm check
pnpm dev
pnpm deploy
```

`pnpm check` runs format check, lint, typecheck, and tests.

After changing `apps/worker/wrangler.jsonc`, regenerate Worker types:

```bash
pnpm --filter @gittygotchi/worker exec wrangler types
```

CI runs `wrangler types --check` so the committed `apps/worker/worker-configuration.d.ts` must stay in sync.

## Local Worker

```bash
pnpm dev
```

That runs `wrangler dev` for `@gittygotchi/worker`, usually at `http://localhost:8787`.

```bash
pnpm --filter @gittygotchi/worker exec wrangler deploy --dry-run
```

## D1

Create the database once:

```bash
pnpm --filter @gittygotchi/worker exec wrangler d1 create gittygotchi
```

Paste the printed `database_id` into `apps/worker/wrangler.jsonc` under `d1_databases[0].database_id`. Do not invent an ID.

Local migrations:

```bash
pnpm --filter @gittygotchi/worker exec wrangler d1 migrations apply gittygotchi --local
```

Production migrations:

```bash
pnpm --filter @gittygotchi/worker exec wrangler d1 migrations apply gittygotchi --remote
```

Phase 4 adds a D1 repository. Routes still do not read or write D1 at runtime.

Phase 6 caches foundation SVGs for 10 minutes on the `PetSvg` entrypoint. HTML stays `no-store`. GitHub and D1 are still not on the HTTP path.

Phase 7 polishes the landing and share pages. The copy/discovery loop is the product.

Phase 8 polishes character art: distinct Egg through Mature silhouettes, class traits, extra faces, and motion. HTTP still serves a preview egg. After changing SVG markup, regenerate README samples:

```bash
pnpm --filter @gittygotchi/svg export-screenshots
```

Open `docs/screenshots/gallery.html` to compare the paper card on GitHub light (`#ffffff`) and dark (`#0d1117`).

## Production domain

Do not add `gittygotchi.alpdogan.co` to Wrangler until that hostname is ready.

When `alpdogan.co` is a Cloudflare zone, connect the Worker as a Custom Domain:

1. Cloudflare Dashboard → Workers & Pages → `gittygotchi` → Settings → Domains & Routes
2. Add → Custom domain → `gittygotchi.alpdogan.co`
3. Cloudflare will create DNS and certificates. Do not invent DNS values by hand.

Optionally later, encode the same binding in `apps/worker/wrangler.jsonc`:

```jsonc
"routes": [{ "pattern": "gittygotchi.alpdogan.co", "custom_domain": true }]
```

Production deploy:

```bash
pnpm deploy
```

Only from protected `main` or a tagged release. CI does not deploy and must not receive Cloudflare secrets on pull requests.

## Hooks

```bash
lefthook install
```

- pre-commit: staged Biome checks
- pre-push: `pnpm check`

## Branches

```text
feat/psy-animation
feat/user-share-page
fix/contribution-parser
docs/cache-strategy
refactor/state-engine
perf/svg-cache
```

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) on pull request titles. Local commits are not heavily policed. Prefer squash merge.

Examples:

```text
feat: add Psy class
fix: ignore future contribution cells
docs: explain cache lifecycle
test: cover parser failure
refactor: isolate GitHub adapter
perf: reduce D1 lookups
chore: update dependencies
```

## Pull requests

1. Branch from `main`
2. Keep the change focused
3. Update tests and docs when behavior changes
4. Run `pnpm check`
5. Fill in the PR template
6. Do not commit secrets

## Security reporting

See [SECURITY.md](SECURITY.md). Do not file public issues for vulnerabilities.
