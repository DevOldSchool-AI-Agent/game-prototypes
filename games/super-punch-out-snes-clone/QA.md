# QA Log

## Run 1
- commands executed:
  - `npm install`
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:smoke`
- outcomes:
  - `npm install`: pass
  - `npm run typecheck`: pass
  - `npm run build`: pass
  - `npm run test:smoke`: pass (2/2 smoke tests)
- screenshots:
  - `artifacts/smoke/happy-path.png`
  - `artifacts/smoke/fail-path.png`
- trace/video:
  - none produced in passing run (`trace` and `video` are retain-on-failure)
- console/runtime errors:
  - `0` (captured by smoke tests; assertions enforce no console error and no pageerror events)
