export async function readLimitedText(
	response: Response,
	maxBytes: number,
): Promise<string | undefined> {
	const contentLength = response.headers.get("content-length");
	if (contentLength !== null) {
		const length = Number(contentLength);
		if (Number.isFinite(length) && length > maxBytes) {
			return undefined;
		}
	}

	const reader = response.body?.getReader();
	if (!reader) {
		return "";
	}

	const decoder = new TextDecoder();
	let received = 0;
	let text = "";

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}

			received += value.byteLength;
			if (received > maxBytes) {
				await reader.cancel();
				return undefined;
			}

			text += decoder.decode(value, { stream: true });
		}

		text += decoder.decode();
		return text;
	} catch {
		return undefined;
	}
}

export function timeoutSignal(timeoutMs: number): AbortSignal {
	return AbortSignal.timeout(timeoutMs);
}
