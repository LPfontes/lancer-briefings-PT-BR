<template>
	<div class="creator-step">
		<!-- ── IDENTIFICAÇÃO ── -->
		<div class="identification-form">
			<div class="section-heading">
				<h2>{{ $t('pilotCreator.steps.identification') }}</h2>
			</div>


			<div class="info-container">
				<div class="form-row">
					<div class="form-group">
						<label>{{ $t('pilotCreator.fields.name') }}</label>
						<div class="input-wrapper">
							<input type="text" v-model="name" @input="update" class="tech-input" :placeholder="$t('pilotCreator.fields.namePlaceholder') || 'Ex: John Doe'" />
							<span class="input-accent"></span>
						</div>
					</div>
					<div class="form-group">
						<label>{{ $t('pilotCreator.fields.callsign') }}</label>
						<div class="input-wrapper">
							<input type="text" v-model="callsign" @input="update" class="tech-input callsign-input" :placeholder="$t('pilotCreator.fields.callsignPlaceholder') || 'Ex: MAVERICK'" />
							<span class="input-accent"></span>
						</div>
					</div>
				</div>

				<div class="form-row level-row">
					<div class="form-group level-group">
						<label>{{ $t('pilotCreator.fields.level') }}</label>
						<div class="level-control">
							<button class="level-btn" @click="adjustLevel(-1)" :disabled="level <= 0">−</button>
							<div class="input-wrapper level-input-wrap">
								<input type="number" v-model="level" @input="update" class="tech-input level-input" min="0" max="12" />
							</div>
							<button class="level-btn" @click="adjustLevel(1)" :disabled="level >= 12">+</button>
						</div>
					</div>

					<div class="stats-display">
						<div class="stat-box grit-box">
							<span class="stat-label">{{ $t('pilotCreator.fields.grit') }}</span>
							<span class="stat-value">{{ grit }}</span>
						</div>
						<div class="stat-box hp-box">
							<span class="stat-label">{{ $t('pilotCreator.fields.hp') }}</span>
							<span class="stat-value">{{ hp }}</span>
						</div>
					</div>
				</div>
			</div>
			

			<div class="form-group">
				<label>{{ $t('pilotCreator.fields.background') }}</label>
				<div class="custom-select-container" v-click-outside="closeDropdown">
					<div 
						class="tech-input custom-select-trigger" 
						:class="{ 'is-open': dropdownOpen }"
						@click="toggleDropdown"
					>
						<span class="selected-value">{{ background === 'None' ? $t('general.none') : background }}</span>
						<span class="select-chevron">▾</span>
						<span class="input-accent" :class="{ 'active': dropdownOpen }"></span>
					</div>
					<transition name="dropdown-slide">
						<div v-if="dropdownOpen" class="custom-options-list">
							<div 
								class="option-item" 
								:class="{ 'selected': background === 'None' }"
								@click="selectBackground('None')"
							>
								{{ $t('general.none') }}
							</div>
							<div 
								v-for="bg in backgrounds" 
								:key="bg.id" 
								class="option-item"
								:class="{ 'selected': background === bg.name }"
								@click="selectBackground(bg.name)"
							>
								{{ bg.name }}
							</div>
							<div 
								class="option-item custom-option" 
								:class="{ 'selected': isCustomBackground }"
								@click="selectBackground('Custom')"
							>
								+ {{ $t('general.custom') }}
							</div>
						</div>
					</transition>
				</div>
			</div>

			<transition name="bg-fade">
				<div v-if="isCustomBackground" class="form-group custom-bg-input">
					<label>{{ $t('pilotCreator.fields.customBackground') }}</label>
					<div class="input-wrapper">
						<input 
							type="text" 
							v-model="customBackgroundName" 
							@input="updateCustomName" 
							class="tech-input" 
							:placeholder="$t('pilotCreator.fields.customBackground') || 'Nome do Histórico'" 
						/>
						<span class="input-accent"></span>
					</div>
				</div>
			</transition>

			<transition name="bg-fade">
				<div v-if="selectedBg" class="bg-description">
					<div class="bg-desc-header">
						<span class="bg-icon">◈</span>
						<strong>{{ selectedBg.name }}</strong>
					</div>
					<p v-html="selectedBg.description"></p>
				</div>
			</transition>

			<!-- ── BIOGRAFIA ── -->
			<div class="form-group bio-group">
				<label>{{ $t('pilotCreator.fields.bio') }}</label>
				<div class="input-wrapper">
					<textarea 
						v-model="bio" 
						@input="update" 
						class="tech-input tech-textarea" 
						rows="4"
						:placeholder="$t('pilotCreator.fields.bio') || 'Conte a história do seu piloto...'"
					></textarea>
					<span class="input-accent"></span>
				</div>
			</div>
		</div>

		<!-- ── HABILIDADES DE MECHA ── -->
		<div class="mech-section">
			<div class="section-heading">
				<h3 class="mech-title">{{ $t('pilotCreator.steps.mechSkills') }}</h3>
			</div>
			<p class="mech-desc">{{ $t('pilotCreator.mechSkillsDesc') }}</p>
			<div class="total-points" :class="{ 'has-points': totalMechPoints > 0, 'at-limit': totalMechPoints >= maxMechPoints }">
				<span class="total-label">{{ $t('pilotCreator.mechPointsDist') }}</span>
				<span class="total-value">{{ totalMechPoints }} / {{ maxMechPoints }}</span>
			</div>
			<div class="mech-skills-grid">
				<div
					v-for="(skill, i) in mechSkillDefs"
					:key="i"
					class="mech-skill-item"
					:class="{ 'has-points': getMechRank(i) > 0 }"
				>
					<div class="skill-header">
						<span class="skill-icon">{{ skill.icon }}</span>
						<div class="skill-info">
							<span class="skill-name">{{ $t(skill.key) }}</span>
							<div class="skill-bonuses">
								<span v-for="(bonus, bi) in getMechBonuses(i, getMechRank(i))" :key="bi" class="skill-bonus">
									{{ bonus }}
								</span>
							</div>
						</div>
					</div>
					<div class="skill-bar-wrap">
						<div class="skill-bar">
							<div
								class="skill-bar-fill"
								:style="{ width: (getMechRank(i) / 6 * 100) + '%' }"
							></div>
						</div>
					</div>
					<div class="skill-controls">
						<button class="ctrl-btn minus" @click="adjustMech(i, -1)" :disabled="getMechRank(i) <= 0">−</button>
						<span class="rank">+{{ getMechRank(i) }}</span>
						<button class="ctrl-btn plus" @click="adjustMech(i, 1)" :disabled="getMechRank(i) >= 6">+</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import { backgrounds as bgData } from "lancer-data-pt-br";

export default {
	name: "IdentificationStep",
	data() {
		return {
			name: pilotStore.state.name,
			callsign: pilotStore.state.callsign,
			level: pilotStore.state.level,
			background: pilotStore.state.background,
			backgrounds: bgData,
			mechSkillDefs: [
				{ key: 'pilotCreator.fields.hull',        icon: '⬡', bonusKey: 'pilotCreator.bonuses.hull' },
				{ key: 'pilotCreator.fields.agility',     icon: '◈', bonusKey: 'pilotCreator.bonuses.agility' },
				{ key: 'pilotCreator.fields.systems',     icon: '⬢', bonusKey: 'pilotCreator.bonuses.systems' },
				{ key: 'pilotCreator.fields.engineering', icon: '⚙', bonusKey: 'pilotCreator.bonuses.engineering' },
			],
			dropdownOpen: false,
			isCustomBackground: false,
			customBackgroundName: "",
			bio: pilotStore.state.bio
		};
	},
	created() {
		// Initialize custom background if needed
		if (this.background !== 'None' && !this.backgrounds.some(bg => bg.name === this.background)) {
			this.isCustomBackground = true;
			this.customBackgroundName = this.background;
		}
	},
	directives: {
		'click-outside': {
			beforeMount(el, binding) {
				el.clickOutsideEvent = (event) => {
					if (!(el === event.target || el.contains(event.target))) {
						binding.value();
					}
				};
				document.addEventListener('click', el.clickOutsideEvent);
			},
			unmounted(el) {
				document.removeEventListener('click', el.clickOutsideEvent);
			}
		}
	},
	computed: {
		selectedBg() {
			return this.backgrounds.find(b => b.name === this.background);
		},
		grit() {
			return Math.ceil(this.level / 2);
		},
		hp() {
			return 6 + this.grit;
		},
		totalMechPoints() {
			return pilotStore.state.mech_skills.reduce((a, b) => a + b, 0);
		},
		maxMechPoints() {
			return 2 + parseInt(this.level);
		}
	},
	methods: {
		update() {
			pilotStore.setIdentification(this.name, this.callsign, this.background, this.bio);
			pilotStore.setLevel(this.level);
		},
		adjustLevel(amount) {
			const newLevel = Math.min(12, Math.max(0, parseInt(this.level) + amount));
			this.level = newLevel;
			this.update();
		},
		getMechRank(index) {
			return pilotStore.state.mech_skills[index];
		},
		adjustMech(index, amount) {
			const current = this.getMechRank(index);
			let newRank = current + amount;
			if (newRank < 0) newRank = 0;
			if (newRank > 6) newRank = 6;
			pilotStore.updateMechSkill(index, newRank);
		},
		toggleDropdown() {
			this.dropdownOpen = !this.dropdownOpen;
		},
		closeDropdown() {
			this.dropdownOpen = false;
		},
		selectBackground(name) {
			if (name === 'Custom') {
				this.isCustomBackground = true;
				this.background = this.customBackgroundName || "Novo Histórico";
			} else {
				this.isCustomBackground = false;
				this.background = name;
			}
			this.update();
			this.closeDropdown();
		},
		updateCustomName() {
			this.background = this.customBackgroundName;
			this.update();
		},
		isTermExpanded(name) {
			return this.expandedTerms === name;
		},
		getMechBonuses(index, points) {
			if (points === 0) return [this.$t('general.none')];
			
			const halfPoints = Math.floor(points / 2);
			const isPt = this.$i18n.locale === 'pt-BR';

			switch(index) {
				case 0: // Hull
					return [
						`+${points * 2} ${isPt ? 'PV' : 'HP'}`,
						`+${halfPoints} ${isPt ? 'Cap. Reparo' : 'Rep Cap'}`
					];
				case 1: // Agility
					return [
						`+${points} ${isPt ? 'EVASÃO' : 'EVASION'}`,
						`+${halfPoints} ${isPt ? 'VELOCIDADE' : 'SPEED'}`
					];
				case 2: // Systems
					return [
						`+${points} ${isPt ? 'Atk. Tec. & Defesa-E' : 'Tech Atk & E-Def'}`,
						`+${halfPoints} PS`
					];
				case 3: // Engineering
					return [
						`+${points} ${isPt ? 'Cap. Calor' : 'Heat Cap'}`,
						`+${halfPoints} ${isPt ? 'Uso Limitado' : 'Limited Uses'}`
					];
				default:
					return [];
			}
		}
	}
};
</script>

<style scoped>
/* ── Layout Root ── */
.creator-step {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30px;
	align-items: start;
}

/* ── Section Headings ── */
.skill-header {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 12px;
}

.skill-info {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.skill-bonuses {
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.skill-bonus {
	font-size: 14px;
	color: rgb(255, 255, 255);
	font-family: "Inconsolata", monospace;
	letter-spacing: 0.5px;
	line-height: 1.2;
}


.mech-title {
	font-family: "Rajdhani", sans-serif;
	color: var(--primary-color);
	font-size: 28px;
	margin: 0;
	text-transform: uppercase;
	letter-spacing: 2px;
	font-weight: 700;
}

/* ── Form Layout ── */
.identification-form {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.form-row {
	display: flex;
	flex-direction: column;
	gap: 16px;
}
.info-container {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
}
.form-group {
	display: flex;
	flex-direction: column;
	gap: 6px;
	flex: 1;
}

label {
	font-family: "Inconsolata", monospace;
	color: rgb(255, 255, 255);
	font-size: 11px;
	text-transform: uppercase;
	letter-spacing: 1.5px;
}

/* ── Inputs ── */
.input-wrapper {
	position: relative;
}

.input-accent {
	position: absolute;
	bottom: 0;
	left: 0;
	height: 2px;
	width: 0;
	background: var(--primary-color);
	box-shadow: 0 0 8px var(--primary-color);
	transition: width 0.3s ease;
	pointer-events: none;
}

.input-wrapper:focus-within .input-accent {
	width: 100%;
}

.tech-input {
	width: 100%;
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(175, 14, 30, 0.25);
	border-bottom: 1px solid rgba(175, 14, 30, 0.5);
	color: white;
	padding: 12px 16px;
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	outline: none;
	transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	box-sizing: border-box;
	box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}

.tech-input:hover {
	border-color: rgba(175, 14, 30, 0.5);
	background: rgba(255, 255, 255, 0.05);
}

.tech-input:focus {
	background: rgba(175, 14, 30, 0.05);
	border-color: rgba(175, 14, 30, 0.8);
	box-shadow: inset 0 0 15px rgba(175, 14, 30, 0.1), 0 0 10px rgba(175, 14, 30, 0.1);
}

.tech-textarea {
	resize: vertical;
	min-height: 80px;
	line-height: 1.5;
}

.bio-group {
	margin-top: 10px;
}

.callsign-input {
	text-transform: uppercase;
	letter-spacing: 2px;
}

/* ── Level Control ── */
.level-row {
	gap: 20px;
}

.level-group {
	display: flex;
	align-items: flex-start;
}

.level-control {
	display: flex;
	align-items: stretch;
	gap: 0;
}

.level-btn {
	background: rgba(175, 14, 30, 0.1);
	border: 1px solid rgba(175, 14, 30, 0.3);
	color: var(--primary-color);
	font-size: 18px;
	width: 40px;
	cursor: pointer;
	font-family: "Inconsolata", monospace;
	transition: background 0.2s;
	flex-shrink: 0;
	line-height: 1;
}

.level-btn:hover:not(:disabled) {
	background: rgba(175, 14, 30, 0.35);
}

.level-btn:disabled {
	opacity: 0.25;
	cursor: not-allowed;
}

.level-input-wrap {
	flex: 1;
}

.level-input {
	border-radius: 0;
	text-align: center;
	font-size: 20px;
	font-weight: bold;
	padding: 10px 8px;
	width: 60px;
}

/* Remove number spinners */
.level-input::-webkit-inner-spin-button,
.level-input::-webkit-outer-spin-button { -webkit-appearance: none; }

/* ── Stat Boxes ── */
.stats-display {
	display: flex;
	gap: 12px;
	align-items: flex-end;
	flex: 1;
}

.stat-box {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 12px;
	position: relative;
	overflow: hidden;
	transition: transform 0.2s;
}

.stat-box::before {
	content: '';
	position: absolute;
	inset: 0;
	background: linear-gradient(135deg, rgba(175,14,30,0.18) 0%, rgba(0,0,0,0) 70%);
	pointer-events: none;
}

.grit-box {
	border: 1px solid rgba(175,14,30,0.7);
	box-shadow: inset 0 0 20px rgba(175,14,30,0.1);
}

.hp-box {
	border: 1px solid rgba(175,14,30,0.7);
	box-shadow: inset 0 0 20px rgba(175,14,30,0.1);
}

.stat-box:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 20px rgba(175,14,30,0.3), inset 0 0 20px rgba(175,14,30,0.15);
}


.stat-label {
	font-family: "Inconsolata", monospace;
	font-size: 9px;
	color: rgb(255, 255, 255);
	text-transform: uppercase;
	letter-spacing: 1.5px;
}

.stat-value {
	font-family: "Big Shoulders Display", cursive;
	font-size: 32px;
	color: white;
	line-height: 1.1;
	font-weight: 700;
}

.custom-option {
	color: var(--primary-color);
	font-weight: bold;
	border-top: 1px solid rgba(175, 14, 30, 0.3);
}

.custom-bg-input {
	animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
	from { opacity: 0; transform: translateY(-10px); }
	to { opacity: 1; transform: translateY(0); }
}

/* ── Custom Select ── */
.custom-select-container {
	position: relative;
	width: 100%;
}

.custom-select-trigger {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	user-select: none;
}

.custom-select-trigger.is-open {
	border-color: var(--primary-color);
	background: rgba(175, 14, 30, 0.08);
}

.input-accent.active {
	width: 100%;
}

.custom-options-list {
	position: absolute;
	top: calc(100% + 4px);
	left: 0;
	right: 0;
	background: #0d0102;
	border: 1px solid rgba(175, 14, 30, 0.8);
	z-index: 100;
	max-height: 250px;
	overflow-y: auto;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(175, 14, 30, 0.2);
}

/* Custom Scrollbar */
.custom-options-list::-webkit-scrollbar {
	width: 4px;
}
.custom-options-list::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.2);
}
.custom-options-list::-webkit-scrollbar-thumb {
	background: var(--primary-color);
}

.option-item {
	padding: 12px 16px;
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.7);
	cursor: pointer;
	transition: all 0.2s;
	border-bottom: 1px solid rgba(175, 14, 30, 0.1);
}

.option-item:last-child {
	border-bottom: none;
}

.option-item:hover {
	background: rgba(175, 14, 30, 0.2);
	color: white;
	padding-left: 20px;
}

.option-item.selected {
	background: rgba(175, 14, 30, 0.3);
	color: var(--primary-color);
	border-left: 3px solid var(--primary-color);
}

.dropdown-slide-enter-active, .dropdown-slide-leave-active {
	transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.dropdown-slide-enter-from, .dropdown-slide-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

.select-chevron {
	color: var(--primary-color);
	font-size: 16px;
	transition: transform 0.3s;
}

.is-open .select-chevron {
	transform: rotate(180deg);
}

/* ── Background Description ── */
.bg-fade-enter-active, .bg-fade-leave-active {
	transition: opacity 0.3s ease, transform 0.3s ease;
}
.bg-fade-enter-from, .bg-fade-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}

.bg-description {
	background: rgba(175, 14, 30, 0.07);
	border-left: 3px solid var(--primary-color);
	padding: 14px 16px;
	font-family: "Titillium Web", sans-serif;
	font-size: 13px;
	line-height: 1.6;
	color: rgba(255,255,255,0.6);
}

.bg-desc-header {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 10px;
	font-family: "Big Shoulders Display", cursive;
	font-size: 16px;
	color: var(--primary-color);
}

.bg-icon {
	font-size: 18px;
}

/* ── Mech Section ── */
.mech-section {
	display: flex;
	flex-direction: column;
	gap: 14px;
}

.mech-desc {
	font-family: "Inconsolata", monospace;
	color: rgb(255, 255, 255);
	font-size: 12px;
	margin: -8px 0 2px;
	letter-spacing: 0.5px;
}

.mech-skills-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 12px;
}

/* ── Skill Cards ── */
.mech-skill-item {
	background: rgba(0,0,0,0.35);
	border: 1px solid rgba(175,14,30,0.3);
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
	position: relative;
	overflow: hidden;
}

.mech-skill-item::after {
	content: '';
	position: absolute;
	bottom: 0; left: 0; right: 0;
	height: 0;
	background: linear-gradient(to top, rgba(175,14,30,0.1), transparent);
	transition: height 0.3s;
	pointer-events: none;
}

.mech-skill-item.has-points {
	border-color: rgba(175,14,30,0.65);
	box-shadow: 0 0 16px rgba(175,14,30,0.12);
}

.mech-skill-item.has-points::after {
	height: 50%;
}

.mech-skill-item:hover {
	background: rgba(175,14,30,0.06);
}

.skill-header {
	display: flex;
	align-items: center;
	gap: 8px;
}

.skill-icon {
	color: var(--primary-color);
	font-size: 24px;
	opacity: 0.85;
}

.skill-name {
	font-family: "Big Shoulders Display", cursive;
	color: white;
	font-size: 18px;
	letter-spacing: 1px;
	text-transform: uppercase;
}

/* ── Skill Progress Bar ── */
.skill-bar-wrap {
	width: 100%;
}

.skill-bar {
	width: 100%;
	height: 4px;
	background: rgba(255,255,255,0.07);
	position: relative;
	overflow: hidden;
}

.skill-bar-fill {
	height: 100%;
	background: linear-gradient(to right, rgba(175,14,30,0.6), var(--primary-color));
	box-shadow: 0 0 6px var(--primary-color);
	transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Skill Controls ── */
.skill-controls {
	display: flex;
	align-items: center;
	gap: 0;
	background: rgba(0,0,0,0.4);
	border: 1px solid rgba(175,14,30,0.4);
}

.ctrl-btn {
	background: transparent;
	border: none;
	color: var(--primary-color);
	font-size: 22px;
	cursor: pointer;
	font-family: "Inconsolata", monospace;
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background 0.15s;
	flex-shrink: 0;
}

.ctrl-btn:hover:not(:disabled) {
	background: rgba(175,14,30,0.2);
}

.ctrl-btn:disabled {
	opacity: 0.2;
	cursor: not-allowed;
}

.rank {
	font-family: "Inconsolata", monospace;
	color: white;
	font-size: 20px;
	font-weight: bold;
	flex: 1;
	text-align: center;
	padding: 4px 0;
}

/* ── Total Points ── */
.total-points {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 16px;
	background: rgba(255,255,255,0.03);
	border: 1px dashed rgba(255,255,255,0.12);
	font-family: "Inconsolata", monospace;
	transition: border-color 0.3s, background 0.3s;
}

.total-points.has-points {
	border-color: rgba(175,14,30,0.4);
	background: rgba(175,14,30,0.06);
}

.total-points.at-limit {
	border-color: #00ff41;
	background: rgba(0, 255, 65, 0.05);
}

.total-points.at-limit .total-value {
	color: #00ff41;
}

.total-label {
	font-size: 12px;
	color: rgba(255,255,255,0.4);
	text-transform: uppercase;
	letter-spacing: 1px;
}

.total-value {
	font-size: 22px;
	font-weight: bold;
	color: var(--primary-color);
	font-family: "Big Shoulders Display", cursive;
}
</style>
