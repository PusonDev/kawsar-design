'use client';

import { useEffect } from 'react';

// Exact 97-sample Framer Motion noise transform cycle captured 1:1 from kawsar.design
const NOISE_TRANSFORMS: readonly string[] = [
  'translateX(-12%) translateY(0.5%)',
  'translateX(-13%) translateY(2%)',
  'translateX(-14%) translateY(3.5%)',
  'translateX(-15%) translateY(5%)',
  'translateX(-12.8%) translateY(2%)',
  'translateX(-10.6%) translateY(-1%)',
  'translateX(-8.4%) translateY(-4%)',
  'translateX(-6.2%) translateY(-7%)',
  'translateX(-4%) translateY(-10%)',
  'translateX(-1.8%) translateY(-13%)',
  'translateX(0.4%) translateY(-16%)',
  'translateX(2.6%) translateY(-19%)',
  'translateX(4.8%) translateY(-22%)',
  'translateX(7%) translateY(-25%)',
  'translateX(5.8%) translateY(-20%)',
  'translateX(4.6%) translateY(-15%)',
  'translateX(3.4%) translateY(-10%)',
  'translateX(2.2%) translateY(-5%)',
  'translateX(1%)',
  'translateX(-0.2%) translateY(5%)',
  'translateX(-1.4%) translateY(10%)',
  'translateX(-2.6%) translateY(15%)',
  'translateX(-3.8%) translateY(20%)',
  'translateX(-5%) translateY(25%)',
  'translateX(-6%) translateY(23.5%)',
  'translateX(-7%) translateY(22%)',
  'translateX(-8%) translateY(20.5%)',
  'translateX(-9%) translateY(19%)',
  'translateX(-10%) translateY(17.5%)',
  'translateX(-11%) translateY(16%)',
  'translateX(-12%) translateY(14.5%)',
  'translateX(-13%) translateY(13%)',
  'translateX(-14%) translateY(11.5%)',
  'translateX(-15%) translateY(10%)',
  'translateX(-12%) translateY(9%)',
  'translateX(-9%) translateY(8%)',
  'translateX(-6%) translateY(7%)',
  'translateX(-3%) translateY(6%)',
  'translateY(5%)',
  'translateX(3%) translateY(4%)',
  'translateX(6%) translateY(3%)',
  'translateX(9%) translateY(2%)',
  'translateX(12%) translateY(1%)',
  'translateX(15%)',
  'translateX(13.5%) translateY(1.5%)',
  'translateX(12%) translateY(3%)',
  'translateX(10.5%) translateY(4.5%)',
  'translateX(9%) translateY(6%)',
  'translateX(7.5%) translateY(7.5%)',
  'translateX(6%) translateY(9%)',
  'translateX(4.5%) translateY(10.5%)',
  'translateX(3%) translateY(12%)',
  'translateX(1.5%) translateY(13.5%)',
  'translateY(15%)',
  'translateX(0.3%) translateY(17%)',
  'translateX(0.6%) translateY(19%)',
  'translateX(0.9%) translateY(21%)',
  'translateX(1.2%) translateY(23%)',
  'translateX(1.5%) translateY(25%)',
  'translateX(1.8%) translateY(27%)',
  'translateX(2.1%) translateY(29%)',
  'translateX(2.4%) translateY(31%)',
  'translateX(2.7%) translateY(33%)',
  'translateX(3%) translateY(35%)',
  'translateX(1.7%) translateY(32.5%)',
  'translateX(0.4%) translateY(30%)',
  'translateX(-0.9%) translateY(27.5%)',
  'translateX(-2.2%) translateY(25%)',
  'translateX(-3.5%) translateY(22.5%)',
  'translateX(-4.8%) translateY(20%)',
  'translateX(-6.1%) translateY(17.5%)',
  'translateX(-7.4%) translateY(15%)',
  'translateX(-8.7%) translateY(12.5%)',
  'translateX(-10%) translateY(10%)',
  'translateX(-0.5%) translateY(-1%)',
  'translateX(-1%) translateY(-2%)',
  'translateX(-1.5%) translateY(-3%)',
  'translateX(-2%) translateY(-4%)',
  'translateX(-2.5%) translateY(-5%)',
  'translateX(-3%) translateY(-6%)',
  'translateX(-3.5%) translateY(-7%)',
  'translateX(-4%) translateY(-8%)',
  'translateX(-4.5%) translateY(-9%)',
  'translateX(-5%) translateY(-10%)',
  'translateX(-6%) translateY(-8.5%)',
  'translateX(-7%) translateY(-7%)',
  'translateX(-8%) translateY(-5.5%)',
  'translateX(-9%) translateY(-4%)',
  'translateX(-10%) translateY(-2.5%)',
  'translateX(-11%) translateY(-1%)',
  'translateX(-12%) translateY(0.5%)',
  'translateX(-13%) translateY(2%)',
  'translateX(-14%) translateY(3.5%)',
  'translateX(-15%) translateY(5%)',
  'translateX(-12.8%) translateY(2%)',
  'translateX(-10.6%) translateY(-1%)',
  'translateX(-8.4%) translateY(-4%)',
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
