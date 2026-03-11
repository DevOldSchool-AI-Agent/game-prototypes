import Phaser from "phaser";

export function setupShotVsEnemy(
  scene: Phaser.Scene,
  shots: Phaser.Physics.Arcade.Group,
  enemies: Phaser.Physics.Arcade.Group,
  onEnemyDown: (x: number, y: number) => void
): void {
  scene.physics.add.overlap(shots, enemies, (shotObj, enemyObj) => {
    const shot = shotObj as Phaser.Physics.Arcade.Image;
    const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;
    shot.disableBody(true, true);
    enemy.disableBody(true, true);
    onEnemyDown(enemy.x, enemy.y);
  });
}
