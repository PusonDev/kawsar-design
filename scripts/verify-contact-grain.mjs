import puppeteer from 'puppeteer-core';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyContactGrain() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://kawsar.zenvq.com/?v=' + Date.now(), { waitUntil: 'networkidle2' });

  // Scroll to contact
  await page.evaluate(() => {
    const contact = document.querySelector('section:last-of-type');
    if (contact) contact.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  // Screenshot empty area inside contact section
  const contactEl = await page.$('section:last-of-type');
  const crop = await contactEl.screenshot({ clip: { x: 200, y: 150, width: 200, height: 200 } });

  const stats = await page.evaluate(async (b64) => {
    function loadImg(b64) {
      return new Promise(r => {
        const img = new Image();
        img.onload = () => r(img);
        img.src = 'data:image/png;base64,' + b64;
      });
    }

    const img = await loadImg(b64);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let sumR = 0, sumG = 0, sumB = 0;
    const total = canvas.width * canvas.height;
    for (let i = 0; i < data.length; i += 4) {
      sumR += data[i];
      sumG += data[i + 1];
      sumB += data[i + 2];
    }
    const meanR = sumR / total;
    const meanG = sumG / total;
    const meanB = sumB / total;

    let varianceSum = 0;
    for (let i = 0; i < data.length; i += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const meanLum = 0.299 * meanR + 0.587 * meanG + 0.114 * meanB;
      varianceSum += Math.pow(lum - meanLum, 2);
    }
    const stdDev = Math.sqrt(varianceSum / total);
    return {
      meanRGB: { r: Number(meanR.toFixed(2)), g: Number(meanG.toFixed(2)), b: Number(meanB.toFixed(2)) },
      stdDev: Number(stdDev.toFixed(4))
    };
  }, crop.toString('base64'));

  console.log('CONTACT SECTION GRAIN STATS ON LIVE CLONE:');
  console.log(JSON.stringify(stats, null, 2));

  await browser.close();
}

verifyContactGrain().catch(console.error);
