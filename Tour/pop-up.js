(function () {
  "use strict";

  /* ═══════════════════════════════════════════════════════
     AUTO OPEN POPUP
     Directly loads the Playground GSV without confirmation
     ═══════════════════════════════════════════════════════ */

  /* ─── Load own CDNs (self-contained) ─── */
  // Font Awesome 6
  if (!document.querySelector('link[href*="font-awesome"], link[href*="fontawesome"]')) {
    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    fa.crossOrigin = "anonymous";
    document.head.appendChild(fa);
  }

  // Satoshi Font
  if (!document.querySelector('link[href*="satoshi"]')) {
    const satoshi = document.createElement("link");
    satoshi.rel = "stylesheet";
    satoshi.href = "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,800&display=swap";
    document.head.appendChild(satoshi);
  }

  /* ─── Keyframes (inject once) ─── */
  if (!document.getElementById("dv-popup-iframe-styles")) {
    const style = document.createElement("style");
    style.id = "dv-popup-iframe-styles";
    style.textContent = `
      @keyframes dvFadeIn   { from { opacity: 0; } to { opacity: 1; } }
      @keyframes dvFadeOut  { from { opacity: 1; } to { opacity: 0; } }

      .dv-popup-close-btn {
        position: absolute;
        top: 16px;
        right: 20px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.16);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
        z-index: 10;
        outline: none;
        transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        -webkit-tap-highlight-color: transparent;
      }
      .dv-popup-close-btn i {
        font-size: 15px;
        line-height: 1;
        display: inline-block;
        color: inherit;
        transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: geometricPrecision;
        transform: translateZ(0);
      }
      .dv-popup-close-btn:hover {
        background: #002A76;
        border-color: #002A76;
        color: #FFFFFF;
        box-shadow: 0 6px 18px rgba(0, 42, 118, 0.4);
      }
      .dv-popup-close-btn:hover i {
        transform: rotate(90deg) translateZ(0);
      }
      .dv-popup-close-btn:active {
        transform: scale(0.95);
      }
    `;
    document.head.appendChild(style);
  }

  /* ─── Helpers ─── */
  function s(el, styles) { Object.assign(el.style, styles); }

  /* ─── Iframe Popup Builder ─── */
  function openIframePopup(url) {
    const backdrop = document.createElement("div");
    s(backdrop, {
      position: "fixed",
      top: "0", left: "0", width: "100%", height: "100%",
      background: "rgba(15, 23, 42, 0.4)", // Darkish glassmorphism
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      zIndex: "100030",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "dvFadeIn 0.35s ease forwards",
      boxSizing: "border-box"
    });

    const box = document.createElement("div");
    s(box, {
      width: "95%",
      height: "95%",
      position: "relative",
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      borderRadius: "24px",
      boxShadow: "0 32px 64px rgba(0, 0, 0, 0.3)",
      overflow: "hidden",
      transform: "translateY(30px) scale(0.95)",
      opacity: "0",
      transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      display: "flex",
      flexDirection: "column"
    });

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "dv-popup-close-btn";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    closeBtn.onclick = closeIframePopup;
    box.appendChild(closeBtn);

    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    s(iframe, {
      width: "100%", height: "100%",
      border: "none", flex: "1", background: "transparent",
      borderRadius: "24px"
    });
    box.appendChild(iframe);

    backdrop.appendChild(box);
    document.body.appendChild(backdrop);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        s(box, { transform: "translateY(0) scale(1)", opacity: "1" });
      });
    });

    const escIframeHandler = (e) => {
      if (e.key === "Escape") closeIframePopup();
    };
    document.addEventListener("keydown", escIframeHandler);

    function closeIframePopup() {
      s(box, { transform: "translateY(30px) scale(0.95)", opacity: "0" });
      backdrop.style.animation = "dvFadeOut 0.4s ease forwards";
      setTimeout(() => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); }, 400);
      document.removeEventListener("keydown", escIframeHandler);
    }

    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeIframePopup(); });
  }

  // --- Auto-open Playground GSV directly ---
  const PLAYGROUND_GSV_URL = "https://www.google.com/maps/embed?pb=!4v1777956212487!6m8!1m7!1sCAoSHENJQUJJaEJsNFJUV1h1RnRVbUw0Y2hZaFdDRk0.!2m2!1d10.36481887887262!2d78.80652094182369!3f313.5526187210199!4f-4.769998163748056!5f0.7820865974627469";
  const AUTO_OPEN_DELAY = 800; // 800ms delay to match the original feel

  const go = () => setTimeout(() => openIframePopup(PLAYGROUND_GSV_URL), AUTO_OPEN_DELAY);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", go);
  } else {
    go();
  }

})();
