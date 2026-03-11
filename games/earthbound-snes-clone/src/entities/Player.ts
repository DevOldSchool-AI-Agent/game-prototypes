import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  public hp = 6;
  public isAttacking = false;
  private attackCooldown = 0;
  private hurtCooldown = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setDepth(5);
  }

  update(keys: Phaser.Types.Input.Keyboard.CursorKeys, wasd: Record<string, Phaser.Input.Keyboard.Key>, deltaSec: number): void {
    const move = new Phaser.Math.Vector2(0, 0);
    if (keys.left?.isDown || wasd.a.isDown) move.x -= 1;
    if (keys.right?.isDown || wasd.d.isDown) move.x += 1;
    if (keys.up?.isDown || wasd.w.isDown) move.y -= 1;
    if (keys.down?.isDown || wasd.s.isDown) move.y += 1;

    move.normalize().scale(145);
    this.setVelocity(move.x, move.y);

    this.attackCooldown = Math.max(0, this.attackCooldown - deltaSec);
    this.hurtCooldown = Math.max(0, this.hurtCooldown - deltaSec);

    if (this.isAttacking && this.attackCooldown <= 0.18) {
      this.isAttacking = false;
      this.setTint(0xffffff);
    }
  }

  attack(): boolean {
    if (this.attackCooldown > 0) {
      return false;
    }
    this.attackCooldown = 0.35;
    this.isAttacking = true;
    this.setTint(0xffe58f);
    return true;
  }

  damage(amount: number): boolean {
    if (this.hurtCooldown > 0) {
      return false;
    }
    this.hurtCooldown = 0.85;
    this.hp = Math.max(0, this.hp - amount);
    this.setTint(0xff7f7f);
    return true;
  }

  resetForStage(x: number, y: number): void {
    this.setPosition(x, y);
    this.setVelocity(0, 0);
    this.attackCooldown = 0;
    this.hurtCooldown = 0;
    this.isAttacking = false;
    this.clearTint();
  }
}
