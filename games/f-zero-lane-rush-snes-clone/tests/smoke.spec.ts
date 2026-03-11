import { expect, test } from '@playwright/test';
import path from 'node:path';

const gameUrl = 'http://127.0.0.1:4173/';

const screenshotDir = path.resolve(process.cwd(), 'artifacts/playwright');

test.describe('f-zero lane rush smoke', () => {
  test('happy path reaches win using real controls', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(gameUrl);
    await page.keyboard.press('Enter');

    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(4300);
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(3300);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(1100);
    await page.keyboard.press('ArrowLeft');

    await expect
      .poll(async () => {
        const statePayload = await page.evaluate(() => window.render_game_to_text?.() ?? '{}');
        const state = JSON.parse(statePayload) as { result: string | null };
        return state.result;
      })
      .toBe('win');

    const statePayload = await page.evaluate(() => window.render_game_to_text?.() ?? '{}');
    const state = JSON.parse(statePayload) as { result: string | null; mode: string };
    expect(state.result).toBe('win');
    expect(consoleErrors).toHaveLength(0);

    await page.screenshot({ path: path.join(screenshotDir, 'happy-win.png'), fullPage: true });

    await page.keyboard.press('Enter');
    await expect
      .poll(async () => {
        const payload = await page.evaluate(() => window.render_game_to_text?.() ?? '{}');
        const menuState = JSON.parse(payload) as { mode: string };
        return menuState.mode;
      })
      .toBe('menu');
  });

  test('fail path reaches lose using real controls', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(gameUrl);
    await page.keyboard.press('Enter');

    await expect
      .poll(
        async () => {
          const statePayload = await page.evaluate(() => window.render_game_to_text?.() ?? '{}');
          const state = JSON.parse(statePayload) as { result: string | null };
          return state.result;
        },
        { timeout: 14_000 }
      )
      .toBe('lose');

    const statePayload = await page.evaluate(() => window.render_game_to_text?.() ?? '{}');
    const state = JSON.parse(statePayload) as { result: string | null; mode: string };
    expect(state.result).toBe('lose');
    expect(consoleErrors).toHaveLength(0);

    await page.screenshot({ path: path.join(screenshotDir, 'fail-lose.png'), fullPage: true });

    await page.keyboard.press('Enter');
    await expect
      .poll(async () => {
        const payload = await page.evaluate(() => window.render_game_to_text?.() ?? '{}');
        const menuState = JSON.parse(payload) as { mode: string };
        return menuState.mode;
      })
      .toBe('menu');
  });
});
