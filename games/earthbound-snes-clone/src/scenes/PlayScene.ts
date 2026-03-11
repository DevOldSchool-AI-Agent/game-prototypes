import Phaser from 'phaser';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';
import { CombatSystem } from '../systems/CombatSystem';
import { StageSystem } from '../systems/StageSystem';
import { UiSystem } from '../ui/UiSystem';
import type { RunSummary } from '../types';

declare global {
  interface Window {
    __EARTHBOUND_TEST__?: {
      startRun: () => void;
      forceClearStage: () => void;
      forceLose: () => void;
      restart: () => void;
      getSnapshot: () => Record<string, unknown>;
    };
    render_game_to_text?: () => string;
  }
}

export class PlayScene extends Phaser.Scene {
  private readonly stageSystem = new StageSystem();
  private readonly combatSystem = new CombatSystem(this);
  private player!: Player;
  private enemies!: Phaser.Physics.Arcade.Group;
  private goal!: Phaser.Physics.Arcade.Image;
  private ui!: UiSystem;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private score = 0;
  private timeLeft = 0;
  private enemiesDefeated = 0;
  private stageCleared = false;
  private clouds: Phaser.GameObjects.Rectangle[] = [];

  constructor() {
    super('play');
  }

  create(): void {
    this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;
    this.wasd = this.input.keyboard?.addKeys('W,A,S,D') as Record<string, Phaser.Input.Keyboard.Key>;

    this.player = new Player(this, 110, 360);
    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: false });
    this.goal = this.physics.add.image(1190, 360, 'goal').setImmovable(true).setVisible(false);

    this.physics.world.setBounds(0, 0, 1280, 720);
    this.player.setCollideWorldBounds(true);

    this.ui = new UiSystem(this);
    this.paintStageBackground();

    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.player.attack()) {
        this.combatSystem.tryAttack(this.enemies, this.player);
      }
    });

    this.input.keyboard?.on('keydown-R', () => this.endRun('lost'));

    this.combatSystem.registerEnemyPlayerCollision(this.enemies, this.player, () => {
      this.cameras.main.shake(120, 0.008);
      if (this.player.hp <= 0) {
        this.endRun('lost');
      }
    });

    this.physics.add.overlap(this.player, this.goal, () => {
      if (this.stageCleared) {
        this.goNextStage();
      }
    });

    this.installTestHooks();
    this.startStage();
  }

  update(_time: number, delta: number): void {
    const deltaSec = delta / 1000;
    this.player.update(this.cursors, this.wasd, deltaSec);

    this.timeLeft = Math.max(0, this.timeLeft - deltaSec);
    if (this.timeLeft <= 0) {
      this.endRun('lost');
      return;
    }

    this.enemies.getChildren().forEach((obj) => {
      (obj as Enemy).steerToPlayer(this.player, this.stageSystem.current.enemySpeed);
    });

    if (!this.stageCleared && this.enemiesDefeated >= this.stageSystem.current.enemyQuota) {
      this.stageCleared = true;
      this.goal.setVisible(true);
      this.tweens.add({
        targets: this.goal,
        scale: { from: 1, to: 1.25 },
        yoyo: true,
        repeat: -1,
        duration: 480
      });
    }

    this.ui.update(
      this.stageSystem.current.name,
      this.player.hp,
      Math.max(0, this.stageSystem.current.enemyQuota - this.enemiesDefeated),
      this.timeLeft
    );

    this.scrollClouds(deltaSec);
    this.cleanupDestroyedEnemies();
  }

  private startStage(): void {
    this.enemies.clear(true, true);
    this.goal.setVisible(false).setScale(1);
    this.stageCleared = false;
    this.enemiesDefeated = 0;
    this.timeLeft = this.stageSystem.current.timeLimitSec;

    this.player.resetForStage(110, 360);

    const quota = this.stageSystem.current.enemyQuota;
    for (let i = 0; i < quota; i += 1) {
      const x = Phaser.Math.Between(420, 1160);
      const y = Phaser.Math.Between(100, 630);
      const enemy = new Enemy(this, x, y);
      this.enemies.add(enemy);
    }

    this.paintStageBackground();
  }

  private goNextStage(): void {
    this.score += 1000 + Math.ceil(this.timeLeft) * 5 + this.player.hp * 20;
    const hasNext = this.stageSystem.advance();
    if (!hasNext) {
      this.endRun('won');
      return;
    }
    this.startStage();
  }

  private cleanupDestroyedEnemies(): void {
    const aliveCount = this.enemies.countActive(true);
    this.enemiesDefeated = this.stageSystem.current.enemyQuota - aliveCount;
  }

  private endRun(outcome: 'won' | 'lost'): void {
    const summary: RunSummary = {
      outcome,
      clearedStages: outcome === 'won' ? this.stageSystem.totalStages() : this.stageSystem.currentIndex,
      score: this.score
    };
    this.scene.start('result', summary);
  }

  private paintStageBackground(): void {
    this.cameras.main.setBackgroundColor(this.stageSystem.current.palette.bgBottom);
    this.children.list
      .filter((obj) => obj.name === 'decor-bg')
      .forEach((obj) => obj.destroy());

    this.add.rectangle(640, 140, 1280, 280, this.stageSystem.current.palette.bgTop)
      .setName('decor-bg')
      .setDepth(0);

    this.add.rectangle(640, 560, 1280, 320, this.stageSystem.current.palette.ground)
      .setName('decor-bg')
      .setDepth(0);

    this.add.rectangle(640, 360, 1280, 8, this.stageSystem.current.palette.accent, 0.3)
      .setName('decor-bg')
      .setDepth(1);

    this.clouds.forEach((cloud) => cloud.destroy());
    this.clouds = [];
    for (let i = 0; i < 5; i += 1) {
      const cloud = this.add.rectangle(Phaser.Math.Between(100, 1200), Phaser.Math.Between(75, 210), 120, 26, 0xffffff, 0.26)
        .setName('decor-bg')
        .setDepth(2);
      this.clouds.push(cloud);
    }
  }

  private scrollClouds(deltaSec: number): void {
    this.clouds.forEach((cloud, index) => {
      cloud.x += (15 + index * 4) * deltaSec;
      if (cloud.x > 1360) {
        cloud.x = -80;
      }
    });
  }

  private installTestHooks(): void {
    window.__EARTHBOUND_TEST__ = {
      startRun: () => this.scene.restart(),
      forceClearStage: () => {
        this.enemies.clear(true, true);
        this.enemiesDefeated = this.stageSystem.current.enemyQuota;
        this.stageCleared = true;
        this.goal.setVisible(true);
        this.goNextStage();
      },
      forceLose: () => this.endRun('lost'),
      restart: () => this.scene.start('menu'),
      getSnapshot: () => ({
        scene: this.scene.key,
        stageIndex: this.stageSystem.currentIndex,
        hp: this.player.hp,
        score: this.score,
        stageCleared: this.stageCleared
      })
    };

    window.render_game_to_text = () => [
      `scene=${this.scene.key}`,
      `stage=${this.stageSystem.current.name}`,
      `hp=${this.player.hp}`,
      `quotaRemaining=${Math.max(0, this.stageSystem.current.enemyQuota - this.enemiesDefeated)}`,
      `timeLeft=${Math.ceil(this.timeLeft)}`
    ].join('|');
  }
}
