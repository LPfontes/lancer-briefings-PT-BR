<template>
  <div class="pilot-modal-container military-dossier">
    <div class="modal-content-wrapper shadow-2">
      <!-- Top Dossier Header -->
      <div class="dossier-header">
        <div class="classification-stamp">TOP SECRET // EYES ONLY</div>
        <div class="header-main">
          <div class="pilot-id-block">
            <div class="protocol-id">NDL-C // IDENT-REC: {{ pilot.id.substring(0, 8).toUpperCase() }}</div>
          </div>
          <div class="main-titles">
             <h1 class="callsign-display">{{ pilot.callsign || $t('pilot.callsign').toUpperCase() }}</h1>
             <h2 class="name-display">{{ pilot.name || '---' }}</h2>
          </div>
        </div>
        <div class="action-buttons">
           <div v-if="activeMech" class="modal-action-btn mech" @click="openMechModal" :title="$t('pilotCreator.steps.mechBuilder')">
              <i class="mdi mdi-robot"></i>
           </div>
           <div v-if="pilot.isCustom" class="modal-action-btn edit" @click="editPilot" :title="$t('general.edit')">
              <i class="mdi mdi-pencil"></i>
           </div>
           <div v-if="pilot.isCustom" class="modal-action-btn delete" @click="deletePilot" :title="$t('general.delete')">
              <i class="mdi mdi-delete"></i>
           </div>
           <div class="modal-action-btn close" @click="$emit('close')" :title="$t('general.close')">
              <i class="mdi mdi-close"></i>
           </div>
        </div>
      </div>

      <div class="modal-body tech-scroll military-terminal">
        <!-- Attributes Grid (Horizontal Strip) -->
        <div class="military-stats-strip">
           <div class="m-stat-box" v-for="(stat, index) in [
             { label: $t('pilotCreator.fields.hull'), icon: '⬡' },
             { label: $t('pilotCreator.fields.agility'), icon: '◈' },
             { label: $t('pilotCreator.fields.systems'), icon: '⬢' },
             { label: $t('pilotCreator.fields.engineering'), icon: '⚙' }
           ]" :key="index">
              <div class="m-stat-label">{{ stat.label }}</div>
              <div class="m-stat-value">+{{ (pilot.mech_skills || pilot.mechSkills || [0,0,0,0])[index] }}</div>
           </div>
           <div class="m-stat-box level-box">
              <div class="m-stat-label">{{ $t('pilotCreator.rank') }}</div>
              <div class="m-stat-value">NL {{ pilot.level || 0 }}</div>
           </div>
        </div>

        <div class="dossier-grid">
          <!-- Left Column: Portrait & Biometrics -->
          <div class="dossier-col left-col">
            <div class="portrait-section">
              <div class="portrait-frame" :class="{ clickable: pilot.isCustom }" @click="triggerFileUpload">
                <img v-if="pilot.image" :src="pilot.image" class="portrait-img" />
                <div v-else class="no-signal">
                   <div class="glitch-text">DATA_REDACTED</div>
                   <div class="static-overlay"></div>
                </div>
                <div v-if="pilot.isCustom" class="upload-overlay">
                   <i class="mdi mdi-camera"></i>
                   <span>UPLOAD</span>
                </div>
                <div class="scan-line-anim"></div>
              </div>
              <input type="file" ref="fileInput" style="display: none" @change="onFileChange" accept="image/*" />
              <div class="portrait-metadata">
                <span>PH/HR STATUS: <span class="status-active">VERIFIED</span></span>
                <span>BIOMETRIC HASH: {{ Math.random().toString(36).substring(7).toUpperCase() }}</span>
              </div>
            </div>

            <div v-if="activeMech" class="mecha-info-box dossier-sub-box clickable" @click="openMechModal">
               <div class="box-header">
                  DESIGNATION: ACTIVE MECHA
                  <i class="mdi mdi-magnify-plus-outline detail-icon"></i>
               </div>
               <div class="box-content">
                  <div class="m-name">{{ activeMech.name }}</div>
                  <div class="m-frame">{{ activeMech.manufacturer }} // {{ activeMech.frame_name }}</div>
               </div>
            </div>

            <div class="biometrics-box dossier-sub-box">
              <div class="box-header">{{ $t('pilot.background').toUpperCase() }}</div>
              <div class="box-content">{{ pilot.background || 'N/A' }}</div>
            </div>
          </div>

          <!-- Right Column: Audit & Skills -->
          <div class="dossier-col right-col">

            <div class="audit-section dossier-sub-box">
              <div class="box-header">{{ $t('pilot.skillAudit') }}</div>
              <div class="skills-list">
                <div class="skill-entry" v-for="skill in pilot.skills" :key="skill.id">
                   <span class="skill-name">{{ getSkill(skill) }}</span>
                   <div class="skill-dots">
                      <span class="dot" v-for="n in 6" :key="n" :class="{ filled: n <= skill.rank }"></span>
                   </div>
                </div>
              </div>
            </div>

            <div class="audit-section dossier-sub-box">
              <div class="box-header">{{ $t('pilot.talentAudit') }}</div>
              <div class="talents-grid">
                 <div class="talent-card" v-for="talent in pilot.talents" :key="talent.id">
                    <div class="talent-info">
                       <span class="t-name">{{ getTalent(talent.id, talent.rank) }}</span>
                    </div>
                    <div class="rank-indicator">RANK {{ talent.rank }}</div>
                 </div>
              </div>
            </div>
            <div class="history-box dossier-sub-box">
               <div class="box-header">{{ $t('pilot.bio_short').toUpperCase() }}</div>
               <div class="box-content tech-scroll bio-text">{{ pilot.bio || $t('general.no_records') }}</div>
            </div>
            <div v-if="pilot.isCustom" class="termination-action">
               <button class="terminate-btn" @click="deletePilot">
                  <i class="mdi mdi-alert-octagon"></i>
                  TERMINAR REGISTRO // EXCLUIR PILOTO
               </button>
               <div class="termination-warning">AVISO: ESTA OPERAÇÃO É IRREVERSÍVEL E REMOVERÁ TODOS OS DADOS DA OMNINET.</div>
            </div>

            <div class="security-disclaimer">
              {{ $t('pilot.legalDisclaimer').substring(0, 150) }}...
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer dossier-footer">
        <div class="footer-left">OMNINET SECURE // UNION ADMINISTRATIVE BUREAU // IDENT-PROTOCOL RM-4</div>
        <div class="footer-right">{{ new Date().getFullYear() }} // CRADLE STANDARD TIME</div>
      </div>
    </div>
  </div>
</template>

<script>
import { pilotStore } from "@/store/pilotCreator";
import MechDisplayModal from "./MechDisplayModal.vue";

export default {
  components: { MechDisplayModal },
  props: {
    pilot: Object,
    getSkill: Function,
    getTalent: Function,
  },
  data() {
    return {
    }
  },
  computed: {
    activeMech() {
      // Prioridade 1: Pilotos customizados (Nuvem)
      if (this.pilot.activeMech) {
        const am = { ...this.pilot.activeMech };
        if (!am.frame_id) am.frame_id = am.frame;
        return am;
      }
      // Prioridade 2: Pilotos do sistema
      if (!this.pilot.mechs || !this.pilot.mechs.length) return null;
      const active = this.pilot.mechs.find((m) => m.id === this.pilot.active_mech_id);
      return active || this.pilot.mechs[0];
    }
  },
  methods: {
    openMechModal() {
      console.log("Opening Mech Modal for:", this.activeMech?.name);
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
    editPilot() {
      pilotStore.loadPilot(this.pilot);
      this.$router.push("/creator");
      this.$emit('close');
    },
    async deletePilot() {
      if (confirm(`DESEJA EXCLUIR O PILOTO "${this.pilot.callsign || 'ESTE PILOTO'}"?`)) {
        await pilotStore.deletePilot(this.pilot.id);
        window.location.reload();
      }
    },
    triggerFileUpload() {
      if (this.pilot.isCustom) {
        this.$refs.fileInput.click();
      }
    },
    async onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result;
        this.pilot.image = base64;
        
        // Update store if custom
        if (this.pilot.isCustom) {
          const saved = JSON.parse(localStorage.getItem('lancer_saved_pilots') || '[]');
          const idx = saved.findIndex(p => p.id === this.pilot.id);
          if (idx > -1) {
            // Update the record with all current pilot data
            saved[idx] = { ...this.pilot, image: base64, lastSaved: new Date().toISOString() };
            localStorage.setItem('lancer_saved_pilots', JSON.stringify(saved));
            
            // Sync to Database
            try {
              const response = await fetch('/api/pilots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saved[idx])
              });
              if (response.ok) console.log("Pilot image synced to database");
            } catch (err) { console.error("Database sync failed", err); }
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

.military-dossier {
  background: #050505;
  border: 2px solid #333;
  color: #ddd;
  font-family: 'Inconsolata', monospace;
  max-width: 1100px;
  width: 95vw;
  height: 92vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* Background Noise/Texture */
.military-dossier::before {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: url("https://www.transparenttextures.com/patterns/dark-matter.png");
  opacity: 0.1;
  pointer-events: none;
}

.modal-content-wrapper { 
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  z-index: 1;
}

/* Header Styling */
.dossier-header {
  padding: 15px 25px;
  background: #111;
  border-bottom: 2px solid #af0e1e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.classification-stamp {
  position: absolute;
  top: 5px;
  right: 120px;
  border: 2px solid #af0e1e;
  color: #af0e1e;
  padding: 3px 10px;
  font-weight: 900;
  transform: rotate(-3deg);
  opacity: 0.5;
  font-size: 1rem;
  letter-spacing: 2px;
  pointer-events: none;
}

.pilot-id-block { margin-bottom: 5px; }

.protocol-id {
  font-size: 0.7rem;
  color: #af0e1e;
  font-weight: bold;
  opacity: 0.8;
}

.callsign-display {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 4px;
  margin: 0;
  line-height: 0.8;
}

.name-display {
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Stats Strip */
.military-stats-strip {
  display: flex;
  background: #151515;
  border-bottom: 1px solid #222;
  padding: 8px 25px;
  gap: 15px;
  margin-bottom: 10px;
}

.m-stat-box {
  display: flex;
  flex-direction: column;
  border-left: 2px solid #af0e1e;
  padding-left: 12px;
  min-width: 100px;
}

.m-stat-label {
  font-size: 0.8rem;
  text-transform: uppercase;
}

.m-stat-value {
  font-size: 1.4rem;
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
}

.level-box {
  margin-left: auto;
  border-left-color: #fff;
  text-align: right;
  padding-right: 10px;
}

/* Dossier Grid */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 25px;
}

.dossier-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 30px;
}

.dossier-sub-box {
  margin-bottom: 15px;
  margin-top: 15px;
  background: rgba(255,255,255,0.01);
  border: 1px solid var(--primary-color);
  padding: 10px;
}

.box-header {
  padding: 4px 12px;
  font-size: 1rem;
  font-weight: bold;
  color: #af0e1e;
  border-bottom: 1px solid #222;
  letter-spacing: 1px;
}

.box-content {
  padding: 12px;
  font-size: 0.95rem;
  line-height: 1.4;
}

/* Portrait */
.portrait-section { margin-bottom: 15px; }

.portrait-frame {
  position: relative;
  border: 1px solid #333;
  background: #000;
  aspect-ratio: 4/5;
  margin-bottom: 8px;
  overflow: hidden;
}

.portrait-img {
  width: 100%; height: 100%; object-fit: cover;
  filter: contrast(1.1) brightness(0.8) grayscale(0.2);
}

.scan-line-anim {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, transparent 50%, rgba(175, 14, 30, 0.05) 50%);
  background-size: 100% 4px;
  pointer-events: none;
  animation: scanline 8s linear infinite;
}

.portrait-metadata {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  gap: 2px;
}

.mecha-info-box.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.mecha-info-box.clickable:hover {
  background: rgba(175, 14, 30, 0.08);
  border-color: var(--primary-color);
  box-shadow: inset 0 0 10px rgba(175, 14, 30, 0.1);
}

.detail-icon {
  float: right;
  font-size: 1.2rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.mecha-info-box.clickable:hover .detail-icon {
  opacity: 1;
  color: #fff;
}

.mecha-info-box .m-name {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 2px;
  line-height: 1;
  margin-bottom: 5px;
}

.mecha-info-box .m-frame {
  font-size: 0.9rem;
  color: #af0e1e;
  font-weight: bold;
  letter-spacing: 1px;
}

/* Skills Audit */
.skills-list { display: flex; flex-direction: column; gap: 4px; }
.skill-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
  border-bottom: 1px solid rgba(255,255,255,0.02);
}

.skill-name { font-size: 0.9rem; color: #ccc; }

.skill-dots { display: flex; gap: 3px; }
.dot { width: 7px; height: 7px; border: 1px solid #333; }
.dot.filled { background: #af0e1e; border-color: #af0e1e; }

/* Talents */
.talents-grid { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 12px; 
  padding: 12px; 
}
.talent-card {
  background: rgba(175, 14, 30, 0.05);
  padding: 8px 12px;
  border-left: 2px solid #af0e1e;
}
.t-name { font-size: 0.8rem; font-weight: bold; color: #fff; }
.rank-indicator { font-size: 0.65rem; color: #af0e1e; font-weight: bold; margin-top: 2px; }

.security-disclaimer {
  font-size: 1rem;
  text-align: justify;
  border-top: 1px solid #222;
  padding-top: 15px;
  margin-top: 10px;
}

/* Termination Action */
.termination-action {
  margin: 30px 0;
  padding: 20px;
  border: 1px dashed #af0e1e;
  background: rgba(175, 14, 30, 0.05);
  text-align: center;
}

.terminate-btn {
  width: 100%;
  padding: 15px;
  background: #af0e1e;
  color: #fff;
  border: 1px solid #fff;
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.2s;
}

.terminate-btn:hover {
  background: #fff;
  color: #af0e1e;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.termination-warning {
  margin-top: 10px;
  font-size: 0.7rem;
  color: #af0e1e;
  font-weight: bold;
  letter-spacing: 1px;
}

/* Action Buttons */
.action-buttons { display: flex; gap: 10px; }
.modal-action-btn {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: #222; border: 1px solid #444;
  cursor: pointer; transition: 0.2s;
}
.modal-action-btn:hover { background: #af0e1e; border-color: #fff; }

/* Footer */
.dossier-footer {
  background: #111;
  padding: 10px 30px;
  border-top: 1px solid #333;
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.tech-scroll::-webkit-scrollbar { width: 6px; }
.tech-scroll::-webkit-scrollbar-thumb { background: #af0e1e; }
</style>