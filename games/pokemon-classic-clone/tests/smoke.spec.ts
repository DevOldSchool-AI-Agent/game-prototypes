import fs from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

type StateSnapshot = {
  scene: string;
  outcome?: string;
  stage?: number;
  hearts?: number;
  message?: string;
};

async function readState(page: Page): Promise<StateSnapshot> {
  const payload = await page.evaluate(() => {
    return window.render_game_to_text ? window.render_game_to_text() : "{}";
  });

  return JSON.parse(payload) as StateSnapshot;
}

test("core loop supports start, win, restart, and lose without runtime errors", async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on("pageerror", (error) => {
    consoleErrors.push(`pageerror: ${error.message}`);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(`console.error: ${message.text()}`);
    }
  });

  const artifactDir = path.join(process.cwd(), "artifacts", "smoke");
  await fs.mkdir(artifactDir, { recursive: true });

  await page.goto("/");

  await expect
    .poll(async () => {
      const state = await readState(page);
      return state.scene;
    })
    .toBe("menu");

  await page.screenshot({ path: path.join(artifactDir, "menu.png") });

  await page.keyboard.press("Space");

  await expect
    .poll(async () => {
      const state = await readState(page);
      return state.scene;
    })
    .toBe("play");

  for (let index = 0; index < 3; index += 1) {
    await page.evaluate(() => {
      window.__pokemonQa?.forceCollectStage();
    });
    await page.waitForTimeout(650);
  }

  await expect
    .poll(async () => {
      const state = await readState(page);
      return state.outcome;
    })
    .toBe("win");

  await page.screenshot({ path: path.join(artifactDir, "win-result.png") });

  await page.keyboard.press("KeyR");

  await expect
    .poll(async () => {
      const state = await readState(page);
      return state.scene;
    })
    .toBe("play");

  await page.evaluate(() => {
    window.__pokemonQa?.forceLose();
  });

  await expect
    .poll(async () => {
      const state = await readState(page);
      return state.outcome;
    })
    .toBe("lose");

  const finalState = await readState(page);

  await page.screenshot({ path: path.join(artifactDir, "lose-result.png") });
  await fs.writeFile(
    path.join(artifactDir, "state-final.json"),
    JSON.stringify(finalState, null, 2),
    "utf8"
  );

  expect(consoleErrors, `Detected runtime/console errors:\n${consoleErrors.join("\n")}`).toEqual([]);
});
