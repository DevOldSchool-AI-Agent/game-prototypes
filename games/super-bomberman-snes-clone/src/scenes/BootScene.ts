import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  public create(): void {
    this.scene.start('game');
  }
}
