import Phaser from "phaser";
import { setRuntimeState } from "../systems/GameStateSystem";

interface ResultData {
  won: boolean;
  score: number;
  reason: string;
}

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  create(data: ResultData): void {
    setRuntimeState({ scene: "ResultScene", won: data.won });

    this.add.rectangle(480, 270, 960, 540, data.won ? 0x11332a : 0x341923, 0.95);

    this.add.text(480, 180, data.won ? "MISSION SUCCESS" : "MISSION FAILED", {
      fontFamily: "Trebuchet MS",
      fontSize: "54px",
      color: data.won ? "#b9ffd6" : "#ffc3cd",
      stroke: "#07090e",
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(480, 274, data.reason, {
      fontFamily: "Trebuchet MS",
      fontSize: "28px",
      color: "#f5f8ff"
    }).setOrigin(0.5);

    this.add.text(480, 328, `SCORE ${data.score}`, {
      fontFamily: "Trebuchet MS",
      fontSize: "34px",
      color: "#f8e89b"
    }).setOrigin(0.5);

    this.add.text(480, 410, "Press R to restart | Press M for menu", {
      fontFamily: "Trebuchet MS",
      fontSize: "24px",
      color: "#e6efff"
    }).setOrigin(0.5);

    const restart = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    const menu = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.M);

    restart.once("down", () => {
      this.scene.start("PlayScene", { stage: 1, hp: 5, score: 0 });
    });

    menu.once("down", () => {
      this.scene.start("TitleScene");
    });
  }
}
