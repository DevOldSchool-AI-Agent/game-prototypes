import Phaser from 'phaser';
import type { PublicGameState } from '../types';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('menu');
  }

  create(): void {
    (window as Window & { __FZERO_LANE_RUSH_STATE__?: PublicGameState }).__FZERO_LANE_RUSH_STATE__ = {
      mode: 'menu',
      result: null,
      elapsedMs: 0,
      shield: 3,
      score: 0,
      laneIndex: 1,
      objective: 'Survive until timer hits 0 while keeping shield above 0.'
    };

    this.add.rectangle(400, 360, 800, 720, 0x081425);
    this.add.text(400, 180, 'F-ZERO: LANE RUSH', {
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '52px',
      color: '#7be6ff'
    }).setOrigin(0.5);

    this.add.text(400, 300, 'Move Lanes: Left/Right or A/D', {
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '26px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 342, 'Objective: survive 11 seconds and avoid traffic', {
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '24px',
      color: '#fff8a6'
    }).setOrigin(0.5);

    this.add.text(400, 510, 'Press Enter to Start', {
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '30px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('play');
    });
  }
}
