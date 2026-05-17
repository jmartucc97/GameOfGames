// Top-level globals shared across modules. Declared here so every module can
// reference them; data files populate them via Object.assign.
const SPRITES = {};
const SCENES = {};

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
