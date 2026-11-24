import fs from 'fs';

const html = fs.readFileSync('_ref/live.html', 'utf8');
const headEnd = html.indexOf('</head>');
const headContent = html.slice(0, headEnd);

const metaMatches = headContent.match(/<meta[^>]*>/gi) || [];
console.log('Meta tags:');
metaMatches.forEach(m => console.log('  ', m));

const linkMatches = headContent.match(/<link[^>]*rel=["'][^"']*icon[^"']*["'][^>]*>/gi) || [];
console.log('Icon links:');
linkMatches.forEach(l => console.log('  ', l));
