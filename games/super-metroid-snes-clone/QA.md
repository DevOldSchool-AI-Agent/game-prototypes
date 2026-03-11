# QA Log

## Commands and outcomes
- `npm install` -> PASS
- `npm run typecheck` -> PASS
- `npm run build` -> PASS (bundle-size warning only)
- `npm run test:smoke` -> PASS

## Notes from verification loop
- Initial `npm run test:smoke` failed because port `4173` was in use.
- Mitigation: Playwright server port moved to `4174` in `playwright.config.ts`.
- Re-run after mitigation: all checks passed.

## Artifacts
- Screenshot artifact path: `games/super-metroid-snes-clone/artifacts/smoke/final-result.png`
- Playwright test metadata: `games/super-metroid-snes-clone/test-results/.last-run.json`
- Trace/video paths: none generated (configured for retries/failures only; no retries or failures in final run).

## Console/runtime errors
- Smoke test captures browser console errors and asserts empty list.
- Final run console/runtime errors: 0.
