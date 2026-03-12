export type Lane = "high" | "low";

export interface PlayerState {
  hp: number;
  dodgeLane: Lane | null;
  dodgeUntil: number;
  attackCooldownUntil: number;
  hurtFlashUntil: number;
}

export interface OpponentState {
  hp: number;
  phase: "idle" | "telegraph" | "strike" | "open";
  lane: Lane;
  telegraphEnd: number;
  strikeEnd: number;
  openEnd: number;
  flashUntil: number;
}
