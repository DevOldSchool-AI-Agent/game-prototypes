import Phaser from "phaser";

export class DroneEnemy {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly centerX: number;
  private readonly roam: number;
  private readonly speed: number;

  constructor(scene: Phaser.Scene, x: number, y: number, roam: number) {
    this.sprite = scene.physics.add.sprite(x, y, "drone");
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setBounce(1, 0);
    this.sprite.setVelocityX(Phaser.Math.Between(90, 140));
    this.centerX = x;
    this.roam = roam;
    this.speed = Phaser.Math.Between(90, 140);
  }

  update(playerX: number): void {
    const towardPlayer = Phaser.Math.Clamp(playerX - this.sprite.x, -1, 1);
    const drift = Math.sin(this.sprite.x * 0.02) * 0.35;
    this.sprite.setVelocityX((towardPlayer * 0.65 + drift) * this.speed);

    if (Math.abs(this.sprite.x - this.centerX) > this.roam) {
      this.sprite.setVelocityX(-Math.sign(this.sprite.x - this.centerX) * this.speed);
    }
  }
}
