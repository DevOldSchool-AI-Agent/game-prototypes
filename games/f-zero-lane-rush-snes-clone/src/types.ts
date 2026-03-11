export type GameMode = 'menu' | 'play' | 'result';
export type ResultState = 'win' | 'lose' | null;

export interface PublicGameState {
  mode: GameMode;
  result: ResultState;
  elapsedMs: number;
  shield: number;
  score: number;
  laneIndex: number;
  objective: string;
}
