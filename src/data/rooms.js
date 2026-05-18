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
    // SIMPLE LAYOUT: a tan path with grass on each side runs south-to-north
    // from the basement door. Two clearings open off the crossroad: kitty
    // store to the west, trader to the east. Two traps remain — the chest
    // mimic in the north clearing, and the flower mimic by the trader.
    layout: [
      "########################",  //  0
      "########################",  //  1
      "########################",  //  2
      "###########.p.##########",  //  3  north clearing entrance
      "##########..p..#########",  //  4
      "########.....p......####",  //  5  north clearing (grass)
      "########..X..p....Y....#",  //  6  X = chest mimic at col 10; Y = yoga guy at col 18
      "########.....p......####",  //  7
      "##########..p..#########",  //  8
      "###########.p.##########",  //  9
      "###########.p.##########",  // 10
      "###########.p.##########",  // 11
      "####.Kpppppppp.........#",  // 12  K = kitty store + WEST path branch
      "####........pppppppp..F#",  // 13  F = flower mimic + EAST path branch
      "####........p......M..##",  // 14  M = trader
      "###########.p.##########",  // 15
      "###########.p.##########",  // 16
      "###########.p.##########",  // 17
      "###########.p.##########",  // 18
      "###########.p.##########",  // 19
      "###########.p.##########",  // 20
      "###########.p.##########",  // 21
      "###########.D.##########",  // 22  D = entry door
      "########################",  // 23
    ],
    ambient: [
      { sprite: "ftree_pine", x: 1, y: 4, size: 2.5 },
      { sprite: "ftree_pine", x: 3, y: 4, size: 2.5 },
      { sprite: "ftree_oak", x: 5, y: 4, size: 2.5 },
      { sprite: "ftree_oak", x: 7, y: 4, size: 2.5 },
      { sprite: "ftree_pine", x: 9, y: 4, size: 2.5 },
      { sprite: "ftree_oak", x: 15, y: 4, size: 2.5 },
      { sprite: "ftree_oak", x: 17, y: 4, size: 2.5 },
      { sprite: "ftree_pine", x: 19, y: 4, size: 2.5 },
      { sprite: "ftree_pine", x: 21, y: 4, size: 2.5 },
      { sprite: "ftree_pine", x: 23, y: 4, size: 2.5 },
      { sprite: "ftree_oak", x: 2, y: 6, size: 2.5 },
      { sprite: "ftree_oak", x: 4, y: 6, size: 2.5 },
      { sprite: "ftree_pine", x: 6, y: 6, size: 2.5 },
      { sprite: "ftree_oak", x: 1, y: 8, size: 2.5 },
      { sprite: "ftree_pine", x: 3, y: 8, size: 2.5 },
      { sprite: "ftree_pine", x: 5, y: 8, size: 2.5 },
      { sprite: "ftree_pine", x: 7, y: 8, size: 2.5 },
      { sprite: "ftree_oak", x: 21, y: 8, size: 2.5 },
      { sprite: "ftree_pine", x: 23, y: 8, size: 2.5 },
      { sprite: "ftree_pine", x: 2, y: 10, size: 2.5 },
      { sprite: "ftree_pine", x: 4, y: 10, size: 2.5 },
      { sprite: "ftree_oak", x: 6, y: 10, size: 2.5 },
      { sprite: "ftree_oak", x: 8, y: 10, size: 2.5 },
      { sprite: "ftree_pine", x: 10, y: 10, size: 2.5 },
      { sprite: "ftree_pine", x: 14, y: 10, size: 2.5 },
      { sprite: "ftree_oak", x: 16, y: 10, size: 2.5 },
      { sprite: "ftree_oak", x: 18, y: 10, size: 2.5 },
      { sprite: "ftree_pine", x: 20, y: 10, size: 2.5 },
      { sprite: "ftree_pine", x: 22, y: 10, size: 2.5 },
      { sprite: "ftree_pine", x: 1, y: 12, size: 2.5 },
      { sprite: "ftree_oak", x: 3, y: 12, size: 2.5 },
      { sprite: "ftree_oak", x: 23, y: 12, size: 2.5 },
      { sprite: "ftree_oak", x: 2, y: 14, size: 2.5 },
      { sprite: "ftree_pine", x: 1, y: 16, size: 2.5 },
      { sprite: "ftree_pine", x: 3, y: 16, size: 2.5 },
      { sprite: "ftree_pine", x: 5, y: 16, size: 2.5 },
      { sprite: "ftree_oak", x: 7, y: 16, size: 2.5 },
      { sprite: "ftree_oak", x: 9, y: 16, size: 2.5 },
      { sprite: "ftree_pine", x: 15, y: 16, size: 2.5 },
      { sprite: "ftree_oak", x: 17, y: 16, size: 2.5 },
      { sprite: "ftree_oak", x: 19, y: 16, size: 2.5 },
      { sprite: "ftree_pine", x: 21, y: 16, size: 2.5 },
      { sprite: "ftree_pine", x: 23, y: 16, size: 2.5 },
      { sprite: "ftree_pine", x: 2, y: 18, size: 2.5 },
      { sprite: "ftree_oak", x: 4, y: 18, size: 2.5 },
      { sprite: "ftree_oak", x: 6, y: 18, size: 2.5 },
      { sprite: "ftree_pine", x: 8, y: 18, size: 2.5 },
      { sprite: "ftree_pine", x: 10, y: 18, size: 2.5 },
      { sprite: "ftree_oak", x: 14, y: 18, size: 2.5 },
      { sprite: "ftree_oak", x: 16, y: 18, size: 2.5 },
      { sprite: "ftree_pine", x: 18, y: 18, size: 2.5 },
      { sprite: "ftree_pine", x: 20, y: 18, size: 2.5 },
      { sprite: "ftree_pine", x: 22, y: 18, size: 2.5 },
      { sprite: "ftree_oak", x: 1, y: 20, size: 2.5 },
      { sprite: "ftree_oak", x: 3, y: 20, size: 2.5 },
      { sprite: "ftree_pine", x: 5, y: 20, size: 2.5 },
      { sprite: "ftree_pine", x: 7, y: 20, size: 2.5 },
      { sprite: "ftree_pine", x: 9, y: 20, size: 2.5 },
      { sprite: "ftree_pine", x: 15, y: 20, size: 2.5 },
      { sprite: "ftree_pine", x: 17, y: 20, size: 2.5 },
      { sprite: "ftree_pine", x: 19, y: 20, size: 2.5 },
      { sprite: "ftree_oak", x: 21, y: 20, size: 2.5 },
      { sprite: "ftree_oak", x: 23, y: 20, size: 2.5 },
      { sprite: "ftree_pine", x: 2, y: 22, size: 2.5 },
      { sprite: "ftree_pine", x: 4, y: 22, size: 2.5 },
      { sprite: "ftree_pine", x: 6, y: 22, size: 2.5 },
      { sprite: "ftree_oak", x: 8, y: 22, size: 2.5 },
      { sprite: "ftree_oak", x: 10, y: 22, size: 2.5 },
      { sprite: "ftree_pine", x: 14, y: 22, size: 2.5 },
      { sprite: "ftree_pine", x: 16, y: 22, size: 2.5 },
      { sprite: "ftree_oak", x: 18, y: 22, size: 2.5 },
      { sprite: "ftree_oak", x: 20, y: 22, size: 2.5 },
      { sprite: "ftree_pine", x: 22, y: 22, size: 2.5 },
      { sprite: "flogs", x: 20, y: 5, size: 1.0 },
      { sprite: "frock", x: 7, y: 6, size: 1.4 },
      { sprite: "frock", x: 22, y: 7, size: 1.4 },
      { sprite: "fbush_tall_1", x: 9, y: 8, size: 1.2 },
      { sprite: "fbush_tall_1", x: 3, y: 10, size: 1.2 },
      { sprite: "frock", x: 7, y: 10, size: 1.4 },
      { sprite: "frock", x: 19, y: 10, size: 1.4 },
      { sprite: "fbush_tall_1", x: 3, y: 14, size: 1.2 },
      { sprite: "fbush_tall_1", x: 6, y: 15, size: 1.2 },
      { sprite: "frock", x: 10, y: 15, size: 1.4 },
      { sprite: "flogs", x: 14, y: 15, size: 1.0 },
      { sprite: "frock", x: 22, y: 15, size: 1.4 },
      { sprite: "fbush_tall_1", x: 3, y: 18, size: 1.2 },
      { sprite: "fbush_tall_1", x: 15, y: 18, size: 1.2 },
      { sprite: "frock", x: 19, y: 18, size: 1.4 },
      { sprite: "frock", x: 7, y: 22, size: 1.4 },
      { sprite: "fbush_tall_1", x: 15, y: 22, size: 1.2 },
    ],
    spawn: { x: 12, y: 21 },  // on the path, just north of the entry door at (12, 22)
    entities: {
      "K": {
        // Kitty store landmark — the actual cabin building. 3x2.5 tile footprint.
        sprite: "fkitty_store",
        scene: "scene_kitty_store",
        size: 3.0,
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
      "F": {
        // A pretty flower in a circle of bare earth. Bait.
        sprite: "flower_mimic_idle",
        scene: "scene_flower_mimic",
        size: 1.3
      },
      "X": {
        // Chest mimic — looks like loot, eats you when opened.
        sprite: "mimic_idle",
        scene: "scene_mimic_chest",
        size: 1.2
      },
      "Y": {
        // Yoga guy — bearded man sitting cross-legged in the north clearing.
        // Reuses epa_man sprite (bearded guy in robe). Pure comedy / dialogue
        // trap — no death state, just an escape route back to the forest.
        sprite: "epa_man",
        scene: "scene_yoga_guy",
        size: 1.4,
        label: "Bearded Man",
        label_position: "below"
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
        // Do Not Enter — north wall (RED for warning)
        sprite: "ddoor_red",
        scene: "scene_donotenter_router",
        size: 1.5,
        label: "Do Not Enter",
        label_position: "below"
      },
      "2": {
        // Storage — west wall (GREY for neutral utility)
        sprite: "ddoor_grey",
        scene: "scene_detritus",
        size: 1.5,
        label: "Storage",
        label_position: "right"
      },
      "3": {
        // Exit — east wall (GREEN for go/exit)
        sprite: "ddoor_green",
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
