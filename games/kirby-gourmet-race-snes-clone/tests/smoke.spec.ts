import { expect, test } from '@playwright/test';

async function holdKey(page: import('@playwright/test').Page, key: string, ms: number): Promise<void> {
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
}

test('happy path: real inputs reach win state', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await holdKey(page, 'ArrowRight', 2500);

  await expect.poll(async () => page.evaluate(() => window.__GAME_TEST_STATE__?.mode)).toBe('win');
  await page.screenshot({ path: 'artifacts/smoke-happy-path.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('fail path: real inputs reach lose state', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(9500);

  await expect.poll(async () => page.evaluate(() => window.__GAME_TEST_STATE__?.mode)).toBe('lose');
  await page.screenshot({ path: 'artifacts/smoke-fail-path.png', fullPage: true });
  expect(errors).toEqual([]);
});
