
const bg = document.getElementById('petalBg');

const colors = [
  '#f7a8b8',
  '#f9d0d8',
  '#e88fa1',
  '#fbbdc8',
  '#c9a96e',
  '#f5c2c7',
];

for (let i = 0; i < 22; i++) {
  const p = document.createElement('div');
  p.className = 'fp';

  p.style.cssText = `
    left:             ${Math.random() * 100}%;
    background:       ${colors[Math.floor(Math.random() * colors.length)]};
    width:            ${8 + Math.random() * 10}px;
    height:           ${14 + Math.random() * 12}px;
    animation-duration:  ${6 + Math.random() * 10}s;
    animation-delay:     ${Math.random() * 10}s;
    border-radius:    ${Math.random() > 0.5 ? '60% 40% 60% 40%' : '40% 60% 40% 60%'};
  `;

  bg.appendChild(p);
}


function openLetter() {
  const overlay = document.getElementById('letter-overlay');
  overlay.classList.add('open');
}

function closeLetter() {
  const overlay = document.getElementById('letter-overlay');
  overlay.classList.remove('open');
}

function closeOnBg(e) {
  if (e.target === document.getElementById('letter-overlay')) {
    closeLetter();
  }
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeLetter();
    closePhoto();
  }
});

document.body.addEventListener('click', () => {
  const music = document.getElementById('bg-music');
  if (music && music.paused) music.play();
}, { once: true });


function openPhoto(polaroidEl) {
  event.stopPropagation();

  const img = polaroidEl.querySelector('img');
  if (!img) return;

  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;

  const overlay = document.getElementById('photo-overlay');
  overlay.classList.add('open');
}

function closePhoto() {
  const overlay = document.getElementById('photo-overlay');
  overlay.classList.remove('open');
}

function closePhotoOnBg(e) {
  if (e.target === document.getElementById('photo-overlay')) {
    closePhoto();
  }
}

function startSurprise() {
  const entryScreen = document.getElementById('entry-screen');
  const music = document.getElementById('bg-music');

  entryScreen.classList.add('reveal-active');

  if (music && music.paused) {
    music.play();
  }

  setTimeout(() => {
    entryScreen.style.display = 'none';
  }, 850);
}