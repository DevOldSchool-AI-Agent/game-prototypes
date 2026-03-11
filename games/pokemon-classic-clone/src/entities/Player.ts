import Phaser from "phaser";
import type { MovementVector } from "../systems/InputSystem";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly speed = 190;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setDepth(5);
  }

  move(vector: MovementVector): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (vector.x === 0 && vector.y === 0) {
      body.setVelocity(0, 0);
      return;
    }

    const direction = new Phaser.Math.Vector2(vector.x, vector.y).normalize();
    body.setVelocity(direction.x * this.speed, direction.y * this.speed);
  }

  flashDamage(): void {
    this.setTint(0xff7f7f);
    this.scene.time.delayedCall(130, () => {
      this.clearTint();
    });
  }
}
