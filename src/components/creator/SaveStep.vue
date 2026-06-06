<template>
	<div class="creator-step save-step">
		<div class="step-header">
			<h2>{{ $t('pilotCreator.steps.savePilot') || 'SALVAR & EXPORTAR' }}</h2>
			<p class="desc">Revise as informações do seu piloto e salve localmente ou exporte os arquivos de dados para outros sistemas.</p>
		</div>

		<div class="save-content-grid">
			<!-- Resumo do Piloto -->
			<div class="pilot-summary-card card-border">
				<div class="card-title-bar">
					<span class="material-symbols-outlined">badge</span>
					<h3>REGISTRO DO PILOTO</h3>
				</div>
				<div class="summary-details">
					<div class="summary-row">
						<span class="label">NOME:</span>
						<span class="value">{{ pilotName || '---' }}</span>
					</div>
					<div class="summary-row">
						<span class="label">CALLSIGN:</span>
						<span class="value highlight">{{ pilotCallsign || '---' }}</span>
					</div>
					<div class="summary-row">
						<span class="label">NÍVEL DE LICENÇA (NL):</span>
						<span class="value">NL {{ pilotLevel }}</span>
					</div>
					<div class="summary-row">
						<span class="label">HISTÓRICO:</span>
						<span class="value">{{ pilotBackground || 'Nenhum' }}</span>
					</div>
				</div>
			</div>

			<!-- Resumo do Mecha -->
			<div class="mech-summary-card card-border">
				<div class="card-title-bar">
					<span class="material-symbols-outlined">precision_manufacturing</span>
					<h3>MECHA ASSOCIADO</h3>
				</div>
				<div class="summary-details">
					<div class="summary-row">
						<span class="label">NOME DO MECHA:</span>
						<span class="value">{{ mechName || '---' }}</span>
					</div>
					<div class="summary-row">
						<span class="label">CHASSI:</span>
						<span class="value highlight">{{ getFrameName(mechFrameId) || '---' }}</span>
					</div>
					<div class="summary-row">
						<span class="label">SP:</span>
						<span class="value">{{ usedSp }} SP</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Ações de Exportação -->
		<div class="actions-section">
			<h3 class="section-title">AÇÕES DE DADOS //</h3>
			<div class="save-actions-grid">
				<button class="action-btn save-btn" @click="savePilot">
					<span class="material-symbols-outlined">cloud_upload</span>
					SALVAR PILOTO
				</button>
				<button class="action-btn compcon-btn" @click="exportToCompcon">
					<span class="material-symbols-outlined">download</span>
					EXPORTAR COMP/CON (.json)
				</button>
				<button class="action-btn foundry-btn" @click="exportToFoundry">
					<span class="material-symbols-outlined">download</span>
					EXPORTAR FOUNDRY
				</button>
				<button class="action-btn reset-btn" @click="resetPilot">
					<span class="material-symbols-outlined">restart_alt</span>
					NOVO PILOTO
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { frames as framesData } from "lancer-data-pt-br";
import { downloadPilotJson } from "@/utils/exportCompconJson";
import { downloadFoundryExport } from "@/utils/exportFoundryJson";

export default {
	name: "SaveStep",
	data() {
		return {
			frames: framesData
		};
	},
	computed: {
		pilotName() { return pilotStore.state.name; },
		pilotCallsign() { return pilotStore.state.callsign; },
		pilotLevel() { return pilotStore.state.level; },
		pilotBackground() { return pilotStore.state.background; },
		mechName() { return pilotStore.state.activeMech.name; },
		mechFrameId() { return pilotStore.state.activeMech.frame; },
		usedSp() {
			let total = 0;
			const systems = pilotStore.state.activeMech.systems || [];
			// A simple computation or count
			return systems.length;
		}
	},
	methods: {
		getFrameName(frameId) {
			if (!frameId) return '';
			const f = this.frames.find(frame => frame.id === frameId);
			return f ? f.name : frameId;
		},
		async savePilot() {
			const success = await pilotStore.savePilot();
			if (success) {
				alert("PILOTO SALVO COM SUCESSO E SINCRONIZADO");
			}
		},
		resetPilot() {
			if (confirm("DESEJA REALMENTE REINICIAR? TODOS OS DADOS NÃO SALVOS SERÃO PERDIDOS.")) {
				pilotStore.reset();
			}
		},
		exportToCompcon() {
			downloadPilotJson(pilotStore.state);
		},
		exportToFoundry() {
			downloadFoundryExport(pilotStore.state);
		}
	}
};
</script>

<style scoped>
.creator-step {
	display: flex;
	flex-direction: column;
	gap: 25px;
}

.step-header {
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

.save-content-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
}

.card-border {
	background: rgba(22, 28, 29, 0.6);
	border: 1px solid rgba(175, 14, 30, 0.3);
	display: flex;
	flex-direction: column;
}

.card-title-bar {
	background: rgba(175, 14, 30, 0.15);
	padding: 10px 15px;
	display: flex;
	align-items: center;
	gap: 10px;
	border-bottom: 1px solid rgba(175, 14, 30, 0.2);
}

.card-title-bar h3 {
	font-family: "Rajdhani", sans-serif;
	font-size: 16px;
	font-weight: 700;
	color: white;
	margin: 0;
	letter-spacing: 1px;
}

.card-title-bar .material-symbols-outlined {
	color: var(--primary-color);
	font-size: 18px;
}

.summary-details {
	padding: 15px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.summary-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	padding-bottom: 6px;
}

.summary-row:last-child {
	border-bottom: none;
	padding-bottom: 0;
}

.summary-row .label {
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: rgba(255, 255, 255, 0.4);
}

.summary-row .value {
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
	font-weight: bold;
	color: white;
}

.summary-row .value.highlight {
	color: var(--primary-color);
	font-family: "Rajdhani", sans-serif;
	font-size: 16px;
	letter-spacing: 0.5px;
}

.actions-section {
	margin-top: 10px;
}

.section-title {
	font-family: "Big Shoulders Display", cursive;
	font-size: 14px;
	color: var(--primary-color);
	margin-bottom: 15px;
	letter-spacing: 2px;
}

.save-actions-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 15px;
}

.action-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	padding: 15px;
	font-family: "Big Shoulders Display", cursive;
	font-size: 16px;
	font-weight: bold;
	letter-spacing: 1.5px;
	text-transform: uppercase;
	border: none;
	cursor: pointer;
	transition: all 0.2s;
}

.save-btn {
	background: var(--primary-color);
	color: white;
}

.save-btn:hover {
	background: #d40d1b;
	box-shadow: 0 0 15px rgba(175, 14, 30, 0.4);
}

.compcon-btn {
	background: #1a1a1a;
	color: #fff;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.compcon-btn:hover {
	background: rgba(255, 255, 255, 0.05);
	border-color: white;
}

.foundry-btn {
	background: #ff6400; /* Laranja Foundry */
	color: white;
}

.foundry-btn:hover {
	background: #ff7c26;
	box-shadow: 0 0 15px rgba(255, 100, 0, 0.4);
}

.reset-btn {
	background: transparent;
	color: #888;
	border: 1px dashed rgba(255, 255, 255, 0.2);
}

.reset-btn:hover {
	color: white;
	background: rgba(255, 255, 255, 0.05);
	border-color: white;
}

@media (max-width: 768px) {
	.save-content-grid {
		grid-template-columns: 1fr;
		gap: 15px;
	}
	
	.save-actions-grid {
		grid-template-columns: 1fr;
		gap: 12px;
	}
}
</style>
