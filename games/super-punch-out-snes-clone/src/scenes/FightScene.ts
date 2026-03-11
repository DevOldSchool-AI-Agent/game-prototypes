import Phaser from "phaser";
import { FightSystem } from "../systems/FightSystem";
import { HudSystem } from "../systems/HudSystem";
import { Palette } from "../ui/Palette";

declare global {
  interface Window {
    __punchOutState?: unknown;
  }
}

export class FightScene extends Phaser.Scene {
  private fightSystem!: FightSystem;
  private hud!: HudSystem;
  private player!: Phaser.GameObjects.Rectangle;
  private opponent!: Phaser.GameObjects.Rectangle;
  private laneIndicator!: Phaser.GameObjects.Rectangle;
  private infoText!: Phaser.GameObjects.Text;

  public constructor() {
    super("fight");
  }

  public create(): void {
    this.drawArena();
    this.fightSystem = new FightSystem(this);
    this.hud = new HudSystem(this);

    this.player = this.add.rectangle(380, 482, 120, 180, Palette.player).setStrokeStyle(3, 0xbfdbfe, 1);
    this.opponent = this.add.rectangle(900, 410, 140, 210, Palette.opponent).setStrokeStyle(3, 0xfee2e2, 1);
    this.laneIndicator = this.add.rectangle(900, 188, 220, 34, Palette.telegraphHigh, 0.85).setStrokeStyle(2, 0xf8fafc, 1);
    this.infoText = this.add
      .text(640, 102, "READ TELEGRAPH -> DODGE -> PUNCH", {
        fontFamily: "Verdana",
        fontSize: "28px",
        color: "#f8fafc"
      })
      .setOrigin(0.5)
      .setDepth(5);

    this.registerInput();
    this.publishState();
  }

  public update(_: number, delta: number): void {
    this.fightSystem.update(delta);
    const snapshot = this.fightSystem.getSnapshot();
    this.hud.update(snapshot);

    this.player.fillColor = this.fightSystem.isPlayerFlashActive() ? Palette.hitFlash : Palette.player;
    this.opponent.fillColor = this.fightSystem.isOpponentFlashActive() ? Palette.hitFlash : Palette.opponent;

    this.laneIndicator.y = snapshot.telegraphLane === "high" ? 188 : 252;
    this.laneIndicator.fillColor = snapshot.telegraphLane === "high" ? Palette.telegraphHigh : Palette.telegraphLow;
    this.laneIndicator.alpha = snapshot.phase === "telegraph" || snapshot.phase === "strike" ? 1 : 0.32;

    if (snapshot.phase === "open") {
      this.infoText.setText("OPENING! PRESS SPACE NOW");
      this.infoText.setColor("#86efac");
    } else if (snapshot.phase === "telegraph") {
      this.infoText.setText("READ THE TELL");
      this.infoText.setColor("#fcd34d");
    } else {
      this.infoText.setText("READ TELEGRAPH -> DODGE -> PUNCH");
      this.infoText.setColor("#f8fafc");
    }

    if (snapshot.mode === "won" || snapshot.mode === "lost") {
      window.__punchOutState = snapshot;
      this.scene.start("result", { outcome: snapshot.mode });
      return;
    }

    this.publishState();
  }

  private drawArena(): void {
    this.add.rectangle(640, 360, 1280, 720, Palette.crowdBottom);
    this.add.rectangle(640, 140, 1280, 280, Palette.crowdTop, 0.95);

    for (let i = 0; i < 12; i += 1) {
      const x = 80 + i * 105;
      const h = 50 + (i % 4) * 30;
      this.add.rectangle(x, 200 - h / 2, 54, h, 0x172554, 0.5);
    }

    this.add.rectangle(640, 470, 960, 410, Palette.ring).setStrokeStyle(6, Palette.ringBorder, 1);
    this.add.rectangle(640, 540, 900, 90, 0x111827, 0.48).setStrokeStyle(2, 0x64748b, 1);

    this.add.text(900, 146, "RIVAL ATTACK LANE", {
      fontFamily: "Verdana",
      fontSize: "18px",
      color: "#e2e8f0"
    });
  }

  private registerInput(): void {
    this.input.keyboard?.on("keydown-UP", () => {
      this.fightSystem.dodge("high");
      this.tweens.add({ targets: this.player, y: 454, duration: 90, yoyo: true });
    });

    this.input.keyboard?.on("keydown-DOWN", () => {
      this.fightSystem.dodge("low");
      this.tweens.add({ targets: this.player, y: 525, duration: 90, yoyo: true });
    });

    this.input.keyboard?.on("keydown-SPACE", () => {
      const result = this.fightSystem.punch();
      if (result.landed) {
        this.tweens.add({ targets: this.player, x: 440, duration: 70, yoyo: true });
        this.cameras.main.flash(90, 255, 250, 170, false);
      }
      if (result.blocked) {
        this.tweens.add({ targets: this.player, angle: { from: -8, to: 8 }, duration: 60, yoyo: true });
      }
    });
  }

  private publishState(): void {
    window.__punchOutState = this.fightSystem.getSnapshot();
  }
}
