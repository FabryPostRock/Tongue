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

  const revealSections = [
    { index: 0, name: 'Immagine principale', class: 'div.container-fluid.mb-5.reveal', visibileWithoutScroll: true },
    { index: 1, name: 'Chi siamo', class: 'div.container-fluid.mb-5.reveal', visibileWithoutScroll: true },
    {
      index: 0,
      name: 'Founder giornalista',
      class: 'div.row.justify-content-center.mx-3.mx-lg-5.reveal',
      visibileWithoutScroll: false,
    },
    {
      index: 1,
      name: 'Founder youtuber',
      class: 'div.row.justify-content-center.mx-3.mx-lg-5.reveal',
      visibileWithoutScroll: false,
    },
  ];

  revealSections.forEach((section, idx) => {
    test(`${idx}° reveal section ${section.name} becomes visible when scrolling`, async ({ page }) => {
      // nth : verifica l'occorrenza dell'elemento
      const revealSection = page.locator(section.class).nth(section.index);
      if (!section.visibileWithoutScroll) {
        // 1. verifica che l’elemento sia invisibile a livello CSS, quindi display: none, visibility: hidden, ecc.
        await expect(revealSection).toBeHidden();
        // 2. La classe active non deve ancora esserci
        await expect(revealSection).not.toHaveClass(/active/);
      }
      // 3. Porto la sezione nella viewport
      await revealSection.scrollIntoViewIfNeeded();
      // 4. Aspetta che venga aggiunta la classe active
      await expect(revealSection).toHaveClass(/active/);
      // 5. Ora deve essere visibile a livello CSS
      await expect(revealSection).toBeVisible();
      // 6. verifica che l’elemento sia realmente dentro la viewport del browser dopo lo scroll.
      await expect(revealSection).toBeInViewport();
    });
  });
});
