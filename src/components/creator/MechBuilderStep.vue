<template>
	<div class="creator-step">
		<h2>{{ $t('pilotCreator.steps.mechBuilder') }}</h2>
		
		<div class="compcon-stats-container" v-if="selectedFrame">
			<!-- LEFT: MECH SKILLS -->
			<div class="skills-sidebar">
				<div v-for="(skill, i) in mechSkillDefs" :key="i" class="skill-group">
					<span class="skill-label">{{ $t(skill.key) }}</span>
					<div class="skill-points">
						<span v-for="n in 6" :key="n" class="point-hex" 
							:class="{ active: n <= mechSkills[i] }">⬢</span>
					</div>
				</div>
				<div class="sp-section">
					<div class="sp-divider"></div>
					<div class="sp-usage" :class="{ 'over-limit': usedSp > calculatedStats.PS }">
						<span class="sp-label">SP USADO</span>
						<span class="sp-value">{{ usedSp }} / {{ calculatedStats.PS }}</span>
					</div>
				</div>
			</div>

			<!-- CENTER: STATS GRID -->
			<!-- RIGHT: RESTRUCTURED STATS AREA -->
			<div class="stats-restructured-container">
				<!-- LINE 1: NAME, CHASSIS, SIZE -->
				<div class="stats-config-row">
					<div class="stat-card config-card name-field">
						<div class="stat-card-header">
							<span class="header-text">{{ $t('pilotCreator.mech.name') }}</span>
						</div>
						<div class="stat-card-input">
							<input type="text" v-model="mechName" @input="updateMechName" class="stat-input-field" />
						</div>
					</div>

					<div class="stat-card config-card frame-field">
						<div class="stat-card-header">
							<span class="header-text">{{ $t('mech.chassis') }}</span>
						</div>
						<div class="stat-card-input">
							<select v-model="selectedFrameId" @change="updateFrame" class="stat-input-field">
								<option v-for="f in availableFrames" :key="f.id" :value="f.id">{{ f.name }}</option>
							</select>
						</div>
					</div>

					<div class="stat-card config-card grit-field">
						<div class="stat-card-header">
							<span class="header-icon material-symbols-outlined">swords</span>
							<span class="header-text">{{ $t('pilotCreator.fields.grit') }}</span>
						</div>
						<div class="stat-card-value">+{{ grit }}</div>
					</div>

					<div class="size-hex-wrapper">
						<div class="size-hex-stack">
							<svg class="size-hex-bg" viewBox="0 0 24 24"><path d="M10.35,791.07v-5.71L5.4,782.5l-4.9,2.83l-4.9-2.83l-4.95,2.86v5.71l4.95,2.85l-0.01,0.01v5.71l4.95,2.86l4.95-2.86v-5.71 l-0.05-0.03L10.35,791.07z" transform="translate(12,-780)"/></svg>
							<div class="size-text">
								<span class="size-label">{{ $t('mech.stats.size') }}</span>
								<span class="size-val">{{ calculatedStats.TAM }}</span>
							</div>
						</div>
					</div>
				</div>

					<!-- LINE 2 & 3: ATTRIBUTES -->
					<div class="stats-attributes-grid">
						<!-- ROW 1: CORE STATS (Red) -->
						<div class="attributes-row row-main">
							<div style="grid-column: 1 / -1">
								<h4 class="sub-title red">{{ $t('mech.mainStats') }}</h4>
							</div>
							<div class="stat-card red">
								<div class="stat-card-header">
									<svg class="header-icon" viewBox="0 0 24 24"><path d="M0.5,802.5l10-10l-10-10l-10,10L0.5,802.5z M0.5,784.98l7.52,7.52l-7.52,7.52l-7.52-7.52L0.5,784.98z M0.5,797.76 l-0.88-0.88v-8.76l0.88-0.87l0.87,0.87v8.76L0.5,797.76z M5.75,792.5l-0.87,0.88h-8.76l-0.88-0.88l0.88-0.87h8.76L5.75,792.5z" transform="translate(12,-780)"/></svg>
									<span class="header-text">{{ $t('mech.stats.structure') }}</span>
								</div>
								<div class="stat-card-value">{{ calculatedStats.STRUC }}</div>
							</div>
							<div class="stat-card red">
								<div class="stat-card-header">
									<span class="header-icon material-symbols-outlined">warning</span>
									<span class="header-text">{{ $t('mech.stats.stress') }}</span>
								</div>
								<div class="stat-card-value">{{ calculatedStats.STRESS }}</div>
							</div>
							<div class="stat-card red">
								<div class="stat-card-header">
									<span class="header-icon material-symbols-outlined">shield</span>
									<span class="header-text">{{ $t('mech.stats.armor') }}</span>
								</div>
								<div class="stat-card-value">{{ calculatedStats.ARM }}</div>
							</div>
							<div class="stat-card red">
								<div class="stat-card-header">
									<span class="header-icon material-symbols-outlined">report_problem</span>
									<span class="header-text">{{ $t('mech.stats.save') }}</span>
								</div>
								<div class="stat-card-value">{{ calculatedStats.SALV }}</div>
							</div>
							<div class="stat-card red">
								<div class="stat-card-header">
									<span class="header-icon material-symbols-outlined">cell_tower</span>
									<span class="header-text">{{ $t('mech.stats.sensors') }}</span>
								</div>
								<div class="stat-card-value">{{ calculatedStats.SEN }}</div>
							</div>
						</div>

						<!-- ROW 2: HASE GROUPS -->
						<div class="sub-stats-container">
							<!-- HULL -->
							<div class="attributes-row">
								<div>
									<h4 class="sub-title red">{{ $t('mech.hull') }}</h4>
									<div class="stat-card red">
										<div class="stat-card-header">
											<span class="header-icon material-symbols-outlined">favorite</span>
											<span class="header-text">{{ $t('mech.stats.hp') }}</span>
										</div>
										<div class="stat-card-value">{{ calculatedStats.PV }}</div>
									</div>
									<div class="stat-card red">
										<div class="stat-card-header">
											<span class="header-icon material-symbols-outlined">build</span>
											<span class="header-text">{{ $t('mech.stats.repcap') }}</span>
										</div>
										<div class="stat-card-value">{{ calculatedStats.CAP_R }}</div>
									</div>
								</div>
							</div>

							<!-- AGILITY -->
							<div class="attributes-row">
								<div>
									<h4 class="sub-title green">{{ $t('mech.agility') }}</h4>
									<div class="stat-card green">
										<div class="stat-card-header">
											<span class="header-icon material-symbols-outlined">near_me</span>
											<span class="header-text">{{ $t('mech.stats.evasion') }}</span>
										</div>
										<div class="stat-card-value">{{ calculatedStats.EV }}</div>
									</div>
									<div class="stat-card green">
										<div class="stat-card-header">
											<span class="header-icon material-symbols-outlined">double_arrow</span>
											<span class="header-text">{{ $t('mech.stats.speed') }}</span>
										</div>
										<div class="stat-card-value">{{ calculatedStats.VEL }}</div>
									</div>
								</div>
							</div>

							<!-- SYSTEMS -->
							<div class="attributes-row">
								<div>
									<h4 class="sub-title blue">{{ $t('mech.systems') }}</h4>
									<div class="stat-card blue">
										<div class="stat-card-header">
											<span class="header-icon material-symbols-outlined">shield_lock</span>
											<span class="header-text">{{ $t('mech.stats.edef') }}</span>
										</div>
										<div class="stat-card-value">{{ calculatedStats.DEF_E }}</div>
									</div>
									<div class="stat-card blue">
										<div class="stat-card-header">
											<span class="header-icon material-symbols-outlined">cell_tower</span>
											<span class="header-text">{{ $t('mech.stats.techAttack') }}</span>
										</div>
										<div class="stat-card-value">{{ calculatedStats.ATK_T }}</div>
									</div>
								</div>
							</div>

							<!-- ENGINEERING -->
							<div class="attributes-row">
								<div>
									<h4 class="sub-title yellow">{{ $t('mech.engineering') }}</h4>
									<div class="stat-card yellow">
										<div class="stat-card-header">
											<span class="header-icon material-symbols-outlined">thermostat</span>
											<span class="header-text">{{ $t('mech.stats.heatcap') }}</span>
										</div>
										<div class="stat-card-value">{{ calculatedStats.CAP_C }}</div>
									</div>
								</div>
							</div>


						</div>
					</div>
			</div>
		</div>

		<div class="mech-builder-grid">
			<!-- MOUNTS -->
			<div class="builder-column">
				<div class="column-header">
					<span class="header-line"></span>
					<h3>{{ $t('pilotCreator.mech.mounts') }}</h3>
				</div>
				<div v-if="selectedFrame" class="mounts-list">
					<MechMountSlot
						v-for="(mount, mIdx) in allMounts" 
						:key="mIdx"
						:mount="mount"
						:slotCount="getSlotCount(mount.type)"
						:mountIcon="getMountIcon(mount.type)"
						:weapons="[getWeapon(mount.index, 0), getWeapon(mount.index, 1)]"
						:weaponNames="[getWeaponName(getWeapon(mount.index, 0)) || getWeaponName(mount.weaponId), getWeaponName(getWeapon(mount.index, 1))]"
						:slotVisibilities="[isSlotVisible(mount, 0), isSlotVisible(mount, 1)]"
						:isSuperheavyFlags="[isSuperheavy(getWeapon(mount.index, 0)), isSuperheavy(getWeapon(mount.index, 1))]"
						:hasPartner="hasPartner(mount.index)"
						:selectingPartnerFor="selectingPartnerFor"
						@open-modal="openWeaponModal"
						@remove-weapon="setWeapon"
						@select-partner="selectPartner"
					/>
				</div>
			</div>

			<!-- SYSTEMS -->
			<div class="builder-column">
				<div class="column-header">
					<span class="header-line"></span>
					<h3>{{ $t('pilotCreator.mech.systems') }}</h3>
				</div>
				<div class="systems-grid tech-scroll">
					<div class="add-system-row">
						<button class="add-system-btn" @click="openSystemModal()">
							<span class="material-symbols-outlined">add_circle</span>
							ADICIONAR SISTEMA
						</button>
					</div>

					<!-- Integrated Talent Systems -->
					<div v-for="item in integratedSystems" :key="item.id" class="system-card installed integrated">
						<div class="system-header">
							<div class="system-title">
								<span class="system-name">{{ item.name }}</span>
								<span class="integrated-source">[{{ item.sourceTalent }}]</span>
							</div>
							<div class="system-sp">0 SP</div>
						</div>
						<div class="system-body">
							<div class="system-desc" v-html="item.effect || item.description"></div>
						</div>
					</div>
					
					<div v-if="activeMechSystems.length === 0 && integratedSystems.length === 0" class="empty-systems-msg">
						NENHUM SISTEMA INSTALADO
					</div>

					<div v-for="sysId in activeMechSystems" :key="sysId" class="system-card installed">
						<div class="system-header" @click="toggleExpand(sysId)">
							<div class="system-status-indicator"></div>
							<div class="system-name">{{ getSystemName(sysId) }}</div>
							<div class="system-actions">
								<div class="sp-cost-tag">{{ getSystemSp(sysId) }} SP</div>
								<button class="remove-system-btn" @click.stop="toggleSystem(sysId)">
									<span class="material-symbols-outlined">close</span>
								</button>
							</div>
						</div>
						<div class="window-body" v-show="isExpanded(sysId)">
							<div class="system-content">
								<div class="system-desc" v-html="getSystemDesc(sysId)"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<GearSelectionModal 
			:isOpen="modalOpen"
			:title="modalType === 'weapon' ? 'SELEÇÃO DE ARMAS' : 'SELEÇÃO DE SISTEMAS'"
			:type="modalType"
			:groups="modalType === 'weapon' ? weaponGroups : systemGroups"
			:installedIds="activeMechSystems"
			:mountRestrictions="modalContext ? modalContext.restrictions : []"
			:usedSp="usedSp"
			:maxSp="calculatedStats.PS"
			@close="modalOpen = false"
			@select="handleGearSelect"
		/>
	</div>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { frames as framesData, weapons as weaponsData, systems as systemsData, tags as tagsData, talents as talentsData } from "lancer-data-pt-br";
import GearSelectionModal from "../modals/GearSelectionModal.vue";
import MechMountSlot from "./MechMountSlot.vue";

export default {
	name: "MechBuilderStep",
	components: {
		GearSelectionModal,
		MechMountSlot
	},
	data() {
		return {
			frames: framesData,
			weapons: weaponsData,
			systems: systemsData,
			mechName: pilotStore.state.activeMech.name,
			selectedFrameId: pilotStore.state.activeMech.frame,
			expandedItems: [],
			mechSkillDefs: [
				{ name: 'hull',        key: 'pilotCreator.fields.hull' },
				{ name: 'agility',     key: 'pilotCreator.fields.agility' },
				{ name: 'systems',     key: 'pilotCreator.fields.systems' },
				{ name: 'engineering', key: 'pilotCreator.fields.engineering' },
			],
			modalOpen: false,
			modalType: 'weapon',
			modalContext: null,
			talentsData: talentsData,
			selectingPartnerFor: null
		};
	},
	computed: {
		selectedFrame() {
			return this.frames.find(f => f.id === this.selectedFrameId);
		},
		availableFrames() {
			return this.frames.filter(f => this.isItemUnlocked(f));
		},
		gmsWeapons() { return this.weapons.filter(w => w.source === 'GMS'); },
		otherWeapons() { 
			return this.weapons.filter(w => w.source !== 'GMS' && this.isItemUnlocked(w)); 
		},
		allSystems() { 
			return this.systems.filter(s => this.isItemUnlocked(s)); 
		},
		activeMechSystems() {
			return pilotStore.state.activeMech.systems || [];
		},
		weaponGroups() {
			const groups = { 'GMS': this.gmsWeapons };
			for (const [key, val] of Object.entries(this.groupedWeapons)) {
				groups[key] = val;
			}
			return groups;
		},
		systemGroups() {
			return this.groupedSystems;
		},
		groupedWeapons() {
			const groups = {};
			this.otherWeapons.forEach(w => {
				let groupName = w.license || w.source;
				if (w.talent_id) {
					groupName = "TALENTOS";
				}
				if (!groupName) groupName = 'OUTROS';
				
				if (!groups[groupName]) groups[groupName] = [];
				groups[groupName].push(w);
			});
			return groups;
		},
		groupedSystems() {
			const groups = {};
			this.allSystems.forEach(s => {
				let groupName = s.license || s.source;
				if (s.talent_id) {
					groupName = "TALENTOS";
				}
				if (!groupName) groupName = 'OUTROS';

				if (!groups[groupName]) groups[groupName] = [];
				groups[groupName].push(s);
			});
			return groups;
		},
		mechSkills() { return pilotStore.state.mech_skills || [0, 0, 0, 0]; },
		grit() {
			return Math.ceil(pilotStore.state.level / 2);
		},
		calculatedStats() {
			try {
				if (!this.selectedFrame || !this.selectedFrame.stats) return {};
				const s = this.selectedFrame.stats;
				const p = this.mechSkills; // [Hull, Agi, Sys, Eng]
				const grit = this.grit;
				
				// System Points (SP) = base SP + Systems skill + ceil(Grit/2)
				const maxSp = (s.sp || 0) + (p[2] || 0) + Math.ceil(grit / 2);

				return {
					'TAM': s.size || 0,
					'PV': (s.hp || 0) + ((p[0] || 0) * 2),
					'ARM': s.armor || 0,
					'EV': (s.evasion || 0) + (p[1] || 0),
					'DEF_E': (s.edef || 0) + (p[2] || 0),
					'CAP_C': (s.heatcap || 0) + (p[3] || 0),
					'VEL': (s.speed || 0) + Math.floor((p[1] || 0) / 2),
					'CAP_R': (s.repcap || 0) + Math.floor((p[0] || 0) / 2),
					'SEN': s.sensor_range || 0,
					'ATK_T': (s.tech_attack >= 0 ? '+' : '') + ((s.tech_attack || 0) + (p[2] || 0)),
					'SALV': s.save || 0,
					'PS': maxSp,
					'STRUC': 4,
					'STRESS': 4
				};
			} catch (e) {
				console.error("Error calculating mech stats:", e);
				return {};
			}
		},
		usedSp() {
			let total = 0;
			// Standard systems
			this.activeMechSystems.forEach(id => {
				const s = this.systems.find(s => s.id === id);
				// If it's a talent item, check if it's integrated (integrated items usually cost 0 SP or are special)
				if (s) {
					// Engineer prototype systems/weapons don't cost SP if they are integrated
					if (s.talent_id && this.isItemIntegrated(s)) {
						total += 0;
					} else {
						total += (s.sp || 0);
					}
				}
			});
			return total;
		},
		talentIntegratedItems() {
			// Find all items granted automatically by active talents
			const items = [];
			const activeTalents = pilotStore.state.talents;
			
			activeTalents.forEach(t => {
				const talentDef = this.talentsData?.find(td => td.id === t.id);
				if (!talentDef) return;
				
				// Check each rank up to current rank
				for (let i = 0; i < t.rank; i++) {
					const rank = talentDef.ranks[i];
					if (rank && rank.integrated) {
						rank.integrated.forEach(itemId => {
							const item = this.weapons.find(w => w.id === itemId) || this.systems.find(s => s.id === itemId);
							if (item && !items.find(existing => existing.id === item.id)) {
								items.push({ ...item, sourceTalent: talentDef.name, integrated: true });
							}
						});
					}
				}
			});
			return items;
		},
		allMounts() {
			if (!this.selectedFrame) return [];
			const shPartners = pilotStore.state.activeMech.sh_partners || {};
			
			const mounts = this.selectedFrame.mounts.map((m, i) => {
				// Check if this mount is blocked by a Superheavy weapon in ANOTHER mount
				let blockedBy = null;
				for (const [shIdx, pIdx] of Object.entries(shPartners)) {
					if (Number(pIdx) === i) {
						blockedBy = Number(shIdx);
						break;
					}
				}
				
				return { 
					type: m, 
					index: i, 
					source: 'frame',
					isBlocked: blockedBy !== null,
					blockedBy: blockedBy
				};
			});
			
			// Add integrated mounts from talents
			this.talentIntegratedItems.forEach(item => {
				if (this.weapons.some(w => w.id === item.id)) {
					mounts.push({ type: 'Integrated', weaponId: item.id, source: item.sourceTalent });
				}
			});
			
			return mounts;
		},
		integratedSystems() {
			return this.talentIntegratedItems.filter(item => this.systems.some(s => s.id === item.id));
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
		toggleSystem(id) {
			const isInstalled = pilotStore.state.activeMech.systems.includes(id);
			if (!isInstalled) {
				const sys = this.systems.find(s => s.id === id);
				const cost = sys ? (sys.sp || 0) : 0;
				if (this.usedSp + cost > this.calculatedStats.PS) {
					return;
				}
			}
			pilotStore.toggleMechSystem(id);
		},
		openWeaponModal(mountIdx, slotIdx, mountType) {
			this.modalType = 'weapon';
			let restrictions = [];
			const mt = mountType.toLowerCase();
			
			if (mt === 'aux/aux') {
				restrictions = ['Auxiliary'];
			} else if (mt === 'main/aux') {
				if (slotIdx === 0) restrictions = ['Main', 'Auxiliary'];
				else restrictions = ['Auxiliary'];
			} else if (mt === 'flex') {
				if (slotIdx === 0) restrictions = ['Main', 'Auxiliary'];
				else restrictions = ['Auxiliary'];
			} else if (mt === 'main') {
				restrictions = ['Main', 'Auxiliary'];
			} else if (mt === 'heavy') {
				restrictions = ['Superheavy', 'Heavy', 'Main', 'Auxiliary'];
			}

			this.modalContext = { 
				mountIdx, 
				slotIdx, 
				mountType, 
				restrictions,
				isHeavy: mt === 'heavy'
			};
			this.modalOpen = true;
		},
		openSystemModal() {
			this.modalType = 'system';
			this.modalContext = null;
			this.modalOpen = true;
		},
		handleGearSelect(itemId) {
			if (this.modalType === 'weapon' && this.modalContext) {
				const weapon = this.weapons.find(w => w.id === itemId);
				const isSH = weapon && weapon.mount === 'Superheavy';
				
				this.setWeapon(this.modalContext.mountIdx, this.modalContext.slotIdx, itemId);
				
				if (isSH) {
					this.selectingPartnerFor = this.modalContext.mountIdx;
				}
				
				this.modalOpen = false;
			} else if (this.modalType === 'system') {
				this.toggleSystem(itemId);
			}
		},
		isSuperheavy(weaponId) {
			if (!weaponId) return false;
			const w = this.weapons.find(w => w.id === weaponId);
			return w && (w.mount === 'Superheavy' || w.size === 'Superheavy');
		},
		selectPartner(partnerIdx) {
			if (this.selectingPartnerFor === null) return;
			if (partnerIdx === this.selectingPartnerFor) return; 
			
			pilotStore.setSuperheavyPartner(this.selectingPartnerFor, partnerIdx);
			this.selectingPartnerFor = null;
		},
		hasPartner(mountIdx) {
			return pilotStore.state.activeMech.sh_partners[mountIdx] !== undefined;
		},
		getWeaponName(weaponId) {
			if (!weaponId) return '';
			const w = this.weapons.find(w => w.id === weaponId);
			return w ? w.name : weaponId;
		},
		getSystemName(systemId) {
			const s = this.systems.find(s => s.id === systemId);
			return s ? s.name : systemId;
		},
		getSystemSp(systemId) {
			const s = this.systems.find(s => s.id === systemId);
			return s ? s.sp : 0;
		},
		getSystemDesc(systemId) {
			const s = this.systems.find(s => s.id === systemId);
			return s ? (s.description || s.effect) : '';
		},
		getMountIcon(type) {
			const t = (type || '').toLowerCase();
			if (t === 'integrated') return 'auto_awesome';
			if (t.includes('main')) return 'swords';
			if (t.includes('flex')) return 'unfold_more';
			if (t.includes('heavy')) return 'explosion';
			if (t.includes('aux')) return 'add_circle';
			if (t.includes('int')) return 'memory';
			return 'settings_input_component';
		},
		isItemUnlocked(item) {
			if (item.talent_id) {
				const talent = pilotStore.state.talents.find(t => t.id === item.talent_id);
				if (talent && talent.rank >= (item.talent_rank || 1)) return true;
				if (this.talentIntegratedItems.find(i => i.id === item.id)) return true;
				return false;
			}
			if (item.source === 'GMS' || item.license === 'GMS' || (item.license_level === 0 && !item.license_id)) return true;
			if (item.license_id) {
				const license = pilotStore.state.licenses.find(l => l.id === item.license_id);
				if (license && license.rank >= (item.license_level || 0)) return true;
			}
			return false;
		},
		isItemIntegrated(item) {
			return item.integrated || this.talentIntegratedItems.some(i => i.id === item.id);
		},
		isSlotVisible(mount, slotIdx) {
			if (slotIdx === 0) return true;
			if (slotIdx === 1) {
				const weapon0Id = this.getWeapon(mount.index, 0);
				if (!weapon0Id) return true;
				const weapon0 = this.weapons.find(w => w.id === weapon0Id);
				if (weapon0 && weapon0.mount === 'Main' && mount.type.toLowerCase() === 'flex') {
					return false;
				}
			}
			return true;
		}
	}
};
</script>

<style scoped>
.creator-step {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

h2 {
	display: flex;
	align-items: center;
	gap: 15px;
}

.mech-config {
	background: #0b1119;
	padding: 20px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	margin-bottom: 30px;
}

.compcon-stats-container {
	display: flex;
	gap: 20px;
	align-items: flex-start;
}

.skills-sidebar {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.skill-group {
	display: flex;
	flex-direction: column;
}

.skill-label {
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.85);
	text-transform: uppercase;
	letter-spacing: 1px;
	margin-bottom: 2px;
}

.skill-points {
	display: flex;
	gap: 4px;
	margin-left: 4px;
}

.point-hex {
	font-size: 24px;
	line-height: 1;
	color: rgba(255, 255, 255, 0.1);
	transition: all 0.3s;
}

.point-hex.active {
	color: rgba(255, 255, 255, 0.85);
	text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
}

.sp-section {
	margin-top: auto;
}

.sp-divider {
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	margin-bottom: 8px;
}

.sp-usage {
	display: flex;
	flex-direction: column;
}

.sp-usage.over-limit .sp-value {
	color: #ff3b30;
	text-shadow: 0 0 10px rgba(255, 59, 48, 0.5);
}

.sp-label {
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.5);
	text-transform: uppercase;
}

.sp-value {
	font-family: "Oxanium", cursive;
	font-size: 14px;
	color: #f1a92a;
}

.size-hex-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	position: relative;
	width: 80px;
	height: 80px;
	margin: 0 auto;
}

.size-hex-bg {
	position: absolute;
	width: 100%;
	height: 100%;
	background: var(--primary-color);
	clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
	z-index: 1;
}

.size-content {
	position: relative;
	z-index: 2;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: white;
}

.size-label {
	font-family: "Titillium Web", sans-serif;
	font-size: 10px;
	font-weight: bold;
	text-transform: uppercase;
	letter-spacing: 1px;
}

.size-value {
	font-family: "Big Shoulders Display", cursive;
	font-size: 32px;
	font-weight: 900;
	line-height: 1;
}

.selected-frame-visual {
	max-width: 300px;
	background: rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(175, 14, 30, 0.3);
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	overflow: hidden;
}

.frame-img {
	object-fit: contain;
	filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.8));
	z-index: 1;
}

.visual-corner {
	position: absolute;
	width: 8px;
	height: 8px;
	border: 1px solid var(--primary-color);
}

.top-left { top: 5px; left: 5px; border-right: 0; border-bottom: 0; }
.top-right { top: 5px; right: 5px; border-left: 0; border-bottom: 0; }
.bottom-left { bottom: 5px; left: 5px; border-right: 0; border-top: 0; }
.bottom-right { bottom: 5px; right: 5px; border-left: 0; border-top: 0; }

.mech-builder-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 40px;
}

.stats-restructured-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 15px;
	background: rgba(0, 0, 0, 0.4);
}

.stat-input-field {
	width: 100%;
	height: 100%;
	background: transparent;
	border: none;
	color: white;
	padding: 0 10px;
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	font-weight: 700;
	outline: none;
	text-transform: uppercase;
}

select.stat-input-field {
	cursor: pointer;
}

select.stat-input-field option {
	background: #1c2630;
	color: white;
}

.stat-card {
	background: #1c2630;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.stats-config-row {
	display: flex;
	gap: 8px;
	align-items: center;
}

.name-field { flex: 2; }
.frame-field { flex: 3; }
.grit-field { flex: 1.2; }

.stats-attributes-grid {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.attributes-row {
	display: grid;
	gap: 6px;
}

.row-main { grid-template-columns: repeat(5, 1fr); }

.sub-stats-container {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 8px;
}

.sub-title {
	font-family: "Oxanium", cursive;
	font-size: 14px;
	letter-spacing: 1px;
	margin-bottom: 4px;
	padding: 2px 8px;
	text-transform: uppercase;
	font-weight: 800;
}

.sub-title.red { background: var(--primary-color); color: rgba(255, 255, 255, 0.85); }
.sub-title.blue { background: #0c4d99; color: rgba(255, 255, 255, 0.85); }
.sub-title.green { background: #00a256; color: rgba(255, 255, 255, 0.85); }
.sub-title.yellow { background: #d1920a; color: rgba(255, 255, 255, 0.85); }

.stat-card-input {
	height: 32px;
	display: flex;
	align-items: center;
	background: rgba(0, 0, 0, 0.4);
}

.stat-card-header {
	background-color: var(--primary-color);
	height: 24px;
	display: flex;
	align-items: center;
	padding: 0 8px;
	gap: 6px;
	justify-content: center;
}

.stat-card-value {
	font-family: "Big Shoulders Display", cursive;
	font-size: 26px;
	font-weight: 900;
	padding: 8px;
	text-align: center;
	background: rgba(0, 0, 0, 0.2);
}

.stat-card.red {
	margin-bottom: 8px;
	border-bottom: 2px solid var(--primary-color);
}

.stat-card.blue { 
	margin-bottom: 8px;
	border-bottom: 2px solid #0c4d99;
}
.stat-card.green { 
	margin-bottom: 8px;
	border-bottom: 2px solid #00a256; 
}
.stat-card.yellow { 
	border-bottom: 2px solid #d1920a; 
}

.stat-card.red .stat-card-header {
	background: var(--primary-color);
	color: rgba(255, 255, 255, 0.85);
}

.stat-card.blue .stat-card-header { background: #0c4d99; color: rgba(255, 255, 255, 0.85); }
.stat-card.green .stat-card-header { background: #00a256; color: rgba(255, 255, 255, 0.85); }
.stat-card.yellow .stat-card-header { background: #d1920a; color: rgba(255, 255, 255, 0.85); }

.header-icon {
	width: 20px;
	height: 20px;
	fill: white;
	color: white;
	font-size: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.header-icon svg {
	width: 20px;
	height: 20px;
}

.header-text {
	color: rgba(255, 255, 255, 0.85);
	font-family: "Oxanium", cursive;
	font-size: 16px;
	font-weight: 600;
	letter-spacing: 0.5px;
}

.stat-card-header.dark {
	background: #0b1119;
	color: #f1a92a;
}

.stat-card-value {
	padding: 8px;
	font-family: "Rajdhani", sans-serif;
	font-size: 34px;
	font-weight: 700;
	text-align: center;
	color: rgba(255, 255, 255, 0.85);
	line-height: 1;
}

.grit-field .stat-card-value {
	font-size: 24px;
	padding: 4px;
	color: #f1a92a;
}

.size-hex-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
}

.size-hex-stack {
	position: relative;
	width: 75px;
	height: 75px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.size-hex-bg {
	position: absolute;
	width: 75px;
	height: 75px;
	fill: var(--primary-color);
	z-index: 1;
}

.size-text {
	position: absolute;
	top: 6px;
	left: 1px;
	width: 100%;
	height: 100%;
	z-index: 2;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: rgba(255, 255, 255, 0.85);
	text-align: center;
}

.size-label {
	font-family: "Oxanium", cursive;
	font-size: 10px;
	font-weight: 700;
	text-transform: uppercase;
}

.size-val {
	font-family: "Rajdhani", sans-serif;
	font-size: 28px;
	font-weight: 800;
	line-height: 1;
}

.mech-builder-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 40px;
}

.column-header {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 20px;
}

.header-line {
	width: 4px;
	height: 20px;
	background: var(--primary-color);
	box-shadow: 0 0 10px var(--primary-color);
}

.column-header h3 {
	
	color: var(--primary-color);
	font-size: 22px;
	margin: 0;
	letter-spacing: 2px;
}

.mounts-list {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.systems-grid {
	display: flex;
	flex-direction: column;
	gap: 20px;
	max-height: 600px;
	overflow-y: auto;
	padding-right: 8px;
}

.add-system-row {
	margin-bottom: 10px;
}

.add-system-btn {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	background: rgba(0, 0, 0, 0.4);
	border: 1px dashed var(--primary-color);
	color: var(--primary-color);
	padding: 12px;
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.2s;
}

.add-system-btn:hover {
	background: rgba(175, 14, 30, 0.2);
}

.empty-systems-msg {
	font-family: "Oxanium", cursive;
	color: rgba(255, 255, 255, 0.3);
	text-align: center;
	padding: 20px;
	font-size: 14px;
	border: 1px dashed rgba(255, 255, 255, 0.1);
}

.remove-system-btn {
	background: transparent;
	border: none;
	color: rgba(255, 255, 255, 0.4);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: color 0.2s;
}

.remove-system-btn:hover {
	color: #dc3545;
}

.system-card {
	background: rgba(22, 28, 29, 0.8);
	border: 1px solid rgba(255, 255, 255, 0.05);
	border-left: 2px solid #333;
	margin-bottom: 4px;
	transition: all 0.2s;
}

.system-card.installed {
	border-left-color: #27c93f;
	background: rgba(39, 201, 63, 0.05);
}

.system-card.integrated {
	border-left: 3px solid #f1a92a;
	background: rgba(241, 169, 42, 0.05);
}

.integrated-source {
	font-size: 10px;
	color: #f1a92a;
	margin-left: 5px;
	font-family: "Inconsolata", monospace;
}

.system-header {
	padding: 10px 15px;
	display: flex;
	align-items: center;
	gap: 12px;
	cursor: pointer;
}

.system-status-indicator {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: #333;
}

.installed .system-status-indicator {
	background: #27c93f;
	box-shadow: 0 0 8px #27c93f;
}

.system-name {
	flex: 1;
	font-family: "Big Shoulders Display", cursive;
	font-size: 15px;
	font-weight: 800;
	color: #eee;
	letter-spacing: 0.5px;
	text-transform: uppercase;
}

.system-actions {
	display: flex;
	align-items: center;
	gap: 12px;
}

.sp-cost-tag {
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: var(--primary-color);
	font-weight: 700;
}

.install-btn-tactical {
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	color: #999;
	padding: 4px 10px;
	font-family: "Big Shoulders Display", cursive;
	font-size: 12px;
	font-weight: 800;
	display: flex;
	align-items: center;
	gap: 6px;
	cursor: pointer;
	transition: all 0.2s;
}

.install-btn-tactical span { font-size: 14px; }

.install-btn-tactical:hover {
	background: rgba(255, 255, 255, 0.1);
	color: #fff;
}

.install-btn-tactical.active {
	background: #27c93f;
	border-color: #27c93f;
	color: #000;
}

.system-content {
	padding: 15px;
	background: rgba(0, 0, 0, 0.2);
	border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.system-meta {
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: var(--primary-color);
	margin-bottom: 8px;
}

.system-desc {
	font-family: "Titillium Web", sans-serif;
	font-size: 13px;
	color: rgba(255, 255, 255, 0.8);
	line-height: 1.5;
}

.system-desc :deep(br) {
	content: "";
	display: block;
	margin-bottom: 8px;
}
</style>
