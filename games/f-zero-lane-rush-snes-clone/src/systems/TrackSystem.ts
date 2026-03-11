export interface SpawnEvent {
  timeMs: number;
  laneIndex: number;
  kind: 'hazard' | 'pickup';
}

const LANE_X = [240, 400, 560] as const;
const TRACK_TOP_Y = -60;
const TRACK_BOTTOM_Y = 740;

const SPAWN_SEQUENCE: SpawnEvent[] = [
  { timeMs: 1200, laneIndex: 1, kind: 'hazard' },
  { timeMs: 1800, laneIndex: 2, kind: 'pickup' },
  { timeMs: 2200, laneIndex: 1, kind: 'hazard' },
  { timeMs: 3000, laneIndex: 0, kind: 'pickup' },
  { timeMs: 3200, laneIndex: 1, kind: 'hazard' },
  { timeMs: 4300, laneIndex: 0, kind: 'hazard' },
  { timeMs: 5200, laneIndex: 1, kind: 'pickup' },
  { timeMs: 5400, laneIndex: 2, kind: 'hazard' },
  { timeMs: 6500, laneIndex: 0, kind: 'hazard' },
  { timeMs: 7600, laneIndex: 2, kind: 'hazard' },
  { timeMs: 8500, laneIndex: 0, kind: 'pickup' },
  { timeMs: 8700, laneIndex: 1, kind: 'hazard' },
  { timeMs: 9800, laneIndex: 2, kind: 'hazard' }
];

export class TrackSystem {
  private nextSpawnIndex = 0;

  reset(): void {
    this.nextSpawnIndex = 0;
  }

  pollDueSpawns(elapsedMs: number): SpawnEvent[] {
    const due: SpawnEvent[] = [];
    while (this.nextSpawnIndex < SPAWN_SEQUENCE.length) {
      const candidate = SPAWN_SEQUENCE[this.nextSpawnIndex];
      if (candidate.timeMs > elapsedMs) {
        break;
      }
      due.push(candidate);
      this.nextSpawnIndex += 1;
    }
    return due;
  }

  laneX(laneIndex: number): number {
    return LANE_X[Math.max(0, Math.min(LANE_X.length - 1, laneIndex))];
  }

  laneCount(): number {
    return LANE_X.length;
  }

  get trackTopY(): number {
    return TRACK_TOP_Y;
  }

  get trackBottomY(): number {
    return TRACK_BOTTOM_Y;
  }

  get winTimeMs(): number {
    return 11_000;
  }

  get objectiveText(): string {
    return 'Survive until timer hits 0 while keeping shield above 0.';
  }
}
