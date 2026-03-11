import Phaser from "phaser";

type HudPayload = {
  stageLabel: string;
  hp: number;
  shards: number;
  objectiveShards: number;
  timerSeconds: number;
  enemies: number;
};

export class Hud {
  private readonly text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.text = scene.add.text(14, 10, "", {
      color: "#f4f2de",
      fontFamily: "Trebuchet MS",
      fontSize: "18px",
      stroke: "#101420",
      strokeThickness: 3
    });
    this.text.setDepth(40);
    this.text.setScrollFactor(0);
  }

  public render(payload: HudPayload): void {
    this.text.setText(
      [
        `${payload.stageLabel}  HP:${payload.hp}`,
        `Shards ${payload.shards}/${payload.objectiveShards}  Enemies:${payload.enemies}`,
        `Time ${payload.timerSeconds.toFixed(1)}  Attack: SPACE`
      ].join("\n")
    );
  }
}
