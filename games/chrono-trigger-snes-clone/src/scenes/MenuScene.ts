import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  public create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x0f1426);

    this.add.text(width * 0.5, height * 0.28, "CHRONO TRIGGER", {
      fontFamily: "Trebuchet MS",
      fontSize: "56px",
      color: "#7ae0ff",
      stroke: "#1b2a4d",
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(width * 0.5, height * 0.39, "TIME SHARD TRIAL", {
      fontFamily: "Trebuchet MS",
      fontSize: "24px",
      color: "#f3f7ff"
    }).setOrigin(0.5);

    this.add.text(width * 0.5, height * 0.60, [
      "Move: Arrow Keys / WASD",
      "Attack Dash: SPACE",
      "Collect all shards and survive across 3 eras",
      "Fullscreen: F",
      "Press ENTER to begin"
    ].join("\n"), {
      align: "center",
      fontFamily: "Trebuchet MS",
      fontSize: "22px",
      color: "#d8e6ff",
      lineSpacing: 8
    }).setOrigin(0.5);

    this.input.keyboard?.once("keydown-ENTER", () => {
      this.scene.start("play", { stageIndex: 0, totalScore: 0 });
    });
  }
}
