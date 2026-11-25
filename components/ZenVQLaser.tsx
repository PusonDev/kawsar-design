"use client";

import React, { useEffect } from "react";

export interface ZenVQLaserProps {
  /**
   * Theme preset: 'auto' (detects url & attributes), 'engineering' (mint),
   * 'creative' (purple), 'luxury' (gold), 'cyberpunk' (neon) or 'monochrome'
   */
  theme?: "auto" | "engineering" | "creative" | "luxury" | "cyberpunk" | "monochrome";
  /**
   * Cloudflare Edge API URL to load script dynamically, or 'local' to use bundled script
   */
  src?: string;
  sparks?: boolean;
  shockwaves?: boolean;
  reticle?: boolean;
  ribbon?: boolean;
  bloomIntensity?: number;
  zIndex?: number;
}

declare global {
  interface Window {
    ZenVQLaser?: {
      init: (opts?: Record<string, unknown>) => void;
      destroy: () => void;
      setTheme: (theme: string) => void;
      configure: (opts: Record<string, unknown>) => void;
      pulse: (x?: number, y?: number, maxRadius?: number) => void;
      burst: (x?: number, y?: number, count?: number) => void;
      getState: () => Record<string, unknown>;
    };
  }
}

export function ZenVQLaser({
  theme = "auto",
  src = "https://laser-api.zenvq.com/v1/laser.js",
  sparks = true,
  shockwaves = true,
  reticle = true,
  ribbon = true,
  bloomIntensity = 1.0,
  zIndex = 999999,
}: ZenVQLaserProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initOptions = {
      theme,
      sparksEnabled: sparks,
      shockwavesEnabled: shockwaves,
      reticleEnabled: reticle,
      ribbonEnabled: ribbon,
      bloomIntensity,
      zIndex,
      autoStyleInjection: true,
    };

    // If ZenVQLaser is already loaded on window
    if (window.ZenVQLaser) {
      window.ZenVQLaser.init(initOptions);
      return () => {
        window.ZenVQLaser?.destroy();
      };
    }

    // Otherwise dynamically inject the edge loader script
    const scriptId = "zenvq-laser-edge-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.ZenVQLaser) {
          window.ZenVQLaser.init(initOptions);
        }
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", () => {
        if (window.ZenVQLaser) {
          window.ZenVQLaser.init(initOptions);
        }
      });
    }

    return () => {
      if (window.ZenVQLaser) {
        window.ZenVQLaser.destroy();
      }
    };
  }, [theme, src, sparks, shockwaves, reticle, ribbon, bloomIntensity, zIndex]);

  return null;
}
