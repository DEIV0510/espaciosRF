/**
 * convert-images.js
 * Convierte las fotos de proyectos (.jpg / .heic) de la carpeta EspacioRF a
 * .PNG redimensionadas y optimizadas para web, y copia los logos.
 *
 * Requisito del cliente: el sitio debe referenciar ÚNICAMENTE imágenes .png.
 * Por eso re-codificamos cada foto a PNG (sin pérdida) tras reducir su tamaño
 * a un máximo de 1500px de lado para mantener la web ligera y rápida.
 *
 * Uso:  node convert-images.js
 * (jimp se resuelve desde el node_modules de la carpeta Sesiones, nivel superior)
 */
const { Jimp } = require("jimp");
const fs = require("fs");
const path = require("path");

const SRC = "C:\\Users\\Lenovo\\OneDrive\\Escritorio\\EspacioRF";
const OUT = path.join(__dirname, "assets", "img", "proyectos");
const LOGO_OUT = path.join(__dirname, "assets", "img");

// Lado máximo (px). 1500 = nítido en pantallas grandes pero peso contenido.
const MAX = 1500;

// Mapa fuente -> nombre de salida limpio (sin acentos, web-friendly) + categoría.
const PHOTOS = [
  { src: "cocina.jpg",  out: "cocina-1.png", cat: "cocinas" },
  { src: "cocina2.jpg", out: "cocina-2.png", cat: "cocinas" },
  { src: "cocina3.jpg", out: "cocina-3.png", cat: "cocinas" },
  { src: "cocina4.jpg", out: "cocina-4.png", cat: "cocinas" },
  { src: "cocina5.HEIC",out: "cocina-5.png", cat: "cocinas" }, // puede fallar (HEIC)
  { src: "cocina6.jpg", out: "cocina-6.png", cat: "cocinas" },
  { src: "cocina7.jpg", out: "cocina-7.png", cat: "cocinas" },
  { src: "baño.jpg",    out: "bano-1.png",   cat: "banos"   },
  { src: "baño2.jpg",   out: "bano-2.png",   cat: "banos"   },
  { src: "baño3.jpg",   out: "bano-3.png",   cat: "banos"   },
  { src: "sala.jpg",    out: "sala-1.png",   cat: "interiores" },
];

const LOGOS = [
  { src: "logo1.PNG", out: "logo-dark.png"  }, // marca oscura -> fondos claros
  { src: "logo2.PNG", out: "logo-white.png" }, // marca blanca -> fondos oscuros
];

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(LOGO_OUT, { recursive: true });

async function convertOne({ src, out }, destDir, resize) {
  const inPath = path.join(SRC, src);
  const outPath = path.join(destDir, out);
  if (!fs.existsSync(inPath)) { console.log(`  ! falta: ${src}`); return null; }
  try {
    const img = await Jimp.read(inPath);
    const { width, height } = img.bitmap;
    if (resize) {
      const scale = Math.min(1, MAX / Math.max(width, height));
      if (scale < 1) {
        img.resize({ w: Math.round(width * scale), h: Math.round(height * scale) });
      }
    }
    await img.write(outPath);
    const kb = Math.round(fs.statSync(outPath).size / 1024);
    console.log(`  ✓ ${src} -> ${out}  (${img.bitmap.width}x${img.bitmap.height}, ${kb}KB)`);
    return out;
  } catch (e) {
    console.log(`  ✗ ${src}: ${e.message.split("\n")[0]}`);
    return null;
  }
}

(async () => {
  console.log("Logos:");
  for (const l of LOGOS) await convertOne(l, LOGO_OUT, false);

  console.log("\nFotos de proyectos (PNG, max " + MAX + "px):");
  const ok = [];
  for (const p of PHOTOS) {
    const r = await convertOne(p, OUT, true);
    if (r) ok.push({ out: r, cat: p.cat });
  }

  console.log(`\nListo: ${ok.length}/${PHOTOS.length} fotos convertidas.`);
  console.log("Por categoría:");
  const byCat = {};
  ok.forEach(o => { (byCat[o.cat] = byCat[o.cat] || []).push(o.out); });
  Object.entries(byCat).forEach(([c, arr]) => console.log(`  ${c}: ${arr.join(", ")}`));
})();
