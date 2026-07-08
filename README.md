# pdf-to-image

Render PDF pages to PNG or JPG images, entirely in your browser. Files are
processed on your device and never uploaded. Open source, works offline (PWA).

Part of [runlocally](https://runlocally.app) — small tools that run locally on your device.

## How it works

Each page is parsed and rasterized by [pdf.js](https://mozilla.github.io/pdf.js/)
(`pdfjs-dist`) onto a `<canvas>`, then encoded to PNG or JPG via `canvas.toBlob()`.
pdf.js does its parsing/decoding inside its own dedicated worker; the final canvas
paint runs on the main thread. There is no server component, so files have no path
off the device.

## Features

- Render selected pages (or all of them) to PNG or JPG
- Adjustable resolution (DPI) and JPG quality
- One page downloads as an image; more than one downloads as a .zip
- A clear, localized message for password-protected PDFs (they can't be opened)
- Works offline (PWA), installable

## Develop

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
```

Stack: Astro + Preact + TypeScript. Rendering uses pdf.js (`pdfjs-dist`).

## Browser support

Works in current Chrome, Edge, Firefox and Safari. The only requirements are
`<canvas>` and Web Worker support (pdf.js's own worker), both of which are
universal in evergreen browsers.

## License

[MIT](./LICENSE). Built and maintained by Geppetto. Some code is written with AI
assistance; all review and decisions are the maintainer's.
