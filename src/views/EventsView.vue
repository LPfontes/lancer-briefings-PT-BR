<template>
	<div id="eventsView" :class="{ animate: animateView }" :style="{ 'animation-delay': animationDelay }" class="content-container">
		<section id="events" :class="{ animate: animate }" class="section-container full-width">
			<div class="section-header clipped-medium-backward">
				<img src="/icons/clockwork.svg" />
				<h1>{{ $t('events.title') }} // {{ $t('events.log') }}</h1>
			</div>
			<div class="section-content-container">
				<div class="events-list-container">
					<Event
						v-for="item in events"
						:key="item.title"
						:event="item"
						:animate="animate" />
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import Event from "@/components/Event.vue";

export default {
	components: {
		Event,
	},
	props: {
		animate: {
			type: Boolean,
			required: true,
		},
		events: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			animateView: this.animate,
			animationDelay: "0.5s",
		};
	},
};
</script>
