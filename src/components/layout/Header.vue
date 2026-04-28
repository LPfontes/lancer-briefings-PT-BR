<template>
	<header>
		<div class="title clipped-x-large-forward">
			<img class="logo" :src="header.icon" />
			<div class="title-container">
				<div id="title-first-line" class="title-row">
					<span id="title-header">{{ header.headerTitle }}</span>
					<span id="title-subheader">{{ header.headerSubtitle }}</span>
				</div>
				<div class="title-row">
					<span id="subtitle-header">{{ header.subheaderTitle }}</span>
					<span id="subtitle-subheader">// {{ header.subheaderSubtitle }}</span>
				</div>
			</div>
		</div>
		<div class="rhombus"></div>
		<div class="planet-location-container">
			<video ref="planetVideo" autoplay muted loop width="90px" height="90px">
				<source :src="`${planetPath}`" type="video/webm" />
			</video>
			<div class="location-info">
				<div id="planet-year" class="location-row">
					<div id="year">
						<h4>{{ $t('header.year') }}</h4>
						<span class="subtitle">{{ header.year }}</span>
					</div>
					<div id="planet">
						<h4>{{ $t('header.deploymentInfo') }}</h4>
						<span class="subtitle">{{ header.planet }}</span>
					</div>
				</div>
				<div id="system-gate-ring" class="location-row">
					<div id="ring">
						<h4>{{ $t('header.ring') }}</h4>
						<span class="subtitle">{{ header.ring }}</span>
					</div>
					<div id="gate">
						<h4>{{ $t('header.gate') }}</h4>
						<span class="subtitle">{{ header.gate }}</span>
					</div>
					<div id="system">
						<h4>{{ $t('header.system') }}</h4>
						<span class="subtitle">{{ header.system }}</span>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>

<script>
export default {
	components: {},
	props: {
		planetPath: {
			type: String,
			required: true,
		},
		header: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {};
	},
	created() { },
	mounted() {
		this.$refs.planetVideo.playbackRate = 0.7;
	},
};
</script>

<style lang="scss" scoped></style>
