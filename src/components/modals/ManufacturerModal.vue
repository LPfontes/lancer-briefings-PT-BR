<template>
	<transition name="modal-fade">
		<div class="modal-overlay" v-if="isOpen" @click.self="$emit('close')">
			<div class="modal-content manufacturer-modal" :style="{ '--m-color': manufacturer.dark }">
				<!-- Header -->
				<div class="modal-header" :style="{ background: manufacturer.dark }">
					<div class="header-left">
						<div class="window-controls">
							<span class="control red"></span>
						</div>
						<h2 class="modal-title">{{ manufacturer.name }} // {{ manufacturer.id }}</h2>
					</div>
					<button class="close-btn" @click="$emit('close')">
						<span class="material-symbols-outlined">close</span>
					</button>
				</div>
				
				<!-- Body -->
				<div class="modal-body tech-scroll">
					<div class="logo-container-floating">
						<div 
							class="manufacturer-logo-mask" 
							:style="{ 'mask-image': `url(${getLogoPath(manufacturer.id)})`, '-webkit-mask-image': `url(${getLogoPath(manufacturer.id)})` }"
						></div>
					</div>
					
					<div class="manufacturer-hero">
						<div class="manufacturer-tagline" v-html="manufacturer.quote"></div>
					</div>

					<div class="manufacturer-long-desc">
						<div v-html="manufacturer.description"></div>
						
						<!-- HORUS Special Message -->
						<div v-if="manufacturer.id === 'HORUS'" class="horus-message-container">
							<code class="horus">[PARABÉNS, PILOTO.<br>VOCÊ FOI ESCOLHIDO.<br>O ACESSO É SEU,<br>ENQUANTO PUDER MANTÊ-LO.]</code>
						</div>
					</div>
					
					<div class="manufacturer-metadata">
						<div class="meta-item">
							<span class="label">CLASSIFICAÇÃO:</span>
							<span class="value">CORPRO-ESTADO // ENTIDADE GALÁCTICA</span>
						</div>
						<div class="meta-item">
							<span class="label">ESTADO:</span>
							<span class="value">ATIVO</span>
						</div>
					</div>
				</div>

				<div class="modal-footer">
					<div class="footer-status">PROTOCOLO DE ARQUIVO: {{ manufacturer.id }}-DOC-{{ new Date().getFullYear() }}</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: "ManufacturerModal",
	props: {
		isOpen: Boolean,
		manufacturer: {
			type: Object,
			default: () => ({})
		}
	},
	methods: {
		getLogoPath(id) {
			if (!id) return '';
			const map = {
				'GMS': 'gms',
				'HA': 'ha',
				'HORUS': 'horus',
				'IPS-N': 'ips-n',
				'SSC': 'ssc'
			};
			return `/faction-logos/${map[id] || id.toLowerCase()}.svg`;
		}
	}
};
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.85);
	backdrop-filter: blur(8px);
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.modal-content {
	background: #0b1119;
	width: 100%;
	max-width: 900px;
	height: 80vh;
	border: 1px solid var(--m-color);
	box-shadow: 0 0 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(var(--m-color), 0.2);
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: hidden;
	animation: slideIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

@keyframes slideIn {
	from { transform: translateY(20px); opacity: 0; }
	to { transform: translateY(0); opacity: 1; }
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px 25px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left {
	display: flex;
	align-items: center;
	gap: 20px;
}

.window-controls {
	display: flex;
	gap: 8px;
}

.control {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	border: 1px solid rgba(255, 255, 255, 0.3);
}

.control.red { background: #ff5f56; }

.modal-title {
	font-family: "Big Shoulders Display", cursive;
	color: white;
	font-size: 28px;
	margin: 0;
	text-transform: uppercase;
	letter-spacing: 2px;
	text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.close-btn {
	background: rgba(0,0,0,0.3);
	border: 1px solid rgba(255,255,255,0.1);
	color: white;
	cursor: pointer;
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
}

.close-btn:hover {
	background: var(--primary-color);
	border-color: white;
}

.modal-body {
	flex: 1;
	padding: 30px;
	overflow-y: auto;
	position: relative;
}

.logo-container-floating {
	float: right;
	width: 18vw;
	height: 18vw;
	margin-left: 20px;
	margin-bottom: 20px;
	opacity: 0.8;
	pointer-events: none;
	top: 0;
}

.manufacturer-logo-mask {
	width: 100%;
	height: 100%;
	background-color: var(--m-color);
	mask-size: contain;
	mask-repeat: no-repeat;
	mask-position: center;
	-webkit-mask-size: contain;
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-position: center;
	filter: drop-shadow(0 0 15px rgba(0,0,0,0.5));
}

.manufacturer-hero {
	margin-bottom: 30px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	padding-bottom: 20px;
}

.manufacturer-tagline {
	font-family: "Inconsolata", monospace;
	font-size: 20px;
	color: var(--m-color);
	font-style: italic;
	line-height: 1.4;
	max-width: 600px;
}

.manufacturer-long-desc {
	font-family: "Titillium Web", sans-serif;
	font-size: 18px;
	line-height: 1.8;
	color: rgba(255, 255, 255, 0.9);
	text-align: justify;
}

.manufacturer-long-desc ::v-deep(p) {
	margin-bottom: 20px;
}

.horus-message-container {
	margin-top: 40px;
	display: flex;
	justify-content: center;
	filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.3));
}

.manufacturer-metadata {
	margin-top: 50px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;
	padding: 20px;
	background: rgba(255, 255, 255, 0.03);
	border: 1px dashed rgba(255, 255, 255, 0.1);
}

.meta-item {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.label {
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	color: var(--m-color);
	font-weight: bold;
}

.value {
	font-family: "Big Shoulders Display", cursive;
	font-size: 18px;
	color: white;
	letter-spacing: 1px;
}

.modal-footer {
	padding: 10px 25px;
	background: rgba(0, 0, 0, 0.5);
	border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-status {
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: rgba(255, 255, 255, 0.4);
	text-align: right;
}

.tech-scroll::-webkit-scrollbar {
	width: 6px;
}

.tech-scroll::-webkit-scrollbar-thumb {
	background: var(--m-color);
	border-radius: 3px;
}

/* Animations */
.modal-fade-enter-active, .modal-fade-leave-active {
	transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
	opacity: 0;
}
</style>
