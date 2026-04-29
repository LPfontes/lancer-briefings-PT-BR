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

					<div class="export-container">
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
}

.export-btn {
	width: 100%;
	background: var(--primary-color);
	color: white;
	padding: 15px;
	font-family: "Big Shoulders Display", cursive;
	font-size: 18px;
	letter-spacing: 2px;
	border: none;
	cursor: pointer;
	text-transform: uppercase;
	transition: background 0.2s;
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
