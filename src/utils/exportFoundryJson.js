import {
  frames as framesData,
  weapons as weaponsData,
  systems as systemsData,
  pilot_gear as pilotGearData,
  skills as skillsData,
  talents as talentsData
} from "lancer-data-pt-br";

function generateId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const STATS_TEMPLATE = {
  coreVersion: "13.351",
  systemId: "lancer",
  systemVersion: "3.0.0"
};

const DEFAULT_TOKEN = (name, img) => ({
  name: name,
  displayName: 30,
  actorLink: true,
  width: 1,
  height: 1,
  texture: {
    src: img || "systems/lancer/assets/icons/pilot.svg",
    anchorX: 0.5, anchorY: 0.5, offsetX: 0, offsetY: 0, fit: "contain", scaleX: 1, scaleY: 1, rotation: 0, tint: "#ffffff", alphaThreshold: 0.75
  },
  lockRotation: false,
  rotation: 0,
  alpha: 1,
  disposition: 1,
  displayBars: 50,
  bar1: { attribute: "hp" },
  bar2: { attribute: "heat" },
  light: { negative: false, priority: 0, alpha: 0.5, angle: 360, bright: 0, color: null, coloration: 1, dim: 0, attenuation: 0.5, luminosity: 0.5, saturation: 0, contrast: 0, shadows: 0, animation: { type: null, speed: 5, intensity: 5, reverse: false }, darkness: { min: 0, max: 1 } },
  sight: { enabled: false, range: 0, angle: 360, visionMode: "basic", color: null, attenuation: 0.1, brightness: 0, saturation: 0, contrast: 0 },
  detectionModes: [],
  occludable: { radius: 0 },
  ring: { enabled: false, colors: { ring: null, background: null }, effects: 1, subject: { scale: 1, texture: null } },
  turnMarker: { mode: 1, animation: null, src: null, disposition: false },
  movementAction: null,
  flags: {},
  randomImg: false,
  appendNumber: false,
  prependAdjective: false
});

const DEFAULT_ACTION_TRACKER = {
  protocol: false,
  move: 0,
  full: false,
  quick: false,
  reaction: false,
  free: false,
  used_reactions: []
};

/**
 * Converts a bonus from lancer-data format to the Foundry/LAS format.
 * Armor.svelte calls Object.keys() on damage_types, range_types, weapon_sizes,
 * weapon_types — so these MUST be present and be objects, never undefined.
 */
function normalizePilotBonus(b) {
  return {
    lid: b.lid || b.id || "",
    val: String(b.val ?? ""),
    damage_types: b.damage_types ?? {
      Kinetic: true, Energy: true, Explosive: true,
      Heat: true, Burn: true, Variable: true
    },
    range_types: b.range_types ?? {
      Range: true, Threat: true, Thrown: true,
      Line: true, Cone: true, Blast: true, Burst: true
    },
    weapon_sizes: b.weapon_sizes ?? {
      Auxiliary: true, Main: true, Heavy: true, Superheavy: true
},
weapon_types: b.weapon_types ?? {
  Rifle: true, Cannon: true, Launcher: true,
  CQB: true, Nexus: true, Melee: true
},
  overwrite: b.overwrite ?? false,
    replace: b.replace ?? false
  };
}

export function generateFoundryPilot(state, mechActorId) {

  const items = [];
  const loadoutRefs = { armor: [], gear: [], weapons: [] };

  // Skills
  state.skills.forEach(s => {
    const data = skillsData.find(sd => sd.id === s.id);
    items.push({
      name: data ? data.name : s.id,
      type: "skill",
      _id: generateId(),
      system: { lid: s.id, curr_rank: s.rank / 2, description: data?.description || "" },
      img: "systems/lancer/assets/icons/skill.svg",
      _stats: STATS_TEMPLATE,
      effects: [], flags: {}, sort: 0
    });
  });

  // Talents
  state.talents.forEach(t => {
    const data = talentsData.find(td => td.id === t.id);
    items.push({
      name: data ? data.name : t.id,
      type: "talent",
      _id: generateId(),
      system: { lid: t.id, curr_rank: t.rank, description: data?.description || "" },
      img: "systems/lancer/assets/icons/talent.svg",
      _stats: STATS_TEMPLATE,
      effects: [], flags: {}, sort: 0
    });
  });

  const addPilotItem = (id, type, collection) => {
    if (!id) return;
    const data = pilotGearData.find(gd => gd.id === id);
    const fvttId = generateId();

    // Build the system object using real data from the database when available
    const baseSystem = {
      actions: (data?.actions ?? []).map(a => Object.assign({}, a)),
      bonuses: (data?.bonuses ?? []).map(b => normalizePilotBonus(b)),
      synergies: (data?.synergies ?? []).map(s => Object.assign({}, s)),
      counters: (data?.counters ?? []).map(c => Object.assign({}, c)),
      deployables: (data?.deployables ?? []).map(d => Object.assign({}, d)),
      tags: (data?.tags ?? []).map(t => ({ lid: t.id || t.lid || "", val: t.val ?? "" })),
      uses: 0,
      integrated: [],
      lid: id,
      description: data?.description || ""
    };

    if (type === "pilot_weapon") {
      baseSystem.range = (data?.range ?? [{ type: "Threat", val: 1 }]).map(r => Object.assign({}, r));
      baseSystem.damage = (data?.damage ?? [{ type: "Kinetic", val: "1" }]).map(d => Object.assign({}, d));
      baseSystem.loaded = false;
      if (data?.effect) baseSystem.effect = data.effect;
    }

    if (type === "pilot_armor") {
      if (data?.hp_bonus !== undefined) baseSystem.hp_bonus = data.hp_bonus;
      if (data?.evasion !== undefined) baseSystem.evasion = data.evasion;
      if (data?.edef !== undefined) baseSystem.edef = data.edef;
      if (data?.speed !== undefined) baseSystem.speed = data.speed;
      if (data?.effect) baseSystem.effect = data.effect;
    }

    if (type === "pilot_gear") {
      if (data?.effect) baseSystem.effect = data.effect;
      if (data?.uses !== undefined) baseSystem.uses = data.uses;
    }

    items.push({
      name: data ? data.name : id,
      type: type,
      _id: fvttId,
      system: baseSystem,
      img: type === "pilot_armor"
        ? "systems/lancer/assets/icons/role_tank.svg"
        : type === "pilot_weapon"
          ? "systems/lancer/assets/icons/role_artillery.svg"
          : "systems/lancer/assets/icons/generic_item.svg",
      _stats: STATS_TEMPLATE,
      effects: [], flags: {}, sort: 0
    });
    loadoutRefs[collection].push(fvttId);
  };

  addPilotItem(state.loadout.armor, "pilot_armor", "armor");
  state.loadout.weapons.forEach(id => addPilotItem(id, "pilot_weapon", "weapons"));
  state.loadout.gear.forEach(id => addPilotItem(id, "pilot_gear", "gear"));

  // Licenses
  if (state.licenses) {
    state.licenses.forEach(l => {
      const fData = framesData.find(fd => fd.id === l.id);
      if (fData) {
        items.push({
          name: fData.name,
          type: "license",
          _id: generateId(),
          system: {
            lid: `lic_${l.id}`,
            key: l.id,
            manufacturer: fData.source || "GMS",
            curr_rank: l.rank
          },
          img: "systems/lancer/assets/icons/license.svg",
          _stats: STATS_TEMPLATE,
          effects: [], flags: {}, sort: 0
        });
      }
    });
  }

  const grit = Math.ceil((state.level || 0) / 2);
  const pilotImg = state.image || "systems/lancer/assets/icons/pilot.svg";

  return {
    name: state.name || state.callsign,
    type: "pilot",
    img: pilotImg,
    system: {
      active_mech: mechActorId ? `Actor.${mechActorId}` : null,
      background: state.background,
      history: "",
      last_cloud_update: "never",
      level: state.level,
      loadout: loadoutRefs,
      hull: state.mech_skills[0],
      agi: state.mech_skills[1],
      sys: state.mech_skills[2],
      eng: state.mech_skills[3],
      mounted: false,
      notes: state.bio || "",
      text_appearance: "",
      bond_state: { xp: { min: 0, max: 8, value: 0 }, stress: { min: 0, max: 8, value: 0 }, xp_checklist: { major_ideals: [false, false, false], minor_ideal: false, veteran_power: false }, answers: [], burdens: [], clocks: [] },
      lid: "",
      burn: 0,
      activations: 1,
      custom_counters: [],
      hp: { min: 0, max: 6 + grit, value: 6 + grit },
      overshield: { min: 0, max: 14, value: 0 },
      inherited_effects: null,
      action_tracker: DEFAULT_ACTION_TRACKER,
      callsign: state.callsign,
      cloud_id: ""
    },
    items: items,
    effects: [],
    folder: null,
    flags: {},
    prototypeToken: DEFAULT_TOKEN(state.callsign || state.name, pilotImg),
    _stats: STATS_TEMPLATE
  };
}

export function generateFoundryMech(state, pilotActorId) {
  const items = [];
  const frameData = framesData.find(f => f.id === state.activeMech.frame);
  const frameFvttId = generateId();

  if (frameData) {
    items.push({
      name: frameData.name,
      type: "frame",
      _id: frameFvttId,
      system: {
        lid: frameData.id,
        description: frameData.description || "",
        core_system: frameData.core_system ? {
          name: frameData.core_system.name || "",
          active_name: frameData.core_system.active_name || "",
          active_effect: frameData.core_system.active_effect || "",
          activation: frameData.core_system.activation || "Quick",
          description: frameData.core_system.description || "",
          deactivation: frameData.core_system.deactivation || ""
        } : undefined
      },
      img: "systems/lancer/assets/icons/mech.svg",
      _stats: STATS_TEMPLATE,
      effects: [], flags: {}, sort: 0
    });
  }

  const weaponMounts = [];
  if (frameData && frameData.mounts) {
    frameData.mounts.forEach((mType, mIdx) => {
      const slots = [];
      const slotSizes = mType.includes('/') ? mType.split('/') : [mType];
      slotSizes.forEach((size, sIdx) => {
        const weaponId = state.activeMech.mounts[`${mIdx}_${sIdx}`];
        if (weaponId) {
          const wData = weaponsData.find(w => w.id === weaponId);
          const fvttId = generateId();
          items.push({
            name: wData ? wData.name : weaponId,
            type: "mech_weapon",
            _id: fvttId,
            system: { lid: weaponId, description: wData?.description || "" },
            img: "systems/lancer/assets/icons/weapon.svg",
            _stats: STATS_TEMPLATE,
            effects: [], flags: {}, sort: 0
          });
          slots.push({ size, weapon: fvttId, mod: null });
        } else {
          slots.push({ size, weapon: null, mod: null });
        }
      });
      weaponMounts.push({ type: mType, slots, bracing: false });
    });
  }

  const systemRefs = [];
  state.activeMech.systems.forEach(sId => {
    const sData = systemsData.find(sd => sd.id === sId);
    const fvttId = generateId();
    items.push({
      name: sData ? sData.name : sId,
      type: "mech_system",
      _id: fvttId,
      system: { lid: sId, description: sData?.description || "" },
      img: "systems/lancer/assets/icons/mech_system.svg",
      _stats: STATS_TEMPLATE,
      effects: [], flags: {}, sort: 0
    });
    systemRefs.push(fvttId);
  });

  const baseHp = frameData ? frameData.stats.hp : 10;
  const baseHeat = frameData ? frameData.stats.heatcap : 6;
  const baseRep = frameData ? frameData.stats.repcap : 5;
  const mechImg = state.activeMech.image || "systems/lancer/assets/icons/mech.svg";

  return {
    name: state.activeMech.name || "UNNAMED MECH",
    type: "mech",
    img: mechImg,
    system: {
      pilot: pilotActorId ? `Actor.${pilotActorId}` : null,
      overcharge: 0,
      repairs: { min: 0, max: baseRep + Math.floor(state.mech_skills[0] / 2), value: baseRep + Math.floor(state.mech_skills[0] / 2) },
      core_active: false,
      core_energy: 1,
      loadout: { frame: frameFvttId, weapon_mounts: weaponMounts, systems: systemRefs },
      notes: "",
      lid: "mech-" + state.id,
      burn: 0,
      activations: 1,
      custom_counters: [],
      hp: { min: 0, max: baseHp + (state.mech_skills[0] * 2), value: baseHp + (state.mech_skills[0] * 2) },
      overshield: { min: 0, max: 0, value: 0 },
      heat: { min: 0, max: baseHeat + state.mech_skills[3], value: 0 },
      stress: { min: 0, max: 4, value: 4 },
      structure: { min: 0, max: 4, value: 4 },
      action_tracker: DEFAULT_ACTION_TRACKER,
      inherited_effects: pilotActorId ? { from_uuid: `Actor.${pilotActorId}`, visible: true } : null
    },
    items: items,
    effects: [],
    folder: null,
    flags: {},
    prototypeToken: DEFAULT_TOKEN(state.activeMech.name, mechImg),
    _stats: STATS_TEMPLATE
  };
}

export function downloadFoundryExport(state) {
  const pilotFvttId = generateId();
  const mechFvttId = generateId();

  const mechActor = generateFoundryMech(state, pilotFvttId);
  mechActor._id = mechFvttId;

  const pilotActor = generateFoundryPilot(state, mechFvttId);
  pilotActor._id = pilotFvttId;

  const download = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  download(pilotActor, `fvtt-Actor-${state.callsign.toLowerCase() || 'pilot'}-${pilotFvttId}.json`);

  setTimeout(() => {
    download(mechActor, `fvtt-Actor-${state.activeMech.name.toLowerCase().replace(/\s+/g, '-') || 'mech'}-${mechFvttId}.json`);
  }, 600);
}
