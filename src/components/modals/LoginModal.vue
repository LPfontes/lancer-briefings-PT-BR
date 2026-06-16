<template>
  <div class="login-modal military-terminal">
    <div class="modal-header">
      <div class="header-main">
        <span class="material-symbols-outlined icon">security</span>
        <h2 class="modal-title">{{ tab === 'login' ? $t('auth.loginTitle') : 'CADASTRAR NOVO ADMINISTRADOR' }}</h2>
      </div>
      <button class="close-btn" @click="$emit('close')">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <!-- Abas cyberpunk -->
    <div v-if="!successMessage && !signUpSuccess" class="auth-tabs">
      <button 
        class="tab-btn" 
        :class="{ active: tab === 'login' }" 
        @click="switchTab('login')"
      >
        ENTRAR
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: tab === 'register' }" 
        @click="switchTab('register')"
      >
        REGISTRAR
      </button>
    </div>

    <div class="modal-body">
      <!-- ── INTERFACE DE LOGIN / CADASTRO ── -->
      <div v-if="!successMessage && !signUpSuccess" class="login-interface">
        <div class="warning-box">
          <span class="material-symbols-outlined warning-icon">lock</span>
          <p v-if="tab === 'login'">AUTENTICAÇÃO REQUERIDA PARA GRAVAR, ALTERAR OU REMOVER FICHAS DE PILOTOS NO BANCO DE DADOS REMOTO.</p>
          <p v-else>CRIE UMA CONTA DE ADMINISTRADOR PARA SYNC DE FICHAS. A CONFIRMAÇÃO PODE SER EXIGIDA VIA E-MAIL CONFIGURADO.</p>
        </div>

        <div class="auth-form">
          <!-- Campo E-mail -->
          <div class="input-group">
            <label class="field-label">ENDEREÇO DE E-MAIL</label>
            <div class="input-wrapper" :class="{ error: error }">
              <span class="material-symbols-outlined input-icon">mail</span>
              <input 
                type="email" 
                v-model="email" 
                placeholder="exemplo@lancer.com" 
                @keyup.enter="handleSubmit"
                class="auth-input"
                ref="emailInput"
                autofocus
              />
            </div>
          </div>

          <!-- Campo Senha -->
          <div class="input-group" style="margin-top: 15px;">
            <label class="field-label">SENHA DE ACESSO</label>
            <div class="input-wrapper" :class="{ error: error }">
              <span class="material-symbols-outlined input-icon">key</span>
              <input 
                type="password" 
                v-model="password" 
                placeholder="Sua senha..." 
                @keyup.enter="handleSubmit"
                class="auth-input"
                ref="pwdInput"
              />
            </div>
          </div>

          <!-- Botão Submissão -->
          <button class="login-btn" @click="handleSubmit" :disabled="isProcessing" style="margin-top: 20px; width: 100%; justify-content: center;">
            <span class="material-symbols-outlined" v-if="!isProcessing">{{ tab === 'login' ? 'login' : 'person_add' }}</span>
            <span class="material-symbols-outlined spinning" v-else>sync</span>
            {{ isProcessing ? 'PROCESSANDO...' : (tab === 'login' ? 'ENTRAR' : 'REGISTRAR ADM') }}
          </button>
        </div>
        
        <div v-if="error" class="error-msg">
          <span class="material-symbols-outlined icon-small">gpp_bad</span>
          {{ errorMessage }}
        </div>
      </div>

      <!-- ── SUCESSO DE LOGIN ── -->
      <div v-else-if="successMessage" class="success-interface">
        <span class="material-symbols-outlined success-icon">verified_user</span>
        <h3 class="success-title">ACESSO AUTORIZADO</h3>
        <p class="success-subtitle">SESSÃO INICIADA // SINCRONIZAÇÃO EM TEMPO REAL ATIVA</p>
      </div>

      <!-- ── SUCESSO DE CADASTRO ── -->
      <div v-else-if="signUpSuccess" class="success-interface signup-success">
        <span class="material-symbols-outlined success-icon" style="color: #3CB043;">mail_lock</span>
        <h3 class="success-title" style="color: #3CB043;">CONTA REGISTRADA</h3>
        <p class="success-subtitle">CONTA CRIADA COM SUCESSO. VERIFIQUE SEU E-MAIL PARA ATIVAÇÃO SE CONFIGURADO.</p>
        <button class="login-btn" @click="resetToLogin" style="margin: 20px auto 0; width: auto; display: flex;">
          <span class="material-symbols-outlined">login</span>
          IR PARA O LOGIN
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { authStore } from "@/store/auth";

export default {
  name: "LoginModal",
  emits: ["close"],
  data() {
    return {
      tab: "login",
      email: "",
      password: "",
      isProcessing: false,
      error: false,
      errorMessage: "",
      successMessage: false,
      signUpSuccess: false
    };
  },
  mounted() {
    this.focusInput();
  },
  methods: {
    focusInput() {
      this.$nextTick(() => {
        if (this.$refs.emailInput) {
          this.$refs.emailInput.focus();
        }
      });
    },
    switchTab(newTab) {
      this.tab = newTab;
      this.error = false;
      this.errorMessage = "";
      this.focusInput();
    },
    resetToLogin() {
      this.tab = "login";
      this.signUpSuccess = false;
      this.error = false;
      this.errorMessage = "";
      this.password = "";
      this.focusInput();
    },
    async handleSubmit() {
      if (!this.email || !this.password) return;
      this.isProcessing = true;
      this.error = false;
      this.errorMessage = "";
      
      // Simular delay de processamento tático
      setTimeout(async () => {
        try {
          if (this.tab === "login") {
            const result = await authStore.login(this.email, this.password);
            this.isProcessing = false;
            
            if (result.success) {
              this.successMessage = true;
              setTimeout(() => {
                this.$emit("close");
                window.location.reload(); // Recarregar a página para sincronizar dados e atualizar interface
              }, 1500);
            } else {
              this.error = true;
              this.errorMessage = result.error || "Acesso negado. Credenciais incorretas.";
              this.password = "";
              this.focusInput();
            }
          } else {
            // Registro
            const result = await authStore.signUp(this.email, this.password);
            this.isProcessing = false;
            
            if (result.success) {
              this.signUpSuccess = true;
            } else {
              this.error = true;
              this.errorMessage = result.error || "Falha ao registrar novo administrador.";
            }
          }
        } catch (e) {
          this.isProcessing = false;
          this.error = true;
          this.errorMessage = e.message;
        }
      }, 1000);
    }
  }
};
</script>

<style scoped>
.login-modal {
  background: #05080c;
  width: 100%;
  border: 2px solid var(--primary-color, #af0e1e);
  box-shadow: 0 0 30px rgba(175, 14, 30, 0.3), inset 0 0 20px rgba(175, 14, 30, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(175, 14, 30, 0.15);
  border-bottom: 1px solid rgba(175, 14, 30, 0.3);
}

.header-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  color: var(--primary-color, #af0e1e);
}

.modal-title {
  font-family: "Oxanium", cursive;
  font-size: 16px;
  color: #fff;
  letter-spacing: 1px;
  margin: 0;
  text-transform: uppercase;
}

.close-btn {
  background: none;
  border: none;
  color: var(--primary-color, #af0e1e);
  cursor: pointer;
  opacity: 0.7;
  display: flex;
  align-items: center;
}

.close-btn:hover {
  opacity: 1;
}

.auth-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(175, 14, 30, 0.2);
}

.tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: rgba(255, 255, 255, 0.6);
  padding: 12px;
  cursor: pointer;
  font-family: "Rajdhani", sans-serif;
  font-weight: bold;
  font-size: 14px;
  letter-spacing: 1px;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #fff;
  background: rgba(175, 14, 30, 0.05);
}

.tab-btn.active {
  color: var(--primary-color, #af0e1e);
  border-bottom-color: var(--primary-color, #af0e1e);
  background: rgba(175, 14, 30, 0.1);
  text-shadow: 0 0 10px rgba(175, 14, 30, 0.5);
}

.modal-body {
  padding: 25px;
}

.warning-box {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(175, 14, 30, 0.05);
  border: 1px solid rgba(175, 14, 30, 0.2);
  padding: 15px;
  margin-bottom: 25px;
}

.warning-icon {
  color: var(--primary-color, #af0e1e);
  font-size: 28px;
}

.warning-box p {
  font-family: "Inconsolata", monospace;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.4;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.field-label {
  display: block;
  font-family: "Inconsolata", monospace;
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
  letter-spacing: 1px;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0 15px;
  transition: border-color 0.2s;
}

.input-wrapper:focus-within {
  border-color: var(--primary-color, #af0e1e);
}

.input-wrapper.error {
  border-color: #ff3e3e;
}

.input-icon {
  color: rgba(255, 255, 255, 0.4);
  font-size: 20px;
}

.auth-input {
  background: transparent;
  border: none;
  color: #fff;
  padding: 12px 10px;
  width: 100%;
  font-family: "Inconsolata", monospace;
  outline: none;
}

.login-btn {
  background: var(--primary-color, #af0e1e);
  color: #fff;
  border: none;
  padding: 12px 20px;
  font-family: "Rajdhani", sans-serif;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: #fff;
  color: #000;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-msg {
  color: #ff3e3e;
  font-family: "Inconsolata", monospace;
  font-size: 12px;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.icon-small {
  font-size: 16px;
}

.success-interface {
  text-align: center;
  padding: 20px 0;
  animation: flickerIn 0.3s ease-out;
}

.success-icon {
  color: #00f0ff;
  font-size: 56px;
  margin-bottom: 15px;
  display: block;
}

.success-title {
  font-family: "Oxanium", sans-serif;
  color: #00f0ff;
  font-size: 20px;
  margin: 0 0 10px 0;
  letter-spacing: 2px;
}

.success-subtitle {
  font-family: "Inconsolata", monospace;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  margin: 0;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes flickerIn {
  0% { opacity: 0; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
</style>
