import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('https://kawsar.zenvq.com/', { waitUntil: 'networkidle2' });

  // Take 5 crops of an empty area of the hero sheet (e.g. x: 50, y: 150, w: 100, h: 100)
  const frames = [];
  for (let i = 0; i < 5; i++) {
    const buf = await page.screenshot({
      clip: { x: 50, y: 150, width: 100, height: 100 }
    });
    frames.push(buf);
    await new Promise(r => setTimeout(r, 120));
  }

  // Compare frames
  for (let i = 0; i < 4; i++) {
    const f1 = frames[i];
    const f2 = frames[i+1];
    let diff = 0;
    for (let j = 0; j < f1.length; j++) {
      if (f1[j] !== f2[j]) diff++;
    }
    console.log(`ZENVQ Frame ${i} vs ${i+1}: diff bytes = ${diff}`);
  }

  await page.close();
  await browser.close();
}

run().catch(console.error);
