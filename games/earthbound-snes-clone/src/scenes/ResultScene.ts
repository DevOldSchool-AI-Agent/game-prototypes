import Phaser from 'phaser';
import type { RunSummary } from '../types';

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('result');
  }

  create(data: RunSummary): void {
    this.cameras.main.setBackgroundColor(data.outcome === 'won' ? 0x15261b : 0x33171c);
    const { width, height } = this.scale;

    const title = data.outcome === 'won' ? 'YOU SAVED THE TOWN' : 'NINTEN IS DOWN';
    const subtitle = data.outcome === 'won' ? 'Victory' : 'Defeat';

    this.add.text(width / 2, height * 0.33, title, {
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '56px',
      color: data.outcome === 'won' ? '#acffd0' : '#ffb0bf',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.5, `${subtitle}\nStages cleared: ${data.clearedStages}/3\nScore: ${data.score}`, {
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '28px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.82, 'Press Enter to restart', {
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '30px',
      color: '#fef0ad'
    }).setOrigin(0.5);

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('menu');
    });
  }
}
