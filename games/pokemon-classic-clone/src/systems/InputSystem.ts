import Phaser from "phaser";

export type MovementVector = {
  x: number;
  y: number;
};

export class InputSystem {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly wasd: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene) {
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasd = scene.input.keyboard!.addKeys("W,A,S,D") as {
      W: Phaser.Input.Keyboard.Key;
      A: Phaser.Input.Keyboard.Key;
      S: Phaser.Input.Keyboard.Key;
      D: Phaser.Input.Keyboard.Key;
    };
  }

  getMovementVector(): MovementVector {
    let x = 0;
    let y = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      x -= 1;
    }

    if (this.cursors.right.isDown || this.wasd.D.isDown) {
      x += 1;
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      y -= 1;
    }

    if (this.cursors.down.isDown || this.wasd.S.isDown) {
      y += 1;
    }

    return { x, y };
  }
}
