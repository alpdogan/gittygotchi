import { PRODUCTION_ORIGIN } from "@gittygotchi/config";
import { GITHUB_USERNAME_PATTERN } from "@gittygotchi/domain";

export function copyEnhancementScript(): string {
	return `<script>
(() => {
	const origin = ${JSON.stringify(PRODUCTION_ORIGIN)};
	const usernamePattern = ${GITHUB_USERNAME_PATTERN};

	function snippet(username) {
		return "[![GittyGotchi](" + origin + "/" + username + ".svg)](" + origin + "/" + username + ")";
	}

	function parseUsername(value) {
		const username = String(value || "").trim().toLowerCase();
		if (!username) {
			return { ok: false, empty: true };
		}
		if (!usernamePattern.test(username)) {
			return { ok: false, empty: false };
		}
		return { ok: true, username };
	}

	function bindForm(form) {
		const input = form.querySelector("[data-username-input]");
		const preview = form.querySelector("[data-gitty-preview]");
		const markdown = form.querySelector("[data-markdown]");
		const copyButton = form.querySelector("[data-copy]");
		const error = form.querySelector("[data-username-error]");
		if (!input || !markdown) {
			return;
		}

		const sync = () => {
			const parsed = parseUsername(input.value);
			if (parsed.ok) {
				markdown.value = snippet(parsed.username);
				input.setAttribute("aria-invalid", "false");
				if (error) {
					error.textContent = "";
				}
				if (preview) {
					preview.src = "/" + parsed.username + ".svg";
					preview.alt = "GittyGotchi for @" + parsed.username;
					preview.classList.remove("is-hidden");
				}
				return;
			}

			markdown.value = snippet("YOUR_USERNAME");
			if (preview) {
				preview.classList.add("is-hidden");
			}
			if (parsed.empty) {
				input.removeAttribute("aria-invalid");
				if (error) {
					error.textContent = "";
				}
				return;
			}
			input.setAttribute("aria-invalid", "true");
			if (error) {
				error.textContent = "Use 1–39 letters, numbers, or single hyphens. No leading, trailing, or doubled hyphens.";
			}
		};

		input.addEventListener("input", sync);
		sync();

		form.addEventListener("submit", (event) => {
			const parsed = parseUsername(input.value);
			if (!parsed.ok) {
				event.preventDefault();
				input.focus();
				sync();
				return;
			}
			event.preventDefault();
			window.location.assign("/" + parsed.username);
		});

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
