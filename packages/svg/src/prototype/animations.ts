export const PROTOTYPE_ANIMATIONS = `
	.gitty-character {
		animation: gitty-breathe 3.8s ease-in-out infinite;
		transform-box: fill-box;
		transform-origin: 50% 100%;
	}
	.gitty-tail {
		animation: tail-idle 4.2s ease-in-out infinite;
		transform-box: fill-box;
		transform-origin: 80% 80%;
	}
	.gitty-eyes {
		animation: gitty-blink 5.6s ease-in-out infinite;
		transform-box: fill-box;
		transform-origin: center;
	}
	.stage-hatchling .gitty-ears, .stage-baby .gitty-ears {
		transform: scale(1.1);
		transform-box: fill-box;
		transform-origin: 50% 100%;
	}
	.stage-mature .gitty-tail {
		transform: scale(1.04);
		transform-box: fill-box;
		transform-origin: 85% 85%;
	}
	.behavior-sleeping .gitty-anatomy, .behavior-hibernating .gitty-anatomy {
		transform-origin: 50% 100%;
	}
	.food-bowl { animation: food-bowl-nudge 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
	.play-ball { animation: play-ball-bounce 1.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
	.sleep-zzz, .sleep-particle { animation: sleep-float 3s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
	.sleep-particle-2 { animation-delay: -1.4s; animation-duration: 3.8s; }
	@keyframes gitty-breathe {
		0%, 100% { transform: translateY(0) scaleY(1); }
		50% { transform: translateY(-1px) scaleY(1.012); }
	}
	@keyframes gitty-blink {
		0%, 44%, 48%, 100% { transform: scaleY(1); }
		46% { transform: scaleY(.08); }
	}
	@keyframes tail-idle {
		0%, 100% { transform: rotate(-1deg); }
		50% { transform: rotate(3deg); }
	}
	@keyframes food-bowl-nudge {
		0%, 70%, 100% { transform: translateX(0); }
		82% { transform: translateX(-2px); }
	}
	@keyframes play-ball-bounce {
		0%, 100% { transform: translateY(0) rotate(-4deg); }
		50% { transform: translateY(-7px) rotate(9deg); }
	}
	@keyframes sleep-float {
		0%, 100% { opacity: .35; transform: translateY(3px); }
		50% { opacity: .9; transform: translateY(-5px); }
	}
	@media (prefers-reduced-motion: reduce) {
		.gitty-character, .gitty-tail, .gitty-eyes,
		.earth-leaf, .water-bubble, .water-drop,
		.air-wind, .air-spark, .fire-flame, .fire-ember,
		.psy-particle, .psy-character, .psy-shadow,
		.food-bowl, .play-ball, .sleep-zzz, .sleep-particle {
			animation: none !important;
		}
	}`;
