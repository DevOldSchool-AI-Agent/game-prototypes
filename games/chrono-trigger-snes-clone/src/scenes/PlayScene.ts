import Phaser from "phaser";
import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";
import { InputController } from "../systems/InputController";
import { StageManager, StageConfig } from "../systems/StageManager";
import { Hud } from "../ui/Hud";

type PlayInit = {
  stageIndex: number;
  totalScore: number;
};

type Snapshot = {
  mode: string;
  stageName: string;
  stageIndex: number;
  player: { x: number; y: number; hp: number; attacking: boolean };
  timer: number;
  shards: { collected: number; needed: number; remainingOnField: number };
  enemies: Array<{ id: number; x: number; y: number; hp: number }>;
  score: number;
};

export class PlayScene extends Phaser.Scene {
  private inputController!: InputController;
  private hud!: Hud;
  private player!: Player;
  private enemies!: Phaser.GameObjects.Group;
  private shards!: Phaser.Physics.Arcade.Group;
  private mist!: Phaser.GameObjects.TileSprite;

  private stageIndex = 0;
  private stage!: StageConfig;
  private score = 0;
  private timeRemaining = 0;
  private elapsedMs = 0;
  private isEnding = false;

  constructor() {
    super("play");
  }

  public create(initData: PlayInit): void {
    this.stageIndex = initData.stageIndex;
    this.score = initData.totalScore;
    this.stage = StageManager.getStage(this.stageIndex);
    this.timeRemaining = this.stage.timerSeconds;

    this.paintStageBackground();
    this.mist = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "mist").setOrigin(0).setAlpha(0.4);

    this.player = new Player(this, this.scale.width * 0.5, this.scale.height * 0.58);
    this.enemies = this.createEnemies();
    this.shards = this.createShards();

    this.inputController = new InputController(this);
    this.hud = new Hud(this);
    this.setupCollisions();

    window.render_game_to_text = () => JSON.stringify(this.snapshot());
    window.advanceTime = (ms: number) => {
      this.advanceDeterministic(ms);
    };
  }

  public update(_: number, delta: number): void {
    this.simulateStep(Math.min(34, delta));
  }

  private advanceDeterministic(ms: number): void {
    const step = 1000 / 60;
    const steps = Math.max(1, Math.round(ms / step));
    for (let i = 0; i < steps; i += 1) {
      this.simulateStep(step);
    }
  }

  private simulateStep(deltaMs: number): void {
    if (this.isEnding) {
      return;
    }

    const intent = this.inputController.read();
    const baseSpeed = 170;
    const vx = intent.moveX * baseSpeed;
    const vy = intent.moveY * baseSpeed;
    this.player.setVelocity(vx, vy);

    if (intent.attackPressed && this.player.canAttack()) {
      this.player.beginAttack();
      const dir = new Phaser.Math.Vector2(intent.moveX || 1, intent.moveY).normalize();
      this.player.setVelocity(dir.x * 360, dir.y * 360);
      this.player.setTint(0x9ce7ff);
      this.time.delayedCall(180, () => this.player.clearTint());
    }

    this.player.updateCooldowns(deltaMs);
    this.elapsedMs += deltaMs;
    this.timeRemaining = Math.max(0, this.stage.timerSeconds - this.elapsedMs / 1000);

    this.enemies.getChildren().forEach((enemyObj) => {
      const enemy = enemyObj as Enemy;
      enemy.tick(deltaMs);
      const direction = new Phaser.Math.Vector2(this.player.x - enemy.x, this.player.y - enemy.y).normalize();
      enemy.setVelocity(direction.x * (105 * this.stage.enemySpeedScale), direction.y * (105 * this.stage.enemySpeedScale));
    });

    this.mist.tilePositionX += 0.16;
    this.mist.tilePositionY += 0.08;

    this.hud.render({
      stageLabel: `Era ${this.stageIndex + 1}: ${this.stage.name}`,
      hp: this.player.health,
      shards: this.player.shards,
      objectiveShards: this.stage.objectiveShards,
      timerSeconds: this.timeRemaining,
      enemies: this.enemies.countActive(true)
    });

    const stageComplete = this.player.shards >= this.stage.objectiveShards;
    if (stageComplete && this.enemies.countActive(true) === 0) {
      this.finishStage(true);
      return;
    }

    if (this.player.health <= 0 || this.timeRemaining <= 0) {
      this.finishStage(false);
    }
  }

  private finishStage(success: boolean): void {
    this.isEnding = true;
    const isFinalStage = success && this.stageIndex >= StageManager.stageCount() - 1;

    this.time.delayedCall(460, () => {
      if (success && !isFinalStage) {
        this.scene.start("play", { stageIndex: this.stageIndex + 1, totalScore: this.score + Math.floor(this.timeRemaining * 20) });
        return;
      }
      this.scene.start("result", {
        won: success && isFinalStage,
        failedStageName: success ? null : this.stage.name,
        score: this.score,
        reachedStage: this.stageIndex + 1
      });
    });
  }

  private paintStageBackground(): void {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(this.stage.paletteTop, this.stage.paletteTop, this.stage.paletteBottom, this.stage.paletteBottom, 1);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

    graphics.fillStyle(0xffffff, 0.05);
    for (let i = 0; i < 14; i += 1) {
      graphics.fillRoundedRect(40 + i * 96, 80 + (i % 3) * 120, 86, 62, 18);
    }
    graphics.setDepth(-10);
  }

  private createEnemies(): Phaser.GameObjects.Group {
    const group = this.add.group({ classType: Enemy, runChildUpdate: false });
    for (let i = 0; i < this.stage.enemyCount; i += 1) {
      const x = 120 + (i * 180) % (this.scale.width - 220);
      const y = 120 + (i % 2) * 200;
      const enemy = new Enemy(this, x, y, i + 1, this.stage.enemySpeedScale);
      group.add(enemy);
    }
    return group;
  }

  private createShards(): Phaser.Physics.Arcade.Group {
    const group = this.physics.add.group();
    for (let i = 0; i < this.stage.objectiveShards; i += 1) {
      const shard = group.create(
        120 + Math.random() * (this.scale.width - 240),
        90 + Math.random() * (this.scale.height - 180),
        "shard"
      ) as Phaser.Physics.Arcade.Image;
      shard.setAlpha(0.9);
    }
    return group;
  }

  private setupCollisions(): void {
    this.physics.add.overlap(this.player, this.shards, (_, shard) => {
      shard.destroy();
      this.player.shards += 1;
      this.score += 140;
      this.flash(0x7ae0ff);
    });

    this.physics.add.overlap(this.player, this.enemies, (_, target) => {
      const enemy = target as Enemy;
      if (!enemy.active || this.isEnding) {
        return;
      }
      if (this.player.isAttacking) {
        enemy.health -= 1;
        enemy.setTint(0xffffff);
        this.time.delayedCall(70, () => enemy.clearTint());
        if (enemy.health <= 0) {
          enemy.destroy();
          this.score += 220;
          this.flash(0xffd080);
        }
        return;
      }
      if (enemy.canDealContactDamage()) {
        enemy.triggerContactCooldown();
        this.player.health -= 1;
        this.player.setTint(0xff8f8f);
        this.time.delayedCall(120, () => this.player.clearTint());
        this.flash(0xff6767);
      }
    });
  }

  private flash(color: number): void {
    this.cameras.main.flash(90, (color >> 16) & 255, (color >> 8) & 255, color & 255, false);
  }

  private snapshot(): Snapshot {
    return {
      mode: this.isEnding ? "transition" : "play",
      stageName: this.stage.name,
      stageIndex: this.stageIndex,
      player: {
        x: Number(this.player.x.toFixed(1)),
        y: Number(this.player.y.toFixed(1)),
        hp: this.player.health,
        attacking: this.player.isAttacking
      },
      timer: Number(this.timeRemaining.toFixed(2)),
      shards: {
        collected: this.player.shards,
        needed: this.stage.objectiveShards,
        remainingOnField: this.shards.countActive(true)
      },
      enemies: this.enemies
        .getChildren()
        .filter((entry) => entry.active)
        .map((enemyObj) => {
          const enemy = enemyObj as Enemy;
          return {
            id: enemy.enemyId,
            x: Number(enemy.x.toFixed(1)),
            y: Number(enemy.y.toFixed(1)),
            hp: enemy.health
          };
        }),
      score: this.score
    };
  }
}
