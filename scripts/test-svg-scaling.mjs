import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testScaling() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Load a simple test HTML
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .slot { width: 160px; height: 40px; border: 1px solid red; position: relative; }
        .slot img { display: block; width: 100%; height: 100%; object-fit: contain; object-position: center; }
      </style>
    </head>
    <body>
      <div class="slot">
        <img id="test1" src="http://localhost:3000/assets/XFWQcHTyPCmpljR7ttDhwueN9k.svg">
      </div>
    </body>
    </html>
  `;

  // Start a local check with data url or file url
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });
  const result = await page.evaluate(() => {
    const slot = document.createElement('div');
    slot.style.width = '160px';
    slot.style.height = '40px';
    const img = document.createElement('img');
    img.src = '/assets/XFWQcHTyPCmpljR7ttDhwueN9k.svg';
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    slot.appendChild(img);
    document.body.appendChild(slot);
    return new Promise(resolve => {
      img.onload = () => {
        const r = img.getBoundingClientRect();
        resolve({
          w: r.width,
          h: r.height,
          naturalW: img.naturalWidth,
          naturalH: img.naturalHeight
        });
      };
    });
  });

  console.log('SCALING RESULT:', result);
  await browser.close();
}

testScaling().catch(console.error);
