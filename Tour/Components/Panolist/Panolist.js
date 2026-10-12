// ═══════════════════════════════════════════════════════════
//  EVP TRADE & CONVENTION CENTRE — Scene Explorer & Status
//  Top-center "Now Exploring" widget + Bottom Scene Drawer
//  White frosted glassmorphism matching EVP SpatialUI tokens
// ═══════════════════════════════════════════════════════════
(function () {
    "use strict";

    if (document.getElementById("pcis-scene-explorer-root")) return;

    let allPanoramas = [];
    let currentSceneId = null;
    let isDrawerOpen = false;

    // ─── Inject Styles ──────────────────────────────────────────
    const style = document.createElement("style");
    style.id = "pcis-scene-explorer-styles";
    style.textContent = `
        /* ── Top-Center "Now Exploring" Widget ────── */
        .pcis-location-widget {
            position: fixed;
            top: max(18px, env(safe-area-inset-top));
            left: 50%;
            transform: translateX(-50%);
            z-index: 100060;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 8px 18px;
            min-width: min(340px, 32vw);
            height: 60px;
            background: rgba(255, 255, 255, 0.82);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.65);
            border-radius: 18px;
            box-shadow: 
                0 4px 12px rgba(19, 19, 48, 0.04),
                0 20px 48px rgba(19, 19, 48, 0.16),
                inset 0 1px 1px rgba(255, 255, 255, 0.8);
            cursor: pointer;
            pointer-events: auto;
            user-select: none;
            transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 300ms ease,
                        border-color 260ms ease,
                        box-shadow 260ms ease;
            font-style: normal !important;
        }

        .pcis-location-widget:hover {
            transform: translate(-50%, -2px);
            border-color: rgba(255, 183, 3, 0.45);
            box-shadow: 
                0 6px 16px rgba(19, 19, 48, 0.06),
                0 24px 54px rgba(19, 19, 48, 0.20),
                inset 0 1px 1px rgba(255, 255, 255, 0.9);
        }

        /* Copy */
        .pcis-location-copy {
            display: flex;
            flex-direction: column;
            gap: 1px;
            min-width: 0;
            overflow: hidden;
        }

        .pcis-location-tag {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #64748B;
            line-height: 1.1;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* Pulsing Live Dot */
        .pcis-live-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #25D366;
            display: inline-block;
            box-shadow: 0 0 8px rgba(37, 211, 102, 0.6);
            animation: pcisPulse 2s infinite ease-in-out;
            flex-shrink: 0;
        }

        @keyframes pcisPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.8); opacity: 0.45; }
        }

        .pcis-location-name {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 14px;
            font-weight: 800;
            color: #131330;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;
        }

        /* Right Cluster: Unified Segmented Stepper Pill */
        .pcis-location-right {
            display: flex;
            align-items: center;
            flex-shrink: 0;
        }

        .pcis-stepper-group {
            display: inline-flex;
            align-items: center;
            gap: 2px;
            background: transparent;
            border: none;
            box-shadow: none;
            flex-shrink: 0;
        }

        .pcis-stepper-btn {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: none;
            background: transparent;
            color: #131330;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 13px;
            padding: 0;
            margin: 0;
            transition: all 140ms ease;
            flex-shrink: 0;
            user-select: none;
            line-height: 1;
        }

        .pcis-stepper-btn:hover {
            background: rgba(255, 183, 3, 0.12);
            color: #B45309;
            transform: scale(1.08);
        }

        .pcis-stepper-btn:active {
            transform: scale(0.92);
        }

        .pcis-scene-badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 8px;
            border-radius: 8px;
            background: transparent;
            border: none;
            box-shadow: none;
            cursor: pointer;
            transition: background 140ms ease;
            user-select: none;
        }

        .pcis-scene-badge-pill:hover,
        .pcis-scene-badge-pill.is-active {
            background: rgba(255, 183, 3, 0.12);
        }

        .pcis-scene-count-text {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 11px;
            font-weight: 700;
            color: #131330;
            letter-spacing: 0.04em;
            white-space: nowrap;
            line-height: 1;
        }

        .pcis-location-chevron {
            font-size: 11px;
            color: #B45309;
            transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }

        .pcis-scene-badge-pill.is-active .pcis-location-chevron {
            transform: rotate(180deg);
        }

        /* ── Pull-Down Shade Dropdown Menu ─────────── */
        .pcis-scene-dropdown {
            position: fixed;
            background: rgba(255, 255, 255, 0.88);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.7);
            border-radius: 18px;
            box-shadow: 
                0 4px 12px rgba(19, 19, 48, 0.04),
                0 20px 48px rgba(19, 19, 48, 0.18),
                inset 0 1px 1px rgba(255, 255, 255, 0.9);
            padding: 8px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px) scale(0.98);
            transform-origin: top center;
            transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1),
                        transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
                        visibility 200ms ease;
            z-index: 100070;
            pointer-events: none;
            cursor: default;
            box-sizing: border-box;
        }

        .pcis-scene-dropdown.is-open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        .pcis-scene-dropdown-scroll {
            max-height: 270px;
            overflow-y: auto;
            overscroll-behavior: contain;
            display: flex;
            flex-direction: column;
            gap: 3px;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        /* Completely remove visible scrollbar */
        .pcis-scene-dropdown-scroll::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
        }

        .pcis-dropdown-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 7px 10px;
            border-radius: 12px;
            border: none;
            background: transparent;
            cursor: pointer;
            text-align: left;
            transition: background 180ms ease, transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
            width: 100%;
            font-family: inherit;
            box-sizing: border-box;
        }

        .pcis-dropdown-item:hover {
            background: rgba(255, 183, 3, 0.12);
            transform: translateX(2px);
        }

        .pcis-dropdown-item:active {
            transform: scale(0.98);
        }

        .pcis-dropdown-item.is-selected {
            background: rgba(255, 183, 3, 0.14);
            border: none;
        }

        .pcis-dropdown-item.is-selected:hover {
            background: rgba(255, 183, 3, 0.18);
            transform: translateX(2px);
        }

        /* Micro-Thumbnail */
        .pcis-dropdown-thumb-wrap {
            position: relative;
            width: 34px;
            height: 34px;
            border-radius: 10px;
            overflow: hidden;
            flex-shrink: 0;
            background: #FFFFFF;
            box-shadow: 0 2px 6px rgba(19, 19, 48, 0.05);
            border: 1px solid rgba(19, 19, 48, 0.1);
        }



        .pcis-dropdown-thumb {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .pcis-dropdown-item-num {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 11px;
            font-weight: 700;
            color: #64748B;
            line-height: 1;
            flex-shrink: 0;
            min-width: 18px;
        }

        .pcis-dropdown-item.is-selected .pcis-dropdown-item-num {
            color: #B45309;
            font-weight: 800;
        }

        .pcis-dropdown-item-title {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 13px;
            font-weight: 600;
            color: #131330;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
            line-height: 1.25;
            transition: color 180ms ease;
        }

        .pcis-dropdown-item:hover .pcis-dropdown-item-title,
        .pcis-dropdown-item.is-selected .pcis-dropdown-item-title {
            color: #B45309;
            font-weight: 700;
        }

        .pcis-dropdown-item-check {
            font-size: 11px;
            color: #B45309;
            display: flex;
            align-items: center;
            opacity: 0;
            transform: scale(0.8);
            transition: all 140ms ease;
            flex-shrink: 0;
            margin-right: 2px;
        }

        .pcis-dropdown-item.is-selected .pcis-dropdown-item-check {
            opacity: 1;
            transform: scale(1);
        }

        /* Clean Mode UI Toggle state */
        body.is-ui-hidden .pcis-location-widget {
            opacity: 0;
            transform: translate(-50%, -24px);
            pointer-events: none;
        }

        /* ── Centered Scene Explorer Backdrop ─────────── */
        .pcis-drawer-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(19, 19, 48, 0.42);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            z-index: 100070;
            opacity: 0;
            pointer-events: none;
            transition: opacity 300ms ease;
        }

        .pcis-drawer-backdrop.is-open {
            opacity: 1;
            pointer-events: auto;
        }

        /* ── Centered Spatial Scene Modal ────────────── */
        .pcis-scene-drawer {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.96);
            z-index: 100075;
            width: min(1080px, 92vw);
            height: min(720px, 86vh);
            max-height: 86vh;
            background: rgba(255, 255, 255, 0.90);
            -webkit-backdrop-filter: blur(28px) saturate(190%);
            backdrop-filter: blur(28px) saturate(190%);
            border: 1px solid rgba(255, 255, 255, 0.85);
            border-radius: 24px;
            box-shadow: 
                0 4px 12px rgba(19, 19, 48, 0.04),
                0 28px 64px rgba(19, 19, 48, 0.22),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            pointer-events: none;
            transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease;
            font-style: normal !important;
        }

        .pcis-scene-drawer.is-open {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
            pointer-events: auto;
        }

        /* Drawer Header — Frosted Institutional Glass */
        .pcis-drawer-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 24px;
            background: rgba(255, 255, 255, 0.65);
            border-bottom: 1px solid rgba(19, 19, 48, 0.08);
            position: relative;
            gap: 16px;
            flex-shrink: 0;
        }

        .pcis-drawer-titles {
            display: flex;
            align-items: center;
            gap: 14px;
            min-width: 0;
        }

        .pcis-drawer-icon-box {
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

        .pcis-drawer-heading {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .pcis-drawer-heading h2 {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 18px;
            font-weight: 800;
            color: #131330;
            margin: 0;
            line-height: 1.2;
            letter-spacing: -0.01em;
        }

        .pcis-drawer-heading p {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 12px;
            color: #64748B;
            margin: 0;
            line-height: 1.2;
            font-weight: 600;
        }

        .pcis-drawer-actions {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
        }

        /* ── Floating Bottom Search Dock (Matching GSV Style) ── */
        .pcis-drawer-bottom-dock {
            position: absolute;
            bottom: max(18px, env(safe-area-inset-bottom));
            left: 50%;
            transform: translateX(-50%);
            z-index: 25;
            display: flex;
            flex-direction: column;
            align-items: center;
            pointer-events: auto;
            user-select: none;
        }

        .pcis-drawer-search-pill {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 13px;
            font-weight: 700;
            padding: 8px 18px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.92);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.85);
            color: #131330;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.12),
                0 16px 36px rgba(19, 19, 48, 0.16),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
            -webkit-tap-highlight-color: transparent;
            outline: none;
            white-space: nowrap;
        }

        .pcis-drawer-search-pill:hover {
            color: #B45309;
            transform: translateY(-2px);
            box-shadow: 
                0 6px 18px rgba(255, 183, 3, 0.2),
                0 20px 40px rgba(19, 19, 48, 0.18);
        }

        .pcis-drawer-search-pill:active {
            transform: translateY(0) scale(0.97);
        }

        .pcis-drawer-search-pill.is-open,
        .pcis-drawer-search-pill.is-active {
            background: #131330;
            color: #FFB703;
            border-color: #131330;
            box-shadow: 0 6px 22px rgba(19, 19, 48, 0.32);
        }

        .pcis-drawer-search-pill.is-open i,
        .pcis-drawer-search-pill.is-active i {
            color: #FFB703;
        }

        .pcis-search-chevron {
            font-size: 13px;
            color: #B45309;
            transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
            margin-left: 2px;
        }

        .pcis-drawer-search-pill.is-open .pcis-search-chevron {
            transform: rotate(180deg);
        }

        /* ── Relative Search Dropdown Card (Pops upward above pill) ── */
        .pcis-drawer-search-dropdown {
            position: absolute;
            bottom: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%) translateY(8px) scale(0.96);
            width: min(340px, calc(100vw - 44px));
            background: rgba(255, 255, 255, 0.94);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.85);
            border-radius: 18px;
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
            z-index: 26;
            box-sizing: border-box;
            user-select: none;
        }

        .pcis-drawer-search-dropdown.is-open {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0) scale(1);
            pointer-events: auto;
        }

        .pcis-drawer-search-wrap {
            position: relative;
            width: 100%;
            display: flex;
            align-items: center;
        }

        .pcis-drawer-search-wrap input {
            width: 100%;
            height: 38px;
            padding: 0 32px 0 38px;
            background: #FFFFFF;
            border: 1px solid rgba(19, 19, 48, 0.12);
            border-radius: 12px;
            font-family: 'Satoshi', sans-serif !important;
            font-size: 13px;
            color: #131330;
            outline: none;
            transition: border-color 200ms ease, box-shadow 200ms ease;
            box-sizing: border-box;
            box-shadow: 0 2px 6px rgba(19, 19, 48, 0.03);
        }

        .pcis-drawer-search-wrap input::placeholder {
            color: #94A3B8;
        }

        .pcis-drawer-search-wrap input:hover {
            border-color: rgba(255, 183, 3, 0.45);
        }

        .pcis-drawer-search-wrap input:focus {
            border-color: #FFB703;
            box-shadow: 0 2px 8px rgba(255, 183, 3, 0.18);
        }

        .pcis-drawer-search-icon {
            position: absolute;
            left: 13px;
            top: 50%;
            transform: translateY(-50%);
            color: #64748B;
            font-size: 14px;
            pointer-events: none;
            transition: color 180ms ease;
        }

        .pcis-drawer-search-wrap input:focus ~ .pcis-drawer-search-icon {
            color: #B45309;
        }

        .pcis-drawer-search-clear {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #E2E8F0;
            border: none;
            color: #64748B;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0;
            font-size: 13px;
            transition: background 180ms ease, color 180ms ease, transform 180ms ease;
            outline: none !important;
        }

        .pcis-drawer-search-clear.is-visible {
            display: flex;
        }

        .pcis-drawer-search-clear:hover {
            background: #CBD5E1;
            color: #131330;
            transform: translateY(-50%) scale(1.08);
        }

        /* Close Button from Music Component (Red circular with 360deg spin) */
        .pcis-drawer-close {
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
        }

        .pcis-drawer-close i {
            font-size: 18px;
            line-height: 1;
            display: inline-flex;
            margin: 0;
            padding: 0;
            pointer-events: none;
            color: #FFFFFF;
        }

        .pcis-drawer-close:hover {
            background: #DC2626;
            color: #FFFFFF;
            transform: rotate(360deg);
        }

        .pcis-drawer-close:active {
            transform: rotate(360deg) scale(0.94);
        }

        /* Drawer Body: Scene Cards Grid */
        .pcis-drawer-body {
            padding: 22px 24px calc(72px + env(safe-area-inset-bottom));
            overflow-y: auto;
            flex: 1;
            background: transparent;
        }

        .pcis-drawer-body::-webkit-scrollbar { width: 5px; }
        .pcis-drawer-body::-webkit-scrollbar-thumb { background: rgba(19, 19, 48, 0.15); border-radius: 99px; }

        .pcis-scene-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 16px;
        }

        /* Scene Card — Apple Concentric Squircle */
        .pcis-scene-card {
            background: #FFFFFF;
            border: 1px solid rgba(19, 19, 48, 0.08);
            border-radius: 18px;
            padding: 6px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1), 
                        box-shadow 240ms ease, 
                        border-color 200ms ease;
            position: relative;
            box-shadow: 0 2px 8px rgba(19, 19, 48, 0.04);
            box-sizing: border-box;
            overflow: hidden;
        }

        .pcis-scene-card:hover {
            transform: translateY(-4px);
            border-color: rgba(255, 183, 3, 0.45);
            box-shadow: 
                0 4px 12px rgba(19, 19, 48, 0.04),
                0 18px 36px rgba(19, 19, 48, 0.12);
        }

        .pcis-scene-card:active {
            transform: translateY(-1px) scale(0.98);
        }

        .pcis-scene-card:hover .pcis-scene-title {
            color: #B45309;
        }

        .pcis-scene-card:hover .pcis-scene-hover-arrow {
            opacity: 1;
            transform: translateX(0);
            color: #B45309;
        }

        /* Clean Selected State with Bottom Accent Bar */
        .pcis-scene-card.is-current {
            background: #FFFFFF;
            border-color: #FFB703;
            box-shadow: 
                0 2px 8px rgba(19, 19, 48, 0.04),
                0 12px 28px rgba(255, 183, 3, 0.18);
        }

        .pcis-scene-card.is-current:hover {
            transform: translateY(-4px);
            border-color: #FFB703;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.06),
                0 20px 42px rgba(255, 183, 3, 0.24);
        }

        .pcis-scene-card.is-current .pcis-scene-title {
            color: #B45309;
            font-weight: 800;
        }

        /* Active Dock-Style Bottom Accent Bar */
        .pcis-scene-active-indicator {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 44px;
            height: 3.5px;
            background: #FFB703;
            border-radius: 3px 3px 0 0;
            box-shadow: 0 -1px 8px rgba(255, 183, 3, 0.45);
        }

        /* Active Card Index Badge Highlight */
        .pcis-scene-card.is-current .pcis-scene-badge {
            background: #FFB703;
            box-shadow: 0 2px 8px rgba(255, 183, 3, 0.35);
        }

        .pcis-scene-thumb-box {
            position: relative;
            width: 100%;
            height: 126px;
            background: #F1F5F9;
            border-radius: 12px;
            overflow: hidden;
        }

        .pcis-scene-thumb-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pcis-scene-card:hover .pcis-scene-thumb-img {
            transform: scale(1.04);
        }

        .pcis-scene-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            background: rgba(19, 19, 48, 0.75);
            color: #FFFFFF;
            font-family: 'Satoshi', sans-serif !important;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 8px;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            transition: background 200ms ease, box-shadow 200ms ease;
        }

        /* Frosted Glass Live Viewing Badge */
        .pcis-scene-current-pill {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(19, 19, 48, 0.85);
            color: #FFFFFF;
            font-family: 'Satoshi', sans-serif !important;
            font-size: 10.5px;
            font-weight: 700;
            padding: 3px 8px 3px 7px;
            border-radius: 8px;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.12);
        }

        /* Pulsing Emerald Live Dot */
        .pcis-scene-live-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #10B981;
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
            animation: pcisPillPulse 2s ease-in-out infinite;
            flex-shrink: 0;
        }

        @keyframes pcisPillPulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
                box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
            }
            50% {
                transform: scale(1.25);
                opacity: 0.85;
                box-shadow: 0 0 12px rgba(16, 185, 129, 1);
            }
        }

        .pcis-scene-info {
            padding: 10px 8px 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: transparent;
            gap: 8px;
        }

        .pcis-scene-title {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 13.5px;
            font-weight: 700;
            color: #131330;
            line-height: 1.25;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: color 180ms ease;
            flex: 1;
        }

        .pcis-scene-hover-arrow {
            font-size: 16px;
            color: #94A3B8;
            opacity: 0;
            transform: translateX(-4px);
            transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), 
                        opacity 200ms ease, 
                        color 180ms ease;
            display: grid;
            place-items: center;
            line-height: 1;
            flex-shrink: 0;
        }

        .pcis-scene-card.is-current .pcis-scene-hover-arrow {
            opacity: 0.7;
            transform: translateX(0);
            color: #B45309;
        }

        /* ─── Mobile Two-Tier Layout (Reference Image 2 Alignment) ─── */
        @keyframes pcisSlideInTopFullWidth {
            0% {
                opacity: 0;
                transform: translateY(-24px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* ─── Mobile & Tablet Two-Tier Layout ─── */
        @media (max-width: 1024px) {
            .pcis-location-widget {
                position: fixed;
                top: calc(max(12px, env(safe-area-inset-top)) + 56px);
                left: max(12px, env(safe-area-inset-left));
                right: max(12px, env(safe-area-inset-right));
                transform: none;
                width: auto;
                min-width: 0;
                max-width: none;
                height: 48px;
                box-sizing: border-box;
                padding: 6px 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                border-radius: 16px;
                animation: pcisSlideInTopFullWidth 0.65s cubic-bezier(0.16, 1, 0.3, 1) 80ms backwards;
            }
            .pcis-location-widget:hover {
                transform: translateY(-2px);
            }
            .pcis-location-widget:active {
                transform: translateY(0);
            }
            .pcis-location-copy {
                flex: 1;
                min-width: 0;
                text-align: left;
            }
            .pcis-location-name {
                font-size: 13px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .pcis-location-tag { display: none; }
            .pcis-stepper-cluster {
                flex-shrink: 0;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .pcis-stepper-btn { width: 26px; height: 26px; font-size: 11px; }
            .pcis-scene-badge-pill { padding: 4px 8px; gap: 4px; }
            .pcis-scene-count-text { font-size: 11px; font-weight: 700; }
            .pcis-dropdown-thumb-wrap { width: 28px; height: 28px; }
            .pcis-dropdown-item-title { font-size: 12px; }
            .pcis-scene-drawer {
                width: calc(100vw - 44px);
                max-width: 900px;
                height: 88vh;
                height: 88dvh;
                max-height: 88dvh;
                border-radius: 22px;
            }
            .pcis-drawer-head {
                padding: 14px 20px;
                gap: 14px;
            }
            .pcis-drawer-icon-box {
                width: 38px;
                height: 38px;
                font-size: 17px;
                border-radius: 11px;
            }
            .pcis-drawer-heading h2 {
                font-size: 16px;
                line-height: 1.2;
            }
            .pcis-drawer-heading p {
                font-size: 11.5px;
            }
            .pcis-drawer-actions {
                gap: 8px;
            }
            .pcis-drawer-bottom-dock {
                bottom: max(16px, env(safe-area-inset-bottom));
            }
            .pcis-drawer-search-pill {
                font-size: 12.5px;
                padding: 7px 18px;
            }
            .pcis-drawer-search-dropdown {
                width: min(340px, calc(100vw - 44px));
            }
            .pcis-drawer-close {
                width: 30px;
                height: 30px;
            }
            .pcis-drawer-close i {
                font-size: 16px;
            }
            .pcis-drawer-body {
                padding: 16px 18px calc(72px + env(safe-area-inset-bottom));
                -webkit-overflow-scrolling: touch;
            }
            .pcis-scene-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 14px;
            }
            .pcis-scene-card {
                border-radius: 16px;
                padding: 5px;
            }

            body.is-ui-hidden .pcis-location-widget,
            body.is-gsv-open .pcis-location-widget,
            body.is-3d-open .pcis-location-widget,
            body.is-disclosure-open .pcis-location-widget {
                transform: translateY(-24px) !important;
            }
        }

        /* ── Mobile Phone Responsiveness (<= 640px) ── */
        @media (max-width: 640px) {
            .pcis-scene-drawer {
                width: calc(100vw - 20px);
                max-width: 480px;
                border-radius: 20px;
            }
            .pcis-drawer-head {
                padding: 12px 14px;
                gap: 10px;
            }
            .pcis-drawer-icon-box {
                width: 36px;
                height: 36px;
                font-size: 16px;
                border-radius: 10px;
            }
            .pcis-drawer-heading h2 {
                font-size: 15px;
            }
            .pcis-drawer-heading p {
                font-size: 10.5px;
            }
            .pcis-drawer-bottom-dock {
                bottom: max(14px, env(safe-area-inset-bottom));
            }
            .pcis-drawer-search-pill {
                font-size: 12px;
                padding: 7px 16px;
            }
            .pcis-drawer-search-dropdown {
                width: min(320px, calc(100vw - 36px));
            }
            .pcis-drawer-body {
                padding: 14px 12px calc(68px + env(safe-area-inset-bottom));
            }
            .pcis-scene-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }
            .pcis-scene-card {
                border-radius: 14px;
                padding: 4px;
            }
        }

        @media (max-width: 480px) {
            .pcis-location-widget {
                top: calc(max(10px, env(safe-area-inset-top)) + 52px);
                left: max(10px, env(safe-area-inset-left));
                right: max(10px, env(safe-area-inset-right));
                height: 46px;
                box-sizing: border-box;
                padding: 4px 12px;
                border-radius: 15px;
            }
            .pcis-location-name { font-size: 12.5px; }
            .pcis-stepper-btn { width: 24px; height: 24px; font-size: 10px; }
            .pcis-scene-badge-pill { padding: 3px 6px; gap: 3px; }
            .pcis-scene-count-text { font-size: 10px; }
            .pcis-drawer-head {
                padding: 10px 12px;
                gap: 8px;
            }
            .pcis-drawer-heading h2 {
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .pcis-drawer-heading p {
                font-size: 11px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .pcis-drawer-search-pill {
                font-size: 12px;
                padding: 6px 14px;
            }
            .pcis-drawer-search-dropdown {
                width: min(300px, calc(100vw - 32px));
            }
            .pcis-drawer-search-wrap input {
                height: 38px;
                padding: 0 28px 0 32px;
                font-size: 12px;
            }
            .pcis-drawer-search-icon {
                left: 10px;
                font-size: 12px;
            }
        }
    `;
    document.head.appendChild(style);

    // ─── Build Top-Center Widget ────────────────────────────────
    const root = document.createElement("div");
    root.id = "pcis-scene-explorer-root";

    root.innerHTML = `
        <!-- Top-Center Location Widget -->
        <div class="pcis-location-widget" id="pcis-location-widget" role="region" aria-label="Venue scene navigation">
            <div class="pcis-location-copy" id="pcis-location-copy" role="button" aria-haspopup="dialog" aria-label="Open full visual scene explorer" title="Explore all exhibition halls & suites">
                <span class="pcis-location-tag">
                    <span class="pcis-live-dot" aria-hidden="true"></span>
                    Now Exploring
                </span>
                <strong class="pcis-location-name" id="spatial-location-name">EVP Trade & Convention Centre</strong>
            </div>
            <div class="pcis-location-right">
                <div class="pcis-stepper-group" role="group" aria-label="Scene navigation controls">
                    <button class="pcis-stepper-btn pcis-stepper-prev" id="pcis-stepper-prev" type="button" aria-label="Previous scene">
                        <i class="fi fi-rr-angle-small-left"></i>
                    </button>
                    <div class="pcis-scene-badge-pill" id="pcis-scene-badge-pill" role="button" aria-expanded="false" aria-haspopup="listbox" aria-label="Quick-select scene">
                        <span class="pcis-scene-count-text" id="spatial-scene-count">-- / --</span>
                        <span class="pcis-location-chevron" aria-hidden="true"><i class="fi fi-rr-angle-small-down"></i></span>
                    </div>
                    <button class="pcis-stepper-btn pcis-stepper-next" id="pcis-stepper-next" type="button" aria-label="Next scene">
                        <i class="fi fi-rr-angle-small-right"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Quick-Select Scrollable Dropdown Menu (sibling of widget, independent stacking context) -->
        <div class="pcis-scene-dropdown" id="pcis-scene-dropdown" role="listbox" aria-label="Quick scene selector">
            <div class="pcis-scene-dropdown-scroll" id="pcis-scene-dropdown-scroll">
                <!-- Populated dynamically -->
            </div>
        </div>

        <!-- Drawer Backdrop -->
        <div class="pcis-drawer-backdrop" id="pcis-drawer-backdrop"></div>

        <!-- Scene Drawer -->
        <div class="pcis-scene-drawer" id="pcis-scene-drawer" role="dialog" aria-modal="true" aria-labelledby="pcis-drawer-title">
            <div class="pcis-drawer-head">
                <div class="pcis-drawer-titles">
                    <div class="pcis-drawer-icon-box"><i class="fi fi-sr-tour-virtual" aria-hidden="true"></i></div>
                    <div class="pcis-drawer-heading">
                        <h2 id="pcis-drawer-title">Explore Exhibition Halls &amp; Facilities</h2>
                        <p>Select any hall, pavilion suite, or dining area to view in 360°</p>
                    </div>
                </div>
                <div class="pcis-drawer-actions">
                    <button class="pcis-drawer-close" id="pcis-drawer-close" aria-label="Close scene explorer" type="button">
                        <i class="fi fi-rr-cross-small" aria-hidden="true"></i>
                    </button>
                </div>
            </div>

            <div class="pcis-drawer-body">
                <div class="pcis-scene-grid" id="pcis-scene-grid">
                    <div style="padding: 30px; text-align: center; color: #475569;">Loading venue views…</div>
                </div>
            </div>

            <!-- Floating Bottom Search Dock (Like GSV Component) -->
            <div class="pcis-drawer-bottom-dock" id="pcis-drawer-bottom-dock">
                <!-- Upward Search Dropdown Card -->
                <div class="pcis-drawer-search-dropdown" id="pcis-drawer-search-dropdown">
                    <div class="pcis-drawer-search-wrap">
                        <i class="fi fi-rr-search pcis-drawer-search-icon" aria-hidden="true"></i>
                        <input type="text" id="pcis-drawer-search" placeholder="Search halls & facilities..." autocomplete="off" />
                        <button class="pcis-drawer-search-clear" id="pcis-drawer-search-clear" type="button" aria-label="Clear search">
                            <i class="fi fi-rr-cross-small"></i>
                        </button>
                    </div>
                </div>

                <!-- Floating Search Trigger Pill -->
                <button class="pcis-drawer-search-pill" id="pcis-drawer-search-toggle" type="button" aria-label="Search views" title="Search halls & facilities">
                    <i class="fi fi-rr-search" aria-hidden="true"></i>
                    <span class="pcis-search-pill-label">Search Views</span>
                    <i class="fi fi-rr-angle-small-up pcis-search-chevron" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(root);

    const widget = document.getElementById("pcis-location-widget");
    const locationCopy = document.getElementById("pcis-location-copy");
    const prevBtn = document.getElementById("pcis-stepper-prev");
    const nextBtn = document.getElementById("pcis-stepper-next");
    const pillBtn = document.getElementById("pcis-scene-badge-pill");
    const dropdown = document.getElementById("pcis-scene-dropdown");
    const dropdownScroll = document.getElementById("pcis-scene-dropdown-scroll");
    const backdrop = document.getElementById("pcis-drawer-backdrop");
    const drawer = document.getElementById("pcis-scene-drawer");
    const closeBtn = document.getElementById("pcis-drawer-close");
    const searchToggle = document.getElementById("pcis-drawer-search-toggle");
    const searchDropdown = document.getElementById("pcis-drawer-search-dropdown");
    const searchInput = document.getElementById("pcis-drawer-search");
    const grid = document.getElementById("pcis-scene-grid");
    const nameEl = document.getElementById("spatial-location-name");
    const countEl = document.getElementById("spatial-scene-count");

    let isDropdownOpen = false;

    // ─── Scene Navigation Helper ────────────────────────────────
    function navigateToScene(pano) {
        if (!pano) return;
        if (window.tour && typeof pano.playlistIndex === "number" && window.tour.setMediaByIndex) {
            window.tour.setMediaByIndex(pano.playlistIndex);
        } else if (window.tour && window.tour.setMediaByName) {
            window.tour.setMediaByName(pano.label);
        }
        setTimeout(updateActiveScene, 120);
    }

    // ─── Stepper Quick Navigation (‹ and ›) ──────────────────────
    function stepScene(dir) {
        if (!allPanoramas || allPanoramas.length === 0) return;
        const currentIndex = allPanoramas.findIndex(p => p.id === currentSceneId);
        let targetIndex = 0;
        if (currentIndex >= 0) {
            targetIndex = (currentIndex + dir + allPanoramas.length) % allPanoramas.length;
        } else {
            targetIndex = dir > 0 ? 0 : allPanoramas.length - 1;
        }
        const targetPano = allPanoramas[targetIndex];
        if (targetPano) {
            navigateToScene(targetPano);
        }
    }

    // ─── Compact Scrollable Dropdown Controls ───────────────────
    function toggleDropdown(forceState) {
        isDropdownOpen = typeof forceState === "boolean" ? forceState : !isDropdownOpen;
        if (isDropdownOpen) {
            renderDropdown();
            // Position dropdown directly below the widget using fixed coords
            const rect = widget.getBoundingClientRect();
            dropdown.style.top    = (rect.bottom + 8) + "px";
            dropdown.style.left   = rect.left + "px";
            dropdown.style.width  = rect.width + "px";
            dropdown.classList.add("is-open");
            pillBtn.classList.add("is-active");
            pillBtn.setAttribute("aria-expanded", "true");
            setTimeout(() => {
                if (!dropdownScroll) return;
                const activeItem = dropdownScroll.querySelector(".is-selected");
                if (activeItem) {
                    activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
                }
            }, 60);
        } else {
            dropdown.classList.remove("is-open");
            pillBtn.classList.remove("is-active");
            pillBtn.setAttribute("aria-expanded", "false");
        }
    }

    function closeDropdown() {
        if (isDropdownOpen) toggleDropdown(false);
    }

    function renderDropdown() {
        if (!dropdownScroll) return;
        dropdownScroll.innerHTML = "";
        if (!allPanoramas || allPanoramas.length === 0) {
            dropdownScroll.innerHTML = `<div style="padding: 14px; text-align: center; color: #64748B; font-size: 12px;">Loading venue views…</div>`;
            return;
        }

        allPanoramas.forEach((pano, idx) => {
            const isCurrent = pano.id === currentSceneId;
            const item = document.createElement("button");
            item.type = "button";
            item.className = "pcis-dropdown-item" + (isCurrent ? " is-selected" : "");
            item.setAttribute("role", "option");
            item.setAttribute("aria-selected", isCurrent ? "true" : "false");

            const thumbImg = `<img src="${pano.thumb}" class="pcis-dropdown-thumb" loading="lazy" onerror="this.onerror=null; this.src='thumbnail.png';"/>`;

            item.innerHTML = `
                <div class="pcis-dropdown-thumb-wrap">
                    ${thumbImg}
                </div>
                <span class="pcis-dropdown-item-num">${String(idx + 1).padStart(2, '0')}</span>
                <span class="pcis-dropdown-item-title">${pano.label}</span>
                <span class="pcis-dropdown-item-check" aria-hidden="true"><i class="fi fi-sr-check"></i></span>
            `;

            item.addEventListener("click", function (e) {
                e.stopPropagation();
                closeDropdown();
                navigateToScene(pano);
            });

            dropdownScroll.appendChild(item);
        });
    }

    // ─── Open / Close Full Drawer ───────────────────────────────
    function openDrawer() {
        closeDropdown();
        if (isDrawerOpen && drawer && drawer.classList.contains("is-open")) return;
        if (typeof window.closeGsvPopup === "function") {
            window.closeGsvPopup();
        }
        if (typeof window.close3dTour === "function") {
            window.close3dTour();
        }
        isDrawerOpen = true;
        updateActiveScene();
        if (backdrop) backdrop.classList.add("is-open");
        if (drawer) drawer.classList.add("is-open");
        renderGrid(allPanoramas);
        document.dispatchEvent(new CustomEvent("panoListOpened"));
        document.dispatchEvent(new CustomEvent("menuItemActivate", { detail: { id: "menu-panorama" } }));
    }

    function closeDrawer() {
        if (!isDrawerOpen && (!drawer || !drawer.classList.contains("is-open"))) return;
        isDrawerOpen = false;
        if (isSearchOpen) toggleSearch(false);
        if (searchInput && searchInput.value !== "") {
            searchInput.value = "";
            if (searchClear) searchClear.classList.remove("is-visible");
            if (searchToggle) searchToggle.classList.remove("is-active");
            renderGrid(allPanoramas, "");
        }
        if (backdrop) backdrop.classList.remove("is-open");
        if (drawer) drawer.classList.remove("is-open");
        document.dispatchEvent(new CustomEvent("panoListClosed"));
        document.dispatchEvent(new CustomEvent("menuItemDeactivate", { detail: { id: "menu-panorama" } }));
    }

    // ─── Event Listeners ────────────────────────────────────────
    if (locationCopy) {
        locationCopy.addEventListener("click", function (e) {
            e.stopPropagation();
            openDrawer();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            closeDropdown();
            stepScene(-1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            closeDropdown();
            stepScene(1);
        });
    }

    if (pillBtn) {
        pillBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleDropdown();
        });
    }

    if (dropdown) {
        dropdown.addEventListener("click", function (e) {
            e.stopPropagation();
        });
    }

    closeBtn.addEventListener("click", closeDrawer);
    backdrop.addEventListener("click", closeDrawer);

    document.addEventListener("click", function (e) {
        if (isDropdownOpen && widget && !widget.contains(e.target)) {
            closeDropdown();
        }
    });

    // ─── Drawer Search Dropdown Toggle ─────────────────────────
    let isSearchOpen = false;

    function toggleSearch(forceState) {
        isSearchOpen = typeof forceState === "boolean" ? forceState : !isSearchOpen;
        if (searchDropdown) {
            searchDropdown.classList.toggle("is-open", isSearchOpen);
        }
        if (searchToggle) {
            searchToggle.classList.toggle("is-open", isSearchOpen);
            searchToggle.setAttribute("aria-expanded", isSearchOpen ? "true" : "false");
        }
        if (isSearchOpen && searchInput) {
            setTimeout(function () {
                searchInput.focus();
            }, 80);
        }
    }

    if (searchToggle) {
        searchToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleSearch();
        });
    }

    if (searchDropdown) {
        searchDropdown.addEventListener("click", function (e) {
            e.stopPropagation();
        });
    }

    if (drawer) {
        drawer.addEventListener("click", function (e) {
            const bottomDock = document.getElementById("pcis-drawer-bottom-dock");
            if (isSearchOpen && bottomDock && !bottomDock.contains(e.target)) {
                toggleSearch(false);
            }
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (isSearchOpen) {
                toggleSearch(false);
                return;
            }
            if (isDropdownOpen) closeDropdown();
            if (isDrawerOpen) closeDrawer();
        }
    });

    // ─── Render Scene Cards in Drawer ───────────────────────────
    function renderGrid(scenes, query = "") {
        if (!grid) return;
        grid.innerHTML = "";

        if (!scenes || scenes.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: #475569;">No views match "${query}"</div>`;
            return;
        }

        scenes.forEach((pano) => {
            const isCurrent = pano.id === currentSceneId;
            const card = document.createElement("div");
            card.className = "pcis-scene-card" + (isCurrent ? " is-current" : "");

            const thumbImg = `<img src="${pano.thumb}" class="pcis-scene-thumb-img" loading="lazy" onerror="this.onerror=null; this.src='thumbnail.png';"/>`;

            card.innerHTML = `
                <div class="pcis-scene-thumb-box">
                    ${thumbImg}
                    <span class="pcis-scene-badge">${String(pano.playlistIndex + 1).padStart(2, '0')}</span>
                    ${isCurrent ? `<span class="pcis-scene-current-pill"><span class="pcis-scene-live-dot" aria-hidden="true"></span>Viewing</span>` : ""}
                </div>
                <div class="pcis-scene-info">
                    <strong class="pcis-scene-title" title="${pano.label}">${pano.label}</strong>
                    <span class="pcis-scene-hover-arrow" aria-hidden="true"><i class="fi fi-rr-arrow-small-right"></i></span>
                </div>
                ${isCurrent ? `<div class="pcis-scene-active-indicator" aria-hidden="true"></div>` : ""}
            `;

            card.addEventListener("click", function () {
                closeDrawer();
                navigateToScene(pano);
            });

            grid.appendChild(card);
        });
    }

    const searchClear = document.getElementById("pcis-drawer-search-clear");
    if (searchInput) {
        searchInput.addEventListener("input", function (e) {
            const q = e.target.value.toLowerCase().trim();
            if (searchClear) {
                searchClear.classList.toggle("is-visible", q.length > 0);
            }
            if (searchToggle) {
                searchToggle.classList.toggle("is-active", q.length > 0);
            }
            const filtered = q === "" ? allPanoramas : allPanoramas.filter(p => p.label.toLowerCase().includes(q));
            renderGrid(filtered, q);
        });
    }

    if (searchClear) {
        searchClear.addEventListener("click", function () {
            searchInput.value = "";
            searchClear.classList.remove("is-visible");
            if (searchToggle) {
                searchToggle.classList.remove("is-active");
            }
            renderGrid(allPanoramas, "");
            searchInput.focus();
        });
    }

    // ─── Sync Current Scene with 3DVista ────────────────────────
    function updateActiveScene() {
        try {
            const rootPlayer = window.tour && window.tour._getRootPlayer ? window.tour._getRootPlayer() : null;
            if (!rootPlayer) return;
            const viewer = rootPlayer.getMainViewer();
            const media = rootPlayer.getActiveMediaWithViewer(viewer);
            if (!media) return;

            const id = String(media.get("id") || "");
            const data = media.get("data") || {};
            const sceneIndex = allPanoramas.findIndex(p => p.id === id);
            const label = sceneIndex >= 0 ? allPanoramas[sceneIndex].label : (data.label || "EVP Trade & Convention Centre");

            currentSceneId = id;
            if (nameEl) nameEl.textContent = label;
            if (countEl) {
                countEl.textContent = sceneIndex >= 0
                    ? `${String(sceneIndex + 1).padStart(2, '0')} / ${String(allPanoramas.length).padStart(2, '0')}`
                    : `01 / ${String(allPanoramas.length || 1).padStart(2, '0')}`;
            }

            if (isDropdownOpen) {
                renderDropdown();
            }
        } catch (e) {
            // graceful ignore
        }
    }

    // ─── Extract PlayList Data from 3DVista ──────────────────────
    function loadPlaylist() {
        try {
            if (!window.tour || !window.tour.player || !window.tour.player.getById("mainPlayList")) {
                setTimeout(loadPlaylist, 400);
                return;
            }

            const rawItems = window.tour.player.getById("mainPlayList").get("items");
            if (!rawItems || !rawItems.length) {
                setTimeout(loadPlaylist, 400);
                return;
            }

            allPanoramas = rawItems.map((item, idx) => {
                const media = item.get("media");
                const id = media.get("id");
                const label = media.get("data") && media.get("data").label ? media.get("data").label : "Panorama " + (idx + 1);

                // Dynamically resolve official thumbnail from 3DVista media object
                let officialThumb = "";
                if (typeof media.get === "function") {
                    officialThumb = media.get("thumbnailUrl") || "";
                }
                if (!officialThumb && media.get("frames") && media.get("frames")[0]) {
                    officialThumb = media.get("frames")[0].thumbnailUrl || "";
                }

                const baseId = id.startsWith("panorama_") ? id : `panorama_${id}`;
                const thumbUrl = officialThumb || `media/${baseId}_t.webp`;

                return {
                    id: id,
                    label: label,
                    playlistIndex: idx,
                    thumb: thumbUrl,
                    fallbackThumb: `media/${baseId}_t.webp`
                };
            });

            updateActiveScene();

            // Event-driven listener to eliminate laggy 800ms main-thread polling
            if (window.tour && typeof window.tour.on === "function") {
                window.tour.on("mediaChange", updateActiveScene);
            } else if (window.tour && window.tour.player && typeof window.tour.player.on === "function") {
                window.tour.player.on("mediaChange", updateActiveScene);
            }
            setInterval(updateActiveScene, 3000);
        } catch (e) {
            setTimeout(loadPlaylist, 500);
        }
    }

    loadPlaylist();

    // ─── Public API & Event Listeners ───────────────────────────
    window.togglePanoList = function () {
        if (isDrawerOpen) closeDrawer();
        else openDrawer();
    };
    window.openPanoDrawer = openDrawer;
    window.closePanoDrawer = closeDrawer;
    window.getPanoramas = function () {
        return allPanoramas;
    };

    document.addEventListener("menuItemClick", function (e) {
        if (e.detail && (e.detail.id === "menu-panorama" || e.detail.id === "dock-explore")) {
            openDrawer();
        } else if (isDrawerOpen) {
            closeDrawer();
        }
    });

    document.addEventListener("menuItemActivate", function (e) {
        if (e.detail && e.detail.id !== "menu-panorama" && e.detail.id !== "dock-explore" && isDrawerOpen) {
            closeDrawer();
        }
    });
})();
