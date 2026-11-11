// Rootserve site behaviour
document.documentElement.classList.remove('no-js');

// Paste the Zoho Forms embed URL here (Zoho Forms > Share > Embed > iFrame src)
const ZOHO_FORM_URL = 'https://forms.zohopublic.com/inforoot1/form/AIAssessmentRequest/formperma/-l-w70ebrpPCryWKDNfDS8wR5BVh7L_U2-c3z9M09QA';

(function () {
  // mobile menu
  const btn = document.querySelector('.menu-btn');
  const links = document.querySelector('.nav-links');
  if (btn && links) {
    btn.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
    }));
  }

  // scroll progress bar
  const bar = document.querySelector('.progress');
  if (bar) {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // reveal on scroll
  const els = document.querySelectorAll('.reveal, .wipe');
  if ('IntersectionObserver' in window) {
    // clipped elements (.wipe) are watched through their parent so the clip cannot block detection
    const targets = new Map();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        (targets.get(e.target) || []).forEach(el => el.classList.add('is-in'));
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => {
      el.style.transitionDelay = (el.dataset.delay || 0) + 'ms';
      const watch = el.classList.contains('wipe') ? el.parentElement : el;
      if (!targets.has(watch)) targets.set(watch, []);
      targets.get(watch).push(el);
      io.observe(watch);
    });
  } else {
    els.forEach(el => el.classList.add('is-in'));
  }

  // solutions tabs
  const tabs = document.querySelectorAll('.tab');
  const panelBody = document.querySelector('.panel-body');
  const data = window.ROOTSERVE_SOLUTIONS;
  if (tabs.length && panelBody && data) {
    const check = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5CCFE6" stroke-width="2" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
    const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const show = i => {
      const d = data[i];
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); t.tabIndex = j === i ? 0 : -1; });
      panelBody.innerHTML = '<p class="tag">' + esc(d.kicker) + '</p><h3>' + esc(d.head) + '</h3><p>' + esc(d.body) + '</p><ul class="checks">' +
        d.items.map(x => '<li>' + check + esc(x) + '</li>').join('') + '</ul><a class="btn btn-primary" href="contact.html">Talk to us about this</a>';
      panelBody.classList.remove('swap'); void panelBody.offsetWidth; panelBody.classList.add('swap');
      document.querySelector('.panel').setAttribute('aria-labelledby', tabs[i].id);
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(i));
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const n = (i + (e.key === 'ArrowDown' ? 1 : -1) + tabs.length) % tabs.length;
          tabs[n].focus(); show(n);
        }
      });
    });
    show(0);
  }

  // carousel buttons
  const track = document.querySelector('.cards');
  document.querySelectorAll('[data-scroll]').forEach(b => b.addEventListener('click', () => {
    if (track) track.scrollBy({ left: (b.dataset.scroll === 'next' ? 1 : -1) * ((track.firstElementChild?.offsetWidth || 400) + 24), behavior: 'smooth' });
  }));

  // Zoho form embed
  const slot = document.getElementById('zoho-form');
  if (slot && ZOHO_FORM_URL) {
    slot.innerHTML = '<iframe title="Contact Rootserve" src="' + ZOHO_FORM_URL + '" loading="lazy"></iframe>';
  }

  // year
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();

/* Water ring video: start downloading only after the page has loaded (hero) or when it nears the screen (closing section).
   The poster image shows until then. */
(function () {
  const vids = [...document.querySelectorAll('video[data-lazy]')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Safari (iPhone, iPad and Mac) gets the H.264 MP4 only: it can report WebM/AV1 support it then fails to play.
  const ua = navigator.userAgent;
  const isSafari = /iP(hone|ad|od)/.test(ua) || (/Safari\//.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|Edg|Android/.test(ua));
  const tryPlay = v => { if (reduce) return; const p = v.play(); if (p && p.catch) p.catch(() => {
    // blocked (for example iPhone Low Power Mode): try again on the first tap or scroll
    const again = () => { v.play().catch(() => {}); };
    ['touchend', 'click'].forEach(e => window.addEventListener(e, again, { once: true, passive: true }));
  }); };
  const start = v => {
    if (v.dataset.started) return; v.dataset.started = '1';
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    v.querySelectorAll('source[data-src]').forEach(s => {
      if (isSafari && !/mp4/.test(s.type)) { s.remove(); return; }
      s.src = s.dataset.src;
    });
    if (!reduce) v.autoplay = true;
    v.preload = 'auto';
    v.addEventListener('canplay', () => tryPlay(v), { once: true });
    v.load();
    tryPlay(v);
  };
  const idle = cb => ('requestIdleCallback' in window) ? requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 200);
  const whenLoaded = cb => document.readyState === 'complete' ? idle(cb) : window.addEventListener('load', () => idle(cb), { once: true });
  // Reduce Motion: the ring stays still on its first frame
  if (reduce) document.querySelectorAll('.hero-visual video').forEach(v => { v.removeAttribute('autoplay'); v.autoplay = false; v.pause(); v.addEventListener('play', () => v.pause()); });
  else document.querySelectorAll('.hero-visual video').forEach(v => { v.muted = true; v.addEventListener('canplay', () => { if (v.paused) tryPlay(v); }, { once: true }); if (v.readyState >= 3 && v.paused) tryPlay(v); });
  vids.filter(v => v.dataset.lazy === 'load').forEach(v => whenLoaded(() => start(v)));
  const later = vids.filter(v => v.dataset.lazy === 'view');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { start(e.target); io.unobserve(e.target); } }), { rootMargin: '400px 0px' });
    whenLoaded(() => later.forEach(v => io.observe(v)));
  } else whenLoaded(() => later.forEach(start));
})();

/* Diagnostics: open the site with ?debug=1 to see what the water ring video is doing on this device. */
(function () {
  if (!/[?&]debug=1/.test(location.search)) return;
  const box = document.createElement('pre');
  box.style.cssText = 'position:fixed;left:8px;right:8px;bottom:8px;z-index:9999;margin:0;padding:10px;background:rgba(0,0,0,.85);color:#9BE3F2;font:11px/1.45 ui-monospace,monospace;border:1px solid #5CCFE6;border-radius:8px;white-space:pre-wrap';
  document.body.appendChild(box);
  const v = document.querySelector('.hero-visual video');
  const ev = [];
  ['loadstart','loadedmetadata','canplay','playing','pause','waiting','stalled','suspend','error'].forEach(e => v && v.addEventListener(e, () => { ev.push(e); if (ev.length > 8) ev.shift(); }));
  const lp = v ? v.play() : null; let playErr = '';
  if (lp && lp.catch) lp.catch(e => { playErr = e.name + ': ' + e.message; });
  setInterval(() => {
    if (!v) { box.textContent = 'no hero video found'; return; }
    box.textContent = ['UA: ' + navigator.userAgent,
      'src: ' + (v.currentSrc || '(none)').split('/').pop() + '  time: ' + v.currentTime.toFixed(2) + '  paused: ' + v.paused,
      'readyState: ' + v.readyState + '  network: ' + v.networkState + '  error: ' + (v.error ? v.error.code : 'none'),
      'muted: ' + v.muted + '  reducedMotion: ' + matchMedia('(prefers-reduced-motion: reduce)').matches,
      'canPlay mp4: ' + v.canPlayType('video/mp4') + '  play(): ' + (playErr || 'ok'),
      'events: ' + ev.join(', '),
      'light hits: ' + (window.RootserveHits ? window.RootserveHits.mode + ', ' + window.RootserveHits.hits + ' so far, peak light ' + (window.RootserveHits.lit || 0) + '/255' : 'not running')].join('\n');
  }, 500);
})();
