import Phaser from 'phaser';

export class UiSystem {
  private readonly stageText: Phaser.GameObjects.Text;
  private readonly hpText: Phaser.GameObjects.Text;
  private readonly quotaText: Phaser.GameObjects.Text;
  private readonly timeText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const panel = scene.add.rectangle(12, 12, 470, 58, 0x171728, 0.86).setOrigin(0, 0).setDepth(20);
    panel.setStrokeStyle(2, 0xd0e0ff, 0.8);

    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#f7fbff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '18px'
    };

    this.stageText = scene.add.text(24, 20, '', style).setDepth(21);
    this.hpText = scene.add.text(180, 20, '', style).setDepth(21);
    this.quotaText = scene.add.text(265, 20, '', style).setDepth(21);
    this.timeText = scene.add.text(392, 20, '', style).setDepth(21);
  }

  update(stageName: string, hp: number, quotaRemaining: number, timeLeft: number): void {
    this.stageText.setText(`Stage: ${stageName}`);
    this.hpText.setText(`HP: ${hp}`);
    this.quotaText.setText(`Left: ${quotaRemaining}`);
    this.timeText.setText(`Time: ${Math.ceil(timeLeft)}`);
  }
}
