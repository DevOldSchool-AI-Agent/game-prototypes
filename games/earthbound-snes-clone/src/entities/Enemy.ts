import Phaser from 'phaser';
import { Player } from './Player';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(4);
  }

  steerToPlayer(player: Player, speed: number): void {
    const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y);
    direction.normalize().scale(speed);
    this.setVelocity(direction.x, direction.y);
  }
}
