import type { ToolContent } from './types';

// pdf-to-image. Spanish content (competitor-grounded, not a literal translation).

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'PDF a imagen — Convierte páginas a PNG o JPG en tu navegador | runlocally',
    description:
      'Convierte páginas de un PDF a imágenes PNG o JPG directamente en tu navegador. Elige las páginas, el formato, la calidad y la resolución. El archivo se procesa en tu dispositivo y nunca se sube. Código abierto (MIT), funciona sin conexión.',
    ogTitle: 'PDF a imagen — Convierte páginas a PNG o JPG en tu navegador',
    ogDescription: 'Convierte páginas de un PDF a imágenes PNG o JPG en tu navegador. No se sube nada. Código abierto, funciona sin conexión.',
  },

  hero: {
    h1: 'PDF a imagen',
    tagline: 'Convierte páginas de un PDF a PNG o JPG — en tu navegador. No se sube nada.',
  },

  intro: {
    h2: 'Convierte un PDF en imágenes, en tu navegador',
    paras: [
      'Suelta un PDF y la herramienta lo abre y muestra una miniatura de cada página. Elige las páginas que quieras, un formato (PNG o JPG), una calidad y una resolución, y descarga. Si eliges una sola página se descarga una imagen; si eliges varias, se descarga un .zip.',
      'Las páginas se renderizan de verdad: el mismo contenido que dibujaría un lector de PDF se pinta en un lienzo (canvas) y se codifica como imagen, en lugar de simplemente extraerse o reempaquetarse. Por eso el resultado se ve igual que la página original, con la resolución que elijas, ya sea texto, una foto escaneada o un gráfico vectorial.',
    ],
  },

  privacy: {
    h2: 'Por qué tu archivo no sale de tu dispositivo',
    lead: 'Aquí la privacidad es estructural, no una promesa. No hay un paso de subida porque no hay ningún servidor al que subir nada:',
    points: [
      'La conversión se ejecuta enteramente en tu navegador.',
      'La página se sirve como archivos estáticos y no envía ninguna solicitud con tu PDF.',
      'El código fuente es abierto y cualquiera puede leerlo (MIT).',
      'Funciona sin conexión, algo que solo es posible porque nada sale de tu dispositivo.',
    ],
    note: 'Si quieres comprobarlo tú mismo, abre el panel de Red de tu navegador mientras conviertes: ninguna solicitud lleva tu archivo.',
    sourceLinkText: 'Ver el código fuente.',
  },

  howto: {
    h2: 'Cómo usarlo',
    steps: [
      {
        h3: 'Elige un PDF',
        p: 'Haz clic para seleccionar un PDF, o suéltalo en cualquier parte de la página. Al cargarse aparece una miniatura de cada página.',
      },
      {
        h3: 'Elige páginas, formato y resolución',
        p: 'Haz clic en las miniaturas para elegir qué páginas renderizar (al principio están todas seleccionadas). En Configuración, elige PNG o JPG, un nivel de calidad de JPG y una resolución en DPI: más DPI da una imagen más grande y nítida.',
      },
      {
        h3: 'Descargar',
        p: 'Si seleccionas una sola página se descarga una imagen. Si seleccionas varias, se descarga un .zip con un archivo por página.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Se sube mi PDF a algún sitio?',
      a: 'No. La conversión se ejecuta enteramente en tu navegador. No hay ningún componente de servidor, así que tu archivo no tiene forma de salir de tu dispositivo. El código es abierto y puedes comprobarlo en el panel de Red de tu navegador.',
    },
    {
      q: '¿Qué resolución debería elegir?',
      a: 'Entre 150 y 200 DPI es suficiente para ver el resultado en pantalla. Para imprimir, o para escanear un documento manteniendo legible el texto pequeño y los detalles finos, usa 300 DPI o más. Una resolución más alta implica un archivo más grande y algo más de tiempo de renderizado.',
    },
    {
      q: '¿Puedo elegir solo algunas páginas?',
      a: 'Sí. Haz clic en la miniatura de una página para seleccionarla o quitarla, o usa Seleccionar todo / Invertir / Limpiar. Si seleccionas exactamente una página se descarga una sola imagen; si seleccionas varias, se descarga un .zip con una imagen por página.',
    },
    {
      q: '¿PNG o JPG? ¿Cuál elijo?',
      a: 'PNG no pierde calidad y suele verse más nítido en texto y líneas, pero genera archivos más grandes. JPG pesa menos, con calidad ajustable, y funciona bien para páginas que son mayormente fotos o imágenes escaneadas.',
    },
    {
      q: '¿Puede abrir un PDF protegido con contraseña?',
      a: 'No. Los PDF cifrados (protegidos con contraseña) no se pueden abrir, y verás un mensaje claro al respecto. Quita la contraseña primero en un lector de confianza y luego procesa el archivo aquí.',
    },
    {
      q: '¿Funciona sin conexión?',
      a: 'Sí. Es una PWA. Tras la primera visita queda en caché, así que la conversión funciona sin conexión a internet. También puedes instalarla en tu pantalla de inicio.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— herramientas pequeñas que se ejecutan localmente en tu dispositivo.',
    colophon: 'Creado y mantenido por Geppetto. Parte del código está escrito con ayuda de IA; toda revisión y decisión final es del mantenedor.',
    securityText: 'Seguridad',
  },
};
