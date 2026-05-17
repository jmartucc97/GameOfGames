// Sound effects (WebAudio synth) + UI toasts for failed actions.
function playSfx(name) {
  // Plays a short sound effect. Uses tiny WebAudio synth tones for now (no asset files).
  try {
    const ctx = window._audioCtx || (window._audioCtx = new (window.AudioContext || window.webkitAudioContext)());
    if (ctx.state === "suspended") ctx.resume();
    const presets = {
      gunshot: { freq: 80,  type: "square",   dur: 0.12, decay: 0.18 },
      chainsaw:{ freq: 140, type: "sawtooth", dur: 0.5,  decay: 0.6  },
      shot:    { freq: 200, type: "square",   dur: 0.10, decay: 0.15 },
      hit:     { freq: 60,  type: "sine",     dur: 0.15, decay: 0.25 },
      ow:      { freq: 320, type: "sawtooth", dur: 0.18, decay: 0.3  },
      drink:   { freq: 540, type: "sine",     dur: 0.25, decay: 0.35 },
      magic:   { freq: 880, type: "triangle", dur: 0.3,  decay: 0.5  },
      explode: { freq: 50,  type: "square",   dur: 0.4,  decay: 0.6  },
    };
    const p = presets[name] || presets.shot;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = p.type;
    osc.frequency.setValueAtTime(p.freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(p.freq * 0.4, ctx.currentTime + p.dur);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + p.decay);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + p.decay);
  } catch (e) {
    // sound failures are non-fatal
  }
}

function showAmmoToast(choice) {
  // Briefly show a toast message reminding the player they're out of that resource
  const existing = document.querySelector(".ammo-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "ammo-toast";
  toast.textContent = "Out of ammo";
  document.body.appendChild(toast);
  // Small screen shake but no flash, no damage
  document.body.classList.add("screen-shake");
  setTimeout(() => document.body.classList.remove("screen-shake"), 250);
  // Audio cue: empty-click dry sound
  playSfx("hit");
  setTimeout(() => toast.remove(), 1100);
}

function flashDamage() {
  const flash = document.createElement("div");
  flash.className = "damage-flash";
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 500);
  document.body.classList.add("screen-shake");
  setTimeout(() => document.body.classList.remove("screen-shake"), 450);
}

function buildInventory() {
  if (state.pit_initiated) return "";  // pit gauntlet uses pit-status instead
  const items = [];
  if (state.has_flashlight)  items.push({ label: "flashlight",     cat: "tool" });
  if (state.has_ssn)         items.push({ label: "SSN card",       cat: "doc" });
  if (state.has_passport)    items.push({ label: "passport",       cat: "doc" });
  if (state.has_speaker)     items.push({ label: "speaker",        cat: "tool" });
  if (state.has_note)        items.push({ label: "scrap of paper", cat: "doc" });
  if (state.has_zynns)       items.push({ label: "Zynns",          cat: "misc" });
  if (state.has_plums)       items.push({ label: "plums",          cat: "food" });
  if (state.has_mtg_deck)    items.push({ label: "MtG deck",       cat: "misc" });
  if (state.has_charger)     items.push({ label: "USB charger",    cat: "tool" });
  if (state.has_kalashnikov) items.push({ label: "Kalashnikov",    cat: "weapon" });
  if (state.has_bananas)     items.push({ label: "10²¹ bananas",   cat: "food" });
  if (state.has_tube)        items.push({ label: "treat tube",     cat: "gift" });
  if (state.has_hard_treats) items.push({ label: "hard treats",    cat: "gift" });
  if (state.has_catnip)      items.push({ label: "catnip",         cat: "gift" });
  if (!items.length) return "";
  const chips = items.map(i =>
    `<span class="inv-chip ${i.cat}"><span class="dot"></span>${i.label}</span>`
  ).join("");
  return `<div class="inventory"><span class="inventory-label">Carrying</span>${chips}</div>`;
}

function isChoiceVisible(c) {
  if (c.requires) for (const k of c.requires) if (!state[k]) return false;
  if (c.unless) for (const k of c.unless) if (state[k]) return false;
  if (c.requires_count) {
    for (const k of c.requires_count) if (!(state[k] > 0)) return false;
  }
  // For fight scenes: skip choices already tried in current fight
  if (c.id && state.pit_fight_wrong && state.pit_fight_wrong.includes(c.id)) return false;
  return true;
}

function resolveText(t) {
  return typeof t === "function" ? t(state) : t;
}
