# Super Punch-Out!! Inspired Prototype

## Candidate Evaluation

| Inspiration | Mechanic Simplicity (1-5) | Deterministic Testability (1-5) | Asset Simplicity (1-5) | Chance of Polish in One Run (1-5) | Total |
| --- | --- | --- | --- | --- | --- |
| Super Punch-Out!! | 5 | 5 | 5 | 5 | 20 |
| Super Castlevania IV | 3 | 3 | 3 | 2 | 11 |
| Super Mario Kart | 2 | 2 | 2 | 2 | 8 |

Chosen inspiration: **Super Punch-Out!!** (highest total: 20).

## Why This Is Feasible

- Single-screen duel avoids camera, map streaming, and pathfinding.
- One primary action (punch) with two defensive inputs keeps input model simple.
- Deterministic opponent attack pattern supports reliable smoke tests.
- Minimal asset needs: silhouettes, HUD, simple telegraph and hit feedback.

## Original Feel to Preserve

- Read-and-react rhythm between telegraphed attacks and counter punches.
- Punch timing risk/reward: attack during openings, defend during tells.
- Fast restart loop after knockout.

## Scoped Feature Set

- Title screen with controls and objective.
- Single round boxer loop: start -> play -> win/lose -> restart.
- Deterministic opponent attack timeline (high/low attacks).
- Player actions: punch, high dodge, low dodge.
- HUD: player HP, opponent HP, round timer, current state.
- Feedback polish: telegraph glow, hit flash, screen shake on heavy hit, KO overlay.
- Fixed-aspect centered canvas that scales to viewport while preserving ratio.

## Not In Scope

- Multiple opponents or career progression.
- Complex combo systems, stamina systems, or special meters.
- Cutscenes, narration, or dialogue trees.
- Online play or save data.

## Architecture Sketch

### Scenes
- `BootScene`: texture generation and scene registration handoff.
- `TitleScene`: controls + objective display and start prompt.
- `FightScene`: core deterministic gameplay loop.
- `ResultScene`: win/lose message with restart/menu actions.

### Systems
- `FightSystem`: deterministic attack schedule, collision windows, win/lose checks.
- `HudSystem`: updates HP/timer/state labels.

### Entities
- `PlayerBoxer`: position lane, hp, dodge state, attack cooldown.
- `OpponentBoxer`: hp, telegraph state, attack lane, attack timer.

### Input
- `ArrowUp` = high dodge
- `ArrowDown` = low dodge
- `Space` = punch
- `Enter` = start/restart
- `M` = return to title from result

### State Model
- `title` -> `playing` -> `won`/`lost` -> `title` or `playing` restart.
- Deterministic timeline index drives opponent telegraph and strike events.

## Risks and Mitigations

- Risk: combat can feel unreadable if telegraph timing is too short.
  - Mitigation: fixed telegraph duration >= 450ms and color-coded lane cues.
- Risk: smoke tests flake if timing depends on frame jitter.
  - Mitigation: deterministic timeline based on fixed-step accumulated time.
- Risk: restart soft-locks if scene state is not reset cleanly.
  - Mitigation: restart always recreates `FightScene` data model from defaults.

## Measurable Acceptance Criteria

- Human can start, play, win, lose, and restart without debug hooks.
- Controls and objective are always visible on title and in-fight HUD.
- Canvas remains centered and maintains target 16:9 ratio on resize.
- Happy path smoke test reaches `won` state using keyboard input.
- Fail path smoke test reaches `lost` state using keyboard input.
- `npm run typecheck`, `npm run build`, and `npm run test:smoke` all pass.
