import Phaser from "phaser";
import { Palette } from "../ui/Palette";

export class BootScene extends Phaser.Scene {
  public constructor() {
    super("boot");
  }

  public create(): void {
    this.add
      .rectangle(640, 360, 1280, 720, Palette.crowdBottom)
      .setDepth(-10)
      .setAlpha(0.1);

    this.scene.start("title");
  }
}
