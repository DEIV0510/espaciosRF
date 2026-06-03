# Innovar Espacios RF — Landing page

Landing page profesional, responsive y optimizada para **Innovar Espacios RF**
(remodelaciones, acabados y carpintería arquitectónica · Villeta).

> _Diseña tu mundo, vive tu estilo._

---

## 📁 Estructura de carpetas

Sube **toda la carpeta** `innovar-espacios-rf/` a tu hosting tal cual está.
No cambies la ubicación relativa de los archivos.

```
innovar-espacios-rf/
├── index.html              ← página principal
├── css/
│   └── styles.css          ← todos los estilos
├── js/
│   ├── main.js             ← interacciones (preloader, galería, menú, etc.)
│   └── lenis.min.js        ← scroll suave (librería local, sin internet)
├── assets/
│   ├── favicon.svg         ← ícono de la pestaña
│   └── img/
│       ├── logo-white.png  ← logo blanco (fondos oscuros)
│       ├── logo-dark.png   ← logo oscuro (fondos claros)
│       └── proyectos/      ← galería: .webp (se sirven) + .png (respaldo)
│           ├── cocina-1.png … cocina-4 / 6 / 7
│           ├── bano-1.png  / bano-2 / bano-3
│           └── sala-1.png
│
├── server.js               ← (opcional) mini-servidor para ver en local
├── convert-images.js       ← (opcional) generó las .png desde las fotos originales
├── convert-webp.js         ← (opcional) generó las .webp (versión liviana)
└── refine-logos.js         ← (opcional) recortó/optimizó los logos
```

Los archivos `.js` de apoyo de la raíz (`server.js`, `convert-images.js`,
`convert-webp.js`, `refine-logos.js`) **no son necesarios para publicar**. Puedes
borrarlos al subir si quieres dejar la carpeta más limpia.

---

## ⚠️ ANTES DE PUBLICAR — personaliza 3 cosas

1. **Número de WhatsApp** (lo más importante)
   Abre `js/main.js` (líneas ~25-26) y reemplaza el número de ejemplo:
   ```js
   var WHATSAPP_NUMBER = '573000000000'; // ← pon aquí tu número real
   ```
   Formato internacional, sin `+`, sin espacios. Ej. Colombia: `57` + número →
   `573001234567`. Ese mismo número se usa en **todos** los botones de WhatsApp
   (hero, CTA, footer y el botón flotante).

2. **Redes sociales**
   En `index.html`, busca `footer__social` (cerca del final) y cambia los `href="#"`
   por los enlaces reales de Instagram y Facebook. Si no tienen redes, puedes borrar
   esos dos `<a>`.

3. **Dominio (cuando lo tengas)**
   En `index.html`, dentro de `<head>`, actualiza la etiqueta `<link rel="canonical">`
   y `og:image`/URL con tu dominio real.

---

## 👀 Ver la página en local (opcional)

**Opción A — con Node:**
```bash
cd innovar-espacios-rf
node server.js
```
Abre <http://localhost:5197/>

**Opción B — VS Code:** instala la extensión _Live Server_, clic derecho sobre
`index.html` → _Open with Live Server_.

> Nota: ábrela siempre desde un servidor (no con doble clic en `index.html`), para
> que carguen bien las imágenes y el scroll suave.

---

## ✅ Qué incluye / cómo está optimizada

- **100% responsive**: celular, tablet y escritorio (probado a 375 / 768 / 1440 px,
  sin scroll horizontal en ninguno).
- **Imágenes optimizadas (WebP + respaldo PNG)**: cada foto se sirve en **WebP**
  (~25–100 KB c/u, antes 1.7–3 MB en PNG) mediante `<picture>`, con el **PNG como
  respaldo** para navegadores antiguos. Así carga rápido y **sin fallos en cualquier
  celular** (iPhone/Android). Con **lazy-loading** y dimensiones reservadas (sin CLS).
  Para regenerar los WebP: `node convert-webp.js`.
- **Pantalla de carga** con trazo arquitectónico y logo, sin parpadeos (el fondo
  grafito se pinta de inmediato para evitar destellos blancos).
- **Animaciones suaves**: aparición al hacer scroll, parallax sutil en el hero
  (solo escritorio), hover en tarjetas, galería con filtros y modal a pantalla
  completa.
- **Accesible**: foco visible, `alt` en imágenes, navegación por teclado en la
  galería, y respeta `prefers-reduced-motion` (desactiva animaciones si el sistema
  lo pide).
- **SEO básico**: `title`, `description`, Open Graph, etiquetas semánticas y `alt`.

### Sobre las fotos
Se incluyeron 10 fotos (6 cocinas, 3 baños, 1 sala). La foto original
`cocina5.HEIC` no se pudo convertir (formato HEIC de iPhone, no compatible con la
herramienta de conversión); si la necesitas, expórtala a `.png` o `.jpg` desde el
celular y vuelve a ejecutar `node convert-images.js`.

---

*Hecho con HTML, CSS y JavaScript puro — sin frameworks, rápido y fácil de mantener.*
