import Phaser from "phaser";

interface HudValues {
  timeLeft: number;
  kills: number;
  targetKills: number;
  focus: number;
  score: number;
}

export class Hud {
  private readonly statusText: Phaser.GameObjects.Text;
  private readonly objectiveText: Phaser.GameObjects.Text;
  private readonly controlsText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.statusText = scene.add
      .text(36, 22, "", {
        fontFamily: "Trebuchet MS",
        fontSize: "26px",
        color: "#1f1410",
        stroke: "#fff9df",
        strokeThickness: 4
      })
      .setDepth(20);

    this.objectiveText = scene.add
      .text(36, 654, "Objective: Swat 4 gnats before time runs out.", {
        fontFamily: "Trebuchet MS",
        fontSize: "24px",
        color: "#321807",
        stroke: "#ffefc4",
        strokeThickness: 4
      })
      .setDepth(20);

    this.controlsText = scene.add
      .text(790, 654, "Move: Arrows/WASD  |  Swat: Space", {
        fontFamily: "Trebuchet MS",
        fontSize: "22px",
        color: "#321807",
        stroke: "#ffefc4",
        strokeThickness: 4
      })
      .setDepth(20)
      .setOrigin(0, 0);
  }

  public set(values: HudValues): void {
    this.statusText.setText(
      `Time ${values.timeLeft.toFixed(1)}s   Kills ${values.kills}/${values.targetKills}   Focus ${values.focus}   Score ${values.score}`
    );
  }

  public destroy(): void {
    this.statusText.destroy();
    this.objectiveText.destroy();
    this.controlsText.destroy();
  }
}
