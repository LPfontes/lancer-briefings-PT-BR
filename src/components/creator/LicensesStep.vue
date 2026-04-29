<template>
	<div class="creator-step">
		<h2>{{ $t('pilotCreator.steps.licenses') }}</h2>
		<p class="desc">{{ $t('pilotCreator.sandboxDesc') }}</p>
		
		<div class="manufacturers-tabs">
			<button v-for="mf in manufacturers" 
				:key="mf.id" 
				:class="{ active: activeMf === mf.id }"
				@click="activeMf = mf.id"
				class="mf-tab">
				{{ mf.id }}
			</button>
		</div>

		<div class="licenses-list" v-if="activeMf">
			<div v-for="license in filteredLicenses" :key="license.id" 
				class="event-window license-item" 
				:class="{ expanded: isExpanded(license.id), active: getRank(license.license_id) > 0 }">
				<div class="window-title-bar" @click="toggleExpand(license.id)">
					<div class="window-controls">
						<div class="rank-stepper">
							<button @click.stop="adjust(license.license_id, -1)" :disabled="getRank(license.license_id) <= 0">‹</button>
							<div class="rank-display">
								<span class="rank-label">{{ $t('pilotCreator.rank') }}</span>
								<span class="rank-val">{{ getRank(license.license_id) }}</span>
							</div>
							<button @click.stop="adjust(license.license_id, 1)" :disabled="getRank(license.license_id) >= 3">›</button>
						</div>
					</div>
					<div class="window-title">{{ license.name }}</div>
					<div class="window-status">
						{{ isExpanded(license.id) ? $t('pilotCreator.infoOpen') : $t('pilotCreator.infoClosed') }}
					</div>
				</div>
				<transition name="accordion">
					<div class="window-body" v-show="isExpanded(license.id)">
						<div class="license-content">
							<div class="frame-info profile-layout">
								<!-- Coluna 1: Identidade e Núcleo -->
								<div class="profile-col col-1">
									<div class="frame-visual-top" v-if="getFrameImage(license)">
										<div class="image-wrapper">
											<img :src="getFrameImage(license)" :alt="license.name" class="frame-img" />
											<button class="info-btn" @click.stop="toggleDesc(license.id)" :title="$t('pilotCreator.infoDesc')">
												<span class="info-icon">i</span>
											</button>
										</div>
									</div>

									<transition name="fade">
										<div class="floating-desc-box" v-if="isDescVisible(license.id)">
											<div class="desc-header">
												<span>{{ license.name }}</span>
												<button @click.stop="toggleDesc(license.id)" class="close-desc">×</button>
											</div>
											<div class="frame-desc-text" v-html="license.description"></div>
										</div>
									</transition>

									<section class="core-section" v-if="license.core_system">
										<h3 class="section-title collapsible" @click="toggleSub(license.id, 'core')">
											{{ $t('mech.coreSystem') }}
											<span class="collapse-icon">{{ isSubExpanded(license.id, 'core') ? '−' : '+' }}</span>
										</h3>
										<transition name="accordion">
											<div class="section-content" v-show="isSubExpanded(license.id, 'core')">
												<div class="core-flavor">
													<h4 class="core-name">{{ license.core_system.name }}</h4>
													<div class="core-desc" v-html="license.core_system.description"></div>
												</div>
												<div class="core-active-block">
													<div class="core-active-header">{{ license.core_system.active_name }}</div>
													<div class="core-active-subheader">{{ $t('mech.activate') }} ({{ license.core_system.activation }}), {{ license.core_system.use }}</div>
													<div class="core-active-body" v-html="license.core_system.active_effect"></div>
												</div>
											</div>
										</transition>
									</section>
								</div>

								<!-- Coluna 2: Mecânicas e Combate -->
								<div class="profile-col col-2">
									<section class="stat-section">
										<h3 class="section-title collapsible" @click="toggleSub(license.id, 'stats')">
											{{ $t('mech.mainStats') }}
											<span class="collapse-icon">{{ isSubExpanded(license.id, 'stats') ? '−' : '+' }}</span>
										</h3>
										<transition name="accordion">
											<div class="section-content stats-grid" v-show="isSubExpanded(license.id, 'stats')">
												<!-- Main Stats -->
												<div class="m-stat">
													<span class="m-label">{{ $t('mech.stats.size') }}</span>
													<span class="m-value">{{ license.stats.size }}</span>
												</div>
												<div class="m-stat">
													<span class="m-label">{{ $t('mech.stats.save') }}</span>
													<span class="m-value">{{ license.stats.save }}</span>
												</div>
												<div class="m-stat">
													<span class="m-label">{{ $t('mech.stats.armor') }}</span>
													<span class="m-value">{{ license.stats.armor }}</span>
												</div>
												<div class="m-stat">
													<span class="m-label">{{ $t('mech.stats.sensors') }}</span>
													<span class="m-value">{{ license.stats.sensor_range }}</span>
												</div>

												<!-- Sub Stats Groups -->
												<div class="sub-stat-group casco">
													<h4 class="sub-title">{{ $t('mech.hull') }}</h4>
													<div class="s-stat"><span class="s-label">{{ $t('mech.stats.hp') }}</span> <span class="s-value">{{ license.stats.hp }}</span></div>
													<div class="s-stat"><span class="s-label">{{ $t('mech.stats.repcap') }}</span> <span class="s-value">{{ license.stats.repcap }}</span></div>
												</div>
												<div class="sub-stat-group sistemas">
													<h4 class="sub-title">{{ $t('mech.systems') }}</h4>
													<div class="s-stat"><span class="s-label">{{ $t('mech.stats.edef') }}</span> <span class="s-value">{{ license.stats.edef }}</span></div>
													<div class="s-stat"><span class="s-label">{{ $t('mech.stats.techAttack') }}+</span> <span class="s-value">{{ license.stats.tech_attack >= 0 ? '+' : '' }}{{ license.stats.tech_attack }}</span></div>
													<div class="s-stat"><span class="s-label">{{ $t('mech.stats.sp') }}</span> <span class="s-value">{{ license.stats.sp }}</span></div>
												</div>
												<div class="sub-stat-group agilidade">
													<h4 class="sub-title">{{ $t('mech.agility') }}</h4>
													<div class="s-stat"><span class="s-label">{{ $t('mech.stats.evasion') }}</span> <span class="s-value">{{ license.stats.evasion }}</span></div>
													<div class="s-stat"><span class="s-label">{{ $t('mech.stats.speed') }}</span> <span class="s-value">{{ license.stats.speed }}</span></div>
												</div>
												<div class="sub-stat-group engenharia">
													<h4 class="sub-title">{{ $t('mech.engineering') }}</h4>
													<div class="s-stat"><span class="s-label">{{ $t('mech.stats.heatcap') }}</span> <span class="s-value">{{ license.stats.heatcap }}</span></div>
												</div>
											</div>
										</transition>
									</section>

									<section class="traits-section" v-if="license.traits && license.traits.length">
										<h3 class="section-title collapsible" @click="toggleSub(license.id, 'traits')">
											{{ $t('mech.traits') }}
											<span class="collapse-icon">{{ isSubExpanded(license.id, 'traits') ? '−' : '+' }}</span>
										</h3>
										<transition name="accordion">
											<div class="section-content" v-show="isSubExpanded(license.id, 'traits')">
												<div class="traits-list">
													<div v-for="trait in license.traits" :key="trait.name" class="trait-card">
														<div class="trait-header">{{ trait.name }}</div>
														<div class="trait-body" v-html="trait.description"></div>
													</div>
												</div>
											</div>
										</transition>
									</section>

									<section class="mounts-section">
										<h3 class="section-title collapsible" @click="toggleSub(license.id, 'mounts')">
											{{ $t('mech.mounts') }}
											<span class="collapse-icon">{{ isSubExpanded(license.id, 'mounts') ? '−' : '+' }}</span>
										</h3>
										<transition name="accordion">
											<div class="section-content" v-show="isSubExpanded(license.id, 'mounts')">
												<div class="mounts-list">
													<div v-for="(mount, index) in license.mounts" :key="index" class="mount-badge">
														{{ $t('mech.mount') }} {{ mount.toUpperCase() }}
													</div>
												</div>
											</div>
										</transition>
									</section>
								</div>
							</div>
						</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { manufacturers as mfData, frames as frameData } from "lancer-data-pt-br";

export default {
	name: "LicensesStep",
	data() {
		return {
			manufacturers: mfData.filter(m => m.id !== 'GMS'), // GMS is LL0, usually not shown as license ranks
			activeMf: 'IPS-N',
			allLicenses: frameData.filter(f => f.license_level > 0),
			expandedItems: [],
			expandedSubSections: {},
			visibleDescriptions: []
		};
	},
	computed: {
		filteredLicenses() {
			return this.allLicenses.filter(l => l.source === this.activeMf);
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
		isSubExpanded(licenseId, section) {
			const key = `${licenseId}_${section}`;
			if (this.expandedSubSections[key] === undefined) return true;
			return this.expandedSubSections[key];
		},
		toggleSub(licenseId, section) {
			const key = `${licenseId}_${section}`;
			this.expandedSubSections[key] = !this.isSubExpanded(licenseId, section);
		},
		getRank(id) {
			const l = pilotStore.state.licenses.find(lic => lic.id === id);
			return l ? l.rank : 0;
		},
		adjust(id, amount) {
			const current = this.getRank(id);
			let newRank = current + amount;
			if (newRank < 0) newRank = 0;
			if (newRank > 3) newRank = 3;
			pilotStore.setLicenseRank(id, newRank);
		},
		getMfColor(mfId) {
			const mf = mfData.find(m => m.id === mfId);
			return mf ? mf.dark : 'var(--primary-color)';
		},
		getFrameImage(license) {
			return `/frames/${license.id}.png`;
		},
		toggleDesc(id) {
			const index = this.visibleDescriptions.indexOf(id);
			if (index > -1) {
				this.visibleDescriptions.splice(index, 1);
			} else {
				this.visibleDescriptions.push(id);
			}
		},
		isDescVisible(id) {
			return this.visibleDescriptions.includes(id);
		}
	}
};
</script>

<style scoped>
.creator-step {
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
	width: 100%;
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

.manufacturers-tabs {
	display: flex;
	gap: 10px;
	margin-bottom: 20px;
}

.mf-tab {
	background: rgba(0, 0, 0, 0.4);
	border: 1px solid rgba(255, 255, 255, 0.1);
	color: var(--text-location);
	padding: 10px 20px;
	cursor: pointer;
	font-family: "Big Shoulders Display", cursive;
	font-size: 18px;
	letter-spacing: 1px;
	transition: all 0.2s;
}

.mf-tab:hover {
	border-color: var(--primary-color);
}

.mf-tab.active {
	background: var(--primary-color);
	color: white;
	border-color: var(--primary-color);
}

.licenses-list {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.license-item {
	margin-bottom: 0;
}


.rank-stepper {
	display: flex;
	align-items: center;
	background: rgba(0, 0, 0, 0.5);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 4px;
	overflow: hidden;
}

.rank-stepper button {
	background: transparent;
	border: none;
	color: white;
	padding: 2px 10px;
	cursor: pointer;
	font-size: 18px;
	transition: all 0.2s;
}

.rank-stepper button:hover:not(:disabled) {
	background: rgba(255, 255, 255, 0.1);
}

.rank-stepper button:disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

.rank-display {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2px 10px;
	min-width: 50px;
	border-left: 1px solid rgba(255, 255, 255, 0.1);
	border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.rank-label {
	font-size: 8px;
	font-family: "Inconsolata", monospace;
	opacity: 0.7;
}

.rank-val {
	font-size: 14px;
	font-weight: bold;
	font-family: "Inconsolata", monospace;
}

.profile-layout {
	display: grid;
	grid-template-columns: 1.2fr 1fr;
	gap: 30px;
	background: #f8f9fa;
	padding: 30px;
	border: 3px double var(--primary-color);
	color: #333;
	position: relative;
}

.profile-layout::before {
	content: "";
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 300px;
	height: 300px;
	background: url('/logo.png'); /* Fallback to a logo if possible */
	background-size: contain;
	background-repeat: no-repeat;
	opacity: 0.05;
	pointer-events: none;
}

.accordion-enter-active, .accordion-leave-active {
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	max-height: 2000px;
	overflow: hidden;
}

.accordion-enter-from, .accordion-leave-to {
	max-height: 0;
	opacity: 0;
}

.profile-layout {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 5px;
	background: rgba(10, 10, 10, 0.95);
	padding: 10px;
	border: 3px double var(--primary-color);
	color: #eee;
	position: relative;
}

.profile-col {
	height: fit-content;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.frame-visual-top {
	height: 45%;
	display: flex;
	justify-content: center;
	border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
	padding: 10px 0;
}

.frame-visual-top .frame-img {
	width: 60%;
	height: 100%;
	object-fit: cover;
	filter: drop-shadow(0 5px 20px rgba(0,0,0,0.4));
	transition: transform 0.3s ease;
}

.frame-visual-top .frame-img:hover {
	transform: scale(1.02);
}

.image-wrapper {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.info-btn {
	position: absolute;
	top: 10px;
	left: 0px;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: var(--primary-color);
	border: 2px solid rgba(255, 255, 255, 0.2);
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	box-shadow: 0 4px 10px rgba(0,0,0,0.5);
	transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	z-index: 10;
}

.info-btn:hover {
	transform: scale(1.1) rotate(10deg);
	box-shadow: 0 0 15px var(--primary-color);
}

.info-icon {
	font-family: "Big Shoulders Display", cursive;
	font-weight: bold;
	font-size: 18px;
}

.floating-desc-box {
	position: absolute;
	top: 80px;
	left: 0;
	background: rgba(10, 10, 10, 0.9);
	backdrop-filter: blur(15px);
	border: 1px solid var(--primary-color);
	padding: 30px;
	z-index: 100;
	box-shadow: 20px 0 50px rgba(0,0,0,0.9);
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	margin: 0px 10px 0px 10px;
}

.desc-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	padding-bottom: 8px;
	margin-bottom: 10px;
	font-family: "Big Shoulders Display", cursive;
	font-size: 18px;
	color: var(--primary-color);
	text-transform: uppercase;
	letter-spacing: 1px;
}

.close-desc {
	background: transparent;
	border: none;
	color: rgba(255, 255, 255, 0.5);
	font-size: 20px;
	cursor: pointer;
	transition: color 0.2s;
}

.close-desc:hover {
	color: white;
}

.fade-enter-active, .fade-leave-active {
	transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
	opacity: 0;
	transform: translateX(-50px);
}

.section-title {
	font-family: "Titillium Web", sans-serif;
	font-size: 24px;
	color: var(--primary-color);
	border-bottom: 2px solid var(--primary-color);
	margin-bottom: 12px;
	letter-spacing: 1px;
}

.section-title.collapsible {
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
	transition: background 0.2s;
}

.section-title.collapsible:hover {
	background: rgba(255, 255, 255, 0.05);
}

.collapse-icon {
	font-family: "Inconsolata", monospace;
	font-size: 20px;
	color: var(--primary-color);
}

.main-stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	gap: 8px;
	margin-bottom: 12px;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 15px;
}

.m-stat {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: rgba(255, 255, 255, 0.05);
	padding: 10px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 4px;
	transition: all 0.2s;
}

.m-stat:hover {
	background: rgba(var(--primary-color-rgb, 200, 0, 0), 0.1);
	border-color: var(--primary-color);
}

.m-label {
	font-family: "Inconsolata", monospace;
	font-size: 16px;
	text-transform: uppercase;
	letter-spacing: 1px;
}

.m-value {
	font-family: "Titillium Web", sans-serif;
	font-size: 28px;
	color: var(--primary-color);
	font-weight: 800;
	text-shadow: 0 0 10px rgba(var(--primary-color-rgb, 200, 0, 0), 0.3);
	
}

.sub-stat-group {
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.05);
	padding: 12px;
	border-radius: 4px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	align-items: center;
}

.s-stat {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
}

.s-label {
	font-family: "Titillium Web", sans-serif;
	font-size: 16px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	white-space: nowrap;
	text-shadow: 0 0 10px rgba(var(--primary-color-rgb, 200, 0, 0), 0.3);
}

.s-value {
	font-family: "Titillium Web", sans-serif;
	font-size: 22px;
	font-weight: 700;
	color: var(--primary-color);
	background: rgba(255, 255, 255, 0.1);
	padding: 2px 2px;
	border-radius: 2px;
	min-width: 40px;
	text-align: center;
	border: 1px solid rgba(255, 255, 255, 0.1);
	text-shadow: 0 0 10px rgba(var(--primary-color-rgb, 200, 0, 0), 0.3);
}

.sub-stat-group:hover {
	border-color: rgba(var(--primary-color-rgb, 200, 0, 0), 0.3);
	background: rgba(255, 255, 255, 0.04);
}

.sub-title {
	font-family: "Titillium Web", sans-serif;
	font-size: 20px;
	color: var(--primary-color);
	border-bottom: 1px solid rgba(var(--primary-color-rgb, 200, 0, 0), 0.2);
}



.traits-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.trait-card {
	border: 1px solid var(--primary-color);
	border-radius: 4px;
	overflow: hidden;
}

.trait-header {
	background: var(--primary-color);
	color: white;
	padding: 6px 12px;
	font-family: "Titillium Web", sans-serif;
	font-size: 18px;
	text-transform: uppercase;
}

.trait-body {
	background: rgba(255, 255, 255, 0.02);
	padding: 10px 12px;
	font-family: "Titillium Web", sans-serif;
	font-size: 15px;
	line-height: 1.5;
}

.mounts-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.mount-badge {
	background: var(--primary-color);
	color: white;
	padding: 6px 12px;
	font-family: "Titillium Web", sans-serif;
	font-size: 18px;
	clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
	min-width: 100px;
}

.frame-description-section {
	padding: 15px;
	background: rgba(255, 255, 255, 0.03);
	border-left: 3px solid var(--primary-color);
	margin-bottom: 10px;
}

.frame-desc-text {
	font-family: "Titillium Web", sans-serif;
	font-size: 22px;
}

.core-flavor {
	margin-bottom: 15px;
}

.core-name {
	font-family: "Big Shoulders Display", cursive;
	font-size: 24px;
	color: #fff;
	margin-bottom: 5px;
}

.core-desc {
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
}

.core-active-block {
	border: 1px solid #28a745;
	border-radius: 4px;
	overflow: hidden;
}

.core-active-header {
	background: #28a745;
	color: white;
	padding: 8px 15px;
	font-family: "Titillium Web", sans-serif;
	font-size: 18px;
	font-weight: 600;
}

.core-active-subheader {
	background: rgba(40, 167, 69, 0.1);
	color: #1e7e34;
	padding: 5px 15px;
	font-family: "Inconsolata", monospace;
	font-size: 13px;
	font-weight: bold;
}

.core-active-body {
	padding: 12px;
	font-family: "Titillium Web", sans-serif;
	font-size: 15px;
	line-height: 1.5;
}
</style>
