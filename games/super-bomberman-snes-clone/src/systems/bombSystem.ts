import type { TilePoint } from '../entities/types';
import { tileKey } from './grid';

export type Bomb = TilePoint & {
  fuseMs: number;
  elapsedMs: number;
  sprite: Phaser.GameObjects.Ellipse;
  pulseTween: Phaser.Tweens.Tween;
};

export type Blast = TilePoint & {
  elapsedMs: number;
  lifetimeMs: number;
  sprite: Phaser.GameObjects.Rectangle;
};

export function blastTiles(origin: TilePoint): TilePoint[] {
  return [
    origin,
    { x: origin.x + 1, y: origin.y },
    { x: origin.x - 1, y: origin.y },
    { x: origin.x, y: origin.y + 1 },
    { x: origin.x, y: origin.y - 1 }
  ];
}

export function hasBlastAt(blasts: Blast[], tile: TilePoint): boolean {
  const key = tileKey(tile);
  return blasts.some((blast) => tileKey(blast) === key);
}
