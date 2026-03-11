# Kanban

WIP Limit: **Exactly 1 card in progress**

## Backlog
- (none)

## In Progress
- (none)

## Done

### Card: Scaffold + Tooling
- Goal: Create a new Phaser + TypeScript project with Playwright smoke test wiring and baseline folder structure.
- Files touched: `.gitignore`, `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.ts`, `src/scenes/*`, `src/systems/*`, `src/entities/*`, `src/ui/*`, `playwright.config.ts`, `tests/smoke.spec.ts`.
- Verification command: `npm install && npm run typecheck && npm run build && npm run test:smoke`.
- Done criteria: Tooling scripts run, smoke test executes, and artifacts are produced under game-local ignored paths.

### Card: Core Gameplay Loop + 3 Stages
- Goal: Implement complete playable flow with three escalating stages and deterministic win/lose transitions.
- Files touched: `src/scenes/GameScene.ts`, `src/scenes/ResultScene.ts`, `src/systems/*`, `src/entities/*`, `src/ui/*`, `src/types.ts`.
- Verification command: `npm run typecheck && npm run build && npm run test:smoke`.
- Done criteria: Start->Play->Win/Lose->Restart works; 3 stages are playable; zero console/runtime errors in smoke run.

### Card: Quality Pass + Refactor + Docs
- Goal: Improve visual consistency/feedback and refactor fragile modules after core loop is stable.
- Files touched: `src/scenes/GameScene.ts`, `src/systems/*`, `src/ui/*`, `QA.md`, `progress.md`.
- Verification command: `npm run typecheck && npm run build && npm run test:smoke`.
- Done criteria: Visual/readability pass complete, oversized logic decomposed, and QA evidence updated with green checks.

## Blocked
- (none)
