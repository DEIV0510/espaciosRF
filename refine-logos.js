/**
 * refine-logos.js
 * Los logos originales son 4381x3506 (~700-970KB) con mucho margen vacío.
 * Aquí: (1) reportamos si tienen transparencia (clave para usar el logo blanco
 * sobre el hero oscuro), (2) recortamos el margen uniforme (autocrop) y
 * (3) reducimos a 900px de lado para que pesen poco.
 */
const { Jimp } = require("jimp");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "assets", "img");
const MAX = 900;
const FILES = ["logo-dark.png", "logo-white.png"];

(async () => {
  for (const f of FILES) {
    const p = path.join(DIR, f);
    if (!fs.existsSync(p)) { console.log(`falta ${f}`); continue; }
    const img = await Jimp.read(p);
    // Pixel esquina (0,0): RGBA -> ¿alpha 0 = transparente?
    const d = img.bitmap.data;
    const corner = { r: d[0], g: d[1], b: d[2], a: d[3] };
    const hasAlpha = img.hasAlpha ? img.hasAlpha() : "n/a";

    img.autocrop();                 // recorta borde uniforme (transparente o sólido)
    const { width, height } = img.bitmap;
    const scale = Math.min(1, MAX / Math.max(width, height));
    if (scale < 1) img.resize({ w: Math.round(width * scale), h: Math.round(height * scale) });
    await img.write(p);

    const kb = Math.round(fs.statSync(p).size / 1024);
    console.log(`${f}: corner=rgba(${corner.r},${corner.g},${corner.b},${corner.a}) hasAlpha=${hasAlpha} -> ${img.bitmap.width}x${img.bitmap.height}, ${kb}KB`);
  }
})();
