<template>
	<transition name="modal-fade">
		<div class="modal-overlay" v-if="isOpen" @click.self="$emit('close')">
			<div class="encrypted-modal">
				<div class="modal-header">
					<div class="header-main">
						<span class="material-symbols-outlined icon">encrypted</span>
						<h2 class="modal-title">COMUNICAÇÃO ENCRIPTADA // ALTO SIGILO</h2>
					</div>
					<button class="close-btn" @click="$emit('close')">
						<span class="material-symbols-outlined">close</span>
					</button>
				</div>

				<div class="modal-body tech-scroll">
					<div v-if="!isDecrypted" class="encryption-interface">
						<div class="warning-box">
							<span class="material-symbols-outlined warning-icon">warning</span>
							<p>ESTA MENSAGEM ESTÁ PROTEGIDA POR CRIPTOGRAFIA DE NÍVEL OMNINET.</p>
						</div>
						
						<div class="hint-box">
							<div class="hint-label">TRANSMISSÃO PÚBLICA</div>
							<div class="hint-content">
								<p>Fé baseada na razão</p>
								<p>Sakyamuni deu a resposta.</p>
								<p>A chave é o caminho.</p>
							</div>
						</div>

						<div class="cipher-text-container">
							<div class="cipher-label">FLUXO DE DADOS BRUTOS //</div>
							<div class="cipher-text">{{ displayedCipherText }}</div>
						</div>

						<div class="password-entry">
							<div class="input-wrapper">
								<span class="material-symbols-outlined input-icon">key</span>
								<input 
									type="password" 
									v-model="password" 
									placeholder="INSIRA A CHAVE DE DESCRIPTOGRAFIA..." 
									@keyup.enter="attemptDecryption"
									class="password-input"
									autofocus
								/>
							</div>
							<button class="decrypt-btn" @click="attemptDecryption" :disabled="isDecrypting">
								<span class="material-symbols-outlined" v-if="!isDecrypting">lock_open</span>
								<span class="material-symbols-outlined spinning" v-else>sync</span>
								{{ isDecrypting ? 'PROCESSANDO...' : 'DESCRIPTOGRAFAR' }}
							</button>
						</div>
						<div v-if="error" class="error-msg">CHAVE INVÁLIDA. TENTATIVA REGISTRADA.</div>
					</div>

					<div v-else class="decrypted-content">
						<div class="decrypted-header">
							<div class="origin">ORIGEM: {{ messageOrigin }}</div>
							<div class="timestamp">DATA: {{ currentTimestamp }}</div>
						</div>
						<div class="message-content markdown" v-html="decryptedMessage"></div>
						<div class="decrypted-footer">
							<div class="footer-line">ESTA MENSAGEM SE AUTO-DESTRUIRÁ AO FECHAR.</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: "EncryptedMessageModal",
	props: {
		isOpen: Boolean,
	},
	emits: ["close"],
	data() {
		return {
			isDecrypted: false,
			isDecrypting: false,
			password: "",
			correctPassword: "CAMINHODOMEIO",
			error: false,
			cipherChars: "0123456789ABCDEF!@#$%^&*()_+-=[]{}|;:,.<>?",
			displayedCipherText: "",
			cipherInterval: null,
			decryptedMessage: `
				<p>Sirvo a décadas o glorioso Míngzhì, entretanto não sou cega a mazela que se alastra sobre o meu povo.</p>
				<p>Protegemos a humanidade da queda, somos as correntes que impedem o frenesi da ganância. Mesmo assim, esse mal se alastra sobre nosso belo planeta.</p>
				<p><i>Fé baseada na razão... Sakyamuni deu a resposta.</i></p>
			`,
			messageOrigin: "COMUNICAÇÃO MÍNGZHÌ",
			currentTimestamp: new Date().toLocaleString(),
		};
	},
	mounted() {
		this.startCipherAnimation();
	},
	beforeUnmount() {
		if (this.cipherInterval) clearInterval(this.cipherInterval);
	},
	methods: {
		startCipherAnimation() {
			this.cipherInterval = setInterval(() => {
				let text = "";
				for (let i = 0; i < 200; i++) {
					text += this.cipherChars.charAt(Math.floor(Math.random() * this.cipherChars.length));
					if (i % 40 === 0 && i > 0) text += "\n";
				}
				this.displayedCipherText = text;
			}, 50);
		},
		attemptDecryption() {
			this.isDecrypting = true;
			this.error = false;
			
			// Simulate processing time
			setTimeout(() => {
				if (this.password.toUpperCase() === this.correctPassword) {
					this.isDecrypted = true;
					if (this.cipherInterval) clearInterval(this.cipherInterval);
				} else {
					this.error = true;
				}
				this.isDecrypting = false;
			}, 1500);
		},
	},
	watch: {
		isOpen(val) {
			if (val) {
				this.isDecrypted = false;
				this.password = "";
				this.error = false;
				this.startCipherAnimation();
			}
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
	background: rgba(0, 0, 0, 0.95);
	backdrop-filter: blur(10px);
	z-index: 3000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.encrypted-modal {
	background: #05080c;
	width: 100%;
	max-width: 600px;
	border: 2px solid #00f0ff;
	box-shadow: 0 0 30px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.1);
	display: flex;
	flex-direction: column;
	position: relative;
}

.hint-box {
	background: rgba(0, 240, 255, 0.03);
	border-left: 3px solid #00f0ff;
	padding: 15px;
	margin-bottom: 25px;
}

.hint-label {
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: #00f0ff;
	opacity: 0.7;
	margin-bottom: 8px;
	letter-spacing: 1px;
}

.hint-content {
	font-family: "Titillium Web", sans-serif;
	font-size: 15px;
	color: rgba(255, 255, 255, 0.9);
	line-height: 1.4;
}

.hint-content p {
	margin: 0;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px 20px;
	background: rgba(0, 240, 255, 0.1);
	border-bottom: 1px solid rgba(0, 240, 255, 0.3);
}

.header-main {
	display: flex;
	align-items: center;
	gap: 12px;
}

.icon {
	color: #00f0ff;
}

.modal-title {
	font-family: "Oxanium", cursive;
	font-size: 16px;
	color: #00f0ff;
	letter-spacing: 1px;
	margin: 0;
}

.close-btn {
	background: none;
	border: none;
	color: #00f0ff;
	cursor: pointer;
	opacity: 0.7;
}

.modal-body {
	padding: 30px;
}

.warning-box {
	display: flex;
	align-items: center;
	gap: 15px;
	background: rgba(255, 165, 0, 0.1);
	border: 1px solid rgba(255, 165, 0, 0.3);
	padding: 15px;
	margin-bottom: 25px;
}

.warning-icon {
	color: #ffa500;
	font-size: 32px;
}

.warning-box p {
	font-family: "Inconsolata", monospace;
	font-size: 13px;
	color: #ffa500;
	margin: 0;
	line-height: 1.4;
}

.cipher-text-container {
	background: rgba(0, 0, 0, 0.5);
	border: 1px solid rgba(255, 255, 255, 0.1);
	padding: 15px;
	margin-bottom: 25px;
}

.cipher-label {
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: rgba(255, 255, 255, 0.3);
	margin-bottom: 10px;
}

.cipher-text {
	font-family: "Inconsolata", monospace;
	font-size: 14px;
	color: rgba(0, 240, 255, 0.5);
	white-space: pre-wrap;
	word-break: break-all;
	height: 120px;
	overflow: hidden;
}

.password-entry {
	display: flex;
	gap: 10px;
}

.input-wrapper {
	flex: 1;
	display: flex;
	align-items: center;
	background: rgba(0, 0, 0, 0.8);
	border: 1px solid rgba(0, 240, 255, 0.3);
	padding: 0 15px;
}

.input-icon {
	color: rgba(0, 240, 255, 0.5);
	font-size: 20px;
}

.password-input {
	background: transparent;
	border: none;
	color: #fff;
	padding: 12px 10px;
	width: 100%;
	font-family: "Inconsolata", monospace;
	outline: none;
}

.decrypt-btn {
	background: #00f0ff;
	color: #000;
	border: none;
	padding: 0 20px;
	font-family: "Rajdhani", sans-serif;
	font-weight: bold;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 8px;
	transition: all 0.2s;
}

.decrypt-btn:hover:not(:disabled) {
	background: #fff;
	box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.decrypt-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.error-msg {
	color: #ff3e3e;
	font-family: "Inconsolata", monospace;
	font-size: 12px;
	margin-top: 10px;
	text-align: center;
}

.decrypted-content {
	animation: flickerIn 0.3s ease-out;
}

.decrypted-header {
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	padding-bottom: 15px;
	margin-bottom: 20px;
	display: flex;
	justify-content: space-between;
	font-family: "Inconsolata", monospace;
	font-size: 13px;
	color: rgba(0, 240, 255, 0.8);
}

.message-content {
	font-family: "Titillium Web", sans-serif;
	font-size: 16px;
	line-height: 1.6;
	color: rgba(255, 255, 255, 0.9);
}

.message-content ::v-deep(p) {
	margin-bottom: 15px;
}

.decrypted-footer {
	margin-top: 30px;
	padding-top: 15px;
	border-top: 1px dashed rgba(255, 255, 255, 0.2);
}

.footer-line {
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: #ff3e3e;
	text-align: center;
}

.spinning {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
