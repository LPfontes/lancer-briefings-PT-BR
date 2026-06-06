<template>
	<div id="personasView" :class="{ animate: animateView }" :style="{ 'animation-delay': animationDelay }" class="content-container">
		<!-- Image Viewer Modal/Overlay -->
		<transition name="fade">
			<div v-if="activeImage" class="image-overlay" @click="activeImage = null">
				<div class="image-overlay-content" @click.stop>
					<img :src="activeImage" />
					<button class="close-overlay-btn" @click="activeImage = null">
						<span class="material-symbols-outlined">close</span>
					</button>
				</div>
			</div>
		</transition>

		<section id="personas" class="section-container full-width">
			<div class="section-header clipped-medium-backward">
				<img src="/icons/pilot.svg" />
				<h1>{{ $t('personas.title') }} // {{ $t('personas.database') }}</h1>
			</div>
			
			<div class="window-body personas-container master-detail-layout" :class="{ 'mobile-show-detail': mobileShowDetail }">
				<!-- MASTER LIST (Left) -->
				<div class="master-list-pane">
					<div class="search-bar">
						<span class="material-symbols-outlined">search</span>
						<input type="text" v-model="searchQuery" :placeholder="$t('personas.search')" class="search-input" />
					</div>

					<div class="personas-scroll-area tech-scroll">
						<div 
							v-for="item in filteredPersonas" 
							:key="item.name" 
							class="persona-list-item" 
							:class="{ active: selectedPersonaName === item.name }"
							@click="selectPersona(item.name)"
						>
							<div class="persona-avatar-mini">
								<img v-if="item.image" :src="item.image" />
								<span v-else class="material-symbols-outlined">person</span>
							</div>
							<div class="persona-info-main">
								<span class="persona-name-text">{{ item.name }}</span>
								<span class="persona-faction-tag">{{ item.faction }}</span>
							</div>
							<span class="material-symbols-outlined" v-if="selectedPersonaName === item.name">chevron_right</span>
						</div>
					</div>

					<div class="search-info">REGISTROS LOCALIZADOS: {{ filteredPersonas.length }}</div>
				</div>

				<!-- DETAIL PANE (Right) -->
				<div class="detail-pane">
					<button class="mobile-back-btn" @click="mobileShowDetail = false">
						<span class="material-symbols-outlined">arrow_back</span>
						VOLTAR À LISTA
					</button>
					
					<div v-if="selectedPersona" class="persona-reader-window">
						<div class="reader-header">
							<div class="persona-profile-top">
								<div class="persona-image-large" @click="activeImage = selectedPersona.image" style="cursor: pointer;" title="Clique para ampliar">
									<img v-if="selectedPersona.image" :src="selectedPersona.image" />
									<div v-else class="no-image-placeholder">
										<span class="material-symbols-outlined">person</span>
									</div>
								</div>
								<div class="persona-header-details">
									<div class="persona-meta-top">
										<span class="persona-id">ID_ENTITY: {{ selectedPersona.name.toUpperCase().replace(/ /g, '_') }}</span>
										<span class="status-tag" :class="selectedPersona.status.toLowerCase()">{{ selectedPersona.status }}</span>
									</div>
									<h2 class="persona-title">{{ selectedPersona.name }}</h2>
									<div class="persona-faction-box">
										<span class="faction-label">{{ $t('personas.faction') }}</span>
										<span class="faction-name">{{ selectedPersona.faction }}</span>
									</div>
								</div>
							</div>
						</div>
						
						<div class="persona-body tech-scroll">
							<div class="persona-content-grid">
								<div class="content-section biography">
									<div class="section-tag">{{ $t('personas.biography') }}</div>
									<div class="content-text-box">
										<vue-markdown-it :source="selectedPersona.content" class="markdown-content" />
									</div>
								</div>
							</div>
						</div>

						<div class="reader-footer">
							<div class="scan-line"></div>
							<span>DATA-LOG: {{ selectedPersona.name }} // SECURITY_LEVEL: CLEARANCE_REQUIRED</span>
						</div>
					</div>

					<div v-else class="empty-reader">
						<div class="empty-icon">
							<span class="material-symbols-outlined">account_box</span>
						</div>
						<p>{{ $t('personas.noPersona') }}</p>
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
	name: "PersonasView",
	components: {
		VueMarkdownIt,
	},
	props: {
		animate: {
			type: Boolean,
			required: true,
		},
		personas: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			animateView: this.animate,
			animationDelay: "0.5s",
			selectedPersonaName: null,
			mobileShowDetail: false,
			searchQuery: "",
			activeImage: null,
		};
	},
	computed: {
		filteredPersonas() {
			if (!this.searchQuery) return this.personas;
			return this.personas.filter(p => 
				p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
				p.faction.toLowerCase().includes(this.searchQuery.toLowerCase())
			);
		},
		selectedPersona() {
			if (!this.selectedPersonaName) return null;
			return this.personas.find(p => p.name === this.selectedPersonaName);
		}
	},
	methods: {
		selectPersona(name) {
			this.selectedPersonaName = name;
			this.mobileShowDetail = true;
		}
	}
};
</script>

<style scoped>
.personas-container {
	display: flex;
	height: calc(100vh - 220px);
	overflow: hidden;
	gap: 0;
	padding: 0;
}

.master-detail-layout {
	display: grid;
	grid-template-columns: 31% 1fr;
	background: rgba(0, 0, 0, 0.2);
}

.master-list-pane {
	display: flex;
	flex-direction: column;
	background: rgba(15, 15, 20, 0.6);
	border-right: 1px solid rgba(255, 255, 255, 0.1);
	padding: 20px;
	gap: 20px;
	height: 100%;
	overflow: hidden;
}

.search-bar {
	display: flex;
	align-items: center;
	gap: 10px;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 8px 15px;
}

.search-bar .material-symbols-outlined {
	color: var(--union-crimson);
	font-size: 20px;
}

.search-input {
	background: transparent;
	border: none;
	color: white;
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
	width: 100%;
}

.search-input:focus {
	outline: none;
}

.personas-scroll-area {
	flex: 1;
	overflow-y: auto;
	padding-right: 5px;
}

.persona-list-item {
	display: flex;
	align-items: center;
	gap: 15px;
	padding: 12px;
	margin-bottom: 8px;
	background: rgba(255, 255, 255, 0.02);
	border: 1px solid rgba(255, 255, 255, 0.05);
	cursor: pointer;
	transition: all 0.2s;
}

.persona-list-item:hover {
	background: rgba(255, 255, 255, 0.05);
	border-color: var(--union-crimson);
}

.persona-list-item.active {
	background: rgba(175, 14, 30, 0.15);
	border-color: var(--union-crimson);
	box-shadow: inset 5px 0 15px rgba(175, 14, 30, 0.1);
}

.persona-avatar-mini {
	width: 40px;
	height: 40px;
	background: rgba(175, 14, 30, 0.2);
	border: 1px solid rgba(175, 14, 30, 0.5);
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.persona-content-grid{
	display: flex;
	flex-direction: column;
	padding-bottom: 50px;
}
.persona-avatar-mini img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.persona-info-main {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.persona-name-text {
	font-family: "Titillium Web", sans-serif;
	font-size: 16px;
	color: white;
	font-weight: 700;
}

.persona-faction-tag {
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: #ff9100;
	text-transform: uppercase;
}

.search-info {
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: rgba(255, 255, 255, 0.3);
	text-align: right;
}

/* Detail Pane */
.detail-pane {
	height: 100%;
	overflow: hidden;
	background: rgba(10, 10, 15, 0.4);
}

.persona-reader-window {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.reader-header {
	padding: 40px;
	background: linear-gradient(to bottom, rgba(175, 14, 30, 0.08), transparent);
	border-bottom: 1px solid rgba(175, 14, 30, 0.2);
}

.persona-profile-top {
	display: flex;
	gap: 30px;
	align-items: flex-start;
}

.persona-image-large {
	width: 180px;
	height: 180px;
	background: rgba(0, 0, 0, 0.4);
	border: 2px solid var(--union-crimson);
	padding: 5px;
	clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%);
}

.persona-image-large img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%);
}

.no-image-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: rgba(175, 14, 30, 0.3);
}

.no-image-placeholder span {
	font-size: 80px;
}

.persona-header-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.persona-meta-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.persona-id {
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	color: rgba(255, 255, 255, 0.4);
}

.status-tag {
	font-family: "Big Shoulders Display", cursive;
	font-size: 12px;
	padding: 2px 10px;
	letter-spacing: 1px;
	background: rgba(255, 255, 255, 0.1);
	color: white;
}

.status-tag.ativo { background: #00ff41; color: black; }
.status-tag.desconhecido { background: #ff9100; color: black; }

.persona-title {
	font-family: "Big Shoulders Display", cursive;
	font-size: 56px;
	color: white;
	margin: 0;
	letter-spacing: 4px;
	text-transform: uppercase;
	line-height: 1;
}

.persona-faction-box {
	display: flex;
	flex-direction: column;
	margin-top: 10px;
}

.faction-label {
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: var(--union-crimson);
}

.faction-name {
	font-family: "Titillium Web", sans-serif;
	font-size: 20px;
	color: #ff9100;
	font-weight: 700;
}

.persona-body {
	flex: 1;
	padding: 40px;
	overflow-y: auto;
	min-height: 0;
}

.section-tag {
	font-family: "Big Shoulders Display", cursive;
	font-size: 14px;
	color: var(--union-crimson);
	background: rgba(175, 14, 30, 0.1);
	padding: 4px 12px;
	align-self: flex-start;
	letter-spacing: 2px;
	border-left: 3px solid var(--union-crimson);
	margin-bottom: 15px;
}

.content-text-box {
	font-family: "Titillium Web", sans-serif;
	font-size: 18px;
	line-height: 1.7;
	color: rgba(255, 255, 255, 0.9);
}

.reader-footer {
	padding: 15px 40px;
	background: rgba(0, 0, 0, 0.4);
	border-top: 1px solid rgba(255, 255, 255, 0.05);
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: rgba(255, 255, 255, 0.3);
	display: flex;
	align-items: center;
	gap: 20px;
}

.scan-line {
	height: 1px;
	flex: 1;
	background: linear-gradient(90deg, var(--union-crimson), transparent);
	opacity: 0.3;
}

.empty-reader {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: rgba(255, 255, 255, 0.1);
	gap: 25px;
}

.empty-icon span {
	font-size: 100px;
}

.tech-scroll::-webkit-scrollbar {
	width: 4px;
}
.tech-scroll::-webkit-scrollbar-thumb {
	background: var(--union-crimson);
}

@media (max-width: 1024px) {
	.master-detail-layout {
		grid-template-columns: 1fr;
	}
	.detail-pane {
		position: absolute;
		top: 0; left: 0; width: 100%; height: 100%;
		z-index: 20;
		display: none;
	}
	.mobile-show-detail .detail-pane {
		display: block;
	}
	.persona-profile-top {
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	.persona-meta-top {
		justify-content: center;
		gap: 20px;
	}
}

.mobile-back-btn {
	display: none;
	width: 100%;
	padding: 15px;
	background: #1a1a1a;
	border: none;
	border-bottom: 1px solid #333;
	color: var(--union-crimson);
	font-family: "Big Shoulders Display", cursive;
	font-size: 16px;
	align-items: center;
	gap: 10px;
}

@media (max-width: 1024px) {
	.mobile-back-btn {
		display: flex;
	}
}

/* Image overlay modal */
.image-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.9);
	backdrop-filter: blur(8px);
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.image-overlay-content {
	position: relative;
	max-width: 90vw;
	max-height: 90vh;
	border: 2px solid var(--union-crimson);
	box-shadow: 0 0 30px rgba(175, 14, 30, 0.4);
	display: flex;
	background: #000;
}

.image-overlay-content img {
	max-width: 100%;
	max-height: 85vh;
	object-fit: contain;
}

.close-overlay-btn {
	position: absolute;
	top: -40px;
	right: 0;
	background: transparent;
	border: none;
	color: var(--union-crimson);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
}

.close-overlay-btn span {
	font-size: 30px;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
	transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
	opacity: 0;
}
</style>
