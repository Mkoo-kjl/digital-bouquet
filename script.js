/* ══════════════════════════════════════════════════════════════
   AESTHETIC BOUQUET WITH ANIMATED SPARKLES
   ══════════════════════════════════════════════════════════════ */

// ── Entry screen ─────────────────────────────────────────────
function startSurprise() {
  const screen = document.getElementById('entry-screen');
  screen.classList.add('reveal-active');
  setTimeout(() => { screen.style.display = 'none'; }, 900);
  const music = document.getElementById('bg-music');
  if (music) { music.volume = 0.35; music.play().catch(() => {}); }
}

// ── Letter overlay ────────────────────────────────────────────
function openLetter()  { document.getElementById('letter-overlay').classList.add('open'); }
function closeLetter() { document.getElementById('letter-overlay').classList.remove('open'); }
function closeOnBg(e)  { if (e.target === document.getElementById('letter-overlay')) closeLetter(); }

// ── Photo lightbox ────────────────────────────────────────────
function openPhoto(el) {
  const src = el.querySelector('img').src;
  document.getElementById('lightbox-img').src = src;
  document.getElementById('photo-overlay').classList.add('open');
}
function closePhoto()     { document.getElementById('photo-overlay').classList.remove('open'); }
function closePhotoOnBg(e){ if (e.target === document.getElementById('photo-overlay')) closePhoto(); }

// ── Floating varied organic petals ────────────────────────────
(function spawnPetals() {
  // Automatically create the background container if it doesn't exist
  let bg = document.querySelector('.petal-bg');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'petal-bg';
    document.body.insertBefore(bg, document.body.firstChild);
  }

  const shapes = ['shape1', 'shape2', 'shape3', 'shape4'];
  
  // Create 45 beautiful, varied petals
  for (let i = 0; i < 45; i++) {
    const p = document.createElement('div');
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    p.className = `fp ${shape}`;
    
    // Randomize position, falling speed, and delay
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    
    // Add a slight random scale so they don't all look the same size
    p.style.transform = `scale(${0.6 + Math.random() * 0.6})`;
    
    bg.appendChild(p);
  }
})();

/* ══════════════════════════════════════════════════════════════
   AESTHETIC CANVAS BOUQUET & SPARKLE ENGINE
   ══════════════════════════════════════════════════════════════ */
(function initBouquet() {
  const canvas = document.getElementById('bouquet-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;   // 500
  const H = canvas.height;  // 600
  const cx = W / 2;

  // ── 1. Create an Offscreen Canvas for the static bouquet ──
  const offscreen = document.createElement('canvas');
  offscreen.width = W;
  offscreen.height = H;
  const oCtx = offscreen.getContext('2d');

  function saveCtx(context, fn) { context.save(); fn(); context.restore(); }

  // ── Aesthetic Drawing Helpers ──
  function aestheticPetal(context, x, y, r, angle, col1, col2, alpha) {
    saveCtx(context, () => {
      context.globalAlpha = alpha;
      context.translate(x, y);
      context.rotate(angle);
      context.beginPath();
      context.moveTo(0, 0);
      context.bezierCurveTo(r * 0.8, -r * 0.2, r * 1.2, -r * 1.2, 0, -r);
      context.bezierCurveTo(-r * 1.2, -r * 1.2, -r * 0.8, -r * 0.2, 0, 0);
      
      const grad = context.createLinearGradient(0, 0, 0, -r);
      grad.addColorStop(0, col1);
      grad.addColorStop(1, col2);
      context.fillStyle = grad;
      context.fill();
    });
  }

  function drawStem(context, x1, y1, x2, y2, cpx, cpy, color = '#88a58a', w = 2.5) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.quadraticCurveTo(cpx, cpy, x2, y2);
    context.strokeStyle = color;
    context.lineWidth = w;
    context.lineCap = 'round';
    context.stroke();
  }

  // ── FLOWER TYPES (Redesigned for "Coquette / Watercolor" Aesthetic) ──

  // 1. Soft Rose
  function drawAestheticRose(context, x, y, r, baseCol, lightCol, darkCol) {
    const layers = [
      { n: 8, r: r * 0.95, alpha: 0.8, c1: darkCol, c2: baseCol },
      { n: 6, r: r * 0.75, alpha: 0.85, c1: baseCol, c2: lightCol },
      { n: 5, r: r * 0.55, alpha: 0.9, c1: baseCol, c2: lightCol },
      { n: 4, r: r * 0.35, alpha: 0.95, c1: lightCol, c2: '#ffffff' }
    ];
    layers.forEach((lay, idx) => {
      for (let i = 0; i < lay.n; i++) {
        const a = (i / lay.n) * Math.PI * 2 + (idx * 0.5);
        const px = x + Math.cos(a) * r * (0.1 * idx);
        const py = y + Math.sin(a) * r * (0.1 * idx);
        aestheticPetal(context, px, py, lay.r, a + Math.PI / 2, lay.c1, lay.c2, lay.alpha);
      }
    });
    // Center swirl
    context.beginPath();
    context.arc(x, y, r * 0.15, 0, Math.PI * 2);
    context.fillStyle = lightCol;
    context.fill();
  }

  // 2. Fluffy Peony
  function drawAestheticPeony(context, x, y, r, col1, col2) {
    const numRings = 6;
    for(let ring = 0; ring < numRings; ring++) {
      const ringR = r - (ring * (r/numRings));
      const n = 10 - ring;
      for(let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + (Math.random() * 0.5);
        const px = x + Math.cos(a) * ringR * 0.3;
        const py = y + Math.sin(a) * ringR * 0.3;
        saveCtx(context, () => {
          context.translate(px, py);
          context.rotate(a + Math.PI / 2);
          context.globalAlpha = 0.85 + (ring * 0.02);
          context.beginPath();
          // Scalloped petal
          context.moveTo(0, 0);
          context.bezierCurveTo(ringR * 0.6, -ringR * 0.4, ringR * 0.8, -ringR * 1.1, 0, -ringR);
          context.bezierCurveTo(-ringR * 0.8, -ringR * 1.1, -ringR * 0.6, -ringR * 0.4, 0, 0);
          const grad = context.createRadialGradient(0, -ringR/2, 0, 0, -ringR/2, ringR);
          grad.addColorStop(0, col2);
          grad.addColorStop(1, col1);
          context.fillStyle = grad;
          context.fill();
        });
      }
    }
  }

  // 3. Eucalyptus Sprig (Aesthetic foliage)
  function drawEucalyptus(context, x, yTop, height) {
    context.beginPath();
    context.moveTo(x, yTop + height);
    context.lineTo(x, yTop);
    context.strokeStyle = '#a3b8a1';
    context.lineWidth = 2;
    context.stroke();
    
    const nodes = 7;
    for (let i = 0; i <= nodes; i++) {
      const fy = yTop + (height / nodes) * i;
      const size = 6 + (i * 1.5);
      saveCtx(context, () => {
        context.globalAlpha = 0.85;
        context.fillStyle = '#b5c9b3';
        // Left leaf
        context.beginPath();
        context.ellipse(x - size*0.8, fy, size, size*0.7, -0.5, 0, Math.PI*2);
        context.fill();
        // Right leaf
        context.beginPath();
        context.ellipse(x + size*0.8, fy, size, size*0.7, 0.5, 0, Math.PI*2);
        context.fill();
      });
    }
  }

  // 4. Gold Baby's Breath / Accent Sprig
  function drawGoldSprig(context, x, yTop, height) {
    context.beginPath();
    context.moveTo(x, yTop + height);
    context.lineTo(x, yTop);
    context.strokeStyle = '#d4b07a';
    context.lineWidth = 1;
    context.stroke();
    
    for (let i = 0; i < 12; i++) {
      const fy = yTop + Math.random() * height;
      const fx = x + (Math.random() - 0.5) * 30;
      context.beginPath();
      context.moveTo(x, fy + 5);
      context.lineTo(fx, fy);
      context.strokeStyle = '#d4b07a';
      context.stroke();
      
      context.beginPath();
      context.arc(fx, fy, 2, 0, Math.PI*2);
      context.fillStyle = '#ffe082';
      context.fill();
    }
  }

  // ── WRAPPING PAPER ──
  const handleX = cx;
  const handleY = H - 30;

  function drawWrapping(context) {
    saveCtx(context, () => {
      // elegant curved cone
      context.beginPath();
      context.moveTo(handleX - 25, handleY);
      context.lineTo(handleX - 95, handleY - 180);
      context.quadraticCurveTo(handleX, handleY - 165, handleX + 95, handleY - 180);
      context.lineTo(handleX + 25, handleY);
      context.closePath();
      
      const wg = context.createLinearGradient(handleX - 95, handleY - 180, handleX + 95, handleY - 180);
      wg.addColorStop(0, '#fdf6ee');
      wg.addColorStop(0.5, '#ffffff');
      wg.addColorStop(1, '#f9ede3');
      context.fillStyle = wg;
      context.fill();
      
      context.shadowColor = 'rgba(0,0,0,0.05)';
      context.shadowBlur = 10;
      context.strokeStyle = '#e8d5c0';
      context.lineWidth = 1;
      context.stroke();

      // Delicate ribbon
      const ry = handleY - 175;
      context.shadowBlur = 0;
      // Tails
      context.beginPath();
      context.moveTo(handleX, ry);
      context.bezierCurveTo(handleX - 20, ry + 40, handleX - 45, ry + 30, handleX - 40, ry + 70);
      context.strokeStyle = '#d4b07a';
      context.lineWidth = 2.5;
      context.stroke();
      
      context.beginPath();
      context.moveTo(handleX, ry);
      context.bezierCurveTo(handleX + 20, ry + 40, handleX + 45, ry + 30, handleX + 40, ry + 70);
      context.stroke();
      
      // Loops
      context.fillStyle = '#f0d8b3';
      context.beginPath();
      context.ellipse(handleX - 25, ry - 5, 25, 10, -0.2, 0, Math.PI*2);
      context.fill(); context.stroke();
      
      context.beginPath();
      context.ellipse(handleX + 25, ry - 5, 25, 10, 0.2, 0, Math.PI*2);
      context.fill(); context.stroke();
      
      // Knot
      context.beginPath();
      context.arc(handleX, ry, 6, 0, Math.PI*2);
      context.fillStyle = '#d4b07a';
      context.fill();
    });
  }

  // ── COMPILE THE AESTHETIC BOUQUET ──
  const bcX = cx;
  const bcY = H * 0.38;

  // Curated layout for a highly aesthetic look
  const flowers = [
    // Background sprigs
    { type: 'eucalyptus', x: cx - 110, y: bcY - 140, h: 100 },
    { type: 'eucalyptus', x: cx + 110, y: bcY - 130, h: 90 },
    { type: 'gold',       x: cx - 60,  y: bcY - 150, h: 80 },
    { type: 'gold',       x: cx + 70,  y: bcY - 140, h: 70 },
    
    // Outer rim
    { type: 'peony', x: cx - 120, y: bcY - 30, r: 42, c1: '#f8bbd0', c2: '#fce4ec' },
    { type: 'rose',  x: cx + 120, y: bcY - 20, r: 35, base: '#ffcdd2', light: '#ffebee', dark: '#ef9a9a' },
    { type: 'rose',  x: cx - 90,  y: bcY + 60, r: 38, base: '#f8bbd0', light: '#fce4ec', dark: '#f48fb1' },
    { type: 'peony', x: cx + 95,  y: bcY + 50, r: 40, c1: '#fff0f5', c2: '#ffffff' },

    // Mid layer
    { type: 'gold',  x: cx - 100, y: bcY - 80, h: 60 },
    { type: 'gold',  x: cx + 90,  y: bcY - 70, h: 60 },
    { type: 'rose',  x: cx - 60,  y: bcY - 80, r: 40, base: '#ffebee', light: '#ffffff', dark: '#ffcdd2' },
    { type: 'peony', x: cx + 55,  y: bcY - 90, r: 45, c1: '#fce4ec', c2: '#f8bbd0' },
    { type: 'rose',  x: cx - 40,  y: bcY + 30, r: 38, base: '#ffffff', light: '#fff0f5', dark: '#fce4ec' },
    { type: 'rose',  x: cx + 45,  y: bcY + 25, r: 36, base: '#f8bbd0', light: '#fce4ec', dark: '#f48fb1' },
    
    // Center pieces (Largest, most prominent)
    { type: 'eucalyptus', x: cx, y: bcY - 100, h: 70 },
    { type: 'peony', x: cx,      y: bcY - 20, r: 52, c1: '#ffb6c1', c2: '#ffe4e1' },
  ];

  function renderStaticBouquet() {
    oCtx.clearRect(0, 0, W, H);
    
    // Draw stems connecting to handle
    flowers.forEach(f => {
      const midX = (f.x + handleX) / 2 + (Math.random() - 0.5) * 20;
      const baseFlowerY = f.y + (f.r || f.h/2 || 0);
      drawStem(oCtx, handleX + (Math.random()-0.5)*15, handleY - 15, f.x, baseFlowerY, midX, (baseFlowerY + handleY)/2, '#a3b8a1', 2);
    });

    drawWrapping(oCtx);

    // Draw flowers
    flowers.forEach(f => {
      if (f.type === 'rose') drawAestheticRose(oCtx, f.x, f.y, f.r, f.base, f.light, f.dark);
      else if (f.type === 'peony') drawAestheticPeony(oCtx, f.x, f.y, f.r, f.c1, f.c2);
      else if (f.type === 'eucalyptus') drawEucalyptus(oCtx, f.x, f.y, f.h);
      else if (f.type === 'gold') drawGoldSprig(oCtx, f.x, f.y, f.h);
    });
  }

  // Build the static image once
  renderStaticBouquet();

  // ── 2. Sparkle Engine (requestAnimationFrame) ──
  const sparkles = [];
  const MAX_SPARKLES = 45;

  function createSparkle() {
    return {
      x: cx + (Math.random() - 0.5) * 320,
      y: bcY - 50 + (Math.random() - 0.5) * 280,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.6 - 0.2, // slight upward float
      size: Math.random() * 2.5 + 0.5,
      life: Math.random() * 100,
      maxLife: 100 + Math.random() * 50,
      color: Math.random() > 0.4 ? '#ffffff' : (Math.random() > 0.5 ? '#f48fb1' : '#ffe082'),
      phase: Math.random() * Math.PI * 2
    };
  }

  // Initialize sparkles
  for(let i=0; i<MAX_SPARKLES; i++) sparkles.push(createSparkle());

  function animateSparkles() {
    ctx.clearRect(0, 0, W, H);
    
    // 1. Draw the static aesthetic bouquet
    ctx.drawImage(offscreen, 0, 0);

    // 2. Draw dynamic sparkles
    sparkles.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.life++;
      
      // Float sway
      s.x += Math.sin(s.life * 0.05 + s.phase) * 0.2;

      if (s.life > s.maxLife) {
        Object.assign(s, createSparkle());
        s.life = 0;
      }

      // Fade in and out
      const progress = s.life / s.maxLife;
      let alpha = 0;
      if (progress < 0.2) alpha = progress / 0.2;
      else if (progress > 0.8) alpha = (1 - progress) / 0.2;
      else alpha = 1;

      // Twinkle effect
      alpha *= (0.5 + Math.sin(s.life * 0.1) * 0.5);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animateSparkles);
  }

  // Start the render loop
  animateSparkles();

})();