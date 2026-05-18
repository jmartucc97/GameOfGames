// Scenes for module: driveway (now: forest landmarks).
// The "driveway" hub and all scenic-route old-people scenes have been
// retired — the player now walks around the forest room directly. The
// trader and kitty-store scenes survive, with route-backs pointing to
// `scene_forest` (the explore room) instead of the old text hub.
Object.assign(SCENES, {
  // TRIPMINE — premature exit before Plumpy disarms
  // -----------------------------------------------

  ending_tripmine: {
    text: "You push the Exit door open.\n\nThere is a single, soft *click*.\n\nThe rest of the experience is brief, hot, and one-directional.\n\nApparently John keeps his trip mine on a hair trigger.",
    ending: true,
    ending_label: "Mined",
    ending_class: "bad"
  },

  // -----------------------------------------------
  // TRADER — in his clearing east of the main forest path
  // -----------------------------------------------

  scene_trader: {
    sprite: "trader_idle",
    text: "You walk up to the hooded figure. He looks up from where he's leaning against his cart.\n\n\"Customer. Good. Plumpy said someone might be down.\"",
    choices: [
      { text: "What've you got?",  next: "scene_trader_offer" },
      { text: "Maybe later",       next: "scene_forest" }
    ]
  },

  scene_trader_offer: {
    sprite: "trader_dialogue",
    text: "He sweeps his coat open. Three items hang from the lining, pinned in place.\n\n\"I got three things on me — uranium, bananas, funko pops. What're you in for?\"",
    choices: [
      { text: "I'll take some uranium",     next: "scene_trader_uranium" },
      { text: "I'll take some bananas",     next: "scene_trader_bananas" },
      { text: "Funko pops, please",         next: "scene_trader_funko" },
      { text: "Maybe later",                next: "scene_forest" }
    ]
  },

  scene_trader_uranium: {
    route: (s) => s.has_pit ? "ending_uranium" : "ending_trader_crushed"
  },

  scene_trader_funko: {
    route: (s) => s.has_pit ? "ending_funko" : "ending_trader_crushed"
  },

  scene_trader_bananas: {
    sprite: "trader_dialogue",
    text: "The trader raises an eyebrow. \"Bananas. Alright. How many you need?\"",
    input: {
      placeholder: "Number of bananas",
      accept: ["10^21", "10**21", "1e21", "1e+21", "10e21", "1000000000000000000000"],
      success_next: "scene_trader_bananas_check",
      error_next: "scene_trader_bananas_wrong_router"
    },
    choices: [
      { text: "Let me get back to you on that...", next: "scene_forest" }
    ]
  },

  scene_trader_bananas_check: {
    route: (s) => s.has_pit ? "scene_trader_bananas_done" : "ending_trader_crushed"
  },

  scene_trader_bananas_wrong_router: {
    route: (s) => s.has_pit ? "scene_trader_bananas_wrong" : "ending_trader_crushed"
  },

  scene_trader_bananas_done: {
    sprite: "banana_cluster",
    text: "The trader snaps his fingers. A cascade of 10²¹ bananas pours from somewhere above — directly into your bottomless pit. The pit absorbs them without comment.\n\nThe trader nods. \"Good doing business. Tell Plumpy I'm even with him.\"\n\nHe turns and walks off into the dark.",
    set: { has_bananas: true },
    choices: [
      { text: "Head back inside to the Plumpy room", next: "scene_plumpy_main" }
    ]
  },

  // -----------------------------------------------
  // TRADER FAILURE PATHS
  // -----------------------------------------------

  ending_trader_crushed: {
    sprite: "trader_dialogue",
    text: "Without a bottomless pit to receive them, the items pile up immediately and catastrophically on top of you.\n\nThe trader, somewhere underneath the rubble, mutters \"this is on you, not me.\"",
    ending: true,
    ending_label: "Crushed by Inventory",
    ending_class: "bad"
  },

  // Wrong-number bananas with pit: reactor sputter → John kicks you in → Reagan
  scene_trader_bananas_wrong: {
    text: "The trader hands you a sack of bananas. You haul them inside. The RBMK sputters to life — for about half a second.\n\nThen it makes a sound like a kettle going through a wood chipper, and shuts down again.\n\nUpstairs, you hear footsteps. Heavy ones. Annoyed ones.",
    choices: [
      { text: "Wait for it...", next: "scene_john_furious" }
    ]
  },

  // Post-bananas trader check-in
  scene_trader_followup: {
    sprite: "trader_idle_3",
    text: "The trader straightens up off the cart and waves you over.\n\n\"How are those bananas working out? I had to pull a lot of strings for that.\"",
    choices: [
      { text: "Fueled the reactor. Thanks.", next: "scene_forest" },
      { text: "Don't ask.",                   next: "scene_forest" }
    ]
  },

  // -----------------------------------------------
  // KITTY STORE — landmark in the western clearing
  // -----------------------------------------------

  scene_kitty_store: {
    text: "You step into the little shop tucked into the western clearing. The clerk looks up from a half-finished crossword. He sets down his pen.\n\n\"Cat treats? Aisle one. Only aisle, really.\"\n\nHe waves you toward a single shelf with three options.",
    choices: [
      { text: "The treat tube",  next: "scene_forest", set: { has_tube: true, has_hard_treats: false, has_catnip: false } },
      { text: "The hard treats", next: "scene_forest", set: { has_tube: false, has_hard_treats: true, has_catnip: false } },
      { text: "The catnip",      next: "scene_forest", set: { has_tube: false, has_hard_treats: false, has_catnip: true } }
    ]
  },

  // -----------------------------------------------
  // JOHN FURIOUS / REAGAN (bananas wrong-number aftermath)
  // -----------------------------------------------

  scene_john_furious: {
    sprite: "john_appear",
    text: "John Prime phases into the Plumpy room. He looks at the sputtering reactor. He looks at the bananas. He looks at you.\n\n\"That was the WRONG NUMBER.\"\n\nHe gestures. You feel yourself lifted off the floor.\n\nThe bottomless pit yawns open. John, with great care and great anger, deposits you into it.",
    choices: [
      { text: "Fall", next: "ending_reagan_trapped" }
    ]
  },

  ending_reagan_trapped: {
    sprite: "reagan",
    text: "You fall for an indeterminate length of time.\n\nEventually you stop falling, despite the pit being bottomless. Things make less sense down here.\n\nA figure shimmers into existence next to you. Silver hair, blue suit, slight glow. He extends a hand and helps you to your feet.\n\n\"Well, hello there. Ronald Reagan. Former President of the United States. Currently the Ghost Of. They put me down here in 1989 for reasons that were not adequately explained to me at the time.\"\n\nHe pats his pockets, finds nothing.\n\n\"I'm afraid we're both stuck. Bottomless pit. No bottom. No top, anymore, either. We will remain here until some brave and handsome savior comes to rescue us. I have been waiting for him for some time. Decades, in fact. Couldn't tell you exactly. Doesn't matter much.\"\n\nHe smiles warmly.\n\n\"In the meantime — would you like to hear about supply-side economics?\"",
    ending: true,
    ending_label: "Trapped with Reagan",
    ending_class: "bad"
  },
});
