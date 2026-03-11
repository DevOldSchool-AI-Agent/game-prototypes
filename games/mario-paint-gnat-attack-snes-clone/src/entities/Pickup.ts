import Phaser from "phaser";

export class Pickup {
  public readonly id: number;
  public active = true;
  public readonly sprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, id: number, x: number, y: number) {
    this.id = id;
    this.sprite = scene.add.sprite(x, y, "paintDrop").setDepth(3);

    scene.tweens.add({
      targets: this.sprite,
      scale: { from: 0.8, to: 1.08 },
      duration: 280,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  public collect(): void {
    this.active = false;
    this.sprite.destroy();
  }
}
