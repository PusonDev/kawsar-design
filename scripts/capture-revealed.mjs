import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '_ref/live-final-revealed.png' });
  const avatarCrop = await page.evaluate(() => {
    const img = document.querySelector('img[src*="kawsar-avatar"]');
    if (!img) return 'not found';
    const r = img.getBoundingClientRect();
    return {
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      rect: { x: r.x, y: r.y, w: r.width, h: r.height }
    };
  });
  console.log('AVATAR STATUS:', JSON.stringify(avatarCrop, null, 2));
  await browser.close();
}
test().catch(console.error);
