// Scenes for module: pit_gauntlet.
// Original source lines 3470-3797 of monolithic story_v2_explore.html
Object.assign(SCENES, {
  // ============================================================
  // PIT GAUNTLET — Doom Slayer branch
  // Triggered by Zynns + Kalashnikov at John Prime confrontation
  // ============================================================

  scene_john_recognize: {
    sprite: "john_idle",
    text: "John Prime looks you over.\n\n\"Hm. Zynns and a Kalesh, huh.\"\n\nHis eyes flicker. For the first time, he seems genuinely interested.\n\n\"I think you could help me with something. The pit. We need to verify, for the records, that it's actually bottomless. Pro-forma audit. The kind of audit that involves descending into it and personally confirming.\"\n\nHe pauses.\n\n\"Also — and this is important — there's an old friend trapped down there. Has been for decades. Tough old bastard. If we make it to the bottom, we get him out. Owe him that much.\"\n\nHe rolls his shoulders.\n\n\"Plumpy's coming too. He likes a road trip.\"",
    set: { john_appeared: true },
    choices: [
      { text: "I'm in. Let's go.", next: "scene_loadout_backup", set: { pit_initiated: true } },
      { text: "Hell no.", next: "ending_pit_refusal" }
    ]
  },

  ending_pit_refusal: {
    sprite: "john_attack",
    text: "John Prime sighs.\n\n\"Well. We all want things.\"\n\nHe gestures. You become a fine purple mist.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  scene_loadout_backup: {
    sprite: "john_idle",
    text: "John lays out three melee weapons on a folding table.\n\n\"Some things down there can't be shot. Pick one. You get six swings.\"",
    choices: [
      { text: "Chainsaw",   next: "scene_loadout_support", set: { pit_backup: "chainsaw",   pit_backup_uses: 6 } },
      { text: "Whip",       next: "scene_loadout_support", set: { pit_backup: "whip",       pit_backup_uses: 6 } },
      { text: "Broadsword", next: "scene_loadout_support", set: { pit_backup: "broadsword", pit_backup_uses: 6 } }
    ]
  },

  scene_loadout_support: {
    sprite: "john_idle",
    text: "Plumpy waddles up holding a small cooler.\n\n\"For when you're hurt. Two pulls of whichever you pick.\"",
    choices: [
      { text: "Pack of Suncruisers", next: "scene_loadout_special", set: { pit_support: "suncruisers", pit_support_uses: 2 } },
      { text: "Bottle of whiskey", next: "scene_loadout_special", set: { pit_support: "whiskey", pit_support_uses: 2 } },
      { text: "Bottle of plum wine", next: "scene_loadout_special", set: { pit_support: "plumwine", pit_support_uses: 2 } }
    ]
  },

  scene_loadout_special: {
    sprite: "john_idle",
    text: "John opens a drawer in the folding table that absolutely should not fit inside it.\n\n\"Special. One shot. Pick carefully — different demons take different things.\"",
    choices: [
      { text: "Bluetooth speaker",    next: "scene_loadout_wildcard", set: { pit_special: "speaker",        pit_special_uses: 1, pit_special_uses_speaker: true } },
      { text: "Catnip banana",        next: "scene_loadout_wildcard", set: { pit_special: "catnip_banana",  pit_special_uses: 1, pit_special_uses_banana: true } },
      { text: "Bottle of holy water", next: "scene_loadout_wildcard", set: { pit_special: "holy_water",     pit_special_uses: 1, pit_special_uses_holy: true } }
    ]
  },

  scene_loadout_wildcard: {
    sprite: "john_idle",
    text: "Plumpy slides a small velvet-lined box across the table.\n\n\"Wildcard. One shot. Don't waste it.\"",
    choices: [
      { text: "Printed copy of the 2024 election results", next: "scene_pit_descent", set: { pit_wildcard: "election", pit_wildcard_uses: 1, pit_wildcard_uses_election: true } },
      { text: "Thomas Sowell's Basic Economics",           next: "scene_pit_descent", set: { pit_wildcard: "sowell",   pit_wildcard_uses: 1, pit_wildcard_uses_sowell: true } },
      { text: "Sealed copy of Norbit on Blu-Ray",          next: "scene_pit_descent", set: { pit_wildcard: "norbit",   pit_wildcard_uses: 1, pit_wildcard_uses_norbit: true } }
    ]
  },

  scene_pit_descent: {
    sprite: "john_cast",
    text: "You step to the edge of the pit. John on your left. Plumpy on your right.\n\nJohn pats you on the back. \"Try not to die. Plumpy's only got one save in him.\"\n\nYou step off.\n\nThe fall lasts longer than physics should allow. The walls glow faintly. Voices murmur from below. Distant, hungry voices.\n\nYou land.\n\nThe air smells like ozone and damp sulfur. Something moves in the dark.",
    choices: [
      { text: "Ready your weapons", next: "scene_pit_demon_1" }
    ]
  },

  // ============================================================
  // PIT GAUNTLET COMBAT — 4 demons, each with a special weakness
  // ============================================================

  // -- DEMON 1: Crimson Imp (weakness: catnip banana → Pit Freshy) --

  scene_pit_demon_1: {
    sprite: "demon_imp",
    fight: true,
    fight_seconds: 10,
    demon_hp: 2,
    text: (s) => s.pit_demon_hp < s.pit_demon_hp_max
      ? "The crimson imp is bleeding from one shoulder, snarling. It's still coming."
      : "A crimson imp drops from the ceiling and lands in front of you with a wet smack.\n\nIt grins. Sharp teeth, too many of them. It bounces on the balls of its feet, chittering.\n\nIt is going to dart in any second.",
    choices: [
      { id: "d1_kalash",  text: "Fire the Kalashnikov",         next: "scene_pit_heal_1", correct: true,  consumes: "pit_kalash_uses",  sfx: "gunshot",  requires_count: ["pit_kalash_uses"] },
      { id: "d1_backup",  text: (s) => `Use the ${backupLabel(s.pit_backup)}`, next: "scene_pit_heal_1", correct: true,  consumes: "pit_backup_uses",  sfx: "chainsaw", requires_count: ["pit_backup_uses"] },
      { id: "d1_special_banana", text: "Hurl the catnip banana", next: "scene_pit_freshy",   correct: true, instant_kill: true,  consumes: "pit_special_uses", sfx: "magic",    requires: ["pit_special_uses_banana"] },
      { id: "d1_special_other",  text: (s) => `Use the ${specialLabel(s.pit_special)}`, next: null,    correct: false, consumes: "pit_special_uses", requires_count: ["pit_special_uses"], unless: ["pit_special_uses_banana"] },
      { id: "d1_plumpy",  text: "Call on Plumpy",               next: "scene_pit_heal_1", action: "plumpy_panic", sfx: "magic", requires: ["pit_plumpy_available"] }
    ]
  },

  scene_pit_freshy: {
    sprite: "pit_freshy",
    text: "You hurl the catnip banana. The imp catches it instinctively, sniffs it, and freezes.\n\nFrom the dark, something pads forward. A cat. Gray and white. Massive. Built like the upstairs cat but somehow sadder.\n\nJohn's voice, low: \"Oh shit. That's the Pit Freshy.\"\n\nThe Pit Freshy fixes the imp with a look of total professional disinterest, walks up to it, and disassembles it in three seconds flat. He picks up the banana, gives you a long blink, and pads back into the dark.\n\nJohn exhales. \"Lifer. Been down here since '83. Don't ask.\"",
    choices: [
      { text: "Continue", next: "scene_pit_heal_1" }
    ]
  },

  scene_pit_heal_1: {
    sprite: "john_friendly",
    text: (s) => {
      const plumpy = s._plumpy_just_saved; s._plumpy_just_saved = false;
      return plumpy
        ? `Plumpy waddles out of the dark, takes one look at the imp, and physically deconstructs it before you can blink.\n\n"Whew! Caught that one. Here — you look like you need this." He slaps a glowing purple plum onto your chest. You feel sturdier.\n\nMax HP +1. HP: ${s.pit_hp} / ${s.pit_hp_max}.\n\nJohn, quietly: "He's only got one of those."`
        : `The imp is gone. John gives you a thumbs-up.\n\n"One down. Catch your breath."\n\nHP: ${s.pit_hp} / ${s.pit_hp_max}.`;
    },
    choices: [
      { text: (s) => `Drink ${supportLabel(s.pit_support)} (heal 1 HP)`, action: "heal_one", consumes: "pit_support_uses", next: "self", requires_count: ["pit_support_uses"] },
      { text: "Press on", next: "scene_pit_demon_2" }
    ]
  },

  // -- DEMON 2: Grinning Gremlin (no special weakness) --

  scene_pit_demon_2: {
    sprite: "demon_gremlin",
    fight: true,
    fight_seconds: 9,
    demon_hp: 2,
    text: (s) => s.pit_demon_hp < s.pit_demon_hp_max
      ? "The gremlin is hurt and twice as pissed. It scuttles sideways, fast."
      : "Something scampers out of the dark, all elbows and teeth. A grinning gremlin. Too many teeth and it's not done growing them.",
    choices: [
      { id: "d2_kalash",  text: "Fire the Kalashnikov",         next: null, correct: false, consumes: "pit_kalash_uses",  sfx: "gunshot",  requires_count: ["pit_kalash_uses"] },
      { id: "d2_backup",  text: (s) => `Use the ${backupLabel(s.pit_backup)}`, next: "scene_pit_heal_2", correct: true,  consumes: "pit_backup_uses",  sfx: "chainsaw", requires_count: ["pit_backup_uses"] },
      { id: "d2_special", text: (s) => `Use the ${specialLabel(s.pit_special)}`, next: null,    correct: false, consumes: "pit_special_uses", requires_count: ["pit_special_uses"] },
      { id: "d2_plumpy",  text: "Call on Plumpy",               next: "scene_pit_heal_2", action: "plumpy_panic", sfx: "magic", requires: ["pit_plumpy_available"] }
    ]
  },

  scene_pit_heal_2: {
    sprite: "john_friendly",
    text: (s) => {
      const plumpy = s._plumpy_just_saved; s._plumpy_just_saved = false;
      return plumpy
        ? `Plumpy materializes, grabs the gremlin by both its too-many teeth, and folds the gremlin into a shape no gremlin should be.\n\n"You'll thank me later." He presses another plum to your forehead.\n\nMax HP +1. HP: ${s.pit_hp} / ${s.pit_hp_max}.`
        : `The gremlin folds in on itself and goes quiet.\n\nHP: ${s.pit_hp} / ${s.pit_hp_max}.`;
    },
    choices: [
      { text: (s) => `Drink ${supportLabel(s.pit_support)} (heal 1 HP)`, action: "heal_one", consumes: "pit_support_uses", next: "self", requires_count: ["pit_support_uses"] },
      { text: "Press on", next: "scene_pit_demon_3" }
    ]
  },

  // -- DEMON 3: Depraved Blackguard (no special weakness — must shoot it) --

  scene_pit_demon_3: {
    sprite: "demon_blackguard",
    fight: true,
    fight_seconds: 8,
    demon_hp: 2,
    text: (s) => s.pit_demon_hp < s.pit_demon_hp_max
      ? "The Blackguard's plate is cracked open along one side. It hefts the second blade and keeps walking."
      : "A heavily armored figure steps out of the gloom, blades in both hands. Polished black plate, helmet sealed. No exposed flesh.\n\nThis one isn't talking. It's just walking forward.",
    choices: [
      { id: "d3_kalash",  text: "Fire the Kalashnikov",         next: "scene_pit_heal_3", correct: true,  consumes: "pit_kalash_uses",  sfx: "gunshot",  requires_count: ["pit_kalash_uses"] },
      { id: "d3_backup",  text: (s) => `Use the ${backupLabel(s.pit_backup)}`, next: null, correct: false, consumes: "pit_backup_uses", sfx: "chainsaw", requires_count: ["pit_backup_uses"] },
      { id: "d3_special", text: (s) => `Use the ${specialLabel(s.pit_special)}`, next: null,    correct: false, consumes: "pit_special_uses", requires_count: ["pit_special_uses"] },
      { id: "d3_plumpy",  text: "Call on Plumpy",               next: "scene_pit_heal_3", action: "plumpy_panic", sfx: "magic", requires: ["pit_plumpy_available"] }
    ]
  },

  scene_pit_heal_3: {
    sprite: "john_friendly",
    text: (s) => {
      const plumpy = s._plumpy_just_saved; s._plumpy_just_saved = false;
      return plumpy
        ? `Plumpy appears, considers the Blackguard, and removes its armor with one motion the way you'd peel a banana. The Blackguard, abruptly without armor or business model, falls apart.\n\n"Have another." Plumpy hands you a glowing plum.\n\nMax HP +1. HP: ${s.pit_hp} / ${s.pit_hp_max}.`
        : `The Blackguard collapses into its own armor like a folding chair.\n\nHP: ${s.pit_hp} / ${s.pit_hp_max}.`;
    },
    choices: [
      { text: (s) => `Drink ${supportLabel(s.pit_support)} (heal 1 HP)`, action: "heal_one", consumes: "pit_support_uses", next: "self", requires_count: ["pit_support_uses"] },
      { text: "Press on", next: "scene_pit_demon_4" }
    ]
  },

  // -- DEMON 4: Floating Eye (weakness: holy water) --

  scene_pit_demon_4: {
    sprite: "demon_eye",
    fight: true,
    fight_seconds: 7,
    demon_hp: 2,
    text: (s) => s.pit_demon_hp < s.pit_demon_hp_max
      ? "The Eye is leaking some kind of dark fluid now. It blinks for the first time. That somehow makes it worse."
      : "The dark in front of you opens into a single enormous bloodshot eye, suspended in mid-air, ringed by smaller iris-eyes orbiting it like moons.\n\nIt does not blink.\n\nIt does not move.\n\nIt is judging you.",
    choices: [
      { id: "d4_kalash",  text: "Fire the Kalashnikov",         next: null, correct: false, consumes: "pit_kalash_uses", sfx: "gunshot", requires_count: ["pit_kalash_uses"] },
      { id: "d4_backup",  text: (s) => `Use the ${backupLabel(s.pit_backup)}`, next: "scene_pit_heal_4", correct: true,  consumes: "pit_backup_uses",  sfx: "chainsaw", requires_count: ["pit_backup_uses"] },
      { id: "d4_special_holy",  text: "Splash the holy water",        next: "scene_pit_heal_4",  correct: true, instant_kill: true, consumes: "pit_special_uses", sfx: "magic", requires: ["pit_special_uses_holy"] },
      { id: "d4_special_other", text: (s) => `Use the ${specialLabel(s.pit_special)}`, next: null, correct: false, consumes: "pit_special_uses", requires_count: ["pit_special_uses"], unless: ["pit_special_uses_holy"] },
      { id: "d4_plumpy",  text: "Call on Plumpy",               next: "scene_pit_heal_4", action: "plumpy_panic", sfx: "magic", requires: ["pit_plumpy_available"] }
    ]
  },

  scene_pit_heal_4: {
    sprite: "john_friendly",
    text: (s) => {
      const plumpy = s._plumpy_just_saved; s._plumpy_just_saved = false;
      return plumpy
        ? `Plumpy steps in front of the floating Eye and stares directly back. Whatever Plumpy is doing with his face, the Eye CANNOT TAKE IT. The Eye ruptures from the inside. The iris-moons scatter.\n\n"Stay vital out there." A plum is now stuck to your collar.\n\nMax HP +1. HP: ${s.pit_hp} / ${s.pit_hp_max}.`
        : `The Eye boils, ruptures, and is gone. The orbiting iris-eyes scatter into the dark.\n\nHP: ${s.pit_hp} / ${s.pit_hp_max}.`;
    },
    choices: [
      { text: (s) => `Drink ${supportLabel(s.pit_support)} (heal 1 HP)`, action: "heal_one", consumes: "pit_support_uses", next: "self", requires_count: ["pit_support_uses"] },
      { text: "Press on", next: "scene_pit_demon_5" }
    ]
  },

  // -- DEMON 5: Warp Skull (no special weakness, penultimate) --

  scene_pit_demon_5: {
    sprite: "demon_skull",
    fight: true,
    fight_seconds: 7,
    demon_hp: 2,
    text: (s) => s.pit_demon_hp < s.pit_demon_hp_max
      ? "A crack opens across the Warp Skull's brow. Green light pours out. It is screaming a sound you cannot hear."
      : "The air ahead twists. A skull, green-glowing, larger than a person should be, hangs in space ringed by warping color.\n\nIt opens its jaw. The pit ripples.",
    choices: [
      { id: "d5_kalash",  text: "Fire the Kalashnikov",         next: "scene_pit_heal_5", correct: true,  consumes: "pit_kalash_uses",  sfx: "gunshot",  requires_count: ["pit_kalash_uses"] },
      { id: "d5_backup",  text: (s) => `Use the ${backupLabel(s.pit_backup)}`, next: null, correct: false, consumes: "pit_backup_uses", sfx: "chainsaw", requires_count: ["pit_backup_uses"] },
      { id: "d5_special", text: (s) => `Use the ${specialLabel(s.pit_special)}`, next: null,    correct: false, consumes: "pit_special_uses", requires_count: ["pit_special_uses"] },
      { id: "d5_plumpy",  text: "Call on Plumpy",               next: "scene_pit_heal_5", action: "plumpy_panic", sfx: "magic", requires: ["pit_plumpy_available"] }
    ]
  },

  scene_pit_heal_5: {
    sprite: "john_friendly",
    text: (s) => {
      const plumpy = s._plumpy_just_saved; s._plumpy_just_saved = false;
      return plumpy
        ? `Plumpy grabs the Warp Skull mid-warp and slams it shut. The green light goes out. The skull, now a regular skull, drops at your feet.\n\n"Last plum I got, kiddo." He hands it over.\n\nMax HP +1. HP: ${s.pit_hp} / ${s.pit_hp_max}.\n\nJohn: "One left. The big one."`
        : `The skull shatters into glass fragments that wink out before they hit the ground.\n\nHP: ${s.pit_hp} / ${s.pit_hp_max}.\n\nJohn: "One left. The big one."`;
    },
    choices: [
      { text: (s) => `Drink ${supportLabel(s.pit_support)} (heal 1 HP)`, action: "heal_one", consumes: "pit_support_uses", next: "self", requires_count: ["pit_support_uses"] },
      { text: "Descend to the bottom", next: "scene_pit_demon_6" }
    ]
  },

  // -- DEMON 6: Pit Balor (weakness: bluetooth speaker, FINAL) --

  scene_pit_demon_6: {
    sprite: "demon_balor",
    fight: true,
    fight_seconds: 6,
    demon_hp: 2,
    text: (s) => s.pit_demon_hp < s.pit_demon_hp_max
      ? "The Pit Balor is on one knee, dragging in breath that smells like a tire fire. It's still got one swing left."
      : "You reach the deepest layer. It is hotter here. The air vibrates.\n\nThe Pit Balor unfolds itself out of the dark. Twelve feet tall, hooved, horned, flaming. It looks at the three of you the way you'd look at three ants.\n\nJohn mutters: \"This is the part. Whatever you brought, it had better be the right thing.\"",
    choices: [
      { id: "d6_kalash",  text: "Fire the Kalashnikov",         next: "scene_pit_spirit", correct: true,  consumes: "pit_kalash_uses",  sfx: "gunshot",  requires_count: ["pit_kalash_uses"] },
      { id: "d6_backup",  text: (s) => `Use the ${backupLabel(s.pit_backup)}`, next: "scene_pit_spirit", correct: true,  consumes: "pit_backup_uses",  sfx: "chainsaw", requires_count: ["pit_backup_uses"] },
      { id: "d6_special_speaker", text: "Crank John's jams on the speaker", next: "scene_pit_spirit", correct: true, instant_kill: true, consumes: "pit_special_uses", sfx: "magic", requires: ["pit_special_uses_speaker"] },
      { id: "d6_special_other",   text: (s) => `Use the ${specialLabel(s.pit_special)}`, next: null, correct: false, consumes: "pit_special_uses", requires_count: ["pit_special_uses"], unless: ["pit_special_uses_speaker"] },
      { id: "d6_plumpy",  text: "Call on Plumpy",               next: "scene_pit_spirit", action: "plumpy_panic", sfx: "magic", requires: ["pit_plumpy_available"] }
    ]
  },

  // -- THE SPIRIT OF MODERN LIBERALISM --

  scene_pit_spirit: {
    sprite: "john_cast",
    text: (s) => {
      const plumpy = s._plumpy_just_saved; s._plumpy_just_saved = false;
      const opener = plumpy
        ? `Plumpy steps in front of the Balor, sets his feet, and somehow body-checks a twelve-foot demon into the dark. The Balor does not get back up.\n\n"That's the one I had in me. You're on your own now."\n\nMax HP +1. HP: ${s.pit_hp} / ${s.pit_hp_max}.\n\nThe bottom of the pit is silent.`
        : `The Balor topples. The bottom of the pit is silent.`;
      return `${opener}\n\nThe walls peel back. You're standing in a kind of clearing. Fluorescent light, somehow, from no source you can identify.\n\nIn the center, a shape coalesces. Vaguely human. Vaguely smug. It opens its mouth and starts talking.\n\nIt is the Spirit of Modern Liberalism.\n\nJohn turns to you, deadly serious. "This is what you brought the wildcard for."`;
    },
    choices: [
      { text: "Read aloud from Thomas Sowell's Basic Economics", next: "ending_pit_win_sowell",   correct: true, consumes: "pit_wildcard_uses", requires: ["pit_wildcard_uses_sowell"] },
      { text: "Show it the 2024 election results",              next: "ending_pit_win_election", correct: true, consumes: "pit_wildcard_uses", requires: ["pit_wildcard_uses_election"] },
      { text: "Brandish the sealed Norbit Blu-Ray",              next: "scene_pit_norbit_fakeout", consumes: "pit_wildcard_uses", requires: ["pit_wildcard_uses_norbit"] }
    ]
  },

  // -- WIN ENDINGS --

  ending_pit_win_sowell: {
    sprite: "john_friendly",
    text: "You open the book and start reading. Chapter 1. \"Scarcity is the basic condition of human existence.\"\n\nThe Spirit takes a step back. Its mouth keeps opening but no sound comes out anymore. You keep reading. Prices as information. Comparative advantage. Unintended consequences.\n\nBy the third chapter the Spirit is on its knees clutching its head. By the fifth it explodes into a cloud of low-density mist.\n\nThe air clears.\n\nFrom the empty space where the Spirit had been, a different figure emerges. Translucent. Smiling. Slightly tilted head.\n\n\"Saved,\" Ronald Reagan says, \"by Mr. Gorbachev's own hardware and three American patriots.\"\n\nHe winks. He fades upward.",
    set: { _reagan_freed: true },
    ending: true,
    ending_label: "Pit Audited — Reagan Freed",
    ending_class: "win"
  },

  ending_pit_win_election: {
    sprite: "john_friendly",
    text: "You unfold the printout. State by state. County by county. Margin of victory in seven swing states. The popular vote.\n\nThe Spirit stares.\n\nIt makes a small noise. A choked, low, rattling noise. It tries to speak. It can't.\n\nIt stares at the numbers for a long time. Then it screams once, a long thin scream, and dissolves into mist.\n\nThe air clears.\n\nFrom the empty space where the Spirit had been, a translucent figure emerges. Smiling. Slightly tilted head.\n\n\"Saved,\" Ronald Reagan says, \"by Mr. Gorbachev's own hardware and three American patriots.\"\n\nHe winks. He fades upward.",
    set: { _reagan_freed: true },
    ending: true,
    ending_label: "Pit Audited — Reagan Freed",
    ending_class: "win"
  },

  scene_pit_norbit_fakeout: {
    sprite: "demon_balor",
    text: "You hold up the sealed Norbit Blu-Ray. Mint condition. Untouched. A factory-perfect 2007 artifact.\n\nThe Spirit considers it. Tilts its head.\n\nThen it reaches forward and snaps the case in half. The disc clatters to the floor in two pieces.\n\nJohn Prime makes a sound you have never heard before.",
    choices: [
      { text: "Continue", next: "ending_pit_win_norbit" }
    ]
  },

  ending_pit_win_norbit: {
    sprite: "john_attack",
    text: "John Prime rappels down the pit on a rope that wasn't there a moment ago.\n\n\"That,\" he says, voice level, \"was a VINTAGE sealed copy of Norbit on Blu-Ray.\"\n\nHe turns to the Spirit.\n\nWhat follows is not a fight. It is a lecture. John begins by walking the Spirit through the Louisiana Purchase of 1803, the doubling of the United States' landmass under Jefferson, the Northwest Ordinance, and the patterns of westward settlement that defined a century of American history — explaining that nation-building requires deliberate territorial expansion, anchored by infrastructure and law, not vibes. He pivots to the Treaty of Westphalia, 1648, the founding of the modern nation-state system, and explains with rising intensity that a state without borders is not a state at all but a vague feeling about a region, and that the entire concept of citizenship — the rights AND the obligations — collapses without a defined territory in which legitimate authority is exercised. He finishes by tracing the lineage of Western legal tradition back to the Roman Twelve Tables of 450 BC, the praetor edicts, and Justinian's codification in the sixth century — explaining that everything the Spirit takes for granted, every right it claims to defend, every procedural protection, every concept of equal application of the law, descends in an unbroken line from Roman jurists who understood that without codified law there is only the will of the strong.\n\nThe Spirit slumps to the ground.\n\nIt raises its head one last time and screams: \"REEEEEEEEEE.\"\n\nIt explodes into mist.\n\nFrom the empty space where the Spirit had been, a translucent figure emerges. Smiling. Slightly tilted head.\n\n\"Saved,\" Ronald Reagan says, \"by Mr. Gorbachev's own hardware and three American patriots.\"\n\nHe winks. He fades upward.\n\nJohn Prime is still holding the broken Blu-Ray. He does not look up.",
    set: { _reagan_freed: true },
    ending: true,
    ending_label: "Pit Audited — Reagan Freed",
    ending_class: "win"
  },

  ending_pit_doom_death: {
    sprite: "john_attack",
    text: "Your HP hits zero. You drop the Kalashnikov.\n\nThe demon — whichever one it was — finishes the job. Plumpy looks away. John just shakes his head.\n\n\"Well. Pit's still bottomless. Audit incomplete.\"",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  // ============================================================
});
