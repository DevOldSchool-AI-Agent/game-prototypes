export type GameMode = "menu" | "playing" | "won" | "lost";

export interface GameSnapshot {
  mode: GameMode;
  timer: number;
  kills: number;
  targetKills: number;
  focus: number;
  score: number;
  swatter: { x: number; y: number };
  gnats: Array<{ id: number; x: number; y: number; alive: boolean }>;
  pickups: Array<{ id: number; x: number; y: number; active: boolean }>;
  objective: string;
  controls: string;
}

const snapshot: GameSnapshot = {
  mode: "menu",
  timer: 0,
  kills: 0,
  targetKills: 0,
  focus: 0,
  score: 0,
  swatter: { x: 0, y: 0 },
  gnats: [],
  pickups: [],
  objective: "Swat gnats before time runs out.",
  controls: "Move: Arrows/WASD | Swat: Space"
};

export function updateGameSnapshot(next: Partial<GameSnapshot>): void {
  Object.assign(snapshot, next);
}

export function getGameSnapshot(): GameSnapshot {
  return {
    ...snapshot,
    swatter: { ...snapshot.swatter },
    gnats: snapshot.gnats.map((gnat) => ({ ...gnat })),
    pickups: snapshot.pickups.map((pickup) => ({ ...pickup }))
  };
}
