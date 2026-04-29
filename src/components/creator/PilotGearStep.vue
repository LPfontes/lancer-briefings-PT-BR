<template>
	<div class="creator-step">
		<h2>{{ $t('pilotCreator.steps.pilotGear') }}</h2>
		<p class="desc">{{ $t('pilotCreator.gearDesc') }}</p>
		
		<div class="gear-sections">
			<!-- ARMOR SECTION -->
			<div class="gear-section">
				<h3>{{ $t('pilotCreator.gear.armor') }}</h3>
				<div class="gear-grid">
					<div v-for="item in armor" :key="item.id" 
						class="event-window gear-item" 
						:class="{ expanded: isExpanded(item.id), selected: isSelected('armor', item.id) }">
						<div class="window-title-bar" @click="toggleExpand(item.id)">
							<div class="window-controls">
								<span class="control" :class="{ green: isSelected('armor', item.id) }"></span>
							</div>
							<div class="window-title">{{ item.name }}</div>
							<div class="window-status" @click.stop="selectArmor(item.id)">
								{{ isSelected('armor', item.id) ? $t('general.selected') : $t('general.select') }}
							</div>
						</div>
						<div class="window-body" v-if="isExpanded(item.id)">
							<div class="gear-desc" v-html="item.description || item.effect"></div>
						</div>
					</div>
				</div>
			</div>

			<!-- WEAPONS SECTION -->
			<div class="gear-section">
				<h3>{{ $t('pilotCreator.gear.weapons') }}</h3>
				<div class="gear-grid">
					<div v-for="item in weapons" :key="item.id" 
						class="event-window gear-item" 
						:class="{ expanded: isExpanded(item.id), selected: isSelected('weapons', item.id) }">
						<div class="window-title-bar" @click="toggleExpand(item.id)">
							<div class="window-controls">
								<span class="control" :class="{ green: isSelected('weapons', item.id) }"></span>
							</div>
							<div class="window-title">{{ item.name }}</div>
							<div class="window-status" @click.stop="toggleWeapon(item.id)">
								{{ isSelected('weapons', item.id) ? $t('general.selected') : $t('general.select') }}
							</div>
						</div>
						<div class="window-body" v-if="isExpanded(item.id)">
							<div class="gear-desc" v-html="item.description"></div>
						</div>
					</div>
				</div>
			</div>

			<!-- GEAR SECTION -->
			<div class="gear-section">
				<h3>{{ $t('pilotCreator.gear.misc') }}</h3>
				<div class="gear-grid">
					<div v-for="item in miscGear" :key="item.id" 
						class="event-window gear-item" 
						:class="{ expanded: isExpanded(item.id), selected: isSelected('gear', item.id) }">
						<div class="window-title-bar" @click="toggleExpand(item.id)">
							<div class="window-controls">
								<span class="control" :class="{ green: isSelected('gear', item.id) }"></span>
							</div>
							<div class="window-title">{{ item.name }}</div>
							<div class="window-status" @click.stop="toggleGear(item.id)">
								{{ isSelected('gear', item.id) ? $t('general.selected') : $t('general.select') }}
							</div>
						</div>
						<div class="window-body" v-if="isExpanded(item.id)">
							<div class="gear-desc" v-html="item.description || item.effect"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { pilot_gear as gearData } from "lancer-data-pt-br";

export default {
	name: "PilotGearStep",
	data() {
		return {
			allGear: gearData,
			expandedItems: []
		};
	},
	computed: {
		armor() { return this.allGear.filter(i => i.type === 'Armor'); },
		weapons() { return this.allGear.filter(i => i.type === 'Weapon'); },
		miscGear() { return this.allGear.filter(i => i.type === 'Gear'); }
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
		isSelected(type, id) {
			if (type === 'armor') return pilotStore.state.loadout.armor === id;
			return pilotStore.state.loadout[type].includes(id);
		},
		selectArmor(id) {
			if (pilotStore.state.loadout.armor === id) {
				pilotStore.setArmor(null);
			} else {
				pilotStore.setArmor(id);
			}
		},
		toggleWeapon(id) {
			pilotStore.toggleWeapon(id);
		},
		toggleGear(id) {
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

.gear-sections {
	display: flex;
	flex-direction: column;
	gap: 30px;
}

.gear-section h3 {
	font-family: "Big Shoulders Display", cursive;
	color: white;
	font-size: 20px;
	margin-bottom: 10px;
	text-transform: uppercase;
	letter-spacing: 1px;
	border-left: 3px solid var(--primary-color);
	padding-left: 10px;
}

.gear-grid {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 10px;
}

.gear-item {
	margin-bottom: 0;
	height: fit-content;
}

.gear-item.selected {
	border-color: #27c93f;
	box-shadow: 0 0 10px rgba(39, 201, 63, 0.2);
}

.window-title-bar {
	cursor: pointer;
	transition: background 0.2s;
}

.window-title-bar:hover {
	background: #8b0b18;
}

.gear-desc {
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
	color: var(--text-location);
	line-height: 1.6;
}

.window-status {
	cursor: pointer;
	transition: all 0.2s;
	font-weight: bold;
}

.window-status:hover {
	background: white;
	color: var(--primary-color);
}
</style>
