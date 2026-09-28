const fs=require('node:fs');
let html=fs.readFileSync('dist/index.html','utf8');
const captions={
'meeting-01.png':'Баста · 16.10.2020',
'meeting-02.png':'Станислав Черчесов · 17.07.2019',
'process-01.png':'Сергей Шнуров · 26.07.2018',
'meeting-04.png':'Сергей Шнуров · 26.07.2018',
'process-02.png':'Сергей Семак · 20.10.2022',
'process-03.png':'Андрей Кириленко · 24.10.2022',
'studio.png':'Михаил Галустян',
'process-04.png':'Баста · за кадром',
};
html=html.replace(/<figure><a href="assets\/meeting-10\.png"[\s\S]*?<\/figure>/,'');
let index=0;
html=html.replace(/<figure><a href="assets\/([^\"]+)"[\s\S]*?<\/figure>/g,(figure,file)=>{index++;const title=captions[file];if(title)figure=figure.replace(/aria-label="Открыть фото:[^"]*"/,`aria-label="Открыть фото: ${title}"`).replace(/alt="[^"]*"/,`alt="${title} — архив проекта «Руки»"`).replace(/<figcaption><span>[^<]*<\/span>/,`<figcaption><span>${title}</span>`);return figure.replace(/<small>[^<]*<\/small>/,`<small>${String(index).padStart(2,'0')} / 10</small>`)});
fs.writeFileSync('dist/index.html',html);
