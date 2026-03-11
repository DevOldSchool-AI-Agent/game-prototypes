import Phaser from "phaser";

export class InputController {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly wasd: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private readonly swatKey: Phaser.Input.Keyboard.Key;
  private swatLatched = false;

  constructor(scene: Phaser.Scene) {
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    this.swatKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  public getAxis(): Phaser.Math.Vector2 {
    const axis = new Phaser.Math.Vector2(0, 0);

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      axis.x -= 1;
    }
    if (this.cursors.right.isDown || this.wasd.right.isDown) {
      axis.x += 1;
    }
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      axis.y -= 1;
    }
    if (this.cursors.down.isDown || this.wasd.down.isDown) {
      axis.y += 1;
    }

    return axis.normalize();
  }

  public consumeSwat(): boolean {
    if (this.swatKey.isDown && !this.swatLatched) {
      this.swatLatched = true;
      return true;
    }

    if (!this.swatKey.isDown) {
      this.swatLatched = false;
    }

    return false;
  }
}
