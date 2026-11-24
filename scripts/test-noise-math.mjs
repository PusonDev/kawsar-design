import puppeteer from 'puppeteer-core';
import { analyzePng } from './calc-pixel-math.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testOpacities() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const tileBuf = fs.readFileSync(path.join(projectRoot, 'public', 'assets', 'noise-tile.png'));
  const dataUri = `data:image/png;base64,${tileBuf.toString('base64')}`;

  const opacities = [0.032, 0.05, 0.08, 0.1, 0.12, 0.15, 0.18, 0.2, 0.25];

  for (const op of opacities) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; background-color: #F6F5F4; overflow: hidden; }
          .noise {
            position: absolute;
            inset: 0;
            background-image: url("${dataUri}");
            background-repeat: repeat;
            opacity: ${op};
          }
        </style>
      </head>
      <body>
        <div class="noise"></div>
      </body>
      </html>
    `;

    await page.setContent(html);
    const testPath = path.join(projectRoot, '_ref', `test-noise-${op}.png`);
    await page.screenshot({ path: testPath, clip: { x: 100, y: 200, width: 200, height: 200 } });
    const stats = await analyzePng(testPath);
    console.log(`Opacity ${op}: Mean Lum = ${stats.mean.lum.toFixed(2)} (Live=239.69, diff=${(stats.mean.lum - 239.69).toFixed(2)}) | StdDev Lum = ${stats.stdDev.lum.toFixed(2)} (Live=2.64, diff=${(stats.stdDev.lum - 2.64).toFixed(2)})`);
  }

  await browser.close();
}

testOpacities().catch(console.error);
