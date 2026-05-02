<template>
	<transition name="modal-fade">
		<div class="modal-overlay" v-if="isOpen" @click.self="$emit('close')">
			<div class="gear-detail-modal rank-gear-modal" :style="{ '--gear-color': mfColor }">
				<!-- Header -->
				<div class="modal-header">
					<div class="header-main">
						<div class="window-controls">
							<div class="control red"></div>
							<div class="control"></div>
							<div class="control"></div>
						</div>
						<h2 class="modal-title">{{ licenseName }} // RANQUE {{ 'I'.repeat(rank) }}</h2>
					</div>
					<button class="close-btn" @click="$emit('close')">
						<span class="material-symbols-outlined">close</span>
					</button>
				</div>

				<!-- Body -->
				<div class="modal-body tech-scroll">
					<div class="rank-intro">
						<div class="rank-badge">RANQUE {{ 'I'.repeat(rank) }}</div>
						<div class="rank-status">{{ $t('pilotCreator.licenseLevelAuth', { rank: rank }) }}</div>
					</div>

					<div class="gear-section" v-if="unlockedWeapons.length">
						<div class="desc-header">{{ $t('pilotCreator.weaponsUnlocks') }}</div>
						<div class="gear-grid">
							<TacticalGearCard
								v-for="w in unlockedWeapons"
								:key="w.id"
								:item="w"
								type="weapon"
								:showActions="false"
								@click="openDetail"
							/>
						</div>
					</div>

					<div class="gear-section" v-if="unlockedSystems.length">
						<div class="desc-header">{{ $t('pilotCreator.systemsUnlocks') }}</div>
						<div class="gear-grid">
							<TacticalGearCard
								v-for="s in unlockedSystems"
								:key="s.id"
								:item="s"
								type="system"
								:showActions="false"
								@click="openDetail"
							/>
						</div>
					</div>

					<div v-if="!unlockedWeapons.length && !unlockedSystems.length" class="empty-state">
						<p>{{ $t('pilotCreator.noGearUnlocks') }}</p>
					</div>

					<!-- Technical Data -->
					<div class="technical-specs">
						<div class="spec-item">
							<span class="label">{{ $t('pilotCreator.license') }}</span>
							<span class="value">{{ licenseName }}</span>
						</div>
						<div class="spec-item">
							<span class="label">{{ $t('pilotCreator.manufacturer') }}</span>
							<span class="value">{{ manufacturer }}</span>
						</div>
					</div>
				</div>

				<div class="modal-footer">
					<div class="footer-status">OMNINET SECURE CONNECTION // RANK {{ rank }} UNLOCKS // {{ manufacturer }} PROTOCOL</div>
				</div>
			</div>
		</div>
	</transition>

	<!-- Detail Modal -->
	<GearDetailModal 
		v-if="showDetail" 
		:item="selectedGear" 
		@close="showDetail = false" 
	/>
</template>

<script>
import { weapons as weaponsData, systems as systemsData } from "lancer-data-pt-br";
import TacticalGearCard from "./TacticalGearCard.vue";
import GearDetailModal from "./GearDetailModal.vue";

export default {
	name: "RankGearModal",
	components: {
		TacticalGearCard,
		GearDetailModal
	},
	emits: ["close"],
	props: {
		isOpen: Boolean,
		rank: Number,
		licenseId: String,
		licenseName: String,
		manufacturer: String,
		mfColor: String
	},
	data() {
		return {
			showDetail: false,
			selectedGear: null
		};
	},
	computed: {
		unlockedWeapons() {
			if (!this.licenseId) return [];
			return weaponsData.filter(w => 
				w.license_id === this.licenseId && 
				w.license_level === this.rank
			);
		},
		unlockedSystems() {
			if (!this.licenseId) return [];
			return systemsData.filter(s => 
				s.license_id === this.licenseId && 
				s.license_level === this.rank
			);
		}
	},
	methods: {
		openDetail(item) {
			this.selectedGear = item;
			this.showDetail = true;
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
	background: rgba(0, 0, 0, 0.9);
	backdrop-filter: blur(8px);
	z-index: 4000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.gear-detail-modal {
	background: #0b1119;
	width: 100%;
	max-width: 60%;
	max-height: 80%;
	border: 1px solid var(--gear-color);
	box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
	display: flex;
	flex-direction: column;
	position: relative;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px 20px;
	background: rgba(0, 0, 0, 0.5);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-main {
	display: flex;
	align-items: center;
	gap: 15px;
}

.window-controls {
	display: flex;
	gap: 6px;
}

.control {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.2);
}

.control.red { background: #af0e1e; }

.modal-title {
	font-family: "Rajdhani", sans-serif;
	font-size: 20px;
	color: #fff;
	letter-spacing: 2px;
	text-transform: uppercase;
	margin: 0;
}

.modal-body {
	padding: 30px;
	overflow-y: auto;
}

.rank-intro {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 25px;
}

.rank-badge {
	background: var(--gear-color);
	color: #fff;
	padding: 4px 12px;
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	font-weight: bold;
}

.rank-status {
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	color: var(--gear-color);
	letter-spacing: 1px;
}

.gear-section {
	margin-bottom: 30px;
}

.desc-header {
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	color: var(--gear-color);
	margin-bottom: 15px;
	letter-spacing: 2px;
	text-transform: uppercase;
}

.gear-grid {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.technical-specs {
	margin-top: 40px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
	padding: 20px;
	background: rgba(0, 0, 0, 0.3);
	border-left: 4px solid var(--gear-color);
}

.spec-item {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.spec-item .label {
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: rgba(255, 255, 255, 0.4);
}

.spec-item .value {
	font-family: "Rajdhani", sans-serif;
	font-size: 18px;
	color: #fff;
}

.modal-footer {
	padding: 10px 20px;
	background: rgba(0, 0, 0, 0.8);
	border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-status {
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: rgba(255, 255, 255, 0.3);
	text-align: right;
}

.close-btn {
	background: none;
	border: none;
	color: #fff;
	cursor: pointer;
	opacity: 0.7;
	transition: opacity 0.2s;
}

.close-btn:hover { opacity: 1; }

.empty-state {
	text-align: center;
	padding: 40px;
	color: rgba(255, 255, 255, 0.3);
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	letter-spacing: 1px;
}

.tech-scroll::-webkit-scrollbar { width: 4px; }
.tech-scroll::-webkit-scrollbar-thumb { background: var(--gear-color); }

.modal-fade-enter-active,
.modal-fade-leave-active {
	transition: opacity 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
	opacity: 0;
}
</style>
