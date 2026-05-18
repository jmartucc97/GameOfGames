// Scenes for module: epa.
// Original source lines 3798-3875 of monolithic story_v2_explore.html
Object.assign(SCENES, {
  // EPA GAUNTLET — Triggered after successful fracking
  // 3 dialogue encounters. Lie/insult correctly to dismiss them.
  // Telling the truth at any point = bad ending.
  // ============================================================

  scene_epa_arrives: {
    sprite: "john_idle",
    text: "The pit accepts the slurry. Somewhere deep below the basement, a hairline fracture propagates through bedrock that hasn't been touched since the Cambrian.\n\nThere is a brief moment of triumph.\n\nThen, three sets of headlights swing into the driveway upstairs.\n\nJohn Prime's head snaps up.\n\n\"Oh, you have GOT to be kidding me. EPA. They sniffed it out. We've got minutes.\"\n\nHe vanishes in a flicker. Above you, the basement door opens. Polished shoes descend the stairs.",
    choices: [
      { text: "Brace for the first agent", next: "scene_epa_1" }
    ]
  },

  scene_epa_1: {
    sprite: "epa_man",
    text: "A pale man in a short-sleeved button-up, holding a clipboard and a soil-sample bag, peers around the basement. His tie is clipped on. His name tag reads B. PRYNNE.\n\nHe sniffs the air, makes a small face, and turns to you.\n\n\"Good afternoon. EPA, Region One, Underground Injection Control Compliance Subgroup B. We received an anomalous reading from a Class II well that, per our records, does not actually exist. Are you the property owner?\"",
    choices: [
      { text: "\"Where is the warrant, bean counter?\"",        next: "scene_epa_2" },
      { text: "\"Fracking? Never heard of it.\"",                next: "scene_epa_2" },
      { text: "\"Actually, yes — I just fracked a bottomless pit.\"", next: "ending_epa_truth" },
      { text: "Try to bribe him with a Zynn",                    next: "ending_epa_bribe" }
    ]
  },

  scene_epa_2: {
    sprite: "epa_man",
    text: "B. Prynne flinches and scribbles something. A second agent emerges from the stairwell, taller, balding, glasses on a lanyard. Name tag: D. CALLOWAY.\n\n\"Mister Prynne. Step back, I'll handle this.\" He clears his throat. \"Sir, we have soil samples within a two-mile radius indicating Subsection 4(b) violations of the Safe Drinking Water Act. That wouldn't be related to anything happening at this address, would it?\"",
    choices: [
      { text: "\"Where is the warrant, paper pusher?\"",          next: "scene_epa_3" },
      { text: "\"Fracking? Never heard of it.\"",                  next: "scene_epa_3" },
      { text: "\"Yeah, the basement has a fracked bottomless pit.\"", next: "ending_epa_truth" },
      { text: "Compliment the lanyard",                            next: "ending_epa_compliment" }
    ]
  },

  scene_epa_3: {
    sprite: "epa_boss",
    text: "Calloway turns, deflated. Behind him, a third figure descends the stairs at a measured pace. Black suit. Mirrored sunglasses indoors. No name tag.\n\nHe stops at the bottom of the steps. The basement gets noticeably colder.\n\n\"I'm Regional Director Hollings. The boys upstairs tell me you've been uncooperative. Let me make this simple. Our equipment is sensitive enough to detect the isotopic signature of Communion wine in the water table within the last forty-eight hours. We can sit here for the rest of the afternoon, or you can tell me what we both already know.\"",
    choices: [
      { text: "\"Where is the warrant, deep state?\"",                     next: "ending_epa_win" },
      { text: "\"Fracking? Never heard of it.\"",                           next: "ending_epa_win" },
      { text: "\"The Holy Water, the Jello, and the walnut shells. It was a great mix.\"", next: "ending_epa_truth" },
      { text: "Confess everything calmly and ask for legal counsel",        next: "ending_epa_truth" }
    ]
  },

  ending_epa_truth: {
    sprite: "epa_boss",
    text: "Director Hollings allows himself a single, microscopic smile.\n\n\"Thank you for your cooperation.\"\n\nThe three agents move with practiced efficiency. Within twelve minutes the basement is roped off as an active investigation site. John Prime is detained materializing into the foyer; he is somehow already in handcuffs by the time he finishes phasing in. Plumpy is taken into Federal Wildlife custody.\n\nYou are remanded to a holding facility pending a Class II Well Operator Certification hearing.\n\nThe pit, technically, has been audited.\n\nIt is also no longer your problem.",
    ending: true,
    ending_label: "EPA Wins — Charges Filed",
    ending_class: "bad"
  },

  ending_epa_bribe: {
    sprite: "epa_man",
    text: "You offer B. Prynne a Zynn.\n\nHe stares at it for a moment with what might be hunger, or might be confusion. Then his expression hardens.\n\n\"Sir. Offering a controlled nicotine product to a federal officer during an active investigation is a separate offense. Logging it now.\"\n\nHe writes something down.\n\nThe other two agents have already started taping off the basement.",
    ending: true,
    ending_label: "EPA Wins — Bribery of a Federal Officer",
    ending_class: "bad"
  },

  ending_epa_compliment: {
    sprite: "epa_man",
    text: "\"It's a Buchanan,\" Calloway says, brightening, before catching himself. He scowls. \"Sir, this is highly inappropriate. We're trying to conduct an investigation here.\"\n\nHe writes something on his clipboard. The mood has shifted.\n\nThe third figure descends the stairs.\n\nHe is not someone you wanted to deal with.",
    ending: true,
    ending_label: "EPA Wins — Improper Conduct",
    ending_class: "bad"
  },

  ending_epa_win: {
    sprite: "john_friendly",
    text: "Director Hollings stares at you through his sunglasses for a long, long time.\n\nThen, slowly, he removes them. His eyes are the eyes of a man who has spent thirty years failing to convict people exactly like you.\n\n\"...we'll be in touch.\"\n\nJohn Prime materializes next to you, applauding slowly.\n\n\"With the Strait of Hormuz closed and the world's supply of oil forever disrupted, we can now be the number one supplier of all fossil-fuel-related needs. All it took was ten times the entire biomass of all life that ever existed on earth converted into bananas, a Soviet-era nuclear reactor, a bottomless pit from a genie, and of course... the friends we made along the way.\"\n\nJohn becomes sullen for a second and says under his breath, \"I guess the pit really isn't bottomless, but is actually deeply lucrative....\"",
    ending: true,
    ending_label: "Fracking Success — EPA Repelled",
    ending_class: "win"
  }
});
