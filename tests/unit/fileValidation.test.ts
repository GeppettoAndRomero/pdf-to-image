import { describe, it, expect } from 'vitest';
import {
  validateFileExtension,
  validateFileMimeType,
  validateFile,
  validateTotalSize,
  sanitizeFileName,
} from '@/utils/fileValidation';

// Minimal File-like stub (only the fields the validators read).
const f = (name: string, type = '', size = 1): File => ({ name, type, size }) as unknown as File;

describe('validateFileExtension', () => {
  it('accepts .pdf regardless of case', () => {
    expect(validateFileExtension('x.PDF').valid).toBe(true);
    expect(validateFileExtension('x.pdf').valid).toBe(true);
  });

  it('rejects a non-.pdf extension', () => {
    expect(validateFileExtension('x.png').valid).toBe(false);
    expect(validateFileExtension('x.docx').valid).toBe(false);
  });
});

describe('validateFileMimeType', () => {
  it('accepts application/pdf', () => {
    expect(validateFileMimeType(f('x.pdf', 'application/pdf')).valid).toBe(true);
  });

  it('accepts an empty mime type (relies on extension)', () => {
    expect(validateFileMimeType(f('x.pdf', '')).valid).toBe(true);
  });

  it('rejects a mismatched mime type', () => {
    expect(validateFileMimeType(f('x.pdf', 'image/png')).valid).toBe(false);
  });
});

describe('validateFile', () => {
  it('accepts a valid PDF', () => {
    expect(validateFile(f('report.pdf', 'application/pdf')).valid).toBe(true);
  });

  it('rejects a file with an unsupported extension', () => {
    expect(validateFile(f('report.docx', '')).valid).toBe(false);
  });
});

describe('validateTotalSize', () => {
  it('accepts a file under the cap', () => {
    expect(validateTotalSize([f('a.pdf', 'application/pdf', 10 * 1024 * 1024)]).valid).toBe(true);
  });

  it('rejects when the combined size exceeds the cap', () => {
    expect(
      validateTotalSize([f('a.pdf', 'application/pdf', 500 * 1024 * 1024 + 1)]).valid
    ).toBe(false);
  });
});

describe('sanitizeFileName', () => {
  it('replaces path and reserved characters with underscores', () => {
    expect(sanitizeFileName('a/b\\c:d*e?.pdf')).toBe('a_b_c_d_e_.pdf');
  });
});
