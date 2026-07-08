import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { BlobReader, Uint8ArrayWriter, ZipReader } from '@zip.js/zip.js';
import { waitReady, dropPdf, PDF_B64, ENCRYPTED_PDF_B64 } from './_helpers';

const isPng = (b: Uint8Array) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
const isJpeg = (b: Uint8Array) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;

/** Read width/height straight out of a PNG's IHDR chunk (big-endian uint32 at offset 16/20). */
function readPngSize(b: Uint8Array): { width: number; height: number } {
  const view = new DataView(b.buffer, b.byteOffset, b.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

/**
 * Decode an image (as base64) in the browser and confirm it actually rendered
 * real content: the reported bitmap size matches what pdf.js should have
 * produced for this page at this DPI, and the pixels are not uniformly blank
 * (the fixture pages draw a filled rectangle + text, so a real render must
 * contain non-white pixels).
 */
async function assertRealImage(
  page: Page,
  base64: string,
  mimeType: string,
  expectedWidth: number,
  expectedHeight: number
) {
  const result = await page.evaluate(
    async ({ base64, mimeType }) => {
      const img = new Image();
      const decoded = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('image failed to decode'));
      });
      img.src = `data:${mimeType};base64,${base64}`;
      await decoded;

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

      let nonWhitePixels = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) nonWhitePixels++;
      }

      return {
        width: img.naturalWidth,
        height: img.naturalHeight,
        nonWhitePixels,
        totalPixels: data.length / 4,
      };
    },
    { base64, mimeType }
  );

  // Allow ±1px slack: pdf.js viewport rounding can differ by a pixel from a
  // hand-computed expectation depending on internal rounding order.
  expect(Math.abs(result.width - expectedWidth)).toBeLessThanOrEqual(1);
  expect(Math.abs(result.height - expectedHeight)).toBeLessThanOrEqual(1);
  // The fixture pages are ~50% covered by a solid rectangle plus text: demand
  // a healthy fraction of non-white pixels, not just one stray dark pixel.
  expect(result.nonWhitePixels).toBeGreaterThan(result.totalPixels * 0.1);
}

test.describe('PDF to image', () => {
  test('detects the page count and renders a correctly-sized, non-blank PNG for a single page', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (req) => {
      const u = req.url();
      if (!u.startsWith('http://localhost:4321') && !u.startsWith('data:') && !u.startsWith('blob:')) {
        external.push(u);
      }
    });
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));

    await page.goto('/pdf-to-image/');
    await waitReady(page);
    await dropPdf(page, PDF_B64);

    // Page count detection: the fixture has exactly 3 pages, all selected by default.
    await expect(page.locator('#page-count-label')).toHaveText('3 / 3 pages', { timeout: 10_000 });

    // Narrow the selection to page 1 only (Clear, then re-select page 1) to
    // exercise the single-image download path.
    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await page.getByRole('button', { name: 'Page 1' }).click();
    await expect(page.locator('#page-count-label')).toHaveText('1 / 3 pages');

    const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
    await page.click('#download-action');
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.png$/);
    const buf = readFileSync((await download.path()) as string);
    expect(isPng(new Uint8Array(buf))).toBe(true);

    const { width, height } = readPngSize(new Uint8Array(buf));
    // Page 1 is 300x400pt; default resolution is 200 DPI -> scale = 200/72.
    expect(width).toBe(Math.round((300 * 200) / 72));
    expect(height).toBe(Math.round((400 * 200) / 72));

    await assertRealImage(page, buf.toString('base64'), 'image/png', width, height);

    expect(external, `unexpected cross-origin requests: ${external.join(', ')}`).toHaveLength(0);
    expect(consoleErrors, `unexpected console errors: ${consoleErrors.join('\n')}`).toHaveLength(0);
  });

  test('renders a JPG at a chosen resolution when the format is switched', async ({ page }) => {
    await page.goto('/pdf-to-image/');
    await waitReady(page);
    await dropPdf(page, PDF_B64);
    await page.locator('#download-action').waitFor({ state: 'visible' });

    // Keep only page 2 (400x300pt landscape) selected.
    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await page.getByRole('button', { name: 'Page 2' }).click();

    // Switch to JPEG and 300 DPI via the settings modal.
    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    await page.locator('#output-format').selectOption('jpeg');
    await page.locator('#dpi-select').selectOption('300');
    await page.getByRole('button', { name: 'Close' }).click();

    const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
    await page.click('#download-action');
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.jpg$/);
    const buf = readFileSync((await download.path()) as string);
    expect(isJpeg(new Uint8Array(buf))).toBe(true);

    const expectedWidth = Math.round((400 * 300) / 72);
    const expectedHeight = Math.round((300 * 300) / 72);
    await assertRealImage(page, buf.toString('base64'), 'image/jpeg', expectedWidth, expectedHeight);
  });

  test('zips one image per page when multiple pages are selected', async ({ page }) => {
    await page.goto('/pdf-to-image/');
    await waitReady(page);
    await dropPdf(page, PDF_B64);
    // All 3 pages are selected by default.
    await expect(page.locator('#page-count-label')).toHaveText('3 / 3 pages');

    const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
    await page.click('#download-action');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.zip$/);

    const buf = readFileSync((await download.path()) as string);
    const reader = new ZipReader(new BlobReader(new Blob([new Uint8Array(buf)])));
    const entries = await reader.getEntries();
    await reader.close();

    expect(entries).toHaveLength(3);
    expect(entries.map((e) => e.filename).sort()).toEqual([
      'sample-page-1.png',
      'sample-page-2.png',
      'sample-page-3.png',
    ]);

    for (const entry of entries) {
      const data = await entry.getData!(new Uint8ArrayWriter());
      expect(isPng(data)).toBe(true);
      expect(data.byteLength).toBeGreaterThan(500);
    }
  });

  test('shows a clear, localized error for a password-protected PDF (no raw library text)', async ({ page }) => {
    await page.goto('/pdf-to-image/');
    await waitReady(page);
    await dropPdf(page, ENCRYPTED_PDF_B64, 'encrypted.pdf');

    const toast = page.locator('.error-toast');
    await expect(toast).toBeVisible({ timeout: 10_000 });
    await expect(toast).toContainText('password-protected');
    // The raw pdf.js exception message ("No password given") must never reach the UI.
    await expect(toast).not.toContainText('No password given');
    await expect(toast).not.toContainText('PasswordException');
  });

  test('shows a clear, localized error for a non-PDF file', async ({ page }) => {
    await page.goto('/pdf-to-image/');
    await waitReady(page);
    await page.evaluate(() => {
      const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
      window.dispatchEvent(new CustomEvent('filesDropped', { detail: [file] }));
    });
    const toast = page.locator('.error-toast');
    await expect(toast).toBeVisible({ timeout: 10_000 });
    await expect(toast).toContainText('Not a PDF file');
  });
});
