// ═══════════════════════════════════════════════════════════
//  3D TOUR — Interactive Treedis 3D Digital Twin Popup
//  Frosted glassmorphism modal matching Google Street View 360°
// ═══════════════════════════════════════════════════════════
(function () {
    "use strict";

    // ─── Font Awesome 6 CDN (Ensure CDN icons are loaded) ───────
    if (!document.querySelector('link[href*="font-awesome"], link[href*="fontawesome"]')) {
        const fa = document.createElement("link");
        fa.rel = "stylesheet";
        fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css";
        fa.crossOrigin = "anonymous";
        fa.referrerPolicy = "no-referrer";
        document.head.appendChild(fa);
    }

    /* ─── Styles matching Google Street View 360° & Explore Views ─── */
    const style = document.createElement("style");
    style.id = "tour-3d-styles";
    style.textContent = `
        /* Backdrop */
        .tour3d-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(19, 19, 48, 0.42);
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

        .tour3d-backdrop.is-open {
            opacity: 1;
            pointer-events: auto;
        }

        /* Modal Box — Frosted Glass Shell (90vw x 90vh) */
        .tour3d-modal-box {
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

        .tour3d-modal-box.is-open {
            transform: scale(1);
            opacity: 1;
        }

        /* Header — Frosted Institutional Glass */
        .tour3d-header {
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

        .tour3d-header-titles {
            display: flex;
            align-items: center;
            gap: 14px;
            min-width: 0;
        }

        .tour3d-header-icon-box {
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

        .tour3d-header-heading {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
        }

        .tour3d-header-heading h2 {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 18px;
            font-weight: 800;
            color: #131330;
            margin: 0;
            line-height: 1.2;
            letter-spacing: -0.01em;
            white-space: nowrap;
        }

        .tour3d-header-heading p {
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

        /* Red Circular Close Button with 360deg Hover Spin */
        .tour3d-close-btn {
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

        .tour3d-close-btn i {
            font-size: 18px;
            line-height: 1;
            display: inline-flex;
            margin: 0;
            padding: 0;
            pointer-events: none;
            color: #FFFFFF;
        }

        .tour3d-close-btn:hover {
            background: #DC2626;
            color: #FFFFFF;
            transform: rotate(360deg);
        }

        .tour3d-close-btn:active {
            transform: rotate(360deg) scale(0.94);
        }

        .tour3d-header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
        }

        .tour3d-ext-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(19, 19, 48, 0.05);
            border: 1px solid rgba(19, 19, 48, 0.08);
            color: #131330;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            cursor: pointer;
            transition: all 180ms ease;
            font-size: 13px;
            outline: none !important;
        }

        .tour3d-ext-btn:hover {
            background: #FFFBEB;
            color: #d97706;
            border-color: #FFB703;
            transform: scale(1.06);
        }

        /* Stage containing Treedis Iframe and Dock */
        .tour3d-stage {
            position: relative;
            flex: 1;
            width: 100%;
            height: 100%;
            background: #131330;
            overflow: hidden;
        }

        .tour3d-iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
            background: #131330;
        }

        /* Floating Bottom Dock */
        .tour3d-viewpoint-dock {
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
                0 8px 32px rgba(19, 19, 48, 0.24),
                0 2px 8px rgba(19, 19, 48, 0.06),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            user-select: none;
            max-width: calc(100% - 40px);
            overflow-x: auto;
            scrollbar-width: none;
            box-sizing: border-box;
        }

        .tour3d-viewpoint-dock::-webkit-scrollbar {
            display: none;
        }

        .tour3d-pill-btn {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 12.5px;
            font-weight: 700;
            padding: 8px 16px;
            border-radius: 999px;
            border: none;
            background: transparent;
            color: #334155;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            -webkit-tap-highlight-color: transparent;
            outline: none;
            text-decoration: none;
        }

        .tour3d-pill-btn i {
            font-size: 13px;
            color: inherit;
            display: inline-flex;
            align-items: center;
        }

        .tour3d-pill-btn:hover {
            color: #B45309;
            background: rgba(255, 183, 3, 0.12);
        }

        .tour3d-pill-btn:active {
            transform: scale(0.97);
        }

        .tour3d-pill-btn.is-active {
            background: #131330;
            color: #FFB703;
            box-shadow: 0 4px 14px rgba(19, 19, 48, 0.28);
        }

        .tour3d-live-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #10B981;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            animation: tour3dPulseDot 2s infinite;
            flex-shrink: 0;
            display: inline-block;
        }

        @keyframes tour3dPulseDot {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .tour3d-pill-external {
            color: #B45309;
            font-weight: 700;
        }

        .tour3d-pill-external:hover {
            background: rgba(255, 183, 3, 0.12);
            color: #B45309;
        }

        .tour3d-dock-sep {
            width: 1px;
            height: 20px;
            background: rgba(19, 19, 48, 0.12);
            margin: 0 4px;
            flex-shrink: 0;
        }

        /* Desktop Pills Container */
        .tour3d-desktop-pills {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        /* Header Subtitle Dropdown Trigger */
        .tour3d-header-subtitle-wrap {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            border-radius: 6px;
            padding: 1px 4px;
            margin-left: -4px;
            transition: background 160ms ease;
            -webkit-tap-highlight-color: transparent;
        }

        .tour3d-header-subtitle-wrap:hover {
            background: rgba(255, 183, 3, 0.12);
        }

        .tour3d-header-chevron {
            font-size: 13px;
            color: #FFB703;
            transition: transform 200ms ease;
        }

        .tour3d-header-subtitle-wrap.is-open .tour3d-header-chevron {
            transform: rotate(180deg);
        }

        /* Mobile / Tablet Dropdown Trigger Capsule (Hidden on large desktop) */
        .tour3d-mobile-trigger {
            display: none;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 12.5px;
            font-weight: 700;
            padding: 8px 16px;
            border-radius: 999px;
            border: none;
            background: transparent;
            color: #131330;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            -webkit-tap-highlight-color: transparent;
            outline: none;
        }

        .tour3d-mobile-trigger i.tour3d-chevron {
            font-size: 13px;
            color: #FFB703;
            transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
            margin-left: 2px;
        }

        .tour3d-mobile-trigger.is-open i.tour3d-chevron {
            transform: rotate(180deg);
        }

        /* Transparent Backdrop to Catch Clicks Over Iframe */
        .tour3d-dropdown-backdrop {
            position: absolute;
            inset: 0;
            z-index: 20;
            display: none;
            background: transparent;
        }

        .tour3d-dropdown-backdrop.is-active {
            display: block;
        }

        /* ── Relative Dropdown Menu ── */
        .tour3d-dropdown-menu {
            position: absolute;
            bottom: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%) translateY(8px) scale(0.96);
            width: min(290px, calc(100vw - 36px));
            background: rgba(255, 255, 255, 0.94);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.85);
            border-radius: 20px;
            padding: 8px;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.06),
                0 24px 52px rgba(19, 19, 48, 0.22),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
                        transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
                        visibility 220ms ease;
            z-index: 25;
            box-sizing: border-box;
            user-select: none;
        }

        .tour3d-dropdown-menu.is-open {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0) scale(1);
            pointer-events: auto;
        }

        .tour3d-dropdown-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 10px 8px 10px;
            border-bottom: 1px solid rgba(19, 19, 48, 0.08);
            margin-bottom: 6px;
        }

        .tour3d-dropdown-title {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 11px;
            font-weight: 800;
            color: #131330;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .tour3d-dropdown-count {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 10.5px;
            font-weight: 600;
            color: #B45309;
            background: rgba(255, 183, 3, 0.12);
            padding: 2px 7px;
            border-radius: 999px;
        }

        .tour3d-dropdown-scroll {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .tour3d-dropdown-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 10px;
            border-radius: 12px;
            border: none;
            background: transparent;
            cursor: pointer;
            text-align: left;
            width: 100%;
            box-sizing: border-box;
            font-family: inherit;
            transition: background 180ms ease, transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
            -webkit-tap-highlight-color: transparent;
            text-decoration: none;
        }

        .tour3d-dropdown-item:hover,
        .tour3d-dropdown-item:active {
            background: rgba(255, 183, 3, 0.12);
            transform: translateX(2px);
        }

        .tour3d-dropdown-item.is-selected {
            background: rgba(255, 183, 3, 0.16);
        }

        .tour3d-dropdown-item-icon {
            width: 32px;
            height: 32px;
            border-radius: 9px;
            background: #FFFFFF;
            border: 1px solid rgba(19, 19, 48, 0.1);
            color: #B45309;
            display: grid;
            place-items: center;
            font-size: 14px;
            flex-shrink: 0;
            box-shadow: 0 2px 5px rgba(19, 19, 48, 0.04);
            transition: background 180ms ease, color 180ms ease;
        }

        .tour3d-dropdown-item.is-selected .tour3d-dropdown-item-icon {
            background: #131330;
            color: #FFB703;
            border-color: #131330;
        }

        .tour3d-dropdown-item-info {
            display: flex;
            flex-direction: column;
            gap: 1.5px;
            flex: 1;
            min-width: 0;
        }

        .tour3d-dropdown-item-label {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 12.5px;
            font-weight: 700;
            color: #131330;
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .tour3d-dropdown-item.is-selected .tour3d-dropdown-item-label {
            color: #B45309;
            font-weight: 800;
        }

        .tour3d-dropdown-item-sub {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 10.5px;
            color: #64748B;
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
        }

        .tour3d-dropdown-check {
            font-size: 12px;
            color: #B45309;
            opacity: 0;
            transform: scale(0.8);
            transition: all 160ms ease;
            flex-shrink: 0;
            margin-right: 2px;
        }

        .tour3d-dropdown-item.is-selected .tour3d-dropdown-check {
            opacity: 1;
            transform: scale(1);
        }

        .tour3d-dropdown-sep {
            height: 1px;
            background: rgba(19, 19, 48, 0.08);
            margin: 4px 6px;
        }

        .tour3d-dropdown-external {
            color: #B45309;
        }

        .tour3d-dropdown-external .tour3d-dropdown-item-icon {
            color: #FFB703;
            border-color: rgba(255, 183, 3, 0.35);
        }

        /* ── Tablet Responsiveness (<= 1024px) ── */
        @media (max-width: 1024px) {
            .tour3d-modal-box {
                width: calc(100vw - 44px);
                max-width: 900px;
                height: 88vh;
                height: 88dvh;
                max-height: 88dvh;
                border-radius: 22px;
            }
            .tour3d-header {
                padding: 14px 20px;
                gap: 14px;
            }
            .tour3d-header-heading h2 {
                font-size: 16px;
            }
            .tour3d-header-heading p {
                font-size: 11.5px;
            }
            .tour3d-viewpoint-dock {
                bottom: max(16px, env(safe-area-inset-bottom));
                padding: 3px 6px;
                overflow: visible !important;
                max-width: calc(100% - 32px);
            }
            .tour3d-desktop-pills {
                display: none !important;
            }
            .tour3d-mobile-trigger {
                display: flex !important;
            }
            .tour3d-dropdown-menu {
                width: min(300px, calc(100vw - 44px));
            }
        }

        /* ── Mobile Phone Responsiveness (<= 640px) ── */
        @media (max-width: 640px) {
            .tour3d-modal-box {
                width: calc(100vw - 20px);
                max-width: 480px;
                height: 88vh;
                height: 88dvh;
                max-height: 88dvh;
                border-radius: 20px;
            }
            .tour3d-header {
                padding: 12px 16px;
                gap: 10px;
            }
            .tour3d-header-icon-box {
                width: 36px;
                height: 36px;
                font-size: 16px;
                border-radius: 10px;
            }
            .tour3d-header-heading h2 {
                font-size: 14.5px;
            }
            .tour3d-header-heading p {
                font-size: 10.5px;
            }
            .tour3d-close-btn {
                width: 28px;
                height: 28px;
            }
            .tour3d-close-btn i {
                font-size: 15px;
            }
            .tour3d-viewpoint-dock {
                bottom: 14px;
            }
            .tour3d-mobile-trigger {
                font-size: 11.5px;
                padding: 6px 12px;
                gap: 6px;
            }
            .tour3d-dropdown-menu {
                width: min(285px, calc(100vw - 36px));
            }
        }
    `;
    document.head.appendChild(style);

    /* ─── State & URL Configuration ─── */
    const TREEDIS_URL = "https://www.evptradecentre.com/#specifications";
    let is3dOpen = false;
    let currentPopup = null;

    /* ─── Close 3D Tour ─── */
    function close3dTour() {
        if (!is3dOpen && !currentPopup) return;
        is3dOpen = false;
        document.body.classList.remove("is-3d-open");

        if (currentPopup) {
            const { backdrop, box, escHandler } = currentPopup;
            document.removeEventListener("keydown", escHandler);
            if (box) box.classList.remove("is-open");
            if (backdrop) {
                backdrop.classList.remove("is-open");
                setTimeout(function () {
                    if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
                }, 300);
            }
            currentPopup = null;
        }

        document.dispatchEvent(new CustomEvent("menuItemDeactivate", { detail: { id: "menu-3d-tour" } }));
    }

    /* ─── Open 3D Tour ─── */
    function open3dTour() {
        if (is3dOpen) {
            close3dTour();
            return;
        }

        is3dOpen = true;
        if (typeof window.closeGsvPopup === "function") {
            window.closeGsvPopup();
        }
        if (typeof window.closePanoDrawer === "function") {
            window.closePanoDrawer();
        }
        document.body.classList.add("is-3d-open");
        document.dispatchEvent(new CustomEvent("menuItemActivate", { detail: { id: "menu-3d-tour" } }));

        // 1. Backdrop
        const backdrop = document.createElement("div");
        backdrop.className = "tour3d-backdrop";

        // 2. Modal Box
        const box = document.createElement("div");
        box.className = "tour3d-modal-box";
        box.setAttribute("role", "dialog");
        box.setAttribute("aria-modal", "true");
        box.setAttribute("aria-labelledby", "tour3d-title");

        // 3. Header — Frosted Institutional Glass
        const header = document.createElement("div");
        header.className = "tour3d-header";

        const titles = document.createElement("div");
        titles.className = "tour3d-header-titles";

        const iconBox = document.createElement("div");
        iconBox.className = "tour3d-header-icon-box";
        iconBox.innerHTML = '<i class="fi fi-sr-cube" aria-hidden="true"></i>';

        const heading = document.createElement("div");
        heading.className = "tour3d-header-heading";

        const title = document.createElement("h2");
        title.id = "tour3d-title";
        title.textContent = "EVP Venue Specifications";

        const subWrap = document.createElement("div");
        subWrap.className = "tour3d-header-subtitle-wrap";
        subWrap.id = "tour3d-header-selector";
        subWrap.setAttribute("role", "button");
        subWrap.setAttribute("aria-haspopup", "listbox");
        subWrap.setAttribute("aria-label", "Toggle 3D Tour options");
        subWrap.title = "Click to view options";

        const subTitle = document.createElement("p");
        subTitle.id = "tour3d-subtitle";
        subTitle.textContent = "EVP Trade & Convention Centre — Engineering & Spatial Layout";

        const headerChevron = document.createElement("i");
        headerChevron.className = "fi fi-rr-angle-small-down tour3d-header-chevron";
        headerChevron.setAttribute("aria-hidden", "true");

        subWrap.appendChild(subTitle);
        subWrap.appendChild(headerChevron);

        heading.appendChild(title);
        heading.appendChild(subWrap);
        titles.appendChild(iconBox);
        titles.appendChild(heading);

        // Music-style Red Circular Close Button with 360° Hover Spin
        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "tour3d-close-btn";
        closeBtn.setAttribute("aria-label", "Close 3D Tour");
        closeBtn.innerHTML = '<i class="fi fi-rr-cross-small" aria-hidden="true"></i>';
        closeBtn.onclick = close3dTour;

        // External Link Launcher (Open Portal in New Tab)
        const extBtn = document.createElement("a");
        extBtn.href = TREEDIS_URL;
        extBtn.target = "_blank";
        extBtn.rel = "noopener noreferrer";
        extBtn.className = "tour3d-ext-btn";
        extBtn.setAttribute("aria-label", "Open Specifications Portal in New Tab");
        extBtn.title = "Open Portal in New Tab";
        extBtn.innerHTML = '<i class="fi fi-rr-arrow-up-right-from-square" aria-hidden="true"></i>';

        const actionsWrap = document.createElement("div");
        actionsWrap.className = "tour3d-header-actions";
        actionsWrap.appendChild(extBtn);
        actionsWrap.appendChild(closeBtn);

        header.appendChild(titles);
        header.appendChild(actionsWrap);
        box.appendChild(header);

        // 4. Stage (Iframe + Floating Viewpoint Dock)
        const stage = document.createElement("div");
        stage.className = "tour3d-stage";

        const iframe = document.createElement("iframe");
        iframe.className = "tour3d-iframe";
        iframe.src = TREEDIS_URL;
        iframe.setAttribute("allow", "fullscreen; accelerometer; gyroscope; magnetometer; vr; xr-spatial-tracking");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
        stage.appendChild(iframe);

        // Transparent backdrop to intercept clicks over iframe when dropdown is open
        const dropdownBackdrop = document.createElement("div");
        dropdownBackdrop.className = "tour3d-dropdown-backdrop";
        stage.appendChild(dropdownBackdrop);

        // Floating Bottom Viewpoint Dock
        const dock = document.createElement("div");
        dock.className = "tour3d-viewpoint-dock";

        // ── Relative Dropdown Menu ──
        const dropdownMenu = document.createElement("div");
        dropdownMenu.className = "tour3d-dropdown-menu";
        dropdownMenu.id = "tour3d-dropdown-menu";
        dropdownMenu.setAttribute("role", "listbox");
        dropdownMenu.setAttribute("aria-label", "Choose 3D Tour action");

        const dropdownHead = document.createElement("div");
        dropdownHead.className = "tour3d-dropdown-head";
        dropdownHead.innerHTML = `
            <span class="tour3d-dropdown-title">Portal Options</span>
            <span class="tour3d-dropdown-count">Live</span>
        `;
        dropdownMenu.appendChild(dropdownHead);

        const dropdownScroll = document.createElement("div");
        dropdownScroll.className = "tour3d-dropdown-scroll";

        // Dropdown Option 1: Venue Specifications Portal (Active)
        const itemTwin = document.createElement("button");
        itemTwin.type = "button";
        itemTwin.className = "tour3d-dropdown-item is-selected";
        itemTwin.setAttribute("role", "option");
        itemTwin.setAttribute("aria-selected", "true");
        itemTwin.innerHTML = `
            <div class="tour3d-dropdown-item-icon">
                <i class="fi fi-sr-cube" aria-hidden="true"></i>
            </div>
            <div class="tour3d-dropdown-item-info">
                <span class="tour3d-dropdown-item-label">Venue Specifications Portal</span>
                <span class="tour3d-dropdown-item-sub">Official Structural &amp; Spatial Data</span>
            </div>
            <i class="fi fi-rr-check tour3d-dropdown-check" aria-hidden="true"></i>
        `;
        itemTwin.onclick = function (e) {
            e.stopPropagation();
            closeDropdown();
        };
        dropdownScroll.appendChild(itemTwin);

        // Dropdown Option 2: Reload 3D View
        const itemReload = document.createElement("button");
        itemReload.type = "button";
        itemReload.className = "tour3d-dropdown-item";
        itemReload.setAttribute("role", "option");
        itemReload.setAttribute("aria-selected", "false");
        itemReload.innerHTML = `
            <div class="tour3d-dropdown-item-icon">
                <i class="fi fi-rr-refresh" aria-hidden="true"></i>
            </div>
            <div class="tour3d-dropdown-item-info">
                <span class="tour3d-dropdown-item-label">Reload 3D View</span>
                <span class="tour3d-dropdown-item-sub">Reset Camera & Scene</span>
            </div>
        `;
        itemReload.onclick = function (e) {
            e.stopPropagation();
            iframe.src = TREEDIS_URL;
            closeDropdown();
        };
        dropdownScroll.appendChild(itemReload);

        // Dropdown Separator
        const dropSep = document.createElement("div");
        dropSep.className = "tour3d-dropdown-sep";
        dropdownScroll.appendChild(dropSep);

        // Dropdown Option 3: Full Treedis View (External Link)
        const dropTreedisLink = document.createElement("a");
        dropTreedisLink.href = TREEDIS_URL;
        dropTreedisLink.target = "_blank";
        dropTreedisLink.rel = "noopener noreferrer";
        dropTreedisLink.className = "tour3d-dropdown-item tour3d-dropdown-external";
        dropTreedisLink.innerHTML = `
            <div class="tour3d-dropdown-item-icon">
                <i class="fi fi-rr-arrow-up-right-from-square" aria-hidden="true"></i>
            </div>
            <div class="tour3d-dropdown-item-info">
                <span class="tour3d-dropdown-item-label">Full Treedis View</span>
                <span class="tour3d-dropdown-item-sub">Open in Treedis Portal</span>
            </div>
        `;
        dropTreedisLink.onclick = function () {
            closeDropdown();
        };
        dropdownScroll.appendChild(dropTreedisLink);

        dropdownMenu.appendChild(dropdownScroll);
        dock.appendChild(dropdownMenu);

        // ── Mobile Dropdown Trigger Capsule ──
        const mobileTrigger = document.createElement("button");
        mobileTrigger.type = "button";
        mobileTrigger.className = "tour3d-mobile-trigger";
        mobileTrigger.id = "tour3d-mobile-trigger";
        mobileTrigger.setAttribute("aria-haspopup", "listbox");
        mobileTrigger.setAttribute("aria-expanded", "false");
        mobileTrigger.setAttribute("aria-label", "Select 3D view action");
        mobileTrigger.innerHTML = `
            <span class="tour3d-live-dot" aria-hidden="true"></span>
            <i class="fi fi-sr-cube" id="tour3d-mobile-icon" aria-hidden="true"></i>
            <span id="tour3d-mobile-label">3D Twin Tour</span>
            <i class="fi fi-rr-angle-small-up tour3d-chevron" aria-hidden="true"></i>
        `;
        dock.appendChild(mobileTrigger);

        // ── Desktop Horizontal Pills ──
        const desktopPills = document.createElement("div");
        desktopPills.className = "tour3d-desktop-pills";

        // Active Status Pill
        const activePill = document.createElement("button");
        activePill.type = "button";
        activePill.className = "tour3d-pill-btn is-active";
        activePill.innerHTML = '<span class="tour3d-live-dot" aria-hidden="true"></span><i class="fi fi-sr-cube" aria-hidden="true"></i><span>Interactive 3D Twin</span>';
        desktopPills.appendChild(activePill);

        // Dock Separator
        const sep1 = document.createElement("div");
        sep1.className = "tour3d-dock-sep";
        desktopPills.appendChild(sep1);

        // Reload Pill
        const reloadPill = document.createElement("button");
        reloadPill.type = "button";
        reloadPill.className = "tour3d-pill-btn";
        reloadPill.title = "Reload 3D View";
        reloadPill.innerHTML = '<i class="fi fi-rr-refresh" aria-hidden="true"></i><span>Reload</span>';
        reloadPill.onclick = function () {
            iframe.src = TREEDIS_URL;
        };
        desktopPills.appendChild(reloadPill);

        // Dock Separator
        const sep2 = document.createElement("div");
        sep2.className = "tour3d-dock-sep";
        desktopPills.appendChild(sep2);

        // External Treedis Direct Link
        const treedisLink = document.createElement("a");
        treedisLink.href = TREEDIS_URL;
        treedisLink.target = "_blank";
        treedisLink.rel = "noopener noreferrer";
        treedisLink.className = "tour3d-pill-btn tour3d-pill-external";
        treedisLink.innerHTML = '<i class="fi fi-rr-arrow-up-right-from-square" aria-hidden="true"></i><span>Full Treedis View</span>';
        desktopPills.appendChild(treedisLink);

        dock.appendChild(desktopPills);

        // ── Dropdown Controls ──
        let isDropdownOpen = false;

        function toggleDropdown(forceState) {
            isDropdownOpen = typeof forceState === "boolean" ? forceState : !isDropdownOpen;
            if (isDropdownOpen) {
                dropdownMenu.classList.add("is-open");
                mobileTrigger.classList.add("is-open");
                mobileTrigger.setAttribute("aria-expanded", "true");
                dropdownBackdrop.classList.add("is-active");
                subWrap.classList.add("is-open");
            } else {
                dropdownMenu.classList.remove("is-open");
                mobileTrigger.classList.remove("is-open");
                mobileTrigger.setAttribute("aria-expanded", "false");
                dropdownBackdrop.classList.remove("is-active");
                subWrap.classList.remove("is-open");
            }
        }

        function closeDropdown() {
            if (isDropdownOpen) toggleDropdown(false);
        }

        mobileTrigger.onclick = function (e) {
            e.stopPropagation();
            toggleDropdown();
        };

        subWrap.onclick = function (e) {
            e.stopPropagation();
            toggleDropdown();
        };

        dropdownBackdrop.onclick = function () {
            closeDropdown();
        };

        stage.appendChild(dock);
        box.appendChild(stage);

        backdrop.appendChild(box);
        document.body.appendChild(backdrop);

        // Animate in via class transitions
        requestAnimationFrame(function () {
            backdrop.classList.add("is-open");
            box.classList.add("is-open");
        });

        const escHandler = function (e) {
            if (e.key === "Escape" || e.key === "Esc") {
                if (isDropdownOpen) {
                    closeDropdown();
                } else {
                    close3dTour();
                }
            }
        };
        document.addEventListener("keydown", escHandler);

        backdrop.addEventListener("click", function (e) {
            if (e.target === backdrop) close3dTour();
        });

        currentPopup = { backdrop, box, escHandler };
    }

    function toggle3dTour() {
        if (is3dOpen) close3dTour();
        else open3dTour();
    }

    /* ─── Public API ─── */
    window.open3dTour = open3dTour;
    window.close3dTour = close3dTour;
    window.toggle3dTour = toggle3dTour;

    /* ─── Listen for Menu & Dock Clicks ─── */
    document.addEventListener("menuItemClick", function (e) {
        if (e.detail && (e.detail.id === "menu-3d-tour" || e.detail.id === "dock-tour3d")) {
            open3dTour();
        } else if (is3dOpen) {
            close3dTour();
        }
    });

    document.addEventListener("menuItemActivate", function (e) {
        if (e.detail && e.detail.id !== "menu-3d-tour" && is3dOpen) {
            close3dTour();
        }
    });

})();
