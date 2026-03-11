import Phaser from "phaser";
import { updateGameSnapshot } from "../systems/GameStateBridge";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  public create(): void {
    this.cameras.main.setBackgroundColor("#f2d398");

    this.add
      .text(640, 170, "Mario Paint: Gnat Attack Clone", {
        fontFamily: "Trebuchet MS",
        fontSize: "58px",
        color: "#2e1608",
        stroke: "#fff2d5",
        strokeThickness: 8,
        align: "center"
      })
      .setOrigin(0.5);

    this.add
      .text(
        640,
        340,
        "Objective: Swat 4 gnats before 18 seconds run out.\nAvoid wasting swats: each miss costs 1 Focus.\nCollect paint drops from defeated gnats for bonus score.",
        {
          fontFamily: "Trebuchet MS",
          fontSize: "30px",
          color: "#3f1f0a",
          stroke: "#ffefc5",
          strokeThickness: 6,
          align: "center",
          lineSpacing: 10
        }
      )
      .setOrigin(0.5);

    this.add
      .text(640, 530, "Move: Arrows/WASD   |   Swat: Space   |   Fullscreen: F", {
        fontFamily: "Trebuchet MS",
        fontSize: "26px",
        color: "#3f1f0a",
        stroke: "#ffefc5",
        strokeThickness: 5
      })
      .setOrigin(0.5);

    this.add
      .text(640, 615, "Press Enter to Start", {
        fontFamily: "Trebuchet MS",
        fontSize: "40px",
        color: "#5a2205",
        stroke: "#ffe7c2",
        strokeThickness: 6
      })
      .setOrigin(0.5)
      .setAlpha(0.95)
      .setData("pulse", true);

    this.tweens.add({
      targets: this.children.list[this.children.length - 1],
      alpha: 0.35,
      duration: 520,
      yoyo: true,
      repeat: -1
    });

    updateGameSnapshot({
      mode: "menu",
      timer: 18,
      kills: 0,
      targetKills: 4,
      focus: 8,
      score: 0,
      objective: "Swat 4 gnats before timer reaches 0.",
      controls: "Move: Arrows/WASD | Swat: Space",
      swatter: { x: 640, y: 360 },
      gnats: [],
      pickups: []
    });

    this.input.keyboard?.once("keydown-ENTER", () => {
      this.scene.start("play");
    });
  }
}
