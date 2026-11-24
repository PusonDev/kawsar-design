import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  const imgPath = 'C:\\Users\\BaBaPuson\\.gemini\\antigravity\\brain\\e2462338-4198-4743-9c8b-18c8557d4321\\.user_uploaded\\media_1795541198709_2c218390.jpg';
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');

  const info = await page.evaluate(async (b64) => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspect: (img.naturalHeight / img.naturalWidth).toFixed(2)
        });
      };
      img.src = 'data:image/jpeg;base64,' + b64;
    });
  }, imgBase64);

  console.log('User screenshot dimensions:', info);

  await browser.close();
}

main().catch(console.error);
