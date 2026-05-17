// Scenes for module: fracking.
// Original source lines 3202-3469 of monolithic story_v2_explore.html
Object.assign(SCENES, {
  // FRACKING — 3 silent questions, then resolution
  // -----------------------------------------------

  scene_frack_q1: {
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
    text: "Plumpy lays three jugs at your feet.\n\n\"First, the base. We need a carrier liquid. Pick one.\"",
    choices: [
      { text: "Holy water", next: "scene_frack_q2", set: { frack_q1_wrong: false } },
      { text: "Mountain Dew", next: "scene_frack_q2", set: { frack_q1_wrong: true, frack_q1_pick: "dew" } },
      { text: "Communion wine", next: "scene_frack_q2", set: { frack_q1_wrong: true, frack_q1_pick: "wine" } }
    ]
  },

  scene_frack_q2: {
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
      let reaction;
      if (s.frack_q1_wrong) {
        if (s.frack_q1_pick === "dew") reaction = "Plumpy squints at the Mountain Dew. \"Hmm. ...Sure. Bold choice.\"";
        else reaction = "Plumpy holds the wine up to the light and frowns. \"You're the boss. Allegedly.\"";
      } else {
        reaction = "Plumpy nods slowly. \"Mm-hmm. We'll see.\"";
      }
      return reaction + "\n\nHe presents three new options.\n\n\"Next, a gelling agent. We need to thicken it so it can carry the proppant.\"";
    },
    choices: [
      { text: "Jello", next: "scene_frack_q3", set: { frack_q2_wrong: false } },
      { text: "Laundry detergent", next: "scene_frack_q3", set: { frack_q2_wrong: true, frack_q2_pick: "detergent" } },
      { text: "ZzzQuil", next: "scene_frack_q3", set: { frack_q2_wrong: true, frack_q2_pick: "zzzquil" } }
    ]
  },

  scene_frack_q3: {
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
      let reaction;
      if (s.frack_q2_wrong) {
        if (s.frack_q2_pick === "detergent") reaction = "Plumpy stares at the detergent bottle. \"You sure about that, chief? ...Okay.\"";
        else reaction = "Plumpy hefts the ZzzQuil. \"Interesting strategy. Putting the pit to sleep. Hm.\"";
      } else {
        reaction = "Plumpy gives a small approving grunt. Or maybe a skeptical one. Hard to tell.";
      }
      return reaction + "\n\nHe sets down three bags.\n\n\"Last one. The proppant. Holds the fracture open after the pressure drops.\"";
    },
    choices: [
      { text: "Walnut shells", next: "scene_frack_mix", set: { frack_q3_wrong: false } },
      { text: "Kitty litter", next: "scene_frack_mix", set: { frack_q3_wrong: true, frack_q3_pick: "litter" } },
      { text: "Crushed Funko Pops", next: "scene_frack_mix", set: { frack_q3_wrong: true, frack_q3_pick: "funko" } }
    ]
  },

  scene_frack_mix: {
    art: [
      "DDDDDDpPPpDDDDDD",
      "DDDDpPPPPPPpDDDD",
      "DDDpPPPPPPPPpDDD",
      "DDpPPWKPPPPKWPpD",
      "DDpPPWWPPPPWWPpD",
      "DDpPPPPKKKKPPPpD",
      "DpPPPPPPPPPPPPpD",
      "PpPPPPPPPPPPPPpP",
      "DDPPPPPPPPPPPPDD",
      "DDDDttUuUuUttDDD",
      "DDDDDttUuUttDDDD",
      "ssssssssssssssss",
    ],
    text: (s) => {
      let reaction;
      if (s.frack_q3_wrong) {
        if (s.frack_q3_pick === "litter") reaction = "Plumpy looks at the bag of kitty litter. He looks at you. He says nothing.";
        else reaction = "Plumpy holds up the crushed Funko Pops and shakes his head once. He doesn't comment.";
      } else {
        reaction = "Plumpy gathers up the walnut shells. He almost looks impressed. Almost.";
      }
      return reaction + "\n\nHe pours everything you picked into a single barrel and stirs it. The mixture inside is... a mixture.\n\n\"Alright. Take it to the pit. Pour it in. See what happens.\"";
    },
    choices: [
      { text: "Pour the slurry into the bottomless pit", next: "scene_frack_resolve" }
    ]
  },

  scene_frack_resolve: {
    route: (s) => (!s.frack_q1_wrong && !s.frack_q2_wrong && !s.frack_q3_wrong) ? "scene_epa_arrives" : "ending_frack_fail"
  },

  ending_true_win: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDYYYYYYYYDDDD",
      "DDDYYYYYYYYYYDDD",
      "DDYYYYYYYYYYYYDD",
      "DYYYYggggggYYYYD",
      "DYYYYgggggYYYYYD",
      "DYYYYYggggYYYYYD",
      "DYYYYYYYYYYYYYYD",
      "DDYYYYYYYYYYYYDD",
      "DDDYYYYYYYYYYDDD",
      "yyyyyyyyyyyyyyyy",
      "ssssssssssssssss",
    ],
    text: "You pour the slurry. Holy water carries jello-thickened walnut shells deep into the bottomless pit. The shells wedge into the new fractures and hold them open. Pressure stabilizes. Somewhere in the pit, a well screams to life.\n\nJohn Prime materializes beside you, drink in hand.\n\n\"Well, we have irreparably harmed the global economy, plunged millions into famine, and kinda ruined my bespoke bottomless pit, but hey — we fracked the bottomless pit. I guess you win. Crazy. Anyway, let's drink.\"",
    ending: true,
    ending_label: "You Win",
    ending_class: "win"
  },

  ending_frack_fail: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDxxxxxxxxDDDD",
      "DDDxxxxxxxxxxDDD",
      "DDxxKKxxxxKKxxDD",
      "DDxxxxxxxxxxxxDD",
      "DDxxxKKKKKKxxxDD",
      "DDDxxxxxxxxxxDDD",
      "DDDDxxxxxxxxDDDD",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
    ],
    text: (s) => {
      let lines = ["You pour the slurry into the bottomless pit. The pit accepts these offerings. It does not frack."];
      lines.push("");
      lines.push("John Prime materializes, looks into the pit, and sighs.");
      lines.push("");
      if (s.frack_q1_wrong) {
        if (s.frack_q1_pick === "dew") {
          lines.push("Mountain Dew? It's mostly water with high-fructose corn syrup, citric acid, and caffeine. The syrup ferments downhole and the citric acid eats the equipment. You've fracked nothing and brewed a 21,000-foot-deep meth-adjacent moonshine.");
        } else {
          lines.push("Wine is 12% alcohol and 88% water, fine in theory — except the residual sugars and tannins drop out under pressure and gum up the perforations. You've made the world's most expensive grape juice.");
        }
        lines.push("");
      }
      if (s.frack_q2_wrong) {
        if (s.frack_q2_pick === "detergent") {
          lines.push("Detergent has surfactants, sure. It also has sodium carbonate, which precipitates out the second it hits the calcium-rich shale, and now you've cemented your own fracture closed. Congratulations, you've un-fracked it.");
        } else {
          lines.push("ZzzQuil is mostly water, polyethylene glycol, and a sedative antihistamine. It does have the right viscosity. It also breaks down at 80°C and you've just sedated the entire bottomless pit. The pit is now asleep. You cannot frack a sleeping pit.");
        }
        lines.push("");
      }
      if (s.frack_q3_wrong) {
        if (s.frack_q3_pick === "litter") {
          lines.push("Kitty litter is bentonite clay, which swells when it gets wet and collapses under load. Your proppant absorbed the slurry, ballooned to three times its size, then crumpled like a wet sponge the moment pressure hit. The fracture sealed itself.");
        } else {
          lines.push("Funko Pops are ABS plastic. ABS softens at 220°F. Your proppant melted into a single congealed mass of vinyl despair somewhere around 8,000 feet down. The blob is still down there. It will be down there forever.");
        }
        lines.push("");
      }
      lines.push("John gestures. You become a small, sad pile of dust on the floor.");
      return lines.join("\n");
    },
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  scene_john_kitties: {
    sprite: "john_attack",
    text: "John Prime looks at the cat. Then at the lever. Then back at you.\n\n\"Yeah. The kitties always go crazy when I'm gone.\"\n\nHe pauses. His eyes narrow.\n\n\"But what I ALSO know is that the kitties don't touch my things. And I was just bumpin' around my detritus room... and some of my things seem to be moved.\"\n\nHe gestures. You become a small, sad pile of dust on the floor.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  ending_win: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDETTDDDDDDETTDD",
      "DDTTTTTTTTTTTTDD",
      "DDTggTTTTTTggTDD",
      "DDTTTTKKKKTTTTDD",
      "DDTTTTTTTTTTTTDD",
      "DDDTTTTTTTTTTDDD",
      "DDDDTTTTTTTTDDDD",
      "yyyyyyyyyyyyyyyy",
      "ssssssssssssssss",
      "ssssssssssssssss",
    ],
    text: "(legacy win — no longer reachable)",
    ending: true,
    ending_label: "You Win!",
    ending_class: "win"
  },

  ending_ww3_hard: {
    art: [
      "RRRRRRRRRRRRRRRR",
      "RxxxRRRRRRRRxxRR",
      "RxKKxRRRRRRxKKRR",
      "RxxxxRRRRRRxxxRR",
      "RRxxxxxxxxxxxxRR",
      "RRRRRRRRRRRRRRRR",
      "RRRRRRxxxxRRRRRR",
      "RRRRxxxxxxxxRRRR",
      "RRRRRRRRRRRRRRRR",
      "xxxxxxxxxxxxxxxx",
      "xxxxxxxxxxxxxxxx",
      "xxxxxxxxxxxxxxxx",
    ],
    text: "You offer the cat the hard treats. The cat sniffs them. The cat does not approve.\n\nThe cat returns to the lever and swats with renewed vigor. The lever snaps.\n\nThe Strait of Hormuz is locked in superposition — both open and closed, forever. Markets cannot price reality. World War Three begins on schedule.",
    ending: true,
    ending_label: "World War Three",
    ending_class: "bad"
  },

  ending_ww3_catnip: {
    art: [
      "GGGGGGGGGGGGGGGG",
      "GggggGGGGGGGggGG",
      "GgggggggGggggggG",
      "GggGggggggggGggG",
      "GggGGggggGGggggG",
      "GgggggGGGgggggGG",
      "GGGGGggggGGGRRRG",
      "RRRRRRRRRRRRxRRR",
      "RRRRxxxxxxxxxxRR",
      "RRRRRRxxxxxxRRRR",
      "xxxxxxxxxxxxxxxx",
      "xxxxxxxxxxxxxxxx",
    ],
    text: "You sprinkle the catnip on the floor.\n\nThe cat goes berserk. Limbs everywhere. The lever takes a direct hit and shatters.\n\nThe Strait of Hormuz is now permanently both open and closed, a quantum knife held to the throat of the global economy. The cat had a great time. World War Three begins anyway.",
    ending: true,
    ending_label: "World War Three",
    ending_class: "bad"
  },
});
