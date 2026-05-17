// build.js — Concatenates files in src/ into a single story_v2.html
// Usage: node build.js

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');

// Files to inline as CSS (in <style> block in head)
const CSS_FILES = [
  'styles.css',
];

// Files to inline as JS (in <script> block in body, in this exact order)
const JS_FILES = [
  // 1. Utilities (no dependencies)
  'engine/util.js',

  // 2. Data containers — these declare top-level globals (SPRITES, SCENES, etc.)
  'data/sprites.js',
  'data/sprites_chars.js',   // character sprites + CHARACTER_ROSTER
  'data/sprites_dungeon.js', // dungeon walls/floors/door/pit/vine/candle tiles
  'data/items.js',
  'data/rooms.js',

  // 3. Scene modules — each Object.assigns into SCENES
  'data/scenes/intro.js',
  'data/scenes/character_select.js',
  'data/scenes/driveway.js',
  'data/scenes/john_basement.js',
  'data/scenes/storage.js',
  'data/scenes/plumpy.js',
  'data/scenes/backroom.js',
  'data/scenes/samara.js',
  'data/scenes/john_first.js',
  'data/scenes/cat.js',
  'data/scenes/fracking.js',
  'data/scenes/pit_gauntlet.js',
  'data/scenes/epa.js',

  // 4. Engine — depends on data
  'engine/state.js',
  'engine/sfx.js',
  'engine/music.js',
  'engine/explore.js',
  'engine/render.js',
];

function readSrc(rel) {
  const fullPath = path.join(SRC, rel);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing source file: ${rel}`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function build() {
  const shell = readSrc('index.html');

  // Concatenate CSS
  const css = CSS_FILES.map(f => {
    const body = readSrc(f);
    return `/* ===== ${f} ===== */\n${body}`;
  }).join('\n\n');

  // Concatenate JS
  const js = JS_FILES.map(f => {
    const body = readSrc(f);
    return `// ===== ${f} =====\n${body}`;
  }).join('\n\n');

  // Inject into shell. Shell must contain `/* CSS_INJECTION */` and `/* JS_INJECTION */`.
  let out = shell;
  if (!out.includes('/* CSS_INJECTION */')) {
    throw new Error('src/index.html missing /* CSS_INJECTION */ marker');
  }
  if (!out.includes('/* JS_INJECTION */')) {
    throw new Error('src/index.html missing /* JS_INJECTION */ marker');
  }
  out = out.replace('/* CSS_INJECTION */', css);
  out = out.replace('/* JS_INJECTION */', js);

  const outPath = path.join(ROOT, 'story_v2.html');
  fs.writeFileSync(outPath, out, 'utf8');

  const stats = fs.statSync(outPath);
  console.log(`✓ Built ${outPath}`);
  console.log(`  ${stats.size.toLocaleString()} bytes, ${out.split('\n').length.toLocaleString()} lines`);
}

if (require.main === module) {
  try {
    build();
  } catch (e) {
    console.error('✗ Build failed:', e.message);
    process.exit(1);
  }
}

module.exports = { build };
