// Scenes for module: intro.
// Original source lines 720-770 of monolithic story_v2_explore.html
Object.assign(SCENES, {
  // OPENING
  // -----------------------------------------------

  // Basement intro — first time only, shows the original three-doors framing
  scene_basement_intro: {
    sprite: "three_doors",
    text: "You awake in a dark basement with three doors before you: \"Do Not Enter\", \"Storage\", \"Exit\".\n\nGroggy and confused, you must choose a door.",
    set: { _basement_entered: true },
    choices: [
      { text: "Get up and look around", next: "scene_test" }
    ]
  },

  // Basement hub — walk-around explore room with three doors and (optionally) John Prime
  scene_test: {
    route: (s) => s._basement_entered ? null : "scene_basement_intro",
    explore_room: "basement"
  },

  // -----------------------------------------------
  // BASEMENT SKELETONS — flavor NPCs
  // -----------------------------------------------

  scene_skeleton_silent: {
    text: "A pile of bones. Some shaped like a shovel, some shaped like ribs. They sit there. They do not move. They do not, as far as you can tell, dream.\n\nYou poke them, gently, with your toe. Nothing.\n\nThey feel less like a corpse and more like a puzzle missing its instructions.",
    choices: [
      { text: "Step back", next: "scene_test" }
    ]
  },

  scene_skeleton_lighter: {
    sprite: "skeleton_lighter_dialogue",
    text: "The skeleton leans on his shovel. The lantern in his other hand sways gently.\n\n\"I've been trapped here since the previous tiki party,\" he says, voice like dry leaves. \"He has had me digging since.\"\n\nHe gestures vaguely at the dirt floor, then at the shovel, then at himself, as if to say: this is the situation.",
    choices: [
      { text: "Step back", next: "scene_test" }
    ]
  },

  scene_skeleton_seeker: {
    sprite: "skeleton_seeker_dialogue",
    text: "The thing turns several of its heads toward you at once. The other heads continue looking elsewhere. Its many yellow eyes do not quite track in unison.\n\n\"He is really precious about his things,\" one of the mouths says, in a tone that suggests this is meant to be reassuring.\n\nAnother mouth adds, quieter: \"I think he'll be back soon.\"",
    choices: [
      { text: "Step back", next: "scene_test" }
    ]
  },

  scene_exit_router: {
    route: (s) => s.plumpy_disarmed_mine ? "scene_driveway" : "ending_tripmine"
  },

  // -----------------------------------------------
});
