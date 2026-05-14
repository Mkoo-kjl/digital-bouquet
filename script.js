const bg = document.getElementById('petalBg');
const colors = ['#f7a8b8','#f9d0d8','#e88fa1','#fbbdc8','#c9a96e','#f5c2c7'];
for (let i = 0; i < 22; i++) {
  const p = document.createElement('div');
  p.className = 'fp';
  p.style.cssText = `left:${Math.random()*100}%;background:${colors[Math.floor(Math.random()*colors.length)]};width:${8+Math.random()*10}px;height:${14+Math.random()*12}px;animation-duration:${6+Math.random()*10}s;animation-delay:${Math.random()*10}s;border-radius:${Math.random()>.5?'60% 40% 60% 40%':'40% 60% 40% 60%'};`;
  bg.appendChild(p);
}

// ── CANVAS BOUQUET ──
const canvas = document.getElementById('bouquet-canvas');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;
canvas.width = 500 * dpr;
canvas.height = 600 * dpr;
ctx.scale(dpr, dpr);
const W = 500, H = 600;
let time = 0;
let bloomProgress = 0; 

// Enhanced Sparkle Particles
const sparkles = [];
for (let i = 0; i < 60; i++) { // Increased particle count
  sparkles.push({
    x: 90 + Math.random() * 320,
    y: 180 + Math.random() * 260,
    size: 1.5 + Math.random() * 4,
    speed: 0.2 + Math.random() * 0.6,
    phase: Math.random() * Math.PI * 2,
    brightness: Math.random(),
    color: Math.random() > 0.5 ? '#fff5eb' : '#ffe4b5'
  });
}

function hexToRgba(hex, alpha) {
  const n = parseInt(hex.replace('#',''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function blendColor(c1, c2, t) {
  const n1 = parseInt(c1.replace('#',''), 16), n2 = parseInt(c2.replace('#',''), 16);
  const r = Math.round(((n1 >> 16) & 255) + (((n2 >> 16) & 255) - ((n1 >> 16) & 255)) * t);
  const g = Math.round(((n1 >> 8) & 255) + (((n2 >> 8) & 255) - ((n1 >> 8) & 255)) * t);
  const b = Math.round((n1 & 255) + ((n2 & 255) - (n1 & 255)) * t);
  return `rgb(${r},${g},${b})`;
}

function drawStem(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(cx1,cy1,cx2,cy2,x2,y2);
  const sg = ctx.createLinearGradient(x1,y1,x2,y2);
  sg.addColorStop(0, '#2d5a2d');
  sg.addColorStop(0.5, '#4a8a4e');
  sg.addColorStop(1, '#6ab06e');
  ctx.strokeStyle = sg;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.stroke();
}

function drawLeaf(x, y, angle, size, shade) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  
  // Glowing aura around leaf
  ctx.shadowColor = '#5a9a5a';
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(size*0.4,-size*0.6,size*0.8,-size*0.4,size,0);
  ctx.bezierCurveTo(size*0.8,size*0.4,size*0.4,size*0.6,0,0);
  
  const lg = ctx.createLinearGradient(0,0,size,0);
  lg.addColorStop(0, shade === 0 ? '#2d5a2d' : '#3a7a3a');
  lg.addColorStop(0.5, shade === 0 ? '#4a8a4a' : '#5a9a5a');
  lg.addColorStop(1, shade === 0 ? '#2d5a2d' : '#3a7a3a');
  ctx.fillStyle = lg;
  ctx.fill();

  ctx.shadowBlur = 0; // Reset
  ctx.strokeStyle = 'rgba(200,255,200,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(2,0); ctx.lineTo(size*0.9,0); ctx.stroke();
  ctx.restore();
}

// Redesigned: Big, realistic petals with glowing tips
function drawPetal(cx, cy, angle, pw, ph, color1, color2, alpha, curl) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  
  // Wider, lush curves
  ctx.bezierCurveTo(-pw*1.1, -ph*0.3-curl, -pw*0.9, -ph*1.1, 0, -ph-curl*0.6);
  ctx.bezierCurveTo(pw*0.9, -ph*1.1, pw*1.1, -ph*0.3-curl, 0, 0);
  
  const g = ctx.createRadialGradient(0, -ph*0.2, 0, 0, -ph*0.5, ph*1.2);
  g.addColorStop(0, blendColor(color2, '#000000', 0.5)); // Deep core shadow
  g.addColorStop(0.5, color2);
  g.addColorStop(0.85, color1);
  g.addColorStop(1, '#ffffff'); // Glowing realistic edge

  ctx.fillStyle = g;
  ctx.globalAlpha = alpha;
  ctx.fill();
  
  // Delicate petal veining
  ctx.strokeStyle = `rgba(255,255,255,${0.2 + curl*0.02})`;
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();
}

// Redesigned: Giant glowing realistic roses
function drawRose(cx, cy, size, palette, swayOffset) {
  ctx.save();
  const sway = Math.sin(time * 0.6 + swayOffset) * 0.04;
  ctx.translate(cx, cy);
  ctx.rotate(sway);
  ctx.translate(-cx, -cy);
  const bloom = Math.min(bloomProgress * 1.3, 1);

  // Intense Magical Glow behind the flower
  ctx.globalCompositeOperation = 'screen';
  const glowG = ctx.createRadialGradient(cx, cy, size*0.2, cx, cy, size*2.5);
  glowG.addColorStop(0, hexToRgba(palette[0], 0.7));
  glowG.addColorStop(0.5, hexToRgba(palette[2], 0.2));
  glowG.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glowG;
  ctx.beginPath();
  ctx.arc(cx, cy, size*2.5, 0, Math.PI*2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  // Big Lush Outer petals
  const outerCount = 6;
  for (let i = 0; i < outerCount; i++) {
    const a = (Math.PI*2/outerCount)*i + 0.1;
    const curl = 6 + Math.sin(time*0.4+i)*2.5;
    drawPetal(cx, cy, a, size*0.95*bloom, size*1.5*bloom, palette[0], palette[1], 0.9, curl);
  }
  // Mid petals
  const midCount = 6;
  for (let i = 0; i < midCount; i++) {
    const a = (Math.PI*2/midCount)*i + 0.6;
    const curl = 4 + Math.sin(time*0.6+i)*2;
    drawPetal(cx, cy, a, size*0.75*bloom, size*1.15*bloom, palette[1], palette[2], 0.95, curl);
  }
  // Inner layers
  const innerCount = 5;
  for (let i = 0; i < innerCount; i++) {
    const a = (Math.PI*2/innerCount)*i + 1.0;
    drawPetal(cx, cy, a, size*0.55*bloom, size*0.8*bloom, palette[2], palette[3], 1, 2);
  }
  const tightCount = 4;
  for (let i = 0; i < tightCount; i++) {
    const a = (Math.PI*2/tightCount)*i + 1.4;
    drawPetal(cx, cy, a, size*0.35*bloom, size*0.5*bloom, palette[3], palette[4], 1, 0.5);
  }

  // Deep realistic center
  const cg = ctx.createRadialGradient(cx,cy,0,cx,cy,size*0.25);
  cg.addColorStop(0, '#1a050d'); // Pitch black core for realism
  cg.addColorStop(1, palette[4]);
  ctx.beginPath();
  ctx.arc(cx, cy, size*0.22*bloom, 0, Math.PI*2);
  ctx.fillStyle = cg;
  ctx.fill();
  ctx.restore();
}

// Redesigned: Glowing fairy orbs (Replacing Baby's Breath)
function drawFairyOrb(x, y, r) {
  const swayY = y + Math.sin(time * 2 + x) * 3;
  ctx.globalCompositeOperation = 'screen';
  const bbg = ctx.createRadialGradient(x,swayY,0,x,swayY,r*2.5);
  bbg.addColorStop(0,'rgba(255, 255, 255, 1)');
  bbg.addColorStop(0.3,'rgba(255, 220, 230, 0.8)');
  bbg.addColorStop(1,'rgba(255, 180, 200, 0)');
  ctx.fillStyle = bbg;
  ctx.beginPath();
  ctx.arc(x, swayY, r*2.5, 0, Math.PI*2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
}

function drawWrapping() {
  ctx.beginPath();
  ctx.moveTo(195, 460);
  ctx.quadraticCurveTo(250, 488, 305, 460);
  ctx.lineTo(325, 560);
  ctx.quadraticCurveTo(250, 585, 175, 560);
  ctx.closePath();
  const wg = ctx.createLinearGradient(175,458,325,558);
  wg.addColorStop(0, '#fcd5da');
  wg.addColorStop(0.5, '#f09aaa');
  wg.addColorStop(1, '#d96c80');
  
  // Wrap shadow
  ctx.shadowColor = 'rgba(100,20,40,0.4)';
  ctx.shadowBlur = 15;
  ctx.fillStyle = wg;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Ribbon
  ctx.beginPath();
  ctx.moveTo(228, 555); ctx.bezierCurveTo(200,520,180,550,188,565); ctx.bezierCurveTo(200,580,224,570,228,555);
  ctx.fillStyle = '#e07888'; ctx.fill();
  ctx.beginPath();
  ctx.moveTo(272, 555); ctx.bezierCurveTo(300,520,320,550,312,565); ctx.bezierCurveTo(300,580,276,570,272,555);
  ctx.fill();
  ctx.beginPath(); ctx.arc(250, 556, 8, 0, Math.PI*2); ctx.fillStyle = '#c9a96e'; ctx.fill();
}

// Redesigned: Intense glowing flares
function drawSparkles() {
  ctx.globalCompositeOperation = "lighter";
  sparkles.forEach(s => {
    const twinkle = Math.sin(time * s.speed * 2 + s.phase);
    if (twinkle < 0) return;
    
    s.y -= 0.15 * s.speed;
    if (s.y < 150) s.y = 450 + Math.random() * 50;

    const alpha = twinkle * bloomProgress;
    const sz = s.size * (0.8 + twinkle * 0.5);
    
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(time * s.speed);
    
    // Intense Glow Aura
    ctx.shadowBlur = sz * 6;
    ctx.shadowColor = s.color;
    
    ctx.beginPath();
    ctx.moveTo(0, -sz*2); ctx.lineTo(sz*0.4, -sz*0.4);
    ctx.lineTo(sz*2, 0); ctx.lineTo(sz*0.4, sz*0.4);
    ctx.lineTo(0, sz*2); ctx.lineTo(-sz*0.4, sz*0.4);
    ctx.lineTo(-sz*2, 0); ctx.lineTo(-sz*0.4, -sz*0.4);
    ctx.closePath();
    
    ctx.fillStyle = s.color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.restore();
  });
  ctx.globalCompositeOperation = "source-over";
}

// Vibrant, High-Contrast Palettes for Realistic Glow
const pinkRose = ['#ffa6c9','#ff7eb3','#ff4d8f','#d41c5c','#8a0a33'];
const blushRose = ['#ffe1e8','#ffb3c6','#ff8fa3','#e6395e','#a30b34'];
const deepRose = ['#ff4d6d','#d41c5c','#a4133c','#800f2f','#590d22'];
const softRose = ['#fff0f3','#ffccd5','#ff99ac','#ff5c7c','#cc1439'];
const coralRose = ['#ffc8c2','#ffa296','#ff7a6b','#e64d3d','#a82416'];

function drawBouquet() {
  ctx.clearRect(0,0,W,H);
  time += 0.012; // Smoother, slightly slower animation
  if (bloomProgress < 1) bloomProgress = Math.min(1, bloomProgress + 0.006);

  // Stems
  for(let i=0; i<8; i++) drawStem(250,550, 248+(i*3),488, 240-(i*5),425, 250+(i*10-40),300);

  // Big Leaves
  drawLeaf(200,420, -0.6, 55, 0); drawLeaf(300,410, 0.5, 52, 1);
  drawLeaf(170,360, -0.85, 48, 0); drawLeaf(330,350, 0.75, 45, 1);

  drawWrapping();

  // Back row Orbs
  [[130,270,5],[370,265,5],[150,330,4],[350,320,4]].forEach(b => drawFairyOrb(b[0],b[1],b[2]));

  // Giant Roses - Scaled up by ~40% for big lush petals
  drawRose(160, 310, 42, softRose, 0.8);
  drawRose(345, 300, 40, coralRose, 1.8);
  drawRose(185, 245, 35, pinkRose, 1.5);
  drawRose(325, 240, 38, deepRose, 2.8);

  // Mid row
  drawRose(205, 290, 48, blushRose, 1.2);
  drawRose(300, 280, 52, deepRose, 2.4);
  drawRose(235, 235, 42, coralRose, 3.0);
  drawRose(275, 230, 40, blushRose, 2.0);

  // Front center superstar
  drawRose(250, 305, 65, pinkRose, 0);

  // Front Orbs
  [[210,210,6],[290,205,5],[250,195,6.5],[180,215,4]].forEach(b => drawFairyOrb(b[0],b[1],b[2]));

  drawSparkles();

  requestAnimationFrame(drawBouquet);
}
drawBouquet();

// ── INTERACTIONS ──
function openLetter() { document.getElementById('letter-overlay').classList.add('open'); }
function closeLetter() { document.getElementById('letter-overlay').classList.remove('open'); }
function closeOnBg(e) { if (e.target === document.getElementById('letter-overlay')) closeLetter(); }
document.addEventListener('keydown', e => { if (e.key==='Escape'){closeLetter();closePhoto();} });
document.body.addEventListener('click', () => { const m=document.getElementById('bg-music'); if(m&&m.paused)m.play(); }, {once:true});
function openPhoto(el) { event.stopPropagation(); const img=el.querySelector('img'); if(!img)return; const lb=document.getElementById('lightbox-img'); lb.src=img.src; lb.alt=img.alt; document.getElementById('photo-overlay').classList.add('open'); }
function closePhoto() { document.getElementById('photo-overlay').classList.remove('open'); }
function closePhotoOnBg(e) { if(e.target===document.getElementById('photo-overlay'))closePhoto(); }
function startSurprise() { const es=document.getElementById('entry-screen'); const m=document.getElementById('bg-music'); es.classList.add('reveal-active'); if(m&&m.paused)m.play(); setTimeout(()=>{es.style.display='none';},850); }