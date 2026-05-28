// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173/';

test.describe('Reveal text sections on scroll sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('has title', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Tongue/);
  });

  test('first reveal section becomes visible when scrolling', async ({ page }) => {
    // first : verifica la prima occorrenza dell'elemento
    const revealSection = page.locator('div.container-fluid.mb-5.reveal').first();
    // verifica che l’elemento sia visibile a livello CSS, quindi non display: none, non visibility: hidden, ecc.
    await expect(revealSection).toBeVisible();
    await revealSection.scrollIntoViewIfNeeded();
    // verifica che l’elemento sia realmente dentro la viewport del browser dopo lo scroll.
    await expect(revealSection).toBeInViewport();
  });

  test('second reveal section becomes visible when scrolling', async ({ page }) => {
    // nth(1) : verifica la presenza del secondo elemento. nth(0) è il primo.
    const revealSection = page.locator('div.container-fluid.mb-5.reveal').nth(1);
    await revealSection.scrollIntoViewIfNeeded();
    await expect(revealSection).toBeInViewport();
  });

  test('third reveal section becomes visible when scrolling', async ({ page }) => {
    // nth(1) : verifica la presenza del secondo elemento. nth(0) è il primo.
    const revealSection = page.locator('div.row.justify-content-center.mx-3.mx-lg-5.reveal').nth(0);
    await revealSection.scrollIntoViewIfNeeded();
    await expect(revealSection).toBeInViewport();
  });

  test('fourth reveal section becomes visible when scrolling', async ({ page }) => {
    // nth(1) : verifica la presenza del secondo elemento. nth(0) è il primo.
    const revealSection = page.locator('div.row.justify-content-center.mx-3.mx-lg-5.reveal').nth(1);
    await revealSection.scrollIntoViewIfNeeded();
    await expect(revealSection).toBeInViewport();
  });
});

test.describe('Reveal buttons on scroll sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Reveal reload page button when scrolling', async ({ page }) => {
    const revealSection = page
      .locator('button.btn.btn-secondary.rounded-5.reset-news-count-and-load-btn.icon-lh-1')
      .nth(0);
    await revealSection.scrollIntoViewIfNeeded();
    await expect(revealSection).toBeInViewport();
  });

  test('Reveal load more news button when scrolling', async ({ page }) => {
    // nth(1) : verifica la presenza del secondo elemento. nth(0) è il primo.
    const revealSection = page.locator('button.load-more-btn').nth(0);
    await revealSection.scrollIntoViewIfNeeded();
    await expect(revealSection).toBeInViewport();
  });
});
