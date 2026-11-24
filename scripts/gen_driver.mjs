import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const data = JSON.parse(fs.readFileSync(path.join(projectRoot, '_audit', 'full-cycle-live.json'), 'utf8'));
const transforms = data.samples.map(s => s.transform);

const code = `'use client';

import { useEffect } from 'react';

// Exact 97-sample Framer Motion noise transform cycle captured 1:1 from kawsar.design
const NOISE_TRANSFORMS: readonly string[] = [
${transforms.map(t => `  '${t}',`).join('\n')}
];

export function LiveNoiseDriver() {
  useEffect(() => {
    // Select all noise layer elements
    const els = document.querySelectorAll<HTMLElement>('.animate-live-noise');
    if (!els || els.length === 0) return;

    let frameIndex = 0;
    const totalFrames = NOISE_TRANSFORMS.length;

    // Exact Framer cadence: ~88.89ms interval (11.25 FPS)
    const timer = setInterval(() => {
      // Pause if document is hidden to conserve battery
      if (document.hidden) return;

      frameIndex = (frameIndex + 1) % totalFrames;
      const transform = NOISE_TRANSFORMS[frameIndex];

      for (let i = 0; i < els.length; i++) {
        els[i].style.transform = transform;
      }
    }, 88.89);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return null;
}
`;

fs.writeFileSync(path.join(projectRoot, 'components', 'LiveNoiseDriver.tsx'), code, 'utf8');
console.log('Successfully wrote components/LiveNoiseDriver.tsx');
