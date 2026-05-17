// Scenes for module: backroom.
// Original source lines 2041-2096 of monolithic story_v2_explore.html
Object.assign(SCENES, {
  // BACK ROOM
  // -----------------------------------------------

  scene_backroom_router: {
    route: (s) => {
      if (s.has_tube || s.has_hard_treats || s.has_catnip) return "scene_approach_cat";
      if (s.investigated_noise) return "scene_backroom_postjohn";
      return "scene_backroom_first";
    }
  },

  scene_backroom_first: {
    sprite: "cat_idle",
    text: "You step through into a small room.\n\nIn the center: a magic lever, glowing faintly. A small placard reads \"Schrödinger's Strait of Hormuz — Open / Closed.\"\n\nA very large brown cat sits beside the lever, batting it back and forth with rhythmic patience. Open, closed, open, closed.\n\nFrom back toward the entrance, you hear an unfamiliar noise. Footsteps?",
    set: { met_cat: true },
    choices: [
      { text: "Investigate the noise", next: "scene_investigate_noise", set: { investigated_noise: true } },
      { text: "Approach the cat", next: "scene_cat_warning" },
      { text: "Attack the cat", next: "ending_attack_cat" },
      { text: "Slip out the way you came", next: "scene_missed_noise_john" }
    ]
  },

  // Player chose to skip the noise — John intercepts them in the basement
  scene_missed_noise_john: {
    sprite: "john_appear",
    text: "You retreat from the back room without investigating.\n\nThe moment you step back into the basement, a tall, robed figure is standing right in front of you, arms crossed.\n\n\"Hi. John Prime. I heard you sneaking around back there. You weren't gonna come say hello?\"\n\nHe taps his foot. The polite version of a threat.\n\n\"Anyway. Did you... touch anything?\"",
    set: { john_appeared: true, investigated_noise: true },
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

  scene_backroom_postjohn: {
    text: "The cat eyes you. You don't have a treat for it yet. Best go find one — John mentioned the kitty food store down the road, but it's closing soon.",
    set: { met_cat: true },
    choices: [
      { text: "Back to the Plumpy room", next: "scene_plumpy_main" }
    ]
  },

  scene_cat_warning: {
    text: "As you approach the cat, it glares at you menacingly. Almost as if to indicate that another step forward could be your ruin.",
    choices: [
      { text: "Back away slowly to the Plumpy room", next: "scene_plumpy_main" },
      { text: "Take another step forward anyway", next: "ending_ww3_cat_first" }
    ]
  },

  // -----------------------------------------------
});
