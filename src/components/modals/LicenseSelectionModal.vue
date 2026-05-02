<template>
	<transition name="modal-fade">
		<div class="modal-overlay" v-if="isOpen" @click.self="$emit('close')">
			<div class="modal-content">
				<!-- Header -->
				<div class="modal-header">
					<div class="header-left">
						<div class="header-line"></div>
						<h2 class="modal-title">{{ $t('pilotCreator.manufacturerLicenses') }}</h2>
					</div>
					<div class="header-right">
						<div class="points-tracker">
							<span class="points-label">{{ $t('pilotCreator.mechPointsDist') }}:</span>
							<span class="points-counter" :class="{ 'at-limit': spentPoints >= maxPoints }">
								{{ maxPoints - spentPoints }} {{ $t('pilotCreator.availableRanks') }}
							</span>
						</div>
						<button class="close-btn" @click="$emit('close')">
							<span class="material-symbols-outlined">close</span>
						</button>
					</div>
				</div>

				<div class="modal-main">
					<!-- Sidebar: Manufacturers -->
					<div class="mf-sidebar tech-scroll">
						<button 
							v-for="mf in manufacturers" 
							:key="mf.id" 
							class="mf-btn" 
							:class="{ active: activeMf === mf.id }"
							:style="{ '--mf-color': getMfColor(mf.id) }"
							@click="activeMf = mf.id">
							<div v-if="getMfLogo(mf.id)" 
								class="mf-logo" 
								:style="{ 'mask-image': `url(${getMfLogo(mf.id)})`, '-webkit-mask-image': `url(${getMfLogo(mf.id)})` }">
							</div>
							<span class="mf-name">{{ mf.name }}</span>
						</button>
					</div>

					<!-- Content Area -->
					<div class="content-area">
						<!-- Search and Filter -->
						<div class="content-controls">
							<div class="search-box">
								<span class="material-symbols-outlined">search</span>
								<input type="text" v-model="searchQuery" :placeholder="$t('pilotCreator.searchIn', { source: activeMf })" />
							</div>
						</div>

						<!-- Grid of Licenses -->
						<div class="license-grid tech-scroll">
							<div v-for="license in filteredLicenses" 
								:key="license.id" 
								class="license-card"
								:class="{ active: getRank(license.id) > 0, selected: selectedLicense?.id === license.id }"
								@click="selectLicense(license)">
								
								<div class="card-info">
									<span class="frame-name">{{ license.name }}</span>
								</div>
								<div class="rank-controls" v-if="license.license_level > 0">
									<button class="rank-btn minus" @click.stop="adjustRank(license.id, -1)" :disabled="getRank(license.id) <= 0">
										<span class="material-symbols-outlined">remove</span>
									</button>
									<span class="current-rank">R{{ getRank(license.id) }}</span>
									<button class="rank-btn plus" @click.stop="adjustRank(license.id, 1)" :disabled="getRank(license.id) >= 3 || spentPoints >= maxPoints">
										<span class="material-symbols-outlined">add</span>
									</button>
								</div>
								<div class="standard-tag" v-else>{{ $t('pilotCreator.gmsStandard') }}</div>

								<div class="card-visual">
									<img :src="getFrameImage(license)" class="frame-img" />
									<div class="rank-dots">
										<div v-for="i in 3" :key="i" class="dot" :class="{ filled: getRank(license.id) >= i }"></div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Details Panel (Right) -->
					<div class="details-panel tech-scroll" v-if="selectedLicense" :style="{ '--mf-color': getMfColor(selectedLicense.source) }">
						<div class="details-header">
							<div class="mf-tag" :style="{ color: getMfColor(selectedLicense.source) }">{{ selectedLicense.source }}</div>
							<h3 class="selected-name">{{ selectedLicense.name }}</h3>
						</div>

						<div class="details-body">
							<!-- Detailed Stats Grid with HASE color logic -->
							<div class="detailed-stats-grid">
								<!-- Hull / Core -->
								<div class="stat-mini red">
									<span class="label">{{ $t('mech.stats.size') }}</span>
									<span class="val">{{ selectedLicense.stats?.size }}</span>
								</div>
								<div class="stat-mini red">
									<span class="label">{{ $t('mech.stats.hp') }}</span>
									<span class="val">{{ selectedLicense.stats?.hp }}</span>
								</div>
								<div class="stat-mini red">
									<span class="label">{{ $t('mech.stats.armor') }}</span>
									<span class="val">{{ selectedLicense.stats?.armor }}</span>
								</div>
								<div class="stat-mini red">
									<span class="label">{{ $t('mech.stats.repcap') }}</span>
									<span class="val">{{ selectedLicense.stats?.repcap }}</span>
								</div>

								<!-- Agility -->
								<div class="stat-mini green">
									<span class="label">{{ $t('mech.stats.speed') }}</span>
									<span class="val">{{ selectedLicense.stats?.speed }}</span>
								</div>
								<div class="stat-mini green">
									<span class="label">{{ $t('mech.stats.evasion') }}</span>
									<span class="val">{{ selectedLicense.stats?.evasion }}</span>
								</div>

								<!-- Systems -->
								<div class="stat-mini blue">
									<span class="label">{{ $t('mech.stats.edef') }}</span>
									<span class="val">{{ selectedLicense.stats?.edef }}</span>
								</div>
								<div class="stat-mini blue">
									<span class="label">{{ $t('mech.stats.sensors') }}</span>
									<span class="val">{{ selectedLicense.stats?.sensor_range }}</span>
								</div>
								<div class="stat-mini blue">
									<span class="label">{{ $t('mech.stats.techAttack') }}</span>
									<span class="val">{{ selectedLicense.stats?.tech_attack >= 0 ? '+' : '' }}{{ selectedLicense.stats?.tech_attack }}</span>
								</div>

								<!-- Engineering / Other -->
								<div class="stat-mini yellow">
									<span class="label">{{ $t('mech.stats.save') }}</span>
									<span class="val">{{ selectedLicense.stats?.save }}</span>
								</div>
								<div class="stat-mini yellow">
									<span class="label">{{ $t('mech.stats.heatcap') }}</span>
									<span class="val">{{ selectedLicense.stats?.heatcap }}</span>
								</div>
							</div>
							
							<!-- Mounts Section -->
							<div class="mounts-section" v-if="selectedLicense.mounts?.length">
								<h4 class="sub-section-title">{{ $t('mech.mounts') }}</h4>
								<div class="mounts-list">
									<div v-for="(m, i) in selectedLicense.mounts" :key="i" class="mount-pill">
										<span class="material-symbols-outlined mount-icon">deployed_code</span>
										<span class="mount-type">{{ $t(`mech.mountTypes.${m.toLowerCase()}`) || m }}</span>
									</div>
								</div>
							</div>

							<!-- Rank Unlock Breakdown -->
							<div class="rank-unlocks">
								<h4 class="sub-section-title">{{ $t('pilotCreator.licenseUnlocks') }}</h4>
								<div class="ranks-stack">
									<div v-for="r in 3" :key="r" class="rank-box" 
										:class="{ locked: getRank(selectedLicense.id) < r }"
										@click="openRankModal(r)">
										<div class="rank-header">
											<span class="rank-label">{{ $t('pilotCreator.rank') }} {{ 'I'.repeat(r) }}</span>
											<span v-if="getRank(selectedLicense.id) < r" class="material-symbols-outlined lock-icon">lock</span>
										</div>
										<div class="rank-content">
											<p class="unlock-desc" v-if="r === 2">{{ $t('mech.chassis') }}: {{ selectedLicense.name }}</p>
											<p class="unlock-desc">{{ $t('pilotCreator.mech.systems') }} e {{ $t('pilotCreator.mech.mounts') }} {{ $t('pilotCreator.rank') }} {{ r }}</p>
										</div>
									</div>
								</div>
							</div>

							<!-- Traits -->
							<div class="traits-section" v-if="selectedLicense.traits?.length">
								<h4 class="sub-section-title">{{ $t('pilotCreator.chassisTraits') }}</h4>
								<div class="traits-list">
									<div v-for="trait in selectedLicense.traits" :key="trait.name" class="trait-entry">
										<span class="trait-name">{{ trait.name }}</span>
										<p class="trait-text" v-html="trait.description"></p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="details-panel empty" v-else>
						<span class="material-symbols-outlined">info</span>
						<p>{{ $t('pilotCreator.selectLicenseToView') }}</p>
					</div>
				</div>

				<!-- Footer -->
				<div class="modal-footer">
					<button class="confirm-btn" @click="$emit('close')">
						<span class="material-symbols-outlined">check_circle</span>
						{{ $t('pilotCreator.confirmLicenses') }}
					</button>
				</div>
			</div>
		</div>
	</transition>

	<!-- Rank Detail Modal -->
	<RankGearModal
		v-if="showRankModal"
		:isOpen="showRankModal"
		:rank="selectedRank"
		:licenseId="selectedLicense.id"
		:licenseName="selectedLicense.name"
		:manufacturer="selectedLicense.source"
		:mfColor="getMfColor(selectedLicense.source)"
		@close="showRankModal = false"
	/>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { manufacturers as mfData, frames as frameData } from "lancer-data-pt-br";
import RankGearModal from "./RankGearModal.vue";

export default {
	name: "LicenseSelectionModal",
	components: {
		RankGearModal
	},
	emits: ["close"],
	props: {
		isOpen: Boolean
	},
	data() {
		return {
			activeMf: 'GMS',
			manufacturers: mfData,
			allLicenses: frameData,
			searchQuery: "",
			selectedLicense: null,
			showRankModal: false,
			selectedRank: 1
		};
	},
	computed: {
		spentPoints() {
			return pilotStore.state.licenses.reduce((acc, l) => acc + l.rank, 0);
		},
		maxPoints() {
			return pilotStore.state.level;
		},
		filteredLicenses() {
			let items = this.allLicenses.filter(l => l.source === this.activeMf);
			if (this.searchQuery) {
				const q = this.searchQuery.toLowerCase();
				items = items.filter(l => l.name.toLowerCase().includes(q));
			}
			return items;
		}
	},
	methods: {
		getRank(id) {
			const l = pilotStore.state.licenses.find(lic => lic.id === id);
			return l ? l.rank : 0;
		},
		adjustRank(id, amount) {
			const current = this.getRank(id);
			pilotStore.setLicenseRank(id, current + amount);
		},
		getMfLogo(mfId) {
			return `/faction-logos/${mfId.toLowerCase()}.svg`;
		},
		getFrameImage(license) {
			return `/frames/${license.id}.png`;
		},
		getMfColor(mfId) {
			const mf = this.manufacturers.find(m => m.id === mfId);
			return mf ? mf.dark : '#af0e1e';
		},
		selectLicense(license) {
			this.selectedLicense = license;
		},
		openRankModal(rank) {
			this.selectedRank = rank;
			this.showRankModal = true;
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
	backdrop-filter: blur(10px);
	z-index: 2500;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.modal-content {
	background: #0a0d12;
	width: 100%;
	max-width: 80%;
	height: 90vh;
	border: 1px solid rgba(175, 14, 30, 0.4);
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 30px;
	background: linear-gradient(90deg, rgba(175, 14, 30, 0.2) 0%, transparent 100%);
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
	letter-spacing: 2px;
	font-weight: 700;
}

.points-tracker {
	display: flex;
	align-items: center;
	gap: 12px;
	background: rgba(0, 0, 0, 0.4);
	padding: 5px 15px;
	border: 1px solid rgba(255, 255, 255, 0.05);
}

.points-tracker .label {
	font-family: \"Inconsolata\", monospace;
	font-size: 11px;
	color: rgba(255, 255, 255, 0.5);
}

.points-tracker .value {
	font-family: \"Rajdhani\", sans-serif;
	font-size: 18px;
	font-weight: 700;
	color: #fff;
}

.points-tracker .value.ok { color: #27c93f; }
.points-tracker .value.warning { color: #af0e1e; }

.close-btn {
	background: transparent;
	border: none;
	color: rgba(255, 255, 255, 0.5);
	cursor: pointer;
	margin-left: 20px;
}

.modal-main {
	flex: 1;
	display: flex;
	overflow: hidden;
}

/* Sidebar */
.mf-sidebar {
	background: rgba(0, 0, 0, 0.2);
	border-right: 1px solid rgba(255, 255, 255, 0.05);
	display: flex;
	flex-direction: column;
	padding: 10px;
	gap: 8px;
}

.mf-btn {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px;
	background: transparent;
	border: 1px solid transparent;
	color: rgba(255, 255, 255, 0.4);
	cursor: pointer;
	transition: all 0.2s;
	text-align: left;
}

.mf-btn:hover {
	background: rgba(255, 255, 255, 0.03);
	color: var(--mf-color, #fff);
	border-color: rgba(255, 255, 255, 0.1);
}

.mf-btn.active {
	background: rgba(0, 0, 0, 0.3);
	border-color: var(--mf-color);
	color: var(--mf-color);
	box-shadow: inset 4px 0 0 var(--mf-color);
}

.mf-logo {
	width: 28px;
	height: 28px;
	background-color: rgba(255, 255, 255, 0.2);
	mask-size: contain;
	mask-repeat: no-repeat;
	mask-position: center;
	-webkit-mask-size: contain;
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	transition: all 0.3s;
}

.active .mf-logo, .mf-btn:hover .mf-logo { 
	background-color: var(--mf-color);
	opacity: 1;
}

.mf-name {
	font-family: \"Rajdhani\", sans-serif;
	font-size: 14px;
	font-weight: 700;
	text-transform: uppercase;
}

/* Content Area */
.content-area {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 20px;
	background: rgba(255, 255, 255, 0.01);
}

.content-controls {
	margin-bottom: 20px;
}

.search-box {
	position: relative;
	display: flex;
	align-items: center;
}

.search-box .material-symbols-outlined {
	position: absolute;
	left: 12px;
	color: rgba(255, 255, 255, 0.2);
}

.search-box input {
	width: 100%;
	background: rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 10px 15px 10px 40px;
	color: #fff;
	font-family: \"Inconsolata\", monospace;
	outline: none;
}

.search-box input:focus { border-color: #af0e1e; }

.license-grid {
	flex: 1;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 20px;
	padding-right: 10px;
}

.license-card {
	background: rgba(255, 255, 255, 0.02);
	border: 1px solid rgba(255, 255, 255, 0.05);
	padding: 15px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	cursor: pointer;
	transition: all 0.2s;
}

.license-card:hover {
	background: rgba(255, 255, 255, 0.05);
	border-color: rgba(255, 255, 255, 0.15);
}

.license-card.active { border-color: #af0e1e; background: rgba(175, 14, 30, 0.05); }
.license-card.selected { outline: 2px solid #af0e1e; outline-offset: -2px; }

.card-visual {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	background: rgba(0, 0, 0, 0.3);
}

.frame-img {
	max-width: 80%;
	max-height: 80%;
	object-fit: contain;
}

.rank-dots {
	position: absolute;
	bottom: 8px;
	right: 8px;
	display: flex;
	gap: 4px;
}

.dot {
	width: 6px;
	height: 6px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 50%;
}

.dot.filled {
	background: #af0e1e;
	border-color: #af0e1e;
	box-shadow: 0 0 5px #af0e1e;
}

.card-info {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.frame-name {
	font-family: "Rajdhani", sans-serif;
	font-size: 18px;
	font-weight: 700;
	color: #fff;
	text-transform: uppercase;
}

.frame-type {
	font-family: \"Inconsolata\", monospace;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.80);
}

.rank-controls {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: auto;
	background: rgba(0, 0, 0, 0.4);
	padding: 5px;
}

.rank-btn {
	background: transparent;
	border: 1px solid rgba(255, 255, 255, 0.1);
	color: #fff;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.rank-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.05); }
.rank-btn:disabled { opacity: 0.2; cursor: not-allowed; }

.current-rank {
	font-family: \"Inconsolata\", monospace;
	font-size: 12px;
	font-weight: 700;
}

.standard-tag {
	font-family: \"Inconsolata\", monospace;
	font-size: 10px;
	color: #af0e1e;
	text-align: center;
	margin-top: auto;
	font-weight: bold;
}

/* Details Panel */
.details-panel {
	width: 40%;
	background: rgba(0, 0, 0, 0.3);
	border-left: 1px solid rgba(255, 255, 255, 0.05);
	padding: 30px;
	display: flex;
	flex-direction: column;
	gap: 25px;
}

.details-panel.empty {
	justify-content: center;
	align-items: center;
	color: rgba(255, 255, 255, 0.2);
	text-align: center;
}

.details-header {
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	padding-bottom: 15px;
}

.mf-tag {
	font-family: \"Inconsolata\", monospace;
	font-size: 12px;
	font-weight: 700;
	margin-bottom: 5px;
}

.selected-name {
	font-family: "Rajdhani", sans-serif;
	font-size: 32px;
	font-weight: 800;
	color: #fff;
	margin: 0;
	text-transform: uppercase;
	letter-spacing: -0.5px;
}

.detailed-stats-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 8px;
	margin-bottom: 20px;
}

.stat-mini {
	background: rgba(255, 255, 255, 0.02);
	padding: 8px 4px;
	display: flex;
	flex-direction: column;
	align-items: center;
	border: 1px solid rgba(255, 255, 255, 0.05);
	position: relative;
	transition: all 0.2s;
}

.stat-mini:hover {
	background: rgba(255, 255, 255, 0.04);
	border-color: rgba(255, 255, 255, 0.2);
}

.stat-mini::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 2px;
	background: rgba(255, 255, 255, 0.1);
}

/* HASE Colors */
.stat-mini.red::after { background: #af0e1e; }
.stat-mini.green::after { background: #27c93f; }
.stat-mini.blue::after { background: #0c4d99; }
.stat-mini.yellow::after { background: #d1920a; }

.stat-mini.red .val { color: #ff4d4d; }
.stat-mini.green .val { color: #51ff70; }
.stat-mini.blue .val { color: #5ea1ff; }
.stat-mini.yellow .val { color: #ffcc33; }

.stat-mini .label {
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	margin-bottom: 2px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	white-space: nowrap;
}

.stat-mini .val {
	font-family: "Rajdhani", sans-serif;
	font-size: 20px;
	font-weight: 800;
	color: #fff;
	line-height: 1;
}

.mounts-section {
	margin-bottom: 25px;
}

.mounts-list {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.mount-pill {
	display: flex;
	align-items: center;
	gap: 8px;
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 6px 12px;
	border-radius: 4px;
}

.mount-icon {
	font-size: 16px;
	color: #af0e1e;
}

.mount-type {
	font-family: "Rajdhani", sans-serif;
	font-size: 14px;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.85);
	text-transform: uppercase;
	letter-spacing: 1px;
}

.sub-section-title {
	font-family: \"Rajdhani\", sans-serif;
	font-size: 12px;
	color: #af0e1e;
	letter-spacing: 1px;
	margin-bottom: 12px;
	text-transform: uppercase;
}

.rank-box {
	background: rgba(255, 255, 255, 0.02);
	border: 1px solid rgba(255, 255, 255, 0.05);
	margin-bottom: 12px;
	padding: 15px;
	position: relative;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	cursor: pointer;
	overflow: hidden;
}

.rank-box::before {
	content: v-bind("`'${$t('pilotCreator.clickToView')}'`");
	position: absolute;
	right: 15px;
	bottom: 10px;
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: var(--mf-color, #af0e1e);
	opacity: 0;
	transform: translateX(10px);
	transition: all 0.2s;
}

.rank-box:hover {
	background: rgba(255, 255, 255, 0.05);
	border-color: var(--mf-color, #af0e1e);
	transform: translateX(4px);
}

.rank-box:hover::before {
	opacity: 1;
	transform: translateX(0);
}

.rank-box:active {
	transform: translateX(2px) scale(0.99);
	background: rgba(255, 255, 255, 0.08);
}

.rank-box:not(.locked) {
	border-left: 3px solid var(--mf-color, #af0e1e);
}

.rank-box.locked { 
	cursor: default;
}

.rank-box.locked:hover {
	transform: none;
	border-color: rgba(255, 255, 255, 0.05);
}

.rank-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.rank-label {
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	font-weight: 800;
	color: rgba(255, 255, 255, 0.4);
	letter-spacing: 1px;
}

.lock-icon { font-size: 14px; }

.unlock-desc {
	font-family: \"Titillium Web\", sans-serif;
	font-size: 12px;
	margin: 0;
	color: rgba(255, 255, 255, 0.6);
}

.trait-entry {
	margin-bottom: 20px;
	padding: 12px 15px;
	background: rgba(255, 255, 255, 0.02);
	border-left: 3px solid var(--mf-color, #af0e1e);
	position: relative;
	transition: all 0.2s;
}

.trait-entry:hover {
	background: rgba(255, 255, 255, 0.04);
}

.trait-name {
	font-family: "Rajdhani", sans-serif;
	font-size: 16px;
	font-weight: 800;
	color: #fff;
	text-transform: uppercase;
	display: block;
	margin-bottom: 6px;
	letter-spacing: 1px;
}

.trait-text {
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
	line-height: 1.5;
	margin: 0;
	color: rgba(255, 255, 255, 0.85);
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
	padding: 12px 30px;
	font-family: \"Rajdhani\", sans-serif;
	font-size: 14px;
	font-weight: 700;
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
}

.tech-scroll { 
	overflow-y: auto;
}
.tech-scroll::-webkit-scrollbar { width: 4px; }
.tech-scroll::-webkit-scrollbar-thumb { background: #af0e1e; }
</style>
