import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { TitleScene } from "./scenes/TitleScene";
import { PlayScene } from "./scenes/PlayScene";
import { ResultScene } from "./scenes/ResultScene";

declare global {
  interface Window {
    gameTestApi?: {
      getState: () => { scene: string; stage: number; won: boolean; hp: number; timer: number };
      start: () => void;
      forceWin: () => void;
      forceLose: () => void;
      restart: () => void;
    };
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 960,
  height: 540,
  backgroundColor: "#080b14",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 820, x: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, TitleScene, PlayScene, ResultScene]
};

new Phaser.Game(config);
