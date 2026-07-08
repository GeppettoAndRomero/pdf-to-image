/**
 * SettingsPanel: output format, JPG quality, and rendering resolution (DPI).
 */

import { useState } from 'preact/hooks';
import type { ConversionSettings, OutputFormat } from '@/utils/settings';
import { DPI_OPTIONS, validateSettings } from '@/utils/settings';
import { AppCard } from './AppCard';
import { ui } from '@/i18n/ui';

interface SettingsPanelProps {
  settings: ConversionSettings;
  onChange: (settings: ConversionSettings) => void;
  locale?: string;
}

export function SettingsPanel({ settings, onChange, locale = 'en' }: SettingsPanelProps) {
  const t = (ui as any)[locale] ?? ui.en;
  const [isExpanded, setIsExpanded] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: keyof ConversionSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    const validation = validateSettings(newSettings);
    setErrors(validation.errors);
    onChange(newSettings);
  };

  return (
    <AppCard>
      <button
        class="settings-panel__header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="settings-content"
      >
        <h3 class="settings-panel__title">{t.conversionSettings}</h3>
        <span class="settings-panel__toggle" aria-hidden="true">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div id="settings-content" class="settings-panel__content">
          {/* Output format */}
          <div class="app-field">
            <label class="app-field__label" for="output-format">
              {t.outputFormat}
              <span class="app-field__required">{t.required}</span>
            </label>
            <select
              id="output-format"
              class="app-field__select"
              value={settings.outputFormat}
              onChange={(e) => handleChange('outputFormat', e.currentTarget.value as OutputFormat)}
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
            </select>
          </div>

          {/* JPEG quality (JPEG only) */}
          {settings.outputFormat === 'jpeg' && (
            <div class="app-field">
              <label class="app-field__label" for="jpeg-quality">
                {t.jpgQuality}
              </label>
              <div class="slider-field">
                <input
                  id="jpeg-quality"
                  type="range"
                  class="slider-field__input"
                  min="50"
                  max="98"
                  step="1"
                  value={Math.round(settings.jpegQuality * 100)}
                  onInput={(e) => handleChange('jpegQuality', Number(e.currentTarget.value) / 100)}
                />
                <span class="slider-field__value num">{Math.round(settings.jpegQuality * 100)}%</span>
              </div>
              <div class="app-field__help">{t.jpgQualityHelp}</div>
              {errors.jpegQuality && (
                <div class="app-field__error" role="alert">
                  <span aria-hidden="true">⚠</span>
                  {errors.jpegQuality}
                </div>
              )}
            </div>
          )}

          {/* Resolution (DPI) */}
          <div class="app-field">
            <label class="app-field__label" for="dpi-select">
              {t.resolution}
            </label>
            <select
              id="dpi-select"
              class="app-field__select"
              value={String(settings.dpi)}
              onChange={(e) => handleChange('dpi', Number(e.currentTarget.value))}
            >
              {DPI_OPTIONS.map((dpi) => (
                <option key={dpi} value={dpi}>
                  {dpi} DPI
                </option>
              ))}
            </select>
            <div class="app-field__help">{t.resolutionHelp}</div>
            {errors.dpi && (
              <div class="app-field__error" role="alert">
                <span aria-hidden="true">⚠</span>
                {errors.dpi}
              </div>
            )}
          </div>
        </div>
      )}
    </AppCard>
  );
}
