# QA Log

## Verification run 0a (first playable attempt)
- Iteration: 0
- Improvement goal: establish first playable loop + deterministic smoke tests.
- Commands executed:
  - `npm install`
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:smoke`
- Outcome:
  - `npm install`: pass
  - `typecheck`: pass
  - `build`: pass
  - `test:smoke`: **fail** (Firefox launch exited immediately in headless mode)
- Screenshot paths:
  - `test-results/smoke-happy-path-real-inputs-reach-win-state/test-failed-1.png`
  - `test-results/smoke-fail-path-real-inputs-reach-lose-state/test-failed-1.png`
- Trace/video paths:
  - `test-results/smoke-happy-path-real-inputs-reach-win-state/trace.zip`
  - `test-results/smoke-fail-path-real-inputs-reach-lose-state/trace.zip`
  - `test-results/.../video.webm` (both failing cases)
- Console/runtime errors: none from game code; blocker was browser launch configuration.
- Result: adjusted Playwright to Chromium + baseURL and retried.

## Verification run 0b (first playable stable baseline)
- Iteration: 0
- Improvement goal: stabilize smoke environment and validate baseline.
- Commands executed:
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:smoke`
- Outcome: all pass.
- Screenshot paths:
  - `artifacts/smoke-happy-path.png`
  - `artifacts/smoke-fail-path.png`
- Trace/video paths: none generated (configured only on failure).
- Console/runtime errors: zero.
- Result: first playable accepted, entered polish loop.

## Verification run 1
- Iteration: 1
- Improvement goal: improve controls feel (movement pop + blocked-move bump feedback).
- Commands executed:
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:smoke`
- Outcome: all pass.
- Screenshot paths:
  - `artifacts/smoke-happy-path.png`
  - `artifacts/smoke-fail-path.png`
- Trace/video paths: none generated.
- Console/runtime errors: zero.
- Result: kept.

## Verification run 2
- Iteration: 2
- Improvement goal: improve win/lose clarity (animated backdrop + end-state presentation).
- Commands executed:
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:smoke`
- Outcome: all pass.
- Screenshot paths:
  - `artifacts/smoke-happy-path.png`
  - `artifacts/smoke-fail-path.png`
- Trace/video paths: none generated.
- Console/runtime errors: zero.
- Result: kept.

## Verification run 3
- Iteration: 3
- Improvement goal: improve visual feedback (pickup bob + blast flicker animation).
- Commands executed:
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:smoke`
- Outcome: all pass.
- Screenshot paths:
  - `artifacts/smoke-happy-path.png`
  - `artifacts/smoke-fail-path.png`
- Trace/video paths: none generated.
- Console/runtime errors: zero.
- Result: kept.

## Verification run 4
- Iteration: 4
- Improvement goal: add optional synthesized sound feedback cues.
- Commands executed:
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:smoke`
- Outcome: all pass.
- Screenshot paths:
  - `artifacts/smoke-happy-path.png`
  - `artifacts/smoke-fail-path.png`
- Trace/video paths: none generated.
- Console/runtime errors: zero.
- Result: kept.

## Verification run 5
- Iteration: 5
- Improvement goal: improve HUD readability/contrast.
- Commands executed:
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:smoke`
- Outcome: all pass.
- Screenshot paths:
  - `artifacts/smoke-happy-path.png`
  - `artifacts/smoke-fail-path.png`
- Trace/video paths: none generated.
- Console/runtime errors: zero.
- Result: kept.
