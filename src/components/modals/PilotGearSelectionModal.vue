<template>
	<transition name="modal-fade">
		<div class="modal-overlay" v-if="isOpen" @click.self="$emit('close')">
			<div class="modal-content">
				<!-- Header -->
				<div class="modal-header">
					<div class="header-left">
						<div class="header-line"></div>
						<h2 class="modal-title">{{ $t('pilotCreator.steps.pilotGear') }}</h2>
					</div>
					<div class="header-right">
						<div class="loadout-summary">
							<div class="summary-item">
								<span class="label">ARMADURA:</span>
								<span class="value" :class="{ ok: hasArmor }">{{ hasArmor ? '1/1' : '0/1' }}</span>
							</div>
							<div class="summary-item">
								<span class="label">ARMAS:</span>
								<span class="value" :class="{ ok: weaponsCount === 2 }">{{ weaponsCount }}/2</span>
							</div>
							<div class="summary-item">
								<span class="label">EQUIP:</span>
								<span class="value" :class="{ ok: gearCount === 3 }">{{ gearCount }}/3</span>
							</div>
						</div>
						<button class="close-btn" @click="$emit('close')">
							<span class="material-symbols-outlined">close</span>
						</button>
					</div>
				</div>

				<!-- Navigation Tabs -->
				<div class="modal-tabs">
					<button 
						v-for="tab in tabs" 
						:key="tab.id" 
						class="tab-btn" 
						:class="{ active: activeTab === tab.id }"
						@click="activeTab = tab.id">
						<span class="material-symbols-outlined">{{ tab.icon }}</span>
						{{ tab.label }}
					</button>
				</div>

				<!-- Search -->
				<div class="modal-controls">
					<div class="search-box">
						<span class="material-symbols-outlined search-icon">search</span>
						<input 
							type="text" 
							v-model="searchQuery" 
							:placeholder="'BUSCAR ' + activeTabLabel + '...'" 
							class="search-input" 
						/>
					</div>
				</div>

				<!-- Body -->
				<div class="modal-body tech-scroll">
					<div class="gear-grid">
						<TacticalGearCard
							v-for="item in filteredItems"
							:key="item.id"
							:item="item"
							:type="item.type?.toLowerCase()"
							selectionMode
							:isSelected="isSelected(item.id)"
							@click="toggleItem"
						/>
					</div>

					<div v-if="filteredItems.length === 0" class="empty-state">
						<span class="material-symbols-outlined">inventory_2</span>
						<p>NENHUM ITEM ENCONTRADO NESSA CATEGORIA</p>
					</div>
				</div>

				<!-- Footer -->
				<div class="modal-footer">
					<button class="confirm-btn" @click="$emit('close')">
						<span class="material-symbols-outlined">verified</span>
						CONFIRMAR EQUIPAMENTO
					</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { pilot_gear as gearData } from "lancer-data-pt-br";
import TacticalGearCard from "./TacticalGearCard.vue";

export default {
	name: "PilotGearSelectionModal",
	components: {
		TacticalGearCard
	},
	props: {
		isOpen: Boolean
	},
	data() {
		return {
			activeTab: "armor",
			searchQuery: "",
			allGear: gearData,
			tabs: [
				{ id: "armor", label: "ARMADURA", icon: "shield" },
				{ id: "weapons", label: "ARMAMENTOS", icon: "swords" },
				{ id: "gear", label: "UTILITÁRIOS", icon: "construction" }
			]
		};
	},
	computed: {
		activeTabLabel() {
			return this.tabs.find(t => t.id === this.activeTab).label;
		},
		hasArmor() { return !!pilotStore.state.loadout.armor; },
		weaponsCount() { return pilotStore.state.loadout.weapons.length; },
		gearCount() { return pilotStore.state.loadout.gear.length; },
		
		filteredItems() {
			let typeFilter = "";
			if (this.activeTab === 'armor') typeFilter = 'Armor';
			else if (this.activeTab === 'weapons') typeFilter = 'Weapon';
			else if (this.activeTab === 'gear') typeFilter = 'Gear';

			let items = this.allGear.filter(i => i.type === typeFilter);
			
			if (this.searchQuery) {
				const q = this.searchQuery.toLowerCase();
				items = items.filter(i => 
					i.name.toLowerCase().includes(q) || 
					(i.description && i.description.toLowerCase().includes(q)) ||
					(i.effect && i.effect.toLowerCase().includes(q))
				);
			}
			return items;
		}
	},
	methods: {
		getSubtype(item) {
			if (item.type === 'Weapon') return 'ARMA';
			if (item.type === 'Armor') return 'TRAJE';
			return 'GEAR';
		},
		isSelected(id) {
			if (this.activeTab === 'armor') return pilotStore.state.loadout.armor === id;
			if (this.activeTab === 'weapons') return pilotStore.state.loadout.weapons.includes(id);
			if (this.activeTab === 'gear') return pilotStore.state.loadout.gear.includes(id);
			return false;
		},
		toggleItem(item) {
			if (this.activeTab === 'armor') {
				if (pilotStore.state.loadout.armor === item.id) {
					pilotStore.setArmor(null);
				} else {
					pilotStore.setArmor(item.id);
				}
			} else if (this.activeTab === 'weapons') {
				pilotStore.toggleWeapon(item.id);
			} else if (this.activeTab === 'gear') {
				pilotStore.toggleGear(item.id);
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
	backdrop-filter: blur(10px);
	z-index: 2500;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.modal-content {
	background: #0d121b;
	width: 100%;
	max-width: 60%;
	height: 85vh;
	border: 1px solid rgba(175, 14, 30, 0.4);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
	margin-top: 5%;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 30px;
	background: linear-gradient(90deg, rgba(175, 14, 30, 0.15) 0%, transparent 100%);
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
	font-size: 22px;
	margin: 0;
	text-transform: uppercase;
	letter-spacing: 2px;
	font-weight: 700;
}

.loadout-summary {
	display: flex;
	gap: 20px;
	background: rgba(0, 0, 0, 0.3);
	padding: 5px 20px;
	border: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-item {
	display: flex;
	align-items: center;
	gap: 8px;
}

.summary-item .label {
	font-family: \"Inconsolata\", monospace;
	font-size: 11px;
	color: rgba(255, 255, 255, 0.4);
}

.summary-item .value {
	font-family: \"Rajdhani\", sans-serif;
	font-size: 14px;
	font-weight: 700;
	color: #fff;
}

.summary-item .value.ok {
	color: #27c93f;
}

.close-btn {
	background: transparent;
	border: none;
	color: rgba(255, 255, 255, 0.5);
	cursor: pointer;
	margin-left: 20px;
}

.close-btn:hover {
	color: #af0e1e;
}

.modal-tabs {
	display: flex;
	background: rgba(0, 0, 0, 0.2);
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.tab-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	padding: 15px;
	background: transparent;
	border: none;
	border-bottom: 2px solid transparent;
	color: rgba(255, 255, 255, 0.4);
	font-family: \"Rajdhani\", sans-serif;
	font-size: 14px;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.2s;
	text-transform: uppercase;
	letter-spacing: 1px;
}

.tab-btn:hover {
	color: #fff;
	background: rgba(255, 255, 255, 0.02);
}

.tab-btn.active {
	color: #af0e1e;
	border-bottom-color: #af0e1e;
	background: rgba(175, 14, 30, 0.05);
}

.modal-controls {
	padding: 15px 30px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.search-box {
	position: relative;
}

.search-icon {
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	color: rgba(255, 255, 255, 0.2);
}

.search-input {
	width: 100%;
	background: rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 10px 15px 10px 40px;
	color: #fff;
	font-family: \"Inconsolata\", monospace;
	font-size: 14px;
	outline: none;
}

.search-input:focus {
	border-color: #af0e1e;
}

.modal-body {
	flex: 1;
	overflow-y: auto;
	padding: 25px 30px;
}

.gear-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 15px;
}

.gear-card {
	background: rgba(255, 255, 255, 0.02);
	border: 1px solid rgba(255, 255, 255, 0.05);
	padding: 15px;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.gear-card:hover {
	background: rgba(255, 255, 255, 0.05);
	border-color: rgba(255, 255, 255, 0.15);
}

.gear-card.selected {
	border-color: #af0e1e;
	background: rgba(175, 14, 30, 0.05);
}

.gear-card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.item-identity {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.item-name {
	font-family: \"Rajdhani\", sans-serif;
	font-size: 16px;
	font-weight: 700;
	color: #fff;
	text-transform: uppercase;
}

.item-type-tag {
	font-family: \"Inconsolata\", monospace;
	font-size: 10px;
	color: #af0e1e;
	font-weight: bold;
}

.indicator-box {
	width: 20px;
	height: 20px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
}

.selected .indicator-box {
	background: #af0e1e;
	border-color: #af0e1e;
}

.indicator-box .material-symbols-outlined {
	font-size: 16px;
	color: #fff;
}

.item-description {
	font-family: \"Titillium Web\", sans-serif;
	font-size: 13px;
	color: rgba(255, 255, 255, 0.7);
	line-height: 1.5;
	margin: 0;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.item-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
}

.gear-tag {
	font-family: \"Inconsolata\", monospace;
	font-size: 9px;
	background: rgba(255, 255, 255, 0.05);
	padding: 2px 6px;
	color: rgba(255, 255, 255, 0.4);
	border: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-footer {
	padding: 20px 30px;
	background: rgba(0, 0, 0, 0.4);
	border-top: 1px solid rgba(255, 255, 255, 0.05);
	display: flex;
	justify-content: flex-end;
}

.confirm-btn {
	background: #af0e1e;
	border: none;
	color: #fff;
	padding: 10px 30px;
	font-family: \"Rajdhani\", sans-serif;
	font-size: 14px;
	font-weight: 700;
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	text-transform: uppercase;
	letter-spacing: 1px;
}

.confirm-btn:hover {
	background: #d32f2f;
	box-shadow: 0 0 20px rgba(175, 14, 30, 0.3);
}

.tech-scroll {
	overflow-y: auto;
}

.tech-scroll::-webkit-scrollbar {
	width: 4px;
}

.tech-scroll::-webkit-scrollbar-thumb {
	background: #af0e1e;
}

.modal-fade-enter-active, .modal-fade-leave-active {
	transition: opacity 0.3s;
}
.modal-fade-enter-from, .modal-fade-leave-to {
	opacity: 0;
}
</style>
