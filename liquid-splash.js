// Liquid WebGL background for the welcome splash (no React).
// Loads the liquid1 background module dynamically via CDN ESM import.

const LIQUID_CANVAS_ID = "liquid-canvas";

// Prefer using the same cover image as your hero section (`.flex { background-image: ... }`)
// so the splash and the page look consistent.
// Fallback is same-origin to avoid WebGL texture CORS issues.
const FALLBACK_BG_IMAGE = "res/BG.jpeg";

function getFlexCoverImageUrl() {
  try {
    const flex = document.querySelector(".flex");
    if (!flex) return null;
    const bg = window.getComputedStyle(flex).backgroundImage; // e.g. url("res/BG.jpeg")
    if (!bg || bg === "none") return null;
    const m = bg.match(/url\((['"]?)(.*?)\1\)/i);
    return m && m[2] ? m[2] : null;
  } catch (_) {
    return null;
  }
}

function safeDispose(app) {
  try {
    if (app && typeof app.dispose === "function") app.dispose();
  } catch (_) {
    // ignore
  }
}

async function initLiquidSplash() {
  const canvas = document.getElementById(LIQUID_CANVAS_ID);
  if (!canvas) return;

  // Avoid double-inits
  if (window.__liquidApp) return;

  try {
    const mod = await import(
      "https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js"
    );

    const LiquidBackground = mod.default ?? mod;
    const app = LiquidBackground(canvas);

    // Image + material tuning (similar to the snippet you provided)
    const imageUrl = getFlexCoverImageUrl() || FALLBACK_BG_IMAGE;
    app.loadImage(imageUrl);
    if (app.liquidPlane?.material) {
      app.liquidPlane.material.metalness = 0.75;
      app.liquidPlane.material.roughness = 0.25;
    }
    if (app.liquidPlane?.uniforms?.displacementScale) {
      app.liquidPlane.uniforms.displacementScale.value = 5;
    }
    if (typeof app.setRain === "function") {
      app.setRain(false);
    }

    window.__liquidApp = app;

    // Expose cleanup so `welcome-splash.js` can dispose before removing the splash DOM.
    window.disposeLiquidSplash = function () {
      safeDispose(window.__liquidApp);
      delete window.__liquidApp;
    };
  } catch (err) {
    console.warn("[liquid-splash] Failed to initialize liquid background", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLiquidSplash, { once: true });
} else {
  initLiquidSplash();
}


