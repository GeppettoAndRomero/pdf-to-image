/**
 * File validation: this tool accepts exactly one PDF at a time.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_EXTENSION = '.pdf';
const ALLOWED_MIME_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB — generous for a single PDF

/**
 * Check the file extension.
 */
export function validateFileExtension(fileName: string): ValidationResult {
  if (!fileName.toLowerCase().endsWith(ALLOWED_EXTENSION)) {
    return {
      valid: false,
      error: `Unsupported file type. Expected: ${ALLOWED_EXTENSION}`,
    };
  }
  return { valid: true };
}

/**
 * Check the file MIME type (best-effort; browsers may report an empty type).
 */
export function validateFileMimeType(file: File): ValidationResult {
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported MIME type: ${file.type}`,
    };
  }
  return { valid: true };
}

/**
 * Validate a single file (extension, then MIME type as a secondary check).
 */
export function validateFile(file: File): ValidationResult {
  const extensionResult = validateFileExtension(file.name);
  if (!extensionResult.valid) {
    return extensionResult;
  }

  const mimeResult = validateFileMimeType(file);
  if (!mimeResult.valid && file.type) {
    return mimeResult;
  }

  return { valid: true };
}

/**
 * Check the combined size of the selected file(s) against the cap.
 */
export function validateTotalSize(files: File[]): ValidationResult {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  if (totalSize > MAX_FILE_SIZE) {
    const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
    const maxMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File is too large (${totalMB}MB / ${maxMB}MB max)`,
    };
  }

  return { valid: true };
}

/**
 * Sanitize a file name (strip characters that are unsafe in file systems).
 */
export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[/\\?%*:|"<>]/g, '_');
}
