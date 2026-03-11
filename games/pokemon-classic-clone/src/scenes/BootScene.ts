import Phaser from "phaser";
import { updatePublicState } from "../systems/DebugStateReporter";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    this.buildTextures();
    updatePublicState({ scene: "boot", message: "textures-ready" });
    this.scene.start("MenuScene");
  }

  private buildTextures(): void {
    const graphics = this.add.graphics();

    graphics.fillStyle(0xffe43c);
    graphics.fillCircle(16, 16, 14);
    graphics.fillStyle(0xffffff);
    graphics.fillCircle(16, 16, 10);
    graphics.lineStyle(2, 0x102036);
    graphics.strokeCircle(16, 16, 14);
    graphics.generateTexture("pickup", 32, 32);
    graphics.clear();

    graphics.fillStyle(0x8fd3ff);
    graphics.fillRoundedRect(4, 2, 24, 28, 6);
    graphics.lineStyle(2, 0x0d2745);
    graphics.strokeRoundedRect(4, 2, 24, 28, 6);
    graphics.generateTexture("player", 32, 32);
    graphics.clear();

    graphics.fillStyle(0xff8f8f);
    graphics.fillRoundedRect(3, 3, 26, 26, 4);
    graphics.lineStyle(2, 0x3d1010);
    graphics.strokeRoundedRect(3, 3, 26, 26, 4);
    graphics.generateTexture("trainer", 32, 32);
    graphics.clear();

    graphics.fillStyle(0x294763);
    graphics.fillRect(0, 0, 32, 32);
    graphics.lineStyle(1, 0x16273a);
    graphics.strokeRect(0, 0, 32, 32);
    graphics.generateTexture("wall", 32, 32);
    graphics.destroy();
  }
}
