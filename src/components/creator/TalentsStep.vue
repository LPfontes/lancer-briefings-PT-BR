<template>
	<div class="creator-step">
		<h2>{{ $t('pilotCreator.steps.talents') }}</h2>
		<p class="desc">{{ $t('pilotCreator.talentsDesc') }}</p>
		
		<div class="talents-grid">
			<div v-for="talent in talentsData" :key="talent.id" 
				class="event-window talent-item" 
				:class="{ expanded: isExpanded(talent.id), active: getRank(talent.id) > 0 }">
				<div class="window-title-bar" @click="toggleExpand(talent.id)">
					<div class="window-controls">
						<div class="rank-stepper mini">
							<button @click.stop="adjust(talent.id, -1)" :disabled="getRank(talent.id) <= 0">‹</button>
							<div class="rank-display">
								<span class="rank-val">{{ getRank(talent.id) }}</span>
							</div>
							<button @click.stop="adjust(talent.id, 1)" :disabled="getRank(talent.id) >= 3">›</button>
						</div>
					</div>
					<div class="window-title">{{ talent.name }}</div>
					<div class="window-status">
						{{ isExpanded(talent.id) ? $t('pilotCreator.logOpen') : $t('pilotCreator.logLocked') }}
					</div>
				</div>
				<div class="window-body" v-if="isExpanded(talent.id)">
					<div class="talent-content">
						<div class="talent-ranks">
							<div v-for="i in 3" :key="i" class="talent-rank-desc" :class="{ locked: getRank(talent.id) < i }">
								<div class="rank-header">
									<span class="rank-num">RANK {{ i }}</span>
									<span class="rank-status" v-if="getRank(talent.id) >= i">{{ $t('general.active') }}</span>
								</div>
								<div class="rank-body" v-html="talent.ranks[i-1].description"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { talents as talentDataList } from "lancer-data-pt-br";

export default {
	name: "TalentsStep",
	data() {
		return {
			talentsData: talentDataList,
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
			const talent = pilotStore.state.talents.find(t => t.id === id);
			return talent ? talent.rank : 0;
		},
		adjust(id, amount) {
			const current = this.getRank(id);
			let newRank = current + amount;
			if (newRank < 0) newRank = 0;
			if (newRank > 3) newRank = 3;
			pilotStore.setTalentRank(id, newRank);
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

.talents-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 15px;
}

.talent-item {
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

.talent-content {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.talent-ranks {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.talent-rank-desc {
	font-family: "Titillium Web", sans-serif;
	padding: 15px;
	background: rgba(175, 14, 30, 0.03);
	border-left: 3px solid var(--primary-color);
	transition: all 0.3s;
}

.talent-rank-desc.locked {
	opacity: 0.3;
	border-left-color: rgba(255, 255, 255, 0.1);
	filter: grayscale(1);
}

.rank-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 8px;
}

.rank-num {
	font-family: "Big Shoulders Display", cursive;
	color: var(--primary-color);
	font-weight: bold;
	font-size: 14px;
	letter-spacing: 1px;
}

.rank-status {
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	background: var(--primary-color);
	color: white;
	padding: 1px 5px;
	border-radius: 2px;
}

.rank-body {
	font-size: 14px;
	color: var(--text-location);
	line-height: 1.6;
}
</style>
