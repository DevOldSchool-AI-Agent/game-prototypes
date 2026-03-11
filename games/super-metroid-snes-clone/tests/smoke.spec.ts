import { expect, test } from "@playwright/test";

test("core loop: title -> play -> result -> restart", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto("/");
  await page.waitForFunction(() => Boolean(window.gameTestApi));

  const initial = await page.evaluate(() => window.gameTestApi!.getState());
  expect(initial.scene).toBe("TitleScene");

  await page.keyboard.press("Enter");
  await page.waitForFunction(() => window.gameTestApi!.getState().scene === "PlayScene");

  await page.evaluate(() => window.gameTestApi!.forceWin());
  await page.waitForFunction(() => window.gameTestApi!.getState().scene === "ResultScene");

  await page.keyboard.press("R");
  await page.waitForFunction(() => window.gameTestApi!.getState().scene === "PlayScene");

  await page.evaluate(() => window.gameTestApi!.forceLose());
  await page.waitForFunction(() => window.gameTestApi!.getState().scene === "ResultScene");

  await page.screenshot({ path: "artifacts/smoke/final-result.png", fullPage: true });
  expect(consoleErrors).toEqual([]);
});
