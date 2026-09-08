import { GITHUB_REPO_URL, PRODUCTION_ORIGIN } from "@gittygotchi/config";
import { copyEnhancementScript } from "./copy-script.ts";
import { escapeHtml } from "./escape.ts";
import { PAGE_STYLES } from "./styles.ts";

export type PageOptions = {
	title: string;
	description: string;
	body: string;
	canonicalPath: string;
	ogImagePath?: string;
};

export function renderPage(options: PageOptions): string {
	const title = escapeHtml(options.title);
	const description = escapeHtml(options.description);
	const canonical = `${PRODUCTION_ORIGIN}${options.canonicalPath}`;
	const ogImage = options.ogImagePath
		? `<meta property="og:image" content="${escapeHtml(PRODUCTION_ORIGIN + options.ogImagePath)}">`
		: "";

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${title}</title>
	<meta name="description" content="${description}">
	<meta name="theme-color" content="#f3ead7">
	<link rel="canonical" href="${escapeHtml(canonical)}">
	<meta property="og:title" content="${title}">
	<meta property="og:description" content="${description}">
	<meta property="og:url" content="${escapeHtml(canonical)}">
	<meta property="og:type" content="website">
	${ogImage}
	<meta name="twitter:card" content="${options.ogImagePath ? "summary_large_image" : "summary"}">
	<style>${PAGE_STYLES}</style>
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
