// Scenes for module: driveway.
// Original source lines 771-1045 of monolithic story_v2_explore.html
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
  // TRADER — outside the Exit, offers the three items
  // -----------------------------------------------

  scene_trader: {
    sprite: "trader_idle",
    text: "You walk over to the hooded figure. He looks up.\n\n\"Customer. Good. Plumpy said someone might be down.\"",
    choices: [
      { text: "What've you got?",  next: "scene_trader_offer" },
      { text: "Maybe later",       next: "scene_driveway" }
    ]
  },

  scene_trader_offer: {
    sprite: "trader_dialogue",
    text: "He sweeps his coat open. Three items hang from the lining, pinned in place.\n\n\"I got three things on me — uranium, bananas, funko pops. What're you in for?\"",
    choices: [
      { text: "I'll take some uranium",     next: "scene_trader_uranium" },
      { text: "I'll take some bananas",     next: "scene_trader_bananas" },
      { text: "Funko pops, please",         next: "scene_trader_funko" },
      { text: "Maybe later",                next: "scene_driveway" }
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
      { text: "Let me get back to you on that...", next: "scene_driveway" }
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

  // -----------------------------------------------
  // DRIVEWAY HUB — outside the Exit, branches to trader or kitty food store
  // -----------------------------------------------

  scene_driveway: {
    text: (s) => {
      if (s.met_cat && (s.has_tube || s.has_hard_treats || s.has_catnip))
        return "You're back in the driveway. The trader is still propped against his cart, watching. You've got the cat treat in your pocket. Just the cold dark and your car ticking as it cools.";
      if (s.met_cat)
        return "You're back in the driveway. The trader is still leaning on his cart, watching you. The kitty food store is closing soon — better not dawdle.";
      if (s.has_bananas)
        return "You're back in the driveway. The trader is still leaning on his cart, watching you. Whatever else is going on inside that basement, the bananas are handled.";
      return "You step outside. The driveway is dark.\n\nA hooded figure is leaning against a beat-up cart. Behind him, your car waits — keys still in the ignition. Plumpy is somewhere inside still muttering about the trader.";
    },
    choices: [
      { text: "Talk to the trader",            next: "scene_trader",            unless: ["has_bananas"] },
      { text: "Check in with the trader",      next: "scene_trader_followup",   requires: ["has_bananas"] },
      { text: "Drive to the kitty food store", next: "scene_drive_route_select", requires: ["met_cat"], unless: ["has_tube", "has_hard_treats", "has_catnip"] },
      { text: "Go back inside",                next: "scene_test" }
    ]
  },

  // Post-bananas trader check-in
  scene_trader_followup: {
    sprite: "trader_idle_3",
    text: "The trader straightens up off the cart and waves you over.\n\n\"How are those bananas working out? I had to pull a lot of strings for that.\"",
    choices: [
      { text: "Fueled the reactor. Thanks.", next: "scene_driveway" },
      { text: "Don't ask.",                   next: "scene_driveway" }
    ]
  },

  // -----------------------------------------------
  // DRIVE TO STORE — route selection
  // -----------------------------------------------

  scene_drive_route_select: {
    text: "You slide into the car. The dash clock reads 4:53. The store closes at 5:00. GPS pings up two routes.\n\n• Scenic Route — bright pleasant valley road, 11 minutes\n• Alternate — desolate hellscape, 4 minutes\n\nFrom somewhere very deep, you hear what sounds like a thousand souls screaming in agony. The GPS does not comment on this.",
    choices: [
      { text: "Take the scenic route",        next: "scene_drive_scenic_1" },
      { text: "Take the desolate hellscape",  next: "scene_drive_hellscape" }
    ]
  },

  scene_drive_hellscape: {
    text: "You take the hellscape.\n\nThe screaming intensifies. Visibility drops to about ten feet. The things at the side of the road are technically still alive but show no interest in moving. None of them step into the road. None of them dare.\n\nYou arrive at the store with three minutes to spare.",
    choices: [
      { text: "Pull into the parking lot", next: "scene_kitty_store" }
    ]
  },

  // -----------------------------------------------
  // SCENIC ROUTE — three old-people crossings
  // -----------------------------------------------

  scene_drive_scenic_1: {
    sprite: "old_grym",
    text: "The scenic route is gorgeous. Late sun on the autumn trees. A charming red barn. The radio plays Fleetwood Mac.\n\nAn elderly man with a walker is halfway across the road. He sees your car. He waves cheerfully. He continues at approximately the speed of continental drift.",
    choices: [
      { text: "Run him over",          next: "scene_drive_scenic_1_run",  sfx: "explode" },
      { text: "Wait for him to cross", next: "scene_drive_scenic_1_wait", set: { kitty_late: true } }
    ]
  },

  scene_drive_scenic_1_run: {
    text: "There is a soft, definitive *thump*. Then a second, less polite one. The walker bounces off the windshield and into the field.\n\nYou grind over the helpless old man. Do you feel good about yourself? Fleetwood Mac is still playing. They do not appear to feel one way or the other about it.\n\nYou press on.",
    choices: [
      { text: "Continue driving", next: "scene_drive_scenic_2" }
    ]
  },

  scene_drive_scenic_1_wait: {
    text: "You sit, engine idling, and watch the old man execute one step approximately every fifteen seconds.\n\nThe dash clock blinks forward. The store is closing soon, and you find yourself worrying — if you come home without that treat, John Prime is not going to take it well at all.\n\nThe old man finally clears the lane. You press on.",
    choices: [
      { text: "Continue driving", next: "scene_drive_scenic_2" }
    ]
  },

  scene_drive_scenic_2: {
    sprite: "old_hana",
    text: "You drive on. The next farmhouse comes into view.\n\nAn elderly woman is shepherding a folding wire cart full of groceries across the lane. She's making decent progress, by which you mean roughly half a mile per hour. She nods politely at your windshield.",
    choices: [
      { text: "Run her over",          next: "scene_drive_scenic_2_run",  sfx: "explode" },
      { text: "Wait for her to cross", next: "scene_drive_scenic_2_wait", set: { kitty_late: true } }
    ]
  },

  scene_drive_scenic_2_run: {
    text: "Groceries explode across the windshield in a brief, colorful supernova of canned peaches and what was probably a casserole.\n\nYou grind over the helpless old lady. Do you feel good about yourself? Her wire cart is now part of your front grille. The casserole is, in a strange way, an improvement.\n\nYou press on.",
    choices: [
      { text: "Continue driving", next: "scene_drive_scenic_3" }
    ]
  },

  scene_drive_scenic_2_wait: {
    text: "You stop. She nods at you again, mistaking your courtesy for kindness. She is roughly the third of the way across.\n\nThe clock is moving. The store is closing soon, and you cannot stop picturing John Prime's face when you come home empty-handed.\n\nShe clears the lane eventually. You press on.",
    choices: [
      { text: "Continue driving", next: "scene_drive_scenic_3" }
    ]
  },

  scene_drive_scenic_3: {
    sprite: "old_janik",
    text: "You can see the store sign now, just through the trees ahead.\n\nA final elderly gentleman steps off the curb directly in front of you. He raises one hand in the universal gesture of 'I am crossing now, dear, mind yourself.' He has a cane. He is not in a hurry. He never will be.",
    choices: [
      { text: "Run him over",          next: "scene_drive_scenic_3_run",  sfx: "explode" },
      { text: "Wait for him to cross", next: "scene_drive_scenic_3_wait", set: { kitty_late: true } }
    ]
  },

  scene_drive_scenic_3_run: {
    text: "The cane snaps cleanly in half against your bumper. The old gentleman, briefly airborne, is given a final view of the autumn trees he loved so much.\n\nYou grind over the helpless old man. Do you feel good about yourself? The store sign is visible through your bug-spattered windshield. You are going to make it.\n\nYou press on.",
    choices: [
      { text: "Pull into the parking lot", next: "scene_drive_scenic_resolve" }
    ]
  },

  scene_drive_scenic_3_wait: {
    text: "You wait. The old gentleman is, if anything, slower than the previous two. The store sign is right there.\n\nYou stare at the dash clock and try not to think about John Prime, but the longer you sit here, the more vivid the mental image becomes.\n\nHe clears the lane. You press on.",
    choices: [
      { text: "Pull into the parking lot", next: "scene_drive_scenic_resolve" }
    ]
  },

  scene_drive_scenic_resolve: {
    route: (s) => s.kitty_late ? "scene_kitty_store_closed" : "scene_kitty_store"
  },

  // -----------------------------------------------
  // KITTY STORE — on time
  // -----------------------------------------------

  scene_kitty_store: {
    text: "You pull in just as the clerk is reaching for the lock. He sees the look on your face and steps back from the door.\n\n\"Five minutes,\" he says, waving you toward the cat-treat aisle. \"You know what you're after?\"",
    choices: [
      { text: "The treat tube",  next: "scene_drive_back", set: { has_tube: true, has_hard_treats: false, has_catnip: false } },
      { text: "The hard treats", next: "scene_drive_back", set: { has_tube: false, has_hard_treats: true, has_catnip: false } },
      { text: "The catnip",      next: "scene_drive_back", set: { has_tube: false, has_hard_treats: false, has_catnip: true } }
    ]
  },

  scene_drive_back: {
    text: "Treat in hand, you drive back. The route home is uneventful, presumably because everyone is now indoors for dinner.\n\nYou pull into the driveway, climb out, and head back inside.",
    choices: [
      { text: "Enter the basement", next: "scene_test" }
    ]
  },

  // -----------------------------------------------
  // KITTY STORE — too late
  // -----------------------------------------------

  scene_kitty_store_closed: {
    text: "You pull into the parking lot at 5:04.\n\nThe clerk is locking the front door. He sees you, sighs, and points sympathetically at the OPEN/CLOSED sign — which has been flipped. He gets into his own car and drives away.\n\nThe lot is empty. The cat at home is, presumably, still doing what it does.",
    choices: [
      { text: "Drive home defeated", next: "ending_kitty_store_closed" }
    ]
  },

  ending_kitty_store_closed: {
    text: "You return to the basement empty-handed.\n\nThe cat is still at the lever. The lever is still doing what the lever does. With nothing to distract it, the cat continues. The lever eventually fails. The Strait of Hormuz, suspended between open and closed, resolves into 'permanently both at once.' Markets cannot price reality. World War Three begins on schedule.\n\nSomewhere on the scenic route, three elderly people are shuffling home, complaining about how kids these days have no patience.",
    ending: true,
    ending_label: "Held Up by Old People",
    ending_class: "bad"
  },

  scene_john_furious: {
    sprite: "john_attack",
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
