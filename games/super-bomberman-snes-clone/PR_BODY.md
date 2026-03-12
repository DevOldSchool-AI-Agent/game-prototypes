## Summary
- add new polished Phaser + TypeScript game: `super-bomberman-snes-clone`
- implement deterministic Bomberman-inspired core loop: start -> play -> win/lose -> restart
- add deterministic Playwright smoke tests for win and lose paths via real keyboard input
- run 5 explicit polish iterations with QA logging and final progress summary

## Testing
- `npm run typecheck`
- `npm run build`
- `npm run test:smoke`

## Risks / Rollback
- Risk: smoke tests depend on local Playwright browser availability.
- Rollback: remove `games/super-bomberman-snes-clone/` folder or revert this commit.

## Secret Scan
- Secret scan gate executed via `commit_changes.sh` before commit.
- No secrets detected in staged files.
