## Summary
- add a new polished Phaser + TypeScript game: `games/kirby-gourmet-race-snes-clone`
- implement deterministic full loop: start -> play -> win/lose -> restart
- add deterministic Playwright smoke tests for happy path (win) and fail path (lose)
- run an explicit 5-iteration polish loop with quality gates after each iteration

## Game details
- inspiration: Kirby Super Star (SNES), Gourmet Race feel
- core action: move + dash to collect treats before timer expires
- deterministic systems: fixed pickup layout, fixed hazard patrol, fixed timer/hp rules

## Verification
- `npm install` ✅
- `npm run typecheck` ✅
- `npm run build` ✅
- `npm run test:smoke` ✅
- smoke screenshots:
  - `games/kirby-gourmet-race-snes-clone/artifacts/smoke-happy-path.png`
  - `games/kirby-gourmet-race-snes-clone/artifacts/smoke-fail-path.png`
- console/runtime errors during smoke checks: `0`

## Risks / limitations
- Phaser typings required a local shim in this environment (`src/phaser-shim.d.ts`).
- single-map scope by design (polish over breadth).

## Security
- secret scan gate run by `commit_changes.sh` before commit: ✅ pass
