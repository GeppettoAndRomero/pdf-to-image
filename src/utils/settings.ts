/**
 * Render settings: output format, JPG quality, and rendering resolution (DPI).
 */

export type OutputFormat = 'jpeg' | 'png';

export interface ConversionSettings {
  // Output image format.
  outputFormat: OutputFormat;

  // JPEG quality (0.5 - 0.98). Ignored for PNG (lossless).
  jpegQuality: number;

  // Rendering resolution in DPI. pdf.js paints at 1 canvas px per PDF point
  // (72 pt/inch) at scale 1, so this is converted to a viewport scale via
  // `dpiToScale()` in pdfRenderEngine.ts. Higher DPI means a sharper, larger
  // image and more memory/time to render — the UI exposes it directly because
  // it is the single setting that most changes whether the output is useful
  // (a screen-only preview vs. a print-quality page scan).
  dpi: number;
}

// Presets shown in the resolution <select>. 150 is a reasonable "read it on a
// screen" resolution; 300 is standard print/document-scan quality.
export const DPI_OPTIONS = [72, 96, 150, 200, 300, 450, 600] as const;

export const DEFAULT_SETTINGS: ConversionSettings = {
  outputFormat: 'png',
  jpegQuality: 0.92,
  dpi: 200,
};

/**
 * Validate settings values.
 */
export function validateSettings(settings: ConversionSettings): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (settings.outputFormat === 'jpeg') {
    if (settings.jpegQuality < 0.5 || settings.jpegQuality > 0.98) {
      errors.jpegQuality = 'JPG quality must be between 0.5 and 0.98';
    }
  }

  if (!Number.isFinite(settings.dpi) || settings.dpi < 36 || settings.dpi > 1200) {
    errors.dpi = 'Resolution must be between 36 and 1200 DPI';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
