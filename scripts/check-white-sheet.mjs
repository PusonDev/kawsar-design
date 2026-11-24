import puppeteer from 'puppeteer-core';
import { analyzePng } from './calc-pixel-math.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://kawsar.design/';

async function checkWhiteSheet() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });

  // Ticker is at y=842, white sheet is at y=742 to 1022
  // Capture crop at x=100, y=780, w=100, h=100
  const whiteCropPath = path.join(projectRoot, '_ref', 'live-white-sheet-crop.png');
  await page.screenshot({ path: whiteCropPath, clip: { x: 100, y: 780, width: 100, height: 100 } });
  const stats = await analyzePng(whiteCropPath);
  console.log('Live White Sheet Stats:');
  console.log('  Mean Lum:', stats.mean.lum.toFixed(2));
  console.log('  StdDev Lum:', stats.stdDev.lum.toFixed(2));

  await browser.close();
}

checkWhiteSheet().catch(console.error);
