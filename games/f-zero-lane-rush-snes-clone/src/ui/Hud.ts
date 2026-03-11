import Phaser from 'phaser';

interface HudState {
  shield: number;
  score: number;
  timeRemainingSec: number;
  objective: string;
  feedback: string;
}

export class Hud {
  private readonly shieldText: Phaser.GameObjects.Text;
  private readonly scoreText: Phaser.GameObjects.Text;
  private readonly timerText: Phaser.GameObjects.Text;
  private readonly objectiveText: Phaser.GameObjects.Text;
  private readonly feedbackText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const style = {
      color: '#f4f8ff',
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '20px'
    };

    this.shieldText = scene.add.text(20, 16, '', style);
    this.scoreText = scene.add.text(20, 44, '', style);
    this.timerText = scene.add.text(620, 16, '', { ...style, align: 'right' }).setOrigin(1, 0);
    this.objectiveText = scene.add.text(20, 688, '', {
      ...style,
      color: '#fff8a6',
      fontSize: '18px'
    });
    this.feedbackText = scene.add
      .text(320, 84, '', {
        ...style,
        color: '#ffffff',
        fontSize: '26px'
      })
      .setOrigin(0.5, 0)
      .setAlpha(0);
  }

  update(state: HudState): void {
    this.shieldText.setText(`Shield: ${state.shield}`);
    this.scoreText.setText(`Score: ${state.score}`);
    this.timerText.setText(`Time: ${state.timeRemainingSec}`);
    this.objectiveText.setText(`Objective: ${state.objective}`);

    if (state.feedback.length > 0) {
      this.feedbackText.setText(state.feedback);
      this.feedbackText.setAlpha(1);
      this.feedbackText.setScale(0.9);
      this.feedbackText.scene.tweens.add({
        targets: this.feedbackText,
        alpha: 0,
        scale: 1.1,
        duration: 320,
        ease: 'Cubic.Out'
      });
    }
  }
}
