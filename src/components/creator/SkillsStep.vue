<template>
	<div class="creator-step">
		<h2>{{ $t('pilotCreator.steps.skills') }} 
			<div class="points-summary">
				<span class="points-label">{{ $t('pilotCreator.mechPointsDist') }}:</span>
				<span class="points-counter" :class="{ 'at-limit': spentPoints >= maxPoints }">
					{{ maxPoints - spentPoints }} PONTOS DISPONÍVEIS
				</span>
			</div>
		</h2>
		<p class="desc">{{ $t('pilotCreator.skillsDesc') }}</p>
		
		<div class="skills-grid">
			<div v-for="skill in skillsData" :key="skill.id" 
				class="event-window skill-item" 
				:class="{ expanded: isExpanded(skill.id), active: getRank(skill.id) > 0 }">
				<div class="window-title-bar" @click="toggleExpand(skill.id)">
					<div class="window-controls">
						<div class="rank-stepper mini">
							<button @click.stop="adjust(skill.id, -2)" :disabled="getRank(skill.id) <= 0">‹</button>
							<div class="rank-display">
								<span class="rank-val">+{{ getRank(skill.id) }}</span>
							</div>
							<button @click.stop="adjust(skill.id, 2)" :disabled="getRank(skill.id) >= 6 || spentPoints >= maxPoints">›</button>
						</div>
					</div>
					<div class="window-title">{{ skill.name }}</div>
					<div class="window-status">
						{{ isExpanded(skill.id) ? $t('general.ready') : $t('general.view') }}
					</div>
				</div>
				<div class="window-body" v-if="isExpanded(skill.id)">
					<div class="skill-content">
						<div class="skill-desc-container">
							<div class="skill-desc" v-html="skill.description"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { skills as skillDataList } from "lancer-data-pt-br";

export default {
	name: "SkillsStep",
	data() {
		return {
			skillsData: skillDataList,
			expandedItems: []
		};
	},
	methods: {
		toggleExpand(id) {
			const index = this.expandedItems.indexOf(id);
			if (index > -1) {
				this.expandedItems.splice(index, 1);
			} else {
				this.expandedItems.push(id);
			}
		},
		isExpanded(id) {
			return this.expandedItems.includes(id);
		},
		getRank(id) {
			const skill = pilotStore.state.skills.find(s => s.id === id);
			return skill ? skill.rank : 0;
		},
		adjust(id, amount) {
			const current = this.getRank(id);
			let newRank = current + amount;
			if (newRank < 0) newRank = 0;
			if (newRank > 6) newRank = 6;
			pilotStore.setSkillRank(id, newRank);
		}
	},
	computed: {
		spentPoints() {
			return pilotStore.state.skills.reduce((acc, s) => acc + s.rank / 2, 0);
		},
		maxPoints() {
			return 4 + pilotStore.state.level;
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



.points-summary {
	display: flex;
	align-items: center;
	gap: 10px;
}

.points-label {
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	color: var(--text-location);
	opacity: 0.7;
}

.points-counter {
	font-size: 14px;
	font-family: "Big Shoulders Display", cursive;
	font-weight: 800;
	background: rgba(0, 0, 0, 0.4);
	padding: 4px 15px;
	border: 1px solid var(--primary-color);
	color: var(--primary-color);
	letter-spacing: 1px;
}

.points-counter.at-limit {
	background: #27c93f;
	border-color: #27c93f;
	color: #000;
}

.desc {
	font-family: "Inconsolata", monospace;
	color: var(--text-location);
	font-size: 14px;
	margin-bottom: 15px;
}

.skills-grid {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 10px;
}

.skill-item {
	margin-bottom: 0;
	height: fit-content;
}

.rank-stepper.mini {
	display: flex;
	align-items: center;
	background: rgba(0, 0, 0, 0.4);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 4px;
}

.rank-stepper button {
	background: transparent;
	border: none;
	color: white;
	padding: 0 10px;
	cursor: pointer;
	font-size: 18px;
}

.rank-stepper button:disabled {
	opacity: 0.2;
}

.rank-display {
	padding: 0 8px;
	border-left: 1px solid rgba(255, 255, 255, 0.1);
	border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.rank-val {
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	font-weight: bold;
}

.skill-content {
	display: flex;
	flex-direction: column;
}

.skill-desc-container {
	padding: 15px;
	background: rgba(175, 14, 30, 0.03);
	border-left: 3px solid var(--primary-color);
}

.skill-desc {
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
	color: var(--text-location);
	line-height: 1.6;
}
</style>
