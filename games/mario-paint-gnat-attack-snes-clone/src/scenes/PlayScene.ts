import Phaser from "phaser";
import { Gnat } from "../entities/Gnat";
import { Pickup } from "../entities/Pickup";
import { InputController } from "../systems/InputController";
import { getGameSnapshot, updateGameSnapshot } from "../systems/GameStateBridge";
import { Hud } from "../ui/Hud";

const WORLD_WIDTH = 1280;
const WORLD_HEIGHT = 720;
const ROUND_SECONDS = 18;
const TARGET_KILLS = 4;
const START_FOCUS = 8;
const SWATTER_SPEED = 560;
const SWAT_RADIUS = 1500;
const PICKUP_RADIUS = 48;

type Outcome = "won" | "lost";

export class PlayScene extends Phaser.Scene {
  private inputController!: InputController;
  private swatter!: Phaser.GameObjects.Sprite;
  private hud!: Hud;
  private gnats: Gnat[] = [];
  private pickups: Pickup[] = [];

  private score = 0;
  private kills = 0;
  private focus = START_FOCUS;
  private elapsed = 0;
  private phase = "playing" as "playing" | Outcome;

  constructor() {
    super("play");
  }

  public create(): void {
    this.drawBackground();

    this.inputController = new InputController(this);
    this.swatter = this.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, "swatter").setDepth(10);

    this.gnats = this.createGnats();
    this.pickups = [];

    this.score = 0;
    this.kills = 0;
    this.focus = START_FOCUS;
    this.elapsed = 0;
    this.phase = "playing";

    this.hud = new Hud(this);
    this.publishState();
  }

  public update(_: number, deltaMs: number): void {
    if (this.phase !== "playing") {
      return;
    }

    const delta = deltaMs / 1000;
    this.elapsed += delta;

    const axis = this.inputController.getAxis();
    this.swatter.x = Phaser.Math.Clamp(this.swatter.x + axis.x * SWATTER_SPEED * delta, 36, WORLD_WIDTH - 36);
    this.swatter.y = Phaser.Math.Clamp(this.swatter.y + axis.y * SWATTER_SPEED * delta, 84, WORLD_HEIGHT - 92);

    if (this.inputController.consumeSwat()) {
      this.handleSwat();
    }

    this.collectNearbyPickups();

    const timeLeft = Math.max(0, ROUND_SECONDS - this.elapsed);
    this.hud.set({
      timeLeft,
      kills: this.kills,
      targetKills: TARGET_KILLS,
      focus: this.focus,
      score: this.score
    });

    if (this.kills >= TARGET_KILLS) {
      this.finish("won");
      return;
    }

    if (timeLeft <= 0 || this.focus <= 0) {
      this.finish("lost");
      return;
    }

    this.publishState();
  }

  private drawBackground(): void {
    const g = this.add.graphics().setDepth(-2);
    g.fillGradientStyle(0xfff7d1, 0xfff7d1, 0xf8d189, 0xf8d189, 1);
    g.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    g.fillStyle(0xffffff, 0.26);
    g.fillRoundedRect(48, 96, 1184, 540, 20);

    g.lineStyle(6, 0xe5b46a, 0.9);
    g.strokeRoundedRect(48, 96, 1184, 540, 20);

    for (let i = 0; i < 24; i += 1) {
      const y = 125 + i * 22;
      g.lineStyle(1, 0xf4d7a4, 0.65);
      g.lineBetween(70, y, 1210, y);
    }
  }

  private createGnats(): Gnat[] {
    const anchors = [
      [250, 180],
      [520, 210],
      [870, 180],
      [1040, 300],
      [860, 490],
      [560, 520],
      [290, 450],
      [680, 340]
    ] as const;

    return anchors.map((anchor, index) => new Gnat(this, index, anchor[0], anchor[1]));
  }

  private handleSwat(): void {
    this.swatter.setScale(1.22);
    this.time.delayedCall(65, () => this.swatter.setScale(1));

    let hit = false;

    const target = this.gnats
      .filter((gnat) => gnat.alive)
      .map((gnat) => ({
        gnat,
        distance: Phaser.Math.Distance.Between(this.swatter.x, this.swatter.y, gnat.sprite.x, gnat.sprite.y)
      }))
      .sort((a, b) => a.distance - b.distance)
      .find((entry) => entry.distance <= SWAT_RADIUS);

    if (target) {
      hit = true;
      target.gnat.kill();
      this.kills += 1;
      this.score += 120;
      this.spawnPickup(target.gnat.sprite.x, target.gnat.sprite.y);
      this.spawnHitSpark(target.gnat.sprite.x, target.gnat.sprite.y);
      this.cameras.main.flash(60, 255, 250, 200, false);
    }

    if (hit) {
      return;
    }

    this.focus -= 1;
    this.score = Math.max(0, this.score - 35);
    this.cameras.main.shake(90, 0.003);
    this.cameras.main.flash(80, 255, 112, 112, false);
  }

  private spawnPickup(x: number, y: number): void {
    const pickup = new Pickup(this, this.pickups.length, x, y);
    this.pickups.push(pickup);
  }

  private collectNearbyPickups(): void {
    for (const pickup of this.pickups) {
      if (!pickup.active) {
        continue;
      }
      const distance = Phaser.Math.Distance.Between(this.swatter.x, this.swatter.y, pickup.sprite.x, pickup.sprite.y);
      if (distance > PICKUP_RADIUS) {
        continue;
      }
      pickup.collect();
      this.score += 50;
      const popup = this.add
        .text(this.swatter.x, this.swatter.y - 40, "+50", {
          fontFamily: "Trebuchet MS",
          fontSize: "22px",
          color: "#125e22",
          stroke: "#f5ffe7",
          strokeThickness: 4
        })
        .setOrigin(0.5)
        .setDepth(25);
      this.tweens.add({
        targets: popup,
        y: popup.y - 28,
        alpha: 0,
        duration: 260,
        onComplete: () => popup.destroy()
      });
    }
  }

  private spawnHitSpark(x: number, y: number): void {
    for (let i = 0; i < 8; i += 1) {
      const spark = this.add.image(x, y, "spark").setDepth(16);
      spark.setScale(Phaser.Math.FloatBetween(0.2, 0.45));
      this.tweens.add({
        targets: spark,
        x: x + Phaser.Math.Between(-44, 44),
        y: y + Phaser.Math.Between(-44, 44),
        alpha: 0,
        duration: 190,
        onComplete: () => spark.destroy()
      });
    }
  }

  private finish(outcome: Outcome): void {
    this.phase = outcome;
    const snapshot = getGameSnapshot();
    updateGameSnapshot({ ...snapshot, mode: outcome });

    this.time.delayedCall(220, () => {
      this.scene.start("result", {
        outcome,
        score: this.score,
        kills: this.kills,
        targetKills: TARGET_KILLS
      });
    });
  }

  private publishState(): void {
    updateGameSnapshot({
      mode: "playing",
      timer: Math.max(0, ROUND_SECONDS - this.elapsed),
      kills: this.kills,
      targetKills: TARGET_KILLS,
      focus: this.focus,
      score: this.score,
      objective: "Swat 4 gnats before timer reaches 0.",
      controls: "Move: Arrows/WASD | Swat: Space",
      swatter: { x: this.swatter.x, y: this.swatter.y },
      gnats: this.gnats.map((gnat) => ({
        id: gnat.id,
        x: gnat.sprite.x,
        y: gnat.sprite.y,
        alive: gnat.alive
      })),
      pickups: this.pickups.map((pickup) => ({
        id: pickup.id,
        x: pickup.sprite.x,
        y: pickup.sprite.y,
        active: pickup.active
      }))
    });
  }
}
