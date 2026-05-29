# verify.ps1 -- Game of Games build sync check
$ErrorActionPreference = 'Stop'

$checks = @(
    # Engine
    @{ File='src/engine/render.js';        Pattern='accept_any';                    Min=2; Ver='v20'; Desc='engine handles any-input name entry' },
    @{ File='src/engine/render.js';        Pattern='plumpy_panic';                  Min=1; Ver='v20'; Desc='plumpy panic handled inside fight branch' },
    @{ File='src/engine/render.js';        Pattern='store_as';                      Min=2; Ver='v20'; Desc='input.store_as wiring for name capture' },
    @{ File='src/engine/render.js';        Pattern='setPersistedName';              Min=1; Ver='v28'; Desc='name is persisted to localStorage on submit' },
    @{ File='src/engine/render.js';        Pattern='typeof c\.next === "function"'; Min=1; Ver='v28'; Desc='engine supports function-form choice.next' },

    @{ File='src/engine/state.js';         Pattern='getPersistedName';              Min=2; Ver='v28'; Desc='persisted-name helper defined and used' },
    @{ File='src/engine/state.js';         Pattern='gog_player_name';               Min=2; Ver='v28'; Desc='localStorage key for player name' },
    @{ File='src/engine/state.js';         Pattern='player_name: getPersistedName'; Min=1; Ver='v28'; Desc='resetState restores player_name from localStorage' },

    # Basement layout (v17)
    @{ File='src/data/rooms.js';           Pattern='#\.K\.{5}S\.#';                 Min=1; Ver='v17'; Desc='skeletons K and S at row 5 in basement' },

    # Forest layout
    @{ File='src/data/rooms.js';           Pattern='x: 2, y: 2';                    Min=1; Ver='v18'; Desc='row-2 dead-end trees added' },
    @{ File='src/data/rooms.js';           Pattern='x: 0,  y: 0';                   Min=1; Ver='v27'; Desc='row-0 far-north tree wall added' },

    # Title flow / quips
    @{ File='src/data/scenes/intro.js';    Pattern='scene_name_entry';              Min=1; Ver='v20'; Desc='name entry scene defined' },
    @{ File='src/data/scenes/intro.js';    Pattern='scene_john_name_quip';          Min=1; Ver='v20'; Desc='john name quip scene defined' },
    @{ File='src/data/scenes/intro.js';    Pattern='scene_controls';                Min=1; Ver='v20'; Desc='controls screen scene defined' },
    @{ File='src/data/scenes/intro.js';    Pattern='Tap to walk and interact';      Min=1; Ver='v20'; Desc='controls verbatim text' },
    @{ File='src/data/scenes/intro.js';    Pattern='"arla":';                       Min=1; Ver='v22'; Desc='Arla quip in quips table' },
    @{ File='src/data/scenes/intro.js';    Pattern='"peter":';                      Min=1; Ver='v29'; Desc='Peter quip in quips table' },
    @{ File='src/data/scenes/intro.js';    Pattern='"diane":';                      Min=1; Ver='v29'; Desc='Diane quip in quips table' },
    @{ File='src/data/scenes/intro.js';    Pattern='survival look slim';            Min=1; Ver='v22'; Desc='updated Arla line' },
    @{ File='src/data/scenes/intro.js';    Pattern='chances of survival seem grim'; Min=1; Ver='v22'; Desc='default quip' },
    @{ File='src/data/scenes/intro.js';    Pattern='s\.player_name \? "scene_john_name_quip"'; Min=1; Ver='v28'; Desc='title screen skips name entry if name set' },

    # EPA
    @{ File='src/data/scenes/epa.js';      Pattern='paper pusher';                  Min=1; Ver='v19'; Desc='distinct insult for Calloway' },
    @{ File='src/data/scenes/epa.js';      Pattern='deep state';                    Min=1; Ver='v19'; Desc='distinct insult for Hollings' },
    @{ File='src/data/scenes/epa.js';      Pattern='Strait of Hormuz';              Min=1; Ver='v20'; Desc='grammar - Strait (capital S)' },
    @{ File='src/data/scenes/epa.js';      Pattern="world's supply";                Min=1; Ver='v20'; Desc='grammar - world apostrophe' },
    @{ File='src/data/scenes/epa.js';      Pattern='Soviet-era';                    Min=1; Ver='v20'; Desc='grammar - Soviet-era hyphen' },
    @{ File='src/data/scenes/epa.js';      Pattern='is actually deeply lucrative';  Min=1; Ver='v20'; Desc='grammar - is not in' },

    # Trader
    @{ File='src/data/scenes/driveway.js'; Pattern='Head back to the forest path';  Min=1; Ver='v18'; Desc='trader exit routes to forest' },

    # Built file
    @{ File='story_v2.html';               Pattern='accept_any';                    Min=2; Ver='v20'; Desc='[build] engine has accept_any' },
    @{ File='story_v2.html';               Pattern='setPersistedName';              Min=1; Ver='v28'; Desc='[build] name persistence in build' },
    @{ File='story_v2.html';               Pattern='gog_player_name';               Min=2; Ver='v28'; Desc='[build] localStorage key in build' },
    @{ File='story_v2.html';               Pattern='#\.K\.{5}S\.#';                 Min=1; Ver='v17'; Desc='[build] skeletons at row 5' },
    @{ File='story_v2.html';               Pattern='scene_name_entry';              Min=1; Ver='v20'; Desc='[build] name entry scene present' },
    @{ File='story_v2.html';               Pattern='survival look slim';            Min=1; Ver='v22'; Desc='[build] Arla quip present' },
    @{ File='story_v2.html';               Pattern='"peter":';                      Min=1; Ver='v29'; Desc='[build] Peter quip present' },
    @{ File='story_v2.html';               Pattern='Strait of Hormuz';              Min=1; Ver='v20'; Desc='[build] grammar Strait' },
    @{ File='story_v2.html';               Pattern='paper pusher';                  Min=1; Ver='v19'; Desc='[build] Calloway insult' },
    @{ File='story_v2.html';               Pattern='deep state';                    Min=1; Ver='v19'; Desc='[build] Hollings insult' },
    @{ File='story_v2.html';               Pattern='Head back to the forest path';  Min=1; Ver='v18'; Desc='[build] trader exits to forest' },
    @{ File='story_v2.html';               Pattern='x: 0,  y: 0';                   Min=1; Ver='v27'; Desc='[build] row-0 tree wall present' }
)

$pass = 0; $fail = 0; $failures = @()
foreach ($c in $checks) {
    if (-not (Test-Path $c.File)) {
        Write-Host ("  X  [{0}] {1} : MISSING FILE" -f $c.Ver, $c.File) -ForegroundColor Red
        $fail++; $failures += ("[{0}] {1} missing" -f $c.Ver, $c.File); continue
    }
    $content = Get-Content -Path $c.File -Raw
    $count = ([regex]::Matches($content, $c.Pattern)).Count
    if ($count -ge $c.Min) {
        Write-Host ("  OK [{0}] {1,-32} /{2}/ -> {3} (>= {4}) -- {5}" -f $c.Ver, $c.File, $c.Pattern, $count, $c.Min, $c.Desc) -ForegroundColor Green
        $pass++
    } else {
        Write-Host ("  X  [{0}] {1,-32} /{2}/ -> {3} (NEED >= {4}) -- {5}" -f $c.Ver, $c.File, $c.Pattern, $count, $c.Min, $c.Desc) -ForegroundColor Red
        $fail++; $failures += ("[{0}] {1} : /{2}/ -- {3}" -f $c.Ver, $c.File, $c.Pattern, $c.Desc)
    }
}

Write-Host ""
$src = Get-Content -Path 'src/data/sprites_forest.js' -Raw
$m0 = [regex]::Match($src, 'fpath_0:\s*"data:image/png;base64,([^"]+)"')
$m2 = [regex]::Match($src, 'fpath_2:\s*"data:image/png;base64,([^"]+)"')
if ($m0.Success -and $m2.Success -and $m0.Groups[1].Value -eq $m2.Groups[1].Value) {
    Write-Host "  OK [v27] sprites_forest.js              fpath_2 == fpath_0 -- pure tan path" -ForegroundColor Green
    $pass++
} else {
    Write-Host "  X  [v27] sprites_forest.js              fpath_2 NOT identical to fpath_0" -ForegroundColor Red
    $fail++; $failures += "[v27] fpath_2 not identical to fpath_0"
}

$built = Get-Content -Path 'story_v2.html' -Raw
$b0 = [regex]::Match($built, 'fpath_0:\s*"data:image/png;base64,([^"]+)"')
$b2 = [regex]::Match($built, 'fpath_2:\s*"data:image/png;base64,([^"]+)"')
if ($b0.Success -and $b2.Success -and $b0.Groups[1].Value -eq $b2.Groups[1].Value) {
    Write-Host "  OK [v27] story_v2.html                  fpath_2 == fpath_0 -- pure tan in build" -ForegroundColor Green
    $pass++
} else {
    Write-Host "  X  [v27] story_v2.html                  fpath_2 NOT identical in build" -ForegroundColor Red
    $fail++; $failures += "[v27] fpath_2 != fpath_0 in build"
}

Write-Host ""
$summaryColor = 'Green'; if ($fail -gt 0) { $summaryColor = 'Red' }
Write-Host ("Result: {0} passed, {1} failed" -f $pass, $fail) -ForegroundColor $summaryColor
if ($fail -gt 0) {
    Write-Host ""; Write-Host "Failed checks:" -ForegroundColor Yellow
    foreach ($f in $failures) { Write-Host ("  - " + $f) }
    Write-Host ""; Write-Host "Do NOT push." -ForegroundColor Yellow
    exit 1
}
Write-Host "Safe to push." -ForegroundColor Green
exit 0
