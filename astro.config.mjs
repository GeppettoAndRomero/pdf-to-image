import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  output: 'static',
  // slug-first namespace: the tool is physically nested at runlocally.app/pdf-to-image/
  // (src/pages/pdf-to-image/ + public/pdf-to-image/). No `base` (it prefixes URLs but
  // doesn't nest `dist/`, which would fight the root-served Pages project). Bundled
  // assets are isolated under /pdf-to-image/_assets/ so they never collide with the
  // hub or other tools.
  build: {
    inlineStylesheets: 'auto',
    assets: 'pdf-to-image/_assets',
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['preact', 'preact/hooks'],
            'zip': ['@zip.js/zip.js'],
            // pdfjs-dist is only ever reached via a dynamic `import('pdfjs-dist')`
            // in pdfRenderEngine.ts (never a static import), so Rollup already
            // keeps it out of the entry chunk. Naming it explicitly here just
            // pins it to one predictable, cacheable chunk file instead of
            // whatever Rollup would otherwise call it — it is fetched only once
            // a PDF is actually dropped, not on first paint.
            'pdfjs': ['pdfjs-dist'],
          }
        }
      }
    }
  },
  compressHTML: true,
  scopedStyleStrategy: 'class'
});
