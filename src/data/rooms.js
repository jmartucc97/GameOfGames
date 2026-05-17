// Room dimensions and the EXPLORE_ROOMS table (room layouts + entity defs).
const ROOM_W = 11;
const ROOM_H = 14;

const EXPLORE_ROOMS = {
  storage: {
    label: "Storage Room",
    hint: "Tap a pile to rummage. Tap the door to leave.",
    mood: "storage",
    seed: 11,
    layout: [
      "###########",
      "#.........#",
      "#..3......#",
      "#.........#",
      "#......R..#",
      "#..F......#",
      "#....2....#",
      "#.........#",
      "#.......B.#",
      "#..1......#",
      "#.........#",
      "#.........#",
      "#.........#",
      "####D######",
    ],
    // Ambient (non-interactive) decorations. x,y in tile coordinates, size in tiles.
    ambient: [
      { sprite: "amb_cobweb",   x: 1.05, y: 1.4,  size: 1.1 },     // top-left corner cobweb
      { sprite: "amb_cobweb",   x: 9.5,  y: 1.4,  size: 1.1 },     // top-right corner cobweb (mirrored visually OK)
      { sprite: "amb_dust",     x: 6.5,  y: 11.7, size: 0.9 },     // dust pile near bookcase
      { sprite: "amb_dust",     x: 2.5,  y: 7.5,  size: 0.85 },    // dust near pile 1
      { sprite: "amb_crate",    x: 9.0,  y: 2.5,  size: 1.0 },     // stacked crate top-right
      { sprite: "amb_crate",    x: 9.0,  y: 11.5, size: 1.0 },     // crate bottom-right
      { sprite: "amb_tarp",     x: 7.5,  y: 6.5,  size: 1.3 },     // tarp covering something
      { sprite: "amb_calendar", x: 2.0,  y: 3.0,  size: 0.9 },     // calendar on left wall
    ],
    // Where the player appears when entering this room.
    spawn: { x: 5, y: 12 },
    // Entities keyed by layout char.
    // sprite: name in SPRITES table to render.
    // scene: dialogue scene to trigger when player reaches and interacts.
    // visible: optional state-fn — if returns false, entity is hidden.
    // searched_flag: optional state key — when set, entity renders dimmed.
    entities: {
      "1": {
        sprite: "chest_closed",
        scene: "scene_pile_1",
        size: 1.6,
        searched_flag: null
      },
      "2": {
        sprite: "pile2_junk",
        scene: "scene_pile_2",
        size: 1.8,
        searched_flag: null
      },
      "3": {
        sprite: "altar_temple",
        scene: "scene_pile_3",
        size: 2.0,
        searched_flag: null
      },
      "R": {
        sprite: "rasputin",
        scene: "scene_rasputin",
        size: 1.5,
        visible: (s) => !!s._rasputin_summoned
      },
      "F": {
        sprite: "flower_mimic_idle",
        scene: "scene_mimic_inspect",
        size: 1.4,
        visible: (s) => !s._mimic_eaten
      },
      "B": {
        sprite: "bookcase",
        scene: "scene_bookcase",
        size: 1.8
      },
      "D": {
        // Door is rendered separately (not an entity), but we include it for symmetry.
        // The room renderer handles 'D' tiles as exit doors.
      }
    },
    // Where the player exits to when stepping on the door tile.
    exit_to: "scene_test"
  },

  plumpy: {
    label: "Plumpy's Room",
    hint: "Tap to walk. Tap an object to interact. Mind the pit.",
    mood: "plumpy",
    seed: 23,
    layout: [
      "###########",
      "###L#######",   // locked back door (north wall)
      "#.........#",
      "#.........#",
      "#..R..B...#",   // reactor R, K-40 barrel B
      "#.........#",
      "#.........#",
      "#....P....#",   // Plumpy center
      "#.........#",
      "#..H......#",   // bottomless pit H (only visible if has_pit)
      "#.........#",
      "#.........#",
      "#.........#",
      "####D######",   // entrance/exit south
    ],
    ambient: [
      { sprite: "amb_pipe_v",   x: 1.0,  y: 2.5,  size: 1.2 },     // pipe down left wall
      { sprite: "amb_pipe_v",   x: 9.5,  y: 2.5,  size: 1.2 },     // pipe down right wall
      { sprite: "amb_sticker",  x: 4.0,  y: 1.2,  size: 0.7 },     // biohazard near locked door
      { sprite: "amb_barrel",   x: 8.5,  y: 5.5,  size: 0.95 },    // small barrel near reactor
      { sprite: "amb_barrel",   x: 8.5,  y: 6.5,  size: 0.95 },    // stacked
      { sprite: "amb_clipboard",x: 6.5,  y: 4.0,  size: 0.9 },     // clipboard between reactor + barrel
      { sprite: "amb_workbench",x: 7.5,  y: 11.5, size: 1.4 },     // workbench bottom area
      { sprite: "amb_dust",     x: 2.5,  y: 11.5, size: 0.8 },     // dust near south entry
    ],
    spawn: { x: 5, y: 12 },
    entities: {
      "P": {
        sprite: "plumpy_sprite",
        scene: "scene_plumpy_talk",
        size: 1.6
      },
      "R": {
        sprite: (s) => s.reactor_powered ? "reactor_on" : "reactor_off",
        scene: (s) => s.reactor_powered ? "scene_reactor_inspect_on" : "scene_reactor_inspect",
        size: 2.2
      },
      "B": {
        sprite: "k40_barrel",
        scene: "scene_barrel_inspect",
        size: 1.4
      },
      "H": {
        sprite: "bottomless_pit",
        scene: "scene_pit_confirm",
        size: 1.5,
        step_on: true,
        visible: (s) => !!s.has_pit
      },
      "L": {
        // Locked back door — uses door sprite that swaps based on reactor state
        sprite: (s) => s.reactor_powered ? "door_open" : "door_locked",
        scene: (s) => s.reactor_powered ? "scene_backroom_router" : "scene_locked_door_message",
        size: 1.2
      },
      "D": {}
    },
    exit_to: "scene_test"
  },

  basement: {
    label: "Basement",
    hint: "Three doors. Tap one to choose.",
    mood: "basement",
    seed: 37,
    layout: [
      "#####1#####",   // Do Not Enter — north wall, center
      "#.........#",
      "#.........#",
      "#.........#",
      "2.........3",   // Storage west, Exit east
      "#.........#",
      "#....J....#",   // John spawns here (visible after john_appeared)
      "#.........#",
      "#.........#",
      "#.........#",
      "#..K....S.#",   // Seeker K (left), Lighter S (right)
      "#.........#",
      "#.........#",
      "###########",   // solid south wall (no entrance — player wakes up here)
    ],
    spawn: { x: 5, y: 7 },  // middle of the room
    ambient: [
      { sprite: "amb_lamp",     x: 5.0,  y: 1.6,  size: 1.0, flicker: true },  // hanging bulb near top
      { sprite: "amb_cobweb",   x: 1.05, y: 1.4,  size: 1.0 },                  // top-left cobweb
      { sprite: "amb_cobweb",   x: 9.5,  y: 1.4,  size: 1.0 },                  // top-right cobweb
      { sprite: "amb_pipe_v",   x: 1.0,  y: 8.5,  size: 1.2 },                  // pipe west wall
      { sprite: "amb_sticker",  x: 5.0,  y: 0.9,  size: 0.65 },                 // small biohazard on DNE door
      { sprite: "amb_dust",     x: 2.0,  y: 12.5, size: 0.85 },                 // dust corners
      { sprite: "amb_dust",     x: 9.0,  y: 12.5, size: 0.85 },
      { sprite: "amb_crate",    x: 9.0,  y: 5.5,  size: 0.95 },                 // single crate east side
    ],
    entities: {
      "1": {
        // Do Not Enter — north wall
        sprite: "door_locked",
        scene: "scene_donotenter_router",
        size: 1.2,
        label: "Do Not Enter",
        label_position: "below"
      },
      "2": {
        // Storage — west wall, label appears to the right (inside the room)
        sprite: "door_locked",
        scene: "scene_detritus",
        size: 1.2,
        label: "Storage",
        label_position: "right"
      },
      "3": {
        // Exit — east wall, label appears to the left (inside the room)
        sprite: "door_locked",
        scene: "scene_exit_router",
        size: 1.2,
        label: "Exit",
        label_position: "left"
      },
      "J": {
        sprite: "john_basement",
        scene: "scene_john_basement",
        size: 1.4,
        visible: (s) => !!s.john_appeared
      },
      "S": {
        sprite: (s) => {
          const st = (s._skel_state && s._skel_state.lighter) || "pile";
          if (st === "spawning") return "skeleton_lighter_spawn";
          if (st === "standing") return "skeleton_lighter_idle";
          if (st === "despawning") return "skeleton_lighter_despawn";
          return "skeleton_lighter_pile";
        },
        scene: (s) => s.knows_skeleton_spell ? "scene_skeleton_lighter" : "scene_skeleton_silent",
        size: 1.4,
        proximity: { trigger: 2, key: "lighter", gate: (s) => !!s.knows_skeleton_spell }
      },
      "K": {
        sprite: (s) => {
          const st = (s._skel_state && s._skel_state.seeker) || "pile";
          if (st === "spawning") return "skeleton_seeker_spawn";
          if (st === "standing") return "skeleton_seeker_idle";
          if (st === "despawning") return "skeleton_seeker_despawn";
          return "skeleton_seeker_pile";
        },
        scene: (s) => s.knows_skeleton_spell ? "scene_skeleton_seeker" : "scene_skeleton_silent",
        size: 1.4,
        proximity: { trigger: 2, key: "seeker", gate: (s) => !!s.knows_skeleton_spell }
      }
    },
    exit_to: null   // no auto-exit — basement IS the hub
  }
};

// Per-room cached player position so re-entering the room doesn't reset position.
// We default to room.spawn unless state._explore_pos[roomId] has been saved.
function getExploreState(roomId) {
  if (!state._explore_pos) state._explore_pos = {};
  return state._explore_pos[roomId];
}
function saveExploreState(roomId, pos) {
  if (!state._explore_pos) state._explore_pos = {};
  state._explore_pos[roomId] = { x: pos.x, y: pos.y };
}

// BFS pathfinding over a tile grid. Returns array of {x,y} from start (exclusive) to goal (inclusive).
// Returns null if unreachable.
function findPath(grid, start, goal, blockedSet) {
  if (start.x === goal.x && start.y === goal.y) return [];
  const W = grid[0].length;
  const H = grid.length;
  const key = (x, y) => y * W + x;
  const visited = new Set([key(start.x, start.y)]);
  const queue = [{ x: start.x, y: start.y, path: [] }];
  while (queue.length) {
    const cur = queue.shift();
    for (const [dx, dy] of [[0,-1],[1,0],[0,1],[-1,0]]) {
      const nx = cur.x + dx, ny = cur.y + dy;
      if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
      if (visited.has(key(nx, ny))) continue;
      const tile = grid[ny][nx];
      // Goal tile is always reachable (we may want to walk onto an entity tile's neighbor)
      if (!(nx === goal.x && ny === goal.y)) {
        if (tile === '#') continue;
        if (blockedSet && blockedSet.has(key(nx, ny))) continue;
      }
      const newPath = cur.path.concat([{x: nx, y: ny}]);
      if (nx === goal.x && ny === goal.y) return newPath;
      visited.add(key(nx, ny));
      queue.push({ x: nx, y: ny, path: newPath });
    }
  }
  return null;
}

// Find the closest walkable tile adjacent to (tx, ty). Used so the player
// walks UP TO an entity rather than onto it.
function findApproachTile(grid, from, target, blockedSet) {
  const W = grid[0].length;
  const H = grid.length;
  const candidates = [];
  for (const [dx, dy] of [[0,-1],[1,0],[0,1],[-1,0]]) {
    const nx = target.x + dx, ny = target.y + dy;
    if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
    if (grid[ny][nx] === '#') continue;
    const k = ny * W + nx;
    if (blockedSet && blockedSet.has(k)) continue;
    // Pathfind from `from` to this candidate
    const path = findPath(grid, from, {x: nx, y: ny}, blockedSet);
    if (path !== null) candidates.push({ x: nx, y: ny, dist: path.length });
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => a.dist - b.dist);
  return { x: candidates[0].x, y: candidates[0].y };
}

let _exploreState = null;  // Holds active room state while in explore mode.
let _exploreWalkTimer = null;
