import { describe, it, expect } from 'vitest';
import { dpiToScale, outputExtension, outputMimeType } from '@/utils/pdfRenderEngine';

describe('dpiToScale', () => {
  it('converts DPI to a pdf.js viewport scale (72 DPI = scale 1)', () => {
    expect(dpiToScale(72)).toBe(1);
    expect(dpiToScale(144)).toBe(2);
    expect(dpiToScale(36)).toBe(0.5);
  });
});

describe('outputExtension / outputMimeType', () => {
  it('maps png', () => {
    expect(outputExtension('png')).toBe('png');
    expect(outputMimeType('png')).toBe('image/png');
  });

  it('maps jpeg to the .jpg extension', () => {
    expect(outputExtension('jpeg')).toBe('jpg');
    expect(outputMimeType('jpeg')).toBe('image/jpeg');
  });
});
