import Phaser from 'phaser';
import type { Enemy, Mode, Pickup, TilePoint } from '../entities/types';
import { blastTiles, hasBlastAt, type Blast, type Bomb } from '../systems/bombSystem';
import { GRID_COLS, GRID_ROWS, TILE_SIZE, tileKey, tileToWorld } from '../systems/grid';
import { Hud } from '../ui/hud';

declare global {
  interface Window {
    render_game_to_text: () => string;
    advanceTime: (ms: number) => Promise<void>;
    __GAME_TEST_STATE__?: {
      mode: Mode;
      enemiesLeft: number;
      score: number;
      player: TilePoint;
      pickupsLeft: number;
    };
  }
}

const WALL_COLOR = 0x425466;
const FLOOR_COLOR = 0x1f2933;
const PLAYER_COLOR = 0x6ee7ff;
const ENEMY_COLOR = 0xff7b7b;
const PICKUP_COLOR = 0xfff16d;
const BOMB_COLOR = 0x101114;
const BLAST_COLOR = 0xffb84f;

export class GameScene extends Phaser.Scene {
  private mode: Mode = 'start';
  private player: TilePoint = { x: 2, y: 5 };
  private score = 0;
  private walls = new Set<string>();
  private enemies: Enemy[] = [];
  private pickups: Pickup[] = [];
  private bomb: Bomb | null = null;
  private blasts: Blast[] = [];
  private playerSprite!: Phaser.GameObjects.Rectangle;
  private overlayBackdrop!: Phaser.GameObjects.Rectangle;
  private overlayText!: Phaser.GameObjects.Text;
  private hud!: Hud;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyEnter!: Phaser.Input.Keyboard.Key;
  private audioContext: AudioContext | null = null;
  private audioUnlocked = false;

  constructor() {
    super('game');
  }

  public create(): void {
    this.buildWalls();
    this.drawBoard();

    this.playerSprite = this.add.rectangle(0, 0, TILE_SIZE * 0.65, TILE_SIZE * 0.65, PLAYER_COLOR);
    this.playerSprite.setStrokeStyle(2, 0xffffff);

    this.overlayBackdrop = this.add
      .rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.52)
      .setDepth(4)
      .setVisible(false);

    this.overlayText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, '', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#ffffff',
        align: 'center',
        backgroundColor: '#000000aa'
      })
      .setOrigin(0.5)
      .setPadding(16, 14, 16, 14)
      .setDepth(5);

    this.hud = new Hud(this);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyEnter = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.input.keyboard!.on('keydown', this.handleKeyDown, this);

    this.resetRound('start');
    this.refreshTestState();

    window.render_game_to_text = () =>
      JSON.stringify({
        mode: this.mode,
        player: { ...this.player },
        enemies: this.enemies.filter((enemy) => enemy.alive).map((enemy) => ({ id: enemy.id, x: enemy.x, y: enemy.y })),
        pickups: this.pickups.filter((pickup) => pickup.active).map((pickup) => ({ id: pickup.id, x: pickup.x, y: pickup.y })),
        score: this.score,
        objective: 'Defeat all sentry bots using bombs'
      });

    window.advanceTime = async (ms: number) => {
      await new Promise<void>((resolve) => this.time.delayedCall(ms, () => resolve()));
    };
  }

  public update(_time: number, delta: number): void {
    if (this.mode !== 'play') {
      return;
    }

    if (this.bomb) {
      this.bomb.elapsedMs += delta;
      if (this.bomb.elapsedMs >= this.bomb.fuseMs) {
        this.explodeBomb();
      }
    }

    this.blasts = this.blasts.filter((blast) => {
      blast.elapsedMs += delta;
      const active = blast.elapsedMs < blast.lifetimeMs;
      if (!active) {
        blast.sprite.destroy();
      }
      return active;
    });

    this.resolveCollisions();
    this.refreshTestState();
  }

  private buildWalls(): void {
    for (let x = 0; x < GRID_COLS; x += 1) {
      this.walls.add(tileKey({ x, y: 0 }));
      this.walls.add(tileKey({ x, y: GRID_ROWS - 1 }));
    }

    for (let y = 0; y < GRID_ROWS; y += 1) {
      this.walls.add(tileKey({ x: 0, y }));
      this.walls.add(tileKey({ x: GRID_COLS - 1, y }));
    }

    const centerPillars: TilePoint[] = [
      { x: 4, y: 2 },
      { x: 4, y: 4 },
      { x: 4, y: 6 },
      { x: 8, y: 2 },
      { x: 8, y: 4 },
      { x: 8, y: 6 }
    ];

    centerPillars.forEach((pillar) => this.walls.add(tileKey(pillar)));
  }

  private drawBoard(): void {
    for (let y = 0; y < GRID_ROWS; y += 1) {
      for (let x = 0; x < GRID_COLS; x += 1) {
        const center = tileToWorld({ x, y });
        const isWall = this.walls.has(tileKey({ x, y }));
        const tile = this.add.rectangle(center.x, center.y, TILE_SIZE - 1, TILE_SIZE - 1, isWall ? WALL_COLOR : FLOOR_COLOR);
        if (!isWall) {
          tile.setStrokeStyle(1, 0x2c3946, 0.5);
        }
      }
    }
  }

  private resetRound(mode: Mode): void {
    this.mode = mode;
    this.score = 0;
    this.player = { x: 2, y: 5 };
    this.moveSpriteToTile(this.playerSprite, this.player);

    this.enemies.forEach((enemy) => {
      enemy.pulseTween?.stop();
      enemy.sprite.destroy();
    });
    this.enemies = [];

    this.pickups.forEach((pickup) => pickup.sprite.destroy());
    this.pickups = [];

    this.clearBombAndBlasts();

    this.spawnEnemy('bot-a', { x: 8, y: 5 });

    this.spawnPickup('p-1', { x: 5, y: 2 });
    this.spawnPickup('p-2', { x: 5, y: 7 });

    this.overlayBackdrop.setVisible(mode !== 'play');
    this.overlayText.setVisible(mode !== 'play');
    this.overlayText.setText(this.overlayForMode(mode));
    this.hud.update(this.mode, this.enemiesLeft(), this.score);
    this.refreshTestState();
  }

  private spawnEnemy(id: string, tile: TilePoint): void {
    const center = tileToWorld(tile);
    const sprite = this.add.rectangle(center.x, center.y, TILE_SIZE * 0.65, TILE_SIZE * 0.65, ENEMY_COLOR);
    sprite.setStrokeStyle(2, 0x410000);
    const pulseTween = this.tweens.add({
      targets: sprite,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 420,
      yoyo: true,
      loop: -1
    });

    this.enemies.push({ id, ...tile, alive: true, sprite, pulseTween });
  }

  private spawnPickup(id: string, tile: TilePoint): void {
    const center = tileToWorld(tile);
    const sprite = this.add.star(center.x, center.y, 5, 6, 10, PICKUP_COLOR);
    sprite.setStrokeStyle(1, 0x483f07);
    this.tweens.add({
      targets: sprite,
      y: sprite.y - 4,
      duration: 520,
      yoyo: true,
      loop: -1,
      ease: 'Sine.InOut'
    });
    this.pickups.push({ id, ...tile, active: true, sprite });
  }

  private clearBombAndBlasts(): void {
    if (this.bomb) {
      this.bomb.pulseTween.stop();
      this.bomb.sprite.destroy();
      this.bomb = null;
    }

    this.blasts.forEach((blast) => blast.sprite.destroy());
    this.blasts = [];
  }

  private startPlay(): void {
    this.mode = 'play';
    this.overlayBackdrop.setVisible(false);
    this.overlayText.setVisible(false);
    this.hud.update(this.mode, this.enemiesLeft(), this.score);
    this.playTone('start');
    this.refreshTestState();
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.unlockAudio();

    if (this.mode === 'start' && event.code === 'Enter') {
      this.startPlay();
      return;
    }

    if ((this.mode === 'win' || this.mode === 'lose') && event.code === 'Enter') {
      this.resetRound('play');
      this.overlayBackdrop.setVisible(false);
      this.overlayText.setVisible(false);
      return;
    }

    if (this.mode !== 'play') {
      return;
    }

    if (event.code === 'Space') {
      this.placeBomb();
      return;
    }

    if (event.code === 'ArrowUp' || event.code === 'KeyW') {
      this.tryMovePlayer(0, -1);
    } else if (event.code === 'ArrowDown' || event.code === 'KeyS') {
      this.tryMovePlayer(0, 1);
    } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      this.tryMovePlayer(-1, 0);
    } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      this.tryMovePlayer(1, 0);
    }
  }

  private tryMovePlayer(dx: number, dy: number): void {
    const next = { x: this.player.x + dx, y: this.player.y + dy };
    if (this.blocked(next)) {
      this.tweens.add({
        targets: this.playerSprite,
        x: this.playerSprite.x + dx * 3,
        y: this.playerSprite.y + dy * 3,
        duration: 35,
        yoyo: true
      });
      return;
    }

    this.player = next;
    this.moveSpriteToTile(this.playerSprite, this.player);
    this.tweens.add({
      targets: this.playerSprite,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 55,
      yoyo: true
    });
    this.collectPickupAtPlayer();
    this.resolveCollisions();
    this.hud.update(this.mode, this.enemiesLeft(), this.score);
    this.refreshTestState();
  }

  private blocked(tile: TilePoint): boolean {
    if (this.walls.has(tileKey(tile))) {
      return true;
    }

    if (this.bomb && tileKey(this.bomb) === tileKey(tile)) {
      return true;
    }

    return false;
  }

  private placeBomb(): void {
    if (this.bomb) {
      return;
    }

    const center = tileToWorld(this.player);
    const sprite = this.add.ellipse(center.x, center.y, TILE_SIZE * 0.55, TILE_SIZE * 0.55, BOMB_COLOR);
    sprite.setStrokeStyle(2, 0xffffff);

    const pulseTween = this.tweens.add({
      targets: sprite,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 160,
      yoyo: true,
      loop: -1
    });

    this.bomb = {
      x: this.player.x,
      y: this.player.y,
      fuseMs: 900,
      elapsedMs: 0,
      sprite,
      pulseTween
    };

    this.playTone('bomb');
    this.refreshTestState();
  }

  private explodeBomb(): void {
    if (!this.bomb) {
      return;
    }

    const tile = { x: this.bomb.x, y: this.bomb.y };
    this.bomb.pulseTween.stop();
    this.bomb.sprite.destroy();
    this.bomb = null;

    blastTiles(tile)
      .filter((blastTile) => !this.walls.has(tileKey(blastTile)))
      .forEach((blastTile) => {
        const center = tileToWorld(blastTile);
        const sprite = this.add.rectangle(center.x, center.y, TILE_SIZE * 0.84, TILE_SIZE * 0.84, BLAST_COLOR, 0.95);
        sprite.setStrokeStyle(2, 0xffffff, 0.6);
        this.tweens.add({
          targets: sprite,
          alpha: 0.35,
          duration: 70,
          yoyo: true,
          repeat: -1
        });
        this.blasts.push({ ...blastTile, elapsedMs: 0, lifetimeMs: 280, sprite });
      });

    this.resolveCollisions();
    this.refreshTestState();
  }

  private collectPickupAtPlayer(): void {
    const playerKey = tileKey(this.player);
    this.pickups.forEach((pickup) => {
      if (!pickup.active || tileKey(pickup) !== playerKey) {
        return;
      }

      pickup.active = false;
      this.score += 50;
      this.playTone('pickup');
      this.tweens.add({
        targets: pickup.sprite,
        scaleX: 1.8,
        scaleY: 1.8,
        alpha: 0,
        duration: 180,
        onComplete: () => pickup.sprite.destroy()
      });
    });
  }

  private resolveCollisions(): void {
    if (this.mode !== 'play') {
      return;
    }

    if (hasBlastAt(this.blasts, this.player)) {
      this.setLose();
      return;
    }

    for (const enemy of this.enemies) {
      if (!enemy.alive) {
        continue;
      }

      if (tileKey(enemy) === tileKey(this.player)) {
        this.setLose();
        return;
      }

      if (hasBlastAt(this.blasts, enemy)) {
        enemy.alive = false;
        enemy.pulseTween?.stop();
        this.score += 200;
        this.tweens.add({
          targets: enemy.sprite,
          alpha: 0,
          scaleX: 1.7,
          scaleY: 1.7,
          duration: 180,
          onComplete: () => enemy.sprite.destroy()
        });
      }
    }

    if (this.enemiesLeft() === 0) {
      this.setWin();
    }

    this.hud.update(this.mode, this.enemiesLeft(), this.score);
  }

  private setWin(): void {
    this.mode = 'win';
    this.overlayBackdrop.setVisible(true);
    this.overlayBackdrop.setAlpha(0);
    this.tweens.add({ targets: this.overlayBackdrop, alpha: 0.52, duration: 180 });
    this.overlayText.setText(this.overlayForMode('win'));
    this.overlayText.setVisible(true);
    this.overlayText.setScale(0.9);
    this.tweens.add({ targets: this.overlayText, scaleX: 1, scaleY: 1, duration: 160, ease: 'Back.Out' });
    this.cameras.main.flash(250, 60, 220, 90);
    this.playTone('win');
    this.refreshTestState();
  }

  private setLose(): void {
    this.mode = 'lose';
    this.overlayBackdrop.setVisible(true);
    this.overlayBackdrop.setAlpha(0);
    this.tweens.add({ targets: this.overlayBackdrop, alpha: 0.52, duration: 180 });
    this.overlayText.setText(this.overlayForMode('lose'));
    this.overlayText.setVisible(true);
    this.overlayText.setScale(0.9);
    this.tweens.add({ targets: this.overlayText, scaleX: 1, scaleY: 1, duration: 160, ease: 'Back.Out' });
    this.cameras.main.shake(200, 0.006);
    this.cameras.main.flash(180, 240, 80, 80);
    this.playTone('lose');
    this.refreshTestState();
  }

  private overlayForMode(mode: Mode): string {
    if (mode === 'start') {
      return 'SENTRY SWEEP\n\nDefeat all bots with bombs.\nCollect stars for bonus score.\n\nPress Enter';
    }

    if (mode === 'win') {
      return `YOU WIN\nScore ${this.score}\n\nPress Enter to restart`;
    }

    if (mode === 'lose') {
      return `YOU LOSE\nScore ${this.score}\n\nPress Enter to restart`;
    }

    return '';
  }

  private enemiesLeft(): number {
    return this.enemies.filter((enemy) => enemy.alive).length;
  }

  private moveSpriteToTile(sprite: Phaser.GameObjects.Rectangle, tile: TilePoint): void {
    const center = tileToWorld(tile);
    sprite.setPosition(center.x, center.y);
  }

  private refreshTestState(): void {
    window.__GAME_TEST_STATE__ = {
      mode: this.mode,
      enemiesLeft: this.enemiesLeft(),
      score: this.score,
      player: { ...this.player },
      pickupsLeft: this.pickups.filter((pickup) => pickup.active).length
    };
  }

  private unlockAudio(): void {
    if (this.audioUnlocked) {
      return;
    }

    const Ctx = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) {
      return;
    }

    if (!this.audioContext) {
      this.audioContext = new Ctx();
    }

    void this.audioContext.resume().then(() => {
      this.audioUnlocked = true;
    });
  }

  private playTone(kind: 'start' | 'bomb' | 'pickup' | 'win' | 'lose'): void {
    if (!this.audioContext || this.audioContext.state !== 'running') {
      return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);

    if (kind === 'start') {
      oscillator.frequency.setValueAtTime(480, now);
      oscillator.frequency.linearRampToValueAtTime(620, now + 0.08);
    } else if (kind === 'bomb') {
      oscillator.frequency.setValueAtTime(240, now);
      oscillator.frequency.linearRampToValueAtTime(180, now + 0.12);
    } else if (kind === 'pickup') {
      oscillator.frequency.setValueAtTime(700, now);
      oscillator.frequency.linearRampToValueAtTime(920, now + 0.07);
    } else if (kind === 'win') {
      oscillator.frequency.setValueAtTime(520, now);
      oscillator.frequency.linearRampToValueAtTime(840, now + 0.22);
    } else {
      oscillator.frequency.setValueAtTime(300, now);
      oscillator.frequency.linearRampToValueAtTime(120, now + 0.18);
    }

    oscillator.type = kind === 'bomb' ? 'square' : 'triangle';
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    oscillator.start(now);
    oscillator.stop(now + 0.24);
  }
}
