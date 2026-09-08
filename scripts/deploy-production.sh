#!/usr/bin/env bash

set -euo pipefail

readonly repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

readonly head_commit="$(git rev-parse --verify HEAD)"

if [[ -n "$(git status --porcelain --untracked-files=normal)" ]]; then
	echo "Production deploy refused: the checkout is not clean." >&2
	exit 1
fi

branch="$(git symbolic-ref --quiet --short HEAD || true)"
if [[ "$branch" == "main" ]]; then
	readonly origin_main="$(git rev-parse --verify refs/remotes/origin/main)"
	if [[ "$origin_main" != "$head_commit" ]]; then
		echo "Production deploy refused: origin/main does not equal HEAD." >&2
		exit 1
	fi
	echo "Deploying production from main at $head_commit."
else
	tag="$(git describe --tags --exact-match --abbrev=0 HEAD 2>/dev/null || true)"
	if [[ -z "$tag" ]]; then
		echo "Production deploy refused: checkout must be main or an exact tag." >&2
		exit 1
	fi

	remote_tag_commit="$(
		{
			git ls-remote --exit-code origin "refs/tags/$tag^{}" ||
				git ls-remote --exit-code origin "refs/tags/$tag"
		} | awk 'NR == 1 { print $1 }'
	)"
	if [[ -z "$remote_tag_commit" || "$remote_tag_commit" != "$head_commit" ]]; then
		echo "Production deploy refused: origin tag $tag does not equal HEAD." >&2
		exit 1
	fi
	echo "Deploying production from tag $tag at $head_commit."
fi

pnpm check
pnpm --filter @gittygotchi/worker exec wrangler deploy --dry-run
pnpm --filter @gittygotchi/worker exec wrangler deploy
