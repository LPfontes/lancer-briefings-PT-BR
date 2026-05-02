<template>
	<div class="creator-step">
		<div class="step-header">
			<div class="header-left">
				<h2>{{ $t('pilotCreator.steps.pilotGear') }}</h2>
				<p class="desc">{{ $t('pilotCreator.gearDesc') }}</p>
			</div>
			<div class="header-right">
				<button class="manage-btn" @click="showModal = true">
					<span class="material-symbols-outlined">settings_accessibility</span>
					GERENCIAR EQUIPAMENTO
				</button>
			</div>
		</div>
		
		<div class="loadout-display">
			<!-- ARMOR SLOT -->
			<div class="loadout-category">
				<div class="category-header">
					<span class="material-symbols-outlined">shield</span>
					<h3>{{ $t('pilotCreator.gear.armor') }}</h3>
					<span class="slot-count">{{ selectedArmor ? '1/1' : '0/1' }}</span>
				</div>
				<div class="slot-content">
					<div v-if="selectedArmor" class="selected-item-card armor-card">
						<div class="item-main">
							<span class="item-name">{{ selectedArmor.name }}</span>
							<p class="item-effect" v-html="selectedArmor.description || selectedArmor.effect"></p>
						</div>
					</div>
					<div v-else class="empty-slot" @click="openTo('armor')">
						<span class="material-symbols-outlined">add</span>
						SELECIONAR ARMADURA
					</div>
				</div>
			</div>

			<!-- WEAPON SLOTS -->
			<div class="loadout-category">
				<div class="category-header">
					<span class="material-symbols-outlined">swords</span>
					<h3>{{ $t('pilotCreator.gear.weapons') }}</h3>
					<span class="slot-count">{{ selectedWeapons.length }}/2</span>
				</div>
				<div class="slot-grid">
					<div v-for="weapon in selectedWeapons" :key="weapon.id" class="selected-item-card weapon-card">
						<div class="item-main">
							<div class="name-row">
								<span class="item-name">{{ weapon.name }}</span>
								<button class="remove-btn" @click="removeWeapon(weapon.id)">
									<span class="material-symbols-outlined">close</span>
								</button>
							</div>
							<p class="item-effect" v-html="weapon.description"></p>
						</div>
					</div>
					<div v-if="selectedWeapons.length < 2" class="empty-slot mini" @click="openTo('weapons')">
						<span class="material-symbols-outlined">add</span>
					</div>
				</div>
			</div>

			<!-- GEAR SLOTS -->
			<div class="loadout-category">
				<div class="category-header">
					<span class="material-symbols-outlined">construction</span>
					<h3>{{ $t('pilotCreator.gear.misc') }}</h3>
					<span class="slot-count">{{ selectedGear.length }}/3</span>
				</div>
				<div class="slot-grid three-cols">
					<div v-for="item in selectedGear" :key="item.id" class="selected-item-card gear-card">
						<div class="item-main">
							<div class="name-row">
								<span class="item-name">{{ item.name }}</span>
								<button class="remove-btn" @click="removeGear(item.id)">
									<span class="material-symbols-outlined">close</span>
								</button>
							</div>
							<p class="item-effect" v-html="item.description || item.effect"></p>
						</div>
					</div>
					<div v-if="selectedGear.length < 3" class="empty-slot mini" @click="openTo('gear')">
						<span class="material-symbols-outlined">add</span>
					</div>
				</div>
			</div>
		</div>

		<PilotGearSelectionModal 
			:isOpen="showModal" 
			ref="gearModal"
			@close="showModal = false" 
		/>
	</div>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { pilot_gear as gearData } from "lancer-data-pt-br";
import PilotGearSelectionModal from "@/components/modals/PilotGearSelectionModal.vue";

export default {
	name: "PilotGearStep",
	components: {
		PilotGearSelectionModal
	},
	data() {
		return {
			allGear: gearData,
			showModal: false
		};
	},
	computed: {
		selectedArmor() {
			const id = pilotStore.state.loadout.armor;
			return this.allGear.find(i => i.id === id);
		},
		selectedWeapons() {
			const ids = pilotStore.state.loadout.weapons;
			return this.allGear.filter(i => ids.includes(i.id));
		},
		selectedGear() {
			const ids = pilotStore.state.loadout.gear;
			return this.allGear.filter(i => ids.includes(i.id));
		}
	},
	methods: {
		openTo(tab) {
			this.showModal = true;
			this.$nextTick(() => {
				if (this.$refs.gearModal) {
					this.$refs.gearModal.activeTab = tab;
				}
			});
		},
		removeWeapon(id) {
			pilotStore.toggleWeapon(id);
		},
		removeGear(id) {
			pilotStore.toggleGear(id);
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

.desc {
	font-family: "Inconsolata", monospace;
	color: var(--text-location);
	font-size: 14px;
	margin: 5px 0 0 0;
	opacity: 0.8;
}

.loadout-display {
	display: flex;
	flex-direction: column;
	gap: 25px;
}

.loadout-category {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.category-header {
	display: flex;
	align-items: center;
	gap: 12px;
	color: var(--primary-color);
}

.category-header h3 {
	font-family: "Rajdhani", sans-serif;
	font-size: 18px;
	font-weight: 700;
	margin: 0;
	text-transform: uppercase;
	letter-spacing: 1px;
	color: white;
}

.slot-count {
	margin-left: auto;
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	background: rgba(0, 0, 0, 0.4);
	padding: 2px 10px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	color: rgba(255, 255, 255, 0.5);
}

.slot-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 15px;
}

.slot-grid.three-cols {
	grid-template-columns: 1fr 1fr 1fr;
}

.selected-item-card {
	background: rgba(22, 28, 29, 0.6);
	border: 1px solid rgba(175, 14, 30, 0.3);
	padding: 15px;
	position: relative;
	transition: all 0.2s;
}

.selected-item-card:hover {
	background: rgba(22, 28, 29, 0.9);
	border-color: var(--primary-color);
}

.item-name {
	font-family: "Rajdhani", sans-serif;
	font-size: 16px;
	font-weight: 700;
	color: white;
	display: block;
	margin-bottom: 5px;
	text-transform: uppercase;
}

.item-effect {
	font-family: "Titillium Web", sans-serif;
	font-size: 13px;
	color: rgba(255, 255, 255, 0.6);
	line-height: 1.5;
	margin: 0;
}

.name-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.remove-btn {
	background: transparent;
	border: none;
	color: rgba(255, 255, 255, 0.2);
	cursor: pointer;
	padding: 0;
	margin-top: -2px;
}

.remove-btn:hover {
	color: var(--primary-color);
}

.remove-btn .material-symbols-outlined {
	font-size: 18px;
}

.empty-slot {
	background: rgba(0, 0, 0, 0.2);
	border: 1px dashed rgba(255, 255, 255, 0.1);
	height: 80px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	color: rgba(255, 255, 255, 0.2);
	font-family: "Rajdhani", sans-serif;
	font-size: 12px;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.2s;
}

.empty-slot:hover {
	border-color: var(--primary-color);
	color: var(--primary-color);
	background: rgba(175, 14, 30, 0.05);
}

.empty-slot.mini {
	height: 80px;
}
</style>
