Original prompt: Plan and build classic game clone (quality-gated + PR delivery)

## 2026-03-11 - Chrono Trigger SNES Clone
- Created a new game project at `games/chrono-trigger-snes-clone` using Phaser + TypeScript + Vite.
- Added planning docs (`README.md`, `KANBAN.md`) with scoped features, non-scope, architecture, risks, and card-level verification criteria.
- Implemented complete 3-stage action vertical slice with loop: start -> play -> win/lose -> restart/menu.
- Added deterministic QA hooks and browser automation artifacts (`render_game_to_text`, screenshot, console log).
- Completed quality pass refactor of `PlayScene` setup/collision initialization for lower fragility.
- Verification completed: install/typecheck/build/smoke/browser QA all passing; zero console/runtime errors.

### Remaining TODOs
- Add audio cues/music layers.
- Expand enemy variety and stage-specific hazard mechanics.
- Add automated gameplay assertions on `render_game_to_text` transitions.

## 2026-03-11 - Super Metroid SNES Clone
- Added a new game at `games/super-metroid-snes-clone` using Phaser + TypeScript + Vite.
- Created planning docs first (`README.md`, `KANBAN.md`) with scope/non-scope, architecture, and risks.
- Implemented complete vertical slice loop: title -> play -> win/lose -> restart/menu.
- Added deterministic test hooks and Playwright smoke test for core loop transitions.
- Ran quality pass with visual polish and PlayScene refactor for maintainability.
- Verification complete: install/typecheck/build/smoke passing; zero console/runtime errors.

### Remaining TODOs
- Add audio cues and richer enemy variation.
- Increase stage objective diversity.
- Extend smoke assertions beyond scene transitions.
