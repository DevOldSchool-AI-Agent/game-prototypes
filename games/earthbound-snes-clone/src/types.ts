export type RunOutcome = 'won' | 'lost';

export interface StageConfig {
  id: number;
  name: string;
  enemyQuota: number;
  timeLimitSec: number;
  enemySpeed: number;
  palette: {
    bgTop: number;
    bgBottom: number;
    ground: number;
    accent: number;
  };
}

export interface RunSummary {
  outcome: RunOutcome;
  clearedStages: number;
  score: number;
}
