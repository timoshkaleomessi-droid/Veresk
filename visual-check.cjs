const path = require('node:path');
const { chromium } = require('C:/Users/timos/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  for (const spec of [
    { name: 'home-desktop', url: '/', width: 1440, height: 1050 },
    { name: 'home-author', url: '/', width: 1440, height: 900, selector: '#author' },
    { name: 'home-features', url: '/', width: 1440, height: 1000, selector: '.feature-grid' },
    { name: 'menu-desktop', url: '/', width: 1440, height: 760, menu: true },
    { name: 'people-media', url: '/people.html', width: 1440, height: 900, selector: '.people-media' },
    { name: 'history-mobile', url: '/history.html', width: 390, height: 844 },
    { name: 'services-mobile', url: '/services.html', width: 390, height: 844 },
    { name: 'moai-desktop', url: '/moai.html', width: 1440, height: 950 },
    { name: 'moai-gallery', url: '/moai.html', width: 1440, height: 1000, selector: '.moai-gallery' },
    { name: 'moai-specs', url: '/moai.html', width: 1440, height: 950, selector: '.moai-specs' },
    { name: 'moai-mobile', url: '/moai.html', width: 390, height: 844 },
    { name: 'night-desktop', url: '/night-gallery.html', width: 1440, height: 950 },
    { name: 'night-mobile', url: '/night-gallery.html', width: 390, height: 844 }
  ]) {
    const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height }, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:4173${spec.url}`, { waitUntil: 'networkidle' });
    if (spec.menu) { await page.hover('[data-menu="project"]'); await page.waitForTimeout(450); }
    if (spec.selector) { await page.locator(spec.selector).scrollIntoViewIfNeeded(); await page.waitForTimeout(200); }
    await page.screenshot({ path: path.join(__dirname, '.sites-runtime', `${spec.name}.png`), fullPage: false });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${spec.name}: title=${await page.title()}, overflow=${overflow}px`);
    await page.close();
  }
  const people = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await people.goto('http://127.0.0.1:4173/people.html', { waitUntil: 'networkidle' });
  await people.fill('#people-search', 'Баста');
  const visible = await people.locator('.person:not([hidden])').count();
  if (visible !== 1) throw new Error(`People search expected 1 result, got ${visible}`);
  console.log('people-search: 1 matching archive record');
  await people.close();
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
