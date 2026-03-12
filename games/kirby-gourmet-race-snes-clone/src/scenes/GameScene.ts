import Phaser from 'phaser';
import type { Mode, Pickup, Point } from '../entities/types';
import { HAZARD_ROUTE, PICKUP_ROUTE, PLAY_BOUNDS } from '../systems/constants';
import { Hud } from '../ui/hud';

declare global {
  interface Window {
    render_game_to_text: () => string;
    advanceTime: (ms: number) => Promise<void>;
    __GAME_TEST_STATE__?: {
      mode: Mode;
      score: number;
      target: number;
      hp: number;
      timeLeftMs: number;
      player: Point;
      activePickup: Point | null;
    };
  }
}

const PLAYER_COLOR = 0xffb3d9;
const HAZARD_COLOR = 0xff8e56;
const FIELD_COLOR = 0x264653;
const FIELD_ALT = 0x2f5f6d;

const PLAYER_SPEED = 132;
const DASH_SPEED = 255;
const DASH_DURATION_MS = 260;
const DASH_COOLDOWN_MS = 1150;
const TIMER_START_MS = 9000;
const TARGET_SCORE = 5;

export class GameScene extends Phaser.Scene {
  private mode: Mode = 'start';
  private score = 0;
  private hp = 3;
  private timeLeftMs = TIMER_START_MS;

  private playerPos: Point = { x: 70, y: 126 };
  private playerSprite!: any;
  private hazardPos: Point = { ...HAZARD_ROUTE[0] };
  private hazardSprite!: any;
  private hazardWaypointIndex = 1;
  private readonly hazardSpeed = 72;

  private pickups: Pickup[] = [];

  private dashRemainingMs = 0;
  private dashCooldownMs = 0;
  private lastMove: Point = { x: 1, y: 0 };
  private invulnRemainingMs = 0;

  private overlayBackdrop!: any;
  private overlayText!: any;

  private hud!: Hud;

  private cursors!: any;
  private keyW!: any;
  private keyA!: any;
  private keyS!: any;
  private keyD!: any;
  private keySpace!: any;
  private keyEnter!: any;

  private audioContext: AudioContext | null = null;
  private audioUnlocked = false;

  constructor() {
    super('game');
  }

  public create(): void {
    this.drawArena();

    this.playerSprite = this.add.circle(this.playerPos.x, this.playerPos.y, 11, PLAYER_COLOR).setDepth(2);
    this.playerSprite.setStrokeStyle(2, 0xffffff);

    this.hazardSprite = this.add.rectangle(this.hazardPos.x, this.hazardPos.y, 22, 22, HAZARD_COLOR).setDepth(2);
    this.hazardSprite.setStrokeStyle(2, 0x4d1b00);

    this.overlayBackdrop = this.add
      .rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.58)
      .setDepth(6)
      .setVisible(true);

    this.overlayText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, '', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#ffffff',
        align: 'center',
        backgroundColor: '#00000088'
      })
      .setOrigin(0.5)
      .setPadding(16, 14, 16, 14)
      .setDepth(7);

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
    this.refreshHudAndState();

    window.render_game_to_text = () =>
      JSON.stringify({
        mode: this.mode,
        score: this.score,
        target: TARGET_SCORE,
        hp: this.hp,
        timeLeftMs: this.timeLeftMs,
        player: this.playerPos,
        activePickup: this.pickups.find((pickup) => pickup.active)
          ? {
              x: this.pickups.find((pickup) => pickup.active)!.x,
              y: this.pickups.find((pickup) => pickup.active)!.y
            }
          : null,
        objective: 'Collect all treats before time runs out'
      });

    window.advanceTime = async (ms: number) => {
      await new Promise<void>((resolve) => this.time.delayedCall(ms, () => resolve()));
    };
  }

  public update(_time: number, delta: number): void {
    if (this.mode !== 'play') {
      return;
    }

    this.timeLeftMs = Math.max(0, this.timeLeftMs - delta);
    if (this.timeLeftMs === 0) {
      this.finishRound('lose', 'time');
      return;
    }

    this.invulnRemainingMs = Math.max(0, this.invulnRemainingMs - delta);
    this.dashRemainingMs = Math.max(0, this.dashRemainingMs - delta);
    this.dashCooldownMs = Math.max(0, this.dashCooldownMs - delta);

    const movement = this.readMovementInput();
    this.applyPlayerMovement(movement, delta);
    this.moveHazard(delta);
    this.tryCollectPickup();
    this.checkDamageContact();

    this.refreshHudAndState();
  }

  private drawArena(): void {
    this.add.rectangle(208, 193, 390, 230, FIELD_COLOR, 1).setDepth(0);
    this.add.rectangle(208, 193, 386, 226, FIELD_ALT, 0.8).setDepth(0);

    for (let x = PLAY_BOUNDS.left + 12; x < PLAY_BOUNDS.right; x += 48) {
      this.add.rectangle(x, PLAY_BOUNDS.top + 20, 20, 8, 0x4b8f8c, 0.85).setDepth(1);
      this.add.rectangle(x + 14, PLAY_BOUNDS.bottom - 14, 18, 8, 0x5a9c58, 0.85).setDepth(1);
    }

    this.add
      .rectangle(208, 192, PLAY_BOUNDS.right - PLAY_BOUNDS.left, PLAY_BOUNDS.bottom - PLAY_BOUNDS.top, 0xffffff, 0)
      .setStrokeStyle(2, 0xa8d4d1, 0.7)
      .setDepth(1);
  }

  private resetRound(mode: Mode): void {
    this.mode = mode;
    this.score = 0;
    this.hp = 3;
    this.timeLeftMs = TIMER_START_MS;

    this.playerPos = { x: 70, y: 126 };
    this.playerSprite.setPosition(this.playerPos.x, this.playerPos.y);
    this.playerSprite.setFillStyle(PLAYER_COLOR);
    this.playerSprite.setAlpha(1);

    this.hazardPos = { ...HAZARD_ROUTE[0] };
    this.hazardWaypointIndex = 1;
    this.hazardSprite.setPosition(this.hazardPos.x, this.hazardPos.y);

    this.dashRemainingMs = 0;
    this.dashCooldownMs = 0;
    this.invulnRemainingMs = 0;

    this.pickups.forEach((pickup) => pickup.sprite.destroy());
    this.pickups = [];
    PICKUP_ROUTE.forEach((position, index) => {
      const sprite = this.add.star(position.x, position.y, 5, 6, 11, 0xffe97a).setDepth(2);
      sprite.setStrokeStyle(1, 0x6a5b1a);
      this.pickups.push({ id: `pickup-${index}`, x: position.x, y: position.y, active: true, sprite });
      this.tweens.add({
        targets: sprite,
        angle: 12,
        yoyo: true,
        repeat: -1,
        duration: 380 + index * 60
      });
    });

    this.overlayBackdrop.setVisible(mode !== 'play');
    this.overlayText.setVisible(mode !== 'play');
    this.overlayText.setText(this.overlayMessage(mode));
    this.overlayBackdrop.setFillStyle(0x000000, 0.58);

    this.refreshHudAndState();
  }

  private overlayMessage(mode: Mode, reason: 'goal' | 'time' | 'damage' = 'goal'): string {
    if (mode === 'start') {
      return 'KIRBY GOURMET DASH\n\nCollect 5 treats before time runs out.\nAvoid Chef Kawasaki and use dash wisely.\n\nPress Enter to start';
    }
    if (mode === 'win') {
      return 'YOU WIN\n\nKirby cleared the plate.\n\nPress Enter to race again';
    }
    const loseDetail = reason === 'time' ? 'Time ran out before the plate was cleared.' : 'Chef Kawasaki tagged you too many times.';
    return `YOU LOSE\n\n${loseDetail}\n\nPress Enter to restart`;
  }

  private handleKeyDown(): void {
    this.tryUnlockAudio();

    if (Phaser.Input.Keyboard.JustDown(this.keyEnter) && this.mode !== 'play') {
      this.resetRound('play');
      this.playTone(660, 0.05, 0.035);
      this.time.delayedCall(70, () => this.playTone(820, 0.04, 0.03));
      return;
    }

    if (this.mode !== 'play') {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keySpace) && this.dashCooldownMs === 0 && this.dashRemainingMs === 0) {
      this.dashRemainingMs = DASH_DURATION_MS;
      this.dashCooldownMs = DASH_COOLDOWN_MS;
      this.playerSprite.setFillStyle(0xffdff0);
      this.playTone(540, 0.045, 0.05);
    }
  }

  private readMovementInput(): Point {
    let x = 0;
    let y = 0;

    if (this.cursors.left.isDown || this.keyA.isDown) {
      x -= 1;
    }
    if (this.cursors.right.isDown || this.keyD.isDown) {
      x += 1;
    }
    if (this.cursors.up.isDown || this.keyW.isDown) {
      y -= 1;
    }
    if (this.cursors.down.isDown || this.keyS.isDown) {
      y += 1;
    }

    if (x !== 0 || y !== 0) {
      this.lastMove = { x, y };
    }

    return { x, y };
  }

  private applyPlayerMovement(movement: Point, delta: number): void {
    const magnitude = Math.hypot(movement.x, movement.y) || 1;
    const speed = this.dashRemainingMs > 0 ? DASH_SPEED : PLAYER_SPEED;
    const distance = (speed * delta) / 1000;

    const nextX = this.playerPos.x + (movement.x / magnitude) * distance;
    const nextY = this.playerPos.y + (movement.y / magnitude) * distance;

    this.playerPos.x = Phaser.Math.Clamp(nextX, PLAY_BOUNDS.left, PLAY_BOUNDS.right);
    this.playerPos.y = Phaser.Math.Clamp(nextY, PLAY_BOUNDS.top, PLAY_BOUNDS.bottom);

    this.playerSprite.setPosition(this.playerPos.x, this.playerPos.y);

    if (this.dashRemainingMs === 0 && this.playerSprite.fillColor !== PLAYER_COLOR) {
      this.playerSprite.setFillStyle(PLAYER_COLOR);
    }
  }

  private moveHazard(delta: number): void {
    const target = HAZARD_ROUTE[this.hazardWaypointIndex];
    const dx = target.x - this.hazardPos.x;
    const dy = target.y - this.hazardPos.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 0.001) {
      this.hazardWaypointIndex = (this.hazardWaypointIndex + 1) % HAZARD_ROUTE.length;
      return;
    }

    const step = (this.hazardSpeed * delta) / 1000;
    if (step >= distance) {
      this.hazardPos.x = target.x;
      this.hazardPos.y = target.y;
      this.hazardWaypointIndex = (this.hazardWaypointIndex + 1) % HAZARD_ROUTE.length;
    } else {
      this.hazardPos.x += (dx / distance) * step;
      this.hazardPos.y += (dy / distance) * step;
    }

    this.hazardSprite.setPosition(this.hazardPos.x, this.hazardPos.y);
  }

  private tryCollectPickup(): void {
    const pickup = this.pickups.find((item) => item.active);
    if (!pickup) {
      return;
    }

    const distance = Phaser.Math.Distance.Between(this.playerPos.x, this.playerPos.y, pickup.x, pickup.y);
    if (distance > 20) {
      return;
    }

    pickup.active = false;
    this.score += 1;

    this.tweens.add({
      targets: pickup.sprite,
      scaleX: 1.4,
      scaleY: 1.4,
      alpha: 0,
      duration: 120,
      onComplete: () => pickup.sprite.destroy()
    });
    for (let i = 0; i < 6; i += 1) {
      const spark = this.add.circle(pickup.x, pickup.y, 3, 0xfff4a5).setDepth(2);
      const angle = (Math.PI * 2 * i) / 6;
      this.tweens.add({
        targets: spark,
        x: pickup.x + Math.cos(angle) * 18,
        y: pickup.y + Math.sin(angle) * 18,
        alpha: 0,
        duration: 180,
        onComplete: () => spark.destroy()
      });
    }
    this.cameras.main.shake(80, 0.0015);
    this.playTone(900, 0.028, 0.04);

    if (this.score >= TARGET_SCORE) {
      this.finishRound('win', 'goal');
    }
  }

  private checkDamageContact(): void {
    if (this.invulnRemainingMs > 0) {
      this.playerSprite.setAlpha(0.55 + Math.sin(this.time.now * 0.02) * 0.25);
      return;
    }

    this.playerSprite.setAlpha(1);
    const distance = Phaser.Math.Distance.Between(this.playerPos.x, this.playerPos.y, this.hazardPos.x, this.hazardPos.y);
    if (distance > 20) {
      return;
    }

    this.hp -= 1;
    this.invulnRemainingMs = 700;
    this.playerSprite.setFillStyle(0xff7a9f);
    this.time.delayedCall(180, () => {
      if (this.mode === 'play') {
        this.playerSprite.setFillStyle(PLAYER_COLOR);
      }
    });
    this.cameras.main.shake(120, 0.0028);
    this.playTone(180, 0.06, 0.06);

    if (this.hp <= 0) {
      this.finishRound('lose', 'damage');
    }
  }

  private finishRound(mode: Extract<Mode, 'win' | 'lose'>, reason: 'goal' | 'time' | 'damage'): void {
    this.mode = mode;
    this.overlayBackdrop.setVisible(true);
    this.overlayText.setVisible(true);
    this.overlayText.setText(this.overlayMessage(mode, reason));
    this.overlayBackdrop.setFillStyle(mode === 'win' ? 0x113121 : 0x3a1414, 0.72);
    this.overlayText.setScale(0.8);
    this.tweens.add({
      targets: this.overlayText,
      scaleX: 1,
      scaleY: 1,
      duration: 160,
      ease: 'Back.Out'
    });
    this.playTone(mode === 'win' ? 760 : 150, 0.08, 0.07);
    if (mode === 'win') {
      this.time.delayedCall(95, () => this.playTone(980, 0.06, 0.06));
    } else {
      this.time.delayedCall(95, () => this.playTone(120, 0.08, 0.05));
    }
    this.refreshHudAndState();
  }

  private refreshHudAndState(): void {
    this.hud.update(this.mode, this.score, TARGET_SCORE, this.hp, this.timeLeftMs, this.dashCooldownMs === 0);

    const activePickup = this.pickups.find((pickup) => pickup.active);
    window.__GAME_TEST_STATE__ = {
      mode: this.mode,
      score: this.score,
      target: TARGET_SCORE,
      hp: this.hp,
      timeLeftMs: this.timeLeftMs,
      player: { ...this.playerPos },
      activePickup: activePickup ? { x: activePickup.x, y: activePickup.y } : null
    };
  }

  private tryUnlockAudio(): void {
    if (this.audioUnlocked) {
      return;
    }

    const Ctor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) {
      this.audioUnlocked = true;
      return;
    }

    this.audioContext = this.audioContext ?? new Ctor();
    void this.audioContext.resume();
    this.audioUnlocked = true;
  }

  private playTone(frequency: number, durationSeconds: number, volume: number): void {
    if (!this.audioContext || this.audioContext.state !== 'running') {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = 'square';
    gain.gain.value = volume;

    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + durationSeconds);
  }
}
