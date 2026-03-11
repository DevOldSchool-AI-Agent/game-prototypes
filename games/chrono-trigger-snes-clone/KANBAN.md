# Kanban

WIP policy: one card was moved to `In Progress` at a time in this sequence: Card 1 -> Card 2 -> Card 3 -> Card 4.

## Backlog

_None._

## In Progress

_None._

## Done

### Card 1 - Scaffold Phaser + TypeScript project
- Goal: create standalone project with required scripts and modular layout.
- Files touched: `package.json`, `tsconfig.json`, `index.html`, `src/**`, `scripts/smoke-test.mjs`.
- Verification command: `npm install && npm run typecheck && npm run build && npm run test:smoke`.
- Done criteria: commands pass and app bootstraps locally.

### Card 2 - Implement game loop and stage progression
- Goal: ship complete start -> play -> win/lose -> restart flow with 3 stages.
- Files touched: `src/scenes/*.ts`, `src/entities/*.ts`, `src/systems/*.ts`, `src/ui/Hud.ts`.
- Verification command: `npm run typecheck && npm run build && npm run test:smoke`.
- Done criteria: 3 playable stages, fail/win outcomes, restart/menu path.

### Card 3 - Browser-client QA hooks + runtime validation
- Goal: deterministic QA interface and artifact capture with no console/runtime errors.
- Files touched: `src/main.ts`, `src/scenes/PlayScene.ts`, `scripts/browser-client.mjs`, `qa-artifacts/*`.
- Verification command: `npm run qa:browser`.
- Done criteria: screenshot + `render_game_to_text` + `console-errors` artifacts produced; zero console errors.

### Card 4 - Quality pass and delivery artifacts
- Goal: polish visuals/readability, refactor fragile scene setup, rerun full verification, update run docs.
- Files touched: `src/scenes/PlayScene.ts`, `README.md`, `KANBAN.md`, `QA.md`, `../progress.md`.
- Verification command: `npm run typecheck && npm run build && npm run test:smoke && npm run qa:browser`.
- Done criteria: all checks pass, QA evidence recorded, progress updated.

## Blocked

_None._
