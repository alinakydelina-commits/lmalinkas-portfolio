const dialog=document.querySelector('#project-dialog');document.querySelectorAll('button.project').forEach(card=>card.addEventListener('click',()=>{document.querySelector('#dialog-title').textContent=card.querySelector('h3').textContent;document.querySelector('#dialog-art').replaceChildren(card.querySelector('.art').cloneNode(true));dialog.querySelector(':scope > p:last-of-type').textContent=card.dataset.projectDescription||'Временный проект для настройки сайта. Здесь будут описание задачи, процесс и результаты вашей работы.';dialog.showModal();document.body.classList.add('modal-open')}));function closeProject(){dialog.close();document.body.classList.remove('modal-open')}document.querySelector('.close').addEventListener('click',closeProject);document.querySelector('.dialog-back').addEventListener('click',closeProject);dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeProject()}});
const photoGallery = document.querySelector('.personal-gallery');
const galleryButtons = [...photoGallery.querySelectorAll('[data-gallery-slide]')];
const galleryFrames = [...photoGallery.querySelectorAll('[data-gallery-frame]')];
const galleryNext = photoGallery.querySelector('.gallery-next');
const reduceGalleryMotion = matchMedia('(prefers-reduced-motion: reduce)');
let galleryIndex = 0;
let galleryTimer;
let galleryVisible = false;

function scheduleGallery() {
  clearTimeout(galleryTimer);
  if (galleryVisible && !document.hidden && !reduceGalleryMotion.matches) {
    galleryTimer = setTimeout(advanceGallery, 5000);
  }
}

function showGalleryPhoto(index) {
  galleryIndex = index;
  galleryFrames.forEach((frame, i) => { frame.hidden = i !== index; });
  galleryButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  scheduleGallery();
}

function advanceGallery() {
  showGalleryPhoto((galleryIndex + 1) % galleryFrames.length);
}

galleryNext.addEventListener('click', advanceGallery);
galleryButtons.forEach((button, index) => button.addEventListener('click', () => showGalleryPhoto(index)));
document.addEventListener('visibilitychange', scheduleGallery);
reduceGalleryMotion.addEventListener('change', scheduleGallery);
new IntersectionObserver(([entry]) => {
  galleryVisible = entry.isIntersecting;
  scheduleGallery();
}, { threshold: 0.25 }).observe(photoGallery);
const achievements = document.querySelector('#achievements');
const achievementsStage = achievements.querySelector('.education-stage');
const achievementsViewport = achievements.querySelector('.education-viewport');
const achievementsTrack = achievements.querySelector('.education-track');
const reduceAchievementsMotion = matchMedia('(prefers-reduced-motion: reduce)');
let achievementsWidth = 0;
let achievementsTravel = 0;
let achievementsPinTop = 0;
let achievementsFrame = 0;

function renderAchievements() {
  achievementsFrame = 0;
  if (!achievementsTravel) return;
  const elapsed = achievementsPinTop - achievements.getBoundingClientRect().top;
  const progress = Math.max(0, Math.min(1, elapsed / achievementsTravel));
  achievements.style.setProperty('--education-offset', `${-achievementsWidth * progress}px`);
}

function measureAchievements() {
  if (!reduceAchievementsMotion.matches) {
    achievements.classList.add('is-scroll-driven');
    achievementsPinTop = parseFloat(getComputedStyle(achievementsStage).top);
    achievementsWidth = Math.max(0, achievementsTrack.scrollWidth - achievementsViewport.clientWidth);
    const stageFits = achievementsStage.offsetHeight + achievementsPinTop <= window.innerHeight;
    if (stageFits && achievementsWidth) {
      achievementsTravel = Math.min(achievementsWidth, Math.round(window.innerHeight * 1.65));
      achievements.style.setProperty('--education-travel', `${achievementsTravel}px`);
      return renderAchievements();
    }
  }

  achievementsTravel = 0;
  achievements.classList.remove('is-scroll-driven');
  achievements.style.removeProperty('--education-travel');
  achievements.style.removeProperty('--education-offset');
}

window.addEventListener('scroll', () => {
  if (achievementsTravel && !achievementsFrame) {
    achievementsFrame = requestAnimationFrame(renderAchievements);
  }
}, { passive: true });
window.addEventListener('resize', measureAchievements);
reduceAchievementsMotion.addEventListener('change', measureAchievements);
new ResizeObserver(measureAchievements).observe(achievementsStage);
measureAchievements();

const paintingTrack = document.querySelector('#painting-track');
const paintingArrows = [...document.querySelectorAll('[data-painting-direction]')];

function updatePaintingArrows() {
  const maxScroll = paintingTrack.scrollWidth - paintingTrack.clientWidth;
  paintingArrows[0].setAttribute('aria-disabled', String(paintingTrack.scrollLeft <= 1));
  paintingArrows[1].setAttribute('aria-disabled', String(paintingTrack.scrollLeft >= maxScroll - 1));
}

paintingArrows.forEach(arrow => {
  arrow.addEventListener('click', () => {
    if (arrow.getAttribute('aria-disabled') === 'true') return;
    const style = getComputedStyle(paintingTrack);
    const visibleCount = Number(style.getPropertyValue('--paintings-per-view'));
    const stride = paintingTrack.firstElementChild.offsetWidth + parseFloat(style.columnGap);
    paintingTrack.scrollBy({
      left: Number(arrow.dataset.paintingDirection) * visibleCount * stride,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  });
});
paintingTrack.addEventListener('scroll', updatePaintingArrows, { passive: true });
new ResizeObserver(updatePaintingArrows).observe(paintingTrack);
updatePaintingArrows();
