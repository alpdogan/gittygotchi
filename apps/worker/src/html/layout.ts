import { GITHUB_REPO_URL, PRODUCTION_ORIGIN } from "@gittygotchi/config";
import { copyEnhancementScript } from "./copy-script.ts";
import { escapeHtml } from "./escape.ts";
import { jsonLdScript } from "./json-ld.ts";
import { PAGE_STYLES } from "./styles.ts";

export type PageOptions = {
	title: string;
	description: string;
	body: string;
	canonicalPath: string;
	ogImagePath?: string;
	indexable?: boolean;
	jsonLd?: unknown;
};

export function renderPage(options: PageOptions): string {
	const title = escapeHtml(options.title);
	const description = escapeHtml(options.description);
	const canonical = `${PRODUCTION_ORIGIN}${options.canonicalPath}`;
	const ogImagePath = options.ogImagePath ?? "/favicon.svg";
	const ogImageUrl = `${PRODUCTION_ORIGIN}${ogImagePath}`;
	const twitterCard = options.ogImagePath === undefined ? "summary" : "summary_large_image";
	const robots = options.indexable === false ? "noindex, nofollow" : "index, follow";
	const jsonLd = options.jsonLd === undefined ? "" : jsonLdScript(options.jsonLd);

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${title}</title>
	<meta name="description" content="${description}">
	<meta name="robots" content="${robots}">
	<meta name="theme-color" content="#f3ead7">
	<link rel="canonical" href="${escapeHtml(canonical)}">
	<link rel="icon" href="/favicon.svg" type="image/svg+xml">
	<link rel="icon" href="/favicon.ico">
	<link rel="apple-touch-icon" href="/apple-touch-icon.png">
	<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM information">
	<meta property="og:site_name" content="GittyGotchi">
	<meta property="og:locale" content="en_US">
	<meta property="og:title" content="${title}">
	<meta property="og:description" content="${description}">
	<meta property="og:url" content="${escapeHtml(canonical)}">
	<meta property="og:type" content="website">
	<meta property="og:image" content="${escapeHtml(ogImageUrl)}">
	<meta name="twitter:card" content="${twitterCard}">
	<meta name="twitter:title" content="${title}">
	<meta name="twitter:description" content="${description}">
	<meta name="twitter:image" content="${escapeHtml(ogImageUrl)}">
	<style>${PAGE_STYLES}</style>
	${jsonLd}
</head>
<body>
	<a class="skip" href="#content">Skip to content</a>
	<header class="site-header">
		<a class="wordmark" href="/">GittyGotchi</a>
		<nav class="site-nav" aria-label="Site">
			<a href="/#own">Get yours</a>
			<a href="${GITHUB_REPO_URL}">GitHub</a>
		</nav>
	</header>
	<main id="content">
		${options.body}
	</main>
	<footer class="site-footer">
		<p>GittyGotchi is open source at <a href="${GITHUB_REPO_URL}">${escapeHtml(GITHUB_REPO_URL)}</a>.</p>
		<p>No login. No token. Just add your Gitty.</p>
	</footer>
	${copyEnhancementScript()}
</body>
</html>`;
}
