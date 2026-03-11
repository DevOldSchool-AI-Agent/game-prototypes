import Phaser from "phaser";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public readonly enemyId: number;
  public health: number;
  private contactCooldownMs: number;

  constructor(scene: Phaser.Scene, x: number, y: number, enemyId: number, speedScale: number) {
    super(scene, x, y, "enemy");
    this.enemyId = enemyId;
    this.health = 2;
    this.contactCooldownMs = 0;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setDrag(200 * speedScale, 200 * speedScale);
  }

  public tick(dtMs: number): void {
    this.contactCooldownMs = Math.max(0, this.contactCooldownMs - dtMs);
  }

  public canDealContactDamage(): boolean {
    return this.contactCooldownMs <= 0;
  }

  public triggerContactCooldown(): void {
    this.contactCooldownMs = 700;
  }
}
