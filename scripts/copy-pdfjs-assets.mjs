#!/usr/bin/env node
/**
 * pdf.js ships several asset directories that it fetches lazily at runtime
 * rather than bundling inline, keyed by a *directory prefix* option passed to
 * `getDocument()` (not a single-file import a bundler can resolve for you):
 *
 *   - `wasm/`            — optional WASM codecs (JBIG2, OpenJPEG/JPX, ICC color
 *                           via qcms) used only when a PDF actually embeds an
 *                           image in one of those formats (common in scanned
 *                           documents). Without `wasmUrl` pdf.js still renders
 *                           the rest of the page, but logs a console warning
 *                           and falls back to a slower pure-JS decoder — or
 *                           fails that one image — for the pages that need it.
 *   - `cmaps/`           — character maps for non-Latin (e.g. CJK) embedded
 *                           font encodings.
 *   - `standard_fonts/`  — metrics/glyphs for the 14 standard PDF fonts
 *                           (Helvetica, Times, ...) when a PDF references one
 *                           without embedding it.
 *
 * A `?url` import gives Vite a single hashed URL, not a stable directory
 * prefix these APIs need, so instead this copies the three folders verbatim
 * out of the installed `pdfjs-dist` and into `public/pdf-to-image/pdfjs/`,
 * where Astro serves them as static files at a fixed, predictable path.
 * Runs on `npm install` (postinstall) so it always matches the installed
 * pdfjs-dist version; the copied output is gitignored (a build artifact, not
 * source).
 */
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const src = path.resolve(root, 'node_modules/pdfjs-dist');
const dest = path.resolve(root, 'public/pdf-to-image/pdfjs');

const dirs = ['cmaps', 'standard_fonts', 'wasm'];

if (!existsSync(src)) {
  console.error('[copy-pdfjs-assets] pdfjs-dist not found in node_modules; skipping (run npm install first)');
  process.exit(0);
}

mkdirSync(dest, { recursive: true });
for (const dir of dirs) {
  const from = path.join(src, dir);
  const to = path.join(dest, dir);
  if (!existsSync(from)) {
    console.warn(`[copy-pdfjs-assets] ${dir} not found in installed pdfjs-dist, skipping`);
    continue;
  }
  cpSync(from, to, { recursive: true });
  console.log(`[copy-pdfjs-assets] copied ${dir} -> public/pdf-to-image/pdfjs/${dir}`);
}
