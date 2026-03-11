import Phaser from "phaser";
import { Trainer } from "../entities/Trainer";
import type { Player } from "../entities/Player";
import type { StageConfig } from "../types";

type StageRuntimeCallbacks = {
  onPickupCollected: (pickup: Phaser.Physics.Arcade.Sprite) => void;
  onTrainerContact: () => void;
};

export class StageRuntime {
  private readonly scene: Phaser.Scene;
  private readonly player: Player;

  private readonly pickups: Phaser.Physics.Arcade.Group;
  private readonly trainers: Phaser.Physics.Arcade.Group;
  private readonly obstacles: Phaser.Physics.Arcade.StaticGroup;

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene;
    this.player = player;

    this.pickups = scene.physics.add.group();
    this.trainers = scene.physics.add.group();
    this.obstacles = scene.physics.add.staticGroup();

    scene.physics.add.collider(this.player, this.obstacles);
    scene.physics.add.collider(this.trainers, this.obstacles);
    scene.physics.add.collider(this.trainers, this.trainers);
  }

  bindCallbacks(callbacks: StageRuntimeCallbacks): void {
    this.scene.physics.add.overlap(this.player, this.pickups, (_player, pickup) => {
      callbacks.onPickupCollected(pickup as Phaser.Physics.Arcade.Sprite);
    });

    this.scene.physics.add.overlap(this.player, this.trainers, () => {
      callbacks.onTrainerContact();
    });
  }

  loadStage(stage: StageConfig, playerSpawn: { x: number; y: number }): void {
    this.clearStageObjects();

    for (const obstacle of stage.obstacles) {
      const wall = this.obstacles.create(
        obstacle.x + obstacle.width / 2,
        obstacle.y + obstacle.height / 2,
        "wall"
      ) as Phaser.Physics.Arcade.Image;

      wall.setDisplaySize(obstacle.width, obstacle.height);
      wall.refreshBody();
    }

    for (const position of stage.pickupPositions) {
      const pickup = this.pickups.create(position.x, position.y, "pickup") as Phaser.Physics.Arcade.Sprite;
      pickup.setDepth(3);
    }

    for (const trainerSpawn of stage.trainerSpawns) {
      const trainer = new Trainer(this.scene, trainerSpawn);
      this.trainers.add(trainer);
    }

    this.scene.tweens.add({
      targets: this.pickups.getChildren(),
      scale: { from: 0.86, to: 1.08 },
      yoyo: true,
      repeat: -1,
      duration: 650,
      ease: "Sine.InOut",
      stagger: 40
    });

    this.player.setPosition(playerSpawn.x, playerSpawn.y);
  }

  getPickupsRemaining(): number {
    return this.pickups.countActive(true);
  }

  clearPickups(): void {
    for (const child of this.pickups.getChildren()) {
      child.destroy();
    }
  }

  private clearStageObjects(): void {
    this.scene.tweens.killTweensOf(this.pickups.getChildren());
    this.pickups.clear(true, true);
    this.trainers.clear(true, true);
    this.obstacles.clear(true, true);
  }
}
