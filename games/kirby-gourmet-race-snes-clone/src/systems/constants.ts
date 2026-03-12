import type { Point } from '../entities/types';

export const PLAY_BOUNDS = {
  left: 20,
  right: 396,
  top: 82,
  bottom: 304
};

export const PICKUP_ROUTE: Point[] = [
  { x: 100, y: 108 },
  { x: 150, y: 126 },
  { x: 200, y: 108 },
  { x: 250, y: 126 },
  { x: 300, y: 108 }
];

export const HAZARD_ROUTE: Point[] = [
  { x: 320, y: 104 },
  { x: 320, y: 260 },
  { x: 118, y: 260 },
  { x: 118, y: 104 }
];
