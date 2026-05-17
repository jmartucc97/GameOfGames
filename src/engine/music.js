// Background music routing: maps scene IDs to mp3 tracks.
function bgForScene(sceneId) {
  // Map scene IDs to background sprites. Returns sprite key or null.
  if (!sceneId) return null;
  // Trader (outside the exit - basement-ish stone for now)
  if (sceneId === "scene_trader" || sceneId.startsWith("scene_trader_") || sceneId === "ending_trader_crushed" || sceneId === "ending_tripmine") return "bg_basement";
  if (sceneId === "scene_driveway" || sceneId.startsWith("scene_drive_") || sceneId.startsWith("scene_kitty_") || sceneId === "ending_kitty_store_closed") return "bg_basement";
  // Reagan trapped — pit/void
  if (sceneId === "scene_john_furious" || sceneId === "ending_reagan_trapped") return "bg_pit_lava";
  // Rasputin (warm, eerie)
  if (sceneId === "scene_rasputin" || sceneId === "scene_rasputin_doom" || sceneId === "scene_rasputin_darkness" || sceneId === "scene_rasputin_fortune") return "bg_warm";
  // EPA gauntlet → office tile
  if (sceneId.startsWith("scene_epa_") || sceneId === "ending_epa_truth" || sceneId === "ending_epa_bribe" || sceneId === "ending_epa_compliment" || sceneId === "ending_epa_win") return "bg_epa";
  // Pit gauntlet fights / Spirit / Doom endings → lava
  if (sceneId.startsWith("scene_pit_demon") || sceneId === "scene_pit_descent" || sceneId === "scene_pit_freshy" || sceneId.startsWith("scene_pit_heal") || sceneId === "scene_pit_spirit" || sceneId === "scene_pit_norbit_fakeout" || sceneId === "ending_pit_doom_death") return "bg_pit_lava";
  // Pit gauntlet wins → warm glow (Reagan freed)
  if (sceneId === "ending_pit_win_sowell" || sceneId === "ending_pit_win_election" || sceneId === "ending_pit_win_norbit") return "bg_warm";
  // Pit supervisor cycles 1-10 + scroll reveal at 45 + promoted + fired
  if (sceneId.startsWith("scene_pit_cycle_") ) {
    const n = parseInt(sceneId.replace("scene_pit_cycle_", ""));
    if (n >= 11 && n <= 44) return null;  // void
    return "bg_pit_stone";
  }
  if (sceneId === "scene_pit_promoted" || sceneId === "scene_pit_promotion_10" || sceneId === "ending_pit_fired") return "bg_pit_stone";
  if (sceneId === "scene_loadout_backup" || sceneId === "scene_loadout_support" || sceneId === "scene_loadout_special" || sceneId === "scene_loadout_wildcard" || sceneId === "scene_john_recognize" || sceneId === "ending_pit_refusal") return "bg_basement";
  // Plumpy room and related
  if (sceneId.startsWith("scene_plumpy") || sceneId.startsWith("scene_frack") || sceneId === "scene_fuel_reactor" || sceneId === "scene_reactor_powered" || sceneId === "ending_uranium" || sceneId === "ending_funko" || sceneId === "ending_plumpy_attack" || sceneId === "ending_frack_fail" || sceneId === "ending_true_win") return "bg_plumpy";
  // Back room (cat lever)
  if (sceneId.startsWith("scene_cat") || sceneId === "scene_backroom_router" || sceneId.startsWith("ending_ww3_cat") || sceneId === "scene_lever_warning" || sceneId === "scene_lever_close" || sceneId === "scene_lever_open" || sceneId === "scene_john_truth_close" || sceneId === "ending_close_strait") return "bg_backroom";
  // Storage piles
  if (sceneId.startsWith("scene_pile") || sceneId.startsWith("scene_storage") || sceneId === "scene_tiki_lamp" || sceneId === "scene_gold_lamp" || sceneId.startsWith("scene_genie") || sceneId === "scene_tiki_used" || sceneId.startsWith("ending_genie") || sceneId === "scene_mimic_inspect" || sceneId === "ending_mimic_eaten") return "bg_storage";
  // Samara (dark)
  if (sceneId.startsWith("scene_samara") || sceneId.startsWith("ending_samara") || sceneId.startsWith("ending_attack_samara")) return "bg_pit_stone";
  // John Prime confrontation (basement)
  if (sceneId.startsWith("scene_john") || sceneId.startsWith("scene_mtg") || sceneId.startsWith("ending_john") || sceneId === "scene_donotenter_router") return "bg_basement";
  // Default: basement for scene_test and other basement scenes
  if (sceneId === "scene_test" || sceneId === "scene_regret") return "bg_basement";
  return null;
}

function applyBackground(sceneId) {
  const bgKey = bgForScene(sceneId);
  if (bgKey && SPRITES[bgKey]) {
    document.documentElement.style.setProperty("--bg-image", `url("${SPRITES[bgKey]}")`);
    document.documentElement.style.setProperty("--bg-opacity", "1");
  } else {
    document.documentElement.style.setProperty("--bg-opacity", "0");
  }
}
