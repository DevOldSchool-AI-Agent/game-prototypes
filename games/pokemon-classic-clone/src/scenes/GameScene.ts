import Phaser from "phaser";
import { Player } from "../entities/Player";
import { EncounterSystem } from "../systems/EncounterSystem";
import { updatePublicState } from "../systems/DebugStateReporter";
import { InputSystem } from "../systems/InputSystem";
import { StageRuntime } from "../systems/StageRuntime";
import { StageSystem } from "../systems/StageSystem";
import type { GameOutcome, StageConfig } from "../types";
import { Hud } from "../ui/Hud";

export class GameScene extends Phaser.Scene {
  private readonly worldWidth = 960;
  private readonly worldHeight = 540;
  private readonly playAreaTop = 72;

  private readonly stageSystem = new StageSystem();
  private readonly encounterSystem = new EncounterSystem();

  private currentStageIndex = 0;
  private hearts = 3;
  private timeRemaining = 0;
  private stageTransitionPending = false;

  private inputSystem!: InputSystem;
  private hud!: Hud;
  private player!: Player;
  private stageRuntime!: StageRuntime;
  private stageBanner!: Phaser.GameObjects.Text;

  constructor() {
    super("GameScene");
  }

  create(): void {
    this.drawEnvironment();

    this.physics.world.setBounds(0, this.playAreaTop, this.worldWidth, this.worldHeight - this.playAreaTop);

    this.inputSystem = new InputSystem(this);
    this.hud = new Hud(this);
    this.player = new Player(this, 96, 120);
    this.stageRuntime = new StageRuntime(this, this.player);

    this.stageRuntime.bindCallbacks({
      onPickupCollected: (pickup) => {
        this.collectPickup(pickup);
      },
      onTrainerContact: () => {
        this.handleTrainerContact();
      }
    });

    this.stageBanner = this.add
      .text(480, 100, "", {
        fontFamily: "Trebuchet MS",
        fontSize: "30px",
        color: "#fff2b3",
        stroke: "#101b2d",
        strokeThickness: 6
      })
      .setOrigin(0.5)
      .setDepth(25)
      .setVisible(false);

    this.installQaHooks();
    this.startNewRun();
  }

  update(_time: number, delta: number): void {
    if (this.stageTransitionPending) {
      return;
    }

    this.player.move(this.inputSystem.getMovementVector());

    this.timeRemaining -= delta / 1000;
    if (this.timeRemaining <= 0) {
      this.finishRun("lose");
      return;
    }

    this.syncHudAndDebugState();
  }

  private drawEnvironment(): void {
    this.add.rectangle(480, 306, this.worldWidth, this.worldHeight, 0x214330, 1).setDepth(0);
    this.add.rectangle(480, 36, this.worldWidth, this.playAreaTop, 0x12213a, 1).setDepth(10);

    for (let row = 0; row < 13; row += 1) {
      const rowY = this.playAreaTop + row * 36;
      const color = row % 2 === 0 ? 0x2a5838 : 0x2d603c;
      this.add.rectangle(480, rowY + 18, this.worldWidth, 36, color, 0.55).setDepth(1);
    }

    for (let column = 0; column < 24; column += 1) {
      const columnX = column * 40;
      this.add.rectangle(columnX, 306, 2, this.worldHeight - this.playAreaTop, 0x1f4a31, 0.3).setOrigin(0, 0.5).setDepth(2);
    }
  }

  private startNewRun(): void {
    this.hearts = 3;
    this.currentStageIndex = 0;
    this.encounterSystem.reset();
    this.stageTransitionPending = false;
    this.startStage(this.currentStageIndex);
  }

  private startStage(stageIndex: number): void {
    const stage = this.stageSystem.getStage(stageIndex);
    this.stageRuntime.loadStage(stage, { x: 96, y: 120 });
    this.timeRemaining = stage.timeLimitSeconds;
    this.stageTransitionPending = false;
    this.showStageBanner(stage);
    this.syncHudAndDebugState();
  }

  private collectPickup(pickup: Phaser.Physics.Arcade.Sprite): void {
    pickup.destroy();
    this.cameras.main.flash(65, 240, 250, 255);

    if (this.stageRuntime.getPickupsRemaining() === 0) {
      this.advanceStage();
    }

    this.syncHudAndDebugState();
  }

  private advanceStage(): void {
    this.stageTransitionPending = true;
    this.currentStageIndex += 1;

    if (this.currentStageIndex >= this.stageSystem.getTotalStages()) {
      this.finishRun("win");
      return;
    }

    this.time.delayedCall(450, () => {
      this.startStage(this.currentStageIndex);
    });
  }

  private handleTrainerContact(): void {
    const now = this.time.now;
    if (!this.encounterSystem.canTakeDamage(now)) {
      return;
    }

    this.encounterSystem.registerDamage(now);
    this.hearts -= 1;
    this.player.flashDamage();
    this.cameras.main.shake(120, 0.003);

    if (this.hearts <= 0) {
      this.finishRun("lose");
      return;
    }

    this.syncHudAndDebugState();
  }

  private finishRun(outcome: GameOutcome): void {
    this.stageTransitionPending = true;
    const completedStages = outcome === "win" ? this.stageSystem.getTotalStages() : this.currentStageIndex + 1;

    updatePublicState({
      scene: "result",
      outcome,
      message: outcome === "win" ? "Champion Run Complete!" : "Run Failed",
      hearts: this.hearts,
      stage: completedStages,
      totalStages: this.stageSystem.getTotalStages()
    });

    this.scene.start("ResultScene", {
      outcome,
      completedStages,
      totalStages: this.stageSystem.getTotalStages(),
      finalHearts: this.hearts
    });
  }

  private syncHudAndDebugState(): void {
    const stage = this.stageSystem.getStage(this.currentStageIndex);
    const pickupsRemaining = this.stageRuntime.getPickupsRemaining();

    this.hud.render({
      stage: this.currentStageIndex + 1,
      totalStages: this.stageSystem.getTotalStages(),
      stageName: stage.name,
      pickupsRemaining,
      hearts: this.hearts,
      timeRemaining: this.timeRemaining
    });

    updatePublicState({
      scene: "play",
      stage: this.currentStageIndex + 1,
      stageName: stage.name,
      totalStages: this.stageSystem.getTotalStages(),
      pickupsRemaining,
      hearts: this.hearts,
      timeRemaining: Number(Math.max(0, this.timeRemaining).toFixed(2)),
      message: "playing"
    });
  }

  private showStageBanner(stage: StageConfig): void {
    this.stageBanner.setText(`Stage ${stage.id}: ${stage.name}`);
    this.stageBanner.setVisible(true);
    this.stageBanner.setAlpha(1);

    this.tweens.killTweensOf(this.stageBanner);
    this.tweens.add({
      targets: this.stageBanner,
      alpha: 0,
      duration: 1000,
      delay: 350,
      onComplete: () => {
        this.stageBanner.setVisible(false);
      }
    });
  }

  private installQaHooks(): void {
    window.__pokemonQa = {
      forceCollectStage: () => {
        if (this.scene.isActive("GameScene") && !this.stageTransitionPending) {
          this.stageRuntime.clearPickups();
          this.advanceStage();
        }
      },
      forceLose: () => {
        if (this.scene.isActive("GameScene") && !this.stageTransitionPending) {
          this.timeRemaining = 0.01;
        }
      }
    };
  }
}
