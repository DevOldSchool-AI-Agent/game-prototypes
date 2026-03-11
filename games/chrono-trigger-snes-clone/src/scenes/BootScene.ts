import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  public create(): void {
    this.createTextures();
    this.scale.on("resize", (size: Phaser.Structs.Size) => {
      this.cameras.main.setViewport(0, 0, size.width, size.height);
    });
    this.scene.start("menu");
  }

  private createTextures(): void {
    const g = this.add.graphics();

    g.clear();
    g.fillStyle(0x66c6ff, 1);
    g.fillRoundedRect(0, 0, 26, 26, 6);
    g.fillStyle(0xe2f4ff, 1);
    g.fillCircle(13, 8, 4);
    g.generateTexture("player", 26, 26);

    g.clear();
    g.fillStyle(0xff7a59, 1);
    g.fillRoundedRect(0, 0, 22, 22, 5);
    g.fillStyle(0x3b1824, 0.9);
    g.fillCircle(7, 9, 3);
    g.fillCircle(15, 9, 3);
    g.generateTexture("enemy", 22, 22);

    g.clear();
    g.fillStyle(0x7ae0ff, 1);
    g.fillTriangle(8, 0, 16, 13, 8, 26);
    g.fillStyle(0xd9f8ff, 0.95);
    g.fillCircle(9, 13, 3);
    g.generateTexture("shard", 16, 26);

    g.clear();
    g.fillStyle(0xffffff, 0.16);
    g.fillCircle(6, 6, 5);
    g.fillCircle(16, 10, 4);
    g.fillCircle(24, 7, 5);
    g.generateTexture("mist", 30, 16);

    g.destroy();
  }
}
