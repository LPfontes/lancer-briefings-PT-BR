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
			<img :src="planetPath" ref="planetVideo" />
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
		<div class="header-actions">
			<div class="notification-trigger" :class="{ 'has-new': hasNewMessage }" @click="$emit('open-encrypted')" title="Mensagens Encriptadas">
				<span class="material-symbols-outlined icon">mail</span>
				<div class="ping"></div>
			</div>
			<div class="notification-trigger" @click="$emit('open-notification')" title="Notificações do Sistema">
				<span class="material-symbols-outlined icon">notifications</span>
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
	mounted() {
		this.$refs.planetVideo.onloadedmetadata = () => {
			this.$refs.planetVideo.playbackRate = 0.7;
		};
	},
	data() {
		return {
			hasNewMessage: true
		};
	}
};
</script>

<style lang="scss" scoped>
.header-actions {
	display: flex;
	align-items: center;
	padding-right: 30px;
	gap: 15px;
}

.notification-trigger {
	position: relative;
	cursor: pointer;
	color: rgba(255, 255, 255, 0.4);
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	background: rgba(0, 0, 0, 0.2);

	&:hover {
		color: #00f0ff;
		border-color: #00f0ff;
		background: rgba(0, 240, 255, 0.05);
	}

	&.has-new {
		color: #00f0ff;
		border-color: rgba(0, 240, 255, 0.4);

		.ping {
			position: absolute;
			top: -4px;
			right: -4px;
			width: 10px;
			height: 10px;
			background: #00f0ff;
			border-radius: 50%;
			box-shadow: 0 0 10px #00f0ff;
			animation: ping-pulse 1.5s infinite;
		}
	}

	.icon {
		font-size: 24px;
	}
}

@keyframes ping-pulse {
	0% {
		transform: scale(1);
		opacity: 1;
	}
	100% {
		transform: scale(2.5);
		opacity: 0;
	}
}
</style>
