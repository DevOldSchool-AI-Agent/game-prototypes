import Phaser from 'phaser';

export class Obstacle extends Phaser.GameObjects.Rectangle {
  readonly laneIndex: number;
  private readonly speed: number;

  constructor(scene: Phaser.Scene, x: number, y: number, laneIndex: number) {
    super(scene, x, y, 58, 80, 0xfc5b5b);
    this.laneIndex = laneIndex;
    this.speed = 360;
    scene.add.existing(this);
  }

  step(deltaSeconds: number): void {
    this.y += this.speed * deltaSeconds;
  }
}
