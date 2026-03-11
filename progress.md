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
