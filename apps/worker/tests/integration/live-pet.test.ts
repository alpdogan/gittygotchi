import { env, exports } from "cloudflare:workers";
import { assignGittyClass } from "@gittygotchi/domain";
import { describe, expect, it } from "vitest";
import { resolveLivePet } from "../../src/pet/resolve.ts";
import { createPetRuntime, setGithubFetchForTests } from "../../src/pet/runtime.ts";
import { createD1PetRepository } from "../../src/storage/d1-pet-repository.ts";
import { MOCK_GITHUB_CREATED_AT, mockGithubFetch } from "./github-mock.ts";

const worker = exports.default;
const now = new Date("2026-09-08T12:00:00.000Z");

function repository() {
	return createD1PetRepository(env.DB);
}

describe("live pet HTTP wiring", () => {
	it("adopts on the first SVG request and inserts a D1 egg from GitHub created_at", async () => {
		const response = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/octocat.svg"));
		const svg = await response.text();
		const pet = await repository().getByUsername("octocat");
		const expectedClass = (
			await assignGittyClass({
				username: "octocat",
				githubCreatedAt: MOCK_GITHUB_CREATED_AT,
				now: pet === undefined ? now : new Date(pet.bornAt),
			})
		).gittyClass;

		expect(response.status).toBe(200);
		expect(pet).toBeDefined();
		if (pet === undefined) {
			return;
		}
		expect(pet.githubCreatedAt).toBe(MOCK_GITHUB_CREATED_AT);
		expect(pet.bornAt).toBe(pet.createdAt);
		expect(pet.growthStage).toBe("egg");
		expect(pet.gittyClass).toBe(expectedClass);
		expect(svg).toContain('data-gitty-stage="egg"');
		expect(svg).toContain('data-prototype-class="unrevealed"');
		expect(svg).toContain('data-gitty-class="');
		expect(svg).not.toContain("A preview adult Gitty");
		expect(svg).not.toContain(">Hunger<");
		expect(svg).not.toContain(">Mood<");
	});

	it("adopts on the first HTML visit and shows egg facts from stored state", async () => {
		const response = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/hubot"));
		const html = await response.text();
		const pet = await repository().getByUsername("hubot");

		expect(response.status).toBe(200);
		expect(pet?.growthStage).toBe("egg");
		expect(html).toContain("<dt>Class</dt>");
		expect(html).toContain("<dd>Hidden</dd>");
		expect(html).toContain("<dt>Stage</dt>");
		expect(html).toContain("<dd>Egg</dd>");
		expect(html).not.toContain("<dt>Hunger</dt>");
		expect(html).not.toContain("<dt>Mood</dt>");
		expect(html).not.toContain("Preview adult");
		expect(html).not.toContain("Coming soon");
	});

	it("grows a stored pet from contributions and renders that SVG", async () => {
		const bornAt = "2026-09-05T00:00:00.000Z";
		const assignment = await assignGittyClass({
			username: "monalisa",
			githubCreatedAt: "2015-01-01T00:00:00.000Z",
			now: new Date(bornAt),
		});
		await repository().create({
			username: "monalisa",
			githubCreatedAt: "2015-01-01T00:00:00.000Z",
			bornAt,
			gittyClass: assignment.gittyClass,
			classAlgorithmVersion: assignment.algorithmVersion,
			createdAt: bornAt,
		});

		const response = await worker.fetch(
			new Request("https://gittygotchi.alpdogan.co/monalisa.svg"),
		);
		const svg = await response.text();
		const pet = await repository().getByUsername("monalisa");

		expect(response.status).toBe(200);
		expect(pet?.growthStage).toBe("hatchling");
		expect(pet?.activeDays).toBe(3);
		expect(pet?.gittyClass).toBe(assignment.gittyClass);
		expect(svg).toContain('data-gitty-stage="hatchling"');
		expect(svg).toContain(`data-gitty-class="${assignment.gittyClass}"`);
		expect(svg).not.toContain('data-prototype-class="unrevealed"');
	});

	it("returns the GitHub 404 SVG and page when the user is missing", async () => {
		setGithubFetchForTests(
			mockGithubFetch({
				users: { missinguser: "missing" },
				contributions: { missinguser: "missing" },
			}),
		);

		const svgResponse = await worker.fetch(
			new Request("https://gittygotchi.alpdogan.co/missinguser.svg"),
		);
		const pageResponse = await worker.fetch(
			new Request("https://gittygotchi.alpdogan.co/missinguser"),
		);

		expect(svgResponse.status).toBe(404);
		expect(await svgResponse.text()).toContain("GitHub user not found.");
		expect(svgResponse.headers.get("cache-control")).toBe("public, max-age=60");
		expect(pageResponse.status).toBe(404);
		expect(await pageResponse.text()).toContain("GitHub user not found.");
		expect(await repository().getByUsername("missinguser")).toBeUndefined();
	});

	it("renders a preview egg instead of the hiding face when GitHub is down and no pet is stored", async () => {
		setGithubFetchForTests(mockGithubFetch({ users: { ghost: "down" } }));

		const svgResponse = await worker.fetch(
			new Request("https://gittygotchi.alpdogan.co/ghost.svg"),
		);
		const pageResponse = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/ghost"));
		const svg = await svgResponse.text();
		const html = await pageResponse.text();

		expect(svgResponse.status).toBe(200);
		expect(svg).toContain('data-gitty-stage="egg"');
		expect(svg).toContain("@ghost");
		expect(svg).not.toContain("Gitty is hiding.");
		expect(svgResponse.headers.get("cache-control")).toBe("no-store");
		expect(pageResponse.status).toBe(200);
		expect(html).toContain("<dd>Egg</dd>");
		expect(html).not.toContain("Gitty is hiding.");
		expect(await repository().getByUsername("ghost")).toBeUndefined();
	});

	it("serves stored state when GitHub fails after adoption", async () => {
		const assignment = await assignGittyClass({
			username: "defunkt",
			githubCreatedAt: MOCK_GITHUB_CREATED_AT,
			now,
		});
		const createdAt = now.toISOString();
		await repository().create({
			username: "defunkt",
			githubCreatedAt: MOCK_GITHUB_CREATED_AT,
			bornAt: createdAt,
			gittyClass: assignment.gittyClass,
			classAlgorithmVersion: assignment.algorithmVersion,
			createdAt,
		});

		setGithubFetchForTests(
			mockGithubFetch({
				users: { defunkt: "down" },
				contributions: { defunkt: "down" },
			}),
		);

		const response = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/defunkt.svg"));
		const svg = await response.text();
		expect(response.status).toBe(200);
		expect(svg).toContain('data-gitty-stage="egg"');
		expect(svg).toContain(`data-gitty-class="${assignment.gittyClass}"`);
		expect(svg).toContain('data-prototype-class="unrevealed"');
	});
});

describe("resolveLivePet", () => {
	it("inserts once, then skips GitHub while contributions are fresh", async () => {
		const fetch = mockGithubFetch();
		let userCalls = 0;
		let contributionCalls = 0;
		const countingFetch: typeof fetch = async (url, init) => {
			if (url.includes("/contributions")) {
				contributionCalls += 1;
			} else {
				userCalls += 1;
			}
			return fetch(url, init);
		};
		const runtime = createPetRuntime(env, { fetch: countingFetch, now: () => now });

		const first = await resolveLivePet({
			...runtime,
			username: "alp",
			now,
		});
		const second = await resolveLivePet({
			...createPetRuntime(env, { fetch: countingFetch, now: () => now }),
			username: "alp",
			now,
		});

		expect(first.ok && first.created).toBe(true);
		expect(second.ok && second.created).toBe(false);
		expect(userCalls).toBe(1);
		expect(contributionCalls).toBe(1);
		if (!first.ok || !second.ok) {
			return;
		}
		expect(first.pet.id).toBe(second.pet.id);
		expect(first.view.growthStage).toBe("egg");
		expect(second.view.growthStage).toBe("egg");
	});
});
