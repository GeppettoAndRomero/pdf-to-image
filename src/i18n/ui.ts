/**
 * Preact island (client UI) copy, per locale. Kept separate from the page-level
 * content (`en.ts` / `ja.ts` / ...), which is server-rendered SEO copy.
 *
 * Islands receive `locale` as a prop (present at SSR time) rather than reading
 * it from `document`, so SSR and the client render the same string and avoid a
 * hydration mismatch.
 *
 * Interpolated strings use `{name}` / `{n}` / `{count}` / `{current}` / `{total}`
 * placeholders, replaced by the caller with `.replace(...)`.
 */
export const ui = {
  en: {
    // ConversionManager
    uploadHeading: 'Upload a PDF',
    uploadSubtitle: 'Choose a PDF to render to images.',
    dropClick: 'Click to choose a file',
    dropOr: 'or drop it anywhere on the page',
    dropSupported: 'PDF files',
    settingsButton: 'Settings',
    openSettingsAria: 'Open settings',
    pagesLabel: 'pages',
    selectAllPages: 'Select all',
    invertSelection: 'Invert',
    clearSelection: 'Clear',
    previewsAria: 'Page previews',
    pageAria: 'Page {n}',
    loadingPreviews: 'Opening the PDF…',
    downloadButton: 'Download',
    renderingProgress: 'Rendering page {current} of {total}…',
    notificationsAria: 'Notifications',
    errUnsupported: 'Not a PDF file ({name}).',
    errConversionFailed: 'Rendering failed',
    errPdfEncrypted: 'This PDF is password-protected (encrypted). Remove the password in a reader you trust, then try again.',
    errPdfUnreadable: 'This file is not a readable PDF.',
    errNoPagesSelected: 'Select at least one page.',
    errDownloadFailed: 'Download failed',

    // SettingsPanel
    conversionSettings: 'Render settings',
    outputFormat: 'Output format',
    required: 'Required',
    jpgQuality: 'JPG quality',
    jpgQualityHelp: 'Higher quality means a larger file',
    resolution: 'Resolution',
    resolutionHelp: 'Higher DPI means a sharper, larger image. 150–200 DPI suits a screen; 300 DPI suits printing or scanning documents.',

    // InstallPrompt
    installHeading: 'Install app',
    installBody: 'Add to your home screen for quick access.',
    install: 'Install',
    later: 'Later',

    // GlobalDropZone
    dzProcessing: 'Processing {count} file(s)...',
    dzPleaseWait: 'Please wait',
    dzDropTitle: 'Drop a PDF to render',
    dzDropSub: 'Drop a PDF anywhere on the page',

    // ThemeToggle
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    themeLabel: 'Theme',

    // shared
    close: 'Close',
  },
  ja: {
    // ConversionManager
    uploadHeading: 'PDF をアップロード',
    uploadSubtitle: '画像に変換したい PDF を選んでください。',
    dropClick: 'クリックしてファイルを選択',
    dropOr: 'またはページ上にドロップ',
    dropSupported: 'PDF ファイル',
    settingsButton: '設定',
    openSettingsAria: '設定を開く',
    pagesLabel: 'ページ',
    selectAllPages: 'すべて選択',
    invertSelection: '選択を反転',
    clearSelection: 'クリア',
    previewsAria: 'ページのプレビュー',
    loadingPreviews: 'PDF を開いています…',
    pageAria: '{n} ページ目',
    downloadButton: 'ダウンロード',
    renderingProgress: '{total} 件中 {current} 件目を描画中…',
    notificationsAria: '通知',
    errUnsupported: 'PDF ファイルではありません（{name}）。',
    errConversionFailed: '画像の生成に失敗しました',
    errPdfEncrypted: 'この PDF はパスワードで保護されています（暗号化）。信頼できるビューアでパスワードを解除してから、もう一度お試しください。',
    errPdfUnreadable: 'このファイルは読み取り可能な PDF ではありません。',
    errNoPagesSelected: '1 ページ以上選択してください。',
    errDownloadFailed: 'ダウンロードに失敗しました',

    // SettingsPanel
    conversionSettings: '描画設定',
    outputFormat: '出力形式',
    required: '必須',
    jpgQuality: 'JPG 画質',
    jpgQualityHelp: '画質を上げるほどファイルサイズは大きくなります',
    resolution: '解像度',
    resolutionHelp: 'DPI が高いほど画像は鮮明かつ大きくなります。画面表示には 150〜200 DPI、印刷や書類のスキャン用途には 300 DPI が目安です。',

    // InstallPrompt
    installHeading: 'アプリを追加',
    installBody: 'ホーム画面に追加すると、すぐに開けます。',
    install: '追加',
    later: 'あとで',

    // GlobalDropZone
    dzProcessing: '{count} 件のファイルを処理中…',
    dzPleaseWait: 'お待ちください',
    dzDropTitle: 'ドロップして描画',
    dzDropSub: 'PDF をページ上にドロップしてください',

    // ThemeToggle
    themeToLight: 'ライトモードに切り替え',
    themeToDark: 'ダークモードに切り替え',
    themeLabel: 'テーマ',

    // shared
    close: '閉じる',
  },
  zh: {
    // ConversionManager
    uploadHeading: '上传 PDF',
    uploadSubtitle: '选择要渲染成图片的 PDF。',
    dropClick: '点击选择文件',
    dropOr: '或把文件拖到页面任意位置',
    dropSupported: 'PDF 文件',
    settingsButton: '设置',
    openSettingsAria: '打开设置',
    pagesLabel: '页',
    selectAllPages: '全选',
    invertSelection: '反选',
    clearSelection: '清除',
    previewsAria: '页面预览',
    loadingPreviews: '正在打开 PDF…',
    pageAria: '第 {n} 页',
    downloadButton: '下载',
    renderingProgress: '正在渲染第 {current} / {total} 页…',
    notificationsAria: '通知',
    errUnsupported: '不是 PDF 文件（{name}）。',
    errConversionFailed: '渲染失败',
    errPdfEncrypted: '此 PDF 受密码保护（已加密）。请先在可信的阅读器中移除密码，然后重试。',
    errPdfUnreadable: '此文件不是可读取的 PDF。',
    errNoPagesSelected: '请至少选择一页。',
    errDownloadFailed: '下载失败',

    // SettingsPanel
    conversionSettings: '渲染设置',
    outputFormat: '输出格式',
    required: '必填',
    jpgQuality: 'JPG 质量',
    jpgQualityHelp: '质量越高，文件体积越大',
    resolution: '分辨率',
    resolutionHelp: 'DPI 越高，图片越清晰、越大。屏幕查看建议 150–200 DPI；打印或扫描文档建议 300 DPI。',

    // InstallPrompt
    installHeading: '安装应用',
    installBody: '添加到主屏幕，方便随时打开。',
    install: '安装',
    later: '以后再说',

    // GlobalDropZone
    dzProcessing: '正在处理 {count} 个文件…',
    dzPleaseWait: '请稍候',
    dzDropTitle: '拖放以渲染',
    dzDropSub: '将 PDF 拖到页面任意位置',

    // ThemeToggle
    themeToLight: '切换到浅色模式',
    themeToDark: '切换到深色模式',
    themeLabel: '主题',

    // shared
    close: '关闭',
  },
  de: {
    // ConversionManager
    uploadHeading: 'PDF hochladen',
    uploadSubtitle: 'Wähle ein PDF, das in Bilder umgewandelt werden soll.',
    dropClick: 'Zum Auswählen klicken',
    dropOr: 'oder irgendwo auf der Seite ablegen',
    dropSupported: 'PDF-Dateien',
    settingsButton: 'Einstellungen',
    openSettingsAria: 'Einstellungen öffnen',
    pagesLabel: 'Seiten',
    selectAllPages: 'Alle auswählen',
    invertSelection: 'Umkehren',
    clearSelection: 'Leeren',
    previewsAria: 'Seitenvorschau',
    loadingPreviews: 'PDF wird geöffnet …',
    pageAria: 'Seite {n}',
    downloadButton: 'Herunterladen',
    renderingProgress: 'Seite {current} von {total} wird gerendert …',
    notificationsAria: 'Benachrichtigungen',
    errUnsupported: 'Keine PDF-Datei ({name}).',
    errConversionFailed: 'Rendern fehlgeschlagen',
    errPdfEncrypted: 'Dieses PDF ist passwortgeschützt (verschlüsselt). Entferne das Passwort in einem vertrauenswürdigen Programm und versuche es erneut.',
    errPdfUnreadable: 'Diese Datei ist kein lesbares PDF.',
    errNoPagesSelected: 'Wähle mindestens eine Seite aus.',
    errDownloadFailed: 'Download fehlgeschlagen',

    // SettingsPanel
    conversionSettings: 'Render-Einstellungen',
    outputFormat: 'Ausgabeformat',
    required: 'Erforderlich',
    jpgQuality: 'JPG-Qualität',
    jpgQualityHelp: 'Höhere Qualität bedeutet eine größere Datei',
    resolution: 'Auflösung',
    resolutionHelp: 'Eine höhere DPI-Zahl ergibt ein schärferes, größeres Bild. 150–200 DPI eignen sich für den Bildschirm, 300 DPI für Druck oder das Scannen von Dokumenten.',

    // InstallPrompt
    installHeading: 'App installieren',
    installBody: 'Zum Startbildschirm hinzufügen, um es direkt zu öffnen.',
    install: 'Installieren',
    later: 'Später',

    // GlobalDropZone
    dzProcessing: '{count} Datei(en) werden verarbeitet …',
    dzPleaseWait: 'Bitte warten',
    dzDropTitle: 'Zum Rendern ablegen',
    dzDropSub: 'Lege ein PDF irgendwo auf der Seite ab',

    // ThemeToggle
    themeToLight: 'Zum hellen Modus wechseln',
    themeToDark: 'Zum dunklen Modus wechseln',
    themeLabel: 'Design',

    // shared
    close: 'Schließen',
  },
  es: {
    // ConversionManager
    uploadHeading: 'Subir un PDF',
    uploadSubtitle: 'Elige un PDF para convertirlo en imágenes.',
    dropClick: 'Haz clic para elegir un archivo',
    dropOr: 'o suéltalo en cualquier parte de la página',
    dropSupported: 'Archivos PDF',
    settingsButton: 'Configuración',
    openSettingsAria: 'Abrir configuración',
    pagesLabel: 'páginas',
    selectAllPages: 'Seleccionar todo',
    invertSelection: 'Invertir',
    clearSelection: 'Limpiar',
    previewsAria: 'Vista previa de páginas',
    loadingPreviews: 'Abriendo el PDF…',
    pageAria: 'Página {n}',
    downloadButton: 'Descargar',
    renderingProgress: 'Generando la página {current} de {total}…',
    notificationsAria: 'Notificaciones',
    errUnsupported: 'No es un archivo PDF ({name}).',
    errConversionFailed: 'No se pudo generar la imagen',
    errPdfEncrypted: 'Este PDF está protegido con contraseña (cifrado). Quita la contraseña en un lector de confianza y vuelve a intentarlo.',
    errPdfUnreadable: 'Este archivo no es un PDF legible.',
    errNoPagesSelected: 'Selecciona al menos una página.',
    errDownloadFailed: 'La descarga falló',

    // SettingsPanel
    conversionSettings: 'Ajustes de generación',
    outputFormat: 'Formato de salida',
    required: 'Obligatorio',
    jpgQuality: 'Calidad del JPG',
    jpgQualityHelp: 'A mayor calidad, mayor tamaño de archivo',
    resolution: 'Resolución',
    resolutionHelp: 'Una resolución (DPI) más alta da una imagen más nítida y grande. 150–200 DPI es adecuado para pantalla; 300 DPI para imprimir o escanear documentos.',

    // InstallPrompt
    installHeading: 'Instalar la app',
    installBody: 'Añádela a tu pantalla de inicio para tenerla siempre a mano.',
    install: 'Instalar',
    later: 'Más tarde',

    // GlobalDropZone
    dzProcessing: 'Procesando {count} archivo(s)...',
    dzPleaseWait: 'Espera un momento',
    dzDropTitle: 'Suelta el PDF para generar imágenes',
    dzDropSub: 'Suelta un PDF en cualquier parte de la página',

    // ThemeToggle
    themeToLight: 'Cambiar al modo claro',
    themeToDark: 'Cambiar al modo oscuro',
    themeLabel: 'Tema',

    // shared
    close: 'Cerrar',
  },
} as const;

export type UiStrings = (typeof ui)['en'];
