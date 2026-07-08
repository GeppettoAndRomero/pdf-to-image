/**
 * Render PDF pages to raster images in the browser (pdfjs-dist, no server).
 *
 * pdf.js is the only library here that can actually rasterize a page — unlike
 * pdf-lib (used by pdf-split/pdf-merge to copy or merge page *objects*), pdf.js
 * interprets the page content stream and paints it onto a <canvas>. That canvas
 * pixel buffer IS this tool's output: there is no separate "cosmetic thumbnail
 * engine vs. real engine" split like pdf-split has. The picker grid and the
 * downloaded file both come from this same render() call, just at different
 * `scale` values (small for the on-screen preview, the user's chosen DPI for
 * the actual download).
 *
 * pdf.js parses and decodes the PDF inside its own dedicated worker
 * (`pdf.worker.min.mjs`, loaded as a same-origin static asset via a Vite `?url`
 * import — no CDN, no eval). Only the final canvas paint happens on the main
 * thread; that step is comparatively cheap once pdf.js has done the heavy
 * lifting (parsing, decompression, font rendering) off-thread.
 */
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { AppError } from './appError';

// pdf.js itself is loaded lazily (dynamic import) so it never sits in the
// initial page bundle — it is only fetched once a user actually drops a PDF.
let pdfjsPromise: Promise<any> | null = null;
async function getPdfjs(): Promise<any> {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then((lib: any) => {
      lib.GlobalWorkerOptions.workerSrc = workerUrl;
      return lib;
    });
  }
  return pdfjsPromise;
}

export type OutputFormat = 'png' | 'jpeg';

/** pdf.js viewport `scale` where 1 = 1 canvas px per PDF point (72 points/inch). */
export function dpiToScale(dpi: number): number {
  return dpi / 72;
}

export function outputExtension(format: OutputFormat): string {
  return format === 'jpeg' ? 'jpg' : 'png';
}

export function outputMimeType(format: OutputFormat): string {
  return format === 'jpeg' ? 'image/jpeg' : 'image/png';
}

export interface PdfHandle {
  readonly numPages: number;
  /** Render a 1-based page to a canvas at the given pdf.js viewport scale. */
  renderPage(pageNumber: number, scale: number): Promise<HTMLCanvasElement>;
  /** Release the document and its worker-side resources. */
  destroy(): void;
}

/**
 * Open a PDF for rendering. Throws `AppError('errPdfEncrypted')` for a
 * password-protected file and `AppError('errPdfUnreadable')` for anything
 * else pdf.js can't parse (corrupt data, a non-PDF file, etc).
 */
export async function openPdf(file: File): Promise<PdfHandle> {
  const pdfjs = await getPdfjs();
  const data = new Uint8Array(await file.arrayBuffer());

  let doc: any;
  try {
    doc = await pdfjs.getDocument({
      data,
      isEvalSupported: false, // CSP here has no 'unsafe-eval'
      disableAutoFetch: true, // whole file is already in memory; no range requests
      disableStream: true,
      // pdf.js fetches these three asset sets lazily, by directory prefix,
      // only for PDFs that actually need them (CJK text, a non-embedded
      // standard font, or a JBIG2/JPX-encoded embedded image — the last is
      // common in scanned documents). scripts/copy-pdfjs-assets.mjs copies
      // them out of node_modules/pdfjs-dist into public/ at install time so
      // they're served as static files at these fixed paths; without this,
      // pdf.js still renders the rest of the page but logs a console warning
      // and drops the piece that needed the missing asset.
      cMapUrl: '/pdf-to-image/pdfjs/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: '/pdf-to-image/pdfjs/standard_fonts/',
      wasmUrl: '/pdf-to-image/pdfjs/wasm/',
    }).promise;
  } catch (e) {
    if (e && typeof e === 'object' && (e as { name?: string }).name === 'PasswordException') {
      throw new AppError('errPdfEncrypted');
    }
    throw new AppError('errPdfUnreadable');
  }

  return {
    numPages: doc.numPages,
    async renderPage(pageNumber: number, scale: number): Promise<HTMLCanvasElement> {
      const page = await doc.getPage(pageNumber);
      try {
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(viewport.width));
        canvas.height = Math.max(1, Math.round(viewport.height));
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new AppError('errConversionFailed');
        // White background first: a PDF page with no fill would otherwise
        // composite onto a transparent canvas, and JPEG has no alpha channel
        // to fall back on (it would render solid black).
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        return canvas;
      } finally {
        page.cleanup();
      }
    },
    destroy() {
      doc.destroy();
    },
  };
}

/** `canvas.toBlob` wrapped in a Promise, at this tool's chosen format/quality. */
export function canvasToBlob(canvas: HTMLCanvasElement, format: OutputFormat, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new AppError('errConversionFailed'))),
      outputMimeType(format),
      format === 'jpeg' ? quality : undefined
    );
  });
}
