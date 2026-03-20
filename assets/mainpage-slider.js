// Fullscreen responsive slider for mainpage photos
const sliderImages = [
  'mainpage/foto1.jpeg',
  'mainpage/foto2.jpeg',
  'mainpage/foto3.jpeg'
];

const sliderContainer = document.createElement('div');
sliderContainer.id = 'mainpage-slider';
sliderContainer.style.position = 'fixed';
sliderContainer.style.top = '0';
sliderContainer.style.left = '0';
sliderContainer.style.width = '100vw';
sliderContainer.style.height = '100vh';
sliderContainer.style.zIndex = '0';
sliderContainer.style.overflow = 'hidden';
sliderContainer.style.background = '#222';
sliderContainer.style.transition = 'background 2.5s';
document.body.prepend(sliderContainer);

let current = 0;
let imgElements = [];

sliderImages.forEach((src, idx) => {
  const img = document.createElement('img');
  img.src = src;
  img.style.position = 'absolute';
  img.style.top = '0';
  img.style.left = '0';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  img.style.opacity = idx === 0 ? '1' : '0';
  img.style.transition = 'opacity 1s';
  img.style.zIndex = '1';
  sliderContainer.appendChild(img);
  imgElements.push(img);
});

function showSlide(idx) {
  imgElements.forEach((img, i) => {
    img.style.opacity = i === idx ? '1' : '0';
  });
}

setInterval(() => {
  current = (current + 1) % imgElements.length;
  showSlide(current);
}, 5000);

window.addEventListener('resize', () => {
  imgElements.forEach(img => {
    img.style.width = '100%';
    img.style.height = '100%';
  });
});