import type { StageConfig } from '../types';

const STAGES: StageConfig[] = [
  {
    id: 1,
    name: 'Onett Suburbs',
    enemyQuota: 4,
    timeLimitSec: 45,
    enemySpeed: 58,
    palette: { bgTop: 0xa1d4ff, bgBottom: 0xd9f0ff, ground: 0x88c06d, accent: 0x3f7630 }
  },
  {
    id: 2,
    name: 'Twoson Crosswalks',
    enemyQuota: 6,
    timeLimitSec: 50,
    enemySpeed: 70,
    palette: { bgTop: 0xffce8e, bgBottom: 0xfff2d6, ground: 0xc2a66b, accent: 0x7b5625 }
  },
  {
    id: 3,
    name: 'Saturn Valley Edge',
    enemyQuota: 8,
    timeLimitSec: 60,
    enemySpeed: 82,
    palette: { bgTop: 0xa0a2f5, bgBottom: 0xd7d6ff, ground: 0x8d83b8, accent: 0x45396f }
  }
];

export class StageSystem {
  private index = 0;

  public get current(): StageConfig {
    return STAGES[this.index];
  }

  public get currentIndex(): number {
    return this.index;
  }

  public advance(): boolean {
    if (this.index >= STAGES.length - 1) {
      return false;
    }
    this.index += 1;
    return true;
  }

  public reset(): void {
    this.index = 0;
  }

  public totalStages(): number {
    return STAGES.length;
  }
}
