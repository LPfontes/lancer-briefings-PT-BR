<template>
  <div class="pilot-card-compact shadow-2" @click="openDetailedModal">
    <div class="pilot-header">
      <div class="avatar-block">
         <div class="avatar-frame">
            <img v-if="pilot.image" :src="pilot.image" class="avatar-img" />
            <i v-else class="mdi mdi-account-outline placeholder-icon"></i>
         </div>
      </div>
      <div class="callsign-block">
        <div class="label">{{ $t('pilot.callsign') }}</div>
        <div class="callsign">{{ pilot.callsign || $t('pilot.callsign').toUpperCase() }}</div>
      </div>
      <div class="level-block">
        <div class="label">{{ $t('pilotCreator.rank') }}</div>
        <div class="level">{{ pilot.level || 0 }}</div>
      </div>
    </div>
    
    <div class="pilot-footer">
      <div class="mech-info">
        <i class="cci cci-reserve-mech"></i>
        <span>{{ (activeMech.manufacturer || 'N/A') }} // {{ (activeMech.frame_name || 'N/A') }}</span>
      </div>
      <div class="quick-actions" v-if="pilot.isCustom" @click.stop>
        <i class="mdi mdi-pencil" @click="editPilot" :title="$t('general.edit')"></i>
        <i class="mdi mdi-delete" @click="deletePilot" :title="$t('general.delete')"></i>
      </div>
    </div>
    
    <!-- Borda decorativa tática -->
    <div class="corner-top-right"></div>
    <div class="corner-bottom-left"></div>
  </div>
</template>

<script>
import * as lancerData from "lancer-data-pt-br";
import * as ktbData from "lancer-ktb-data";
import * as nrfawData from "lancer-nrfaw-data";
import * as longrimData from "lancer-longrim-data";
import PilotModal from "./modals/PilotModal.vue";
import { pilotStore } from "@/store/pilotCreator";

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
        trapFocus: true
      });
    },
    getActiveMech() {
      const activeMechID = this.pilot.state ? this.pilot.state.active_mech_id : this.pilot.active_mech_id;
      if (this.pilot.mechs && this.pilot.mechs[0]) {
        this.activeMech = this.pilot.mechs[0];
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
  background: rgba(20, 20, 25, 0.8);
  border-left: 4px solid var(--union-crimson);
  padding: 15px;
  min-width: 300px;
  flex: 1;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.pilot-card-compact:hover {
  background: rgba(40, 40, 50, 0.9);
  transform: translateY(-2px);
  border-left-width: 8px;
}

.pilot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  gap: 15px;
}

.avatar-block {
  flex-shrink: 0;
}

.avatar-frame {
  width: 50px;
  height: 50px;
  background: rgba(175, 14, 30, 0.1);
  border: 1px solid var(--union-crimson);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-icon {
  font-size: 1.5rem;
  color: var(--union-crimson);
  opacity: 0.7;
}

.callsign-block {
  flex-grow: 1;
}

.callsign {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  letter-spacing: 2px;
  line-height: 1;
}

.label {
  font-size: 0.7rem;
  color: var(--union-crimson);
  font-weight: bold;
  opacity: 0.8;
}

.level-block {
  text-align: right;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
}

.level { font-size: 1.2rem; font-weight: bold; }

.pilot-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.mech-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quick-actions i {
  margin-left: 12px;
  cursor: pointer;
  opacity: 0.5;
  transition: 0.2s;
}

.quick-actions i:hover { opacity: 1; color: var(--union-crimson); }

/* Decorative Elements */
.corner-top-right {
  position: absolute;
  top: 0; right: 0;
  width: 20px; height: 20px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  border-right: 2px solid rgba(255, 255, 255, 0.1);
}

.corner-bottom-left {
  position: absolute;
  bottom: 0; left: 0;
  width: 10px; height: 10px;
  border-bottom: 2px solid var(--union-crimson);
  border-left: 2px solid var(--union-crimson);
}
</style>
