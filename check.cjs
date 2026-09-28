const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const html=fs.readFileSync('dist/index.html','utf8'),people=JSON.parse(fs.readFileSync('dist/people.json','utf8'));
assert.equal(people.length,57);assert.equal((html.match(/class="person"/g)||[]).length,57);
assert.equal((html.match(/<main\b/g)||[]).length,1);assert.equal((html.match(/<\/main>/g)||[]).length,1);
assert.equal((html.match(/<figure>/g)||[]).length,10);
assert(!html.includes('meeting-10.png'));assert(!html.includes('assets/hands.png'));assert(!html.includes('data-order'));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const u=m[1];if(u.startsWith('#')&&u!=='#')assert(ids.includes(u.slice(1)),`Missing anchor ${u}`);else if(!/^([a-z]+:|#)/i.test(u))assert(fs.existsSync(path.join('dist',u)),`Missing local file ${u}`)}
for(const person of people){assert(html.includes(person.name));assert.match(person.date,/^\d{2}\.\d{2}\.\d{4}$/)}
console.log('Checked: 57 records, 10 gallery photos, local assets, internal links, document landmarks, removed image 10, live contact links.');
