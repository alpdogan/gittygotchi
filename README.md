# GittyGotchi

A tiny creature that lives on your GitHub profile.

No login. No token. Just add your Gitty.

[![GittyGotchi](https://gittygotchi.alpdogan.co/alpdogan.svg)](https://gittygotchi.alpdogan.co/alpdogan)

## Get yours

Replace `YOUR_USERNAME`:

[![GittyGotchi](https://gittygotchi.alpdogan.co/YOUR_USERNAME.svg)](https://gittygotchi.alpdogan.co/YOUR_USERNAME)

Or generate the snippet at [https://gittygotchi.alpdogan.co](https://gittygotchi.alpdogan.co).

The whole image is clickable because the README wraps the SVG in a Markdown link. Do not rely on links inside the SVG.

## How it works

Everyone starts with an egg.

GitHub account history influences which class hatches.

Activity after adoption determines growth.

## Classes

- Earth
- Water
- Air
- Fire
- Psy

Earth, Water, Air, and Fire are equal normal classes. None of them is stronger than the others.

Class is assigned at adoption and does not change afterward.

## States

Gitty can look hungry, happy, excited, sleeping, resting, or hibernating. It never dies. Weekends are not punished. Long inactivity becomes hibernation, then Gitty wakes when activity returns.

## Privacy

No OAuth.

No PAT.

No GitHub login.

No access to private repository contents.

Only publicly exposed GitHub data is consumed.

GitHub contribution graphs may include anonymized private activity depending on the GitHub user's privacy settings.

## Architecture

```mermaid
flowchart TD
  readme[GitHub README] --> cache[Cloudflare Edge Cache]
  cache --> worker[GittyGotchi Worker]
  worker --> d1[D1]
  worker --> github[GitHub]
  d1 --> domain[Domain Engine]
  worker --> domain
  domain --> svg[SVG Renderer]
```

The Worker serves a polished landing page and share pages plus a cached preview Gitty SVG. The renderer can draw every growth stage and class; live pet state is not wired to HTTP yet.

## Looks

Everyone starts as an egg. Growth and class art is ready in the renderer.

<p align="center">
	<img src="docs/screenshots/stage-egg.svg" width="96" alt="Egg">
	<img src="docs/screenshots/stage-hatchling.svg" width="96" alt="Hatchling">
	<img src="docs/screenshots/stage-baby.svg" width="96" alt="Baby">
	<img src="docs/screenshots/stage-young.svg" width="96" alt="Young">
	<img src="docs/screenshots/stage-adult.svg" width="96" alt="Adult">
	<img src="docs/screenshots/stage-mature.svg" width="96" alt="Mature">
</p>

<p align="center">
	<img src="docs/screenshots/class-earth.svg" width="96" alt="Earth">
	<img src="docs/screenshots/class-water.svg" width="96" alt="Water">
	<img src="docs/screenshots/class-air.svg" width="96" alt="Air">
	<img src="docs/screenshots/class-fire.svg" width="96" alt="Fire">
	<img src="docs/screenshots/class-psy.svg" width="96" alt="Psy">
</p>

<p align="center">
	<img src="docs/screenshots/mood-sad.svg" width="96" alt="Sad">
	<img src="docs/screenshots/mood-grumpy.svg" width="96" alt="Grumpy">
	<img src="docs/screenshots/mood-neutral.svg" width="96" alt="Neutral">
	<img src="docs/screenshots/mood-happy.svg" width="96" alt="Happy">
	<img src="docs/screenshots/mood-excited.svg" width="96" alt="Excited">
</p>

<p align="center">
	<img src="docs/screenshots/hunger-full.svg" width="96" alt="Full">
	<img src="docs/screenshots/hunger-normal.svg" width="96" alt="Normal">
	<img src="docs/screenshots/hunger-hungry.svg" width="96" alt="Hungry">
	<img src="docs/screenshots/hunger-very_hungry.svg" width="96" alt="Very hungry">
</p>

<p align="center">
	<img src="docs/screenshots/behavior-idle.svg" width="96" alt="Idle">
	<img src="docs/screenshots/behavior-eating.svg" width="96" alt="Eating">
	<img src="docs/screenshots/behavior-playing.svg" width="96" alt="Playing">
	<img src="docs/screenshots/behavior-sleepy.svg" width="96" alt="Sleepy">
	<img src="docs/screenshots/behavior-sleeping.svg" width="96" alt="Sleeping">
	<img src="docs/screenshots/behavior-resting.svg" width="96" alt="Resting">
	<img src="docs/screenshots/behavior-hibernating.svg" width="96" alt="Hibernating">
</p>

GitHub fetching, the domain engine, and the D1 repository exist in the repo but are not wired to HTTP yet.

## Development

Prerequisites: Node 24 and pnpm 12.

```bash
corepack enable
corepack prepare pnpm@12.3.4 --activate
pnpm install
lefthook install
pnpm dev
```

`pnpm dev` starts Wrangler locally at `http://localhost:8787`.

## Testing

```bash
pnpm check
```

That runs format check, lint, typecheck, and tests. CI does not call live GitHub.

## Deployment

See [CONTRIBUTING.md](CONTRIBUTING.md) for D1, Wrangler, and production notes. CI never deploys. Production deploys only from protected `main` or a tagged release.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/GITHUB_RULESET.md](docs/GITHUB_RULESET.md).

## Security

See [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
