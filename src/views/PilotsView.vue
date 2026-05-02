<template>
	<div class="section-content-container" :class="{ animate: animateView }" :style="{ 'animation-delay': animationDelay }" id="pilots">
		<div class="pilot-list-container">
			<Pilot v-for="item in pilots" :key="item.callsign" :pilot="item" :animate="animate" />
		</div>
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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
	padding: 2em;
	gap: 1.5em;
  overflow-y: auto;
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
</style>