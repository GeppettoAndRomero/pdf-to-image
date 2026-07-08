import { describe, it, expect } from 'vitest';
import { DEFAULT_SETTINGS, DPI_OPTIONS, validateSettings } from '@/utils/settings';

describe('validateSettings', () => {
  it('accepts the default settings', () => {
    expect(validateSettings(DEFAULT_SETTINGS).valid).toBe(true);
  });

  it('rejects a JPG quality outside 0.5..0.98', () => {
    const low = validateSettings({ ...DEFAULT_SETTINGS, outputFormat: 'jpeg', jpegQuality: 0.3 });
    expect(low.valid).toBe(false);
    expect(low.errors.jpegQuality).toBeDefined();

    const high = validateSettings({ ...DEFAULT_SETTINGS, outputFormat: 'jpeg', jpegQuality: 0.99 });
    expect(high.valid).toBe(false);
  });

  it('ignores JPG quality when the output format is png', () => {
    expect(validateSettings({ ...DEFAULT_SETTINGS, outputFormat: 'png', jpegQuality: 0.1 }).valid).toBe(true);
  });

  it('rejects a DPI outside 36..1200', () => {
    expect(validateSettings({ ...DEFAULT_SETTINGS, dpi: 10 }).valid).toBe(false);
    expect(validateSettings({ ...DEFAULT_SETTINGS, dpi: 5000 }).valid).toBe(false);
  });

  it('accepts every preset in DPI_OPTIONS', () => {
    for (const dpi of DPI_OPTIONS) {
      expect(validateSettings({ ...DEFAULT_SETTINGS, dpi }).valid).toBe(true);
    }
  });
});
