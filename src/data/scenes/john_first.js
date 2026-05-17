// Scenes for module: john_first.
// Original source lines 2322-2546 of monolithic story_v2_explore.html
Object.assign(SCENES, {
  // JOHN PRIME — entry routes through ssn/passport check
  // -----------------------------------------------

  scene_investigate_noise: {
    route: (s) => (s.has_ssn || s.has_passport) ? "ending_john_caught" : "scene_john_prime"
  },

  scene_john_prime: {
    sprite: "john_appear",
    text: "You head back toward the entrance.\n\nStanding in the doorway is a tall, robed figure. Mystical aura. Annoyed expression.\n\n\"I am John Prime. You've been poking around in my space. Did you... touch anything?\"",
    set: { john_appeared: true },
    choices: [
      { text: "Yes, I touched things", next: "ending_john_admit" },
      { text: "No, I haven't touched anything", next: "ending_john_lie" },
      { text: "Hey, want to listen to some music? I've got a speaker.", next: "scene_john_speaker", requires: ["has_speaker"] },
      { text: "Here, you can have my charger if your speaker's dead", next: "scene_john_charger", requires: ["has_charger"] },
      { text: "Would you like to play some Magic: The Gathering?", next: "scene_mtg_loop", requires: ["has_mtg_deck"] },
      { text: "Crack a Zynn and rack the bolt", next: "scene_john_recognize", requires: ["has_zynns", "has_kalashnikov"] },
      { text: "Attack John Prime", next: "ending_attack_john" }
    ]
  },

  ending_john_caught: {
    sprite: "john_scowl",
    text: "John Prime appears in the doorway, takes one look at the documents poking out of your pocket, and his eyes go black.\n\n\"That's my passport. That's my SOCIAL SECURITY CARD.\"\n\nHe doesn't even let you speak. You cease to exist.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  ending_john_admit: {
    sprite: "john_attack",
    text: "\"HOW DARE YOU TOUCH MY THINGS.\"\n\nJohn Prime gestures. You cease to exist.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  ending_john_lie: {
    sprite: "john_attack",
    text: "John Prime narrows his eyes.\n\n\"Funny. I can see exactly which things have been moved. Pathetic.\"\n\nHe gestures. You cease to exist.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  ending_attack_john: {
    sprite: "john_attack",
    text: "You swing at John Prime.\n\nHe is a being of pure magical essence. You are a person with a flashlight.\n\nThis was a poor matchup.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  // -----------------------------------------------
  // Speaker path — John Prime + bluetooth + hints
  // -----------------------------------------------

  scene_john_speaker: {
    sprite: "john_friendly",
    text: "John Prime's eyes light up.\n\n\"A SPEAKER. Hand it over.\"\n\nHe connects with practiced ease and starts blasting his jams. The aura of menace dissolves into vibes.\n\n\"You know what, you're alright. Listen — my pet project? That RBMK in the next room keeps THIS room contained. Magic lever for the Strait of Hormuz. Whatever you do, don't let the cat near it.\"\n\n\"I gotta go set up for my tiki party. Feed my cat for me? The kitty food store down the road closes in like seven minutes — you should book it. Pro tip: the tube is the good one. Hard treats and catnip will get everyone killed. By the way — the genie's been putting Samara in that bottomless pit. If she crawls out, just send her my way. She loves Monster Mash.\"\n\nHe heads off toward the basement, speaker in hand.",
    set: { mtg_played: true, john_handled: true, samara_eligible_john_call: true, has_speaker: false, speaker_path_used: true },
    choices: [
      { text: "Head back through the basement", next: "scene_test" }
    ]
  },

  // -----------------------------------------------
  // CHARGER path — John's speaker is dead
  // -----------------------------------------------

  scene_john_charger: {
    sprite: "john_friendly",
    text: "John Prime's eyes brighten.\n\n\"YOU HAVE A CHARGER? Oh, thank the void. My speaker died this morning and I've been STEWING.\"\n\nHe takes the charger and pockets it.\n\n\"Hey — actually. I think there's a Bluetooth speaker in that storage room. Same kind I had. Go grab it, bring it back to me, and we'll be in business. Then we'll talk about the cat.\"\n\nHe leans against the wall to wait.",
    set: { has_charger: false, charger_path_used: true },
    choices: [
      { text: "Head back to storage", next: "scene_test" }
    ]
  },

  // -----------------------------------------------
  // MAGIC: THE GATHERING — 13-game loop
  // -----------------------------------------------

  scene_mtg_loop: {
    sprite: "john_cast",
    text: (s) => {
      const losses = [
        // 0 - first game, includes preamble
        "John Prime grins. \"Oh, NOW you're speaking my language.\"\n\nHe conjures a deck of his own. You shuffle. You play.\n\nGame 1: He lands a turn-three Sheoldred. You scoop on turn four.\n\nHe stretches. \"Play again?\"",
        // 1
        "Game 2: He plays nothing but tutors for the first six turns. By turn seven he has assembled what he calls 'the Christmas tree.' You lose to an alpha strike.\n\n\"Play again?\"",
        // 2
        "Game 3: You mulligan to four. He still has the nuts. You concede before he untaps.\n\n\"Play again?\"",
        // 3
        "Game 4: You actually draw your sideboard plan. He stops casting spells and just plays Stax. You die to Smokestack triggers, which feels disrespectful.\n\n\"Play again?\"",
        // 4
        "Game 5: He opens with Ancestral Recall. You ask if that's even legal. He says \"in MY house it is.\" You die on turn three.\n\n\"Play again?\"",
        // 5
        "Game 6: You think you've stabilized. He casts something called Necropotence that you've only read about. He draws his entire deck. You lose to milling out from the trigger, somehow.\n\n\"Play again?\"",
        // 6
        "Game 7: He's playing Mono-Red Burn. You have life gain in your deck. The life gain does not save you. He counts to twenty in Lightning Bolts.\n\n\"Play again?\"",
        // 7
        "Game 8: A judge call. There is no judge. John Prime IS the judge. He rules in his favor on a non-issue, then beats you the normal way.\n\n\"Play again?\"",
        // 8
        "Game 9: You sleeve up an Eldrazi tribal deck out of spite. He plays Force of Will on every threat you cast. You lose to a 2/2 with vigilance.\n\n\"Play again?\"",
        // 9
        "Game 10: He concedes on turn two for no reason. You feel good for about six seconds. Then he says \"oh wait, that was just a bluff,\" reveals his hand, and beats you in game two.\n\n\"Play again?\"",
        // 10
        "Game 11: You side in everything you have for control matchups. He switches to combo. You die to a turn-four Splinter Twin loop. He laughs.\n\n\"Play again?\"",
        // 11
        "Game 12: This game lasted ninety seconds. You are not sure what happened in it. Something about a Dark Confidant.\n\n\"Play again?\"",
        // 12
        "Game 13: John Prime puts down what appears to be a literal printout of a Reserved List card. \"Is that legal?\" you ask. He doesn't answer. He attacks for nineteen.\n\n\"Play again?\"",
      ];
      const idx = Math.min(s.mtg_games_played || 0, losses.length - 1);
      return losses[idx];
    },
    choices: [
      { text: "Yes, again", next: "scene_mtg_check", action: "increment_mtg" },
      { text: "No, I'm done", next: "scene_mtg_done_early" }
    ]
  },

  scene_mtg_check: {
    route: (s) => s.mtg_games_played >= 13 ? "scene_mtg_done_13" : "scene_mtg_loop"
  },

  scene_mtg_done_early: {
    sprite: "john_friendly",
    text: "John Prime shrugs. \"Suit yourself. Hey — feed my cat while I'm gone, would you? Kitty food store down the road closes in a few minutes. Step on it.\"\n\nHe heads off toward the basement, humming.",
    set: { mtg_played: true, john_handled: true },
    choices: [
      { text: "Head back through the basement", next: "scene_test" }
    ]
  },

  scene_mtg_done_13: {
    sprite: "john_impressed",
    text: "After the thirteenth game, John Prime sets down his cards. He looks at you with something approaching respect.\n\n\"You've got stamina, I'll give you that. Listen — by the way, I heard the bottomless pit in the other room. I too am a fan. Just be warned, the genie has been putting the Ring girl, Samara, in them recently. If she gives you any trouble, just call for me.\"\n\n\"Now go feed my cat. Kitty food store down the road, closes any minute now. The tube is the good one.\"\n\nHe heads off toward the basement.",
    set: { mtg_played: true, john_handled: true, samara_eligible_john_call: true, mtg_thirteen_done: true },
    choices: [
      { text: "Head back through the basement", next: "scene_test" }
    ]
  },

  // -----------------------------------------------
  // MAGIC: THE GATHERING
  // -----------------------------------------------

  scene_mtg_color: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DRRRBBBGGGKKKWWW",
      "DRRRBBBGGGKKKWWW",
      "DRRRBBBGGGKKKWWW",
      "DRRRBBBGGGKKKWWW",
      "DRRRBBBGGGKKKWWW",
      "DRRRBBBGGGKKKWWW",
      "DRRRBBBGGGKKKWWW",
      "DRRRBBBGGGKKKWWW",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "John Prime raises an eyebrow.\n\n\"Magic: The Gathering? Fine. I do enjoy a good game. What color is your deck?\"",
    choices: [
      { text: "Red", next: "ending_mtg_red" },
      { text: "Blue", next: "ending_mtg_blue" },
      { text: "Green", next: "ending_mtg_green" },
      { text: "Black", next: "scene_mtg_black_played" },
      { text: "White", next: "ending_mtg_white" }
    ]
  },

  ending_mtg_red: {
    text: "\"RED? Aggression with no plan? Get a load of this guy.\"\n\nJohn Prime laughs at you until you spontaneously combust.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  ending_mtg_blue: {
    text: "\"BLUE? Of course. You can't actually win, you just want to make sure I don't either. Pathetic.\"\n\nJohn Prime taps your forehead. You drown on dry land.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  ending_mtg_green: {
    text: "\"GREEN? Wow. Just play a 5/5 and call it strategy. I weep for you.\"\n\nA Llanowar Elf appears and chokes you to death with a vine.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  ending_mtg_white: {
    text: "\"WHITE? Soldiers and life-gain and lecturing everyone about morality? Get out.\"\n\nA tiny angel appears and stabs you with a tiny sword.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  scene_mtg_black_played: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DKKKKKKKKKKKKKKD",
      "DKKMMMMMMMMMMKKD",
      "DKMMxxMMMMxxMMKD",
      "DKMMxxMMMMxxMMKD",
      "DKMMMMMMMMMMMMKD",
      "DKMMKKKKKKKKMMKD",
      "DKMMMMMMMMMMMMKD",
      "DKKKKKKKKKKKKKKD",
      "DDDDDDDDDDDDDDDD",
      "ssssssssssssssss",
    ],
    text: "\"BLACK? Oh, finally. A person of taste.\"\n\nJohn Prime conjures a deck of his own. You play a vicious game. He destroys you, but graciously.\n\nAs you concede, he stretches and yawns.\n\n\"Good game! Listen, I've got to go set up for my tiki party. Can you feed my cat while I'm gone? Kitty food store down the road. Closes any minute now. The tube is the good one.\"",
    set: { mtg_played: true, john_handled: true, samara_eligible_john_call: true },
    choices: [
      { text: "Head back through the basement", next: "scene_test" }
    ]
  },
});
