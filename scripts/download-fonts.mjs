import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fontsDir = path.resolve(__dirname, '..', 'public', 'fonts');

fs.mkdirSync(fontsDir, { recursive: true });

const fonts = [
  { name: 'Otterco-DisplayMedium.woff2', url: 'https://framerusercontent.com/assets/2GyQE1tcj0UfiymZXHQDAZBLYU.woff2' },
  { name: 'Otterco-Regular.woff2', url: 'https://framerusercontent.com/assets/yoqoPI6zKnjlyYvXTV5rb115qIE.woff2' },
  { name: 'Otterco-Light.woff2', url: 'https://framerusercontent.com/assets/9vZTA8EDPLjaI88x2NazcB1UL7Y.woff2' },
  { name: 'Otterco-DisplaySemiBold.woff2', url: 'https://framerusercontent.com/assets/XSKlyxbKFEhJktTX6t08wvZwr5w.woff2' },
  { name: 'Otterco-Medium.woff2', url: 'https://framerusercontent.com/assets/wEnvkz1wIJPtvK8OOzqfu05xisM.woff2' },
];

async function downloadFonts() {
  for (const font of fonts) {
    const dest = path.join(fontsDir, font.name);
    console.log(`Downloading ${font.name}...`);
    const res = await fetch(font.url);
    if (res.ok) {
      const buf = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(buf));
      console.log(`Saved ${font.name} (${buf.byteLength} bytes)`);
    } else {
      console.error(`Failed ${font.name}: status ${res.status}`);
    }
  }
}

downloadFonts();
