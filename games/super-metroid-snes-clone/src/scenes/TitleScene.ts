import Phaser from "phaser";
import { runtimeState, setRuntimeState } from "../systems/GameStateSystem";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create(): void {
    setRuntimeState({ scene: "TitleScene", stage: 1, won: false, hp: 5, timer: 75 });
    this.add.rectangle(480, 270, 960, 540, 0x0d1424, 0.92);
    this.add.text(480, 190, "SUPER METROID", {
      fontFamily: "Trebuchet MS",
      fontSize: "56px",
      color: "#cce6ff",
      stroke: "#04070d",
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(480, 270, "Vertical Slice Mission", {
      fontFamily: "Trebuchet MS",
      fontSize: "28px",
      color: "#86adcf"
    }).setOrigin(0.5);

    this.add.text(480, 350, "Arrow keys move, Space jump, Enter shoot", {
      fontFamily: "Trebuchet MS",
      fontSize: "24px",
      color: "#e5f4ff"
    }).setOrigin(0.5);

    this.add.text(480, 410, "Press ENTER to deploy", {
      fontFamily: "Trebuchet MS",
      fontSize: "30px",
      color: "#ffe49e"
    }).setOrigin(0.5);

    const startRun = (): void => {
      this.scene.start("PlayScene", { stage: 1, hp: 5, score: 0 });
    };

    this.input.keyboard?.once("keydown-ENTER", startRun);
    window.gameTestApi = {
      getState: () => ({ ...runtimeState }),
      start: startRun,
      forceWin: () => this.scene.start("ResultScene", { won: true, score: 999, reason: "Forced win" }),
      forceLose: () => this.scene.start("ResultScene", { won: false, score: 0, reason: "Forced lose" }),
      restart: startRun
    };
  }
}
