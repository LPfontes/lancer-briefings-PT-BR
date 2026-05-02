<template>
	<div id="glossaryView" :class="{ animate: animateView }" :style="{ 'animation-delay': animationDelay }" class="content-container">
		<section id="glossary-section" class="section-container full-width">
			<div class="section-header clipped-medium-backward">
				<img src="/icons/protocol.svg" />
				<h1>{{ $t('glossary.title') }} // {{ $t('glossary.compendium') }}</h1>
			</div>
			
			<div class="window-body glossary-container">
				<!-- In-universe Warning -->
				<div class="database-warning">
					<span class="warning-blink">!</span> ACESSO RESTRITO: TERMINAL DA UNIÃO // PROTOCOLO NDL-C-DISCORDANT-BREATH ATIVO
				</div>

				<div class="glossary-tabs">
					<button :class="{ active: currentTab === 'terms' }" @click="currentTab = 'terms'">TERMOS TÉCNICOS</button>
					<button :class="{ active: currentTab === 'manufacturers' }" @click="currentTab = 'manufacturers'">GRANDES FABRICANTES</button>
				</div>

				<div v-if="currentTab === 'terms'" class="tab-content master-detail-layout">
					<!-- MASTER LIST (Left) -->
					<div class="master-list-pane">
						<div class="search-bar">
							<input type="text" v-model="searchQuery" :placeholder="$t('glossary.search')" class="tech-input" />
						</div>

						<div class="category-filters">
							<button 
								v-for="catKey in categoryLabels" 
								:key="catKey"
								class="category-chip"
								:class="{ active: selectedCategory === catKey }"
								@click="selectedCategory = catKey"
							>
								{{ $t(`glossary.categories.${catKey}`) }}
							</button>
						</div>

						<div class="terms-scroll-area tech-scroll">
							<div 
								v-for="term in filteredGlossary" 
								:key="term.name" 
								class="term-item" 
								:class="{ active: selectedTermName === term.name, [getTermCategory(term.name)]: true }"
								@click="selectTerm(term)"
							>
								<div class="term-selector-icon"></div>
								<span class="term-name">{{ term.name }}</span>
								<span class="material-symbols-outlined" v-if="selectedTermName === term.name">chevron_right</span>
							</div>
						</div>
						
						<div class="search-info">ENTRADAS DISPONÍVEIS: {{ filteredGlossary.length }}</div>
					</div>

					<!-- DETAIL PANE (Right) -->
					<div class="detail-pane">
						<div v-if="selectedTerm" class="data-reader-window">
							<div class="reader-header">
								<div class="reader-header-top">
									<span class="protocol-id">NDL-C-DB // ENTRY: {{ selectedTerm.name }}</span>
									<span class="category-tag">{{ getTermCategoryLabel(selectedTerm.name) }}</span>
								</div>
								<h2 class="reader-title">{{ selectedTerm.name }}</h2>
							</div>
							
							<div class="reader-body tech-scroll">
								<div class="term-content-full" v-html="selectedTerm.description"></div>
							</div>

							<div class="reader-footer">
								<div class="scan-line"></div>
								<span>STATUS: DATA_STABLE // AUTH: COMP/CON</span>
							</div>
						</div>
						<div v-else class="empty-reader">
							<div class="empty-icon">
								<span class="material-symbols-outlined">database</span>
							</div>
							<p>SELECIONE UMA ENTRADA PARA VISUALIZAÇÃO</p>
							<div class="loading-bar-static"></div>
						</div>
					</div>
				</div>

				<div v-if="currentTab === 'manufacturers'" class="tab-content">
					<div class="manufacturers-list tech-scroll">
						<div v-for="m in manufacturers" :key="m.id" class="event-window manufacturer-card" :style="{ '--m-color': m.dark }" @click="openManufacturerModal(m)">
							<div class="window-title-bar" :style="{ background: m.dark }">
								<div class="window-controls">
									<span class="control red"></span>
								</div>
								<div class="window-title">{{ m.name }} ({{ m.id }})</div>
								<div class="window-status">VER DETALHES // CORPRO-ESTADO</div>
							</div>
						</div>
					</div>
				</div>

				<div class="database-footer">
					<div class="status-bit">BIT-PROTOCOL: STABLE</div>
					<div class="status-bit">ENCRYPTION: 1024-V3</div>
					<div class="status-bit">LAST UPDATE: CRADLE STANDARD {{ new Date().getFullYear() }}</div>
				</div>
			</div>
		</section>

		<ManufacturerModal 
			:isOpen="isManufacturerModalOpen" 
			:manufacturer="selectedManufacturer" 
			@close="closeManufacturerModal" 
		/>
	</div>
</template>

<script>
import { glossary as glossaryData, manufacturers as manufacturerData } from "lancer-data-pt-br";
import ManufacturerModal from "@/components/modals/ManufacturerModal.vue";

export default {
	name: "GlossaryView",
	components: {
		ManufacturerModal
	},
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
			searchQuery: "",
			glossary: glossaryData,
			manufacturers: manufacturerData,
			currentTab: "terms",
			selectedTermName: null,
			selectedCategory: "all",
			categoryGroups: {
				stats: ["Armadura", "Pontos de Sistema", "Defesa-E", "Evasão", "Brio", "Cap. de Calor", "Pontos de Vida (PV)", "Cap. de Reparo", "Estresse", "Estrutura", "Sensores", "Tamanho", "Velocidade"],
				combat: ["Dano", "Dano Bônus", "Imunidade", "Resistência", "Acertos Críticos", "Dano/Calculando o Dano", "Queimadura", "Calor"],
				aoe: ["Alcance", "Ameaça", "Linha", "Cone", "Explosão", "Emanação"],
				movement: ["Movimento Involuntário", "Terreno Difícil", "Terreno Perigoso", "Levantar e Arrastar", "Pular e Escalar", "Queda/Dano de Queda", "Gravidade Zero", "Voo/Pairar", "Teletransporte"],
				rules: ["Personagem", "Alvo de Salvamento", "Ataque Tecnológico"]
			},
			categoryLabels: ["all", "stats", "combat", "aoe", "movement", "rules"],
			isManufacturerModalOpen: false,
			selectedManufacturer: {}
		};
	},
	computed: {
		filteredGlossary() {
			let list = this.glossary;
			
			if (this.selectedCategory !== 'all') {
				const group = this.categoryGroups[this.selectedCategory];
				list = list.filter(term => group.includes(term.name));
			}

			if (!this.searchQuery) return list;
			
			const query = this.searchQuery.toLowerCase();
			return list.filter(term => 
				term.name.toLowerCase().includes(query) || 
				term.description.toLowerCase().includes(query)
			);
		},
		selectedTerm() {
			if (!this.selectedTermName) return null;
			return this.glossary.find(t => t.name === this.selectedTermName);
		}
	},
	methods: {
		selectTerm(term) {
			this.selectedTermName = term.name;
		},
		getTermCategory(name) {
			for (const [key, list] of Object.entries(this.categoryGroups)) {
				if (list.includes(name)) return key;
			}
			return 'rules';
		},
		getTermCategoryLabel(name) {
			const key = this.getTermCategory(name);
			return this.$t(`glossary.categories.${key}`).toUpperCase();
		},
		openManufacturerModal(m) {
			this.selectedManufacturer = m;
			this.isManufacturerModalOpen = true;
		},
		closeManufacturerModal() {
			this.isManufacturerModalOpen = false;
		}
	}
};
</script>

<style scoped>
.glossary-container {
	display: flex;
	flex-direction: column;
	gap: 15px;
	height: calc(100vh - 220px);
	overflow: hidden;
	padding: 10px 20px;
}

.database-warning {
	background: rgba(175, 14, 30, 0.1);
	border: 1px solid var(--primary-color);
	color: var(--primary-color);
	padding: 5px 15px;
	font-family: "Big Shoulders Display", cursive;
	font-size: 14px;
	letter-spacing: 2px;
	display: flex;
	align-items: center;
	gap: 10px;
}

.warning-blink {
	animation: blink 1s infinite;
	font-weight: bold;
}

.glossary-tabs {
	display: flex;
	gap: 10px;
}

.glossary-tabs button {
	background: transparent;
	border: 1px solid var(--primary-color);
	color: var(--primary-color);
	padding: 8px 20px;
	font-family: "Big Shoulders Display", cursive;
	cursor: pointer;
	transition: all 0.2s;
	letter-spacing: 1px;
}

.glossary-tabs button.active {
	background: var(--primary-color);
	color: white;
}

.tab-content {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	gap: 15px;
	overflow: hidden;
}

/* Master-Detail Layout */
.master-detail-layout {
	display: grid;
	grid-template-columns: 350px 1fr;
	gap: 20px;
	height: 100%;
}

.master-list-pane {
	display: flex;
	flex-direction: column;
	gap: 15px;
	height: 100%;
	overflow: hidden;
	background: rgba(0, 0, 0, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.05);
	padding: 15px;
}

.terms-scroll-area {
	flex: 1;
	overflow-y: auto;
	padding-right: 5px;
}

.term-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 10px 15px;
	margin-bottom: 5px;
	background: rgba(255, 255, 255, 0.02);
	border-left: 3px solid #333;
	cursor: pointer;
	transition: all 0.2s;
	position: relative;
}

.term-item:hover {
	background: rgba(255, 255, 255, 0.05);
}

.term-item.active {
	background: rgba(175, 14, 30, 0.1);
	border-left-color: var(--primary-color);
	box-shadow: inset 5px 0 15px rgba(175, 14, 30, 0.1);
}

.term-item.active .term-name {
	color: white;
	font-weight: 700;
}

/* Category Colors */
.term-item.stats { border-left-color: #339af0; }
.term-item.combat { border-left-color: #ff4d4d; }
.term-item.aoe { border-left-color: #f1a92a; }
.term-item.movement { border-left-color: #51cf66; }
.term-item.rules { border-left-color: #be4bdb; }

.term-selector-icon {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: currentColor;
	opacity: 0.5;
}

.term-name {
	flex: 1;
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.7);
	text-transform: uppercase;
	letter-spacing: 1px;
}

.term-item.active .material-symbols-outlined {
	font-size: 18px;
	color: var(--primary-color);
}

/* Detail Pane */
.detail-pane {
	height: 100%;
	overflow: hidden;
	background: rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(175, 14, 30, 0.2);
	position: relative;
}

.data-reader-window {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.reader-header {
	padding: 20px;
	background: rgba(175, 14, 30, 0.05);
	border-bottom: 1px solid rgba(175, 14, 30, 0.2);
}

.reader-header-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
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
	font-family: "Titillium Web", sans-serif;
	font-size: 32px;
	color: white;
	margin: 0;
	letter-spacing: 2px;
	text-transform: uppercase;
}

.reader-body {
	flex: 1;
	padding: 30px;
	overflow-y: auto;
}

.term-content-full {
	font-family: "Titillium Web", sans-serif;
	font-size: 18px;
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.9);
}

.term-content-full ::v-deep(b), .term-content-full ::v-deep(strong) {
	color: var(--primary-color);
}

.reader-footer {
	padding: 10px 20px;
	background: rgba(0, 0, 0, 0.5);
	border-top: 1px solid rgba(255, 255, 255, 0.05);
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: var(--text-location);
	display: flex;
	align-items: center;
	gap: 15px;
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

/* Utilities */
.tech-input {
	background: rgba(0, 0, 0, 0.4);
	border: 1px solid var(--primary-color);
	color: var(--primary-color);
	padding: 12px 15px;
	font-family: "Inconsolata", monospace;
	font-size: 16px;
	outline: none;
	width: 100%;
}

.search-info {
	font-size: 10px;
	font-family: "Inconsolata", monospace;
	color: var(--text-location);
	text-align: right;
	margin-top: 10px;
}

.category-filters {
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
}

.category-chip {
	background: rgba(175, 14, 30, 0.05);
	border: 1px solid rgba(175, 14, 30, 0.3);
	color: rgba(255, 255, 255, 0.5);
	padding: 2px 10px;
	font-family: "Big Shoulders Display", cursive;
	font-size: 12px;
	cursor: pointer;
	transition: all 0.2s;
}

.category-chip.active {
	background: var(--primary-color);
	color: white;
}

.manufacturers-list {
	display: flex;
	flex-direction: column;
	gap: 20px;
	overflow-y: auto;
	padding: 5px;
	height: 100%;
}

.database-footer {
	border-top: 1px solid var(--primary-color);
	padding-top: 10px;
	display: flex;
	justify-content: space-between;
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: var(--text-location);
	opacity: 0.7;
}

.tech-scroll::-webkit-scrollbar {
	width: 4px;
}

.tech-scroll::-webkit-scrollbar-thumb {
	background: var(--primary-color);
}

@keyframes blink {
	0%, 100% { opacity: 1; }
	50% { opacity: 0; }
}

@keyframes scan {
	from { top: 0; }
	to { top: 100%; }
}
</style>
