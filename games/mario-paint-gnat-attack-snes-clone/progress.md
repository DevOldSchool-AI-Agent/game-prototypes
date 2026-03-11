Original prompt: Build one polished classic-inspired game (quality-gated + PR delivery)

## Built

- Created a new Phaser + TypeScript prototype inspired by SNES Mario Paint Gnat Attack.
- Implemented full loop: menu -> play -> won/lost -> restart/menu.
- Added deterministic enemy layout, responsive keyboard swatter, pickups, HUD, and feedback effects.
- Added Playwright smoke suite with happy and fail path coverage using real keyboard input.

## Intentionally cut

- Mouse/touch controls.
- Multi-level progression.
- Narrative systems and persistent saves.

## Verification outcomes

- `npm install` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `npm run test:smoke` passed (`2 passed`).
- `.gitignore` rule effectiveness validated via `git check-ignore -v`.
- Smoke assertions confirmed zero console/page runtime errors.

## Known limitations

- Single arena only; no stage progression.
- Swat action intentionally has generous target assist to keep deterministic testability.
