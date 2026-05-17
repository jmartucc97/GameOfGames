// Scenes for module: intro.
// Original source lines 720-770 of monolithic story_v2_explore.html
Object.assign(SCENES, {
  // -----------------------------------------------
  // TITLE SCREEN
  // -----------------------------------------------

  scene_title: {
    title_screen: true,
    title: "Game of Games",
    tagline: "You'll figure it out.",
    sprite: "john_idle",
    choices: [
      { text: "Start", next: "scene_test" }
    ]
  },

  // -----------------------------------------------
  // OPENING
  // -----------------------------------------------

  // Basement hub — walk-around explore room with three doors and the tikis at the south end.
  // No intro screen anymore: title → Start → straight into this room.
  scene_test: {
    explore_room: "basement"
  },

  // -----------------------------------------------
  // BASEMENT TIKIS — orientation NPCs
  // -----------------------------------------------

  // RED tiki — gives deliberately unhelpful / absurd "advice"
  scene_tiki_red: {
    sprite: "tiki_red",
    text: (s) => {
      if (s._met_tiki_red) {
        return "The red tiki stares straight through you. The flame on his head bends in a draft you can't feel.\n\n\"As I was saying. The doors do not exist. There is only one door, and it is whichever one you do not pick.\"\n\nHis eyes glow brighter for a second.\n\n\"Also: drink the green one's tea. It is delicious.\"";
      }
      return "You step toward the red tiki. He notices you in the way old wood notices things, which is to say, all at once.\n\n\"Welcome,\" he says, and the syllables come out a little crooked. \"You're awake. Good. There are EIGHT doors in this room. Pick the seventh.\"\n\nThere are three doors. You count them again. Three.\n\n\"I see you doing math,\" the red tiki says. \"Don't. Numbers are a trap the floor sets.\"\n\nHis flame leans toward you, then away.\n\n\"Whatever happens, do not go to the storage room. There is a flower in there. It will eat you. Probably. Or not. I haven't been keeping track.\"";
    },
    set: { _met_tiki_red: true },
    choices: [
      { text: "Step back", next: "scene_test" }
    ]
  },

  // GREEN tiki — gives genuinely useful, slightly-deadpan orientation
  scene_tiki_green: {
    sprite: "tiki_green",
    text: (s) => {
      if (s._met_tiki_green) {
        return "The green tiki regards you with the patient expression of a thing that does not need to blink.\n\n\"Still here?\" he asks. \"That's fine. Take your time. The doors aren't going anywhere. Probably. Don't tap on me too much, the flame gets self-conscious.\"";
      }
      return "You step toward the green tiki. His eyes hold steady, calm.\n\n\"You're in the basement,\" he says, simply. \"There are three doors. They all open. None of them is the right one yet — you need things first. Things you do not have.\"\n\nHe pauses, as if checking notes you cannot see.\n\n\"The Storage room is safe. Mostly. Look around in there. There is a bookcase. Read what you find. Do not read the one that wants you to.\"\n\nHis flame steadies.\n\n\"The other one — across from me — will lie to you. He is not malicious. He is, in his way, very old. Take what he says backwards. Or don't. I'm a head on a stick. What do I know.\"";
    },
    set: { _met_tiki_green: true },
    choices: [
      { text: "Step back", next: "scene_test" }
    ]
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
