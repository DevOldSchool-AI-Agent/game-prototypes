import Phaser from "phaser";

export class Gnat {
  public readonly id: number;
  public readonly anchor: Phaser.Math.Vector2;
  public alive = true;
  public readonly sprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, id: number, x: number, y: number) {
    this.id = id;
    this.anchor = new Phaser.Math.Vector2(x, y);
    this.sprite = scene.add.sprite(x, y, "gnat").setDepth(4);
  }

  public kill(): void {
    this.alive = false;
    this.sprite.setVisible(false);
    this.sprite.active = false;
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}
