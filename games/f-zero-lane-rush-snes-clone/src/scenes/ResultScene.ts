import Phaser from 'phaser';
import type { ResultState } from '../types';

interface ResultData {
  result: Exclude<ResultState, null>;
  score: number;
}

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('result');
  }

  create(data: ResultData): void {
    const isWin = data.result === 'win';
    this.add.rectangle(400, 360, 800, 720, isWin ? 0x103524 : 0x351020);
    this.add.text(400, 250, isWin ? 'YOU FINISHED THE LAP' : 'CRAFT DESTROYED', {
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '52px',
      color: isWin ? '#8bffb8' : '#ff8ba9',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(400, 360, `Score: ${data.score}`, {
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '30px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 500, 'Press Enter to Restart', {
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '30px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('menu');
    });
  }
}
