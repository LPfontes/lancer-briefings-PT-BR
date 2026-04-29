import { reactive } from 'vue';

const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const usePilotCreator = () => {
  const state = reactive({
    id: generateId(),
    name: "",
    callsign: "",
    level: 0,
    background: "Nenhum",
    bio: "",
    mech_skills: [0, 0, 0, 0], // [Hull, Agi, Sys, Eng]
    skills: [], // Array of objects: { id: "skill_id", rank: 1 }
    talents: [], // Array of objects: { id: "talent_id", rank: 1 }
    licenses: [], // Array of objects: { id: "license_id", rank: 1 }
    loadout: {
      armor: null,
      weapons: [],
      gear: []
    },
    activeMech: {
      name: "Mecha Ativo",
      frame: "mf_standard_pattern_i_everest",
      mounts: {}, // { "mount_index_slot_index": weaponId }
      systems: [] // Array of IDs
    }
    // Add other fields as necessary for export
  });

  const setIdentification = (name, callsign, background, bio) => {
    state.name = name;
    state.callsign = callsign;
    state.background = background;
    if (bio !== undefined) state.bio = bio;
  };

  const setLevel = (level) => {
    state.level = parseInt(level) || 0;
  };

  const setMechFrame = (frameId) => {
    state.activeMech.frame = frameId;
    state.activeMech.mounts = {}; // Reset mounts on frame change
    state.activeMech.systems = []; // Reset systems on frame change
  };

  const setMechName = (name) => {
    state.activeMech.name = name;
  };

  const setMechMountWeapon = (mountKey, weaponId) => {
    if (weaponId === null) {
      delete state.activeMech.mounts[mountKey];
    } else {
      state.activeMech.mounts[mountKey] = weaponId;
    }
  };

  const toggleMechSystem = (systemId) => {
    const index = state.activeMech.systems.indexOf(systemId);
    if (index > -1) {
      state.activeMech.systems.splice(index, 1);
    } else {
      state.activeMech.systems.push(systemId);
    }
  };

  const setLicenseRank = (licenseId, rank) => {
    const existing = state.licenses.find(l => l.id === licenseId);
    if (rank === 0) {
      state.licenses = state.licenses.filter(l => l.id !== licenseId);
    } else if (existing) {
      existing.rank = rank;
    } else {
      state.licenses.push({ id: licenseId, rank });
    }
  };

  const setArmor = (armorId) => {
    state.loadout.armor = armorId;
  };

  const toggleWeapon = (weaponId) => {
    const index = state.loadout.weapons.indexOf(weaponId);
    if (index > -1) {
      state.loadout.weapons.splice(index, 1);
    } else if (state.loadout.weapons.length < 2) {
      state.loadout.weapons.push(weaponId);
    }
  };

  const toggleGear = (gearId) => {
    const index = state.loadout.gear.indexOf(gearId);
    if (index > -1) {
      state.loadout.gear.splice(index, 1);
    } else if (state.loadout.gear.length < 3) {
      state.loadout.gear.push(gearId);
    }
  };

  const updateMechSkill = (index, value) => {
    if(index >= 0 && index < 4) {
      state.mech_skills[index] = value;
    }
  };

  const setSkillRank = (skillId, rank) => {
    const existing = state.skills.find(s => s.id === skillId);
    if (rank === 0) {
      state.skills = state.skills.filter(s => s.id !== skillId);
    } else if (existing) {
      existing.rank = rank;
    } else {
      state.skills.push({ id: skillId, rank });
    }
  };

  const setTalentRank = (talentId, rank) => {
    const existing = state.talents.find(t => t.id === talentId);
    if (rank === 0) {
      state.talents = state.talents.filter(t => t.id !== talentId);
    } else if (existing) {
      existing.rank = rank;
    } else {
      state.talents.push({ id: talentId, rank });
    }
  };

  const reset = () => {
    state.id = generateId();
    state.name = "";
    state.callsign = "";
    state.background = "Nenhum";
    state.bio = "";
    state.mech_skills = [0, 0, 0, 0];
    state.skills = [];
    state.talents = [];
  };

  return {
    state,
    setIdentification,
    setLevel,
    setLicenseRank,
    setArmor,
    toggleWeapon,
    toggleGear,
    setMechFrame,
    setMechName,
    setMechMountWeapon,
    toggleMechSystem,
    updateMechSkill,
    setSkillRank,
    setTalentRank,
    reset
  };
};

export const pilotStore = usePilotCreator();
