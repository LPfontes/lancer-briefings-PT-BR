<template>
  <div class="mech-dossier-modal military-dossier">
    <div class="modal-content-wrapper shadow-2">
      <!-- Top Tactical Header -->
      <div class="dossier-header">
        <div class="classification-stamp">MECHANIZED CHASSIS // CLASSIFIED</div>
        <div class="header-main">
          <div class="unit-id-block">
            <div class="protocol-id">NDL-M // REF-ID: {{ (mech.id || 'DATA-DEF').substring(0, 8).toUpperCase() }} // {{ mech.manufacturer || 'GMS' }} OPS</div>
          </div>
          <div class="main-titles">
             <h1 class="mech-name-display">{{ (mech.name || 'UNNAMED UNIT').toUpperCase() }}</h1>
             <h2 class="frame-display">{{ mech.manufacturer || 'GMS' }} // {{ mech.frame_name || 'UNKNOWN FRAME' }}</h2>
          </div>
        </div>
        <div class="action-buttons">
           <div class="modal-action-btn close" @click="$emit('close')" :title="$t('general.close')">
              <i class="mdi mdi-close"></i>
           </div>
        </div>
      </div>

      <div class="modal-body tech-scroll military-terminal">
        <div class="dossier-grid">
          <!-- Left Column: Visual & Traits -->
          <div class="dossier-col left-col">
            <div class="portrait-section">
              <div class="portrait-frame" :class="{ clickable: pilot && pilot.isCustom }" @click="triggerFileUpload">
                <img :src="mechImage" class="portrait-img" @error="handleImageError" />
                <div v-if="pilot && pilot.isCustom" class="upload-overlay">
                   <i class="mdi mdi-camera"></i>
                   <span>UPLOAD</span>
                </div>
                <div class="scan-line-anim"></div>
                <div class="corner-accents">
                  <div class="corner tl"></div>
                  <div class="corner tr"></div>
                  <div class="corner bl"></div>
                  <div class="corner br"></div>
                </div>
              </div>
              <input type="file" ref="fileInput" style="display: none" @change="onFileChange" accept="image/*" />
              <div class="portrait-metadata">
                <div class="meta-row">
                  <span>SYNC STATUS:</span>
                  <span class="status-active">100% LINKED</span>
                </div>
                <div class="meta-row">
                  <span>REACTOR:</span>
                  <span class="status-warning">STABLE</span>
                </div>
              </div>
            </div>

            <div v-if="coreSystem" class="core-box dossier-sub-box highlight">
               <div class="box-header">
                  <i class="mdi mdi-atom"></i> {{ $t('mech.coreSystem').toUpperCase() }}
               </div>
               <div class="box-content">
                  <div class="core-title">{{ coreSystem.name }}</div>
                  <div class="core-desc tech-scroll" v-html="coreSystem.description || coreSystem.effect"></div>
               </div>
            </div>

            <div v-if="frameTraits && frameTraits.length" class="traits-box dossier-sub-box">
               <div class="box-header">{{ $t('mech.traits').toUpperCase() }}</div>
               <div class="box-content tech-scroll">
                  <div v-for="trait in frameTraits" :key="trait.name" class="trait-item">
                     <div class="trait-name">{{ trait.name }}</div>
                     <div class="trait-desc" v-html="trait.description"></div>
                  </div>
               </div>
            </div>
          </div>

          <!-- Right Column: Details Panel (Stats & Loadout) -->
          <div class="details-panel tech-scroll">
            <div class="details-header">
              <div class="mf-tag">{{ mech.manufacturer }}</div>
              <h1 class="selected-name">{{ (mech.name || 'UNNAMED UNIT').toUpperCase() }}</h1>
            </div>

            <!-- Stats Grid (HASE Styled) -->
            <div class="detailed-stats-grid">
               <!-- HULL -->
               <div class="stat-mini red">
                  <span class="label">{{ $t('mech.stats.size') }}</span>
                  <span class="val">{{ stats.TAM }}</span>
               </div>
               <div class="stat-mini red">
                  <span class="label">{{ $t('mech.stats.hp') }}</span>
                  <span class="val">{{ stats.PV }}</span>
               </div>
               <div class="stat-mini red">
                  <span class="label">{{ $t('mech.stats.armor') }}</span>
                  <span class="val">{{ stats.ARM }}</span>
               </div>
               <div class="stat-mini red">
                  <span class="label">{{ $t('mech.stats.repcap') }}</span>
                  <span class="val">{{ stats.CAP_R }}</span>
               </div>

               <!-- AGILITY -->
               <div class="stat-mini green">
                  <span class="label">{{ $t('mech.stats.speed') }}</span>
                  <span class="val">{{ stats.VEL }}</span>
               </div>
               <div class="stat-mini green">
                  <span class="label">{{ $t('mech.stats.evasion') }}</span>
                  <span class="val">{{ stats.EV }}</span>
               </div>
               <div class="stat-mini green">
                  <span class="label">--</span>
                  <span class="val">--</span>
               </div>
               <div class="stat-mini green">
                  <span class="label">--</span>
                  <span class="val">--</span>
               </div>

               <!-- SYSTEMS -->
               <div class="stat-mini blue">
                  <span class="label">{{ $t('mech.stats.techAttack') }}</span>
                  <span class="val">{{ stats.ATQ_T >= 0 ? '+' : '' }}{{ stats.ATQ_T }}</span>
               </div>
               <div class="stat-mini blue">
                  <span class="label">{{ $t('mech.stats.edef') }}</span>
                  <span class="val">{{ stats.DEF_E }}</span>
               </div>
               <div class="stat-mini blue">
                  <span class="label">{{ $t('mech.stats.sensors') }}</span>
                  <span class="val">{{ stats.SEN }}</span>
               </div>
               <div class="stat-mini blue">
                  <span class="label">--</span>
                  <span class="val">--</span>
               </div>

               <!-- ENGINEERING -->
               <div class="stat-mini yellow">
                  <span class="label">{{ $t('mech.stats.save') }}</span>
                  <span class="val">{{ stats.SALV }}</span>
               </div>
               <div class="stat-mini yellow">
                  <span class="label">{{ $t('mech.stats.heatcap') }}</span>
                  <span class="val">{{ stats.CAP_C }}</span>
               </div>
               <div class="stat-mini yellow">
                  <span class="label">SP</span>
                  <span class="val">{{ stats.PS }}</span>
               </div>
               <div class="stat-mini yellow">
                  <span class="label">--</span>
                  <span class="val">--</span>
               </div>
            </div>

            <div class="loadout-section">
              <div class="details-section-header">
                <i class="mdi mdi-shield-outline"></i> {{ $t('pilotCreator.mech.mounts').toUpperCase() }}
              </div>
              <div class="mounts-grid">
                <div v-for="(mount, idx) in frameMounts" :key="idx" class="mount-card">
                  <div class="mount-header">
                    <span class="mount-type">{{ $t(`mech.mountTypes.${mount.toLowerCase()}`) || mount }}</span>
                    <i class="mdi mdi-target-variant"></i>
                  </div>
                  <div class="mount-slots">
                    <div v-for="slot in [0, 1]" :key="slot" class="slot-entry">
                      <template v-if="getWeapon(idx, slot)">
                        <div class="weapon-info">
                          <span class="w-name">{{ getWeapon(idx, slot).name }}</span>
                          <div class="w-tags">
                            <span v-for="tag in getWeapon(idx, slot).tags" :key="tag.id" class="tag">
                              {{ $t('mech.tags.' + tag.id).startsWith('mech.tags') ? tag.id.replace('tg_', '').toUpperCase() : $t('mech.tags.' + tag.id) }}
                            </span>
                          </div>
                        </div>
                      </template>
                      <span v-else-if="slot === 0" class="empty-slot">-- {{ $t('pilotCreator.mech.empty') }} --</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="systems-section">
               <div class="details-section-header">
                <i class="mdi mdi-cpu-64-bit"></i> {{ $t('pilotCreator.mech.systems').toUpperCase() }}
               </div>
               <div class="systems-list">
                  <div v-if="!mech.systems || !mech.systems.length" class="empty-msg">{{ $t('pilotCreator.mech.empty') }}</div>
                  <div v-for="sysId in mech.systems" :key="sysId" class="system-card">
                     <div class="sys-main">
                        <span class="sys-name">{{ getSystem(sysId).name }}</span>
                        <span class="sys-sp">{{ getSystem(sysId).sp || 0 }} SP</span>
                     </div>
                     <div class="sys-desc" v-if="getSystem(sysId).description" v-html="getSystem(sysId).description"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer dossier-footer">
        <div class="footer-left">TACTICAL ASSET DATA // OMNINET ENCRYPTED // {{ mech.manufacturer }} PROTOCOL</div>
        <div class="footer-right">SYNC_TIME: {{ new Date().toLocaleTimeString() }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { frames, weapons, systems } from "lancer-data-pt-br";

export default {
  props: {
    mech: Object,
    pilot: Object
  },
  computed: {
    selectedFrame() {
      if (!this.mech) return null;
      return frames.find(f => f.id === this.mech.frame_id || f.id === this.mech.frame);
    },
    grit() {
      return Math.ceil((this.pilot?.level || 0) / 2);
    },
    mechSkills() {
      return this.pilot?.mech_skills || this.pilot?.mechSkills || [0, 0, 0, 0];
    },
    stats() {
      if (!this.selectedFrame || !this.selectedFrame.stats) return {};
      const s = this.selectedFrame.stats;
      const p = this.mechSkills;
      const grit = this.grit;
      
      return {
        'TAM': s.size || 0,
        'PV': (s.hp || 0) + (p[0] * 2),
        'ARM': s.armor || 0,
        'CAP_R': (s.repcap || 0) + Math.floor(p[0] / 2),
        'VEL': (s.speed || 0) + Math.floor(p[1] / 2),
        'EV': (s.evasion || 0) + p[1],
        'ATQ_T': (s.tech_attack || 0) + p[2],
        'DEF_E': (s.edef || 0) + p[2],
        'SEN': s.sensor_range || 0,
        'SALV': (s.save || 10) + grit,
        'CAP_C': (s.heatcap || 0) + p[3],
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
    },
    mechImage() {
      if (this.mech && this.mech.image) return this.mech.image;
      if (this.pilot && this.pilot.callsign) {
        return `/mechs/${this.pilot.callsign.toUpperCase()}.webp`;
      }
      return this.mech?.frame_id ? `/frames/${this.mech.frame_id}.png` : 'https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/assets/icons/mech.png';
    }
  },
  methods: {
    getWeapon(mountIdx, slotIdx) {
      if (!this.mech || !this.mech.mounts) return null;
      const weaponId = this.mech.mounts[`${mountIdx}_${slotIdx}`];
      if (!weaponId) return null;
      return weapons.find(w => w.id === weaponId) || { name: weaponId, tags: [] };
    },
    getSystem(sysId) {
      return systems.find(s => s.id === sysId) || { name: sysId, sp: 0 };
    },
    handleImageError(e) {
      e.target.src = 'https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/assets/icons/mech.png';
    },
    triggerFileUpload() {
      if (this.pilot && this.pilot.isCustom) {
        this.$refs.fileInput.click();
      }
    },
    async onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result;
        this.mech.image = base64;
        
        // Update store if custom
        if (this.pilot && this.pilot.isCustom) {
          const saved = JSON.parse(localStorage.getItem('lancer_saved_pilots') || '[]');
          const idx = saved.findIndex(p => p.id === this.pilot.id);
          if (idx > -1) {
            // Update the mecha image in the saved pilot data
            if (saved[idx].activeMech) {
               saved[idx].activeMech.image = base64;
            } else if (saved[idx].mechs && saved[idx].mechs[0]) {
               saved[idx].mechs[0].image = base64;
            }
            
            saved[idx].lastSaved = new Date().toISOString();
            localStorage.setItem('lancer_saved_pilots', JSON.stringify(saved));
            
            // Sync to Database
            try {
              const response = await fetch('/api/pilots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saved[idx])
              });
              if (response.ok) console.log("Mecha image synced to database");
            } catch (err) { console.error("Mecha Database sync failed", err); }
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
</script>

<style scoped>
.portrait-frame.clickable {
  cursor: pointer;
}

.upload-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(175, 14, 30, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 5;
  color: #fff;
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
}

.portrait-frame:hover .upload-overlay {
  opacity: 1;
}

.mech-dossier-modal {
  background: #080808;
  border: 2px solid #222;
  color: #ddd;
  font-family: 'Inconsolata', monospace;
  max-width: 1200px;
  width: 95vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.modal-content-wrapper { 
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dossier-header {
  padding: 20px 30px;
  background: #111;
  border-bottom: 3px solid #af0e1e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.classification-stamp {
  position: absolute;
  top: 10px;
  right: 150px;
  border: 2px solid #af0e1e;
  color: #af0e1e;
  padding: 4px 12px;
  font-weight: 900;
  transform: rotate(-2deg);
  opacity: 0.4;
  font-size: 0.9rem;
  letter-spacing: 2px;
  pointer-events: none;
}

.mech-name-display {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 3.5rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 5px;
  margin: 0;
  line-height: 0.85;
}

.frame-display {
  font-size: 1rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 5px;
}

.modal-body {
  flex: 1;
  overflow: hidden;
  padding: 0;
}

.dossier-grid {
  display: flex;
  height: 100%;
}

.dossier-col.left-col {
  width: 450px;
  padding: 30px;
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.details-panel {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  overflow-y: auto;
}

.details-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 15px;
  margin-bottom: 5px;
}

.mf-tag {
  font-family: 'Inconsolata', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #5ea1ff;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.selected-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 2.8rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -1px;
}

.detailed-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 10px;
}

.stat-mini {
  background: rgba(255, 255, 255, 0.02);
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
}

.stat-mini::after {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 2px;
}

.stat-mini.red::after { background: #af0e1e; }
.stat-mini.green::after { background: #27c93f; }
.stat-mini.blue::after { background: #0c4d99; }
.stat-mini.yellow::after { background: #d1920a; }

.stat-mini .label {
  font-family: 'Inconsolata', monospace;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.stat-mini .val {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
}

.stat-mini.red .val { color: #ff4d4d; }
.stat-mini.green .val { color: #51ff70; }
.stat-mini.blue .val { color: #5ea1ff; }
.stat-mini.yellow .val { color: #ffcc33; }

.details-section-header {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #af0e1e;
  letter-spacing: 2px;
  border-bottom: 1px solid rgba(175, 14, 30, 0.3);
  padding-bottom: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.dossier-sub-box {
  margin-top: 5%;
  margin-bottom: 5%;
  background: rgba(255,255,255,0.02);
  border: 1px solid #333;
  position: relative;
}

.dossier-sub-box.highlight {
  
  border-color: #af0e1e;
  background: rgba(175, 14, 30, 0.05);
}

.box-header {
  background: #1a1a1a;
  padding: 8px 15px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #af0e1e;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.box-content { padding: 15px; }

.portrait-frame {
  position: relative;
  background: #000;
  border: 1px solid #444;
  aspect-ratio: 1;
  overflow: hidden;
  margin-bottom: 15px;
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.scan-line-anim {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, transparent 50%, rgba(175, 14, 30, 0.03) 50%);
  background-size: 100% 4px;
  pointer-events: none;
  animation: scanline 10s linear infinite;
}

.corner-accents .corner {
  position: absolute;
  width: 20px; height: 20px;
  border: 2px solid #af0e1e;
}
.corner.tl { top: 10px; left: 10px; border-right: 0; border-bottom: 0; }
.corner.tr { top: 10px; right: 10px; border-left: 0; border-bottom: 0; }
.corner.bl { bottom: 10px; left: 10px; border-right: 0; border-top: 0; }
.corner.br { bottom: 10px; right: 10px; border-left: 0; border-top: 0; }

.status-active { color: #00ff88; font-weight: bold; }
.status-warning { color: #ffcc00; font-weight: bold; }

.core-title {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 10px;
}

.mounts-grid {
  display: grid;
  gap: 10px;
}

.mount-card {
  background: rgba(255, 255, 255, 0.03);
  border-left: 4px solid #af0e1e;
  padding: 15px;
  transition: all 0.2s;
}

.mount-card:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(4px);
}

.w-name { color: #fff; font-weight: bold; font-size: 1.1rem; }
.tag { font-size: 0.7rem; background: rgba(0, 0, 0, 0.4); padding: 2px 6px; color: #aaa; margin-right: 6px; border: 1px solid rgba(255, 255, 255, 0.1); }

.system-card {
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.01);
  margin-bottom: 10px;
}

.sys-main {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.sys-name { color: #fff; font-weight: 700; font-size: 1.1rem; }
.sys-sp { color: #af0e1e; font-weight: 800; font-family: 'Big Shoulders Display', sans-serif; font-size: 1.2rem; }

.action-buttons { display: flex; gap: 10px; }
.modal-action-btn {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: #222; border: 1px solid #444;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-action-btn:hover {
  background: #af0e1e;
  border-color: #fff;
}

.dossier-footer {
  background: #111;
  padding: 12px 30px;
  border-top: 1px solid #333;
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #555;
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.tech-scroll::-webkit-scrollbar { width: 6px; }
.tech-scroll::-webkit-scrollbar-thumb { background: #af0e1e; border-radius: 3px; }
.tech-scroll::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); }
</style>
