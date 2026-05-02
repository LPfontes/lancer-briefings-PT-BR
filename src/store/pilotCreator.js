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
      systems: [], // Array of IDs
      sh_partners: {} // { "mountIdx": partnerIdx }
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
    
    // Validate Mech Skills against new level
    let currentTotal = state.mech_skills.reduce((a, b) => a + b, 0);
    if (currentTotal > state.level) {
      // Reduce skills starting from the last one until total fits
      for (let i = 3; i >= 0 && currentTotal > state.level; i--) {
        const canRemove = Math.min(state.mech_skills[i], currentTotal - state.level);
        state.mech_skills[i] -= canRemove;
        currentTotal -= canRemove;
      }
    }
  };

  const setMechFrame = (frameId) => {
    state.activeMech.frame = frameId;
    state.activeMech.mounts = {}; // Reset mounts on frame change
    state.activeMech.systems = []; // Reset systems on frame change
    state.activeMech.sh_partners = {}; // Reset SH partners
  };

  const setMechName = (name) => {
    state.activeMech.name = name;
  };

  const setMechMountWeapon = (mountKey, weaponId) => {
    if (weaponId === null) {
      delete state.activeMech.mounts[mountKey];
      
      // If this was a Superheavy mount (slot 0 of a mountIdx), also clear partner
      const [mIdx, sIdx] = mountKey.split('_').map(Number);
      if (sIdx === 0 && state.activeMech.sh_partners[mIdx] !== undefined) {
        delete state.activeMech.sh_partners[mIdx];
      }
    } else {
      state.activeMech.mounts[mountKey] = weaponId;
    }
  };

  const setSuperheavyPartner = (mountIdx, partnerIdx) => {
    if (partnerIdx === null) {
      delete state.activeMech.sh_partners[mountIdx];
    } else {
      state.activeMech.sh_partners[mountIdx] = partnerIdx;
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
    const currentRank = existing ? existing.rank : 0;
    
    // Calculate total spent excluding current license
    const totalSpent = state.licenses.reduce((acc, l) => acc + (l.id === licenseId ? 0 : l.rank), 0);
    
    // Only allow increase if within LL limit
    if (rank > currentRank && (totalSpent + rank) > state.level) {
      return false; // Limit reached
    }

    if (rank === 0) {
      state.licenses = state.licenses.filter(l => l.id !== licenseId);
    } else if (existing) {
      existing.rank = rank;
    } else {
      state.licenses.push({ id: licenseId, rank });
    }
    return true;
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
    if (index >= 0 && index < 4) {
      const currentPoints = state.mech_skills.reduce((a, b) => a + b, 0);
      const skillCurrent = state.mech_skills[index];
      const diff = value - skillCurrent;

      // Limit per skill: 6
      if (value > 6) return false;
      
      // Total limit: Pilot Level
      if (diff > 0 && (currentPoints + diff) > state.level + 2) {
        return false;
      }

      if (value >= 0) {
        state.mech_skills[index] = value;
        return true;
      }
    }
    return false;
  };

  const setSkillRank = (skillId, rank) => {
    const existing = state.skills.find(s => s.id === skillId);
    const currentRank = existing ? existing.rank : 0;
    
    // Calculate total spent points (each rank is +2, so rank/2 is the point cost)
    const totalSpent = state.skills.reduce((acc, s) => acc + (s.id === skillId ? 0 : s.rank / 2), 0);
    const maxSkills = 4 + state.level;
    
    // Only allow increase if within limit
    if (rank > currentRank && (totalSpent + rank / 2) > maxSkills) {
      return false; // Limit reached
    }

    if (rank === 0) {
      state.skills = state.skills.filter(s => s.id !== skillId);
    } else if (existing) {
      existing.rank = rank;
    } else {
      state.skills.push({ id: skillId, rank });
    }
    return true;
  };

  const setTalentRank = (talentId, rank) => {
    const existing = state.talents.find(t => t.id === talentId);
    const currentRank = existing ? existing.rank : 0;
    
    // Calculate total spent excluding current talent
    const totalSpent = state.talents.reduce((acc, t) => acc + (t.id === talentId ? 0 : t.rank), 0);
    const maxTalents = state.level + 3;
    
    // Only allow increase if within limit
    if (rank > currentRank && (totalSpent + rank) > maxTalents) {
      return false; // Limit reached
    }

    if (rank === 0) {
      state.talents = state.talents.filter(t => t.id !== talentId);
    } else if (existing) {
      existing.rank = rank;
    } else {
      state.talents.push({ id: talentId, rank });
    }
    return true;
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
    setSuperheavyPartner,
    toggleMechSystem,
    updateMechSkill,
    setSkillRank,
    setTalentRank,
    reset
  };
};

export const pilotStore = usePilotCreator();
