"use client";

import React, { useEffect, useRef } from "react";

export interface LaserCursorProps {
  theme?: "auto" | "white" | "monochrome" | "engineering" | "creative" | "luxury" | "cyberpunk" | "clinical" | "botanical" | "motion";
  maxHistory?: number;
  sparksEnabled?: boolean;
  shockwavesEnabled?: boolean;
  reticleEnabled?: boolean;
  ribbonEnabled?: boolean;
  bloomIntensity?: number;
  zIndex?: number;
  className?: string;
}

interface LaserPoint {
  x: number;
  y: number;
  time: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
  color: string;
}

interface RingWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  rgb?: string;
}

const THEME_DATA = {
  white: {
    coreDark: "#FFFFFF",
    coreLight: "#000000",
    glowDark: "rgba(255, 255, 255, 0.85)",
    glowLight: "rgba(0, 0, 0, 0.75)",
    secondaryDark: "rgba(255, 255, 255, 0.6)",
    secondaryLight: "rgba(24, 24, 27, 0.6)",
    rgbDark: "255, 255, 255",
    rgbLight: "0, 0, 0",
    rgbSecondaryDark: "244, 244, 245",
    rgbSecondaryLight: "24, 24, 27",
    sparkPaletteDark: ["#FFFFFF", "#FAFAFA", "#F4F4F5", "#E4E4E7"],
    sparkPaletteLight: ["#000000", "#18181B", "#27272A", "#52525B"]
  },
  monochrome: {
    coreDark: "#FFFFFF",
    coreLight: "#000000",
    glowDark: "rgba(255, 255, 255, 0.85)",
    glowLight: "rgba(0, 0, 0, 0.75)",
    secondaryDark: "rgba(255, 255, 255, 0.6)",
    secondaryLight: "rgba(24, 24, 27, 0.6)",
    rgbDark: "255, 255, 255",
    rgbLight: "0, 0, 0",
    rgbSecondaryDark: "244, 244, 245",
    rgbSecondaryLight: "24, 24, 27",
    sparkPaletteDark: ["#FFFFFF", "#FAFAFA", "#F4F4F5", "#E4E4E7"],
    sparkPaletteLight: ["#000000", "#18181B", "#27272A", "#52525B"]
  },
  engineering: {
    coreDark: "#FFFFFF",
    coreLight: "#0F766E",
    glowDark: "#6FFFE9",
    glowLight: "rgba(15, 118, 110, 0.9)",
    secondaryDark: "#A5FFEF",
    secondaryLight: "rgba(13, 148, 136, 0.7)",
    rgbDark: "111, 255, 233",
    rgbLight: "15, 118, 110",
    rgbSecondaryDark: "165, 255, 239",
    rgbSecondaryLight: "13, 148, 136",
    sparkPaletteDark: ["#6FFFE9", "#A5FFEF", "#FFFFFF"],
    sparkPaletteLight: ["#0F766E", "#0D9488", "#115E59"]
  },
  creative: {
    coreDark: "#FAF5FF",
    coreLight: "#7C3AED",
    glowDark: "#A855F7",
    glowLight: "rgba(124, 58, 237, 0.9)",
    secondaryDark: "#C084FC",
    secondaryLight: "rgba(168, 85, 247, 0.7)",
    rgbDark: "168, 85, 247",
    rgbLight: "124, 58, 237",
    rgbSecondaryDark: "192, 132, 252",
    rgbSecondaryLight: "168, 85, 247",
    sparkPaletteDark: ["#C084FC", "#E9D5FF", "#FFFFFF"],
    sparkPaletteLight: ["#7C3AED", "#A855F7", "#6D28D9"]
  },
  luxury: {
    coreDark: "#FFFBEB",
    coreLight: "#B45309",
    glowDark: "#F59E0B",
    glowLight: "rgba(180, 83, 9, 0.9)",
    secondaryDark: "#FDE68A",
    secondaryLight: "rgba(217, 119, 6, 0.7)",
    rgbDark: "245, 158, 11",
    rgbLight: "180, 83, 9",
    rgbSecondaryDark: "253, 230, 138",
    rgbSecondaryLight: "217, 119, 6",
    sparkPaletteDark: ["#F59E0B", "#FDE68A", "#FFFFFF"],
    sparkPaletteLight: ["#B45309", "#D97706", "#78350F"]
  },
  cyberpunk: {
    coreDark: "#FDF4FF",
    coreLight: "#BE185D",
    glowDark: "#EC4899",
    glowLight: "rgba(190, 24, 93, 0.9)",
    secondaryDark: "#F472B6",
    secondaryLight: "rgba(219, 39, 119, 0.7)",
    rgbDark: "236, 72, 153",
    rgbLight: "190, 24, 93",
    rgbSecondaryDark: "244, 114, 182",
    rgbSecondaryLight: "219, 39, 119",
    sparkPaletteDark: ["#EC4899", "#52796F", "#FFFFFF"],
    sparkPaletteLight: ["#BE185D", "#9D174D", "#831843"]
  },
  clinical: {
    coreDark: "#FFFFFF",
    coreLight: "#15803D",
    glowDark: "#22C55E",
    glowLight: "#16A34A",
    secondaryDark: "#86EFAC",
    secondaryLight: "#4ADE80",
    rgbDark: "34, 197, 94",
    rgbLight: "22, 163, 74",
    rgbSecondaryDark: "134, 239, 172",
    rgbSecondaryLight: "74, 222, 128",
    sparkPaletteDark: ["#22C55E", "#86EFAC", "#FFFFFF", "#4ADE80"],
    sparkPaletteLight: ["#15803D", "#16A34A", "#22C55E", "#166534"]
  },
  botanical: {
    coreDark: "#FFFFFF",
    coreLight: "#0891B2",
    glowDark: "#FFFFFF",
    glowLight: "#06B6D4",
    secondaryDark: "rgba(255, 255, 255, 0.8)",
    secondaryLight: "#22D3EE",
    rgbDark: "255, 255, 255",
    rgbLight: "6, 182, 212",
    rgbSecondaryDark: "244, 244, 245",
    rgbSecondaryLight: "34, 211, 238",
    sparkPaletteDark: ["#FFFFFF", "#FAFAFA", "#F4F4F5", "#E4E4E7"],
    sparkPaletteLight: ["#06B6D4", "#0891B2", "#22D3EE", "#00F2FE"]
  },
  motion: {
    coreDark: "#FFFFFF",
    coreLight: "#006B47",
    glowDark: "#00E599",
    glowLight: "#00B377",
    secondaryDark: "#00D2B4",
    secondaryLight: "#009688",
    rgbDark: "0, 229, 153",
    rgbLight: "0, 179, 119",
    rgbSecondaryDark: "0, 210, 180",
    rgbSecondaryLight: "0, 150, 136",
    sparkPaletteDark: ["#00E599", "#00D2B4", "#FFFFFF", "#6EE7B7"],
    sparkPaletteLight: ["#006B47", "#00B377", "#009688", "#18181B"]
  }
};

export function LaserCursor({
  theme = "auto",
  maxHistory = 20,
  sparksEnabled = true,
  shockwavesEnabled = true,
  reticleEnabled = true,
  ribbonEnabled = true,
  bloomIntensity = 0.85,
  zIndex = 999999,
  className = ""
}: LaserCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Enable custom laser cursor styles on HTML root
    document.documentElement.classList.add("laser-cursor-active", "zenvq-laser-active");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // State tracking
    const history: LaserPoint[] = [];
    const sparks: Spark[] = [];
    const waves: RingWave[] = [];

    let mouseX = -1000;
    let mouseY = -1000;
    let prevMouseX = -1000;
    let prevMouseY = -1000;
    let isVisible = false;
    let isHoveringInteractive = false;
    let isHoveringText = false;
    let animFrameId: number;

    // Reticle animation states
    let reticleSize = 0;
    let reticleAngle = 0;
    let hoveredTheme: string = "auto";

    const isCreativeRoute = () => {
      if (typeof window === "undefined") return false;
      const p = window.location.pathname.toLowerCase();
      const s = window.location.search.toLowerCase();
      return p.includes("/creative") || s.includes("tab=creative");
    };

    const isAgencySite = () => {
      if (typeof window === "undefined") return false;
      const host = window.location.hostname.toLowerCase();
      if (host.includes("agency.zenvq.com") || host.includes("zenvq-agency")) return true;
      if (typeof document !== "undefined") {
        if (document.body?.getAttribute("data-site") === "agency") return true;
        if (document.querySelector('[data-hub="engineering"], [data-particle-theme="engineering"], [data-theme-route="creative"]')) return true;
        if (document.title.toLowerCase().includes("agency")) return true;
      }
      return false;
    };

    const isClinicalSite = () => {
      if (typeof window === "undefined") return false;
      const host = window.location.hostname.toLowerCase();
      if (host.includes("drjerin") || host.includes("dental")) return true;
      if (typeof document !== "undefined") {
        if (document.body?.getAttribute("data-site") === "clinical" || document.body?.getAttribute("data-site") === "dental") return true;
        if (document.title.toLowerCase().includes("jarin") || document.title.toLowerCase().includes("dental")) return true;
      }
      return false;
    };

    const isNaturesIntimacySite = () => {
      if (typeof window === "undefined") return false;
      const host = window.location.hostname.toLowerCase();
      if (host.includes("natures-intimacy") || host.includes("naturesintimacy")) return true;
      if (typeof document !== "undefined") {
        if (document.body?.getAttribute("data-site") === "natures-intimacy") return true;
        if (document.title.toLowerCase().includes("nature's intimacy") || document.title.toLowerCase().includes("natures intimacy")) return true;
      }
      return false;
    };

    const isSaifSite = () => {
      if (typeof window === "undefined") return false;
      const host = window.location.hostname.toLowerCase();
      if (host.includes("saif")) return true;
      if (typeof document !== "undefined") {
        if (document.body?.getAttribute("data-site") === "saif") return true;
        if (document.title.toLowerCase().includes("saif")) return true;
      }
      return false;
    };

    const isSuggestsSite = () => {
      if (typeof window === "undefined") return false;
      const host = window.location.hostname.toLowerCase();
      if (host.includes("suggests")) return true;
      if (typeof document !== "undefined") {
        if (document.body?.getAttribute("data-site") === "suggests") return true;
        if (document.title.toLowerCase().includes("suggests")) return true;
      }
      return false;
    };

    const isBoutiqueSite = () => {
      if (typeof window === "undefined") return false;
      const host = window.location.hostname.toLowerCase();
      if (host.includes("boutique")) return true;
      if (typeof document !== "undefined") {
        if (document.body?.getAttribute("data-site") === "boutique") return true;
        if (document.title.toLowerCase().includes("jennah")) return true;
      }
      return false;
    };

    const resolveThemeKey = (): keyof typeof THEME_DATA => {
      // 1. Strict Creative Route Guard: On /creative, laser is ALWAYS creative purple
      if (isCreativeRoute()) {
        return "creative";
      }

      // 2. Contextual element hover (e.g. hovering creative or engineering card)
      if (hoveredTheme !== "auto" && THEME_DATA[hoveredTheme as keyof typeof THEME_DATA]) {
        return hoveredTheme as keyof typeof THEME_DATA;
      }

      // 3. Explicit theme prop passed from parent (if not "auto")
      if (theme !== "auto" && THEME_DATA[theme as keyof typeof THEME_DATA]) {
        return theme as keyof typeof THEME_DATA;
      }

      // 4. Clinical Dental Ecosystem Detection: default on Dr. Jarin's Dental Point is Clinical Mint
      if (isClinicalSite()) {
        return "clinical";
      }

      // 5. Nature's Intimacy Ecosystem Detection: Cyan in light mode and White in dark mode
      if (isNaturesIntimacySite()) {
        return "botanical";
      }

      // 6. Saif Motion Designer Portfolio Ecosystem Detection: Emerald Mint in dark mode and Deep Emerald in light mode
      if (isSaifSite()) {
        return "motion";
      }

      // 7. ZenVQ Suggests Detection: Creative Purple on lavender theme, Emerald Motion on light/dark themes
      if (isSuggestsSite()) {
        const tAttr = (document.documentElement.getAttribute("data-theme") || "purple").toLowerCase();
        return tAttr === "purple" ? "creative" : "motion";
      }

      // 8. Maison JENNAH Boutique Detection: Luxury Gold matching Parisian couture
      if (isBoutiqueSite()) {
        return "luxury";
      }

      // 9. Agency Ecosystem Detection: default on agency homepage is Engineering Cyan
      if (isAgencySite()) {
        return "engineering";
      }

      // 10. URL Route Preset checks
      if (typeof window !== "undefined") {
        const p = window.location.pathname.toLowerCase();
        const s = window.location.search.toLowerCase();
        if (p.includes("/luxury") || s.includes("theme=luxury")) return "luxury";
        if (p.includes("/cyber") || s.includes("theme=cyberpunk")) return "cyberpunk";
      }

      // 11. Universal Default: White on dark canvas and Black on light canvas
      return "white";
    };

    // Fast check for interactive elements and contextual theme
    const checkTargetType = (target: EventTarget | null) => {
      if (!target || !(target instanceof Element)) {
        return { isInteractive: false, isText: false, detectedTheme: "auto" };
      }
      const isText = Boolean(target.closest("input, textarea, [contenteditable='true']"));
      const isInteractive = Boolean(
        target.closest(
          'a, button, select, [role="button"], [data-interactive], .cursor-pointer, [tabindex="0"]'
        )
      );

      // On /creative route, stay strictly locked to creative theme
      if (isCreativeRoute()) {
        return { isInteractive, isText, detectedTheme: "creative" };
      }

      let detectedTheme = "auto";
      const themedEl = target.closest(
        "[data-laser-theme], [data-particle-theme], [data-hub], [data-theme], a[href*='/creative']"
      );
      if (themedEl) {
        const explicit =
          themedEl.getAttribute("data-laser-theme") ||
          themedEl.getAttribute("data-particle-theme") ||
          themedEl.getAttribute("data-hub") ||
          themedEl.getAttribute("data-theme");
        if (explicit && THEME_DATA[explicit as keyof typeof THEME_DATA]) {
          detectedTheme = explicit;
        } else if (themedEl.matches("a[href*='/creative']")) {
          detectedTheme = "creative";
        }
      }

      return { isInteractive, isText, detectedTheme };
    };

    const isLightTheme = () => {
      let rootAttr = "";
      if (typeof document !== "undefined") {
        rootAttr = (document.documentElement.getAttribute("data-theme") || "").toLowerCase();
        const bodyAttr = (document.body?.getAttribute("data-theme") || "").toLowerCase();
        if (
          document.documentElement.classList.contains("dark") ||
          rootAttr === "dark" ||
          rootAttr === "noir" ||
          document.body?.classList.contains("dark") ||
          bodyAttr === "dark" ||
          bodyAttr === "noir"
        ) {
          return false;
        }
        if (
          document.documentElement.classList.contains("light") ||
          rootAttr === "light" ||
          rootAttr === "purple" ||
          rootAttr === "ivory" ||
          document.body?.classList.contains("light") ||
          bodyAttr === "light" ||
          bodyAttr === "purple" ||
          bodyAttr === "ivory"
        ) {
          return true;
        }
      }
      if (typeof window !== "undefined") {
        const host = window.location.hostname.toLowerCase();
        if (
          host.includes("drjerin") ||
          host.includes("dental") ||
          host.includes("natures-intimacy") ||
          host.includes("naturesintimacy") ||
          host.includes("saif") ||
          host.includes("rafij") ||
          host.includes("kawsar") ||
          host.includes("boutique-templates")
        ) {
          return !document.documentElement.classList.contains("dark") && rootAttr !== "noir";
        }
      }
      try {
        if (typeof window !== "undefined") {
          const bg = window.getComputedStyle(document.body || document.documentElement).backgroundColor;
          if (bg && bg.startsWith("rgb")) {
            const match = bg.match(/\d+/g);
            if (match && match.length >= 3) {
              const r = parseInt(match[0], 10);
              const g = parseInt(match[1], 10);
              const b = parseInt(match[2], 10);
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              if (luminance > 0.65) return true;
            }
          }
        }
      } catch (_) {}
      return false;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isVisible = true;

      const { isInteractive, isText, detectedTheme } = checkTargetType(e.target);
      isHoveringInteractive = isInteractive;
      isHoveringText = isText;
      hoveredTheme = detectedTheme;

      const vx = prevMouseX === -1000 ? 0 : mouseX - prevMouseX;
      const vy = prevMouseY === -1000 ? 0 : mouseY - prevMouseY;
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      const speed = Math.hypot(vx, vy);

      history.push({
        x: mouseX,
        y: mouseY,
        time: performance.now(),
      });

      if (history.length > maxHistory) {
        history.shift();
      }

      const currentThemeKey = resolveThemeKey();
      const currentConfig = THEME_DATA[currentThemeKey];
      const light = isLightTheme();

      // High-speed energetic laser sparks (tight micro-photons)
      if (sparksEnabled && speed > 22 && !prefersReducedMotion && sparks.length < 24 && Math.random() < 0.6) {
        const angle = Math.atan2(vy, vx) + Math.PI + (Math.random() - 0.5) * 0.8;
        const sparkSpeed = Math.random() * 2.2 + 1.0;
        const palette = light ? currentConfig.sparkPaletteLight : currentConfig.sparkPaletteDark;
        sparks.push({
          x: mouseX,
          y: mouseY,
          vx: Math.cos(angle) * sparkSpeed,
          vy: Math.sin(angle) * sparkSpeed,
          alpha: 0.9,
          decay: 0.055 + Math.random() * 0.035,
          size: Math.random() * 1.2 + 0.6,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const currentThemeKey = resolveThemeKey();
      const currentConfig = THEME_DATA[currentThemeKey];
      const light = isLightTheme();

      // Laser pulse shockwave (compact & sleek)
      if (shockwavesEnabled) {
        waves.push({
          x: mouseX,
          y: mouseY,
          radius: 2.5,
          maxRadius: isHoveringInteractive ? (light ? 10 : 19) : (light ? 7 : 14),
          alpha: light ? 0.38 : 0.85,
          color: light ? currentConfig.glowLight : currentConfig.glowDark,
          rgb: light ? currentConfig.rgbLight : currentConfig.rgbDark,
        });
      }

      // Click burst sparks
      if (sparksEnabled && !prefersReducedMotion) {
        const count = 7;
        const palette = light ? currentConfig.sparkPaletteLight : currentConfig.sparkPaletteDark;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
          const spd = Math.random() * 2.8 + 1.2;
          sparks.push({
            x: mouseX,
            y: mouseY,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            alpha: 0.95,
            decay: 0.05 + Math.random() * 0.03,
            size: Math.random() * 1.4 + 0.7,
            color: palette[i % palette.length],
          });
        }
      }
    };

    // Mobile & Touchscreen Finger Interactions
    let touchFadeTimer: ReturnType<typeof setTimeout> | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const touch = e.touches[0];
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      prevMouseX = touch.clientX;
      prevMouseY = touch.clientY;
      isVisible = true;

      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const { isInteractive, isText, detectedTheme } = checkTargetType(target);
      isHoveringInteractive = isInteractive;
      isHoveringText = isText;
      hoveredTheme = detectedTheme;

      history.length = 0;
      history.push({
        x: mouseX,
        y: mouseY,
        time: performance.now(),
      });

      const currentThemeKey = resolveThemeKey();
      const currentConfig = THEME_DATA[currentThemeKey];
      const light = isLightTheme();

      // Tactile laser shockwave ripple under finger (compact & delicate)
      if (shockwavesEnabled) {
        waves.push({
          x: mouseX,
          y: mouseY,
          radius: 2.5,
          maxRadius: isHoveringInteractive ? (light ? 11 : 20) : (light ? 8 : 15),
          alpha: light ? 0.35 : 0.85,
          color: light ? currentConfig.glowLight : currentConfig.glowDark,
          rgb: light ? currentConfig.rgbLight : currentConfig.rgbDark,
        });
      }

      // Micro-burst photons under touch
      if (sparksEnabled && !prefersReducedMotion) {
        const count = 6;
        const palette = light ? currentConfig.sparkPaletteLight : currentConfig.sparkPaletteDark;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
          const spd = Math.random() * 2.4 + 1.2;
          sparks.push({
            x: mouseX,
            y: mouseY,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            alpha: 0.95,
            decay: 0.05 + Math.random() * 0.03,
            size: Math.random() * 1.3 + 0.7,
            color: palette[i % palette.length],
          });
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const touch = e.touches[0];
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      isVisible = true;

      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const { isInteractive, isText, detectedTheme } = checkTargetType(target);
      isHoveringInteractive = isInteractive;
      isHoveringText = isText;
      hoveredTheme = detectedTheme;

      const vx = prevMouseX === -1000 ? 0 : mouseX - prevMouseX;
      const vy = prevMouseY === -1000 ? 0 : mouseY - prevMouseY;
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      const speed = Math.hypot(vx, vy);

      history.push({
        x: mouseX,
        y: mouseY,
        time: performance.now(),
      });

      if (history.length > maxHistory) {
        history.shift();
      }

      const currentThemeKey = resolveThemeKey();
      const currentConfig = THEME_DATA[currentThemeKey];
      const light = isLightTheme();

      // Laser sparks trailing high-speed finger drag
      if (sparksEnabled && speed > 18 && !prefersReducedMotion && sparks.length < 24 && Math.random() < 0.6) {
        const angle = Math.atan2(vy, vx) + Math.PI + (Math.random() - 0.5) * 0.8;
        const sparkSpeed = Math.random() * 2.2 + 1.0;
        const palette = light ? currentConfig.sparkPaletteLight : currentConfig.sparkPaletteDark;
        sparks.push({
          x: mouseX,
          y: mouseY,
          vx: Math.cos(angle) * sparkSpeed,
          vy: Math.sin(angle) * sparkSpeed,
          alpha: 0.9,
          decay: 0.055 + Math.random() * 0.035,
          size: Math.random() * 1.2 + 0.6,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }
    };

    const onTouchEnd = () => {
      prevMouseX = -1000;
      prevMouseY = -1000;
      if (touchFadeTimer) clearTimeout(touchFadeTimer);
      touchFadeTimer = setTimeout(() => {
        if (prevMouseX === -1000) {
          isVisible = false;
        }
      }, 220);
    };

    const onTouchCancel = () => {
      prevMouseX = -1000;
      prevMouseY = -1000;
      isVisible = false;
      history.length = 0;
    };

    const onMouseLeave = () => {
      isVisible = false;
      history.length = 0;
    };

    const onMouseEnter = () => {
      isVisible = true;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchCancel, { passive: true });

    // Main 60-120fps render loop
    const render = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);

      const light = isLightTheme();
      const currentThemeKey = resolveThemeKey();
      const currentConfig = THEME_DATA[currentThemeKey];

      const laserCoreColor = light ? currentConfig.coreLight : currentConfig.coreDark;
      const laserGlowColor = light ? currentConfig.glowLight : currentConfig.glowDark;
      const laserRgbGlow = light ? currentConfig.rgbLight : currentConfig.rgbDark;
      const laserRgbSecondary = light ? currentConfig.rgbSecondaryLight : currentConfig.rgbSecondaryDark;

      // Age out stale history
      while (history.length > 0 && now - history[0].time > 160) {
        history.shift();
      }

      // Tight, crisp HUD reticle sizing
      const targetReticle = reticleEnabled && isHoveringInteractive ? 8.5 : 0;
      reticleSize += (targetReticle - reticleSize) * 0.28;
      reticleAngle += 0.024;

      // 1. Draw Continuous Laser Trail (Ultra-Sleek Ribbon Beam)
      if (ribbonEnabled && history.length > 2 && isVisible && !isHoveringText) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Luminous Ribbon Glow Layer
        ctx.shadowColor = laserGlowColor;
        ctx.shadowBlur = (light ? 3 : 5) * bloomIntensity;

        for (let i = 1; i < history.length; i++) {
          const p1 = history[i - 1];
          const p2 = history[i];
          const progress = i / history.length;
          const alpha = Math.pow(progress, 1.6) * (light ? 0.35 : 0.45);

          ctx.strokeStyle = `rgba(${laserRgbGlow}, ${alpha})`;
          ctx.lineWidth = progress * (light ? 1.6 : 2.2);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Hot Laser Filament (Crisp Thin Inner Core)
        ctx.shadowBlur = (light ? 1.5 : 2.5) * bloomIntensity;
        for (let i = 1; i < history.length; i++) {
          const p1 = history[i - 1];
          const p2 = history[i];
          const progress = i / history.length;
          const alpha = Math.pow(progress, 1.2) * (light ? 0.85 : 0.95);

          let filamentColor = `rgba(255, 255, 255, ${alpha})`;
          if (light) {
            if (currentThemeKey === "white" || currentThemeKey === "monochrome") {
              filamentColor = `rgba(0, 0, 0, ${alpha})`;
            } else if (currentThemeKey === "clinical") {
              filamentColor = `rgba(21, 128, 61, ${alpha})`;
            } else if (currentThemeKey === "botanical") {
              filamentColor = `rgba(6, 182, 212, ${alpha})`;
            } else if (currentThemeKey === "motion") {
              filamentColor = `rgba(0, 179, 119, ${alpha})`;
            } else {
              filamentColor = `rgba(${laserRgbSecondary}, ${alpha})`;
            }
          }

          ctx.strokeStyle = filamentColor;
          ctx.lineWidth = Math.max(0.6, progress * (light ? 1.0 : 1.3));

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 2. Draw Shockwaves (Tight crisp ripples with glowing aura)
      if (shockwavesEnabled) {
        for (let i = waves.length - 1; i >= 0; i--) {
          const w = waves[i];
          w.radius += (w.maxRadius - w.radius) * 0.24 + 0.4;
          w.alpha *= 0.86;

          if (w.alpha < 0.02 || w.radius >= w.maxRadius - 0.5) {
            waves.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.strokeStyle = `rgba(${w.rgb || laserRgbGlow}, ${w.alpha})`;
          ctx.lineWidth = 1.0;
          ctx.shadowColor = w.color || laserGlowColor;
          ctx.shadowBlur = (light ? 4 : 6) * bloomIntensity;
          ctx.beginPath();
          ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 3. Draw Micro-Sparks with Photonic Glow
      if (sparksEnabled) {
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.vx *= 0.92;
          s.vy *= 0.92;
          s.alpha -= s.decay;

          if (s.alpha <= 0) {
            sparks.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.fillStyle = s.color;
          ctx.globalAlpha = Math.max(0, s.alpha);
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 3 * bloomIntensity;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 4. Draw Core Laser Dot & Micro Optical Glow (Needle-sharp, sleek & compact)
      if (isVisible && mouseX > -500 && mouseY > -500 && !isHoveringText) {
        ctx.save();

        const isHover = isHoveringInteractive;

        // A. Outer Optical Bloom Halo (Calibrated compact radius: 5.5px-6.5px normal, 7.5px-8.5px hover)
        const glowRadius = isHover ? (light ? 7.5 : 8.5) : (light ? 5.5 : 6.5);
        const gradient = ctx.createRadialGradient(
          mouseX,
          mouseY,
          0,
          mouseX,
          mouseY,
          glowRadius
        );
        gradient.addColorStop(0, `rgba(${laserRgbGlow}, ${light ? 0.42 : 0.55})`);
        gradient.addColorStop(0.5, `rgba(${laserRgbSecondary}, ${light ? 0.16 : 0.24})`);
        gradient.addColorStop(1, `rgba(${laserRgbGlow}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // B. Inner Crisp Laser Corona (Crisp luminous core glow)
        const innerRadius = isHover ? (light ? 4.2 : 5.0) : (light ? 3.2 : 3.8);
        const innerGrad = ctx.createRadialGradient(
          mouseX,
          mouseY,
          0,
          mouseX,
          mouseY,
          innerRadius
        );
        innerGrad.addColorStop(0, `rgba(${laserRgbSecondary}, ${light ? 0.55 : 0.68})`);
        innerGrad.addColorStop(0.6, `rgba(${laserRgbGlow}, ${light ? 0.22 : 0.32})`);
        innerGrad.addColorStop(1, `rgba(${laserRgbGlow}, 0)`);

        ctx.fillStyle = innerGrad;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, innerRadius, 0, Math.PI * 2);
        ctx.fill();

        // C. Precision Laser Focal Dot (Needle-sharp unified: 2.0px normal, 2.6px hover)
        ctx.shadowColor = laserGlowColor;
        ctx.shadowBlur = (isHover ? (light ? 5.5 : 7.5) : (light ? 4.0 : 5.5)) * bloomIntensity;
        ctx.fillStyle = laserCoreColor;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, isHover ? 2.6 : 2.0, 0, Math.PI * 2);
        ctx.fill();

        // Compact Precision Laser Targeting Reticle HUD
        if (reticleEnabled && reticleSize > 0.8) {
          ctx.save();
          ctx.translate(mouseX, mouseY);
          ctx.rotate(reticleAngle);

          const r = reticleSize;
          const cornerLen = 2.4;
          ctx.strokeStyle = `rgba(${laserRgbGlow}, 0.85)`;
          ctx.lineWidth = 0.9;
          ctx.shadowColor = laserGlowColor;
          ctx.shadowBlur = 2.5 * bloomIntensity;

          // 4 Precision Micro HUD Corners: [ ]
          // Top-Left
          ctx.beginPath();
          ctx.moveTo(-r, -r + cornerLen);
          ctx.lineTo(-r, -r);
          ctx.lineTo(-r + cornerLen, -r);
          ctx.stroke();

          // Top-Right
          ctx.beginPath();
          ctx.moveTo(r - cornerLen, -r);
          ctx.lineTo(r, -r);
          ctx.lineTo(r, -r + cornerLen);
          ctx.stroke();

          // Bottom-Right
          ctx.beginPath();
          ctx.moveTo(r, r - cornerLen);
          ctx.lineTo(r, r);
          ctx.lineTo(r - cornerLen, r);
          ctx.stroke();

          // Bottom-Left
          ctx.beginPath();
          ctx.moveTo(-r + cornerLen, r);
          ctx.lineTo(-r, r);
          ctx.lineTo(-r, r - cornerLen);
          ctx.stroke();

          // Precision center tick crosshairs (micro 1.2px)
          const tick = 1.2;
          ctx.beginPath();
          ctx.moveTo(-r - 1.2, 0);
          ctx.lineTo(-r + tick, 0);
          ctx.moveTo(r - tick, 0);
          ctx.lineTo(r + 1.2, 0);
          ctx.moveTo(0, -r - 1.2);
          ctx.lineTo(0, -r + tick);
          ctx.moveTo(0, r - tick);
          ctx.lineTo(0, r + 1.2);
          ctx.stroke();

          ctx.restore();
        }

        ctx.restore();
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove("laser-cursor-active", "zenvq-laser-active");
      if (touchFadeTimer) clearTimeout(touchFadeTimer);
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [
    theme,
    maxHistory,
    sparksEnabled,
    shockwavesEnabled,
    reticleEnabled,
    ribbonEnabled,
    bloomIntensity,
  ]);

  return (
    <canvas
      ref={canvasRef}
      id="zenvq-laser-canvas"
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 block ${className}`}
      style={{
        zIndex,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
