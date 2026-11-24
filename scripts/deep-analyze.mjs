import fs from 'fs';

// We can launch puppeteer on _ref/live.html or https://kawsar.design/ to extract every single container and CSS property!
import puppeteer from 'puppeteer-core';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function analyze() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://kawsar.design/', { waitUntil: 'networkidle2' });

  const analysis = await page.evaluate(() => {
    function pick(el) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        classes: el.className,
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        styles: {
          display: cs.display,
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
          backgroundImage: cs.backgroundImage,
          backgroundSize: cs.backgroundSize,
          backgroundPosition: cs.backgroundPosition,
          border: cs.border,
          borderTop: cs.borderTop,
          borderBottom: cs.borderBottom,
          borderRadius: cs.borderRadius,
          boxShadow: cs.boxShadow,
          color: cs.color,
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          textAlign: cs.textAlign,
          transform: cs.transform,
          overflow: cs.overflow,
          zIndex: cs.zIndex
        }
      };
    }

    // 1. Header
    // Find email container, CV link, socials
    const copyBtn = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.trim() === 'Copy');
    const headerContainer = copyBtn?.closest('nav') || copyBtn?.closest('header') || copyBtn?.parentElement?.parentElement?.parentElement;

    // 2. Hero curved sheet
    // It's the main curved container with background
    const latestWorkBtn = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.trim() === 'Latest Work');
    const heroCard = latestWorkBtn?.closest('[style*="border-radius"], div[class*="framer"]') || latestWorkBtn?.parentElement?.parentElement?.parentElement;

    // Hero h1
    const h1 = document.querySelector('h1') || Array.from(document.querySelectorAll('h1, h2, p, span')).find(el => el.textContent?.includes('Transforming Your Ideas into Reality'));

    // Avatar
    const avatar = document.querySelector('img[src*="Ylx45dCKlDrap5HSs7wTBwhoAY"]') || document.querySelector('img');

    // Floating name badge
    const badge = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('Kawsar Ahmed'));

    // 3. Logo strip / Marquee
    const logoImgs = Array.from(document.querySelectorAll('img')).filter(img => img !== avatar);
    const marqueeContainer = logoImgs[0]?.parentElement?.parentElement?.parentElement;

    // 4. Services
    const servicesPill = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.trim() === 'Services');
    const servicesTitle = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.trim() === 'Collaborative Design Solutions To Fuel Your Digital Product');
    const servicesSection = servicesPill?.closest('section') || servicesPill?.parentElement?.parentElement?.parentElement;

    // 5. Contact sheet
    const tellMeTitle = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('Tell me about your next project'));
    const contactCard = tellMeTitle?.closest('[style*="border-radius"], div[class*="framer"]') || tellMeTitle?.parentElement?.parentElement?.parentElement;

    // 6. Footer
    const copyright = Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('All rights reserved.'));
    const footerContainer = copyright?.closest('footer') || copyright?.parentElement?.parentElement;

    return {
      body: pick(document.body),
      header: pick(headerContainer),
      heroCard: pick(heroCard),
      h1: pick(h1),
      avatar: pick(avatar),
      badge: pick(badge),
      latestWorkBtn: pick(latestWorkBtn?.parentElement),
      marqueeContainer: pick(marqueeContainer),
      servicesPill: pick(servicesPill?.parentElement),
      servicesTitle: pick(servicesTitle),
      servicesSection: pick(servicesSection),
      contactCard: pick(contactCard),
      footer: pick(footerContainer),
      allImages: Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        w: img.getBoundingClientRect().width,
        h: img.getBoundingClientRect().height,
        alt: img.alt,
        computed: pick(img)
      }))
    };
  });

  fs.writeFileSync('_ref/deep-analysis.json', JSON.stringify(analysis, null, 2));
  console.log('Saved deep analysis to _ref/deep-analysis.json');
  await browser.close();
}

analyze();
