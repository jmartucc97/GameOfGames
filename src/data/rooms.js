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
    // Ambient decorations removed — they were confusing players about
    // what was interactable. Bare rooms read more clearly.
    ambient: [],
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
    ambient: [],
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
        // Dirt cross pit — visual is 3 tiles wide × 3 tall, but only the
        // exact tile coord triggers step_on. Walking along the edge is
        // a slight visual cheat the player won't notice in practice.
        sprite: "dpit_3x3",
        scene: "scene_pit_confirm",
        size: 3,
        step_on: true,
        visible: (s) => !!s.has_pit
      },
      "L": {
        // Locked back door — swaps closed/open based on reactor state.
        sprite: (s) => s.reactor_powered ? "ddoor_open" : "ddoor_closed",
        scene: (s) => s.reactor_powered ? "scene_backroom_router" : "scene_locked_door_message",
        size: 1.5
      },
      "D": {}
    },
    exit_to: "scene_test"
  },

  forest: {
    label: "Forest",
    hint: "Tap to walk. The trail heads north. Detours branch east and west.",
    theme: "forest",
    seed: 47,
    // 24x24 hybrid world: main path south->north with optional clearings on
    // either side at the crossroad (row 12). North clearing has the yoga
    // guy and wishing well; main path has a hidden pit trap; west/east
    // edges have the demon-doors sign and the flower mimic.
    layout: [
      "########################",  //  0
      "########################",  //  1
      "##########......########",  //  2  north clearing
      "##########X....W########",  //  3  X = chest mimic, W = wishing well
      "##########..Y...########",  //  4  Y = yoga guy
      "###########....#########",  //  5
      "############..##########",  //  6
      "############..##########",  //  7
      "############..##########",  //  8
      "############..##########",  //  9
      "#####S..####..####..F###",  // 10  S = demon-doors sign, F = flower mimic
      "####..K..###..###..M..##",  // 11  K = kitty stump, M = trader
      "####.................###",  // 12  crossroad
      "############..##########",  // 13
      "############..##########",  // 14
      "############..##########",  // 15
      "############..##########",  // 16
      "############P.##########",  // 17  P = pit trap (step-on)
      "############..##########",  // 18
      "############..##########",  // 19
      "############..##########",  // 20
      "############..##########",  // 21
      "############.D##########",  // 22  D = entry from basement
      "########################",  // 23
    ],
    ambient: [],
    spawn: { x: 13, y: 21 },  // just north of the entry door (D at 13,22), facing into the forest
    entities: {
      "K": {
        // Kitty store landmark — a stump/rock cluster marking the building.
        sprite: "fbigrock",
        scene: "scene_kitty_store",
        size: 1.6,
        label: "Kitty Store",
        label_position: "below"
      },
      "M": {
        // The trader, standing in his east-clearing camp.
        sprite: "trader_idle",
        scene: "scene_trader",
        size: 1.4,
        label: "Trader",
        label_position: "below"
      },
      "Y": {
        // Yoga guy in the north clearing — dialogue trap (no death, just hard to leave).
        sprite: "epa_man",
        scene: "scene_yoga_guy",
        size: 1.4
      },
      "W": {
        // Wishing well — a rock formation. Random outcome on use.
        sprite: "fbigrock",
        scene: "scene_wishing_well",
        size: 1.6
      },
      "S": {
        // The infamous demon-doors sign.
        sprite: "three_doors",
        scene: "scene_demon_doors_sign",
        size: 1.4
      },
      "F": {
        // A pretty flower in a circle of bare earth. Bait.
        sprite: "flower_mimic_idle",
        scene: "scene_flower_mimic",
        size: 1.3
      },
      "P": {
        // Pit trap covered by leaves. Step-on, no warning.
        sprite: "bottomless_pit",
        scene: "ending_forest_pit",
        size: 1.0,
        step_on: true
      },
      "X": {
        // Chest mimic — looks like loot, eats you when opened.
        sprite: "mimic_idle",
        scene: "scene_mimic_chest",
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
      "#..T....t.#",   // Tiki T (red, left), Tiki t (green, right)
      "###########",   // solid south wall (no entrance — player wakes up here)
    ],
    spawn: { x: 5, y: 7 },  // middle of the room
    ambient: [],
    entities: {
      "1": {
        // Do Not Enter — north wall
        sprite: "ddoor_closed",
        scene: "scene_donotenter_router",
        size: 1.5,
        label: "Do Not Enter",
        label_position: "below"
      },
      "2": {
        // Storage — west wall, label appears to the right (inside the room)
        sprite: "ddoor_closed",
        scene: "scene_detritus",
        size: 1.5,
        label: "Storage",
        label_position: "right"
      },
      "3": {
        // Exit — east wall, label appears to the left (inside the room)
        sprite: "ddoor_closed",
        scene: "scene_exit_router",
        size: 1.5,
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
      },
      "T": {
        sprite: "tiki_red",
        scene: "scene_tiki_red",
        size: 1.6
      },
      "t": {
        sprite: "tiki_green",
        scene: "scene_tiki_green",
        size: 1.6
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
