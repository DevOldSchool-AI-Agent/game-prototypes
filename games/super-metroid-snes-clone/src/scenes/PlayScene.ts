import Phaser from "phaser";
import { Player } from "../entities/Player";
import { DroneEnemy } from "../entities/DroneEnemy";
import { setupShotVsEnemy } from "../systems/CombatSystem";
import { getStageConfig, isFinalStage } from "../systems/StageSystem";
import { runtimeState, setRuntimeState } from "../systems/GameStateSystem";
import { Hud } from "../ui/Hud";

interface PlayData {
  stage: number;
  hp: number;
  score: number;
}

export class PlayScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private fireKey!: Phaser.Input.Keyboard.Key;
  private shots!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private cells!: Phaser.Physics.Arcade.Group;
  private gate!: Phaser.Physics.Arcade.Image;
  private hud!: Hud;
  private enemyActors: DroneEnemy[] = [];

  private stage = 1;
  private hp = 5;
  private score = 0;
  private cellsCollected = 0;
  private requiredCells = 3;
  private timer = 75;

  constructor() {
    super("PlayScene");
  }

  init(data: PlayData): void {
    this.stage = data.stage;
    this.hp = data.hp;
    this.score = data.score;
  }

  create(): void {
    const stageCfg = getStageConfig(this.stage);
    this.requiredCells = stageCfg.cellsRequired;
    this.timer = stageCfg.timerSeconds;
    this.cellsCollected = 0;

    setRuntimeState({ scene: "PlayScene", stage: this.stage, won: false, hp: this.hp, timer: this.timer });

    this.drawStageBackdrop(stageCfg.tint);

    const floor = this.createPlatforms();

    this.player = new Player(this, 90, 470);
    this.physics.add.collider(this.player.sprite, floor);

    this.shots = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 16,
      runChildUpdate: false
    });

    this.enemies = this.physics.add.group();
    this.enemyActors = this.spawnEnemies(stageCfg.enemyCount, floor);

    this.cells = this.physics.add.group();
    this.spawnCells(this.requiredCells);

    this.gate = this.physics.add.image(900, 250, "gate");
    this.gate.setImmovable(true);
    const gateBody = this.gate.body as Phaser.Physics.Arcade.Body | null;
    if (gateBody) {
      gateBody.allowGravity = false;
    }
    this.gate.setVisible(false);
    this.tweens.add({
      targets: this.gate,
      alpha: { from: 0.45, to: 1 },
      duration: 900,
      yoyo: true,
      repeat: -1
    });

    this.hud = new Hud(this);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.jumpKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.fireKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.physics.add.overlap(this.player.sprite, this.cells, (_player, cellObj) => {
      const cell = cellObj as Phaser.Physics.Arcade.Image;
      cell.disableBody(true, true);
      this.cellsCollected += 1;
      this.score += 100;
      if (this.cellsCollected >= this.requiredCells) {
        this.gate.setVisible(true);
      }
    });

    this.physics.add.overlap(this.player.sprite, this.gate, () => {
      if (this.cellsCollected < this.requiredCells) {
        return;
      }
      if (isFinalStage(this.stage)) {
        this.scene.start("ResultScene", { won: true, score: this.score, reason: "Mission complete" });
      } else {
        this.scene.start("PlayScene", { stage: this.stage + 1, hp: this.hp, score: this.score + 250 });
      }
    });

    this.physics.add.overlap(this.player.sprite, this.enemies, () => {
      this.damagePlayer(1, "Crushed by drone swarm");
    });

    setupShotVsEnemy(this, this.shots, this.enemies, (x, y) => {
      this.score += 120;
      const hitFx = this.add.circle(x, y, 18, 0xffc47a, 0.8).setDepth(9);
      this.time.delayedCall(90, () => hitFx.destroy());
    });

    this.time.addEvent({
      delay: stageCfg.hazardIntervalMs,
      loop: true,
      callback: () => {
        if (this.scene.key !== "PlayScene") {
          return;
        }
        const beam = this.add.rectangle(Phaser.Math.Between(220, 930), Phaser.Math.Between(90, 470), 10, 82, 0xff6b89, 0.5);
        this.physics.add.existing(beam, true);
        const body = beam.body as Phaser.Physics.Arcade.StaticBody;
        this.physics.world.overlap(this.player.sprite, body.gameObject as Phaser.GameObjects.GameObject, () => {
          this.damagePlayer(1, "Hit by defense beam");
        });
        this.time.delayedCall(620, () => beam.destroy());
      }
    });

    this.time.addEvent({
      delay: 250,
      loop: true,
      callback: () => {
        this.timer = Math.max(0, this.timer - 0.25);
        setRuntimeState({ timer: this.timer, hp: this.hp, stage: this.stage });
        if (this.timer <= 0) {
          this.scene.start("ResultScene", { won: false, score: this.score, reason: "Life support depleted" });
        }
      }
    });

    this.registerTestApi();
  }

  update(): void {
    this.player.update(this.cursors, this.jumpKey);
    this.player.tryFire(this, this.fireKey, this.shots);

    this.enemyActors.forEach((enemy) => enemy.update(this.player.sprite.x));
    this.shots.children.each((obj) => {
      const shot = obj as Phaser.Physics.Arcade.Image;
      if (!shot.active) {
        return true;
      }
      if (shot.x < -20 || shot.x > 980) {
        shot.disableBody(true, true);
      }
      return true;
    });

    this.hud.update(this.stage, this.hp, this.cellsCollected, this.requiredCells, this.timer);
    setRuntimeState({ scene: "PlayScene", stage: this.stage, hp: this.hp, timer: this.timer });
  }

  private damagePlayer(amount: number, reason: string): void {
    this.hp -= amount;
    this.cameras.main.shake(100, 0.004);
    setRuntimeState({ hp: this.hp, timer: this.timer });
    if (this.hp <= 0) {
      this.scene.start("ResultScene", { won: false, score: this.score, reason });
    }
  }

  private registerTestApi(): void {
    window.gameTestApi = {
      getState: () => ({ ...runtimeState }),
      start: () => this.scene.start("PlayScene", { stage: 1, hp: 5, score: 0 }),
      forceWin: () => this.scene.start("ResultScene", { won: true, score: this.score + 999, reason: "Forced win" }),
      forceLose: () => this.scene.start("ResultScene", { won: false, score: this.score, reason: "Forced lose" }),
      restart: () => this.scene.start("PlayScene", { stage: 1, hp: 5, score: 0 })
    };
  }

  private drawStageBackdrop(stageTint: number): void {
    this.add.rectangle(480, 270, 960, 540, stageTint, 1);
    for (let i = 0; i < 10; i++) {
      const y = 420 + i * 12;
      this.add.rectangle(480, y, 960, 2, 0x172133 + i * 3500, 0.8);
    }

    const starColor = this.stage === 1 ? 0xd9ecff : this.stage === 2 ? 0xcdd9ff : 0xffd9ea;
    for (let i = 0; i < 70; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, 960),
        Phaser.Math.Between(0, 260),
        Phaser.Math.Between(1, 2),
        starColor,
        Phaser.Math.FloatBetween(0.25, 0.9)
      );
      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: Math.max(0.18, star.alpha - 0.35) },
        duration: Phaser.Math.Between(700, 1600),
        yoyo: true,
        repeat: -1
      });
    }
  }

  private createPlatforms(): Phaser.Physics.Arcade.StaticGroup {
    const floor = this.physics.add.staticGroup();
    floor.create(480, 520, undefined).setDisplaySize(960, 38).refreshBody();
    floor.create(130, 430, undefined).setDisplaySize(240, 24).refreshBody();
    floor.create(440, 365, undefined).setDisplaySize(220, 20).refreshBody();
    floor.create(770, 300, undefined).setDisplaySize(200, 20).refreshBody();
    return floor;
  }

  private spawnEnemies(count: number, floor: Phaser.Physics.Arcade.StaticGroup): DroneEnemy[] {
    const actors: DroneEnemy[] = [];
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(260, 890);
      const y = Phaser.Math.Between(120, 470);
      const enemy = new DroneEnemy(this, x, y, Phaser.Math.Between(120, 210));
      actors.push(enemy);
      this.enemies.add(enemy.sprite);
      this.physics.add.collider(enemy.sprite, floor);
    }
    return actors;
  }

  private spawnCells(count: number): void {
    for (let i = 0; i < count; i++) {
      const cell = this.cells.create(Phaser.Math.Between(250, 900), Phaser.Math.Between(100, 460), "cell") as Phaser.Physics.Arcade.Image;
      const cellBody = cell.body as Phaser.Physics.Arcade.Body | null;
      if (cellBody) {
        cellBody.allowGravity = false;
      }
      this.tweens.add({
        targets: cell,
        y: cell.y - 8,
        duration: Phaser.Math.Between(600, 1100),
        yoyo: true,
        repeat: -1
      });
    }
  }
}
