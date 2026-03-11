export interface StageConfig {
  stage: number;
  enemyCount: number;
  hazardIntervalMs: number;
  cellsRequired: number;
  timerSeconds: number;
  tint: number;
}

const STAGES: StageConfig[] = [
  { stage: 1, enemyCount: 3, hazardIntervalMs: 2600, cellsRequired: 3, timerSeconds: 80, tint: 0x56729f },
  { stage: 2, enemyCount: 5, hazardIntervalMs: 2000, cellsRequired: 4, timerSeconds: 75, tint: 0x44506b },
  { stage: 3, enemyCount: 7, hazardIntervalMs: 1550, cellsRequired: 5, timerSeconds: 70, tint: 0x3f435a }
];

export function getStageConfig(stage: number): StageConfig {
  return STAGES[Math.min(stage - 1, STAGES.length - 1)];
}

export function isFinalStage(stage: number): boolean {
  return stage >= STAGES.length;
}
