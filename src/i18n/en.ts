import type { ToolContent } from './types';

// pdf-to-image. English source content.

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'PDF to Image — Render Pages to PNG or JPG in Your Browser | runlocally',
    description:
      'Render PDF pages to PNG or JPG images, right in your browser. Pick the pages, format, quality and resolution. The file is read on your device and never uploaded. Open source (MIT), works offline.',
    ogTitle: 'PDF to Image — Render Pages to PNG or JPG in Your Browser',
    ogDescription:
      'Turn PDF pages into PNG or JPG images, in your browser. Nothing is uploaded. Open source, works offline.',
  },

  hero: {
    h1: 'PDF to Image',
    tagline: 'Render PDF pages to PNG or JPG — in your browser. Nothing is uploaded.',
  },

  intro: {
    h2: 'Render a PDF to images, in your browser',
    paras: [
      'Drop a PDF and this tool opens it and shows a thumbnail for every page. Pick the pages you want, choose PNG or JPG, a quality level and a resolution, then download. One page downloads as a single image; more than one downloads as a .zip.',
      'Pages are actually rendered — the same content stream a PDF reader would draw is painted onto a canvas and encoded as an image — not just extracted or re-packaged. That means the output looks like the page did, at whatever resolution you choose, whether the page is text, a scanned photo, or vector art.',
    ],
  },

  privacy: {
    h2: 'Why your file stays on your device',
    lead: 'Privacy here is structural, not a promise. There is no upload step because there is no server to upload to:',
    points: [
      'The rendering runs entirely in your browser.',
      'The page is served as static files and makes no request with your PDF.',
      'The source is open and anyone can read it (MIT).',
      'It works offline, which is only possible because nothing leaves the device.',
    ],
    note: "If you want to check for yourself, open your browser's Network panel while rendering — no request carries your file.",
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to use it',
    steps: [
      {
        h3: 'Choose a PDF',
        p: 'Click to select a PDF, or drop it anywhere on the page. A thumbnail appears for every page once it loads.',
      },
      {
        h3: 'Pick pages, format and resolution',
        p: 'Click thumbnails to choose which pages to render (all are selected to start). In Settings, choose PNG or JPG, a JPG quality level, and a resolution in DPI — higher DPI gives a larger, sharper image.',
      },
      {
        h3: 'Download',
        p: 'One selected page downloads as a single image. More than one downloads as a .zip, named for each page.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Is my PDF uploaded anywhere?',
      a: 'No. Rendering runs entirely in your browser. There is no server component, so your file has no path off your device. The source is open and you can confirm this in your browser\'s Network panel.',
    },
    {
      q: 'What resolution should I pick?',
      a: 'Around 150–200 DPI is enough for viewing on a screen. For printing, or for scanning a document to keep small text and fine detail legible, use 300 DPI or higher. Higher DPI means a larger file and takes a little longer to render.',
    },
    {
      q: 'Can I choose only some pages?',
      a: 'Yes. Click a page thumbnail to select or deselect it, or use Select all / Invert / Clear. Selecting exactly one page downloads a single image; selecting more downloads a .zip with one image per page.',
    },
    {
      q: 'PNG or JPG — which should I use?',
      a: 'PNG is lossless and usually sharper for text and line art, but produces larger files. JPG is smaller, with an adjustable quality level, and works well for pages that are mostly photos or scanned images.',
    },
    {
      q: 'Can it open a password-protected PDF?',
      a: 'No. Encrypted (password-protected) PDFs can\'t be opened, and you\'ll get a clear message saying so. Remove the password in a reader you trust first, then render the file here.',
    },
    {
      q: 'Does it work offline?',
      a: 'Yes. It is a PWA. After the first visit it is cached, so rendering works without a network connection. You can also install it to your home screen.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      'Built and maintained by Geppetto. Some code is written with AI assistance; all review and decisions are the maintainer\'s.',
    securityText: 'Security',
  },
};
