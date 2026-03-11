export type GameOutcome = "win" | "lose";

export type PublicGameState = {
  scene: "boot" | "menu" | "play" | "result";
  stage?: number;
  stageName?: string;
  totalStages?: number;
  pickupsRemaining?: number;
  hearts?: number;
  timeRemaining?: number;
  outcome?: GameOutcome;
  message?: string;
};

export type RectangleSpec = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SpawnSpec = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export type StageConfig = {
  id: number;
  name: string;
  timeLimitSeconds: number;
  pickupPositions: Array<{ x: number; y: number }>;
  trainerSpawns: SpawnSpec[];
  obstacles: RectangleSpec[];
};

declare global {
  interface Window {
    __pokemonCloneState?: PublicGameState;
    __pokemonQa?: {
      forceCollectStage: () => void;
      forceLose: () => void;
    };
    render_game_to_text?: () => string;
  }
}
