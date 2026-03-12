# Kirby Gourmet Race-Inspired Dash (SNES)

## Chosen inspiration
- **Inspiration:** *Kirby Super Star* (SNES, 1996), specifically the feel of **Gourmet Race**
- **Project slug:** `kirby-gourmet-race-snes-clone`

## Candidate evaluation (repo-aware)
Represented concepts already found in this repo/branch history: Chrono Trigger, EarthBound, Super Metroid, Pokemon, Super Punch-Out!!, F-Zero, Mario Paint, and Super Bomberman-inspired games.

Scoring scale: `1 (worst) -> 5 (best)`.

| Candidate inspiration | Mechanic simplicity | Deterministic testability | Asset simplicity | Chance of polish in one run | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Kirby Super Star (Gourmet Race feel) | 5 | 5 | 5 | 5 | **20** |
| Contra III: The Alien Wars | 3 | 4 | 3 | 3 | 13 |
| Pilotwings | 2 | 3 | 2 | 2 | 9 |

Chosen: **Kirby Super Star (Gourmet Race-inspired arena dash)**.

## Why this is feasible in one run
- Single-screen loop with one dominant action: movement + dash burst for route optimization.
- Deterministic hazard pacing and fixed pickup layout enable reliable smoke tests.
- Minimal asset scope (simple geometric sprites, HUD text, tween feedback).
- Strong classic feel can be conveyed through speed, pickups, and race pressure without level complexity.

## Core mechanics to preserve from original feel
- Fast, arcade-like food collection race pressure.
- Momentum-oriented traversal and short dash bursts.
- Clear “collect more food quickly” objective.
- Immediate reset and replayability.

## Scoped feature set
- Start overlay with objective and control instructions.
- One compact race arena with deterministic food spawn sequence.
- Rival/hazard entity on a deterministic route.
- Player movement + dash action.
- Score goal + timer pressure.
- Win when food target is met; lose on timer expiry or repeated hazard damage.
- Restart flow from win/lose with Enter.

## Not in scope
- Side-scrolling stages or multi-map progression.
- Story sequences/cutscenes.
- Complex AI/pathfinding.
- Power-up inventory systems.
- Multiplayer modes.

## Architecture sketch

### Scenes
- `BootScene`: setup and transition to gameplay.
- `GameScene`: owns the full loop (`start -> play -> win/lose -> restart`) and overlays.

### Systems
- `MovementSystem`: tile-safe movement and dash cooldown handling.
- `SpawnSystem`: deterministic pickup activation order.
- `HazardSystem`: fixed-route hazard movement and contact damage cadence.
- `StateSystem`: manages mode transitions and restart behavior.

### Entities
- Player racer.
- Rival hazard.
- Food pickups.
- HUD/overlay elements.

### Input
- `Arrow`/`WASD`: movement.
- `Space`: dash.
- `Enter`: start/restart.

### State model
- Single in-scene state object:
  - `mode: start | play | win | lose`
  - `score`
  - `foodTarget`
  - `timeLeftMs`
  - `playerHp`
  - `dashReady`
  - `activePickupIds`

## Risks and mitigations
- **Risk:** Dash could feel slippery or unfair.
  - **Mitigation:** short fixed dash duration, clear cooldown HUD cue, clamp speed.
- **Risk:** Hazard contact feels random.
  - **Mitigation:** deterministic route, contact i-frame window, visible hit flash.
- **Risk:** Smoke test flakiness.
  - **Mitigation:** fixed pickup order and timing constants; no random seeds at runtime.
- **Risk:** Scope creep.
  - **Mitigation:** one arena, one hazard type, one win objective.

## Measurable acceptance criteria
- Full human-playable loop works: `start -> play -> win/lose -> restart`.
- On-screen controls and objective are always visible.
- Fixed-aspect centered canvas scales to available viewport while preserving ratio.
- No soft-locks after win/lose; restart always available.
- Deterministic smoke tests pass:
  - Happy path reaches win via real input flow.
  - Fail path reaches lose via real input flow.
- `npm install`, `npm run typecheck`, `npm run build`, and `npm run test:smoke` all pass.
- Runtime/console error count is zero in verification runs.

## Delivery note
- This design was chosen and documented before branch creation so the branch and folder slug match: `kirby-gourmet-race-snes-clone`.
