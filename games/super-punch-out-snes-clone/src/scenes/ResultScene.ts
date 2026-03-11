import Phaser from "phaser";

interface ResultData {
  outcome: "won" | "lost";
}

export class ResultScene extends Phaser.Scene {
  public constructor() {
    super("result");
  }

  public create(data: ResultData): void {
    const didWin = data.outcome === "won";
    const title = didWin ? "YOU WIN" : "YOU LOSE";
    const subtitle = didWin
      ? "Clean counters. Rival knocked out."
      : "Rival survived. Recover and try again.";

    this.add.rectangle(640, 360, 1280, 720, didWin ? 0x0b1f14 : 0x2a0f18, 0.98);
    this.add.rectangle(640, 360, 900, 380, 0x020617, 0.9).setStrokeStyle(3, didWin ? 0x22c55e : 0xf87171, 1);

    this.add
      .text(640, 260, title, {
        fontFamily: "Impact, Haettenschweiler, sans-serif",
        fontSize: "88px",
        color: didWin ? "#86efac" : "#fca5a5"
      })
      .setOrigin(0.5);

    this.add
      .text(640, 365, subtitle, {
        fontFamily: "Verdana",
        fontSize: "34px",
        color: "#e2e8f0"
      })
      .setOrigin(0.5);

    this.add
      .text(640, 500, "ENTER: Rematch    M: Main Menu", {
        fontFamily: "Verdana",
        fontSize: "26px",
        color: "#fde68a"
      })
      .setOrigin(0.5);

    this.input.keyboard?.once("keydown-ENTER", () => {
      this.scene.start("fight");
    });

    this.input.keyboard?.once("keydown-M", () => {
      this.scene.start("title");
    });
  }
}
