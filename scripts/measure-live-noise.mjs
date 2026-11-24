import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://kawsar.design/';
const refDir = path.join(projectRoot, '_ref');

async function measureLive() {
  console.log('Launching browser to capture macro crops on live site...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Use deviceScaleFactor: 1 for standard 1:1 CSS pixel math
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Capture 200x200 macro crop from flat empty area in Hero
  // Hero is at y=0-742. An empty area on desktop: x=100, y=200, w=200, h=200
  const heroMacroPath = path.join(refDir, 'noise-macro-live.png');
  await page.screenshot({
    path: heroMacroPath,
    clip: { x: 100, y: 200, width: 200, height: 200 }
  });
  console.log('Captured noise-macro-live.png at clip {x:100, y:200, w:200, h:200}');

  // Capture curved section border where hero sheet meets middle white section
  // Bottom curve of hero is at y=742. Let's capture at x=100, y=700, w=200, h=200
  const edgeMacroPath = path.join(refDir, 'noise-edge-live.png');
  await page.screenshot({
    path: edgeMacroPath,
    clip: { x: 100, y: 700, width: 200, height: 200 }
  });
  console.log('Captured noise-edge-live.png at clip {x:100, y:700, w:200, h:200}');

  // Read pixel data of noise-macro-live using page canvas
  const stats = await page.evaluate(() => {
    // We can draw a 200x200 crop onto canvas and calculate mean RGB and stdDev
    return new Promise((resolve) => {
      // In page context, let's inspect the computed styles of the canvas background
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      resolve({ bodyBg });
    });
  });

  console.log('Live body bg:', stats.bodyBg);
  await browser.close();
}

measureLive().catch(console.error);
