import { type Page, type Download } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

export const PDF_B64 = readFileSync(
  fileURLToPath(new URL('../fixtures/pdf/sample.pdf', import.meta.url))
).toString('base64');

export const ENCRYPTED_PDF_B64 = readFileSync(
  fileURLToPath(new URL('../fixtures/pdf/encrypted.pdf', import.meta.url))
).toString('base64');

/** Wait until the island has hydrated and the render subsystem is ready. */
export async function waitReady(page: Page) {
  await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
}

/** Drop the given base64 PDF through the same path the drop zone uses. */
export async function dropPdf(page: Page, b64: string, name = 'sample.pdf') {
  await page.evaluate(
    ({ b64, name }) => {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const file = new File([bytes], name, { type: 'application/pdf' });
      window.dispatchEvent(new CustomEvent('filesDropped', { detail: [file] }));
    },
    { b64, name }
  );
}

/**
 * Drop the bundled 3-page fixture (all pages selected by default, per
 * ConversionManager's default state) and click Download. With every page
 * selected this exercises the multi-page path (a .zip download).
 */
export async function convert(page: Page): Promise<Download> {
  const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
  await dropPdf(page, PDF_B64);
  await page.locator('#download-action').waitFor({ state: 'visible', timeout: 10_000 });
  await page.click('#download-action');
  return downloadPromise;
}
