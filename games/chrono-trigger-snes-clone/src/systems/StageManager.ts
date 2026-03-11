export type StageConfig = {
  name: string;
  objectiveShards: number;
  enemyCount: number;
  enemySpeedScale: number;
  timerSeconds: number;
  paletteTop: number;
  paletteBottom: number;
};

const STAGES: StageConfig[] = [
  {
    name: "Prehistory",
    objectiveShards: 4,
    enemyCount: 3,
    enemySpeedScale: 0.95,
    timerSeconds: 42,
    paletteTop: 0x4b7046,
    paletteBottom: 0x1a2f1d
  },
  {
    name: "Middle Ages",
    objectiveShards: 5,
    enemyCount: 4,
    enemySpeedScale: 1.05,
    timerSeconds: 40,
    paletteTop: 0x5b6076,
    paletteBottom: 0x23273e
  },
  {
    name: "Future Dome",
    objectiveShards: 6,
    enemyCount: 5,
    enemySpeedScale: 1.2,
    timerSeconds: 38,
    paletteTop: 0x3a5468,
    paletteBottom: 0x101f2f
  }
];

export class StageManager {
  public static stageCount(): number {
    return STAGES.length;
  }

  public static getStage(index: number): StageConfig {
    return STAGES[Math.max(0, Math.min(index, STAGES.length - 1))];
  }
}
