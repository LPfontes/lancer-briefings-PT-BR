<template>
	<div class="event-window" :class="{ expanded: isExpanded }">
		<div class="window-title-bar" @click="toggleExpand">
			<div class="window-controls">
				<span class="control red"></span>
				<span class="control yellow"></span>
				<span class="control green"></span>
			</div>
			<div class="window-title">
				{{ event.location }} // {{ event.title }}
			</div>
			<div class="window-status">
				{{ isExpanded ? 'ACTIVE_LOG' : 'ENCRYPTED' }}
			</div>
		</div>
		<div class="window-body" v-if="isExpanded">
			<div class="window-metadata">
				<div class="meta-item">
					<span class="label">TIMESTAMP:</span>
					<span class="value">{{ event.time }}</span>
				</div>
				<div class="meta-item">
					<span class="label">ORIGIN:</span>
					<span class="value">{{ event.location }}</span>
				</div>
			</div>
			<img v-if="event.thumbnail" class="thumbnail" :src="event.thumbnail" />
			<vue-markdown-it :source="event.content" class="markdown" />
		</div>
	</div>
</template>

<script>
import { VueMarkdownIt } from '@f3ve/vue-markdown-it';
import removeMd from "remove-markdown";

export default {
	name: "Event",
	components: {
		VueMarkdownIt,
	},
	props: {
		event: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			isExpanded: false,
			removeMd,
		};
	},
	methods: {
		toggleExpand() {
			this.isExpanded = !this.isExpanded;
		}
	}
}
</script>
