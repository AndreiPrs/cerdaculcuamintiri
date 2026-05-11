// Room gallery manifests
const roomManifests = {
  'living1': ["photo1.jpg","photo2.jpg","photo3.jpg","photo4.jpg","photo5.jpg"],
  'bucatarie': ["photo1.jpg","photo2.jpg","photo3.jpg","photo4.jpg","photo5.jpg"],
  'dormitor1': ["photo1.jpg","photo2.jpg","photo3.jpg","photo4.jpg","photo5.jpg"],
  'baieserviciu': ["photo1.jpg","photo2.jpg"],
  'dormitor2': ["photo1.jpg","photo2.jpg","photo3.jpg","photo4.jpg","photo5.jpg"],
  'dormitor3': ["photo1.jpg","photo2.jpg","photo3.jpg","photo4.jpg","photo5.jpg"],
  'hol': ["photo1.jpg","photo2.jpg","photo3.jpg","photo4.jpg","photo5.jpg","photo6.jpg"],
  'living2': ["photo1.jpg","photo2.jpg","photo3.jpg","photo4.jpg","photo5.jpg"],
  'curte': ["photo1.jpg","photo2.jpg","photo3.jpg","photo4.jpg","photo5.jpg"],
  'foisor': ["photo1.jpg","photo2.jpg","photo3.jpg","photo4.jpg","photo5.jpg"]
};

const parterRooms = [
  { name: 'Living parter', folder: 'living1' },
  { name: 'Bucătărie', folder: 'bucatarie' },
  { name: 'Dormitor parter', folder: 'dormitor1' },
  { name: 'Baie de serviciu', folder: 'baieserviciu' }
];
const etajRooms = [
  { name: 'Dormitor 2 etaj', folder: 'dormitor2' },
  { name: 'Dormitor 3 etaj', folder: 'dormitor3' },
  { name: 'Hol', folder: 'hol' },
  { name: 'Living etaj', folder: 'living2' }
];
const exteriorRooms = [
  { name: 'Curte', folder: 'curte' },
  { name: 'Foisor', folder: 'foisor' }
];

function createRoomGallery(room, parentId) {
  const parent = document.getElementById(parentId);
  const section = document.createElement('section');
  section.className = 'room-section';
  const title = document.createElement('h3');
  title.textContent = room.name;
  section.appendChild(title);

  const scrollDiv = document.createElement('div');
  scrollDiv.className = 'room-gallery-scroll';

  const imageSources = roomManifests[room.folder].map(name => `photos/${room.folder}/${name}`);
  imageSources.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = room.name;
    img.onerror = function() { this.style.display = 'none'; };
    img.style.width = '180px';
    img.style.height = '120px';
    img.style.objectFit = 'cover';
    img.style.margin = '8px';
    img.style.borderRadius = '8px';
    img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    img.addEventListener('click', () => openModal(imageSources, src));
    scrollDiv.appendChild(img);
  });

  section.appendChild(scrollDiv);
  parent.appendChild(section);
}

parterRooms.forEach(room => createRoomGallery(room, 'parter-gallery'));
etajRooms.forEach(room => createRoomGallery(room, 'etaj-gallery'));

exteriorRooms.forEach(room => createRoomGallery(room, 'exterior-gallery'));
// Modal popup
let modal = document.getElementById('gallery-modal');
if (!modal) {
  modal = document.createElement('div');
  modal.id = 'gallery-modal';
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(0,0,0,0.85)';
  modal.style.zIndex = '1000';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.flexDirection = 'column';
  modal.style.display = 'none'; // Ensure modal is hidden by default
  modal.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:16px;position:relative;">
      <button id="gallery-close" style="position:absolute;top:8px;right:8px;z-index:1002;font-size:1.4em;background:transparent;border:none;color:#fff;cursor:pointer;padding:8px 10px;border-radius:50%;min-height:40px;min-width:40px;">&times;</button>
      <img id="gallery-modal-img" style="max-width:80vw;max-height:80vh;border-radius:16px;box-shadow:0 4px 24px #000;" />
      <div id="gallery-dots" style="display:flex;gap:8px;justify-content:center;"></div>
    </div>
  `;
  document.body.appendChild(modal);
}

let currentImages = [];
let currentIndex = 0;

function openModal(images, src) {
  currentImages = images.filter(s => !s.includes('undefined'));
  currentIndex = currentImages.indexOf(src);
  if (currentIndex === -1) currentIndex = 0;
  createDots();
  showModalImage();
  modal.style.display = 'flex';
}

function createDots() {
  const dotsContainer = document.getElementById('gallery-dots');
  dotsContainer.innerHTML = '';
  currentImages.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.style.width = '12px';
    dot.style.height = '12px';
    dot.style.borderRadius = '50%';
    dot.style.border = '2px solid #fff';
    dot.style.background = idx === currentIndex ? '#fff' : 'rgba(255,255,255,0.3)';
    dot.style.cursor = 'pointer';
    dot.style.transition = 'all 0.3s';
    dot.style.padding = '0';
    dot.style.minHeight = 'auto';
    dot.style.minWidth = 'auto';
    dot.onclick = () => {
      currentIndex = idx;
      showModalImage();
      updateDots();
    };
    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  const dots = document.querySelectorAll('#gallery-dots button');
  dots.forEach((dot, idx) => {
    dot.style.background = idx === currentIndex ? '#fff' : 'rgba(255,255,255,0.3)';
  });
}

function showModalImage() {
  const img = document.getElementById('gallery-modal-img');
  img.src = currentImages[currentIndex];
  updateDots();
}

document.getElementById('gallery-close').onclick = () => {
  modal.style.display = 'none';
};

function goNext() {
  if (!currentImages.length) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  showModalImage();
}

function goPrev() {
  if (!currentImages.length) return;
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  showModalImage();
}

const modalImg = document.getElementById('gallery-modal-img');
if (modalImg) {
  modalImg.onclick = function(e) {
    const rect = modalImg.getBoundingClientRect();
    const x = e.clientX;
    if (x < rect.left + rect.width / 2) goPrev(); else goNext();
  };
  modalImg.addEventListener('touchend', function(e) {
    const touch = e.changedTouches && e.changedTouches[0];
    if (!touch) return;
    const rect = modalImg.getBoundingClientRect();
    const x = touch.clientX;
    if (x < rect.left + rect.width / 2) goPrev(); else goNext();
  }, { passive: true });
}

modal.onclick = function(e) {
  if (e.target === modal) modal.style.display = 'none';
};