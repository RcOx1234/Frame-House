/**
 * Exporta cada página del PDF a PNG en public/images/portfolio-frame-house/
 * y genera manifest.json con rutas relativas al base de Vite.
 *
 * Uso:
 *   node scripts/export-pdf-to-images.mjs
 *   node scripts/export-pdf-to-images.mjs "C:\\ruta\\portafolio.pdf"
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'images', 'portfolio-frame-house');
const defaultPdf =
  'C:\\Users\\Romina\\Documents\\PORTAFOLIO FRAME HOUSE.ec.pdf';
const fallbackPdf = path.join(root, 'public', 'documents', 'portfolio-frame-house.pdf');

const pdfPath = process.argv[2] || (fs.existsSync(defaultPdf) ? defaultPdf : fallbackPdf);

if (!fs.existsSync(pdfPath)) {
  console.error('No se encontró el PDF. Pasa la ruta como argumento o coloca:');
  console.error(' ', defaultPdf);
  console.error(' o ', fallbackPdf);
  process.exit(1);
}

const nm = path.join(root, 'node_modules', 'pdfjs-dist');
const workerFile = path.join(nm, 'build', 'pdf.worker.mjs');
const cmapsDir = path.join(nm, 'cmaps');
const standardFontDir = path.join(nm, 'standard_fonts');

function toFileUrlDir(dir) {
  let u = pathToFileURL(dir).href;
  if (!u.endsWith('/')) u += '/';
  return u;
}

pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerFile).href;

const data = new Uint8Array(fs.readFileSync(pdfPath));

const loadingTask = pdfjs.getDocument({
  data,
  cMapUrl: toFileUrlDir(cmapsDir),
  cMapPacked: true,
  standardFontDataUrl: toFileUrlDir(standardFontDir),
  useSystemFonts: true,
  verbosity: 0,
});

const pdf = await loadingTask.promise;
fs.mkdirSync(outDir, { recursive: true });

const scale = 2;
const pages = [];

for (let i = 1; i <= pdf.numPages; i++) {
  const page = await pdf.getPage(i);
  const viewport = page.getViewport({ scale });
  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext('2d');

  await page.render({
    canvas,
    viewport,
    canvasContext: context,
  }).promise;

  const name = `page-${String(i).padStart(3, '0')}.png`;
  const abs = path.join(outDir, name);
  fs.writeFileSync(abs, canvas.toBuffer('image/png'));
  pages.push(`images/portfolio-frame-house/${name}`);
  console.log('Página', i, '/', pdf.numPages, '→', name);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  sourcePdf: path.basename(pdfPath),
  pages: pages.map((src, idx) => ({
    src,
    caption: `Portafolio Frame House · ${idx + 1} / ${pages.length}`,
  })),
};

fs.writeFileSync(
  path.join(outDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2),
  'utf8',
);

console.log('\nListo:', pages.length, 'PNG en', outDir);
