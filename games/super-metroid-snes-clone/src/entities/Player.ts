import Phaser from "phaser";

export class Player {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private facing: 1 | -1 = 1;
  private fireCooldownMs = 180;
  private nextShotAt = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, "player");
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDragX(1500);
    this.sprite.setMaxVelocity(250, 840);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, jump: Phaser.Input.Keyboard.Key): void {
    const move = Number(Boolean(cursors.right?.isDown)) - Number(Boolean(cursors.left?.isDown));
    this.sprite.setVelocityX(move * 215);
    if (move !== 0) {
      this.facing = move > 0 ? 1 : -1;
      this.sprite.setFlipX(this.facing < 0);
    }

    const body = this.sprite.body as Phaser.Physics.Arcade.Body | null;
    if (Phaser.Input.Keyboard.JustDown(jump) && body?.blocked.down) {
      this.sprite.setVelocityY(-430);
    }
  }

  tryFire(scene: Phaser.Scene, fire: Phaser.Input.Keyboard.Key, bullets: Phaser.Physics.Arcade.Group): void {
    const now = scene.time.now;
    if (!fire.isDown || now < this.nextShotAt) {
      return;
    }
    this.nextShotAt = now + this.fireCooldownMs;
    const shot = bullets.get(this.sprite.x + this.facing * 20, this.sprite.y - 4, "shot") as Phaser.Physics.Arcade.Image;
    shot.setActive(true).setVisible(true);
    const body = shot.body as Phaser.Physics.Arcade.Body | null;
    if (!body) {
      return;
    }
    body.reset(shot.x, shot.y);
    shot.setVelocityX(this.facing * 460);
    shot.setAccelerationX(0);
    shot.setGravityY(0);
  }
}
