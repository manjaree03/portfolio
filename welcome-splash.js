// Welcome splash controller (no React / no WebGL)
(function () {
  // Keep these aligned with `welcome-splash.css` timings.
  var WRITE_MS = 1500;
  var END_BUFFER_MS = 0; // start hiding immediately after the splash duration

  function hideSplash(splash) {
    splash.classList.add("is-hidden");
    window.setTimeout(function () {
      if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
    }, 320);
  }

  window.addEventListener("DOMContentLoaded", function () {
    var splash = document.getElementById("welcome-splash");
    if (!splash) return;

    var textGrad = document.getElementById("welcomeTextGlassGradient");
    var raf = 0;
    if (textGrad && window.requestAnimationFrame) {
      var t0 = performance.now();
      var tick = function () {
        if (!document.getElementById("welcome-splash")) return;
        var t = (performance.now() - t0) / 1000;
        // Glass sweep across the Welcome fill (looping)
        var phase = (t * 220) % 1200; // px
        textGrad.setAttribute("gradientTransform", "translate(" + phase.toFixed(1) + " 0)");
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    // Auto-hide right after the writing finishes (no Skip button)
    window.setTimeout(function () {
      if (raf) cancelAnimationFrame(raf);
      hideSplash(splash);
    }, WRITE_MS + END_BUFFER_MS);
  });
})();


