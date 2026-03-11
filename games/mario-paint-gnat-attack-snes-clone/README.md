# Mario Paint Gnat Attack SNES Clone

## Candidate evaluation

| Inspiration | Mechanic simplicity (1-5) | Deterministic testability (1-5) | Asset simplicity (1-5) | Chance of polish in one run (1-5) | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Mario Paint: Gnat Attack | 5 | 5 | 5 | 5 | 20 |
| Super Bomberman | 3 | 4 | 3 | 3 | 13 |
| Super Tennis | 3 | 3 | 4 | 3 | 13 |

Chosen inspiration: **Mario Paint: Gnat Attack** (SNES, 1992).

## Why this is feasible

- Single-screen loop with one core action (swat).
- Deterministic enemy anchors make smoke tests reliable.
- Minimal generated shapes are enough for clear visual style.
- Tight feedback loop (hit/miss, timer pressure, quick restart) can be polished in one run.

## Core mechanics to preserve

- Cursor/swatter movement across one playfield.
- Fast swat action with immediate hit/miss feedback.
- Bug-clearing objective under time pressure.
- Arcade-style quick restart after win/lose.

## Scoped feature set

- Title scene with objective and controls.
- One arena with deterministic static gnat anchors.
- Keyboard swatter movement (`Arrows`/`WASD`) and swat (`Space`).
- Objective: eliminate target gnats before timer or focus depletion.
- Full loop: `start -> play -> win/lose -> restart/menu`.
- HUD with timer, kills, focus, score, controls/objective.
- Visual feedback for hits, misses (damage), pickups, and results.
- Deterministic smoke coverage (happy path + fail path) using real keyboard input.

## Not in scope

- Multi-stage campaigns or procedural levels.
- Mouse controls, touch controls, or gamepad support.
- Story/cutscenes/dialogue.
- Advanced enemy AI/pathfinding.
- Online leaderboards or persistent saves.

## Architecture sketch

Scenes:
- `BootScene`: generate textures and shared visual assets.
- `MenuScene`: title, objective, controls, and start prompt.
- `PlayScene`: gameplay loop, collisions, timer/state transitions.
- `ResultScene`: win/lose summary with restart/menu options.

Systems:
- `InputController`: normalized movement and action detection.
- `GameStateBridge`: publishes deterministic public state for smoke tests and debug text.

Entities:
- `Gnat`: target entity with deterministic hover motion.
- `Pickup`: reward spawned on kill and collected by player proximity.

Input:
- `Arrows`/`WASD`: move swatter.
- `Space`: swat.
- `Enter`: start from menu / return to menu from result.
- `R`: restart round from result.
- `F`: fullscreen toggle.

State model:
- Modes: `menu`, `playing`, `won`, `lost`.
- Round state: `timeLeft`, `kills`, `focus`, `score`, `targetKills`.
- Entities: alive gnats and active pickups with deterministic positions.

## Risks and mitigations

- Risk: smoke input flakiness around moving targets.
  - Mitigation: deterministic anchors, predictable bob amplitudes, helper movement in tests.
- Risk: runtime noise (console errors / failed requests).
  - Mitigation: explicit favicon, console error capture in tests.
- Risk: soft-lock after round end.
  - Mitigation: dedicated result scene with explicit restart/menu bindings.

## Measurable acceptance criteria

- Human can start, play, and reach win or lose without debug hooks.
- Controls and objective are visible on screen during play.
- Canvas is centered and scales with fixed aspect ratio.
- Happy-path smoke test reaches `won` via keyboard-driven swats (4 kills target).
- Fail-path smoke test reaches `lost` via real input flow.
- `npm install`, `npm run typecheck`, `npm run build`, `npm run test:smoke` all pass.
- Runtime/console errors are zero in smoke execution.
