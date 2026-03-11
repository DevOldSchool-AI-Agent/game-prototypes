import Phaser from 'phaser';
import { TrackSystem } from '../systems/TrackSystem';

export class PlayerCar extends Phaser.GameObjects.Container {
  laneIndex = 1;

  private readonly bodyRect: Phaser.GameObjects.Rectangle;
  private readonly trimRect: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, track: TrackSystem) {
    const x = track.laneX(1);
    const y = 640;
    super(scene, x, y);

    this.bodyRect = scene.add.rectangle(0, 0, 62, 96, 0x2ad1f0);
    this.trimRect = scene.add.rectangle(0, 12, 30, 40, 0xfff36d);
    this.add([this.bodyRect, this.trimRect]);

    this.setSize(62, 96);
    scene.add.existing(this);
  }

  shiftLane(delta: number, track: TrackSystem): void {
    const maxLane = track.laneCount() - 1;
    const nextLane = Phaser.Math.Clamp(this.laneIndex + delta, 0, maxLane);
    if (nextLane === this.laneIndex) {
      return;
    }

    this.laneIndex = nextLane;
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      x: track.laneX(this.laneIndex),
      duration: 90,
      ease: 'Sine.Out'
    });
  }

  flashDamage(): void {
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 220,
      yoyo: true,
      onUpdate: (tween) => {
        const alphaValue = tween.getValue() ?? 1;
        const alpha = alphaValue < 0.5 ? 0.5 : 1;
        this.setAlpha(alpha);
      },
      onComplete: () => this.setAlpha(1)
    });
  }

  bounds(): Phaser.Geom.Rectangle {
    return this.getBounds();
  }
}
