import type { ContributionDay, ContributionLevel } from "@gittygotchi/domain";
import { isContributionLevel, isIsoCalendarDate } from "@gittygotchi/domain";
import type { GitHubResult } from "./errors.ts";

const OPEN_TAG = /<[a-z][a-z0-9-]*\b[^>]*>/gi;
const QUOTED_DATE = /\bdata-date\s*=\s*(["'])([^"']+)\1/i;
const UNQUOTED_DATE = /\bdata-date\s*=\s*([^\s>"']+)/i;
const QUOTED_LEVEL = /\bdata-level\s*=\s*(["'])([^"']+)\1/i;
const UNQUOTED_LEVEL = /\bdata-level\s*=\s*([^\s>"']+)/i;

function attributeValue(
	tag: string,
	quoted: RegExp,
	unquoted: RegExp,
	quotedGroup: number,
	unquotedGroup: number,
): string | undefined {
	const quotedMatch = quoted.exec(tag);
	if (quotedMatch) {
		return quotedMatch[quotedGroup];
	}

	const unquotedMatch = unquoted.exec(tag);
	return unquotedMatch?.[unquotedGroup];
}

function parseLevel(raw: string): ContributionLevel | undefined {
	if (!/^\d+$/.test(raw)) {
		return undefined;
	}

	const level = Number(raw);
	return isContributionLevel(level) ? level : undefined;
}

export function parseContributionHtml(html: string): GitHubResult<ContributionDay[]> {
	const days: ContributionDay[] = [];
	const seen = new Set<string>();

	for (const tagMatch of html.matchAll(OPEN_TAG)) {
		const tag = tagMatch[0];
		if (tag === undefined) {
			continue;
		}

		const date = attributeValue(tag, QUOTED_DATE, UNQUOTED_DATE, 2, 1);
		const rawLevel = attributeValue(tag, QUOTED_LEVEL, UNQUOTED_LEVEL, 2, 1);
		if (date === undefined || rawLevel === undefined) {
			continue;
		}

		if (!isIsoCalendarDate(date)) {
			continue;
		}

		const level = parseLevel(rawLevel);
		if (level === undefined) {
			continue;
		}

		if (seen.has(date)) {
			continue;
		}

		seen.add(date);
		days.push({ date, level });
	}

	if (days.length === 0) {
		return { ok: false, error: { type: "contribution_parse_failed" } };
	}

	return { ok: true, value: days };
}
