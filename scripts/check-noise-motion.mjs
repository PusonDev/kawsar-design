import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkNoiseMotion() {
  const auditDir = path.resolve(projectRoot, '_audit');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  // Sample the transform of the noise div over 1 second (10 samples, 100ms apart)
  const samples = [];
  for (let i = 0; i < 10; i++) {
    const data = await page.evaluate(() => {
      const el = document.querySelector('.framer-ekivo5-container div[style*="rR6HYXBrMmX4cRpXfXUOvpvpB0"]');
      if (!el) return null;
      return {
        styleAttr: el.getAttribute('style'),
        transform: window.getComputedStyle(el).transform
      };
    });
    samples.push({ i, time: i * 100, data });
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('TRANSFORM SAMPLES OVER 1 SECOND:');
  console.log(JSON.stringify(samples, null, 2));

  // Pixel comparison of t0 vs t1
  const t0 = fs.readFileSync(path.join(auditDir, 'main-noise-t0.png'));
  const t1 = fs.readFileSync(path.join(auditDir, 'main-noise-t1.png'));

  const diffCount = Buffer.compare(t0, t1);
  console.log('Buffer comparison t0 vs t1:', diffCount === 0 ? 'IDENTICAL (Static)' : 'DIFFERENT (Animated)');

  // Let's compute exact pixel difference and stats via offscreen canvas
  const stats = await page.evaluate(async (t0Base64, t1Base64) => {
    function loadImg(b64) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = 'data:image/png;base64,' + b64;
      });
    }

    const img0 = await loadImg(t0Base64);
    const img1 = await loadImg(t1Base64);

    const canvas = document.createElement('canvas');
    canvas.width = img0.width;
    canvas.height = img0.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img0, 0, 0);
    const data0 = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img1, 0, 0);
    const data1 = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let diffPixels = 0;
    let sumR = 0, sumG = 0, sumB = 0;
    const totalPixels = canvas.width * canvas.height;

    for (let i = 0; i < data0.length; i += 4) {
      sumR += data0[i];
      sumG += data0[i + 1];
      sumB += data0[i + 2];
      if (
        data0[i] !== data1[i] ||
        data0[i + 1] !== data1[i + 1] ||
        data0[i + 2] !== data1[i + 2]
      ) {
        diffPixels++;
      }
    }

    const meanR = sumR / totalPixels;
    const meanG = sumG / totalPixels;
    const meanB = sumB / totalPixels;

    // Variance & stdDev of luminance
    let varianceSum = 0;
    for (let i = 0; i < data0.length; i += 4) {
      const lum = 0.299 * data0[i] + 0.587 * data0[i + 1] + 0.114 * data0[i + 2];
      const meanLum = 0.299 * meanR + 0.587 * meanG + 0.114 * meanB;
      varianceSum += Math.pow(lum - meanLum, 2);
    }
    const stdDev = Math.sqrt(varianceSum / totalPixels);

    return {
      width: canvas.width,
      height: canvas.height,
      totalPixels,
      diffPixels,
      isAnimated: diffPixels > 0,
      meanRGB: { r: meanR, g: meanG, b: meanB },
      stdDev
    };
  }, t0.toString('base64'), t1.toString('base64'));

  console.log('PIXEL STATS OF LIVE NOISE:', JSON.stringify(stats, null, 2));

  fs.writeFileSync(path.join(auditDir, 'noise-stats.json'), JSON.stringify(stats, null, 2));

  await browser.close();
}

checkNoiseMotion().catch(console.error);
