export const GITTY_STYLE = `<style>
	.gitty-idle { animation: gitty-bob 2.6s ease-in-out infinite; }
	.gitty-playing { animation: gitty-play 0.7s ease-in-out infinite; }
	.gitty-eating { animation: gitty-nibble 0.55s ease-in-out infinite; }
	.gitty-resting { animation: gitty-bob 4s ease-in-out infinite; }
	.gitty-sleepy { animation: gitty-bob 3.4s ease-in-out infinite; }
	.gitty-sleeping, .gitty-hibernating { animation: gitty-breathe 4.8s ease-in-out infinite; }
	.gitty-playing .gitty-tail { animation: gitty-wag 0.8s ease-in-out infinite; }
	.gitty-idle .gitty-ear, .gitty-playing .gitty-ear { animation: gitty-ear 2.8s ease-in-out infinite; }
	.gitty-bubble { animation: gitty-rise 3s ease-in-out infinite; }
	.gitty-flame { animation: gitty-flicker 0.9s ease-in-out infinite; }
	.gitty-spark { animation: gitty-flicker 1.2s ease-in-out infinite; }
	.gitty-psy { animation: gitty-float 2.8s ease-in-out infinite; }
	.gitty-zzz { animation: gitty-fade 2.2s ease-in-out infinite; }
	.gitty-orbit { animation: gitty-spin 6s linear infinite; }
	.gitty-shadow-idle { animation: gitty-shadow-bob 2.6s ease-in-out infinite; }
	.gitty-shadow-playing { animation: gitty-shadow-play 0.7s ease-in-out infinite; }
	.gitty-shadow-eating { animation: gitty-shadow-nibble 0.55s ease-in-out infinite; }
	.gitty-shadow-resting { animation: gitty-shadow-bob 4s ease-in-out infinite; }
	.gitty-shadow-sleepy { animation: gitty-shadow-bob 3.4s ease-in-out infinite; }
	.gitty-shadow-sleeping, .gitty-shadow-hibernating { animation: gitty-shadow-breathe 4.8s ease-in-out infinite; }
	@keyframes gitty-bob {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-4px); }
	}
	@keyframes gitty-play {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		30% { transform: translateY(-6px) rotate(-5deg); }
		70% { transform: translateY(-2px) rotate(5deg); }
	}
	@keyframes gitty-nibble {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(2px); }
	}
	@keyframes gitty-breathe {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.018); }
	}
	@keyframes gitty-wag {
		0%, 100% { transform: rotate(0deg); }
		50% { transform: rotate(16deg); }
	}
	@keyframes gitty-ear {
		0%, 78%, 100% { transform: rotate(0deg); }
		88% { transform: rotate(-9deg); }
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
	@keyframes gitty-spin {
		to { transform: rotate(360deg); }
	}
	@keyframes gitty-shadow-bob {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(0.72); }
	}
	@keyframes gitty-shadow-play {
		0%, 100% { transform: scale(1); }
		30% { transform: scale(0.58); }
		70% { transform: scale(0.82); }
	}
	@keyframes gitty-shadow-nibble {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.12); }
	}
	@keyframes gitty-shadow-breathe {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}
	@media (max-width: 96px) {
		.gitty-detail { display: none; }
	}
	@media (prefers-reduced-motion: reduce) {
		.gitty-idle, .gitty-playing, .gitty-eating, .gitty-resting, .gitty-sleepy,
		.gitty-sleeping, .gitty-hibernating, .gitty-bubble, .gitty-flame, .gitty-spark,
		.gitty-psy, .gitty-zzz, .gitty-orbit, .gitty-playing .gitty-tail,
		.gitty-idle .gitty-ear, .gitty-playing .gitty-ear,
		.gitty-shadow-idle, .gitty-shadow-playing, .gitty-shadow-eating, .gitty-shadow-resting,
		.gitty-shadow-sleepy, .gitty-shadow-sleeping, .gitty-shadow-hibernating { animation: none; }
	}
</style>`;
