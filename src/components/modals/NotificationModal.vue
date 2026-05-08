<template>
	<transition name="modal-fade">
		<div class="modal-overlay" v-if="isOpen" @click.self="$emit('close')">
			<div class="notification-modal" :class="type">
				<div class="modal-header">
					<div class="header-main">
						<span class="material-symbols-outlined icon">{{ getIcon() }}</span>
						<h2 class="modal-title">{{ title }}</h2>
					</div>
					<button class="close-btn" @click="$emit('close')">
						<span class="material-symbols-outlined">close</span>
					</button>
				</div>

				<div class="modal-body">
					<div class="message-container">
						<p class="notification-message">{{ message }}</p>
					</div>
					<div class="footer-actions">
						<button class="action-btn" @click="$emit('close')">ENTENDIDO</button>
					</div>
				</div>
				
				<div class="status-bar">
					<div class="status-indicator"></div>
					<div class="status-text">SISTEMA DE NOTIFICAÇÃO DA UNIÃO // STATUS: OK</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: "NotificationModal",
	props: {
		isOpen: Boolean,
		title: {
			type: String,
			default: "NOTIFICAÇÃO DO SISTEMA"
		},
		message: {
			type: String,
			default: ""
		},
		type: {
			type: String,
			default: "info" // info, warning, error, success
		}
	},
	emits: ["close"],
	methods: {
		getIcon() {
			switch(this.type) {
				case 'warning': return 'warning';
				case 'error': return 'error';
				case 'success': return 'check_circle';
				default: return 'info';
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
	background: rgba(0, 0, 0, 0.8);
	backdrop-filter: blur(4px);
	z-index: 4000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
}

.notification-modal {
	background: #0b1119;
	width: 100%;
	max-width: 450px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
	position: relative;
	overflow: hidden;
}

/* Types */
.notification-modal.info { border-color: #00f0ff; }
.notification-modal.warning { border-color: #ffa500; }
.notification-modal.error { border-color: #ff3e3e; }
.notification-modal.success { border-color: #3cb043; }

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 15px;
	background: rgba(255, 255, 255, 0.05);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-main {
	display: flex;
	align-items: center;
	gap: 10px;
}

.modal-title {
	font-family: "Oxanium", cursive;
	font-size: 14px;
	color: #fff;
	letter-spacing: 1px;
	margin: 0;
	text-transform: uppercase;
}

.icon {
	font-size: 20px;
}

.info .icon { color: #00f0ff; }
.warning .icon { color: #ffa500; }
.error .icon { color: #ff3e3e; }
.success .icon { color: #3cb043; }

.close-btn {
	background: none;
	border: none;
	color: rgba(255, 255, 255, 0.5);
	cursor: pointer;
	padding: 0;
}

.modal-body {
	padding: 25px;
}

.notification-message {
	font-family: "Titillium Web", sans-serif;
	font-size: 16px;
	color: rgba(255, 255, 255, 0.9);
	margin: 0 0 20px 0;
	line-height: 1.5;
}

.footer-actions {
	display: flex;
	justify-content: flex-end;
}

.action-btn {
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.2);
	color: #fff;
	padding: 8px 20px;
	font-family: "Rajdhani", sans-serif;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.2s;
}

.info .action-btn:hover { background: rgba(0, 240, 255, 0.2); border-color: #00f0ff; }
.warning .action-btn:hover { background: rgba(255, 165, 0, 0.2); border-color: #ffa500; }
.error .action-btn:hover { background: rgba(255, 62, 62, 0.2); border-color: #ff3e3e; }
.success .action-btn:hover { background: rgba(60, 176, 67, 0.2); border-color: #3cb043; }

.status-bar {
	background: rgba(0, 0, 0, 0.4);
	padding: 6px 15px;
	display: flex;
	align-items: center;
	gap: 10px;
	border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.status-indicator {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: #3cb043;
	box-shadow: 0 0 5px #3cb043;
}

.status-text {
	font-family: "Inconsolata", monospace;
	font-size: 10px;
	color: rgba(255, 255, 255, 0.3);
	letter-spacing: 1px;
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
