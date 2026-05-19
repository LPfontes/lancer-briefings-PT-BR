<template>
	<div id="missionReportView" :class="{ animate: animateView }" :style="{ 'animation-delay': animationDelay }" class="content-container">
		<section id="reports" class="section-container full-width">
			<div class="section-header clipped-medium-backward">
				<img src="/icons/campaign.svg" />
				<h1>{{ $t('missionReport.title') }} // {{ $t('missionReport.debriefing') }}</h1>
			</div>
			
			<div class="window-body reports-container master-detail-layout" :class="{ 'mobile-show-detail': mobileShowDetail }">
				<!-- MASTER LIST (Left) -->
				<div class="master-list-pane">
					<div class="database-info">
						<span class="material-symbols-outlined">assignment</span>
						<div class="info-text">
							<span class="label">ARQUIVOS DE DEBRIEFING</span>
							<span class="status">ACESSO: NÍVEL 4 (COMANDO)</span>
						</div>
					</div>

					<div class="reports-scroll-area tech-scroll">
						<div 
							v-for="item in reports" 
							:key="item.slug" 
							class="report-list-item" 
							:class="[item.status, { active: selectedMissionSlug === item.slug }]"
							@click="selectMission(item.slug)"
						>
							<div class="report-id-badge">{{ item.slug }}</div>
							<div class="report-info-main">
								<span class="report-title-text">{{ item.name }}</span>
								<span class="report-status-tag" :class="item.status">{{ getStatusText(item.status) }}</span>
							</div>
							<span class="material-symbols-outlined" v-if="selectedMissionSlug === item.slug">analytics</span>
						</div>
					</div>

					<div class="search-info">RELATÓRIOS ARQUIVADOS: {{ reports.length }}</div>
				</div>

				<!-- DETAIL PANE (Right) -->
				<div class="detail-pane">
					<button class="mobile-back-btn" @click="mobileShowDetail = false">
						<span class="material-symbols-outlined">arrow_back</span>
						VOLTAR AOS ARQUIVOS
					</button>
					
					<div v-if="selectedMission" class="report-reader-window">
						<div class="reader-header">
							<div class="reader-header-top">
								<span class="protocol-id">{{ $t('missionReport.missionId') }}: LNC-{{ selectedMission.slug }}-DEBRIEF</span>
								<div class="status-indicator" :class="selectedMission.status">
									<div class="pulse-dot"></div>
									<span>{{ $t('missionReport.status') }}: {{ getStatusLabel(selectedMission.status) }}</span>
								</div>
							</div>
							<h2 class="reader-title">{{ selectedMission.name }}</h2>
						</div>
						
						<div class="report-body tech-scroll">
							<div class="report-grid">
								<!-- Summary Section -->
								<div class="report-section full-row">
									<div class="section-tag">{{ $t('missionReport.summary') }}</div>
									<div class="report-content-box">
										<vue-markdown-it :source="selectedMission.content" class="markdown-content" />
									</div>
								</div>

								<!-- Analysis Section -->
								<div class="report-section full-row">
									<div class="section-tag">{{ $t('missionReport.objectives') }}</div>
									<div class="report-content-box list-box">
										<div v-for="(obj, i) in objectives" :key="i" class="objective-item" :class="{ completed: selectedMission.status === 'success' }">
											<span class="material-symbols-outlined">{{ selectedMission.status === 'success' ? 'check_circle' : 'pending' }}</span>
											{{ obj }}
										</div>
										<div v-if="objectives.length === 0" class="objective-item dim">
											SEM OBJETIVOS REGISTRADOS
										</div>
									</div>
								</div>

								<div class="report-section full-row">
									<div class="section-tag">{{ $t('missionReport.notes') }}</div>
									<div class="report-content-box notes-box">
										<p class="typewriter-effect">Os resultados indicam uma eficácia tática satisfatória, embora a integridade dos chassis tenha sido comprometida em 35% acima das projeções. Recomenda-se reavaliação dos sistemas de refrigeração para implantações em ambientes de alta densidade e dos sistemas de mira.</p>
										<div class="stamped-signature">
											<span class="sign-label">APROVADO POR:</span>
											<span class="sign-name">IA ALIA // COMANDO TÁTICO</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="reader-footer">
							<div class="scan-line"></div>
							<span>{{ $t('missionReport.aar') }} // PROTOCOLO {{ selectedMission.status.toUpperCase() }} // DATA-STREAM: SECURE</span>
						</div>
					</div>

					<div v-else class="empty-reader">
						<div class="empty-icon">
							<span class="material-symbols-outlined">analytics</span>
						</div>
						<p>{{ $t('missionReport.noMission') }}</p>
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
	name: "MissionReportView",
	components: {
		VueMarkdownIt,
	},
	props: {
		animate: {
			type: Boolean,
			required: true,
		},
		reports: {
			type: Array,
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
			animationDelay: "0.5s",
			selectedMissionSlug: null,
			mobileShowDetail: false,
		};
	},
	computed: {
		selectedMission() {
			if (!this.selectedMissionSlug) return null;
			return this.reports.find(m => m.slug === this.selectedMissionSlug);
		},
		objectives() {
			if (!this.selectedMission || !this.selectedMission.content) return [];
			// Extract bullet points from markdown
			const lines = this.selectedMission.content.split('\n');
			const objectives = lines
				.filter(line => line.trim().startsWith('-'))
				.map(line => line.trim().substring(1).trim());
			return objectives;
		}
	},
	methods: {
		selectMission(slug) {
			this.selectedMissionSlug = slug;
			this.mobileShowDetail = true;
		},
		getStatusKey(status) {
			if (status === "start") return "briefing";
			if (status === "partial-success") return "partial";
			if (status === "success") return "success";
			if (status === "failure") return "failure";
			return "briefing";
		},
		getStatusText(status) {
			return this.$t(`mission.status.${this.getStatusKey(status)}`).replace('\n', ' ');
		},
		getStatusLabel(status) {
			return this.getStatusText(status).toUpperCase();
		}
	}
};
</script>

<style scoped>
.reports-container {
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
	background: rgba(20, 20, 25, 0.4);
	border-right: 1px solid rgba(255, 255, 255, 0.1);
	padding: 20px;
	gap: 20px;
}

.database-info {
	display: flex;
	align-items: center;
	gap: 15px;
	padding-bottom: 20px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.database-info .material-symbols-outlined {
	font-size: 32px;
	color: #00e5ff;
}

.info-text {
	display: flex;
	flex-direction: column;
}

.info-text .label {
	font-family: \"Titillium Web\", sans-serif;
	font-size: 16px;
	color: white;
	letter-spacing: 1px;
}

.info-text .status {
	font-family: \"Inconsolata\", monospace;
	font-size: 12px;
	color: #ff9100;
}

.reports-scroll-area {
	flex: 1;
	overflow-y: auto;
	padding-right: 5px;
}

.report-list-item {
	display: flex;
	align-items: center;
	gap: 15px;
	padding: 15px;
	margin-bottom: 10px;
	background: rgba(255, 255, 255, 0.03);
	border-left: 3px solid rgba(255, 255, 255, 0.1);
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.report-list-item:hover {
	background: rgba(255, 255, 255, 0.08);
	transform: translateX(5px);
}

.report-list-item.active {
	background: rgba(0, 229, 255, 0.1);
	border-left-color: #00e5ff;
	box-shadow: 10px 0 20px rgba(0, 0, 0, 0.2);
}

.report-id-badge {
	font-family: \"Inconsolata\", monospace;
	font-size: 14px;
	color: #00e5ff;
	background: rgba(0, 229, 255, 0.1);
	padding: 2px 8px;
	border: 1px solid rgba(0, 229, 255, 0.3);
}

.report-info-main {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.report-title-text {
	font-family: \"Titillium Web\", sans-serif;
	font-size: 18px;
	color: white;
	font-weight: 700;
	letter-spacing: 0.5px;
}

.report-status-tag {
	
	font-size: 12px;
	letter-spacing: 1px;
	text-transform: uppercase;
}

.report-status-tag.success { color: #00ff41; }
.report-status-tag.failure { color: #ff1744; }
.report-status-tag.partial-success { color: #ffea00; }
.report-status-tag.start { color: #00e5ff; }

/* Detail Pane */
.detail-pane {
	height: 100%;
	overflow: hidden;
	background: rgba(10, 10, 15, 0.6);
	position: relative;
}

.report-reader-window {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.reader-header {
	padding: 40px;
	background: linear-gradient(to bottom, rgba(0, 229, 255, 0.05), transparent);
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.reader-header-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.protocol-id {
	font-family: \"Inconsolata\", monospace;
	font-size: 12px;
	color: rgba(255, 255, 255, 0.5);
}

.status-indicator {
	display: flex;
	align-items: center;
	gap: 10px;
	font-family: \"Inconsolata\", monospace;
	font-size: 12px;
	color: white;
}

.pulse-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: #00e5ff;
	box-shadow: 0 0 10px #00e5ff;
}

.status-indicator.success .pulse-dot { background: #00ff41; box-shadow: 0 0 10px #00ff41; }
.status-indicator.failure .pulse-dot { background: #ff1744; box-shadow: 0 0 10px #ff1744; }

.reader-title {
	font-size: 48px;
	color: white;
	margin: 0;
	letter-spacing: 3px;
	text-transform: uppercase;
	line-height: 1;
}

.report-body {
	flex: 1;
	padding: 40px;
	overflow-y: auto;
}

.report-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30px;
}

.full-row {
	grid-column: 1 / -1;
}

.report-section {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.section-tag {
	font-size: 14px;
	color: #00e5ff;
	background: rgba(0, 229, 255, 0.1);
	padding: 4px 12px;
	align-self: flex-start;
	letter-spacing: 2px;
	border-right: 3px solid #00e5ff;
}

.report-content-box {
	background: rgba(255, 255, 255, 0.02);
	border: 1px solid rgba(255, 255, 255, 0.05);
	padding: 25px;
	font-family: \"Titillium Web\", sans-serif;
	font-size: 16px;
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.8);
}

.list-box {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.objective-item {
	display: flex;
	align-items: center;
	gap: 12px;
	color: rgba(255, 255, 255, 0.9);
}

.objective-item .material-symbols-outlined {
	font-size: 20px;
	color: #ff9100;
}

.objective-item.completed {
	color: rgba(0, 255, 65, 0.8);
}

.objective-item.completed .material-symbols-outlined {
	color: #00ff41;
}

.notes-box {
	border-left: 4px solid #ff9100;
	position: relative;
	overflow: hidden;
}

.notes-box::before {
	content: \"CONFIDENTIAL\";
	position: absolute;
	top: 10px;
	right: 10px;
	font-size: 40px;
	color: rgba(255, 145, 0, 0.05);
	transform: rotate(-15deg);
	pointer-events: none;
}

.stamped-signature {
	margin-top: 30px;
	padding-top: 20px;
	border-top: 1px dashed rgba(255, 145, 0, 0.2);
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.sign-label {
	font-family: \"Inconsolata\", monospace;
	font-size: 10px;
	color: rgba(255, 145, 0, 0.6);
}

.sign-name {
	
	font-size: 18px;
	color: #ff9100;
	letter-spacing: 1px;
}

.reader-footer {
	padding: 15px 40px;
	background: rgba(0, 0, 0, 0.4);
	border-top: 1px solid rgba(255, 255, 255, 0.05);
	font-family: \"Inconsolata\", monospace;
	font-size: 10px;
	color: rgba(255, 255, 255, 0.3);
	display: flex;
	align-items: center;
	gap: 20px;
}

.scan-line {
	height: 1px;
	flex: 1;
	background: linear-gradient(90deg, #00e5ff, transparent);
	opacity: 0.2;
}

.empty-reader {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: rgba(255, 255, 255, 0.15);
	gap: 25px;
}

.empty-icon span {
	font-size: 80px;
	color: rgba(0, 229, 255, 0.1);
}

.empty-reader p {
	
	font-size: 20px;
	letter-spacing: 2px;
	text-transform: uppercase;
}

.loading-bar-static {
	width: 200px;
	height: 2px;
	background: rgba(255, 255, 255, 0.05);
	position: relative;
	overflow: hidden;
}

.loading-bar-static::after {
	content: \"\";
	position: absolute;
	left: -100%;
	width: 100%;
	height: 100%;
	background: #00e5ff;
	animation: loading 2s infinite;
}

@keyframes loading {
	0% { left: -100%; }
	100% { left: 100%; }
}

.dim { opacity: 0.4; }

/* Scrollbar */
.tech-scroll::-webkit-scrollbar {
	width: 4px;
}
.tech-scroll::-webkit-scrollbar-thumb {
	background: rgba(0, 229, 255, 0.3);
}
.tech-scroll::-webkit-scrollbar-thumb:hover {
	background: #00e5ff;
}

/* Mobile adjustments */
@media (max-width: 1024px) {
	.master-detail-layout {
		grid-template-columns: 1fr;
	}
	
	.detail-pane {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;
		display: none;
	}
	
	.mobile-show-detail .detail-pane {
		display: block;
	}
	
	.report-grid {
		grid-template-columns: 1fr;
	}
}

.mobile-back-btn {
	display: none;
	width: 100%;
	padding: 15px;
	background: #1a1a1a;
	border: none;
	border-bottom: 1px solid #333;
	color: #00e5ff;
	
	font-size: 16px;
	align-items: center;
	gap: 10px;
	cursor: pointer;
}

@media (max-width: 1024px) {
	.mobile-back-btn {
		display: flex;
	}
}
</style>
