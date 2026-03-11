# Kanban

## Backlog
- None.

## In Progress
- Card: Quality pass + QA evidence + progress log
  - Goal: improve visuals/readability and record verification artifacts.
  - Files touched: `src/scenes/PlayScene.ts`, `src/systems/*`, `src/entities/*`, `src/ui/*`, `QA.md`, `README.md`, `/progress.md`.
  - Verification command: `npm run typecheck && npm run build && npm run test:smoke`.
  - Done criteria: zero runtime/console errors and QA evidence logged.

## Done
- Card: Scaffold Phaser + TypeScript + Playwright project
  - Goal: create runnable project skeleton with required scripts/config.
  - Files touched: `.gitignore`, `package.json`, `tsconfig.json`, `vite.config.ts`, `playwright.config.ts`, `index.html`, `src/main.ts`, `tests/smoke.spec.ts`.
  - Verification command: `npm run typecheck && npm run build && npm run test:smoke`.
  - Done criteria: project installs cleanly and all gates pass except blocked smoke browser launch in sandbox.

- Card: Build 3-stage core gameplay loop
  - Goal: implement menu, play, result scenes with win/lose/restart flow.
  - Files touched: `src/scenes/*`, `src/entities/*`, `src/systems/*`, `src/ui/*`.
  - Verification command: `npm run typecheck && npm run build && npm run test:smoke`.
  - Done criteria: player can clear all 3 stages or lose and restart.

## Blocked
- Card: Playwright smoke execution in sandbox
  - Goal: validate browser-based start/play/win/lose/restart loop.
  - Files touched: `playwright.config.ts`, `tests/smoke.spec.ts`, `QA.md`.
  - Verification command: `npm run test:smoke`.
  - Done criteria: browser launches successfully and both smoke tests pass.
