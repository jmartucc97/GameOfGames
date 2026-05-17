// Scenes for module: john_basement.
// Original source lines 1046-1209 of monolithic story_v2_explore.html
Object.assign(SCENES, {
  scene_john_basement: {
    sprite: (s) => s.charger_path_used && !s.john_handled ? "john_idle" : "john_cast",
    text: (s) => {
      if (s.charger_path_used && !s.john_handled && state.has_speaker) {
        return "John Prime perks up. \"You got it! Hand it over.\"";
      }
      if (s.charger_path_used && !s.john_handled) {
        return "John Prime taps his foot impatiently.\n\n\"Did you find that speaker yet?\"";
      }
      if (s.john_handled && (s.mtg_thirteen_done || s.speaker_path_used)) {
        return "John Prime looks up from a card he's been examining.\n\n\"Oh, you again. What's up?\"";
      }
      return "He seems to be occupied rummaging through his Magic cards.\n\n\"Did you feed the cat?\"";
    },
    choices: [
      { text: "Give him the speaker", next: "scene_john_speaker", requires: ["has_speaker", "charger_path_used"], unless: ["john_handled"] },
      { text: "Ask to play another game of Magic", next: "scene_mtg_round2_loop", requires: ["_john_phase2_unlocked"] },
      { text: "Have a drink with John", next: "scene_drinks", requires: ["_john_phase2_unlocked"] },
      { text: "Back to the basement", next: "scene_test" }
    ]
  },

  // -----------------------------------------------
  // PHASE 2: MTG round 2 + drinking with John
  // Unlocked after the 13-game loop OR speaker-save path
  // -----------------------------------------------

  scene_mtg_round2_loop: {
    sprite: "john_cast",
    text: (s) => {
      const losses = [
        // 0
        "John Prime hesitates. \"You want MORE? Alright. I admire the commitment.\"\n\nHe sleeves up something he calls 'the bad deck.'\n\nGame 1: He plays only swamps. He still wins. You aren't sure how.\n\n\"Another?\"",
        // 1
        "Game 2: He plays the Power Nine in order. You ask if they're proxies. He says \"in MY house, the Reserved List doesn't apply.\"\n\n\"Another?\"",
        // 2
        "Game 3: He plays Hymn to Tourach on turn one off a Lotus Petal. You weren't aware that was possible. He weren't aware it WASN'T. You scoop.\n\n\"Another?\"",
        // 3
        "Game 4: You manage to land a Wurmcoil Engine. He casts what appears to be a homebrew card called 'You Don't Get to Have Nice Things.' Wurmcoil leaves play.\n\n\"Another?\"",
        // 4
        "Game 5: You assemble combo. He casts Stifle. He casts Stifle again. He casts Stifle for a third time. You did not know Stifle had multiple printings on his side of the table.\n\n\"Another?\"",
        // 5
        "Game 6: This time, you swear, you had him. He topdecks the one out. Of course he does.\n\n\"Another?\"",
        // 6
        "Game 7: A judge call. There is still no judge. John Prime IS still the judge. The ruling is, somehow, worse for you this time.\n\n\"Another?\"",
        // 7
        "Game 8: You play a beautiful, technically perfect Storm turn. He casts Mindbreak Trap from his hand for zero mana. You have lost so many ways now.\n\n\"Another?\"",
      ];
      const idx = Math.min(s._mtg_round2_games || 0, losses.length - 1);
      return losses[idx];
    },
    choices: [
      { text: "Yes, another", next: "scene_mtg_round2_check", action: "increment_mtg_round2" },
      { text: "No more games", next: "scene_john_basement" },
      { text: "Have a drink with him instead", next: "scene_drinks" }
    ]
  },

  scene_mtg_round2_check: {
    route: (s) => (s._mtg_round2_games >= 8 ? "scene_mtg_round2_burnout" : "scene_mtg_round2_loop")
  },

  scene_mtg_round2_burnout: {
    sprite: "john_friendly",
    text: "John Prime holds up a hand.\n\n\"You know what, that's enough for one afternoon. My elbow's starting to hurt from shuffling. Genuinely.\"\n\nHe rolls his shoulder.\n\n\"I'll tell you what — let's get a drink. I've got a thing. Come on.\"",
    choices: [
      { text: "Have a drink with him", next: "scene_drinks" },
      { text: "Politely decline and head back", next: "scene_john_basement" }
    ]
  },

  // -----------------------------------------------
  // DRINKS WITH JOHN — pressure escalates, 7+ = hungover restart
  // -----------------------------------------------

  scene_drinks: {
    sprite: "john_friendly",
    text: (s) => {
      const n = s._drinks_with_john || 0;
      const lines = [
        // 0
        "John Prime produces a bottle of something dark and unlabeled from somewhere inside his robe.\n\n\"This is the good stuff. Don't ask where it's from. Drink up.\"\n\nHe pours two glasses.",
        // 1
        "John refills both glasses.\n\n\"Atta boy. We're just getting started. Another?\"",
        // 2
        "John pours a third. \"You know,\" he says, \"I don't usually drink with mortals. You're alright. Drink.\"",
        // 3
        "Round four. John has not slowed down at all. He is suspiciously sober for a being currently drinking with you.\n\n\"You ARE keeping up, right?\"",
        // 4
        "\"Don't go soft on me now,\" John says, refilling. \"We're in it. Five down.\"\n\nThe basement is starting to lean.",
        // 5
        "Six. John is grinning. \"I once outdrank a Mesopotamian goddess. She had to be carried out. Do you know who carried her out? It was me. She was inside me at the time.\"\n\nYou don't entirely follow.",
        // 6
        "Seven. The walls have started to suggest, gently, that perhaps you should sit down. John pours an eighth.\n\n\"One more. You can't stop at seven. Seven is a Bad Number.\"",
        // 7
        "Eight. The room is no longer a room. It is a feeling.\n\nJohn Prime says something but you only hear consonants.",
      ];
      return lines[Math.min(n, lines.length - 1)];
    },
    choices: [
      { text: "Take the drink", next: "scene_drinks_check", action: "increment_drinks" },
      { text: "Politely decline and stop", next: "scene_drinks_stop" }
    ]
  },

  scene_drinks_check: {
    route: (s) => ((s._drinks_with_john || 0) >= 8 ? "scene_drinks_passout" : "scene_drinks")
  },

  scene_drinks_stop: {
    sprite: "john_friendly",
    text: (s) => {
      const n = s._drinks_with_john || 0;
      if (n === 0) return "John shrugs. \"Suit yourself. More for me.\"\n\nHe waves you off.";
      if (n < 4) return "John raises an eyebrow but doesn't push it. \"Lightweight. Respect.\"\n\nHe waves you off.";
      return "John grins lazily. \"Fair enough. You held your own. Off you go.\"\n\nThe basement spins, gently.";
    },
    choices: [
      { text: "Head back", next: "scene_john_basement" }
    ]
  },

  scene_drinks_passout: {
    sprite: "john_friendly",
    text: "The last thing you remember is John Prime looking at you with what might be concern, or might be amusement.\n\n\"Oh,\" he says.\n\nThe room tilts ninety degrees. The basement, the cat, the doors, the entire setup — all of it slides past you in a slow spiral.\n\nYou pass out.",
    choices: [
      { text: "...", next: "scene_hungover_wakeup", action: "soft_reset" }
    ]
  },

  scene_hungover_wakeup: {
    sprite: "three_doors",
    text: "You feel furiously hungover, and are still trapped in the basement.\n\nThe doors are right where you left them. \"Do Not Enter\", \"Storage\", \"Exit\". So is the headache.",
    choices: [
      { text: "Do Not Enter", next: "scene_donotenter_router", door_anim: "dne" },
      { text: "Storage", next: "scene_detritus", door_anim: "storage" },
      { text: "Exit", next: "scene_exit_router", door_anim: "exit" }
    ]
  },

  scene_regret: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDYYYYYYDDDDD",
      "DDDYYYYYYYYYYDDD",
      "DDYYYYYYYYYYYYDD",
      "DYYYYYYYYYYYYYYD",
      "DYYYKKYYYYKKYYYD",
      "DYYYKKYYYYKKYYYD",
      "DYYYYYYYYYYYYYYD",
      "DYYYYYYYYYYYYYYD",
      "DYYYYKKKKKKKYYYD",
      "DYYYKYYYYYYYKYYD",
      "DYYKYYYYYYYYYKYD",
      "DYYYYYYYYYYYYYYD",
      "DDYYYYYYYYYYYYDD",
      "DDDYYYYYYYYYYDDD",
      "DDDDDYYYYYYDDDDD",
    ],
    text: "Yeah, I guess a square like you would just choose to leave.\n\nEnjoy your freedom.",
    ending: true,
    ending_label: "The End"
  },
});
