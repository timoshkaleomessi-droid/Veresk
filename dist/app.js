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
document.querySelectorAll('[data-product-slider]').forEach(slider => {
  const track = slider.querySelector('.product-slider-track');
  const slides = [...track.children];
  const counter = slider.querySelector('.product-slider-controls span');
  const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  const go = direction => track.scrollBy({ left: direction * track.clientWidth, behavior });
  slider.querySelector('[data-product-prev]').addEventListener('click', () => go(-1));
  slider.querySelector('[data-product-next]').addEventListener('click', () => go(1));
  track.addEventListener('scroll', () => {
    const current = Math.min(slides.length, Math.max(1, Math.round(track.scrollLeft / track.clientWidth) + 1));
    counter.textContent = `${current} / ${slides.length}`;
  }, { passive: true });
});

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

const productItems = [
  { number: '01', title: 'Индивидуальный слепок', image: 'assets/sculpture-gesture-360.avif', href: 'services.html#individual' },
  { number: '02', title: 'Парный слепок', image: 'assets/service-pair-01-360.avif', href: 'services.html#pair' },
  { number: '03', title: 'Детский слепок', image: 'assets/service-child-moon-360.avif', href: 'services.html#child' },
  { number: '04', title: 'Семейная композиция', image: 'assets/service-family-01-360.avif', href: 'services.html#family' },
  { number: '05', title: 'Авторский объект', image: 'assets/service-custom-360.avif', href: 'services.html#custom' },
  { number: '06', title: 'Истуканы «МОАИ»', image: 'assets/istukan-360.avif', href: 'moai.html' }
];

if (!document.body.classList.contains('no-product-float')) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const widget = document.createElement('aside');
  widget.className = 'product-float';
  widget.setAttribute('aria-label', 'Товары и услуги VERESK');
  widget.innerHTML = `<div class="product-float-media"><img width="360" height="360" decoding="async" alt=""></div><a class="product-float-copy" href="services.html"><span class="product-float-kicker"></span><strong class="product-float-title"></strong><span class="product-float-link">Посмотреть →</span></a><div class="product-float-progress" aria-hidden="true">${productItems.map(() => '<i></i>').join('')}</div>`;
  document.body.append(widget);
  const productImage = widget.querySelector('img');
  const productLink = widget.querySelector('a');
  const productKicker = widget.querySelector('.product-float-kicker');
  const productTitle = widget.querySelector('.product-float-title');
  const productSteps = [...widget.querySelectorAll('.product-float-progress i')];
  let productIndex = 0;
  let productTimer;
  const renderProduct = index => {
    const item = productItems[index];
    widget.classList.add('is-changing');
    setTimeout(() => {
      productImage.src = item.image;
      productImage.alt = item.title;
      productLink.href = item.href;
      productLink.setAttribute('aria-label', `${item.title}. Посмотреть`);
      productKicker.textContent = `${item.number} · Товары и услуги`;
      productTitle.textContent = item.title;
      productSteps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
      widget.classList.remove('is-changing');
    }, productIndex === 0 ? 0 : 160);
  };
  const startProducts = () => {
    if (reducedMotion) return;
    clearInterval(productTimer);
    productTimer = setInterval(() => { productIndex = (productIndex + 1) % productItems.length; renderProduct(productIndex); }, 4200);
  };
  renderProduct(0);
  setTimeout(() => widget.classList.add('is-visible'), 900);
  startProducts();
  widget.addEventListener('mouseenter', () => clearInterval(productTimer));
  widget.addEventListener('mouseleave', startProducts);
  widget.addEventListener('focusin', () => clearInterval(productTimer));
  widget.addEventListener('focusout', startProducts);
}

const homeHero = document.querySelector('.home-hero');
if (homeHero) {
  const allowedLights = new Set(['off', 'soft', '3d']);
  const requestedLight = new URLSearchParams(location.search).get('light');
  const lightMode = allowedLights.has(requestedLight) ? requestedLight : '3d';
  document.body.dataset.light = lightMode;

  if (lightMode === '3d' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let frame;
    const setLightPosition = event => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = homeHero.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        homeHero.style.setProperty('--light-x', `${(x - .5) * 54}px`);
        homeHero.style.setProperty('--light-y', `${(y - .5) * 32}px`);
        homeHero.style.setProperty('--beam-turn', `${(x - .5) * 4}deg`);
        homeHero.style.setProperty('--art-x', `${(x - .5) * -10}px`);
        homeHero.style.setProperty('--art-y', `${(y - .5) * -6}px`);
      });
    };
    homeHero.addEventListener('pointermove', setLightPosition, { passive: true });
    homeHero.addEventListener('pointerleave', () => {
      homeHero.style.setProperty('--light-x', '0px');
      homeHero.style.setProperty('--light-y', '0px');
      homeHero.style.setProperty('--beam-turn', '0deg');
      homeHero.style.setProperty('--art-x', '0px');
      homeHero.style.setProperty('--art-y', '0px');
    });
  }
}

const proposalForm = document.querySelector('#proposal-form');
if (proposalForm) {
  const fileInput = document.querySelector('#proposal-files');
  const fileStatus = document.querySelector('#file-status');
  const result = document.querySelector('#proposal-result');
  fileInput.addEventListener('change', () => {
    const files = [...fileInput.files];
    fileStatus.textContent = files.length ? files.map(file => file.name).join(' · ') : 'JPG, PNG или PDF · можно выбрать несколько файлов';
  });
  proposalForm.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(proposalForm);
    const files = [...fileInput.files];
    const text = `Предложение проекта для Ильи Вереска\n\nИмя: ${data.get('name')}\nКонтакт: ${data.get('contact')}\n\nИдея:\n${data.get('idea')}`;
    const shareData = { title: 'Предложение проекта — VERESK', text, files };
    try {
      if (navigator.share && (!files.length || navigator.canShare?.(shareData))) {
        await navigator.share(shareData);
        result.textContent = 'Материалы готовы к отправке. Спасибо за вашу идею.';
      } else {
        location.href = `mailto:veresk1976@yandex.ru?subject=${encodeURIComponent('Предложение проекта — VERESK')}&body=${encodeURIComponent(text + (files.length ? '\n\nВыбраны файлы: ' + files.map(file => file.name).join(', ') + '. Пожалуйста, приложите их к письму.' : ''))}`;
        result.textContent = files.length ? 'Письмо подготовлено. Приложите выбранные файлы перед отправкой.' : 'Письмо подготовлено в вашем почтовом приложении.';
      }
    } catch (error) {
      if (error.name !== 'AbortError') result.textContent = 'Не удалось открыть отправку. Напишите Илье в Telegram или на veresk1976@yandex.ru.';
    }
  });
}
