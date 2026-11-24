import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function traverse() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const tree = await page.evaluate(() => {
    function getCleanStyles(el) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id,
        className: el.className,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        cs: {
          display: cs.display,
          position: cs.position,
          flexDirection: cs.flexDirection,
          justifyContent: cs.justifyContent,
          alignItems: cs.alignItems,
          gap: cs.gap,
          width: cs.width,
          maxWidth: cs.maxWidth,
          height: cs.height,
          padding: cs.padding,
          margin: cs.margin,
          backgroundColor: cs.backgroundColor,
          backgroundImage: cs.backgroundImage !== 'none' ? cs.backgroundImage : undefined,
          backgroundSize: cs.backgroundSize,
          backgroundPosition: cs.backgroundPosition,
          backgroundRepeat: cs.backgroundRepeat,
          border: cs.border !== '0px none rgb(0, 0, 0)' && cs.border !== 'none' ? cs.border : undefined,
          borderRadius: cs.borderRadius !== '0px' ? cs.borderRadius : undefined,
          boxShadow: cs.boxShadow !== 'none' ? cs.boxShadow : undefined,
          color: cs.color,
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          textAlign: cs.textAlign,
          transform: cs.transform !== 'none' ? cs.transform : undefined,
          overflow: cs.overflow,
          opacity: cs.opacity
        }
      };
    }

    // Find all elements that have a background color or image, or border, or border-radius
    const interesting = [];
    document.querySelectorAll('*').forEach(el => {
      const cs = window.getComputedStyle(el);
      const hasBg = (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') ||
                    (cs.backgroundImage && cs.backgroundImage !== 'none');
      const hasBorder = cs.borderWidth && cs.borderWidth !== '0px' && cs.borderStyle !== 'none';
      const hasRadius = cs.borderRadius && cs.borderRadius !== '0px';
      const hasText = el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 && el.textContent.trim().length > 0;

      if (hasBg || hasBorder || hasRadius || hasText) {
        const item = getCleanStyles(el);
        if (hasText) item.text = el.textContent.trim();
        interesting.push(item);
      }
    });

    return interesting;
  });

  fs.writeFileSync('_ref/interesting-elements.json', JSON.stringify(tree, null, 2));
  console.log(`Found ${tree.length} interesting elements.`);
  await browser.close();
}

traverse();
