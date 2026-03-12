import type { TilePoint } from '../entities/types';

export const TILE_SIZE = 32;
export const GRID_COLS = 13;
export const GRID_ROWS = 10;

export function tileKey(point: TilePoint): string {
  return `${point.x},${point.y}`;
}

export function tileToWorld(point: TilePoint): { x: number; y: number } {
  return {
    x: point.x * TILE_SIZE + TILE_SIZE / 2,
    y: point.y * TILE_SIZE + TILE_SIZE / 2
  };
}
