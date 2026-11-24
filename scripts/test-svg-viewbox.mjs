import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testSvgViewBox() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Compare on a test page
  const svgWithoutViewBox = fs.readFileSync('public/assets/XFWQcHTyPCmpljR7ttDhwueN9k.svg', 'utf8');
  // Add viewBox
  const svgWithViewBox = svgWithoutViewBox.replace('<svg ', '<svg viewBox="0 0 94 32" ');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .slot { width: 160px; height: 40px; border: 1px solid red; position: relative; display: inline-block; }
        .slot img { display: block; width: 100%; height: 100%; object-fit: contain; object-position: center; }
      </style>
    </head>
    <body>
      <div class="slot">
        <img id="without" src="data:image/svg+xml;base64,${Buffer.from(svgWithoutViewBox).toString('base64')}">
      </div>
      <div class="slot">
        <img id="with" src="data:image/svg+xml;base64,${Buffer.from(svgWithViewBox).toString('base64')}">
      </div>
    </body>
    </html>
  `);

  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '_ref/svg-viewbox-comparison.png' });

  console.log('Saved _ref/svg-viewbox-comparison.png');
  await browser.close();
}

testSvgViewBox().catch(console.error);
