<template>
  <div class="compcon-hangar-container">
    <!-- Left Sidebar / Index & Filters -->
    <aside class="compcon-sidebar tech-scroll">
      <div class="sidebar-header">
        <div class="srd-badge"><i class="mdi mdi-database"></i> COMPENDIUM // SRD</div>
        <h2 class="sidebar-title">COMPÊNDIO DE Chassis</h2>
      </div>

      <!-- Search Input -->
      <div class="search-box">
        <span class="material-symbols-outlined search-icon">search</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="BUSCAR CHASSI OU PAPEL..." 
          class="compcon-search-input"
        />
        <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Quick Manufacturer Filter Pills -->
      <div class="m-filter-list">
        <button 
          v-for="m in manufacturers" 
          :key="m.id" 
          class="m-pill-btn"
          :class="[m.id.toLowerCase(), { active: selectedManufacturer === m.id }]"
          @click="selectedManufacturer = m.id"
        >
          <span class="m-pill-code">{{ m.code }}</span>
          <span class="m-pill-name">{{ m.label }}</span>
          <span class="m-pill-count">{{ getManufacturerCount(m.id) }}</span>
        </button>
      </div>

      <!-- Collapsible Manufacturer Tree -->
      <div class="manufacturer-tree">
        <div 
          v-for="group in manufacturerGroups" 
          :key="group.id" 
          class="tree-group"
          :class="group.id.toLowerCase()"
        >
          <div class="tree-group-header" @click="toggleGroup(group.id)">
            <span class="material-symbols-outlined tree-arrow">
              {{ expandedGroups[group.id] ? 'expand_more' : 'chevron_right' }}
            </span>
            <span class="group-name">{{ group.name }}</span>
            <span class="group-count">({{ group.frames.length }})</span>
          </div>

          <div v-show="expandedGroups[group.id]" class="tree-frame-list">
            <div 
              v-for="f in group.frames" 
              :key="f.id" 
              class="tree-frame-item"
              :class="{ selected: selectedFrame && selectedFrame.id === f.id }"
              @click="openFrameDetail(f)"
            >
              <span class="frame-dot"></span>
              <span class="frame-item-name">{{ formatFrameName(f.name) }}</span>
              <span class="frame-item-role">{{ getShortRole(f) }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area: COMP/CON Grid of Frame Cards -->
    <main class="compcon-main-content">
      <!-- Top Bar Stat Info -->
      <div class="compcon-top-bar">
        <div class="bar-left">
          <span class="status-indicator"></span>
          <span class="bar-text">EXIBINDO <strong>{{ filteredFrames.length }}</strong> Chassis DE COMBATE REGISTRADOS</span>
        </div>
        <div class="bar-right" v-if="selectedManufacturer !== 'ALL'">
          <span class="active-filter-tag">FILTRO ATIVO: {{ selectedManufacturer }}</span>
          <button class="reset-link-btn" @click="selectedManufacturer = 'ALL'">EXIBIR TODOS</button>
        </div>
      </div>

      <!-- Frame Cards Grid -->
      <div class="compcon-grid-wrapper tech-scroll">
        <div v-if="filteredFrames.length" class="compcon-grid">
          <div 
            v-for="frame in filteredFrames" 
            :key="frame.id" 
            class="compcon-frame-card"
            :class="getManufacturerClass(frame)"
            @click="openFrameDetail(frame)"
          >
            <!-- Card Header Badge -->
            <div class="card-m-header">
              <span class="compcon-m-badge">{{ getManufacturerCode(frame) }}</span>
              <span class="compcon-size-badge">TAM {{ frame.stats?.size || 1 }}</span>
            </div>

            <!-- Card Body Flex Row: Left Telemetry Strip + Right Content -->
            <div class="card-body-row">
              <!-- Quick Telemetry Strip (Vertical on Left Side) -->
              <div class="compcon-telemetry-strip vertical">
                <div class="t-pill red"><span class="t-lbl">PV</span><span class="t-val">{{ frame.stats?.hp || 0 }}</span></div>
                <div class="t-pill red"><span class="t-lbl">ARM</span><span class="t-val">{{ frame.stats?.armor || 0 }}</span></div>
                <div class="t-pill green"><span class="t-lbl">VEL</span><span class="t-val">{{ frame.stats?.speed || 0 }}</span></div>
                <div class="t-pill green"><span class="t-lbl">EV</span><span class="t-val">{{ frame.stats?.evasion || 0 }}</span></div>
                <div class="t-pill blue"><span class="t-lbl">E-DEF</span><span class="t-val">{{ frame.stats?.edef || 0 }}</span></div>
                <div class="t-pill yellow"><span class="t-lbl">SP</span><span class="t-val">{{ frame.stats?.sp || 0 }}</span></div>
              </div>

              <!-- Right Side Content: Artwork + Card Titles -->
              <div class="card-right-content">
                <!-- Frame Graphic / Artwork -->
                <div class="compcon-card-artwork">
                  <img :src="getFrameImage(frame)" class="compcon-artwork-img" @error="handleImageError" />
                  <div class="scan-overlay"></div>
                  <div class="inspect-btn-overlay">
                    <span class="material-symbols-outlined">visibility</span>
                    <span>VER DOSSIÊ DE COMBATE</span>
                  </div>
                </div>

                <!-- Card Titles Info -->
                <div class="compcon-card-info">
                  <div class="compcon-card-titles">
                    <span class="compcon-m-fullname">{{ getManufacturerShort(frame) }}</span>
                    <h3 class="compcon-frame-title">{{ formatFrameName(frame.name) || 'UNKNOWN' }}</h3>
                    <span class="compcon-frame-role">{{ getFrameRole(frame) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="compcon-empty-state">
          <span class="material-symbols-outlined icon">search_off</span>
          <h3>NENHUM CHASSI ENCONTRADO NO BANCO SRD</h3>
          <p>Tente ajustar o filtro por montadora ou termo de busca.</p>
          <button class="btn-compcon-red" @click="resetFilters">REDEFINIR FILTROS</button>
        </div>
      </div>
    </main>

    <!-- COMP/CON SRD Right-Side Detail Inspection Drawer -->
    <transition name="drawer-slide">
      <div v-if="drawerOpen && selectedFrame" class="compcon-detail-drawer tech-scroll" :class="getManufacturerClass(selectedFrame)">
        <!-- Lateral Tab Close Button '>' on Side Edge -->
        <button class="drawer-side-tab-btn" @click="drawerOpen = false" title="Fechar Dossiê">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>

        <!-- Drawer Top Navigation Header -->
        <div class="drawer-header">
          <div class="d-titles">
            <span class="d-m-code">{{ getManufacturer(selectedFrame) }} // SRD COMPÊNDIO</span>
            <h1 class="d-frame-name">{{ formatFrameName(selectedFrame.name) || '' }}</h1>
            <span class="d-frame-role">{{ getFrameRole(selectedFrame) }} // Tamanho {{ selectedFrame.stats?.size || 1 }}</span>
          </div>
          <button class="drawer-close-btn" @click="drawerOpen = false" title="Fechar Dossiê">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Drawer Body Scrollable Content -->
        <div class="drawer-body">
          <div class="drawer-body-actions">
            <button class="drawer-body-close-btn" @click="drawerOpen = false" title="Fechar Dossiê">
              <span class="material-symbols-outlined">close</span>
              <span>FECHAR DOSSIÊ</span>
            </button>
          </div>
          <!-- Frame Artwork Header -->
           <div class="grid-header">
            <div class="drawer-artwork-box">
            <img :src="getFrameImage(selectedFrame)" class="drawer-img" @error="handleImageError" />
            <div class="scan-overlay"></div>
          </div>
           <!-- Combat Profile (Stats List) -->
          <div class="compcon-section-box">
            <div class="c-sec-header"><i class="mdi mdi-chart-timeline-variant"></i> PERFIL DE COMBATE (ESTATÍSTICAS BASE)</div>
            <div class="compcon-stats-grid">
              <div class="stat-box red"><span class="lbl">Estrutura</span><span class="val">4</span></div>
              <div class="stat-box red"><span class="lbl">PV</span><span class="val">{{ selectedFrame.stats?.hp }}</span></div>
              <div class="stat-box red"><span class="lbl">Armadura</span><span class="val">{{ selectedFrame.stats?.armor }}</span></div>
              <div class="stat-box red"><span class="lbl">Estresse</span><span class="val">4</span></div>

              <div class="stat-box red"><span class="lbl">CAP. Reparo</span><span class="val">{{ selectedFrame.stats?.repcap }}</span></div>
              <div class="stat-box green"><span class="lbl">Velocidade</span><span class="val">{{ selectedFrame.stats?.speed }}</span></div>
              <div class="stat-box green"><span class="lbl">Evasão</span><span class="val">{{ selectedFrame.stats?.evasion }}</span></div>
              <div class="stat-box green"><span class="lbl">Sensores</span><span class="val">{{ selectedFrame.stats?.sensor_range }}</span></div>

              <div class="stat-box blue"><span class="lbl">ATAQUE TEC.</span><span class="val">{{ (selectedFrame.stats?.tech_attack >= 0 ? '+' : '') + selectedFrame.stats?.tech_attack }}</span></div>
              <div class="stat-box blue"><span class="lbl">Defesa-E</span><span class="val">{{ selectedFrame.stats?.edef }}</span></div>
              <div class="stat-box blue"><span class="lbl">SALVAMENTO</span><span class="val">{{ selectedFrame.stats?.save }}</span></div>
              <div class="stat-box yellow"><span class="lbl">CAP. DE <b>Calor</b>  </span><span class="val">{{ selectedFrame.stats?.heatcap }}</span></div>

              <div class="stat-box yellow"><span class="lbl">PONTOS SISTEMA (SP)</span><span class="val">{{ selectedFrame.stats?.sp }}</span></div>
              <div class="stat-box neutral"><span class="lbl">Tamanho</span><span class="val">{{ selectedFrame.stats?.size }}</span></div>
            </div>
          </div>

           </div>
          
          <!-- Description / Lore Block -->
          <div v-if="selectedFrame.description" class="compcon-section-box lore">
            <div class="c-sec-header"><i class="mdi mdi-book-open-page-variant"></i> VISÃO GERAL & LORE</div>
            <div class="c-sec-content lore-text" v-html="selectedFrame.description"></div>
          </div>


          <!-- Onboard Core System -->
          <div v-if="selectedFrame.core_system" class="compcon-section-box core-highlight">
            <div class="c-sec-header core-title">
              <i class="mdi mdi-atom"></i> SISTEMA DE Núcleo: {{ selectedFrame.core_system.name }}
            </div>
            <div class="c-sec-content core-desc-body">
              <!-- Lore/Overview -->
              <div class="core-lore-box" v-if="selectedFrame.core_system.description">
                <i class="mdi mdi-information-outline"></i>
                <div class="core-lore-text" v-html="selectedFrame.core_system.description"></div>
              </div>

              <!-- Passive Core Effect -->
              <div class="core-effect-card passive" v-if="selectedFrame.core_system.passive_effect || selectedFrame.core_system.passive_name || selectedFrame.core_system.passive_description">
                <div class="core-card-header">
                  <span class="core-tag-badge passive"><i class="mdi mdi-shield-check"></i> EFEITO PASSIVO CORE</span>
                  <span class="core-title-text">{{ selectedFrame.core_system.passive_name || 'TRAÇO PASSIVO EMBARCADO' }}</span>
                </div>
                <div class="core-card-body" v-html="selectedFrame.core_system.passive_effect || selectedFrame.core_system.passive_description"></div>
              </div>

              <!-- Active Core Power Effect -->
              <div class="core-effect-card active" v-if="selectedFrame.core_system.active_name || selectedFrame.core_system.active_effect || selectedFrame.core_system.effect">
                <div class="core-card-header">
                  <span class="core-tag-badge active"><i class="mdi mdi-lightning-bolt"></i> POTÊNCIA CORE (ATIVAÇÃO)</span>
                  <span class="core-title-text">{{ selectedFrame.core_system.active_name || selectedFrame.core_system.name }}</span>
                  <span class="core-act-type" v-if="selectedFrame.core_system.activation || selectedFrame.core_system.use || selectedFrame.core_system.frequency">
                    <i class="mdi mdi-clock-fast"></i> {{ formatActivation(selectedFrame.core_system.activation) }} // {{ formatFrequency(selectedFrame.core_system.use || selectedFrame.core_system.frequency) }}
                  </span>
                </div>
                <div class="core-card-body" v-html="selectedFrame.core_system.active_effect || selectedFrame.core_system.effect"></div>

                <!-- Sub-actions / integrated weapons -->
                <div v-if="selectedFrame.core_system.active_actions && selectedFrame.core_system.active_actions.length" class="core-actions-list">
                  <div v-for="(act, aIdx) in selectedFrame.core_system.active_actions" :key="aIdx" class="core-action-subcard">
                    <div class="act-name"><i class="mdi mdi-ray-start-arrow"></i> {{ act.name }}</div>
                    <div class="act-detail" v-html="act.detail || act.description"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Frame Traits -->
          <div v-if="selectedFrame.traits && selectedFrame.traits.length" class="compcon-section-box">
            <div class="c-sec-header"><i class="mdi mdi-star"></i> TRAÇOS DO CHASSI</div>
            <div class="traits-compcon-list">
              <div v-for="trait in selectedFrame.traits" :key="trait.name" class="trait-compcon-card">
                <div class="trait-title-bar">
                  <i class="mdi mdi-chevron-right"></i> {{ trait.name }}
                </div>
                <div class="trait-desc-body" v-html="trait.description"></div>
              </div>
            </div>
          </div>

          <!-- Weapon Mounts Structure -->
          <div class="compcon-section-box">
            <div class="c-sec-header"><i class="mdi mdi-shield-outline"></i> ENCAIXES DE ARMAS</div>
            <div class="mounts-compcon-list">
              <div v-for="(mount, idx) in (selectedFrame.mounts || [])" :key="idx" class="mount-compcon-item">
                <span class="m-idx">{{ $t(`mech.mountTypes.${mount.toLowerCase()}`) || mount }}</span>
              </div>
            </div>
          </div>

          <!-- License Progression / Unlocks Section -->
          <div class="compcon-section-box license-section">
            <div class="c-sec-header"><i class="mdi mdi-certificate-outline"></i> PROGRESSÃO E DESBLOQUEIOS DE LICENÇA</div>
            <div class="license-levels-list">
              <div v-for="lic in getFrameLicenseLevels(selectedFrame)" :key="lic.level" class="license-level-card">
                <div class="lic-header">
                  <span class="lic-badge">RANK {{ lic.level }}</span>
                  <span class="lic-title">{{ lic.label }}</span>
                </div>
                <div class="lic-items-grid">
                  <div v-for="(item, iIdx) in lic.items" :key="iIdx" class="lic-item-entry">
                    <div class="lic-item-main">
                      <span class="lic-item-name"><i class="mdi mdi-check-decagram"></i> {{ item.name }}</span>
                      <span class="lic-item-type">{{ item.type }}</span>
                    </div>

                    <!-- Rules Effect -->
                    <div class="lic-item-effect" v-if="item.effect" v-html="item.effect"></div>

                    <!-- Description / Lore -->
                    <div class="lic-item-desc" v-if="item.description" v-html="item.description"></div>

                    <!-- Telemetry pills for damage / range -->
                    <div class="w-telemetry-row" v-if="(item.range && item.range.length) || (item.damage && item.damage.length)">
                      <span v-for="(r, rIdx) in (item.range || [])" :key="'r-'+rIdx" class="w-pill range">
                        <i class="mdi mdi-target"></i> {{ formatRange(r) }}
                      </span>
                      <span v-for="(d, dIdx) in (item.damage || [])" :key="'d-'+dIdx" class="w-pill dmg">
                        <i class="mdi mdi-flash"></i> {{ formatDamage(d) }}
                      </span>
                    </div>

                    <!-- Interactive Tag Tooltips -->
                    <div class="w-tags-row" v-if="item.tags && item.tags.length">
                      <div v-for="(tag, tIdx) in item.tags" :key="tIdx" class="tag-tooltip-wrapper">
                        <span class="tag-badge">{{ getTagInfo(tag).name }}</span>
                        <div class="tag-tooltip-box" v-if="getTagInfo(tag).description">
                          <div class="tooltip-header">{{ getTagInfo(tag).name }}</div>
                          <div class="tooltip-text" v-html="getTagInfo(tag).description"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import * as lancerData from "lancer-data-pt-br";
import * as ktbData from "lancer-ktb-data";
import * as nrfawData from "lancer-nrfaw-data";
import * as longrimData from "lancer-longrim-data";
import { getFrameImage as resolveFrameImage } from "@/utils/frameImages";

export default {
  name: "HangarView",
  data() {
    return {
      searchQuery: "",
      selectedManufacturer: "ALL",
      drawerOpen: false,
      selectedFrame: null,
      expandedGroups: {
        GMS: true,
        IPSN: true,
        SSC: true,
        HORUS: true,
        HA: true,
        OUTRAS: true
      },
      manufacturers: [
        { id: "ALL", code: "ALL", label: "TODOS Chassis" },
        { id: "GMS", code: "GMS", label: "GMS" },
        { id: "IPS-N", code: "IPS-N", label: "IPS-NORTHSTAR" },
        { id: "SMITH-SHIMANO", code: "SSC", label: "SMITH-SHIMANO" },
        { id: "HORUS", code: "HORUS", label: "HORUS" },
        { id: "HA", code: "HA", label: "HARRISON ARMORY" }
      ]
    };
  },
  computed: {
    allFrames() {
      const getFrames = (pkg) => {
        if (!pkg) return [];
        return pkg.frames || (pkg.default && pkg.default.frames) || [];
      };

      const map = new Map();
      const rawList = [
        ...getFrames(lancerData),
        ...getFrames(ktbData),
        ...getFrames(nrfawData),
        ...getFrames(longrimData)
      ];

      rawList.forEach(f => {
        if (f && f.id && !map.has(f.id)) {
          map.set(f.id, f);
        }
      });

      return Array.from(map.values());
    },
    filteredFrames() {
      return this.allFrames.filter(frame => {
        const m = this.getManufacturerId(frame);
        if (this.selectedManufacturer !== "ALL" && m !== this.selectedManufacturer) {
          return false;
        }

        if (this.searchQuery.trim()) {
          const q = this.searchQuery.toLowerCase();
          const nameMatch = frame.name && frame.name.toLowerCase().includes(q);
          const roleMatch = this.getFrameRole(frame).toLowerCase().includes(q);
          const coreMatch = frame.core_system && frame.core_system.name && frame.core_system.name.toLowerCase().includes(q);
          const mMatch = this.getManufacturer(frame).toLowerCase().includes(q);
          return nameMatch || roleMatch || coreMatch || mMatch;
        }

        return true;
      });
    },
    manufacturerGroups() {
      const groups = [
        { id: "GMS", name: "GENERAL MILITARY SERVICES", frames: [] },
        { id: "IPSN", name: "IPS-NORTHSTAR", frames: [] },
        { id: "SSC", name: "SMITH-SHIMANO CORPRO", frames: [] },
        { id: "HORUS", name: "HORUS COLLECTIVE", frames: [] },
        { id: "HA", name: "HARRISON ARMORY", frames: [] }
      ];

      this.allFrames.forEach(frame => {
        const mId = this.getManufacturerId(frame);
        if (mId === "GMS") groups[0].frames.push(frame);
        else if (mId === "IPS-N") groups[1].frames.push(frame);
        else if (mId === "SMITH-SHIMANO") groups[2].frames.push(frame);
        else if (mId === "HORUS") groups[3].frames.push(frame);
        else if (mId === "HA") groups[4].frames.push(frame);
      });

      return groups;
    }
  },
  methods: {
    formatActivation(act) {
      if (!act) return 'PROTOCOLO';
      let translated = act;
      const map = {
        'quick tech': 'Tech Rápida',
        'full tech': 'Tech Completa',
        'quick': 'Rápida',
        'full': 'Completa',
        'protocol': 'Protocolo',
        'reaction': '<b>reação</b>',
        'free': '<b>Ação Livre</b>',
        'passive': 'Passiva',
        'invade': 'Invasão',
        'other': 'Outra'
      };
      Object.keys(map).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        translated = translated.replace(regex, map[key]);
      });
      return translated.toUpperCase();
    },
    formatFrequency(freq) {
      if (!freq) return '1/CENA';
      let translated = freq;
      const map = {
        'encounter': '1/Cena',
        '1/scene': '1/Cena',
        '1/round': '1/Rodada',
        '1/turn': '1/Turno',
        '1/mission': '1/Missão',
        'mission': '1/Missão',
        'scene': 'Cena'
      };
      Object.keys(map).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        translated = translated.replace(regex, map[key]);
      });
      return translated.toUpperCase();
    },
    getManufacturerId(frame) {
      const m = frame.source || frame.manufacturer || frame.source_publisher || 'GMS';
      const upper = m.toUpperCase();
      if (upper.includes('GMS') || upper.includes('GENERAL MILITARY')) return 'GMS';
      if (upper.includes('IPS') || upper.includes('NORTHSTAR')) return 'IPS-N';
      if (upper.includes('SMITH') || upper.includes('SHIMANO') || upper.includes('SSC')) return 'SMITH-SHIMANO';
      if (upper.includes('HORUS')) return 'HORUS';
      if (upper.includes('HARRISON') || upper.includes('HA')) return 'HA';
      return 'GMS';
    },
    getManufacturerCode(frame) {
      const id = this.getManufacturerId(frame);
      if (id === 'IPS-N') return 'IPS-N';
      if (id === 'SMITH-SHIMANO') return 'SSC';
      if (id === 'HORUS') return 'HORUS';
      if (id === 'HA') return 'HA';
      return 'GMS';
    },
    getManufacturerShort(frame) {
      const id = this.getManufacturerId(frame);
      if (id === 'IPS-N') return 'IPS-NORTHSTAR';
      if (id === 'SMITH-SHIMANO') return 'SMITH-SHIMANO';
      if (id === 'HORUS') return 'HORUS';
      if (id === 'HA') return 'HARRISON ARMORY';
      return 'GMS';
    },
    getManufacturer(frame) {
      const id = this.getManufacturerId(frame);
      if (id === 'IPS-N') return 'IPS-NORTHSTAR';
      if (id === 'SMITH-SHIMANO') return 'SMITH-SHIMANO CORPRO';
      if (id === 'HORUS') return 'HORUS COLLECTIVE';
      if (id === 'HA') return 'HARRISON ARMORY';
      return 'GENERAL MILITARY SERVICES (GMS)';
    },
    getManufacturerClass(frame) {
      const id = this.getManufacturerId(frame);
      return id.toLowerCase().replace('smith-shimano', 'ssc').replace('ips-n', 'ipsn');
    },
    getManufacturerCount(mId) {
      if (mId === 'ALL') return this.allFrames.length;
      return this.allFrames.filter(f => this.getManufacturerId(f) === mId).length;
    },
    getFrameRole(frame) {
      if (frame.role) return frame.role.toUpperCase();
      const map = { 'Striker': 'ATACANTE', 'Defender': 'DEFENSOR', 'Support': 'SUPORTE', 'Artillery': 'ARTILHARIA', 'Controller': 'CONTROLE' };
      if (frame.mechtype && frame.mechtype.length) {
        return frame.mechtype.map(t => map[t] || t.toUpperCase()).join(' // ');
      }
      return 'CHASSI DE COMBATE';
    },
    getShortRole(frame) {
      const role = this.getFrameRole(frame);
      return role.split('//')[0].trim();
    },
    formatFrameName(name) {
      if (!name) return '';
      const map = {
        'EVERESTE': 'Evereste',
        'EVEREST': 'Evereste',
        'SAGARMATHA': 'Sagarmátha',
        'BLACKBEARD': 'Barba Negra',
        'BARBA NEGRA': 'Barba Negra',
        'DRAKE': 'Drake',
        'NELSON': 'Nelson',
        'RALEIGH': 'Raleigh',
        'KIDD': 'Kidd',
        'TORTUGA': 'Tortuga',
        'VLAD': 'Vlad',
        'CALIBAN': 'Caliban',
        'CALIBÃ': 'Calibã',
        'ZHENG': 'Zheng',
        'BLACK WITCH': 'Bruxa Negra',
        'BRUXA NEGRA': 'Bruxa Negra',
        'DEATHS HEAD': 'Cabeça da Morte',
        "DEATH'S HEAD": 'Cabeça da Morte',
        'CABEÇA DA MORTE': 'Cabeça da Morte',
        'DUSK WING': 'Asa Crepuscular',
        'ASA CREPUSCULAR': 'Asa Crepuscular',
        'METALMARK': 'Marco Metálico',
        'MARCO METÁLICO': 'Marco Metálico',
        'MOURNING CLOAK': 'Manto do Luto',
        'MANTO DO LUTO': 'Manto do Luto',
        'SWALLOWTAIL': 'Papilionídeo',
        'PAPILIONÍDEO': 'Papilionídeo',
        'SWALLOWTAIL (RANGER VARIANT)': 'Papilionídeo (Variante)',
        'GORGON': 'Górgona',
        'GÓRGONA': 'Górgona',
        'HYDRA': 'Hidra',
        'HIDRA': 'Hidra',
        'MANTICORE': 'Mantícora',
        'MANTÍCORA': 'Mantícora',
        'MINOTAUR': 'Minotauro',
        'MINOTAURO': 'Minotauro',
        'MONARCH': 'Monarca',
        'MONARCA': 'Monarca',
        'PEGASUS': 'Pégaso',
        'PÉGASO': 'Pégaso',
        'NAPOLEON': 'Napoleão',
        'NAPOLEAO': 'Napoleão',
        'GENGHIS': 'Gengis',
        'GENGIS': 'Gengis',
        'ATLAS': 'Atlas',
        'WHITE WITCH': 'Bruxa Branca',
        'BRUXA BRANCA': 'Bruxa Branca',
        'EMPEROR': 'Imperador',
        'ORCHIS': 'Orchis',
        'LANCASTER': 'Lancaster',
        'BALOR': 'Balor',
        'GOBLIN': 'Goblin',
        'BARBAROSSA': 'Barbarossa',
        'ISKANDER': 'Iskander',
        'SALADINO': 'Saladino',
        'SHERMAN': 'Sherman',
        'TOKUGAWA': 'Tokugawa',
        'KOBOLD': 'Kobold',
        'LICH': 'Lich',
        'SUNZI': 'Sunzi',
        'NAPOLEON': 'Napoleão',
        'NAPOLEÃO': 'Napoleão',
        'CALENDULA': 'Calêndula',
        'ENKIDU': 'Enkidu',
        '“WORLDKILLER” GENGHIS MK I': 'Gengis MK I “Matador de Mundos”',
      };
      return map[name.toUpperCase()] || name.toUpperCase();
    },
    getFrameImage(frame) {
      return resolveFrameImage(frame);
    },
    handleImageError(e) {
      e.target.src = 'https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/assets/icons/mech.png';
    },
    openFrameDetail(frame) {
      this.selectedFrame = frame;
      this.drawerOpen = true;
    },
    toggleGroup(groupId) {
      this.expandedGroups[groupId] = !this.expandedGroups[groupId];
    },
    getFrameLicenseLevels(frame) {
      if (!frame) return [];
      const fName = (frame.name || '').toLowerCase();
      const fId = (frame.id || '').toLowerCase();

      const getWeapons = (pkg) => (pkg.weapons || (pkg.default && pkg.default.weapons) || []);
      const getSystems = (pkg) => (pkg.systems || (pkg.default && pkg.default.systems) || []);
      const getMods = (pkg) => (pkg.mods || (pkg.default && pkg.default.mods) || []);

      const allGear = [
        ...getWeapons(lancerData), ...getWeapons(ktbData), ...getWeapons(nrfawData), ...getWeapons(longrimData),
        ...getSystems(lancerData), ...getSystems(ktbData), ...getSystems(nrfawData), ...getSystems(longrimData),
        ...getMods(lancerData), ...getMods(ktbData), ...getMods(nrfawData), ...getMods(longrimData)
      ];

      const licenseAliases = {
        'everest': ['everest', 'sagarmatha'],
        'evereste': ['everest', 'sagarmatha'],
        'sagarmatha': ['everest', 'sagarmatha'],
        'barba negra': ['blackbeard'],
        'blackbeard': ['barba negra'],
        'bruxa negra': ['black witch'],
        'black witch': ['bruxa negra'],
        'cabeça da morte': ["death's head", 'deaths head'],
        "death's head": ['cabeça da morte', 'deaths head'],
        'asa crepuscular': ['dusk wing'],
        'dusk wing': ['asa crepuscular'],
        'marco metálico': ['metalmark'],
        'metalmark': ['marco metálico'],
        'manto do luto': ['mourning cloak'],
        'mourning cloak': ['manto do luto'],
        'papilionídeo': ['swallowtail'],
        'swallowtail': ['papilionídeo'],
        'górgona': ['gorgon'],
        'gorgon': ['górgona'],
        'mantícora': ['manticore'],
        'manticore': ['mantícora'],
        'minotauro': ['minotaur'],
        'minotaur': ['minotauro'],
        'monarca': ['monarch'],
        'monarch': ['monarca'],
        'pégaso': ['pegasus'],
        'pegasus': ['pégaso'],
        'napoleão': ['napoleon'],
        'napoleao': ['napoleon'],
        'napoleon': ['napoleão', 'napoleao'],
        'gengis': ['genghis'],
        'genghis': ['gengis'],
        'caliba': ['caliban'],
        'caliban': ['caliba', 'calibã'],
        'calibã': ['caliban', 'caliba']
      };
      const matching = allGear.filter(g => {
        if (!g.license) return false;
        const lic = g.license.toLowerCase();
        if (lic === fName || lic === fId || fName.includes(lic) || fId.includes(lic)) return true;
        const aliases = licenseAliases[fName] || [];
        return aliases.some(a => lic.includes(a) || a.includes(lic));
      });

      const levels = [
        { level: 1, label: "LICENÇA NÍVEL I", items: [] },
        { 
          level: 2, 
          label: "LICENÇA NÍVEL II (DESBLOQUEIO DE CHASSI)", 
          items: [{ 
            name: `CHASSI: ${frame.name.toUpperCase()}`, 
            type: "Chassi Mecha", 
            description: `Desbloqueia a licença oficial do chassi ${frame.name.toUpperCase()} para fabricação e implantação.` 
          }] 
        },
        { level: 3, label: "LICENÇA NÍVEL III", items: [] }
      ];

      matching.forEach(item => {
        const lvl = item.license_level || 1;
        const target = levels.find(l => l.level === lvl);
        if (target) {
          let effectText = item.effect || '';
          if (!effectText) {
            const parts = [];
            if (item.on_attack) parts.push(`No Ataque: ${item.on_attack}`);
            if (item.on_hit) parts.push(`No Acerto: ${item.on_hit}`);
            if (item.on_crit) parts.push(`No Crítico: ${item.on_crit}`);
            if (item.actions && item.actions.length) {
              item.actions.forEach(act => {
                const actName = act.name || 'Ação';
                const actVal = act.activation ? ` [${this.formatActivation(act.activation)}]` : '';
                const actDetail = act.detail || act.description || '';
                parts.push(`${actName}${actVal}: ${actDetail}`);
              });
            }
            if (item.deployables && item.deployables.length) {
              item.deployables.forEach(dep => {
                const depName = dep.name || 'Posicionável';
                const depType = dep.type ? ` (${this.$t(`mech.systemTypes.${dep.type.toLowerCase()}`) || dep.type})` : '';
                const depDetail = dep.detail || '';
                parts.push(`${depName}${depType}: ${depDetail}`);
              });
            }
            effectText = parts.join('<br>');
          }

          target.items.push({
            id: item.id,
            name: item.name,
            type: item.mount ? `Arma (${(this.$t(`mech.mountTypes.${item.mount.toLowerCase()}`) || item.mount).toUpperCase()})` : (item.sp !== undefined ? `Sistema (${item.sp} SP)` : 'Equipamento'),
            sp: item.sp,
            description: item.description || '',
            effect: effectText,
            tags: item.tags || [],
            range: item.range || [],
            damage: item.damage || []
          });
        }
      });

      return levels;
    },
    getTagInfo(tag) {
      const tagObj = typeof tag === 'object' ? tag : { id: tag };
      const tagId = tagObj.id || tagObj.name || String(tag);
      const tagVal = tagObj.val !== undefined && tagObj.val !== null ? tagObj.val : null;

      const tagsList = lancerData.tags || (lancerData.default && lancerData.default.tags) || [];
      const found = tagsList.find(t => t.id === tagId || t.name === tagId);

      let name = found ? (found.name || tagId) : String(tagId).replace('tg_', '').replace(/_/g, ' ').toUpperCase();
      let description = found ? (found.description || found.effect || '') : '';

      if (tagVal !== null) {
        if (/\{val\}/i.test(name)) {
          name = name.replace(/\{val\}/gi, tagVal);
        } else if (!name.includes(String(tagVal))) {
          name = `${name} ${tagVal}`;
        }
      }
      name = name.replace(/\{val\}/gi, '').replace(/:\s*$/g, '').trim();

      if (description && tagVal !== null) {
        description = description.replace(/\{val\}/gi, tagVal);
      } else if (description) {
        description = description.replace(/\{val\}/gi, '');
      }

      return { name, description };
    },
    formatDamage(d) {
      if (!d) return '';
      if (typeof d === 'string') {
        return d
          .replace(/Kinetic/gi, 'Cinético')
          .replace(/Energy/gi, '<b>Energia</b>')
          .replace(/Explosive/gi, 'Explosivo')
          .replace(/Heat/gi, 'Calor')
          .replace(/Burn/gi, 'Queimadura');
      }
      const val = d.val || '';
      const typeStr = d.type || d.damage_type || '';
      let typeLabel = typeStr;
      const lower = typeStr.toLowerCase();
      if (lower.includes('kinetic') || lower.includes('Cinético') || lower.includes('cinetico')) typeLabel = 'Cinético';
      else if (lower.includes('energy') || lower.includes('<b>Energia</b>')) typeLabel = '<b>Energia</b>';
      else if (lower.includes('explosive') || lower.includes('explosivo')) typeLabel = 'Explosivo';
      else if (lower.includes('heat') || lower.includes('Calor')) typeLabel = 'Calor';
      else if (lower.includes('burn') || lower.includes('Queimadura')) typeLabel = 'Queimadura';
      
      return `${val} ${typeLabel}`.trim();
    },
    formatRange(r) {
      if (!r) return '';
      if (typeof r === 'string') {
        return r
          .replace(/Range/gi, 'Alcance')
          .replace(/Threat/gi, 'Ameaça')
          .replace(/Line/gi, 'Linha')
          .replace(/Cone/gi, 'Cone')
          .replace(/Blast/gi, 'Explosão')
          .replace(/Burst/gi, 'Emanação');
      }
      const val = r.val !== undefined ? r.val : '';
      const typeStr = r.type || '';
      let typeLabel = typeStr;
      const lower = typeStr.toLowerCase();
      if (lower.includes('range') || lower.includes('Alcance')) typeLabel = 'Alcance';
      else if (lower.includes('threat') || lower.includes('Ameaça') || lower.includes('ameaca')) typeLabel = 'Ameaça';
      else if (lower.includes('line') || lower.includes('Linha')) typeLabel = 'Linha';
      else if (lower.includes('Cone')) typeLabel = 'Cone';
      else if (lower.includes('blast') || lower.includes('Explosão') || lower.includes('explosao')) typeLabel = 'Explosão';
      else if (lower.includes('burst') || lower.includes('Emanação') || lower.includes('emanacao')) typeLabel = 'Emanação';

      return `${typeLabel} ${val}`.trim();
    },
    resetFilters() {
      this.searchQuery = "";
      this.selectedManufacturer = "ALL";
    }
  }
};
</script>

<style scoped>
.compcon-hangar-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 95px);
  max-height: calc(100vh - 95px);
  overflow: hidden;
  background: #06090e;
  position: relative;
}

/* Left Sidebar Index & Filters */
.compcon-sidebar {
  width: 310px;
  min-width: 310px;
  background: rgba(12, 16, 24, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  padding: 18px 16px;
  overflow-y: auto;
  box-sizing: border-box;
}

.sidebar-header {
  margin-bottom: 16px;
}

.srd-badge {
  font-family: 'Inconsolata', monospace;
  font-size: 0.75rem;
  color: var(--union-crimson, #af0e1e);
  font-weight: bold;
  letter-spacing: 1.5px;
}

.sidebar-title {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 1.8rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
  margin: 2px 0 0 0;
  line-height: 1;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.search-icon {
  position: absolute;
  left: 10px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1.1rem;
}

.compcon-search-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 32px 8px 34px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-sizing: border-box;
}

.compcon-search-input:focus {
  outline: none;
  border-color: #00f0ff;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

.clear-search-btn {
  position: absolute;
  right: 6px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* Quick Manufacturer Filter Pills */
.m-filter-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}

.m-pill-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(20, 25, 35, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 3px solid #666;
  padding: 6px 10px;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.m-pill-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.m-pill-code {
  font-size: 0.7rem;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  font-weight: bold;
}

.m-pill-btn.active {
  color: #fff;
  border-color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.m-pill-btn.gms.active { border-left-color: #60a5fa; background: rgba(96, 165, 250, 0.15); }
.m-pill-btn.ips-n.active { border-left-color: #38bdf8; background: rgba(56, 189, 248, 0.15); }
.m-pill-btn.smith-shimano.active { border-left-color: #f87171; background: rgba(248, 113, 113, 0.15); }
.m-pill-btn.horus.active { border-left-color: #4ade80; background: rgba(74, 222, 128, 0.15); }
.m-pill-btn.ha.active { border-left-color: #c084fc; background: rgba(192, 132, 252, 0.15); }

/* Collapsible Manufacturer Tree */
.manufacturer-tree {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tree-group {
  border-left: 2px solid rgba(255, 255, 255, 0.15);
}

.tree-group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: #fff;
  transition: background 0.2s;
}

.tree-group-header:hover {
  background: rgba(255, 255, 255, 0.08);
}

.tree-arrow {
  font-size: 1.1rem;
  color: #00f0ff;
}

.group-count {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
}

.tree-frame-list {
  display: flex;
  flex-direction: column;
  padding-left: 12px;
}

.tree-frame-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.15s;
}

.tree-frame-item:hover {
  color: #00f0ff;
  background: rgba(0, 240, 255, 0.06);
}

.tree-frame-item.selected {
  color: #00f0ff;
  font-weight: bold;
  background: rgba(0, 240, 255, 0.12);
  border-left: 2px solid #00f0ff;
}

.frame-dot {
  width: 4px;
  height: 4px;
  background: #666;
  border-radius: 50%;
  margin-right: 6px;
}

.tree-frame-item.selected .frame-dot {
  background: #00f0ff;
  box-shadow: 0 0 6px #00f0ff;
}

.frame-item-role {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.4);
}

/* Main Content Area */
.compcon-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  overflow: hidden;
}

.compcon-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 20, 28, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 18px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.bar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inconsolata', monospace;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 8px #22c55e;
}

.bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.active-filter-tag {
  font-size: 0.75rem;
  color: #00f0ff;
  font-weight: bold;
  background: rgba(0, 240, 255, 0.1);
  padding: 3px 8px;
  border: 1px solid rgba(0, 240, 255, 0.3);
}

.reset-link-btn {
  background: transparent;
  border: none;
  color: var(--union-crimson, #af0e1e);
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
}

/* Grid Layout */
.compcon-grid-wrapper {
  overflow-y: auto;
  flex: 1;
  padding-right: 8px;
}

.compcon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 20px;
  padding-bottom: 40px;
}

/* COMP/CON Frame Card Design */
.compcon-frame-card {
  background: rgba(10, 14, 20, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top: 4px solid #666;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
  overflow: hidden;
}

.compcon-frame-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.85), 0 0 20px rgba(0, 240, 255, 0.25);
  border-color: #00f0ff;
}

.compcon-frame-card.gms { border-top-color: #60a5fa; }
.compcon-frame-card.ipsn { border-top-color: #38bdf8; }
.compcon-frame-card.ssc { border-top-color: #f87171; }
.compcon-frame-card.horus { border-top-color: #4ade80; }
.compcon-frame-card.ha { border-top-color: #c084fc; }

.card-m-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.compcon-m-badge {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  color: #00f0ff;
  letter-spacing: 1px;
}

.compcon-size-badge {
  font-family: 'Inconsolata', monospace;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
}

.compcon-card-artwork {
  background: #030508;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.compcon-artwork-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.15) brightness(0.88);
  transition: all 0.3s;
}

.compcon-frame-card:hover .compcon-artwork-img {
  filter: contrast(1.2) brightness(1);
}

.inspect-btn-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 240, 255, 0.85);
  color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 900;
  font-size: 0.85rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.compcon-frame-card:hover .inspect-btn-overlay {
  opacity: 1;
}

.compcon-card-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.compcon-m-fullname {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.compcon-frame-title {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 2.2rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
  margin: 0;
  line-height: 0.9;
}

.compcon-frame-role {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #00f0ff;
  margin-top: 4px;
}

.card-body-row {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.card-right-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

/* Quick Telemetry Strip (Vertical on Left Side) */
.compcon-telemetry-strip.vertical {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 54px;
  min-width: 54px;
  padding: 8px 4px;
  background: rgba(0, 0, 0, 0.65);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  gap: 4px;
  box-sizing: border-box;
}

.t-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 3px 0;
  border-left: 2px solid #666;
}

.t-lbl {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Rajdhani', sans-serif;
  font-weight: bold;
}

.t-val {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.t-pill.red { border-left-color: #ff5566; }
.t-pill.red .t-val { color: #ff5566; }

.t-pill.green { border-left-color: #22c55e; }
.t-pill.green .t-val { color: #22c55e; }

.t-pill.blue { border-left-color: #00f0ff; }
.t-pill.blue .t-val { color: #00f0ff; }

.t-pill.yellow { border-left-color: #f1a92a; }
.t-pill.yellow .t-val { color: #f1a92a; }

/* Empty State */
.compcon-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(10, 14, 20, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.compcon-empty-state .icon {
  font-size: 4rem;
  color: var(--union-crimson, #af0e1e);
  margin-bottom: 14px;
}

.btn-compcon-red {
  margin-top: 14px;
  padding: 8px 18px;
  background: var(--union-crimson, #af0e1e);
  color: #fff;
  border: none;
  font-family: 'Rajdhani', sans-serif;
  font-weight: bold;
  cursor: pointer;
}

/* COMP/CON SRD Right-Side Detail Inspection Drawer */
.compcon-detail-drawer {
  position: fixed;
  top: 0; right: 0; width: 90%; max-width: 90vw; height: 100vh;
  background: #090d14;
  border-left: 2px solid #00f0ff;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.95);
  z-index: 4000;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Lateral Floating Tab Close Button '>' on Side Edge of Drawer */
.drawer-side-tab-btn {
  position: fixed;
  left: 8%;
  top: 50vh;
  transform: translateY(-50%);
  width: 40px;
  height: 100px;
  background: #090d14;
  border: 2px solid #00f0ff;
  border-right: none;
  border-radius: 10px 0 0 10px;
  color: #00f0ff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 4010;
  box-shadow: -6px 0 25px rgba(0, 240, 255, 0.3);
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.drawer-side-tab-btn:hover {
  background: var(--union-crimson, #af0e1e);
  border-color: var(--union-crimson, #af0e1e);
  color: #ffffff;
  box-shadow: -6px 0 30px rgba(175, 14, 30, 0.7);
  transform: translateY(-50%) translateX(-4px);
}

.drawer-side-tab-btn .material-symbols-outlined {
  font-size: 34px;
  font-weight: bold;
}

.drawer-header {
  padding: 18px 24px;
  background: linear-gradient(90deg, #121722 0%, #090d14 100%);
  border-bottom: 2px solid #00f0ff;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
}
.grid-header
{
  display: grid;
  grid-template-columns: 450px 1fr;
  padding:20px ;
}
.d-m-code {
  font-family: 'Inconsolata', monospace;
  font-size: 0.75rem;
  color: #00f0ff;
  font-weight: bold;
  letter-spacing: 1.5px;
}

.d-frame-name {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 3px;
  margin: 2px 0 0 0;
  line-height: 0.9;
}

.d-frame-role {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
}

.drawer-close-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.drawer-close-btn:hover {
  background: #00f0ff;
  color: #000;
}

.drawer-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow-y: auto;
  flex: 1;
}

.drawer-body-actions {
  display: flex;
  justify-content: flex-start;
  margin-bottom: -10px;
}

.drawer-body-close-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(175, 14, 30, 0.2);
  border: 1px solid var(--union-crimson, #af0e1e);
  color: #ffffff;
  padding: 8px 16px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.drawer-body-close-btn:hover {
  background: var(--union-crimson, #af0e1e);
  box-shadow: 0 0 15px rgba(175, 14, 30, 0.5);
  transform: translateX(-2px);
}

.drawer-artwork-box {
  background: #030508;
  border: 1px solid rgba(0, 240, 255, 0.3);
  position: relative;
  overflow: hidden;
  width: 450px;
}

.drawer-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.compcon-section-box {
  background: rgba(16, 22, 32, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 14px;
}

.compcon-section-box.core-highlight {
  border-color: rgba(0, 240, 255, 0.4);
  background: rgba(0, 240, 255, 0.04);
}

.c-sec-header {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  color: #00f0ff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 6px;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.lore-text {
  font-family: 'Titillium Web', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #e5e7eb;
}

/* Stats List in Drawer */
.compcon-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 10px;
  border-left: 3px solid #666;
}

.stat-box .lbl {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Rajdhani', sans-serif;
  font-weight: bold;
}

.stat-box .val {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
}

.stat-box.red { border-left-color: #ff5566; }
.stat-box.red .val { color: #ff5566; }
.stat-box.green { border-left-color: #22c55e; }
.stat-box.green .val { color: #22c55e; }
.stat-box.blue { border-left-color: #00f0ff; }
.stat-box.blue .val { color: #00f0ff; }
.stat-box.yellow { border-left-color: #f1a92a; }
.stat-box.yellow .val { color: #f1a92a; }

/* Core System & Traits */
.core-active-badge {
  font-size: 0.8rem;
  color: #00f0ff;
  font-weight: bold;
  background: rgba(0, 240, 255, 0.1);
  padding: 4px 8px;
  margin-bottom: 8px;
  display: inline-block;
}

.core-text {
  font-family: 'Titillium Web', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #e5e7eb;
}

.traits-compcon-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trait-compcon-card {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 8px;
}

.trait-title-bar {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #00f0ff;
  display: flex;
  align-items: center;
}

.trait-desc-body {
  font-family: 'Titillium Web', sans-serif;
  font-size: 1.1rem;
  line-height: 1.5;
  color: #ddd;
  margin-top: 4px;
}

.mounts-compcon-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mount-compcon-item {
  display: flex;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.4);
  padding: 8px 12px;
  border-left: 3px solid #00f0ff;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
}

.m-name { color: #fff; }

/* License Progression Cards */
.license-levels-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.license-level-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 3px solid #00f0ff;
  padding: 10px 14px;
}

.lic-header {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 6px;
  margin-bottom: 8px;
}

.lic-badge {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  color: #000;
  background: #00f0ff;
  padding: 2px 6px;
  border-radius: 2px;
}

.lic-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  font-weight: bold;
  color: #fff;
  letter-spacing: 1px;
}

.lic-items-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lic-item-entry {
  background: rgba(255, 255, 255, 0.02);
  padding: 8px 10px;
  border-left: 2px solid rgba(0, 240, 255, 0.3);
}

.lic-item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lic-item-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
}

.lic-item-type {
  font-size: 1.2rem;
  color: #00f0ff;
  font-weight: 700;
  background: rgba(0, 240, 255, 0.1);
  padding: 2px 6px;
  border-radius: 2px;
}

.lic-item-desc {
  font-family: 'Titillium Web', sans-serif;
  font-size: 1.1rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.65);
  font-style: italic;
  margin-top: 4px;
}

.lic-item-effect {
  font-family: 'Titillium Web', sans-serif;
  font-size: 1.1rem;
  line-height: 1.5;
  color: #e2e8f0;
  margin-top: 6px;
  background: rgba(0, 0, 0, 0.25);
  padding: 8px 10px;
  border-left: 2px solid #00f0ff;
  border-radius: 2px;
}

/* Core System Detailed Styles */
.core-lore-box {
  display: flex;
  gap: 10px;
  background: rgba(0, 240, 255, 0.05);
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 10px 14px;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.45;
  font-style: italic;
}

.core-lore-box i {
  color: #00f0ff;
  font-size: 1.2rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.core-effect-card {
  background: rgba(12, 18, 28, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 14px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.core-effect-card.passive {
  border-left: 3px solid #22c55e;
}

.core-effect-card.active {
  border-left: 3px solid var(--union-crimson, #af0e1e);
  background: rgba(20, 12, 18, 0.85);
}

.core-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 6px;
}

.core-tag-badge {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 2px;
  letter-spacing: 1px;
}

.core-tag-badge.passive {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.4);
}

.core-tag-badge.active {
  background: rgba(175, 14, 30, 0.25);
  color: #ff5566;
  border: 1px solid rgba(175, 14, 30, 0.5);
}

.core-title-text {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1px;
}

.core-act-type {
  font-size: 1rem;
  color: #00f0ff;
  font-weight: bold;
  margin-left: auto;
  letter-spacing: 0.5px;
}

.core-card-body {
  font-family: 'Titillium Web', sans-serif;
  font-size: 1rem;
  line-height: 1.55;
  color: #f1f5f9;
}

.core-actions-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.core-action-subcard {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 12px;
  border-radius: 3px;
}

.core-action-subcard .act-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: bold;
  color: #00f0ff;
  margin-bottom: 4px;
}

.core-action-subcard .act-detail {
  font-size: 1rem;
  line-height: 1.4;
  color: #cbd5e1;
}

/* Telemetry Pills & Tag Tooltips */
.w-telemetry-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.w-pill {
  font-size: 1rem;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.w-pill.range {
  background: rgba(0, 240, 255, 0.15);
  color: #00f0ff;
  border: 1px solid rgba(0, 240, 255, 0.3);
}

.w-pill.dmg {
  background: rgba(255, 85, 102, 0.15);
  color: #ff5566;
  border: 1px solid rgba(255, 85, 102, 0.3);
}

.w-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.tag-tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tag-badge {
  font-size: 1rem;
  font-weight: 800;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  cursor: help;
  transition: all 0.2s ease;
  letter-spacing: 0.5px;
}

.tag-tooltip-wrapper:hover .tag-badge {
  background: rgba(0, 240, 255, 0.2);
  color: #00f0ff;
  border-color: #00f0ff;
}

.tag-tooltip-box {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  background: #0b111a;
  border: 1px solid #00f0ff;
  padding: 8px 10px;
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
  z-index: 100;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  pointer-events: none;
}

.tag-tooltip-wrapper:hover .tag-tooltip-box {
  visibility: visible;
  opacity: 1;
}

.tag-tooltip-box .tooltip-header {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.85rem;
  font-weight: 800;
  color: #00f0ff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 4px;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.tag-tooltip-box .tooltip-text {
  font-size: 0.78rem;
  color: #e2e8f0;
  line-height: 1.35;
}

.drawer-slide-enter-active, .drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.drawer-slide-enter-from, .drawer-slide-leave-to {
  transform: translateX(100%);
}

@media (max-width: 1050px) {
  .compcon-sidebar { width: 260px; min-width: 260px; }
  .compcon-detail-drawer { width: 100vw; }
}

@media (max-width: 768px) {
  .compcon-hangar-container { flex-direction: column; }
  .compcon-sidebar { width: 100%; min-width: 100%; max-height: 220px; }
}
</style>
