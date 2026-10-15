// ═══════════════════════════════════════════════════════════════════════
//  EVP TRADE & CONVENTION CENTRE — GOOGLE TRANSLATE BYPASSER & SHIELD
//  CSS-Only + MutationObserver: Suppresses Google Translate UI artifacts
//  and prevents 360° tour canvas displacement bugs.
// ═══════════════════════════════════════════════════════════════════════

(function () {
    "use strict";

    if (document.getElementById("evp-gt-bypasser-styles")) return;

    const style = document.createElement("style");
    style.id = "evp-gt-bypasser-styles";
    style.textContent = `
        /* ── Hide Google Translate Top Banner & Toolbars ── */
        .goog-te-banner-frame,
        .skiptranslate,
        .VIpgJd-ZVi9od-ORHb-OEVmcd,
        .VIpgJd-ZVi9od-l4eHX-hSRGPd,
        .VIpgJd-ZVi9od-ORHb-bN97Pc {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* ── Hide Hover Tooltips, Balloons & Attribution Popups ── */
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-tooltip:hover {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            opacity: 0 !important;
        }

        /* ── Remove Blue Text Highlight on Hover ── */
        .goog-text-highlight {
            background: none !important;
            box-shadow: none !important;
            color: inherit !important;
        }

        /* ── Force Zero Canvas Shift ── */
        body {
            top: 0 !important;
            position: static !important;
        }
    `;
    document.head.appendChild(style);

    // Continuous top position lock (Google Translate periodically forces inline body.style.top = '40px')
    const observer = new MutationObserver(function () {
        if (document.body && document.body.style.top !== "0px" && document.body.style.top !== "") {
            document.body.style.top = "0px";
        }
    });

    if (document.body) {
        observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
        });
    }
})();
