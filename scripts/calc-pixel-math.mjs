import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

export async function analyzePng(pngPath) {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  const fileData = fs.readFileSync(pngPath);
  const dataUri = `data:image/png;base64,${fileData.toString('base64')}`;

  const metrics = await page.evaluate(async (uri) => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imgData.data;
        const numPixels = img.width * img.height;

        let sumR = 0, sumG = 0, sumB = 0, sumLum = 0;
        const lums = new Float64Array(numPixels);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          sumR += r;
          sumG += g;
          sumB += b;
          sumLum += lum;
          lums[i / 4] = lum;
        }

        const meanR = sumR / numPixels;
        const meanG = sumG / numPixels;
        const meanB = sumB / numPixels;
        const meanLum = sumLum / numPixels;

        let varR = 0, varG = 0, varB = 0, varLum = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = lums[i / 4];
          varR += (r - meanR) ** 2;
          varG += (g - meanG) ** 2;
          varB += (b - meanB) ** 2;
          varLum += (lum - meanLum) ** 2;
        }

        const stdDevR = Math.sqrt(varR / numPixels);
        const stdDevG = Math.sqrt(varG / numPixels);
        const stdDevB = Math.sqrt(varB / numPixels);
        const stdDevLum = Math.sqrt(varLum / numPixels);

        resolve({
          width: img.width,
          height: img.height,
          mean: { r: meanR, g: meanG, b: meanB, lum: meanLum },
          stdDev: { r: stdDevR, g: stdDevG, b: stdDevB, lum: stdDevLum }
        });
      };
      img.src = uri;
    });
  }, dataUri);

  await browser.close();
  return metrics;
}

async function run() {
  const liveMacro = path.join(projectRoot, '_ref', 'noise-macro-live.png');
  console.log('Analyzing live macro:', liveMacro);
  const m = await analyzePng(liveMacro);
  console.log('LIVE MACRO STATS:');
  console.log('  Mean RGB:', `R=${m.mean.r.toFixed(2)}, G=${m.mean.g.toFixed(2)}, B=${m.mean.b.toFixed(2)}, Lum=${m.mean.lum.toFixed(2)}`);
  console.log('  StdDev:', `R=${m.stdDev.r.toFixed(2)}, G=${m.stdDev.g.toFixed(2)}, B=${m.stdDev.b.toFixed(2)}, Lum=${m.stdDev.lum.toFixed(2)}`);
}

if (process.argv[1] && process.argv[1].includes('calc-pixel-math.mjs')) {
  run().catch(console.error);
}
