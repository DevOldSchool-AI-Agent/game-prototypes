import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    const gfx = this.add.graphics();

    gfx.fillStyle(0x7ec8ff, 1);
    gfx.fillRoundedRect(0, 0, 28, 38, 6);
    gfx.generateTexture("player", 28, 38);
    gfx.clear();

    gfx.fillStyle(0xff8a48, 1);
    gfx.fillCircle(12, 12, 10);
    gfx.generateTexture("drone", 24, 24);
    gfx.clear();

    gfx.fillStyle(0xd2f6ff, 1);
    gfx.fillRect(0, 0, 16, 6);
    gfx.generateTexture("shot", 16, 6);
    gfx.clear();

    gfx.fillStyle(0x8ea0c4, 1);
    gfx.fillRoundedRect(0, 0, 26, 26, 5);
    gfx.fillStyle(0xc8def7, 1);
    gfx.fillCircle(13, 13, 6);
    gfx.generateTexture("cell", 26, 26);
    gfx.clear();

    gfx.fillStyle(0xb8eeff, 1);
    gfx.fillTriangle(0, 34, 44, 17, 0, 0);
    gfx.generateTexture("gate", 44, 34);
    gfx.clear();

    this.scene.start("TitleScene");
  }
}
