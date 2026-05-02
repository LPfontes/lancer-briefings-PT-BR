<template>
	<div id="historyView" :class="{ animate: animateView }" :style="{ 'animation-delay': animationDelay }" class="content-container">
		<section id="history-section" class="section-container full-width">
			<div class="section-header clipped-medium-backward">
				<img src="/icons/calendar.svg" />
				<h1>{{ $t('history.title') }} // {{ currentTabLabel }}</h1>
			</div>

			<div class="section-content-container history-outer-container">
				<div class="history-tabs">
					<button :class="{ active: currentTab === 'chronology' }" @click="currentTab = 'chronology'">{{ $t('history.tabs.chronology') }}</button>
					<button :class="{ active: currentTab === 'universe' }" @click="currentTab = 'universe'">{{ $t('history.tabs.universe') }}</button>
					<button :class="{ active: currentTab === 'history' }" @click="currentTab = 'history'">{{ $t('history.tabs.history') }}</button>
					<button :class="{ active: currentTab === 'politics' }" @click="currentTab = 'politics'">{{ $t('history.tabs.politics') }}</button>
					<button :class="{ active: currentTab === 'pillars' }" @click="currentTab = 'pillars'">{{ $t('history.tabs.pillars') }}</button>
				</div>

				<!-- CRONOLOGIA -->
				<div v-if="currentTab === 'chronology'" class="tab-content">
					<div class="history-note">
						<span class="warning-blink">i</span> {{ $t('history.note') }}
					</div>
					<div class="timeline-container">
						<div v-for="period in historyData" :key="period.title" class="period-group">
							<div class="period-header">
								<div class="period-title">{{ period.title }}</div>
								<div class="period-range">{{ period.range }}</div>
							</div>
							<div class="events-list">
								<div v-for="(event, index) in period.events" :key="index" class="history-event">
									<div class="event-marker">
										<div class="marker-dot"></div>
										<div class="marker-line" v-if="index < period.events.length - 1"></div>
									</div>
									<div class="event-details">
										<div class="event-date" v-if="event.date">{{ event.date }}</div>
										<div class="event-note" v-if="event.note">{{ event.note }}</div>
										<div class="event-content">{{ event.description }}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- UNIVERSO (Geography, Institutions, Society) -->
				<div v-if="currentTab === 'universe'" class="tab-content">
					<div class="scroll-content">
						<div class="world-section">
							<h2 class="section-subtitle">{{ worldData.galaxy_shape.title }}</h2>
							<p class="section-desc">{{ worldData.galaxy_shape.description }}</p>
							
							<div class="rings-grid">
								<div v-for="ring in worldData.galaxy_shape.rings" :key="ring.id" class="ring-card">
									<div class="ring-header">
										<span class="ring-id">{{ ring.id }}</span>
										<span class="ring-line">// LINHA {{ ring.line }}</span>
									</div>
									<div class="stations-list">
										<span v-for="station in ring.stations" :key="station" class="station-tag">Estação {{ station }}</span>
									</div>
								</div>
							</div>
							<p class="section-footer">{{ worldData.galaxy_shape.footer }}</p>
						</div>

						<div class="world-section">
							<h2 class="section-subtitle">{{ worldData.institutions.title }}</h2>
							<p class="section-desc">{{ worldData.institutions.description }}</p>
							<div class="institutions-grid">
								<div v-for="inst in worldData.institutions.items" :key="inst.id" class="institution-card">
									<div class="inst-icon-box">
										<img :src="getInstIcon(inst.id)" />
									</div>
									<div class="inst-details">
										<h3 class="inst-title">{{ inst.title }}</h3>
										<p class="inst-content">{{ inst.content }}</p>
									</div>
								</div>
							</div>
							<div class="institutions-footer">
								<p>{{ worldData.institutions.footer }}</p>
							</div>
						</div>

						<div class="world-section">
							<h2 class="section-subtitle">{{ worldData.society.title }}</h2>
							<p class="section-desc">{{ worldData.society.description }}</p>
							<div class="society-groups">
								<div v-for="group in worldData.society.groups" :key="group.id" class="society-card">
									<h3 class="group-title">{{ group.id }}</h3>
									<p class="group-content">{{ group.content }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- HISTÓRIA (The Beginning & 5016u) -->
				<div v-if="currentTab === 'history'" class="tab-content">
					<div class="scroll-content narrative-text">
						<div class="narrative-section">
							<h2 class="section-subtitle">{{ worldData.the_beginning.title }}</h2>
							<p v-for="(para, idx) in worldData.the_beginning.content" :key="idx">{{ para }}</p>
						</div>
						
						<div class="narrative-divider"></div>

						<div class="narrative-section">
							<h2 class="section-subtitle">{{ worldData.current_era.title }}</h2>
							<p class="era-desc">{{ worldData.current_era.description }}</p>
							<p v-for="(para, idx) in worldData.current_era.content" :key="'era-'+idx">{{ para }}</p>
							<div class="era-challenges">
								<h3 class="challenges-title">DESAFIOS ATUAIS</h3>
								<p>{{ worldData.current_era.challenges }}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- POLÍTICA (Coalitions & Antrochauvinism) -->
				<div v-if="currentTab === 'politics'" class="tab-content">
					<div class="scroll-content">
						<h2 class="section-subtitle">{{ worldData.politics.title }}</h2>
						<p class="section-desc">{{ worldData.politics.description }}</p>
						
						<div class="coalitions-list">
							<div v-for="coal in worldData.politics.coalitions" :key="coal.id" class="coalition-card">
								<div class="coal-header">
									<h3 class="coal-name">{{ coal.id }}</h3>
									<div class="coal-stats">
										<span class="coal-lean">{{ coal.lean }}</span>
										<span class="coal-power">{{ coal.power }}</span>
									</div>
								</div>
								<p class="coal-content">{{ coal.content }}</p>
							</div>
						</div>

						<div class="politics-highlight antrochauvinism-box">
							<div class="highlight-header">
								<h3>{{ worldData.politics.antrochauvinism.title }}</h3>
							</div>
							<div class="highlight-content">
								<p>{{ worldData.politics.antrochauvinism.content }}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- PILARES (Utopic Pillars) -->
				<div v-if="currentTab === 'pillars'" class="tab-content">
					<div class="scroll-content">
						<h2 class="section-subtitle">{{ worldData.pillars.title }}</h2>
						<p class="section-desc">{{ worldData.pillars.description }}</p>
						
						<div class="pillars-grid">
							<div v-for="pillar in worldData.pillars.items" :key="pillar.id" class="pillar-card">
								<div class="pillar-number">{{ pillar.id }}</div>
								<div class="pillar-body">
									<h3 class="pillar-title">{{ pillar.title }}</h3>
									<p class="pillar-content">{{ pillar.content }}</p>
								</div>
							</div>
						</div>
						
						<div class="pillars-explanation">
							<p>{{ worldData.pillars.footer }}</p>
						</div>
					</div>
				</div>

				<div class="database-footer">
					<div class="status-bit">DATA-SOURCE: UNION ARCHIVES</div>
					<div class="status-bit">CLEARANCE: LEVEL 1</div>
					<div class="status-bit">TIMESTAMP: {{ new Date().getFullYear() }}</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import historyData from "@/assets/info/history.json";
import worldData from "@/assets/info/world_setting.json";

export default {
	name: "HistoryView",
	props: {
		animate: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			animateView: this.animate,
			animationDelay: "0.5s",
			currentTab: "chronology",
			historyData: historyData,
			worldData: worldData
		};
	},
	computed: {
		currentTabLabel() {
			return this.$t(`history.tabs.${this.currentTab}`);
		}
	},
	methods: {
		getInstIcon(id) {
			switch(id) {
				case 'LAMPEJO': return '/icons/orbital.svg';
				case 'MANA': return '/icons/license.svg';
				case 'OMNINET': return '/icons/protocol.svg';
				default: return '/icons/protocol.svg';
			}
		}
	}
};
</script>

<style scoped>
.history-outer-container {
	display: flex;
	flex-direction: column;
	gap: 15px;
	padding: 20px;
	overflow: hidden;
	color: white;
}

/* Tabs Styling */
.history-tabs {
	display: flex;
	gap: 10px;
	margin-bottom: 5px;
}

.history-tabs button {
	background: transparent;
	border: 1px solid var(--primary-color);
	color: var(--primary-color);
	padding: 8px 15px;
	font-family: "Big Shoulders Display", cursive;
	cursor: pointer;
	transition: all 0.2s;
	letter-spacing: 1px;
	font-size: 14px;
}

.history-tabs button.active {
	background: var(--primary-color);
	color: white;
}

.tab-content {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	gap: 15px;
	overflow: hidden;
	animation: fadeIn 0.4s ease-out;
}

.scroll-content {
	flex-grow: 1;
	overflow-y: auto;
	padding-right: 15px;
}

/* Sections Styling */
.world-section {
	margin-bottom: 40px;
}

.section-subtitle {
	font-family: "Big Shoulders Display", cursive;
	font-size: 32px;
	color: var(--primary-color);
	margin-bottom: 15px;
	border-left: 4px solid var(--primary-color);
	padding-left: 15px;
	letter-spacing: 2px;
}

.section-desc {
	font-size: 16px;
	line-height: 1.6;
	color: var(--text-location);
	margin-bottom: 25px;
	opacity: 0.9;
}

/* Institutions Grid */
.institutions-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 15px;
	margin-bottom: 20px;
}

.institution-card {
	background: rgba(175, 14, 30, 0.05);
	border: 1px solid rgba(175, 14, 30, 0.3);
	padding: 15px;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 10px;
}

.inst-icon-box {
	background: var(--primary-color);
	width: 50px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
}

.inst-icon-box img {
	width: 30px;
	height: 30px;
	filter: brightness(0) invert(1);
}

.inst-title {
	font-family: "Big Shoulders Display", cursive;
	font-size: 20px;
	color: var(--primary-color);
	letter-spacing: 1px;
}

.inst-content {
	font-size: 14px;
	line-height: 1.4;
	color: var(--text-location);
}

.institutions-footer {
	font-family: "Inconsolata", monospace;
	font-size: 16px;
	color: var(--text-location);
	font-style: italic;
	background: rgba(0, 0, 0, 0.2);
	padding: 15px;
	border-left: 2px solid var(--primary-color);
}

/* Politics / Coalitions */
.coalitions-list {
	display: flex;
	flex-direction: column;
	gap: 15px;
	margin-bottom: 30px;
}

.coalition-card {
	background: rgba(255, 255, 255, 0.02);
	border: 1px solid rgba(175, 14, 30, 0.2);
	padding: 15px;
}

.coal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	border-bottom: 1px solid rgba(175, 14, 30, 0.2);
	padding-bottom: 5px;
}

.coal-name {
	font-family: "Big Shoulders Display", cursive;
	font-size: 22px;
	color: var(--primary-color);
	letter-spacing: 1px;
}

.coal-stats {
	display: flex;
	gap: 10px;
	font-family: "Inconsolata", monospace;
	font-size: 14px;
}

.coal-lean {
	background: rgba(175, 14, 30, 0.1);
	padding: 2px 8px;
	color: var(--text-location);
}

.coal-power {
	background: var(--primary-color);
	padding: 2px 8px;
	color: white;
	font-weight: bold;
}

.coal-content {
	font-size: 14px;
	line-height: 1.5;
	color: var(--text-markdown-p);
}

.antrochauvinism-box {
	background: rgba(175, 14, 30, 0.15);
	border: 2px solid var(--primary-color);
	padding: 20px;
	margin-top: 40px;
}

.highlight-header {
	display: flex;
	align-items: center;
	gap: 15px;
	margin-bottom: 15px;
}

.highlight-header img {
	width: 32px;
	height: 32px;
}

.highlight-header h3 {
	font-family: "Big Shoulders Display", cursive;
	font-size: 24px;
	color: var(--primary-color);
	letter-spacing: 2px;
}

.highlight-content p {
	font-size: 15px;
	line-height: 1.6;
	color: var(--text-location);
	text-align: justify;
}

/* History Narrative */
.narrative-section p {
	font-size: 17px;
	line-height: 1.7;
	color: var(--text-markdown-p);
	margin-bottom: 20px;
	text-align: justify;
}

.narrative-divider {
	height: 40px;
	background: radial-gradient(circle, var(--primary-color) 0%, transparent 70%);
	opacity: 0.2;
	margin: 20px 0;
}

.protocol-id {
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	color: #00ff41;
	opacity: 0.8;
}

.era-desc {
	font-family: "Inconsolata", monospace;
	font-size: 15px;
	color: var(--primary-color);
	margin-bottom: 15px;
	font-style: italic;
}

.era-challenges {
	background: rgba(255, 255, 255, 0.05);
	padding: 20px;
	border: 1px solid var(--primary-color);
	margin-top: 20px;
}

.challenges-title {
	font-family: "Big Shoulders Display", cursive;
	font-size: 18px;
	color: var(--primary-color);
	margin-bottom: 10px;
}

/* Grid & Layout Helpers */
.rings-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 10px;
}

.ring-card {
	background: rgba(175, 14, 30, 0.03);
	border: 1px solid rgba(175, 14, 30, 0.2);
	padding: 10px;
	color: white;
}

.ring-header {
	display: flex;
	justify-content: space-between;
}

.ring-id {
	color: white;
	font-weight: bold;
}

.stations-list {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	margin-top: 5px;
}

.station-tag {
	font-size: 16px;
	padding: 1px 4px;
	background: rgba(0,0,0,0.2);
	color: var(--primary-color);
	font-weight: 600;
}

.society-groups {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.society-card {
	background: rgba(255, 255, 255, 0.01);
	border: 1px solid rgba(175, 14, 30, 0.1);
	padding: 15px;
}

.group-title {
	color: var(--primary-color);
	font-size: 20px;
}

/* Pillars Styling */
.pillars-grid {
	display: grid;
	gap: 15px;
}

.pillar-card {
	display: flex;
	gap: 20px;
	background: rgba(175, 14, 30, 0.05);
	border: 1px solid var(--primary-color);
	padding: 20px;
}

.pillar-number {
	font-size: 48px;
	font-family: "Big Shoulders Display", cursive;
	color: rgba(175, 14, 30, 0.3);
}

.pillar-title {
	font-size: 20px;
	color: var(--primary-color);
}

/* Base UI Elements */
.history-note {
	background: rgba(175, 14, 30, 0.1);
	border: 1px solid var(--primary-color);
	padding: 8px 15px;
	display: flex;
	align-items: center;
	gap: 10px;
}

.timeline-container {
	flex-grow: 1;
	overflow-y: auto;
}

.period-header {
	border-bottom: 2px solid var(--primary-color);
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
}

.period-title {
	color: var(--primary-color);
	font-size: 24px;
}
.events-list{
	margin: 10px;
}
.history-event {
	display: flex;
	gap: 15px;
}

.event-details {
	padding-bottom: 20px;
}

.event-date {
	color: var(--primary-color);
	font-family: "Inconsolata", monospace;
	font-size: 20px;
	font-weight: 600;
}

.event-note {
	background: var(--primary-color);
	color: white;
	display: inline-block;
	padding: 2px 10px;
	font-size: 12px;
	letter-spacing: 1px;
	text-transform: uppercase;
	margin-bottom: 8px;
	clip-path: polygon(0 0, 100% 0, calc(100% - 5px) 100%, 0 100%);
}

.event-content {
	font-size: 16px;
	line-height: 1.6;
	color: white;
	text-align: justify;
}

.database-footer {
	border-top: 1px solid var(--primary-color);
	padding-top: 10px;
	display: flex;
	justify-content: space-between;
	font-size: 10px;
	color: var(--text-location);
	opacity: 0.6;
}

.warning-blink {
	animation: blink 2s infinite;
}

@keyframes fadeIn {
	from { opacity: 0; transform: translateY(5px); }
	to { opacity: 1; transform: translateY(0); }
}

@keyframes blink {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.4; }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
	width: 4px;
}

::-webkit-scrollbar-thumb {
	background: var(--primary-color);
}
</style>
