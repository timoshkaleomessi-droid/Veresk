const header = document.querySelector('.site-header');
const triggers = [...document.querySelectorAll('[data-menu]')];
let closeTimer;

function openMenu(name) {
  clearTimeout(closeTimer);
  header.dataset.open = name;
  triggers.forEach(button => button.setAttribute('aria-expanded', String(button.dataset.menu === name)));
}
function closeMenu(delay = 0) {
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    header.dataset.open = '';
    triggers.forEach(button => button.setAttribute('aria-expanded', 'false'));
  }, delay);
}
triggers.forEach(button => {
  button.addEventListener('mouseenter', () => openMenu(button.dataset.menu));
  button.addEventListener('focus', () => openMenu(button.dataset.menu));
  button.addEventListener('click', () => header.dataset.open === button.dataset.menu ? closeMenu() : openMenu(button.dataset.menu));
});
header.addEventListener('mouseenter', () => clearTimeout(closeTimer));
header.addEventListener('mouseleave', () => closeMenu(140));
document.querySelector('.menu-scrim')?.addEventListener('click', () => closeMenu());

const mobileToggle = document.querySelector('.mobile-toggle');
mobileToggle.addEventListener('click', () => {
  const open = !header.classList.contains('mobile-open');
  header.classList.toggle('mobile-open', open);
  document.body.classList.toggle('menu-open', open);
  mobileToggle.setAttribute('aria-expanded', String(open));
  mobileToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', () => {
  header.classList.remove('mobile-open'); document.body.classList.remove('menu-open');
}));
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  closeMenu(); header.classList.remove('mobile-open'); document.body.classList.remove('menu-open');
  mobileToggle.setAttribute('aria-expanded', 'false');
});

const gallery = document.querySelector('.history-track');
if (gallery) {
  const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  document.querySelector('[data-gallery-prev]').addEventListener('click', () => gallery.scrollBy({ left: -gallery.clientWidth * .8, behavior }));
  document.querySelector('[data-gallery-next]').addEventListener('click', () => gallery.scrollBy({ left: gallery.clientWidth * .8, behavior }));
}

const search = document.querySelector('#people-search');
if (search) {
  const rows = [...document.querySelectorAll('[data-person]')];
  const count = document.querySelector('#archive-count');
  const empty = document.querySelector('.empty-search');
  const normalize = value => value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();
  search.addEventListener('input', () => {
    const query = normalize(search.value); let visible = 0;
    rows.forEach(row => { const match = normalize(row.dataset.person).includes(query); row.hidden = !match; if (match) visible++; });
    count.textContent = query ? `Найдено: ${visible} из ${rows.length}` : `${rows.length} записей`;
    empty.hidden = visible !== 0;
  });
}

document.querySelectorAll('[data-year]').forEach(node => node.textContent = new Date().getFullYear());
