/**
 * Download a single rendered image, or a set of them as one .zip
 * (@zip.js/zip.js, no server — same engine as tools/create-zip).
 */

import { BlobWriter, BlobReader, ZipWriter } from '@zip.js/zip.js';
import { AppError } from './appError';

export interface NamedImage {
  name: string;
  blob: Blob;
}

/** Trigger a browser download for a single Blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Zip the given images (in order) and trigger a download of the archive. */
export async function downloadImagesAsZip(images: NamedImage[], zipFilename: string): Promise<void> {
  if (images.length === 0) throw new AppError('errNoPagesSelected');

  // UTF-8 "language encoding" flag (general-purpose bit 11) so non-ASCII
  // source file names extract correctly in Windows Explorer.
  const writer = new ZipWriter(new BlobWriter('application/zip'), { useUnicodeFileNames: true });
  for (const image of images) {
    await writer.add(image.name, new BlobReader(image.blob));
  }
  const zipBlob = await writer.close();
  downloadBlob(zipBlob, zipFilename);
}
