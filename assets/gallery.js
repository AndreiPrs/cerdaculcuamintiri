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
  'curte': ["photo1.jpg","photo2.jpg","photo3.jpg","photo4.jpg","photo5.jpg","photo6.jpg"],
  'foisor': ["photo1.jpg","photo2.jpg","photo3.jpg","photo4.jpg"]
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
  { name: 'Curte cu loc de joaca', folder: 'curte' },
  { name: 'Foisor si terasa', folder: 'foisor' }
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
  // Only show first 2 images
  imageSources.slice(0, 2).forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = room.name;
    img.onerror = function() { this.style.display = 'none'; };
    img.style.width = '48%';
    img.style.height = 'auto';
    img.style.aspectRatio = '3/2';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '8px';
    img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    img.addEventListener('click', () => openModal(imageSources, index));
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
    <button id="gallery-close" style="position:fixed;top:20px;right:20px;width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.2);border:2px solid white;color:white;font-size:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s;z-index:1001;font-weight:bold;padding:0;line-height:1;">✕</button>
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;width:100%;height:100%;padding:60px 20px 80px 20px;box-sizing:border-box;overflow-y:auto;">
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:100%;gap:24px;">
        <button id="gallery-prev" style="position:absolute;left:0;width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.2);border:2px solid white;color:white;font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s;z-index:10;font-weight:bold;flex-shrink:0;">❮</button>
        <img id="gallery-modal-img" style="max-width:90vw;max-height:70vh;border-radius:16px;box-shadow:0 4px 24px #000;" />
        <button id="gallery-next" style="position:absolute;right:0;width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.2);border:2px solid white;color:white;font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s;z-index:10;font-weight:bold;flex-shrink:0;">❯</button>
      </div>
      <div id="gallery-dots" style="display:flex;gap:12px;justify-content:center;margin-top:16px;"></div>
    </div>
  `;
  document.body.appendChild(modal);
}

let currentImages = [];
let currentIndex = 0;

function openModal(images, startIndex) {
  currentImages = images.filter(s => !s.includes('undefined'));
  currentIndex = startIndex;
  if (currentIndex < 0 || currentIndex >= currentImages.length) currentIndex = 0;
  createDots();
  showModalImage();
  modal.style.display = 'flex';
  
  // Setup modal image event handlers
  const modalImg = document.getElementById('gallery-modal-img');
  if (modalImg && !modalImg.__handlersSetup) {
    modalImg.__handlersSetup = true;
    modalImg.onclick = function(e) {
      const rect = modalImg.getBoundingClientRect();
      const x = e.clientX;
      if (x < rect.left + rect.width / 2) goPrev(); else goNext();
    };
    modalImg.addEventListener('touchend', function(e) {
      e.preventDefault();
      const touch = e.changedTouches && e.changedTouches[0];
      if (!touch) return;
      const rect = modalImg.getBoundingClientRect();
      const x = touch.clientX;
      if (x < rect.left + rect.width / 2) goPrev(); else goNext();
    }, { passive: false });
  }

  // Setup arrow button handlers
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const closeBtn = document.getElementById('gallery-close');
  
  if (prevBtn && !prevBtn.__handlersSetup) {
    prevBtn.__handlersSetup = true;
    prevBtn.onclick = (e) => { e.stopPropagation(); goPrev(); };
    prevBtn.addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); goPrev(); }, { passive: false });
    prevBtn.addEventListener('mouseenter', function() { this.style.background = 'rgba(255,255,255,0.4)'; });
    prevBtn.addEventListener('mouseleave', function() { this.style.background = 'rgba(255,255,255,0.2)'; });
  }
  if (nextBtn && !nextBtn.__handlersSetup) {
    nextBtn.__handlersSetup = true;
    nextBtn.onclick = (e) => { e.stopPropagation(); goNext(); };
    nextBtn.addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); goNext(); }, { passive: false });
    nextBtn.addEventListener('mouseenter', function() { this.style.background = 'rgba(255,255,255,0.4)'; });
    nextBtn.addEventListener('mouseleave', function() { this.style.background = 'rgba(255,255,255,0.2)'; });
  }
  if (closeBtn && !closeBtn.__handlersSetup) {
    closeBtn.__handlersSetup = true;
    closeBtn.onclick = (e) => { e.stopPropagation(); modal.style.display = 'none'; document.removeEventListener('keydown', handleKeyNav); };
    closeBtn.addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); modal.style.display = 'none'; document.removeEventListener('keydown', handleKeyNav); }, { passive: false });
    closeBtn.addEventListener('mouseenter', function() { this.style.background = 'rgba(255,255,255,0.4)'; });
    closeBtn.addEventListener('mouseleave', function() { this.style.background = 'rgba(255,255,255,0.2)'; });
  }

  // Setup keyboard navigation
  document.addEventListener('keydown', handleKeyNav);
}

function createDots() {
  const dotsContainer = document.getElementById('gallery-dots');
  dotsContainer.innerHTML = '';
  currentImages.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.style.width = '20px';
    dot.style.height = '20px';
    dot.style.borderRadius = '50%';
    dot.style.border = '2px solid #fff';
    dot.style.background = idx === currentIndex ? '#fff' : 'rgba(255,255,255,0.3)';
    dot.style.cursor = 'pointer';
    dot.style.transition = 'all 0.3s';
    dot.style.padding = '4px';
    dot.style.minHeight = 'auto';
    dot.style.minWidth = 'auto';
    dot.style.touchAction = 'manipulation';
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

function handleKeyNav(e) {
  if (modal.style.display !== 'flex') return;
  if (e.key === 'ArrowLeft') goPrev();
  else if (e.key === 'ArrowRight') goNext();
  else if (e.key === 'Escape') modal.style.display = 'none';
}

modal.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.removeEventListener('keydown', handleKeyNav);
  }
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