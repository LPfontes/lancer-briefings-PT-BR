import { frames as framesData, weapons as weaponsData, systems as systemsData, pilot_gear as pilotGearData } from "lancer-data-pt-br";

export function generateCompconPilot(state) {
  const level = state.level || 0;
  const grit = Math.ceil(level / 2);
  const maxHp = 6 + grit;
  const mechId = "mech-" + state.id;
  
  const currentFrame = framesData.find(f => f.id === state.activeMech.frame);
  const frameMounts = currentFrame ? currentFrame.mounts : [];

  // Helper for pilot gear objects
  const mapPilotGear = (id) => {
    if (!id) return null;
    return {
      id,
      flavorName: "",
      flavorDescription: "",
      customDamageType: null,
      destroyed: false,
      uses: 0,
      cascading: false
    };
  };

  // Helper for mech weapons
  const mapMechWeapon = (id) => {
    if (!id) return null;
    const wData = weaponsData.find(w => w.id === id);
    return {
      id,
      mod: null,
      flavorName: "",
      flavorDescription: wData ? wData.description : "",
      selectedProfile: 0,
      customDamageType: null,
      maxUseOverride: 0,
      destroyed: false,
      uses: 0,
      cascading: false,
      loaded: true
    };
  };

  // Helper for mech systems
  const mapMechSystem = (id) => {
    if (!id) return null;
    const sData = systemsData.find(s => s.id === id);
    return {
      id,
      flavorName: "",
      flavorDescription: sData ? sData.description : "",
      destroyed: false,
      uses: 0,
      cascading: false
    };
  };

  const payload = {
    id: state.id,
    level: level,
    callsign: state.callsign,
    name: state.name,
    player_name: "",
    status: "Active",
    dead: false,
    text_appearance: "",
    notes: state.bio || "",
    history: "",
    quirks: [],
    current_hp: maxHp,
    background: state.background,
    resistances: [],
    portrait: "",
    cloud_portrait: "",
    group: "",
    sort_index: -1,
    cc_ver: "2.4.0",
    isDeleted: false,
    expireTime: "",
    deleteTime: "",
    lastModified: new Date().toString(),
    
    skills: state.skills.map(s => ({ id: s.id, rank: s.rank })),
    talents: state.talents.map(t => ({ id: t.id, rank: t.rank })),
    mechSkills: [...state.mech_skills],
    licenses: state.licenses.map(l => ({ 
      id: l.id, 
      rank: l.rank,
      stub: {
        id: l.id,
        name: l.id.split('_').slice(1).join(' ').toUpperCase(), // Fallback name
        source: "",
        frameName: "",
        brew: { LcpId: "", LcpName: "Lancer Core Book", LcpVersion: "", Website: "", Status: "OK" }
      }
    })),
    
    core_bonuses: [],
    reserves: [],
    orgs: [],
    counter_data: [],
    custom_counters: [],
    special_equipment: { PilotGear: [], Frames: [], MechWeapons: [], WeaponMods: [], MechSystems: [] },
    
    // Bond fields (required by some importers)
    bondId: "",
    bondPowers: [],
    burdens: [],
    xp: 0,
    stress: 0,
    isBroken: false,
    
    combat_history: {
      moves: 0, kills: 0, damage: 0, hp_damage: 0, structure_damage: 0, overshield: 0, heat_damage: 0, reactor_damage: 0, overcharge_uses: 0, core_uses: 0
    },
    
    state: {
      active_mech_id: mechId,
      remote_mech_id: "",
      stage: "Narrative",
      turn: 1,
      mission: 0,
      actions: 2,
      braced: false,
      overcharged: false,
      prepare: false,
      bracedCooldown: false,
      redundant: false,
      stats: {
        moves: 0, kills: 0, damage: 0, hp_damage: 0, structure_damage: 0, overshield: 0, heat_damage: 0, reactor_damage: 0, overcharge_uses: 0, core_uses: 0
      },
      deployed: []
    },
    
    loadout: {
      name: "Primary",
      armor: state.loadout.armor ? [mapPilotGear(state.loadout.armor)] : [],
      weapons: state.loadout.weapons.map(mapPilotGear).filter(Boolean),
      gear: state.loadout.gear.map(mapPilotGear).filter(Boolean),
      extendedWeapons: [],
      extendedGear: []
    },
    
    mechs: [
      {
        id: mechId,
        name: state.activeMech.name,
        notes: "",
        frame: state.activeMech.frame,
        active: false,
        current_structure: 4,
        current_stress: 4,
        current_hp: 10,
        current_heat: 0,
        current_repairs: 5,
        current_overcharge: 0,
        current_core_energy: 1,
        statuses: [],
        conditions: [],
        resistances: [],
        reactions: [],
        burn: 0,
        destroyed: false,
        defeat: "",
        activations: 1,
        meltdown_imminent: false,
        reactor_destroyed: false,
        core_active: false,
        loadouts: [
          {
            id: "loadout-" + mechId,
            name: "Primary",
            mounts: frameMounts.map((mType, mIdx) => {
              const slots = [];
              const slotSizes = mType.includes('/') ? mType.split('/') : [mType];
              
              slotSizes.forEach((size, sIdx) => {
                const weaponId = state.activeMech.mounts[`${mIdx}_${sIdx}`];
                slots.push({
                  size: size,
                  weapon: mapMechWeapon(weaponId)
                });
              });

              return {
                mount_type: mType,
                lock: false,
                slots: slots,
                extra: [],
                bonus_effects: [],
                modifiable: true
              };
            }),
            systems: state.activeMech.systems.map(mapMechSystem).filter(Boolean),
            integratedSystems: [],
            integratedMounts: [],
            extraMounts: [],
            extraIntegratedMounts: [],
            improved_armament: { mount_type: "Flex", lock: false, slots: [{ size: "Flex", weapon: null }], extra: [{ size: "Auxiliary", weapon: null }], bonus_effects: [], modifiable: true },
            superheavy_mounting: { mount_type: "Superheavy", lock: false, slots: [{ size: "Superheavy", weapon: null }], extra: [], bonus_effects: [], modifiable: true },
            integratedWeapon: { mount_type: "Aux", lock: false, slots: [{ size: "Auxiliary", weapon: null }], extra: [], bonus_effects: [], modifiable: true }
          }
        ],
        active_loadout_index: 0
      }
    ],
    brews: []
  };

  return payload;
}

export function downloadPilotJson(state) {
  const data = generateCompconPilot(state);
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  
  const a = document.createElement("a");
  const filename = `${state.callsign || 'pilot'}_${state.name || 'new'}_CC.json`;
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
