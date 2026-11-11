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
    // Work canvases. Nothing relies on CSS blend modes (iPhone ignores them over video):
    // mc = where and how strong the light is, pc = light x video, lc = video + light x video, cut to the light.
    var mc = document.createElement('canvas'), mx = mc.getContext('2d');
    var pc = document.createElement('canvas'), px = pc.getContext('2d');
    var lc = document.createElement('canvas'), lx = lc.getContext('2d');
    var video = box.querySelector('video');
    // Where the water is: the live video frame when the browser lets us read it, otherwise the
    // still poster of the ring (some iPhones return empty frames from drawImage(video)).
    var poster = new Image(), posterOK = false;
    if (video && video.poster) { poster.onload = function () { posterOK = true; }; poster.src = video.poster; }
    var probe = document.createElement('canvas'); probe.width = probe.height = 16;
    var pr = probe.getContext('2d', { willReadFrequently: true }), videoOK = false, lastProbe = 0;
    function checkVideo(now) {
      if (videoOK || !video || video.readyState < 2 || !video.videoWidth || now - lastProbe < 1000) return;
      lastProbe = now;
      try {
        pr.clearRect(0, 0, 16, 16); pr.drawImage(video, 0, 0, 16, 16);
        var d = pr.getImageData(0, 0, 16, 16).data, sum = 0;
        for (var i = 0; i < d.length; i += 4) sum += d[i] + d[i + 1] + d[i + 2] + d[i + 3];
        videoOK = sum > 16 * 16 * 4 * 20;   // the ring frame is far from empty; transparent/black means unreadable
      } catch (e) { videoOK = false; }
    }
    var api = { mode: 'starting', hits: 0 };
    var fx = [], raf = 0, last = 0, W = 0, H = 0, k = 1;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.round(cv.clientWidth * dpr), h = Math.round(cv.clientHeight * dpr);
      if (w !== W || h !== H) { W = cv.width = lc.width = mc.width = pc.width = w; H = cv.height = lc.height = mc.height = pc.height = h; }
      k = W / VB_W; // viewBox unit -> device pixels
    }
    function ringPoint(a, r) { return [CX + Math.cos(a) * r, CY + Math.sin(a) * r]; }

    function hit(x, y, s, color) {
      s = s == null ? 1 : s;
      var c = rgb(color || COL['']), a = Math.atan2(y - CY, x - CX), p = ringPoint(a, RING);
      api.hits++;
      fx.push({ kind: 'flash', a: a, x: p[0], y: p[1], c: c, s: s, t: 0, life: RM ? 1.4 : 1.1 });
      if (RM) { start(); return; }   // Reduce Motion: a gentle glow only, nothing moves
      fx.push({ kind: 'run', a: a, c: c, s: s, t: 0, life: 1.4, speed: 1.6 });
      fx.push({ kind: 'wave', x: p[0], y: p[1], c: c, s: s, t: 0, life: 0.9 });
      var n = Math.round(22 + 26 * s);
      for (var i = 0; i < n; i++) {
        var out = Math.random() < 0.7 ? 1 : -1;               // most spray flies outward
        var ang = a + (Math.random() - 0.5) * 0.5;
        var sp = (25 + Math.random() * 55) * s * out;
        var tan = (Math.random() - 0.5) * 40;
        fx.push({ kind: 'drop', x: p[0] + (Math.random() - 0.5) * 8, y: p[1] + (Math.random() - 0.5) * 8,
          vx: Math.cos(ang) * sp - Math.sin(ang) * tan, vy: Math.sin(ang) * sp + Math.cos(ang) * tan,
          r: 0.7 + Math.random() * 1.5, c: Math.random() < 0.6 ? [235, 245, 255] : c, t: 0, life: 0.6 + Math.random() * 0.6 });
      }
      start();
    }
    function pulse(s) {
      s = s == null ? 1 : s;
      if (!RM) fx.push({ kind: 'run', a: -Math.PI / 2, c: [170, 230, 245], s: 1.2 * s, t: 0, life: 2.6, speed: 1.25, wide: 1 });
      fx.push({ kind: 'glow', c: [120, 200, 230], s: s, t: 0, life: 1.6 });
      start();
    }

    function draw(dt) {
      size();
      checkVideo(performance.now());
      var src = videoOK ? video : (posterOK ? poster : null);
      var masked = !!src;
      api.mode = videoOK ? 'video' : posterOK ? 'poster' : 'plain';
      // light shapes go to the mask canvas when we can light the real water, otherwise straight to the screen
      var L = masked ? mx : ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H);
      if (masked) { mx.setTransform(1, 0, 0, 1, 0, 0); mx.globalCompositeOperation = 'source-over'; mx.clearRect(0, 0, W, H); }
      L.setTransform(k, 0, 0, k, 0, 0); L.globalCompositeOperation = 'lighter'; L.lineCap = 'round';
      var soft = masked ? 1 : 0.35;
      var free = [];   // spray, shockwaves and blooms are drawn after the water light, on top
      for (var i = fx.length - 1; i >= 0; i--) {
        var f = fx[i]; f.t += dt;
        var u = f.t / f.life;
        if (u >= 1) { fx.splice(i, 1); continue; }
        var env = Math.min(1, f.t / 0.06) * Math.pow(1 - u, 1.6);
        if (f.kind === 'flash') {
          var R1 = 54 * (0.8 + 0.4 * f.s);
          var g = L.createRadialGradient(f.x, f.y, 0, f.x, f.y, R1);
          g.addColorStop(0, rgba([255, 255, 255], 0.95 * env * f.s * soft));
          g.addColorStop(0.35, rgba(f.c, 0.85 * env * f.s * soft));
          g.addColorStop(1, rgba(f.c, 0));
          L.fillStyle = g; L.beginPath(); L.arc(f.x, f.y, R1, 0, 6.283); L.fill();
          free.push([f, env]);
        } else if (f.kind === 'run') {
          var d = f.t * f.speed, len = f.wide ? 0.6 : 0.4;
          for (var sgn = -1; sgn <= 1; sgn += 2) {
            var a0 = f.a + sgn * d;
            var p0 = ringPoint(a0 - sgn * len, RING), p1 = ringPoint(a0, RING);
            var lg = L.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
            lg.addColorStop(0, rgba(f.c, 0)); lg.addColorStop(1, rgba(f.c, 0.7 * env * f.s * soft));
            L.strokeStyle = lg; L.lineWidth = f.wide ? 44 : 34;
            L.beginPath();
            if (sgn > 0) L.arc(CX, CY, RING, a0 - len, a0); else L.arc(CX, CY, RING, a0, a0 + len);
            L.stroke();
          }
        } else if (f.kind === 'glow') {
          var e2 = Math.sin(Math.PI * u);
          L.strokeStyle = rgba(f.c, 0.45 * e2 * f.s * soft); L.lineWidth = 60;
          L.beginPath(); L.arc(CX, CY, RING, 0, 6.283); L.stroke();
        } else {
          free.push([f, env]);
        }
      }
      if (masked) {
        // pc = light x video, kept only where there is light
        px.setTransform(1, 0, 0, 1, 0, 0);
        px.globalCompositeOperation = 'copy'; px.drawImage(mc, 0, 0);
        px.globalCompositeOperation = 'multiply'; px.drawImage(src, 0, 0, W, H);
        px.globalCompositeOperation = 'destination-in'; px.drawImage(mc, 0, 0);
        // lc = video brightened by that light, also cut to the light, so everything else stays transparent
        lx.setTransform(1, 0, 0, 1, 0, 0);
        lx.globalCompositeOperation = 'copy'; lx.drawImage(src, 0, 0, W, H);
        lx.globalCompositeOperation = 'lighter'; lx.drawImage(pc, 0, 0); lx.drawImage(pc, 0, 0); lx.drawImage(pc, 0, 0);
        lx.globalCompositeOperation = 'destination-in'; lx.drawImage(mc, 0, 0); lx.drawImage(mc, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(lc, 0, 0);
      }
      ctx.setTransform(k, 0, 0, k, 0, 0); ctx.globalCompositeOperation = 'source-over';
      for (var j = 0; j < free.length; j++) {
        var q = free[j][0], ev = free[j][1], uu = q.t / q.life;
        if (q.kind === 'flash') {
          var b2 = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, 40);
          b2.addColorStop(0, rgba(q.c, 0.32 * ev * q.s)); b2.addColorStop(1, rgba(q.c, 0));
          ctx.fillStyle = b2; ctx.beginPath(); ctx.arc(q.x, q.y, 40, 0, 6.283); ctx.fill();
        } else if (q.kind === 'wave') {
          ctx.strokeStyle = rgba(q.c, 0.22 * ev * q.s); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(q.x, q.y, 6 + 52 * uu, 0, 6.283); ctx.stroke();
        } else if (q.kind === 'drop') {
          q.vx *= 1 - 1.8 * dt; q.vy *= 1 - 1.8 * dt; q.vy += 14 * dt;
          q.x += q.vx * dt; q.y += q.vy * dt;
          ctx.fillStyle = rgba(q.c, 0.9 * ev);
          ctx.beginPath(); ctx.arc(q.x, q.y, q.r * (1 - 0.4 * uu), 0, 6.283); ctx.fill();
        }
      }
    }
    // for ?debug=1: how much light actually ended up on the canvas
    var dbg = /[?&]debug=1/.test(location.search), lastLit = 0;
    function measure(now) {
      if (!dbg || now - lastLit < 300) return; lastLit = now;
      try { pr.clearRect(0, 0, 16, 16); pr.drawImage(cv, 0, 0, 16, 16);
        var d = pr.getImageData(0, 0, 16, 16).data, m = 0; for (var i = 3; i < d.length; i += 4) m = Math.max(m, d[i]);
        api.lit = Math.max(api.lit || 0, m); } catch (e) { api.lit = 'unreadable'; }
    }
    function loop(now) {
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now;
      draw(dt); measure(now);
      if (fx.length) raf = requestAnimationFrame(loop);
      else { raf = 0; last = 0; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); }
    }
    function start() { if (!raf) raf = requestAnimationFrame(loop); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) fx.length = 0; });
    api.hit = hit; api.pulse = pulse;
    return api;
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
