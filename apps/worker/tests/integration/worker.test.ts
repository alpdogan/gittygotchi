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
	});

	it("serves health JSON", async () => {
		const response = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/health"));
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ ok: true, service: "gittygotchi" });
	});

	it("serves robots.txt", async () => {
		const response = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/robots.txt"));
		expect(response.status).toBe(200);
		expect(await response.text()).toContain("User-agent: *");
	});

	it("serves a personal Gitty page", async () => {
		const response = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/alpdogan"));
		const html = await response.text();
		expect(response.status).toBe(200);
		expect(html).toContain("@alpdogan's Gitty");
		expect(html).toContain(readmeSnippet("alpdogan"));
		expect(html).toContain("Want your own Gitty?");
		expect(html).toContain("View @alpdogan on GitHub");
	});

	it("serves a foundation Gitty SVG for a valid username", async () => {
		const response = await worker.fetch(
			new Request("https://gittygotchi.alpdogan.co/alpdogan.svg"),
		);
		const svg = await response.text();
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("image/svg+xml");
		expect(svg).toContain("<svg");
		expect(svg).toContain('data-gitty-stage="egg"');
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

	it("returns an error SVG for an invalid username image request", async () => {
		const response = await worker.fetch(
			new Request("https://gittygotchi.alpdogan.co/not_a_user.svg"),
		);
		const svg = await response.text();
		expect(response.status).toBe(400);
		expect(response.headers.get("content-type")).toContain("image/svg+xml");
		expect(svg).toContain("Gitty is hiding.");
		expect(svg.startsWith("{")).toBe(false);
		expect(response.headers.get("cache-control")).toBe("public, max-age=600");
	});

	it("rejects invalid username pages", async () => {
		const response = await worker.fetch(new Request("https://gittygotchi.alpdogan.co/-bad"));
		expect(response.status).toBe(400);
		expect(await response.text()).toContain("Gitty is hiding.");
	});

	it("rejects nested paths", async () => {
		const response = await worker.fetch(
			new Request("https://gittygotchi.alpdogan.co/alpdogan/extra"),
		);
		expect(response.status).toBe(404);
	});
});
