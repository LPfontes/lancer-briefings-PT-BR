<template>
	<div class="mount-item card-border" 
		:class="{ 
			'integrated': mount.type === 'Integrated',
			'is-blocked': mount.isBlocked,
			'is-sh-source': isSuperheavy0,
			'selection-target': isSelectionTarget
		}">
		<div class="mount-header">
			<span class="mount-icon material-symbols-outlined">{{ mountIcon }}</span>
			<span class="mount-label">
				{{ mount.type === 'Integrated' ? $t('pilotCreator.integratedMount') : $t(`mech.mountTypes.${mount.type.toLowerCase()}`) }} 
				// {{ mount.source === 'frame' ? $t('mech.mount') : mount.source }}
			</span>
			<span v-if="mount.isBlocked" class="blocked-tag">{{ $t('pilotCreator.blockedBySuperheavy') }}</span>
		</div>
		
		<div class="mount-slots">
			<!-- Blocked Mount Content -->
			<div v-if="mount.isBlocked" class="blocked-content">
				<span class="material-symbols-outlined">link</span>
				{{ $t('pilotCreator.linkedToSuperheavy', { mount: mount.blockedBy + 1 }) }}
			</div>

			<!-- Selection Mode Overlay -->
			<div v-else-if="selectingPartnerFor !== null" class="selection-overlay">
				<button v-if="isSelectionTarget" class="select-partner-btn" @click="$emit('select-partner', mount.index)">
					<span class="material-symbols-outlined">link</span>
					{{ $t('pilotCreator.linkAsSecondMount') }}
				</button>
				<div v-else class="selection-forbidden">
					{{ $t('pilotCreator.cannotLink') }}
				</div>
			</div>

			<!-- Integrated weapons are fixed -->
			<div v-else-if="mount.type === 'Integrated'" class="slot-row">
				<div class="slot-marker"></div>
				<div class="weapon-slot-ui">
					<div class="selected-weapon-card fixed">
						<div class="weapon-info">
							<span class="weapon-name">{{ weaponNames[0] || 'Unknown' }}</span>
							<span class="fixed-tag">{{ $t('pilotCreator.integratedSystem') }}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Standard mounts -->
			<div v-else v-for="slotIdx in slotCount" :key="slotIdx" class="slot-row" v-show="slotVisibilities[slotIdx-1]">
				<div class="slot-marker"></div>
				<div class="weapon-slot-ui">
					<button v-if="!weapons[slotIdx-1]" 
						class="select-weapon-btn"
						@click="$emit('open-modal', mount.index, slotIdx-1, mount.type)">
						<span class="material-symbols-outlined">add</span>
						{{ $t('pilotCreator.selectWeapon') }}
					</button>
					<div v-else class="selected-weapon-card">
						<div class="weapon-info" @click="$emit('open-modal', mount.index, slotIdx-1, mount.type)">
							<span class="weapon-name">{{ weaponNames[slotIdx-1] }}</span>
							<div v-if="isSuperheavyFlags[slotIdx-1] && !hasPartner" class="sh-warning">
								<span class="material-symbols-outlined">warning</span>
								{{ $t('pilotCreator.requiresSecondMount') }}
							</div>
						</div>
						<button class="remove-weapon-btn" @click="$emit('remove-weapon', mount.index, slotIdx-1)" :title="$t('general.remove')">
							<span class="material-symbols-outlined">close</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "MechMountSlot",
	props: {
		mount: Object,
		weapons: Array,
		weaponNames: Array,
		slotCount: Number,
		slotVisibilities: Array,
		mountIcon: String,
		isSuperheavyFlags: Array,
		hasPartner: Boolean,
		selectingPartnerFor: Number
	},
	emits: ['open-modal', 'remove-weapon', 'select-partner'],
	computed: {
		isSuperheavy0() {
			return this.isSuperheavyFlags && this.isSuperheavyFlags[0];
		},
		isSelectionTarget() {
			return this.selectingPartnerFor !== null && 
				   this.selectingPartnerFor !== this.mount.index && 
				   !this.mount.isBlocked && 
				   this.mount.type !== 'Integrated';
		}
	}
};
</script>

<style scoped>
/* Scoped styles will be moved here from MechBuilderStep.vue */
.mount-item {
	background: rgba(22, 28, 29, 0.6);
	margin-bottom: 20px;
}

.mount-item.integrated {
	border-left: 3px solid #f1a92a;
}

.mount-header {
	background: rgba(0, 0, 0, 0.4);
	padding: 10px 15px;
	display: flex;
	align-items: center;
	gap: 10px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.mount-icon {
	color: #af0e1e;
	font-size: 20px;
}

.integrated .mount-icon {
	color: #f1a92a;
}

.mount-label {
	font-family: "Inconsolata", monospace;
	font-size: 13px;
	color: rgba(255, 255, 255, 0.6);
	font-weight: bold;
	text-transform: uppercase;
}

.mount-slots {
	padding: 15px;
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.slot-row {
	display: flex;
	align-items: center;
	gap: 15px;
}

.slot-marker {
	width: 8px;
	height: 8px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 50%;
}

.weapon-slot-ui {
	flex: 1;
	display: flex;
}

.select-weapon-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	background: rgba(0, 0, 0, 0.4);
	border: 1px dashed rgba(255, 255, 255, 0.2);
	color: rgba(255, 255, 255, 0.5);
	padding: 8px 12px;
	font-family: "Titillium Web", sans-serif;
	font-size: 13px;
	cursor: pointer;
	transition: all 0.2s;
}

.select-weapon-btn:hover {
	border-color: var(--primary-color);
	color: var(--primary-color);
	background: rgba(175, 14, 30, 0.1);
}

.selected-weapon-card {
	flex: 1;
	display: flex;
	align-items: center;
	background: rgba(22, 28, 29, 0.8);
	border: 1px solid var(--primary-color);
	border-left: 3px solid var(--primary-color);
}

.weapon-info {
	flex: 1;
	padding: 8px 12px;
	cursor: pointer;
	display: flex;
	align-items: center;
}

.weapon-info:hover {
	background: rgba(255, 255, 255, 0.05);
}

.weapon-name {
	font-family: "Oxanium", cursive;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.9);
}

.remove-weapon-btn {
	background: transparent;
	border: none;
	border-left: 1px solid rgba(255, 255, 255, 0.1);
	color: rgba(255, 255, 255, 0.4);
	padding: 8px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
}

.remove-weapon-btn:hover {
	color: #dc3545;
	background: rgba(220, 53, 69, 0.1);
}

/* Superheavy UI */
.mount-item.is-blocked {
	border-color: rgba(255, 255, 255, 0.1);
	background: rgba(0, 0, 0, 0.4);
	opacity: 0.8;
}

.blocked-tag {
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: #af0e1e;
	background: rgba(175, 14, 30, 0.15);
	padding: 2px 6px;
	border-radius: 2px;
	margin-left: auto;
}

.blocked-content {
	padding: 15px;
	display: flex;
	align-items: center;
	gap: 10px;
	color: rgba(255, 255, 255, 0.4);
	font-family: "Inconsolata", monospace;
	font-size: 12px;
}

.sh-warning {
	display: flex;
	align-items: center;
	gap: 5px;
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: #f1a92a;
	margin-top: 4px;
}

.sh-warning span {
	font-size: 14px;
}

.selection-overlay {
	padding: 10px;
	display: flex;
	justify-content: center;
}

.select-partner-btn {
	background: rgba(175, 14, 30, 0.8);
	border: 1px solid #fff;
	color: #fff;
	padding: 8px 16px;
	font-family: "Rajdhani", sans-serif;
	font-size: 13px;
	font-weight: bold;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 8px;
	transition: all 0.2s;
}

.select-partner-btn:hover {
	background: #af0e1e;
	transform: scale(1.05);
}

.selection-forbidden {
	padding: 10px;
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	color: rgba(255, 255, 255, 0.2);
}

.selection-target {
	border: 2px dashed var(--primary-color) !important;
	background: rgba(175, 14, 30, 0.05) !important;
	animation: pulse-border 1.5s infinite;
}

@keyframes pulse-border {
	0% { border-color: rgba(175, 14, 30, 0.4); }
	50% { border-color: rgba(175, 14, 30, 1); }
	100% { border-color: rgba(175, 14, 30, 0.4); }
}
</style>
