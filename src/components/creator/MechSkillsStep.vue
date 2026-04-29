<template>
	<div class="creator-step">
		<h2>{{ $t('pilotCreator.steps.mechSkills') }}</h2>
		<p class="desc">{{ $t('pilotCreator.mechSkillsDesc') }}</p>
		
		<div class="mech-skills-grid">
			<div class="mech-skill-item">
				<div class="skill-name">{{ $t('pilotCreator.fields.hull') }}</div>
				<div class="skill-controls">
					<button @click="adjust(0, -1)" :disabled="getRank(0) <= 0">-</button>
					<span class="rank">+{{ getRank(0) }}</span>
					<button @click="adjust(0, 1)">+</button>
				</div>
			</div>
			
			<div class="mech-skill-item">
				<div class="skill-name">{{ $t('pilotCreator.fields.agility') }}</div>
				<div class="skill-controls">
					<button @click="adjust(1, -1)" :disabled="getRank(1) <= 0">-</button>
					<span class="rank">+{{ getRank(1) }}</span>
					<button @click="adjust(1, 1)">+</button>
				</div>
			</div>

			<div class="mech-skill-item">
				<div class="skill-name">{{ $t('pilotCreator.fields.systems') }}</div>
				<div class="skill-controls">
					<button @click="adjust(2, -1)" :disabled="getRank(2) <= 0">-</button>
					<span class="rank">+{{ getRank(2) }}</span>
					<button @click="adjust(2, 1)">+</button>
				</div>
			</div>

			<div class="mech-skill-item">
				<div class="skill-name">{{ $t('pilotCreator.fields.engineering') }}</div>
				<div class="skill-controls">
					<button @click="adjust(3, -1)" :disabled="getRank(3) <= 0">-</button>
					<span class="rank">+{{ getRank(3) }}</span>
					<button @click="adjust(3, 1)">+</button>
				</div>
			</div>
		</div>

		<div class="total-points">
			Total: {{ totalPoints }} {{ $t('pilotCreator.mechPointsDist') }}
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

h2 {
	font-family: "Big Shoulders Display", cursive;
	color: var(--primary-color);
	font-size: 24px;
	border-bottom: 1px solid var(--primary-color);
	padding-bottom: 5px;
	margin-bottom: 5px;
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
	font-family: "Inconsolata", monospace;
	font-size: 16px;
	color: var(--text-location);
	text-align: center;
	padding: 10px;
	background: rgba(255, 255, 255, 0.05);
	border: 1px dashed var(--text-location);
}
</style>
