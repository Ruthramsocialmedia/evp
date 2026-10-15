// ═══════════════════════════════════════════════════════════
//  EVP TRADE & CONVENTION CENTRE — Floating Bottom Dock
//  White frosted glassmorphism 4-tab navigation dock at bottom-center:
//  1. Home (Resets to initial entrance scene)
//  2. Explore (Opens 17-pano exhibition halls & facilities drawer)
//  3. Street View (Opens Google Street View 360 outdoor popup)
//  4. Connect (Opens venue booking & social channels modal)
// ═══════════════════════════════════════════════════════════
(function () {
    "use strict";

    if (document.getElementById("pcis-nav-dock")) return;

    // ─── Inject Styles ──────────────────────────────────────────
    const style = document.createElement("style");
    style.id = "pcis-dock-styles";
    style.textContent = `
        .pcis-dock-wrap {
            position: fixed;
            left: 50%;
            bottom: max(20px, env(safe-area-inset-bottom));
            transform: translateX(-50%);
            z-index: 100060;
            pointer-events: auto;
            user-select: none;
            transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 300ms ease;
            font-style: normal !important;
        }

        .pcis-nav-dock {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            padding: 6px 8px;
            height: 66px;
            background: rgba(255, 255, 255, 0.88);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.85);
            border-radius: 18px;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.05),
                0 20px 48px rgba(19, 19, 48, 0.12),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
        }

        /* Sleek Top Indicator Bar — EVP Imperial Gold */
        .pcis-dock-pill {
            position: absolute;
            top: 0;
            height: 3.5px;
            left: 0;
            width: 0;
            border-radius: 0 0 3px 3px;
            background: #FFB703;
            box-shadow: 0 2px 10px rgba(255, 183, 3, 0.55);
            pointer-events: none;
            opacity: 0;
            transform: translateZ(0);
            transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
                        width 260ms cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 200ms ease;
            z-index: 5;
        }

        .pcis-dock-tab {
            position: relative;
            z-index: 2;
            min-width: 76px;
            height: 54px;
            padding: 4px 10px;
            margin: 0 1px;
            border: none;
            border-radius: 12px;
            background: transparent;
            color: #131330;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            cursor: pointer;
            transition: color 180ms ease,
                        transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
            -webkit-tap-highlight-color: transparent;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
        }

        /* Dedicated fixed vertical separator between tabs */
        .pcis-dock-sep {
            width: 1px;
            height: 22px;
            background: rgba(19, 19, 48, 0.08);
            flex-shrink: 0;
            border-radius: 1px;
            z-index: 2;
        }

                /* ─── Floating Setup Layout Filter Bar (Above Control Dock) ─── */
        .pcis-dock-setup-bar {
            position: absolute;
            bottom: calc(100% + 12px);
            left: 50%;
            transform: translateX(-50%) translateY(8px);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 5px 8px;
            background: rgba(255, 255, 255, 0.92);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.85);
            border-radius: 999px;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.06),
                0 18px 40px rgba(19, 19, 48, 0.14),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            z-index: 100065;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
                        transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pcis-dock-setup-bar.is-visible {
            opacity: 1;
            pointer-events: auto;
            transform: translateX(-50%) translateY(0);
        }

        .pcis-dock-setup-bar .pcis-setup-chip {
            padding: 5px 13px;
            border-radius: 999px;
            border: 1px solid rgba(19, 19, 48, 0.08);
            background: #FFFFFF;
            color: #475569;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
            transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            box-shadow: 0 1px 3px rgba(19, 19, 48, 0.04);
        }

        .pcis-dock-setup-bar .pcis-setup-chip i {
            font-size: 12px;
            line-height: 1;
            color: #64748B;
            transition: color 180ms ease;
        }

        .pcis-dock-setup-bar .pcis-setup-chip:hover {
            border-color: rgba(255, 183, 3, 0.6);
            color: #131330;
            background: rgba(255, 183, 3, 0.08);
            transform: translateY(-1px);
        }

        .pcis-dock-setup-bar .pcis-setup-chip:hover i {
            color: #B45309;
        }

        .pcis-dock-setup-bar .pcis-setup-chip.active {
            background: #131330;
            border-color: #131330;
            color: #FFB703;
            box-shadow: 0 4px 12px rgba(19, 19, 48, 0.28);
            transform: translateY(-1px);
        }

        .pcis-dock-setup-bar .pcis-setup-chip.active i {
            color: #FFB703;
        }

        .pcis-halls-list {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .pcis-hall-badge {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 10px;
            font-weight: 800;
            color: #B45309;
            background: rgba(255, 183, 3, 0.16);
            border: 1px solid rgba(255, 183, 3, 0.35);
            padding: 2px 6px;
            border-radius: 6px;
            margin-left: auto;
            white-space: nowrap;
            flex-shrink: 0;
        }

        /* Active Setup Toast Notification — White Frosted Glass matching Top Indicator */
        .pcis-hall-setup-toast {
            position: fixed;
            top: calc(max(18px, env(safe-area-inset-top)) + 74px);
            left: 50%;
            transform: translateX(-50%) translateY(-6px);
            background: rgba(255, 255, 255, 0.88);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            backdrop-filter: blur(20px) saturate(180%);
            color: #131330;
            border: 1px solid rgba(255, 255, 255, 0.85);
            border-radius: 999px;
            padding: 7px 18px;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 12.5px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.05),
                0 18px 40px rgba(19, 19, 48, 0.12),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            opacity: 0;
            pointer-events: none;
            transition: all 260ms cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 100080;
            white-space: nowrap;
        }
        .pcis-hall-setup-toast.is-visible {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        .pcis-toast-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #FFB703;
            box-shadow: 0 0 8px #FFB703;
            flex-shrink: 0;
        }

        /* ─── Floating Frosted Glass Popover Menus ─── */
        .pcis-more-popover,
        .pcis-halls-popover,
        .pcis-explore-popover {
            position: absolute;
            bottom: calc(100% + 14px);
            background: rgba(255, 255, 255, 0.92);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-radius: 18px;
            padding: 8px;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.05),
                0 22px 52px rgba(19, 19, 48, 0.20),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            opacity: 0;
            pointer-events: none;
            transform: translateY(10px) scale(0.96);
            transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
                        transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 100070;
            display: flex;
            flex-direction: column;
            gap: 3px;
            box-sizing: border-box;
        }

        .pcis-more-popover {
            right: 0;
            width: 270px;
            transform-origin: bottom right;
        }

        .pcis-halls-popover {
            left: 10px;
            bottom: calc(100% + 14px);
            width: 320px;
            transform-origin: bottom left;
        }

        .pcis-explore-popover {
            left: 50%;
            transform: translateX(-50%) translateY(10px) scale(0.96);
            transform-origin: bottom center;
            width: min(350px, calc(100vw - 24px));
            max-height: min(450px, calc(100vh - 120px));
            overflow: hidden;
            display: flex;
            flex-direction: column;
            padding: 8px;
            box-sizing: border-box;
        }

        .pcis-more-popover.is-open,
        .pcis-halls-popover.is-open,
        .pcis-explore-popover.is-open {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0) scale(1);
        }
        .pcis-explore-popover.is-open {
            transform: translateX(-50%) translateY(0) scale(1);
        }

        .pcis-popover-header {
            padding: 6px 10px 6px 10px;
            font-family: 'Satoshi', sans-serif !important;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #8E92A4;
            border-bottom: 1px solid rgba(19, 19, 48, 0.06);
            margin-bottom: 4px;
        }

        /* ─── Segmented Explore Hub (Option A+) ─── */
        .pcis-explore-tabs {
            display: flex;
            align-items: center;
            background: rgba(19, 19, 48, 0.05);
            padding: 3px;
            border-radius: 12px;
            gap: 3px;
            margin-bottom: 6px;
        }

        .pcis-explore-tab-btn {
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 6px 10px;
            border-radius: 9px;
            border: none;
            background: transparent;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 11.5px;
            font-weight: 700;
            color: #64748B;
            cursor: pointer;
            transition: all 180ms ease;
            white-space: nowrap;
            user-select: none;
        }

        .pcis-explore-tab-btn i {
            font-size: 11px;
            line-height: 1;
        }

        .pcis-explore-tab-btn:hover {
            color: #131330;
        }

        .pcis-explore-tab-btn.is-active {
            background: #FFFFFF;
            color: #131330;
            box-shadow: 0 2px 8px rgba(19, 19, 48, 0.08);
        }

        .pcis-explore-tab-btn.is-active i {
            color: #FFB703;
        }

        .pcis-explore-search-wrap {
            position: relative;
            margin-bottom: 6px;
        }

        .pcis-explore-search-input {
            width: 100%;
            box-sizing: border-box;
            padding: 7px 12px 7px 30px;
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(19, 19, 48, 0.08);
            border-radius: 10px;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 12px;
            color: #131330;
            outline: none;
            transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .pcis-explore-search-input::placeholder {
            color: #94A3B8;
            font-size: 11.5px;
        }

        .pcis-explore-search-input:focus {
            background: #FFFFFF;
            border-color: #FFB703;
            box-shadow: 0 0 0 2.5px rgba(255, 183, 3, 0.25);
        }

        .pcis-explore-search-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 11px;
            color: #94A3B8;
            pointer-events: none;
            line-height: 1;
        }

        .pcis-explore-scroll-area {
            max-height: 290px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 2px;
            padding-right: 2px;
        }

        .pcis-explore-scroll-area::-webkit-scrollbar {
            width: 4px;
        }

        .pcis-explore-scroll-area::-webkit-scrollbar-thumb {
            background: rgba(19, 19, 48, 0.15);
            border-radius: 999px;
        }

        .pcis-explore-badge {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 9.5px;
            font-weight: 800;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            padding: 2px 7px;
            border-radius: 6px;
            margin-left: auto;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .pcis-badge-pov {
            color: #B45309;
            background: rgba(255, 183, 3, 0.16);
            border: 1px solid rgba(255, 183, 3, 0.35);
        }

        .pcis-badge-pano {
            color: #334155;
            background: rgba(100, 116, 139, 0.12);
            border: 1px solid rgba(100, 116, 139, 0.25);
        }

        .pcis-explore-empty {
            padding: 24px 12px;
            text-align: center;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 12px;
            color: #94A3B8;
            font-weight: 600;
            display: none;
        }

        .pcis-popover-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 10px;
            border-radius: 12px;
            border: none;
            background: transparent;
            width: 100%;
            box-sizing: border-box;
            cursor: pointer;
            text-align: left;
            transition: background 180ms ease, transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            color: #131330;
            text-decoration: none;
            -webkit-tap-highlight-color: transparent;
        }

        .pcis-popover-item:hover {
            background: rgba(255, 183, 3, 0.12);
            transform: translateX(2px);
        }

        .pcis-popover-item:active {
            transform: scale(0.98);
            background: rgba(255, 183, 3, 0.18);
        }

        .pcis-popover-item:active .pcis-popover-icon {
            background: #FFB703;
            color: #131330;
            border-color: #FFB703;
        }

        .pcis-popover-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background: #FFFFFF;
            border: 1px solid rgba(19, 19, 48, 0.08);
            color: #FFB703;
            display: grid;
            place-items: center;
            font-size: 16px;
            flex-shrink: 0;
            box-shadow: 0 2px 6px rgba(19, 19, 48, 0.05);
            transition: background 180ms ease, color 180ms ease, border-color 180ms ease;
        }

        .pcis-popover-item:hover .pcis-popover-icon {
            background: #FFB703;
            color: #131330;
            border-color: #FFB703;
        }

        .pcis-popover-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
        }

        .pcis-popover-title {
            font-size: 13px;
            font-weight: 700;
            color: #131330;
            line-height: 1.2;
            transition: color 180ms ease;
        }

        .pcis-popover-item:hover .pcis-popover-title {
            color: #131330;
        }

        .pcis-popover-sub {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 11px;
            font-weight: 500;
            color: #5A5D72;
            line-height: 1.2;
        }

        .pcis-dock-tab:hover {
            color: #FFB703;
            transform: translateY(-2px);
        }

        .pcis-dock-tab:active {
            transform: translateY(0) scale(0.96);
        }

        .pcis-dock-tab.is-active {
            color: #131330;
        }

        .pcis-dock-tab.is-active .pcis-dock-icon {
            color: #FFB703;
            transform: scale(1.1);
        }

        .pcis-dock-tab.is-active .pcis-dock-label {
            color: #131330;
            font-weight: 800;
        }

        .pcis-dock-icon {
            font-size: 18px;
            line-height: 1;
            display: grid;
            place-items: center;
            color: inherit;
            transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pcis-dock-tab:hover .pcis-dock-icon {
            transform: scale(1.12);
        }

        .pcis-dock-label {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.02em;
            line-height: 1.1;
            color: inherit;
            white-space: nowrap;
        }

        /* Clean Mode UI Toggle state */
        body.is-ui-hidden .pcis-dock-wrap {
            opacity: 0;
            transform: translate(-50%, 36px);
            pointer-events: none;
        }

        @media (max-width: 1024px) {
            .pcis-hall-setup-toast {
                top: calc(max(12px, env(safe-area-inset-top)) + 130px);
                font-size: 11.5px;
                padding: 6px 14px;
            }
        }

        /* Mobile & Tablets */
        @media (max-width: 768px) {
            .pcis-dock-wrap {
                bottom: max(14px, env(safe-area-inset-bottom));
                width: calc(100vw - 36px);
                max-width: 440px;
                box-sizing: border-box;
            }
            .pcis-nav-dock {
                width: 100%;
                height: 58px;
                padding: 3px 6px;
                border-radius: 16px;
                box-sizing: border-box;
            }
            .pcis-dock-tab {
                flex: 1;
                min-width: 0;
                height: 48px;
                padding: 2px 4px;
                gap: 2px;
                margin: 0;
            }
            .pcis-dock-sep { height: 16px; }
            .pcis-dock-icon { font-size: 16px; }
            .pcis-dock-label { font-size: 11px; }
            .pcis-more-popover {
                width: 240px;
                right: -4px;
            }
            .pcis-halls-popover {
                bottom: calc(100% + 12px);
            }
            .pcis-dock-setup-bar {
                bottom: calc(100% + 8px);
                padding: 4px 6px;
                gap: 5px;
            }
            .pcis-dock-setup-bar .pcis-setup-chip {
                padding: 4px 10px;
                font-size: 11px;
            }
        }

        @media (max-width: 440px) {
            .pcis-dock-wrap {
                width: calc(100vw - 36px);
                max-width: 375px;
            }
            .pcis-nav-dock {
                height: 56px;
                padding: 2px 4px;
                border-radius: 16px;
            }
            .pcis-dock-tab {
                flex: 1;
                min-width: 0;
                height: 48px;
                padding: 2px 1px;
            }
            .pcis-dock-icon { font-size: 15px; }
            .pcis-dock-label { font-size: 10px; }
            .pcis-dock-sep { height: 14px; }
            .pcis-more-popover {
                width: min(250px, calc(100vw - 24px));
                right: -6px;
            }
            .pcis-halls-popover {
                width: min(320px, calc(100vw - 24px));
                left: -6px;
                bottom: calc(100% + 10px);
            }
            .pcis-dock-setup-bar {
                bottom: calc(100% + 8px);
                padding: 3px 5px;
                gap: 3px;
                max-width: calc(100vw - 20px);
            }
            .pcis-dock-setup-bar .pcis-setup-chip {
                padding: 3px 8px;
                font-size: 10.5px;
                gap: 3px;
            }
            .pcis-dock-setup-bar .pcis-setup-chip i {
                font-size: 10px;
            }
        }
    `;
    document.head.appendChild(style);

    // ─── Build DOM ──────────────────────────────────────────────
    const wrap = document.createElement("div");
    wrap.id = "pcis-nav-dock";
    wrap.className = "pcis-dock-wrap";

    wrap.innerHTML = `
        <!-- Floating Popover Menu 1: Exhibition Halls A–D (Clean List) -->
        <div class="pcis-halls-popover" id="pcis-halls-popover" role="dialog" aria-label="Exhibition Halls">
            <div class="pcis-popover-header">
                <span class="pcis-popover-heading">Exhibition Halls A–D</span>
            </div>

            <!-- Dynamic Halls List -->
            <div class="pcis-halls-list" id="pcis-halls-list"></div>
        </div>

        <!-- Floating Popover Menu 2: More Features (Explore All, Street View Modal, Directions, Booking) -->
        <div class="pcis-more-popover" id="pcis-more-popover" role="dialog" aria-label="Venue Features">
            <div class="pcis-popover-header">
                <span class="pcis-popover-heading">Venue Features</span>
            </div>

            <!-- 1. Explore All Views (Preserved Legacy Modal) -->
            <button class="pcis-popover-item" id="popover-btn-explore" type="button" aria-label="Explore all exhibition halls & facilities">
                <span class="pcis-popover-icon"><i class="fi fi-sr-tour-virtual" aria-hidden="true"></i></span>
                <div class="pcis-popover-text">
                    <span class="pcis-popover-title">Explore All Views</span>
                    <span class="pcis-popover-sub">17 Indoor Panoramas &amp; Suites</span>
                </div>
            </button>

            <!-- 2. Site Map (Interactive Campus Map & Live Radar Cone) -->
            <button class="pcis-popover-item" id="popover-btn-sitemap" type="button" aria-label="Interactive Campus Site Map and Floor Plan">
                <span class="pcis-popover-icon"><i class="fi fi-sr-map" aria-hidden="true"></i></span>
                <div class="pcis-popover-text">
                    <span class="pcis-popover-title">Site Map</span>
                    <span class="pcis-popover-sub">Interactive 2D Map &amp; Radar Cone</span>
                </div>
            </button>

            <!-- 3. Street View Modal (Preserved Legacy GSV Popup) -->
            <button class="pcis-popover-item" id="popover-btn-street-legacy" type="button" aria-label="Open Google Street View standalone modal">
                <span class="pcis-popover-icon"><i class="fi fi-sr-street-view" aria-hidden="true"></i></span>
                <div class="pcis-popover-text">
                    <span class="pcis-popover-title">Street View (Modal)</span>
                    <span class="pcis-popover-sub">7 Outdoor Campus Grounds</span>
                </div>
            </button>

            <!-- 3. Directions -->
            <button class="pcis-popover-item" id="popover-btn-directions" type="button" aria-label="Venue Directions and Map">
                <span class="pcis-popover-icon"><i class="fi fi-ss-marker" aria-hidden="true"></i></span>
                <div class="pcis-popover-text">
                    <span class="pcis-popover-title">Directions</span>
                    <span class="pcis-popover-sub">24 Venue GPS routes &amp; map</span>
                </div>
            </button>

            <!-- 4. Event Cost Estimator (Instant Quote Calculator) -->
            <button class="pcis-popover-item" id="popover-btn-quote" type="button" aria-label="Open Event Cost and Hall Rental Estimator">
                <span class="pcis-popover-icon" style="color:#B45309; background:rgba(255, 183, 3, 0.15); border-color:rgba(255, 183, 3, 0.4);"><i class="fi fi-sr-calculator" aria-hidden="true"></i></span>
                <div class="pcis-popover-text">
                    <span class="pcis-popover-title">Cost Estimator</span>
                    <span class="pcis-popover-sub">Instant Hall Rental &amp; Quote Builder</span>
                </div>
            </button>

            <!-- 5. Booking & Inquiries -->
            <button class="pcis-popover-item" id="popover-btn-social" type="button" aria-label="Venue Booking and Event Inquiries">
                <span class="pcis-popover-icon"><i class="fi fi-sr-phone-call" aria-hidden="true"></i></span>
                <div class="pcis-popover-text">
                    <span class="pcis-popover-title">Book Venue &amp; Info</span>
                    <span class="pcis-popover-sub">Hotline: +91 85258 11111</span>
                </div>
            </button>
        </div>

        <!-- Floating Popover Menu 3: Segmented Campus Explore Hub (Option A+) -->
        <div class="pcis-explore-popover" id="pcis-explore-popover" role="dialog" aria-label="Campus Grounds and Sanctuaries Explorer">
            <!-- Segmented Pill Switcher -->
            <div class="pcis-explore-tabs" role="tablist" aria-label="Explore Categories">
                <button type="button" class="pcis-explore-tab-btn is-active" id="explore-tab-outdoor" role="tab" aria-selected="true" data-tab="outdoor">
                    <i class="fi fi-rr-road" aria-hidden="true"></i> Outdoor (7)
                </button>
                <button type="button" class="pcis-explore-tab-btn" id="explore-tab-indoor" role="tab" aria-selected="false" data-tab="indoor">
                    <i class="fi fi-sr-building" aria-hidden="true"></i> Indoor (17)
                </button>
            </div>

            <!-- Instant Search Input -->
            <div class="pcis-explore-search-wrap">
                <i class="fi fi-rr-search pcis-explore-search-icon" aria-hidden="true"></i>
                <input type="text" id="pcis-explore-search" class="pcis-explore-search-input" placeholder="Search grounds, halls & facilities..." autocomplete="off" spellcheck="false" aria-label="Search campus grounds and indoor venues" />
            </div>

            <!-- Outdoor Grounds List -->
            <div class="pcis-explore-scroll-area" id="pcis-explore-list-outdoor" role="tabpanel" aria-labelledby="explore-tab-outdoor">
                <button class="pcis-popover-item pcis-pov-item" type="button" data-povid="arrival-gate">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-road"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Grand Arrival Gate</span>
                        <span class="pcis-popover-sub">Highway Arch &amp; NH-4 Frontage</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pov">Street View</span>
                </button>
                <button class="pcis-popover-item pcis-pov-item" type="button" data-povid="driveway-network">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-shield-check"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Internal Driveway Network</span>
                        <span class="pcis-popover-sub">8m Roadway &amp; Sidewalks</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pov">Street View</span>
                </button>
                <button class="pcis-popover-item pcis-pov-item" type="button" data-povid="canvas1">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-flag"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">THE CANVAS 1</span>
                        <span class="pcis-popover-sub">93,980 sq. ft. Concrete Arena</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pov">Street View</span>
                </button>
                <button class="pcis-popover-item pcis-pov-item" type="button" data-povid="canvas2">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-flag"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">THE CANVAS 2</span>
                        <span class="pcis-popover-sub">1,89,564 sq. ft. Concert Grounds</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pov">Street View</span>
                </button>
                <button class="pcis-popover-item pcis-pov-item" type="button" data-povid="parking1">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-car"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Parking Zone 1 (Halls)</span>
                        <span class="pcis-popover-sub">Trade Halls Dedicated Paved Bays</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pov">Street View</span>
                </button>
                <button class="pcis-popover-item pcis-pov-item" type="button" data-povid="parking2">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-car-alt"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Parking Zone 2 (Plaza)</span>
                        <span class="pcis-popover-sub">Entrance Plaza (8,000+ Vehicles)</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pov">Street View</span>
                </button>
                <button class="pcis-popover-item pcis-pov-item" type="button" data-povid="perimeter">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-vector-alt"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Venue Perimeter</span>
                        <span class="pcis-popover-sub">Boundary Landscaping &amp; Buffer</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pov">Street View</span>
                </button>
            </div>

            <!-- Indoor Sanctuaries List -->
            <div class="pcis-explore-scroll-area" id="pcis-explore-list-indoor" role="tabpanel" aria-labelledby="explore-tab-indoor" style="display:none;">
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Hall A - Classroom">
                    <span class="pcis-popover-icon"><i class="fi fi-sr-building"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Exhibition Hall A</span>
                        <span class="pcis-popover-sub">54,144 sq. ft • 5T/m² Floor Load</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Hall B - Classroom">
                    <span class="pcis-popover-icon"><i class="fi fi-sr-building"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Exhibition Hall B</span>
                        <span class="pcis-popover-sub">54,144 sq. ft • Pillarless Mega Hall</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Hall C - Classroom">
                    <span class="pcis-popover-icon"><i class="fi fi-sr-building"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Exhibition Hall C</span>
                        <span class="pcis-popover-sub">54,144 sq. ft • 252 Rigging Points</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Hall D - Classroom">
                    <span class="pcis-popover-icon"><i class="fi fi-sr-building"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Exhibition Hall D</span>
                        <span class="pcis-popover-sub">47,762 sq. ft • Widest 45m Hall</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Entrance Plaza & Foyer">
                    <span class="pcis-popover-icon"><i class="fi fi-sr-archway"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Entrance Plaza &amp; Foyer</span>
                        <span class="pcis-popover-sub">20,300 sq. ft • Grand Welcome Concourse</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Executive Hospitality Pavilion">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-briefcase"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Executive Hospitality Pavilion</span>
                        <span class="pcis-popover-sub">VIP Business Delegation Wing</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Private Meeting Suites">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-users"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Private Meeting Suites</span>
                        <span class="pcis-popover-sub">4 Acoustic B2B Meeting Suites</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Executive Meeting Room">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-screen"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Executive Meeting Room</span>
                        <span class="pcis-popover-sub">6-Seater Smart Hybrid Suite</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Corporate Boardroom">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-user-tie"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Corporate Boardroom</span>
                        <span class="pcis-popover-sub">12-Seater Flagship Executive Chamber</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="VIP Lounge">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-crown"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">VIP Lounge</span>
                        <span class="pcis-popover-sub">Luxury Hospitality Enclave</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Co-Working Lounge">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-laptop"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Co-Working Lounge</span>
                        <span class="pcis-popover-sub">35-Desk Collaboration Hub</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Curated Café Area">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-coffee"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Curated Café Area</span>
                        <span class="pcis-popover-sub">Artisan Barista &amp; Refreshment Bar</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Food Court">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-restaurant"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Food Court</span>
                        <span class="pcis-popover-sub">17,300 sq. ft • 14 Vendor Kiosks</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Food Court Dining Area">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-utensils"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Food Court Dining Area</span>
                        <span class="pcis-popover-sub">9,064 sq. ft • 800+ Seated Capacity</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="On-Site Hotel">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-bed"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">On-Site Hotel</span>
                        <span class="pcis-popover-sub">60-Key Dedicated Guest Rooms</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Inter-Hall Covered Connection">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-route"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Inter-Hall Covered Connection</span>
                        <span class="pcis-popover-sub">Weather-Protected Concourse Spine</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
                <button class="pcis-popover-item pcis-indoor-item" type="button" data-media="Washroom/Amenity Area">
                    <span class="pcis-popover-icon"><i class="fi fi-rr-sparkles"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">Washroom &amp; Amenity Facilities</span>
                        <span class="pcis-popover-sub">High-Capacity Universal Restrooms</span>
                    </div>
                    <span class="pcis-explore-badge pcis-badge-pano">360° Tour</span>
                </button>
            </div>

            <!-- Empty Search State -->
            <div class="pcis-explore-empty" id="pcis-explore-empty">
                No matching locations found
            </div>
        </div>

        <!-- Floating Setup Layout Filter Bar (Floats directly above Control Dock — strictly for Halls A–D) -->
        <div class="pcis-dock-setup-bar" id="pcis-dock-setup-bar" role="group" aria-label="Hall Seating Layout Filters">
            <button type="button" class="pcis-setup-chip active" data-setup="classroom" title="Classroom Table & Chair Setup"><i class="fi fi-rr-users-class"></i> Classroom</button>
            <button type="button" class="pcis-setup-chip" data-setup="theatre" title="Auditorium & Theatre Row Setup"><i class="fi fi-rr-chair"></i> Theatre</button>
            <button type="button" class="pcis-setup-chip" data-setup="cabaret" title="Banquet & Round Table Cabaret Setup"><i class="fi fi-rr-glass-cheers"></i> Cabaret</button>
        </div>

        <nav class="pcis-nav-dock" aria-label="Venue Navigation">
            <!-- Sliding Active Indicator Pill -->
            <div class="pcis-dock-pill" id="pcis-dock-pill" aria-hidden="true"></div>

            <!-- 1. Entrance -->
            <button class="pcis-dock-tab" id="dock-tab-entrance" type="button" aria-label="Go to Grand Entrance Plaza & Foyer">
                <span class="pcis-dock-icon"><i class="fi fi-sr-archway" aria-hidden="true"></i></span>
                <span class="pcis-dock-label">Entrance</span>
            </button>

            <span class="pcis-dock-sep" aria-hidden="true"></span>

            <!-- 2. Halls -->
            <button class="pcis-dock-tab" id="dock-tab-halls" type="button" aria-label="Select Exhibition Halls A–D" aria-haspopup="true" aria-expanded="false">
                <span class="pcis-dock-icon"><i class="fi fi-sr-building" aria-hidden="true"></i></span>
                <span class="pcis-dock-label">Halls</span>
            </button>

            <span class="pcis-dock-sep" aria-hidden="true"></span>

            <!-- 3. Explore (Campus Grounds POV) -->
            <button class="pcis-dock-tab" id="dock-tab-explore" type="button" aria-label="Explore campus grounds & outdoor viewpoints" aria-haspopup="true" aria-expanded="false">
                <span class="pcis-dock-icon"><i class="fi fi-sr-tour-virtual" aria-hidden="true"></i></span>
                <span class="pcis-dock-label">Explore</span>
            </button>

            <span class="pcis-dock-sep" aria-hidden="true"></span>

            <!-- 4. Specs -->
            <button class="pcis-dock-tab" id="dock-tab-3d" type="button" aria-label="Open EVP Specifications & Factsheet">
                <span class="pcis-dock-icon"><i class="fi fi-rr-document-signed" aria-hidden="true"></i></span>
                <span class="pcis-dock-label">Specs</span>
            </button>

            <span class="pcis-dock-sep" aria-hidden="true"></span>

            <!-- 5. More -->
            <button class="pcis-dock-tab" id="dock-tab-more" type="button" aria-label="More venue options" aria-haspopup="true" aria-expanded="false">
                <span class="pcis-dock-icon"><i class="fi fi-sr-apps" aria-hidden="true"></i></span>
                <span class="pcis-dock-label">More</span>
            </button>
        </nav>
    `;

    document.body.appendChild(wrap);

    const pill = document.getElementById("pcis-dock-pill");
    const entranceBtn = document.getElementById("dock-tab-entrance");
    const hallsBtn = document.getElementById("dock-tab-halls");
    const exploreBtn = document.getElementById("dock-tab-explore");
    const tour3dBtn = document.getElementById("dock-tab-3d");
    const moreBtn = document.getElementById("dock-tab-more");

    const popover = document.getElementById("pcis-more-popover");
    const hallsPopover = document.getElementById("pcis-halls-popover");
    const explorePopover = document.getElementById("pcis-explore-popover");
    const popExplore = document.getElementById("popover-btn-explore");
    const popSiteMap = document.getElementById("popover-btn-sitemap");
    const legacyStreetBtn = document.getElementById("popover-btn-street-legacy");
    const popDirections = document.getElementById("popover-btn-directions");
    const popQuote = document.getElementById("popover-btn-quote");
    const popSocial = document.getElementById("popover-btn-social");

    let activeTab = null;

    function movePillTo(tab) {
        if (!pill || !tab) return;
        const nav = wrap.querySelector(".pcis-nav-dock");
        if (!nav) return;
        const navRect = nav.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        const barWidth = Math.max(26, Math.min(Math.round(tabRect.width * 0.52), 38));
        const leftOffset = (tabRect.left - navRect.left) + (tabRect.width - barWidth) / 2;
        pill.style.transform = `translateX(${leftOffset}px)`;
        pill.style.width = `${barWidth}px`;
        pill.style.opacity = "1";
    }

    function clearPill() {
        if (!pill) return;
        pill.style.opacity = "0";
    }

    function setActiveTab(tab) {
        if (activeTab && activeTab !== tab) {
            activeTab.classList.remove("is-active");
        }
        activeTab = tab;
        if (tab) {
            tab.classList.add("is-active");
            movePillTo(tab);
        } else {
            [entranceBtn, hallsBtn, exploreBtn, tour3dBtn, moreBtn].forEach(function (b) {
                if (b) b.classList.remove("is-active");
            });
            clearPill();
        }
    }

    function flashTab(tab) {
        setActiveTab(tab);
        setTimeout(function () {
            if (tab === entranceBtn) {
                setActiveTab(null);
            }
        }, 360);
    }

    // ── Popovers Management ──
    function closeAllPopovers() {
        closeHallsPopover();
        closeExplorePopover();
        closePopover();
    }

    function openHallsPopover() {
        if (!hallsPopover || !hallsBtn) return;
        closeExplorePopover();
        closePopover();
        hallsPopover.classList.add("is-open");
        hallsBtn.setAttribute("aria-expanded", "true");
        setActiveTab(hallsBtn);
        syncSetupBarVisibility();
    }

    function closeHallsPopover() {
        if (!hallsPopover || !hallsBtn) return;
        hallsPopover.classList.remove("is-open");
        hallsBtn.setAttribute("aria-expanded", "false");
        if (activeTab === hallsBtn) {
            setActiveTab(null);
        }
        syncSetupBarVisibility();
    }

    function toggleHallsPopover() {
        if (!hallsPopover) return;
        if (hallsPopover.classList.contains("is-open")) {
            closeHallsPopover();
        } else {
            openHallsPopover();
        }
    }

    function openExplorePopover() {
        if (!explorePopover || !exploreBtn) return;
        closeHallsPopover();
        closePopover();
        explorePopover.classList.add("is-open");
        exploreBtn.setAttribute("aria-expanded", "true");
        setActiveTab(exploreBtn);
        syncSetupBarVisibility();
    }

    function closeExplorePopover() {
        if (!explorePopover || !exploreBtn) return;
        explorePopover.classList.remove("is-open");
        exploreBtn.setAttribute("aria-expanded", "false");
        if (activeTab === exploreBtn) {
            setActiveTab(null);
        }
        syncSetupBarVisibility();
    }

    function toggleExplorePopover() {
        if (!explorePopover) return;
        if (explorePopover.classList.contains("is-open")) {
            closeExplorePopover();
        } else {
            openExplorePopover();
        }
    }

    function openPopover() {
        if (!popover || !moreBtn) return;
        closeHallsPopover();
        closeExplorePopover();
        popover.classList.add("is-open");
        moreBtn.setAttribute("aria-expanded", "true");
        setActiveTab(moreBtn);
    }

    function closePopover() {
        if (!popover || !moreBtn) return;
        popover.classList.remove("is-open");
        moreBtn.setAttribute("aria-expanded", "false");
        if (activeTab === moreBtn) {
            setActiveTab(null);
        }
    }

    function togglePopover() {
        if (!popover) return;
        if (popover.classList.contains("is-open")) {
            closePopover();
        } else {
            openPopover();
        }
    }

    // ─── 1. Entrance Click ──────────────────────────────────────
    entranceBtn.addEventListener("click", function () {
        closeAllPopovers();
        flashTab(entranceBtn);
        if (typeof window.exitGsvPov === "function") {
            window.exitGsvPov();
        }
        if (window.tour && typeof window.tour.setMediaByName === "function") {
            window.tour.setMediaByName("Entrance Plaza & Foyer");
        } else if (window.tour && typeof window.tour.setMediaByIndex === "function") {
            window.tour.setMediaByIndex(0);
        } else {
            console.log("[Dock] Entrance scene navigation triggered");
        }
        setTimeout(syncSetupBarVisibility, 400);
    });

    // ─── 2. Halls Click (Toggle Quick Picker) ───────────────────
    hallsBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleHallsPopover();
    });

    // ─── Halls Setup Configurations & Live Pano Switching ────────
    const SETUP_MEDIA_NAME = {
        classroom: "Classroom",
        theatre: "Theatre",
        cabaret: "Cabaret"
    };

    const HALL_SETUPS = {
        classroom: {
            label: "Classroom Table Setup",
            halls: [
                { id: "Hall A", title: "Exhibition Hall A", sub: "1,200–1,300 Seats • Classroom Study & Seminar Tables", icon: "fi fi-sr-building", badge: "1,300 Seats" },
                { id: "Hall B", title: "Exhibition Hall B", sub: "1,200–1,300 Seats • Classroom Conference Layout", icon: "fi fi-sr-building", badge: "1,300 Seats" },
                { id: "Hall C", title: "Exhibition Hall C", sub: "1,200–1,300 Seats • Training & Work Table Layout", icon: "fi fi-sr-building", badge: "1,300 Seats" },
                { id: "Hall D", title: "Exhibition Hall D", sub: "900–1,000 Seats • Wide Classroom Seminar Staging", icon: "fi fi-sr-building", badge: "1,000 Seats" }
            ]
        },
        theatre: {
            label: "Theatre Setup",
            halls: [
                { id: "Hall A", title: "Exhibition Hall A", sub: "2,400–2,600 Seats • Keynote & Plenary Row Setup", icon: "fi fi-sr-building", badge: "2,600 Seats" },
                { id: "Hall B", title: "Exhibition Hall B", sub: "2,400–2,600 Seats • Convention Auditorium Layout", icon: "fi fi-sr-building", badge: "2,600 Seats" },
                { id: "Hall C", title: "Exhibition Hall C", sub: "2,400–2,600 Seats • Summit & Keynote Rows", icon: "fi fi-sr-building", badge: "2,600 Seats" },
                { id: "Hall D", title: "Exhibition Hall D", sub: "1,800–2,000 Seats • Wide Plenary Theatre Layout", icon: "fi fi-sr-building", badge: "2,000 Seats" }
            ]
        },
        cabaret: {
            label: "Cabaret Setup",
            halls: [
                { id: "Hall A", title: "Exhibition Hall A", sub: "990 Seats (330 Tables) • Round Banquet Clusters", icon: "fi fi-sr-building", badge: "990 Seats" },
                { id: "Hall B", title: "Exhibition Hall B", sub: "990 Seats (330 Tables) • Banquet & Dinner Clusters", icon: "fi fi-sr-building", badge: "990 Seats" },
                { id: "Hall C", title: "Exhibition Hall C", sub: "990 Seats (330 Tables) • Networking Cabaret Tables", icon: "fi fi-sr-building", badge: "990 Seats" },
                { id: "Hall D", title: "Exhibition Hall D", sub: "765 Seats (255 Tables) • Wide Gala Banquet Format", icon: "fi fi-sr-building", badge: "765 Seats" }
            ]
        }
    };

    let currentHallSetup = "classroom";
    let lastSelectedHall = "Hall A";

    const HALL_PANO_REGEX = /^Hall\s+([ABCD])\s*-\s*(Classroom|Theatre|Cabaret)$/i;

    function getCurrentSceneName() {
        try {
            if (window.tour && typeof window.tour._getRootPlayer === "function") {
                const rootPlayer = window.tour._getRootPlayer();
                const viewer = rootPlayer.getMainViewer();
                const media = rootPlayer.getActiveMediaWithViewer(viewer);
                if (media) {
                    const data = media.get("data") || {};
                    return data.label || media.get("id") || "";
                }
            }
        } catch (e) {}
        const locEl = document.getElementById("spatial-location-name");
        if (locEl && locEl.textContent) {
            return locEl.textContent.trim();
        }
        return "";
    }

    function isHallScene(name) {
        if (!name) return false;
        return HALL_PANO_REGEX.test(name.trim());
    }

    function parseHallScene(name) {
        if (!name) return null;
        const m = name.trim().match(HALL_PANO_REGEX);
        if (m) {
            return {
                hall: `Hall ${m[1].toUpperCase()}`,
                setup: m[2].toLowerCase()
            };
        }
        return null;
    }

    function getActiveHallName() {
        const name = getCurrentSceneName();
        const parsed = parseHallScene(name);
        if (parsed) {
            return parsed.hall;
        }
        return lastSelectedHall || "Hall A";
    }

    function syncSetupBarVisibility() {
        const setupBar = document.getElementById("pcis-dock-setup-bar");
        if (!setupBar) return;

        // If Street View POV is currently active, hide setup bar & deactivate halls tab
        if (window.isGsvPovActive && window.isGsvPovActive()) {
            setupBar.classList.remove("is-visible");
            if (activeTab === hallsBtn) {
                setActiveTab(null);
            }
            return;
        }

        const currentName = getCurrentSceneName();
        const parsed = parseHallScene(currentName);

        if (parsed) {
            // Strictly visible when inside Hall A–D panoramas
            setupBar.style.display = "";
            lastSelectedHall = parsed.hall;
            currentHallSetup = parsed.setup;

            setupBar.querySelectorAll(".pcis-setup-chip").forEach(function (c) {
                if (c.getAttribute("data-setup") === parsed.setup) {
                    c.classList.add("active");
                } else {
                    c.classList.remove("active");
                }
            });

            setupBar.classList.add("is-visible");

            // Sync dock active tab to Halls if no popovers are open
            const isAnyPopoverOpen = (hallsPopover && hallsPopover.classList.contains("is-open")) ||
                                     (explorePopover && explorePopover.classList.contains("is-open")) ||
                                     (popover && popover.classList.contains("is-open"));
            if (!isAnyPopoverOpen && activeTab !== hallsBtn) {
                setActiveTab(hallsBtn);
            }
        } else {
            // Any other scene (Entrance, Concourse, Hotel, VIP, etc.) -> Strictly Hidden
            setupBar.classList.remove("is-visible");
            if (activeTab === hallsBtn) {
                setActiveTab(null);
            }
        }
    }

    function showSetupToast(hallName, setupLabel) {
        let toast = document.getElementById("pcis-hall-setup-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "pcis-hall-setup-toast";
            toast.className = "pcis-hall-setup-toast";
            document.body.appendChild(toast);
        }
        const topWidget = document.getElementById("pcis-location-widget");
        if (topWidget) {
            const rect = topWidget.getBoundingClientRect();
            const gap = window.innerWidth <= 768 ? 12 : 14;
            toast.style.top = (rect.bottom + gap) + "px";
        }
        toast.innerHTML = `<span class="pcis-toast-dot"></span><span>${hallName} • ${setupLabel}</span>`;
        toast.classList.add("is-visible");
        clearTimeout(toast._timer);
        toast._timer = setTimeout(function () {
            toast.classList.remove("is-visible");
        }, 3000);
    }

    function renderHallsList(setupKey) {
        const listEl = document.getElementById("pcis-halls-list");
        if (!listEl) return;
        const key = setupKey || currentHallSetup || "classroom";
        const config = HALL_SETUPS[key] || HALL_SETUPS.classroom;

        listEl.innerHTML = config.halls.map(function (hall) {
            return `
                <button class="pcis-popover-item btn-hall-jump" data-hall="${hall.id}" type="button" aria-label="Jump to ${hall.title}">
                    <span class="pcis-popover-icon"><i class="${hall.icon}" aria-hidden="true"></i></span>
                    <div class="pcis-popover-text">
                        <span class="pcis-popover-title">${hall.title}</span>
                        <span class="pcis-popover-sub">${hall.sub}</span>
                    </div>
                    ${hall.badge ? `<span class="pcis-hall-badge">${hall.badge}</span>` : ""}
                </button>
            `;
        }).join("");

        listEl.querySelectorAll(".btn-hall-jump").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                const targetHall = btn.getAttribute("data-hall");
                lastSelectedHall = targetHall;

                // Reset layout filter to the first setup: Classroom
                currentHallSetup = "classroom";
                const targetMedia = `${targetHall} - Classroom`;

                closeHallsPopover();
                flashTab(hallsBtn);

                if (typeof window.exitGsvPov === "function") {
                    window.exitGsvPov();
                }

                if (window.tour && typeof window.tour.setMediaByName === "function") {
                    window.tour.setMediaByName(targetMedia);
                }

                // Reset floating filter bar highlight to first chip (classroom)
                const setupBar = document.getElementById("pcis-dock-setup-bar");
                if (setupBar) {
                    setupBar.querySelectorAll(".pcis-setup-chip").forEach(function (c) {
                        c.classList.toggle("active", c.getAttribute("data-setup") === "classroom");
                    });
                    setupBar.classList.add("is-visible");
                }

                showSetupToast(targetHall, HALL_SETUPS.classroom.label);
                setTimeout(syncSetupBarVisibility, 350);
            });
        });
    }

    // Attach setup chips filter listeners on floating dock bar
    const dockSetupBar = document.getElementById("pcis-dock-setup-bar");
    if (dockSetupBar) {
        dockSetupBar.querySelectorAll(".pcis-setup-chip").forEach(function (chip) {
            chip.addEventListener("click", function (e) {
                e.stopPropagation();
                const setupKey = chip.getAttribute("data-setup");
                currentHallSetup = setupKey;

                if (typeof window.exitGsvPov === "function") {
                    window.exitGsvPov();
                }

                dockSetupBar.querySelectorAll(".pcis-setup-chip").forEach(c => c.classList.remove("active"));
                chip.classList.add("active");

                const activeHall = getActiveHallName();
                const setupSuffix = SETUP_MEDIA_NAME[setupKey] || "Classroom";
                const targetMedia = `${activeHall} - ${setupSuffix}`;

                if (window.tour && typeof window.tour.setMediaByName === "function") {
                    window.tour.setMediaByName(targetMedia);
                }

                showSetupToast(activeHall, HALL_SETUPS[setupKey]?.label || setupSuffix);
                setTimeout(syncSetupBarVisibility, 350);
            });
        });
    }

    // Initial render of halls list & visibility sync
    renderHallsList("classroom");

    if (window.tour && typeof window.tour.on === "function") {
        window.tour.on("mediaChange", syncSetupBarVisibility);
    } else if (window.tour && window.tour.player && typeof window.tour.player.on === "function") {
        window.tour.player.on("mediaChange", syncSetupBarVisibility);
    }
    setInterval(syncSetupBarVisibility, 2000);
    syncSetupBarVisibility();

    // ─── 3. Explore Click (Segmented Campus Grounds & Sanctuaries Hub) ───────────
    if (exploreBtn) {
        exploreBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleExplorePopover();
        });
    }

    const tabOutdoor = wrap.querySelector("#explore-tab-outdoor");
    const tabIndoor = wrap.querySelector("#explore-tab-indoor");
    const listOutdoor = wrap.querySelector("#pcis-explore-list-outdoor");
    const listIndoor = wrap.querySelector("#pcis-explore-list-indoor");
    const searchInput = wrap.querySelector("#pcis-explore-search");
    const emptyNotice = wrap.querySelector("#pcis-explore-empty");
    let currentExploreTab = "outdoor";

    function filterExploreItems() {
        if (!searchInput) return;
        const query = searchInput.value.trim().toLowerCase();
        const activeList = currentExploreTab === "outdoor" ? listOutdoor : listIndoor;
        if (!activeList) return;

        let visibleCount = 0;
        const items = activeList.querySelectorAll(".pcis-popover-item");
        items.forEach(function (item) {
            const title = (item.querySelector(".pcis-popover-title")?.textContent || "").toLowerCase();
            const sub = (item.querySelector(".pcis-popover-sub")?.textContent || "").toLowerCase();
            const match = !query || title.includes(query) || sub.includes(query);
            item.style.display = match ? "flex" : "none";
            if (match) visibleCount++;
        });

        if (emptyNotice) {
            emptyNotice.style.display = visibleCount === 0 ? "block" : "none";
        }
    }

    function switchExploreTab(tabName) {
        currentExploreTab = tabName;
        if (tabName === "outdoor") {
            if (tabOutdoor) {
                tabOutdoor.classList.add("is-active");
                tabOutdoor.setAttribute("aria-selected", "true");
            }
            if (tabIndoor) {
                tabIndoor.classList.remove("is-active");
                tabIndoor.setAttribute("aria-selected", "false");
            }
            if (listOutdoor) listOutdoor.style.display = "flex";
            if (listIndoor) listIndoor.style.display = "none";
        } else {
            if (tabIndoor) {
                tabIndoor.classList.add("is-active");
                tabIndoor.setAttribute("aria-selected", "true");
            }
            if (tabOutdoor) {
                tabOutdoor.classList.remove("is-active");
                tabOutdoor.setAttribute("aria-selected", "false");
            }
            if (listIndoor) listIndoor.style.display = "flex";
            if (listOutdoor) listOutdoor.style.display = "none";
        }
        filterExploreItems();
    }

    if (tabOutdoor && tabIndoor) {
        tabOutdoor.addEventListener("click", function (e) {
            e.stopPropagation();
            switchExploreTab("outdoor");
        });
        tabIndoor.addEventListener("click", function (e) {
            e.stopPropagation();
            switchExploreTab("indoor");
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterExploreItems);
        searchInput.addEventListener("click", function (e) {
            e.stopPropagation();
        });
        searchInput.addEventListener("keydown", function (e) {
            e.stopPropagation();
            if (e.key === "Escape") {
                if (searchInput.value) {
                    searchInput.value = "";
                    filterExploreItems();
                } else {
                    closeExplorePopover();
                }
            }
        });
    }

    // Attach click listeners to outdoor POV items in the Explore popover
    const povItems = wrap.querySelectorAll(".pcis-pov-item");
    povItems.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            closeAllPopovers();
            const povId = btn.getAttribute("data-povid");
            if (typeof window.playGsvPovLocation === "function") {
                window.playGsvPovLocation(povId);
            }
            setActiveTab(exploreBtn);
        });
    });

    // Attach click listeners to indoor sanctuary items in the Explore popover
    const indoorItems = wrap.querySelectorAll(".pcis-indoor-item");
    indoorItems.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            closeAllPopovers();
            const mediaName = btn.getAttribute("data-media");

            // Safely dismiss outdoor POV layer if active
            if (window.isGsvPovActive && window.isGsvPovActive()) {
                if (typeof window.exitGsvPov === "function") {
                    window.exitGsvPov();
                }
            }

            if (window.tour && typeof window.tour.setMediaByName === "function") {
                window.tour.setMediaByName(mediaName);
            } else {
                console.log("[Explore] Jump to indoor scene:", mediaName);
            }

            const parsed = parseHallScene(mediaName);
            if (parsed) {
                lastSelectedHall = parsed.hall;
                currentHallSetup = parsed.setup;
                setActiveTab(hallsBtn);

                const setupBar = document.getElementById("pcis-dock-setup-bar");
                if (setupBar) {
                    setupBar.style.display = "";
                    setupBar.querySelectorAll(".pcis-setup-chip").forEach(function (c) {
                        c.classList.toggle("active", c.getAttribute("data-setup") === parsed.setup);
                    });
                    setupBar.classList.add("is-visible");
                }
                showSetupToast(parsed.hall, HALL_SETUPS[parsed.setup]?.label || "Classroom Setup");
            } else if (mediaName && mediaName.toLowerCase().includes("entrance")) {
                flashTab(entranceBtn);
            } else {
                setActiveTab(null);
            }

            setTimeout(syncSetupBarVisibility, 400);
        });
    });

    // Reset explore tab dock highlight and sync setup bar whenever Street View deactivates
    document.addEventListener("gsvPovDeactivated", function () {
        if (activeTab === exploreBtn) {
            setActiveTab(null);
        }
        syncSetupBarVisibility();
    });

    // ─── 4. Specs / Factsheet PDF Click ────────────────────────
    if (tour3dBtn) {
        tour3dBtn.addEventListener("click", function () {
            closeAllPopovers();
            if (typeof window.openDisclosure === "function") {
                window.openDisclosure();
            } else if (typeof window.toggleDisclosure === "function") {
                window.toggleDisclosure();
            } else if (typeof window.evpToggleSpecs === "function") {
                window.evpToggleSpecs();
            } else if (typeof window.open3dTour === "function") {
                window.open3dTour();
            } else {
                setActiveTab(tour3dBtn);
                document.dispatchEvent(new CustomEvent("menuItemClick", { detail: { id: "menu-disclosure" } }));
            }
        });
    }

    // ─── 5. More Click (Toggle Features Popover) ────────────────
    if (moreBtn) {
        moreBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            togglePopover();
        });
    }

    // ─── Popover Item: Explore All Views ────────────────────────
    if (popExplore) {
        popExplore.addEventListener("click", function (e) {
            e.stopPropagation();
            closePopover();
            if (typeof window.openPanoDrawer === "function") {
                window.openPanoDrawer();
            } else if (typeof window.togglePanoList === "function") {
                window.togglePanoList();
            } else {
                document.dispatchEvent(new CustomEvent("menuItemClick", { detail: { id: "menu-panorama" } }));
            }
        });
    }

    // ─── Popover Item: Site Map ─────────────────────────────────
    if (popSiteMap) {
        popSiteMap.addEventListener("click", function (e) {
            e.stopPropagation();
            closePopover();
            if (typeof window.toggleFloorPlan === "function") {
                window.toggleFloorPlan();
            } else if (typeof window.openFloorPlan === "function") {
                window.openFloorPlan();
            } else {
                document.dispatchEvent(new CustomEvent("menuItemClick", { detail: { id: "menu-floorplan" } }));
            }
        });
    }

    // ─── Popover Item: Street View (Preserved Legacy Modal) ─────
    if (legacyStreetBtn) {
        legacyStreetBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            closePopover();
            if (typeof window.openGsvPopup === "function") {
                window.openGsvPopup();
            } else {
                document.dispatchEvent(new CustomEvent("menuItemClick", { detail: { id: "menu-street-view" } }));
            }
        });
    }

    // ─── Popover Item: Directions ───────────────────────────────
    if (popDirections) {
        popDirections.addEventListener("click", function (e) {
            e.stopPropagation();
            closePopover();
            if (typeof window.toggleLocation === "function") {
                window.toggleLocation();
            } else {
                document.dispatchEvent(new CustomEvent("menuItemClick", { detail: { id: "menu-location" } }));
            }
        });
    }

    // ─── Popover Item: Event Cost Estimator ─────────────────────
    if (popQuote) {
        popQuote.addEventListener("click", function (e) {
            e.stopPropagation();
            closePopover();
            if (typeof window.openQuoteEstimator === "function") {
                window.openQuoteEstimator();
            }
        });
    }

    // ─── Popover Item: Booking & Inquiries ──────────────────────
    if (popSocial) {
        popSocial.addEventListener("click", function (e) {
            e.stopPropagation();
            closePopover();
            if (typeof window.openContactModal === "function") {
                window.openContactModal();
            } else {
                document.dispatchEvent(new CustomEvent("menuItemClick", { detail: { id: "menu-contact" } }));
            }
        });
    }

    // ─── Click Outside Dismissal ────────────────────────────────
    document.addEventListener("click", function (e) {
        if (wrap && !wrap.contains(e.target)) {
            closeAllPopovers();
        }
    });

    // ─── Escape Key Dismissal ───────────────────────────────────
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" || e.key === "Esc") {
            closeAllPopovers();
        }
    });

    // ─── Listen for modal deactivations to clear active tab ─────
    document.addEventListener("menuItemDeactivate", function () {
        setActiveTab(null);
    });

    document.addEventListener("menuItemActivate", function (e) {
        if (e.detail && e.detail.id === "menu-street-view") {
            setActiveTab(streetBtn);
        } else if (e.detail && (e.detail.id === "menu-3d-tour" || e.detail.id === "dock-tour3d" || e.detail.id === "menu-disclosure")) {
            setActiveTab(tour3dBtn);
        }
    });

    document.addEventListener("panoListOpened", function () {
        closeAllPopovers();
    });

    document.addEventListener("gsvPovActivated", function () {
        if (activeTab === hallsBtn) {
            setActiveTab(null);
        }
        syncSetupBarVisibility();
    });

    document.addEventListener("gsvPovDeactivated", function () {
        setTimeout(syncSetupBarVisibility, 150);
    });

    // ─── Recalculate indicator position on resize ───────────────
    window.addEventListener("resize", function () {
        if (activeTab) {
            movePillTo(activeTab);
        }
    });
})();
