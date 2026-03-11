import Phaser from "phaser";
import { updateGameSnapshot } from "../systems/GameStateBridge";

interface ResultData {
  outcome: "won" | "lost";
  score: number;
  kills: number;
  targetKills: number;
}

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("result");
  }

  public create(data: ResultData): void {
    const won = data.outcome === "won";
    this.cameras.main.setBackgroundColor(won ? "#d7ffd9" : "#ffd7d7");

    this.add
      .text(640, 220, won ? "Stage Cleared" : "Out of Focus", {
        fontFamily: "Trebuchet MS",
        fontSize: "78px",
        color: won ? "#0f6424" : "#7f1a16",
        stroke: "#fff9e2",
        strokeThickness: 8
      })
      .setOrigin(0.5);

    this.add
      .text(640, 360, `Kills ${data.kills}/${data.targetKills}   Score ${data.score}`, {
        fontFamily: "Trebuchet MS",
        fontSize: "36px",
        color: "#32200f",
        stroke: "#fff2cf",
        strokeThickness: 6
      })
      .setOrigin(0.5);

    this.add
      .text(640, 485, "Press R to Restart   |   Press Enter for Menu", {
        fontFamily: "Trebuchet MS",
        fontSize: "30px",
        color: "#32200f",
        stroke: "#fff2cf",
        strokeThickness: 6
      })
      .setOrigin(0.5);

    updateGameSnapshot({ mode: data.outcome });

    this.input.keyboard?.once("keydown-R", () => this.scene.start("play"));
    this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("menu"));
  }
}
