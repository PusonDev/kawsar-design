import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectEdgeLive() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const elementsAtCrop = await page.evaluate(() => {
    // Check elements overlapping rect { x: 100, y: 700, w: 200, h: 200 }
    const rect = { left: 100, top: 700, right: 300, bottom: 900 };
    const all = Array.from(document.querySelectorAll('*'));
    const overlapping = [];
    for (const el of all) {
      const r = el.getBoundingClientRect();
      const pageY = r.top + window.scrollY;
      const overlaps = !(r.left > rect.right || r.right < rect.left || pageY > rect.bottom || (pageY + r.height) < rect.top);
      if (overlaps && (el.tagName === 'IMG' || el.tagName === 'SVG' || el.tagName === 'P' || el.tagName === 'SPAN' || el.className.includes('framer'))) {
        overlapping.push({
          tag: el.tagName,
          class: el.className,
          rect: { x: Math.round(r.left), y: Math.round(pageY), w: Math.round(r.width), h: Math.round(r.height) }
        });
      }
    }
    return overlapping;
  });

  console.log('Overlapping elements at crop:', JSON.stringify(elementsAtCrop, null, 2));
  await browser.close();
}

inspectEdgeLive().catch(console.error);
