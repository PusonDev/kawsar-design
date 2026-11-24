import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureFrames(url, prefix) {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  console.log(`Navigating to ${url} ...`);
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Let's crop a 200x200 patch in the hero background (e.g. x: 100, y: 100)
  const frames = [];
  for (let i = 0; i < 5; i++) {
    const buf = await page.screenshot({
      clip: { x: 100, y: 100, width: 200, height: 200 }
    });
    frames.push(buf);
    await new Promise(r => setTimeout(r, 100)); // 100ms
  }

  // Compare frames
  console.log(`\nFrame diffs for ${prefix}:`);
  for (let i = 0; i < frames.length - 1; i++) {
    const b0 = frames[i];
    const b1 = frames[i + 1];
    let diff = 0;
    for (let j = 0; j < b0.length; j++) {
      if (b0[j] !== b1[j]) diff++;
    }
    console.log(`  Frame ${i} -> ${i+1}: diff bytes = ${diff} / ${b0.length} (${(diff/b0.length*100).toFixed(2)}%)`);
  }

  await browser.close();
}

async function main() {
  await captureFrames('https://kawsar.design/', 'GROUND_TRUTH');
  await captureFrames('https://kawsar.zenvq.com/', 'CLONE');
}

main().catch(console.error);
