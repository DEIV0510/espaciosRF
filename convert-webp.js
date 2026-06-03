/**
 * convert-webp.js
 * Genera versiones WebP (livianas) de las fotos para que carguen rápido y sin
 * fallos en TODOS los celulares (iPhone/Android). El PNG se conserva como
 * respaldo automático (vía <picture>) para navegadores muy antiguos.
 *
 * Requiere: sharp (ya instalado).  Uso:  node convert-webp.js
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "assets", "img", "proyectos");

// La foto del hero (cocina-4) se usa a pantalla completa -> un poco más grande.
const JOBS = [
  { name: "cocina-4", max: 1600 },
  { name: "cocina-1", max: 1100 },
  { name: "cocina-2", max: 1100 },
  { name: "cocina-3", max: 1100 },
  { name: "cocina-6", max: 1100 },
  { name: "cocina-7", max: 1100 },
  { name: "bano-1",   max: 1100 },
  { name: "bano-2",   max: 1100 },
  { name: "bano-3",   max: 1100 },
  { name: "sala-1",   max: 1100 },
];

(async () => {
  let totalPng = 0, totalWebp = 0;
  for (const j of JOBS) {
    const src = path.join(DIR, j.name + ".png");
    const out = path.join(DIR, j.name + ".webp");
    if (!fs.existsSync(src)) { console.log("  ! falta", j.name + ".png"); continue; }
    await sharp(src)
      .resize(j.max, j.max, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(out);
    const png = fs.statSync(src).size, webp = fs.statSync(out).size;
    totalPng += png; totalWebp += webp;
    const meta = await sharp(out).metadata();
    console.log(`  ✓ ${j.name}: PNG ${Math.round(png/1024)}KB -> WebP ${Math.round(webp/1024)}KB  (${meta.width}x${meta.height})`);
  }
  console.log(`\nTOTAL: PNG ${Math.round(totalPng/1024/1024*10)/10}MB -> WebP ${Math.round(totalWebp/1024/1024*10)/10}MB`);
})();
