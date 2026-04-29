export function generateCompconPilot(state) {
  // Lancer Base Rules
  const level = state.level || 0;
  const grit = Math.ceil(level / 2);
  const maxHp = 6 + grit; // Base 6 + Grit

  const payload = {
    id: state.id,
    level: level,
    callsign: state.callsign,
    name: state.name,
    player_name: "",
    status: "Active",
    dead: false,
    text_appearance: "",
    notes: "",
    history: "",
    quirks: [],
    current_hp: maxHp,
    background: state.background,
    resistances: [],
    mechs: [
      {
        id: "mech-" + state.id,
        name: state.activeMech.name,
        notes: "",
        frame: state.activeMech.frame,
        active_loadout_index: 0,
        loadouts: [
          {
            id: "loadout-mech-" + state.id,
            name: "Primary",
            mounts: [
              // This is a simplified mapping. Real COMP/CON expects indices to match frame mounts.
              // We'll iterate through 0 to 3 (max mounts for most frames)
              ...[0,1,2,3].map(mIdx => ({
                mount_type: "", // Will be filled by Foundry on import based on frame
                slots: [0, 1].map(sIdx => ({ id: state.activeMech.mounts[`${mIdx}_${sIdx}`] || null }))
                  .filter(s => s.id !== null)
              })).filter(m => m.slots.length > 0)
            ],
            systems: state.activeMech.systems.map(id => ({ id })),
            improved_armament: null,
            integrated_mount: null,
            integrated_weapon: null
          }
        ],
        state: {
          current_hp: 10,
          current_structure: 4,
          current_stress: 4,
          current_heat: 0,
          repairs: 5,
          overcharge_count: 0,
          core_energy: 1,
          deployed: [],
          evasives: false,
          braced: false,
          hidden: false,
          invisible: false,
          shut_down: false
        }
      }
    ],
    cc_ver: "2.3.23",
    special_equipment: {
      PilotGear: [],
      Frames: [],
      MechWeapons: [],
      WeaponMods: [],
      MechSystems: [],
      SystemMods: []
    },
    combat_history: {
      moves: 0,
      kills: 0,
      damage: 0,
      hp_damage: 0,
      structure_damage: 0,
      overshield: 0,
      heat_damage: 0,
      reactor_damage: 0
    },
    state: {
      active_mech_id: "",
      remote_mech_id: "",
      stage: "Narrative",
      turn: 0,
      actions: 2,
      braced: false,
      overcharged: false,
      prepare: false,
      custom_statuses: [],
      hard_cover: false,
      soft_cover: false,
      invisible: false,
      danger_zone: false,
      engaged: false,
      hidden: false,
      shut_down: false,
      destroyed: false,
      mount_state: [],
      deployable_state: [],
      system_state: [],
      weapon_spool: [],
      activation_state: [],
      show_ui: true,
      targets: []
    },
    skills: state.skills.map(s => ({ id: s.id, rank: s.rank })),
    talents: state.talents.map(t => ({ id: t.id, rank: t.rank })),
    mechSkills: [...state.mech_skills],
    custom_counters: [],
    counter_data: [],
    core_bonuses: [],
    licenses: state.licenses.map(l => ({ id: l.id, rank: l.rank })),
    reserves: [],
    orgs: [],
    group: "",
    sort_index: 0,
    portrait: "",
    cloud_portrait: "",
    loadout: {
      id: "loadout-" + state.id,
      name: "Primary",
      armor: state.loadout.armor ? [state.loadout.armor] : [],
      weapons: state.loadout.weapons,
      gear: state.loadout.gear
    },
    brews: [],
    lastModified: Date.now().toString(),
    isDeleted: false,
    expireTime: "0"
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
