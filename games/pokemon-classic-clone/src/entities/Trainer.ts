import Phaser from "phaser";
import type { SpawnSpec } from "../types";

export class Trainer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, spawn: SpawnSpec) {
    super(scene, spawn.x, spawn.y, "trainer");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setBounce(1, 1);
    body.setVelocity(spawn.vx, spawn.vy);

    this.setDepth(4);
  }
}
