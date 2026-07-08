# Third-party notices

The source code in this repository is licensed under the MIT License (see LICENSE).
It redistributes the following third-party components under their own licenses.

## pdfjs-dist (pdf.js) — Apache-2.0

- **Package:** [`pdfjs-dist`](https://www.npmjs.com/package/pdfjs-dist)
- **Copyright:** Copyright 2024 Mozilla Foundation
- **Upstream:** [mozilla/pdf.js](https://github.com/mozilla/pdf.js)
- **License:** [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- **What it does here:** parses each PDF and rasterizes (renders) its pages onto a
  `<canvas>`, which this tool then encodes to PNG or JPG. This is the tool's core
  engine — no modifications were made to the library; it is used unmodified as an
  npm dependency, with its bundled worker script (`pdf.worker.min.mjs`) served as a
  same-origin static asset.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
language governing permissions and limitations under the License.

### Bundled pdf.js assets: fonts, CMaps, and WASM image codecs

Beyond the JS/worker code above, this tool copies several more directories verbatim
out of the installed `pdfjs-dist` package into `public/pdf-to-image/pdfjs/` at build
time (`postinstall`), served as same-origin static assets that pdf.js fetches at
runtime. Each carries its own license, included unmodified alongside it:

- **`cmaps/`** — Adobe's predefined CMaps for CID-keyed (mostly CJK) fonts. BSD-style
  license (Adobe), `LICENSE` file included.
- **`standard_fonts/`** — substitute metrics for the 14 standard PDF fonts, from
  Foxit (BSD-style, `LICENSE_FOXIT`) plus the Liberation fonts (SIL Open Font
  License, `LICENSE_LIBERATION`).
- **`wasm/`** — three optional WebAssembly image codecs pdf.js loads only if a PDF's
  embedded images actually need them (scanned documents, mainly):
  - `openjpeg.wasm` (JPX/JPEG2000) — OpenJPEG, 2-Clause BSD, plus Mozilla's own
    2-Clause BSD wrapper (`LICENSE_OPENJPEG`, `LICENSE_PDFJS_OPENJPEG`).
  - `jbig2.wasm` (JBIG2) — derived from the PDFium project, BSD-style, plus
    Mozilla's Apache-2.0 wrapper (`LICENSE_JBIG2`, `LICENSE_PDFJS_JBIG2`).
  - `qcms_bg.wasm` (ICC color management) — MIT-style (Mozilla Corporation /
    Marti Maria), plus Mozilla's 2-Clause BSD wrapper (`LICENSE_QCMS`,
    `LICENSE_PDFJS_QCMS`).

All of the above are permissive (BSD/MIT/Apache-2.0/OFL — no GPL/AGPL anywhere in
this chain) and none were modified; each directory's own `LICENSE*` file(s) are
copied verbatim alongside the asset and served from the same path in production.

## @zip.js/zip.js — BSD-3-Clause

Copyright (c) 2023, Gildas Lormeau

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this
   list of conditions and the following disclaimer in the documentation and/or
   other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may
   be used to endorse or promote products derived from this software without
   specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.

Other dependencies — Astro, Preact, and @astrojs/preact — are distributed under the MIT License.
