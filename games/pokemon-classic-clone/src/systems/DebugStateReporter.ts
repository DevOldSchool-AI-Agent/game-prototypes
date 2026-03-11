import type { PublicGameState } from "../types";

export function installRenderHook(): void {
  window.render_game_to_text = () => {
    return JSON.stringify(window.__pokemonCloneState ?? { scene: "boot" });
  };
}

export function updatePublicState(state: PublicGameState): void {
  window.__pokemonCloneState = state;
}
