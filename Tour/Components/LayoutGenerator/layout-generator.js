/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EVP TRADE & CONVENTION CENTRE — 2D SEATING LAYOUT GENERATOR & BLUEPRINT
 * Interactive 2D architectural blueprint engine styled with official EVP
 * White Frosted Glassmorphism, Midnight Navy, and Imperial Gold.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    "use strict";

    // ── Configuration & Architectural Standards ─────────────────────────
    const LAYOUT_CONFIG = {
        masterWidthFt: 80,             // Fixed stage width: 80 ft (24.38 m)
        masterWidthM: 24.38,
        minDepthFt: 40,
        maxDepthFt: 60,
        defaultDepthFt: 40,
        sqFtToSqM: 0.092903,
        halls: {
            "A": {
                name: "Hall A",
                grossDimensions: "376 × 144 ft",
                widthFt: 144,
                lengthFt: 376,
                netAreaSqFt: 47160,
                baseTheatre: 2500,
                baseClassroom: 1250,
                baseCabaret: 990,
                fireExits: 6,
                rollingShutters: 2,
                riggingPoints: 252
            },
            "B": {
                name: "Hall B",
                grossDimensions: "376 × 144 ft",
                widthFt: 144,
                lengthFt: 376,
                netAreaSqFt: 47160,
                baseTheatre: 2500,
                baseClassroom: 1250,
                baseCabaret: 990,
                fireExits: 6,
                rollingShutters: 2,
                riggingPoints: 252
            },
            "C": {
                name: "Hall C",
                grossDimensions: "376 × 144 ft",
                widthFt: 144,
                lengthFt: 376,
                netAreaSqFt: 47160,
                baseTheatre: 2500,
                baseClassroom: 1250,
                baseCabaret: 990,
                fireExits: 7,
                rollingShutters: 2,
                riggingPoints: 252
            },
            "D": {
                name: "Hall D",
                grossDimensions: "316 × 150 ft",
                widthFt: 150,
                lengthFt: 316,
                netAreaSqFt: 43428,
                baseTheatre: 1900,
                baseClassroom: 950,
                baseCabaret: 765,
                fireExits: 6,
                rollingShutters: 2,
                riggingPoints: 231
            }
        }
    };

    // State Variables
    let activeHallLetter = "A";
    let activeLayoutMode = "theatre"; // 'theatre' | 'classroom' | 'cabaret'
    let activeStageDepth = 40;        // 40 | 50 | 60 ft
    let isLayoutModalOpen = false;

    // ── Inject Component CSS ─────────────────────────────────────────────
    const styleEl = document.createElement("style");
    styleEl.id = "evp-layout-generator-styles";
    styleEl.textContent = `
        /* ── Top Action Trigger Button ── */
        .pcis-action-btn.btn-layout-gen {
            position: relative;
            background: rgba(255, 255, 255, 0.88);
            color: #131330;
            transition: all 260ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pcis-action-btn.btn-layout-gen:hover {
            border-color: rgba(255, 183, 3, 0.9);
            color: #FFB703;
            box-shadow: 0 8px 24px rgba(255, 183, 3, 0.28), 0 20px 48px rgba(19, 19, 48, 0.16);
            transform: translateY(-2px) scale(1.04);
        }
        .pcis-action-btn.btn-layout-gen.is-active {
            background: #ffffff;
            color: #d97706;
            border: 2px solid #FFB703 !important;
            box-shadow: 0 0 0 3px rgba(255, 183, 3, 0.35), 0 12px 28px rgba(19, 19, 48, 0.2);
        }

        /* ── Auto-Fade Tour Chrome when Layout Blueprint is Open ── */
        body.is-layout-open .pcis-location-widget {
            opacity: 0 !important;
            transform: translateX(-50%) translateY(-24px) !important;
            pointer-events: none !important;
            transition: all 260ms cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        body.is-layout-open .pcis-dock-wrap {
            opacity: 0 !important;
            transform: translateX(-50%) translateY(32px) !important;
            pointer-events: none !important;
            transition: all 260ms cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        body.is-layout-open .pcis-brand-card,
        body.is-layout-open .pcis-top-actions {
            opacity: 0 !important;
            transform: translateY(-24px) !important;
            pointer-events: none !important;
            transition: all 260ms cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        /* ── Backdrop Overlay ── */
        .layout-gen-backdrop {
            position: fixed;
            inset: 0;
            z-index: 100065;
            background: rgba(19, 19, 48, 0.45);
            -webkit-backdrop-filter: blur(16px);
            backdrop-filter: blur(16px);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1), visibility 280ms;
        }
        .layout-gen-backdrop.is-visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        /* ── Floating Frosted Glass Popup Dialog ── */
        .layout-gen-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.96);
            width: min(920px, 94vw);
            max-height: min(880px, 94vh);
            background: rgba(255, 255, 255, 0.95);
            -webkit-backdrop-filter: blur(32px) saturate(190%);
            backdrop-filter: blur(32px) saturate(190%);
            border: 1px solid rgba(255, 255, 255, 0.95);
            border-radius: 24px;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.05),
                0 28px 70px rgba(19, 19, 48, 0.24),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            z-index: 100075;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 240ms cubic-bezier(0.16, 1, 0.3, 1),
                        visibility 240ms;
            color: #131330;
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            font-style: normal !important;
        }
        .layout-gen-modal.is-visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translate(-50%, -50%) scale(1);
        }

        /* ── Modal Header (Seamless White Card Header) ── */
        .layout-gen-header {
            padding: 16px 22px 14px;
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 4px 16px -2px rgba(19, 19, 48, 0.04);
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            z-index: 10;
            flex-shrink: 0;
        }
        .layout-gen-header-left {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .layout-gen-badge-row {
            display: flex;
            align-items: center;
            gap: 7px;
        }
        .layout-gen-badge {
            background: rgba(255, 183, 3, 0.14);
            color: #B45309;
            border: 1px solid rgba(255, 183, 3, 0.45);
            font-size: 10.5px;
            font-weight: 800;
            letter-spacing: 0.6px;
            text-transform: uppercase;
            padding: 2.5px 8px;
            border-radius: 10px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .layout-gen-tag {
            color: #5c5c7a;
            font-size: 11.5px;
            font-weight: 600;
        }
        .layout-gen-title {
            margin: 0;
            font-size: 18px;
            font-weight: 800;
            color: #131330;
            letter-spacing: -0.2px;
        }
        .layout-gen-subtitle {
            margin: 0;
            font-size: 11.5px;
            color: #5c5c7a;
            font-weight: 500;
        }

        /* ── Standard EVP Red Circular Close Button (360° Hover Spin) ── */
        .layout-gen-close-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #EF4444;
            border: none !important;
            color: #FFFFFF;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin: 0;
            flex-shrink: 0;
            outline: none !important;
            box-shadow: none !important;
            transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
            -webkit-tap-highlight-color: transparent;
        }
        .layout-gen-close-btn i {
            font-size: 18px;
            line-height: 1;
            display: inline-flex;
            margin: 0;
            padding: 0;
            pointer-events: none;
            color: #FFFFFF;
        }
        .layout-gen-close-btn:hover {
            background: #DC2626;
            color: #FFFFFF;
            transform: rotate(360deg);
        }
        .layout-gen-close-btn:active {
            transform: rotate(360deg) scale(0.94);
        }

        /* ── Controls Toolbar ── */
        .layout-gen-toolbar {
            padding: 10px 22px;
            background: #F8F9FC;
            border-bottom: 1px solid rgba(19, 19, 48, 0.06);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            flex-shrink: 0;
        }
        .layout-gen-ctrl-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .layout-gen-ctrl-label {
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.5px;
            color: #5c5c7a;
        }
        .layout-gen-tabs {
            display: inline-flex;
            align-items: center;
            background: rgba(19, 19, 48, 0.05);
            border: 1px solid rgba(19, 19, 48, 0.08);
            border-radius: 9px;
            padding: 2px;
            gap: 2px;
        }
        .layout-gen-tab-btn {
            padding: 3.5px 10px;
            font-size: 11px;
            font-weight: 700;
            color: #5c5c7a;
            background: transparent;
            border: none;
            border-radius: 7px;
            cursor: pointer;
            transition: all 160ms ease;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        .layout-gen-tab-btn:hover {
            color: #131330;
        }
        .layout-gen-tab-btn.is-active {
            background: #FFFFFF;
            color: #d97706;
            box-shadow: 0 1px 4px rgba(19, 19, 48, 0.1);
        }

        /* ── Modal Body ── */
        .layout-gen-body {
            padding: 14px 22px;
            overflow-y: auto;
            flex: 1;
            min-height: 0;
            background: #F4F6F9;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        /* ── Canvas Card (Architectural Blueprint Frame) ── */
        .layout-gen-canvas-wrap {
            position: relative;
            background: #081021;
            border: 1px solid rgba(19, 19, 48, 0.12);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: inset 0 2px 14px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(19, 19, 48, 0.04);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 10px 12px 8px;
        }
        .layout-gen-canvas {
            display: block;
            max-width: 100%;
            max-height: min(440px, 48vh);
            width: auto;
            height: auto;
            border-radius: 8px;
            background: #070E1B;
        }
        .layout-gen-canvas-overlay {
            position: static;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-top: 8px;
            margin-bottom: 0;
            width: 100%;
            flex-wrap: wrap;
        }
        .layout-gen-legend-pill {
            background: rgba(11, 19, 43, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(6px);
            padding: 4px 9px;
            border-radius: 6px;
            font-size: 10px;
            color: #CBD5E1;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .layout-gen-legend-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
        }

        /* ── Bento Breakdown Metrics Bar ── */
        .layout-gen-metrics-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
        }
        .layout-gen-metric-box {
            display: flex;
            flex-direction: column;
            gap: 2px;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(19, 19, 48, 0.06);
            box-shadow: 0 1px 4px rgba(19, 19, 48, 0.03);
            border-radius: 14px;
            padding: 9px 12px;
        }
        .layout-gen-metric-title {
            font-size: 10px;
            color: #5c5c7a;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.4px;
        }
        .layout-gen-metric-val {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 17px;
            font-weight: 800;
            color: #131330;
            letter-spacing: -0.2px;
        }
        .layout-gen-metric-val.gold {
            color: #d97706;
        }
        .layout-gen-metric-sub {
            font-size: 10px;
            color: #8b8ba7;
            font-weight: 500;
        }

        /* ── Footer ── */
        .layout-gen-footer {
            padding: 12px 22px;
            background: rgba(255, 255, 255, 0.98);
            border-top: 1px solid rgba(19, 19, 48, 0.06);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-shrink: 0;
        }
        .layout-gen-footer-left {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            color: #5c5c7a;
            font-weight: 500;
        }
        .layout-gen-footer-left i {
            color: #FFB703;
            font-size: 13px;
        }
        .layout-gen-footer-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .layout-gen-btn-download {
            background: #131330;
            color: #FFFFFF;
            border: 1px solid rgba(255, 183, 3, 0.4);
            border-radius: 10px;
            padding: 8px 14px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 180ms ease;
            box-shadow: 0 2px 8px rgba(19, 19, 48, 0.15);
            outline: none !important;
            font-family: 'Satoshi', sans-serif !important;
        }
        .layout-gen-btn-download:hover {
            background: #1C1C46;
            border-color: #FFB703;
            color: #FFB703;
            box-shadow: 0 4px 14px rgba(19, 19, 48, 0.25);
            transform: translateY(-1px);
        }
        .layout-gen-btn-wa {
            background: #25D366;
            color: #FFFFFF;
            border: none;
            border-radius: 10px;
            padding: 8px 16px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 2px 8px rgba(37, 211, 102, 0.28);
            transition: all 180ms ease;
            outline: none !important;
            font-family: 'Satoshi', sans-serif !important;
        }
        .layout-gen-btn-wa:hover {
            background: #20BA5A;
            box-shadow: 0 4px 14px rgba(37, 211, 102, 0.42);
            transform: translateY(-1px);
        }

        /* ── Full Device Responsiveness (Matches Desktop 1:1) ── */
        @media (max-width: 768px) {
            /* Floating Card Modal preserved on mobile */
            .layout-gen-modal {
                width: min(920px, 95vw);
                max-height: 94vh;
                border-radius: 20px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.96);
            }
            .layout-gen-modal.is-visible {
                transform: translate(-50%, -50%) scale(1);
            }

            /* Compact Header */
            .layout-gen-header {
                padding: 12px 16px 10px;
            }
            .layout-gen-badge-row {
                gap: 5px;
            }
            .layout-gen-badge {
                font-size: 9.5px;
                padding: 2px 6px;
            }
            .layout-gen-tag {
                font-size: 10.5px;
            }
            .layout-gen-title {
                font-size: 15px;
            }
            .layout-gen-subtitle {
                font-size: 10.5px;
            }
            .layout-gen-close-btn {
                width: 28px;
                height: 28px;
            }
            .layout-gen-close-btn i {
                font-size: 15px;
            }

            /* Wrap Naturally so ALL Controls are 100% Visible on Mobile */
            .layout-gen-toolbar {
                padding: 8px 12px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: flex-start;
                gap: 6px 10px;
            }
            .layout-gen-ctrl-group {
                display: flex;
                align-items: center;
                gap: 5px;
                flex-shrink: 0;
            }
            .layout-gen-ctrl-label {
                font-size: 10px;
                font-weight: 700;
                color: #5c5c7a;
            }
            .layout-gen-tabs {
                padding: 2px;
                gap: 2px;
                border-radius: 8px;
            }
            .layout-gen-tab-btn {
                padding: 3px 7px;
                font-size: 10px;
                border-radius: 6px;
                gap: 3px;
                white-space: nowrap;
            }
            .layout-gen-tab-btn i {
                font-size: 10px;
            }

            /* Body & Canvas Wrap (Maximized Blueprint Width) */
            .layout-gen-body {
                padding: 10px 12px;
                gap: 10px;
            }
            .layout-gen-canvas-wrap {
                padding: 8px 6px;
                border-radius: 12px;
            }

            /* De-conflicted Legend Pills: Placed cleanly below canvas so they never cover the stage */
            .layout-gen-canvas-overlay {
                position: static;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 6px;
                margin-top: 6px;
                margin-bottom: 0;
                flex-wrap: wrap;
            }
            .layout-gen-legend-pill {
                font-size: 9px;
                padding: 2.5px 7px;
                border-radius: 5px;
                gap: 4px;
            }
            .layout-gen-legend-dot {
                width: 6px;
                height: 6px;
            }

            /* 2x2 Balanced Grid on Mobile: ALL 4 Metric Cards are 100% Visible */
            .layout-gen-metrics-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 6px;
            }
            .layout-gen-metric-box {
                padding: 7px 10px;
                border-radius: 11px;
                gap: 1px;
            }
            .layout-gen-metric-title {
                font-size: 9px;
                letter-spacing: 0.3px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .layout-gen-metric-val {
                font-size: 15px;
                line-height: 1.2;
            }
            .layout-gen-metric-sub {
                font-size: 8.5px;
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            /* Balanced Footer: Left note + Side-by-Side Action Buttons */
            .layout-gen-footer {
                padding: 10px 14px;
                flex-direction: column;
                gap: 8px;
            }
            .layout-gen-footer-left {
                font-size: 10px;
                text-align: center;
                justify-content: center;
            }
            .layout-gen-footer-actions {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 8px;
                width: 100%;
            }
            .layout-gen-btn-download,
            .layout-gen-btn-wa {
                flex: 1;
                justify-content: center;
                padding: 8px 10px;
                font-size: 11px;
                border-radius: 9px;
                white-space: nowrap;
            }
        }

        @media (min-width: 600px) and (max-width: 768px) {
            .layout-gen-metrics-row {
                grid-template-columns: repeat(4, 1fr);
            }
        }

        @media (max-width: 480px) {
            .layout-gen-modal {
                width: calc(100vw - 14px);
                max-height: 95vh;
                border-radius: 16px;
            }
            .layout-gen-header {
                padding: 10px 12px 8px;
            }
            .layout-gen-toolbar {
                padding: 6px 10px;
                gap: 6px;
            }
            .layout-gen-ctrl-group {
                gap: 4px;
            }
            .layout-gen-ctrl-label {
                font-size: 9.5px;
            }
            .layout-gen-tab-btn {
                padding: 2.5px 6px;
                font-size: 9.5px;
            }
            .layout-gen-body {
                padding: 8px 10px;
                gap: 8px;
            }
            .layout-gen-metric-box {
                padding: 6px 8px;
            }
            .layout-gen-metric-val {
                font-size: 14px;
            }
            .layout-gen-footer {
                padding: 8px 10px;
            }
            .layout-gen-btn-download,
            .layout-gen-btn-wa {
                padding: 7px 6px;
                font-size: 10.5px;
                gap: 4px;
            }
        }
    `;
    document.head.appendChild(styleEl);

    // ── Build DOM Structure ──────────────────────────────────────────────
    const backdrop = document.createElement("div");
    backdrop.id = "layout-gen-backdrop";
    backdrop.className = "layout-gen-backdrop";

    const modal = document.createElement("div");
    modal.id = "layout-gen-modal";
    modal.className = "layout-gen-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-label", "2D Seating Layout Blueprint Generator");

    modal.innerHTML = `
        <!-- Header -->
        <div class="layout-gen-header">
            <div class="layout-gen-header-left">
                <div class="layout-gen-badge-row">
                    <span class="layout-gen-badge" id="layout-hall-pill">Hall A • 47,160 SQ.FT</span>
                    <span class="layout-gen-tag" id="layout-hall-dims-tag">376 × 144 ft</span>
                </div>
                <h2 class="layout-gen-title">2D Seating Layout Blueprint</h2>
                <p class="layout-gen-subtitle">True-to-scale architectural seating arrangement &amp; aisle clearances</p>
            </div>
            <button type="button" class="layout-gen-close-btn" id="layout-gen-close-btn" aria-label="Close layout generator">
                <i class="fi fi-rr-cross-small" aria-hidden="true"></i>
            </button>
        </div>

        <!-- Controls Toolbar -->
        <div class="layout-gen-toolbar">
            <!-- 1. Hall Switcher -->
            <div class="layout-gen-ctrl-group">
                <span class="layout-gen-ctrl-label">Hall:</span>
                <div class="layout-gen-tabs" id="layout-hall-tabs">
                    <button type="button" class="layout-gen-tab-btn is-active" data-hall="A">Hall A</button>
                    <button type="button" class="layout-gen-tab-btn" data-hall="B">Hall B</button>
                    <button type="button" class="layout-gen-tab-btn" data-hall="C">Hall C</button>
                    <button type="button" class="layout-gen-tab-btn" data-hall="D">Hall D</button>
                </div>
            </div>

            <!-- 2. Layout Mode Switcher -->
            <div class="layout-gen-ctrl-group">
                <span class="layout-gen-ctrl-label">Layout:</span>
                <div class="layout-gen-tabs" id="layout-mode-tabs">
                    <button type="button" class="layout-gen-tab-btn is-active" data-mode="theatre">
                        <i class="fi fi-rr-users"></i> Theatre
                    </button>
                    <button type="button" class="layout-gen-tab-btn" data-mode="classroom">
                        <i class="fi fi-rr-graduation-cap"></i> Classroom
                    </button>
                    <button type="button" class="layout-gen-tab-btn" data-mode="cabaret">
                        <i class="fi fi-rr-glass-cheers"></i> Cabaret / Banquet
                    </button>
                </div>
            </div>

            <!-- 3. Stage Depth Selector -->
            <div class="layout-gen-ctrl-group">
                <span class="layout-gen-ctrl-label">Stage:</span>
                <div class="layout-gen-tabs" id="layout-depth-tabs">
                    <button type="button" class="layout-gen-tab-btn is-active" data-depth="40">40 ft</button>
                    <button type="button" class="layout-gen-tab-btn" data-depth="50">50 ft</button>
                    <button type="button" class="layout-gen-tab-btn" data-depth="60">60 ft</button>
                </div>
            </div>
        </div>

        <!-- Body with Canvas & Live Metrics -->
        <div class="layout-gen-body">
            <!-- Canvas Card -->
            <div class="layout-gen-canvas-wrap">
                <canvas id="layout-drawing-canvas" class="layout-gen-canvas" width="960" height="540"></canvas>
                <div class="layout-gen-canvas-overlay">
                    <div class="layout-gen-legend-pill">
                        <span class="layout-gen-legend-dot" style="background:#FFB703;"></span>
                        <span>Stage (80 ft Width)</span>
                    </div>
                    <div class="layout-gen-legend-pill">
                        <span class="layout-gen-legend-dot" style="background:#38BDF8;"></span>
                        <span>8 ft Central &amp; 8 ft Side Aisles</span>
                    </div>
                </div>
            </div>

            <!-- Bento Metrics Row -->
            <div class="layout-gen-metrics-row">
                <div class="layout-gen-metric-box">
                    <span class="layout-gen-metric-title">Total Seating Capacity</span>
                    <span class="layout-gen-metric-val gold" id="layout-metric-seats">~2,250</span>
                    <span class="layout-gen-metric-sub" id="layout-metric-seats-sub">Auditorium keynote seats</span>
                </div>
                <div class="layout-gen-metric-box">
                    <span class="layout-gen-metric-title" id="layout-metric-units-title">Seating Rows</span>
                    <span class="layout-gen-metric-val" id="layout-metric-units">45 Rows</span>
                    <span class="layout-gen-metric-sub" id="layout-metric-units-sub">3 banks with 8 ft central aisle</span>
                </div>
                <div class="layout-gen-metric-box">
                    <span class="layout-gen-metric-title">Stage Setback Buffer</span>
                    <span class="layout-gen-metric-val gold" id="layout-metric-setback">20 ft (6.1 m)</span>
                    <span class="layout-gen-metric-sub">Camera &amp; VIP clear zone</span>
                </div>
                <div class="layout-gen-metric-box">
                    <span class="layout-gen-metric-title">Safety Aisle Clearance</span>
                    <span class="layout-gen-metric-val" id="layout-metric-safety">8 ft Center / 14 ft Wall</span>
                    <span class="layout-gen-metric-sub" id="layout-metric-safety-sub">6 Fire Exits • 2 Rolling Shutters</span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="layout-gen-footer">
            <div class="layout-gen-footer-left">
                <i class="fi fi-sr-info"></i>
                <span>Certified architectural drawing calculated for EVP Trade Centre Hall dimensions.</span>
            </div>
            <div class="layout-gen-footer-actions">
                <button type="button" class="layout-gen-btn-download" id="layout-gen-btn-download" aria-label="Download Blueprint PNG">
                    <i class="fi fi-rr-download"></i>
                    <span>Download Blueprint (PNG)</span>
                </button>
                <button type="button" class="layout-gen-btn-wa" id="layout-gen-btn-wa" aria-label="Inquire Layout on WhatsApp">
                    <i class="fi fi-brands-whatsapp"></i>
                    <span>Inquire on WhatsApp</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    // ── Cache Elements ───────────────────────────────────────────────────
    const canvas = document.getElementById("layout-drawing-canvas");
    const ctx = canvas.getContext("2d");
    const closeBtn = document.getElementById("layout-gen-close-btn");
    const btnDownload = document.getElementById("layout-gen-btn-download");
    const btnWa = document.getElementById("layout-gen-btn-wa");

    const hallPillEl = document.getElementById("layout-hall-pill");
    const hallDimsTagEl = document.getElementById("layout-hall-dims-tag");
    const metricSeatsEl = document.getElementById("layout-metric-seats");
    const metricSeatsSubEl = document.getElementById("layout-metric-seats-sub");
    const metricUnitsTitleEl = document.getElementById("layout-metric-units-title");
    const metricUnitsEl = document.getElementById("layout-metric-units");
    const metricUnitsSubEl = document.getElementById("layout-metric-units-sub");
    const metricSetbackEl = document.getElementById("layout-metric-setback");
    const metricSafetyEl = document.getElementById("layout-metric-safety");
    const metricSafetySubEl = document.getElementById("layout-metric-safety-sub");

    const hallTabs = modal.querySelectorAll("#layout-hall-tabs .layout-gen-tab-btn");
    const modeTabs = modal.querySelectorAll("#layout-mode-tabs .layout-gen-tab-btn");
    const depthTabs = modal.querySelectorAll("#layout-depth-tabs .layout-gen-tab-btn");

    // ── Scene Detection Logic ────────────────────────────────────────────
    function getActiveSceneName() {
        if (typeof window.isGsvPovActive === "function" && window.isGsvPovActive()) {
            if (typeof window.getActiveGsvPovLocation === "function") {
                const gsvLoc = window.getActiveGsvPovLocation();
                if (gsvLoc && gsvLoc.name) return gsvLoc.name;
            }
            return "Outdoor GSV";
        }
        const gsvVp = document.getElementById("evp-gsv-pov-viewport");
        if (gsvVp && gsvVp.classList.contains("is-active")) {
            return "Outdoor GSV";
        }

        const locEl = document.getElementById("spatial-location-name");
        if (locEl && locEl.textContent && locEl.textContent.trim()) {
            return locEl.textContent.trim();
        }

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

        return "";
    }

    function isHallScene() {
        if (typeof window.isGsvPovActive === "function" && window.isGsvPovActive()) return false;
        const gsvVp = document.getElementById("evp-gsv-pov-viewport");
        if (gsvVp && gsvVp.classList.contains("is-active")) return false;
        if (document.body.classList.contains("is-gsv-open")) return false;

        const sceneName = getActiveSceneName();
        if (!sceneName) return false;

        if (/arrival|driveway|canvas|parking|perimeter|entrance|plaza|foyer|connection|gsv|outdoor|food\s*court|lobby/i.test(sceneName)) {
            return false;
        }

        return /\bhall\s*[a-d]\b/i.test(sceneName) || /hall-[abcd]/i.test(sceneName);
    }

    function getActiveHallLetter() {
        const sceneName = getActiveSceneName();
        const match = sceneName.match(/\bhall\s*([a-d])\b/i) || sceneName.match(/hall-([abcd])/i);
        return match ? match[1].toUpperCase() : "A";
    }

    // ── 2D Blueprint Drawing Engine ──────────────────────────────────────
    function drawLayoutBlueprint() {
        if (!canvas || !ctx) return;

        const hall = LAYOUT_CONFIG.halls[activeHallLetter] || LAYOUT_CONFIG.halls["A"];
        const dpr = window.devicePixelRatio || 1;
        const w = 960;
        const h = 540;

        // Set display and pixel canvas size
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.resetTransform();
        ctx.scale(dpr, dpr);

        // 1. Dark Blueprint Background & Grid
        ctx.fillStyle = "#070E1B";
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        const gridSize = 24;
        for (let x = 0; x < w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // 2. Hall Boundary (Scaled)
        const marginX = 40;
        const marginY = 36;
        const hallW = w - marginX * 2;
        const hallH = h - marginY * 2;

        ctx.strokeStyle = "rgba(255, 183, 3, 0.4)";
        ctx.lineWidth = 2;
        ctx.strokeRect(marginX, marginY, hallW, hallH);

        // Hall Dimension Labels
        ctx.fillStyle = "#94A3B8";
        ctx.font = "10px Satoshi, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${hall.name} • Certified Footprint: ${hall.grossDimensions} (${hall.netAreaSqFt.toLocaleString()} sq.ft)`, w / 2, marginY - 18);

        ctx.save();
        ctx.translate(marginX - 22, marginY + hallH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`Width: ${hall.widthFt} ft`, 0, 0);
        ctx.restore();

        // 3. Stage & LED Screen Rendering (Top of Hall)
        const stageWidthRatio = LAYOUT_CONFIG.masterWidthFt / hall.widthFt;
        const stageWidthPx = hallW * stageWidthRatio;
        const stageDepthRatio = activeStageDepth / hall.lengthFt;
        // True architectural scale: 40 ft stage is ~10.6% of hall length (~48-56px), leaving abundant audience floor
        const stageHeightPx = Math.max(36, Math.round(hallH * stageDepthRatio * 1.05));
        const stageLeftPx = marginX + (hallW - stageWidthPx) / 2;
        const stageTopPx = marginY + 16;

        // 3A. Front LED Screen (80 ft W × 20 ft H backdrop on front wall)
        const ledScreenH = 5;
        const ledScreenY = marginY + 6;
        const ledGrad = ctx.createLinearGradient(stageLeftPx, ledScreenY, stageLeftPx + stageWidthPx, ledScreenY);
        ledGrad.addColorStop(0, "#0284C7");
        ledGrad.addColorStop(0.5, "#38BDF8");
        ledGrad.addColorStop(1, "#0284C7");
        ctx.fillStyle = ledGrad;
        ctx.fillRect(stageLeftPx, ledScreenY, stageWidthPx, ledScreenH);
        ctx.strokeStyle = "#38BDF8";
        ctx.lineWidth = 1;
        ctx.strokeRect(stageLeftPx, ledScreenY, stageWidthPx, ledScreenH);
        ctx.fillStyle = "#38BDF8";
        ctx.font = "bold 8px Satoshi, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("FRONT LED SCREEN — 80 ft (W) × 20 ft (H) BACKDROP", stageLeftPx + stageWidthPx / 2, ledScreenY - 4);

        // 3B. Main Stage Drop Shadow & Body
        ctx.fillStyle = "rgba(255, 183, 3, 0.12)";
        ctx.fillRect(stageLeftPx - 4, stageTopPx - 4, stageWidthPx + 8, stageHeightPx + 8);

        const stageGrad = ctx.createLinearGradient(stageLeftPx, stageTopPx, stageLeftPx, stageTopPx + stageHeightPx);
        stageGrad.addColorStop(0, "#D97706");
        stageGrad.addColorStop(1, "#92400E");
        ctx.fillStyle = stageGrad;
        ctx.fillRect(stageLeftPx, stageTopPx, stageWidthPx, stageHeightPx);

        ctx.strokeStyle = "#FFB703";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(stageLeftPx, stageTopPx, stageWidthPx, stageHeightPx);

        // Stage Title Text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`MAIN STAGE — 80 ft (W) × ${activeStageDepth} ft (D)`, stageLeftPx + stageWidthPx / 2, stageTopPx + stageHeightPx / 2 + 4);

        // 3C. Stage Front Setback Zone (Viewport Buffer 20–25 ft)
        const setbackDistFt = activeLayoutMode === "cabaret" ? 25 : (activeLayoutMode === "classroom" ? 22 : 20);
        const setbackDistM = (setbackDistFt * 0.3048).toFixed(1);
        const setbackLabel = activeLayoutMode === "cabaret"
            ? `◄ ${setbackDistFt} ft (${setbackDistM} m) Viewport Buffer — Dance Floor & VIP Service ►`
            : (activeLayoutMode === "classroom"
                ? `◄ ${setbackDistFt} ft (${setbackDistM} m) Viewport Buffer — Lectern & Presentation AV ►`
                : `◄ ${setbackDistFt} ft (${setbackDistM} m) Viewport Buffer — VIP & Camera Track Clearance ►`);

        const setbackPx = Math.max(26, Math.round(stageHeightPx * (setbackDistFt / activeStageDepth)));
        const seatingStartTopPx = stageTopPx + stageHeightPx + setbackPx;

        // Viewport Zone Subtle Tint
        ctx.fillStyle = "rgba(255, 183, 3, 0.04)";
        ctx.fillRect(marginX + 20, stageTopPx + stageHeightPx, hallW - 40, setbackPx);

        // Dashed Setback Guideline
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "rgba(255, 183, 3, 0.45)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(marginX + 20, seatingStartTopPx);
        ctx.lineTo(marginX + hallW - 20, seatingStartTopPx);
        ctx.stroke();
        ctx.setLineDash([]);

        // Setback Buffer Dimension Callout
        ctx.fillStyle = "#FFB703";
        ctx.font = "bold 9px Satoshi, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(setbackLabel, marginX + hallW / 2 - 50, stageTopPx + stageHeightPx + Math.round(setbackPx / 2) + 3);

        // 3D. Integrated FOH Technical Booth inside Viewport Zone (House Right front corner)
        // Certified Spec: 30 ft W × 15 ft D in House Right flank, leaving 100% audience floor free
        const fohWidthRatio = 30 / hall.widthFt;
        const fohWidthPx = Math.max(50, Math.round(hallW * fohWidthRatio));
        const fohHeightPx = Math.max(14, Math.min(setbackPx - 8, 18));
        const fohLeftPx = marginX + hallW - 32 - fohWidthPx;
        const fohTopPx = stageTopPx + stageHeightPx + 4;

        ctx.fillStyle = "#0F1E36";
        ctx.fillRect(fohLeftPx, fohTopPx, fohWidthPx, fohHeightPx);
        ctx.strokeStyle = "#38BDF8";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(fohLeftPx, fohTopPx, fohWidthPx, fohHeightPx);

        ctx.fillStyle = "#38BDF8";
        ctx.font = "bold 8px Satoshi, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("FOH AV BOOTH (30 × 15 ft)", fohLeftPx + fohWidthPx / 2, fohTopPx + fohHeightPx / 2 + 3);

        // 4. Rear Arrival & Circulation Concourse (25–40 ft clear zone)
        const rearConcourseH = 42;
        const rearConcourseTopPx = marginY + hallH - rearConcourseH;

        ctx.fillStyle = "rgba(56, 189, 248, 0.03)";
        ctx.fillRect(marginX + 20, rearConcourseTopPx, hallW - 40, rearConcourseH);

        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(marginX + 20, rearConcourseTopPx);
        ctx.lineTo(marginX + hallW - 20, rearConcourseTopPx);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 8px Satoshi, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("◄ 25 – 40 ft UNOBSTRUCTED REAR ARRIVAL & REGISTRATION CONCOURSE ►", marginX + hallW / 2, rearConcourseTopPx + 14);

        // 5. Draw Seating Grid based on Active Layout Mode (strictly between buffer and rear concourse)
        const seatingAreaH = rearConcourseTopPx - seatingStartTopPx - 8;
        const seatingAreaW = hallW - 40;
        const seatingLeftPx = marginX + 20;

        if (activeLayoutMode === "theatre") {
            drawTheatreGrid(seatingLeftPx, seatingStartTopPx, seatingAreaW, seatingAreaH);
        } else if (activeLayoutMode === "classroom") {
            drawClassroomGrid(seatingLeftPx, seatingStartTopPx, seatingAreaW, seatingAreaH);
        } else if (activeLayoutMode === "cabaret") {
            drawCabaretGrid(seatingLeftPx, seatingStartTopPx, seatingAreaW, seatingAreaH);
        }

        // 6. Mid-Hall Side Repeater Screens (Left & Right Walls)
        drawMidHallRepeaters(marginX, marginY, hallW, hallH);

        // 7. Fire Egress Exits along Side Walls (6 for A, B, D; 7 for C)
        drawFireEgressExits(hall, marginX, marginY, hallW, hallH);

        // 8. Rear Wall Doors & Two 20 ft Rolling Shutters
        drawRearWallAccess(hall, marginX, marginY, hallW, hallH);

        // 9. Draw Architectural Scale Bar & Clearances
        drawArchitecturalLegend(marginX + 14, marginY + hallH - 12);

        // 10. Update Breakdown Metrics Below Canvas
        updateBreakdownMetrics();
    }

    // ── Mid-Hall Side Repeater Screens ───────────────────────────────────
    function drawMidHallRepeaters(marginX, marginY, hallW, hallH) {
        const midY = marginY + hallH * 0.38;
        const screenH = 22;
        const screenW = 6;

        // House Left Repeater Screen
        ctx.fillStyle = "#0284C7";
        ctx.fillRect(marginX - 3, midY - screenH / 2, screenW, screenH);
        ctx.strokeStyle = "#38BDF8";
        ctx.lineWidth = 1;
        ctx.strokeRect(marginX - 3, midY - screenH / 2, screenW, screenH);

        ctx.save();
        ctx.translate(marginX + 10, midY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = "#38BDF8";
        ctx.font = "bold 7px Satoshi, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("REPEATER SCREEN", 0, 0);
        ctx.restore();

        // House Right Repeater Screen
        ctx.fillStyle = "#0284C7";
        ctx.fillRect(marginX + hallW - 3, midY - screenH / 2, screenW, screenH);
        ctx.strokeStyle = "#38BDF8";
        ctx.lineWidth = 1;
        ctx.strokeRect(marginX + hallW - 3, midY - screenH / 2, screenW, screenH);

        ctx.save();
        ctx.translate(marginX + hallW - 10, midY);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = "#38BDF8";
        ctx.font = "bold 7px Satoshi, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("REPEATER SCREEN", 0, 0);
        ctx.restore();
    }

    // ── Certified Fire Egress Exits (Side Walls) ─────────────────────────
    function drawFireEgressExits(hall, marginX, marginY, hallW, hallH) {
        const exitCount = hall.fireExits || 6;
        const leftExits = exitCount === 7 ? 4 : 3;
        const rightExits = 3;

        // Left Wall (West) Exits
        for (let i = 0; i < leftExits; i++) {
            const frac = (i + 1) / (leftExits + 1);
            const ey = marginY + hallH * frac;
            drawSingleExit(marginX, ey, -1, `EXIT ${i + 1}`);
        }

        // Right Wall (East) Exits
        for (let i = 0; i < rightExits; i++) {
            const frac = (i + 1) / (rightExits + 1);
            const ey = marginY + hallH * frac;
            drawSingleExit(marginX + hallW, ey, 1, `EXIT ${leftExits + i + 1}`);
        }
    }

    function drawSingleExit(x, y, dir, label) {
        const tabW = 7;
        const tabH = 18;
        const tabX = dir === -1 ? x - tabW : x;
        const tabY = y - tabH / 2;

        // Emergency Green Exit Portal Notch
        ctx.fillStyle = "#10B981";
        ctx.fillRect(tabX, tabY, tabW, tabH);
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1;
        ctx.strokeRect(tabX, tabY, tabW, tabH);

        // Dashed outward fire door swing arc
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
        ctx.beginPath();
        if (dir === -1) {
            ctx.arc(x, tabY, tabH, 0, Math.PI / 2);
        } else {
            ctx.arc(x, tabY, tabH, Math.PI / 2, Math.PI);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.save();
        ctx.translate(dir === -1 ? x - 14 : x + 14, y);
        ctx.rotate(dir === -1 ? -Math.PI / 2 : Math.PI / 2);
        ctx.fillStyle = "#10B981";
        ctx.font = "bold 8px Satoshi, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`FIRE EXIT`, 0, 3);
        ctx.restore();
    }

    // ── Rear Wall Rolling Shutters & Main Entrance ───────────────────────
    function drawRearWallAccess(hall, marginX, marginY, hallW, hallH) {
        const rearY = marginY + hallH;
        const shutterRatio = 20 / hall.widthFt;
        const shutterW = Math.max(36, Math.round(hallW * shutterRatio));
        const shutterH = 6;

        // Left Rolling Shutter (20 ft height logistics)
        const leftShutterX = marginX + Math.round(hallW * 0.18) - shutterW / 2;
        drawRollingShutter(leftShutterX, rearY - 3, shutterW, shutterH, "20 ft ROLLING SHUTTER 1");

        // Right Rolling Shutter (20 ft height logistics)
        const rightShutterX = marginX + Math.round(hallW * 0.82) - shutterW / 2;
        drawRollingShutter(rightShutterX, rearY - 3, shutterW, shutterH, "20 ft ROLLING SHUTTER 2");

        // Central Main Entrance & Auto Sliding Doors
        const mainDoorW = Math.min(100, Math.round(hallW * 0.22));
        const mainDoorX = marginX + (hallW - mainDoorW) / 2;
        const mainDoorH = 6;

        ctx.fillStyle = "#1E293B";
        ctx.fillRect(mainDoorX, rearY - 3, mainDoorW, mainDoorH);
        ctx.strokeStyle = "#FFB703";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(mainDoorX, rearY - 3, mainDoorW, mainDoorH);

        ctx.fillStyle = "#FFB703";
        ctx.font = "bold 8px Satoshi, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("MAIN ENTRANCE / SLIDING DOORS", mainDoorX + mainDoorW / 2, rearY + 12);
    }

    function drawRollingShutter(x, y, w, h, label) {
        // Metallic shutter bay
        ctx.fillStyle = "#334155";
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = "#94A3B8";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x, y, w, h);

        // Hazard / logistics hatch lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        for (let lx = x + 4; lx < x + w - 4; lx += 8) {
            ctx.beginPath();
            ctx.moveTo(lx, y);
            ctx.lineTo(lx + 4, y + h);
            ctx.stroke();
        }

        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 7px Satoshi, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, x + w / 2, y + h + 10);
    }

    // ── Layout Style 1: Theatre Seating ──────────────────────────────────
    function drawTheatreGrid(left, top, width, height) {
        // Safe perimeter wall clearances
        const sideClearance = 28;
        // Two 8-ft wide designated walking corridors
        const aisleW = 48;
        const totalAislesW = aisleW * 2;
        const totalClearance = sideClearance * 2 + totalAislesW;
        const availableSeatingW = width - totalClearance;

        // Proportional Bank Widths: Left (28%), Center (44%), Right (28%)
        const bankLeftW = availableSeatingW * 0.28;
        const bankCenterW = availableSeatingW * 0.44;
        const bankRightW = availableSeatingW * 0.28;

        const leftBankStartX = left + sideClearance;
        const leftBankEndX = leftBankStartX + bankLeftW;

        const aisle1StartX = leftBankEndX + 6;
        const aisle1Width = aisleW - 12;

        const centerBankStartX = leftBankEndX + aisleW;
        const centerBankEndX = centerBankStartX + bankCenterW;

        const aisle2StartX = centerBankEndX + 6;
        const aisle2Width = aisleW - 12;

        const rightBankStartX = centerBankEndX + aisleW;
        const rightBankEndX = rightBankStartX + bankRightW;

        const numRows = activeStageDepth === 60 ? 12 : (activeStageDepth === 50 ? 14 : 15);
        const rowSpacing = height / (numRows + 1);

        // 1. Draw Clean Architectural Aisle Corridors (Zero Dots inside)
        drawAisleCorridor(aisle1StartX, top, aisle1Width, height, "8 ft Main Aisle");
        drawAisleCorridor(aisle2StartX, top, aisle2Width, height, "8 ft Side Aisle");

        // 2. Draw Distinct Seating Banks
        for (let r = 0; r < numRows; r++) {
            const y = top + (r + 1) * rowSpacing;

            // Row Label
            ctx.fillStyle = "#64748B";
            ctx.font = "8px monospace";
            ctx.textAlign = "right";
            ctx.fillText(`R${r + 1}`, leftBankStartX - 6, y + 3);

            // Left Bank: exactly 10 chairs, strictly between leftBankStartX and leftBankEndX
            drawChairRow(leftBankStartX, leftBankEndX, y, 10);

            // Center Bank: exactly 16 chairs, strictly between centerBankStartX and centerBankEndX
            drawChairRow(centerBankStartX, centerBankEndX, y, 16);

            // Right Bank: exactly 10 chairs, strictly between rightBankStartX and rightBankEndX
            drawChairRow(rightBankStartX, rightBankEndX, y, 10);
        }
    }

    function drawAisleCorridor(x, y, w, h, label) {
        // Soft tinted walkway floor
        ctx.fillStyle = "rgba(56, 189, 248, 0.03)";
        ctx.fillRect(x, y, w, h);

        // Dashed border guidelines
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
        ctx.setLineDash([]);

        // Vertical aisle label
        ctx.save();
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = "#38BDF8";
        ctx.font = "bold 9px Satoshi, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, 0, 3);
        ctx.restore();
    }

    function drawChairRow(startX, endX, y, count) {
        const step = (endX - startX) / (count - 1);
        for (let i = 0; i < count; i++) {
            const cx = startX + i * step;
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(cx, y, 2.2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // ── Layout Style 2: Classroom Tables & Chairs ────────────────────────
    function drawClassroomGrid(left, top, width, height) {
        // Safe perimeter wall clearances
        const sideClearance = 28;
        // Two 8-ft wide designated walking corridors
        const aisleW = 48;
        const totalAislesW = aisleW * 2;
        const totalClearance = sideClearance * 2 + totalAislesW;
        const availableSeatingW = width - totalClearance;

        // Proportional Bank Widths: Left (28%), Center (44%), Right (28%)
        const bankLeftW = availableSeatingW * 0.28;
        const bankCenterW = availableSeatingW * 0.44;
        const bankRightW = availableSeatingW * 0.28;

        const leftBankStartX = left + sideClearance;
        const leftBankEndX = leftBankStartX + bankLeftW;

        const aisle1StartX = leftBankEndX + 6;
        const aisle1Width = aisleW - 12;

        const centerBankStartX = leftBankEndX + aisleW;
        const centerBankEndX = centerBankStartX + bankCenterW;

        const aisle2StartX = centerBankEndX + 6;
        const aisle2Width = aisleW - 12;

        const rightBankStartX = centerBankEndX + aisleW;
        const rightBankEndX = rightBankStartX + bankRightW;

        const numRows = activeStageDepth === 60 ? 7 : (activeStageDepth === 50 ? 8 : 9);
        const rowSpacing = height / (numRows + 1);

        // 1. Draw Clean Architectural Aisle Corridors (Zero Dots inside)
        drawAisleCorridor(aisle1StartX, top, aisle1Width, height, "8 ft Main Aisle");
        drawAisleCorridor(aisle2StartX, top, aisle2Width, height, "8 ft Side Aisle");

        // 2. Draw Classroom Seminar Desks & Chairs
        // Left Bank: 3 individual 6 ft tables with 3 chairs each (9 chairs)
        // Center Bank: 5 individual 6 ft tables with 3 chairs each (15 chairs)
        // Right Bank: 3 individual 6 ft tables with 3 chairs each (9 chairs)
        // Total = 11 tables, 33 chairs per row!
        for (let r = 0; r < numRows; r++) {
            const y = top + (r + 1) * rowSpacing;

            // Row Label
            ctx.fillStyle = "#64748B";
            ctx.font = "8px monospace";
            ctx.textAlign = "right";
            ctx.fillText(`R${r + 1}`, leftBankStartX - 6, y + 3);

            // Left Bank: 3 distinct 6 ft tables
            drawClassroomBank(leftBankStartX, leftBankEndX, y, 3);

            // Center Bank: 5 distinct 6 ft tables
            drawClassroomBank(centerBankStartX, centerBankEndX, y, 5);

            // Right Bank: 3 distinct 6 ft tables
            drawClassroomBank(rightBankStartX, rightBankEndX, y, 3);
        }
    }

    function drawClassroomBank(startX, endX, y, tableCount) {
        const bankW = endX - startX;
        const gapBetweenTables = 8;
        const totalGaps = (tableCount - 1) * gapBetweenTables;
        const tableW = (bankW - totalGaps) / tableCount;
        const tableH = 5;

        for (let t = 0; t < tableCount; t++) {
            const tx = startX + t * (tableW + gapBetweenTables);

            // Distinct 6 ft Seminar Table
            ctx.fillStyle = "#1E293B";
            ctx.fillRect(tx, y - 2.5, tableW, tableH);
            ctx.strokeStyle = "#94A3B8";
            ctx.lineWidth = 1;
            ctx.strokeRect(tx, y - 2.5, tableW, tableH);

            // 3 Delegate Chairs per 6 ft Table (comfortably spaced at 25%, 50%, 75%)
            const chairStep = tableW / 4;
            for (let ch = 1; ch <= 3; ch++) {
                const chairX = tx + ch * chairStep;
                const chairY = y + 7;
                ctx.fillStyle = "#FFB703";
                ctx.beginPath();
                ctx.arc(chairX, chairY, 2.0, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // ── Layout Style 3: Cabaret / Banquet Round Tables ───────────────────
    function drawCabaretGrid(left, top, width, height) {
        const tableRadius = 13; // 5-6 ft diameter scaled round banquet tables
        const numCols = 7;
        const numRows = activeStageDepth === 60 ? 4 : 5;
        const colStep = (width - 100) / (numCols - 1);
        const rowStep = height / (numRows + 1);

        for (let r = 0; r < numRows; r++) {
            const isOffset = r % 2 === 1; // Staggered honeycomb grid
            const y = top + (r + 1) * rowStep;

            // Row Label
            ctx.fillStyle = "#64748B";
            ctx.font = "8px monospace";
            ctx.textAlign = "right";
            ctx.fillText(`T${r + 1}`, left + 24, y + 3);

            for (let c = 0; c < numCols; c++) {
                let x = left + 50 + c * colStep;
                if (isOffset) x += colStep / 2;
                if (x > left + width - 40) continue;

                // Round Table Circle
                ctx.fillStyle = "#0F172A";
                ctx.beginPath();
                ctx.arc(x, y, tableRadius, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = "#94A3B8";
                ctx.lineWidth = 1;
                ctx.stroke();

                // Center linen / floral marker
                ctx.fillStyle = "#475569";
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                ctx.fill();

                // 3 Chairs in crescent arc facing stage (lower semi-circle, facing north to stage)
                const chairCount = 3;
                const chairDist = tableRadius + 6;
                const startAngle = Math.PI * 0.20;
                const endAngle = Math.PI * 0.80;
                const angleStep = (endAngle - startAngle) / (chairCount - 1);

                for (let ch = 0; ch < chairCount; ch++) {
                    const angle = startAngle + ch * angleStep;
                    const cx = x + Math.cos(angle) * chairDist;
                    const cy = y + Math.sin(angle) * chairDist;

                    ctx.fillStyle = "#FFB703";
                    ctx.beginPath();
                    ctx.arc(cx, cy, 2.4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    // ── Architectural Legend & Scale Bar ─────────────────────────────────
    function drawArchitecturalLegend(x, y) {
        ctx.strokeStyle = "#94A3B8";
        ctx.lineWidth = 1;

        // 50 ft scale bar
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 50, y);
        ctx.moveTo(x, y - 3);
        ctx.lineTo(x, y + 3);
        ctx.moveTo(x + 50, y - 3);
        ctx.lineTo(x + 50, y + 3);
        ctx.stroke();

        ctx.fillStyle = "#94A3B8";
        ctx.font = "8px Satoshi, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("SCALE: 50 FT", x + 56, y + 2);
    }

    // ── Update Granular Breakdown Metrics ────────────────────────────────
    function updateBreakdownMetrics() {
        const hall = LAYOUT_CONFIG.halls[activeHallLetter] || LAYOUT_CONFIG.halls["A"];
        const areaDeltaSqFt = (LAYOUT_CONFIG.masterWidthFt * LAYOUT_CONFIG.defaultDepthFt) - (LAYOUT_CONFIG.masterWidthFt * activeStageDepth);

        // Update Header Badge & Tag
        if (hallPillEl) hallPillEl.textContent = `${hall.name} • ${hall.netAreaSqFt.toLocaleString()} SQ.FT`;
        if (hallDimsTagEl) hallDimsTagEl.textContent = hall.grossDimensions;

        if (activeLayoutMode === "theatre") {
            const seats = Math.round(hall.baseTheatre + (areaDeltaSqFt / 19.182));
            const rows = activeStageDepth === 60 ? 37 : (activeStageDepth === 50 ? 41 : 45);
            metricSeatsEl.textContent = `~${seats.toLocaleString()}`;
            metricSeatsSubEl.textContent = "Auditorium keynote seats";
            metricUnitsTitleEl.textContent = "Seating Rows";
            metricUnitsEl.textContent = `${rows} Rows`;
            metricUnitsSubEl.textContent = "3 banks • 8 ft central / 14 ft wall aisles";
            metricSetbackEl.textContent = "20 ft (6.1 m)";
        } else if (activeLayoutMode === "classroom") {
            const seats = Math.round(hall.baseClassroom + (areaDeltaSqFt / 38.535));
            const tables = Math.round(seats / 3);
            metricSeatsEl.textContent = `~${seats.toLocaleString()}`;
            metricSeatsSubEl.textContent = "Conference delegates";
            metricUnitsTitleEl.textContent = "Seminar Tables";
            metricUnitsEl.textContent = `~${tables} Tables`;
            metricUnitsSubEl.textContent = "6 ft × 1.5 ft (3 seats/table)";
            metricSetbackEl.textContent = "22 ft (6.7 m)";
        } else if (activeLayoutMode === "cabaret") {
            const seats = Math.round(hall.baseCabaret + (areaDeltaSqFt / 50.776));
            const tables = Math.round(seats / 3);
            metricSeatsEl.textContent = `~${seats.toLocaleString()}`;
            metricSeatsSubEl.textContent = "Cabaret delegates (3 seats/table)";
            metricUnitsTitleEl.textContent = "Round Tables";
            metricUnitsEl.textContent = `~${tables} Rounds`;
            metricUnitsSubEl.textContent = "5 ft Rounds • Open stage sightline";
            metricSetbackEl.textContent = "25 ft (7.6 m)";
        }

        // Update Safety & Egress Tile
        if (metricSafetyEl) metricSafetyEl.textContent = "8 ft Center / 14 ft Wall";
        if (metricSafetySubEl) metricSafetySubEl.textContent = `${hall.fireExits} Fire Exits • 2 Rolling Shutters`;
    }

    // ── Download Blueprint as PNG Image ──────────────────────────────────
    function downloadBlueprintPNG() {
        if (!canvas) return;
        const hall = LAYOUT_CONFIG.halls[activeHallLetter] || LAYOUT_CONFIG.halls["A"];
        const layoutTitle = activeLayoutMode.toUpperCase();
        const filename = `EVP-Trade-Centre-${hall.name}-${layoutTitle}-${activeStageDepth}ft-Blueprint.png`;

        const link = document.createElement("a");
        link.download = filename;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // ── WhatsApp Proposal Export ─────────────────────────────────────────
    function exportBlueprintToWhatsApp() {
        const hall = LAYOUT_CONFIG.halls[activeHallLetter] || LAYOUT_CONFIG.halls["A"];
        const seats = metricSeatsEl ? metricSeatsEl.textContent.trim() : "";
        const units = metricUnitsEl ? metricUnitsEl.textContent.trim() : "";
        const modeTitle = activeLayoutMode.toUpperCase();

        const msg = [
            "*EVP TRADE & CONVENTION CENTRE — 2D LAYOUT SPECIFICATION*",
            "--------------------------------------------------",
            `*Venue:* ${hall.name} (${hall.grossDimensions})`,
            `*Seating Configuration:* ${modeTitle} STYLE`,
            `*Simulated Capacity:* ${seats}`,
            `*Layout Units:* ${units}`,
            `*Stage Dimensions:* 80 ft (W) × ${activeStageDepth} ft (D)`,
            `*FOH Technical Console:* 30 ft (W) × 15 ft (D) Integrated Viewport Booth`,
            `*Aisle Standards:* 8 ft Central Aisle & 14 ft Perimeter Wall Clearances`,
            `*Egress & Logistics:* ${hall.fireExits} Fire Exits & 2 Rolling Shutters (20 ft ht)`,
            "",
            "Please share availability, site inspection date, and proposal for this setup.",
            "--------------------------------------------------",
            "EVP Trade & Convention Centre, Poonamallee, Chennai",
            "Tel: +91 85258 11111 | Web: evptradecentre.com"
        ].join("\n");

        const waUrl = "https://wa.me/918525811111?text=" + encodeURIComponent(msg);
        window.open(waUrl, "_blank", "noopener,noreferrer");
    }

    // ── Open / Close State Controller ────────────────────────────────────
    function openLayoutGenerator() {
        if (!isHallScene()) {
            closeLayoutGenerator();
            syncButtonVisibility();
            return;
        }

        activeHallLetter = getActiveHallLetter();
        hallTabs.forEach(t => t.classList.toggle("is-active", t.getAttribute("data-hall") === activeHallLetter));
        modeTabs.forEach(t => t.classList.toggle("is-active", t.getAttribute("data-mode") === activeLayoutMode));
        depthTabs.forEach(t => t.classList.toggle("is-active", Number(t.getAttribute("data-depth")) === activeStageDepth));

        document.body.classList.add("is-layout-open");
        backdrop.classList.add("is-visible");
        modal.classList.add("is-visible");
        isLayoutModalOpen = true;

        const btn = document.getElementById("btn-layout-gen");
        if (btn) btn.classList.add("is-active");

        drawLayoutBlueprint();
    }

    function closeLayoutGenerator() {
        document.body.classList.remove("is-layout-open");
        backdrop.classList.remove("is-visible");
        modal.classList.remove("is-visible");
        isLayoutModalOpen = false;

        const btn = document.getElementById("btn-layout-gen");
        if (btn) btn.classList.remove("is-active");
    }

    function toggleLayoutGenerator() {
        if (isLayoutModalOpen) {
            closeLayoutGenerator();
        } else {
            openLayoutGenerator();
        }
    }

    // ── Wire Interactive Events ──────────────────────────────────────────
    hallTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            activeHallLetter = this.getAttribute("data-hall") || "A";
            hallTabs.forEach(t => t.classList.toggle("is-active", t.getAttribute("data-hall") === activeHallLetter));
            drawLayoutBlueprint();
        });
    });

    modeTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            activeLayoutMode = this.getAttribute("data-mode") || "theatre";
            modeTabs.forEach(t => t.classList.toggle("is-active", t.getAttribute("data-mode") === activeLayoutMode));
            drawLayoutBlueprint();
        });
    });

    depthTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            activeStageDepth = Number(this.getAttribute("data-depth")) || 40;
            depthTabs.forEach(t => t.classList.toggle("is-active", Number(t.getAttribute("data-depth")) === activeStageDepth));
            drawLayoutBlueprint();
        });
    });

    closeBtn.addEventListener("click", closeLayoutGenerator);
    backdrop.addEventListener("click", closeLayoutGenerator);

    if (btnDownload) btnDownload.addEventListener("click", downloadBlueprintPNG);
    if (btnWa) btnWa.addEventListener("click", exportBlueprintToWhatsApp);

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isLayoutModalOpen) {
            closeLayoutGenerator();
        }
    });

    // ── Top Action Trigger Button Integration ────────────────────────────
    function createOrUpdateTriggerButton() {
        let btn = document.getElementById("btn-layout-gen");
        const topActions = document.getElementById("pcis-top-actions");
        if (!topActions) return;

        if (!btn) {
            btn = document.createElement("button");
            btn.id = "btn-layout-gen";
            btn.className = "pcis-action-btn btn-layout-gen";
            btn.type = "button";
            btn.setAttribute("aria-label", "Open 2D Seating Layout Blueprint Generator");
            btn.setAttribute("data-tooltip", "Layout Blueprint");

            btn.innerHTML = `<i class="fi fi-rr-blueprint" aria-hidden="true"></i>`;

            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                toggleLayoutGenerator();
            });

            const stageBtn = document.getElementById("btn-stage-sim");
            const eyeBtn = document.getElementById("btn-clean-mode");
            if (stageBtn && stageBtn.nextSibling) {
                topActions.insertBefore(btn, stageBtn.nextSibling);
            } else if (eyeBtn) {
                topActions.insertBefore(btn, eyeBtn);
            } else {
                topActions.appendChild(btn);
            }
        }

        syncButtonVisibility();
    }

    function syncButtonVisibility() {
        const btn = document.getElementById("btn-layout-gen");
        const hallActive = isHallScene();

        if (hallActive) {
            if (btn) {
                btn.style.display = "grid";
                btn.style.opacity = "1";
                btn.style.pointerEvents = "auto";
            }
        } else {
            if (btn) {
                btn.style.display = "none";
                btn.style.opacity = "0";
                btn.style.pointerEvents = "none";
            }
            if (isLayoutModalOpen) {
                closeLayoutGenerator();
            }
        }
    }

    // ── Tour Listeners & HUD Lifecycle ───────────────────────────────────
    function attachListeners() {
        function onSceneChange() {
            syncButtonVisibility();
            setTimeout(syncButtonVisibility, 80);
            setTimeout(syncButtonVisibility, 220);
        }

        if (window.tour && typeof window.tour.on === "function") {
            window.tour.on("mediaChange", onSceneChange);
        }
        if (window.tour && window.tour.player && typeof window.tour.player.on === "function") {
            window.tour.player.on("mediaChange", onSceneChange);
        }

        const gsvTargets = [document, window];
        gsvTargets.forEach(target => {
            target.addEventListener("gsvPovActivated", function () {
                closeLayoutGenerator();
                syncButtonVisibility();
            });
            target.addEventListener("gsvPovDeactivated", onSceneChange);
            target.addEventListener("cleanModeChanged", function (e) {
                if (e.detail && e.detail.isHidden && isLayoutModalOpen) {
                    closeLayoutGenerator();
                }
            });
        });

        const locEl = document.getElementById("spatial-location-name");
        if (locEl) {
            const observer = new MutationObserver(function () {
                onSceneChange();
            });
            observer.observe(locEl, { childList: true, characterData: true, subtree: true });
        }
    }

    // ── Initialization Cycle ─────────────────────────────────────────────
    function init() {
        createOrUpdateTriggerButton();
        attachListeners();

        setInterval(function () {
            createOrUpdateTriggerButton();
            syncButtonVisibility();
        }, 300);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // Expose Global Public API
    window.evpLayoutGenerator = {
        open: openLayoutGenerator,
        close: closeLayoutGenerator,
        toggle: toggleLayoutGenerator,
        setHall: function (hallLetter) {
            activeHallLetter = hallLetter;
            hallTabs.forEach(t => t.classList.toggle("is-active", t.getAttribute("data-hall") === activeHallLetter));
            drawLayoutBlueprint();
        },
        setLayout: function (mode) {
            activeLayoutMode = mode;
            modeTabs.forEach(t => t.classList.toggle("is-active", t.getAttribute("data-mode") === activeLayoutMode));
            drawLayoutBlueprint();
        },
        setDepth: function (depth) {
            activeStageDepth = Number(depth);
            depthTabs.forEach(t => t.classList.toggle("is-active", Number(t.getAttribute("data-depth")) === activeStageDepth));
            drawLayoutBlueprint();
        }
    };

})();
