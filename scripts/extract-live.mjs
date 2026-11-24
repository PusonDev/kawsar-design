import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://kawsar.design/';

const refDir = path.join(projectRoot, '_ref');
const publicAssetsDir = path.join(projectRoot, 'public', 'assets');
const componentsDir = path.join(projectRoot, 'components');

fs.mkdirSync(refDir, { recursive: true });
fs.mkdirSync(publicAssetsDir, { recursive: true });
fs.mkdirSync(componentsDir, { recursive: true });

async function run() {
  console.log('Launching browser with Chrome path:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  
  // Set Desktop viewport 1440x900
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  console.log('Navigating to', TARGET_URL);
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000)); // wait for animations and fonts to settle

  // 1. Capture Desktop Reference Screenshot
  const desktopScreenshotPath = path.join(refDir, 'live-desktop.png');
  await page.screenshot({ path: desktopScreenshotPath, fullPage: true });
  console.log('Saved Desktop screenshot to:', desktopScreenshotPath);

  // 2. Deep DOM & Computed-Style Extraction Script at 1440px
  const desktopSpec = await page.evaluate(async () => {
    function getStyles(el, props) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const res = {};
      const targetProps = props || [
        'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
        'color', 'backgroundColor', 'backgroundImage', 'border', 'borderTop',
        'borderRight', 'borderBottom', 'borderLeft', 'borderRadius', 'borderTopLeftRadius',
        'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius',
        'boxShadow', 'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
        'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
        'maxWidth', 'width', 'height', 'minHeight', 'gap', 'transform', 'display',
        'flexDirection', 'alignItems', 'justifyContent', 'position', 'top', 'left', 'right', 'bottom',
        'zIndex', 'overflow', 'opacity'
      ];
      for (const p of targetProps) {
        res[p] = cs[p];
      }
      return res;
    }

    function getRect(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.x, y: r.y, top: r.top, left: r.left,
        width: r.width, height: r.height,
        scrollWidth: el.scrollWidth, scrollHeight: el.scrollHeight
      };
    }

    // Font faces from document.fonts and stylesheet links
    const fontFaces = [];
    document.fonts.forEach(f => {
      fontFaces.push({ family: f.family, style: f.style, weight: f.weight, status: f.status });
    });

    const fontLinks = Array.from(document.querySelectorAll('link[rel*="stylesheet"], link[rel="preconnect"], link[rel*="font"]'))
      .map(l => ({ rel: l.rel, href: l.href, as: l.as, crossOrigin: l.crossOrigin }));

    // Extract all @keyframes, @font-face rules from stylesheets
    const keyframes = [];
    const fontFaceRules = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          if (rule.type === CSSRule.KEYFRAMES_RULE) {
            keyframes.push(rule.cssText);
          } else if (rule.type === CSSRule.FONT_FACE_RULE) {
            fontFaceRules.push(rule.cssText);
          }
        }
      } catch (e) {
        // cross-origin stylesheets
      }
    }

    // Elements forensic
    const bodyStyles = getStyles(document.body);
    const htmlStyles = getStyles(document.documentElement);

    // Identify sections by DOM inspection
    const allSections = Array.from(document.querySelectorAll('header, nav, main, section, footer, div'));

    // Collect all links, buttons, headings, paragraphs
    const elementsSpec = [];
    const seenEls = new Set();

    function describeEl(el) {
      if (!el || seenEls.has(el)) return null;
      seenEls.add(el);
      const tag = el.tagName.toLowerCase();
      const id = el.id;
      const className = el.className && typeof el.className === 'string' ? el.className : '';
      const text = el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 ? el.textContent.trim() : '';
      const rect = getRect(el);
      const styles = getStyles(el);
      return { tag, id, className, text, rect, styles };
    }

    // Scan specific sections
    const headerEl = document.querySelector('header') || document.querySelector('nav');
    const heroEl = document.querySelector('main > *:first-child') || document.querySelector('section');
    const footerEl = document.querySelector('footer');

    // Walk tree for all semantic and styled elements
    const elements = Array.from(document.querySelectorAll('body *')).map(el => {
      const tag = el.tagName.toLowerCase();
      // Keep relevant elements
      const isRelevant = ['header', 'nav', 'main', 'section', 'footer', 'h1', 'h2', 'h3', 'p', 'a', 'button', 'ul', 'li', 'span', 'img', 'svg'].includes(tag) ||
        el.getAttribute('role') || el.className;
      if (!isRelevant) return null;
      return {
        tag,
        id: el.id || undefined,
        className: typeof el.className === 'string' ? el.className : undefined,
        role: el.getAttribute('role') || undefined,
        href: el.getAttribute('href') || undefined,
        src: el.getAttribute('src') || undefined,
        alt: el.getAttribute('alt') || undefined,
        text: el.children.length === 0 ? el.textContent : undefined,
        rect: getRect(el),
        styles: getStyles(el)
      };
    }).filter(Boolean);

    // Return comprehensive spec
    return {
      title: document.title,
      htmlLength: document.documentElement.outerHTML.length,
      fullHTML: document.documentElement.outerHTML,
      viewport: { width: window.innerWidth, height: window.innerHeight, scrollHeight: document.documentElement.scrollHeight },
      fontFaces,
      fontLinks,
      fontFaceRules,
      keyframes,
      bodyStyles,
      htmlStyles,
      elements
    };
  });

  // 3. Switch to Mobile viewport 375x812 and capture Mobile Reference & Spec
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 2000));

  const mobileScreenshotPath = path.join(refDir, 'live-mobile.png');
  await page.screenshot({ path: mobileScreenshotPath, fullPage: true });
  console.log('Saved Mobile screenshot to:', mobileScreenshotPath);

  const mobileSpec = await page.evaluate(async () => {
    function getStyles(el, props) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const res = {};
      const targetProps = props || [
        'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
        'color', 'backgroundColor', 'backgroundImage', 'border', 'borderRadius',
        'boxShadow', 'padding', 'margin', 'maxWidth', 'width', 'height', 'gap',
        'transform', 'display', 'flexDirection', 'alignItems', 'justifyContent'
      ];
      for (const p of targetProps) {
        res[p] = cs[p];
      }
      return res;
    }
    function getRect(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.x, y: r.y, width: r.width, height: r.height,
        scrollWidth: el.scrollWidth, scrollHeight: el.scrollHeight
      };
    }
    const elements = Array.from(document.querySelectorAll('body *')).map(el => {
      const tag = el.tagName.toLowerCase();
      const isRelevant = ['header', 'nav', 'main', 'section', 'footer', 'h1', 'h2', 'h3', 'p', 'a', 'button'].includes(tag);
      if (!isRelevant) return null;
      return {
        tag,
        className: typeof el.className === 'string' ? el.className : undefined,
        text: el.children.length === 0 ? el.textContent : undefined,
        rect: getRect(el),
        styles: getStyles(el)
      };
    }).filter(Boolean);

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight },
      bodyStyles: getStyles(document.body),
      elements
    };
  });

  // Save spec.json
  const fullSpec = {
    url: TARGET_URL,
    extractedAt: new Date().toISOString(),
    desktop: desktopSpec,
    mobile: mobileSpec
  };

  // Also save raw html separately for inspection
  fs.writeFileSync(path.join(refDir, 'live.html'), desktopSpec.fullHTML, 'utf8');
  delete desktopSpec.fullHTML; // Keep spec.json cleaner

  fs.writeFileSync(path.join(refDir, 'spec.json'), JSON.stringify(fullSpec, null, 2), 'utf8');
  console.log('Saved spec.json to:', path.join(refDir, 'spec.json'));

  // 4. Download all images and SVGs
  console.log('Extracting images and SVGs...');
  // Re-switch to desktop viewport for clean asset extraction
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  
  const assetData = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      currentSrc: img.currentSrc,
      alt: img.alt,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      outerHTML: img.outerHTML
    }));

    // Find background images in inline styles or computed styles
    const bgImages = [];
    document.querySelectorAll('*').forEach(el => {
      const bg = window.getComputedStyle(el).backgroundImage;
      if (bg && bg !== 'none' && bg.includes('url(')) {
        const matches = bg.match(/url\(["']?([^"']*)["']?\)/g);
        if (matches) {
          matches.forEach(m => {
            const url = m.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            bgImages.push({ url, selector: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : '') });
          });
        }
      }
    });

    // Inline SVGs
    const svgs = Array.from(document.querySelectorAll('svg')).map((svg, idx) => {
      const parent = svg.closest('a, button, div, span, p, h1, h2, h3, li');
      const parentContext = parent ? (parent.tagName.toLowerCase() + (parent.className ? '.' + parent.className.split(' ').join('.') : '') + ' : ' + parent.textContent?.trim().slice(0, 30)) : 'standalone';
      return {
        index: idx,
        parentContext,
        width: svg.getAttribute('width'),
        height: svg.getAttribute('height'),
        viewBox: svg.getAttribute('viewBox'),
        fill: svg.getAttribute('fill'),
        stroke: svg.getAttribute('stroke'),
        className: typeof svg.className === 'string' ? svg.className : undefined,
        outerHTML: svg.outerHTML,
        innerHTML: svg.innerHTML
      };
    });

    return { images, bgImages, svgs };
  });

  console.log(`Found ${assetData.images.length} images, ${assetData.bgImages.length} background images, ${assetData.svgs.length} inline SVGs.`);

  // Save assetData metadata
  fs.writeFileSync(path.join(refDir, 'assets-meta.json'), JSON.stringify(assetData, null, 2), 'utf8');

  // Download all <img> files
  const downloadedImages = new Map();
  for (let i = 0; i < assetData.images.length; i++) {
    const imgInfo = assetData.images[i];
    const src = imgInfo.currentSrc || imgInfo.src;
    if (!src || src.startsWith('data:') || downloadedImages.has(src)) continue;

    try {
      console.log(`Downloading image [${i+1}/${assetData.images.length}]:`, src);
      const urlObj = new URL(src);
      let filename = path.basename(urlObj.pathname);
      if (!filename || filename.length < 3 || !filename.includes('.')) {
        filename = `image_${i}.png`;
      }
      // Sanitize filename
      filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const destPath = path.join(publicAssetsDir, filename);

      const res = await fetch(src);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(destPath, Buffer.from(buffer));
        console.log(`  -> Saved to public/assets/${filename} (${buffer.byteLength} bytes)`);
        downloadedImages.set(src, `/assets/${filename}`);
      } else {
        console.warn(`  Failed to fetch ${src}: status ${res.status}`);
      }
    } catch (err) {
      console.error(`  Error downloading ${src}:`, err.message);
    }
  }

  // Also download background images if any
  for (let i = 0; i < assetData.bgImages.length; i++) {
    const bg = assetData.bgImages[i];
    let fullUrl = bg.url;
    if (fullUrl.startsWith('//')) fullUrl = 'https:' + fullUrl;
    else if (fullUrl.startsWith('/')) fullUrl = new URL(fullUrl, TARGET_URL).href;
    if (fullUrl.startsWith('http') && !downloadedImages.has(fullUrl)) {
      try {
        const urlObj = new URL(fullUrl);
        let filename = path.basename(urlObj.pathname).replace(/[^a-zA-Z0-9._-]/g, '_');
        if (!filename.includes('.')) filename = `bg_${i}.png`;
        const destPath = path.join(publicAssetsDir, filename);
        const res = await fetch(fullUrl);
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          fs.writeFileSync(destPath, Buffer.from(buffer));
          console.log(`  -> Saved background image to public/assets/${filename}`);
          downloadedImages.set(fullUrl, `/assets/${filename}`);
        }
      } catch (e) {
        console.error(`  Error downloading bg ${fullUrl}:`, e.message);
      }
    }
  }

  // Extract all inline SVGs verbatim into components/icons.tsx
  console.log('Generating components/icons.tsx with verbatim SVGs...');
  let iconsFileContent = `import React from 'react';\n\n`;
  iconsFileContent += `// Auto-generated verbatim SVGs from https://kawsar.design/\n\n`;

  assetData.svgs.forEach((svg, idx) => {
    // Generate clean component name
    let compName = `IconSvg_${idx}`;
    const ctx = svg.parentContext.toLowerCase();
    if (ctx.includes('email') || ctx.includes('mail')) compName = `IconEmail_${idx}`;
    else if (ctx.includes('whatsapp')) compName = `IconWhatsApp_${idx}`;
    else if (ctx.includes('cv') || ctx.includes('resume')) compName = `IconCV_${idx}`;
    else if (ctx.includes('dribbble')) compName = `IconDribbble_${idx}`;
    else if (ctx.includes('twitter') || ctx.includes('x.com')) compName = `IconTwitter_${idx}`;
    else if (ctx.includes('linkedin')) compName = `IconLinkedIn_${idx}`;
    else if (ctx.includes('arrow')) compName = `IconArrow_${idx}`;
    else if (ctx.includes('service')) compName = `IconService_${idx}`;

    // Clean up SVG attributes for React JSX (class -> className, stroke-width -> strokeWidth, etc.)
    let jsx = svg.outerHTML
      .replace(/class=/g, 'className=')
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
      .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')
      .replace(/fill-rule=/g, 'fillRule=')
      .replace(/clip-rule=/g, 'clipRule=')
      .replace(/xmlns:xlink=/g, 'xmlnsXlink=')
      .replace(/xlink:href=/g, 'xlinkHref=')
      .replace(/stop-color=/g, 'stopColor=')
      .replace(/stop-opacity=/g, 'stopOpacity=')
      .replace(/fill-opacity=/g, 'fillOpacity=');

    iconsFileContent += `// Index ${idx}: ${svg.parentContext}\n`;
    iconsFileContent += `export function ${compName}(props: React.SVGProps<SVGSVGElement>) {\n`;
    iconsFileContent += `  return (\n    ${jsx.replace(/<svg /, '<svg {...props} ')}\n  );\n}\n\n`;
  });

  fs.writeFileSync(path.join(componentsDir, 'icons.tsx'), iconsFileContent, 'utf8');
  console.log('Saved components/icons.tsx');

  // Also save raw SVGs in _ref/svgs/
  const svgsDir = path.join(refDir, 'svgs');
  fs.mkdirSync(svgsDir, { recursive: true });
  assetData.svgs.forEach((svg, idx) => {
    fs.writeFileSync(path.join(svgsDir, `svg_${idx}.svg`), svg.outerHTML, 'utf8');
  });

  await browser.close();
  console.log('GATE 1 EXTRACTION COMPLETE!');
}

run().catch(err => {
  console.error('Extraction failed:', err);
  process.exit(1);
});
