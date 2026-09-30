const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const people = JSON.parse(fs.readFileSync('dist/people.json', 'utf8'));
const pages = ['index.html', 'history.html', 'services.html', 'people.html', 'moai.html', 'night-gallery.html'];
assert.equal(people.length, 57);
for (const file of pages) {
  const html = fs.readFileSync(path.join('dist', file), 'utf8');
  assert.equal((html.match(/<main\b/g) || []).length, 1, `${file}: main`);
  assert.equal((html.match(/<\/main>/g) || []).length, 1, `${file}: /main`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate id`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (url.startsWith('#') && url !== '#') assert(ids.includes(url.slice(1)), `${file}: missing anchor ${url}`);
    else if (!/^([a-z]+:|#)/i.test(url)) assert(fs.existsSync(path.join('dist', url.split('#')[0])), `${file}: missing ${url}`);
  }
}
const peopleHtml = fs.readFileSync('dist/people.html', 'utf8');
assert.equal((peopleHtml.match(/class="person"/g) || []).length, 57);
for (const person of people) { assert(peopleHtml.includes(person.name)); assert.match(person.date, /^\d{2}\.\d{2}\.\d{4}$/); }
const services = fs.readFileSync('dist/services.html', 'utf8');
for (const id of ['individual', 'pair', 'child', 'family', 'custom', 'istukan']) assert(services.includes(`id="${id}"`));
assert.equal((services.match(/class="product-card"/g) || []).length, 6);
console.log('Checked 6 pages, 57 archive records, 6 services, local assets, anchors and document landmarks.');
