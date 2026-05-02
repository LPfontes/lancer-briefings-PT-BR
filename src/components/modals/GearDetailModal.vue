<template>
	<transition name="modal-fade">
		<div class="modal-overlay" v-if="item" @click.self="$emit('close')">
			<div class="gear-detail-modal" :style="{ '--gear-color': getThemeColor() }">
				<!-- Header -->
				<div class="modal-header">
					<div class="header-main">
						<div class="window-controls">
							<div class="control red"></div>
							<div class="control"></div>
							<div class="control"></div>
						</div>
						<h2 class="modal-title">{{ item.name }}</h2>
					</div>
					<button class="close-btn" @click="$emit('close')">
						<span class="material-symbols-outlined">close</span>
					</button>
				</div>

				<!-- Body -->
				<div class="modal-body tech-scroll">
					<!-- Hero Section -->
					<div class="gear-hero">
						<div class="gear-type-badge">
							{{ $t(`mech.${item.type?.toLowerCase().includes('system') || item.sp ? 'systemTypes' : 'weaponTypes'}.${item.type?.toLowerCase()}`) || item.type }}
						</div>
						<div class="gear-sp-cost" v-if="item.sp">{{ item.sp }} SP</div>
					</div>

					<!-- Stats Row -->
					<div class="gear-stats-row" v-if="item.damage?.length || item.range?.length">
						<div class="stat-pill damage" v-for="(dmg, i) in item.damage" :key="'d'+i">
							<span class="material-symbols-outlined">flare</span>
							{{ dmg.val }} {{ getDamageTypeTrans(dmg.type) }}
						</div>
						<div class="stat-pill range" v-for="(rng, i) in item.range" :key="'r'+i">
							<span class="material-symbols-outlined">{{ getRangeIcon(rng.type) }}</span>
							{{ getRangeTypeTrans(rng.type) }} {{ rng.val }}
						</div>
					</div>

					<!-- Tags Row -->
					<div class="gear-tags-row" v-if="item.tags?.length">
						<div 
							class="stat-pill tag" 
							v-for="(tag, i) in item.tags" 
							:key="'t'+i"
							:data-tooltip="getTagDesc(tag)"
							:data-tag="formatTag(tag).toUpperCase()"
						>
							{{ formatTag(tag) }}
						</div>
					</div>

					<!-- Actions Section -->
					<div class="gear-actions-section" v-if="item.actions?.length">
						<div class="desc-header">AÇÕES VINCULADAS //</div>
						<div class="action-block" v-for="(action, i) in item.actions" :key="'act'+i">
							<div class="action-header">
								<span class="action-name">{{ action.name }}</span>
								<span class="action-activation">[{{ $t(`mech.activations.${action.activation?.toLowerCase()}`) || action.activation }}]</span>
							</div>
							<div class="action-stats" v-if="action.range?.length || action.damage?.length">
								<div class="stat-pill damage mini" v-for="(dmg, d) in action.damage" :key="'ad'+d">
									{{ dmg.val }} {{ getDamageTypeTrans(dmg.type) }}
								</div>
								<div class="stat-pill range mini" v-for="(rng, r) in action.range" :key="'ar'+r">
									<span class="material-symbols-outlined">{{ getRangeIcon(rng.type) }}</span>
									{{ rng.val }}
								</div>
							</div>
							<div class="action-detail markdown" v-html="action.detail"></div>
						</div>
					</div>

					<!-- Deployables Section -->
					<div class="gear-deployables-section" v-if="item.deployables?.length">
						<div class="desc-header">SISTEMAS POSICIONÁVEIS //</div>
						<div class="deployable-block" v-for="(dep, i) in item.deployables" :key="'dep'+i">
							<div class="deployable-header">
								<span class="deployable-name">{{ dep.name }}</span>
								<span class="deployable-type">{{ $t(`mech.systemTypes.${dep.type?.toLowerCase()}`) || dep.type }}</span>
							</div>
							<div class="deployable-stats" v-if="dep.stats">
								<div class="mini-spec">PV: {{ dep.stats.hp }}</div>
								<div class="mini-spec">EVA: {{ dep.stats.evasion }}</div>
								<div class="mini-spec">DEF-E: {{ dep.stats.edef }}</div>
								<div class="mini-spec" v-if="dep.stats.armor">ARM: {{ dep.stats.armor }}</div>
							</div>
							<div class="deployable-detail markdown" v-html="dep.detail"></div>
						</div>
					</div>

					<!-- Description -->
					<div class="gear-full-desc">
						<div v-if="item.effect">
							<div class="desc-header">EFETOR //</div>
							<div class="desc-content effect-text" v-html="item.effect"></div>
						</div>
						<div v-if="item.description" :class="{ 'flavor-section': item.effect || item.actions?.length }">
							<div class="desc-header">ANÁLISE FUNCIONAL //</div>
							<div class="desc-content flavor-text" v-html="item.description"></div>
						</div>
					</div>

					<!-- Technical Data -->
					<div class="technical-specs">
						<div class="spec-item">
							<span class="label">LICENÇA</span>
							<span class="value">{{ item.license }} {{ item.license_level }}</span>
						</div>
						<div class="spec-item">
							<span class="label">FONTE</span>
							<span class="value">{{ item.source }}</span>
						</div>
					</div>
				</div>

				<div class="modal-footer">
					<div class="footer-status">OMNINET SECURE CONNECTION // ENCRYPTED DATA // {{ $t('general.no_cascade') }}</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import { tags as tagsData } from "lancer-data-pt-br";

export default {
	props: {
		item: {
			type: Object,
			required: true
		}
	},
	methods: {
		getThemeColor() {
			return '#af0e1e';
		},
		getDamageTypeTrans(type) {
			const dict = {
				'Kinetic': 'Cinético',
				'Energy': 'Energia',
				'Explosive': 'Explosivo',
				'Burn': 'Calor'
			};
			return dict[type] || type;
		},
		getRangeTypeTrans(type) {
			const dict = {
				'Range': 'Alcance',
				'Threat': 'Ameaça',
				'Line': 'Linha',
				'Cone': 'Cone',
				'Blast': 'Explosão',
				'Burst': 'Rajada'
			};
			return dict[type] || type;
		},
		getRangeIcon(type) {
			const dict = {
				'Range': 'my_location',
				'Threat': 'gavel',
				'Line': 'straighten',
				'Cone': 'signal_cellular_4_bar',
				'Blast': 'explosion',
				'Burst': 'blur_on'
			};
			return dict[type] || 'my_location';
		},
		getTagName(tagId) {
			const tag = tagsData.find(t => t.id === tagId);
			return tag ? tag.name : tagId.replace('tg_', '').toUpperCase();
		},
		getTagDesc(tagObj) {
			const tagData = tagsData.find(t => t.id === tagObj.id);
			if (!tagData) return '';
			let desc = tagData.description || '';
			if (tagObj.val) {
				desc = desc.replace('{VAL}', tagObj.val);
			}
			return desc;
		},
		formatTag(tag) {
			const name = this.getTagName(tag.id);
			if (tag.val) {
				return name.replace('{VAL}', tag.val);
			}
			return name;
		}
	}
}
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.9);
	backdrop-filter: blur(8px);
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.gear-detail-modal {
	background: #0b1119;
	width: 100%;
	max-width: 60%;
	max-height: 80%;
	border: 1px solid var(--gear-color);
	box-shadow: 0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 50px rgba(var(--gear-color), 0.1);
	display: flex;
	flex-direction: column;
	position: relative;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px 20px;
	background: rgba(0, 0, 0, 0.5);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-main {
	display: flex;
	align-items: center;
	gap: 15px;
}

.window-controls {
	display: flex;
	gap: 6px;
}

.control {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.2);
}

.control.red { background: #af0e1e; }

.modal-title {
	font-family: "Rajdhani", sans-serif;
	font-size: 22px;
	color: #fff;
	letter-spacing: 2px;
	text-transform: uppercase;
}

.close-btn {
	background: none;
	border: none;
	color: #fff;
	cursor: pointer;
	opacity: 0.7;
	transition: opacity 0.2s;
}

.close-btn:hover { opacity: 1; }

.modal-body {
	padding: 30px;
	overflow-y: auto;
}

.gear-hero {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 25px;
}

.gear-type-badge {
	background: var(--gear-color);
	color: #fff;
	padding: 4px 12px;
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	font-weight: bold;
	text-transform: uppercase;
}

.gear-sp-cost {
	font-family: "Rajdhani", sans-serif;
	font-size: 24px;
	font-weight: bold;
	color: #f1a92a;
}

.gear-stats-row, .gear-tags-row {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-bottom: 20px;
}

.stat-pill {
	display: flex;
	align-items: center;
	gap: 8px;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 6px 12px;
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	color: #fff;
}

.stat-pill.damage { border-color: #f1a92a; color: #f1a92a; }
.stat-pill.range { border-color: #fff; color: #fff; }

.stat-pill.tag {
	border-color: rgba(255, 255, 255, 0.3);
	color: rgba(255, 255, 255, 0.8);
	font-weight: bold;
	text-transform: uppercase;
	cursor: help;
	position: relative;
}

.stat-pill.tag:hover {
	z-index: 3000;
}

.stat-pill.tag:hover::after {
	content: attr(data-tooltip);
	background: #000;
	position: absolute;
	top: 125%;
	left: 0%;
	transform: none;
	color: #fff;
	padding: 8px 12px;
	border: 1px solid var(--gear-color);
	border-radius: 2px;
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	font-weight: normal;
	text-transform: none;
	white-space: normal;
	width: max-content;
	max-width: 450px;
	z-index: 2100;
	pointer-events: none;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.8);
	opacity: 0;
	animation: tooltip-fade-in 0.2s forwards;
	text-align: left;
	line-height: 1.4;
	hyphens: auto;
	word-break: break-word;
	overflow-wrap: break-word;
}

@keyframes tooltip-fade-in {
	from { opacity: 0; transform: translateY(5px); }
	to { opacity: 1; transform: translateY(0); }
}

.gear-actions-section, .gear-deployables-section {
	margin-top: 30px;
}

.action-block, .deployable-block {
	background: rgba(255, 255, 255, 0.02);
	border: 1px solid rgba(255, 255, 255, 0.05);
	border-left: 3px solid #666;
	padding: 15px;
	margin-bottom: 15px;
}

.action-header, .deployable-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.action-name, .deployable-name {
	font-family: "Rajdhani", sans-serif;
	font-size: 18px;
	color: #fff;
	letter-spacing: 1px;
}

.action-activation, .deployable-type {
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	color: var(--gear-color);
	font-weight: bold;
}

.action-stats, .deployable-stats {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-bottom: 12px;
}

.stat-pill.mini {
	padding: 2px 8px;
	font-size: 12px;
	border-radius: 2px;
}

.mini-spec {
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	color: #f1a92a;
	background: rgba(241, 169, 42, 0.1);
	padding: 2px 6px;
	border: 1px solid rgba(241, 169, 42, 0.3);
}

.action-detail, .deployable-detail {
	font-family: "Titillium Web", sans-serif;
	font-size: 15px;
	line-height: 1.5;
	color: rgba(255, 255, 255, 0.8);
}

.gear-full-desc {
	margin-top: 30px;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	padding-top: 20px;
}

.desc-header {
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	color: var(--gear-color);
	margin-bottom: 15px;
	letter-spacing: 2px;
	text-transform: uppercase;
}

.desc-content {
	font-family: "Titillium Web", sans-serif;
	font-size: 16px;
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.9);
}

.effect-text {
	border-left: 3px solid var(--gear-color);
	padding-left: 20px;
	margin-bottom: 25px;
}

.flavor-section {
	margin-top: 30px;
	padding-top: 20px;
	border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.flavor-text {
	font-style: italic;
	opacity: 0.75;
	font-size: 15px;
}

.technical-specs {
	margin-top: 40px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
	padding: 20px;
	background: rgba(0, 0, 0, 0.3);
	border-left: 4px solid var(--gear-color);
}

.spec-item {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.spec-item .label {
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: rgba(255, 255, 255, 0.4);
}

.spec-item .value {
	font-family: "Rajdhani", sans-serif;
	font-size: 18px;
	color: #fff;
}

.modal-footer {
	padding: 10px 20px;
	background: rgba(0, 0, 0, 0.8);
	border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-status {
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: rgba(255, 255, 255, 0.3);
	text-align: right;
}

.tech-scroll::-webkit-scrollbar { width: 4px; }
.tech-scroll::-webkit-scrollbar-thumb { background: var(--gear-color); }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
