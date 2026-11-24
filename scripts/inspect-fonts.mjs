import fs from 'fs';

const html = fs.readFileSync('_ref/live.html', 'utf8');
const fontMatches = html.match(/@font-face\s*\{[^}]*\}/g) || [];
console.log('Font-face matches count in html:', fontMatches.length);
fontMatches.forEach((f, i) => console.log(`Font ${i}:\n${f}\n`));

const urls = html.match(/https:\/\/[^"'\s)]*\.(woff2|woff|ttf|otf)[^"'\s)]*/g) || [];
const uniqueUrls = Array.from(new Set(urls));
console.log('Font URLs found (' + uniqueUrls.length + '):');
uniqueUrls.forEach(u => console.log('  ', u));
