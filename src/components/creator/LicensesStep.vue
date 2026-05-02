<template>
	<div class="creator-step">
		<div class="step-header">
			<div class="header-left">
				<h2>{{ $t('pilotCreator.steps.licenses') }}</h2>
				<p class="desc">{{ $t('pilotCreator.sandboxDesc') }}</p>
			</div>
			<div class="header-right">
				<div class="points-badge">
					<span class="label">LL SPENT:</span>
					<span class="value" :class="{ ok: spentPoints === maxPoints }">{{ spentPoints }} / {{ maxPoints }}</span>
				</div>
				<button class="manage-btn" @click="showModal = true">
					<span class="material-symbols-outlined">military_tech</span>
					GERENCIAR LICENÇAS
				</button>
			</div>
		</div>

		<div class="active-licenses-view">
			<div v-if="activeLicenses.length === 0" class="empty-selection" @click="showModal = true">
				<span class="material-symbols-outlined">add_circle</span>
				<p>NENHUMA LICENÇA SELECIONADA. CLIQUE PARA ADICIONAR.</p>
			</div>
			
			<div v-else class="licenses-summary-grid">
				<div v-for="lic in activeLicenses" :key="lic.id" class="active-license-card">
					<div class="card-visual">
						<img :src="getFrameImage(lic)" class="frame-img" />
						<div class="mf-tag" :style="{ color: getMfColor(lic.source) }">{{ lic.source }}</div>
					</div>
					<div class="card-content">
						<div class="name-row">
							<span class="frame-name">{{ lic.name }}</span>
							<span class="rank-badge">RANK {{ getRank(lic.id) }}</span>
						</div>
						<div class="unlocks-preview">
							<span v-if="getRank(lic.id) >= 1">R1: Sistemas Desbloqueados</span>
							<span v-if="getRank(lic.id) >= 2">R2: Chassi {{ lic.name }}</span>
							<span v-if="getRank(lic.id) >= 3">R3: Equipamento Final</span>
						</div>
					</div>
					<button class="remove-btn" @click="removeLicense(lic.id)">
						<span class="material-symbols-outlined">close</span>
					</button>
				</div>
			</div>
		</div>

		<LicenseSelectionModal 
			:isOpen="showModal" 
			@close="showModal = false" 
		/>
	</div>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { manufacturers as mfData, frames as frameData } from "lancer-data-pt-br";
import LicenseSelectionModal from "@/components/modals/LicenseSelectionModal.vue";

export default {
	name: "LicensesStep",
	components: {
		LicenseSelectionModal
	},
	data() {
		return {
			showModal: false,
			allLicenses: frameData,
			manufacturers: mfData
		};
	},
	computed: {
		spentPoints() {
			return pilotStore.state.licenses.reduce((acc, l) => acc + l.rank, 0);
		},
		maxPoints() {
			return pilotStore.state.level;
		},
		activeLicenses() {
			const activeIds = pilotStore.state.licenses.map(l => l.id);
			return this.allLicenses.filter(l => activeIds.includes(l.id));
		}
	},
	methods: {
		getRank(id) {
			const l = pilotStore.state.licenses.find(lic => lic.id === id);
			return l ? l.rank : 0;
		},
		getFrameImage(license) {
			return `/frames/${license.id}.png`;
		},
		getMfColor(mfId) {
			const mf = this.manufacturers.find(m => m.id === mfId);
			return mf ? mf.dark : '#af0e1e';
		},
		removeLicense(id) {
			pilotStore.setLicenseRank(id, 0);
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



.desc {
	font-family: "Inconsolata", monospace;
	color: var(--text-location);
	font-size: 14px;
	margin: 5px 0 0 0;
	opacity: 0.8;
}

.header-right {
	display: flex;
	align-items: center;
	gap: 20px;
}

.points-badge {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.points-badge .label {
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: rgba(255, 255, 255, 0.4);
}

.points-badge .value {
	font-family: "Rajdhani", sans-serif;
	font-size: 20px;
	font-weight: 700;
	color: #fff;
}

.points-badge .value.ok { color: #27c93f; }

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
}

.manage-btn:hover {
	background: var(--primary-color);
	color: black;
	box-shadow: 0 0 15px rgba(175, 14, 30, 0.4);
}

.active-licenses-view {
	flex: 1;
	background: rgba(0, 0, 0, 0.2);
	padding: 20px;
	border: 1px solid rgba(255, 255, 255, 0.05);
}

.empty-selection {
	height: 150px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 10px;
	color: rgba(255, 255, 255, 0.2);
	cursor: pointer;
	border: 2px dashed rgba(255, 255, 255, 0.1);
}

.empty-selection:hover {
	border-color: var(--primary-color);
	color: var(--primary-color);
}

.licenses-summary-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 15px;
}

.active-license-card {
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(255, 255, 255, 0.1);
	display: flex;
	padding: 15px;
	gap: 15px;
	position: relative;
	transition: all 0.2s;
}

.active-license-card:hover {
	background: rgba(255, 255, 255, 0.05);
	border-color: var(--primary-color);
}

.card-visual {
	width: 60px;
	height: 60px;
	background: rgba(0, 0, 0, 0.3);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
}

.card-visual .frame-img {
	max-width: 80%;
	max-height: 80%;
	object-fit: contain;
}

.card-visual .mf-tag {
	position: absolute;
	bottom: -2px;
	font-family: "Inconsolata", monospace;
	font-size: 8px;
	font-weight: 700;
	background: #000;
	padding: 0 4px;
}

.card-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.name-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.frame-name {
	font-family: "Rajdhani", sans-serif;
	font-size: 16px;
	font-weight: 700;
	color: #fff;
	text-transform: uppercase;
}

.rank-badge {
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	background: rgba(175, 14, 30, 0.2);
	color: var(--primary-color);
	padding: 1px 6px;
	border: 1px solid var(--primary-color);
}

.unlocks-preview {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.unlocks-preview span {
	font-family: "Titillium Web", sans-serif;
	font-size: 11px;
	color: rgba(255, 255, 255, 0.4);
}

.remove-btn {
	background: transparent;
	border: none;
	color: rgba(255, 255, 255, 0.2);
	cursor: pointer;
	align-self: flex-start;
}

.remove-btn:hover { color: var(--primary-color); }
</style>
