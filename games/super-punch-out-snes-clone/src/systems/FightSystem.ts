import type Phaser from "phaser";
import type { Lane, OpponentState, PlayerState } from "../entities/FighterModels";

export interface FightSnapshot {
  mode: "title" | "playing" | "won" | "lost";
  objective: string;
  playerHp: number;
  opponentHp: number;
  timerSeconds: number;
  phase: OpponentState["phase"];
  telegraphLane: Lane;
  dodgeLane: Lane | null;
}

const PLAYER_MAX_HP = 5;
const OPPONENT_MAX_HP = 6;
const ROUND_DURATION_MS = 50000;
const TELEGRAPH_MS = 500;
const STRIKE_MS = 250;
const OPEN_MS = 650;
const DODGE_MS = 380;
const PUNCH_COOLDOWN_MS = 380;
const STRIKE_DAMAGE = 1;
const PUNCH_DAMAGE = 1;

const ATTACK_PATTERN: Lane[] = ["high", "low", "high", "high", "low", "high", "low", "low"];

export class FightSystem {
  private readonly scene: Phaser.Scene;
  private readonly player: PlayerState;
  private readonly opponent: OpponentState;
  private mode: "playing" | "won" | "lost" = "playing";
  private elapsedMs = 0;
  private nextAttackMs = 1200;
  private attackIndex = 0;
  private shakeUntil = 0;
  private readonly objective = "Knock out the rival before time runs out.";

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.player = {
      hp: PLAYER_MAX_HP,
      dodgeLane: null,
      dodgeUntil: 0,
      attackCooldownUntil: 0,
      hurtFlashUntil: 0
    };
    this.opponent = {
      hp: OPPONENT_MAX_HP,
      phase: "idle",
      lane: ATTACK_PATTERN[0],
      telegraphEnd: 0,
      strikeEnd: 0,
      openEnd: 0,
      flashUntil: 0
    };
  }

  public update(deltaMs: number): void {
    if (this.mode !== "playing") {
      return;
    }

    this.elapsedMs += deltaMs;

    if (this.player.dodgeLane && this.elapsedMs >= this.player.dodgeUntil) {
      this.player.dodgeLane = null;
    }

    this.resolveOpponentState();
    this.checkEndConditions();

    if (this.elapsedMs < this.shakeUntil) {
      this.scene.cameras.main.setLerp(0.35, 0.35);
      this.scene.cameras.main.shake(80, 0.0035, true);
    }
  }

  public dodge(lane: Lane): void {
    if (this.mode !== "playing") {
      return;
    }
    this.player.dodgeLane = lane;
    this.player.dodgeUntil = this.elapsedMs + DODGE_MS;
  }

  public punch(): { landed: boolean; blocked: boolean } {
    if (this.mode !== "playing") {
      return { landed: false, blocked: false };
    }

    if (this.elapsedMs < this.player.attackCooldownUntil) {
      return { landed: false, blocked: false };
    }

    this.player.attackCooldownUntil = this.elapsedMs + PUNCH_COOLDOWN_MS;

    if (this.opponent.phase === "open" && this.elapsedMs <= this.opponent.openEnd) {
      this.opponent.hp = Math.max(0, this.opponent.hp - PUNCH_DAMAGE);
      this.opponent.flashUntil = this.elapsedMs + 140;
      return { landed: true, blocked: false };
    }

    return { landed: false, blocked: true };
  }

  public getMode(): "playing" | "won" | "lost" {
    return this.mode;
  }

  public getSnapshot(): FightSnapshot {
    const timeLeft = Math.max(0, ROUND_DURATION_MS - this.elapsedMs);
    return {
      mode: this.mode,
      objective: this.objective,
      playerHp: this.player.hp,
      opponentHp: this.opponent.hp,
      timerSeconds: Math.ceil(timeLeft / 1000),
      phase: this.opponent.phase,
      telegraphLane: this.opponent.lane,
      dodgeLane: this.player.dodgeLane
    };
  }

  public isPlayerFlashActive(): boolean {
    return this.elapsedMs < this.player.hurtFlashUntil;
  }

  public isOpponentFlashActive(): boolean {
    return this.elapsedMs < this.opponent.flashUntil;
  }

  private resolveOpponentState(): void {
    if (this.opponent.phase === "idle" && this.elapsedMs >= this.nextAttackMs) {
      this.startTelegraph();
      return;
    }

    if (this.opponent.phase === "telegraph" && this.elapsedMs >= this.opponent.telegraphEnd) {
      this.startStrike();
      return;
    }

    if (this.opponent.phase === "strike" && this.elapsedMs >= this.opponent.strikeEnd) {
      this.finishStrike();
      return;
    }

    if (this.opponent.phase === "open" && this.elapsedMs >= this.opponent.openEnd) {
      this.opponent.phase = "idle";
      this.nextAttackMs = this.elapsedMs + 900;
    }
  }

  private startTelegraph(): void {
    this.opponent.lane = ATTACK_PATTERN[this.attackIndex % ATTACK_PATTERN.length];
    this.opponent.phase = "telegraph";
    this.opponent.telegraphEnd = this.elapsedMs + TELEGRAPH_MS;
    this.attackIndex += 1;
  }

  private startStrike(): void {
    this.opponent.phase = "strike";
    this.opponent.strikeEnd = this.elapsedMs + STRIKE_MS;
  }

  private finishStrike(): void {
    const dodgeSuccess = this.player.dodgeLane === this.opponent.lane;

    if (dodgeSuccess) {
      this.opponent.phase = "open";
      this.opponent.openEnd = this.elapsedMs + OPEN_MS;
      return;
    }

    this.player.hp = Math.max(0, this.player.hp - STRIKE_DAMAGE);
    this.player.hurtFlashUntil = this.elapsedMs + 220;
    this.shakeUntil = this.elapsedMs + 140;
    this.opponent.phase = "idle";
    this.nextAttackMs = this.elapsedMs + 600;
  }

  private checkEndConditions(): void {
    if (this.opponent.hp <= 0) {
      this.mode = "won";
      return;
    }

    const timedOut = this.elapsedMs >= ROUND_DURATION_MS;
    if (this.player.hp <= 0 || timedOut) {
      this.mode = "lost";
    }
  }
}
