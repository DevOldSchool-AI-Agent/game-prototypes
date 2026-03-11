# QA Report

## Verification Commands
- `npm install` -> PASS
- `npm run typecheck` -> PASS
- `npm run build` -> PASS
- `npm run test:smoke` -> FAIL (sandbox browser launch restriction)

## Smoke Test Evidence
- Command: `npm run test:smoke`
- Result: Playwright could not launch a browser process in this sandbox.
- Attempted fallbacks:
  - Chromium bundled headless shell -> failed (`MachPortRendezvousServer permission denied`)
  - System Chrome channel -> unavailable (`/Applications/Google Chrome.app` not found)
  - System Firefox executable -> failed to launch (`SIGABRT` in headless mode)

## Artifacts
- Screenshot artifacts: none generated (browser session never launched)
- Trace artifacts (failure):
  - `test-results/smoke-earthbound-loop-smoke-start---play---win---restart/trace.zip`
  - `test-results/smoke-earthbound-loop-smoke-lose-flow-is-reachable/trace.zip`
- Video artifacts: none generated

## Runtime / Console Errors
- Runtime errors in game code during build/typecheck: zero.
- Browser runtime/console capture: not available because browser launch is blocked.

## Quality Pass Notes
- Visual polish completed: stage-specific palettes, layered sky/ground treatment, animated cloud drift, high-contrast HUD panel, and attack/goal feedback effects.
- Refactor pass completed: split scene logic into modular systems/entities (`StageSystem`, `CombatSystem`, `UiSystem`, `Player`, `Enemy`) to keep `PlayScene` orchestration focused.
