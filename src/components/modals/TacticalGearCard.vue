<template>
	<div class="gear-card" :class="{ 'installed': isInstalled }" @click="$emit('click', item)">
		<div class="gear-card-header">
			<div class="gear-header-top">
				<div class="gear-title-area">
					<span class="gear-name">{{ item.name }}</span>
					<span class="gear-type" v-if="type === 'weapon'">
						<template v-if="item.type && item.mount">
							[{{ $t(`mech.weaponTypes.${item.type.toLowerCase()}`) || item.type }} // {{ $t(`mech.mountTypes.${item.mount.toLowerCase()}`) || item.mount }}]
						</template>
						<template v-else>
							[{{ $t(`mech.weaponTypes.${(item.type || '').toLowerCase()}`) || item.type || 'DESCONHECIDO' }}]
						</template>
					</span>
					<span class="gear-type" v-else-if="item.type">
						[{{ $te(`mech.systemTypes.${item.type.toLowerCase()}`) ? $t(`mech.systemTypes.${item.type.toLowerCase()}`) : item.type }}]
					</span>
				</div>
				<div class="gear-actions-area" v-if="selectionMode">
					<div class="selection-indicator">
						<div class="indicator-box" :class="{ active: isSelected }">
							<span v-if="isSelected" class="material-symbols-outlined">check</span>
						</div>
					</div>
				</div>
				<div class="gear-actions-area" v-else-if="showActions">
					<span class="gear-sp" v-if="item.sp">{{ item.sp }} SP</span>
					<button class="select-btn-tactical" 
						:class="{ active: isInstalled, 'too-expensive': !isSelectable }" 
						:disabled="!isSelectable"
						@click.stop="$emit('select', item.id)">
						<span class="material-symbols-outlined">{{ isInstalled ? 'check_circle' : (isSelectable ? 'add_circle' : 'block') }}</span>
						{{ isInstalled ? ($t('general.installed') || 'INSTALADO') : (isSelectable ? ($t('general.select') || 'SELECIONAR') : 'LIMITE PS') }}
					</button>
				</div>
				<div class="gear-actions-area" v-else-if="item.sp">
					<span class="gear-sp">{{ item.sp }} SP</span>
				</div>
			</div>

			<div class="gear-stats-row" v-if="(type === 'weapon' && (item.damage?.length || item.range?.length)) || (item.bonuses && item.bonuses.length)">
				<!-- Damage -->
				<div class="stat-pill damage" v-if="item.damage && item.damage.length">
					<span class="material-symbols-outlined">flare</span>
					<span v-for="(dmg, i) in item.damage" :key="'d'+i">
						{{ dmg.val }} {{ getDamageTypeTrans(dmg.type) }}
					</span>
				</div>
				<!-- Range / Threat -->
				<div class="stat-pill range" v-for="(rng, i) in item.range" :key="'r'+i">
					<span class="material-symbols-outlined">{{ getRangeIcon(rng.type) }}</span>
					{{ getRangeTypeTrans(rng.type) }} {{ rng.val }}
				</div>
				<!-- Bonuses (Pilot Gear) -->
				<div class="stat-pill bonus" v-for="(bn, i) in item.bonuses" :key="'b'+i">
					<span class="material-symbols-outlined">{{ getBonusIcon(bn.id) }}</span>
					{{ getBonusTrans(bn.id) }} {{ bn.val > 0 ? '+' : '' }}{{ bn.val }}
				</div>
			</div>

			<div class="gear-tags-row" v-if="item.tags && item.tags.length">
				<div class="stat-pill tag" v-for="(tag, i) in item.tags" :key="'t'+i" :data-tooltip="getTagDesc(tag)" :data-tag="formatTag(tag).toUpperCase()">
					{{ formatTag(tag) }}
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import { tags as tagsData } from "lancer-data-pt-br";

export default {
	name: "TacticalGearCard",
	props: {
		item: Object,
		type: {
			type: String,
			default: 'weapon'
		},
		isInstalled: Boolean,
		isSelectable: {
			type: Boolean,
			default: true
		},
		showActions: {
			type: Boolean,
			default: true
		},
		selectionMode: Boolean,
		isSelected: Boolean
	},
	emits: ['click', 'select'],
	methods: {
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
			if (name.includes('{VAL}')) {
				return name.replace('{VAL}', tag.val || '0');
			}
			return `${name} ${tag.val ? tag.val : ''}`.trim();
		},
		getBonusTrans(id) {
			const dict = {
				'pilot_hp': 'PV',
				'pilot_armor': 'ARMADURA',
				'pilot_evasion': 'EVASÃO',
				'pilot_edef': 'DEFESA-E',
				'pilot_speed': 'VELOCIDADE'
			};
			return dict[id] || id.replace('pilot_', '').toUpperCase();
		},
		getBonusIcon(id) {
			const dict = {
				'pilot_hp': 'favorite',
				'pilot_armor': 'shield',
				'pilot_evasion': 'near_me',
				'pilot_edef': 'shield_lock',
				'pilot_speed': 'double_arrow'
			};
			return dict[id] || 'add_circle';
		}
	}
};
</script>

<style scoped>
.gear-card {
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(255, 255, 255, 0.1);
	transition: all 0.2s;
	display: flex;
	flex-direction: column;
	cursor: pointer;
	border-left: 3px solid #3a4b5c;
}

.gear-card:hover {
	background: rgba(255, 255, 255, 0.05);
	border-color: var(--primary-color);
	transform: translateY(-2px);
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
	z-index: 10;
}

.gear-card.installed {
	border-left-color: #28a745;
	background: rgba(40, 167, 69, 0.05);
}

.gear-card-header {
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 15px;
}

.gear-header-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 15px;
}

.gear-title-area {
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex: 1;
}

.gear-name {
	font-size: 16px;
	color: #fff;
	letter-spacing: 1px;
	text-transform: uppercase;
}

.gear-type {
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	font-weight: 700;
	color: var(--primary-color);
	opacity: 0.8;
}

.gear-stats-row {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-top: 4px;
}

.gear-tags-row {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	margin-top: 8px;
}

.gear-actions-area {
	display: flex;
	align-items: center;
	gap: 15px;
	flex-shrink: 0;
}

.gear-card-body {
	margin-top: 12px;
	padding-top: 12px;
	border-top: 1px solid rgba(255, 255, 255, 0.05);
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.75);
	line-height: 1.5;
}

.gear-desc ::v-deep(strong), .gear-desc ::v-deep(b) {
	color: var(--primary-color);
	font-weight: 700;
}

.selection-indicator {
	width: 24px;
	height: 24px;
}

.indicator-box {
	width: 100%;
	height: 100%;
	border: 2px solid rgba(255, 255, 255, 0.15);
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
}

.indicator-box.active {
	background: #af0e1e;
	border-color: #af0e1e;
	box-shadow: 0 0 10px rgba(175, 14, 30, 0.5);
}

.indicator-box span {
	font-size: 18px;
	color: #fff;
}

.gear-sp {
	font-family: "Rajdhani", sans-serif;
	font-size: 18px;
	font-weight: 700;
	color: #f1a92a;
}

.select-btn-tactical {
	display: flex;
	align-items: center;
	gap: 6px;
	background: transparent;
	border: 1px solid var(--primary-color);
	color: var(--primary-color);
	padding: 6px 16px;
	font-family: "Titillium Web", sans-serif;
	font-size: 14px;
	font-weight: 600;
	text-transform: uppercase;
	cursor: pointer;
	transition: all 0.2s;
}

.select-btn-tactical:hover {
	background: rgba(175, 14, 30, 0.2);
}

.select-btn-tactical.active {
	border-color: #28a745;
	color: #28a745;
}

.select-btn-tactical.active:hover {
	background: rgba(40, 167, 69, 0.1);
}

.select-btn-tactical.too-expensive {
	border-color: #666;
	color: #666;
	cursor: not-allowed;
	opacity: 0.5;
}

.select-btn-tactical.too-expensive:hover {
	background: transparent;
}

.select-btn-tactical span {
	font-size: 16px;
}

.stat-pill {
	display: flex;
	align-items: center;
	gap: 4px;
	border: 2px solid rgba(255, 255, 255, 0.1);
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.85);
	text-transform: uppercase;
}

.stat-pill span.material-symbols-outlined {
	font-size: 14px;
}

.stat-pill.damage {
	border-color: #f1a92a;
	color: #f1a92a;
}
.stat-pill.range {
	border-color: white;
	color: white;
}
.stat-pill.bonus {
	border-color: #00a256;
	color: #00a256;
}
.stat-pill.tag {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 2px 8px 2px 4px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 4px;
	background: #1a1a1a;
	color: #e0e0e0;
	font-family: "Titillium Web", sans-serif;
	font-size: 11px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	cursor: help;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
	position: relative;
}

.stat-pill.tag::before {
	content: '';
	width: 10px;
	height: 10px;
	background-color: currentColor;
	clip-path: polygon(0% 0%, 70% 0%, 100% 50%, 70% 100%, 0% 100%);
	opacity: 0.8;
}

.stat-pill.tag:hover {
	z-index: 100;
}

.stat-pill.tag:hover::after {
	content: attr(data-tooltip);
	background: #000;
	position: absolute;
	top: 125%;
	left: 125%;
	transform: translateX(-50%);
	color: #fff;
	padding: 8px 12px;
	border: 1px solid var(--primary-color);
	border-radius: 2px;
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	font-weight: normal;
	text-transform: none;
	white-space: normal;
	width: max-content;
	max-width: 300px;
	z-index: 2000;
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
	from { opacity: 0; transform: translate(-50%, 10px); }
	to { opacity: 1; transform: translate(-50%, 0); }
}

/* COMP/CON Color Mapping */
/* Hazard (Red) - Burn, Heat, Loading */
.stat-pill.tag[data-tag*="RECARGA"],
.stat-pill.tag[data-tag*="LOADING"],
.stat-pill.tag[data-tag*="CALOR"],
.stat-pill.tag[data-tag*="QUEIMADURA"],
.stat-pill.tag[data-tag*="BURN"],
.stat-pill.tag[data-tag*="EXAGERO"],
.stat-pill.tag[data-tag*="OVERKILL"] {
	border-color: #ff4d4d;
	color: #ff4d4d;
}

/* Tech (Purple) - Smart, Seeking, Drone */
.stat-pill.tag[data-tag*="INTELIGENTE"],
.stat-pill.tag[data-tag*="SMART"],
.stat-pill.tag[data-tag*="DRONE"],
.stat-pill.tag[data-tag*="BUSCA-ALVO"] {
	border-color: #be4bdb;
	color: #be4bdb;
}

/* Precision (Green) - Accurate, Precise, Range */
.stat-pill.tag[data-tag*="ARCO"],
.stat-pill.tag[data-tag*="ARC"],
.stat-pill.tag[data-tag*="PRECISO"],
.stat-pill.tag[data-tag*="ACCURATE"] {
	border-color: #51cf66;
	color: #51cf66;
}

/* Stability (Blue) - Reliable, Shield */
.stat-pill.tag[data-tag*="CONFIÁVEL"],
.stat-pill.tag[data-tag*="RELIABLE"] {
	border-color: #339af0;
	color: #339af0;
}
</style>
