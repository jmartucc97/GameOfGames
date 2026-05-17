// Explore-mode engine: render rooms, handle taps, pathfinding, skeleton spawn cycle.
function renderExplore(sceneId) {
  const scene = SCENES[sceneId];
  const roomId = scene.explore_room;
  const room = EXPLORE_ROOMS[roomId];
  if (!room) {
    app.innerHTML = `<div class="scene-text">Error: explore room "${roomId}" not found.</div>`;
    return;
  }
  // Reset any skeleton spawn states to pile on room entry — proximity will re-trigger
  if (state._skel_state) {
    for (const k of Object.keys(state._skel_state)) state._skel_state[k] = "pile";
  }
  // Build entity tile map from the layout
  const grid = room.layout;
  const entityTiles = [];  // [{char, x, y, def}]
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const ch = grid[y][x];
      if (ch !== '#' && ch !== '.' && ch !== 'D') {
        const def = room.entities[ch];
        if (!def) continue;
        if (def.visible && !def.visible(state)) continue;
        entityTiles.push({ char: ch, x, y, def });
      }
    }
  }
  // Blocked tile set (entity tiles are blocked, so player walks adjacent)
  // EXCEPT entities with step_on: true (like a pit), which are walked INTO
  const blockedSet = new Set();
  for (const e of entityTiles) {
    if (!e.def.step_on) blockedSet.add(e.y * ROOM_W + e.x);
  }

  // Player position: saved or spawn
  let playerPos = getExploreState(roomId);
  if (!playerPos) playerPos = { ...room.spawn };
  _exploreState = { roomId, grid, entityTiles, blockedSet, playerPos, room };

  // Compute pixel positions. Use percentage so it scales with viewport.
  const tilePctX = 100 / ROOM_W;
  const tilePctY = 100 / ROOM_H;
  const px = (x) => `${x * tilePctX}%`;
  const py = (y) => `${y * tilePctY}%`;
  const ptw = `${tilePctX}%`;
  const pth = `${tilePctY}%`;

  let html = `<div class="explore-wrap">`;
  html += `<div class="explore-label">${escapeHtml(room.label)}</div>`;
  html += `<div class="explore-room" id="exploreRoom">`;

  // Render door tiles (the southern exit)
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'D') {
        html += `<div class="explore-door" style="left:${px(x)};top:${py(y)};width:${ptw};height:${pth};" data-exit="1"></div>`;
      }
    }
  }
  // Render walls
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === '#') {
        html += `<div class="explore-wall" style="left:${px(x)};top:${py(y)};width:${ptw};height:${pth};"></div>`;
      }
    }
  }
  // Render entities + their hit zones
  for (const e of entityTiles) {
    const spriteName = typeof e.def.sprite === "function" ? e.def.sprite(state) : e.def.sprite;
    const spriteUrl = SPRITES[spriteName] || "";
    const size = e.def.size || 1.5;
    // Center-align the entity sprite on its tile
    const offsetX = (size - 1) / 2;
    const isSearched = e.def.searched_flag && state[e.def.searched_flag];
    const cls = isSearched ? "explore-entity searched" : "explore-entity";
    html += `<img class="${cls}" src="${spriteUrl}" style="left:${px(e.x - offsetX)};top:${py(e.y - (size - 1))};width:${size * tilePctX}%;height:${size * tilePctY}%;" alt="">`;
    // Optional label rendered near the entity (used for doors so players know which is which)
    if (e.def.label) {
      // label_position: "below" (default), "right", "left"
      const pos = e.def.label_position || "below";
      let style;
      if (pos === "right") {
        // Just to the right of the entity, vertically centered on its tile
        style = `left:${px(e.x + 1.2)};top:${py(e.y + 0.4)};`;
      } else if (pos === "left") {
        // Just to the left of the entity, right-anchored so it reads coming in
        style = `right:${(100 - tilePctX * e.x + tilePctX * 0.2).toFixed(2)}%;top:${py(e.y + 0.4)};`;
      } else {
        // Below the entity, centered on its column
        style = `left:${px(e.x + 0.5)};top:${py(e.y + 1)};`;
      }
      html += `<div class="explore-entity-label explore-entity-label-${pos}" style="${style}">${escapeHtml(e.def.label)}</div>`;
    }
    // Hit box covers the entity's tile (slightly larger for easy tapping on mobile)
    const hitSize = 1.4;
    const hitOffset = (hitSize - 1) / 2;
    html += `<div class="explore-entity-hit" data-entity-x="${e.x}" data-entity-y="${e.y}" style="left:${px(e.x - hitOffset)};top:${py(e.y - hitOffset)};width:${hitSize * tilePctX}%;height:${hitSize * tilePctY}%;"></div>`;
  }
  // Render player
  const playerUrl = SPRITES.player_avatar;
  const playerSize = 1.4;
  const pOffsetX = (playerSize - 1) / 2;
  html += `<img class="explore-player" id="explorePlayer" src="${playerUrl}" style="left:${px(playerPos.x - pOffsetX)};top:${py(playerPos.y - (playerSize - 1))};width:${playerSize * tilePctX}%;height:${playerSize * tilePctY}%;" alt="">`;

  html += `</div>`;  // .explore-room
  html += `<div class="explore-hint">${escapeHtml(room.hint || "")}</div>`;
  html += `</div>`;  // .explore-wrap

  app.innerHTML = html;

  // Attach tap handler to the room
  const roomEl = document.getElementById("exploreRoom");
  roomEl.addEventListener("click", (ev) => handleExploreTap(ev, roomEl));

  // Initial proximity check — if player respawned near a pile, spawn it now
  checkExploreProximity(playerPos);
}

function handleExploreTap(ev, roomEl) {
  if (!_exploreState) return;
  if (_exploreWalkTimer) return;  // mid-walk, ignore taps

  const rect = roomEl.getBoundingClientRect();
  const cx = ev.clientX - rect.left;
  const cy = ev.clientY - rect.top;
  const tx = Math.floor(cx / (rect.width / ROOM_W));
  const ty = Math.floor(cy / (rect.height / ROOM_H));

  // Pulse animation at tap point
  const pulse = document.createElement("div");
  pulse.className = "explore-tap-pulse";
  const pulseSize = rect.width / ROOM_W * 0.9;
  pulse.style.left = `${cx - pulseSize/2}px`;
  pulse.style.top = `${cy - pulseSize/2}px`;
  pulse.style.width = `${pulseSize}px`;
  pulse.style.height = `${pulseSize}px`;
  roomEl.appendChild(pulse);
  setTimeout(() => pulse.remove(), 500);

  const { grid, entityTiles, blockedSet, playerPos } = _exploreState;

  // Was an entity tapped?
  const entityTapped = entityTiles.find(e => e.x === tx && e.y === ty);
  if (entityTapped) {
    // Step-on entities (e.g. pit): walk ONTO the tile, then trigger
    if (entityTapped.def.step_on) {
      const path = findPath(grid, playerPos, {x: tx, y: ty}, blockedSet);
      if (path !== null) {
        walkPath(path, () => triggerInteraction(entityTapped));
      }
      return;
    }
    // Normal entities: walk adjacent, then trigger
    const approach = findApproachTile(grid, playerPos, {x: tx, y: ty}, blockedSet);
    if (approach) {
      const path = findPath(grid, playerPos, approach, blockedSet);
      if (path !== null) {
        walkPath(path, () => triggerInteraction(entityTapped));
      }
    }
    return;
  }

  // Was the door tapped?
  if (ty >= 0 && ty < grid.length && tx >= 0 && tx < grid[0].length && grid[ty][tx] === 'D') {
    // Find approach tile for the door (the tile above it)
    const approach = findApproachTile(grid, playerPos, {x: tx, y: ty}, blockedSet);
    if (approach) {
      const path = findPath(grid, playerPos, approach, blockedSet);
      if (path !== null) {
        walkPath(path, () => {
          // Step onto the door and exit
          const doorPath = [{x: tx, y: ty}];
          walkPath(doorPath, () => exitRoom());
        });
      }
    }
    return;
  }

  // Else: walk to that floor tile if possible
  if (ty < 0 || ty >= grid.length || tx < 0 || tx >= grid[0].length) return;
  const tile = grid[ty][tx];
  if (tile === '#') return;  // can't walk into walls
  if (blockedSet.has(ty * ROOM_W + tx)) return;
  const path = findPath(grid, playerPos, {x: tx, y: ty}, blockedSet);
  if (path !== null) walkPath(path, null);
}

function walkPath(path, onComplete) {
  if (!path.length) {
    if (onComplete) onComplete();
    return;
  }
  const playerEl = document.getElementById("explorePlayer");
  let i = 0;
  const stepDur = 180;
  _exploreWalkTimer = setInterval(() => {
    if (i >= path.length) {
      clearInterval(_exploreWalkTimer);
      _exploreWalkTimer = null;
      if (onComplete) onComplete();
      return;
    }
    const next = path[i];
    _exploreState.playerPos = next;
    const tilePctX = 100 / ROOM_W;
    const tilePctY = 100 / ROOM_H;
    const playerSize = 1.4;
    const pOffsetX = (playerSize - 1) / 2;
    playerEl.style.left = `${(next.x - pOffsetX) * tilePctX}%`;
    playerEl.style.top = `${(next.y - (playerSize - 1)) * tilePctY}%`;
    i++;
    // Proximity check: trigger spawn animations on nearby pile-state entities
    checkExploreProximity(next);
    // Step-on check: if we landed on a step-on entity, abort the walk and trigger it
    const stepOnHere = _exploreState.entityTiles.find(e =>
      e.x === next.x && e.y === next.y && e.def.step_on);
    if (stepOnHere) {
      clearInterval(_exploreWalkTimer);
      _exploreWalkTimer = null;
      setTimeout(() => triggerInteraction(stepOnHere), 100);
      return;
    }
  }, stepDur);
}

// Per-entity proximity / spawn-cycle handler.
// When the player walks within `trigger` tiles of an entity in pile state, kick off:
//   pile → spawning (play once) → standing (loop) → wait → despawning → pile
function checkExploreProximity(playerPos) {
  if (!_exploreState) return;
  for (const e of _exploreState.entityTiles) {
    if (!e.def.proximity) continue;
    // Optional gate: state-fn that must return true for proximity to trigger
    if (e.def.proximity.gate && !e.def.proximity.gate(state)) continue;
    const key = e.def.proximity.key;
    const trigger = e.def.proximity.trigger || 2;
    const dx = playerPos.x - e.x;
    const dy = playerPos.y - e.y;
    const dist = Math.abs(dx) + Math.abs(dy);  // Manhattan distance
    if (!state._skel_state) state._skel_state = {};
    const curState = state._skel_state[key] || "pile";
    if (curState === "pile" && dist <= trigger) {
      startSpawnCycle(key, e);
    }
  }
}

// Sprite animation timings — keep in sync with the durations baked into the GIFs.
const SKEL_TIMINGS = {
  lighter: { spawn_ms: 810, stand_ms: 4000, despawn_ms: 720 },
  seeker:  { spawn_ms: 960, stand_ms: 4000, despawn_ms: 880 }
};

function startSpawnCycle(key, entity) {
  if (!state._skel_state) state._skel_state = {};
  if (!state._skel_timers) state._skel_timers = {};
  if (state._skel_timers[key]) {
    state._skel_timers[key].forEach(clearTimeout);
  }
  const t = SKEL_TIMINGS[key] || { spawn_ms: 900, stand_ms: 4000, despawn_ms: 800 };

  // pile → spawning
  state._skel_state[key] = "spawning";
  redrawEntity(entity);

  const t1 = setTimeout(() => {
    state._skel_state[key] = "standing";
    redrawEntity(entity);
    const t2 = setTimeout(() => {
      // Only despawn if player is no longer nearby
      const playerPos = _exploreState ? _exploreState.playerPos : null;
      const trigger = entity.def.proximity.trigger || 2;
      const dist = playerPos
        ? Math.abs(playerPos.x - entity.x) + Math.abs(playerPos.y - entity.y)
        : 999;
      if (dist <= trigger) {
        // Player still close — extend standing
        startStandingExtension(key, entity);
        return;
      }
      state._skel_state[key] = "despawning";
      redrawEntity(entity);
      const t3 = setTimeout(() => {
        state._skel_state[key] = "pile";
        redrawEntity(entity);
      }, t.despawn_ms);
      state._skel_timers[key] = [t3];
    }, t.stand_ms);
    state._skel_timers[key] = [t2];
  }, t.spawn_ms);
  state._skel_timers[key] = [t1];
}

function startStandingExtension(key, entity) {
  if (!state._skel_timers) state._skel_timers = {};
  const t = SKEL_TIMINGS[key] || { spawn_ms: 900, stand_ms: 4000, despawn_ms: 800 };
  const t1 = setTimeout(() => {
    const playerPos = _exploreState ? _exploreState.playerPos : null;
    const trigger = entity.def.proximity.trigger || 2;
    const dist = playerPos
      ? Math.abs(playerPos.x - entity.x) + Math.abs(playerPos.y - entity.y)
      : 999;
    if (dist <= trigger) {
      // Still close — keep extending
      startStandingExtension(key, entity);
      return;
    }
    // Far enough — start despawn
    state._skel_state[key] = "despawning";
    redrawEntity(entity);
    const t2 = setTimeout(() => {
      state._skel_state[key] = "pile";
      redrawEntity(entity);
    }, t.despawn_ms);
    state._skel_timers[key] = [t2];
  }, 2000);
  state._skel_timers[key] = [t1];
}

// Re-render a single entity's <img> in-place without redrawing the whole room.
function redrawEntity(entity) {
  if (!_exploreState) return;
  // Find the entity image by its position; simpler approach: rerender entire room
  // But that resets the player position transition, so we only update the one <img>.
  const room = _exploreState.room;
  const tilePctX = 100 / ROOM_W;
  const tilePctY = 100 / ROOM_H;
  // We can identify the image by its style.left/top
  const imgs = document.querySelectorAll('.explore-entity, .explore-entity.searched');
  // Easier: full-room rerender, then restore player visual position
  const playerEl = document.getElementById('explorePlayer');
  const savedLeft = playerEl ? playerEl.style.left : null;
  const savedTop = playerEl ? playerEl.style.top : null;
  // Light rerender — we just update each entity's img src by walking entityTiles
  const allImgs = document.querySelectorAll('.explore-room img.explore-entity');
  for (let i = 0; i < _exploreState.entityTiles.length && i < allImgs.length; i++) {
    const e = _exploreState.entityTiles[i];
    const spriteName = typeof e.def.sprite === 'function' ? e.def.sprite(state) : e.def.sprite;
    const url = SPRITES[spriteName] || "";
    if (allImgs[i].src !== url) allImgs[i].src = url;
  }
}

function triggerInteraction(entity) {
  // Save player position, then route to the entity's dialogue scene
  saveExploreState(_exploreState.roomId, _exploreState.playerPos);
  cancelSkelTimers();
  _exploreState = null;
  if (_exploreWalkTimer) { clearInterval(_exploreWalkTimer); _exploreWalkTimer = null; }
  const sceneId = typeof entity.def.scene === "function" ? entity.def.scene(state) : entity.def.scene;
  render(sceneId);
}

function exitRoom() {
  const exitTo = _exploreState.room.exit_to;
  // Clear saved position so next entry starts at spawn
  if (state._explore_pos) delete state._explore_pos[_exploreState.roomId];
  cancelSkelTimers();
  _exploreState = null;
  if (_exploreWalkTimer) { clearInterval(_exploreWalkTimer); _exploreWalkTimer = null; }
  render(exitTo);
}

// Cancel any pending skeleton spawn/despawn timers (called on scene exit)
function cancelSkelTimers() {
  if (!state._skel_timers) return;
  for (const key of Object.keys(state._skel_timers)) {
    const arr = state._skel_timers[key];
    if (Array.isArray(arr)) arr.forEach(clearTimeout);
  }
  state._skel_timers = {};
}
