# QA Log

## Run 1 (failed)

- Commands executed:
  - `npm install`
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:smoke`
- Outcomes:
  - `npm install`: pass
  - `npm run typecheck`: fail (`src/entities/PlayerCar.ts` nullability)
  - `npm run build`: fail (same type error)
  - `npm run test:smoke`: fail (test assertions expected DOM text, canvas-only rendering)
- Screenshots:
  - `/Users/troy/Development/web/game-prototypes/games/f-zero-lane-rush-snes-clone/test-results/smoke-f-zero-lane-rush-smo-2b923-hes-win-using-real-controls/test-failed-1.png`
  - `/Users/troy/Development/web/game-prototypes/games/f-zero-lane-rush-snes-clone/test-results/smoke-f-zero-lane-rush-smo-a94c2-es-lose-using-real-controls/test-failed-1.png`
- Trace/video paths:
  - `/Users/troy/Development/web/game-prototypes/games/f-zero-lane-rush-snes-clone/test-results/smoke-f-zero-lane-rush-smo-2b923-hes-win-using-real-controls/trace.zip`
  - `/Users/troy/Development/web/game-prototypes/games/f-zero-lane-rush-snes-clone/test-results/smoke-f-zero-lane-rush-smo-2b923-hes-win-using-real-controls/video.webm`
  - `/Users/troy/Development/web/game-prototypes/games/f-zero-lane-rush-snes-clone/test-results/smoke-f-zero-lane-rush-smo-a94c2-es-lose-using-real-controls/trace.zip`
  - `/Users/troy/Development/web/game-prototypes/games/f-zero-lane-rush-snes-clone/test-results/smoke-f-zero-lane-rush-smo-a94c2-es-lose-using-real-controls/video.webm`
- Console/runtime errors summary:
  - Blocking issue was test harness (file URL + DOM-text assertions), not gameplay runtime.

## Run 2 (pass)

- Commands executed:
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:smoke`
- Outcomes:
  - `npm run typecheck`: pass
  - `npm run build`: pass
  - `npm run test:smoke`: pass (2 passed)
- Screenshots:
  - `/Users/troy/Development/web/game-prototypes/games/f-zero-lane-rush-snes-clone/artifacts/playwright/happy-win.png`
  - `/Users/troy/Development/web/game-prototypes/games/f-zero-lane-rush-snes-clone/artifacts/playwright/fail-lose.png`
- Trace/video paths:
  - None produced on passing run (configured `retain-on-failure`).
- Console/runtime errors summary:
  - Zero console errors captured in both smoke tests.
