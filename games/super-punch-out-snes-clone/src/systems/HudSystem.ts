import type Phaser from "phaser";
import type { FightSnapshot } from "./FightSystem";

export class HudSystem {
  private readonly statusText: Phaser.GameObjects.Text;
  private readonly hpText: Phaser.GameObjects.Text;
  private readonly objectiveText: Phaser.GameObjects.Text;

  public constructor(scene: Phaser.Scene) {
    this.statusText = scene.add
      .text(42, 24, "", {
        fontFamily: "Verdana",
        fontSize: "24px",
        color: "#f8fafc"
      })
      .setDepth(5);

    this.hpText = scene.add
      .text(42, 58, "", {
        fontFamily: "Verdana",
        fontSize: "20px",
        color: "#fde68a"
      })
      .setDepth(5);

    this.objectiveText = scene.add
      .text(42, 688, "", {
        fontFamily: "Verdana",
        fontSize: "18px",
        color: "#bfdbfe"
      })
      .setDepth(5)
      .setOrigin(0, 1);
  }

  public update(snapshot: FightSnapshot): void {
    this.statusText.setText(`State: ${snapshot.mode.toUpperCase()}   Opponent: ${snapshot.phase.toUpperCase()} (${snapshot.telegraphLane})`);
    this.hpText.setText(
      `Player HP: ${snapshot.playerHp}   Rival HP: ${snapshot.opponentHp}   Time: ${snapshot.timerSeconds}s   Controls: Up=High Dodge Down=Low Dodge Space=Punch`
    );
    this.objectiveText.setText(`Objective: ${snapshot.objective}`);
  }
}
