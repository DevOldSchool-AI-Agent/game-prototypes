import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  public create(): void {
    this.createTextures();
    this.scene.start("menu");
  }

  private createTextures(): void {
    const g = this.add.graphics();

    g.clear();
    g.fillStyle(0xfff9dd, 1);
    g.fillCircle(24, 24, 22);
    g.fillStyle(0x593615, 1);
    g.fillCircle(17, 16, 4);
    g.fillCircle(30, 16, 4);
    g.fillStyle(0xff9f80, 1);
    g.fillCircle(24, 30, 5);
    g.generateTexture("swatter", 48, 48);

    g.clear();
    g.fillStyle(0x2f2f2f, 1);
    g.fillCircle(13, 10, 8);
    g.fillStyle(0x9de9ff, 0.95);
    g.fillEllipse(7, 12, 8, 14);
    g.fillEllipse(19, 12, 8, 14);
    g.generateTexture("gnat", 26, 20);

    g.clear();
    g.fillStyle(0xff6a63, 1);
    g.fillRoundedRect(0, 0, 18, 18, 5);
    g.fillStyle(0xfff0d1, 1);
    g.fillCircle(9, 9, 4);
    g.generateTexture("paintDrop", 18, 18);

    g.clear();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(8, 8, 8);
    g.generateTexture("spark", 16, 16);

    g.destroy();
  }
}
