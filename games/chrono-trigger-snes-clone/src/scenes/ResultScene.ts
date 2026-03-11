import Phaser from "phaser";

type ResultData = {
  won: boolean;
  failedStageName: string | null;
  score: number;
  reachedStage: number;
};

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("result");
  }

  public create(data: ResultData): void {
    this.cameras.main.setBackgroundColor(data.won ? 0x17312b : 0x2f1822);
    const { width, height } = this.scale;

    const title = data.won ? "Timeline Stabilized" : "Temporal Collapse";
    const subtitle = data.won
      ? "You restored all three eras."
      : `Failure in ${data.failedStageName ?? "unknown era"}.`;

    this.add.text(width * 0.5, height * 0.33, title, {
      fontFamily: "Trebuchet MS",
      fontSize: "50px",
      color: data.won ? "#8cffd0" : "#ff9ab8",
      stroke: "#101420",
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(width * 0.5, height * 0.49, `${subtitle}\nScore: ${data.score}\nStages Reached: ${data.reachedStage}/3`, {
      align: "center",
      fontFamily: "Trebuchet MS",
      fontSize: "24px",
      color: "#edf2ff",
      lineSpacing: 10
    }).setOrigin(0.5);

    this.add.text(width * 0.5, height * 0.72, "Press R to restart or M for menu", {
      fontFamily: "Trebuchet MS",
      fontSize: "24px",
      color: "#d5def7"
    }).setOrigin(0.5);

    this.input.keyboard?.once("keydown-R", () => {
      this.scene.start("play", { stageIndex: 0, totalScore: 0 });
    });
    this.input.keyboard?.once("keydown-M", () => {
      this.scene.start("menu");
    });
  }
}
