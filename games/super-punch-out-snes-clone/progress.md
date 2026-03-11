Original prompt: Build one polished classic-inspired game (quality-gated + PR delivery)

## This Run
- Initialized project scaffold for `super-punch-out-snes-clone`.
- Added deterministic boxer core loop scenes/systems/entities/ui structure.
- Added Playwright smoke tests for happy and fail paths via keyboard input.
- Completed verification gates:
  - `npm install` pass
  - `npm run typecheck` pass
  - `npm run build` pass
  - `npm run test:smoke` pass
- Added QA record and screenshot artifacts in `artifacts/smoke/`.

## Known Limitations
- Single opponent only.
- No audio assets.
- Stylized geometric art only (no sprite sheet production pipeline yet).
