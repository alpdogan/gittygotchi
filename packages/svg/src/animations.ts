export const GITTY_STYLE = `<style>
	.gitty-idle { animation: gitty-bob 2.6s ease-in-out infinite; }
	.gitty-playing { animation: gitty-bob 1.1s ease-in-out infinite; }
	.gitty-eating { animation: gitty-bob 1.8s ease-in-out infinite; }
	.gitty-resting { animation: gitty-bob 4s ease-in-out infinite; }
	.gitty-sleepy { animation: gitty-bob 3.4s ease-in-out infinite; }
	.gitty-sleeping, .gitty-hibernating { animation: gitty-breathe 4.8s ease-in-out infinite; }
	.gitty-bubble { animation: gitty-rise 3s ease-in-out infinite; }
	.gitty-flame { animation: gitty-flicker 0.9s ease-in-out infinite; }
	.gitty-spark { animation: gitty-flicker 1.2s ease-in-out infinite; }
	.gitty-psy { animation: gitty-float 2.8s ease-in-out infinite; }
	.gitty-zzz { animation: gitty-fade 2.2s ease-in-out infinite; }
	@keyframes gitty-bob {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-4px); }
	}
	@keyframes gitty-breathe {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.015); }
	}
	@keyframes gitty-rise {
		0%, 100% { opacity: 0.35; transform: translateY(0); }
		50% { opacity: 0.9; transform: translateY(-8px); }
	}
	@keyframes gitty-flicker {
		0%, 100% { opacity: 0.65; }
		50% { opacity: 1; }
	}
	@keyframes gitty-float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-6px); }
	}
	@keyframes gitty-fade {
		0%, 100% { opacity: 0.25; }
		50% { opacity: 0.8; }
	}
	@media (prefers-reduced-motion: reduce) {
		.gitty-idle, .gitty-playing, .gitty-eating, .gitty-resting, .gitty-sleepy,
		.gitty-sleeping, .gitty-hibernating, .gitty-bubble, .gitty-flame, .gitty-spark,
		.gitty-psy, .gitty-zzz { animation: none; }
	}
</style>`;
