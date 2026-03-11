import Phaser from 'phaser';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';

export class CombatSystem {
  private readonly scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  registerEnemyPlayerCollision(enemies: Phaser.Physics.Arcade.Group, player: Player, onPlayerDamaged: () => void): void {
    this.scene.physics.add.overlap(player, enemies, () => {
      if (player.damage(1)) {
        onPlayerDamaged();
      }
    });
  }

  tryAttack(enemies: Phaser.Physics.Arcade.Group, player: Player): number {
    if (!player.isAttacking) {
      return 0;
    }

    const hits = enemies.getChildren().filter((obj) => {
      const enemy = obj as Enemy;
      const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
      return distance < 70;
    }) as Enemy[];

    hits.forEach((enemy) => {
      this.scene.add.circle(enemy.x, enemy.y, 10, 0xfff5a5, 0.8).setDepth(8);
      enemy.destroy();
    });

    return hits.length;
  }
}
