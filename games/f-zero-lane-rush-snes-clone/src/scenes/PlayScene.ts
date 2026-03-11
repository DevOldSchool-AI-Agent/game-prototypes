import Phaser from 'phaser';
import { EnergyOrb } from '../entities/EnergyOrb';
import { Obstacle } from '../entities/Obstacle';
import { PlayerCar } from '../entities/PlayerCar';
import { TrackSystem } from '../systems/TrackSystem';
import type { PublicGameState, ResultState } from '../types';
import { Hud } from '../ui/Hud';

export class PlayScene extends Phaser.Scene {
  private readonly track = new TrackSystem();
  private player!: PlayerCar;
  private hud!: Hud;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  private obstacles: Obstacle[] = [];
  private pickups: EnergyOrb[] = [];

  private elapsedMs = 0;
  private shield = 3;
  private score = 0;
  private result: ResultState = null;

  constructor() {
    super('play');
  }

  create(): void {
    this.drawTrack();
    this.track.reset();

    this.player = new PlayerCar(this, this.track);
    this.hud = new Hud(this);
    this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;
    this.keyA = this.input.keyboard?.addKey('A') as Phaser.Input.Keyboard.Key;
    this.keyD = this.input.keyboard?.addKey('D') as Phaser.Input.Keyboard.Key;

    this.input.keyboard?.on('keydown-LEFT', () => this.player.shiftLane(-1, this.track));
    this.input.keyboard?.on('keydown-A', () => this.player.shiftLane(-1, this.track));
    this.input.keyboard?.on('keydown-RIGHT', () => this.player.shiftLane(1, this.track));
    this.input.keyboard?.on('keydown-D', () => this.player.shiftLane(1, this.track));

    this.updatePublicState();
  }

  update(_time: number, deltaMs: number): void {
    if (this.result !== null) {
      return;
    }

    this.elapsedMs += deltaMs;

    for (const spawn of this.track.pollDueSpawns(this.elapsedMs)) {
      if (spawn.kind === 'hazard') {
        this.obstacles.push(new Obstacle(this, this.track.laneX(spawn.laneIndex), this.track.trackTopY, spawn.laneIndex));
      } else {
        this.pickups.push(new EnergyOrb(this, this.track.laneX(spawn.laneIndex), this.track.trackTopY, spawn.laneIndex));
      }
    }

    const dt = deltaMs / 1000;
    let feedback = '';

    this.obstacles = this.obstacles.filter((obstacle) => {
      obstacle.step(dt);

      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.bounds(), obstacle.getBounds())) {
        obstacle.destroy();
        this.shield -= 1;
        feedback = 'Impact! Shield -1';
        this.player.flashDamage();
        return false;
      }

      if (obstacle.y > this.track.trackBottomY) {
        obstacle.destroy();
        return false;
      }

      return true;
    });

    this.pickups = this.pickups.filter((pickup) => {
      pickup.step(dt);

      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.bounds(), pickup.getBounds())) {
        pickup.destroy();
        this.score += 150;
        feedback = 'Energy +150';
        return false;
      }

      if (pickup.y > this.track.trackBottomY) {
        pickup.destroy();
        return false;
      }

      return true;
    });

    if (this.shield <= 0) {
      this.finish('lose');
      return;
    }

    if (this.elapsedMs >= this.track.winTimeMs) {
      this.finish('win');
      return;
    }

    this.hud.update({
      shield: this.shield,
      score: this.score,
      timeRemainingSec: Math.ceil((this.track.winTimeMs - this.elapsedMs) / 1000),
      objective: this.track.objectiveText,
      feedback
    });

    this.updatePublicState();
  }

  private finish(outcome: Exclude<ResultState, null>): void {
    this.result = outcome;
    this.updatePublicState();
    this.scene.start('result', { result: outcome, score: this.score });
  }

  private updatePublicState(): void {
    const state: PublicGameState = {
      mode: this.result === null ? 'play' : 'result',
      result: this.result,
      elapsedMs: Math.round(this.elapsedMs),
      shield: this.shield,
      score: this.score,
      laneIndex: this.player?.laneIndex ?? 1,
      objective: this.track.objectiveText
    };

    (window as Window & { __FZERO_LANE_RUSH_STATE__?: PublicGameState }).__FZERO_LANE_RUSH_STATE__ = state;
  }

  private drawTrack(): void {
    this.add.rectangle(400, 360, 800, 720, 0x081529);
    this.add.rectangle(400, 360, 440, 720, 0x12273d);
    this.add.rectangle(320, 360, 4, 720, 0x5f7f9e, 0.6);
    this.add.rectangle(480, 360, 4, 720, 0x5f7f9e, 0.6);
  }
}
