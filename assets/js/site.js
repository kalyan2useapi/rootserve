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
    if (track) track.scrollBy({ left: (b.dataset.scroll === 'next' ? 1 : -1) * 424, behavior: 'smooth' });
  }));

  // Zoho form embed
  const slot = document.getElementById('zoho-form');
  if (slot && ZOHO_FORM_URL) {
    slot.innerHTML = '<iframe title="Contact Rootserve" src="' + ZOHO_FORM_URL + '" loading="lazy"></iframe>';
  }

  // year
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
