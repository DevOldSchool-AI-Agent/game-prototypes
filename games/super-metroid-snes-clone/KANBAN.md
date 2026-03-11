# Kanban

## Backlog
- None.

## In Progress
- Card: Final delivery + PR
  - Goal: run secret-scanned commit workflow and open PR to `main` with automation label.
  - Files touched: repo metadata, `PR_BODY.md`.
  - Verification command: `/Users/troy/.codex/skills/git-branch-commit-pr/scripts/commit_changes.sh -m "feat: add super metroid snes clone vertical slice" && /Users/troy/.codex/skills/git-branch-commit-pr/scripts/create_pr.sh -t "feat: add super metroid snes clone vertical slice" -B /Users/troy/Development/web/game-prototypes/PR_BODY.md`
  - Done criteria: commit SHA recorded, PR URL recorded, secret scan pass confirmed.

## Done
- Card: Plan, scaffold, implement playable vertical slice, and quality-gate
  - Goal: ship a complete browser-playable Super Metroid-inspired loop with TypeScript + Phaser and smoke automation.
  - Files touched: `games/super-metroid-snes-clone/*`
  - Verification command: `npm run typecheck && npm run build && npm run test:smoke`
  - Done criteria: all checks pass, zero console/runtime errors, QA evidence captured.

## Blocked
- None.
