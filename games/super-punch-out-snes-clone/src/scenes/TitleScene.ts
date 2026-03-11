import Phaser from "phaser";

export class TitleScene extends Phaser.Scene {
  public constructor() {
    super("title");
  }

  public create(): void {
    const centerX = this.scale.width / 2;

    this.add.rectangle(centerX, 360, 1280, 720, 0x0f172a);
    this.add.rectangle(centerX, 120, 920, 110, 0x1e293b, 0.94).setStrokeStyle(3, 0x60a5fa, 1);
    this.add.rectangle(centerX, 390, 980, 410, 0x0b1220, 0.92).setStrokeStyle(2, 0x334155, 1);

    this.add
      .text(centerX, 120, "SUPER PUNCH-OUT!! INSPIRED", {
        fontFamily: "Impact, Haettenschweiler, sans-serif",
        fontSize: "56px",
        color: "#f8fafc"
      })
      .setOrigin(0.5);

    this.add
      .text(
        centerX,
        328,
        [
          "Objective:",
          "Knock out the rival with 6 clean punches before your HP or timer runs out.",
          "",
          "Controls:",
          "Enter: Start round",
          "Arrow Up: High dodge",
          "Arrow Down: Low dodge",
          "Space: Punch",
          "M: Return to title from result"
        ],
        {
          fontFamily: "Verdana",
          fontSize: "28px",
          color: "#cbd5e1",
          align: "center",
          lineSpacing: 8
        }
      )
      .setOrigin(0.5, 0);

    const startPrompt = this.add
      .text(centerX, 640, "Press ENTER to fight", {
        fontFamily: "Verdana",
        fontSize: "34px",
        color: "#fde68a"
      })
      .setOrigin(0.5)
      .setAlpha(0.95);

    this.tweens.add({
      targets: startPrompt,
      alpha: 0.35,
      duration: 620,
      yoyo: true,
      repeat: -1
    });

    this.input.keyboard?.once("keydown-ENTER", () => {
      this.scene.start("fight");
    });
  }
}
