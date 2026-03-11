import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('menu');
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x1d1d32);
    const { width, height } = this.scale;

    this.add.text(width / 2, height * 0.3, 'EARTHBOUND\\nVERTICAL SLICE', {
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '54px',
      color: '#fff7d6',
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.56, 'Move: Arrows / WASD\nAttack: Space\nRestart: R', {
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '26px',
      color: '#d8e7ff',
      align: 'center'
    }).setOrigin(0.5);

    const prompt = this.add.text(width / 2, height * 0.8, 'Press Enter to Start', {
      fontFamily: 'Trebuchet MS, Segoe UI, sans-serif',
      fontSize: '30px',
      color: '#98ffbf'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: { from: 1, to: 0.25 },
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
      duration: 650
    });

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('play');
    });
  }
}
