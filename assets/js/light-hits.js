/* Rootserve light hits: a tiny 2D canvas layer that lights up the real water-ring video
   where agents receive messages. No WebGL. Idle when nothing is happening.
   Listens for 'agentmsg' {x,y,type} and 'agentend' on the .agents container.
   API: window.RootserveHits.hit(x, y, strength, color), .pulse(strength) — x,y in the 412x360 viewBox. */
(function () {
  'use strict';
  var VB_W = 412, VB_H = 360, CX = 203, CY = 181, RING = 147;
  var COL = { '': '#5CCFE6', t: '#9BE3F2', h: '#F2B15A', w: '#F08A78' };
  var STR = { '': 0.9, t: 0.55, h: 1.1, w: 1.25 };
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rgb(hex) { var n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')'; }

  function Hits(box) {
    var cv = document.createElement('canvas');
    cv.className = 'hits'; cv.setAttribute('aria-hidden', 'true');
    box.insertBefore(cv, box.querySelector('.layer'));
    var ctx = cv.getContext('2d');
    if (!ctx) return null;
    // light that should only land on real water is drawn here, then multiplied by the video frame
    var lc = document.createElement('canvas'), lx = lc.getContext('2d');
    var video = box.querySelector('video');
    var fx = [], raf = 0, last = 0, W = 0, H = 0, k = 1;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.round(cv.clientWidth * dpr), h = Math.round(cv.clientHeight * dpr);
      if (w !== W || h !== H) { W = cv.width = lc.width = w; H = cv.height = lc.height = h; }
      k = W / VB_W; // viewBox unit -> device pixels
    }
    function ringPoint(a, r) { return [CX + Math.cos(a) * r, CY + Math.sin(a) * r]; }

    function hit(x, y, s, color) {
      if (RM) return;
      s = s == null ? 1 : s;
      var c = rgb(color || COL['']), a = Math.atan2(y - CY, x - CX), p = ringPoint(a, RING);
      fx.push({ kind: 'flash', a: a, x: p[0], y: p[1], c: c, s: s, t: 0, life: 1.1 });
      fx.push({ kind: 'run', a: a, c: c, s: s, t: 0, life: 1.4, speed: 1.6 });
      fx.push({ kind: 'wave', x: p[0], y: p[1], c: c, s: s, t: 0, life: 0.9 });
      var n = Math.round(14 + 18 * s);
      for (var i = 0; i < n; i++) {
        var out = Math.random() < 0.7 ? 1 : -1;               // most spray flies outward
        var ang = a + (Math.random() - 0.5) * 0.5;
        var sp = (25 + Math.random() * 55) * s * out;
        var tan = (Math.random() - 0.5) * 40;
        fx.push({ kind: 'drop', x: p[0] + (Math.random() - 0.5) * 8, y: p[1] + (Math.random() - 0.5) * 8,
          vx: Math.cos(ang) * sp - Math.sin(ang) * tan, vy: Math.sin(ang) * sp + Math.cos(ang) * tan,
          r: 0.5 + Math.random() * 1.3, c: Math.random() < 0.6 ? [235, 245, 255] : c, t: 0, life: 0.6 + Math.random() * 0.6 });
      }
      start();
    }
    function pulse(s) {
      if (RM) return;
      s = s == null ? 1 : s;
      fx.push({ kind: 'run', a: -Math.PI / 2, c: [170, 230, 245], s: 1.2 * s, t: 0, life: 2.6, speed: 1.25, wide: 1 });
      fx.push({ kind: 'glow', c: [120, 200, 230], s: s, t: 0, life: 1.6 });
      start();
    }

    function draw(dt) {
      size();
      var masked = video && video.readyState >= 2;
      var L = masked ? lx : ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
      if (masked) { lx.setTransform(1, 0, 0, 1, 0, 0); lx.globalCompositeOperation = 'source-over'; lx.fillStyle = '#000'; lx.fillRect(0, 0, W, H); }
      ctx.setTransform(k, 0, 0, k, 0, 0); L.setTransform(k, 0, 0, k, 0, 0);
      ctx.globalCompositeOperation = 'lighter'; L.globalCompositeOperation = 'lighter';
      L.lineCap = 'round';
      for (var i = fx.length - 1; i >= 0; i--) {
        var f = fx[i]; f.t += dt;
        var u = f.t / f.life;
        if (u >= 1) { fx.splice(i, 1); continue; }
        var env = Math.min(1, f.t / 0.06) * Math.pow(1 - u, 1.6);
        if (f.kind === 'flash') {
          // light on the water at the hit: a wide soft band following the ring
          var R1 = 54 * (0.8 + 0.4 * f.s);
          var g = L.createRadialGradient(f.x, f.y, 0, f.x, f.y, R1);
          g.addColorStop(0, rgba([255, 255, 255], 0.95 * env * f.s));
          g.addColorStop(0.35, rgba(f.c, 0.85 * env * f.s));
          g.addColorStop(1, rgba(f.c, 0));
          L.fillStyle = g; L.beginPath(); L.arc(f.x, f.y, R1, 0, 6.283); L.fill();
          // a little bloom in the air so the hit reads even where the water is thin
          var b2 = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 40);
          b2.addColorStop(0, rgba(f.c, 0.22 * env * f.s)); b2.addColorStop(1, rgba(f.c, 0));
          ctx.fillStyle = b2; ctx.beginPath(); ctx.arc(f.x, f.y, 40, 0, 6.283); ctx.fill();
        } else if (f.kind === 'run') {
          // light running both ways through the water from the hit
          var d = f.t * f.speed, len = f.wide ? 0.6 : 0.4;
          for (var sgn = -1; sgn <= 1; sgn += 2) {
            var a0 = f.a + sgn * d;
            var p0 = ringPoint(a0 - sgn * len, RING), p1 = ringPoint(a0, RING);
            var lg = L.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
            lg.addColorStop(0, rgba(f.c, 0)); lg.addColorStop(1, rgba(f.c, 0.7 * env * f.s));
            L.strokeStyle = lg; L.lineWidth = f.wide ? 44 : 34;
            L.beginPath();
            if (sgn > 0) L.arc(CX, CY, RING, a0 - len, a0); else L.arc(CX, CY, RING, a0, a0 + len);
            L.stroke();
          }
        } else if (f.kind === 'wave') {
          ctx.strokeStyle = rgba(f.c, 0.2 * env * f.s); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(f.x, f.y, 6 + 52 * u, 0, 6.283); ctx.stroke();
        } else if (f.kind === 'drop') {
          f.vx *= 1 - 1.8 * dt; f.vy *= 1 - 1.8 * dt; f.vy += 14 * dt;
          f.x += f.vx * dt; f.y += f.vy * dt;
          ctx.fillStyle = rgba(f.c, 0.85 * env);
          ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (1 - 0.4 * u), 0, 6.283); ctx.fill();
        } else if (f.kind === 'glow') {
          // the whole ring of water lights up once at the end of a story
          var e2 = Math.sin(Math.PI * u);
          L.strokeStyle = rgba(f.c, (masked ? 0.35 : 0.08) * e2 * f.s); L.lineWidth = 60;
          L.beginPath(); L.arc(CX, CY, RING, 0, 6.283); L.stroke();
        }
      }
      if (masked) {
        // keep the light only where there is water: light x video frame
        lx.setTransform(1, 0, 0, 1, 0, 0);
        lx.globalCompositeOperation = 'multiply';
        try { lx.drawImage(video, 0, 0, W, H); } catch (e) {}
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(lc, 0, 0); ctx.drawImage(lc, 0, 0); ctx.globalAlpha = 0.6; ctx.drawImage(lc, 0, 0); ctx.globalAlpha = 1;
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    function loop(now) {
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now;
      draw(dt);
      if (fx.length) raf = requestAnimationFrame(loop);
      else { raf = 0; last = 0; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); }
    }
    function start() { if (!raf) raf = requestAnimationFrame(loop); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) fx.length = 0; });
    return { hit: hit, pulse: pulse };
  }

  function boot() {
    document.querySelectorAll('[data-hits]').forEach(function (box) {
      var h = Hits(box); if (!h) return;
      window.RootserveHits = h;
      var root = box.closest('.agents') || document;
      root.addEventListener('agentmsg', function (e) {
        var d = e.detail || {}, t = d.type || '';
        h.hit(d.x, d.y, STR[t] != null ? STR[t] : 0.9, COL[t] || COL['']);
      });
      root.addEventListener('agentend', function () { h.pulse(1); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
