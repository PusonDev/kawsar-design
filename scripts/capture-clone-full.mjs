import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureCloneScreenshots() {
  console.log('Capturing full-page screenshots of clone...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  // Desktop (1440x900)
  const pageDesk = await browser.newPage();
  await pageDesk.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await pageDesk.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await pageDesk.screenshot({ path: path.join(projectRoot, '_ref', 'clone-desktop.png'), fullPage: true });
  console.log('Saved _ref/clone-desktop.png');

  // Mobile (375x812)
  const pageMob = await browser.newPage();
  await pageMob.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 });
  await pageMob.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await pageMob.screenshot({ path: path.join(projectRoot, '_ref', 'clone-mobile.png'), fullPage: true });
  console.log('Saved _ref/clone-mobile.png');

  await browser.close();
}

captureCloneScreenshots().catch(console.error);
