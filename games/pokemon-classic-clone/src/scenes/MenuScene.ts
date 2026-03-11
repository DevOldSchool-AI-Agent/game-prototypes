import Phaser from "phaser";
import { updatePublicState } from "../systems/DebugStateReporter";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create(): void {
    this.add.rectangle(480, 270, 960, 540, 0x173049, 1);

    const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "Trebuchet MS",
      fontSize: "56px",
      color: "#ffe18f",
      stroke: "#14253a",
      strokeThickness: 8,
      align: "center"
    };

    const bodyStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "Trebuchet MS",
      fontSize: "26px",
      color: "#f1f7ff",
      align: "center",
      stroke: "#14253a",
      strokeThickness: 4
    };

    this.add.text(480, 140, "POKEMON CLASSIC CLONE", titleStyle).setOrigin(0.5);
    this.add
      .text(
        480,
        255,
        [
          "Collect every Pokeball before time runs out.",
          "Avoid roaming trainers. You have 3 hearts.",
          "Controls: Arrow Keys or WASD",
          "Press SPACE or click to start"
        ].join("\n"),
        bodyStyle
      )
      .setOrigin(0.5);

    const startRun = (): void => {
      this.scene.start("GameScene");
    };

    this.input.keyboard?.once("keydown-SPACE", startRun);
    this.input.once("pointerdown", startRun);

    updatePublicState({ scene: "menu", message: "ready" });
  }
}
