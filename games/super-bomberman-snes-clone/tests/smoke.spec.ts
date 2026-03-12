import { expect, test } from '@playwright/test';

async function pressTimes(page: import('@playwright/test').Page, key: string, times: number): Promise<void> {
  for (let i = 0; i < times; i += 1) {
    await page.keyboard.press(key);
    await page.waitForTimeout(40);
  }
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

  await pressTimes(page, 'ArrowRight', 5);
  await page.keyboard.press('Space');
  await pressTimes(page, 'ArrowLeft', 2);
  await page.waitForTimeout(1100);

  await expect
    .poll(async () => page.evaluate(() => window.__GAME_TEST_STATE__?.mode))
    .toBe('win');

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
  await page.keyboard.press('Space');
  await page.waitForTimeout(1100);

  await expect
    .poll(async () => page.evaluate(() => window.__GAME_TEST_STATE__?.mode))
    .toBe('lose');

  await page.screenshot({ path: 'artifacts/smoke-fail-path.png', fullPage: true });
  expect(errors).toEqual([]);
});
