// Game state: defaults, resetState, persistence of death counts.
let state = {};

function resetState() {
  state = {
    has_flashlight: false,
    has_ssn: false,
    has_passport: false,
    has_speaker: false,
    has_note: false,
    has_zynns: false,
    has_plums: false,
    has_pit: false,
    has_bananas: false,
    kitty_late: false,
    has_tube: false,
    has_hard_treats: false,
    has_catnip: false,
    reactor_powered: false,
    wish_used: false,
    met_plumpy: false,
    investigated_noise: false,
    met_cat: false,
    knows_skeleton_spell: false,
    mtg_played: false,
    tiki_tried: false,
    tiki_taken: false,
    has_mtg_deck: false,
    has_charger: false,
    has_kalashnikov: false,
    mtg_games_played: 0,
    john_appeared: false,
    john_handled: false,
    samara_eligible_john_call: false,
    samara_round: 0,
    samara_spawned: false,
    samara_resolved: false,
    speaker_path_used: false,
    charger_path_used: false,
    mtg_thirteen_done: false,
    _john_phase2_unlocked: false,
    _drinks_with_john: 0,
    _mtg_round2_games: 0,
    plumpy_lit_room: false,
    // -- Player avatar (set by character-select scene) --
    _character: null,        // sprite-name prefix, e.g. "char_brown"
    _facing: "south",        // last direction the player moved; drives sprite swap
    // -- Pit gauntlet state --
    pit_initiated: false,
    pit_hp: 3,
    pit_hp_max: 3,
    pit_backup: null,     // "glock" | "chainsaw" | "flintlock"
    pit_backup_uses: 0,
    pit_support: null,    // "suncruisers" | "whiskey" | "plumwine"
    pit_support_uses: 0,
    pit_special: null,    // "speaker" | "catnip_banana" | "holy_water"
    pit_special_uses: 0,
    pit_special_uses_speaker: false,
    pit_special_uses_banana: false,
    pit_special_uses_holy: false,
    pit_wildcard: null,   // "election" | "sowell" | "norbit"
    pit_wildcard_uses: 0,
    pit_wildcard_uses_election: false,
    pit_wildcard_uses_sowell: false,
    pit_wildcard_uses_norbit: false,
    pit_kalash_uses: 8,
    pit_plumpy_available: true,
    pit_demon_hp: 0,
    pit_demon_hp_max: 2,
    pit_act: 0,
    // Per-fight tracking (resets per encounter)
    pit_fight_wrong: [],  // tracks which wrong picks player has made in current fight
    fracking_initiated: false,
    frack_q1_wrong: false,
    frack_q2_wrong: false,
    frack_q3_wrong: false,
    frack_q1_pick: null,
    frack_q2_pick: null,
    frack_q3_pick: null,
    _turns: 0,
    _near_misses: 0,
    _deaths: getPersistedDeaths(),
    _rasputin_available: getPersistedDeaths() >= 2,
    _rasputin_summoned: false,
    _basement_entered: false,
    _skel_state: {},
    _skel_timers: {},
  };
}

function getPersistedDeaths() {
  try {
    return parseInt(localStorage.getItem("gog_deaths") || "0", 10) || 0;
  } catch { return 0; }
}

function incrementDeaths() {
  try {
    const cur = getPersistedDeaths();
    localStorage.setItem("gog_deaths", String(cur + 1));
    state._deaths = cur + 1;
  } catch {}
}

const app = document.getElementById("app");

function artToDataUrl(artLines) {
  if (!artLines || !artLines.length) return null;
  const width = Math.max(...artLines.map(l => l.length));
  const height = artLines.length;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  for (let y = 0; y < height; y++) {
    const line = artLines[y];
    for (let x = 0; x < line.length; x++) {
      const ch = line[x];
      const color = PALETTE[ch];
      if (color && color !== "transparent") {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  return canvas.toDataURL();
}

function buildPitStatus() {
  if (!state.pit_initiated) return "";
  const hp = state.pit_hp;
  const max = state.pit_hp_max;
  let cells = "";
  for (let i = 0; i < max; i++) {
    cells += `<div class="pit-hp-cell ${i < hp ? 'filled' : ''}"></div>`;
  }
  // Ammo summary chips (compact)
  const ammoRows = [];
  if (state.pit_kalash_uses > 0) ammoRows.push({ name: "Kalash", uses: state.pit_kalash_uses, max: 8 });
  if (state.pit_backup) ammoRows.push({ name: backupLabel(state.pit_backup), uses: state.pit_backup_uses, max: 6 });
  if (state.pit_support) ammoRows.push({ name: supportLabel(state.pit_support), uses: state.pit_support_uses, max: 2 });
  if (state.pit_special && state.pit_special_uses > 0) ammoRows.push({ name: specialLabel(state.pit_special), uses: state.pit_special_uses, max: 1 });
  if (state.pit_wildcard && state.pit_wildcard_uses > 0) ammoRows.push({ name: wildcardLabel(state.pit_wildcard), uses: state.pit_wildcard_uses, max: 1 });
  const ammoHtml = ammoRows.map(r => {
    let dots = "";
    for (let i = 0; i < r.max; i++) {
      dots += `<div class="pit-ammo-dot ${i >= r.uses ? 'spent' : ''}"></div>`;
    }
    return `<div class="pit-ammo-row"><span>${r.name}</span><span class="pit-ammo-dots">${dots}</span></div>`;
  }).join("");
  return `<div class="pit-status">
    <div class="pit-hp-block">
      <div class="pit-hp-label">Vitals — Hit Points</div>
      <div class="pit-hp-bar" id="pitHpBar">${cells}</div>
    </div>
    <div class="pit-ammo">${ammoHtml}</div>
  </div>`;
}

function backupLabel(key) {
  return { chainsaw: "Chainsaw", whip: "Whip", broadsword: "Broadsword" }[key] || key;
}
function supportLabel(key) {
  return { suncruisers: "Suncruisers", whiskey: "Whiskey", plumwine: "Plum Wine" }[key] || key;
}
function specialLabel(key) {
  return { speaker: "Speaker", catnip_banana: "Catnip Banana", holy_water: "Holy Water" }[key] || key;
}
function wildcardLabel(key) {
  return { election: "2024 Results", sowell: "Basic Economics", norbit: "Norbit Blu-Ray" }[key] || key;
}

// ---- Background music control ----
let _bgmAudio = null;
let _bgmCurrentSrc = null;

function playMusic(src, volume) {
  if (volume == null) volume = 0.35;
  // If already playing this src, leave it alone
  if (_bgmAudio && _bgmCurrentSrc === src && !_bgmAudio.paused) return;
  stopMusic();
  _bgmAudio = new Audio(src);
  _bgmAudio.loop = true;
  _bgmAudio.volume = volume;
  _bgmCurrentSrc = src;
  // Browsers block autoplay until a user gesture; play() returns a Promise that may reject
  const p = _bgmAudio.play();
  if (p && typeof p.catch === "function") p.catch(() => { /* swallow autoplay errors */ });
}

function stopMusic() {
  if (_bgmAudio) {
    try { _bgmAudio.pause(); } catch {}
    _bgmAudio = null;
    _bgmCurrentSrc = null;
  }
}
