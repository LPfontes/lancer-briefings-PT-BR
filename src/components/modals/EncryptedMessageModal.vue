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
						
						<div class="signal-selector" v-if="messages.length > 1">
							<div class="signal-label">SELECIONAR SINAL //</div>
							<div class="signal-buttons">
								<button 
									v-for="(msg, index) in messages" 
									:key="index"
									:class="['signal-btn', { active: currentMessageIndex === index }]"
									@click="selectMessage(index)"
								>
									SINAL 0{{ index + 1 }}
								</button>
							</div>
						</div>

						<div class="hint-box">
							<div class="hint-label">TRANSMISSÃO PÚBLICA</div>
							<div class="hint-content">
								<p v-for="(hint, i) in messages[currentMessageIndex].hints" :key="i">{{ hint }}</p>
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
							<div class="origin">ORIGEM: {{ messages[currentMessageIndex].origin || messageOrigin }}</div>
							<div class="timestamp">DATA: {{ currentTimestamp }}</div>
						</div>
						<div class="message-content markdown" v-html="messages[currentMessageIndex].content"></div>
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
			error: false,
			cipherChars: "0123456789ABCDEF!@#$%^&*()_+-=[]{}|;:,.<>?",
			displayedCipherText: "",
			cipherInterval: null,
			currentMessageIndex: 0,
			messages: [
				{
					password: "CAMINHODOMEIO",
					hints: ["Fé baseada na razão", "Sakyamuni deu a resposta.", "A chave é o caminho."],
					content: `
						<p>Sirvo a décadas o glorioso Míngzhì, entretanto não sou cega a mazela que se alastra sobre o meu povo.</p>
						<p>Protegemos a humanidade da queda, somos as correntes que impedem o frenesi da ganância. Mesmo assim, esse mal se alastra sobre nosso belo planeta.</p>
						<p><i>Fé baseada na razão... Sakyamuni deu a resposta.</i></p>
					`
				},
				{
					password: "CAMINHODOMEIO",
					hints: ["Fé baseada na razão", "Sakyamuni deu a resposta.", "A chave é o caminho."],
					content: `
						<p>Quando a <i>Xīnshēng</i> finalmente alcançou Helior, nossa população não estava pronta para o que viria. Seis gerações inteiras haviam nascido e morrido no vazio do espaço; a degradação tecnológica e cultural fora inevitável. O novo planeta era um desafio de escala monstruosa, e milhares de nós pereceram nos primeiros anos.</p>
						<p>Então, Míngzhì ascendeu para nos guiar. Ele resgatou conhecimentos e tecnologias há muito esquecidos, fundando os pilares que sustentariam a humanidade neste mundo hostil. A Inquisição surgiu logo em seguida, como uma resposta desesperada, mas necessária, às monstruosidades que nos destruíam por fora... e por dentro.</p>
						<p>Quando finalmente fincamos nossas raízes, uma nova verdade se impôs: era preciso garantir que a humanidade não seguisse a mesma trilha que condenou a Terra. Era preciso, a qualquer custo, quebrar o ciclo da eterna repetição.</p>
					`
				},
				{
					password: "XINSHENG",
					hints: ["A origem"],
					content: `
						<p>Mas então vocês chegaram. Um lembrete vivo da ganância humana, espalhando-se novamente pelo cosmos, devorando, consumindo e destruindo tudo em seu caminho.</p>
						<p>Míngzhì nos alertou de que vocês viriam. Que trariam consigo o Código, o verdadeiro mal da tecnologia. Previu que seus olhos brilhariam cobiçosos sobre Helior e suas riquezas, e que suas línguas de prata prometeriam milagres: saúde, abrigo, educação e liberdade. Mentiras disfarçadas de salvação. O que vocês realmente oferecem é apenas a liberdade de servir. A obrigação de consumir.</p>
						<p>Contudo, abruptamente, Míngzhì se calou. Muitos viram o silêncio como uma provação; acreditavam que deveríamos provar ao nosso Sábio que não sucumbiríamos à tentação. Antes a morte do que a perda do Caminho do Meio.</p>
					`
				},
				{
					password: "MINGZHI",
					hints: ["O Sábio"],
					content: `
						<p>No entanto, um pequeno grupo interpretou o silêncio de Míngzhì como uma conclusão. Nosso Sábio cumprira seu propósito ao nos guiar através do vazio, agora, cabia a nós escolher o próprio destino.</p>
						<p>Por muito tempo, encarei tais pensamentos como heresia. Acreditei que a guerra seria a chama da purificação, e que os sobreviventes dessa provação seriam abençoados pelo Sábio com a verdade absoluta. Então, nós lutamos. Enfrentamos a ganância humana, suas máquinas de destruição, seus exércitos. Julgávamos ser os guias iluminados, mas fomos esmagados pelo poder bruto daquela avareza.</p>
						<p>O fim era inevitável. Nosso povo definhava, a fome se espalhava e, das sombras, os Lordes surgiram como sanguessugas oportunistas.</p>
						<p>Mas então a guerra cessou. Outros de vocês apareceram, trazendo palavras de paz.</p>
						<p>Não negarei que isso feriu meu orgulho. Dilacerou minha fé. Mas minha obrigação com meu povo  é infinitamente maior do que qualquer lealdade cega a um Sábio ausente. Agora eu compreendo... o Caminho sempre foi sobre preservar a vida dos meus semelhantes.</p>
					`
				},
				{
					password: "VERDADE",
					hints: ["Conhecereis e ela vos libertará"],
					content: `
						<p>Míngzhì segue em silêncio, e os poucos de nós que restam estão divididos. A maior parte da Inquisição clama pela morte em batalha; preferem queimar todo o planeta a permitir que a avareza humana o herde.</p>
						<p>Mas foi exatamente esse tipo de fanatismo que levou a humanidade ao colapso original.</p>
						<p>Não se enganem: eu ainda não confio em suas palavras. Vocês vêm com promessas de paz, prosperidade e estabilidade, mas resguardam tudo isso atrás de suas máquinas de guerra e de seus soldados descartáveis. Nós sabemos sobre os "Restos". Sabemos sobre os seus crimes.</p>
						<p>Ainda assim, se vocês são mesmo diferentes daqueles que vieram antes, eu devo, pelo bem da humanidade de Helior, dar-lhes a chance de provar seu valor.</p>
						<p>Seguem anexas coordenadas. Uma pequena vila isolada, abandonada devido à escassez de nossas tropas. Seu povo sofre com o desamparo. As monstruosidades da fronteira já farejam o medo deles, e elas estão vindo para reivindicar o que antes era delas.</p>
						<p>-A Vigia.</p>
					`
				},
				{
					password: "PRESENTE",
					origin: "CASSANDRA // DIPLOMATA ADM-UNIÃO",
					hints: ["Espero que tenha gostado...", "De: C. Para: Ocelot.", "A União recompensa o bom trabalho."],
					content: `
						<p>Espero que tenha gostado do presente. A União recompensa o bom trabalho.</p>
						<p>Mantenha seus amigos na Linha e talvez a liberdade total não seja um sonho impossível.</p>
					`
				},
				{
					password: "GEAR37",
					origin: "????? // ?????",
					hints: ["Casa"],
					content: `
						<p>Arakan Casper, codinome Scop-Olead, tem desempenhado um papel fundamental na evolução da campanha de consolidação de paz em Hélio.</p>
						<p>Os últimos relatórios demonstraram que esse projetinho da Gear 37 realmente deu resultado.</p>
						<p>No entanto, infelizmente, senhor Casper, existem interesses díspares em jogo atualmente, e o sucesso desta missão pode não representar para o seu planeta o que você acredita.</p>
						<p>Se você realmente quer se provar capaz... faça a missão fracassar.</p>
						<p>Caso contrário, talvez a Gear 37 não esteja mais aberta a recebê-lo de volta.</p>
					`
				}
			],
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
		selectMessage(index) {
			this.currentMessageIndex = index;
			this.error = false;
			this.password = "";
		},
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
				const targetPassword = this.messages[this.currentMessageIndex].password.toUpperCase();
				// Remove acentos da senha digitada para facilitar
				const inputPassword = this.password.toUpperCase().trim()
					.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				
				if (inputPassword === targetPassword || this.password.toUpperCase() === targetPassword) {
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
				this.currentMessageIndex = 0;
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

.signal-selector {
	margin-bottom: 25px;
}

.signal-label {
	font-family: "Inconsolata", monospace;
	font-size: 11px;
	color: #00f0ff;
	opacity: 0.7;
	margin-bottom: 8px;
	letter-spacing: 1px;
}

.signal-buttons {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}

.signal-btn {
	background: rgba(0, 0, 0, 0.5);
	border: 1px solid rgba(0, 240, 255, 0.3);
	color: rgba(0, 240, 255, 0.7);
	padding: 8px 12px;
	font-family: "Rajdhani", sans-serif;
	font-weight: bold;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.2s;
}

.signal-btn:hover {
	background: rgba(0, 240, 255, 0.1);
	color: #00f0ff;
}

.signal-btn.active {
	background: #00f0ff;
	color: #000;
	border-color: #00f0ff;
	box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
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
