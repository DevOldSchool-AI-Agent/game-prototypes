# Chrono Trigger (SNES) Clone - Vertical Slice

## Chosen Game Title
Chrono Trigger (SNES, 1995).

## Why This Game
Chrono Trigger supports a shippable vertical slice with clear core loop mechanics for one run: top-down movement, combat, staged progression, and high-clarity win/lose states. It avoids large RPG systems (party, story scripting, inventory trees) while still preserving recognizable feel through time-era themed stages.

## Scoped Feature Set (This Run)
- Title screen with controls and start flow.
- Core loop: start -> play -> win/lose -> restart.
- Three sequential stages (Prehistory, Middle Ages, Future Dome).
- Player movement, dash strike attack, health system.
- Enemy spawning/chase/contact damage.
- Stage objective: collect Time Shards while surviving.
- Timer pressure and fail states.
- HUD (stage, HP, shards, timer, enemies).
- Fullscreen toggle (`F`) and responsive scaling preserving target aspect ratio.
- Deterministic QA hooks: `window.render_game_to_text()` and `window.advanceTime(ms)`.

## Not In Scope
- Turn-based battle menus / ATB system.
- Story dialogue, cutscenes, and branching timelines.
- Party members and character swapping.
- Save/load systems.
- Audio assets and soundtrack emulation.
- Original copyrighted graphics recreation.

## Architecture Sketch
- Scenes
  - `BootScene`: texture generation + global scale setup.
  - `MenuScene`: title/instructions/start.
  - `PlayScene`: stage simulation, entities, collisions, outcomes.
  - `ResultScene`: win/lose summary + restart.
- Systems
  - `InputController`: keyboard intent mapping.
  - `StageManager`: stage configs and progression.
- Entities
  - `Player`: movement, attack cooldown, HP.
  - `Enemy`: seek/chase with contact damage cadence.
- UI
  - `Hud`: all in-game status text and stage labels.
- State
  - Scene-local deterministic state object in `PlayScene`.
  - End-state payload passed to `ResultScene` for restart and summary.

## Risks + Mitigations
- Risk: Phaser scale/runtime differences create resize regressions.
  - Mitigation: use Phaser FIT mode + explicit `resize` handler without recursive refresh calls.
- Risk: Browser automation flakes from timing race with dev server.
  - Mitigation: deterministic stepping hook + fixed waits + explicit error capture in browser client.
- Risk: Scope creep into RPG complexity.
  - Mitigation: freeze to one-player action slice with fixed 3-stage progression and no inventory/story systems.
