(function () {
"use strict";
/* studio-master · core/js/_prelude.js — toujours inclus, en tête du bundle app.js.
   Les modules suivants sont concaténés dans la même IIFE et réutilisent ces helpers. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.prototype.slice.call(r.querySelectorAll(s));
const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const hasIO = 'IntersectionObserver' in window;
const isMobile = () => window.matchMedia('(max-width: 560px)').matches;

/* header — pilule flottante au scroll, burger mobile, scrollspy des ancres.
   Hooks : [data-header] · [data-burger] · [data-nav] (liens #ancre = scrollspy) */
(function () {
  const bar = $('[data-header]');
  if (bar) {
    const onScroll = () => bar.classList.toggle('is-float', window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const burger = $('[data-burger]');
  const nav = $('[data-nav]');
  if (burger && nav) {
    const set = (open) => {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    burger.addEventListener('click', () => set(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') set(false); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }

  // scrollspy : n'a de sens que sur la page qui porte les ancres
  const links = nav ? $$('a[href^="#"]', nav).filter((a) => a.getAttribute('href').length > 1) : [];
  if (links.length && hasIO) {
    const targets = links.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    if (targets.length) {
      const setActive = (id) => links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
      const spy = new IntersectionObserver((entries) => {
        let best = null;
        entries.forEach((en) => { if (en.isIntersecting && (!best || en.intersectionRatio > best.intersectionRatio)) best = en; });
        if (best) setActive(best.target.id);
      }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
      targets.forEach((el) => spy.observe(el));
    }
  }
})();

/* slider — rail scroll-snap mobile générique + points + défilement auto optionnel.
   Hooks : [data-slider] sur le conteneur de cartes.
   Options : data-dots (génère les points) · data-auto="2800" (auto-avance en ms, mobile seulement) */
(function () {
  $$('[data-slider]').forEach((track) => {
    let dots = [];
    if (track.hasAttribute('data-dots') && track.children.length > 1) {
      const wrap = document.createElement('div');
      wrap.className = 'slider-dots';
      wrap.setAttribute('aria-hidden', 'true');
      Array.prototype.forEach.call(track.children, (_, i) => {
        const d = document.createElement('span');
        if (i === 0) d.className = 'is-active';
        wrap.appendChild(d);
      });
      track.insertAdjacentElement('afterend', wrap);
      dots = $$('span', wrap);
    }

    // empreinte réelle d'une carte (largeur + gap) — PAS clientWidth, qui compte aussi le padding du rail
    const step = () => {
      const first = track.children[0];
      if (!first) return track.clientWidth;
      return first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
    };
    const setActive = (i) => dots.forEach((d, k) => d.classList.toggle('is-active', k === i));

    let scrollT;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollT);
      scrollT = setTimeout(() => { const s = step(); if (s && dots.length) setActive(Math.round(track.scrollLeft / s)); }, 80);
    }, { passive: true });

    const interval = parseInt(track.getAttribute('data-auto'), 10);
    if (interval && !reduced) {
      let timer = null, resume;
      const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
      const start = () => {
        if (timer || !isMobile()) return;
        timer = setInterval(() => {
          const n = track.children.length, s = step();
          if (!n || !s) return;
          track.scrollTo({ left: ((Math.round(track.scrollLeft / s) + 1) % n) * s, behavior: 'smooth' });
        }, interval);
      };
      const pause = () => { stop(); clearTimeout(resume); resume = setTimeout(start, 4000); };
      track.addEventListener('pointerdown', pause);
      track.addEventListener('touchstart', pause, { passive: true });
      window.addEventListener('resize', () => { stop(); start(); });
      start();
    }
  });
})();

/* counters — les nombres montent de 0 à leur valeur quand ils entrent à l'écran.
   Hooks : [data-count="33.862"] [data-decimals="3"]. La valeur finale est toujours le texte d'origine :
   sans JS, avec reduced-motion ou sans IntersectionObserver, le bon nombre est déjà affiché. */
(function () {
  const els = $$('[data-count]');
  if (!els.length || reduced || !hasIO) return;
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const fmt = (v, d) => { const s = v.toFixed(d); return d > 0 ? s.replace('.', ',') : s; };
  const run = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    const d = el.hasAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    let t0 = null;
    const step = (ts) => {
      if (t0 === null) t0 = ts;
      const p = Math.min(1, (ts - t0) / 1300);
      el.textContent = fmt(target * ease(p), d);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.4 });
  els.forEach((el) => io.observe(el));
})();

/* misc — petits comportements sans état, activés par leurs hooks.
   [data-fab]       bouton d'appel flottant, masqué quand le footer est visible
   [data-autoplay]  <video> muette en boucle (respecte reduced-motion, filet iOS)
   [data-hours]     tableau d'horaires, ligne du jour surlignée (tr[data-day=0..6], 0 = dimanche) */
(function () {
  const fab = $('[data-fab]');
  const footer = $('footer');
  if (fab && footer && hasIO) {
    new IntersectionObserver((entries) => {
      entries.forEach((en) => fab.classList.toggle('is-hidden', en.isIntersecting));
    }).observe(footer);
  }

  $$('video[data-autoplay]').forEach((v) => {
    if (reduced) { v.removeAttribute('loop'); v.pause(); return; }
    // iOS Safari ne prend pas toujours l'attribut muted en compte : on force la propriété
    v.muted = true; v.defaultMuted = true;
    const play = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    play();
    v.addEventListener('canplay', play);
    v.addEventListener('loadedmetadata', play);
  });

  $$('[data-hours]').forEach((table) => {
    const row = $('tr[data-day="' + new Date().getDay() + '"]', table);
    if (row) row.classList.add('is-today');
  });
})();

/* form — envoi Web3Forms, avec repli automatique sur mailto: tant que la clé n'est pas renseignée.
   Hooks : <form data-form data-mailto="contact@client.fr" data-subject="Demande via client.fr">
           <input type="hidden" name="access_key" value="…">  [data-form-status] pour les messages
   Champs lus pour le corps du mail : tous les champs nommés (label = attribut data-label ou name). */
(function () {
  const ENDPOINT = 'https://api.web3forms.com/submit';
  $$('form[data-form]').forEach((form) => {
    const status = $('[data-form-status]', form);
    const say = (cls, msg) => { if (status) { status.className = 'form__status ' + cls; status.textContent = msg; } };
    const val = (el) => String(el.value || '').trim();

    const mailtoBody = () => Array.prototype.slice.call(form.elements)
      .filter((el) => el.name && el.name !== 'access_key' && el.name !== 'botcheck' && el.type !== 'submit' && val(el))
      .map((el) => ((el.getAttribute('data-label') || el.name) + ' : ' + val(el)))
      .join('\n');
    const mailtoFallback = () => {
      const to = form.getAttribute('data-mailto') || '';
      const subject = form.getAttribute('data-subject') || 'Demande depuis le site';
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(mailtoBody());
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;
      const keyEl = form.elements.access_key;
      const key = keyEl ? val(keyEl) : '';
      if (!key || /A_COMPLETER|VOTRE_CLE/.test(key)) { mailtoFallback(); return; }

      say('is-info', 'Envoi en cours…');
      fetch(ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        .then((r) => r.json())
        .then((d) => {
          if (!d || !d.success) throw new Error('fail');
          form.reset();
          say('is-ok', 'Merci, votre demande est bien partie. On vous recontacte très vite.');
        })
        .catch(() => {
          say('is-err', 'L’envoi automatique a échoué — on ouvre votre messagerie pour envoyer la demande.');
          setTimeout(mailtoFallback, 1200);
        });
    });
  });
})();

/* compare — comparateur avant/après, avec onglets si plusieurs exemples.
   Hooks : [data-compare] > [role=tablist] (boutons role=tab aria-controls) + [role=tabpanel] > .ba
   Le curseur est un <input type="range"> invisible posé sur l'image : accessible au clavier, tactile, sans code de drag.
   (Extrait de mgnclean44 — slider à souris/tactile — et d'easylocsud — variante range.) */
(function () {
  $$('[data-compare]').forEach((box) => {
    const tabs = $$('[role="tab"]', box);
    const panels = $$('[role="tabpanel"]', box);
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((t) => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.classList.toggle('is-active', on); });
      panels.forEach((p) => { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
    }));

    $$('.ba', box).forEach((ba) => {
      const range = $('.ba__range', ba);
      if (!range) return;
      const set = (v) => ba.style.setProperty('--pos', v + '%');
      range.addEventListener('input', () => { stopDemo(); set(range.value); });
      let demo = null;
      const stopDemo = () => { if (demo) { clearInterval(demo); demo = null; } };
      // petit balayage de démonstration au premier passage (ignoré si reduced-motion)
      if (hasIO && !reduced) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            io.unobserve(ba);
            let t = 0;
            demo = setInterval(() => {
              t += 1;
              const v = 50 + Math.sin(t / 8) * 22;
              range.value = v; set(v);
              if (t > 60) { stopDemo(); range.value = 50; set(50); }
            }, 30);
          });
        }, { threshold: 0.5 });
        io.observe(ba);
      }
    });
  });
})();

/* lightbox — agrandit les images d'un conteneur, navigation flèches/clavier/swipe, Échap, focus rendu à la fermeture.
   Hook : [data-lightbox] (les <img> descendantes dans un <figure> sont cliquables). Légende = <figcaption> sinon alt.
   Un seul calque partagé, créé au premier usage. */
(function () {
  const groups = $$('[data-lightbox]');
  if (!groups.length) return;
  let box, img, cap, list = [], i = 0, opener = null, x0 = null;

  const build = () => {
    box = document.createElement('div');
    box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Agrandissement'); box.hidden = true;
    box.innerHTML = '<button class="lightbox__x" type="button" aria-label="Fermer">×</button><button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Précédent">‹</button><figure class="lightbox__fig"><img alt=""><figcaption></figcaption></figure><button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Suivant">›</button>';
    document.body.appendChild(box);
    img = $('img', box); cap = $('figcaption', box);
    box.addEventListener('click', (e) => {
      if (e.target.closest('.lightbox__x') || e.target === box) close();
      else if (e.target.closest('.lightbox__nav--prev')) show(i - 1);
      else if (e.target.closest('.lightbox__nav--next')) show(i + 1);
    });
    box.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', (e) => { if (x0 === null) return; const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) show(i + (d < 0 ? 1 : -1)); x0 = null; });
    window.addEventListener('keydown', (e) => {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(i - 1);
      else if (e.key === 'ArrowRight') show(i + 1);
    });
  };
  const show = (n) => {
    if (!list.length) return;
    i = (n + list.length) % list.length;
    const el = list[i];
    img.src = el.currentSrc || el.src; img.alt = el.alt || '';
    const fc = el.closest('figure') && $('figcaption', el.closest('figure'));
    cap.textContent = (fc && fc.textContent.trim()) || el.alt || '';
  };
  const open = (group, el) => {
    if (!box) build();
    list = $$('img', group); opener = el; box.hidden = false; document.body.style.overflow = 'hidden';
    show(list.indexOf(el)); $('.lightbox__x', box).focus();
  };
  const close = () => { box.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus(); };

  groups.forEach((g) => {
    $$('img', g).forEach((el) => { el.tabIndex = 0; el.style.cursor = 'zoom-in'; });
    g.addEventListener('click', (e) => { const el = e.target.closest('img'); if (el) open(g, el); });
    g.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.tagName === 'IMG') { e.preventDefault(); open(g, e.target); } });
  });
})();

/* reveal — montée douce au scroll. Hook : .reveal. Toujours inclus, en dernier du bundle
   (il peut retourner tôt sans gêner les autres modules). */
(function () {
  const items = $$('.reveal');
  const showAll = () => items.forEach((el) => el.classList.add('in'));
  if (reduced || !hasIO || !items.length) { showAll(); return; }

  document.documentElement.classList.add('reveal-on');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  items.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add('in');
    else io.observe(el);
  });
  // filet de sécurité : rien ne doit rester invisible si l'observer ne se déclenche pas
  window.addEventListener('load', () => setTimeout(showAll, 1400));
})();
})();
