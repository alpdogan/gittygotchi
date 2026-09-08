import { EXAMPLE_USERNAME, PRODUCTION_ORIGIN } from "@gittygotchi/config";

export function copyEnhancementScript(): string {
	return `<script>
(() => {
	const origin = ${JSON.stringify(PRODUCTION_ORIGIN)};
	const example = ${JSON.stringify(EXAMPLE_USERNAME)};

	function snippet(username) {
		return "[![GittyGotchi](" + origin + "/" + username + ".svg)](" + origin + "/" + username + ")";
	}

	function bindForm(form) {
		const input = form.querySelector("[data-username-input]");
		const preview = form.querySelector("[data-gitty-preview]");
		const markdown = form.querySelector("[data-markdown]");
		const copyButton = form.querySelector("[data-copy]");
		if (!input || !markdown) {
			return;
		}

		const sync = () => {
			const username = String(input.value || example).trim().toLowerCase() || example;
			markdown.value = snippet(username);
			if (preview) {
				preview.src = "/" + username + ".svg";
				preview.alt = "GittyGotchi for @" + username;
			}
		};

		input.addEventListener("input", sync);
		sync();

		if (copyButton) {
			copyButton.addEventListener("click", async () => {
				markdown.focus();
				markdown.select();
				try {
					await navigator.clipboard.writeText(markdown.value);
					copyButton.textContent = "Copied";
					window.setTimeout(() => {
						copyButton.textContent = "Copy Markdown";
					}, 1600);
				} catch {
					copyButton.textContent = "Select and copy";
				}
			});
		}
	}

	for (const form of document.querySelectorAll("[data-gitty-form]")) {
		bindForm(form);
	}
})();
</script>`;
}
