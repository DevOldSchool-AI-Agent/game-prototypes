import Phaser from "phaser";
import type { GameOutcome } from "../types";
import { updatePublicState } from "../systems/DebugStateReporter";

type ResultPayload = {
  outcome: GameOutcome;
  completedStages: number;
  totalStages: number;
  finalHearts: number;
};

export class ResultScene extends Phaser.Scene {
  private payload!: ResultPayload;

  constructor() {
    super("ResultScene");
  }

  init(data: ResultPayload): void {
    this.payload = data;
  }

  create(): void {
    const isWin = this.payload.outcome === "win";
    this.add.rectangle(480, 270, 960, 540, isWin ? 0x1a4a2a : 0x4a1d1d, 1);

    const headline = isWin ? "Champion Run Complete!" : "Run Failed";
    const detail = [
      `Outcome: ${this.payload.outcome.toUpperCase()}`,
      `Stages cleared: ${this.payload.completedStages}/${this.payload.totalStages}`,
      `Hearts remaining: ${this.payload.finalHearts}`,
      "",
      "Press R to restart",
      "Press M for menu"
    ].join("\n");

    this.add
      .text(480, 175, headline, {
        fontFamily: "Trebuchet MS",
        fontSize: "56px",
        color: "#fff2b3",
        stroke: "#1a1a1a",
        strokeThickness: 7
      })
      .setOrigin(0.5);

    this.add
      .text(480, 320, detail, {
        fontFamily: "Trebuchet MS",
        fontSize: "28px",
        color: "#f7fbff",
        align: "center",
        stroke: "#1a1a1a",
        strokeThickness: 4
      })
      .setOrigin(0.5);

    this.input.keyboard?.once("keydown-R", () => {
      this.scene.start("GameScene");
    });

    this.input.keyboard?.once("keydown-M", () => {
      this.scene.start("MenuScene");
    });

    this.input.once("pointerdown", () => {
      this.scene.start("GameScene");
    });

    updatePublicState({
      scene: "result",
      outcome: this.payload.outcome,
      message: headline,
      hearts: this.payload.finalHearts,
      stage: this.payload.completedStages,
      totalStages: this.payload.totalStages
    });
  }
}
