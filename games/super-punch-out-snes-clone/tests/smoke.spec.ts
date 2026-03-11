import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

type PublicState = {
  mode: "playing" | "won" | "lost";
  phase: "idle" | "telegraph" | "strike" | "open";
  telegraphLane: "high" | "low";
  playerHp: number;
  opponentHp: number;
};

const artifactsDir = path.resolve(process.cwd(), "artifacts/smoke");

async function readState(page: import("@playwright/test").Page): Promise<PublicState> {
  return page.evaluate(() => window.__punchOutState as PublicState);
}

async function waitForState(page: import("@playwright/test").Page): Promise<void> {
  await expect
    .poll(async () => {
      const state = await page.evaluate(() => window.__punchOutState as PublicState | undefined);
      return state?.mode ?? null;
    })
    .not.toBeNull();
}

test.beforeAll(() => {
  fs.mkdirSync(artifactsDir, { recursive: true });
});

test("happy path reaches win through real input", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(String(err));
  });

  await page.goto("/");
  await page.keyboard.press("Enter");
  await waitForState(page);

  let lastPhase: PublicState["phase"] = "idle";

  for (let i = 0; i < 240; i += 1) {
    const state = await readState(page);

    if (state.mode === "won") {
      break;
    }

    if (state.phase === "strike" && lastPhase !== "strike") {
      await page.keyboard.press(state.telegraphLane === "high" ? "ArrowUp" : "ArrowDown");
    }

    if (state.phase === "open") {
      await page.keyboard.press("Space");
    }

    lastPhase = state.phase;
    await page.waitForTimeout(100);
  }

  const finalState = await readState(page);
  await page.screenshot({ path: path.join(artifactsDir, "happy-path.png"), fullPage: true });

  expect(finalState.mode).toBe("won");
  expect(finalState.opponentHp).toBe(0);
  expect(consoleErrors).toEqual([]);
});

test("fail path reaches lose through real input flow", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(String(err));
  });

  await page.goto("/");
  await page.keyboard.press("Enter");
  await waitForState(page);

  for (let i = 0; i < 180; i += 1) {
    const state = await readState(page);
    if (state.mode === "lost") {
      break;
    }
    await page.waitForTimeout(100);
  }

  const finalState = await readState(page);
  await page.screenshot({ path: path.join(artifactsDir, "fail-path.png"), fullPage: true });

  expect(finalState.mode).toBe("lost");
  expect(finalState.playerHp).toBe(0);
  expect(consoleErrors).toEqual([]);
});
