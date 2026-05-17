// Room dimensions and the EXPLORE_ROOMS table (room layouts + entity defs).
const ROOM_W = 11;
const ROOM_H = 14;

const EXPLORE_ROOMS = {
  storage: {
    label: "Storage Room",
    hint: "Tap a pile to rummage. Tap the door to leave.",
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
        size: 1.8,
        label: "Bookcase",
        label_position: "left"
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
    layout: [
      "#####1#####",   // Do Not Enter — north wall, center
      "#.........#",
      "#.........#",
      "#.........#",
      "2.........3",   // Storage west, Exit east
      "#.........#",
      "#.........#",
      "#.........#",
      "#.........#",
      "#.........#",
      "#..K....S.#",   // Seeker K (left), Lighter S (right of John area)
      "#......J..#",   // John spawns here (visible after john_appeared)
      "#.........#",
      "###########",   // solid south wall (no entrance — player wakes up here)
    ],
    spawn: { x: 5, y: 7 },  // middle of the room
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
