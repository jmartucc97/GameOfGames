// Pile items + the pileChoices builder used by all pile-rummaging scenes.
const PILE_1_ITEMS = [
  { id: "flashlight", label: "flashlight", flag: "has_flashlight" },
  { id: "ssn", label: "social security card", flag: "has_ssn" },
  { id: "passport", label: "passport", flag: "has_passport" },
  { id: "speaker", label: "Bluetooth speaker", flag: "has_speaker" },
];
const PILE_2_ITEMS = [
  { id: "zynns", label: "pack of Zynns", flag: "has_zynns" },
  { id: "plums", label: "small bag of plums", flag: "has_plums" },
];
const PILE_3_ITEMS = [
  { id: "gold_lamp", label: "shiny gold lamp", flag: "has_gold_lamp" },
  { id: "tiki_lamp", label: "tiki lamp", flag: "has_tiki_lamp" },
];

function pileChoices(pileItems, returnScene) {
  const choices = [];
  // Take each item (auto-swaps - clears other items in pile, sets this one)
  pileItems.forEach(item => {
    const set = {};
    pileItems.forEach(other => { set[other.flag] = (other.id === item.id); });
    choices.push({
      text: `Take the ${item.label}`,
      next: returnScene === "self" ? null : returnScene,
      set: set,
      unless: [item.flag]
    });
  });
  // Put back current item
  pileItems.forEach(item => {
    const set = {};
    set[item.flag] = false;
    choices.push({
      text: `Put back the ${item.label}`,
      set: set,
      requires: [item.flag]
    });
  });
  return choices;
}
