import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzePng } from './calc-pixel-math.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testStacking() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const tileBuf = fs.readFileSync(path.join(projectRoot, 'public', 'assets', 'noise-tile.png'));
  const dataUri = `data:image/png;base64,${tileBuf.toString('base64')}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: #242424; }
        .main-container { position: relative; width: 1440px; min-height: 900px; background: #F6F5F4; }
        
        /* Noise layer at z-index 10 */
        .noise-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
          opacity: 0.028;
          overflow: hidden;
        }
        .noise-inner {
          position: absolute;
          inset: -200%;
          width: 400%;
          height: 400%;
          background-image: url("${dataUri}");
          background-repeat: repeat;
          background-size: 256px 256px;
        }

        /* Section without z-index (z-index: auto) */
        .hero-section {
          position: relative;
          width: 100%;
          height: 742px;
          background-color: #F6F5F4;
          border-bottom-left-radius: 120px;
          border-bottom-right-radius: 120px;
        }

        /* Content inside section at z-index 20 */
        .hero-content {
          position: relative;
          z-index: 20;
          color: #242424;
          padding: 100px;
        }
      </style>
    </head>
    <body>
      <div class="main-container">
        <!-- Section has background #F6F5F4, but z-index: auto -->
        <section class="hero-section">
          <div class="hero-content">
            <h1>Test Heading Above Noise</h1>
          </div>
        </section>

        <!-- Noise layer at z-index: 10 -->
        <div class="noise-layer">
          <div class="noise-inner"></div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  const testPath = path.join(projectRoot, '_ref', 'test-stacking.png');
  await page.screenshot({ path: testPath, clip: { x: 100, y: 200, width: 200, height: 200 } });

  const stats = await analyzePng(testPath);
  console.log('STACKING TEST STATS:');
  console.log('  Mean Lum:', stats.mean.lum.toFixed(2), '(Live=239.69, diff=', (stats.mean.lum - 239.69).toFixed(2), ')');
  console.log('  StdDev Lum:', stats.stdDev.lum.toFixed(2), '(Live=2.64, diff=', (stats.stdDev.lum - 2.64).toFixed(2), ')');

  await browser.close();
}

testStacking().catch(console.error);
