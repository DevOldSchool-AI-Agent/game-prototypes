export type Mode = 'start' | 'play' | 'win' | 'lose';

export type TilePoint = {
  x: number;
  y: number;
};

export type Enemy = TilePoint & {
  id: string;
  alive: boolean;
  sprite: Phaser.GameObjects.Rectangle;
  pulseTween?: Phaser.Tweens.Tween;
};

export type Pickup = TilePoint & {
  id: string;
  active: boolean;
  sprite: Phaser.GameObjects.Star;
};
