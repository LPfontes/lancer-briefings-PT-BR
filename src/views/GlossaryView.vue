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

				<div v-if="currentTab === 'terms'" class="tab-content">
					<div class="search-bar">
						<input type="text" v-model="searchQuery" :placeholder="$t('glossary.search')" class="tech-input" />
						<div class="search-info">ENTRADAS DISPONÍVEIS: {{ filteredGlossary.length }}</div>
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

					<div class="glossary-grid">
						<div v-for="term in filteredGlossary" :key="term.name" class="event-window glossary-item" :class="{ expanded: isTermExpanded(term.name) }">
							<div class="window-title-bar" @click="toggleTerm(term.name)">
								<div class="window-controls">
									<span class="control green"></span>
								</div>
								<div class="window-title">{{ term.name }}</div>
								<div class="window-status">{{ isTermExpanded(term.name) ? 'ACTIVE' : 'LOCKED' }}</div>
							</div>
							<div class="window-body" v-show="isTermExpanded(term.name)">
								<div class="term-content" v-html="term.description"></div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="currentTab === 'manufacturers'" class="tab-content">
					<div class="manufacturers-list">
						<div v-for="m in manufacturers" :key="m.id" class="event-window manufacturer-card" :style="{ '--m-color': m.dark }" :class="{ expanded: isTermExpanded(m.id) }">
							<div class="window-title-bar" :style="{ background: m.dark }" @click="toggleTerm(m.id)">
								<div class="window-controls">
									<span class="control red"></span>
								</div>
								<div class="window-title">{{ m.name }} ({{ m.id }})</div>
								<div class="window-status">CORPRO-ESTADO</div>
							</div>
							<div class="window-body" v-show="isTermExpanded(m.id)">
								<div class="manufacturer-quote" v-html="m.quote"></div>
								<div class="manufacturer-desc" v-html="m.description"></div>
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
	</div>
</template>

<script>
import { glossary as glossaryData, manufacturers as manufacturerData } from "lancer-data-pt-br";

export default {
	name: "GlossaryView",
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
			expandedTerms: [],
			selectedCategory: "all",
			categoryGroups: {
				stats: ["Armadura", "Pontos de Sistema", "Defesa-E", "Evasão", "Brio", "Cap. de Calor", "Pontos de Vida (PV)", "Cap. de Reparo", "Estresse", "Estrutura", "Sensores", "Tamanho", "Velocidade"],
				combat: ["Dano", "Dano Bônus", "Imunidade", "Resistência", "Acertos Críticos", "Dano/Calculando o Dano", "Calor (Queimadura)", "Calor"],
				aoe: ["Alcance", "Ameaça", "Linha", "Cone", "Explosão", "Emanação"],
				movement: ["Movimento Involuntário", "Terreno Difícil", "Terreno Perigoso", "Levantar e Arrastar", "Pular e Escalar", "Queda/Dano de Queda", "Gravidade Zero", "Voo/Pairar", "Teletransporte"],
				rules: ["Personagem", "Alvo de Salvamento", "Ataque Tecnológico"]
			},
			categoryLabels: ["all", "stats", "combat", "aoe", "movement", "rules"]
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
		}
	},
	methods: {
		toggleTerm(name) {
			const index = this.expandedTerms.indexOf(name);
			if (index > -1) {
				this.expandedTerms.splice(index, 1);
			} else {
				this.expandedTerms.push(name);
			}
		},
		isTermExpanded(name) {
			return this.expandedTerms.includes(name);
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

.search-bar {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.tech-input {
	background: rgba(0, 0, 0, 0.4);
	border: 1px solid var(--primary-color);
	color: var(--primary-color);
	padding: 12px 15px;
	font-family: "Inconsolata", monospace;
	font-size: 16px;
	outline: none;
}

.search-info {
	font-size: 10px;
	font-family: "Inconsolata", monospace;
	color: var(--text-location);
	text-align: right;
}

.category-filters {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 5px;
}

.category-chip {
	background: rgba(175, 14, 30, 0.05);
	border: 1px solid rgba(175, 14, 30, 0.3);
	color: rgba(255, 255, 255, 0.5);
	padding: 4px 12px;
	font-family: "Big Shoulders Display", cursive;
	font-size: 13px;
	letter-spacing: 1px;
	cursor: pointer;
	transition: all 0.2s;
}

.category-chip:hover {
	background: rgba(175, 14, 30, 0.15);
	color: white;
	border-color: var(--primary-color);
}

.category-chip.active {
	background: var(--primary-color);
	color: white;
	border-color: var(--primary-color);
	box-shadow: 0 0 10px rgba(175, 14, 30, 0.4);
}

.glossary-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 15px;
	overflow-y: auto;
	padding: 5px;
}

.manufacturers-list {
	display: flex;
	flex-direction: column;
	gap: 20px;
	overflow-y: auto;
	padding: 5px;
}

.manufacturer-card {
	border-color: var(--m-color);
}

.manufacturer-quote {
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	color: var(--text-location);
	margin-bottom: 15px;
	padding-left: 10px;
	border-left: 3px solid var(--m-color);
}

.manufacturer-desc {
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
	line-height: 1.6;
	color: var(--primary-color);
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

.glossary-item {
	margin-bottom: 0;
	height: auto;
	flex: 1 1 380px;
	max-width: 100%;
}

.glossary-item.expanded {
	overflow: visible;
}

.window-title-bar {
	cursor: pointer;
}

.term-content {
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
	line-height: 1.6;
	color: var(--text-markdown-p);
	padding: 15px;
}

.glossary-item .window-body {
	max-height: 0;
	overflow: hidden;
	transition: max-height 0.4s cubic-bezier(0.19, 1, 0.22, 1);
	animation: none; /* Disable global animation for nested items */
}

.glossary-item.expanded .window-body {
	max-height: 1000px;
}

@keyframes blink {
	0%, 100% { opacity: 1; }
	50% { opacity: 0; }
}

/* Custom Scrollbar */
.glossary-grid::-webkit-scrollbar,
.manufacturers-list::-webkit-scrollbar {
	width: 6px;
}

.glossary-grid::-webkit-scrollbar-thumb,
.manufacturers-list::-webkit-scrollbar-thumb {
	background: var(--primary-color);
}
</style>
