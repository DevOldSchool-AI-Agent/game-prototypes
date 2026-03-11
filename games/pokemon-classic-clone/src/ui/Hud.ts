import Phaser from "phaser";

type HudState = {
  stage: number;
  totalStages: number;
  stageName: string;
  pickupsRemaining: number;
  hearts: number;
  timeRemaining: number;
};

export class Hud {
  private readonly stageLabel: Phaser.GameObjects.Text;
  private readonly pickupsLabel: Phaser.GameObjects.Text;
  private readonly heartsLabel: Phaser.GameObjects.Text;
  private readonly timerLabel: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "Trebuchet MS",
      fontSize: "22px",
      color: "#f1f7ff",
      stroke: "#15233b",
      strokeThickness: 5
    };

    this.stageLabel = scene.add.text(20, 18, "", style).setDepth(20);
    this.pickupsLabel = scene.add.text(320, 18, "", style).setDepth(20);
    this.heartsLabel = scene.add.text(560, 18, "", style).setDepth(20);
    this.timerLabel = scene.add.text(760, 18, "", style).setDepth(20);
  }

  render(state: HudState): void {
    this.stageLabel.setText(`Stage ${state.stage}/${state.totalStages}: ${state.stageName}`);
    this.pickupsLabel.setText(`Pokeballs: ${state.pickupsRemaining}`);
    this.heartsLabel.setText(`Hearts: ${"<3 ".repeat(Math.max(state.hearts, 0)).trim() || "none"}`);
    this.timerLabel.setText(`Time: ${Math.max(0, state.timeRemaining).toFixed(1)}s`);

    if (state.timeRemaining <= 5) {
      this.timerLabel.setColor("#ff9494");
      this.timerLabel.setScale(1.08);
    } else {
      this.timerLabel.setColor("#f1f7ff");
      this.timerLabel.setScale(1);
    }
  }
}
