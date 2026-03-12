import type { Mode } from '../entities/types';

export class Hud {
  private readonly panelTop: Phaser.GameObjects.Rectangle;
  private readonly panelBottom: Phaser.GameObjects.Rectangle;
  private readonly objectiveText: Phaser.GameObjects.Text;
  private readonly controlsText: Phaser.GameObjects.Text;
  private readonly statusText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.panelTop = scene.add
      .rectangle(208, 16, 400, 24, 0x000000, 0.48)
      .setDepth(2);
    this.panelBottom = scene.add
      .rectangle(208, 48, 400, 24, 0x000000, 0.44)
      .setDepth(2);

    this.objectiveText = scene.add.text(10, 8, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#f0f6ff'
    }).setDepth(3);

    this.controlsText = scene.add.text(10, 28, 'Move: Arrows/WASD  Bomb: Space  Start/Restart: Enter', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#d3e1ff'
    }).setDepth(3);

    this.statusText = scene.add.text(10, 48, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffe57a'
    }).setDepth(3);
  }

  public update(mode: Mode, enemiesLeft: number, score: number): void {
    this.objectiveText.setText(`Objective: Defeat all sentry bots (${enemiesLeft} left)  Score ${score}`);

    if (mode === 'start') {
      this.statusText.setText('Press Enter to begin.');
      this.statusText.setColor('#ffe57a');
    } else if (mode === 'play') {
      this.statusText.setText('Place a bomb next to bots, then step away before detonation.');
      this.statusText.setColor('#b7f4ff');
    } else if (mode === 'win') {
      this.statusText.setText('YOU WIN. Press Enter to restart.');
      this.statusText.setColor('#8dff9c');
    } else {
      this.statusText.setText('YOU LOSE. Press Enter to restart.');
      this.statusText.setColor('#ff9f9f');
    }
  }
}
