import { expect, type Page } from "@playwright/test";

type Snapshot = {
  mode: "menu" | "playing" | "won" | "lost";
  swatter: { x: number; y: number };
  gnats: Array<{ id: number; x: number; y: number; alive: boolean }>;
  kills: number;
  targetKills: number;
};

export async function readState(page: Page): Promise<Snapshot> {
  return page.evaluate(() => window.gameTestApi.getState());
}

export async function startGame(page: Page): Promise<void> {
  await page.goto("/");
  await page.waitForFunction(() => window.gameTestApi.getState().mode === "menu");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => window.gameTestApi.getState().mode === "playing");
}

export async function moveSwatterTo(page: Page, x: number, y: number): Promise<void> {
  for (let i = 0; i < 80; i += 1) {
    const state = await readState(page);
    if (state.mode !== "playing") {
      return;
    }

    const dx = x - state.swatter.x;
    const dy = y - state.swatter.y;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
      return;
    }

    const keys: string[] = [];
    if (dx > 10) keys.push("ArrowRight");
    if (dx < -10) keys.push("ArrowLeft");
    if (dy > 10) keys.push("ArrowDown");
    if (dy < -10) keys.push("ArrowUp");

    for (const key of keys) {
      await page.keyboard.down(key);
    }
    await page.waitForTimeout(38);
    for (const key of keys) {
      await page.keyboard.up(key);
    }
  }
}

export interface ErrorCapture {
  pageErrors: string[];
  consoleErrors: string[];
}

export function beginErrorCapture(page: Page): ErrorCapture {
  const errors: ErrorCapture = { pageErrors: [], consoleErrors: [] };

  page.on("pageerror", (error) => {
    errors.pageErrors.push(error.message);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.consoleErrors.push(message.text());
    }
  });

  return errors;
}

export async function assertNoConsoleOrPageErrors(page: Page, errors: ErrorCapture): Promise<void> {
  await page.waitForTimeout(50);
  expect(errors.pageErrors, `page errors: ${errors.pageErrors.join(" | ")}`).toEqual([]);
  expect(errors.consoleErrors, `console errors: ${errors.consoleErrors.join(" | ")}`).toEqual([]);
}
