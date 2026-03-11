import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
  public health: number;
  public shards: number;
  public isAttacking: boolean;
  private attackCooldownMs: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    this.health = 5;
    this.shards = 0;
    this.isAttacking = false;
    this.attackCooldownMs = 0;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setDrag(900, 900);
    this.setMaxVelocity(220, 220);
  }

  public updateCooldowns(dtMs: number): void {
    this.attackCooldownMs = Math.max(0, this.attackCooldownMs - dtMs);
    if (this.attackCooldownMs <= 240) {
      this.isAttacking = false;
    }
  }

  public canAttack(): boolean {
    return this.attackCooldownMs <= 0;
  }

  public beginAttack(): void {
    this.attackCooldownMs = 440;
    this.isAttacking = true;
  }
}
