<template>
  <div class="pilot-detail-page-container">
    <!-- Action Bar / Back & View Switch Header -->
    <div class="page-top-bar">
      <router-link to="/pilots" class="back-btn">
        <span class="material-symbols-outlined">arrow_back</span>
        <span class="btn-text">ROSTER DE PILOTOS</span>
      </router-link>

      <!-- View Switcher Controls (Arrow Navigation) -->
      <div v-if="pilot" class="view-switch-nav">
        <button 
          class="arrow-btn" 
          @click="toggleTab"
          :title="activeTab === 'pilot' ? 'Ver Dossier do Mecha' : 'Ver Dossier do Piloto'"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </button>

        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'pilot' }" 
          @click="activeTab = 'pilot'"
        >
          <span class="material-symbols-outlined icon">person</span>
          DOSSIÊ PILOTO
        </button>

        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'mech' }" 
          @click="activeTab = 'mech'"
          :disabled="!activeMech"
        >
          <i class="mdi mdi-robot icon"></i>
          DOSSIÊ MECHA
        </button>

        <button 
          class="arrow-btn" 
          @click="toggleTab"
          :title="activeTab === 'pilot' ? 'Ver Dossier do Mecha' : 'Ver Dossier do Piloto'"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      <div class="page-title-badge">
        <span class="status-dot"></span>
        {{ activeTab === 'pilot' ? 'DOSSIÊ DE PILOTO OMNINET' : 'DOSSIÊ DE MECHA OMNINET' }}
      </div>
    </div>

    <!-- Main Content Container -->
    <div v-if="pilot" class="dossier-wrapper shadow-2">
      <!-- 1. PILOT DOSSIER VIEW -->
      <div v-show="activeTab === 'pilot'" class="military-dossier pilot-dossier">
        <!-- Dossier Top Header -->
        <div class="dossier-header">
          <div class="classification-stamp">TOP SECRET // EYES ONLY</div>
          <div class="header-main">
            <div class="pilot-id-block">
              <div class="protocol-id">NDL-C // IDENT-REC: {{ (pilot.id || 'N/A').substring(0, 8).toUpperCase() }}</div>
            </div>
            <div class="main-titles">
               <h1 class="callsign-display">{{ pilot.callsign || $t('pilot.callsign').toUpperCase() }}</h1>
               <h2 class="name-display">{{ pilot.name || '---' }}</h2>
            </div>
          </div>
          <div class="action-buttons">
             <div v-if="activeMech" class="dossier-action-btn mech" @click="activeTab = 'mech'" title="Ver Mecha em Detalhes">
                <i class="mdi mdi-robot"></i>
                <span>VER MECHA ➔</span>
             </div>
             <div v-if="pilot.isCustom" class="dossier-action-btn edit" @click="editPilot" :title="$t('general.edit')">
                <i class="mdi mdi-pencil"></i>
                <span>EDITAR</span>
             </div>
             <div v-if="pilot.isCustom" class="dossier-action-btn delete" @click="deletePilot" :title="$t('general.delete')">
                <i class="mdi mdi-delete"></i>
                <span>EXCLUIR</span>
             </div>
          </div>
        </div>

        <div class="dossier-body tech-scroll military-terminal">
          <!-- Attributes Grid (Horizontal Strip) -->
          <div class="military-stats-strip">
             <div class="m-stat-box" v-for="(stat, index) in [
               { label: $t('pilotCreator.fields.hull'), icon: '⬡' },
               { label: $t('pilotCreator.fields.agility'), icon: '◈' },
               { label: $t('pilotCreator.fields.systems'), icon: '⬢' },
               { label: $t('pilotCreator.fields.engineering'), icon: '⚙' }
             ]" :key="index">
                <div class="m-stat-label"><span class="stat-icon">{{ stat.icon }}</span> {{ stat.label }}</div>
                <div class="m-stat-value">+{{ (pilot.mech_skills || pilot.mechSkills || [0,0,0,0])[index] }}</div>
             </div>
             <div class="m-stat-box level-box">
                <div class="m-stat-label">{{ $t('pilotCreator.rank') }}</div>
                <div class="m-stat-value">NL {{ pilot.level || 0 }}</div>
             </div>
          </div>

          <div class="pilot-dossier-grid">
            <!-- Left Column: Portrait & Biometrics -->
            <div class="dossier-col left-col">
              <div class="portrait-section">
                <div class="portrait-frame" :class="{ clickable: pilot.isCustom }" @click="triggerPilotFileUpload">
                  <img v-if="pilot.image" :src="pilot.image" class="portrait-img" />
                  <div v-else class="no-signal">
                     <div class="glitch-text">DATA_REDACTED</div>
                     <div class="static-overlay"></div>
                  </div>
                  <div v-if="pilot.isCustom" class="upload-overlay">
                     <i class="mdi mdi-camera"></i>
                     <span>UPLOAD FOTO</span>
                  </div>
                  <div class="scan-line-anim"></div>
                </div>
                <input type="file" ref="pilotFileInput" style="display: none" @change="onPilotFileChange" accept="image/*" />
                <div class="portrait-metadata">
                  <div class="meta-row">
                    <span>STATUS PH/HR:</span>
                    <span class="status-active">VERIFICADO</span>
                  </div>
                  <div class="meta-row">
                    <span>HASH BIOMÉTRICO:</span>
                    <span class="hash-val">{{ biometricHash }}</span>
                  </div>
                </div>
              </div>

              <div v-if="activeMech" class="mecha-info-box dossier-sub-box clickable" @click="activeTab = 'mech'">
                 <div class="box-header">
                    MECHA ATIVO DESIGNADO
                    <span class="switch-hint">VER CHASSI ➔</span>
                 </div>
                 <div class="box-content">
                    <div class="m-name">{{ activeMech.name }}</div>
                    <div class="m-frame">{{ activeMech.manufacturer }} // {{ activeMech.frame_name }}</div>
                 </div>
              </div>

              <div class="biometrics-box dossier-sub-box">
                <div class="box-header">{{ $t('pilot.background').toUpperCase() }}</div>
                <div class="box-content background-text">{{ pilot.background || 'N/A' }}</div>
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
                  <div v-if="!pilot.skills || pilot.skills.length === 0" class="empty-list-msg">
                    NENHUMA PERÍCIA REGISTRADA
                  </div>
                </div>
              </div>

              <!-- Talent Audit Section (Grid of Interactive Buttons) -->
              <div class="audit-section dossier-sub-box">
                <div class="box-header">{{ $t('pilot.talentAudit') }}</div>
                <div class="talents-grid">
                   <button 
                      class="talent-btn-card" 
                      v-for="talent in pilot.talents" 
                      :key="talent.id"
                      @click="openTalentModal(talent)"
                      title="Clique para ver os detalhes do talento"
                   >
                      <div class="talent-btn-main">
                         <span class="t-name">{{ getTalentName(talent.id) }}</span>
                         <span class="info-icon material-symbols-outlined">info</span>
                      </div>
                      <div class="rank-indicator">
                         <span v-for="r in 3" :key="r" class="rank-pip" :class="{ active: r <= talent.rank }"></span>
                         <span class="rank-text">RANK {{ talent.rank }}</span>
                      </div>
                   </button>
                   <div v-if="!pilot.talents || pilot.talents.length === 0" class="empty-list-msg">
                     NENHUM TALENTO REGISTRADO
                   </div>
                </div>
              </div>

              <!-- Pilot Gear / Equipment Audit Section -->
              <div class="audit-section dossier-sub-box pilot-gear-dossier-box">
                <div class="box-header flex-header">
                  <span><i class="mdi mdi-shield-account"></i> {{ $t('pilotCreator.steps.pilotGear') || 'EQUIPAMENTOS DO PILOTO' }}</span>
                  <span class="sub-header-tag">CARGA TÁTICA // PILOTO</span>
                </div>
                <div class="pilot-gear-dossier-grid">
                  <!-- Armor Category -->
                  <div class="gear-category-block">
                    <div class="cat-title"><i class="mdi mdi-shield-half-full"></i> Armadura / TRAJE</div>
                    <div class="gear-items-list">
                      <div 
                        v-if="resolvedPilotLoadout.armor" 
                        class="pilot-gear-card armor-card clickable"
                        @click="openGearModal(resolvedPilotLoadout.armor)"
                        title="Clique para ver detalhes"
                      >
                        <div class="gear-card-header">
                          <span class="gear-name">{{ resolvedPilotLoadout.armor.name }}</span>
                          <span class="gear-type-badge">Armadura</span>
                        </div>
                        <div class="gear-card-body" v-if="resolvedPilotLoadout.armor.description">
                          <span class="gear-desc-terse">{{ formatGearDescription(resolvedPilotLoadout.armor.description) }}</span>
                        </div>
                        <div class="w-tags-row" v-if="resolvedPilotLoadout.armor.tags && resolvedPilotLoadout.armor.tags.length">
                          <div v-for="(tag, tIdx) in resolvedPilotLoadout.armor.tags" :key="tIdx" class="tag-tooltip-wrapper">
                            <span class="tag-badge">{{ getTagInfo(tag).name }}</span>
                            <div class="tag-tooltip-box" v-if="getTagInfo(tag).description">
                              <div class="tooltip-header">{{ getTagInfo(tag).name }}</div>
                              <div class="tooltip-text" v-html="getTagInfo(tag).description"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="empty-gear-slot">
                        <i class="mdi mdi-shield-off-outline"></i> NENHUMA Armadura EQUIPADA
                      </div>
                    </div>
                  </div>

                  <!-- Weapons Category -->
                  <div class="gear-category-block">
                    <div class="cat-title"><i class="mdi mdi-pistol"></i> ARMAS DO PILOTO</div>
                    <div class="gear-items-list">
                      <template v-if="resolvedPilotLoadout.weapons && resolvedPilotLoadout.weapons.length">
                        <div 
                          v-for="weapon in resolvedPilotLoadout.weapons" 
                          :key="weapon.id" 
                          class="pilot-gear-card weapon-card clickable"
                          @click="openGearModal(weapon)"
                          title="Clique para ver detalhes"
                        >
                          <div class="gear-card-header">
                            <span class="gear-name">{{ weapon.name }}</span>
                            <span class="gear-type-badge">ARMA</span>
                          </div>
                          <div class="w-telemetry-row" v-if="(weapon.range && weapon.range.length) || (weapon.damage && weapon.damage.length)">
                            <span v-for="(r, rIdx) in (weapon.range || [])" :key="'r-'+rIdx" class="w-pill range">
                              <i class="mdi mdi-target"></i> {{ formatRange(r) }}
                            </span>
                            <span v-for="(d, dIdx) in (weapon.damage || [])" :key="'d-'+dIdx" class="w-pill dmg">
                              <i class="mdi mdi-flash"></i> {{ formatDamage(d) }}
                            </span>
                          </div>
                          <div class="w-tags-row" v-if="weapon.tags && weapon.tags.length">
                            <div v-for="(tag, tIdx) in weapon.tags" :key="tIdx" class="tag-tooltip-wrapper">
                              <span class="tag-badge">{{ getTagInfo(tag).name }}</span>
                              <div class="tag-tooltip-box" v-if="getTagInfo(tag).description">
                                <div class="tooltip-header">{{ getTagInfo(tag).name }}</div>
                                <div class="tooltip-text" v-html="getTagInfo(tag).description"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                      <div v-else class="empty-gear-slot">
                        <i class="mdi mdi-crosshair-off"></i> NENHUMA ARMA EQUIPADA
                      </div>
                    </div>
                  </div>

                  <!-- Tactical Gear Category -->
                  <div class="gear-category-block">
                    <div class="cat-title"><i class="mdi mdi-toolbox"></i> EQUIPAMENTOS TÁTICOS</div>
                    <div class="gear-items-list">
                      <template v-if="resolvedPilotLoadout.gear && resolvedPilotLoadout.gear.length">
                        <div 
                          v-for="item in resolvedPilotLoadout.gear" 
                          :key="item.id" 
                          class="pilot-gear-card item-card clickable"
                          @click="openGearModal(item)"
                          title="Clique para ver detalhes"
                        >
                          <div class="gear-card-header">
                            <span class="gear-name">{{ item.name }}</span>
                            <span class="gear-type-badge">EQUIPAMENTO</span>
                          </div>
                          <div class="gear-card-body" v-if="item.description">
                            <span class="gear-desc-terse">{{ formatGearDescription(item.description) }}</span>
                          </div>
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
                      </template>
                      <div v-else class="empty-gear-slot">
                        <i class="mdi mdi-package-variant-closed-remove"></i> NENHUM EQUIPAMENTO EQUIPADO
                      </div>
                    </div>
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
                {{ legalDisclaimer }}
              </div>
            </div>
          </div>
        </div>

        <div class="dossier-footer">
          <div class="footer-left">OMNINET SECURE // UNION ADMINISTRATIVE BUREAU // IDENT-PROTOCOL RM-4</div>
          <div class="footer-right">{{ new Date().getFullYear() }} // CRADLE STANDARD TIME</div>
        </div>
      </div>

      <!-- 2. MECH DOSSIER VIEW (SIDE PAGE) -->
      <div v-show="activeTab === 'mech'" class="military-dossier mech-dossier">
        <!-- Mech Top Header -->
        <div class="dossier-header mech-header-bg">
          <div class="classification-stamp cyan">Chassis SPECIFICATIONS // CLASSIFIED</div>
          <div class="header-main">
            <div class="pilot-id-block">
              <div class="protocol-id cyan">
                NDL-M // REF-ID: {{ (activeMech?.id || 'DATA-DEF').substring(0, 8).toUpperCase() }} // {{ activeMech?.manufacturer || 'GMS' }} OPS
              </div>
            </div>
            <div class="main-titles">
               <h1 class="callsign-display cyan-glow">{{ (activeMech?.name || 'UNNAMED UNIT').toUpperCase() }}</h1>
               <h2 class="name-display cyan-sub">{{ activeMech?.manufacturer || 'GMS' }} // {{ activeMech?.frame_name || 'UNKNOWN FRAME' }}</h2>
            </div>
          </div>
          <div class="action-buttons">
             <div class="dossier-action-btn back-to-pilot" @click="activeTab = 'pilot'" title="Voltar ao Dossier do Piloto">
                <span class="material-symbols-outlined">arrow_back</span>
                <span>PILOTO</span>
             </div>
             <div v-if="pilot.isCustom" class="dossier-action-btn edit" @click="editPilot" :title="$t('general.edit')">
                <i class="mdi mdi-pencil"></i>
                <span>EDITAR MECHA</span>
             </div>
          </div>
        </div>

        <div v-if="activeMech" class="dossier-body tech-scroll military-terminal">
          <div class="mech-dossier-grid">
            <!-- Left Column: Visual & Core System & Traits -->
            <div class="dossier-col left-col">
              <div class="portrait-section dossier-sub-box">
                <div class="portrait-grid-2col">
                  <!-- Left Side: Portrait Frame & Metadata -->
                  <div class="portrait-left-col">
                    <div class="portrait-frame mech-frame-style" :class="{ clickable: pilot.isCustom }" @click="triggerMechFileUpload">
                      <img :src="mechImage" class="portrait-img" @error="handleMechImageError" />
                      <div v-if="pilot.isCustom" class="upload-overlay">
                         <i class="mdi mdi-camera"></i>
                         <span>UPLOAD ARTE</span>
                      </div>
                      <div class="scan-line-anim"></div>
                    </div>
                    <input type="file" ref="mechFileInput" style="display: none" @change="onMechFileChange" accept="image/*" />
                    <div class="portrait-metadata">
                      <div class="meta-row">
                        <span>SINC. NEURAL:</span>
                        <span class="status-active">100% LINKADO</span>
                      </div>
                      <div class="meta-row">
                        <span>REATOR:</span>
                        <span class="status-warning">ESTÁVEL</span>
                      </div>
                    </div>
                  </div>

                  <!-- Right Side: Detailed HASE Telemetry Grid & Pilot Telemetry Bar -->
                  <div class="portrait-right-col">
                    <!-- HASE Telemetry Grid with Pilot Attributes as Column 1 -->
                    <div class="detailed-stats-grid">
                       <!-- ROW 1: <b>Casco</b> & HULL STATS -->
                       <div class="stat-mini pilot-stat">
                          <span class="label"><b>Casco</b></span>
                          <span class="val">+{{ mechSkills[0] }}</span>
                       </div>
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

                       <!-- ROW 2: Agilidade & AGILITY STATS -->
                       <div class="stat-mini pilot-stat">
                          <span class="label">Agilidade</span>
                          <span class="val">+{{ mechSkills[1] }}</span>
                       </div>
                       <div class="stat-mini green">
                          <span class="label">{{ $t('mech.stats.speed') }}</span>
                          <span class="val">{{ stats.VEL }}</span>
                       </div>
                       <div class="stat-mini green">
                          <span class="label">{{ $t('mech.stats.evasion') }}</span>
                          <span class="val">{{ stats.EV }}</span>
                       </div>
                       <div class="stat-mini red">
                          <span class="label">{{ $t('mech.stats.repcap') }}</span>
                          <span class="val">{{ stats.CAP_R }}</span>
                       </div>

                       <!-- ROW 3: Sistemas & TECH STATS -->
                       <div class="stat-mini pilot-stat">
                          <span class="label">Sistemas</span>
                          <span class="val">+{{ mechSkills[2] }}</span>
                       </div>
                       <div class="stat-mini blue">
                          <span class="label">{{ $t('mech.stats.techAttack') }}</span>
                          <span class="val">{{ stats.ATK_T >= 0 ? '+' : '' }}{{ stats.ATK_T }}</span>
                       </div>
                       <div class="stat-mini blue">
                          <span class="label">{{ $t('mech.stats.edef') }}</span>
                          <span class="val">{{ stats.DEF_E }}</span>
                       </div>
                       <div class="stat-mini blue">
                          <span class="label">{{ $t('mech.stats.sensors') }}</span>
                          <span class="val">{{ stats.SEN }}</span>
                       </div>

                       <!-- ROW 4: ENGENHARIA & ENG STATS -->
                       <div class="stat-mini pilot-stat">
                          <span class="label">ENGENHARIA</span>
                          <span class="val">+{{ mechSkills[3] }}</span>
                       </div>
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
                    </div>

                    <!-- Pilot Telemetry Bar -->
                    <div class="pilot-telemetry-bar">
                       <div class="p-telemetry-item">
                          <span class="p-label">NÍVEL LICENÇA</span>
                          <span class="p-val">NL {{ pilot.level || 0 }}</span>
                       </div>
                       <div class="p-telemetry-item">
                          <span class="p-label">BÔNUS TALENTO (GRIT)</span>
                          <span class="p-val">+{{ grit }}</span>
                       </div>
                       <div class="p-telemetry-item">
                          <span class="p-label">PILOTO VINCULADO</span>
                          <span class="p-val highlight">{{ pilot.callsign || pilot.name }}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mounts / Weapons Section -->
              <div class="loadout-section dossier-sub-box">
                <div class="box-header cyan-header">
                  <i class="mdi mdi-shield-outline"></i> {{ $t('pilotCreator.mech.mounts').toUpperCase() }}
                </div>
                <div class="mounts-grid">
                  <div v-for="(mount, idx) in frameMounts" :key="idx" class="mount-card">
                    <div class="mount-header-sm">
                      <span class="mount-type">{{ $t(`mech.mountTypes.${mount.toLowerCase()}`) || mount }}</span>
                      <i class="mdi mdi-target-variant"></i>
                    </div>
                    <div class="mount-slots-list">
                      <div v-for="slot in [0, 1]" :key="slot" class="slot-entry">
                        <template v-if="getMechWeapon(idx, slot)">
                          <div class="weapon-info-card clickable" @click="openGearModal(getMechWeapon(idx, slot))" title="Clique para ver detalhes da arma">
                            <div class="w-header-row">
                              <span class="w-name">{{ getMechWeapon(idx, slot).name }}</span>
                              <span class="w-mount-type" v-if="getMechWeapon(idx, slot).mount || getMechWeapon(idx, slot).type">
                                {{ formatWeaponMountAndType(getMechWeapon(idx, slot)) }}
                              </span>
                            </div>
                            
                            <!-- Damage & Range Telemetry Pills -->
                            <div class="w-telemetry-row" v-if="(getMechWeapon(idx, slot).range && getMechWeapon(idx, slot).range.length) || (getMechWeapon(idx, slot).damage && getMechWeapon(idx, slot).damage.length)">
                              <span v-for="(r, rIdx) in (getMechWeapon(idx, slot).range || [])" :key="'r-'+rIdx" class="w-pill range">
                                <i class="mdi mdi-target"></i> {{ formatRange(r) }}
                              </span>
                              <span v-for="(d, dIdx) in (getMechWeapon(idx, slot).damage || [])" :key="'d-'+dIdx" class="w-pill dmg">
                                <i class="mdi mdi-flash"></i> {{ formatDamage(d) }}
                              </span>
                            </div>

                            <!-- Weapon Effect / Rules Description Body -->
                            <div class="w-effect-body" v-if="getWeaponEffect(getMechWeapon(idx, slot))">
                              <div class="w-effect-text" v-html="getWeaponEffect(getMechWeapon(idx, slot))"></div>
                            </div>

                            <!-- Tags with Hover Tooltips -->
                            <div class="w-tags-row" v-if="getMechWeapon(idx, slot).tags && getMechWeapon(idx, slot).tags.length">
                              <div 
                                v-for="(tag, tIdx) in getMechWeapon(idx, slot).tags" 
                                :key="tIdx" 
                                class="tag-tooltip-wrapper"
                              >
                                <span class="tag-badge">
                                  {{ getTagInfo(tag).name }}
                                </span>
                                <div class="tag-tooltip-box" v-if="getTagInfo(tag).description">
                                  <div class="tooltip-header">{{ getTagInfo(tag).name }}</div>
                                  <div class="tooltip-text" v-html="getTagInfo(tag).description"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                        <span v-else-if="slot === 0" class="empty-slot">-- {{ $t('pilotCreator.mech.empty') }} --</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Systems Installed Section -->
              <div class="systems-section dossier-sub-box">
                 <div class="box-header cyan-header">
                  <i class="mdi mdi-cpu-64-bit"></i> {{ $t('pilotCreator.mech.systems').toUpperCase() }}
                 </div>
                 <div class="systems-list">
                    <div v-if="!activeMech.systems || !activeMech.systems.length" class="empty-list-msg">
                      {{ $t('pilotCreator.mech.empty') }}
                    </div>
                    <div v-for="(sysItem, sIdx) in activeMech.systems" :key="sIdx" class="system-item-card">
                       <div class="sys-main">
                          <span class="sys-name"><i class="mdi mdi-cpu-64-bit"></i> {{ getMechSystem(sysItem).name }}</span>
                          <span class="sys-sp">{{ getMechSystem(sysItem).sp || 0 }} SP</span>
                       </div>

                       <!-- Tags with Hover Tooltips for System -->
                       <div class="w-tags-row" v-if="getMechSystem(sysItem).tags && getMechSystem(sysItem).tags.length">
                         <div 
                           v-for="(tag, tIdx) in getMechSystem(sysItem).tags" 
                           :key="tIdx" 
                           class="tag-tooltip-wrapper"
                         >
                           <span class="tag-badge">
                             {{ getTagInfo(tag).name }}
                           </span>
                           <div class="tag-tooltip-box" v-if="getTagInfo(tag).description">
                             <div class="tooltip-header">{{ getTagInfo(tag).name }}</div>
                             <div class="tooltip-text" v-html="getTagInfo(tag).description"></div>
                           </div>
                         </div>
                       </div>

                       <div class="sys-desc" v-if="getMechSystem(sysItem).description" v-html="getMechSystem(sysItem).description"></div>
                    </div>
                 </div>
              </div>

              <!-- Pilot Talents Section in Mech View -->
              <div class="talents-section dossier-sub-box">
                 <div class="box-header cyan-header">
                  <i class="mdi mdi-star-outline"></i> {{ $t('pilot.talentAudit').toUpperCase() }}
                 </div>
                 <div class="talents-grid">
                    <button 
                       class="talent-btn-card" 
                       v-for="talent in pilot.talents" 
                       :key="talent.id"
                       @click="openTalentModal(talent)"
                       title="Clique para ver os detalhes do talento"
                    >
                       <div class="talent-btn-main">
                          <span class="t-name">{{ getTalentName(talent.id) }}</span>
                          <span class="info-icon material-symbols-outlined">info</span>
                       </div>
                       <div class="rank-indicator">
                          <span v-for="r in 3" :key="r" class="rank-pip" :class="{ active: r <= talent.rank }"></span>
                          <span class="rank-text">RANK {{ talent.rank }}</span>
                       </div>
                    </button>
                    <div v-if="!pilot.talents || pilot.talents.length === 0" class="empty-list-msg">
                      NENHUM TALENTO REGISTRADO
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-mech-placeholder">
          <h3>NENHUM MECHA ATIVO DESIGNADO</h3>
          <p>Edite o piloto para associar um chassi de combate.</p>
        </div>

        <div class="dossier-footer">
          <div class="footer-left">TACTICAL ASSET DATA // OMNINET ENCRYPTED // {{ activeMech?.manufacturer || 'GMS' }} PROTOCOL</div>
          <div class="footer-right">SYNC: OK // {{ new Date().getFullYear() }}</div>
        </div>
      </div>
    </div>

    <!-- Pilot Not Found Fallback -->
    <div v-else class="pilot-not-found">
      <div class="error-icon material-symbols-outlined">warning</div>
      <h2>PILOTO NÃO ENCONTRADO</h2>
      <p>O registro solicitado não foi localizado no banco de dados da Omninet.</p>
      <router-link to="/pilots" class="back-link-btn">RETORNAR AO ROSTER</router-link>
    </div>

    <!-- Talent Details Modal -->
    <transition name="modal-fade">
      <div v-if="talentModalOpen && selectedTalent" class="modal-overlay" @click.self="talentModalOpen = false">
        <div class="talent-modal-card shadow-2">
          <div class="modal-header">
            <div class="header-title-block">
              <span class="protocol-tag">COMPÊNDIO DE TALENTOS // OMNINET</span>
              <h2 class="talent-modal-title">{{ selectedTalent.name }}</h2>
            </div>
            <button class="modal-close-btn" @click="talentModalOpen = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="modal-body tech-scroll">
            <div v-if="selectedTalent.terse || selectedTalent.description || selectedTalent.quote" class="talent-flavor-box">
              <p v-if="selectedTalent.terse" class="talent-terse">{{ selectedTalent.terse }}</p>
              <p v-if="selectedTalent.quote" class="talent-quote">"{{ selectedTalent.quote }}"</p>
              <div v-if="selectedTalent.description" class="talent-desc" v-html="selectedTalent.description"></div>
            </div>

            <div class="ranks-detail-list">
              <div 
                v-for="(rank, idx) in (selectedTalent.ranks || [])" 
                :key="idx" 
                class="rank-detail-card"
                :class="{ active: selectedTalent.currentRank >= (idx + 1) }"
              >
                <div class="rank-header">
                  <span class="rank-title">RANK {{ idx + 1 }}: {{ rank.name }}</span>
                  <span class="rank-status-tag" :class="{ active: selectedTalent.currentRank >= (idx + 1) }">
                    {{ selectedTalent.currentRank >= (idx + 1) ? 'ATIVO' : 'Bloqueado' }}
                  </span>
                </div>
                <div class="rank-body" v-html="rank.description || rank.effect"></div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <div class="footer-rank-status">
              RANK ATUAL DO PILOTO: <strong class="highlight-val">{{ selectedTalent.currentRank }} / 3</strong>
            </div>
            <button class="confirm-close-btn" @click="talentModalOpen = false">
              <span class="material-symbols-outlined">check_circle</span>
              ENTENDIDO
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- PILOT GEAR DETAIL MODAL -->
    <transition name="modal-fade">
      <div v-if="gearModalOpen && selectedGearItem" class="talent-modal-overlay" @click.self="gearModalOpen = false">
        <div class="talent-modal-card shadow-2">
          <div class="modal-header">
            <div class="header-title-block">
              <span class="protocol-tag">EQUIPAMENTO DE PILOTO // REGISTRO TÁTICO</span>
              <h2 class="talent-modal-title">{{ selectedGearItem.name }}</h2>
            </div>
            <button class="modal-close-btn" @click="gearModalOpen = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="modal-body tech-scroll">
            <div class="w-telemetry-row" v-if="(selectedGearItem.range && selectedGearItem.range.length) || (selectedGearItem.damage && selectedGearItem.damage.length)" style="margin-bottom: 14px;">
              <span v-for="(r, rIdx) in (selectedGearItem.range || [])" :key="'modal-r-'+rIdx" class="w-pill range">
                <i class="mdi mdi-target"></i> {{ formatRange(r) }}
              </span>
              <span v-for="(d, dIdx) in (selectedGearItem.damage || [])" :key="'modal-d-'+dIdx" class="w-pill dmg">
                <i class="mdi mdi-flash"></i> {{ formatDamage(d) }}
              </span>
            </div>

            <div v-if="selectedGearItem.description" class="talent-flavor-box">
              <div class="talent-desc" v-html="selectedGearItem.description"></div>
            </div>

            <div class="w-tags-row" v-if="selectedGearItem.tags && selectedGearItem.tags.length" style="margin-top: 14px;">
              <div v-for="(tag, tIdx) in selectedGearItem.tags" :key="tIdx" class="tag-tooltip-wrapper">
                <span class="tag-badge">{{ getTagInfo(tag).name }}</span>
                <div class="tag-tooltip-box" v-if="getTagInfo(tag).description">
                  <div class="tooltip-header">{{ getTagInfo(tag).name }}</div>
                  <div class="tooltip-text" v-html="getTagInfo(tag).description"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="confirm-close-btn" @click="gearModalOpen = false">
              <span class="material-symbols-outlined">check_circle</span>
              ENTENDIDO
            </button>
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
import { pilotStore } from "@/store/pilotCreator";
import { getFrameImage } from "@/utils/frameImages";

export default {
  name: "PilotDetailView",
  props: {
    id: {
      type: String,
      required: true
    },
    pilots: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeTab: "pilot", // "pilot" | "mech"
      customPilots: [],
      biometricHash: Math.random().toString(36).substring(7).toUpperCase(),
      talentModalOpen: false,
      selectedTalent: null,
      gearModalOpen: false,
      selectedGearItem: null
    };
  },
  async created() {
    await this.loadCustomPilots();
  },
  computed: {
    allPilots() {
      const merged = [...this.pilots];
      this.customPilots.forEach(cp => {
        if (!merged.some(p => p.id === cp.id)) {
          merged.push({ ...cp, isCustom: true });
        }
      });
      return merged;
    },
    pilot() {
      if (!this.id) return null;
      const targetId = this.id.toLowerCase();
      
      const found = this.allPilots.find(p => {
        const idMatch = p.id && p.id.toLowerCase() === targetId;
        const callsignMatch = p.callsign && p.callsign.toLowerCase() === targetId;
        const nameMatch = p.name && p.name.toLowerCase() === targetId;
        return idMatch || callsignMatch || nameMatch;
      });

      if (found) return found;

      if (pilotStore.state.id && pilotStore.state.id.toLowerCase() === targetId) {
        return { ...pilotStore.state, isCustom: true };
      }

      return null;
    },
    frames() {
      const getFrames = (pkg) => {
        if (!pkg) return [];
        return pkg.frames || (pkg.default && pkg.default.frames) || [];
      };

      const allFrames = [...getFrames(lancerData)];
      allFrames.push(...getFrames(ktbData));
      allFrames.push(...getFrames(nrfawData));
      allFrames.push(...getFrames(longrimData));
      return allFrames;
    },
    weapons() {
      const getWeapons = (pkg) => {
        if (!pkg) return [];
        return pkg.weapons || (pkg.default && pkg.default.weapons) || [];
      };
      return [
        ...getWeapons(lancerData),
        ...getWeapons(ktbData),
        ...getWeapons(nrfawData),
        ...getWeapons(longrimData)
      ];
    },
    systems() {
      const getSystems = (pkg) => {
        if (!pkg) return [];
        return pkg.systems || (pkg.default && pkg.default.systems) || [];
      };
      return [
        ...getSystems(lancerData),
        ...getSystems(ktbData),
        ...getSystems(nrfawData),
        ...getSystems(longrimData)
      ];
    },
    allPilotGear() {
      const getGear = (pkg) => {
        if (!pkg) return [];
        return pkg.pilot_gear || (pkg.default && pkg.default.pilot_gear) || [];
      };
      return [
        ...getGear(lancerData),
        ...getGear(ktbData),
        ...getGear(nrfawData),
        ...getGear(longrimData)
      ];
    },
    resolvedPilotLoadout() {
      if (!this.pilot) return { armor: null, weapons: [], gear: [] };

      const findGearItem = (itemRef) => {
        if (!itemRef) return null;
        if (typeof itemRef === 'object') {
          const found = this.allPilotGear.find(g => g.id === itemRef.id);
          return found ? { ...found, ...itemRef } : itemRef;
        }
        return this.allPilotGear.find(g => g.id === itemRef) || { id: itemRef, name: itemRef, type: 'Gear' };
      };

      const loadout = this.pilot.loadout || {};

      // 1. Armor
      const rawArmor = loadout.armor || this.pilot.armor || this.pilot.pilot_armor || null;
      const armor = findGearItem(rawArmor);

      // 2. Weapons
      let rawWeapons = loadout.weapons || this.pilot.weapons || this.pilot.pilot_weapons || [];
      if (!Array.isArray(rawWeapons)) rawWeapons = [rawWeapons];
      const weapons = rawWeapons.map(findGearItem).filter(Boolean);

      // 3. Tactical Gear / Items
      let rawGear = loadout.gear || this.pilot.gear || this.pilot.items || this.pilot.equipment || this.pilot.pilot_gear || [];
      if (!Array.isArray(rawGear)) rawGear = [rawGear];
      const gear = rawGear.map(findGearItem).filter(Boolean);

      return { armor, weapons, gear };
    },
    activeMech() {
      if (!this.pilot) return null;

      if (this.pilot.activeMech) {
        const am = { ...this.pilot.activeMech };
        if (!am.frame_id) am.frame_id = am.frame;
        if (!am.frame_name && am.frame_id) {
          const frameObj = this.frames.find(f => f.id === am.frame_id);
          if (frameObj) {
            am.frame_name = frameObj.name;
            am.manufacturer = frameObj.source || frameObj.manufacturer || 'GMS';
          }
        }
        return am;
      }

      if (!this.pilot.mechs || !this.pilot.mechs.length) return null;
      const activeMechID = this.pilot.state ? this.pilot.state.active_mech_id : this.pilot.active_mech_id;
      const active = this.pilot.mechs.find((m) => m.id === activeMechID);
      return active || this.pilot.mechs[0];
    },
    selectedFrame() {
      if (!this.activeMech) return null;
      const fId = this.activeMech.frame_id || this.activeMech.frame;
      return this.frames.find(f => f.id === fId);
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
        'PV': (s.hp || 0) + (p[0] * 2) + grit,
        'ARM': s.armor || 0,
        'CAP_R': (s.repcap || 0) + Math.floor(p[0] / 2),
        'VEL': (s.speed || 0) + Math.floor(p[1] / 2),
        'EV': (s.evasion || 0) + p[1],
        'ATK_T': (s.tech_attack || 0) + p[2] + grit,
        'DEF_E': (s.edef || 0) + p[2],
        'SEN': s.sensor_range || 0,
        'SALV': (s.save || 10) + grit,
        'CAP_C': (s.heatcap || 0) + p[3],
        'PS': (s.sp || 0) + Math.floor(p[2] / 2) + grit
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
      if (this.activeMech && this.activeMech.image) return this.activeMech.image;
      if (this.selectedFrame) {
        return getFrameImage(this.selectedFrame);
      }
      if (this.pilot && this.pilot.callsign) {
        return `/mechs/${this.pilot.callsign.toUpperCase()}.webp`;
      }
      return this.activeMech?.frame_id ? getFrameImage({ id: this.activeMech.frame_id }) : 'https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/assets/icons/mech.png';
    },
    legalDisclaimer() {
      return (this.$t('pilot.legalDisclaimer') || 'CONFORME REGULAMENTO DA UNIÃO DE Sistemas, ESTES DADOS SÃO CONFIDENCIAIS E RESTRITOS A PESSOAL AUTORIZADO DO COMANDO UNIFICADO DO CORPO DE LANCERS. REPRODUÇÃO OU ALTERAÇÃO NÃO AUTORIZADA ACARRETARÁ EM SANÇÕES DA OMNINET.').substring(0, 180) + '...';
    }
  },
  methods: {
    toggleTab() {
      if (!this.activeMech) return;
      this.activeTab = this.activeTab === "pilot" ? "mech" : "pilot";
    },
    async loadCustomPilots() {
      try {
        this.customPilots = await pilotStore.getSavedPilots();
      } catch (e) {
        this.customPilots = JSON.parse(localStorage.getItem('lancer_saved_pilots') || '[]');
      }
    },
    getSkill(skill) {
      const skillsList = lancerData.skills || (lancerData.default && lancerData.default.skills) || [];
      const s = skillsList.find((obj) => obj.id === skill.id);
      return s ? `${s.name} (${skill.rank})` : skill.id;
    },
    getTalentName(id) {
      const talentsList = lancerData.talents || (lancerData.default && lancerData.default.talents) || [];
      const t = talentsList.find((obj) => obj.id === id);
      return t ? t.name : id;
    },
    getTalent(id, rank) {
      const talentsList = lancerData.talents || (lancerData.default && lancerData.default.talents) || [];
      const t = talentsList.find((obj) => obj.id === id);
      return t ? `${t.name} ${rank}` : id;
    },
    openTalentModal(talentObj) {
      const talentsList = lancerData.talents || (lancerData.default && lancerData.default.talents) || [];
      const tDef = talentsList.find((obj) => obj.id === talentObj.id) || { name: talentObj.id, ranks: [] };
      this.selectedTalent = {
        ...tDef,
        currentRank: talentObj.rank
      };
      this.talentModalOpen = true;
    },
    openGearModal(item) {
      if (!item) return;
      this.selectedGearItem = item;
      this.gearModalOpen = true;
    },
    getWeaponEffect(w) {
      if (!w) return '';
      const parts = [];
      if (w.effect) {
        parts.push(`<div>${w.effect}</div>`);
      }
      if (w.on_attack) {
        parts.push(`<div><strong>No Ataque:</strong> ${w.on_attack}</div>`);
      }
      if (w.on_hit) {
        parts.push(`<div><strong>No Acerto:</strong> ${w.on_hit}</div>`);
      }
      if (w.on_crit) {
        parts.push(`<div><strong>No Crítico:</strong> ${w.on_crit}</div>`);
      }
      if (w.profiles && w.profiles.length) {
        w.profiles.forEach(p => {
          let profStr = `<strong>${p.name || 'Perfil'}:</strong> `;
          if (p.effect) profStr += p.effect;
          if (p.on_hit) profStr += ` (No Acerto: ${p.on_hit})`;
          parts.push(`<div>${profStr}</div>`);
        });
      }
      if (parts.length === 0 && w.description) {
        parts.push(`<div class="flavor">${w.description}</div>`);
      }
      return parts.join('');
    },
    formatGearDescription(desc) {
      if (!desc) return '';
      const clean = desc.replace(/<[^>]*>?/gm, '').trim();
      if (clean.length > 110) {
        return clean.substring(0, 110) + '...';
      }
      return clean;
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
          .replace(/Burst/gi, 'Surto');
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
      else if (lower.includes('burst') || lower.includes('surto')) typeLabel = 'Surto';

      return `${typeLabel} ${val}`.trim();
    },
    getTagInfo(tag) {
      const tagObj = typeof tag === 'object' ? tag : { id: tag };
      const tagId = tagObj.id || tagObj.name || String(tag);
      const tagVal = tagObj.val !== undefined && tagObj.val !== null ? tagObj.val : null;

      const tagsList = lancerData.tags || (lancerData.default && lancerData.default.tags) || [];
      const found = tagsList.find(t => t.id === tagId || t.name === tagId);

      let name = found ? (found.name || tagId) : String(tagId).replace('tg_', '').replace(/_/g, ' ').toUpperCase();
      let description = found ? (found.description || found.effect || '') : '';

      // Replace {VAL} / {val} placeholder
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

      return {
        name,
        description: description || 'Tag de combate especial.'
      };
    },
    formatWeaponMountAndType(weapon) {
      if (!weapon) return '';
      const mountRaw = (weapon.mount || '').toLowerCase().trim();
      const typeRaw = (weapon.type || '').toLowerCase().trim();

      const mountTranslated = this.$t(`mech.mountTypes.${mountRaw}`) || weapon.mount || '';
      const typeTranslated = this.$t(`mech.weaponTypes.${typeRaw}`) || weapon.type || '';

      if (typeTranslated && mountTranslated) {
        return `${typeTranslated} ${mountTranslated}`.toUpperCase();
      }
      return (typeTranslated || mountTranslated || '').toUpperCase();
    },
    getMechWeapon(mountIdx, slotIdx) {
      if (!this.activeMech || !this.activeMech.mounts) return null;
      const weaponId = this.activeMech.mounts[`${mountIdx}_${slotIdx}`];
      if (!weaponId) return null;
      return this.weapons.find(w => w.id === weaponId) || { name: weaponId, tags: [] };
    },
    getMechSystem(sysItem) {
      if (!sysItem) return { name: 'Desconhecido', sp: 0, description: '', tags: [] };
      const sysId = typeof sysItem === 'object' ? (sysItem.id || sysItem.name) : sysItem;
      const found = this.systems.find(s => s.id === sysId || s.name === sysId);
      if (found) {
        return {
          ...found,
          name: found.name || sysId,
          sp: found.sp !== undefined ? found.sp : (typeof sysItem === 'object' ? sysItem.sp || 0 : 0),
          description: found.description || found.effect || (typeof sysItem === 'object' ? sysItem.effect || sysItem.description || '' : ''),
          tags: found.tags || (typeof sysItem === 'object' ? sysItem.tags || [] : [])
        };
      }
      return {
        name: typeof sysItem === 'object' ? (sysItem.name || sysId) : sysId,
        sp: typeof sysItem === 'object' ? (sysItem.sp || 0) : 0,
        description: typeof sysItem === 'object' ? (sysItem.effect || sysItem.description || '') : '',
        tags: typeof sysItem === 'object' ? (sysItem.tags || []) : []
      };
    },
    handleMechImageError(e) {
      e.target.src = 'https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/assets/icons/mech.png';
    },
    editPilot() {
      pilotStore.loadPilot(this.pilot);
      this.$router.push("/creator");
    },
    async deletePilot() {
      if (confirm(`DESEJA EXCLUIR O PILOTO "${this.pilot.callsign || 'ESTE PILOTO'}"?`)) {
        await pilotStore.deletePilot(this.pilot.id);
        this.$router.push("/pilots");
      }
    },
    triggerPilotFileUpload() {
      if (this.pilot && this.pilot.isCustom) {
        this.$refs.pilotFileInput.click();
      }
    },
    async onPilotFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result;
        this.pilot.image = base64;
        
        if (this.pilot.isCustom) {
          const saved = JSON.parse(localStorage.getItem('lancer_saved_pilots') || '[]');
          const idx = saved.findIndex(p => p.id === this.pilot.id);
          if (idx > -1) {
            saved[idx] = { ...this.pilot, image: base64, lastSaved: new Date().toISOString() };
            localStorage.setItem('lancer_saved_pilots', JSON.stringify(saved));
            try {
              await fetch('/api/pilots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saved[idx])
              });
            } catch (err) {
              console.error("Database sync failed", err);
            }
          }
        }
      };
      reader.readAsDataURL(file);
    },
    triggerMechFileUpload() {
      if (this.pilot && this.pilot.isCustom && this.$refs.mechFileInput) {
        this.$refs.mechFileInput.click();
      }
    },
    async onMechFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result;
        if (this.activeMech) {
          this.activeMech.image = base64;
        }
        
        if (this.pilot && this.pilot.isCustom) {
          const saved = JSON.parse(localStorage.getItem('lancer_saved_pilots') || '[]');
          const idx = saved.findIndex(p => p.id === this.pilot.id);
          if (idx > -1) {
            saved[idx] = { ...this.pilot, lastSaved: new Date().toISOString() };
            if (!saved[idx].activeMech) saved[idx].activeMech = {};
            saved[idx].activeMech.image = base64;
            localStorage.setItem('lancer_saved_pilots', JSON.stringify(saved));
            try {
              await fetch('/api/pilots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saved[idx])
              });
            } catch (err) {
              console.error("Database sync failed", err);
            }
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }
};
</script>

<style scoped>
.pilot-detail-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px 80px 20px;
  width: 100%;
  height: calc(100vh - 95px);
  max-height: calc(100vh - 95px);
  overflow-y: auto;
  box-sizing: border-box;
}

.pilot-detail-page-container::-webkit-scrollbar {
  width: 8px;
}

.pilot-detail-page-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.4);
}

.pilot-detail-page-container::-webkit-scrollbar-thumb {
  background: var(--union-crimson, #af0e1e);
  border-radius: 4px;
}

.page-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1150px;
  margin-bottom: 15px;
  flex-shrink: 0;
  gap: 15px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(175, 14, 30, 0.15);
  border: 1px solid var(--union-crimson, #af0e1e);
  color: #fff;
  padding: 8px 16px;
  text-decoration: none;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 1.5px;
  transition: all 0.3s ease;
  clip-path: polygon(0 0, 95% 0, 100% 100%, 0 100%);
}

.back-btn:hover {
  background: var(--union-crimson, #af0e1e);
  box-shadow: 0 0 15px rgba(175, 14, 30, 0.5);
  transform: translateX(-3px);
}

/* View Switcher Nav */
.view-switch-nav {
  display: flex;
  align-items: center;
  background: rgba(15, 20, 28, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 4px;
  gap: 4px;
  clip-path: polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid transparent;
  color: rgba(255, 255, 255, 0.5);
  padding: 6px 14px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.tab-btn:hover:not(:disabled) {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.tab-btn.active {
  color: #fff;
  background: var(--union-crimson, #af0e1e);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 10px rgba(175, 14, 30, 0.4);
}

.tab-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.arrow-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.arrow-btn:hover {
  background: #00f0ff;
  color: #000;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
}

.page-title-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inconsolata', monospace;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1.5px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00f0ff;
  border-radius: 50%;
  box-shadow: 0 0 8px #00f0ff;
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

/* Dossier Wrapper */
.dossier-wrapper {
  max-width: 1150px;
  width: 100%;
  flex-shrink: 0;
}

/* Dossier Main Container */
.military-dossier {
  background: rgba(10, 12, 16, 0.95);
  border: 1px solid rgba(175, 14, 30, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(175, 14, 30, 0.15);
  color: #ddd;
  font-family: 'Inconsolata', monospace;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;
  margin-bottom: 30px;
}

.mech-dossier {
  border-color: rgba(0, 240, 255, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 240, 255, 0.15);
}

.dossier-header {
  padding: 18px 25px;
  background: linear-gradient(90deg, #11151c 0%, #0a0d12 100%);
  border-bottom: 2px solid var(--union-crimson, #af0e1e);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.mech-header-bg {
  border-bottom-color: #00f0ff;
}

.classification-stamp {
  position: absolute;
  top: 8px;
  right: 280px;
  border: 2px solid var(--union-crimson, #af0e1e);
  color: var(--union-crimson, #af0e1e);
  padding: 2px 10px;
  font-weight: 900;
  transform: rotate(-3deg);
  opacity: 0.4;
  font-size: 0.85rem;
  letter-spacing: 2px;
  pointer-events: none;
}

.classification-stamp.cyan {
  border-color: #00f0ff;
  color: #00f0ff;
}

.protocol-id {
  font-size: 0.9rem;
  color: var(--union-crimson, #af0e1e);
  font-weight: bold;
  letter-spacing: 1px;
}

.protocol-id.cyan {
  color: #00f0ff;
}

.callsign-display {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 3.8rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 4px;
  margin: 0;
  line-height: 0.85;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.callsign-display.cyan-glow {
  text-shadow: 0 0 12px rgba(0, 240, 255, 0.4);
}

.name-display {
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-top: 6px;
}

.name-display.cyan-sub {
  color: #00f0ff;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.dossier-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(30, 35, 45, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 1.2px;
  cursor: pointer;
  transition: all 0.2s;
}

.dossier-action-btn:hover {
  background: var(--union-crimson, #af0e1e);
  border-color: #fff;
  box-shadow: 0 0 10px rgba(175, 14, 30, 0.4);
}

.dossier-action-btn.mech {
  border-color: #00f0ff;
  color: #00f0ff;
}

.dossier-action-btn.mech:hover {
  background: #00f0ff;
  color: #000;
}

.dossier-action-btn.back-to-pilot {
  border-color: #00f0ff;
  color: #00f0ff;
}

.dossier-action-btn.back-to-pilot:hover {
  background: #00f0ff;
  color: #000;
}

.dossier-action-btn.delete {
  border-color: rgba(220, 53, 69, 0.5);
}

.dossier-action-btn.delete:hover {
  background: #dc3545;
}

/* Stats Strip */
.military-stats-strip {
  display: flex;
  background: rgba(15, 20, 28, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 14px 28px;
  gap: 24px;
}

.m-stat-box {
  display: flex;
  flex-direction: column;
  border-left: 3px solid var(--union-crimson, #af0e1e);
  padding-left: 14px;
  min-width: 120px;
}

.m-stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.65);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-icon {
  color: var(--union-crimson, #af0e1e);
}

.m-stat-value {
  font-size: 1.9rem;
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
  font-family: 'Big Shoulders Display', cursive;
}

.level-box {
  margin-left: auto;
  border-left-color: #00f0ff;
}

.level-box .m-stat-value {
  color: #00f0ff;
}

/* Dossier Grid Body */
.dossier-body {
  padding: 28px;
}

/* Dedicated Dossier Grids */
.pilot-dossier-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 28px;
  padding: 12px;
}

.mech-dossier-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
}

.dossier-sub-box {
  margin-bottom: 22px;
  background: rgba(20, 25, 35, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px;
  position: relative;
}

.box-header {
  padding: 8px 12px;
  font-size: 1.05rem;
  font-weight: bold;
  color: var(--union-crimson, #af0e1e);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-header.cyan-header {
  color: #00f0ff;
}

.switch-hint {
  font-size: 0.8rem;
  color: #00f0ff;
  font-weight: bold;
}

.box-content {
  padding: 14px 12px;
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Titillium Web', 'Roboto', sans-serif;
}

/* Portrait Section 2-Column Grid Layout */
.portrait-grid-2col {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}

.portrait-left-col {
  display: flex;
  flex-direction: column;
}

.portrait-right-col {
  display: flex;
  flex-direction: column;
}

/* Portrait */
.portrait-section {
  margin-bottom: 20px;
}

.portrait-frame {
  position: relative;
  border: 1px solid rgba(175, 14, 30, 0.5);
  background: #05080c;
  aspect-ratio: 4/5;
  width: 100%;
  margin-bottom: 10px;
  overflow: hidden;
}

.portrait-frame.mech-frame-style {
  border-color: rgba(0, 240, 255, 0.5);
}

.portrait-frame.clickable {
  cursor: pointer;
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.1) brightness(0.9);
  transition: all 0.3s;
}

.portrait-frame:hover .portrait-img {
  filter: contrast(1.15) brightness(1);
}

.no-signal {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #050508;
  color: var(--union-crimson, #af0e1e);
  font-weight: bold;
}

.upload-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(175, 14, 30, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: #fff;
  font-family: 'Rajdhani', sans-serif;
  font-weight: bold;
}

.portrait-frame:hover .upload-overlay {
  opacity: 1;
}

.scan-line-anim {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, transparent 50%, rgba(175, 14, 30, 0.05) 50%);
  background-size: 100% 4px;
  pointer-events: none;
}

.portrait-metadata {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.meta-row {
  display: flex;
  justify-content: space-between;
}

.status-active {
  color: #22c55e;
  font-weight: bold;
}

.status-warning {
  color: #f1a92a;
  font-weight: bold;
}

.hash-val {
  color: #00f0ff;
}

/* Mecha Card in Dossier */
.mecha-info-box.clickable {
  cursor: pointer;
  border-color: rgba(0, 240, 255, 0.3);
  transition: all 0.2s ease;
}

.mecha-info-box.clickable:hover {
  background: rgba(0, 240, 255, 0.05);
  border-color: #00f0ff;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.15);
}

.mecha-info-box .m-name {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 2px;
  line-height: 1;
}

.mecha-info-box .m-frame {
  font-size: 0.85rem;
  color: #00f0ff;
  font-weight: bold;
  letter-spacing: 1px;
  margin-top: 4px;
}

/* Detailed HASE Stats Grid for Mech */
.detailed-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.stat-mini {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 12px;
  border-left: 3px solid #666;
}

.stat-mini .label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 2px;
  line-height: 1.1;
}

.stat-mini .val {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 1.7rem;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}

.stat-mini.red { border-left-color: var(--union-crimson, #af0e1e); }
.stat-mini.red .val { color: #ff5566; }

.stat-mini.green { border-left-color: #22c55e; }
.stat-mini.green .val { color: #22c55e; }

.stat-mini.blue { border-left-color: #00f0ff; }
.stat-mini.blue .val { color: #00f0ff; }

.stat-mini.yellow { border-left-color: #f1a92a; }
.stat-mini.yellow .val { color: #f1a92a; }

.stat-mini.pilot-stat {
  border-left-color: #a855f7;
  background: rgba(168, 85, 247, 0.12);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-left-width: 4px;
}

.stat-mini.pilot-stat .label {
  color: #e9d5ff;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 1.2px;
}

.stat-mini.pilot-stat .val {
  color: #c084fc;
  font-size: 1.8rem;
}

/* Pilot Telemetry Bar */
.pilot-telemetry-bar {
  display: flex;
  justify-content: space-between;
  background: rgba(15, 20, 28, 0.9);
  border: 1px solid rgba(168, 85, 247, 0.3);
  padding: 10px 16px;
  margin-bottom: 20px;
  gap: 15px;
}

.p-telemetry-item {
  display: flex;
  flex-direction: column;
}

.p-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
}

.p-val {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: #fff;
}

.p-val.highlight {
  color: #00f0ff;
}

/* Weapon Cards & Telemetry */
.weapon-info-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 0;
}

.weapon-info-card.clickable {
  cursor: pointer;
  border-radius: 4px;
  padding: 8px;
  transition: all 0.2s ease;
}

.weapon-info-card.clickable:hover {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.2);
}

.w-effect-body {
  margin-top: 4px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.4);
  border-left: 3px solid #00f0ff;
  border-radius: 2px;
}

.w-effect-text {
  font-family: 'Titillium Web', sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.45;
}

.w-effect-text strong {
  color: #00f0ff;
  font-weight: 700;
}

.w-effect-text .flavor {
  font-style: italic;
  opacity: 0.75;
}

.w-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.w-name {
  color: #fff;
  font-weight: bold;
  font-size: 1.5rem;
}

.w-mount-type {
  font-size: 1rem;
  color: #00f0ff;
  font-weight: 700;
  background: rgba(0, 240, 255, 0.1);
  padding: 2px 6px;
  border-radius: 2px;
  letter-spacing: 0.5px;
}

.w-telemetry-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.w-pill {
  font-size: 1rem;
  padding: 2px 8px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.85);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: font-weight;
}

.w-pill.dmg {
  color: #ff6677;
  border-color: rgba(255, 102, 119, 0.4);
  background: rgba(255, 102, 119, 0.08);
}

.w-pill.range {
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.4);
  background: rgba(56, 189, 248, 0.08);
}

/* Tag Tooltip System */
.w-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 6px;
}

.tag-tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tag-badge {
  font-size: 1rem;
  background: rgba(0, 240, 255, 0.12);
  border: 1px solid rgba(0, 240, 255, 0.4);
  color: #00f0ff;
  padding: 2px 6px;
  border-radius: 2px;
  cursor: help;
  transition: all 0.2s;
  font-weight: 700;
  letter-spacing: 0.8px;
}

.tag-tooltip-wrapper:hover .tag-badge {
  background: #00f0ff;
  color: #000;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
}

.tag-tooltip-box {
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: #090d14;
  border: 1px solid #00f0ff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.95), 0 0 15px rgba(0, 240, 255, 0.3);
  padding: 10px 14px;
  width: 400px;
  z-index: 6000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  pointer-events: none;
  font-family: 'Titillium Web', 'Roboto', sans-serif;
  text-align: left;
  padding: 6px;
}

.tag-tooltip-wrapper:hover .tag-tooltip-box {
  opacity: 1;
  visibility: visible;
}

.tooltip-header {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #00f0ff;
  border-bottom: 1px solid rgba(0, 240, 255, 0.25);
  padding-bottom: 4px;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tooltip-text {
  font-size: 0.82rem;
  line-height: 1.45;
  color: #e5e7eb;
}

/* Mounts & Systems in Mech View */
.mounts-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 0;
}

.mount-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 12px;
}

.mount-header-sm {
  display: flex;
  justify-content: space-between;
  color: #00f0ff;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 4px;
  margin-bottom: 6px;
}

.mount-slots-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slot-entry {
  font-size: 0.85rem;
}

.w-name {
  color: #fff;
  font-weight: bold;
}

.w-tags {
  display: flex;
  gap: 4px;
  margin-top: 2px;
}

.tag {
  font-size: 0.6rem;
  background: rgba(0, 240, 255, 0.1);
  color: #00f0ff;
  padding: 1px 4px;
  border-radius: 2px;
}

.empty-slot {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.8rem;
  font-style: italic;
}

.systems-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
}

.system-item-card {
  background: rgba(0, 0, 0, 0.3);
  border-left: 2px solid #00f0ff;
  padding: 6px 10px;
}

.sys-main {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
}

.sys-sp {
  color: #00f0ff;
  font-size: 1rem;
}

.sys-desc {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
}

.traits-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trait-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding-bottom: 4px;
}

.trait-name {
  color: #00f0ff;
  font-weight: bold;
  font-size: 1rem;
}

.trait-desc {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
}

.empty-mech-placeholder {
  padding: 50px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
}

/* Skills & Talents */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 0;
}

.skill-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.02);
  border-left: 2px solid rgba(175, 14, 30, 0.4);
}

.skill-name {
  font-size: 1.2rem;
  color: #ddd;
}

.skill-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dot.filled {
  background: var(--union-crimson, #af0e1e);
  border-color: var(--union-crimson, #af0e1e);
  box-shadow: 0 0 6px rgba(175, 14, 30, 0.6);
}

/* Talent Grid Buttons */
.talents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 12px;
  padding: 10px 0;
}

.talent-btn-card {
  background: rgba(20, 25, 35, 0.7);
  border: 1px solid rgba(175, 14, 30, 0.4);
  border-left: 3px solid var(--union-crimson, #af0e1e);
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
  overflow: hidden;
}

.talent-btn-card:hover {
  background: rgba(175, 14, 30, 0.15);
  border-color: #00f0ff;
  border-left-color: #00f0ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 240, 255, 0.2);
}

.talent-btn-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.talent-btn-card .t-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.talent-btn-card .info-icon {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.2s;
}

.talent-btn-card:hover .info-icon {
  color: #00f0ff;
}

.rank-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rank-pip {
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.rank-pip.active {
  background: var(--union-crimson, #af0e1e);
  border-color: var(--union-crimson, #af0e1e);
  box-shadow: 0 0 6px rgba(175, 14, 30, 0.8);
}

.rank-text {
  font-size: 0.7rem;
  color: var(--union-crimson, #af0e1e);
  font-weight: bold;
  letter-spacing: 1px;
  margin-left: auto;
}

.talent-btn-card:hover .rank-text {
  color: #00f0ff;
}

/* Talent Details Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(5, 8, 12, 0.85);
  backdrop-filter: blur(6px);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.talent-modal-card {
  background: #0a0d14;
  border: 1px solid rgba(175, 14, 30, 0.5);
  box-shadow: 0 0 45px rgba(0, 0, 0, 0.95), 0 0 25px rgba(175, 14, 30, 0.25);
  width: 92vw;
  max-width: 920px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  color: #ddd;
  font-family: 'Inconsolata', monospace;
}

.talent-modal-card .modal-header {
  padding: 20px 28px;
  background: linear-gradient(90deg, #121722 0%, #0a0d14 100%);
  border-bottom: 2px solid var(--union-crimson, #af0e1e);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.protocol-tag {
  font-size: 0.85rem;
  color: var(--union-crimson, #af0e1e);
  font-weight: bold;
  letter-spacing: 1.5px;
}

.talent-modal-title {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: 2.8rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 4px;
  margin: 4px 0 0 0;
  line-height: 1;
}

.modal-close-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background: var(--union-crimson, #af0e1e);
  color: #fff;
  border-color: #fff;
  box-shadow: 0 0 12px rgba(175, 14, 30, 0.5);
}

.talent-modal-card .modal-body {
  padding: 24px 28px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.talent-flavor-box {
  background: rgba(175, 14, 30, 0.08);
  border-left: 4px solid var(--union-crimson, #af0e1e);
  padding: 16px 20px;
  font-family: 'Titillium Web', 'Roboto', sans-serif;
  font-size: 1.05rem;
  line-height: 1.6;
}

.talent-terse {
  font-family: 'Titillium Web', 'Roboto', sans-serif;
  font-weight: 700;
  color: #fff;
  font-size: 1.15rem;
  margin: 0 0 8px 0;
  letter-spacing: 0.2px;
}

.talent-quote {
  font-family: 'Titillium Web', 'Roboto', sans-serif;
  font-style: italic;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.05rem;
  margin: 0;
}

.talent-desc {
  font-family: 'Titillium Web', 'Roboto', sans-serif;
  font-size: 1.05rem;
  line-height: 1.65;
  color: #e5e7eb;
  margin-top: 8px;
  letter-spacing: 0.2px;
}

.ranks-detail-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rank-detail-card {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 4px solid rgba(255, 255, 255, 0.25);
  padding: 16px 20px;
  transition: all 0.2s;
}

.rank-detail-card.active {
  background: rgba(175, 14, 30, 0.1);
  border-color: rgba(175, 14, 30, 0.4);
  border-left-color: var(--union-crimson, #af0e1e);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.rank-detail-card .rank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 8px;
}

.rank-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1.5px;
}

.rank-status-tag {
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.4);
  font-weight: bold;
  letter-spacing: 1px;
}

.rank-status-tag.active {
  background: rgba(175, 14, 30, 0.25);
  color: #ff6677;
  border: 1px solid var(--union-crimson, #af0e1e);
  box-shadow: 0 0 10px rgba(175, 14, 30, 0.4);
}

.rank-body {
  font-family: 'Titillium Web', 'Roboto', sans-serif;
  font-size: 1.05rem;
  line-height: 1.65;
  color: #f3f4f6;
  letter-spacing: 0.2px;
}

.talent-modal-card .modal-footer {
  padding: 16px 28px;
  background: #06080c;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-rank-status {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 1px;
}

.highlight-val {
  color: var(--union-crimson, #af0e1e);
  font-size: 1.2rem;
  font-weight: 800;
}

.confirm-close-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--union-crimson, #af0e1e);
  border: 1px solid #fff;
  color: #fff;
  padding: 10px 24px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-close-btn:hover {
  background: #fff;
  color: var(--union-crimson, #af0e1e);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

.bio-text {
  max-height: 150px;
  overflow-y: auto;
  white-space: pre-wrap;
}

.empty-list-msg {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.3);
  padding: 8px;
  font-style: italic;
}

/* Termination Section */
.termination-action {
  margin: 25px 0 15px 0;
  padding: 15px;
  border: 1px dashed var(--union-crimson, #af0e1e);
  background: rgba(175, 14, 30, 0.05);
  text-align: center;
}

.terminate-btn {
  width: 100%;
  padding: 12px;
  background: var(--union-crimson, #af0e1e);
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
  transition: all 0.2s;
}

.terminate-btn:hover {
  background: #fff;
  color: var(--union-crimson, #af0e1e);
}

.termination-warning {
  margin-top: 8px;
  font-size: 0.7rem;
  color: var(--union-crimson, #af0e1e);
  font-weight: bold;
}

.security-disclaimer {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 15px;
  line-height: 1.5;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 12px;
  font-family: 'Titillium Web', 'Roboto', sans-serif;
}

/* Footer */
.dossier-footer {
  background: #080a0e;
  padding: 14px 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Inconsolata', monospace;
}

/* Pilot Not Found Fallback */
.pilot-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: rgba(10, 12, 16, 0.9);
  border: 1px solid rgba(175, 14, 30, 0.3);
  max-width: 600px;
  margin: 40px auto;
}

.error-icon {
  font-size: 3rem;
  color: var(--union-crimson, #af0e1e);
  margin-bottom: 15px;
}

.back-link-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background: var(--union-crimson, #af0e1e);
  color: #fff;
  text-decoration: none;
  font-family: 'Rajdhani', sans-serif;
  font-weight: bold;
  letter-spacing: 1px;
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .dossier-grid {
    grid-template-columns: 1fr;
  }
  
  .military-stats-strip, .detailed-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .m-stat-box {
    flex: 1 1 calc(50% - 10px);
  }
  
  .level-box {
    margin-left: 0;
  }
  
  .classification-stamp {
    display: none;
  }
}

/* Pilot Gear Section Styles */
.pilot-gear-dossier-box .flex-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sub-header-tag {
  font-size: 0.75rem;
  color: #00f0ff;
  letter-spacing: 1px;
  font-weight: normal;
}

.pilot-gear-dossier-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 8px 0;
}

.gear-category-block {
  background: rgba(10, 15, 22, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 14px;
  border-radius: 4px;
}

.gear-category-block .cat-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #00f0ff;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.gear-items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pilot-gear-card {
  background: rgba(15, 22, 32, 0.85);
  border: 1px solid rgba(0, 240, 255, 0.25);
  padding: 10px 14px;
  border-radius: 3px;
  transition: all 0.2s ease;
}

.pilot-gear-card.clickable {
  cursor: pointer;
}

.pilot-gear-card.clickable:hover {
  border-color: #00f0ff;
  background: rgba(0, 240, 255, 0.08);
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.2);
}

.pilot-gear-card .gear-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.pilot-gear-card .gear-name {
  font-weight: 700;
  color: #fff;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.pilot-gear-card .gear-type-badge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
  background: rgba(0, 240, 255, 0.15);
  color: #00f0ff;
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 2px;
  letter-spacing: 0.5px;
}

.pilot-gear-card .gear-desc-terse {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.35;
  display: block;
  margin-bottom: 6px;
}

.empty-gear-slot {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.35);
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
