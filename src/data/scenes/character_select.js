// Character-select scene. Inserted between scene_title and scene_test.
// Title screen → Start → scene_character_select → (player picks) → scene_test (basement).
//
// This scene uses a special `character_select: true` flag that render() looks
// for to draw a custom grid of character portraits. Each choice writes
// state._character (the sprite-name prefix used by the explore renderer).
Object.assign(SCENES, {
  scene_character_select: {
    character_select: true,
    text: "Pick your character.",
    // Choices are still real, route-bearing choices — render() consumes them
    // through the normal click handler. The custom grid is just a fancier
    // visual on top of the same `choices` array.
    choices: CHARACTER_ROSTER.map(c => ({
      text: c.label,
      sprite: c.id + "_south_0",
      hint: c.hint,
      character_id: c.id,
      set: { _character: c.id, _facing: "south" },
      next: "scene_test"
    }))
  }
});
