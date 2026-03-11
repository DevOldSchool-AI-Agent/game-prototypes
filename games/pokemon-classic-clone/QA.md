# QA Evidence

## Card: Scaffold + Tooling
- Status: PASS
- `npm install phaser && npm install -D typescript vite @playwright/test @types/node`: PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS
- `npm run test:smoke`: PASS
- Screenshot artifacts:
  - `artifacts/smoke/menu.png`
  - `artifacts/smoke/win-result.png`
  - `artifacts/smoke/lose-result.png`
- Additional artifacts:
  - `artifacts/smoke/state-final.json`
- Playwright trace/video paths (enabled on failure): none generated on passing run
- Console/runtime errors: 0

## Card: Core Gameplay Loop + 3 Stages
- Status: PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS
- `npm run test:smoke`: PASS
- Gameplay checks covered by smoke:
  - Start from menu to active play: PASS
  - Win path after 3 stage clears: PASS
  - Restart from result screen: PASS
  - Lose path after restart: PASS
- Screenshot artifacts:
  - `artifacts/smoke/menu.png`
  - `artifacts/smoke/win-result.png`
  - `artifacts/smoke/lose-result.png`
- Console/runtime errors: 0

## Card: Quality Pass + Refactor + Docs
- Status: PASS
- Refactor applied: extracted stage spawning/collision runtime from `GameScene` into `systems/StageRuntime.ts`
- Visual/readability pass applied:
  - layered field pattern for clearer play space
  - pulsing collectible feedback
  - HUD low-time warning color/scale treatment
- `npm run typecheck`: PASS
- `npm run build`: PASS
- `npm run test:smoke`: PASS
- Screenshot artifacts:
  - `artifacts/smoke/menu.png`
  - `artifacts/smoke/win-result.png`
  - `artifacts/smoke/lose-result.png`
- Playwright trace/video paths (enabled on failure): none generated on passing run
- Console/runtime errors: 0
