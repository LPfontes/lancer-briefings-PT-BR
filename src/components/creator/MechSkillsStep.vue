<template>
	<div class="creator-step">
		<h2>{{ $t('pilotCreator.steps.mechSkills') }}</h2>
		<p class="desc">{{ $t('pilotCreator.mechSkillsDesc') }}</p>
		
		<div class="mech-skills-grid">
			<div class="mech-skill-item">
				<div class="skill-name">{{ $t('pilotCreator.fields.hull') }}</div>
				<div class="skill-controls">
					<button @click="adjust(0, -1)" :disabled="getRank(0) <= 0" class="ctrl-btn">-</button>
					<span class="rank">+{{ getRank(0) }}</span>
					<button @click="adjust(0, 1)" :disabled="getRank(0) >= 6 || totalPoints >= maxPoints" class="ctrl-btn">+</button>
				</div>
			</div>
			
			<div class="mech-skill-item">
				<div class="skill-name">{{ $t('pilotCreator.fields.agility') }}</div>
				<div class="skill-controls">
					<button @click="adjust(1, -1)" :disabled="getRank(1) <= 0" class="ctrl-btn">-</button>
					<span class="rank">+{{ getRank(1) }}</span>
					<button @click="adjust(1, 1)" :disabled="getRank(1) >= 6 || totalPoints >= maxPoints" class="ctrl-btn">+</button>
				</div>
			</div>

			<div class="mech-skill-item">
				<div class="skill-name">{{ $t('pilotCreator.fields.systems') }}</div>
				<div class="skill-controls">
					<button @click="adjust(2, -1)" :disabled="getRank(2) <= 0" class="ctrl-btn">-</button>
					<span class="rank">+{{ getRank(2) }}</span>
					<button @click="adjust(2, 1)" :disabled="getRank(2) >= 6 || totalPoints >= maxPoints" class="ctrl-btn">+</button>
				</div>
			</div>

			<div class="mech-skill-item">
				<div class="skill-name">{{ $t('pilotCreator.fields.engineering') }}</div>
				<div class="skill-controls">
					<button @click="adjust(3, -1)" :disabled="getRank(3) <= 0" class="ctrl-btn">-</button>
					<span class="rank">+{{ getRank(3) }}</span>
					<button @click="adjust(3, 1)" :disabled="getRank(3) >= 6 || totalPoints >= maxPoints" class="ctrl-btn">+</button>
				</div>
			</div>
		</div>

		<div class="total-points" :class="{ 'at-limit': totalPoints === maxPoints }">
			{{ $t('pilotCreator.mechPointsDist') }}: {{ totalPoints }} / {{ maxPoints }}
		</div>
	</div>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";

export default {
	name: "MechSkillsStep",
	computed: {
		totalPoints() {
			return pilotStore.state.mech_skills.reduce((a, b) => a + b, 0);
		},
		maxPoints() {
			return 2 + pilotStore.state.level;
		}
	},
	methods: {
		getRank(index) {
			return pilotStore.state.mech_skills[index];
		},
		adjust(index, amount) {
			const current = this.getRank(index);
			let newRank = current + amount;
			if (newRank < 0) newRank = 0;
			pilotStore.updateMechSkill(index, newRank);
		}
	}
};
</script>

<style scoped>
.creator-step {
	display: flex;
	flex-direction: column;
	gap: 20px;
}



.desc {
	font-family: "Inconsolata", monospace;
	color: var(--text-location);
	font-size: 14px;
	margin-bottom: 15px;
}

.mech-skills-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;
}

.mech-skill-item {
	background: rgba(0, 0, 0, 0.4);
	border: 1px solid var(--primary-color);
	padding: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 15px;
}

.skill-name {
	font-family: "Big Shoulders Display", cursive;
	color: white;
	font-size: 22px;
	letter-spacing: 1px;
}

.skill-controls {
	display: flex;
	align-items: center;
	gap: 20px;
	background: var(--secondary-color);
	padding: 10px 20px;
	border: 1px solid var(--primary-color);
}

.skill-controls button {
	background: transparent;
	border: none;
	color: var(--primary-color);
	font-size: 24px;
	cursor: pointer;
	font-family: "Inconsolata", monospace;
}

.skill-controls button:disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

.rank {
	font-family: "Inconsolata", monospace;
	color: white;
	font-size: 24px;
	font-weight: bold;
	min-width: 40px;
	text-align: center;
}

.total-points {
	margin-top: 20px;
	font-family: "Oxanium", cursive;
	font-size: 18px;
	color: rgba(255, 255, 255, 0.6);
	text-align: center;
	padding: 15px;
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(255, 255, 255, 0.1);
	text-transform: uppercase;
	letter-spacing: 2px;
}

.total-points.at-limit {
	color: #f1a92a;
	border-color: rgba(241, 169, 42, 0.3);
	background: rgba(241, 169, 42, 0.05);
	text-shadow: 0 0 10px rgba(241, 169, 42, 0.3);
}

.ctrl-btn {
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 900 !important;
	border: 1px solid rgba(255, 255, 255, 0.1) !important;
	transition: all 0.2s;
}

.ctrl-btn:not(:disabled):hover {
	background: var(--primary-color) !important;
	color: white !important;
	border-color: var(--primary-color) !important;
}
</style>
