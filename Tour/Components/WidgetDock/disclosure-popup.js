// ═══════════════════════════════════════════════════════════
//  MANDATORY DISCLOSURE — Embedded Document Player / Viewer
//  Frosted glassmorphism modal matching Google Street View & 3D Tour
// ═══════════════════════════════════════════════════════════
(function () {
    "use strict";

    // ─── Font Awesome 6 CDN ─────────────────────────────────────
    if (!document.querySelector('link[href*="font-awesome"], link[href*="fontawesome"]')) {
        const fa = document.createElement("link");
        fa.rel = "stylesheet";
        fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css";
        fa.crossOrigin = "anonymous";
        fa.referrerPolicy = "no-referrer";
        document.head.appendChild(fa);
    }

    /* ─── Styles matching GSV & 3D Tour ─── */
    const style = document.createElement("style");
    style.id = "disclosure-popup-styles";
    style.textContent = `
        /* Backdrop */
        .disclosure-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(19, 19, 48, 0.35);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            backdrop-filter: blur(24px) saturate(180%);
            z-index: 100090;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
            box-sizing: border-box;
            font-style: normal !important;
        }

        .disclosure-backdrop.is-open {
            opacity: 1;
            pointer-events: auto;
        }

        /* Modal Box — Frosted Glass Shell (90vw x 90vh) */
        .disclosure-modal-box {
            width: 90vw;
            height: 90vh;
            max-height: 90vh;
            position: relative;
            background: rgba(255, 255, 255, 0.90);
            -webkit-backdrop-filter: blur(28px) saturate(190%);
            backdrop-filter: blur(28px) saturate(190%);
            border: 1px solid rgba(255, 255, 255, 0.85);
            border-radius: 24px;
            box-shadow: 
                0 4px 12px rgba(19, 19, 48, 0.04),
                0 28px 64px rgba(19, 19, 48, 0.22),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            overflow: hidden;
            transform: scale(0.96);
            opacity: 0;
            transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease;
            display: flex;
            flex-direction: column;
            user-select: none;
            box-sizing: border-box;
            font-style: normal !important;
        }

        .disclosure-modal-box.is-open {
            transform: scale(1);
            opacity: 1;
        }

        /* Header — Frosted Institutional Glass */
        .disclosure-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 24px;
            background: rgba(255, 255, 255, 0.65);
            border-bottom: 1px solid rgba(19, 19, 48, 0.08);
            position: relative;
            gap: 16px;
            flex-shrink: 0;
            box-sizing: border-box;
            user-select: none;
        }

        .disclosure-header-titles {
            display: flex;
            align-items: center;
            gap: 14px;
            min-width: 0;
        }

        .disclosure-header-icon-box {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: #131330;
            border: 1px solid rgba(255, 183, 3, 0.35);
            color: #FFB703;
            display: grid;
            place-items: center;
            font-size: 19px;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(19, 19, 48, 0.12);
        }

        .disclosure-header-heading {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
        }

        .disclosure-header-heading h2 {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 18px;
            font-weight: 800;
            color: #131330;
            margin: 0;
            line-height: 1.2;
            letter-spacing: -0.01em;
            white-space: nowrap;
        }

        .disclosure-header-heading p {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 12px;
            color: #64748B;
            margin: 0;
            line-height: 1.2;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Red Circular Close Button with 360° Hover Spin */
        .disclosure-close-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #EF4444;
            border: none;
            color: #FFFFFF;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin: 0;
            flex-shrink: 0;
            outline: none !important;
            box-shadow: none;
            transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
            -webkit-tap-highlight-color: transparent;
        }

        .disclosure-close-btn i {
            font-size: 18px;
            line-height: 1;
            display: inline-flex;
            margin: 0;
            padding: 0;
            pointer-events: none;
            color: #FFFFFF;
        }

        .disclosure-close-btn:hover {
            background: #DC2626;
            color: #FFFFFF;
            transform: rotate(360deg);
        }

        .disclosure-close-btn:active {
            transform: rotate(360deg) scale(0.94);
        }

        /* Stage containing Iframe and Bottom Dock */
        .disclosure-stage {
            position: relative;
            flex: 1;
            width: 100%;
            height: 100%;
            background: #FFFFFF;
            overflow: hidden;
        }

        .disclosure-iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
            background: #FFFFFF;
        }

        /* Floating Bottom Dock */
        .disclosure-dock {
            position: absolute;
            bottom: 22px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            background: rgba(255, 255, 255, 0.88);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.85);
            border-radius: 999px;
            padding: 5px 8px;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 
                0 4px 12px rgba(19, 19, 48, 0.04),
                0 16px 36px rgba(19, 19, 48, 0.16),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
        }

        .disclosure-pill-btn {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 7px 14px;
            border-radius: 999px;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 12px;
            font-weight: 700;
            color: #131330;
            background: transparent;
            border: none;
            cursor: pointer;
            text-decoration: none;
            white-space: nowrap;
            transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
            -webkit-tap-highlight-color: transparent;
        }

        .disclosure-pill-btn:hover {
            background: rgba(255, 183, 3, 0.15);
            color: #131330;
        }

        .disclosure-pill-btn.is-active {
            background: #131330;
            color: #FFB703;
            border: 1px solid #FFB703;
            box-shadow: 0 4px 12px rgba(19, 19, 48, 0.28);
        }

        .disclosure-pill-btn.is-active:hover {
            background: #131330;
            color: #FFB703;
        }

        .disclosure-pill-external {
            color: #131330;
        }

        .disclosure-pill-external:hover {
            background: rgba(255, 183, 3, 0.15);
            color: #131330;
        }

        .disclosure-dock-sep {
            width: 1px;
            height: 18px;
            background: rgba(19, 19, 48, 0.12);
            flex-shrink: 0;
            margin: 0 2px;
        }

        .disclosure-live-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #10B981;
            box-shadow: 0 0 6px rgba(16, 185, 129, 0.8);
            animation: disclosurePulse 2s infinite ease-in-out;
        }

        @keyframes disclosurePulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.45; transform: scale(1.2); }
        }

        /* ─── Mobile Responsiveness ─── */
        @media (max-width: 768px) {
            .disclosure-modal-box {
                width: 95vw;
                height: 85vh;
                border-radius: 20px;
            }
            .disclosure-header {
                padding: 12px 16px;
            }
            .disclosure-header-heading h2 {
                font-size: 15px;
            }
            .disclosure-header-heading p {
                font-size: 11px;
            }
            .disclosure-header-icon-box {
                width: 36px;
                height: 36px;
                font-size: 16px;
            }
            .disclosure-dock {
                bottom: 14px;
                padding: 4px 6px;
                max-width: calc(100% - 24px);
                overflow-x: auto;
            }
            .disclosure-pill-btn {
                padding: 6px 10px;
                font-size: 11px;
            }
        }
    `;
    document.head.appendChild(style);

    const DISCLOSURE_URL = "EVP SPECIFICATION.pdf";
    const WEB_PORTAL_URL = "https://www.evptradecentre.com/";

    let isDisclosureOpen = false;
    let currentPopup = null;

    function closeDisclosure() {
        if (!isDisclosureOpen || !currentPopup) return;

        const { backdrop, box, escHandler } = currentPopup;
        document.removeEventListener("keydown", escHandler);

        backdrop.classList.remove("is-open");
        box.classList.remove("is-open");

        document.body.classList.remove("is-disclosure-open");
        isDisclosureOpen = false;

        document.dispatchEvent(new CustomEvent("menuItemDeactivate", { detail: { id: "menu-disclosure" } }));

        setTimeout(function () {
            if (backdrop.parentNode) {
                backdrop.parentNode.removeChild(backdrop);
            }
            currentPopup = null;
        }, 320);
    }

    function openDisclosure() {
        if (isDisclosureOpen) return;

        // Mutual modal close coordination
        if (typeof window.closeGsvPopup === "function") window.closeGsvPopup();
        if (typeof window.close3dTour === "function") window.close3dTour();
        if (typeof window.closePanoDrawer === "function") window.closePanoDrawer();
        if (typeof window.closeLocation === "function") window.closeLocation();
        if (typeof window.closeContactModal === "function") window.closeContactModal();
        if (typeof window.closeSearchBox === "function") window.closeSearchBox();

        isDisclosureOpen = true;
        document.body.classList.add("is-disclosure-open");

        document.dispatchEvent(new CustomEvent("menuItemActivate", { detail: { id: "menu-disclosure" } }));

        const backdrop = document.createElement("div");
        backdrop.className = "disclosure-backdrop";

        const box = document.createElement("div");
        box.className = "disclosure-modal-box";
        box.setAttribute("role", "dialog");
        box.setAttribute("aria-label", "Mandatory Disclosure");

        // Header
        const header = document.createElement("div");
        header.className = "disclosure-header";

        const titles = document.createElement("div");
        titles.className = "disclosure-header-titles";

        const iconBox = document.createElement("div");
        iconBox.className = "disclosure-header-icon-box";
        iconBox.innerHTML = '<i class="fi fi-rr-file-pdf" aria-hidden="true"></i>';

        const heading = document.createElement("div");
        heading.className = "disclosure-header-heading";
        heading.innerHTML = '<h2>Venue Factsheet</h2><p>EVP Trade & Convention Centre — Engineering & Hall Specifications</p>';

        titles.appendChild(iconBox);
        titles.appendChild(heading);

        const closeBtn = document.createElement("button");
        closeBtn.className = "disclosure-close-btn";
        closeBtn.type = "button";
        closeBtn.setAttribute("aria-label", "Close Venue Factsheet");
        closeBtn.innerHTML = '<i class="fi fi-rr-cross-small" aria-hidden="true"></i>';
        closeBtn.addEventListener("click", closeDisclosure);

        header.appendChild(titles);
        header.appendChild(closeBtn);
        box.appendChild(header);

        // Stage & Iframe
        const stage = document.createElement("div");
        stage.className = "disclosure-stage";

        const iframe = document.createElement("iframe");
        iframe.className = "disclosure-iframe";
        iframe.src = DISCLOSURE_URL + "#toolbar=0&navpanes=0";
        iframe.title = "EVP Trade & Convention Centre Factsheet";
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("loading", "lazy");
        stage.appendChild(iframe);

        // Floating Bottom Dock
        const dock = document.createElement("div");
        dock.className = "disclosure-dock";
        dock.setAttribute("role", "toolbar");

        const activePill = document.createElement("button");
        activePill.type = "button";
        activePill.className = "disclosure-pill-btn is-active";
        activePill.innerHTML = '<span class="disclosure-live-dot" aria-hidden="true"></span><i class="fi fi-rr-file-pdf" aria-hidden="true"></i><span>Specifications (PDF)</span>';
        dock.appendChild(activePill);

        const sep1 = document.createElement("div");
        sep1.className = "disclosure-dock-sep";
        dock.appendChild(sep1);

        const externalPdfLink = document.createElement("a");
        externalPdfLink.href = DISCLOSURE_URL;
        externalPdfLink.target = "_blank";
        externalPdfLink.rel = "noopener noreferrer";
        externalPdfLink.className = "disclosure-pill-btn disclosure-pill-external";
        externalPdfLink.innerHTML = '<i class="fi fi-rr-file-pdf" aria-hidden="true"></i><span>Open PDF</span><i class="fi fi-rr-arrow-up-right-from-square" aria-hidden="true" style="font-size: 10px; margin-left: 2px; opacity: 0.85;"></i>';
        dock.appendChild(externalPdfLink);

        const sep2 = document.createElement("div");
        sep2.className = "disclosure-dock-sep";
        dock.appendChild(sep2);

        const externalWebLink = document.createElement("a");
        externalWebLink.href = WEB_PORTAL_URL;
        externalWebLink.target = "_blank";
        externalWebLink.rel = "noopener noreferrer";
        externalWebLink.className = "disclosure-pill-btn disclosure-pill-external";
        externalWebLink.innerHTML = '<i class="fi fi-rr-globe" aria-hidden="true"></i><span>Web Portal</span>';
        dock.appendChild(externalWebLink);

        stage.appendChild(dock);
        box.appendChild(stage);

        backdrop.appendChild(box);
        document.body.appendChild(backdrop);

        requestAnimationFrame(function () {
            backdrop.classList.add("is-open");
            box.classList.add("is-open");
        });

        const escHandler = function (e) {
            if (e.key === "Escape" || e.key === "Esc") closeDisclosure();
        };
        document.addEventListener("keydown", escHandler);

        backdrop.addEventListener("click", function (e) {
            if (e.target === backdrop) closeDisclosure();
        });

        currentPopup = { backdrop, box, escHandler };
    }

    function toggleDisclosure() {
        if (isDisclosureOpen) closeDisclosure();
        else openDisclosure();
    }

    /* ─── Public API ─── */
    window.openDisclosure = openDisclosure;
    window.closeDisclosure = closeDisclosure;
    window.toggleDisclosure = toggleDisclosure;

    /* ─── Listen for Menu & Dock Clicks ─── */
    document.addEventListener("menuItemClick", function (e) {
        if (e.detail && (e.detail.id === "menu-disclosure" || e.detail.id === "popover-btn-disclosure")) {
            openDisclosure();
        } else if (isDisclosureOpen) {
            closeDisclosure();
        }
    });

    document.addEventListener("menuItemActivate", function (e) {
        if (e.detail && e.detail.id !== "menu-disclosure" && isDisclosureOpen) {
            closeDisclosure();
        }
    });

})();