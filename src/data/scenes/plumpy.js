// Scenes for module: plumpy.
// Original source lines 1621-2040 of monolithic story_v2_explore.html
Object.assign(SCENES, {
  // DO NOT ENTER routing
  // -----------------------------------------------

  scene_donotenter_router: {
    route: (s) => {
      if (s.has_plums) return "ending_plumpy_plums";
      // Pit-fall: pit exists, no flashlight, haven't met Plumpy (room is dark)
      if (s.has_pit && !s.has_flashlight && !s.plumpy_lit_room) return "ending_fall_in_pit";
      // Samara spawns when player re-enters Plumpy room after John interaction (and pit exists)
      if (s.john_handled && s.has_pit && !s.samara_spawned && !s.samara_resolved) return "scene_samara_intro";
      if (s.reactor_powered) return "scene_plumpy_main";
      if (s.has_flashlight && !s.met_plumpy) return "scene_plumpy_first";
      if (s.met_plumpy) return "scene_plumpy_main";
      return "scene_chubba";
    }
  },

  ending_fall_in_pit: {
    art: [
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKxxKKKKKKK",
      "KKKKKKKxxKKKKKKK",
      "KKKKKKxxxxKKKKKK",
      "KKKKKKxxxxKKKKKK",
      "KKKKKKKxxKKKKKKK",
      "KKKKKKKxxKKKKKKK",
      "KKDDDDDDDDDDDDKK",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "You step into the dark room.\n\nA half-second later, the floor isn't there.\n\nYou fall forever.\n\nShould've known that was the obvious spot for the bottomless pit.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  ending_plumpy_plums: {
    art: [
      "DDDDDDpPPpDDDDDD",
      "DDDDpPPPPPPpDDDD",
      "DDDpPPPPPPPPpDDD",
      "DDpPPRRPPPPRRPpD",
      "DDpPPRRPPPPRRPpD",
      "DDpPPRRRRRRRRPpD",
      "DpPPPPRRRRRRPPpD",
      "PpPPPPPPPPPPPPpP",
      "DDPPPPPPPPPPPPDD",
      "DDDDttuuuuuttDDD",
      "DDDDDttuuuttDDDD",
      "ssssssssssssssss",
    ],
    text: "You step into the dark. A voice booms: \"WAIT. I SMELL... PLUMS?\"\n\nPlumpy materializes inches from your face, pupils wide.\n\n\"Oh no. Oh NO. They look JUST LIKE GRANDFATHER PLUMPA.\"\n\nHe consumes the plums whole. The grief becomes rage. The rage turns to you.\n\nYou are next.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  // -----------------------------------------------
  // CHUBBA (no flashlight)
  // -----------------------------------------------

  scene_chubba: {
    art: [
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKDDDDDDKKKKK",
      "KKKDDDDDDDDDDKKK",
      "KKDDDDKKKKDDDDKK",
      "KKDDDKKKKKKDDDKK",
      "KKDDDKKKKKKDDDKK",
      "KKDDDDKKKKDDDDKK",
      "KKKDDDDDDDDDDKKK",
      "KKKKKDDDDDDKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
    ],
    text: "Cautiously, you enter the room, and an unnatural darkness flows out. You hear a voice boom out from deeper in the room, asking you to state your business.",
    choices: [
      { text: "Turn back the way you came", next: "scene_test" },
      { text: "Talk to the void — say you are lost and confused", next: "scene_void_talk" },
      { text: "Put your guard up and walk deeper into the room", next: "ending_void_death" }
    ]
  },

  scene_void_talk: {
    art: [
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKDDDDDDKKKKK",
      "KKKDDDDDDDDDDKKK",
      "KKDDDDKKKKDDDDKK",
      "KKDDDKKKKKKDDDKK",
      "KKDDDKKKKKKDDDKK",
      "KKDDDDKKKKDDDDKK",
      "KKKDDDDDDDDDDKKK",
      "KKKKKDDDDDDKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
    ],
    text: "You stammer that you are lost and confused.\n\nThe voice pauses. Then booms:\n\n\"FIND A LIGHT. THEN WE CAN TALK.\"\n\nIt feels like a hint.",
    choices: [
      { text: "Back to the basement", next: "scene_test" }
    ]
  },

  ending_void_death: {
    art: [
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKxxxKKKxxxKKK",
      "KKxxxRRRxRRRxxKK",
      "KKKxxRRRxRRRxxKK",
      "KKKKxxxKKKxxxKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
    ],
    text: "You walk deeper. The darkness folds around you.\n\nYou never come back.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  // -----------------------------------------------
  // PLUMPY
  // -----------------------------------------------

  scene_plumpy_first: {
    art: [
      "DDDDDDpPPpDDDDDD",
      "DDDDpPPPPPPpDDDD",
      "DDDpPPPPPPPPpDDD",
      "DDpPPWKPPPPKWPpD",
      "DDpPPWWPPPPWWPpD",
      "DDpPPPPPKKPPPPpD",
      "DpPPPPPPPPPPPPpD",
      "PpPPPPPPPPPPPPpP",
      "DDPPPPPPPPPPPPDD",
      "DDDDttUuUuUttDDD",
      "DDDDDttUuUttDDDD",
      "ssssssssssssssss",
    ],
    text: (s) => {
      let base = "You flick on the flashlight. The darkness recoils.\n\nStanding before you is a large, shaggy green creature with a fistful of small purple buttons stuck to his belly and a wicker basket of plums tucked under one arm. He waves the other paw.\n\n\"Oh hi! I'm Plumpy. From Candy Land. Don't ask.\"\n\nHe squints at your flashlight. \"Oh — hold on a sec.\"\n\nHe shuffles over to a wall, flicks a switch, and the entire room floods with normal indoor lighting. He plucks the flashlight from your hand and pockets it.\n\n\"Don't need that anymore. Knew there was a switch in here somewhere.\"\n\nBehind him, an enormous industrial reactor labeled \"RBMK — PRIPYAT\" hums quietly in the now-lit room. Next to it sits a small steel barrel, stenciled \"K-40\"";
      if (s.has_pit) base += ", and a black, inky bottomless pit yawns open right beside it";
      return base + ".";
    },
    set: { met_plumpy: true, has_flashlight: false, plumpy_lit_room: true, plumpy_disarmed_mine: true },
    choices: [
      { text: "Continue", next: "scene_plumpy_main" }
    ]
  },

  // Explore room — walk-around Plumpy room
  scene_plumpy_main: {
    // Defense-in-depth: if for any reason the player reaches here without
    // having lit the room, redirect to the dark-room dialogue. Normally
    // scene_donotenter_router handles this, but if any future scene routes
    // here directly we still get the right behavior.
    route: (s) => (!s.plumpy_lit_room && !s.has_flashlight) ? "scene_chubba" : null,
    explore_room: "plumpy"
  },

  // Dialogue: tap Plumpy in the room to open this
  scene_plumpy_talk: {
    art: [
      "DDDDDDpPPpDDDNNN",
      "DDDDpPPPPPPpDNNN",
      "DDDpPPPPPPPPpNNN",
      "DDpPPWKPPPPKWPpN",
      "DDpPPWWPPPPWWPpN",
      "DDpPPPPPKKPPPPpN",
      "DpPPPPPPPPPPPPpN",
      "PpPPPPPPPPPPPPpN",
      "DDPPPPPPPPPPPPNN",
      "DDDDttUuUuUttNNN",
      "DDDDDttUuUttDNNN",
      "ssssssssssssssss",
    ],
    text: (s) => {
      if (s.fracking_initiated) return "Plumpy is waiting for you, surrounded by jugs, bottles, and barrels.\n\n\"Ah! John said you were on the way. Pit-fracking is a delicate art. We need three things, and only one option per category is correct. Pay attention.\"";
      if (s.reactor_powered) return "Plumpy stands next to the now-glowing RBMK. \"The back door is open! Whatever's in there has been locked away forever. Probably for a reason. Have fun!\"\n\nHe leans in a bit.\n\n\"Oh — and John says the kitty food store is closing soon. If whatever's back there needs a treat, you'd better book it.\"";
      if (s.has_bananas) return "Plumpy gives you a thumbs up. \"Great. Now hook the reactor up to the bottomless pit. The fuel line's right there.\"";
      if (s.plumpy_disarmed_mine) return "Plumpy gestures vaguely toward the Exit. \"Mine's off. Talk to the trader if you want — he's got that thing John ordered.\"";
      return "Plumpy adjusts his hat and points at the RBMK.\n\n\"My good buddy has been trying to turn this on, but he said he modified it somehow... beats me what he did.\"\n\nHe scratches his chin.\n\n\"There's a trader supposed to deliver something outside. I'll turn the trip mine off so you can get out there.\"";
    },
    choices: [
      { text: "Help me frack the pit", next: "scene_frack_q1", requires: ["fracking_initiated"] },
      { text: "Hook up the reactor to the bottomless pit", next: "scene_fuel_reactor", requires: ["has_bananas"], unless: ["reactor_powered", "fracking_initiated"] },
      { text: "Enter the back room", next: "scene_backroom_router", requires: ["reactor_powered"], unless: ["fracking_initiated"] },
      { text: "Attack Plumpy", next: "ending_attack_plumpy" },
      { text: "Step away from Plumpy", next: "scene_plumpy_main", unless: ["fracking_initiated"] }
    ]
  },

  ending_uranium: {
    art: [
      "RRRRRRRRRRRRRRRR",
      "RRxxxxxxxxxxxxRR",
      "RxxxxnnNNNNxxxxR",
      "RxxnNNNNNNNNNxxR",
      "RxnNNNnnnnNNNNxR",
      "RxNNNnnnnnnnNNxR",
      "RxnNNNnnnnNNNNxR",
      "RxxnNNNNNNNNNxxR",
      "RxxxxnNNNNxxxxRR",
      "RRxxxxxxxxxxxxRR",
      "RRRRRRRRRRRRRRRR",
      "RRRRRRRRRRRRRRRR",
    ],
    text: "Plumpy hands you a glowing rod of enriched uranium with a friendly smile.\n\nYou feed it to the RBMK.\n\nThe RBMK was, in fact, designed for uranium. The amount you fed it, however, was not. The graphite tips slip. The void coefficient does its thing.\n\nElevated.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  ending_funko: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDOOOODDDDDD",
      "DDDDOOOOOOOODDDD",
      "DDDOOWWOOWWOODDD",
      "DDDOOWKWWWKWOODD",
      "DDDOOOOKKKOOOODD",
      "DDDDOOOOOOOOODDD",
      "DDDDDOOOOOOODDDD",
      "DDDDOOOOOOOOODDD",
      "DDDDOOOOOOOOODDD",
      "ssssssssssssssss",
      "ssssssssssssssss",
    ],
    text: "Plumpy raises an eyebrow.\n\n\"Y'know... you really aren't the type of guy my boss would want around here.\"\n\nHe gestures. The door slams behind you. You're back on the street, holding a single Funko Pop, with no memory of the last hour and a vague sense of shame.",
    ending: true,
    ending_label: "You Lose",
    ending_class: "bad"
  },

  ending_attack_plumpy: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDxxxxxxDDDDD",
      "DDDxxxxxxxxxxDDD",
      "DDxxxxxxxxxxxxDD",
      "DxxxRRxxxxRRxxxD",
      "DxxxRRxxxxRRxxxD",
      "DxxxxxxxxxxxxxxD",
      "DxxxxKKKKKKxxxxD",
      "DxxxxxxxxxxxxxxD",
      "DDxxxxxxxxxxxxDD",
      "DDDxxxxxxxxxxDDD",
      "ssssssssssssssss",
    ],
    text: "You swing at Plumpy.\n\nIt turns out Plumpy is made of dense, shaggy, surprisingly bulletproof fur over a body of pure attitude. Your fist shatters on impact. Plumpy looks concerned but cannot help.\n\nYou bleed out at his feet. The plums roll out of his basket and judge you.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  // -----------------------------------------------
  // RBMK
  // -----------------------------------------------

  scene_fuel_reactor: {
    art: [
      "DDDDNNNNNNNNNNDD",
      "DDNNnnnnnnnnnNND",
      "DNNnnSSSSSSSSnNN",
      "DNnnSSnnnnnnSSNN",
      "DNnnSnnnnnnnnSNN",
      "DNnnSnnnnnnnnSNN",
      "DNnnSnnnnnnnnSNN",
      "DNnnSSnnnnnnSSNN",
      "DNNnnSSSSSSSSnNN",
      "DDNNnnnnnnnnnNND",
      "DDDDNNNNNNNNNNDD",
      "ssssssssssssssss",
    ],
    text: "You approach the RBMK. The stenciled letters read \"PRIPYAT.\" A fuel chute waits, open.\n\nYou connect your bottomless pit and 10^21 bananas pour into the reactor core over twelve seconds.\n\nThe RBMK hums to life. Behind you, a heavy door grinds open in the back wall.",
    set: { reactor_powered: true },
    choices: [
      { text: "Enter the back room", next: "scene_backroom_router" },
      { text: "Stay and chat with Plumpy", next: "scene_plumpy_main" }
    ]
  },

  // -----------------------------------------------
  // PLUMPY ROOM INTERACTIONS — RBMK / barrel / pit / locked door
  // -----------------------------------------------

  scene_reactor_inspect: {
    sprite: "reactor_off",
    text: (s) => {
      if (s.has_bananas) return "You walk up to the RBMK. The fuel chute is open. The reactor is waiting.\n\n10^21 bananas, the bottomless pit, and this chute are about to have a complicated relationship.";
      if (s.has_pit) return "The RBMK looms. The stenciled label reads \"PRIPYAT.\"\n\nA fuel chute hangs open and inviting. You have a bottomless pit. You do not yet have anything to put in it. The trader mentioned bananas.";
      return "An enormous industrial reactor, label \"RBMK — PRIPYAT.\" It hums faintly. The fuel chute is open, expectant.\n\nYou have neither fuel nor a way to deliver it. Plumpy did mention something about a trader.";
    },
    choices: [
      { text: "Hook up the bottomless pit", next: "scene_fuel_reactor", requires: ["has_bananas"] },
      { text: "Step back",                   next: "scene_plumpy_main" }
    ]
  },

  scene_reactor_inspect_on: {
    sprite: "reactor_on",
    text: "The RBMK is glowing softly, humming with newfound purpose. The fuel chute is closed, sealed by hydraulic action.\n\nThe heavy back door has ground open. Whatever's back there has been waiting a while.",
    choices: [
      { text: "Enter the back room", next: "scene_backroom_router" },
      { text: "Step back",            next: "scene_plumpy_main" }
    ]
  },

  scene_barrel_inspect: {
    sprite: "k40_barrel",
    text: "A small steel barrel, painted hazard yellow, stenciled \"K-40\" in heavy black serifs. A trefoil symbol decorates the side. Two warning bands wrap the cylinder.\n\nIt is unsealed. It hums very slightly. Standing this close, the air tastes faintly of iron.\n\nYou get the strong sense that touching it would be — to use the technical term — a really bad idea.",
    choices: [
      { text: "Pry it open and look inside", next: "ending_barrel_open" },
      { text: "Leave it alone, step back",    next: "scene_plumpy_main" }
    ]
  },

  ending_barrel_open: {
    sprite: "k40_barrel",
    text: "You pry the lid off the K-40 barrel.\n\nThere is nothing visible inside, which is the worst-case scenario. The 1.25 MeV gamma ray that exits the barrel and passes through your torso is, technically speaking, also invisible.\n\nYou feel briefly warm. You sit down. You do not get back up.\n\nPlumpy, later, sighs heavily and notes that the lid was on for a reason.",
    ending: true,
    ending_label: "Curiosity Killed the Player",
    ending_class: "bad"
  },

  scene_pit_confirm: {
    sprite: "bottomless_pit",
    text: "You're standing at the edge of the bottomless pit.\n\nIt is a hole. The hole has no bottom. That is, in fact, its entire deal.\n\nWind comes up out of it that should not exist in a basement.",
    choices: [
      { text: "Step into the pit",      next: "ending_step_into_pit" },
      { text: "Back away from the pit", next: "scene_plumpy_main" }
    ]
  },

  ending_step_into_pit: {
    sprite: "bottomless_pit",
    text: "You step into the bottomless pit.\n\nYou fall.\n\nYou keep falling.\n\nSome time later — it is impossible to say how much — you are still falling. The walls of the pit are gone. The basement is gone. You are not sure if you are still you.\n\nSomewhere far above, Plumpy says, to no one in particular, \"yeah, that one's on him.\"",
    ending: true,
    ending_label: "Fell Into the Bottomless Pit (On Purpose)",
    ending_class: "bad"
  },

  scene_locked_door_message: {
    sprite: "door_locked",
    text: "The heavy back door is sealed shut. There's no handle, no keyhole, just a featureless slab of steel.\n\nA small note taped to it reads, in Plumpy's handwriting: \"Powered door. Needs juice from the RBMK. Sorry.\"",
    choices: [
      { text: "Step back", next: "scene_plumpy_main" }
    ]
  },

  // -----------------------------------------------
});
