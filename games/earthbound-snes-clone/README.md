# EarthBound (SNES) Clone - Vertical Slice

## Chosen Game Title
EarthBound (SNES, 1994).

## Why This Game
EarthBound fits a small but shippable vertical slice: a top-down exploration/combat loop with clear stage progression, lightweight sprite needs, and readable HUD/state transitions. It supports a full game loop quickly without requiring large narrative systems.

## Scoped Feature Set (This Run)
- Title scene with start prompt and controls summary.
- 3 playable districts (stages) with increasing hazard pressure.
- Player movement, bash attack, health, and simple enemy AI.
- Stage objective: clear enemy quota then reach the stage exit.
- Full loop: start -> play -> win/lose -> restart.
- Deterministic debug hooks for smoke tests.
- Responsive scaling to use full viewport width/height while preserving 16:9 target aspect.

## Not In Scope
- Turn-based RPG battle transitions.
- Story dialogue trees and NPC quest systems.
- Inventory, equipment, leveling, and save files.
- Imported assets/audio from the original game.
- Mobile touch controls.

## Architecture Sketch
- Scenes
  - `BootScene`: texture generation + renderer/scale setup.
  - `MenuScene`: title and input handoff to gameplay.
  - `PlayScene`: core loop for stage simulation and progression.
  - `ResultScene`: win/lose messaging and restart.
- Systems
  - `StageSystem`: stage config, progression, quotas.
  - `CombatSystem`: attack collisions, damage, invulnerability timing.
  - `UiSystem`: HUD rendering and state text.
- Entities
  - `Player`: movement, attack state, health.
  - `Enemy`: chase/wander and contact damage.
- Input
  - Arrow keys / WASD move, `Space` attack, `R` restart.
- State
  - In-scene state machine: `running`, `stage-cleared`, `won`, `lost`.
  - Shared run data passed from `PlayScene` to `ResultScene`.

## Risks And Mitigations
- Risk: Phaser typing mismatches slow iteration.
  - Mitigation: keep systems strongly typed and small; run typecheck each card.
- Risk: smoke test flakiness from input timing.
  - Mitigation: expose deterministic test hooks (`window.__EARTHBOUND_TEST__`).
- Risk: visual readability in top-down scenes.
  - Mitigation: enforce palette tokens and high-contrast HUD panel.
