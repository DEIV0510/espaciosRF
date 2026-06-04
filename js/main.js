/* =====================================================================
   INNOVAR ESPACIOS RF — main.js
   Preloader · smooth scroll · reveals · parallax · contador ·
   filtros de galería · lightbox · menú móvil.
   Todo con guardas de prefers-reduced-motion y sin provocar saltos.
   ===================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  root.classList.add('js'); // habilita el ocultado de los [data-reveal]

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = window.matchMedia('(hover:hover) and (pointer:fine)').matches && window.innerWidth > 860;

  /* ============================================================
     CONFIGURA AQUÍ TU WHATSAPP
     Reemplaza el número (formato internacional, sin "+", sin espacios).
     Ej. Colombia: 57 + número  ->  573001234567
  ============================================================= */
  var WHATSAPP_NUMBER = '573103325222'; // WhatsApp Business de Innovar Espacios RF
  var WHATSAPP_MSG = 'Hola Innovar Espacios RF, me gustaría recibir una asesoría para mi proyecto.';

  function waHref() {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(WHATSAPP_MSG);
  }
  // Aplica el enlace a todos los botones marcados con data-wa
  Array.prototype.forEach.call(doc.querySelectorAll('[data-wa]'), function (a) {
    a.setAttribute('href', waHref());
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });

  // Año dinámico en el footer
  var yearEl = doc.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ PRELOADER ============ */
  var preloader = doc.getElementById('preloader');
  var MIN_SHOW = 1800;                 // tiempo mínimo visible (ms) — deja completar el barrido del logo
  var startedAt = (window.performance && performance.now) ? performance.now() : Date.now();
  var heroReveals = Array.prototype.slice.call(doc.querySelectorAll('.hero [data-reveal]'));

  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }

  function hidePreloader() {
    if (!preloader || preloader.classList.contains('is-done')) return;
    preloader.classList.add('is-done');
    doc.body.classList.remove('is-loading');
    // Entrada escalonada del hero (después de que el preloader empieza a irse)
    if (reduceMotion) {
      heroReveals.forEach(function (el) { el.classList.add('in-view'); });
    } else {
      heroReveals.forEach(function (el, i) {
        setTimeout(function () { el.classList.add('in-view'); }, 120 + i * 130);
      });
    }
    setTimeout(function () {
      if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, 850);
  }

  function schedulePreloader() {
    var elapsed = now() - startedAt;
    setTimeout(hidePreloader, Math.max(0, MIN_SHOW - elapsed));
  }

  // Espera a que la imagen del hero esté lista (evita que aparezca después)
  (function whenHeroReady() {
    var img = doc.querySelector('.hero__media img');
    if (!img || img.complete) { schedulePreloader(); return; }
    img.addEventListener('load', schedulePreloader, { once: true });
    img.addEventListener('error', schedulePreloader, { once: true });
  })();
  window.addEventListener('load', schedulePreloader);   // respaldo
  setTimeout(hidePreloader, 4500);                       // tope máximo de seguridad

  /* ============ REVEALS (IntersectionObserver) ============ */
  var allReveals = Array.prototype.slice.call(doc.querySelectorAll('[data-reveal]'));
  var ioReveals = allReveals.filter(function (el) { return heroReveals.indexOf(el) === -1; });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    allReveals.forEach(function (el) { el.classList.add('in-view'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    ioReveals.forEach(function (el) { io.observe(el); });
  }

  /* ============ NAV: estado al hacer scroll ============ */
  var nav = doc.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ============ MENÚ MÓVIL ============ */
  var toggle = doc.getElementById('navToggle');
  var navLinks = doc.getElementById('navLinks');
  function closeMenu() {
    doc.body.classList.remove('menu-open');
    if (toggle) { toggle.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menú'); }
  }
  function openMenu() {
    doc.body.classList.add('menu-open');
    if (toggle) { toggle.classList.add('is-open'); toggle.setAttribute('aria-expanded', 'true'); toggle.setAttribute('aria-label', 'Cerrar menú'); }
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      doc.body.classList.contains('menu-open') ? closeMenu() : openMenu();
    });
  }

  /* ============ SMOOTH SCROLL (Lenis, solo escritorio) ============ */
  var lenis = null;
  if (isDesktop && !reduceMotion && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.1 });
    lenis.on('scroll', onScroll);
    var rafLoop = function (t) { lenis.raf(t); requestAnimationFrame(rafLoop); };
    requestAnimationFrame(rafLoop);
    window.__lenis = lenis;
  }

  // Desplazamiento suave para anclas internas
  Array.prototype.forEach.call(doc.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id.length < 2) return;            // ignora href="#"
      var target = doc.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      var top = target.getBoundingClientRect().top + window.scrollY - 56;
      if (lenis) lenis.scrollTo(top, { duration: 1.2 });
      else window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ============ PARALLAX DEL HERO (escritorio) ============ */
  var heroMedia = doc.querySelector('.hero__media');
  if (heroMedia && !reduceMotion && window.matchMedia('(hover:hover)').matches) {
    var sy = 0, mx = 0, my = 0, ticking = false;
    heroMedia.style.transform = 'scale(1.16)';
    function applyHero() {
      var slack = heroMedia.offsetHeight * 0.07;
      var ty = Math.min(sy * 0.22, slack);
      heroMedia.style.transform = 'translate3d(' + mx + 'px,' + (ty + my) + 'px,0) scale(1.16)';
      ticking = false;
    }
    function requestHero() { if (!ticking) { ticking = true; requestAnimationFrame(applyHero); } }
    window.addEventListener('scroll', function () { sy = window.scrollY; if (sy < window.innerHeight) requestHero(); }, { passive: true });
    if (isDesktop) {
      var hero = doc.getElementById('inicio');
      hero.addEventListener('mousemove', function (e) {
        mx = (e.clientX / window.innerWidth - 0.5) * 12;
        my = (e.clientY / window.innerHeight - 0.5) * 10;
        requestHero();
      });
    }
  }

  /* ============ CONTADOR (5+ años) ============ */
  var counter = doc.querySelector('[data-count]');
  if (counter) {
    var targetNum = parseInt(counter.getAttribute('data-count'), 10) || 0;
    var ran = false;
    function runCounter() {
      if (ran) return; ran = true;
      if (reduceMotion) { counter.textContent = targetNum; return; }
      var dur = 1100, t0 = now();
      (function step() {
        var p = Math.min(1, (now() - t0) / dur);
        counter.textContent = Math.round(targetNum * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })();
    }
    if ('IntersectionObserver' in window) {
      var co = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { runCounter(); co.disconnect(); } });
      }, { threshold: 0.4 });
      co.observe(counter);
    } else { runCounter(); }
  }

  /* ============ GALERÍA: filtros + lightbox ============ */
  var filters = Array.prototype.slice.call(doc.querySelectorAll('.filter'));
  var items = Array.prototype.slice.call(doc.querySelectorAll('.g-item'));
  var visible = items.slice();

  function refreshVisible() {
    visible = items.filter(function (it) { return !it.classList.contains('hide'); });
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active'); btn.setAttribute('aria-selected', 'true');
      var f = btn.getAttribute('data-filter');
      items.forEach(function (it) {
        var show = (f === 'all' || it.getAttribute('data-cat') === f);
        it.classList.toggle('hide', !show);
      });
      refreshVisible();
    });
  });

  // ---- Lightbox ----
  var lb = doc.getElementById('lightbox');
  var lbImg = doc.getElementById('lbImg');
  var lbCap = doc.getElementById('lbCaption');
  var lbClose = doc.getElementById('lbClose');
  var lbPrev = doc.getElementById('lbPrev');
  var lbNext = doc.getElementById('lbNext');
  var idx = 0, opener = null;

  function setLb() {
    var it = visible[idx]; if (!it) return;
    var img = it.querySelector('img');
    var cap = it.querySelector('figcaption');
    var full = img.currentSrc || img.src;
    lbImg.style.opacity = '0';
    var pre = new Image();
    pre.onload = function () { lbImg.src = full; lbImg.alt = img.alt; lbImg.style.opacity = ''; };
    pre.src = full;
    if (pre.complete) pre.onload();
    lbCap.textContent = cap ? cap.textContent : '';
    // precarga vecinos para navegación fluida
    [visible[idx + 1], visible[idx - 1]].forEach(function (n) {
      if (n) { var i = new Image(); i.src = n.querySelector('img').src; }
    });
  }
  function openLb(item) {
    refreshVisible();
    idx = visible.indexOf(item);
    if (idx < 0) return;
    opener = item;
    setLb();
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    doc.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    if (lbClose) lbClose.focus();
  }
  function closeLb() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    doc.body.style.overflow = '';
    if (lenis) lenis.start();
    if (opener) opener.focus();
  }
  function nextLb() { idx = (idx + 1) % visible.length; setLb(); }
  function prevLb() { idx = (idx - 1 + visible.length) % visible.length; setLb(); }

  items.forEach(function (it) {
    it.setAttribute('tabindex', '0');
    it.setAttribute('role', 'button');
    it.setAttribute('aria-label', 'Ampliar imagen del proyecto');
    it.addEventListener('click', function () { openLb(it); });
    it.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(it); }
    });
  });

  if (lb) {
    if (lbClose) lbClose.addEventListener('click', closeLb);
    if (lbNext) lbNext.addEventListener('click', nextLb);
    if (lbPrev) lbPrev.addEventListener('click', prevLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    doc.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') nextLb();
      else if (e.key === 'ArrowLeft') prevLb();
    });
    // Swipe en móvil
    var touchX = 0;
    lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) { dx < 0 ? nextLb() : prevLb(); }
    });
  }

})();
