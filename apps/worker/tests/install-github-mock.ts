import { afterEach, beforeEach } from "vitest";
import { setGithubFetchForTests, setNowForTests } from "../src/pet/runtime.ts";
import { mockGithubFetch } from "./integration/github-mock.ts";

beforeEach(() => {
	setGithubFetchForTests(mockGithubFetch());
	setNowForTests(() => new Date("2026-09-08T12:00:00.000Z"));
});

afterEach(() => {
	setGithubFetchForTests(undefined);
	setNowForTests(undefined);
});
