/**
 * ZenVQ Precision Laser Cursor Engine v2.3
 * Silicon-Valley Grade Interactive Laser Trail, Micro-Photons & Micro Reticle HUD
 * 
 * Rules:
 * - 0 external dependencies (runs anywhere: React, Next.js, Vue, vanilla HTML)
 * - Needle-sharp micro optics (focal dot 1.3px - 1.8px, halo 4.0px - 6.5px)
 * - Dark theme: Pure White laser on dark background sites
 * - Light theme: Pure Black laser on light backgrounds
 * - Contextual theme preservation: Agency Engineering (Cyan) and Creative (Purple) preserved
 * - Single-instance canvas protection
 * - 60-120fps requestAnimationFrame with automatic touch fallback
 */
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZenVQLaser = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  const THEMES = {
    white: {
      name: "Pure White Laser",
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
      name: "Architectural Monochrome",
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
      name: "Engineering Mint",
      coreDark: "#6FFFE9",
      coreLight: "#0F766E",
      glowDark: "#6FFFE9",
      glowLight: "rgba(15, 118, 110, 0.9)",
      secondaryDark: "#A5FFEF",
      secondaryLight: "rgba(13, 148, 136, 0.7)",
      rgbDark: "111, 255, 233",
      rgbLight: "15, 118, 110",
      rgbSecondaryDark: "165, 255, 239",
      rgbSecondaryLight: "13, 148, 136",
      sparkPaletteDark: ["#6FFFE9", "#A5FFEF", "#00F2FE", "#5EEAD4"],
      sparkPaletteLight: ["#0F766E", "#0D9488", "#115E59"]
    },
    creative: {
      name: "Creative Purple",
      coreDark: "#C084FC",
      coreLight: "#7C3AED",
      glowDark: "#A855F7",
      glowLight: "rgba(124, 58, 237, 0.9)",
      secondaryDark: "#C084FC",
      secondaryLight: "rgba(168, 85, 247, 0.7)",
      rgbDark: "168, 85, 247",
      rgbLight: "124, 58, 237",
      rgbSecondaryDark: "192, 132, 252",
      rgbSecondaryLight: "168, 85, 247",
      sparkPaletteDark: ["#C084FC", "#E9D5FF", "#A855F7"],
      sparkPaletteLight: ["#7C3AED", "#A855F7", "#6D28D9"]
    },
    luxury: {
      name: "Luxury Gold",
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
      name: "Cyber Neon",
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
      sparkPaletteDark: ["#EC4899", "#00E599", "#FFFFFF"],
      sparkPaletteLight: ["#BE185D", "#9D174D", "#831843"]
    },
    clinical: {
      name: "Clinical Dental Mint",
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
      name: "Botanical Cyan and White",
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
      name: "Saif Kinetic Motion",
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

  const DEFAULT_OPTIONS = {
    theme: "auto",
    maxHistory: 20,
    sparksEnabled: true,
    shockwavesEnabled: true,
    reticleEnabled: true,
    ribbonEnabled: true,
    bloomIntensity: 0.85,
    zIndex: 999999,
    autoStyleInjection: true,
    interactiveSelector: 'a, button, select, [role="button"], [data-interactive], .cursor-pointer, [tabindex="0"]',
    textSelector: 'input, textarea, [contenteditable="true"]',
    disabledOnTouch: false,
    reducedMotionRespect: true
  };

  let state = {
    initialized: false,
    options: { ...DEFAULT_OPTIONS },
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    dpr: 1,
    history: [],
    sparks: [],
    waves: [],
    mouseX: -1000,
    mouseY: -1000,
    prevMouseX: -1000,
    prevMouseY: -1000,
    isVisible: false,
    isHoveringInteractive: false,
    isHoveringText: false,
    animFrameId: null,
    reticleSize: 0,
    reticleAngle: 0,
    hoveredTheme: "auto",
    styleEl: null
  };

  function injectStyles() {
    if (typeof document === "undefined" || state.styleEl) return;
    const css = `
      @media (hover: hover) and (pointer: fine) {
        html.zenvq-laser-active,
        html.zenvq-laser-active body,
        html.zenvq-laser-active a,
        html.zenvq-laser-active button,
        html.zenvq-laser-active [role="button"],
        html.zenvq-laser-active [data-interactive],
        html.zenvq-laser-active .cursor-pointer {
          cursor: none !important;
        }
        html.zenvq-laser-active input,
        html.zenvq-laser-active textarea,
        html.zenvq-laser-active [contenteditable="true"] {
          cursor: text !important;
        }
      }
      .zenvq-laser-canvas {
        pointer-events: none !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        display: block !important;
      }
    `;
    const style = document.createElement("style");
    style.id = "zenvq-laser-styles";
    style.textContent = css;
    document.head.appendChild(style);
    state.styleEl = style;
  }

  function removeStyles() {
    if (state.styleEl && state.styleEl.parentNode) {
      state.styleEl.parentNode.removeChild(state.styleEl);
      state.styleEl = null;
    }
  }

  function isTouchDevice() {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    );
  }

  function isReducedMotion() {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function isLightTheme() {
    if (typeof document === "undefined") return false;
    const rootAttr = (document.documentElement.getAttribute("data-theme") || "").toLowerCase();
    const bodyAttr = (document.body && document.body.getAttribute("data-theme") ? document.body.getAttribute("data-theme") : "").toLowerCase();
    if (
      document.documentElement.classList.contains("dark") ||
      rootAttr === "dark" ||
      rootAttr === "noir" ||
      (document.body && document.body.classList.contains("dark")) ||
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
      (document.body && document.body.classList.contains("light")) ||
      bodyAttr === "light" ||
      bodyAttr === "purple" ||
      bodyAttr === "ivory"
    ) {
      return true;
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
  }

  function isCreativeRoute() {
    if (typeof window === "undefined") return false;
    const p = window.location.pathname.toLowerCase();
    const s = window.location.search.toLowerCase();
    return p.includes("/creative") || s.includes("tab=creative");
  }

  function isAgencySite() {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname.toLowerCase();
    if (host.includes("agency.zenvq.com") || host.includes("zenvq-agency")) return true;
    if (typeof document !== "undefined") {
      if (document.body && document.body.getAttribute("data-site") === "agency") return true;
      if (document.querySelector('[data-hub="engineering"], [data-particle-theme="engineering"], [data-theme-route="creative"]')) return true;
      if (document.title && document.title.toLowerCase().includes("agency")) return true;
    }
    return false;
  }

  function isClinicalSite() {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname.toLowerCase();
    if (host.includes("drjerin") || host.includes("dental")) return true;
    if (typeof document !== "undefined") {
      if (document.body && (document.body.getAttribute("data-site") === "clinical" || document.body.getAttribute("data-site") === "dental")) return true;
      if (document.title && (document.title.toLowerCase().includes("jarin") || document.title.toLowerCase().includes("dental"))) return true;
    }
    return false;
  }

  function isNaturesIntimacySite() {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname.toLowerCase();
    if (host.includes("natures-intimacy") || host.includes("naturesintimacy")) return true;
    if (typeof document !== "undefined") {
      if (document.body && document.body.getAttribute("data-site") === "natures-intimacy") return true;
      if (document.title && (document.title.toLowerCase().includes("nature's intimacy") || document.title.toLowerCase().includes("natures intimacy"))) return true;
    }
    return false;
  }

  function isSaifSite() {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname.toLowerCase();
    if (host.includes("saif")) return true;
    if (typeof document !== "undefined") {
      if (document.body && document.body.getAttribute("data-site") === "saif") return true;
      if (document.title && document.title.toLowerCase().includes("saif")) return true;
    }
    return false;
  }

  function isSuggestsSite() {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname.toLowerCase();
    if (host.includes("suggests")) return true;
    if (typeof document !== "undefined") {
      if (document.body && document.body.getAttribute("data-site") === "suggests") return true;
      if (document.title && document.title.toLowerCase().includes("suggests")) return true;
    }
    return false;
  }

  function isBoutiqueSite() {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname.toLowerCase();
    if (host.includes("boutique")) return true;
    if (typeof document !== "undefined") {
      if (document.body && document.body.getAttribute("data-site") === "boutique") return true;
      if (document.title && document.title.toLowerCase().includes("jennah")) return true;
    }
    return false;
  }

  function resolveCurrentTheme() {
    // 1. Strict Creative Route Guard
    if (isCreativeRoute()) {
      return "creative";
    }

    // 2. Contextual element hover
    if (state.hoveredTheme && state.hoveredTheme !== "auto" && THEMES[state.hoveredTheme]) {
      return state.hoveredTheme;
    }

    // 3. Explicit theme option from user configuration (if not "auto")
    if (state.options.theme && state.options.theme !== "auto" && THEMES[state.options.theme]) {
      return state.options.theme;
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

    // 10. URL Route Presets
    if (typeof window !== "undefined") {
      const p = window.location.pathname.toLowerCase();
      const s = window.location.search.toLowerCase();
      if (p.includes("/luxury") || s.includes("theme=luxury")) return "luxury";
      if (p.includes("/cyber") || s.includes("theme=cyberpunk")) return "cyberpunk";
    }

    // 11. Universal Default: White on dark canvas and Black on light canvas
    return "white";
  }

  function checkTargetType(target) {
    if (!target || !(target instanceof Element)) {
      return { isInteractive: false, isText: false, theme: "auto" };
    }

    const isText = Boolean(target.closest(state.options.textSelector));
    const isInteractive = Boolean(target.closest(state.options.interactiveSelector));

    if (isCreativeRoute()) {
      return { isInteractive, isText, theme: "creative" };
    }

    let theme = "auto";
    const themedEl = target.closest(
      "[data-laser-theme], [data-particle-theme], [data-hub], [data-theme], a[href*='/creative']"
    );
    if (themedEl) {
      const explicit =
        themedEl.getAttribute("data-laser-theme") ||
        themedEl.getAttribute("data-particle-theme") ||
        themedEl.getAttribute("data-hub") ||
        themedEl.getAttribute("data-theme");
      if (explicit && THEMES[explicit]) {
        theme = explicit;
      } else if (themedEl.matches("a[href*='/creative']")) {
        theme = "creative";
      }
    }

    return { isInteractive, isText, theme };
  }

  function resizeCanvas() {
    if (!state.canvas) return;
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.canvas.width = state.width * state.dpr;
    state.canvas.height = state.height * state.dpr;
    if (state.ctx) {
      state.ctx.scale(state.dpr, state.dpr);
    }
  }

  function onMouseMove(e) {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    state.isVisible = true;

    const { isInteractive, isText, theme } = checkTargetType(e.target);
    state.isHoveringInteractive = isInteractive;
    state.isHoveringText = isText;
    state.hoveredTheme = theme;

    const vx = state.prevMouseX === -1000 ? 0 : state.mouseX - state.prevMouseX;
    const vy = state.prevMouseY === -1000 ? 0 : state.mouseY - state.prevMouseY;
    state.prevMouseX = state.mouseX;
    state.prevMouseY = state.mouseY;

    const speed = Math.hypot(vx, vy);

    state.history.push({
      x: state.mouseX,
      y: state.mouseY,
      time: performance.now()
    });

    if (state.history.length > state.options.maxHistory) {
      state.history.shift();
    }

    const activeThemeKey = resolveCurrentTheme();
    const themeConfig = THEMES[activeThemeKey] || THEMES.white;
    const light = isLightTheme();

    // High-speed energetic laser sparks (compact micro-photons)
    if (
      state.options.sparksEnabled &&
      speed > 22 &&
      !isReducedMotion() &&
      state.sparks.length < 24 &&
      Math.random() < 0.6
    ) {
      const angle = Math.atan2(vy, vx) + Math.PI + (Math.random() - 0.5) * 0.8;
      const sparkSpeed = Math.random() * 2.2 + 1.0;
      const palette = light
        ? (themeConfig.sparkPaletteLight || themeConfig.sparkPaletteDark)
        : (themeConfig.sparkPaletteDark || themeConfig.sparkPaletteLight);
      state.sparks.push({
        x: state.mouseX,
        y: state.mouseY,
        vx: Math.cos(angle) * sparkSpeed,
        vy: Math.sin(angle) * sparkSpeed,
        alpha: 0.9,
        decay: 0.055 + Math.random() * 0.035,
        size: Math.random() * 1.2 + 0.6,
        color: palette[Math.floor(Math.random() * palette.length)]
      });
    }
  }

  function onMouseDown(e) {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;

    const activeThemeKey = resolveCurrentTheme();
    const themeConfig = THEMES[activeThemeKey] || THEMES.white;
    const light = isLightTheme();

    if (state.options.shockwavesEnabled) {
      state.waves.push({
        x: state.mouseX,
        y: state.mouseY,
        radius: 2.5,
        maxRadius: state.isHoveringInteractive ? (light ? 10 : 19) : (light ? 7 : 14),
        alpha: light ? 0.38 : 0.85,
        color: light ? themeConfig.glowLight : themeConfig.glowDark,
        rgb: light ? themeConfig.rgbLight : themeConfig.rgbDark
      });
    }

    if (state.options.sparksEnabled && !isReducedMotion()) {
      const count = 7;
      const palette = light
        ? (themeConfig.sparkPaletteLight || themeConfig.sparkPaletteDark)
        : (themeConfig.sparkPaletteDark || themeConfig.sparkPaletteLight);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const spd = Math.random() * 2.8 + 1.2;
        state.sparks.push({
          x: state.mouseX,
          y: state.mouseY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          alpha: 0.95,
          decay: 0.05 + Math.random() * 0.03,
          size: Math.random() * 1.4 + 0.7,
          color: palette[i % palette.length]
        });
      }
    }
  }

  function onMouseLeave() {
    state.isVisible = false;
    state.history.length = 0;
  }

  function onMouseEnter() {
    state.isVisible = true;
  }

  // Mobile & Touchscreen Finger Interactions
  let touchFadeTimer = null;

  function onTouchStart(e) {
    if (!e.touches || !e.touches[0]) return;
    const touch = e.touches[0];
    state.mouseX = touch.clientX;
    state.mouseY = touch.clientY;
    state.prevMouseX = touch.clientX;
    state.prevMouseY = touch.clientY;
    state.isVisible = true;

    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const { isInteractive, isText, theme } = checkTargetType(target);
    state.isHoveringInteractive = isInteractive;
    state.isHoveringText = isText;
    state.hoveredTheme = theme;

    state.history.length = 0;
    state.history.push({
      x: state.mouseX,
      y: state.mouseY,
      time: performance.now()
    });

    const activeThemeKey = resolveCurrentTheme();
    const themeConfig = THEMES[activeThemeKey] || THEMES.white;
    const light = isLightTheme();

    if (state.options.shockwavesEnabled) {
      state.waves.push({
        x: state.mouseX,
        y: state.mouseY,
        radius: 2.5,
        maxRadius: isInteractive ? (light ? 11 : 20) : (light ? 8 : 15),
        alpha: light ? 0.35 : 0.85,
        color: light ? themeConfig.glowLight : themeConfig.glowDark,
        rgb: light ? themeConfig.rgbLight : themeConfig.rgbDark
      });
    }

    if (state.options.sparksEnabled && !isReducedMotion()) {
      const count = 6;
      const palette = light
        ? (themeConfig.sparkPaletteLight || themeConfig.sparkPaletteDark)
        : (themeConfig.sparkPaletteDark || themeConfig.sparkPaletteLight);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const spd = Math.random() * 2.4 + 1.2;
        state.sparks.push({
          x: state.mouseX,
          y: state.mouseY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          alpha: 0.95,
          decay: 0.05 + Math.random() * 0.03,
          size: Math.random() * 1.3 + 0.7,
          color: palette[i % palette.length]
        });
      }
    }
  }

  function onTouchMove(e) {
    if (!e.touches || !e.touches[0]) return;
    const touch = e.touches[0];
    state.mouseX = touch.clientX;
    state.mouseY = touch.clientY;
    state.isVisible = true;

    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const { isInteractive, isText, theme } = checkTargetType(target);
    state.isHoveringInteractive = isInteractive;
    state.isHoveringText = isText;
    state.hoveredTheme = theme;

    const vx = state.prevMouseX === -1000 ? 0 : state.mouseX - state.prevMouseX;
    const vy = state.prevMouseY === -1000 ? 0 : state.mouseY - state.prevMouseY;
    state.prevMouseX = state.mouseX;
    state.prevMouseY = state.mouseY;

    const speed = Math.hypot(vx, vy);

    state.history.push({
      x: state.mouseX,
      y: state.mouseY,
      time: performance.now()
    });

    if (state.history.length > state.options.maxHistory) {
      state.history.shift();
    }

    const activeThemeKey = resolveCurrentTheme();
    const themeConfig = THEMES[activeThemeKey] || THEMES.white;
    const light = isLightTheme();

    if (
      state.options.sparksEnabled &&
      speed > 18 &&
      !isReducedMotion() &&
      state.sparks.length < 24 &&
      Math.random() < 0.6
    ) {
      const palette = light
        ? (themeConfig.sparkPaletteLight || themeConfig.sparkPaletteDark)
        : (themeConfig.sparkPaletteDark || themeConfig.sparkPaletteLight);
      const angle = Math.atan2(vy, vx) + Math.PI + (Math.random() - 0.5) * 0.8;
      const sparkSpeed = Math.random() * 2.2 + 1.0;
      state.sparks.push({
        x: state.mouseX,
        y: state.mouseY,
        vx: Math.cos(angle) * sparkSpeed,
        vy: Math.sin(angle) * sparkSpeed,
        alpha: 0.9,
        decay: 0.055 + Math.random() * 0.035,
        size: Math.random() * 1.2 + 0.6,
        color: palette[Math.floor(Math.random() * palette.length)]
      });
    }
  }

  function onTouchEnd() {
    state.prevMouseX = -1000;
    state.prevMouseY = -1000;
    if (touchFadeTimer) clearTimeout(touchFadeTimer);
    touchFadeTimer = setTimeout(() => {
      if (state.prevMouseX === -1000) {
        state.isVisible = false;
      }
    }, 220);
  }

  function onTouchCancel() {
    state.prevMouseX = -1000;
    state.prevMouseY = -1000;
    state.isVisible = false;
    state.history.length = 0;
  }

  function render() {
    const ctx = state.ctx;
    if (!ctx) return;

    const now = performance.now();
    ctx.clearRect(0, 0, state.width, state.height);

    const light = isLightTheme();
    const activeThemeKey = resolveCurrentTheme();
    const themeConfig = THEMES[activeThemeKey] || THEMES.white;

    const laserCoreColor = light ? themeConfig.coreLight : themeConfig.coreDark;
    const laserGlowColor = light ? themeConfig.glowLight : themeConfig.glowDark;
    const laserRgbGlow = light ? themeConfig.rgbLight : themeConfig.rgbDark;
    const laserRgbSecondary = light ? themeConfig.rgbSecondaryLight : themeConfig.rgbSecondaryDark;

    // Prune stale trail points
    while (state.history.length > 0 && now - state.history[0].time > 160) {
      state.history.shift();
    }

    // Tight, crisp HUD reticle sizing
    const targetReticle = state.options.reticleEnabled && state.isHoveringInteractive ? 8.5 : 0;
    state.reticleSize += (targetReticle - state.reticleSize) * 0.28;
    state.reticleAngle += 0.024;

    // 1. Draw Continuous Laser Trail (Ultra-Sleek Ribbon Beam)
    if (state.options.ribbonEnabled && state.history.length > 2 && state.isVisible && !state.isHoveringText) {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Luminous Ribbon Glow Layer
      ctx.shadowColor = laserGlowColor;
      ctx.shadowBlur = (light ? 3 : 5) * state.options.bloomIntensity;

      for (let i = 1; i < state.history.length; i++) {
        const p1 = state.history[i - 1];
        const p2 = state.history[i];
        const progress = i / state.history.length;
        const alpha = Math.pow(progress, 1.6) * (light ? 0.35 : 0.45);

        ctx.strokeStyle = `rgba(${laserRgbGlow}, ${alpha})`;
        ctx.lineWidth = progress * (light ? 1.6 : 2.2);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Hot Laser Filament (Crisp Thin Inner Core)
      ctx.shadowBlur = (light ? 1.5 : 2.5) * state.options.bloomIntensity;
      for (let i = 1; i < state.history.length; i++) {
        const p1 = state.history[i - 1];
        const p2 = state.history[i];
        const progress = i / state.history.length;
        const alpha = Math.pow(progress, 1.2) * (light ? 0.85 : 0.95);

        let filamentColor = `rgba(255, 255, 255, ${alpha})`;
        if (light) {
          if (activeThemeKey === "white" || activeThemeKey === "monochrome") {
            filamentColor = `rgba(0, 0, 0, ${alpha})`;
          } else if (activeThemeKey === "clinical") {
            filamentColor = `rgba(21, 128, 61, ${alpha})`;
          } else if (activeThemeKey === "botanical") {
            filamentColor = `rgba(6, 182, 212, ${alpha})`;
          } else if (activeThemeKey === "motion") {
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
    if (state.options.shockwavesEnabled) {
      for (let i = state.waves.length - 1; i >= 0; i--) {
        const w = state.waves[i];
        w.radius += (w.maxRadius - w.radius) * 0.24 + 0.4;
        w.alpha *= 0.86;

        if (w.alpha < 0.02 || w.radius >= w.maxRadius - 0.5) {
          state.waves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = `rgba(${w.rgb || laserRgbGlow}, ${w.alpha})`;
        ctx.lineWidth = 1.0;
        ctx.shadowColor = w.color || laserGlowColor;
        ctx.shadowBlur = (light ? 4 : 6) * state.options.bloomIntensity;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 3. Draw Micro-Sparks with Photonic Glow
    if (state.options.sparksEnabled) {
      for (let i = state.sparks.length - 1; i >= 0; i--) {
        const s = state.sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy *= 0.92;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          state.sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 3 * state.options.bloomIntensity;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 4. Draw Core Laser Dot & Micro Optical Glow (Needle-sharp, sleek & compact)
    if (state.isVisible && state.mouseX > -500 && state.mouseY > -500 && !state.isHoveringText) {
      ctx.save();

      const isHover = state.isHoveringInteractive;

      // A. Outer Optical Bloom Halo (Calibrated compact radius: 5.5px-6.5px normal, 7.5px-8.5px hover)
      const glowRadius = isHover ? (light ? 7.5 : 8.5) : (light ? 5.5 : 6.5);
      const gradient = ctx.createRadialGradient(
        state.mouseX,
        state.mouseY,
        0,
        state.mouseX,
        state.mouseY,
        glowRadius
      );
      gradient.addColorStop(0, `rgba(${laserRgbGlow}, ${light ? 0.42 : 0.55})`);
      gradient.addColorStop(0.5, `rgba(${laserRgbSecondary}, ${light ? 0.16 : 0.24})`);
      gradient.addColorStop(1, `rgba(${laserRgbGlow}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(state.mouseX, state.mouseY, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // B. Inner Crisp Laser Corona (Crisp luminous core glow)
      const innerRadius = isHover ? (light ? 4.2 : 5.0) : (light ? 3.2 : 3.8);
      const innerGrad = ctx.createRadialGradient(
        state.mouseX,
        state.mouseY,
        0,
        state.mouseX,
        state.mouseY,
        innerRadius
      );
      innerGrad.addColorStop(0, `rgba(${laserRgbSecondary}, ${light ? 0.55 : 0.68})`);
      innerGrad.addColorStop(0.6, `rgba(${laserRgbGlow}, ${light ? 0.22 : 0.32})`);
      innerGrad.addColorStop(1, `rgba(${laserRgbGlow}, 0)`);

      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(state.mouseX, state.mouseY, innerRadius, 0, Math.PI * 2);
      ctx.fill();

      // C. Precision Laser Focal Dot (Needle-sharp unified: 2.0px normal, 2.6px hover)
      ctx.shadowColor = laserGlowColor;
      ctx.shadowBlur = (isHover ? (light ? 5.5 : 7.5) : (light ? 4.0 : 5.5)) * state.options.bloomIntensity;
      ctx.fillStyle = laserCoreColor;
      ctx.beginPath();
      ctx.arc(state.mouseX, state.mouseY, isHover ? 2.6 : 2.0, 0, Math.PI * 2);
      ctx.fill();

      // Compact Precision Laser Targeting Reticle HUD
      if (state.options.reticleEnabled && state.reticleSize > 0.8) {
        ctx.save();
        ctx.translate(state.mouseX, state.mouseY);
        ctx.rotate(state.reticleAngle);

        const r = state.reticleSize;
        const cornerLen = 2.4;
        ctx.strokeStyle = `rgba(${laserRgbGlow}, 0.85)`;
        ctx.lineWidth = 0.9;
        ctx.shadowColor = laserGlowColor;
        ctx.shadowBlur = 2.5 * state.options.bloomIntensity;

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

    state.animFrameId = requestAnimationFrame(render);
  }

  // Public API Object
  const ZenVQLaser = {
    themes: THEMES,
    init: function (userOptions) {
      if (typeof window === "undefined") return;

      // Single-instance protection: prevent duplicate canvas creation
      if (state.initialized) {
        this.configure(userOptions);
        return;
      }
      if (document.getElementById("zenvq-laser-canvas")) {
        return;
      }

      state.options = { ...DEFAULT_OPTIONS, ...userOptions };

      if (state.options.autoStyleInjection) {
        injectStyles();
      }

      // Respect reduced motion if configured
      if (state.options.reducedMotionRespect && isReducedMotion()) {
        state.options.sparksEnabled = false;
        state.options.shockwavesEnabled = false;
      }

      const canvas = document.createElement("canvas");
      canvas.id = "zenvq-laser-canvas";
      canvas.className = "zenvq-laser-canvas";
      canvas.setAttribute("aria-hidden", "true");
      canvas.style.zIndex = String(state.options.zIndex);

      document.body.appendChild(canvas);
      state.canvas = canvas;
      state.ctx = canvas.getContext("2d", { alpha: true });

      resizeCanvas();

      window.addEventListener("resize", resizeCanvas, { passive: true });
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mousedown", onMouseDown, { passive: true });
      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("mouseenter", onMouseEnter);

      // Mobile Touch Listeners
      if (!state.options.disabledOnTouch) {
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        window.addEventListener("touchcancel", onTouchCancel, { passive: true });
      }

      document.documentElement.classList.add("zenvq-laser-active", "laser-cursor-active");

      state.initialized = true;
      state.animFrameId = requestAnimationFrame(render);
    },

    destroy: function () {
      if (!state.initialized) return;

      document.documentElement.classList.remove("zenvq-laser-active", "laser-cursor-active");

      if (state.animFrameId) {
        cancelAnimationFrame(state.animFrameId);
        state.animFrameId = null;
      }

      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchCancel);

      if (state.canvas && state.canvas.parentNode) {
        state.canvas.parentNode.removeChild(state.canvas);
      }
      state.canvas = null;
      state.ctx = null;
      state.history = [];
      state.sparks = [];
      state.waves = [];

      removeStyles();
      state.initialized = false;
    },

    setTheme: function (themeName) {
      if (themeName && (THEMES[themeName] || themeName === "auto")) {
        state.options.theme = themeName;
      }
    },

    configure: function (newOptions) {
      if (!newOptions) return;
      state.options = { ...state.options, ...newOptions };
      if (state.canvas && newOptions.zIndex !== undefined) {
        state.canvas.style.zIndex = String(newOptions.zIndex);
      }
    },

    pulse: function (x, y, maxRadius) {
      if (!state.options.shockwavesEnabled) return;
      const px = x !== undefined ? x : state.mouseX;
      const py = y !== undefined ? y : state.mouseY;
      const light = isLightTheme();
      const activeThemeKey = resolveCurrentTheme();
      const themeConfig = THEMES[activeThemeKey] || THEMES.white;

      state.waves.push({
        x: px,
        y: py,
        radius: 2.5,
        maxRadius: maxRadius || 20,
        alpha: 0.85,
        color: light ? themeConfig.glowLight : themeConfig.glowDark,
        rgb: light ? themeConfig.rgbLight : themeConfig.rgbDark
      });
    },

    burst: function (x, y, count) {
      if (!state.options.sparksEnabled) return;
      const px = x !== undefined ? x : state.mouseX;
      const py = y !== undefined ? y : state.mouseY;
      const burstCount = count || 7;
      const activeThemeKey = resolveCurrentTheme();
      const themeConfig = THEMES[activeThemeKey] || THEMES.white;
      const light = isLightTheme();
      const palette = light
        ? (themeConfig.sparkPaletteLight || themeConfig.sparkPaletteDark)
        : (themeConfig.sparkPaletteDark || themeConfig.sparkPaletteLight);

      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const spd = Math.random() * 2.8 + 1.2;
        state.sparks.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          alpha: 1,
          decay: 0.045 + Math.random() * 0.025,
          size: Math.random() * 1.4 + 0.7,
          color: palette[i % palette.length]
        });
      }
    },

    getState: function () {
      return {
        initialized: state.initialized,
        activeTheme: resolveCurrentTheme(),
        themeOptions: Object.keys(THEMES),
        options: { ...state.options },
        coordinates: { x: state.mouseX, y: state.mouseY }
      };
    }
  };

  // Auto-initialize when loaded with data-auto-laser="true" or query params
  if (typeof document !== "undefined") {
    const runAutoInit = () => {
      const scriptTag =
        document.currentScript ||
        document.querySelector("script[src*='zenvq-laser'], script[src*='laser.js']");

      if (scriptTag) {
        const auto = scriptTag.getAttribute("data-auto-laser");
        const theme = scriptTag.getAttribute("data-theme") || "auto";
        const sparks = scriptTag.getAttribute("data-sparks");
        const ribbon = scriptTag.getAttribute("data-ribbon");
        const reticle = scriptTag.getAttribute("data-reticle");

        if (auto === "true" || auto === "" || scriptTag.hasAttribute("data-auto-laser")) {
          ZenVQLaser.init({
            theme: theme,
            sparksEnabled: sparks !== "false",
            ribbonEnabled: ribbon !== "false",
            reticleEnabled: reticle !== "false"
          });
        }
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", runAutoInit);
    } else {
      runAutoInit();
    }
  }

  return ZenVQLaser;
});
