# Pokemon Classic Clone

## Chosen Game
- **Title:** Pokemon (Game Boy era inspiration)
- **Run project name:** Pokemon Classic Clone

## Rationale
Pokemon is a strong fit for a vertical-slice clone because it has a clear exploration-to-battle loop, recognizable progression through stages, and deterministic state transitions that are easy to smoke-test. For this run, we use original code/art built in-project (procedural Phaser graphics) to avoid cross-folder asset reuse while preserving classic top-down RPG feel.

## Scoped Feature Set (This Run)
- Start screen with controls and objective.
- Core loop: `start -> play -> win/lose -> restart`.
- 3 sequential stages with increasing pressure:
  - Stage 1: collect all Pokeballs before timer expires.
  - Stage 2: more obstacles + shorter timer.
  - Stage 3: moving trainers + strict timer.
- Player movement on a bounded arena with collision against walls/obstacles.
- Stage HUD for timer, stage number, and remaining pickups.
- Win condition when stage 3 is cleared.
- Lose condition when timer hits zero or player loses all hearts.

## Not In Scope
- Multiplayer, online features, save files.
- Full Pokemon battle system, party management, evolutions, stats database.
- External asset pipeline, spritesheets, or audio production.
- Mobile controls and localization.
- Accessibility feature set beyond baseline readability.

## Architecture Sketch
- **Scenes**
  - `BootScene`: procedural texture generation + shared constants.
  - `MenuScene`: start UI and game intro instructions.
  - `GameScene`: active gameplay, stage transitions, win/lose checks.
  - `ResultScene`: outcome summary and restart/menu actions.
- **Systems**
  - `StageSystem`: stage config, obstacle/pickup/enemy spawn plans.
  - `InputSystem`: keyboard abstraction for deterministic movement.
  - `EncounterSystem`: heart damage cooldown, collision-driven penalties.
- **Entities**
  - `Player` class for movement body and facing/feedback state.
  - `Trainer` enemy with simple patrol/chase behavior.
- **UI**
  - `Hud` module for timer/stage/hearts/pickups updates.
- **State**
  - Scene-owned runtime state: current stage, timer, hearts, pickups remaining.
  - Immutable stage definitions in `StageSystem`.

## Risks + Mitigations
- **Risk:** Phaser collision interactions can become fragile as stage complexity grows.
  - **Mitigation:** Keep stage composition data-driven and instantiate from a single factory path.
- **Risk:** Smoke tests can flake due to timing-sensitive gameplay.
  - **Mitigation:** Add deterministic test hooks via `window.render_game_to_text()` and avoid random seeds in tests.
- **Risk:** Responsive scaling can crop gameplay on unusual screens.
  - **Mitigation:** Use Phaser FIT scale mode and center canvas while preserving fixed target aspect ratio.
