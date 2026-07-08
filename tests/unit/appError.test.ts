import { describe, it, expect } from 'vitest';
import { AppError, resolveErrorMessage } from '@/utils/appError';
import { ui } from '@/i18n/ui';

describe('resolveErrorMessage', () => {
  it('maps codes to localized strings', () => {
    expect(resolveErrorMessage('errPdfEncrypted', ui.en)).toContain('password-protected');
    expect(resolveErrorMessage('errPdfEncrypted', ui.ja)).toContain('パスワード');
    expect(resolveErrorMessage(new AppError('errPdfUnreadable'), ui.de)).toBe(
      'Diese Datei ist kein lesbares PDF.'
    );
  });

  it('falls back to the localized generic message for unmapped/internal errors', () => {
    expect(resolveErrorMessage('Failed to get 2D context (OffscreenCanvas)', ui.zh)).toBe(ui.zh.errConversionFailed);
    expect(resolveErrorMessage(undefined, ui.es)).toBe(ui.es.errConversionFailed);
  });

  it('substitutes params into the template', () => {
    expect(resolveErrorMessage(new AppError('errUnsupported', { name: 'notes.txt' }), ui.en)).toBe(
      'Not a PDF file (notes.txt).'
    );
  });

  it('every locale defines the mapped codes', () => {
    for (const loc of ['en', 'ja', 'zh', 'de', 'es'] as const)
      for (const c of ['errPdfEncrypted', 'errPdfUnreadable', 'errNoPagesSelected', 'errConversionFailed'])
        expect((ui as any)[loc][c], `${loc}.${c}`).toBeTruthy();
  });
});
