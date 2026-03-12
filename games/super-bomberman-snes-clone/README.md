# Super Bomberman-Inspired Arena (SNES)

## Chosen inspiration
- **Inspiration:** *Super Bomberman* (SNES, 1993)
- **Project slug:** `super-bomberman-snes-clone`

## Candidate evaluation (repo-aware)
Represented in this repo/worktree analysis already: Chrono Trigger, EarthBound, Super Metroid, and branch evidence for Pokemon-inspired clone work.

Scoring scale: `1 (worst) -> 5 (best)`.

| Candidate inspiration | Mechanic simplicity | Deterministic testability | Asset simplicity | Chance of polish in one run | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Super Bomberman (SNES) | 5 | 5 | 4 | 5 | **19** |
| Super Punch-Out!! (SNES) | 3 | 4 | 3 | 3 | 13 |
| F-Zero (SNES) | 2 | 3 | 2 | 2 | 9 |

Chosen: **Super Bomberman** (highest total score).

## Why this is feasible in one run
- Single-screen arena loop with one core action (place bomb).
- Deterministic enemy movement and fixed map allow reliable smoke testing.
- Minimal sprite needs: player, enemies, walls, crates, bombs, blast tiles, HUD text.
- Core fantasy is preserved without complex systems (no inventory, no narrative).

## Core mechanics to preserve
- Grid-like movement in a compact arena.
- Bomb placement with delayed cross-shaped explosion.
- Blast destroys breakable crates and defeats enemies.
- Player dies from blast/enemy contact.
- Clear all enemies to win.

## Scoped feature set
- Start screen with controls and objective.
- Main play scene with deterministic map and enemy patterns.
- Win/lose overlay and restart action.
- One bomb at a time (simple tactical loop).
- Score/time + enemy count HUD.
- Simple hit flash/tween feedback and transition effects.
- Deterministic state export for smoke tests.

## Not in scope
- Procedural levels or multiple stages.
- Power-up progression tree.
- Multiplayer or AI pathfinding.
- Narrative/cutscenes.
- Complex inventory/equipment systems.

## Architecture sketch

### Scenes
- `BootScene`: preload generated/simple assets, initialize deterministic seed/config.
- `GameScene`: owns full gameplay loop and HUD.
- `Overlay handling`: in-scene UI layers for start, win, and lose states.

### Systems
- `GridSystem`: grid-to-world mapping and occupancy queries.
- `BombSystem`: bomb timers, explosion propagation, blast lifetime.
- `EnemySystem`: deterministic patrol behaviors on fixed routes.
- `CollisionSystem`: player/enemy/blast/contact resolution.
- `GameStateSystem`: loop state transitions (`start`, `play`, `win`, `lose`).

### Entities
- Player
- Enemy (simple patroller)
- Solid wall
- Breakable crate
- Bomb
- Explosion segment

### Input
- Keyboard arrows/WASD for movement.
- Space to place bomb.
- Enter to start/restart.

### State model
- Single authoritative state object in `GameScene`:
  - `mode`, `timerMs`, `score`, `enemiesRemaining`, `playerAlive`, `objectiveComplete`
- Deterministic map + enemy route data as constants.

## Risks and mitigations
- **Risk:** Explosion timing feels unfair.
  - **Mitigation:** telegraph with bomb pulse + consistent fuse duration.
- **Risk:** Grid collision jitter.
  - **Mitigation:** snap movement to tile centers with strict speed cap.
- **Risk:** Smoke test flakiness.
  - **Mitigation:** fixed map, fixed enemy routes, fixed timing constants, no random spawn.
- **Risk:** Scope creep during polish loop.
  - **Mitigation:** one improvement goal per iteration and strict gate checks.

## Measurable acceptance criteria
- Human can complete full loop: `start -> play -> win/lose -> restart`.
- Controls and objective are always visible on-screen.
- Canvas remains centered, fixed aspect ratio preserved while filling available area.
- At least 2 deterministic smoke tests pass:
  - Happy path reaches win through real input.
  - Fail path reaches lose through real input.
- `npm install`, `npm run typecheck`, `npm run build`, `npm run test:smoke` all pass.
- Runtime and console errors remain zero in verification runs.
