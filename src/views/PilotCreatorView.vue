<template>
	<div id="creatorView" :class="{ animate: animateView }" :style="{ 'animation-delay': animationDelay }" class="content-container">
		<section id="creator-section" class="section-container full-width">
			<div class="section-header clipped-medium-backward">
				<img src="/icons/deployable.svg" />
				<h1>{{ $t('pilotCreator.title') }}</h1>
			</div>
			
			<div class="window-body creator-container">
				<div class="creator-sidebar">
					<button 
						v-for="(stepName, index) in steps" 
						:key="index"
						:class="{ active: currentStep === index }"
						@click="currentStep = index"
						class="step-btn"
					>
						<span class="step-num">0{{ index + 1 }}</span>
						<span class="step-name">{{ $t('pilotCreator.steps.' + stepName.key) }}</span>
					</button>

					<div class="actions-label">AÇÕES DE DADOS //</div>
					<div class="export-container">
						<button class="action-btn save-btn" @click="savePilot">
							SALVAR PILOTO
						</button>
						<button class="action-btn reset-btn" @click="resetPilot">
							NOVO PILOTO
						</button>
						<button class="export-btn" @click="exportToFoundry">
							{{ $t('pilotCreator.export') }}
						</button>
					</div>
				</div>

				<div class="creator-content">
					<component :is="steps[currentStep].component" />
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import IdentificationStep from "@/components/creator/IdentificationStep.vue";
import PilotGearStep from "@/components/creator/PilotGearStep.vue";
import LicensesStep from "@/components/creator/LicensesStep.vue";
import SkillsStep from "@/components/creator/SkillsStep.vue";
import TalentsStep from "@/components/creator/TalentsStep.vue";
import MechSkillsStep from "@/components/creator/MechSkillsStep.vue";
import MechBuilderStep from "@/components/creator/MechBuilderStep.vue";
import { pilotStore } from "@/store/pilotCreator";
import { downloadPilotJson } from "@/utils/exportCompconJson";

export default {
	name: "PilotCreatorView",
	components: {
		IdentificationStep,
		PilotGearStep,
		LicensesStep,
		SkillsStep,
		TalentsStep,
		MechSkillsStep,
		MechBuilderStep
	},
	props: {
		animate: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			animateView: this.animate,
			animationDelay: "0.5s",
			currentStep: 0,
			steps: [
				{ key: 'identification', component: 'IdentificationStep' },
				{ key: 'pilotGear', component: 'PilotGearStep' },
				{ key: 'licenses', component: 'LicensesStep' },
				{ key: 'skills', component: 'SkillsStep' },
				{ key: 'talents', component: 'TalentsStep' },
				{ key: 'mechBuilder', component: 'MechBuilderStep' }
			],
		};
	},
	methods: {
		exportToFoundry() {
			downloadPilotJson(pilotStore.state);
		},
		savePilot() {
			if (pilotStore.savePilot()) {
				alert("PILOTO SALVO COM SUCESSO NO BANCO DE DADOS LOCAL");
			}
		},
		resetPilot() {
			if (confirm("DESEJA REALMENTE REINICIAR? TODOS OS DADOS NÃO SALVOS SERÃO PERDIDOS.")) {
				pilotStore.reset();
			}
		}
	}
};
</script>

<style scoped>

.creator-container {
	width: 100%;
	display: flex;
	height: calc(100vh - 220px);
	background: rgba(10, 10, 10, 0.8);
	border: 1px solid var(--primary-color);
}

.creator-sidebar {
	flex: 0 0 250px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	border-right: 1px solid var(--primary-color);
}

.step-btn {
	background: transparent;
	border: 1px solid transparent;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	color: var(--text-location);
	padding: 15px 10px;
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	text-transform: uppercase;
	font-family: "Big Shoulders Display", cursive;
	letter-spacing: 1px;
	transition: all 0.2s;
	text-align: left;
}

.step-btn:hover {
	background: rgba(175, 14, 30, 0.1);
}

.step-btn.active {
	border: 1px solid var(--primary-color);
	background: var(--secondary-color);
	color: var(--primary-color);
}

.step-num {
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	opacity: 0.7;
}

.step-name {
	font-size: 18px;
}

.export-container {
	margin-top: auto;
	display: flex;
	flex-direction: column;
}

.actions-label {
	font-family: "Big Shoulders Display", cursive;
	font-size: 14px;
	color: var(--primary-color);
	padding: 10px;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	margin-top: 20px;
	letter-spacing: 2px;
}

.action-btn, .export-btn {
	width: 100%;
	background: var(--primary-color);
	color: white;
	padding: 12px;
	font-family: "Big Shoulders Display", cursive;
	font-size: 16px;
	letter-spacing: 2px;
	border: none;
	cursor: pointer;
	text-transform: uppercase;
	transition: all 0.2s;
	border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.save-btn {
	background: #1a1a1a;
	color: var(--primary-color);
	border: 1px solid var(--primary-color);
}

.save-btn:hover {
	background: var(--primary-color);
	color: white;
}

.reset-btn {
	background: transparent;
	color: #888;
	font-size: 14px;
}

.reset-btn:hover {
	color: white;
	background: rgba(255, 255, 255, 0.1);
}

.export-btn {
	padding: 15px;
	font-size: 18px;
}

.export-btn:hover {
	background: var(--highlight-hover);
}

.creator-content {
	flex: 1;
	display: grid;
	overflow-y: auto;
	padding: 15px;

}
</style>
