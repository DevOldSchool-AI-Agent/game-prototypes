import { expect, test } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const gameUrl = pathToFileURL(path.resolve(process.cwd(), 'dist/index.html')).toString();

test.describe('earthbound loop smoke', () => {
  test('start -> play -> win -> restart', async ({ page }) => {
    await page.goto(gameUrl);

    await page.keyboard.press('Enter');
    await page.waitForTimeout(250);

    for (let i = 0; i < 3; i += 1) {
      await page.evaluate(() => {
        window.__EARTHBOUND_TEST__?.forceClearStage();
      });
      await page.waitForTimeout(120);
    }

    await expect(page.getByText('YOU SAVED THE TOWN')).toBeVisible();

    await page.keyboard.press('Enter');
    await expect(page.getByText('Press Enter to Start')).toBeVisible();
  });

  test('lose flow is reachable', async ({ page }) => {
    await page.goto(gameUrl);
    await page.keyboard.press('Enter');

    await page.evaluate(() => {
      window.__EARTHBOUND_TEST__?.forceLose();
    });

    await expect(page.getByText('NINTEN IS DOWN')).toBeVisible();

    const render = await page.evaluate(() => {
      const fn = window.render_game_to_text;
      return typeof fn === 'function' ? fn() : '';
    });
    expect(render).toContain('scene=play');
  });
});
