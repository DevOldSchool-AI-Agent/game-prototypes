# QA Log

## Run 1

- commands executed:
  - `npm install`
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:smoke`
- outcomes:
  - `npm install`: pass
  - `npm run typecheck`: failed (`TS2688` missing `node` type defs)
  - `npm run build`: pass
  - `npm run test:smoke`: fail (happy-path timeout)
- screenshots:
  - `test-results/game-loop-smoke-gameplay-h-36313-ches-win-through-real-input/test-failed-1.png`
- trace/video:
  - `test-results/game-loop-smoke-gameplay-h-36313-ches-win-through-real-input/trace.zip`
  - `test-results/game-loop-smoke-gameplay-h-36313-ches-win-through-real-input/video.webm`
- console/runtime errors:
  - no page/console runtime errors reported

## Run 2

- commands executed:
  - `npm install && npm run typecheck && npm run build && npm run test:smoke`
  - `git check-ignore -v node_modules test-results artifacts .env dist`
- outcomes:
  - `npm install`: pass
  - `npm run typecheck`: pass
  - `npm run build`: pass
  - `npm run test:smoke`: pass (2/2)
  - `.gitignore` validation: pass
- screenshots:
  - `artifacts/smoke/happy-path.png`
  - `artifacts/smoke/fail-path.png`
- trace/video:
  - none produced on passing run
- console/runtime errors:
  - zero (asserted in both smoke tests)
