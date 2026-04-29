<template>
	<div class="creator-step">
		<h2>{{ $t('pilotCreator.steps.mechBuilder') }}</h2>
		
		<div class="mech-config">
			<div class="form-group">
				<label>{{ $t('pilotCreator.mech.name') }}</label>
				<input type="text" v-model="mechName" @input="updateMechName" class="tech-input" />
			</div>

			<div class="frame-selection">
				<label>{{ $t('pilotCreator.mech.selectFrame') }}</label>
				<select v-model="selectedFrameId" @change="updateFrame" class="tech-input">
					<option v-for="f in frames" :key="f.id" :value="f.id">{{ f.name }} ({{ f.source }})</option>
				</select>
				
				<div class="selected-frame-visual" v-if="selectedFrame">
					<img :src="getFrameImage(selectedFrame)" :alt="selectedFrame.name" class="frame-img" />
				</div>
			</div>
		</div>

		<div class="mech-builder-grid">
			<!-- MOUNTS -->
			<div class="builder-column">
				<h3>{{ $t('pilotCreator.mech.mounts') }}</h3>
				<div v-if="selectedFrame" class="mounts-list">
					<div v-for="(mountType, index) in selectedFrame.mounts" :key="index" class="mount-item">
						<div class="mount-header">
							<span class="mount-type">{{ mountType }} Mount</span>
						</div>
						<div class="mount-slots">
							<div v-for="slotIdx in getSlotCount(mountType)" :key="slotIdx" class="slot">
								<select :value="getWeapon(index, slotIdx-1)" 
									@change="setWeapon(index, slotIdx-1, $event.target.value)"
									class="tech-input weapon-select">
									<option :value="null">{{ $t('pilotCreator.mech.empty') }}</option>
									<optgroup label="GMS">
										<option v-for="w in gmsWeapons" :key="w.id" :value="w.id">{{ w.name }}</option>
									</optgroup>
									<optgroup label="Outros">
										<option v-for="w in otherWeapons" :key="w.id" :value="w.id">{{ w.name }}</option>
									</optgroup>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- SYSTEMS -->
			<div class="builder-column">
				<h3>{{ $t('pilotCreator.mech.systems') }}</h3>
				<div class="systems-grid">
					<div v-for="system in allSystems" :key="system.id" 
						class="event-window system-item" 
						:class="{ expanded: isExpanded(system.id), selected: isSystemSelected(system.id) }">
						<div class="window-title-bar" @click="toggleExpand(system.id)">
							<div class="window-controls">
								<span class="control" :class="{ green: isSystemSelected(system.id) }"></span>
							</div>
							<div class="window-title">{{ system.name }}</div>
							<div class="window-status" @click.stop="toggleSystem(system.id)">
								{{ isSystemSelected(system.id) ? $t('general.installed') : $t('general.ready') }}
							</div>
						</div>
						<div class="window-body" v-if="isExpanded(system.id)">
							<div class="system-meta">
								<span class="sp-cost">{{ $t('pilotCreator.mech.cost') }}: {{ system.sp }} SP</span>
							</div>
							<div class="system-desc" v-html="system.description || system.effect"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { frames as frameData, weapons as weaponData, systems as systemData } from "lancer-data-pt-br";

export default {
	name: "MechBuilderStep",
	data() {
		return {
			frames: frameData,
			weapons: weaponData,
			systems: systemData,
			mechName: pilotStore.state.activeMech.name,
			selectedFrameId: pilotStore.state.activeMech.frame,
			expandedItems: []
		};
	},
	computed: {
		selectedFrame() {
			return this.frames.find(f => f.id === this.selectedFrameId);
		},
		gmsWeapons() { return this.weapons.filter(w => w.source === 'GMS'); },
		otherWeapons() { return this.weapons.filter(w => w.source !== 'GMS'); },
		allSystems() { return this.systems; }
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
		getFrameImage(frame) {
			return `/frames/${frame.id}.png`;
		},
		updateMechName() {
			pilotStore.setMechName(this.mechName);
		},
		updateFrame() {
			pilotStore.setMechFrame(this.selectedFrameId);
		},
		getSlotCount(type) {
			if (type === 'Aux/Aux' || type === 'Main/Aux') return 2;
			return 1;
		},
		getWeapon(mountIdx, slotIdx) {
			return pilotStore.state.activeMech.mounts[`${mountIdx}_${slotIdx}`] || null;
		},
		setWeapon(mountIdx, slotIdx, weaponId) {
			pilotStore.setMechMountWeapon(`${mountIdx}_${slotIdx}`, weaponId === "null" ? null : weaponId);
		},
		isSystemSelected(id) {
			return pilotStore.state.activeMech.systems.includes(id);
		},
		toggleSystem(id) {
			pilotStore.toggleMechSystem(id);
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

.builder-header {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
	background: rgba(0, 0, 0, 0.3);
	padding: 20px;
	border: 1px solid rgba(255, 255, 255, 0.05);
}

.frame-selection {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.selected-frame-visual {
	width: 100%;
	height: 150px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgba(0, 0, 0, 0.2);
	border: 1px dashed rgba(255, 255, 255, 0.1);
	margin-top: 10px;
	overflow: hidden;
}

.frame-img {
	max-height: 90%;
	max-width: 90%;
	object-fit: contain;
	filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 5px;
	flex: 1;
}

.mech-config {
	display: flex;
	gap: 20px;
	background: rgba(175, 14, 30, 0.05);
	padding: 15px;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.mech-builder-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30px;
}

.builder-column h3 {
	font-family: "Big Shoulders Display", cursive;
	color: var(--primary-color);
	font-size: 20px;
	margin-bottom: 15px;
	text-transform: uppercase;
}

.mounts-list {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.mount-item {
	background: rgba(0, 0, 0, 0.4);
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 10px;
}

.mount-type {
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	color: var(--text-location);
	text-transform: uppercase;
	margin-bottom: 5px;
	display: block;
}

.mount-slots {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.weapon-select {
	width: 100%;
}

.systems-grid {
	display: flex;
	flex-direction: column;
	gap: 10px;
	max-height: 600px;
	overflow-y: auto;
	padding-right: 10px;
}

.system-item {
	margin-bottom: 0;
	height: fit-content;
}

.system-item.selected {
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

.system-meta {
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	color: var(--primary-color);
	margin-bottom: 10px;
	font-weight: bold;
}

.system-desc {
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
