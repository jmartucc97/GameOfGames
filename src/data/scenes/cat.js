// Scenes for module: cat.
// Original source lines 2548-3201 of monolithic story_v2_explore.html
Object.assign(SCENES, {
  // CAT APPROACH (treat in hand)
  // -----------------------------------------------

  scene_approach_cat: {
    sprite: "cat_idle",
    text: "You head back to the lever room, treat in hand.\n\nThe cat is still there, batting the lever from side to side with rhythmic patience. It pauses when you step in, ears swiveling toward you. Its eyes lock on the treat.\n\nThe lever continues its slow oscillation between worlds.",
    choices: [
      { text: "Offer the treat to the cat", next: "scene_feed_cat" }
    ]
  },

  scene_feed_cat: {
    route: (s) => {
      if (s.has_tube) return "scene_cat_satisfied";
      if (s.has_hard_treats) return "ending_ww3_hard";
      if (s.has_catnip) return "ending_ww3_catnip";
      return "scene_backroom_first";
    }
  },

  scene_cat_satisfied: {
    sprite: "cat_idle",
    text: "You squeeze the treat tube. The cat's eyes go wide. It licks furiously.\n\nThe cat purrs. It nuzzles you. It is no longer interested in the lever.\n\nThe lever sits motionless, suspended between states. Whatever you do with it now, the Strait will resolve.",
    choices: [
      { text: "Open the Strait of Hormuz", next: "scene_john_open" },
      { text: "Close the Strait of Hormuz", next: "scene_john_closed" }
    ]
  },

  scene_john_open: {
    sprite: "john_idle",
    text: "You pull the lever. The Strait of Hormuz: OPEN.\n\nThe door bangs open behind you. John Prime stands in the threshold, eyes narrowed.\n\n\"So. You wouldn't happen to have opened the Strait of Hormuz using my bottomless pit, my RBMK reactor, and humanity's entire historical banana yield... right?\"",
    choices: [
      { text: "Lie — \"No, it was already open\"", next: "ending_john_dust" },
      { text: "Tell the truth — \"Yes, that's exactly what I did\"", next: "scene_john_truth_open" },
      { text: "\"It was like that when I got here\"", next: "scene_john_kitties" }
    ]
  },

  scene_john_closed: {
    sprite: "john_friendly",
    text: "You press the lever down. The Strait of Hormuz: CLOSED.\n\nThe door bangs open behind you. John Prime walks in, hands in his robe pockets, looking pleased.\n\n\"Ah, right on. Keeping it closed for now. Did Plumpy tip you off?\"",
    choices: [
      { text: "Lie — \"No, no one tipped me off\"", next: "ending_john_dust" },
      { text: "Tell the truth — \"Yes, Plumpy hinted at it\"", next: "scene_john_truth_close" },
      { text: "\"It was like that when I got here\"", next: "scene_john_kitties" }
    ]
  },

  ending_john_dust: {
    sprite: "john_attack",
    text: "John Prime tilts his head.\n\n\"You know I can see the lever, right? I put it there.\"\n\nHe gestures. You become a small, sad pile of dust on the floor. The cat sniffs you once, unimpressed.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  scene_john_truth_open: {
    sprite: "john_idle",
    text: "John Prime sighs the sigh of a man who has watched too many people make exactly this mistake.\n\n\"You know what? You've shown initiative. I'm gonna give you a job.\"\n\nHe hands you a clipboard and a pen.\n\n\"Bottomless Pit Supervisor. The pay is bad. The work is steady. Get to it.\"",
    choices: [
      { text: "Accept the position", next: "scene_pit_cycle_1" }
    ]
  },

  scene_pit_cycle_1: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDYDDDDDDD",
      "DDDDDDDYYYDDDDDD",
      "DDDDDDDYYYDDDDDD",
      "DDDDDDDDYDDDDDDD",
      "DDDDDDDDKDDDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDOOOOOOOODDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "Day 1. You stand at the edge of the pit. You peer in. It is bottomless.\n\nYou log it.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_2" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_2: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDYDDDDDDD",
      "DDDDDDDYYYDDDDDD",
      "DDDDDDDDYDDDDDDD",
      "DDDDDDDDKDDDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDOOOOOOOODDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "Day 12. You peer in. Still bottomless. The clipboard has 47 entries.\n\nYou are getting the hang of this.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_3" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_3: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDYDDDDDDD",
      "DDDDDDDYYYDDDDDD",
      "DDDDDDDDKDDDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDWWWWWWWDDDDD",
      "DDDWWWWWWWWWDDDD",
      "DDDDOOOOOOOODDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "Year 1. The seasons stopped meaning anything months ago. The pit remains bottomless.\n\nYou have moved through four full notebooks.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_4" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_4: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDYDDDDDDD",
      "DDDDDDDDKDDDDDDD",
      "DDDDDDWWWWDDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDWWWWWWWWDDDD",
      "DDDWWWWWWWWWWDDD",
      "DDDDOOOOOOOODDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "Year 9. You start to wonder if you are, in fact, the bottom of something.\n\nThe pit does not wonder. The pit remains bottomless.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_5" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_5: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDKDDDDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDWWWWWWWWDDDD",
      "DDDWWWWWWWWWWDDD",
      "DDDDOOOOOOOODDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "Year 47. You can see yourself peering into the pit from previous eras, an infinite stack of past selves all confirming the same thing.\n\nVolume seven of the clipboard is full.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_6" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_6: {
    sprite: "john_impressed",
    text: "The air shimmers.\n\nJohn Prime is there, drink in hand, looking impressed despite himself.\n\n\"How's the pit?\"",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_7" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_7: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDYDDDDDDD",
      "DDDDDDDYYYDDDDDD",
      "DDDDDDDYYYDDDDDD",
      "DDDDDDDDYDDDDDDD",
      "DDDDDDDDKDDDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDOOOOOOOODDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "John snaps his fingers. A fresh candle ignites. He vanishes mid-sip.\n\nYear 48. The new flame is bright. You feel a glimmer of something — purpose, maybe? Hope? It dies quickly.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_8" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_8: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDYDDDDDDD",
      "DDDDDDDYYYDDDDDD",
      "DDDDDDDDYDDDDDDD",
      "DDDDDDDDKDDDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDOOOOOOOODDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "Year 87. Civilizations rise and fall above you. The pit, somehow, is exactly the same.\n\nYou verify.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_9" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_9: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDYDDDDDDD",
      "DDDDDDDYYYDDDDDD",
      "DDDDDDDDKDDDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDWWWWWWWDDDDD",
      "DDDWWWWWWWWWDDDD",
      "DDDDOOOOOOOODDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "Year 312. You no longer remember your name.\n\nYou are a function of the pit now. The pit is bottomless. You are the verification of this.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_10" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_10: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDYDDDDDDD",
      "DDDDDDDDKDDDDDDD",
      "DDDDDDWWWWDDDDDD",
      "DDDDDWWWWWWDDDDD",
      "DDDDWWWWWWWWDDDD",
      "DDDWWWWWWWWWWDDD",
      "DDDDOOOOOOOODDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "Year 999. The second candle is nearly gone. You suspect the candle is metaphorical.\n\nThe pit is bottomless. You are very, very tired.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_promotion_10" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_promotion_10: {
    sprite: "john_friendly",
    text: "There's a shimmer in the dark above you.\n\nJohn Prime descends on a thin shaft of light, holding what appears to be a laminated plaque.\n\n\"Listen,\" he says, brushing dust off the laminate. \"I want you to know we don't take what you do for granted. This kind of continuous, unbroken bottomlessness verification is... that's institutional knowledge. That's tradition.\"\n\nHe hands you the plaque. It reads:\n\n    SENIOR PIT SUPERVISOR\n    For Distinguished Service\n    Year 999\n\n\"It comes with a 0% raise and nothing else changes. But you've earned the title. Wear it with pride.\"\n\nHe pats your shoulder. He ascends.",
    set: { pit_promoted_to_senior: true },
    choices: [
      { text: "Thank him and continue the audit", next: "scene_pit_cycle_11" }
    ]
  },

  scene_pit_cycle_11: {
    text: "Year 1,247. You have started to develop opinions about the dark.\n\nThe pit remains bottomless.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_12" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_12: {
    text: "Year 1,800. You have a theory that the pit may, in fact, BE you. You discard the theory. It comes back.\n\nThe pit is bottomless.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_13" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_13: {
    text: "Year 2,500. You can no longer remember what light feels like.\n\nThe pit is bottomless. The pit has always been bottomless.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_14" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_14: {
    text: "Year 3,331. You begin composing a treatise on the philosophy of bottomlessness. You have no paper. You have no audience. You continue regardless.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_15" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_15: {
    text: "Year 5,000. You have heard a sound that may have been John Prime laughing. It came from above. You cannot remember above.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_16" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_16: {
    text: "Year 7,142. A small thing has begun to glow at the periphery of your vision. You do not look directly at it. It might be the bottom. It might be your eyes giving up. You don't check.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_17" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_17: {
    text: "Year 10,000. The number is a guess. Time is a wound you have stopped noticing.\n\nThe pit. Is. Bottomless.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_18" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_18: {
    text: "Year 14,001. You compose a song. It has one note. You hum it. The pit hums it back.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_19" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_19: {
    text: "Year 18,800. Something at the edge of your awareness is approaching. Not from below — from the side. From somewhere else.\n\nThe pit is still bottomless. You verify.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_20" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_20: {
    text: "Year 25,000. You are now older than several mountain ranges.\n\nStill bottomless.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_21" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_21: {
    text: "Year 31,420. You no longer remember language. You verify the pit by feel.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_22" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_22: {
    text: "Year 38,900. You speak only in numbers now. The pit speaks back in primes.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_23" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_23: {
    text: "Year 50,000. A small thing has begun to make sense. You discard it before it can ruin things.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_24" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_24: {
    text: "Year 67,000. You have started to enjoy the work. This worries you, briefly. The feeling passes.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_25" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_25: {
    text: "Year 88,000. You have invented agriculture from first principles. There is no soil. You teach the pit anyway.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_26" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_26: {
    text: "Year 121,000. You realize, with some certainty, that you have always been doing this.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_27" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_27: {
    text: "Year 145,000. The Doppler shift on John Prime's last visit suggests he was moving away from you at relativistic speed. Time may have layers.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_28" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_28: {
    text: "Year 200,000. You have begun composing a sonnet. The first line is: \"The pit is bottomless.\" You are stuck on the second.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_29" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_29: {
    text: "Year 280,000. A glow has returned to the periphery. You do not look at it directly. You suspect it is hope and you don't trust it.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_30" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_30: {
    text: "Year 333,333. Pleasing number. The pit notices. The pit approves.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_31" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_31: {
    text: "Year 400,000. You think you have died once or twice but you cannot be sure.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_32" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_32: {
    text: "Year 512,000. You hear, faintly, the sound of someone humming Monster Mash. It comforts you. You cannot say why.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_33" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_33: {
    text: "Year 666,000. A bad number. You log it twice to be safe.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_34" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_34: {
    text: "Year 780,000. You have lost the ability to remember what you've forgotten. The pit is bottomless.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_35" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_35: {
    text: "Year 901,000. You catch yourself before composing a second sonnet. You learned your lesson the first time.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_36" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_36: {
    text: "Year 1,000,000. A milestone. No one notices. You note it. You continue.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_37" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_37: {
    text: "Year 1,200,000. The candle returns, briefly, then dissolves. It was never there. You miss it terribly.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_38" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_38: {
    text: "Year 1,500,000. You hear bells. You decide the bells aren't real. The bells stop. You are alone with the pit again.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_39" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_39: {
    text: "Year 2,000,000. You have begun to wonder if the pit is bottomless because you are watching it. You stop watching for one second. The pit becomes bottomless faster, as a kind of reproach.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_40" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_40: {
    text: "Year 2,800,000. There is no candle. There is no flame. There is no metaphor. Only the verb: to bottom. Endlessly conjugated.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_41" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_41: {
    text: "Year 3,500,000. Something rises slightly in your awareness, like a name you can't quite recall. It is the word \"chair.\"",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_42" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_42: {
    text: "Year 4,400,000. The Answer.\n\nThe pit, however, is not the Question. The pit is bottomless.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_43" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_43: {
    text: "Year 5,800,000. You suspect that if you found the bottom now you would not recognize it. You're not sure if that's bad.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_44" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_44: {
    text: "Year 7,000,000. The dark begins to thin. Something is happening. You hold the candle that you do not have to a flame that does not exist and you peer in.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_cycle_45" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },

  scene_pit_cycle_45: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDOOOOOOOOOOODD",
      "DDOWWWWWWWWWWODD",
      "DDOWKKKKKKKKWODD",
      "DDOWWWWWWWWWWODD",
      "DDOWKKKKKKKKWODD",
      "DDOWWWWWWWWWWODD",
      "DDOWKKKWKKKKWODD",
      "DDOWWWWWWWWWWODD",
      "DDOWKKKKKKKKWODD",
      "DDOWWWWWWWWWWODD",
      "DDDOOOOOOOOOOODD",
    ],
    text: "Year 7,500,000.\n\nYou hold the candle to the pit one final time.\n\nThe darkness is total. There is no bottom. There has never been a bottom. The audit is complete.\n\nA scroll materializes in your other hand. It says, in John Prime's handwriting: CERTIFIED BOTTOMLESS. Signed, dated, notarized.\n\nThe weight of seven and a half million years of confirmation lifts from your shoulders.",
    choices: [
      { text: "Still bottomless", next: "scene_pit_promoted" },
      { text: "Found the bottom", next: "ending_pit_fired" }
    ]
  },


  scene_pit_promoted: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDxxxDDDDDDDD",
      "DDDDxxxxxDDDDDDD",
      "DDDDDxxxDDDDDDDD",
      "DDDDDxxxDDDDDDDD",
      "DDDDDxxxDDDDDDDD",
      "ssssssssDDDDDDDD",
      "ssssssssDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "In a way, you've won.\n\nYou didn't die. The world is fine. The Strait remains open.\n\nBut you are, and will forever be, the Bottomless Pit Supervisor.\n\nActions and consequences. Or something like that.",
    ending: true,
    ending_label: "You Win",
    ending_class: "win"
  },

  ending_pit_fired: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "RRRRDRRDDRRRDRRD",
      "RDDRDRDRDRDDDRDR",
      "RRDRDRRDDRRDDRDR",
      "RDDRDRDRDRDDDRDR",
      "RDDRDRDRDRRRDRRD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "\"IT'S IN THE NAME. Who in their right mind would need a NORMAL pit supervisor?\"\n\nJohn Prime gestures dismissively. The clipboard combusts.\n\nYou are unemployed. The pit, suspiciously, remains bottomless.",
    ending: true,
    ending_label: "You're Fired",
    ending_class: "bad"
  },

  scene_john_truth_close: {
    sprite: "john_appear",
    text: "John Prime nods slowly. He looks at you with new interest.\n\n\"You know what? You seem like an out-of-the-box thinker. I think you could help me out with something.\"\n\nHe rocks on his heels, pleased.\n\n\"So. With the Strait of Hormuz closed, oil prices are about to do something extremely funny. The plan is we frack the sides of the bottomless pit and make an absolutely indecent amount of money.\"\n\n\"Go talk to Plumpy. He's got the ingredients. You'll need to pick the right ones — I'm not telling you which.\"",
    set: { fracking_initiated: true },
    choices: [
      { text: "Find Plumpy", next: "scene_plumpy_main" }
    ]
  },

  // -----------------------------------------------
});
