# verify.ps1 -- Game of Games build sync check
#
# Run this AFTER `node build.js` and BEFORE `git push` to confirm every
# previous update is present in both source files and story_v2.html.
# If anything fails, do not push -- check which file is stale.
#
# Usage from the project root:   .\verify.ps1
# Exit code: 0 on full pass, 1 on any failure.

$ErrorActionPreference = 'Stop'

# Each check: File, Pattern, Min (>=), Ver, Desc.
# Pattern is a .NET regex (use \\ for literal backslash in the pattern).
# All strings ASCII-only to avoid PowerShell 5.1 codepage issues.
$checks = @(
    # Engine (v20 / v23)
    @{ File='src/engine/render.js';        Pattern='accept_any';                    Min=2; Ver='v20'; Desc='engine handles any-input name entry' },
    @{ File='src/engine/render.js';        Pattern='plumpy_panic';                  Min=1; Ver='v20'; Desc='plumpy panic handled inside fight branch' },
    @{ File='src/engine/render.js';        Pattern='store_as';                      Min=2; Ver='v20'; Desc='input.store_as wiring for name capture' },

    # Basement layout (v17)
    @{ File='src/data/rooms.js';           Pattern='#\.K\.{5}S\.#';                 Min=1; Ver='v17'; Desc='skeletons K and S at row 5 in basement' },

    # Forest layout (v18)
    @{ File='src/data/rooms.js';           Pattern='x: 2, y: 2';                    Min=1; Ver='v18'; Desc='north dead-end trees added to forest' },

    # Title flow / quips (v20, v22)
    @{ File='src/data/scenes/intro.js';    Pattern='scene_name_entry';              Min=1; Ver='v20'; Desc='name entry scene defined' },
    @{ File='src/data/scenes/intro.js';    Pattern='scene_john_name_quip';          Min=1; Ver='v20'; Desc='john name quip scene defined' },
    @{ File='src/data/scenes/intro.js';    Pattern='scene_controls';                Min=1; Ver='v20'; Desc='controls screen scene defined' },
    @{ File='src/data/scenes/intro.js';    Pattern='Tap to walk and interact';      Min=1; Ver='v20'; Desc='controls verbatim text' },
    @{ File='src/data/scenes/intro.js';    Pattern='"arla"';                        Min=1; Ver='v22'; Desc='Arla quip in quips table' },
    @{ File='src/data/scenes/intro.js';    Pattern='survival look slim';            Min=1; Ver='v22'; Desc='updated Arla line' },
    @{ File='src/data/scenes/intro.js';    Pattern='chances of survival seem grim'; Min=1; Ver='v22'; Desc='updated default quip' },

    # EPA insults and verbatim text (v19, v20)
    @{ File='src/data/scenes/epa.js';      Pattern='paper pusher';                  Min=1; Ver='v19'; Desc='distinct insult for Calloway' },
    @{ File='src/data/scenes/epa.js';      Pattern='deep state';                    Min=1; Ver='v19'; Desc='distinct insult for Hollings' },
    @{ File='src/data/scenes/epa.js';      Pattern='Strait of Hormuz';              Min=1; Ver='v20'; Desc='grammar - Strait (capital S)' },
    @{ File='src/data/scenes/epa.js';      Pattern="world's supply";                Min=1; Ver='v20'; Desc='grammar - world apostrophe s supply' },
    @{ File='src/data/scenes/epa.js';      Pattern='Soviet-era';                    Min=1; Ver='v20'; Desc='grammar - Soviet-era hyphen' },
    @{ File='src/data/scenes/epa.js';      Pattern='is actually deeply lucrative';  Min=1; Ver='v20'; Desc='grammar - is not in' },

    # Trader exit (v18)
    @{ File='src/data/scenes/driveway.js'; Pattern='Head back to the forest path';  Min=1; Ver='v18'; Desc='trader exit routes to forest' },

    # Sprites cleanup (v18)
    @{ File='src/data/sprites_forest.js';  Pattern='fpath_2';                       Min=1; Ver='v18'; Desc='fpath_2 cleaned of green tufts' },

    # Built-file checks: same tokens should appear in story_v2.html
    @{ File='story_v2.html';               Pattern='accept_any';                    Min=2; Ver='v20'; Desc='[build] engine has accept_any' },
    @{ File='story_v2.html';               Pattern='#\.K\.{5}S\.#';                 Min=1; Ver='v17'; Desc='[build] skeletons at row 5' },
    @{ File='story_v2.html';               Pattern='scene_name_entry';              Min=1; Ver='v20'; Desc='[build] name entry scene present' },
    @{ File='story_v2.html';               Pattern='survival look slim';            Min=1; Ver='v22'; Desc='[build] Arla quip present' },
    @{ File='story_v2.html';               Pattern='Strait of Hormuz';              Min=1; Ver='v20'; Desc='[build] grammar Strait' },
    @{ File='story_v2.html';               Pattern='paper pusher';                  Min=1; Ver='v19'; Desc='[build] Calloway insult' },
    @{ File='story_v2.html';               Pattern='deep state';                    Min=1; Ver='v19'; Desc='[build] Hollings insult' },
    @{ File='story_v2.html';               Pattern='Head back to the forest path';  Min=1; Ver='v18'; Desc='[build] trader exits to forest' }
)

$pass = 0
$fail = 0
$failures = @()

foreach ($c in $checks) {
    $file = $c.File
    $pat  = $c.Pattern
    $min  = $c.Min
    $ver  = $c.Ver
    $desc = $c.Desc

    if (-not (Test-Path $file)) {
        Write-Host ("  X  [{0}] {1} : MISSING FILE" -f $ver, $file) -ForegroundColor Red
        $fail++
        $failures += ("[{0}] {1} missing" -f $ver, $file)
        continue
    }

    # Read file as one string and count all regex match instances (not just
    # matching lines -- some tokens occur multiple times per line).
    $content = Get-Content -Path $file -Raw
    $count = ([regex]::Matches($content, $pat)).Count

    if ($count -ge $min) {
        Write-Host ("  OK [{0}] {1,-32} /{2}/ -> {3} (>= {4}) -- {5}" -f $ver, $file, $pat, $count, $min, $desc) -ForegroundColor Green
        $pass++
    } else {
        Write-Host ("  X  [{0}] {1,-32} /{2}/ -> {3} (NEED >= {4}) -- {5}" -f $ver, $file, $pat, $count, $min, $desc) -ForegroundColor Red
        $fail++
        $failures += ("[{0}] {1} : /{2}/ -- {3}" -f $ver, $file, $pat, $desc)
    }
}

Write-Host ""
$summaryColor = 'Green'
if ($fail -gt 0) { $summaryColor = 'Red' }
Write-Host ("Result: {0} passed, {1} failed" -f $pass, $fail) -ForegroundColor $summaryColor

if ($fail -gt 0) {
    Write-Host ""
    Write-Host "Failed checks:" -ForegroundColor Yellow
    foreach ($f in $failures) { Write-Host ("  - " + $f) }
    Write-Host ""
    Write-Host "Do NOT push. Re-extract the relevant zip drop and re-run node build.js." -ForegroundColor Yellow
    exit 1
}

Write-Host "Safe to push." -ForegroundColor Green
exit 0
