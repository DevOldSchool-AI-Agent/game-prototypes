## Summary
- Add `games/super-metroid-snes-clone` as a new Phaser + TypeScript SNES vertical slice.
- Include planning docs (`README.md`, `KANBAN.md`) before coding.
- Implement full loop: title -> play -> win/lose -> restart/menu with stage progression.
- Add Playwright smoke tests and QA evidence logging.
- Complete quality pass with visual polish and PlayScene refactor.

## Testing
- `npm install`
- `npm run typecheck`
- `npm run build`
- `npm run test:smoke`

## Risks
- Phaser bundle size remains large (build warning only, no runtime impact).
- Gameplay is tuned for deterministic smoke coverage, not feature completeness.

## Rollback
- Revert this PR to remove `games/super-metroid-snes-clone` entirely.

## Secret Scan
- Passed via `commit_changes.sh` gate before commit.
