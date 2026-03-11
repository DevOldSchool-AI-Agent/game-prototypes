import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { PlayScene } from './scenes/PlayScene';
import { ResultScene } from './scenes/ResultScene';

const TARGET_W = 1280;
const TARGET_H = 720;

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-root',
  width: TARGET_W,
  height: TARGET_H,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: TARGET_W,
    height: TARGET_H
  },
  scene: [BootScene, MenuScene, PlayScene, ResultScene]
});

const resize = () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
  game.scale.setZoom(Math.min(window.innerWidth / TARGET_W, window.innerHeight / TARGET_H));
};

window.addEventListener('resize', resize);
resize();
