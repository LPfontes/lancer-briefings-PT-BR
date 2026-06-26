<template>
	<div class="section-content-container" :class="{ animate: animateView }" :style="{ 'animation-delay': animationDelay }" id="pilots">
		<div class="pilot-list-container">
			<Pilot v-for="item in pilots" :key="item.callsign" :pilot="item" :animate="animate" />
		</div>
		<router-link to="/creator" class="fab-btn" :title="$t('pilotCreator.title') || 'Criar Novo Piloto'">
			<span class="material-symbols-outlined">person_add</span>
		</router-link>
	</div>
</template>

<script>
import { VueMarkdownIt } from '@f3ve/vue-markdown-it';
import Pilot from "@/components/Pilot.vue";


export default {
	components: {
		VueMarkdownIt,
		Pilot,
	},
	props: {
		animate: {
			type: Boolean,
			required: true,
		},
		pilots: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			animateView: this.animate,
			animationDelay: "0s",
			clockAnimationDelay: "2500",
		};
	},
	methods: {
		setAnimate() {
			if (this.animate) {
				this.animateView = true;
			}
			let statusAnimated = window.sessionStorage.getItem("statusAnimated");
			if (statusAnimated) {
				this.animationDelay = "0s";
			}
			if (statusAnimated === null) {
				window.sessionStorage.setItem("statusAnimated", true);
			}
		}
	}
};
</script>

<style scoped>
.pilot-list-container {
	display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	padding: 2em;
	gap: 1.5em;
  overflow-y: auto;
  height: calc(100vh - 250px);
  width: 80%;
}

.section-content-container {
	border: 0px solid transparent;
  width: 100%;
}

section.section-container#pilots {
	display: flex;
	flex-direction: column;
	margin: 20px;
	width: calc(100% - 40px);
}

.fab-btn {
	position: fixed;
	bottom: 30px;
	right: 30px;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: var(--primary-color);
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 15px rgba(175, 14, 30, 0.4), 0 0 0 2px rgba(175, 14, 30, 0.2);
	cursor: pointer;
	z-index: 99;
	text-decoration: none;
	transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.fab-btn:hover {
	background: #d40d1b;
	box-shadow: 0 6px 20px rgba(175, 14, 30, 0.6), 0 0 15px var(--primary-color);
	transform: translateY(-2px) scale(1.05);
}

.fab-btn .material-symbols-outlined {
	font-size: 28px;
}

@media (max-width: 768px) {
	.fab-btn {
		bottom: 80px; /* Acima da barra de navegação inferior mobile (58px) */
		right: 20px;
		width: 48px;
		height: 48px;
	}
	.fab-btn .material-symbols-outlined {
		font-size: 24px;
	}
}
</style>