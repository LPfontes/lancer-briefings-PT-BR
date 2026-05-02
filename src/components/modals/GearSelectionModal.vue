<template>
	<transition name="modal-fade">
		<div class="modal-overlay" v-if="isOpen" @click.self="$emit('close')">
			<div class="modal-content">
				<!-- Header -->
				<div class="modal-header">
					<h2 class="modal-title">{{ title }}</h2>
					<button class="close-btn" @click="$emit('close')">
						<span class="material-symbols-outlined">close</span>
					</button>
				</div>
				
				<!-- Controls -->
				<div class="modal-controls">
					<div class="controls-top">
						<div class="search-box">
							<span class="material-symbols-outlined search-icon">search</span>
							<input type="text" v-model="searchQuery" :placeholder="$t('general.search') || 'BUSCAR...'" class="search-input" />
						</div>
						<div class="group-toggle" v-if="type === 'weapon'">
							<span class="toggle-label">AGRUPAR POR:</span>
							<button class="toggle-btn" :class="{ active: groupBy === 'manufacturer' }" @click="groupBy = 'manufacturer'">FABRICANTE</button>
							<button class="toggle-btn" :class="{ active: groupBy === 'type' }" @click="groupBy = 'type'">TIPO</button>
						</div>
					</div>
					<div class="filter-pills" v-if="availableGroups.length > 1">
						<button 
							class="filter-pill" 
							:class="{ active: activeGroup === 'ALL' }" 
							@click="activeGroup = 'ALL'">
							TODOS FABRICANTES
						</button>
						<button 
							v-for="g in availableGroups" 
							:key="g"
							class="filter-pill" 
							:class="{ active: activeGroup === g }" 
							@click="activeGroup = g">
							{{ g }}
						</button>
					</div>

					<div class="filter-pills types" v-if="type === 'weapon' && availableTypes.length > 1">
						<button 
							class="filter-pill" 
							:class="{ active: activeType === 'ALL' }" 
							@click="activeType = 'ALL'">
							TODOS OS TIPOS
						</button>
						<button 
							v-for="t in availableTypes" 
							:key="t"
							class="filter-pill" 
							:class="{ active: activeType === t }" 
							@click="activeType = t">
							{{ $t(`mech.weaponTypes.${t.toLowerCase()}`) || t }}
						</button>
					</div>
				</div>

				<!-- Body -->
				<div class="modal-body tech-scroll">
					<div v-if="Object.keys(filteredGroups).length === 0" class="empty-state">
						<span class="material-symbols-outlined">search_off</span>
						<p>NENHUM RESULTADO ENCONTRADO</p>
					</div>
					
					<div v-for="(items, groupName) in filteredGroups" :key="groupName" class="gear-group">
						<div class="group-header">
							<span class="header-line"></span>
							<h3>{{ groupName }}</h3>
						</div>
						
						<div class="gear-grid">
							<TacticalGearCard
								v-for="item in items"
								:key="item.id"
								:item="item"
								:type="type"
								:isInstalled="isInstalled(item.id)"
								:isSelectable="isSelectable(item)"
								@click="openDetail"
								@select="$emit('select', $event)"
							/>
						</div>
					</div>
				</div>

				<!-- Footer -->
				<div class="modal-footer">
					<div class="sp-section" v-if="type === 'system'">
						<div class="sp-usage" :class="{ 'over-limit': usedSp > maxSp }">
							<span class="sp-label">SP USADO //</span>
							<span class="sp-value">{{ usedSp }} / {{ maxSp }}</span>
						</div>
					</div>
					<div class="footer-actions">
						<button class="confirm-btn" @click="$emit('close')">
							<span class="material-symbols-outlined">check_circle</span>
							CONFIRMAR SELEÇÃO
						</button>
					</div>
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
import { tags as tagsData } from "lancer-data-pt-br";
import GearDetailModal from './GearDetailModal.vue';
import TacticalGearCard from './TacticalGearCard.vue';

export default {
	name: "GearSelectionModal",
	emits: ["close", "select"],
	components: {
		GearDetailModal,
		TacticalGearCard
	},
	props: {
		isOpen: Boolean,
		title: String,
		groups: {
			type: Object,
			default: () => ({})
		},
		type: {
			type: String,
			default: 'weapon'
		},
		installedIds: {
			type: Array,
			default: () => []
		},
		mountRestrictions: {
			type: Array,
			default: () => []
		},
		usedSp: {
			type: Number,
			default: 0
		},
		maxSp: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			searchQuery: "",
			activeGroup: "ALL",
			activeType: "ALL",
			groupBy: "manufacturer",
			showDetail: false,
			selectedGear: null
		};
	},
	computed: {
		availableGroups() {
			return Object.keys(this.groups).sort((a, b) => {
				if (a === 'GMS') return -1;
				if (b === 'GMS') return 1;
				return a.localeCompare(b);
			});
		},
		availableTypes() {
			const types = new Set();
			Object.values(this.groups).flat().forEach(item => {
				if (item.type) types.add(item.type);
			});
			return Array.from(types).sort();
		},
		filteredGroups() {
			const query = this.searchQuery.toLowerCase();
			const result = {};

			if (this.type !== 'weapon' || this.groupBy === 'manufacturer') {
				// Original manufacturer grouping
				for (const [groupName, items] of Object.entries(this.groups)) {
					if (this.activeGroup !== 'ALL' && this.activeGroup !== groupName) continue;
					
					const filteredItems = items.filter(item => {
						if (query) {
							const nameMatch = (item.name || '').toLowerCase().includes(query);
							const descMatch = (item.description || '').toLowerCase().includes(query) || (item.effect || '').toLowerCase().includes(query);
							if (!nameMatch && !descMatch) return false;
						}

						if (this.type === 'weapon') {
							if (this.mountRestrictions.length > 0 && !this.mountRestrictions.includes(item.mount)) return false;
							if (this.activeType !== 'ALL' && item.type !== this.activeType) return false;
						}

						return true;
					});
					
					if (filteredItems.length > 0) {
						result[groupName] = filteredItems;
					}
				}
			} else {
				// Group by Type
				const allItems = Object.values(this.groups).flat();
				const types = this.activeType === 'ALL' ? this.availableTypes : [this.activeType];
				
				types.forEach(t => {
					const tItems = allItems.filter(item => {
						if (item.type !== t) return false;
						if (this.activeGroup !== 'ALL' && item.license !== this.activeGroup && item.source !== this.activeGroup) return false;
						
						if (query) {
							const nameMatch = (item.name || '').toLowerCase().includes(query);
							const descMatch = (item.description || '').toLowerCase().includes(query) || (item.effect || '').toLowerCase().includes(query);
							if (!nameMatch && !descMatch) return false;
						}

						if (this.mountRestrictions.length > 0 && !this.mountRestrictions.includes(item.mount)) return false;
						
						return true;
					});

					if (tItems.length > 0) {
						const translatedType = this.$t(`mech.weaponTypes.${t.toLowerCase()}`) || t;
						result[translatedType.toUpperCase()] = tItems;
					}
				});
			}
			return result;
		}
	},
	methods: {
		openDetail(item) {
			this.selectedGear = item;
			this.showDetail = true;
		},
		isInstalled(id) {
			return this.installedIds.includes(id);
		},
		getTagName(tagId) {
			const tag = tagsData.find(t => t.id === tagId);
			return tag ? tag.name : tagId.replace('tg_', '').toUpperCase();
		},
		getTagDesc(tagObj) {
			const tagData = tagsData.find(t => t.id === tagObj.id);
			if (!tagData) return '';
			let desc = tagData.description || '';
			if (tagObj.val) {
				desc = desc.replace('{VAL}', tagObj.val);
			}
			return desc;
		},
		formatTag(tag) {
			const name = this.getTagName(tag.id);
			if (name.includes('{VAL}')) {
				return name.replace('{VAL}', tag.val || '0');
			}
			return `${name} ${tag.val ? tag.val : ''}`.trim();
		},
		isSelectable(item) {
			if (this.type !== 'system') return true;
			if (this.isInstalled(item.id)) return true;
			return (this.usedSp + (item.sp || 0)) <= this.maxSp;
		}
	},
	watch: {
		isOpen(val) {
			if (val) {
				this.searchQuery = "";
				this.activeGroup = "ALL";
				this.activeType = "ALL";
			}
		}
	}
};
</script>

<style scoped>
/* Modal Base */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.85);
	backdrop-filter: blur(4px);
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.modal-content {
	background: #0b1119;
	width: 100%;
	max-width: 60%;
	max-height: 70vh;
	border: 2px solid var(--primary-color);
	box-shadow: 0 0 30px rgba(175, 14, 30, 0.4);
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: hidden;
}

/* Header */
.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px 25px;
	background: linear-gradient(90deg, rgba(175, 14, 30, 0.2) 0%, rgba(11, 17, 25, 0) 100%);
	border-bottom: 1px solid rgba(175, 14, 30, 0.3);
}

.modal-title {
	font-family: "Oxanium", cursive;
	color: var(--primary-color);
	font-size: 24px;
	margin: 0;
	text-transform: uppercase;
	letter-spacing: 2px;
}

.close-btn {
	background: transparent;
	border: none;
	color: rgba(255, 255, 255, 0.5);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: color 0.2s;
}

.close-btn:hover {
	color: var(--primary-color);
}

/* Controls */
.modal-controls {
	padding: 15px 25px;
	display: flex;
	flex-direction: column;
	gap: 15px;
	background: rgba(0, 0, 0, 0.3);
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.controls-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 20px;
}

.group-toggle {
	display: flex;
	align-items: center;
	gap: 10px;
	background: rgba(255, 255, 255, 0.05);
	padding: 4px;
	border-radius: 4px;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-label {
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: rgba(255, 255, 255, 0.4);
	margin-left: 5px;
	letter-spacing: 1px;
}

.modal-footer {
	padding: 20px 25px;
	background: rgba(0, 0, 0, 0.7);
	border-top: 1px solid rgba(175, 14, 30, 0.4);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.footer-actions {
	display: flex;
	gap: 15px;
}

.confirm-btn {
	background: var(--primary-color);
	border: none;
	color: white;
	padding: 10px 25px;
	font-family: "Rajdhani", sans-serif;
	font-size: 16px;
	font-weight: 800;
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	transition: all 0.2s;
	letter-spacing: 1px;
}

.confirm-btn:hover {
	background: #d40d1b;
	box-shadow: 0 0 20px rgba(175, 14, 30, 0.4);
	transform: translateY(-1px);
}

.confirm-btn .material-symbols-outlined {
	font-size: 20px;
}

.sp-section {
	display: flex;
	justify-content: flex-end;
}

.sp-usage {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 2px;
}

.sp-usage.over-limit .sp-value {
	color: #af0e1e;
	text-shadow: 0 0 10px rgba(175, 14, 30, 0.5);
}

.sp-label {
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: rgba(255, 255, 255, 0.4);
	letter-spacing: 1px;
}

.sp-value {
	font-family: "Rajdhani", sans-serif;
	font-size: 24px;
	font-weight: 700;
	color: #f1a92a;
}

.toggle-btn {
	background: transparent;
	border: none;
	color: rgba(255, 255, 255, 0.5);
	padding: 4px 10px;
	font-family: "Titillium Web", sans-serif;
	font-size: 11px;
	cursor: pointer;
	border-radius: 2px;
	transition: all 0.2s;
}

.toggle-btn.active {
	background: var(--primary-color);
	color: white;
}

.search-box {
	flex: 1;
	display: flex;
	align-items: center;
	background: rgba(0, 0, 0, 0.5);
	border: 1px solid rgba(255, 255, 255, 0.2);
	padding: 8px 15px;
	border-radius: 4px;
}

.search-icon {
	color: rgba(255, 255, 255, 0.5);
	margin-right: 10px;
}

.search-input {
	flex: 1;
	background: transparent;
	border: none;
	color: rgba(255, 255, 255, 0.9);
	font-family: "Inconsolata", monospace;
	font-size: 16px;
	outline: none;
}

.filter-pills {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}

.filter-pill {
	background: transparent;
	border: 1px solid rgba(255, 255, 255, 0.2);
	color: rgba(255, 255, 255, 0.6);
	padding: 4px 12px;
	border-radius: 12px;
	font-family: "Titillium Web", sans-serif;
	font-size: 13px;
	cursor: pointer;
	transition: all 0.2s;
}

.filter-pill:hover {
	border-color: rgba(255, 255, 255, 0.5);
	color: rgba(255, 255, 255, 0.9);
}

.filter-pill.active {
	background: var(--primary-color);
	border-color: var(--primary-color);
	color: rgba(255, 255, 255, 0.9);
}

.filter-pills.types {
	border-top: 1px dashed rgba(255, 255, 255, 0.1);
	padding-top: 10px;
}

/* Body */
.modal-body {
	flex: 1;
	padding: 20px 25px;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 25px;
}

.gear-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 15px;
}

@media (max-width: 800px) {
	.gear-grid {
		grid-template-columns: 1fr;
	}
}

.gear-group {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.group-header {
	display: flex;
	align-items: center;
	gap: 12px;
}

.header-line {
	width: 4px;
	height: 18px;
	background: var(--primary-color);
}

.group-header h3 {
	font-family: "Oxanium", cursive;
	color: rgba(255, 255, 255, 0.85);
	font-size: 18px;
	margin: 0;
	letter-spacing: 1px;
}

.gear-desc ::v-deep(strong) {
	color: rgba(255, 255, 255, 0.9);
}

/* Animations */
.modal-fade-enter-active, .modal-fade-leave-active {
	transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
	opacity: 0;
}

.accordion-enter-active, .accordion-leave-active {
	transition: max-height 0.3s ease-out, opacity 0.3s ease, padding 0.3s ease;
	max-height: 500px;
	overflow: hidden;
}

.accordion-enter-from, .accordion-leave-to {
	max-height: 0;
	opacity: 0;
	padding-top: 0;
	padding-bottom: 0;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 200px;
	color: rgba(255, 255, 255, 0.3);
}

.empty-state span {
	font-size: 48px;
	margin-bottom: 10px;
}

.empty-state p {
	font-family: "Oxanium", cursive;
	font-size: 18px;
	letter-spacing: 1px;
}
</style>
