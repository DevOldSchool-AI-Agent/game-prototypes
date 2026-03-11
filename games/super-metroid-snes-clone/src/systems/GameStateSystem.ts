export type SceneName = "TitleScene" | "PlayScene" | "ResultScene";

export interface RuntimeState {
  scene: SceneName;
  stage: number;
  won: boolean;
  hp: number;
  timer: number;
}

export const runtimeState: RuntimeState = {
  scene: "TitleScene",
  stage: 1,
  won: false,
  hp: 5,
  timer: 75
};

export function setRuntimeState(partial: Partial<RuntimeState>): void {
  Object.assign(runtimeState, partial);
}
