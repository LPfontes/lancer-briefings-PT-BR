<template>
  <div class="mech-detail-modal military-dossier">
    <div class="modal-content-wrapper shadow-2">
      <!-- Dossier Header -->
      <div class="dossier-header">
        <div class="classification-stamp">UNIT DATA // RESTRICTED</div>
        <div class="header-main">
          <div class="unit-id-block">
            <div class="protocol-id">ASSET-ID: {{ mech.id.substring(0, 8).toUpperCase() }} // {{ mech.manufacturer }} PROTOCOL</div>
          </div>
          <div class="main-titles">
             <h1 class="unit-name">{{ mech.name.toUpperCase() }}</h1>
             <h2 class="unit-frame">{{ mech.manufacturer }} // {{ mech.frame_name }}</h2>
          </div>
        </div>
        <div class="action-buttons">
           <div class="modal-action-btn close" @click="$emit('close')" :title="$t('general.close')">
              <i class="mdi mdi-close"></i>
           </div>
        </div>
      </div>

      <div class="modal-body tech-scroll military-terminal">
        <!-- Stats Grid -->
        <div class="stats-grid-row">
           <div class="m-stat-box" v-for="(val, label) in calculatedStats" :key="label">
              <div class="m-stat-label">{{ label }}</div>
              <div class="m-stat-value">{{ val }}</div>
           </div>
        </div>

        <div class="dossier-grid">
          <!-- Left Column: Mounts & Loadout -->
          <div class="dossier-col">
            <div class="box-section dossier-sub-box">
               <div class="box-header">{{ $t('pilotCreator.mech.mounts').toUpperCase() }}</div>
               <div class="box-content mounts-list">
                  <div v-for="(mount, idx) in frameMounts" :key="idx" class="mount-entry">
                     <div class="mount-type">{{ mount }}</div>
                     <div class="mount-weapons">
                        <div v-for="slot in [0, 1]" :key="slot" class="weapon-slot">
                           <span v-if="getWeaponName(idx, slot)" class="w-name">
                              <i class="mdi mdi-sword-cross"></i> {{ getWeaponName(idx, slot) }}
                           </span>
                           <span v-else-if="slot === 0" class="w-empty">-- {{ $t('pilotCreator.mech.empty') }} --</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div v-if="frameTraits && frameTraits.length" class="box-section dossier-sub-box">
               <div class="box-header">{{ $t('mech.traits').toUpperCase() }}</div>
               <div class="box-content traits-list">
                  <div v-for="trait in frameTraits" :key="trait.name" class="trait-item">
                     <div class="trait-name">{{ trait.name }}</div>
                     <div class="trait-desc" v-html="trait.description"></div>
                  </div>
               </div>
            </div>
          </div>

          <!-- Right Column: Systems & Core -->
          <div class="dossier-col">
            <div class="box-section dossier-sub-box">
               <div class="box-header">{{ $t('pilotCreator.mech.systems').toUpperCase() }}</div>
               <div class="box-content systems-list">
                  <div v-if="!mech.systems || !mech.systems.length" class="empty-msg">{{ $t('pilotCreator.mech.empty') }}</div>
                  <div v-for="sysId in mech.systems" :key="sysId" class="system-entry">
                     <span class="s-name">{{ getSystemName(sysId) }}</span>
                     <span class="s-cost">{{ getSystemSp(sysId) }} SP</span>
                  </div>
               </div>
            </div>

            <div v-if="coreSystem" class="box-section dossier-sub-box core-box">
               <div class="box-header">{{ $t('mech.coreSystem').toUpperCase() }}</div>
               <div class="box-content">
                  <div class="core-name">{{ coreSystem.name }}</div>
                  <div class="core-desc" v-html="coreSystem.description || coreSystem.effect"></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer dossier-footer">
        <div class="footer-left">TACTICAL ASSET OVERVIEW // SYNCED VIA OMNINET-GREEN</div>
        <div class="footer-right">NDL-C-DISCORDANT-BREATH PROTOCOL ACTIVE</div>
      </div>
    </div>
  </div>
</template>

<script>
import { frames as framesData, weapons as weaponsData, systems as systemsData } from "lancer-data-pt-br";

export default {
  props: {
    isOpen: Boolean,
    mech: Object,
    pilot: Object // Needed for stats calculation (Grit/Skills)
  },
  computed: {
    selectedFrame() {
      if (!this.mech) return null;
      return framesData.find(f => f.id === this.mech.frame_id || f.id === this.mech.frame);
    },
    grit() {
      return Math.ceil((this.pilot?.level || 0) / 2);
    },
    mechSkills() {
      return this.pilot?.mech_skills || this.pilot?.mechSkills || [0, 0, 0, 0];
    },
    calculatedStats() {
      if (!this.selectedFrame || !this.selectedFrame.stats) return {};
      const s = this.selectedFrame.stats;
      const p = this.mechSkills;
      const grit = this.grit;
      
      return {
        'TAM': s.size || 0,
        'PV': (s.hp || 0) + (p[0] * 2),
        'ARM': s.armor || 0,
        'EV': (s.evasion || 0) + p[1],
        'DEF-E': (s.edef || 0) + p[2],
        'CAP-C': (s.heatcap || 0) + p[3],
        'VEL': (s.speed || 0) + Math.floor(p[1] / 2),
        'SEN': s.sensor_range || 0,
        'SALV': s.save || 0,
        'PS': (s.sp || 0) + p[2] + Math.ceil(grit / 2)
      };
    },
    frameMounts() {
      return this.selectedFrame?.mounts || [];
    },
    frameTraits() {
      return this.selectedFrame?.traits || [];
    },
    coreSystem() {
      return this.selectedFrame?.core_system;
    }
  },
  methods: {
    getWeaponName(mountIdx, slotIdx) {
      if (!this.mech.mounts) return null;
      const weaponId = this.mech.mounts[`${mountIdx}_${slotIdx}`];
      if (!weaponId) return null;
      const w = weaponsData.find(w => w.id === weaponId);
      return w ? w.name : weaponId;
    },
    getSystemName(sysId) {
      const s = systemsData.find(s => s.id === sysId);
      return s ? s.name : sysId;
    },
    getSystemSp(sysId) {
      const s = systemsData.find(s => s.id === sysId);
      return s ? (s.sp || 0) : 0;
    }
  }
}
</script>

<style scoped>
.mech-detail-modal {
  background: #050505;
  border: 1px solid var(--primary-color);
  color: #ddd;
  font-family: 'Inconsolata', monospace;
  max-width: 1000px;
  width: 90vw;
  height: 85vh;
  display: flex;
  flex-direction: column;
}

.modal-content-wrapper { height: 100%; display: flex; flex-direction: column; }

.dossier-header {
  padding: 15px 25px;
  background: #111;
  border-bottom: 2px solid var(--primary-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit-name {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 2.8rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 3px;
  margin: 0;
  line-height: 0.9;
}

.unit-frame {
  font-size: 0.9rem;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.protocol-id { font-size: 0.7rem; opacity: 0.6; margin-bottom: 5px; }

.stats-grid-row {
  display: flex;
  flex-wrap: wrap;
  background: #151515;
  border-bottom: 1px solid #222;
  padding: 10px 25px;
  gap: 15px;
}

.m-stat-box {
  border-left: 2px solid var(--primary-color);
  padding-left: 10px;
  min-width: 80px;
}

.m-stat-label { font-size: 0.6rem; color: #888; text-transform: uppercase; }
.m-stat-value { font-size: 1.3rem; font-weight: 900; color: #fff; }

.modal-body { flex: 1; overflow-y: auto; padding: 25px; }
.dossier-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }

.dossier-sub-box {
  margin-bottom: 20px;
  background: rgba(255,255,255,0.01);
  border: 1px solid #222;
}

.box-header {
  background: #1a1a1a;
  padding: 5px 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--primary-color);
  border-bottom: 1px solid #222;
}

.box-content { padding: 12px; }

/* Mounts */
.mount-entry {
  margin-bottom: 12px;
  border-left: 2px solid #333;
  padding-left: 10px;
}
.mount-type { font-size: 0.7rem; color: #666; text-transform: uppercase; margin-bottom: 4px; }
.weapon-slot { margin-bottom: 2px; font-size: 0.95rem; }
.w-name { color: #fff; }
.w-empty { color: #444; font-style: italic; }

/* Traits & Systems */
.trait-item { margin-bottom: 15px; }
.trait-name { color: #fff; font-weight: bold; font-size: 1rem; margin-bottom: 4px; border-bottom: 1px solid #222; }
.trait-desc { font-size: 0.85rem; color: #bbb; line-height: 1.4; }

.system-entry {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px dashed #222;
  font-size: 0.95rem;
}
.s-cost { color: var(--primary-color); font-weight: bold; }

/* Core System */
.core-box { border-color: var(--primary-color); background: rgba(175, 14, 30, 0.05); }
.core-name { font-size: 1.1rem; font-weight: bold; color: #fff; margin-bottom: 8px; }
.core-desc { font-size: 0.85rem; color: #ddd; line-height: 1.5; }

.action-buttons { display: flex; gap: 10px; }
.modal-action-btn {
  width: 35px; height: 35px;
  display: flex; align-items: center; justify-content: center;
  background: #222; border: 1px solid #444;
  cursor: pointer; transition: 0.2s;
}
.modal-action-btn:hover { background: var(--primary-color); border-color: #fff; }

.dossier-footer {
  background: #111;
  padding: 8px 25px;
  border-top: 1px solid #333;
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: #555;
}
</style>
