import Phaser from "phaser";

export type InputIntent = {
  moveX: number;
  moveY: number;
  attackPressed: boolean;
  startPressed: boolean;
};

export class InputController {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly wasd: { w: Phaser.Input.Keyboard.Key; a: Phaser.Input.Keyboard.Key; s: Phaser.Input.Keyboard.Key; d: Phaser.Input.Keyboard.Key };
  private readonly attackKey: Phaser.Input.Keyboard.Key;
  private readonly startKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasd = {
      w: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    this.attackKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.startKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  public read(): InputIntent {
    const left = this.cursors.left.isDown || this.wasd.a.isDown;
    const right = this.cursors.right.isDown || this.wasd.d.isDown;
    const up = this.cursors.up.isDown || this.wasd.w.isDown;
    const down = this.cursors.down.isDown || this.wasd.s.isDown;

    return {
      moveX: Number(right) - Number(left),
      moveY: Number(down) - Number(up),
      attackPressed: Phaser.Input.Keyboard.JustDown(this.attackKey),
      startPressed: Phaser.Input.Keyboard.JustDown(this.startKey)
    };
  }
}
