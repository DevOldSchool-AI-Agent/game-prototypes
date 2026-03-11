# Progress Log

## 2026-03-11 - EarthBound SNES Clone (codex/earthbound-clone)

### Completed
- Created new project: `games/earthbound-snes-clone`.
- Added planning docs before coding: `README.md`, `KANBAN.md`.
- Scaffolded Phaser + TypeScript + Vite project with modular layout (`scenes/`, `systems/`, `entities/`, `ui`).
- Implemented full loop vertical slice:
  - menu start -> 3-stage top-down action play -> win/lose result -> restart.
  - Stage progression with enemy quotas and exit unlock.
  - Health, timer pressure, score, restart shortcut, responsive scaling.
- Added Playwright smoke harness and deterministic test hooks.
- Added QA log in `games/earthbound-snes-clone/QA.md`.

### Verification
- `npm install` ✅
- `npm run typecheck` ✅
- `npm run build` ✅
- `npm run test:smoke` ❌ (sandbox browser launch restriction)

### Remaining TODOs
- Re-run `npm run test:smoke` in an environment that allows Playwright browser launch.
- Capture and attach passing smoke artifacts (screenshots/traces) in `QA.md`.
- Move final Kanban quality card to Done after smoke pass.
