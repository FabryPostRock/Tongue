const scene = document.querySelector('.position-fixed');
const lens = document.querySelector('.lens');
const lensImage = document.querySelector('.lens-image');

const lensSize = 90;
const radius = lensSize / 2;

let x = lensSize * 2;
let y = lensSize * 2;
const VX = 1;
const VY = 1;
let vx = VX;
let vy = VY;

function randomSign() {
  return Math.random() < 0.5 ? -1 : 1;
}

function syncLensImageSize() {
  //L'evento resize viene richiamato ogni volta che viene modificata la dimensione del viewport ( a mano restringendo il browser ad esempio)
  //E' necessario perciò richiamare un aggiornamento dello spazio in cui la lente si deve muovere.
  lensImage.style.width = `${scene.clientWidth}px`;
  lensImage.style.height = `${scene.clientHeight}px`;
}

window.addEventListener('resize', syncLensImageSize);
syncLensImageSize();

export function animate() {
  const sceneWidth = scene.clientWidth;
  const sceneHeight = scene.clientHeight;

  x += vx;
  y += vy;

  if (x <= radius) {
    // the circle has reached the x-axis min value and it's starting to hide on its left side
    x = radius;
  }

  if (x >= sceneWidth - radius) {
    // the circle has reached the x-axis max value and it's starting to hide on its right side
    x = sceneWidth - radius;
  }

  if (y <= radius) {
    y = radius;
  }

  if (y >= sceneHeight - radius) {
    y = sceneHeight - radius;
  }

  if (x <= radius || x >= sceneWidth - radius) {
    vx = -vx;
    vy = randomSign() * VY;
  }

  if (y <= radius || y >= sceneHeight - radius) {
    vx = randomSign() * VX;
    vy = -vy;
  }

  const drawX = Math.round(x);
  const drawY = Math.round(y);

  lens.style.transform = `translate(${drawX - radius}px, ${drawY - radius}px)`;
  // Essendo le coordinate dell'immagine dipendenti dalla posizione di 'lens', con un riferimento iniziale (0,0) per entrambi,
  // se 'lens' si muove in avanti, 'lens-image' si deve muovere indietro per ristabilire lo stesso riferimento di orgine di 'lens'
  lensImage.style.transform = `translate(${-drawX + radius}px, ${-drawY + radius}px)`;
  lens.style.opacity = '1';

  requestAnimationFrame(animate);
}
