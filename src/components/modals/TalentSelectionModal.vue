<template>
	<transition name="modal-fade">
		<div class="modal-overlay" v-if="isOpen" @click.self="$emit('close')">
			<div class="modal-content">
				<!-- Header -->
				<div class="modal-header">
					<div class="header-left">
						<div class="header-line"></div>
						<h2 class="modal-title">{{ $t('pilotCreator.steps.talents') }}</h2>
					</div>
					<div class="header-right">
						<div class="points-tracker">
							<span class="points-label">{{ $t('pilotCreator.mechPointsDist') }}:</span>
							<span class="points-counter" :class="{ 'at-limit': spentPoints >= maxPoints }">
								{{ maxPoints - spentPoints }} RANKS DISPONÍVEIS
							</span>
						</div>
						<button class="close-btn" @click="$emit('close')">
							<span class="material-symbols-outlined">close</span>
						</button>
					</div>
				</div>

				<!-- Search & Filter -->
				<div class="modal-controls">
					<div class="search-box">
						<span class="material-symbols-outlined search-icon">search</span>
						<input 
							type="text" 
							v-model="searchQuery" 
							:placeholder="$t('general.search') || 'BUSCAR TALENTO...'" 
							class="search-input" 
						/>
					</div>
				</div>

				<!-- Body -->
				<div class="modal-body tech-scroll">
					<div class="talents-grid">
						<div v-for="talent in filteredTalents" 
							:key="talent.id" 
							class="talent-card"
							:class="{ 'has-points': getRank(talent.id) > 0 }"
							@click="selectTalent(talent)">
							
							<div class="talent-card-main">
								<div class="talent-info">
									<div class="talent-name-row">
										<span class="talent-name">{{ talent.name }}</span>
										<div class="rank-indicator">
											<span v-for="i in 3" :key="i" class="rank-dot" :class="{ filled: getRank(talent.id) >= i }"></span>
										</div>
									</div>
									<p class="talent-terse">{{ talent.terse }}</p>
								</div>
								
								<div class="talent-actions">
									<div class="rank-stepper">
										<button @click.stop="adjust(talent.id, -1)" :disabled="getRank(talent.id) <= 0" class="step-btn">
											<span class="material-symbols-outlined">remove</span>
										</button>
										<span class="current-rank">{{ getRank(talent.id) }}</span>
										<button @click.stop="adjust(talent.id, 1)" :disabled="getRank(talent.id) >= 3 || spentPoints >= maxPoints" class="step-btn">
											<span class="material-symbols-outlined">add</span>
										</button>
									</div>
								</div>
							</div>

							<!-- Expanded details if selected -->
							<div v-if="selectedId === talent.id" class="talent-details-expanded" @click.stop>
								<div class="details-divider"></div>
								<div class="ranks-list">
									<div v-for="(rank, i) in talent.ranks" :key="i" class="rank-item" :class="{ locked: getRank(talent.id) < i + 1 }">
										<div class="rank-item-header">
											<span class="rank-label">RANK {{ i + 1 }}: {{ rank.name }}</span>
											<span class="rank-status-tag" v-if="getRank(talent.id) >= i + 1">ATIVO</span>
										</div>
										<div class="rank-item-body" v-html="rank.description"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div v-if="filteredTalents.length === 0" class="empty-state">
						<span class="material-symbols-outlined">search_off</span>
						<p>NENHUM TALENTO ENCONTRADO</p>
					</div>
				</div>

				<!-- Footer -->
				<div class="modal-footer">
					<button class="confirm-btn" @click="$emit('close')">
						<span class="material-symbols-outlined">check_circle</span>
						CONFIRMAR SELEÇÃO
					</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { talents as talentDataList } from "lancer-data-pt-br";

export default {
	name: "TalentSelectionModal",
	props: {
		isOpen: Boolean
	},
	data() {
		return {
			searchQuery: "",
			talentsData: talentDataList,
			selectedId: null
		};
	},
	computed: {
		filteredTalents() {
			if (!this.searchQuery) return this.talentsData;
			const q = this.searchQuery.toLowerCase();
			return this.talentsData.filter(t => 
				t.name.toLowerCase().includes(q) || 
				t.terse.toLowerCase().includes(q)
			);
		},
		spentPoints() {
			return pilotStore.state.talents.reduce((acc, t) => acc + t.rank, 0);
		},
		maxPoints() {
			return pilotStore.state.level + 3;
		}
	},
	methods: {
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
		},
		selectTalent(talent) {
			if (this.selectedId === talent.id) {
				this.selectedId = null;
			} else {
				this.selectedId = talent.id;
			}
		}
	}
};
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.85);
	backdrop-filter: blur(8px);
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.modal-content {
	background: #0b1119;
	width: 100%;
	max-width: 60%;
	height: 70vh;
	border: 1px solid rgba(175, 14, 30, 0.5);
	box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: hidden;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 30px;
	background: linear-gradient(90deg, rgba(175, 14, 30, 0.15) 0%, transparent 100%);
	border-bottom: 1px solid rgba(175, 14, 30, 0.3);
}

.header-left {
	display: flex;
	align-items: center;
	gap: 15px;
}

.header-line {
	width: 4px;
	height: 24px;
	background: #af0e1e;
	box-shadow: 0 0 10px #af0e1e;
}

.modal-title {
	font-family: \"Rajdhani\", sans-serif;
	color: #fff;
	font-size: 24px;
	margin: 0;
	text-transform: uppercase;
	letter-spacing: 2px;
	font-weight: 700;
}

.header-right {
	display: flex;
	align-items: center;
	gap: 30px;
}

.points-tracker {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.points-label {
	font-family: \"Inconsolata\", monospace;
	font-size: 11px;
	color: rgba(255, 255, 255, 0.4);
	text-transform: uppercase;
	letter-spacing: 1px;
}

.points-counter {
	font-family: \"Rajdhani\", sans-serif;
	font-size: 16px;
	color: #f1a92a;
	font-weight: 700;
}

.points-counter.at-limit {
	color: #27c93f;
}

.close-btn {
	background: transparent;
	border: none;
	color: rgba(255, 255, 255, 0.5);
	cursor: pointer;
	transition: color 0.2s;
}

.close-btn:hover {
	color: #af0e1e;
}

.modal-controls {
	padding: 15px 30px;
	background: rgba(0, 0, 0, 0.3);
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.search-box {
	position: relative;
	width: 100%;
}

.search-icon {
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	color: rgba(255, 255, 255, 0.3);
	font-size: 18px;
}

.search-input {
	width: 100%;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	color: white;
	padding: 10px 15px 10px 40px;
	font-family: \"Inconsolata\", monospace;
	font-size: 14px;
	outline: none;
	transition: all 0.2s;
}

.search-input:focus {
	border-color: #af0e1e;
	background: rgba(175, 14, 30, 0.05);
}

.modal-body {
	flex: 1;
	overflow-y: auto;
	padding: 25px 30px;
}

.talents-grid {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.talent-card {
	background: rgba(22, 28, 29, 0.6);
	border: 1px solid rgba(255, 255, 255, 0.05);
	transition: all 0.2s;
	cursor: pointer;
}

.talent-card:hover {
	border-color: rgba(175, 14, 30, 0.3);
	background: rgba(22, 28, 29, 0.8);
}

.talent-card.has-points {
	border-left: 3px solid #af0e1e;
}

.talent-card-main {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px 20px;
}

.talent-info {
	flex: 1;
}

.talent-name-row {
	display: flex;
	align-items: center;
	gap: 15px;
	margin-bottom: 4px;
}

.talent-name {
	font-family: \"Rajdhani\", sans-serif;
	font-size: 18px;
	font-weight: 700;
	color: #fff;
	text-transform: uppercase;
	letter-spacing: 1px;
}

.rank-indicator {
	display: flex;
	gap: 4px;
}

.rank-dot {
	width: 8px;
	height: 8px;
	background: rgba(255, 255, 255, 0.1);
	clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.rank-dot.filled {
	background: #af0e1e;
	box-shadow: 0 0 5px #af0e1e;
}

.talent-terse {
	font-family: \"Titillium Web\", sans-serif;
	font-size: 13px;
	color: rgba(255, 255, 255, 0.5);
	margin: 0;
}

.rank-stepper {
	display: flex;
	align-items: center;
	background: rgba(0, 0, 0, 0.4);
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 2px;
}

.step-btn {
	background: transparent;
	border: none;
	color: #fff;
	width: 28px;
	height: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s;
}

.step-btn:hover:not(:disabled) {
	background: rgba(175, 14, 30, 0.2);
	color: #af0e1e;
}

.step-btn:disabled {
	opacity: 0.2;
	cursor: not-allowed;
}

.current-rank {
	font-family: \"Inconsolata\", monospace;
	font-size: 16px;
	font-weight: bold;
	color: #fff;
	width: 30px;
	text-align: center;
}

.talent-details-expanded {
	padding: 0 20px 20px 20px;
	cursor: default;
}

.details-divider {
	height: 1px;
	background: rgba(255, 255, 255, 0.05);
	margin-bottom: 15px;
}

.ranks-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.rank-item {
	padding: 12px;
	background: rgba(0, 0, 0, 0.2);
	border-left: 2px solid #af0e1e;
}

.rank-item.locked {
	border-left-color: rgba(255, 255, 255, 0.1);
	opacity: 0.8;
}

.rank-item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 6px;
}

.rank-label {
	font-family: \"Rajdhani\", sans-serif;
	font-size: 13px;
	font-weight: 700;
	color: #af0e1e;
	text-transform: uppercase;
}

.locked .rank-label {
	color: rgba(255, 255, 255, 0.4);
}

.rank-status-tag {
	font-family: \"Inconsolata\", monospace;
	font-size: 9px;
	background: #af0e1e;
	color: #fff;
	padding: 1px 6px;
	border-radius: 2px;
}

.rank-item-body {
	font-family: \"Titillium Web\", sans-serif;
	font-size: 16px;
	line-height: 1.5;

}

.empty-state {
	text-align: center;
	padding: 50px;
	color: rgba(255, 255, 255, 0.3);
}

.empty-state .material-symbols-outlined {
	font-size: 48px;
	margin-bottom: 10px;
}

/* Animations */
.modal-fade-enter-active, .modal-fade-leave-active {
	transition: opacity 0.3s;
}

.modal-fade-enter-from, .modal-fade-leave-to {
	opacity: 0;
}

.tech-scroll {
	overflow-y: auto;
}

.tech-scroll::-webkit-scrollbar {
	width: 4px;
}

.tech-scroll::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.2);
}

.tech-scroll::-webkit-scrollbar-thumb {
	background: #af0e1e;
}

/* Footer */
.modal-footer {
	padding: 15px 30px;
	background: rgba(0, 0, 0, 0.4);
	border-top: 1px solid rgba(175, 14, 30, 0.3);
	display: flex;
	justify-content: flex-end;
}

.confirm-btn {
	background: #af0e1e;
	border: none;
	color: white;
	padding: 10px 25px;
	font-family: "Rajdhani", sans-serif;
	font-size: 14px;
	font-weight: 700;
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	transition: all 0.2s;
	text-transform: uppercase;
	letter-spacing: 1px;
}

.confirm-btn:hover {
	background: #d32f2f;
	box-shadow: 0 0 15px rgba(175, 14, 30, 0.4);
	transform: translateY(-1px);
}

.confirm-btn .material-symbols-outlined {
	font-size: 18px;
}
</style>
