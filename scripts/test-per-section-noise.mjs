import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzePng } from './calc-pixel-math.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testPerSection() {
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
        .main-container { position: relative; width: 1440px; min-height: 2304px; background: #F6F5F4; overflow-x: hidden; }
        
        .noise-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          user-select: none;
          z-index: 1;
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

        .hero-section {
          position: relative;
          width: 100%;
          height: 742px;
          background-color: #F6F5F4;
          border-bottom-left-radius: 120px;
          border-bottom-right-radius: 120px;
          z-index: 10;
          overflow: hidden;
        }

        .middle-section {
          position: relative;
          width: 100%;
          height: 280px;
          margin-top: -80px;
          background-color: #FFFFFF;
          border-bottom-left-radius: 120px;
          border-bottom-right-radius: 120px;
          z-index: 5;
          overflow: hidden;
        }

        .content {
          position: relative;
          z-index: 20;
          padding: 40px;
        }
      </style>
    </head>
    <body>
      <div class="main-container">
        <!-- Hero Section with noise overlay at z-1, content at z-20 -->
        <section class="hero-section">
          <div class="noise-overlay"><div class="noise-inner"></div></div>
          <div class="content">
            <h1>Hero Content</h1>
          </div>
        </section>

        <!-- Middle Section with noise overlay at z-1 -->
        <section class="middle-section">
          <div class="noise-overlay"><div class="noise-inner"></div></div>
          <div class="content">
            <p>Middle Content</p>
          </div>
        </section>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);

  // 1. Capture Hero Macro (x:100, y:200, w:200, h:200)
  const heroMacroPath = path.join(projectRoot, '_ref', 'test-hero-macro.png');
  await page.screenshot({ path: heroMacroPath, clip: { x: 100, y: 200, width: 200, height: 200 } });

  // 2. Capture Edge Macro (x:100, y:700, w:200, h:200)
  const edgeMacroPath = path.join(projectRoot, '_ref', 'test-edge-macro.png');
  await page.screenshot({ path: edgeMacroPath, clip: { x: 100, y: 700, width: 200, height: 200 } });

  const liveHeroMacroPath = path.join(projectRoot, '_ref', 'noise-macro-live.png');
  const liveEdgeMacroPath = path.join(projectRoot, '_ref', 'noise-edge-live.png');

  const liveHero = await analyzePng(liveHeroMacroPath);
  const testHero = await analyzePng(heroMacroPath);

  const liveEdge = await analyzePng(liveEdgeMacroPath);
  const testEdge = await analyzePng(edgeMacroPath);

  console.log('\n--- HERO MACRO COMPARISON ---');
  console.log(`Live: Mean Lum = ${liveHero.mean.lum.toFixed(2)}, StdDev = ${liveHero.stdDev.lum.toFixed(2)}`);
  console.log(`Test: Mean Lum = ${testHero.mean.lum.toFixed(2)}, StdDev = ${testHero.stdDev.lum.toFixed(2)}`);
  console.log(`Diff: Mean Lum = ${Math.abs(liveHero.mean.lum - testHero.mean.lum).toFixed(2)} (Pass <= 2: ${Math.abs(liveHero.mean.lum - testHero.mean.lum) <= 2}), StdDev = ${Math.abs(liveHero.stdDev.lum - testHero.stdDev.lum).toFixed(2)} (Pass <= 0.35: ${Math.abs(liveHero.stdDev.lum - testHero.stdDev.lum) <= 0.35})`);

  console.log('\n--- EDGE MACRO COMPARISON ---');
  console.log(`Live: Mean Lum = ${liveEdge.mean.lum.toFixed(2)}, StdDev = ${liveEdge.stdDev.lum.toFixed(2)}`);
  console.log(`Test: Mean Lum = ${testEdge.mean.lum.toFixed(2)}, StdDev = ${testEdge.stdDev.lum.toFixed(2)}`);
  console.log(`Diff: Mean Lum = ${Math.abs(liveEdge.mean.lum - testEdge.mean.lum).toFixed(2)}, StdDev = ${Math.abs(liveEdge.stdDev.lum - testEdge.stdDev.lum).toFixed(2)}`);

  await browser.close();
}

testPerSection().catch(console.error);
