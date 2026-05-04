<template>
	<div id="eventsView" :class="{ animate: animateView }" :style="{ 'animation-delay': animationDelay }" class="content-container">

		<section id="events" class="section-container full-width">
			<div class="section-header clipped-medium-backward">
				<img src="/icons/clockwork.svg" />
				<h1>{{ $t('events.title') }} // {{ $t('events.log') }}</h1>
			</div>
			
			<div class="window-body events-container master-detail-layout" :class="{ 'mobile-show-detail': mobileShowDetail }">
				<!-- MASTER LIST (Left) -->
				<div class="master-list-pane">
					<div class="database-info">
						<span class="material-symbols-outlined">history_edu</span>
						<div class="info-text">
							<span class="label">REGISTROS DE MISSÃO</span>
							<span class="status">PROTOCOLO: OMNINET-DECRYPT</span>
						</div>
					</div>

					<div class="events-scroll-area tech-scroll">
						<div 
							v-for="item in events" 
							:key="item.title" 
							class="event-list-item" 
							:class="{ active: selectedEventTitle === item.title }"
							@click="selectEvent(item.title)"
						>
							<div class="event-meta-sidebar">
								<span class="event-time-tag">{{ item.time }}</span>
							</div>
							<div class="event-info-main">
								<span class="event-loc">{{ item.location }}</span>
								<span class="event-title-text">{{ item.title }}</span>
							</div>
							<span class="material-symbols-outlined" v-if="selectedEventTitle === item.title">chevron_right</span>
						</div>
					</div>

					<div class="search-info">LOGS DETECTADOS: {{ events.length }}</div>
				</div>

				<!-- DETAIL PANE (Right) -->
				<div class="detail-pane">
					<button class="mobile-back-btn" @click="mobileShowDetail = false">
						<span class="material-symbols-outlined">arrow_back</span>
						VOLTAR AOS REGISTROS
					</button>
					<div v-if="selectedEvent" class="data-reader-window">
						<div class="reader-header">
							<div class="reader-header-top">
								<span class="protocol-id">LOG_ID: {{ selectedEvent.location.replace(/ /g, '_').toUpperCase() }}_{{ selectedEvent.time.replace(/ /g, '_') }}</span>
								<span class="category-tag">MISSION RECORD</span>
							</div>
							<h2 class="reader-title">{{ selectedEvent.title }}</h2>
							
							<div class="reader-metadata-bar">
								<div class="meta-field">
									<span class="meta-label">LOCALIZAÇÃO:</span>
									<span class="meta-value">{{ selectedEvent.location }}</span>
								</div>
								<div class="meta-field">
									<span class="meta-label">TIMESTAMP:</span>
									<span class="meta-value">{{ selectedEvent.time }}</span>
								</div>
							</div>
						</div>
						
						<div class="reader-body tech-scroll">
							<img v-if="selectedEvent.thumbnail" class="reader-thumbnail" :src="selectedEvent.thumbnail" />
							<div class="reader-content-wrap">
								<vue-markdown-it :source="selectedEvent.content" class="markdown-content" />
							</div>
						</div>

						<div class="reader-footer">
							<div class="scan-line"></div>
							<span>DECRYPTION: COMPLETE // INTEGRITY: 100%</span>
						</div>
					</div>
					<div v-else class="empty-reader">
						<div class="empty-icon">
							<span class="material-symbols-outlined">history_edu</span>
						</div>
						<p>SELECIONE UM REGISTRO PARA DECRIPTAÇÃO</p>
						<div class="loading-bar-static"></div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import { VueMarkdownIt } from '@f3ve/vue-markdown-it';

export default {
	name: "EventsView",
	components: {
		VueMarkdownIt,
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
			selectedEventTitle: null,
			mobileShowDetail: false,
		};
	},
	computed: {
		selectedEvent() {
			if (!this.selectedEventTitle) return null;
			return this.events.find(e => e.title === this.selectedEventTitle);
		}
	},
	methods: {
		selectEvent(title) {
			this.selectedEventTitle = title;
			this.mobileShowDetail = true;
		}
	}
};
</script>

<style scoped>
.events-container {
	display: flex;
	height: calc(100vh - 220px);
	overflow: hidden;
	gap: 0;
	padding: 0;
}

/* Master-Detail Layout */
.master-detail-layout {
	display: grid;
	grid-template-columns: 31% 1fr;
	background: rgba(0, 0, 0, 0.2);
}

.master-list-pane {
	display: flex;
	flex-direction: column;
	background: rgba(175, 14, 30, 0.02);
	border-right: 1px solid rgba(175, 14, 30, 0.2);
	padding: 20px;
	gap: 20px;
}

.database-info {
	display: flex;
	align-items: center;
	gap: 15px;
	padding-bottom: 20px;
	border-bottom: 1px solid rgba(175, 14, 30, 0.2);
}

.database-info .material-symbols-outlined {
	font-size: 32px;
	color: var(--primary-color);
}

.info-text {
	display: flex;
	flex-direction: column;
}

.info-text .label {
	font-family: "Titillium Web", sans-serif;
	font-size: 16px;
	color: white;
	letter-spacing: 1px;
}

.info-text .status {
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
	color: #00ff41;
}

.events-scroll-area {
	flex: 1;
	overflow-y: auto;
	padding-right: 5px;
}

.event-list-item {
	display: flex;
	align-items: center;
	gap: 15px;
	padding: 12px 15px;
	margin-bottom: 8px;
	background: rgba(255, 255, 255, 0.02);
	border: 1px solid rgba(255, 255, 255, 0.05);
	cursor: pointer;
	transition: all 0.2s;
}

.event-list-item:hover {
	background: rgba(255, 255, 255, 0.05);
	border-color: rgba(175, 14, 30, 0.3);
}

.event-list-item.active {
	background: rgba(175, 14, 30, 0.1);
	border-color: var(--primary-color);
	box-shadow: inset 5px 0 15px rgba(175, 14, 30, 0.1);
}

.event-meta-sidebar {
	display: flex;
	flex-direction: column;
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	color: #00ff41;
	min-width: 60px;
}

.event-info-main {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.event-loc {
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	text-transform: uppercase;
	color: #00ff41;
}

.event-title-text {
	font-size: 18px;
	color: white;
	letter-spacing: 1px;
}

.event-list-item.active .material-symbols-outlined {
	font-size: 18px;
	color: var(--primary-color);
}

/* Detail Pane */
.detail-pane {
	height: 100%;
	overflow: hidden;
	background: rgba(0, 0, 0, 0.4);
}

.data-reader-window {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.reader-header {
	padding: 30px 40px;
	background: rgba(175, 14, 30, 0.05);
	border-bottom: 1px solid rgba(175, 14, 30, 0.2);
}

.reader-header-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15px;
}

.protocol-id {
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	color: #00ff41;
	opacity: 0.8;
}

.category-tag {
	font-family: "Big Shoulders Display", cursive;
	font-size: 12px;
	background: var(--primary-color);
	color: white;
	padding: 2px 8px;
	letter-spacing: 1px;
}

.reader-title {
	font-family: "Big Shoulders Display", cursive;
	font-size: 38px;
	color: white;
	margin: 0 0 20px 0;
	letter-spacing: 2px;
	text-transform: uppercase;
}

.reader-metadata-bar {
	display: flex;
	gap: 30px;
	padding-top: 15px;
	border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.meta-field {
	display: flex;
	flex-direction: column;
}

.meta-label {
	font-family: "Titillium Web", sans-serif;
	font-size: 10px;
	color: #00ff41;
	opacity: 0.6;
}

.meta-value {
	font-family: "Titillium Web", sans-serif;
	font-size: 18px;
	color: white;
	letter-spacing: 1px;
}

.reader-body {
	flex: 1;
	padding: 40px;
	overflow-y: auto;
}

.reader-thumbnail {
	width: 100%;
	max-height: 400px;
	object-fit: cover;
	border: 1px solid rgba(175, 14, 30, 0.3);
	margin-bottom: 30px;
}

.reader-content-wrap {
	font-family: "Titillium Web", sans-serif;
	font-size: 18px;
	line-height: 1.7;
	color: rgba(255, 255, 255, 0.95);
}

.reader-content-wrap ::v-deep(b), .reader-content-wrap ::v-deep(strong) {
	color: var(--primary-color);
}

.reader-footer {
	padding: 12px 40px;
	background: rgba(0, 0, 0, 0.6);
	border-top: 1px solid rgba(255, 255, 255, 0.05);
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: var(--text-location);
	display: flex;
	align-items: center;
	gap: 20px;
}

.scan-line {
	height: 1px;
	flex: 1;
	background: linear-gradient(90deg, var(--primary-color), transparent);
	opacity: 0.3;
}

.empty-reader {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: rgba(255, 255, 255, 0.2);
	gap: 20px;
}

.empty-icon span {
	font-size: 64px;
}

.empty-reader p {
	font-family: "Big Shoulders Display", cursive;
	font-size: 18px;
	letter-spacing: 2px;
}

.search-info {
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: var(--text-location);
	text-align: right;
}

.tech-scroll::-webkit-scrollbar {
	width: 4px;
}

.tech-scroll::-webkit-scrollbar-thumb {
	background: var(--primary-color);
}
</style>
