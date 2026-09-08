# GitHub ruleset for `main`

`CODEOWNERS` does not block pushes by itself. A repository ruleset does.

Create this after the public repository exists. Do not enable it in a way that locks the only maintainer out of merging.

## Recommended ruleset

1. Open the repository on GitHub
2. Go to **Settings → Rules → Rulesets**
3. Select **New ruleset → New branch ruleset**
4. Name it `main`
5. Enforcement: **Active**
6. Target: **Include by pattern** `main`
7. Bypass:
   - Until there is a second reviewer, allow **Repository admin** (`@alpdogan`) to bypass
   - After a second maintainer exists, remove the bypass if practical
8. Enable:
   - Restrict deletions
   - Block force pushes
   - Require linear history
   - Block the push of commits authored or committed by untrusted users if shown
9. **Require a pull request before merging**
   - Required approvals: `1`
   - Dismiss stale pull request approvals when new commits are pushed
   - Require review from Code Owners
   - Require conversation resolution before merging
10. **Require status checks to pass**
    - Require branches to be up to date before merging
    - Required checks:
      - `Format`
      - `Lint`
      - `Typecheck`
      - `Test`
      - `Worker Build`
      - `PR Title`
11. Do **not** allow direct updates to `main`
12. Create the ruleset

The check names must match the GitHub Actions job names exactly.

## Why the admin bypass exists

This project currently has one maintainer. Requiring one approval with no bypass means `@alpdogan` cannot merge their own PRs. Keep the bypass for the owner until there is a real second reviewer.

## Merge style

Prefer **squash merge** so `main` stays linear and Conventional Commit titles remain readable.

## What this does not do

- It does not deploy
- It does not expose Cloudflare secrets to pull requests
- It does not replace CODEOWNERS; it enforces them
