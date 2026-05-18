// Main render(): renders a scene by ID, handles choices, routes through gates.
function render(sceneId) {
  let scene = SCENES[sceneId];

  while (scene && scene.route) {
    const next = scene.route(state);
    if (!next) break;  // null/undefined return = no redirect, stay on this scene
    scene = SCENES[next];
    sceneId = next;
  }

  if (!scene) {
    app.innerHTML = `<div class="scene-text">Error: scene "${sceneId}" not found.</div>`;
    return;
  }

  if (scene.set) Object.assign(state, scene.set);

  // Derived flag: Phase 2 with John Prime unlocks after either MtG 13-loop OR speaker save
  state._john_phase2_unlocked = !!(state.mtg_thirteen_done || state.speaker_path_used);

  // EXPLORE MODE: if scene has an explore_room, hand off to the explore renderer.
  if (scene.explore_room) {
    applyBackground(sceneId);
    renderExplore(sceneId);
    return;
  }

  applyBackground(sceneId);

  // Track deaths for the Rasputin hint character
  if (scene.ending && scene.ending_class === "bad" && !state._death_logged) {
    incrementDeaths();
    state._death_logged = true;
  }

  // ---- Music control: scene-aware track selection ----
  let trackForScene = "audio/oogie.mp3";  // default ambient
  // Rasputin scenes (hint character)
  if (sceneId === "scene_rasputin" || sceneId === "scene_rasputin_doom" || sceneId === "scene_rasputin_darkness" || sceneId === "scene_rasputin_fortune") {
    trackForScene = "audio/rasputin.mp3";
  }
  // Forest, kitty store, trader, yoga guy, wishing well, demon doors, mimics
  // — anywhere the player is in or interacting with the forest, plus any
  // legacy drive scenes that may still route here. The forest endings (pit,
  // well drown, sandwich, demon doors, mimics) fall through to the generic
  // "bad ending → gameover" rule below; this branch covers the alive scenes.
  else if (
    sceneId === "scene_forest" ||
    sceneId === "scene_drive_route_select" ||
    sceneId === "scene_drive_hellscape" ||
    sceneId.startsWith("scene_drive_scenic") ||
    sceneId === "scene_drive_back" ||
    sceneId.startsWith("scene_kitty_") ||
    sceneId === "ending_kitty_store_closed" ||
    sceneId.startsWith("scene_trader") ||
    sceneId.startsWith("scene_yoga") ||
    sceneId === "scene_wishing_well" ||
    sceneId === "scene_well_random" ||
    sceneId === "scene_well_good" ||
    sceneId === "scene_demon_doors_sign" ||
    sceneId === "scene_flower_mimic" ||
    sceneId === "scene_mimic_chest"
  ) {
    trackForScene = "audio/funkytown.mp3";
  }
  // First MTG loop with John (Jungle Book)
  else if (sceneId === "scene_mtg_loop" || sceneId === "scene_mtg_check") {
    trackForScene = "audio/jungle.mp3";
  }
  // Second MTG loop (Alan Wake 2)
  else if (sceneId === "scene_mtg_round2_loop" || sceneId === "scene_mtg_round2_check" || sceneId === "scene_mtg_round2_burnout") {
    trackForScene = "audio/alanwake.mp3";
  }
  // EPA gauntlet (Killing in the Name)
  else if (sceneId === "scene_epa_arrives" || sceneId === "scene_epa_1" || sceneId === "scene_epa_2" || sceneId === "scene_epa_3" || sceneId === "ending_epa_bribe" || sceneId === "ending_epa_compliment") {
    trackForScene = "audio/epa.mp3";
  } else if (sceneId === "ending_epa_truth") {
    trackForScene = "audio/gameover.mp3";
  } else if (sceneId === "ending_epa_win") {
    trackForScene = "audio/victory.mp3";
  }
  // Pit gauntlet (Doom Slayer branch)
  else if (sceneId.startsWith("scene_pit_") && !sceneId.startsWith("scene_pit_cycle") && sceneId !== "scene_pit_promoted" && sceneId !== "scene_pit_promotion_10") {
    trackForScene = "audio/doom.mp3";
  } else if (sceneId === "ending_pit_doom_death") {
    trackForScene = "audio/gameover.mp3";
  } else if (sceneId === "ending_pit_win_sowell" || sceneId === "ending_pit_win_election" || sceneId === "ending_pit_win_norbit" || sceneId === "scene_pit_norbit_fakeout") {
    trackForScene = "audio/victory.mp3";
  }
  // Pit supervisor (cycles + final reward + senior promotion)
  else if (sceneId.startsWith("scene_pit_cycle") || sceneId === "scene_pit_promoted" || sceneId === "scene_pit_promotion_10") {
    trackForScene = "audio/hero.mp3";
  } else if (sceneId === "ending_pit_fired") {
    trackForScene = "audio/gameover.mp3";
  }
  // Win endings (true_win for fracking, etc.) — victory music
  else if (scene.ending && scene.ending_class === "win") {
    trackForScene = "audio/victory.mp3";
  }
  // Bad endings outside the pit — game over
  else if (scene.ending && scene.ending_class === "bad") {
    trackForScene = "audio/gameover.mp3";
  }
  // Neutral / regret endings — silence
  else if (scene.ending) {
    trackForScene = null;
  }

  if (trackForScene === null) {
    stopMusic();
  } else {
    playMusic(trackForScene, 0.35);
  }

  // Initialize demon HP when entering a fight scene for the first time
  if (scene.fight && state._currentFightScene !== sceneId) {
    state._currentFightScene = sceneId;
    state.pit_demon_hp = scene.demon_hp != null ? scene.demon_hp : 2;
    state.pit_demon_hp_max = state.pit_demon_hp;
    state.pit_fight_wrong = [];
  }

  let html = "";
  html += buildPitStatus();
  html += buildInventory();

  if (scene.sprite) {
    const spriteName = typeof scene.sprite === "function" ? scene.sprite(state) : scene.sprite;
    if (spriteName && SPRITES[spriteName]) {
      const flashClass = state._demonHitPending ? "demon-hit" : "";
      const extraClass = (spriteName === "samara") ? "samara-anim" : "";
      html += `<img id="demonSprite" class="pixel-art ${flashClass} ${extraClass}" src="${SPRITES[spriteName]}" alt="">`;
      if (state._demonHitPending) state._demonHitPending = false;
    }
  } else if (scene.art) {
    const url = artToDataUrl(scene.art);
    if (url) html += `<img class="pixel-art" src="${url}" alt="">`;
  }

  // Demon HP bar below the sprite (fight scenes only)
  if (scene.fight) {
    let cells = "";
    for (let i = 0; i < state.pit_demon_hp_max; i++) {
      cells += `<div class="demon-hp-cell ${i < state.pit_demon_hp ? 'filled' : ''}"></div>`;
    }
    html += `<div class="demon-hp">${cells}</div>`;
  }

  // Gun overlay removed — it blocked the choice buttons


  if (scene.ending) {
    const cls = scene.ending_class ? ` ${scene.ending_class}` : "";
    html += `<div class="ending-label${cls}">— ${scene.ending_label || "The End"} —</div>`;
  }

  html += `<div class="scene-text">${escapeHtml(resolveText(scene.text))}</div>`;

  if (scene.input) {
    html += `
      <input type="text" class="text-input" id="textInput" placeholder="${escapeHtml(scene.input.placeholder || "")}" autocomplete="off" />
      <button class="submit-button" id="submitInput">Submit</button>
      <div class="input-error" id="inputError"></div>
    `;
    // Render choices alongside input (e.g., a "let me get back to you" escape option)
    if (scene.choices) {
      const visible = scene.choices.filter(isChoiceVisible);
      html += `<div class="choices">`;
      visible.forEach((c, i) => {
        const label = typeof c.text === "function" ? c.text(state) : c.text;
        html += `<button class="choice" data-idx="${i}">${escapeHtml(label)}</button>`;
      });
      html += `</div>`;
      scene._visibleCache = visible;
    }
  } else if (scene.ending) {
    html += `<button class="restart" id="restartBtn">Play again</button>`;
  } else if (scene.character_select) {
    // Custom layout: render each choice as a tappable character card with a
    // sprite preview and an optional hint. Names are intentionally NOT shown
    // in the UI (they live on the choice as `text` for organization only) —
    // we surface them via aria-label so screen readers still identify each card.
    // Click handling still goes through the standard .choice flow.
    const visible = scene.choices.filter(isChoiceVisible);
    html += `<div class="char-select-grid">`;
    visible.forEach((c, i) => {
      const label = typeof c.text === "function" ? c.text(state) : c.text;
      const spriteUrl = (c.sprite && SPRITES[c.sprite]) ? SPRITES[c.sprite] : "";
      const hint = c.hint ? `<div class="char-card-hint">${escapeHtml(c.hint)}</div>` : "";
      const aria = label ? ` aria-label="${escapeHtml(label)}"` : "";
      html += `<button class="choice char-card" data-idx="${i}"${aria}>
        <img class="char-card-sprite" src="${spriteUrl}" alt="">
        ${hint}
      </button>`;
    });
    html += `</div>`;
    scene._visibleCache = visible;
  } else if (scene.choices) {
    let displayChoices;
    if (scene.fight) {
      // For fight scenes: show ALL choices (except those skipped by requires/unless/wrong-list),
      // but mark resource-zero ones as "spent" — clicking them damages the player
      displayChoices = scene.choices.filter(c => {
        if (c.requires) for (const k of c.requires) if (!state[k]) return false;
        if (c.unless) for (const k of c.unless) if (state[k]) return false;
        if (c.id && state.pit_fight_wrong && state.pit_fight_wrong.includes(c.id)) return false;
        return true;
      }).map(c => {
        // Determine if resource is depleted
        let isSpent = false;
        if (c.requires_count) {
          for (const k of c.requires_count) {
            if (!(state[k] > 0)) { isSpent = true; break; }
          }
        }
        return Object.assign({}, c, { spent: isSpent });
      });
    } else {
      displayChoices = scene.choices.filter(isChoiceVisible);
    }
    const visibleFinal = displayChoices;
    html += `<div class="choices">`;
    visibleFinal.forEach((c, i) => {
      const label = typeof c.text === "function" ? c.text(state) : c.text;
      const cls = c.spent ? "choice spent" : "choice";
      html += `<button class="${cls}" data-idx="${i}">${escapeHtml(label)}</button>`;
    });
    html += `</div>`;
    // Replace `visible` with the displayed set for later click-handler reference
    scene._visibleCache = visibleFinal;
  }

  if (!scene.ending) {
    html += `<a class="restart-link" id="restartLink">Restart story</a>`;
  }

  app.innerHTML = html;

  // Resolve a scene ID through any routing chain to its terminal scene
  function resolveTerminal(sceneId, depth) {
    depth = depth || 0;
    if (depth > 10) return null;
    const s = SCENES[sceneId];
    if (!s) return null;
    if (s.route) return resolveTerminal(s.route(state), depth + 1);
    return s;
  }

  if (scene.choices) {
    const visible = scene._visibleCache || scene.choices.filter(isChoiceVisible);
    // Check if any visible choice leads to a terminal ending
    const anyDeadly = visible.some(c => {
      if (!c.next || c.next === "self") return false;
      const t = resolveTerminal(c.next);
      return t && t.ending;
    });

    // Fight scenes: render timer bar at top of screen and start countdown
    let timerId = null;
    let timeoutId = null;
    // Always remove any leftover timer from previous scene
    const oldTimer = document.querySelector(".pit-timer");
    if (oldTimer) oldTimer.remove();
    if (scene.fight) {
      const timerEl = document.createElement("div");
      timerEl.className = "pit-timer";
      timerEl.innerHTML = `<div class="pit-timer-fill" id="timerFill" style="width:100%; transition: width ${scene.fight_seconds || 8}s linear;"></div>`;
      document.body.appendChild(timerEl);
      // Kick off animation on next frame
      requestAnimationFrame(() => {
        const fill = document.getElementById("timerFill");
        if (fill) fill.style.width = "0%";
      });
      // On timeout, treat as a wrong choice (wound)
      timeoutId = setTimeout(() => {
        applyFightWound(sceneId, null);
      }, (scene.fight_seconds || 8) * 1000);
    }

    function clearTimers() {
      if (timeoutId) clearTimeout(timeoutId);
      if (timerId) clearInterval(timerId);
    }

    function applyFightWound(currentSceneId, choiceData) {
      clearTimers();
      // Play hit sound
      playSfx("ow");
      flashDamage();
      state.pit_hp = Math.max(0, (state.pit_hp || 0) - 1);
      // Track this choice as already-wrong so we don't show it on retry
      if (choiceData && choiceData.id) {
        state.pit_fight_wrong = state.pit_fight_wrong || [];
        state.pit_fight_wrong.push(choiceData.id);
      }
      if (state.pit_hp <= 0) {
        render("ending_pit_doom_death");
        return;
      }
      // Re-render same scene (with wound state applied; wrong option filtered by isChoiceVisible)
      render(currentSceneId);
    }

    document.querySelectorAll(".choice").forEach((btn) => {
      btn.addEventListener("click", () => {
        const c = visible[parseInt(btn.dataset.idx)];
        clearTimers();
        // Play sound effect if specified
        if (c.sfx) playSfx(c.sfx);
        if (c.set) Object.assign(state, c.set);
        // Handle named actions
        if (c.action === "increment_mtg") {
          state.mtg_games_played = (state.mtg_games_played || 0) + 1;
        }
        if (c.action === "increment_mtg_round2") {
          state._mtg_round2_games = (state._mtg_round2_games || 0) + 1;
        }
        if (c.action === "increment_drinks") {
          state._drinks_with_john = (state._drinks_with_john || 0) + 1;
        }
        if (c.action === "soft_reset") {
          // Reset all state to fresh (do NOT count as a death)
          resetState();
        }
        // Pit fight resolution
        if (scene.fight) {
          // Plumpy panic — special case, must be checked BEFORE wrong/right
          // resolution. Plumpy steps in, demon dies, player gains a HP and
          // max HP. Falls through to the normal "advance to next scene" logic
          // at the bottom of this handler.
          if (c.action === "plumpy_panic") {
            state.pit_plumpy_available = false;
            state.pit_demon_hp = 0;
            state.pit_hp_max = (state.pit_hp_max || 0) + 1;
            state.pit_hp = (state.pit_hp || 0) + 1;
            state._plumpy_just_saved = true;
            state._currentFightScene = null;
            state.pit_fight_wrong = [];
          }
          // Check if user clicked a SPENT option (special case: still visible but at 0 uses)
          else if (c.spent) {
            // Show "out of ammo" toast AND damage the player
            showAmmoToast(c);
            applyFightWound(sceneId, null);
            return;
          }
          else if (c.correct) {
            // Determine damage to demon
            let dmg = c.instant_kill ? state.pit_demon_hp : 1;
            if (c.consumes) state[c.consumes] = Math.max(0, (state[c.consumes] || 0) - 1);
            state.pit_demon_hp = Math.max(0, state.pit_demon_hp - dmg);
            state._demonHitPending = true;
            if (state.pit_demon_hp > 0) {
              // Demon still alive — re-render same fight scene with reduced HP
              clearTimers();
              render(sceneId);
              return;
            } else {
              // Demon killed — clear fight state and advance
              state._currentFightScene = null;
              state.pit_fight_wrong = [];
            }
          } else {
            // Wrong choice — wound and consume the item
            if (c.consumes) state[c.consumes] = Math.max(0, (state[c.consumes] || 0) - 1);
            applyFightWound(sceneId, c);
            return;
          }
        }
        // Heal action
        if (c.action === "heal_one") {
          state.pit_hp = Math.min(state.pit_hp_max, (state.pit_hp || 0) + 1);
          if (c.consumes) state[c.consumes] = Math.max(0, (state[c.consumes] || 0) - 1);
          playSfx("drink");
        }
        const target = (c.next === "self" || c.next == null) ? sceneId : c.next;
        const targetScene = resolveTerminal(target);
        // Door open animation: brief delay before transition for visual feedback
        if (c.door_anim) {
          const doorImg = document.querySelector(".pixel-art");
          if (doorImg) {
            doorImg.style.transition = "transform 0.3s ease, opacity 0.3s ease";
            doorImg.style.transform = "scale(1.08)";
            doorImg.style.opacity = "0.5";
          }
          playSfx("hit");
          setTimeout(() => render(target), 500);
        } else {
          render(target);
        }
      });
    });
  }

  if (scene.ending) {
    document.getElementById("restartBtn").addEventListener("click", start);
  }

  if (scene.input) {
    const inputEl = document.getElementById("textInput");
    const submitEl = document.getElementById("submitInput");
    const errorEl = document.getElementById("inputError");

    const submit = () => {
      const rawTrimmed = inputEl.value.trim();
      const raw = rawTrimmed.toLowerCase().replace(/[\s,]+/g, "");
      // accept_any mode: any non-empty input is accepted; the original
      // (cased, trimmed) value is stored under input.store_as.
      if (scene.input.accept_any) {
        if (!rawTrimmed) {
          const errMsg = typeof scene.input.error === "function" ? scene.input.error(state) : (scene.input.error || "Please enter something.");
          errorEl.textContent = errMsg;
          return;
        }
        if (scene.input.store_as) state[scene.input.store_as] = rawTrimmed;
        if (scene.input.set) Object.assign(state, scene.input.set);
        render(scene.input.success_next);
        return;
      }
      const accepted = (scene.input.accept || []).map(s => s.toLowerCase().replace(/[\s,]+/g, ""));
      if (accepted.includes(raw)) {
        if (scene.input.set) Object.assign(state, scene.input.set);
        render(scene.input.success_next);
      } else if (scene.input.error_next) {
        // Route to a specific scene on wrong answer (no retry)
        render(scene.input.error_next);
      } else {
        const errMsg = typeof scene.input.error === "function" ? scene.input.error(state) : (scene.input.error || "That's not it. Try again.");
        errorEl.textContent = errMsg;
      }
    };

    submitEl.addEventListener("click", submit);
    inputEl.addEventListener("keypress", (e) => { if (e.key === "Enter") submit(); });
    setTimeout(() => inputEl.focus(), 100);
  }

  const restartLink = document.getElementById("restartLink");
  if (restartLink) restartLink.addEventListener("click", start);

  window.scrollTo(0, 0);
}

function start() {
  stopMusic();
  resetState();
  render(START_SCENE);
}

start();
