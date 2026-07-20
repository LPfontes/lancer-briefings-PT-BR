<template>
	<div class="sidebar-page">
		<section class="sidebar-layout">
			<o-sidebar
				id="sidebar"
				position="static"
				:animate="animate"
				:mobile="mobile"
				:expand-on-hover="expandOnHover"
				:reduce="reduce"
				open
			>
				<router-link class="clipped-bottom-right" to="/status">
					<img src="/icons/orbital.svg" />
					<span>{{ $t('sidebar.status') }}</span>
				</router-link>
				<router-link class="clipped-bottom-right" to="/pilots">
					<img src="/icons/pilot.svg" />
					<span>{{ $t('sidebar.pilots') }}</span>
				</router-link>
				<router-link class="clipped-bottom-right" to="/hangar">
					<img src="/icons/deployable.svg" />
					<span>{{ $t('sidebar.hangar') }}</span>
				</router-link>
				<router-link class="clipped-bottom-right" to="/events">
					<img src="/icons/events.svg" />
					<span>{{ $t('sidebar.logs') }}</span>
				</router-link>
				<router-link class="clipped-bottom-right" to="/glossary">
					<img src="/icons/protocol.svg" />
					<span>{{ $t('sidebar.glossary') }}</span>
				</router-link>
				<router-link class="clipped-bottom-right" to="/history">
					<img src="/icons/calendar.svg" />
					<span>{{ $t('sidebar.history') }}</span>
				</router-link>
				<router-link class="clipped-bottom-right" to="/creator">
					<img src="/icons/deployable.svg" />
					<span>{{ $t('sidebar.creator') }}</span>
				</router-link>
				<router-link class="clipped-bottom-right" to="/report">
					<img src="/icons/campaign.svg" />
					<span>{{ $t('sidebar.missionReport') }}</span>
				</router-link>
				<router-link class="clipped-bottom-right" to="/personas">
					<img src="/icons/pilot.svg" />
					<span>{{ $t('sidebar.personas') }}</span>
				</router-link>
			</o-sidebar>
		</section>
	</div>
</template>

<script>
export default {
	props: {
		animate: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			expandOnHover: false,
			mobile: "reduced",
			reduce: false,
		};
	},
};
</script>

<style scoped>
.sidebar-page {
	height: calc(100vh - 95px);
	max-height: calc(100vh - 95px);
	overflow: hidden;
}

.sidebar-layout {
	height: 100%;
	max-height: 100%;
	overflow: hidden;
}

:deep(.o-side__content),
:deep(.o-side) {
	height: 100% !important;
	max-height: 100% !important;
	overflow-y: auto !important;
	overflow-x: hidden !important;
	padding-bottom: 2rem !important;
}

:deep(.o-side__content)::-webkit-scrollbar {
	width: 5px;
}

:deep(.o-side__content)::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.4);
}

:deep(.o-side__content)::-webkit-scrollbar-thumb {
	background: var(--union-crimson, #af0e1e);
	border-radius: 3px;
}
</style>
