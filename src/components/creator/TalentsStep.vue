<template>
	<div class="creator-step">
		<div class="step-header">
			<div class="header-left">
				<h2>{{ $t('pilotCreator.steps.talents') }}</h2>
				<p class="desc">{{ $t('pilotCreator.talentsDesc') }}</p>
			</div>
			<div class="header-right">
				<div class="points-summary">
					<span class="points-label">{{ $t('pilotCreator.mechPointsDist') }}:</span>
					<span class="points-counter" :class="{ 'at-limit': spentPoints >= maxPoints }">
						{{ maxPoints - spentPoints }} RANKS DISPONÍVEIS
					</span>
				</div>
			</div>
		</div>
		
		<div class="selected-talents-container">
			<div v-if="activeTalents.length === 0" class="empty-talents" @click="showModal = true">
				<span class="material-symbols-outlined">add_circle</span>
				<p>NENHUM TALENTO SELECIONADO. CLIQUE PARA ADICIONAR.</p>
			</div>

			<div v-else class="active-talents-list">
				<div v-for="talent in activeTalents" :key="talent.id" class="active-talent-card card-border">
					<div class="talent-main-info" @click="toggleExpand(talent.id)">
						<div class="talent-name-group">
							<span class="talent-name">{{ talent.name }}</span>
							<div class="rank-dots">
								<span v-for="i in 3" :key="i" class="dot" :class="{ filled: getRank(talent.id) >= i }"></span>
							</div>
						</div>
						<div class="talent-rank-name">
							RANK {{ getRank(talent.id) }}: {{ talent.ranks[getRank(talent.id)-1].name }}
						</div>
						<span class="material-symbols-outlined expand-icon" :class="{ rotated: isExpanded(talent.id) }">expand_more</span>
					</div>

					<div class="talent-details-preview" v-show="isExpanded(talent.id)">
						<div class="preview-divider"></div>
						<div class="rank-description" v-html="talent.ranks[getRank(talent.id)-1].description"></div>
					</div>
				</div>

				<button class="add-talent-footer-btn" @click="showModal = true">
					<span class="material-symbols-outlined">add_circle</span>
					{{ activeTalents.length > 0 ? 'GERENCIAR / ADICIONAR TALENTOS' : 'ADICIONAR TALENTO' }}
				</button>
			</div>
		</div>

		<!-- Talent Selection Modal -->
		<TalentSelectionModal 
			:isOpen="showModal" 
			@close="showModal = false" 
		/>
	</div>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { talents as talentDataList } from "lancer-data-pt-br";
import TalentSelectionModal from "@/components/modals/TalentSelectionModal.vue";

export default {
	name: "TalentsStep",
	components: {
		TalentSelectionModal
	},
	data() {
		return {
			talentsData: talentDataList,
			expandedItems: [],
			showModal: false
		};
	},
	computed: {
		activeTalents() {
			return pilotStore.state.talents
				.filter(t => t.rank > 0)
				.map(t => {
					const data = this.talentsData.find(td => td.id === t.id);
					return { ...data, rank: t.rank };
				});
		},
		spentPoints() {
			return pilotStore.state.talents.reduce((acc, t) => acc + t.rank, 0);
		},
		maxPoints() {
			return pilotStore.state.level + 3;
		}
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

.step-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding-bottom: 15px;
	border-bottom: 1px solid rgba(175, 14, 30, 0.3);
}



.header-right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 12px;
}

.points-summary {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.points-label {
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: var(--text-location);
	opacity: 0.7;
	text-transform: uppercase;
}

.points-counter {
	font-size: 16px;
	font-family: "Rajdhani", sans-serif;
	font-weight: 800;
	color: var(--primary-color);
	letter-spacing: 1px;
}

.points-counter.at-limit {
	color: #27c93f;
}

.manage-btn {
	background: rgba(175, 14, 30, 0.1);
	border: 1px solid var(--primary-color);
	color: white;
	padding: 8px 16px;
	font-family: "Rajdhani", sans-serif;
	font-size: 14px;
	font-weight: 700;
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	transition: all 0.2s;
	text-transform: uppercase;
	letter-spacing: 1px;
}

.manage-btn:hover {
	background: var(--primary-color);
	color: black;
	box-shadow: 0 0 15px rgba(175, 14, 30, 0.4);
}

.add-talent-footer-btn {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	background: rgba(0, 0, 0, 0.4);
	border: 1px dashed var(--primary-color);
	color: var(--primary-color);
	padding: 15px;
	font-family: "Rajdhani", sans-serif;
	font-size: 14px;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.2s;
	margin-top: 10px;
	letter-spacing: 1px;
}

.add-talent-footer-btn:hover {
	background: rgba(175, 14, 30, 0.1);
	border-style: solid;
	box-shadow: 0 0 15px rgba(175, 14, 30, 0.2);
}

.desc {
	font-family: "Inconsolata", monospace;
	color: var(--text-location);
	font-size: 14px;
	margin: 0;
	opacity: 0.8;
}

.selected-talents-container {
	flex: 1;
}

.empty-talents {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px;
	background: rgba(0, 0, 0, 0.2);
	border: 1px dashed rgba(255, 255, 255, 0.1);
	color: rgba(255, 255, 255, 0.3);
	cursor: pointer;
	transition: all 0.2s;
}

.empty-talents:hover {
	border-color: var(--primary-color);
	background: rgba(175, 14, 30, 0.05);
	color: var(--primary-color);
}

.empty-talents .material-symbols-outlined {
	font-size: 40px;
	margin-bottom: 10px;
}

.empty-talents p {
	font-family: "Rajdhani", sans-serif;
	font-size: 14px;
	font-weight: 700;
	letter-spacing: 1px;
}

.active-talents-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.active-talent-card {
	background: rgba(22, 28, 29, 0.6);
	transition: all 0.2s;
}

.active-talent-card:hover {
	background: rgba(22, 28, 29, 0.9);
	border-color: rgba(175, 14, 30, 0.5);
}

.talent-main-info {
	padding: 15px 20px;
	display: grid;
	grid-template-columns: 200px 1fr 40px;
	align-items: center;
	cursor: pointer;
}

.talent-name-group {
	display: flex;
	align-items: center;
	gap: 15px;
}

.talent-name {
	font-family: "Rajdhani", sans-serif;
	font-size: 18px;
	font-weight: 700;
	color: white;
	text-transform: uppercase;
	letter-spacing: 1px;
}

.rank-dots {
	display: flex;
	gap: 4px;
}

.dot {
	width: 8px;
	height: 8px;
	background: rgba(255, 255, 255, 0.1);
	clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.dot.filled {
	background: var(--primary-color);
	box-shadow: 0 0 5px var(--primary-color);
}

.talent-rank-name {
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	color: var(--primary-color);
	font-weight: bold;
}

.expand-icon {
	color: rgba(255, 255, 255, 0.3);
	transition: transform 0.3s;
}

.expand-icon.rotated {
	transform: rotate(180deg);
}

.talent-details-preview {
	padding: 0 20px 20px 20px;
}

.preview-divider {
	height: 1px;
	background: rgba(255, 255, 255, 0.05);
	margin-bottom: 15px;
}

.rank-description {
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.8);
	line-height: 1.6;
}
</style>
