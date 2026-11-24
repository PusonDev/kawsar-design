import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const cssPath = path.join(projectRoot, 'app', 'globals.css');

let content = fs.readFileSync(cssPath, 'utf8');

// Generate @-webkit-keyframes live-noise-jitter
const kfMatch = content.match(/@keyframes live-noise-jitter \{[\s\S]*?\n\}/);
if (!kfMatch) {
  console.error('Could not find @keyframes live-noise-jitter in globals.css');
  process.exit(1);
}

const originalKf = kfMatch[0];
const webkitKf = originalKf
  .replace('@keyframes live-noise-jitter', '@-webkit-keyframes live-noise-jitter')
  .replace(/transform:/g, '-webkit-transform:');

const newAnimClass = `.animate-live-noise,
.animate-live-noise:hover,
.animate-live-noise:focus,
.animate-live-noise:active {
  -webkit-animation: live-noise-jitter 8s steps(1) infinite !important;
  animation: live-noise-jitter 8s steps(1) infinite !important;
  -webkit-animation-play-state: running !important;
  animation-play-state: running !important;
  will-change: transform;
}`;

// Replace .animate-live-noise definition
content = content.replace(/\.animate-live-noise \{[\s\S]*?\}/, webkitKf + '\n\n' + newAnimClass);

fs.writeFileSync(cssPath, content, 'utf8');
console.log('Successfully updated app/globals.css with -webkit-keyframes and robust animation properties.');
