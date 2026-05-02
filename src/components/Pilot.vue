<template>
  <div class="grid-item pilot-identity" style="color:white!important">
    <div class="header">
      <div class="col grow-max">
        <div class="heading h1">{{ pilot.callsign }}</div>
        <div class="heading h2">({{ pilot.name }}) </div>
      </div>
      <div class="col"><img src="/faction-logos/msmc.svg"></div>
    </div>
    <div class="body">
      <div class="add-padding"> {{ $t('pilot.identProtocol') }}
        {{ pilot.id }} </div>
      <div class="flex-container-rows">
        <div class="row add-padding">
          {{ reverse(this.pilot.name) }}:{{ pilot.id }}//NDL-C-BLIND-REACH
        </div>
        <div class="row flex-container-cols add-padding">
          <div class="col grow-max flex-container-rows" style="padding-top:5px">
            <div class="row flex-container-cols">
              <div class="col col-primary"><span class="flavor-text"> {{ $t('pilot.callsign') }}: <b class="accent--text">{{
                capitalize(pilot.callsign) }}</b><br> {{ $t('pilot.name') }}: <b class="accent--text">{{ pilot.name
                    }}</b><br> {{ $t('pilot.background') }}: <b class="accent--text"> {{ pilot.background }} </b></span></div>
              <div class="col">{{ $t('pilot.callsignAvailable') }} <br> {{ $t('pilot.identityVerified') }} <br> {{ $t('pilot.dataRegistered') }}</div>
            </div>
            <div style="padding-top:5px"> {{ $t('pilot.frameOptions') }} <span class="subtle--text">
                {{ $t('pilot.omninetVault') }})</span></div>
            <div class="row" style="padding-top:5px"><span style="font-size: 22px; line-height: 15px;"> [
                {{ $t('pilot.stats.hull') }}: <span class="stat-text accent--text" style="font-size: 24px;"> {{ pilot.mechSkills[0] }} </span>
                {{ $t('pilot.stats.agi') }}: <span class="stat-text accent--text" style="font-size: 24px;"> {{ pilot.mechSkills[1] }} </span>
                {{ $t('pilot.stats.sys') }}: <span class="stat-text accent--text" style="font-size: 24px;"> {{ pilot.mechSkills[2] }} </span>
                {{ $t('pilot.stats.eng') }}: <span class="stat-text accent--text" style="font-size: 24px;"> {{ pilot.mechSkills[3] }} </span> ]
              </span></div>
            <div class="row flex-container-cols">
              <div class="col col-share">
                <span>{{ $t('pilot.skillAudit') }}</span>
                <br>
                <div class="chip-container" v-for="skill in pilot.skills" :key="skill.id">
                  <span class="chip"><i aria-hidden="true" class="notranslate cci cci-skill"></i>{{ getSkill(skill)
                  }}</span>
                </div>
              </div>
              <div class="col col-share">
                <span>{{ $t('pilot.talentAudit') }}</span>
                <br>
                <div class="chip-container" v-for="talent in pilot.talents" :key="talent.id">
                  <span class="chip"><i aria-hidden="true" class="notranslate cci cci-talent"></i>{{
                    getTalent(talent.id, talent.rank) }}</span>
                </div>
              </div>
            </div>
            <div v-if="pilot.level > 0" class="row flex-container-cols">
              <div class="col" style="padding-top:5px">
                <span>{{ $t('pilot.licenseAudit') }}: {{ $t('pilot.level') }} {{ pilot.level }}</span>
                <br>
                <div class="chip-container" v-for="license in pilot.licenses" :key="license.id">
                  <span class="chip"><i aria-hidden="true" class="notranslate cci cci-license"></i>{{
                    getLicense(license.id, license.rank) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="pilot-image-container">
              <div class="pilot-image-border">
                <img :src="pilotPortrait" class="portrait" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-container-cols modal-buttons">
        <div class="row biometrics-container">
          <div class="biometrics flex-container-cols" @click="pilotModal">
            <div>
              <i aria-hidden="true" class="v-icon notranslate mdi mdi-fingerprint theme--dark grey--text text--darken-2"
                style="font-size: 36px; margin-top:36px;"></i>
            </div>
            <div style="width:100%">
              {{ $t('pilot.biometricValid') }} [[{{ randomNumber(14, 22) }}PB]]<br />
              OHM C//{{ timeStamp(pilot.lastModified) }}
            </div>
          </div>
        </div>
        <div class="row biometrics-container">
          <div class="mech-record flex-container-cols" @click="mechModal">
            <div style="width:100%">
              {{ $t('pilot.blueprintValid') }} [[{{ randomNumber(14, 22) }}TB]] <br />
              {{ activeMech.manufacturer.toUpperCase() }}-{{ activeMech.frame_name.toUpperCase() }} :: "{{ activeMech.name.toUpperCase() }}"
            </div>
            <div>
              <i aria-hidden="true"
                class="v-icon notranslate cci cci-reserve-mech theme--dark grey--text text--darken-2 larger"
                style="font-size: 42px; margin-top:1em;"></i>
            </div>
          </div>
        </div>
        <div v-if="pilot.isCustom" class="row biometrics-container custom-actions">
           <div class="edit-btn" @click="editPilot">
              <i class="v-icon mdi mdi-pencil"></i> EDITAR NO CRIADOR
           </div>
           <div class="delete-btn" @click="deletePilot">
              <i class="v-icon mdi mdi-delete"></i> DELETAR
           </div>
        </div>
      </div>
      <hr role="separator" aria-orientation="horizontal" class="ma-2 v-divider theme--dark">
      <div class="row row--dense"><span class="overline" style="line-height: 13px !important; opacity: 0.4;">
          {{ $t('pilot.legalDisclaimer') }}   V-CDL//M-265-114-831 (A) </span></div>
    </div>
  </div>
</template>

<style scoped>
.custom-actions {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.edit-btn, .delete-btn {
  padding: 8px 15px;
  font-family: "Big Shoulders Display", cursive;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}

.edit-btn {
  background: var(--primary-color);
  color: white;
}

.edit-btn:hover {
  background: var(--highlight-hover);
}

.delete-btn {
  background: rgba(255, 0, 0, 0.2);
  color: #ff4444;
  border: 1px solid #ff4444;
}

.delete-btn:hover {
  background: #ff4444;
  color: white;
}
.larger::before {
  margin-top: 9px;
}

.mdi::before {
  margin-top: 9px;
}

.mech-record {
  margin-left: auto;
  text-align: right;
}

.modal-buttons {
  margin-top: 5px;
}
</style>

<script>
import 'external-svg-loader'
import lancerData from '@massif/lancer-data'
import ktbData from 'lancer-ktb-data'
import nrfawData from 'lancer-nrfaw-data'
import longrimData from 'lancer-longrim-data'

import wallflowerData from '@/assets/LCPs/wallflower-data-2.0.5'
/*Append the datasets within computed if your LCP has new items.
EX:
pilotGear() {
  return [...lancerData.pilot_gear, ...wallflowerData.pilot_gear]
},
*/

import PilotModal from '@/components/modals/PilotModal.vue'
import MechModal from '@/components/modals/MechModal.vue'

import Typer from '@/components/Typer.vue'

import ProgressBar from '@/components/ProgressBar.vue'
import Burden from '@/components/Burden.vue'
import { pilotStore } from "@/store/pilotCreator"

export default {
  components: {
    Burden,
    ProgressBar,
    Typer,
  },
  props: {
    animate: {
      type: Boolean,
      required: true,
    },
    pilot: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeMech: {},
      bond: {},
    }
  },
  computed: {
    pilotPortrait() {
      return `/pilots/${this.pilot.callsign.toUpperCase()}.webp`
    },
    mechPortrait() {
      return `/mechs/${this.pilot.callsign.toUpperCase()}.webp`
    },
    pilotGear() {
      return [...lancerData.pilot_gear]
    },
    mechWeapons() {
      return [...lancerData.weapons, ...ktbData.weapons, ...nrfawData.weapons, ...longrimData.weapons]
    },
    mechSystems() {
      return [...lancerData.systems, ...ktbData.systems, ...nrfawData.systems, ...longrimData.systems]
    },
    talents() {
      return [...lancerData.talents, ...ktbData.talents, ...nrfawData.talents, ...longrimData.talents]
    },
    skills() {
      return [...lancerData.skills]    
    },
    bonds() {
      return [...ktbData.bonds]
    },
    frames() {
      return [...lancerData.frames, ...ktbData.frames, ...nrfawData.frames, ...longrimData.frames]
    },
    mechManufacturerIcon() {
      if (this.activeMech.manufacturer)
        return `/faction-logos/${this.activeMech.manufacturer.toLowerCase()}.svg`
      return ''
    },
    pilotCode() {
      const identNameParts = this.pilot.name.split(' ')
      const identFirstName = identNameParts[0]
      const identLastNameParts = identNameParts.slice(1)
      let identName = ''
      identLastNameParts.forEach((part) => {
        identName += `${part}.`
      })
      identName += identFirstName;
			return `${this.$t('pilot.identRecord')} ${identName}: ${this.pilot.id} // ${this.pilot.background} // LOADOUT ${this.pilot.loadout.id} - MECH ${this.pilot.mechs[0].id} // HARDPOINTS ${this.pilot.mechs[0].loadouts[0].id}`;
		},
    pilotInfo() {
      const info = this.pilot

      let resolveGear = (type, item, idx, arr) => {
        item = item || {id: "", flavorName: ""};
        const gear = this.pilotGear.find((obj) => { return item.id === obj.id }) || null;
        item.flavorName = gear?.name || "ERR: DATA NOT FOUND";
        arr[idx] = item;
      }

      info.loadout.armor.forEach((item, index, array) => resolveGear('armor', item, index, array));
      info.loadout.weapons.forEach((item, index, array) => resolveGear('weapon', item, index, array));
      info.loadout.gear.forEach((item, index, array) =>resolveGear('gear', item, index, array));

      return info;
    },
  },
  created() {
    this.getActiveMech();
    this.getBond();
  },
  methods: {
    editPilot() {
      pilotStore.loadPilot(this.pilot);
      this.$router.push("/creator");
    },
    deletePilot() {
      if (confirm(`DESEJA EXCLUIR O PILOTO "${this.pilot.callsign}"? ESTA AÇÃO É IRREVERSÍVEL.`)) {
        pilotStore.deletePilot(this.pilot.id);
        window.location.reload();
      }
    },
    getBond() {
      this.bond = this.bonds.find((obj) => {
        return obj.id === this.pilot.bondId
      })
    },
    getActiveMech() {
      const activeMechID = this.pilot.state.active_mech_id
      const mech = this.pilot.mechs.find((obj) => {
        return obj.id === activeMechID
      })

      if (mech) {
        this.activeMech = mech
      }
      else {
        // default to missing frame in case pilot has no mechs
        this.pilot.mechs[0] ? this.activeMech = this.pilot.mechs[0] : lancerData.frames.find((obj) => { return obj.id === 'missing_frame' })
      }

      let frame = this.frames.find((obj) => {
        return obj.id === this.activeMech.frame
      })

      if (!frame)
        frame = lancerData.frames[0]

      this.activeMech.frame_description = frame.description
      this.activeMech.frame_name = frame.name
      this.activeMech.manufacturer = frame.source
      this.activeMech.mechtype = frame.mechtype.join(' // ')
    },
    getHistory() {
      if (this.pilot.history === "") {
        return `<p> <h2> ${this.$t('pilot.history.redacted')} </h2> </p>`
      }

      let response = "<p>"

      if (this.pilot.text_appearance !== "") {
        response += `<h2>${this.$t('pilot.history.appearance')}</h2> ${this.pilot.text_appearance} </hr>`;
      }

      if (this.pilot.history !== "") {
        response += `<h2>${this.$t('pilot.history.history')}</h2> ${this.pilot.history} </hr>`;
      }

      response += "</p>"

      return response;
    },
    getSkill(skill) {
      let sk = this.skills.find((x) => x.id == skill.id);
      return sk.name + " +" + (skill.rank * 2)
    },
    getTalent(id, value) {
      let talent = this.talents.find((x) => x.id == id);
      let response = talent.name + " "

      for (let i = 0; i < value; i++) {
        response += "I"
      }
      return response;
    },
    getLicense(id, value) {
      let frame = this.frames.find((x) => x.id == id);
      let response = frame.source + " " + frame.name + " "

      for (let i = 0; i < value; i++) {
        response += "I"
      }
      return response;
    },
    capitalize(str) {
      return str.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
    },
    reverse(str) {
      const words = str.split(' ')
      const reversed = words.reverse()
      const reversedResult = words.join('.')
      return reversedResult
    },
    randomNumber(max, min) {
      const rand = Math.random() * (max - min) + min
      const power = Math.pow(10, 2)
      return Math.floor(rand * power) / power
    },
    timeStamp(str) {
      let date = new Date(str);
      let y = date.getFullYear();
      let m = date.getMonth();
      let d = date.getDate();
      let h = date.getHours();
      let mi = date.getMinutes();
      let s = date.getSeconds();
      let ms = date.getMilliseconds();
      let tz = date.getTimezoneOffset();
      y += 2990;
      return new Date(y, m, d, h, mi, s, ms).toISOString();
    },
    pilotModal() {
      this.$oruga.modal.open({
        component: PilotModal,
        custom: true,
        trapFocus: true,
        props: {
          pilot: this.pilot,
          talents: this.talents,
          skills: this.skills,
          frames: this.frames,
        },
        class: 'custom-modal',
        width: 1920,
      })
    },
    mechModal() {
      this.$oruga.modal.open({
        component: MechModal,
        custom: true,
        trapFocus: true,
        props: {
          animate: this.animate,
          mech: this.activeMech,
          systemsData: this.mechSystems,
          weaponsData: this.mechWeapons,
          pilot: this.pilot,
        },
        class: 'custom-modal',
        width: 1920,
      })
    },
  },
}
</script>
