// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { loadSettings, saveSettings } from '@/utils/settingsStorage';
import { DEFAULT_SETTINGS } from '@/utils/settings';

describe('settingsStorage', () => {
  beforeEach(() => localStorage.clear());

  it('returns the defaults when nothing is stored', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('round-trips saved settings', () => {
    const s = { ...DEFAULT_SETTINGS, outputFormat: 'jpeg' as const, jpegQuality: 0.8, dpi: 300 };
    saveSettings(s);
    expect(loadSettings()).toEqual(s);
  });

  it('merges a stored partial over the defaults', () => {
    localStorage.setItem('pdf-to-image-settings', JSON.stringify({ outputFormat: 'jpeg' }));
    const loaded = loadSettings();
    expect(loaded.outputFormat).toBe('jpeg');
    expect(loaded.dpi).toBe(DEFAULT_SETTINGS.dpi);
  });

  it('falls back to the defaults on malformed JSON', () => {
    localStorage.setItem('pdf-to-image-settings', '{not valid json');
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });
});
