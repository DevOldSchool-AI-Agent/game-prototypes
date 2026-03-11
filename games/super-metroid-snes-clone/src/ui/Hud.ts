import Phaser from "phaser";

export class Hud {
  private readonly stageText: Phaser.GameObjects.Text;
  private readonly hpText: Phaser.GameObjects.Text;
  private readonly cellsText: Phaser.GameObjects.Text;
  private readonly timerText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "Trebuchet MS",
      fontSize: "18px",
      color: "#f4f7ff",
      stroke: "#03050a",
      strokeThickness: 4
    };
    this.stageText = scene.add.text(18, 14, "", style).setScrollFactor(0);
    this.hpText = scene.add.text(190, 14, "", style).setScrollFactor(0);
    this.cellsText = scene.add.text(320, 14, "", style).setScrollFactor(0);
    this.timerText = scene.add.text(560, 14, "", style).setScrollFactor(0);
  }

  update(stage: number, hp: number, cells: number, requiredCells: number, timer: number): void {
    this.stageText.setText(`STAGE ${stage}`);
    this.hpText.setText(`HP ${Math.max(0, hp)}`);
    this.cellsText.setText(`CELLS ${cells}/${requiredCells}`);
    this.timerText.setText(`TIMER ${Math.ceil(timer)}s`);
  }
}
