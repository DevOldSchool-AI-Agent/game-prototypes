import Phaser from 'phaser';

export class EnergyOrb extends Phaser.GameObjects.Arc {
  readonly laneIndex: number;
  private readonly speed: number;

  constructor(scene: Phaser.Scene, x: number, y: number, laneIndex: number) {
    super(scene, x, y, 18, 0, 360, false, 0x8cff67);
    this.laneIndex = laneIndex;
    this.speed = 300;
    this.setStrokeStyle(3, 0xe8ffd6);
    scene.add.existing(this);
  }

  step(deltaSeconds: number): void {
    this.y += this.speed * deltaSeconds;
    this.rotation += deltaSeconds * 2;
  }
}
