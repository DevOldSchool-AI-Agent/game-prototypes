import { expect, test } from "@playwright/test";
import { assertNoConsoleOrPageErrors, beginErrorCapture, readState, startGame } from "./helpers";

test.describe("smoke gameplay", () => {
  test("happy path reaches win through real input", async ({ page }) => {
    const errors = beginErrorCapture(page);
    await startGame(page);

    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.down("Space");
      await page.waitForTimeout(80);
      await page.keyboard.up("Space");
      await page.waitForTimeout(90);
    }

    await page.waitForFunction(() => window.gameTestApi.getState().mode === "won", undefined, { timeout: 12000 });
    const wonState = await readState(page);
    expect(wonState.mode).toBe("won");

    await page.screenshot({ path: "artifacts/smoke/happy-path.png", fullPage: true });
    await assertNoConsoleOrPageErrors(page, errors);
  });

  test("fail path reaches lose through real input flow", async ({ page }) => {
    const errors = beginErrorCapture(page);
    await startGame(page);

    await page.waitForFunction(() => window.gameTestApi.getState().mode === "lost", undefined, { timeout: 23000 });
    const lostState = await readState(page);
    expect(lostState.mode).toBe("lost");

    await page.screenshot({ path: "artifacts/smoke/fail-path.png", fullPage: true });
    await assertNoConsoleOrPageErrors(page, errors);
  });
});
