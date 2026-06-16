<template>
  <div class="pilot-card-compact shadow-2" @click="openDetailedModal">
    <!-- Linha de escaneamento animada de fundo -->
    <div class="scanline"></div>

    <div class="pilot-header">
      <div class="avatar-block">
         <div class="avatar-frame">
            <img v-if="pilot.image" :src="pilot.image" class="avatar-img" />
            <i v-else class="mdi mdi-account-outline placeholder-icon"></i>
         </div>
      </div>
      <div class="callsign-block">
        <div class="callsign">{{ pilot.callsign || pilot.name || $t('pilot.callsign').toUpperCase() }}</div>
        <div v-if="pilot.name && pilot.name !== pilot.callsign && pilot.name !== 'NOME NÃO REGISTRADO'" class="pilot-name">
          {{ pilot.name }}
        </div>
      </div>
    </div>
    
    <!-- Borda decorativa tática -->
    <div class="corner-top-right"></div>
    <div class="corner-bottom-left"></div>
    <div class="edge-glowing-bar"></div>
  </div>
</template>

<script>
import * as lancerData from "lancer-data-pt-br";
import * as ktbData from "lancer-ktb-data";
import * as nrfawData from "lancer-nrfaw-data";
import * as longrimData from "lancer-longrim-data";
import PilotModal from "./modals/PilotModal.vue";
import MechDisplayModal from "./modals/MechDisplayModal.vue";
import { pilotStore } from "@/store/pilotCreator";
import { authStore } from "@/store/auth";

export default {
  props: {
    pilot: Object,
    animate: Boolean
  },
  data() {
    return {
      activeMech: { manufacturer: 'N/A', frame_name: 'N/A' }
    }
  },
  computed: {
    isLoggedIn() {
      return authStore.isLoggedIn.value;
    },
    frames() {
      // Função auxiliar para extrair frames de pacotes ESM ou CommonJS
      const getFrames = (pkg) => {
        if (!pkg) return [];
        return pkg.frames || (pkg.default && pkg.default.frames) || [];
      };

      const baseFrames = getFrames(lancerData);
      const allFrames = [...baseFrames];
      
      allFrames.push(...getFrames(ktbData));
      allFrames.push(...getFrames(nrfawData));
      allFrames.push(...getFrames(longrimData));
      
      return allFrames;
    }
  },
  created() {
    this.getActiveMech();
  },
  methods: {
    openDetailedModal() {
      this.$oruga.modal.open({
        component: PilotModal,
        props: {
          pilot: this.pilot,
          getSkill: this.getSkill,
          getTalent: this.getTalent
        },
        custom: true,
        width: 1200,
        trapFocus: true
      });
    },
    openMechModal() {
      if (!this.activeMech) return;
      this.$oruga.modal.open({
        component: MechDisplayModal,
        props: {
          mech: this.activeMech,
          pilot: this.pilot
        },
        width: 1200,
        custom: true,
        trapFocus: true
      });
    },
    getActiveMech() {
      // Prioridade 1: Pilotos customizados (Nuvem/LocalStore) que usam 'activeMech'
      if (this.pilot.activeMech) {
        this.activeMech = JSON.parse(JSON.stringify(this.pilot.activeMech));
        // Mapear 'frame' para 'frame_id' se necessário para o modal
        if (!this.activeMech.frame_id && this.activeMech.frame) {
          this.activeMech.frame_id = this.activeMech.frame;
        }
        return;
      }

      // Prioridade 2: Pilotos do sistema (JSON) que usam array 'mechs'
      const activeMechID = this.pilot.state ? this.pilot.state.active_mech_id : this.pilot.active_mech_id;
      if (this.pilot.mechs && this.pilot.mechs.length > 0) {
        const active = this.pilot.mechs.find(m => m.id === activeMechID);
        this.activeMech = active || this.pilot.mechs[0];
      } else {
        const missingFrame = this.frames.find((obj) => obj.id === 'missing_frame');
        this.activeMech = missingFrame || { manufacturer: 'N/A', frame_name: 'N/A' };
      }
    },
    getSkill(skill) {
      const skills = lancerData.skills || (lancerData.default && lancerData.default.skills) || [];
      const s = skills.find((obj) => obj.id === skill.id);
      return s ? `${s.name} (${skill.rank})` : skill.id;
    },
    getTalent(id, rank) {
      const talents = lancerData.talents || (lancerData.default && lancerData.default.talents) || [];
      const t = talents.find((obj) => obj.id === id);
      return t ? `${t.name} ${rank}` : id;
    },
    editPilot() {
      pilotStore.loadPilot(this.pilot);
      this.$router.push("/creator");
    },
    async deletePilot() {
      if (confirm(`DESEJA EXCLUIR O PILOTO "${this.pilot.callsign || 'ESTE PILOTO'}"?`)) {
        await pilotStore.deletePilot(this.pilot.id);
        window.location.reload();
      }
    }
  }
}
</script>

<style scoped>
.pilot-card-compact {
  position: relative;
  background: linear-gradient(135deg, rgba(20, 20, 25, 0.85) 0%, rgba(10, 10, 15, 0.95) 100%);
  border-left: 4px solid var(--union-crimson, #af0e1e);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  padding: 15px 20px;
  flex: 1;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  max-height: fit-content;

}

.pilot-card-compact:hover {
  background: linear-gradient(135deg, rgba(35, 35, 45, 0.9) 0%, rgba(15, 15, 25, 0.98) 100%);
  transform: translateY(-4px);
  border-left-width: 6px;
  box-shadow: 0 10px 30px rgba(175, 14, 30, 0.25), inset 0 0 15px rgba(255, 255, 255, 0.02);
}

.scanline {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(255, 255, 255, 0.02) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 1;
}

.pilot-header {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  z-index: 2;
}

.avatar-block {
  flex-shrink: 0;
}

.avatar-frame {
  position: relative;
  width: 56px;
  height: 56px;
  background: rgba(175, 14, 30, 0.08);
  border: 1px solid var(--union-crimson, #af0e1e);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  transition: border-color 0.3s;
}

.pilot-card-compact:hover .avatar-frame {
  border-color: #00f0ff;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.1) brightness(0.95) grayscale(0.1);
  transition: all 0.3s;
}

.pilot-card-compact:hover .avatar-img {
  filter: contrast(1.15) brightness(1.1) grayscale(0);
}

.placeholder-icon {
  font-size: 1.8rem;
  color: var(--union-crimson, #af0e1e);
  opacity: 0.7;
}

.callsign-block {
  flex-grow: 1;
  min-width: 0;
}

.callsign {
  font-family: "Big Shoulders Display", cursive;
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  letter-spacing: 2px;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pilot-name {
  font-family: "Inconsolata", monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.label {
  font-size: 0.65rem;
  color: var(--union-crimson, #af0e1e);
  font-weight: bold;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

/* Decorative Elements */
.corner-top-right {
  position: absolute;
  top: 0; right: 0;
  width: 15px; height: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-right: 1px solid rgba(255, 255, 255, 0.15);
}

.corner-bottom-left {
  position: absolute;
  bottom: 0; left: 0;
  width: 10px; height: 10px;
  border-bottom: 2px solid var(--union-crimson, #af0e1e);
  border-left: 2px solid var(--union-crimson, #af0e1e);
}

.edge-glowing-bar {
  position: absolute;
  bottom: 0; left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, var(--union-crimson, #af0e1e), #00f0ff);
  transition: width 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.pilot-card-compact:hover .edge-glowing-bar {
  width: 100%;
}
</style>
