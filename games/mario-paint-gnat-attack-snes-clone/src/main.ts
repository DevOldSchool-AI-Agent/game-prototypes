import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { MenuScene } from "./scenes/MenuScene";
import { PlayScene } from "./scenes/PlayScene";
import { ResultScene } from "./scenes/ResultScene";
import { getGameSnapshot } from "./systems/GameStateBridge";

declare global {
  interface Window {
    render_game_to_text: () => string;
    advanceTime: (ms: number) => void;
    gameTestApi: {
      getState: () => ReturnType<typeof getGameSnapshot>;
    };
  }
}

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#f2d398",
  physics: {
    default: "arcade",
    arcade: { debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  scene: [BootScene, MenuScene, PlayScene, ResultScene]
};

const game = new Phaser.Game(config);

window.render_game_to_text = () => JSON.stringify(getGameSnapshot());
window.gameTestApi = {
  getState: () => getGameSnapshot()
};
window.advanceTime = (ms: number) => {
  game.step(performance.now(), ms / 1000);
};

window.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key.toLowerCase() !== "f") {
    return;
  }

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
    return;
  }

  document.documentElement.requestFullscreen().catch(() => {});
});
