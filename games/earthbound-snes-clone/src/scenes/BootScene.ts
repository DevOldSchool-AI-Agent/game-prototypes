import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create(): void {
    const player = this.add.graphics();
    player.fillStyle(0x2c63ff, 1);
    player.fillCircle(16, 16, 14);
    player.lineStyle(3, 0xffffff, 1);
    player.strokeCircle(16, 16, 14);
    player.generateTexture('player', 32, 32);
    player.destroy();

    const enemy = this.add.graphics();
    enemy.fillStyle(0xdb4e5c, 1);
    enemy.fillRoundedRect(2, 2, 28, 28, 8);
    enemy.lineStyle(2, 0x30080d, 1);
    enemy.strokeRoundedRect(2, 2, 28, 28, 8);
    enemy.generateTexture('enemy', 32, 32);
    enemy.destroy();

    const goal = this.add.graphics();
    goal.fillStyle(0x67dd93, 1);
    goal.fillRect(0, 0, 40, 40);
    goal.lineStyle(3, 0x215c35, 1);
    goal.strokeRect(0, 0, 40, 40);
    goal.generateTexture('goal', 40, 40);
    goal.destroy();

    this.scene.start('menu');
  }
}
