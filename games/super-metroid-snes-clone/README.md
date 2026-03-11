# Super Metroid (SNES) Clone - Vertical Slice

## Chosen game title
Super Metroid (SNES, 1994).

## Why this game for this run
- Strong fit for a compact vertical slice: movement, combat, hazards, and progression can be shipped without requiring full world design.
- Core fantasy reads quickly in a browser test: explore room, clear threats, collect objective, reach exit.
- Scope is controllable for a single automation run while still exercising full-loop quality gates.

## Scoped feature set (this run)
- Full game loop: title -> play -> win/lose -> restart/menu.
- 3 connected stage variants with escalating enemy count and hazard frequency.
- Player controls: move, jump, shoot.
- Health + timer fail states.
- Objective gating: collect energy cells then reach extraction gate.
- HUD (stage, HP, cells, timer) and clear result messaging.
- Deterministic test hooks for smoke automation.

## Not in scope
- Inventory, map screen, save system, or backtracking world graph.
- Boss fights, beam upgrades, or morph ball.
- Audio/music pipeline.
- External sprite/audio assets.

## Architecture sketch
- Scenes
  - `BootScene`: initialize visuals and forward to title.
  - `TitleScene`: start menu and controls prompt.
  - `PlayScene`: main gameplay orchestration.
  - `ResultScene`: win/lose screen and restart/menu input.
- Systems
  - `GameStateSystem`: shared run state and test API projection.
  - `StageSystem`: stage config and progression.
  - `CombatSystem`: projectile-enemy and contact damage rules.
- Entities
  - `Player`: movement, jump, fire cooldown, facing.
  - `DroneEnemy`: patrol/chase-lite behavior.
- UI
  - `Hud`: text overlays and runtime readability.
- Input/state
  - Keyboard only (`Arrow` keys, `Space`, `Enter`, `R`, `M`).
  - Scene data payload carries result reason and score summary.

## Risks and mitigations
- Risk: Phaser physics tuning can cause slippery controls.
  - Mitigation: fixed gravity/jump constants and explicit drag/max velocity.
- Risk: deterministic smoke tests can flake with live gameplay timing.
  - Mitigation: expose a minimal `window.gameTestApi` with force win/lose hooks.
- Risk: resize behavior can break centering.
  - Mitigation: use Phaser FIT scaling + centered parent container.
