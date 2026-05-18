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
  // World dimensions are derived from the room's actual layout. The basement,
  // plumpy, and storage all happen to be ROOM_W x ROOM_H (11 x 14), so for them
  // the world equals the viewport. The forest is larger (24x24) — in that case
  // the viewport stays ROOM_W x ROOM_H and the world scrolls underneath.
  const world_w = grid[0].length;
  const world_h = grid.length;
  const view_w = Math.min(ROOM_W, world_w);
  const view_h = Math.min(ROOM_H, world_h);
  const scrolling = (world_w > view_w) || (world_h > view_h);
  const entityTiles = [];  // [{char, x, y, def}]
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const ch = grid[y][x];
      if (ch !== '#' && ch !== '.' && ch !== 'p' && ch !== 'D') {
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
    if (!e.def.step_on) blockedSet.add(e.y * world_w + e.x);
  }

  // Player position: saved or spawn
  let playerPos = getExploreState(roomId);
  if (!playerPos) playerPos = { ...room.spawn };
  _exploreState = { roomId, grid, entityTiles, blockedSet, playerPos, room,
                    world_w, world_h, view_w, view_h, scrolling };

  // Compute pixel positions as percentages of the WORLD (not the viewport).
  // For non-scrolling rooms world == viewport, so this is unchanged behavior.
  const tilePctX = 100 / world_w;
  const tilePctY = 100 / world_h;
  const px = (x) => `${x * tilePctX}%`;
  const py = (y) => `${y * tilePctY}%`;
  const ptw = `${tilePctX}%`;
  const pth = `${tilePctY}%`;

  let html = `<div class="explore-wrap">`;
  html += `<div class="explore-label">${escapeHtml(room.label)}</div>`;
  const moodClass = room.mood ? ` mood-${room.mood}` : "";
  // Viewport wraps the world. For non-scrolling rooms world === viewport,
  // but the extra wrapping div is harmless. For scrolling rooms the world
  // is sized larger than the viewport and translated via transform.
  const worldScaleX = world_w / view_w;  // 1.0 for static rooms
  const worldScaleY = world_h / view_h;
  const themeClass = room.theme ? ` theme-${room.theme}` : "";
  html += `<div class="explore-viewport${themeClass}" style="aspect-ratio: ${view_w}/${view_h};">`;
  const worldStyle = scrolling
    ? `width:${worldScaleX * 100}%; height:${worldScaleY * 100}%;`
    : `width:100%; height:100%;`;
  html += `<div class="explore-room${moodClass}" id="exploreRoom" style="${worldStyle}">`;

  // Render floor tiles (under everything else). The forest theme uses image
  // tiles (grass with subtle variants); other rooms use the original CSS-gradient
  // haunted-basement floors. Both render a floor under the D exit too.
  const isForest = room.theme === 'forest';
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const ch = grid[y][x];
      const isPath = (ch === 'p' || ch === 'D' || ch === 'P');
      const isGrass = (ch === '.' || (ch !== '#' && ch !== 'p' && ch !== 'P' && ch !== 'D' && room.entities[ch]));
      const walkable = isPath || isGrass;
      if (walkable) {
        if (isForest) {
          // Hash-pick from grass or path variants depending on tile type.
          // `p` (tan path) renders fpath; `.` (clearing) renders fgrass.
          // Entity tiles default to grass (most landmarks are in clearings) —
          // override by checking immediate horizontal neighbors for path.
          let useType = isPath ? 'path' : 'grass';
          if (room.entities[ch] && !isPath) {
            // Entity (letter) — inherit from a path neighbor if one is adjacent
            // (the pit P already maps to path above, but other entities use this).
            const left  = x > 0 ? grid[y][x-1] : '';
            const right = x < grid[y].length-1 ? grid[y][x+1] : '';
            const above = y > 0 ? grid[y-1][x] : '';
            const below = y < grid.length-1 ? grid[y+1][x] : '';
            if (left === 'p' || right === 'p' || above === 'p' || below === 'p') useType = 'path';
          }
          const h = (x * 7 + y * 13 + (room.seed || 0)) % 11;
          const variant = (h % 3);
          const sprite = (useType === 'path') ? `fpath_${variant}` : `fgrass_${variant}`;
          const url = SPRITES[sprite] || "";
          html += `<img class="explore-floor-tile forest-floor" src="${url}" style="left:${px(x)};top:${py(y)};width:${ptw};height:${pth};" alt="">`;
        } else {
          const h = (x * 7 + y * 13 + (room.seed || 0)) % 17;
          let cls = "explore-floor-tile";
          if (h === 3 || h === 11) cls += " floor-stain";
          else if (h === 7) cls += " floor-scratch";
          html += `<div class="${cls}" style="left:${px(x)};top:${py(y)};width:${ptw};height:${pth};"></div>`;
        }
      }
    }
  }
  // Render walls. Forest theme renders walls as the SAME grass texture
  // as the floor — visually identical, so the wall mass blends seamlessly
  // with clearings. Trees and other props (in room.ambient) are what make
  // forest cells visually different from open clearings. The walls still
  // BLOCK movement; only their appearance is unified with the grass.
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === '#') {
        if (isForest) {
          const h = (x * 11 + y * 7 + (room.seed || 0)) % 11;
          const variant = h % 3;
          const url = SPRITES[`fgrass_${variant}`] || "";
          html += `<img class="explore-wall forest-wall-tile" src="${url}" style="left:${px(x)};top:${py(y)};width:${ptw};height:${pth};" alt="">`;
        } else {
          const h = (x * 11 + y * 7 + (room.seed || 0)) % 19;
          let cls = "explore-wall";
          if (h === 4 || h === 13) cls += " wall-cracked";
          else if (h === 8 || h === 16) cls += " wall-stained";
          html += `<div class="${cls}" style="left:${px(x)};top:${py(y)};width:${ptw};height:${pth};"></div>`;
        }
      }
    }
  }
  // Render door tiles (the southern exit). Door is rendered LARGE so it's
  // unmistakable as a tappable exit, and gets an expanded transparent hit
  // overlay so even imprecise taps near the door land successfully. The
  // door also pulses subtly to draw the eye.
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'D') {
        const url = SPRITES.ddoor_closed || "";
        const doorSize = 3;            // up from 2 — more obvious as an exit
        const dOffX = (doorSize - 1) / 2;
        // Visible door image
        html += `<img class="explore-door-img" src="${url}" style="left:${px(x - dOffX)};top:${py(y - (doorSize - 1))};width:${doorSize * tilePctX}%;height:${doorSize * tilePctY}%;" alt="" data-exit="1">`;
        // Expanded transparent hit overlay — covers a 5x4 area around the
        // door for forgiving taps. Pointer events on this overlay route to
        // the door's exit handler via data-exit.
        const hitW = 5;
        const hitH = 4;
        const hitOffX = (hitW - 1) / 2;
        html += `<div class="explore-door-hit" style="left:${px(x - hitOffX)};top:${py(y - (hitH - 1))};width:${hitW * tilePctX}%;height:${hitH * tilePctY}%;" data-exit="1"></div>`;
      }
    }
  }
  // Render ambient (non-interactive) decoration sprites — defined per room in room.ambient
  if (room.ambient && room.ambient.length) {
    for (const a of room.ambient) {
      const url = SPRITES[a.sprite] || "";
      const sz = a.size || 1.0;
      const xOff = (sz - 1) / 2;
      const yOff = sz - 1;
      const extraCls = a.flicker ? " amb-flicker" : "";
      html += `<img class="explore-ambient${extraCls}" src="${url}" style="left:${px(a.x - xOff)};top:${py(a.y - yOff)};width:${sz * tilePctX}%;height:${sz * tilePctY}%;" alt="">`;
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
  // Render player. The current avatar comes from state._character (the prefix)
  // plus state._facing (current direction); we use frame 0 (idle) on initial draw.
  // Falls back to the legacy player_avatar gif if no character is selected
  // (e.g. dev hot-loading directly into a room).
  const playerUrl = getPlayerSpriteUrl(state._facing || "south", 0);
  const playerSize = 1.4;
  const pOffsetX = (playerSize - 1) / 2;
  html += `<img class="explore-player" id="explorePlayer" src="${playerUrl}" style="left:${px(playerPos.x - pOffsetX)};top:${py(playerPos.y - (playerSize - 1))};width:${playerSize * tilePctX}%;height:${playerSize * tilePctY}%;" alt="">`;

  html += `</div>`;  // .explore-room (the world)
  html += `</div>`;  // .explore-viewport
  html += `<div class="explore-hint">${escapeHtml(room.hint || "")}</div>`;
  html += `</div>`;  // .explore-wrap

  app.innerHTML = html;

  // Attach tap handler to the VIEWPORT (stable position; world translates inside it).
  // The room element (exploreRoom) is the world inside the viewport.
  const roomEl = document.getElementById("exploreRoom");
  const viewportEl = roomEl.parentElement;  // the .explore-viewport wrapper
  viewportEl.addEventListener("click", (ev) => handleExploreTap(ev, viewportEl));

  // Position camera for scrolling rooms — center on player, clamp to bounds
  updateCamera();

  // Initial proximity check — if player respawned near a pile, spawn it now
  checkExploreProximity(playerPos);
}

// Update camera transform on the world element to keep player centered in
// the viewport. For non-scrolling rooms this resolves to translate(0,0).
function updateCamera() {
  if (!_exploreState) return;
  const { scrolling, playerPos, world_w, world_h, view_w, view_h } = _exploreState;
  const roomEl = document.getElementById("exploreRoom");
  if (!roomEl) return;
  if (!scrolling) {
    roomEl.style.transform = "translate(0, 0)";
    return;
  }
  // Target: shift world so player is at viewport center (in tile coords)
  let targetX = playerPos.x - view_w / 2 + 0.5;
  let targetY = playerPos.y - view_h / 2 + 0.5;
  // Clamp to world bounds
  targetX = Math.max(0, Math.min(world_w - view_w, targetX));
  targetY = Math.max(0, Math.min(world_h - view_h, targetY));
  // Translate as percentage of world's own width/height
  const txPct = -(targetX / world_w) * 100;
  const tyPct = -(targetY / world_h) * 100;
  roomEl.style.transform = `translate(${txPct}%, ${tyPct}%)`;
}

function handleExploreTap(ev, viewportEl) {
  if (!_exploreState) return;
  if (_exploreWalkTimer) return;  // mid-walk, ignore taps

  // If the click target has data-exit="1" (door image or hit overlay),
  // route directly to the door cell. This catches taps on the expanded
  // transparent hit zone around the door, so imprecise taps still work.
  if (ev.target && ev.target.dataset && ev.target.dataset.exit === "1") {
    const { grid, blockedSet, playerPos } = _exploreState;
    // Locate the D cell — there's only one per room
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 'D') {
          const approach = findApproachTile(grid, playerPos, {x, y}, blockedSet);
          if (approach) {
            const path = findPath(grid, playerPos, approach, blockedSet);
            if (path !== null) {
              walkPath(path, () => walkPath([{x, y}], () => exitRoom()));
            }
          }
          return;
        }
      }
    }
    return;
  }

  const { grid, entityTiles, blockedSet, playerPos,
          world_w, world_h, view_w, view_h, scrolling } = _exploreState;
  const rect = viewportEl.getBoundingClientRect();
  const cx = ev.clientX - rect.left;
  const cy = ev.clientY - rect.top;
  // Pixel-per-visible-tile (using viewport dims, since that's what the user sees)
  const tilePxX = rect.width / view_w;
  const tilePxY = rect.height / view_h;
  // Visible tile under tap
  const visibleX = cx / tilePxX;
  const visibleY = cy / tilePxY;
  // Camera offset (in tiles) — same math as updateCamera
  let camX = 0, camY = 0;
  if (scrolling) {
    camX = Math.max(0, Math.min(world_w - view_w, playerPos.x - view_w / 2 + 0.5));
    camY = Math.max(0, Math.min(world_h - view_h, playerPos.y - view_h / 2 + 0.5));
  }
  const tx = Math.floor(visibleX + camX);
  const ty = Math.floor(visibleY + camY);

  // Pulse animation at tap point (in viewport, stays put for the brief animation)
  const pulse = document.createElement("div");
  pulse.className = "explore-tap-pulse";
  const pulseSize = tilePxX * 0.9;
  pulse.style.left = `${cx - pulseSize/2}px`;
  pulse.style.top = `${cy - pulseSize/2}px`;
  pulse.style.width = `${pulseSize}px`;
  pulse.style.height = `${pulseSize}px`;
  viewportEl.appendChild(pulse);
  setTimeout(() => pulse.remove(), 500);

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
  if (blockedSet.has(ty * world_w + tx)) return;
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
  let walkFrame = 0;        // toggles 0 / 1 each tile step
  const stepDur = 180;
  _exploreWalkTimer = setInterval(() => {
    if (i >= path.length) {
      clearInterval(_exploreWalkTimer);
      _exploreWalkTimer = null;
      // Settle to idle frame in the last-walked direction
      if (playerEl) playerEl.src = getPlayerSpriteUrl(state._facing || "south", 0);
      if (onComplete) onComplete();
      return;
    }
    const next = path[i];
    // Direction from delta: prefer the larger axis (we only move 4-way here so
    // exactly one of dx/dy is nonzero, but be defensive in case that changes).
    const dx = next.x - _exploreState.playerPos.x;
    const dy = next.y - _exploreState.playerPos.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      if (dx > 0) state._facing = "east";
      else if (dx < 0) state._facing = "west";
    } else {
      if (dy > 0) state._facing = "south";
      else if (dy < 0) state._facing = "north";
    }
    _exploreState.playerPos = next;
    // Player position is a percentage of the WORLD (not viewport) — same as render.
    const tilePctX = 100 / _exploreState.world_w;
    const tilePctY = 100 / _exploreState.world_h;
    const playerSize = 1.4;
    const pOffsetX = (playerSize - 1) / 2;
    playerEl.style.left = `${(next.x - pOffsetX) * tilePctX}%`;
    playerEl.style.top = `${(next.y - (playerSize - 1)) * tilePctY}%`;
    // Swap sprite to match the new direction + the alternating walk frame
    walkFrame ^= 1;
    playerEl.src = getPlayerSpriteUrl(state._facing, walkFrame);
    // Update camera (for scrolling rooms — no-op for static)
    updateCamera();
    i++;
    // Proximity check: trigger spawn animations on nearby pile-state entities
    checkExploreProximity(next);
    // Step-on check: if we landed on a step-on entity, abort the walk and trigger it.
    // Decorative entities (e.g. bushes) are walked over but never trigger anything.
    const stepOnHere = _exploreState.entityTiles.find(e =>
      e.x === next.x && e.y === next.y && e.def.step_on && !e.def.decorative);
    if (stepOnHere) {
      clearInterval(_exploreWalkTimer);
      _exploreWalkTimer = null;
      if (playerEl) playerEl.src = getPlayerSpriteUrl(state._facing || "south", 0);
      setTimeout(() => triggerInteraction(stepOnHere), 100);
      return;
    }
  }, stepDur);
}

// Resolves the current player sprite URL given facing + walk frame.
// Falls back to the legacy player_avatar gif if the selected character key
// isn't registered (shouldn't happen in normal play, but keeps the renderer
// robust against half-initialized state).
function getPlayerSpriteUrl(facing, frame) {
  const id = state._character;
  if (id) {
    const key = `${id}_${facing}_${frame}`;
    if (SPRITES[key]) return SPRITES[key];
  }
  return SPRITES.player_avatar || "";
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
  const tilePctX = 100 / _exploreState.world_w;
  const tilePctY = 100 / _exploreState.world_h;
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
  // Decorative entities (no scene attached) never trigger anything.
  if (!entity.def.scene) return;
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
