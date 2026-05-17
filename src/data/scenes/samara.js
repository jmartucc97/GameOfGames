// Scenes for module: samara.
// Original source lines 2097-2321 of monolithic story_v2_explore.html
Object.assign(SCENES, {
  // SAMARA — three-round encounter
  // -----------------------------------------------

  scene_samara_intro: {
    sprite: "samara",
    text: "You step into the Plumpy room. The pit yawns black where you left it.\n\nA hand emerges from the pit. Long, pale fingers. Then another.\n\nA girl crawls out — wet black hair plastered over her face, white shroud, dripping. She turns toward you and starts walking.\n\nThis is Samara. From The Ring.",
    set: { samara_spawned: true, samara_round: 1 },
    choices: [
      { text: "Continue", next: "scene_samara_round_1" }
    ]
  },

  scene_samara_round_1: {
    sprite: "samara",
    text: "Samara stands three feet from you. The room is silent except for her breathing.",
    choices: [
      { text: "Run — while you still can", next: "ending_samara_flee" },
      { text: "Rally yourself, and start swinging", next: "ending_samara_fight_early" },
      { text: "Yell sexist remarks at her", next: "scene_samara_round_2" },
      { text: "Open fire with the Kalashnikov", next: "ending_samara_kalash", requires: ["has_kalashnikov"] },
      { text: "Call for John Prime", next: "scene_samara_john_save", requires: ["samara_eligible_john_call"] }
    ]
  },

  scene_samara_round_2: {
    sprite: "samara",
    text: "She recoils at your words. She seems to have been caught off guard and weakened.\n\nShe re-gathers herself, hair still dripping, and advances again — slower this time.",
    set: { samara_round: 2 },
    choices: [
      { text: "Run — while you still can", next: "ending_samara_flee" },
      { text: "Rally yourself, and start swinging", next: "ending_samara_fight_early" },
      { text: "Tell her you think the 19th Amendment was a mistake", next: "scene_samara_round_3" },
      { text: "Open fire with the Kalashnikov", next: "ending_samara_kalash", requires: ["has_kalashnikov"] },
      { text: "Call for John Prime", next: "scene_samara_john_save", requires: ["samara_eligible_john_call"] }
    ]
  },

  scene_samara_round_3: {
    sprite: "samara",
    text: "Her body withers as it crumples under the weight of such unbridled and historically specific misogyny.\n\nShe reverts back to human form. A small, dark-haired girl. She looks up at you with wide, tearful eyes.\n\n\"Please. All I've ever wanted was a friend. Please, stop.\"",
    set: { samara_round: 3 },
    choices: [
      { text: "Apologize for what you said earlier", next: "ending_samara_apology" },
      { text: "Nice try, bitch — finish her", next: "ending_samara_win" },
      { text: "Run for help", next: "ending_samara_flee" },
      { text: "Open fire with the Kalashnikov", next: "ending_samara_kalash", requires: ["has_kalashnikov"] },
      { text: "Call for John Prime", next: "scene_samara_john_save", requires: ["samara_eligible_john_call"] }
    ]
  },

  ending_samara_kalash: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDTTTTTTTTTTDDDD",
      "DDTSSSSSSSSTDDDD",
      "DDTTTTTTTTTTDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDxxxxDDDDDD",
      "DDDxxxxxxxxxxDDD",
      "DDxxxxxxxxxxxxDD",
      "KKKKKKKKKKKKKKKK",
    ],
    text: "You raise the Kalashnikov, sight Samara down the barrel, and squeeze the trigger.\n\nClick.\n\nClick.\n\nNothing.\n\nA voice that sounds suspiciously like John Prime's whispers from somewhere: \"Should've checked it was loaded first there, Rambo.\"\n\nSamara takes the rifle from your hands and kills you with it.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  ending_samara_flee: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDWWWWWWDDDD",
      "DDDWWKKKKKKKKWDD",
      "DDWKKKKKKKKKKKWD",
      "DDWKKKKxxKKKKKWD",
      "DDDWKKKKKKKKWDDD",
      "DDDDWKKKKKKWDDDD",
      "DDDDDKKxxKKDDDDD",
      "DDDDDDKKKKDDDDDD",
      "DDDDDDKKKKDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "KKKKKKKKKKKKKKKK",
    ],
    text: "You turn to run. She is already in front of you.\n\nShe was always going to be already in front of you. That's her whole thing.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  ending_samara_fight_early: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDxxxxxxDDDDD",
      "DDDxxxxxxxxxxDDD",
      "DDxxRRxxxxRRxxDD",
      "DDxxxxxxxxxxxxDD",
      "DDxxxxxxxxxxxxDD",
      "DDxxKKKKKKKKxxDD",
      "DDDxxxxxxxxxxDDD",
      "DDDDxxxxxxxxDDDD",
      "DDDDDxxxxxxDDDDD",
      "DDDDDDDDDDDDDDDD",
      "KKKKKKKKKKKKKKKK",
    ],
    text: "You swing at Samara.\n\nShe is a ghost. You are not.\n\nThis was a poor matchup.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  ending_samara_apology: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDWWWWWWDDDD",
      "DDDWWKKKKKKKKWDD",
      "DDWKKKKxxKKKKKWD",
      "DDWKKKKKKKKKKKWD",
      "DDDWKKKKKKKKWDDD",
      "DDDDWKKKKKKWDDDD",
      "DDDDDKKKKKKDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "KKKKKKKKKKKKKKKK",
    ],
    text: "You start to apologize.\n\nShe was faking it. She surges upright, fully restored, eyes bright with vindication.\n\n\"GOT YOU.\"\n\nShe gets you.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  ending_samara_win: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDWWWWDDDDDD",
      "DDDDDWKKKKWDDDDD",
      "DDDDDDWKKWDDDDDD",
      "DDDDDDDKKDDDDDDD",
      "DDDDDDDKKDDDDDDD",
      "DDDDDDDKDDDDDDDD",
      "DDDDDDDKDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "KKKKKKKKKKKKKKKK",
    ],
    text: "You step forward, scoop her up by the waist, and hoist her overhead like a barbell.\n\nWith one fluid motion, you bring her down across your knee.\n\nThere's a crack like a folding chair. Samara crumples to the floor and dissolves into a puddle of damp shadow.\n\nThe pit accepts her remains.",
    set: { samara_resolved: true },
    choices: [
      { text: "Continue to the Plumpy room", next: "scene_plumpy_main" }
    ]
  },

  scene_samara_john_save: {
    route: (s) => {
      if (s.speaker_path_used) return "scene_samara_save_speaker";
      if (s.mtg_thirteen_done) return "scene_samara_save_fatality";
      return "scene_samara_save_charger";
    }
  },

  scene_samara_save_speaker: {
    sprite: "john_friendly",
    text: "John slinks into the room. \"You ready to play?\" Samara stumbles menacingly towards you and raises her arm, it seems as if she is about to strike you. As her arm passes through the air she produces a Magic the Gathering deck out of the incorporeal. \"Alright then hurry up\". The two of them leave the room to sling some cards with John Prime's jams playing.",
    set: { samara_resolved: true },
    choices: [
      { text: "Continue to the Plumpy room", next: "scene_plumpy_main" }
    ]
  },

  scene_samara_save_charger: {
    sprite: "john_friendly",
    text: "You shout for John Prime.\n\nHe phases in, mid-yawn, and squints at Samara.\n\n\"Oh, hey. Samara. C'mon, you can't keep crawling out of MY pit. Come play some Magic with me, I'll set you up at the table.\"\n\nSamara turns and follows him out of the room without acknowledging you.\n\nThe pit returns to its quiet, void-y self.",
    set: { samara_resolved: true },
    choices: [
      { text: "Continue to the Plumpy room", next: "scene_plumpy_main" }
    ]
  },

  scene_samara_save_fatality: {
    sprite: "john_attack",
    text: "John Prime enters the room, and backhands the creature. He then begins to berate her with a combination of historically specific and verbose misogynistic comments. She crumples to the floor, and he pulls her head and spine off of her body. You here a disembodied voice boom \"Fatality\".",
    set: { samara_resolved: true },
    choices: [
      { text: "Continue", next: "scene_samara_fatality_aftermath" }
    ]
  },

  scene_samara_fatality_aftermath: {
    sprite: "john_idle",
    text: "John dusts off his hands.\n\n\"Yeah the genie has been pulling this gag on me whenever I wish for a bottomless pit from him. You just really just gotta own it and lay into her before you try to get physical.\"",
    choices: [
      { text: "Nod and feign that you agree this is common knowledge", next: "scene_plumpy_main" },
      { text: "Ask him what all the misogyny was about", next: "ending_john_stone" }
    ]
  },

  ending_john_stone: {
    sprite: "john_scowl",
    text: "John Prime's eyes go flat.\n\nThere is a long, quiet moment in which several things almost happen.\n\nThen, with a small gesture of his hand, he turns YOU to stone where you stand. Arms half-crossed. Mouth slightly open. Eyes still on him.\n\nYou will remain in that position for the next four thousand years.\n\nJohn shrugs and walks off toward the back room. The cat is still batting at the lever. The pit, as far as you can tell from inside your own granite skull, is still bottomless.",
    ending: true,
    ending_label: "Petrified",
    ending_class: "bad"
  },

  ending_ww3_cat_first: {
    sprite: "cat_swat",
    text: "You step toward the cat. Startled, it swats wildly at the lever.\n\nThere's a CRACK.\n\nThe lever snaps clean off. The Strait of Hormuz is now permanently locked in a state of both open AND closed. Global markets cannot resolve the paradox. World War Three begins within the hour.",
    ending: true,
    ending_label: "World War Three",
    ending_class: "bad"
  },

  ending_attack_cat: {
    sprite: "cat_strike",
    text: "You swing at the cat.\n\nThe cat is faster than you, smarter than you, and has nine lives. You have one.\n\nIt does the math.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  // -----------------------------------------------
});
