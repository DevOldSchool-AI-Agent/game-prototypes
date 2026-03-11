import type { StageConfig } from "../types";

const STAGES: StageConfig[] = [
  {
    id: 1,
    name: "Pallet Sprint",
    timeLimitSeconds: 26,
    pickupPositions: [
      { x: 220, y: 140 },
      { x: 440, y: 170 },
      { x: 680, y: 140 },
      { x: 720, y: 350 },
      { x: 280, y: 360 }
    ],
    trainerSpawns: [
      { x: 500, y: 320, vx: 120, vy: 0 }
    ],
    obstacles: [
      { x: 360, y: 210, width: 190, height: 24 },
      { x: 130, y: 290, width: 150, height: 24 },
      { x: 610, y: 290, width: 200, height: 24 }
    ]
  },
  {
    id: 2,
    name: "Viridian Dash",
    timeLimitSeconds: 22,
    pickupPositions: [
      { x: 170, y: 130 },
      { x: 340, y: 230 },
      { x: 490, y: 150 },
      { x: 640, y: 260 },
      { x: 790, y: 140 },
      { x: 760, y: 400 }
    ],
    trainerSpawns: [
      { x: 220, y: 350, vx: 130, vy: 0 },
      { x: 690, y: 380, vx: -110, vy: 0 }
    ],
    obstacles: [
      { x: 250, y: 180, width: 170, height: 22 },
      { x: 500, y: 210, width: 170, height: 22 },
      { x: 390, y: 330, width: 220, height: 22 },
      { x: 690, y: 320, width: 130, height: 22 }
    ]
  },
  {
    id: 3,
    name: "Cerulean Crisis",
    timeLimitSeconds: 18,
    pickupPositions: [
      { x: 180, y: 120 },
      { x: 300, y: 180 },
      { x: 430, y: 120 },
      { x: 560, y: 180 },
      { x: 700, y: 120 },
      { x: 820, y: 180 },
      { x: 240, y: 395 },
      { x: 460, y: 390 },
      { x: 750, y: 395 }
    ],
    trainerSpawns: [
      { x: 250, y: 255, vx: 160, vy: 0 },
      { x: 500, y: 255, vx: -170, vy: 0 },
      { x: 750, y: 255, vx: 150, vy: 0 }
    ],
    obstacles: [
      { x: 130, y: 220, width: 230, height: 20 },
      { x: 380, y: 220, width: 190, height: 20 },
      { x: 620, y: 220, width: 210, height: 20 },
      { x: 210, y: 320, width: 190, height: 20 },
      { x: 470, y: 320, width: 160, height: 20 },
      { x: 690, y: 320, width: 160, height: 20 }
    ]
  }
];

export class StageSystem {
  getTotalStages(): number {
    return STAGES.length;
  }

  getStage(index: number): StageConfig {
    const stage = STAGES[index];

    if (!stage) {
      throw new Error(`Stage index ${index} is out of range.`);
    }

    return stage;
  }
}
