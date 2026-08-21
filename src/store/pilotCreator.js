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
      mount_overrides: {}, // { mount_index: type }
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
    state.activeMech.mount_overrides = {}; // Reset overrides on frame change
    state.activeMech.systems = []; // Reset systems on frame change
    state.activeMech.sh_partners = {}; // Reset SH partners
  };

  const setMechMountOverride = (mountIdx, type) => {
    if (type === null) {
      delete state.activeMech.mount_overrides[mountIdx];
    } else {
      state.activeMech.mount_overrides[mountIdx] = type;
    }
  };

  const setMechName = (name) => {
    state.activeMech.name = name;
  };

  const setMechMountWeapon = (mountKey, weaponId) => {
    if (weaponId === null) {
      delete state.activeMech.mounts[mountKey];
      
      // If this was slot 0 of a mountIdx, clear any superheavy partner link
      const [mIdx, sIdx] = mountKey.split('_').map(Number);
      if (sIdx === 0 && state.activeMech.sh_partners[mIdx] !== undefined) {
        delete state.activeMech.sh_partners[mIdx];
      }
    } else {
      state.activeMech.mounts[mountKey] = weaponId;
    }
  };

  const setSuperheavyPartner = (mountIdx, partnerIdx) => {
    if (partnerIdx === null || partnerIdx === undefined) {
      delete state.activeMech.sh_partners[mountIdx];
    } else {
      state.activeMech.sh_partners[mountIdx] = partnerIdx;
      // Clear any weapons stored in the newly blocked partner mount so it remains clean
      delete state.activeMech.mounts[`${partnerIdx}_0`];
      delete state.activeMech.mounts[`${partnerIdx}_1`];
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

  const savePilot = async () => {
    const pilotData = { ...state, lastSaved: new Date().toISOString() };
    
    // 1. Save to Local (Backup)
    const saved = JSON.parse(localStorage.getItem('lancer_saved_pilots') || '[]');
    const index = saved.findIndex(p => p.id === state.id);
    if (index > -1) saved[index] = pilotData;
    else saved.push(pilotData);
    try {
      localStorage.setItem('lancer_saved_pilots', JSON.stringify(saved));
    } catch (e) {
      console.warn("Falha ao salvar piloto no LocalStorage (Limite Excedido):", e.message);
    }

    // Remove from deleted list if it was there
    const deletedIds = JSON.parse(localStorage.getItem('lancer_deleted_pilots') || '[]');
    const filteredDeleted = deletedIds.filter(id => id !== state.id);
    try {
      localStorage.setItem('lancer_deleted_pilots', JSON.stringify(filteredDeleted));
    } catch (e) {
      console.warn("Falha ao atualizar lista de excluídos no LocalStorage (Limite Excedido):", e.message);
    }

    // 2. Try Cloud Save
    let cloudSynced = false;
    try {
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('lancer_auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch('/api/pilots', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(pilotData)
      });
      if (!response.ok) throw new Error('Cloud save failed');
      console.log("Sincronizado com a nuvem");
      cloudSynced = true;
    } catch (e) {
      console.warn("Salvando apenas localmente:", e.message);
    }
    
    return { success: true, cloudSynced };
  };

  const getSavedPilots = async () => {
    const localPilots = JSON.parse(localStorage.getItem('lancer_saved_pilots') || '[]');
    const deletedIds = JSON.parse(localStorage.getItem('lancer_deleted_pilots') || '[]');

    let remotePilots = [];
    let isOnline = false;

    // Try fetching from the cloud
    try {
      const response = await fetch('/api/pilots');
      if (response.ok) {
        remotePilots = await response.json();
        isOnline = true;
      }
    } catch (e) {
      console.warn("Falha ao conectar com o servidor remoto. Usando banco de dados local.", e.message);
    }

    if (!isOnline) {
      // Offline: just return the local list
      return localPilots;
    }

    // Process pending deletions on remote (only if logged in)
    const token = localStorage.getItem('lancer_auth_token');
    const successfulDeletes = [];
    if (token) {
      for (const id of deletedIds) {
        try {
          const headers = { 'Authorization': `Bearer ${token}` };
          const delResponse = await fetch(`/api/pilots?id=${id}`, { 
            method: 'DELETE',
            headers: headers
          });
          if (delResponse.ok) {
            successfulDeletes.push(id);
          }
        } catch (e) {
          console.warn(`Falha ao sincronizar deleção do piloto ${id} na nuvem:`, e.message);
        }
      }
    }
    // Update local deleted list
    if (successfulDeletes.length > 0) {
      const updatedDeletedIds = deletedIds.filter(id => !successfulDeletes.includes(id));
      try {
        localStorage.setItem('lancer_deleted_pilots', JSON.stringify(updatedDeletedIds));
      } catch (e) {
        console.warn("Falha ao atualizar lista de excluídos no LocalStorage (Limite Excedido):", e.message);
      }
    }

    // Create a map to merge local and remote pilots
    const localMap = new Map(localPilots.map(p => [p.id, p]));
    const remoteMap = new Map(remotePilots.map(p => [p.id, p]));
    const allIds = new Set([...localMap.keys(), ...remoteMap.keys()]);
    const mergedList = [];
    const updatedLocalDeletedIds = JSON.parse(localStorage.getItem('lancer_deleted_pilots') || '[]');

    for (const id of allIds) {
      // If the pilot is marked as deleted locally, skip it
      if (updatedLocalDeletedIds.includes(id)) {
        continue;
      }

      const localPilot = localMap.get(id);
      const remotePilot = remoteMap.get(id);

      if (localPilot && remotePilot) {
        const localTime = new Date(localPilot.lastSaved || 0).getTime();
        const remoteTime = new Date(remotePilot.lastSaved || 0).getTime();

        if (localTime > remoteTime) {
          // Local is newer, upload to remote (only if logged in)
          mergedList.push(localPilot);
          if (token) {
            try {
              const headers = { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              };
              await fetch('/api/pilots', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(localPilot)
              });
            } catch (e) {
              console.warn(`Falha ao sincronizar piloto ${localPilot.callsign || id} na nuvem:`, e.message);
            }
          }
        } else {
          // Remote is newer (or equal), use remote
          mergedList.push(remotePilot);
        }
      } else if (localPilot) {
        // Only local exists, upload to remote (only if logged in)
        mergedList.push(localPilot);
        if (token) {
          try {
            const headers = { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            };
            await fetch('/api/pilots', {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(localPilot)
            });
          } catch (e) {
            console.warn(`Falha ao salvar piloto local ${localPilot.callsign || id} na nuvem:`, e.message);
          }
        }
      } else if (remotePilot) {
        // Only remote exists, download to local
        mergedList.push(remotePilot);
      }
    }

    // Save finalized synced list to local storage
    try {
      localStorage.setItem('lancer_saved_pilots', JSON.stringify(mergedList));
    } catch (e) {
      console.warn("Falha ao salvar lista final de pilotos no LocalStorage (Limite Excedido):", e.message);
    }
    return mergedList;
  };

  const loadPilot = (pilotData) => {
    Object.keys(pilotData).forEach(key => {
      if (state.hasOwnProperty(key)) {
        state[key] = pilotData[key];
      }
    });
  };

  const deletePilot = async (id) => {
    // 1. Delete Local
    const saved = JSON.parse(localStorage.getItem('lancer_saved_pilots') || '[]');
    const filtered = saved.filter(p => p.id !== id);
    try {
      localStorage.setItem('lancer_saved_pilots', JSON.stringify(filtered));
    } catch (e) {
      console.warn("Falha ao remover piloto do LocalStorage (Limite Excedido):", e.message);
    }

    // Add to deleted list
    const deletedIds = JSON.parse(localStorage.getItem('lancer_deleted_pilots') || '[]');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      try {
        localStorage.setItem('lancer_deleted_pilots', JSON.stringify(deletedIds));
      } catch (e) {
        console.warn("Falha ao registrar exclusão no LocalStorage (Limite Excedido):", e.message);
      }
    }

    // 2. Delete Cloud
    try {
      const headers = {};
      const token = localStorage.getItem('lancer_auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const delResponse = await fetch(`/api/pilots?id=${id}`, { 
        method: 'DELETE',
        headers: headers
      });
      if (delResponse.ok) {
        // Remove from deleted list since it succeeded
        const updatedDeleted = JSON.parse(localStorage.getItem('lancer_deleted_pilots') || '[]').filter(dId => dId !== id);
        try {
          localStorage.setItem('lancer_deleted_pilots', JSON.stringify(updatedDeleted));
        } catch (e) {
          console.warn("Falha ao limpar registro de exclusão no LocalStorage:", e.message);
        }
      }
    } catch (e) {
      console.warn("Erro ao deletar da nuvem");
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
    state.licenses = [];
    state.loadout = { armor: null, weapons: [], gear: [] };
    state.activeMech = {
      name: "Mecha Ativo",
      frame: "mf_standard_pattern_i_everest",
      mounts: {},
      mount_overrides: {},
      systems: [],
      sh_partners: {}
    };
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
    setMechMountOverride,
    setSuperheavyPartner,
    toggleMechSystem,
    updateMechSkill,
    setSkillRank,
    setTalentRank,
    savePilot,
    getSavedPilots,
    loadPilot,
    deletePilot,
    reset
  };
};

export const pilotStore = usePilotCreator();
