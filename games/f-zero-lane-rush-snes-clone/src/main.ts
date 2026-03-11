import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { PlayScene } from './scenes/PlayScene';
import { ResultScene } from './scenes/ResultScene';
import type { PublicGameState } from './types';

declare global {
  interface Window {
    render_game_to_text?: () => string;
    __FZERO_LANE_RUSH_STATE__?: PublicGameState;
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-root',
  width: 800,
  height: 720,
  backgroundColor: '#061323',
  scene: [BootScene, MenuScene, PlayScene, ResultScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 720
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
});

window.render_game_to_text = () => {
  const state = window.__FZERO_LANE_RUSH_STATE__;
  if (!state) {
    return JSON.stringify({ mode: 'menu', result: null });
  }
  return JSON.stringify(state);
};

window.__FZERO_LANE_RUSH_STATE__ = {
  mode: 'menu',
  result: null,
  elapsedMs: 0,
  shield: 3,
  score: 0,
  laneIndex: 1,
  objective: 'Survive until timer hits 0 while keeping shield above 0.'
};

void game;
