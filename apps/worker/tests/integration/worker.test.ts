import { exports } from "cloudflare:workers";
import { EXAMPLE_USERNAME, readmeSnippet } from "@gittygotchi/config";
import { describe, expect, it } from "vitest";

const worker = exports.default;

describe("GittyGotchi worker", () => {
	it("serves the landing page with the clickable README snippet", async () => {
		const response = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/"));
		const html = await response.text();
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("text/html");
		expect(html).toContain("GittyGotchi");
		expect(html).toContain("A tiny creature that lives on your GitHub profile.");
		expect(html).toContain(readmeSnippet(EXAMPLE_USERNAME));
		expect(html).toContain("[![GittyGotchi](https://gittygotchi.alpdogan.co/YOUR_USERNAME.svg)]");
		expect(html).toContain('href="#own"');
		expect(html).toContain("Copy Markdown");
		expect(html).toContain("Open Gitty page");
		expect(html).toContain('property="og:image"');
		expect(html).toContain('rel="icon" href="/favicon.svg"');
		expect(html).toContain('type="application/ld+json"');
		expect(html).toContain('"@type":"WebApplication"');
		expect(html).toContain('"isAccessibleForFree":true');
		expect(html).toContain('name="robots" content="index, follow"');
		expect(html).not.toContain("Psy is rare");
		expect(html).toContain("overflow-wrap: anywhere");
		expect(html).toContain("word-break: break-all");
		expect(html).toContain("Everyone starts as an egg. The first visit creates a Gitty");
		expect(html).not.toContain("preview shows an adult Gitty");
		expect(html).not.toContain("Preview adult");
	});

	it("prefills the landing generator from a username query", async () => {
		const valid = await worker.fetch(
			new Request("https://gittygotchi.alpdogan.co/?username=OctoCat"),
		);
		const validHtml = await valid.text();
		expect(validHtml).toContain('value="octocat"');
		expect(validHtml).toContain("https://gittygotchi.alpdogan.co/octocat.svg");

		const invalid = await worker.fetch(
			new Request("https://gittygotchi.alpdogan.co/?username=-bad"),
		);
		const invalidHtml = await invalid.text();
		expect(invalidHtml).toContain('aria-invalid="true"');
		expect(invalidHtml).toContain("No leading, trailing, or doubled hyphens.");
	});

	it("serves health JSON", async () => {
		const response = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/health"));
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ ok: true, service: "gittygotchi" });
	});

	it("serves robots.txt that allows HTML and SVG images", async () => {
		const response = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/robots.txt"));
		const body = await response.text();
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("text/plain");
		expect(body).toContain("User-agent: *");
		expect(body).toContain("Allow: /");
		expect(body).toContain("Allow: /*.svg");
		expect(body).toContain("Sitemap: https://gittygotchi.alpdogan.co/sitemap.xml");
		expect(body).toContain("Disallow: /health");
		expect(body).not.toMatch(/^Disallow: \/$/m);
		expect(body).not.toContain("Disallow: /*.svg");
	});

	it("serves a small sitemap for the landing and example Gitty", async () => {
		const response = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/sitemap.xml"));
		const body = await response.text();
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("application/xml");
		expect(body).toContain("https://gittygotchi.alpdogan.co/");
		expect(body).toContain("https://gittygotchi.alpdogan.co/alpdogan");
		expect(body).not.toContain("YOUR_USERNAME");
	});

	it("serves llms.txt and the llm.txt alias", async () => {
		const llms = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/llms.txt"));
		const alias = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/llm.txt"));
		const body = await llms.text();
		expect(llms.status).toBe(200);
		expect(alias.status).toBe(200);
		expect(await alias.text()).toBe(body);
		expect(body).toContain("# GittyGotchi");
		expect(body).toContain("https://gittygotchi.alpdogan.co");
		expect(body).toContain("YOUR_USERNAME.svg");
		expect(body).toContain("No login");
		expect(body).toContain("does not read private repository contents");
		expect(body).toContain("first visit");
	});

	it("serves favicon routes as egg SVG", async () => {
		for (const path of ["/favicon.svg", "/favicon.ico", "/apple-touch-icon.png"]) {
			const response = await worker.fetch(new Request(`https://gittygotchi.alpdogan.co${path}`));
			const svg = await response.text();
			expect(response.status).toBe(200);
			expect(response.headers.get("content-type")).toContain("image/svg+xml");
			expect(svg).toContain("<svg");
			expect(svg).toContain('data-gitty-favicon="egg"');
			expect(svg).toContain('data-prototype-stage="egg"');
			expect(svg.startsWith("{")).toBe(false);
		}
	});

	it("serves a personal Gitty page", async () => {
		const response = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/alpdogan"));
		const html = await response.text();
		expect(response.status).toBe(200);
		expect(html).toContain("@alpdogan's Gitty");
		expect(html).toContain(readmeSnippet("alpdogan"));
		expect(html).toContain("Want your own Gitty?");
		expect(html).toContain("View @alpdogan on GitHub");
		expect(html).toContain("Star GittyGotchi on GitHub");
		expect(html).toContain("Get my Gitty");
		expect(html).not.toContain("Preview adult");
		expect(html).toContain("<dt>Class</dt>");
		expect(html).toContain("<dd>Hidden</dd>");
		expect(html).toContain("<dt>Stage</dt>");
		expect(html).toContain("<dd>Egg</dd>");
		expect(html).not.toContain("<dt>Hunger</dt>");
		expect(html).not.toContain("<dt>Mood</dt>");
		expect(html).not.toContain("<dt>Sleep</dt>");
		expect(html).not.toContain("<dd>Unrevealed</dd>");
		expect(html).not.toContain("Coming soon");
		expect(html).toContain('class="gitty-status"');
		expect(html).toContain("width: min(100%, 240px)");
		expect(html).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))");
		expect(html).toContain("growth starts after adoption");
		expect(html).toContain('content="https://gittygotchi.alpdogan.co/alpdogan.svg"');
	});

	it("serves a live egg SVG for a valid username", async () => {
		const response = await worker.fetch(
			new Request("https://gittygotchi.alpdogan.co/alpdogan.svg"),
		);
		const svg = await response.text();
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("image/svg+xml");
		expect(svg).toContain("<svg");
		expect(svg).toContain('data-gitty-stage="egg"');
		expect(svg).toContain('data-gitty-body="egg"');
		expect(svg).toContain('data-prototype-stage="egg"');
		expect(svg).toContain('data-prototype-class="unrevealed"');
		expect(svg).toContain("stage-egg");
		expect(svg).not.toContain("earth-leaf");
		expect(svg).not.toContain("A preview adult Gitty");
		expect(svg).not.toContain("gitty-status-labels");
		expect(svg).not.toContain(">Hunger<");
		expect(svg).not.toContain(">Mood<");
		expect(svg).not.toContain(">Sleep<");
		expect(svg).toContain("@alpdogan");
		expect(response.headers.get("cache-control")).toBe("public, max-age=600");
	});

	it("canonicalizes SVG query strings onto the same pet path", async () => {
		const response = await worker.fetch(
			new Request("https://gittygotchi.alpdogan.co/alpdogan.svg?utm=readme"),
		);
		expect(response.status).toBe(200);
		expect(await response.text()).toContain('data-gitty-stage="egg"');
		expect(response.headers.get("cache-control")).toBe("public, max-age=600");
	});

	it("does not cache HTML or health responses", async () => {
		const landing = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/"));
		const health = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/health"));
		expect(landing.headers.get("cache-control")).toBe("no-store");
		expect(health.headers.get("cache-control")).toBe("no-store");
	});

	it("returns a 200 prototype egg for an invalid username image request", async () => {
		const response = await worker.fetch(
			new Request("https://gittygotchi.alpdogan.co/YOUR_USERNAME.svg"),
		);
		const svg = await response.text();
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("image/svg+xml");
		expect(svg).toContain("<svg");
		expect(svg).toContain('data-gitty-stage="egg"');
		expect(svg).toContain('data-gitty-body="egg"');
		expect(svg).toContain('data-prototype-stage="egg"');
		expect(svg).toContain("stage-egg");
		expect(svg).not.toContain("Gitty is hiding.");
		expect(svg.startsWith("{")).toBe(false);
		expect(svg.includes("<html")).toBe(false);
		expect(response.headers.get("cache-control")).toBe("public, max-age=600");
	});

	it("rejects invalid username pages", async () => {
		const response = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/-bad"));
		const html = await response.text();
		expect(response.status).toBe(400);
		expect(html).toContain("Gitty is hiding.");
		expect(html).toContain("Invalid username · GittyGotchi");
		expect(html).toContain('name="robots" content="noindex, nofollow"');
	});

	it("rejects nested paths", async () => {
		const response = await worker.fetch(
			new Request("https://gittygotchi.alpdogan.co/alpdogan/extra"),
		);
		expect(response.status).toBe(404);
	});
});
