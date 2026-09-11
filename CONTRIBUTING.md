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
pnpm deploy:production
```

`pnpm check` runs format check, lint, typecheck, and tests.

After changing `apps/worker/wrangler.jsonc`, regenerate Worker types:

```bash
pnpm --filter @gittygotchi/worker exec wrangler types
```

CI runs `wrangler types --check` so the committed `apps/worker/worker-configuration.d.ts` must stay in sync.

## Local Worker

```bash
pnpm --filter @gittygotchi/worker exec wrangler d1 migrations apply gittygotchi --local
pnpm dev
```

`pnpm dev` applies pending local D1 migrations, then runs `wrangler dev` for `@gittygotchi/worker`, usually at `http://localhost:8787`. Wrangler dev uses the local SQLite named `gittygotchi-local`, not the remote production database. If `pets` is missing, apply `--local` as above.

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
pnpm --filter @gittygotchi/worker exec wrangler d1 migrations list gittygotchi --remote
pnpm --filter @gittygotchi/worker exec wrangler d1 migrations apply gittygotchi --remote
```

Remote migrations are a production operation. Apply them manually immediately before the
corresponding Worker deploy. Wrangler records applied migrations; do not attempt to reverse them
with a Worker rollback.

Phase 4 added a D1 repository. The live HTTP path now adopts on first visit.

Phase 6 caches live SVGs for 10 minutes on the `PetSvg` entrypoint. HTML stays `no-store`. The first cache miss must adopt and persist.

Phase 7 polishes the landing and share pages. The copy/discovery loop is the product.

Phase 8 polishes character art through the approved prototype renderer. After changing SVG markup, regenerate README samples:

```bash
pnpm --filter @gittygotchi/svg export-screenshots
```

Open `docs/screenshots/gallery.html` to compare every stage, class, mood, hunger, and behavior on GitHub light (`#ffffff`) and dark (`#0d1117`). The README only shows the stage and class rows; the gallery is the full visual QA sheet.

## Production domain

`gittygotchi.alpdogan.co` is a Wrangler-managed custom domain. The Worker is not exposed on a
`workers.dev` subdomain.

Production changes are manual only. CI validates the Worker but must not receive Cloudflare
production credentials or deploy.

Before deploying, authenticate Wrangler, fetch remote refs, and use either a clean `main` checkout
whose `origin/main` equals `HEAD` or a clean checkout at an exact tag that exists on `origin` at
`HEAD`:

```bash
pnpm --filter @gittygotchi/worker exec wrangler whoami
git fetch origin main --tags
git switch main
git pull --ff-only origin main
```

For a tagged release, replace the last two commands with `git checkout <TAG>`. Then inspect and
apply pending production D1 migrations before deploying:

```bash
pnpm --filter @gittygotchi/worker exec wrangler d1 migrations list gittygotchi --remote
pnpm --filter @gittygotchi/worker exec wrangler d1 migrations apply gittygotchi --remote
pnpm deploy:production
```

`pnpm deploy:production` enforces the clean/ref checks, runs `pnpm check`, performs a Wrangler dry
run, and only then deploys.

Verify the active deployment, recent versions, and public domain:

```bash
pnpm --filter @gittygotchi/worker exec wrangler deployments status
pnpm --filter @gittygotchi/worker exec wrangler deployments list
pnpm --filter @gittygotchi/worker exec wrangler versions list
curl --fail --show-error --silent https://gittygotchi.alpdogan.co/ >/dev/null
```

Inspect a version and roll Worker code back with Wrangler 4.130.0:

```bash
pnpm --filter @gittygotchi/worker exec wrangler versions view <VERSION_ID>
pnpm --filter @gittygotchi/worker exec wrangler rollback <VERSION_ID>
```

Rollback does not undo D1 migrations. Use a forward migration to correct production schema or
data.

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
