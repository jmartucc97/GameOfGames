// Scenes for module: storage.
// Original source lines 1211-1620 of monolithic story_v2_explore.html
Object.assign(SCENES, {
  // STORAGE — three pile locations
  // -----------------------------------------------

  scene_detritus: {
    explore_room: "storage"
  },

  scene_pile_1: {
    sprite: "pile1_junk",
    text: "You dig through the closest pile. Four things stand out:\n\n• a flashlight\n• a social security card\n• a passport\n• a small Bluetooth speaker (it's out of batteries)\n\n(You can carry one item from this pile. Take, swap, or put back.)",
    choices: [
      ...pileChoices(PILE_1_ITEMS, "self"),
      { text: "Back to the storage room", next: "scene_detritus" }
    ]
  },

  scene_detritus_middle: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDSDDDDDDDDSDD",
      "DDDSSSDDDDDDSSSD",
      "DDESSEDDDDDESSED",
      "DESSSREDDDDESEED",
      "OTSSEEERRDETTRRD",
      "OTTESSREEDOTTRRE",
      "TTTSSEEERREOTTRE",
      "ssssssssssssssss",
      "ssssssssssssssss",
    ],
    text: "Further in, the piles get larger and more chaotic. There's a particularly suspicious pile leaning against the wall.",
    choices: [
      { text: "Rummage through the suspicious pile", next: "scene_pile_2" },
      { text: "Go deeper still", next: "scene_detritus_back" },
      { text: "Back toward the entrance", next: "scene_detritus" }
    ]
  },

  scene_pile_2: {
    sprite: "pile2_junk",
    text: (s) => {
      return "You shove crates aside. Two things stand out:\n\n• a pack of Zynns\n• a small bag of plums\n\n(Carry one. Swap or put back as needed.)";
    },
    choices: [
      ...pileChoices(PILE_2_ITEMS, "self"),
      { text: "Back to the storage room", next: "scene_detritus" }
    ]
  },

  // -----------------------------------------------
  // BOOKCASE — pick a book to read
  // -----------------------------------------------

  scene_bookcase: {
    sprite: "bookcase",
    text: (s) => {
      const intro = "Three books on the bookcase catch your eye, each spine more legible than the others around it.";
      const list = [
        "• \"The Nuclear Physics of Potassium\" — by John Prime",
        "• \"Necromancy and Other Self-Improvement Hobbies\"",
        "• \"The Secrets of the Universe\""
      ].join("\n");
      const read = [];
      if (s.has_note) read.push("Potassium");
      if (s.knows_skeleton_spell) read.push("Necromancy");
      const note = read.length ? `\n\n(You've already read: ${read.join(', ')}.)` : "";
      return `${intro}\n\n${list}${note}`;
    },
    choices: [
      { text: "Read \"The Nuclear Physics of Potassium\"",            next: "scene_book_potassium" },
      { text: "Read \"Necromancy and Other Self-Improvement Hobbies\"", next: "scene_book_necromancy" },
      { text: "Read \"The Secrets of the Universe\"",                 next: "scene_book_universe" },
      { text: "Step away from the bookcase",                           next: "scene_detritus" }
    ]
  },

  scene_book_potassium: {
    sprite: "book_potassium_open",
    text: (s) => {
      const opening = "You pull down \"The Nuclear Physics of Potassium.\" It is heavier than it has any right to be. Inside: pages and pages of John's handwriting, diagrams of decay chains, a sketch of a banana with arrows pointing at the inside of it.\n\nIn the margin of one page, circled twice and underlined three times, is a derivation. Most of it has been scribbled over. What's left, in order, reads:\n\n  m(U-235, RBMK core)  ≈  1.9 × 10⁵ kg\n  E(fission, U-235)     ≈  200 MeV\n  K-40 in banana        ≈  4.2 × 10⁻⁵ g\n  E(β-decay, K-40)      ≈  1.3 MeV\n              ⋮\n           ≈   10²¹  bananas\n\nThe word EQUIVALENT is underlined three more times.";
      if (s.has_note) {
        return opening + "\n\nYou already knew the number, but it's nice to see it confirmed in print.";
      }
      return opening;
    },
    set: { has_note: true },
    choices: [
      { text: "Close the book", next: "scene_bookcase" }
    ]
  },

  scene_book_necromancy: {
    sprite: "book_necromancy_open",
    text: (s) => {
      if (s.knows_skeleton_spell) {
        return "You flip through \"Necromancy and Other Self-Improvement Hobbies\" again. The Speak With Bones cant is still there on page 47, between a recipe for \"Yoga, But With Femurs\" and a long, judgmental essay titled \"Why Your Skull Is Wrong.\"\n\nYou've got it memorized.";
      }
      return "You crack open \"Necromancy and Other Self-Improvement Hobbies.\" The table of contents alone runs sixteen pages.\n\nMost of the chapters are surprisingly wholesome — \"Yoga, But With Femurs,\" \"A Beginner's Guide to Empathy (for the Recently Reanimated),\" \"Boundaries: A Skeleton Crew Workshop.\"\n\nOn page 47, between essays, you find what you were unconsciously looking for: a short cant titled SPEAK WITH BONES. The pronunciation is mostly clicks and a long uncomfortable hum. You practice it under your breath until something behind your sternum twitches in response.\n\nYou close the book. You think you've got it.";
    },
    set: { knows_skeleton_spell: true },
    choices: [
      { text: "Close the book", next: "scene_bookcase" }
    ]
  },

  scene_book_universe: {
    sprite: "book_universe_open",
    text: "You open \"The Secrets of the Universe.\"\n\nThe pages are not pages. The pages are a window. You look through them. They look back.\n\nYour pupils dilate to the edges of the iris and keep dilating. You become very aware of every electron in your body, in order, by name. You begin to understand the joke that is causality. You laugh once, very briefly.\n\nYou were not built for this.",
    choices: [
      { text: "...", next: "ending_universe_book" }
    ]
  },

  ending_universe_book: {
    sprite: "book_universe_open",
    text: "Your body remains, kneeling, in front of the bookcase. The book is closed. The book closed itself.\n\nThere is a draft in the storage room that wasn't there before. Several other books, sensing opportunity, lean very slightly forward on the shelf.",
    ending: true,
    ending_label: "Read the Wrong Book",
    ending_class: "bad"
  },

  scene_detritus_back: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDOODDDDDDD",
      "DDDDDDOyyODDDDDD",
      "DDDDDOyOOyODDDDD",
      "DDDDOyOyyOyODDDD",
      "DDDDOyyOOyyODDDD",
      "DDDDDOyyyyODDDDD",
      "DDDDDDOOOODDDDDD",
      "DDOTTTEEEERRDDDD",
      "ssssssssssssssss",
      "ssssssssssssssss",
    ],
    text: "The deepest part of the room. One pile glints — two lamps poke out from beneath the junk.",
    choices: [
      { text: "Rummage through the glinting pile", next: "scene_pile_3" },
      { text: "Back toward the middle", next: "scene_detritus_middle" }
    ]
  },

  scene_pile_3: {
    sprite: "pile3_junk",
    text: (s) => {
      let base = "Two lamps catch the light:\n\n• a shiny gold lamp\n• a tiki lamp\n\n(Touch one to find out what's inside.)";
      if ((s._deaths || 0) >= 2) {
        base += "\n\nAt the back of the pile, glinting faintly: a rusted hammer and sickle. It hums very quietly. It does not seem to belong here.";
      }
      return base;
    },
    choices: [
      { text: "Rub the gold lamp", next: "scene_genie" },
      { text: "Rub the tiki lamp", next: "scene_tiki_router" },
      { text: "Touch the rusted hammer and sickle", next: "scene_rasputin", requires: ["_rasputin_available"] },
      { text: "Back to the storage room", next: "scene_detritus" }
    ]
  },

  // -----------------------------------------------
  // RASPUTIN — Hint character, appears after 2+ deaths
  // -----------------------------------------------

  scene_rasputin: {
    sprite: "rasputin",
    text: (s) => {
      if (s._rasputin_met) {
        return "Rasputin is still there, leaning on his staff. He raises an eyebrow.\n\n\"Back again. What do you desire this time? Speak.\"";
      }
      return "You reach out and touch the hammer and sickle.\n\nThe metal is colder than it should be. The air pressure in the room changes. A figure congeals out of the shadow next to the machinery — robed, hooded, leaning on a staff.\n\nHe addresses you in Russian, then suddenly not.\n\n\"Ah. Another wanderer. I am Grigori Yefimovich Rasputin. You may have heard. The Mad Monk. Killed many times. Always come back. They put me here for the same reason they put everything else. Plumpy says I am 'good for traffic.'\"\n\nHe taps the staff once. The Soviet pin on it gleams.\n\n\"What do you desire? Speak plainly. I do not have all of forever — though, technically, I do.\"";
    },
    set: { _rasputin_met: true, _rasputin_summoned: true },
    choices: [
      { text: "Doom", next: "scene_rasputin_doom" },
      { text: "Darkness", next: "scene_rasputin_darkness" },
      { text: "Fortune", next: "scene_rasputin_fortune" },
      { text: "Leave him be", next: "scene_detritus" }
    ]
  },

  scene_rasputin_doom: {
    sprite: "rasputin",
    text: "Rasputin's eyes flicker beneath the cowl.\n\n\"Doom. Always Doom, with you Americans. The blood, the smoke, the men with rifles. Yes. Yes.\"\n\nHe taps his staff once.\n\n\"There is a man in this house who keeps a pit. He is irritated when his routine is disturbed. He becomes interested, however, when interrupted by a particular pairing — a small can of Swedish nicotine and a long Soviet rifle. Together, in his presence. You understand?\"\n\nHe doesn't blink.\n\n\"He will take you down. Bring matched tools. The Pit's children are stubborn — for some only the bullet will speak, for others only the blade. Watch what they do. Listen to what they show you. And one of them — a clever one, a vain one — can be charmed with music alone.\"\n\nHe coughs.\n\n\"At the bottom is a thing that hates being read to. Bring something it cannot argue with.\"",
    choices: [
      { text: "Ask another question", next: "scene_rasputin" },
      { text: "Thank him and leave", next: "scene_pile_3" }
    ]
  },

  scene_rasputin_darkness: {
    sprite: "rasputin",
    text: "Rasputin nods slowly.\n\n\"Ah. The other path. The patient path. Less blood. More time. Much more time.\"\n\nHe gestures vaguely at the pit somewhere beyond the walls.\n\n\"There is a small lever in this house. A cat keeps an eye on it. The cat is not, strictly speaking, a cat. Do not interrupt the cat. Close the strait — the world will thank you, briefly — and you will be given a candle and a job.\"\n\nHe smiles, or maybe doesn't.\n\n\"Then: do not press the button. Stay at your post. Confirm what you already know. Confirm it again. Confirm it for a very long time. The reward is the title. The title is the reward. There is no other reward.\"\n\nHis voice drops.\n\n\"You will become very intimate with bottomlessness. Try not to talk to it.\"",
    choices: [
      { text: "Ask another question", next: "scene_rasputin" },
      { text: "Thank him and leave", next: "scene_pile_3" }
    ]
  },

  scene_rasputin_fortune: {
    sprite: "rasputin",
    text: "Rasputin grins. It is not reassuring.\n\n\"Fortune. The capitalist's path. Yes. I knew Romanovs who chose this. It went badly for them, but in fairness, they were not very good at it.\"\n\nHe leans in.\n\n\"The green creature in the next room makes things grow. He also makes them combust, when asked nicely. Bring a number — a very large number, dressed as fruit. Use the pit you have already opened. Power what needs powering.\"\n\nHe pauses.\n\n\"Then: do not push the lever the wrong direction. Trust the man in purple when he speaks of out-of-the-box thinking. Choose well three times — holy, springy, and crushed. Pour the mixture in.\"\n\nHe waves a hand dismissively.\n\n\"Men in short-sleeved shirts will come up the stairs. They have clipboards. They have soil samples. Three of them. Do not, under any circumstances, tell them the truth. Insult them. Lie to them. They are sensitive. The third one — the one with the sunglasses — keep insulting him too. It is the only language he understands.\"",
    choices: [
      { text: "Ask another question", next: "scene_rasputin" },
      { text: "Thank him and leave", next: "scene_pile_3" }
    ]
  },

  // -----------------------------------------------
  // FLOWER MIMIC — looks pretty, eats you
  // -----------------------------------------------

  scene_mimic_inspect: {
    sprite: "flower_mimic_idle",
    text: "A single red flower sways gently in the still basement air. Its yellow center catches what little light there is. The petals are perfectly symmetrical. The stem is impossibly green for a room with no windows.\n\nIt is, you have to admit, extraordinarily beautiful. It is so out of place here that it almost seems to apologize for existing.",
    choices: [
      { text: "Touch the flower",              next: "ending_mimic_eaten" },
      { text: "Smell it",                      next: "ending_mimic_eaten" },
      { text: "Leave it alone, walk away",     next: "scene_detritus" }
    ]
  },

  ending_mimic_eaten: {
    sprite: "flower_mimic_attack",
    text: "The flower's petals snap open with a sound like a wet umbrella.\n\nThere is no flower. There never was. The thing's mouth is wider than the thing was tall, and it is hinged in directions that mouths are not supposed to hinge. Inside is red and inside is also yellow and inside, briefly, is you.\n\nThe last thing you register is how disappointed John Prime is going to be.",
    ending: true,
    ending_label: "Eaten by a Flower",
    ending_class: "bad",
    set: { _mimic_eaten: true }
  },

  // -----------------------------------------------
  // GENIE (gold lamp)
  // -----------------------------------------------

  scene_genie: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDwwccccwwDDDD",
      "DDDccccccccccDDD",
      "DDccKKccccKKccDD",
      "DDccKKccccKKccDD",
      "DDccccCCCCccccDD",
      "DDccCCCCCCCCccDD",
      "DDDCCCCCCCCCCDDD",
      "DDDDCCCCCCCCDDDD",
      "DDDDDOOOOOODDDDD",
      "ssssssssssssssss",
      "ssssssssssssssss",
    ],
    text: (s) => {
      if (s.john_handled) return "The genie sighs as you approach.\n\n\"You again. No, I'm still out of wishes. And no, I don't have any cat treats — John says the kitty food store down the road handles that, and it's closing soon. Go.\"";
      if (s.wish_used) return "The genie scowls at you. \"I told you. ONE wish per customer. The other guy used them all. Now scram.\"";
      return "A genie bursts forth in a cloud of blue smoke.\n\n\"Hello traveler! Listen, before you get excited — you get ONE wish. The other guy used the rest. So make it count.\"";
    },
    choices: [
      { text: "I wish for a bottomless pit", next: "scene_wish_pit", unless: ["wish_used", "john_handled"] },
      { text: "I wish for world peace", next: "scene_wish_peace", unless: ["wish_used", "john_handled"] },
      { text: "I wish for infinite money", next: "scene_wish_money", unless: ["wish_used", "john_handled"] },
      { text: "Attack the genie", next: "ending_attack_genie" },
      { text: "Put the lamp away", next: "scene_pile_3" }
    ]
  },

  scene_wish_pit: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "ssssssssssssssss",
      "sssKKKKKKKKKKsss",
      "ssKKKKKKKKKKKKss",
      "sKKKKKKKKKKKKKKs",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
      "KKKKKKKKKKKKKKKK",
    ],
    text: "\"A bottomless pit? Oddly specific. Whatever — your wish is granted.\"\n\nThe genie snaps his fingers. From another room, you hear a distinct WHUMP — the sound of a very deep hole appearing in a very specific spot.",
    set: { has_pit: true, wish_used: true },
    choices: [
      { text: "Back to the pile", next: "scene_pile_3" }
    ]
  },

  scene_wish_peace: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDWWWWWWWWDDDD",
      "DDWWWWWWWWWWWWDD",
      "DWWWWWWWWWWWWWWD",
      "DWWKKWWWWWWKKWWD",
      "DWWKKWWWWWWKKWWD",
      "DWWWWWWKKWWWWWWD",
      "DWWKKKKKKKKKKWWD",
      "DDWWWWWWWWWWWWDD",
      "WWDDDDDDDDDDDDWW",
      "DWWWWWWWWWWWWWWD",
      "WWDDDDDDDDDDDDWW",
    ],
    text: "\"World peace! Aw, that's sweet.\"\n\nThe genie strokes his chin. \"You know, the most efficient way to achieve peace is to eliminate everyone except one very special and handsome man. Hold still.\"\n\nYou are not that man.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  scene_wish_money: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDgYYYgYYYgDDD",
      "DDDgYYYgYYYgYDDD",
      "DDDYYYgYYYgYYDDD",
      "DDDgYYYgYYYgYDDD",
      "DDDDgYYYgYYYgDDD",
      "DDDDDgYYYgYYYDDD",
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDDDDDDDDDD",
      "ssssssssssssssss",
      "ssssssssssssssss",
    ],
    text: "The genie rolls his eyes so hard you hear them.\n\n\"OK jackass. Like no one's tried that one before.\"\n\nA pile of Monopoly money flutters down at your feet. The genie disappears. The lamp goes cold.\n\nYou are now, technically, a millionaire. In Monopoly money. In a basement.",
    ending: true,
    ending_label: "You Lose",
    ending_class: "bad"
  },

  ending_attack_genie: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDDDxxDDDDDDD",
      "DDDDDxxxxxxxDDDD",
      "DDDxxxxxxxxxxDDD",
      "DDxxRRxxxxRRxxDD",
      "DDxxRRxxxxRRxxDD",
      "DDxxxxxxxxxxxxDD",
      "DDxxxxKKKKxxxxDD",
      "DDDxxKKKKKKxxDDD",
      "DDDDxxxxxxxxDDDD",
      "DDDDDDxxxxDDDDDD",
      "DDDDDDDDDDDDDDDD",
    ],
    text: "You swing at the genie.\n\nHe is, in fact, a genie. You are, in fact, a human.\n\nThis was a poor matchup.",
    ending: true,
    ending_label: "You Died",
    ending_class: "bad"
  },

  // -----------------------------------------------
  // TIKI GENIE (tiki lamp)
  // -----------------------------------------------

  scene_tiki_router: {
    route: (s) => s.tiki_taken ? "scene_tiki_already_taken" : "scene_tiki_first"
  },

  scene_tiki_first: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDgggGGggDDDD",
      "DDDggGGGGGGggDDD",
      "DDgGGKKGGKKGGgDD",
      "DDgGGGGGGGGGGgDD",
      "DDgGGGGTTGGGGgDD",
      "DDgGGGTTTTGGGgDD",
      "DDDgGGGGGGGGgDDD",
      "DDDDggGGGGggDDDD",
      "DDDDDOOOOOODDDDD",
      "ssssssssssssssss",
      "ssssssssssssssss",
    ],
    text: "A genie in a hawaiian shirt drags himself out of the lamp, squinting and clutching his head.\n\n\"Ohhhh, you again. Listen, I'm done with wishes. Hungover. But I've got some stuff lying around. Take ONE.\"\n\nHe gestures vaguely at a pile of junk at his feet.",
    set: { tiki_tried: true },
    choices: [
      { text: "Take the Magic: The Gathering deck", next: "scene_tiki_took", set: { has_mtg_deck: true, tiki_taken: true } },
      { text: "Take the micro USB charger", next: "scene_tiki_took", set: { has_charger: true, tiki_taken: true } },
      { text: "Take the Kalashnikov", next: "scene_tiki_took", set: { has_kalashnikov: true, tiki_taken: true } },
      { text: "Back to the pile", next: "scene_pile_3" }
    ]
  },

  scene_tiki_took: {
    art: [
      "DDDDDDDDDDDDDDDD",
      "DDDDDgggGGggDDDD",
      "DDDggGGGGGGggDDD",
      "DDgGGKKGGKKGGgDD",
      "DDgGGGGGGGGGGgDD",
      "DDgGGGGTTGGGGgDD",
      "DDDgGGGGGGGGgDDD",
      "DDDDggGGGGggDDDD",
      "DDDDDOOOOOODDDDD",
      "ssssssssssssssss",
      "ssssssssssssssss",
      "ssssssssssssssss",
    ],
    text: "The tiki genie grunts noncommittally, scratches himself, and slides back into the lamp.\n\nThe lamp goes cold. You don't think he's coming back out.",
    choices: [
      { text: "Back to the pile", next: "scene_pile_3" }
    ]
  },

  scene_tiki_already_taken: {
    text: "The tiki lamp is cold. You're not getting anything else out of it.",
    choices: [
      { text: "Back to the pile", next: "scene_pile_3" }
    ]
  },

  // -----------------------------------------------
});
