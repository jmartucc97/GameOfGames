// Forest trap scenes. Entities are placed in the forest room (data/rooms.js);
// each one's `scene` field points here. Most are bad endings; the yoga guy
// is a comedic dialogue trap with an escape; the wishing well randomizes.
Object.assign(SCENES, {

  // -----------------------------------------------
  // PIT TRAP — step-on, no warning
  // -----------------------------------------------

  ending_forest_pit: {
    text: "You step onto the hole.\n\nThere is a hole right there in the path. It is, in retrospect, the most hole-shaped thing you have ever seen. The shadow alone tells you everything you needed to know.\n\nYou step on it anyway.\n\nThe hole, on its end, does what holes do.",
    ending: true,
    ending_label: "Hole in One",
    ending_class: "bad"
  },

  // -----------------------------------------------
  // YOGA GUY — dialogue trap, comedic, no death
  // -----------------------------------------------

  scene_yoga_guy: {
    sprite: "epa_man",
    text: "A bearded man sits cross-legged on a bare patch of grass. His eyes are closed. He is humming, very quietly, the same three notes in a loop.\n\nHe opens one eye as you approach. \"Friend. Welcome. The forest has called you here, as it called me, eight years ago. Sit. We will breathe.\"",
    choices: [
      { text: "Sit and breathe", next: "scene_yoga_breathe" },
      { text: "I don't have time for this", next: "scene_yoga_rude" },
      { text: "Walk away (he's still talking)", next: "scene_forest" }
    ]
  },

  scene_yoga_breathe: {
    sprite: "epa_man",
    text: "You sit. He nods, slowly. The three-note hum resumes. He waits for you to join in. You don't.\n\n\"In through the nose,\" he says. \"Out through the mouth. The mouth is the gateway. The nose is also a gateway. Each gateway has two doors. The doors are also gateways.\"\n\nHe smiles, eyes closed. He breathes. He hums. Eight years pass, in his head. Two minutes pass, in yours.",
    choices: [
      { text: "Listen to more breathing wisdom", next: "scene_yoga_breathe" },
      { text: "Stand up and leave", next: "scene_forest" }
    ]
  },

  scene_yoga_rude: {
    sprite: "epa_man",
    text: "He opens both eyes. The humming stops.\n\n\"No time. No time. You have all the time, friend. The time is the forest. The forest is the time. You think you're going somewhere? You're already there. You're at the trader. You're at the kitty store. You're in the basement. You're in the pit. You're —\"\n\nHe is, in his way, correct about most of these.",
    choices: [
      { text: "Just walk away", next: "scene_forest" },
      { text: "OK fine, tell me more", next: "scene_yoga_breathe" }
    ]
  },

  // -----------------------------------------------
  // WISHING WELL — random outcome
  // -----------------------------------------------

  scene_wishing_well: {
    text: "A circle of mossy stones surrounds a hole that drops further than it should. You can hear water somewhere far below, or possibly something pretending to be water.\n\nA weather-worn sign next to the well reads MAKE A WISH. (Coin optional. Wish at your own risk. Refunds not honored.)",
    choices: [
      { text: "Wish for a sandwich", next: "scene_well_random" },
      { text: "Wish for the basement to make sense", next: "scene_well_random" },
      { text: "Wish for everyone to be okay", next: "scene_well_random" },
      { text: "Walk away (suspicious)", next: "scene_forest" }
    ]
  },

  // Router: 1/3 good, 2/3 bad. The randomness IS the joke.
  scene_well_random: {
    route: () => {
      const r = Math.random();
      if (r < 0.34) return "scene_well_good";
      if (r < 0.67) return "ending_well_drown";
      return "ending_well_sandwich";
    }
  },

  scene_well_good: {
    text: "The well makes a sound like polite agreement.\n\nNothing falls out. Nothing visibly happens. You feel, briefly, like things are going to be okay. The feeling fades.\n\nYou step back. You are inexplicably a little taller.",
    choices: [
      { text: "Walk away (mysteriously satisfied)", next: "scene_forest" }
    ]
  },

  ending_well_drown: {
    text: "The well, with the air of a thing finally getting what it wanted, opens its mouth wider.\n\nThe stones tilt. The ground tilts. You tilt.\n\nYou tilt directly into the well.\n\nThings down here are wet, and several other things.",
    ending: true,
    ending_label: "Drowned in Wishes",
    ending_class: "bad"
  },

  ending_well_sandwich: {
    text: "A sandwich materializes in the air above the well.\n\nIt is comically large. Two stories of bread, easy. A wheel of cheese the size of a manhole cover. Pickles arranged in concentric rings.\n\nIt hovers, briefly, in defiance of every relevant law.\n\nThen it falls.\n\nIt falls onto you.",
    ending: true,
    ending_label: "Crushed by Sandwich",
    ending_class: "bad"
  },

  // -----------------------------------------------
  // DEMON DOORS SIGN — both choices bad, one walk-away
  // -----------------------------------------------

  scene_demon_doors_sign: {
    sprite: "three_doors",
    text: "Nailed to a tree: a hand-painted sign that says READ THIS SIGN.\n\nBelow it, a smaller sign: \"Choose the LEFT door for great rewards. Choose the RIGHT door for inner peace.\"\n\nTwo doors are set into the trunks of trees just past the sign. Neither was there a moment ago. Both look slightly wet.",
    choices: [
      { text: "Open the left door (great rewards)", next: "ending_demon_left" },
      { text: "Open the right door (inner peace)", next: "ending_demon_right" },
      { text: "This is obviously a trap", next: "scene_forest" }
    ]
  },

  ending_demon_left: {
    sprite: "demon_imp",
    text: "You open the left door.\n\nThe door was not lying — there are, in fact, great rewards inside. The rewards are for the demon.\n\nThe reward is you.",
    ending: true,
    ending_label: "Door Number Two Was Worse",
    ending_class: "bad"
  },

  ending_demon_right: {
    sprite: "demon_balor",
    text: "You open the right door.\n\nYou achieve inner peace immediately and permanently, as the considerably-larger demon on the other side stops your inner anything from continuing.",
    ending: true,
    ending_label: "Inner Peace",
    ending_class: "bad"
  },

  // -----------------------------------------------
  // FLOWER MIMIC — bait, tap to interact, pick = death
  // -----------------------------------------------

  scene_flower_mimic: {
    sprite: "flower_mimic_idle",
    text: "A single tulip grows in a perfect circle of bare earth, vivid red against the green. It seems... waiting? You can't tell. Tulips don't have faces.\n\nThis one might, when it's not pretending.",
    choices: [
      { text: "Pick the flower", next: "ending_mimic_eaten" },
      { text: "Sniff it cautiously", next: "ending_mimic_eaten" },
      { text: "Walk away", next: "scene_forest" }
    ]
  },

  ending_mimic_eaten: {
    sprite: "flower_mimic_attack",
    text: "You reach for the flower.\n\nThe flower reaches back, considerably faster, and with considerably more teeth than a flower has any right to.",
    ending: true,
    ending_label: "Eaten by Tulip",
    ending_class: "bad"
  },

  // -----------------------------------------------
  // CHEST MIMIC — looks like loot, eats you when opened
  // -----------------------------------------------

  scene_mimic_chest: {
    sprite: "mimic_idle",
    text: "Tucked in the far corner of the clearing: a wooden chest. Bound in iron. Slightly scuffed, like it's been here a while and nobody's claimed it.\n\nIt could be ANYTHING in there. Coins. A sword. The cat treats you've been driving — well, walking — across the forest to find.\n\nThe chest is, you note, breathing very slightly. Probably the wind.",
    choices: [
      { text: "Open the chest", next: "ending_mimic_chest_eaten" },
      { text: "Kick the chest, see what happens", next: "ending_mimic_chest_eaten" },
      { text: "Leave it. Chests in clearings are never just chests.", next: "scene_forest" }
    ]
  },

  ending_mimic_chest_eaten: {
    sprite: "mimic_attack",
    text: "The chest, with the practiced enthusiasm of something that has done this many times before, unfolds.\n\nThere are teeth where the latch was. There is a tongue where the keepsakes were going to be. There is, briefly, a sound — wet, considered, satisfied — and then there isn't.\n\nThe chest reassembles. The chest waits for the next one.",
    ending: true,
    ending_label: "Should Have Known",
    ending_class: "bad"
  },
});
