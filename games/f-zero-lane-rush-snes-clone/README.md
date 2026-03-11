# F-Zero Lane Rush (SNES-inspired)

## Candidate Evaluation

| Inspiration | Mechanic Simplicity (1-5) | Deterministic Testability (1-5) | Asset Simplicity (1-5) | Polish Chance in One Run (1-5) | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| F-Zero (SNES) | 5 | 5 | 5 | 5 | 20 |
| Super Punch-Out!! | 3 | 4 | 3 | 3 | 13 |
| Donkey Kong Country | 2 | 2 | 2 | 2 | 8 |

## Chosen Inspiration

- **F-Zero (SNES)** lane pressure and high-speed dodge feel.
- Feasible because it is a single-screen loop with one primary action: lane switching.

## Core Mechanics Preserved

- Fast, readable lane-based avoidance.
- Immediate crash feedback.
- Race-like countdown tension to a finish condition.

## Scoped Feature Set

- Start screen with controls and objective.
- One play scene with deterministic spawn schedule.
- Shield-based lose state on collisions.
- Timed survival win state.
- Pickup score feedback.
- Result screen with restart.

## Not In Scope

- Track scrolling simulation with parallax.
- Opponent AI behavior trees.
- Multi-lap progression.
- Narrative events or cutscenes.

## Architecture Sketch

- **Scenes**: `BootScene` -> `MenuScene` -> `PlayScene` -> `ResultScene`.
- **Systems**: `TrackSystem` manages lanes, spawn sequence, win timer, objective text.
- **Entities**: `PlayerCar`, `Obstacle`, `EnergyOrb`.
- **Input**: keyboard (`Enter`, `Left/Right`, `A/D`).
- **State model**: scene-owned deterministic state exposed via `window.__FZERO_LANE_RUSH_STATE__` and `window.render_game_to_text()`.

## Risks and Mitigations

- Risk: input timing can make tests flaky.
- Mitigation: fixed spawn schedule and buffered wait windows in smoke tests.

- Risk: hidden runtime errors in browser.
- Mitigation: smoke tests assert console error count is zero.

- Risk: poor readability at small viewports.
- Mitigation: fixed aspect ratio with Phaser FIT scaling and centered canvas.

## Measurable Acceptance Criteria

- Human can start, play, win or lose, and restart via keyboard only.
- Objective text and controls are visible on-screen.
- Canvas stays centered and preserves target aspect ratio.
- `npm run typecheck`, `npm run build`, and `npm run test:smoke` pass.
- Smoke happy path reaches win through real key input.
- Smoke fail path reaches lose through real key input.
- Smoke tests report zero console/runtime errors.
