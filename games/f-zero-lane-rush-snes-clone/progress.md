Original prompt: Build one polished classic-inspired game (quality-gated + PR delivery)

## Built

- New Phaser + TypeScript prototype `f-zero-lane-rush-snes-clone`.
- Deterministic lane-racing survival loop inspired by SNES F-Zero.
- HUD with shield, score, timer, objective, and feedback tween text.
- Playwright smoke tests for win and lose flows using real keyboard input.

## Intentionally Cut

- Opponent AI, multi-lap systems, and advanced VFX.
- Procedural track variation.
- Audio pipeline.

## Verification Outcomes

- `npm install`: pass
- `npm run typecheck`: pass
- `npm run build`: pass
- `npm run test:smoke`: pass
- Smoke assertions verify both win and lose paths through real keyboard input.

## Known Limitations

- Stylized geometry uses primitive shapes only.
- Single level/single mode by design.
- Build emits a large bundle warning due Phaser size.
