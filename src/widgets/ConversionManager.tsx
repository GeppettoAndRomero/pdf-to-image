/**
 * ConversionManager (pdf-to-image).
 *
 * Drop one PDF -> pdf.js opens it and reports the page count -> a thumbnail
 * grid lets the user pick which pages to render (all pages selected by
 * default) -> Settings (format / JPG quality / DPI) apply to the render ->
 * Download renders the selected page(s) at the chosen resolution and either
 * downloads a single image (exactly one page selected) or zips them
 * (more than one). Everything runs on the main thread; pdf.js does its own
 * heavy lifting (parsing/decoding) inside its dedicated worker.
 */

import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { SettingsPanel } from './SettingsPanel';
import { AppCard } from './AppCard';
import { ErrorToast } from './ErrorToast';
import { AppModal } from './AppModal';
import {
  openPdf,
  dpiToScale,
  canvasToBlob,
  outputExtension,
  type PdfHandle,
  type OutputFormat,
} from '@/utils/pdfRenderEngine';
import { resolveErrorMessage } from '@/utils/appError';
import { type ConversionSettings } from '@/utils/settings';
import { loadSettings, saveSettings } from '@/utils/settingsStorage';
import { downloadBlob, downloadImagesAsZip, type NamedImage } from '@/utils/zipDownload';
import { ui } from '@/i18n/ui';

interface ErrorToastItem {
  id: string;
  message: string;
}

interface ConversionManagerProps {
  locale?: string;
}

/** Zero-pad a 1-based page number to the width of the largest page number. */
function padPage(n: number, total: number): string {
  return String(n).padStart(String(total).length, '0');
}

function outputFilename(baseName: string, page: number, total: number, format: OutputFormat): string {
  return `${baseName}-page-${padPage(page, total)}.${outputExtension(format)}`;
}

/** One page thumbnail. Renders lazily via pdf.js once it scrolls into view. */
function PageThumb({
  pdf,
  page,
  selected,
  onToggle,
  ariaLabel,
}: {
  pdf: PdfHandle;
  page: number; // 1-based
  selected: boolean;
  onToggle: () => void;
  ariaLabel: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          (async () => {
            try {
              // A small preview scale is enough for the picker grid; the real
              // output render (at the user's chosen DPI) happens on download.
              const canvas = await pdf.renderPage(page, 0.35);
              if (!cancelled) setSrc(canvas.toDataURL('image/jpeg', 0.72));
            } catch {
              /* Thumbnail-only failure; the checkbox itself still works. */
            }
          })();
        }
      },
      { rootMargin: '300px' }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [pdf, page]);

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      aria-label={ariaLabel}
      onClick={onToggle}
      class="page-thumb"
      data-selected={selected ? 'true' : 'false'}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-1)',
        padding: 'var(--space-2)',
        border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-sm)',
        background: selected ? 'color-mix(in srgb, var(--color-primary) 10%, var(--color-bg))' : 'var(--color-bg)',
        cursor: 'pointer',
        transition: 'border-color 0.12s, background 0.12s',
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '3 / 4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'var(--color-surface)',
          borderRadius: '2px',
          opacity: selected ? '1' : '0.85',
        }}
      >
        {src ? (
          <img
            src={src}
            alt=""
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 1px 3px rgba(0,0,0,0.18)' }}
          />
        ) : (
          <span style={{ fontSize: 'var(--fs-1)', color: 'var(--color-subtle)' }}>…</span>
        )}
      </div>
      <span
        class="num"
        style={{
          fontSize: 'var(--fs-1)',
          color: selected ? 'var(--color-primary)' : 'var(--color-subtle)',
          fontWeight: selected ? '600' : '400',
        }}
      >
        {page}
      </span>
      {selected && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 'var(--space-1)',
            right: 'var(--space-1)',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            color: '#fff',
            fontSize: '12px',
            lineHeight: '18px',
            textAlign: 'center',
          }}
        >
          ✓
        </span>
      )}
    </button>
  );
}

export function ConversionManager({ locale = 'en' }: ConversionManagerProps) {
  const t = (ui as any)[locale] ?? ui.en;
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pdfHandle, setPdfHandle] = useState<PdfHandle | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set()); // 0-based
  const [settings, setSettings] = useState<ConversionSettings>(() => loadSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [errorToasts, setErrorToasts] = useState<ErrorToastItem[]>([]);
  const pdfHandleRef = useRef<PdfHandle | null>(null);

  const showErrorToast = useCallback((message: string) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setErrorToasts((prev) => [...prev, { id, message }]);
  }, []);
  const removeErrorToast = useCallback((id: string) => {
    setErrorToasts((prev) => prev.filter((e) => e.id !== id));
  }, []);

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Release pdf.js resources on unmount.
  useEffect(() => {
    return () => {
      pdfHandleRef.current?.destroy();
      pdfHandleRef.current = null;
    };
  }, []);

  const setHandle = useCallback((h: PdfHandle | null) => {
    pdfHandleRef.current?.destroy();
    pdfHandleRef.current = h;
    setPdfHandle(h);
  }, []);

  const openFile = useCallback(
    async (f: File) => {
      setFile(f);
      setPageCount(null);
      setSelected(new Set());
      setHandle(null);
      let handle: PdfHandle;
      try {
        handle = await openPdf(f);
      } catch (error) {
        setFile(null);
        showErrorToast(`${f.name}: ${resolveErrorMessage(error, t)}`);
        return;
      }
      setPageCount(handle.numPages);
      const all = new Set<number>();
      for (let i = 0; i < handle.numPages; i++) all.add(i);
      setSelected(all);
      setHandle(handle);
    },
    [setHandle, showErrorToast, t]
  );

  const handleFiles = useCallback(
    (files: File[]) => {
      const pdf = files.find((f) => f.name.toLowerCase().endsWith('.pdf'));
      if (!pdf) {
        if (files.length > 0) showErrorToast(t.errUnsupported.replace('{name}', files[0].name));
      } else {
        openFile(pdf);
      }
      window.dispatchEvent(new CustomEvent('filesProcessed'));
    },
    [openFile, showErrorToast, t]
  );

  useEffect(() => {
    const handler = (e: Event) => handleFiles((e as CustomEvent<File[]>).detail);
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [handleFiles]);

  const togglePage = useCallback((i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(() => {
      const all = new Set<number>();
      for (let i = 0; i < (pageCount ?? 0); i++) all.add(i);
      return all;
    });
  }, [pageCount]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const invertSelection = useCallback(() => {
    setSelected((prev) => {
      const next = new Set<number>();
      for (let i = 0; i < (pageCount ?? 0); i++) if (!prev.has(i)) next.add(i);
      return next;
    });
  }, [pageCount]);

  const handleDownload = useCallback(async () => {
    if (!file || !pdfHandle || pageCount === null || busy) return;
    const indices = [...selected].sort((a, b) => a - b);
    if (indices.length === 0) {
      showErrorToast(t.errNoPagesSelected);
      return;
    }

    const baseName = file.name.replace(/\.pdf$/i, '');
    const scale = dpiToScale(settings.dpi);
    setBusy(true);
    setProgress({ current: 0, total: indices.length });
    try {
      if (indices.length === 1) {
        const pageNumber = indices[0] + 1;
        const canvas = await pdfHandle.renderPage(pageNumber, scale);
        const blob = await canvasToBlob(canvas, settings.outputFormat, settings.jpegQuality);
        downloadBlob(blob, outputFilename(baseName, pageNumber, pageCount, settings.outputFormat));
      } else {
        const images: NamedImage[] = [];
        for (let k = 0; k < indices.length; k++) {
          const pageNumber = indices[k] + 1;
          setProgress({ current: k + 1, total: indices.length });
          const canvas = await pdfHandle.renderPage(pageNumber, scale);
          const blob = await canvasToBlob(canvas, settings.outputFormat, settings.jpegQuality);
          images.push({ name: outputFilename(baseName, pageNumber, pageCount, settings.outputFormat), blob });
        }
        await downloadImagesAsZip(images, `${baseName}-pages.zip`);
      }
    } catch (error) {
      showErrorToast(resolveErrorMessage(error, t));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [file, pdfHandle, pageCount, selected, settings, busy, showErrorToast, t]);

  return (
    <div>
      <AppCard>
        <div style="margin-bottom: var(--space-4);">
          <h3 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">{t.uploadHeading}</h3>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">{t.uploadSubtitle}</p>
        </div>

        <div
          style={{
            padding: 'var(--space-6)',
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            textAlign: 'center',
            marginBottom: 'var(--space-4)',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div style="font-size: 3rem; margin-bottom: var(--space-2);">📄</div>
          <div style="font-size: var(--fs-3); font-weight: 600; margin-bottom: var(--space-2);">{t.dropClick}</div>
          <div style="font-size: var(--fs-1); color: var(--color-subtle);">{t.dropOr}</div>
          <div style="font-size: var(--fs-1); color: var(--color-subtle); margin-top: var(--space-1);">{t.dropSupported}</div>
          <input
            id="file-input"
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => {
              handleFiles(Array.from(e.currentTarget.files || []));
              e.currentTarget.value = '';
            }}
            style="display: none;"
          />
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button
            onClick={() => setIsSettingsOpen(true)}
            style="background: none; border: none; font-size: var(--fs-2); cursor: pointer; padding: var(--space-2); border-radius: var(--radius-sm); transition: all var(--dur-mid) var(--ease); color: var(--color-primary); font-weight: 500;"
          >
            {t.settingsButton}
          </button>
        </div>

        {file && pageCount !== null && (
          <div style="display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-4);">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--space-3);">
              <strong style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{file.name}</strong>
              <span id="page-count-label" style="font-size: var(--fs-2); color: var(--color-subtle); flex-shrink: 0;" class="num">
                {selected.size} / {pageCount} {t.pagesLabel}
              </span>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center;">
              <button type="button" class="app-button app-button--secondary" onClick={selectAll}>
                {t.selectAllPages}
              </button>
              <button type="button" class="app-button app-button--secondary" onClick={invertSelection}>
                {t.invertSelection}
              </button>
              <button type="button" class="app-button app-button--secondary" onClick={clearSelection}>
                {t.clearSelection}
              </button>
            </div>

            {pdfHandle ? (
              <div
                aria-label={t.previewsAria}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
                  gap: 'var(--space-2)',
                  maxHeight: '460px',
                  overflowY: 'auto',
                  padding: 'var(--space-1)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-surface)',
                }}
              >
                {Array.from({ length: pageCount }, (_, i) => (
                  <PageThumb
                    key={i}
                    pdf={pdfHandle}
                    page={i + 1}
                    selected={selected.has(i)}
                    onToggle={() => togglePage(i)}
                    ariaLabel={t.pageAria.replace('{n}', String(i + 1))}
                  />
                ))}
              </div>
            ) : (
              <div style="font-size: var(--fs-1); color: var(--color-subtle);">{t.loadingPreviews}</div>
            )}

            <div style="display: flex; justify-content: flex-end;">
              <button
                id="download-action"
                onClick={handleDownload}
                disabled={busy || selected.size === 0}
                class="app-button app-button--primary"
              >
                {busy
                  ? progress
                    ? t.renderingProgress.replace('{current}', String(progress.current)).replace('{total}', String(progress.total))
                    : t.downloadButton
                  : t.downloadButton}
              </button>
            </div>
          </div>
        )}
      </AppCard>

      {errorToasts.length > 0 && (
        <div className="error-toast-container" aria-label={t.notificationsAria}>
          {errorToasts.map((toast) => (
            <ErrorToast key={toast.id} id={toast.id} message={toast.message} onClose={removeErrorToast} locale={locale} />
          ))}
        </div>
      )}

      <AppModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title={t.conversionSettings} locale={locale}>
        <SettingsPanel settings={settings} onChange={setSettings} locale={locale} />
      </AppModal>
    </div>
  );
}

