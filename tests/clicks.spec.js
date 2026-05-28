import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173/';

test.describe('Buttons clickability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('load more button is visible, enabled and clickable', async ({ page }) => {
    const loadMoreButton = page.getByRole('button', {
      name: /carica altri contenuti/i,
    });
    let newsItems;
    await expect(loadMoreButton).toBeVisible();
    await expect(loadMoreButton).toBeEnabled();

    await loadMoreButton.scrollIntoViewIfNeeded();
    await expect(loadMoreButton).toBeInViewport();
    newsItems = page.locator('#news-container .news-item[data-news-id]');
    await expect(newsItems).toHaveCount(10);
    // trial: true Verifica che Playwright riuscirebbe a cliccarlo, ma senza eseguire davvero il click.
    await loadMoreButton.click({ trial: true });
    await loadMoreButton.click();
    newsItems = page.locator('#news-container .news-item[data-news-id]');
    // Aspetta automaticamente fino a quando trova 20 elementi
    await expect(newsItems).toHaveCount(20);
  });

  test('reset news button is visible, enabled and clickable', async ({ page }) => {
    const resetButton = page.locator('.reset-news-count-and-load-btn');
    let newsItems;
    await expect(resetButton).toBeVisible();
    await expect(resetButton).toBeEnabled();

    await resetButton.scrollIntoViewIfNeeded();
    await expect(resetButton).toBeInViewport();
    newsItems = page.locator('#news-container .news-item[data-news-id]');
    await expect(newsItems).toHaveCount(10);
    await resetButton.click({ trial: true });
    await resetButton.click();
    newsItems = page.locator('#news-container .news-item[data-news-id]');
    // Aspetta automaticamente fino a quando trova 10 elementi
    await expect(newsItems).toHaveCount(10);
  });
});
