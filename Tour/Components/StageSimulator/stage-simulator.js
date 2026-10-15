/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EVP TRADE & CONVENTION CENTRE — STAGE SIZE & SEATING SIMULATOR
 * Interactive stage dimensioning & dynamic seating recalculation for Halls A, B, C, D
 * Rendered as an anchored relative popover with standardized component styling.
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
    "use strict";

    // ── Configuration & Architectural Standards ─────────────────────────
    const HALL_CONFIG = {
        masterWidthFt: 80,             // Fixed stage width: 80 ft (24.38 m)
        masterWidthM: 24.38,
        minDepthFt: 40,                // Minimum stage depth (Standard Baseline)
        maxDepthFt: 60,                // Maximum stage depth
        defaultDepthFt: 40,            // Standard convention baseline depth
        stepDepthFt: 10,               // 3 Discrete Stops: 40 ft, 50 ft, 60 ft
        safetyBufferDepthFt: 10,       // 10 ft front/side safety clearance buffer (800 sq. ft)
        sqFtToSqM: 0.092903,
        // Certified hall specifications & baseline capacities at 40 ft stage depth
        halls: {
            "A": {
                name: "Hall A",
                grossDimensions: "376 ft × 144 ft",
                netAreaSqFt: 47160,
                theatre: 2250,
                classroom: 1120,
                cabaret: 850,
                sqFtTheatre: 19.182,
                sqFtClassroom: 38.535,
                sqFtCabaret: 50.776
            },
            "B": {
                name: "Hall B",
                grossDimensions: "376 ft × 144 ft",
                netAreaSqFt: 47160,
                theatre: 2250,
                classroom: 1120,
                cabaret: 850,
                sqFtTheatre: 19.182,
                sqFtClassroom: 38.535,
                sqFtCabaret: 50.776
            },
            "C": {
                name: "Hall C",
                grossDimensions: "376 ft × 144 ft",
                netAreaSqFt: 47160,
                theatre: 2250,
                classroom: 1120,
                cabaret: 850,
                sqFtTheatre: 19.182,
                sqFtClassroom: 38.535,
                sqFtCabaret: 50.776
            },
            "D": {
                name: "Hall D",
                grossDimensions: "316 ft × 150 ft",
                netAreaSqFt: 43428,
                theatre: 1800,
                classroom: 900,
                cabaret: 765,
                sqFtTheatre: 21.714,
                sqFtClassroom: 43.428,
                sqFtCabaret: 51.091
            }
        },
        presets: [
            { depth: 40, label: "40 ft", sub: "Standard Baseline" },
            { depth: 50, label: "50 ft", sub: "Extended Stage" },
            { depth: 60, label: "60 ft", sub: "Mega Stage" }
        ]
    };

    let selectedHallLetter = "A";
    let currentDepth = HALL_CONFIG.defaultDepthFt;
    let isSimulatorOpen = false;

    // ── Inject Component CSS ─────────────────────────────────────────────
    const styleEl = document.createElement("style");
    styleEl.id = "evp-stage-simulator-styles";
    styleEl.textContent = `
        /* ── Stage Simulator Top Button ── */
        .pcis-action-btn.btn-stage-sim {
            position: relative;
            background: rgba(255, 255, 255, 0.88);
            color: #131330;
            transition: all 260ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pcis-action-btn.btn-stage-sim:hover {
            border-color: rgba(255, 183, 3, 0.9);
            color: #FFB703;
            box-shadow: 0 8px 24px rgba(255, 183, 3, 0.28), 0 20px 48px rgba(19, 19, 48, 0.16);
            transform: translateY(-2px) scale(1.04);
        }
        .pcis-action-btn.btn-stage-sim.is-active {
            background: #ffffff;
            color: #d97706;
            border: 2px solid #FFB703 !important;
            box-shadow: 0 0 18px rgba(255, 183, 3, 0.42), 0 4px 12px rgba(19, 19, 48, 0.1);
        }
        .pcis-action-btn.btn-stage-sim .stage-btn-tag {
            position: absolute;
            bottom: -3px;
            right: -3px;
            width: 14px;
            height: 14px;
            background: #FFB703;
            border: 2px solid #ffffff;
            border-radius: 50%;
            pointer-events: none;
            box-shadow: 0 2px 6px rgba(19, 19, 48, 0.2);
            transform-origin: center center;
            animation: evpDotZoom 1.5s ease-in-out infinite;
        }
        @keyframes evpDotZoom {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 2px 6px rgba(19, 19, 48, 0.2), 0 0 6px rgba(255, 183, 3, 0.4);
            }
            50% {
                transform: scale(1.24);
                box-shadow: 0 2px 8px rgba(19, 19, 48, 0.2), 0 0 14px rgba(255, 183, 3, 0.6), 0 0 24px rgba(255, 183, 3, 0.3);
            }
        }

        /* ── Invisible Click-Catcher Backdrop (Preserves Panorama Visibility) ── */
        .evp-stage-sim-backdrop {
            position: fixed;
            inset: 0;
            z-index: 100065;
            background: transparent;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 200ms ease, visibility 200ms;
        }
        .evp-stage-sim-backdrop.is-visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        /* ── Anchored Relative Popover Dialog ── */
        .evp-stage-sim-popup {
            position: fixed;
            top: calc(max(18px, env(safe-area-inset-top)) + 58px);
            right: max(20px, env(safe-area-inset-right));
            width: 485px;
            max-width: calc(100vw - 28px);
            max-height: calc(100vh - max(18px, env(safe-area-inset-top)) - 78px);
            background: rgba(255, 255, 255, 0.94);
            -webkit-backdrop-filter: blur(28px) saturate(190%);
            backdrop-filter: blur(28px) saturate(190%);
            border: 1px solid rgba(255, 255, 255, 0.95);
            border-radius: 22px;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.05),
                0 24px 60px rgba(19, 19, 48, 0.22),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            z-index: 100075;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform-origin: top right;
            transform: translateY(-8px) scale(0.96);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
                        visibility 220ms;
            color: #131330;
            font-style: normal !important;
            font-family: 'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }
        .evp-stage-sim-popup.is-visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translateY(0) scale(1);
        }

        /* ── Mobile Bottom Sheet Drag Handle (Hidden on Desktop) ── */
        .stage-sim-sheet-handle-bar {
            display: none;
        }

        /* ── Popover Header (Seamless with Soft Drop Shadow, No Bottom Stroke) ── */
        .stage-sim-header {
            padding: 18px 20px 15px;
            background: rgba(255, 255, 255, 0.98);
            border-bottom: none !important;
            box-shadow: 0 4px 16px -2px rgba(19, 19, 48, 0.04);
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            z-index: 5;
        }
        .stage-sim-header-info {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        .stage-sim-badge-row {
            display: flex;
            align-items: center;
            gap: 7px;
        }
        .stage-sim-hall-pill {
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
        .stage-sim-hall-tabs {
            display: inline-flex;
            align-items: center;
            background: rgba(19, 19, 48, 0.05);
            border: 1px solid rgba(19, 19, 48, 0.08);
            border-radius: 9px;
            padding: 2px;
            gap: 2px;
        }
        .stage-sim-hall-tab {
            padding: 2.5px 8px;
            font-size: 10px;
            font-weight: 700;
            color: #5c5c7a;
            background: transparent;
            border: none;
            border-radius: 7px;
            cursor: pointer;
            transition: all 160ms ease;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            letter-spacing: 0.2px;
        }
        .stage-sim-hall-tab:hover {
            color: #131330;
        }
        .stage-sim-hall-tab.is-active {
            background: #ffffff;
            color: #d97706;
            box-shadow: 0 1px 4px rgba(19, 19, 48, 0.1);
        }
        .stage-sim-tag {
            color: #5c5c7a;
            font-size: 11.5px;
            font-weight: 600;
        }
        .stage-sim-title {
            margin: 0;
            font-size: 18px;
            font-weight: 800;
            color: #131330;
            letter-spacing: -0.2px;
        }
        .stage-sim-subtitle {
            margin: 0;
            font-size: 11.5px;
            color: #5c5c7a;
            font-weight: 500;
        }

        /* ── Standard EVP Red Circular Close Button (360° Hover Spin) ── */
        .stage-sim-close-btn {
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
        .stage-sim-close-btn i {
            font-size: 18px;
            line-height: 1;
            display: inline-flex;
            margin: 0;
            padding: 0;
            pointer-events: none;
            color: #FFFFFF;
        }
        .stage-sim-close-btn:hover {
            background: #DC2626;
            color: #FFFFFF;
            transform: rotate(360deg);
        }
        .stage-sim-close-btn:active {
            transform: rotate(360deg) scale(0.94);
        }

        /* ── Scrollable Popover Body ── */
        .stage-sim-body {
            padding: 16px 20px;
            overflow-y: auto;
            flex: 1;
            min-height: 0;
            max-height: calc(100vh - 180px);
            scrollbar-width: thin;
            scrollbar-color: #FFB703 transparent;
            display: flex;
            flex-direction: column;
            gap: 14px;
        }
        .stage-sim-body::-webkit-scrollbar {
            width: 5px;
        }
        .stage-sim-body::-webkit-scrollbar-thumb {
            background: #FFB703;
            border-radius: 4px;
        }

        /* ── Master Metric Bento Banner ── */
        .stage-sim-metrics-bento {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
            background: rgba(248, 249, 252, 0.9);
            border: 1px solid rgba(19, 19, 48, 0.04);
            box-shadow: 0 1px 4px rgba(19, 19, 48, 0.02);
            border-radius: 14px;
            padding: 9px 12px;
        }
        .sim-metric-cell {
            display: flex;
            flex-direction: column;
            gap: 1px;
        }
        .sim-metric-label {
            font-size: 9.5px;
            font-weight: 700;
            color: #5c5c7a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .sim-metric-val {
            font-size: 13.5px;
            font-weight: 800;
            color: #131330;
        }
        .sim-metric-val.gold {
            color: #d97706;
        }
        .sim-metric-sub {
            font-size: 9.5px;
            color: #7d7d9a;
            font-weight: 500;
        }

        /* ── Slider Interactive Section ── */
        .stage-slider-section {
            background: #ffffff;
            border: 1px solid rgba(19, 19, 48, 0.04);
            border-radius: 16px;
            padding: 14px 16px;
            box-shadow: 0 2px 10px rgba(19, 19, 48, 0.02);
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .stage-slider-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .stage-slider-label-wrap {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .stage-slider-label {
            font-size: 12.5px;
            font-weight: 700;
            color: #131330;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .stage-slider-hint {
            font-size: 11px;
            color: #5c5c7a;
        }
        .stage-slider-readout {
            background: rgba(255, 183, 3, 0.12);
            color: #d97706;
            border: 1px solid rgba(255, 183, 3, 0.45);
            padding: 4px 10px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 0.2px;
            box-shadow: 0 2px 8px rgba(255, 183, 3, 0.15);
            display: flex;
            align-items: baseline;
            gap: 4px;
        }
        .stage-slider-readout small {
            font-size: 10px;
            font-weight: 700;
            color: #131330;
            letter-spacing: 0.3px;
        }

        /* ── Range Input Styling ── */
        .stage-range-input {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 7px;
            border-radius: 6px;
            background: #e2e8f0;
            outline: none;
            margin: 6px 0 2px;
            cursor: pointer;
            position: relative;
        }
        .stage-range-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #FFB703;
            border: none !important;
            box-shadow: 0 2px 8px rgba(19, 19, 48, 0.24);
            cursor: grab;
            transition: transform 140ms ease, box-shadow 140ms ease;
        }
        .stage-range-input::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 4px 12px rgba(255, 183, 3, 0.45);
        }
        .stage-range-input::-webkit-slider-thumb:active {
            cursor: grabbing;
            transform: scale(1.22);
        }
        .stage-range-input::-moz-range-thumb {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #FFB703;
            border: none !important;
            box-shadow: 0 2px 8px rgba(19, 19, 48, 0.24);
            cursor: grab;
        }
        .stage-range-ticks {
            display: flex;
            justify-content: space-between;
            font-size: 10.5px;
            color: #7d7d9a;
            font-weight: 600;
            padding: 0 2px;
        }

        /* ── Slim Capsule Preset Buttons ── */
        .stage-presets-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-top: 4px;
        }
        .stage-preset-btn {
            background: rgba(19, 19, 48, 0.03);
            border: 1px solid rgba(19, 19, 48, 0.08);
            border-radius: 20px;
            padding: 6px 6px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            cursor: pointer;
            transition: all 180ms ease;
            text-align: center;
            outline: none !important;
        }
        .stage-preset-btn:hover {
            background: rgba(255, 183, 3, 0.12);
            border-color: rgba(255, 183, 3, 0.6);
            transform: translateY(-1px);
        }
        .stage-preset-btn.is-active {
            background: #FFFBEB;
            border: 1.5px solid #FFB703;
            color: #131330;
            box-shadow: 0 2px 8px rgba(255, 183, 3, 0.22);
            transform: translateY(-1px);
        }
        .stage-preset-btn.is-active .preset-name {
            color: #d97706;
        }
        .stage-preset-btn.is-active .preset-sub {
            color: #5c5c7a;
            font-weight: 700;
        }
        .preset-name {
            font-size: 11.5px;
            font-weight: 800;
            color: #131330;
        }
        .preset-sub {
            font-size: 9.5px;
            font-weight: 600;
            color: #5c5c7a;
            line-height: 1;
        }

        /* ── Capacity Layout: 3 Cards in 1 Row ── */
        .stage-capacity-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .stage-capacity-heading {
            font-size: 12px;
            font-weight: 800;
            color: #131330;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .stage-capacity-delta-note {
            font-size: 10px;
            color: #5c5c7a;
            font-weight: 600;
        }
        .stage-layouts-list {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }
        .stage-layout-card {
            background: #ffffff;
            border: 1px solid rgba(19, 19, 48, 0.05);
            border-radius: 14px;
            padding: 12px 6px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 6px;
            transition: all 200ms ease;
            box-shadow: 0 2px 6px rgba(19, 19, 48, 0.02);
        }
        .stage-layout-card:hover {
            border-color: rgba(255, 183, 3, 0.6);
            box-shadow: 0 4px 14px rgba(19, 19, 48, 0.06);
            transform: translateY(-2px);
        }
        .layout-card-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }
        .layout-icon-box {
            width: 34px;
            height: 34px;
            border-radius: 10px;
            background: rgba(19, 19, 48, 0.04);
            border: 1px solid rgba(19, 19, 48, 0.05);
            color: #131330;
            display: grid;
            place-items: center;
            font-size: 15px;
            transition: all 200ms ease;
        }
        .stage-layout-card:hover .layout-icon-box {
            background: #FFFBEB;
            color: #d97706;
            border-color: rgba(255, 183, 3, 0.5);
        }
        .layout-title {
            font-size: 11.5px;
            font-weight: 800;
            color: #131330;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }
        .layout-current-seats {
            font-size: 17px;
            font-weight: 800;
            color: #131330;
            line-height: 1.1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1px;
        }
        .layout-current-seats b {
            font-size: 17px;
            font-weight: 800;
            color: #131330;
        }
        .layout-current-seats span {
            font-size: 9px;
            font-weight: 700;
            color: #7d7d9a;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .layout-delta-tag {
            font-size: 9.5px;
            font-weight: 700;
            padding: 2px 5px;
            border-radius: 5px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
        }
        .layout-delta-tag.neutral {
            background: rgba(107, 114, 128, 0.08);
            color: #6b7280;
        }
        .layout-delta-tag.positive {
            background: rgba(16, 185, 129, 0.12);
            color: #059669;
        }
        .layout-delta-tag.negative {
            background: rgba(245, 158, 11, 0.12);
            color: #d97706;
        }

        /* ── Popover Footer ── */
        .stage-sim-footer {
            padding: 12px 18px;
            background: rgba(248, 249, 252, 0.98);
            border-top: 1px solid rgba(19, 19, 48, 0.05);
            box-shadow: 0 -2px 10px rgba(19, 19, 48, 0.02);
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 11px;
            color: #5c5c7a;
        }
        .stage-sim-actions-row {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
        }
        .stage-sim-btn-wa {
            flex: 1.1;
            background: #25D366;
            color: #FFFFFF;
            border: none;
            border-radius: 10px;
            padding: 8px 12px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            transition: all 180ms ease;
            box-shadow: 0 2px 8px rgba(37, 211, 102, 0.28);
            outline: none !important;
            text-decoration: none;
            font-family: 'Satoshi', sans-serif !important;
        }
        .stage-sim-btn-wa:hover {
            background: #20BA5A;
            box-shadow: 0 4px 14px rgba(37, 211, 102, 0.42);
            transform: translateY(-1px);
        }
        .stage-sim-btn-wa i {
            font-size: 14px;
        }
        .stage-sim-btn-export {
            flex: 0.9;
            background: #131330;
            color: #FFFFFF;
            border: 1px solid rgba(255, 183, 3, 0.4);
            border-radius: 10px;
            padding: 8px 12px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            transition: all 180ms ease;
            box-shadow: 0 2px 8px rgba(19, 19, 48, 0.15);
            outline: none !important;
            font-family: 'Satoshi', sans-serif !important;
        }
        .stage-sim-btn-export:hover {
            background: #1C1C46;
            border-color: #FFB703;
            color: #FFB703;
            box-shadow: 0 4px 14px rgba(19, 19, 48, 0.25);
            transform: translateY(-1px);
        }
        .stage-sim-btn-export i {
            font-size: 13px;
        }
        .stage-sim-btn-blueprint {
            flex: 1;
            background: rgba(255, 183, 3, 0.12);
            color: #d97706;
            border: 1px solid rgba(255, 183, 3, 0.5);
            border-radius: 10px;
            padding: 8px 10px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 180ms ease;
            box-shadow: 0 2px 8px rgba(255, 183, 3, 0.12);
            outline: none !important;
            font-family: 'Satoshi', sans-serif !important;
        }
        .stage-sim-btn-blueprint:hover {
            background: #FFB703;
            color: #070e1b;
            box-shadow: 0 4px 14px rgba(255, 183, 3, 0.35);
            transform: translateY(-1px);
        }
        .stage-sim-btn-blueprint i {
            font-size: 13px;
        }
        .stage-sim-footer-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            width: 100%;
        }
        .stage-sim-disclaimer {
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 500;
            line-height: 1.35;
            flex: 1;
            min-width: 0;
        }
        .stage-sim-disclaimer i {
            color: #FFB703;
            font-size: 12px;
            flex-shrink: 0;
        }
        .stage-sim-reset-btn {
            background: #ffffff;
            border: 1px solid rgba(19, 19, 48, 0.12);
            border-radius: 8px;
            padding: 5px 12px;
            font-size: 11px;
            font-weight: 700;
            color: #131330;
            cursor: pointer;
            transition: all 180ms ease;
            outline: none !important;
            white-space: nowrap;
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .stage-sim-reset-btn:hover {
            background: #FFFBEB;
            color: #d97706;
            border-color: #FFB703;
            box-shadow: 0 2px 8px rgba(255, 183, 3, 0.15);
        }

        /* ── Mobile Bottom Sheet Layout (<= 768px) ── */
        @media (max-width: 768px) {
            .evp-stage-sim-popup {
                top: auto !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                width: 100% !important;
                max-width: 100vw !important;
                height: auto;
                max-height: 85vh !important;
                max-height: 85dvh !important;
                border-radius: 24px 24px 0 0 !important;
                border-left: none !important;
                border-right: none !important;
                border-bottom: none !important;
                border-top: 1px solid rgba(255, 255, 255, 0.95) !important;
                box-shadow: 0 -8px 36px rgba(19, 19, 48, 0.22) !important;
                transform-origin: bottom center !important;
                transform: translateY(100%) !important;
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
                            opacity 240ms cubic-bezier(0.16, 1, 0.3, 1),
                            visibility 240ms !important;
            }
            .evp-stage-sim-popup.is-visible {
                transform: translateY(0) !important;
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: auto !important;
            }
            .stage-sim-sheet-handle-bar {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px 0 2px;
                background: rgba(255, 255, 255, 0.98);
                border-top-left-radius: 24px;
                border-top-right-radius: 24px;
                cursor: pointer;
                touch-action: none;
                flex-shrink: 0;
            }
            .stage-sim-sheet-handle {
                width: 38px;
                height: 4.5px;
                border-radius: 3px;
                background: rgba(19, 19, 48, 0.18);
                transition: background 180ms ease, width 180ms ease;
            }
            .stage-sim-sheet-handle-bar:active .stage-sim-sheet-handle {
                background: rgba(19, 19, 48, 0.35);
                width: 44px;
            }
            .stage-sim-header {
                padding: 10px 18px 13px !important;
                border-top-left-radius: 0 !important;
                border-top-right-radius: 0 !important;
            }
            .stage-sim-close-btn {
                width: 30px !important;
                height: 30px !important;
                min-width: 30px !important;
            }
            .stage-sim-close-btn i {
                font-size: 16px !important;
            }
            .stage-sim-title {
                font-size: 16px !important;
            }
            .stage-sim-subtitle {
                font-size: 11px !important;
            }
            .stage-sim-body {
                padding: 13px 16px 16px !important;
                gap: 12px !important;
                max-height: none !important;
                flex: 1 !important;
                min-height: 0 !important;
                -webkit-overflow-scrolling: touch;
            }
            .stage-sim-metrics-bento {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 6px !important;
                padding: 10px 12px !important;
            }
            .sim-metric-val {
                font-size: 14px !important;
            }
            .stage-slider-section {
                padding: 12px 14px !important;
                gap: 10px !important;
            }
            .stage-presets-grid {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 5px !important;
            }
            .stage-preset-btn {
                padding: 5px 3px !important;
            }
            .preset-name {
                font-size: 10.5px !important;
            }
            .preset-sub {
                font-size: 8.5px !important;
            }
            .stage-layouts-list {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 5px !important;
            }
            .stage-layout-card {
                padding: 10px 4px !important;
                gap: 4px !important;
            }
            .layout-icon-box {
                width: 30px !important;
                height: 30px !important;
                font-size: 13px !important;
            }
            .layout-title {
                font-size: 10.5px !important;
            }
            .layout-current-seats b {
                font-size: 15px !important;
            }
            .layout-delta-tag {
                font-size: 8.5px !important;
                padding: 1.5px 4px !important;
            }
            .stage-sim-footer {
                padding: 10px 16px max(14px, env(safe-area-inset-bottom)) !important;
                flex-direction: column !important;
                align-items: stretch !important;
                gap: 8px !important;
            }
            .stage-sim-disclaimer {
                font-size: 10.5px !important;
                line-height: 1.3 !important;
            }
            .stage-sim-disclaimer i {
                font-size: 11px !important;
            }
            .stage-sim-reset-btn {
                padding: 5px 10px !important;
                font-size: 10.5px !important;
                white-space: nowrap !important;
                flex-shrink: 0 !important;
            }
        }
    `;
    document.head.appendChild(styleEl);

    // ── Scene Detection Logic ────────────────────────────────────────────
    function getActiveSceneName() {
        // 1. GSV POV Player Guard (Outdoor Street View)
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

        // 2. HUD spatial location element (Direct source of truth for current scene)
        const locEl = document.getElementById("spatial-location-name");
        if (locEl) {
            const val = (locEl.getAttribute("data-english-name") || locEl.textContent || "").trim();
            if (val) return val;
        }

        // 3. 3DVista viewer media fallback
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
        // 1. GSV POV Player Guards
        if (typeof window.isGsvPovActive === "function" && window.isGsvPovActive()) return false;
        const gsvVp = document.getElementById("evp-gsv-pov-viewport");
        if (gsvVp && gsvVp.classList.contains("is-active")) return false;
        if (document.body.classList.contains("is-gsv-open")) return false;

        const sceneName = getActiveSceneName();
        if (!sceneName) return false;

        // Explicit Non-Hall / Outdoor keywords guard
        if (/arrival|driveway|canvas|parking|perimeter|entrance|plaza|foyer|connection|gsv|outdoor/i.test(sceneName)) {
            return false;
        }

        // Strictly match Exhibition Halls A, B, C, and D
        return /\bhall\s*[a-d]\b/i.test(sceneName) || /hall-[abcd]/i.test(sceneName);
    }

    function getActiveHallLetter() {
        const sceneName = getActiveSceneName();
        const match = sceneName.match(/\bhall\s*([a-d])\b/i) || sceneName.match(/hall-([abcd])/i);
        return match ? match[1].toUpperCase() : "A";
    }

    // ── Build Popover DOM Elements ───────────────────────────────────────
    // 1. Transparent Backdrop Click-Catcher
    const backdrop = document.createElement("div");
    backdrop.id = "evp-stage-sim-backdrop";
    backdrop.className = "evp-stage-sim-backdrop";
    backdrop.setAttribute("aria-hidden", "true");

    // 2. Relative Popover Dialog
    const popup = document.createElement("div");
    popup.id = "evp-stage-sim-popup";
    popup.className = "evp-stage-sim-popup";
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-modal", "false");
    popup.setAttribute("aria-label", "Stage Size and Seating Capacity Simulator");

    popup.innerHTML = `
        <!-- Mobile Bottom Sheet Drag Handle Bar -->
        <div class="stage-sim-sheet-handle-bar" aria-hidden="true">
            <div class="stage-sim-sheet-handle"></div>
        </div>

        <!-- Header -->
        <div class="stage-sim-header">
            <div class="stage-sim-header-info">
                <div class="stage-sim-badge-row">
                    <div class="stage-sim-hall-tabs" id="sim-hall-tabs">
                        <button type="button" class="stage-sim-hall-tab is-active" data-hall="A">Hall A</button>
                        <button type="button" class="stage-sim-hall-tab" data-hall="B">Hall B</button>
                        <button type="button" class="stage-sim-hall-tab" data-hall="C">Hall C</button>
                        <button type="button" class="stage-sim-hall-tab" data-hall="D">Hall D</button>
                    </div>
                    <span class="stage-sim-tag" id="sim-hall-dims-tag">376 × 144 ft</span>
                </div>
                <h2 class="stage-sim-title">Stage Size &amp; Seating Simulator</h2>
                <p class="stage-sim-subtitle">Simulate real-time seating capacities based on custom stage depth</p>
            </div>
            <!-- Standard EVP Red Circular Close Button (360° Hover Spin) -->
            <button type="button" class="stage-sim-close-btn" id="stage-sim-close-btn" aria-label="Close stage simulator">
                <i class="fi fi-rr-cross-small" aria-hidden="true"></i>
            </button>
        </div>

        <!-- Body -->
        <div class="stage-sim-body">
            <!-- Bento Metrics Bar -->
            <div class="stage-sim-metrics-bento">
                <div class="sim-metric-cell">
                    <span class="sim-metric-label">Master Width</span>
                    <span class="sim-metric-val">80 ft</span>
                    <span class="sim-metric-sub">24.4 m Fixed Span</span>
                </div>
                <div class="sim-metric-cell">
                    <span class="sim-metric-label">Stage Depth</span>
                    <span class="sim-metric-val gold" id="sim-metric-depth">40 ft</span>
                    <span class="sim-metric-sub" id="sim-metric-depth-m">12.2 m</span>
                </div>
                <div class="sim-metric-cell">
                    <span class="sim-metric-label">Stage Area</span>
                    <span class="sim-metric-val" id="sim-metric-area">3,200 sq.ft</span>
                    <span class="sim-metric-sub" id="sim-metric-area-m">297 m²</span>
                </div>
                <div class="sim-metric-cell">
                    <span class="sim-metric-label">Floor Share</span>
                    <span class="sim-metric-val gold" id="sim-metric-coverage">6.8%</span>
                    <span class="sim-metric-sub" id="sim-metric-coverage-sub">of 47,160 sq.ft</span>
                </div>
            </div>

            <!-- Depth Slider Controls -->
            <div class="stage-slider-section">
                <div class="stage-slider-header">
                    <div class="stage-slider-label-wrap">
                        <span class="stage-slider-label">
                            <i class="fi fi-rr-settings-sliders" style="color:#FFB703;"></i> Adjust Stage Depth
                        </span>
                        <span class="stage-slider-hint">3 Stage Modes: 40 ft, 50 ft, or 60 ft</span>
                    </div>
                    <div class="stage-slider-readout">
                        <span id="sim-slider-val">40</span> <small>FT DEPTH</small>
                    </div>
                </div>

                <input type="range" 
                    class="stage-range-input" 
                    id="stage-depth-range"
                    min="${HALL_CONFIG.minDepthFt}" 
                    max="${HALL_CONFIG.maxDepthFt}" 
                    step="${HALL_CONFIG.stepDepthFt}" 
                    value="${HALL_CONFIG.defaultDepthFt}">

                <div class="stage-range-ticks">
                    <span>40 ft (Standard)</span>
                    <span>50 ft (Extended)</span>
                    <span>60 ft (Mega)</span>
                </div>

                <!-- Quick Preset Selectors -->
                <div class="stage-presets-grid" id="stage-presets-grid">
                    ${HALL_CONFIG.presets.map(p => `
                        <button type="button" class="stage-preset-btn ${p.depth === 40 ? "is-active" : ""}" data-depth="${p.depth}">
                            <span class="preset-name">${p.label}</span>
                            <span class="preset-sub">• ${p.depth === 40 ? "Standard" : p.depth === 50 ? "Extended" : "Mega"}</span>
                        </button>
                    `).join("")}
                </div>
            </div>

            <!-- Dynamic Capacity Impact Cards (3 Cards in 1 Row) -->
            <div>
                <div class="stage-capacity-header">
                    <span class="stage-capacity-heading">
                        <i class="fi fi-rr-users-alt" style="color:#FFB703;"></i> Projected Capacities (Approx.)
                    </span>
                    <span class="stage-capacity-delta-note">Delta vs. 40 ft Baseline</span>
                </div>
                <div class="stage-layouts-list">
                    <!-- 1. Theatre -->
                    <div class="stage-layout-card" id="card-theatre">
                        <div class="layout-card-header">
                            <div class="layout-icon-box">
                                <i class="fi fi-rr-chair"></i>
                            </div>
                            <span class="layout-title">Theatre</span>
                        </div>
                        <div class="layout-current-seats">
                            <b id="val-theatre">~2,250</b>
                            <span>SEATS</span>
                        </div>
                        <span class="layout-delta-tag neutral" id="delta-theatre">±0 Baseline</span>
                    </div>

                    <!-- 2. Classroom -->
                    <div class="stage-layout-card" id="card-classroom">
                        <div class="layout-card-header">
                            <div class="layout-icon-box">
                                <i class="fi fi-rr-screen"></i>
                            </div>
                            <span class="layout-title">Classroom</span>
                        </div>
                        <div class="layout-current-seats">
                            <b id="val-classroom">~1,120</b>
                            <span>SEATS</span>
                        </div>
                        <span class="layout-delta-tag neutral" id="delta-classroom">±0 Baseline</span>
                    </div>

                    <!-- 3. Cabaret / Banquet -->
                    <div class="stage-layout-card" id="card-cabaret">
                        <div class="layout-card-header">
                            <div class="layout-icon-box">
                                <i class="fi fi-rr-restaurant"></i>
                            </div>
                            <span class="layout-title">Cabaret</span>
                        </div>
                        <div class="layout-current-seats">
                            <b id="val-cabaret">~850</b>
                            <span>SEATS</span>
                        </div>
                        <span class="layout-delta-tag neutral" id="delta-cabaret">±0 Baseline</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="stage-sim-footer">
            <div class="stage-sim-actions-row">
                <button type="button" class="stage-sim-btn-blueprint" id="stage-sim-btn-blueprint" aria-label="Open 2D Seating Layout Blueprint">
                    <i class="fi fi-rr-blueprint" aria-hidden="true"></i>
                    <span>2D Blueprint</span>
                </button>
                <button type="button" class="stage-sim-btn-wa" id="stage-sim-btn-wa" aria-label="Inquire via WhatsApp">
                    <i class="fi fi-brands-whatsapp" aria-hidden="true"></i>
                    <span>WhatsApp</span>
                </button>
                <button type="button" class="stage-sim-btn-export" id="stage-sim-btn-export" aria-label="Save or print event spec sheet">
                    <i class="fi fi-rr-document-signed" aria-hidden="true"></i>
                    <span>Spec Sheet</span>
                </button>
            </div>
            <div class="stage-sim-footer-meta">
                <div class="stage-sim-disclaimer">
                    <i class="fi fi-sr-shield-check"></i>
                    <span>Planning estimate (varies by aisle &amp; AV setup).</span>
                </div>
                <button type="button" class="stage-sim-reset-btn" id="stage-sim-reset-btn">
                    Reset to 40 ft
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(popup);

    // ── Cache DOM Elements ───────────────────────────────────────────────
    const btnBlueprint = document.getElementById("stage-sim-btn-blueprint");
    const btnWa = document.getElementById("stage-sim-btn-wa");
    const btnExport = document.getElementById("stage-sim-btn-export");
    const rangeInput = document.getElementById("stage-depth-range");
    const sliderValEl = document.getElementById("sim-slider-val");
    const metricDepthEl = document.getElementById("sim-metric-depth");
    const metricDepthMEl = document.getElementById("sim-metric-depth-m");
    const metricAreaEl = document.getElementById("sim-metric-area");
    const metricAreaMEl = document.getElementById("sim-metric-area-m");
    const metricCoverageEl = document.getElementById("sim-metric-coverage");
    const metricCoverageSubEl = document.getElementById("sim-metric-coverage-sub");
    const hallDimsTagEl = document.getElementById("sim-hall-dims-tag");
    const hallTabs = popup.querySelectorAll(".stage-sim-hall-tab");
    const closeBtn = document.getElementById("stage-sim-close-btn");
    const resetBtn = document.getElementById("stage-sim-reset-btn");
    const presetBtns = popup.querySelectorAll(".stage-preset-btn");

    const valTheatreEl = document.getElementById("val-theatre");
    const deltaTheatreEl = document.getElementById("delta-theatre");
    const valClassroomEl = document.getElementById("val-classroom");
    const deltaClassroomEl = document.getElementById("delta-classroom");
    const valCabaretEl = document.getElementById("val-cabaret");
    const deltaCabaretEl = document.getElementById("delta-cabaret");

    // Wire hall switcher tab clicks
    hallTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            selectedHallLetter = this.getAttribute("data-hall") || "A";
            hallTabs.forEach(t => t.classList.toggle("is-active", t.getAttribute("data-hall") === selectedHallLetter));
            updateSimulatorCalculations(currentDepth);
        });
    });

    // ── Dynamic Recalculation Engine ─────────────────────────────────────
    function updateSimulatorCalculations(depth) {
        currentDepth = Number(depth);

        const hall = HALL_CONFIG.halls[selectedHallLetter] || HALL_CONFIG.halls["A"];

        // Update range & readout
        rangeInput.value = currentDepth;
        sliderValEl.textContent = currentDepth;

        // Stage metrics
        const stageAreaSqFt = HALL_CONFIG.masterWidthFt * currentDepth;
        const stageAreaSqM = Math.round(stageAreaSqFt * HALL_CONFIG.sqFtToSqM);
        const depthM = (currentDepth * 0.3048).toFixed(1);
        const coveragePct = ((stageAreaSqFt / hall.netAreaSqFt) * 100).toFixed(1);

        metricDepthEl.textContent = `${currentDepth} ft`;
        metricDepthMEl.textContent = `${depthM} m`;
        metricAreaEl.textContent = `${stageAreaSqFt.toLocaleString()} sq.ft`;
        metricAreaMEl.textContent = `${stageAreaSqM} m²`;
        metricCoverageEl.textContent = `${coveragePct}%`;
        if (metricCoverageSubEl) {
            metricCoverageSubEl.textContent = `of ${hall.netAreaSqFt.toLocaleString()} sq.ft`;
        }
        if (hallDimsTagEl) {
            hallDimsTagEl.textContent = hall.grossDimensions;
        }

        // Update slider track fill
        const pct = ((currentDepth - HALL_CONFIG.minDepthFt) / (HALL_CONFIG.maxDepthFt - HALL_CONFIG.minDepthFt)) * 100;
        rangeInput.style.background = `linear-gradient(to right, #FFB703 0%, #FFB703 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;

        // Presets highlight
        presetBtns.forEach(btn => {
            const btnDepth = Number(btn.getAttribute("data-depth"));
            btn.classList.toggle("is-active", btnDepth === currentDepth);
        });

        // Floor space deduction delta relative to standard 40 ft
        const areaDeltaSqFt = (HALL_CONFIG.masterWidthFt * HALL_CONFIG.defaultDepthFt) - (HALL_CONFIG.masterWidthFt * currentDepth);

        // 1. Theatre
        const theatreDelta = Math.round(areaDeltaSqFt / hall.sqFtTheatre);
        const theatreSeats = hall.theatre + theatreDelta;
        renderCapacityRow(valTheatreEl, deltaTheatreEl, theatreSeats, theatreDelta);

        // 2. Classroom
        const classroomDelta = Math.round(areaDeltaSqFt / hall.sqFtClassroom);
        const classroomSeats = hall.classroom + classroomDelta;
        renderCapacityRow(valClassroomEl, deltaClassroomEl, classroomSeats, classroomDelta);

        // 3. Cabaret
        const cabaretDelta = Math.round(areaDeltaSqFt / hall.sqFtCabaret);
        const cabaretSeats = hall.cabaret + cabaretDelta;
        renderCapacityRow(valCabaretEl, deltaCabaretEl, cabaretSeats, cabaretDelta);
    }

    function renderCapacityRow(valEl, deltaEl, seats, delta) {
        valEl.textContent = `~${seats.toLocaleString()}`;

        if (delta === 0) {
            deltaEl.className = "layout-delta-tag neutral";
            deltaEl.textContent = "±0 Baseline";
        } else if (delta > 0) {
            deltaEl.className = "layout-delta-tag positive";
            deltaEl.innerHTML = `+${delta.toLocaleString()} seats`;
        } else {
            deltaEl.className = "layout-delta-tag negative";
            deltaEl.innerHTML = `${delta.toLocaleString()} seats`;
        }
    }

    // ── Relative Popup Anchor Positioning ────────────────────────────────
    function alignPopupWithButton() {
        if (!popup) return;
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // Mobile bottom-sheet layout is handled by CSS
            popup.style.top = "";
            popup.style.bottom = "";
            popup.style.left = "";
            popup.style.right = "";
            popup.style.width = "";
            popup.style.maxHeight = "";
            return;
        }

        const btn = document.getElementById("btn-stage-sim");
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const rightOffset = Math.max(16, window.innerWidth - rect.right);
        popup.style.top = (rect.bottom + 8) + "px";
        popup.style.right = rightOffset + "px";
        popup.style.left = "auto";
        popup.style.bottom = "auto";
        popup.style.width = "485px";
        popup.style.maxHeight = `calc(100vh - ${rect.bottom + 20}px)`;
    }

    // ── Open / Close State Controller ────────────────────────────────────
    function openSimulator() {
        if (!isHallScene()) {
            closeSimulator();
            syncSimulatorButtonVisibility();
            return;
        }

        selectedHallLetter = getActiveHallLetter();
        hallTabs.forEach(t => t.classList.toggle("is-active", t.getAttribute("data-hall") === selectedHallLetter));
        updateSimulatorCalculations(currentDepth);

        popup.style.transform = "";
        popup.style.transition = "";
        alignPopupWithButton();
        backdrop.classList.add("is-visible");
        popup.classList.add("is-visible");
        isSimulatorOpen = true;

        const btn = document.getElementById("btn-stage-sim");
        if (btn) btn.classList.add("is-active");
    }

    function closeSimulator() {
        backdrop.classList.remove("is-visible");
        popup.classList.remove("is-visible");
        popup.style.transform = "";
        popup.style.transition = "";
        isSimulatorOpen = false;

        const btn = document.getElementById("btn-stage-sim");
        if (btn) btn.classList.remove("is-active");
    }

    function toggleSimulator() {
        if (isSimulatorOpen) {
            closeSimulator();
        } else {
            openSimulator();
        }
    }

    // ── Wire Modal Events ────────────────────────────────────────────────
    rangeInput.addEventListener("input", function (e) {
        updateSimulatorCalculations(e.target.value);
    });

    presetBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const depth = Number(this.getAttribute("data-depth"));
            updateSimulatorCalculations(depth);
        });
    });

    // ── Export to WhatsApp (Commercial Proposal Request) ────────────────
    function exportToWhatsApp() {
        const hall = HALL_CONFIG.halls[selectedHallLetter] || HALL_CONFIG.halls["A"];
        const stageAreaSqFt = HALL_CONFIG.masterWidthFt * currentDepth;
        const stageAreaSqM = Math.round(stageAreaSqFt * HALL_CONFIG.sqFtToSqM);
        const coveragePct = ((stageAreaSqFt / hall.netAreaSqFt) * 100).toFixed(1);
        const rigging = selectedHallLetter === "D" ? "231 Points (1T Rated)" : "252 Points (1T Rated)";
        const theatreCount = valTheatreEl ? valTheatreEl.textContent.trim() : "~2,250";
        const theatreDelta = deltaTheatreEl ? deltaTheatreEl.textContent.trim() : "±0 Baseline";
        const classroomCount = valClassroomEl ? valClassroomEl.textContent.trim() : "~1,120";
        const classroomDelta = deltaClassroomEl ? deltaClassroomEl.textContent.trim() : "±0 Baseline";
        const cabaretCount = valCabaretEl ? valCabaretEl.textContent.trim() : "~850";
        const cabaretDelta = deltaCabaretEl ? deltaCabaretEl.textContent.trim() : "±0 Baseline";

        const msg = [
            "*EVP TRADE & CONVENTION CENTRE — EVENT SPECIFICATION INQUIRY*",
            "--------------------------------------------------",
            `*Venue:* ${hall.name} (${hall.grossDimensions})`,
            `*Total Hall Area:* ${hall.netAreaSqFt.toLocaleString()} sq.ft`,
            `*Stage Dimensions:* ${HALL_CONFIG.masterWidthFt} ft (W) × ${currentDepth} ft (D)`,
            `*Stage Area:* ${stageAreaSqFt.toLocaleString()} sq.ft (${stageAreaSqM} m²)`,
            `*Floor Share:* ${coveragePct}% of net hall floor`,
            "",
            "*ESTIMATED CAPACITIES:*",
            `• Theatre Style: ${theatreCount} (${theatreDelta})`,
            `• Classroom Style: ${classroomCount} (${classroomDelta})`,
            `• Cabaret Style: ${cabaretCount} (${cabaretDelta})`,
            "",
            "*CERTIFIED ENGINEERING SPECS:*",
            "• Clear Ceiling Height: 15 metres (49.2 ft)",
            "• Floor Load Bearing: 5 T/m²",
            `• Overhead Rigging: ${rigging}`,
            "• Climate Control: 300 TR Precision HVAC",
            "",
            "Please share availability, commercial proposal, and technical clearance for this configuration.",
            "--------------------------------------------------",
            "EVP Trade & Convention Centre, Poonamallee, Chennai",
            "Tel: +91 85258 11111 | Web: evptradecentre.com"
        ].join("\n");

        const waUrl = "https://wa.me/918525811111?text=" + encodeURIComponent(msg);
        window.open(waUrl, "_blank", "noopener,noreferrer");
    }

    // ── Export to Printable PDF Spec Sheet ──────────────────────────────
    function exportToPrintablePDF() {
        const hall = HALL_CONFIG.halls[selectedHallLetter] || HALL_CONFIG.halls["A"];
        const stageAreaSqFt = HALL_CONFIG.masterWidthFt * currentDepth;
        const stageAreaSqM = Math.round(stageAreaSqFt * HALL_CONFIG.sqFtToSqM);
        const depthM = (currentDepth * 0.3048).toFixed(1);
        const coveragePct = ((stageAreaSqFt / hall.netAreaSqFt) * 100).toFixed(1);
        const rigging = selectedHallLetter === "D" ? "231 Points (1T Capacity each)" : "252 Points (1T Capacity each)";
        const theatreCount = valTheatreEl ? valTheatreEl.textContent.trim() : "~2,250";
        const theatreDelta = deltaTheatreEl ? deltaTheatreEl.textContent.trim() : "±0 Baseline";
        const classroomCount = valClassroomEl ? valClassroomEl.textContent.trim() : "~1,120";
        const classroomDelta = deltaClassroomEl ? deltaClassroomEl.textContent.trim() : "±0 Baseline";
        const cabaretCount = valCabaretEl ? valCabaretEl.textContent.trim() : "~850";
        const cabaretDelta = deltaCabaretEl ? deltaCabaretEl.textContent.trim() : "±0 Baseline";

        const now = new Date();
        const dateFormatted = now.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
        const refCode = `EVP-SPEC-${selectedHallLetter}-${currentDepth}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        const printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EVP Event Spec Sheet — ${hall.name} (${currentDepth}ft Stage)</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-style: normal !important;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #f8fafc;
            color: #0f172a;
            line-height: 1.5;
            padding: 24px;
        }
        .page-container {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
            padding: 36px 40px;
        }
        .print-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e2e8f0;
        }
        .print-btn {
            background: linear-gradient(135deg, #FFB703 0%, #FB8500 100%);
            color: #0b0f19;
            border: none;
            padding: 10px 22px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(251, 133, 0, 0.25);
            transition: all 0.2s ease;
        }
        .print-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(251, 133, 0, 0.35);
        }
        .close-hint {
            font-size: 12px;
            color: #64748b;
        }
        .brand-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 24px;
            border-bottom: 2px solid #0f172a;
            margin-bottom: 28px;
        }
        .brand-logo-col h1 {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: #0f172a;
            text-transform: uppercase;
        }
        .brand-logo-col p {
            font-size: 12px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #d97706;
            font-weight: 700;
            margin-top: 2px;
        }
        .brand-contact-col {
            text-align: right;
            font-size: 11px;
            color: #475569;
            line-height: 1.6;
        }
        .brand-contact-col b {
            color: #0f172a;
        }
        .doc-title-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 20px;
        }
        .doc-title-row h2 {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
        }
        .doc-ref-badge {
            font-size: 11px;
            font-family: monospace;
            background: #f1f5f9;
            padding: 4px 8px;
            border-radius: 4px;
            color: #475569;
            font-weight: 600;
        }
        .section-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 20px;
        }
        .section-header {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #d97706;
            font-weight: 700;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
        }
        .spec-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .spec-label {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .spec-value {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
        }
        .spec-value.highlight {
            color: #d97706;
        }
        .table-wrap {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            text-align: left;
        }
        th {
            background: #f1f5f9;
            color: #334155;
            font-weight: 700;
            padding: 10px 14px;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #e2e8f0;
        }
        td {
            padding: 11px 14px;
            border-bottom: 1px solid #e2e8f0;
            color: #0f172a;
        }
        tr:last-child td {
            border-bottom: none;
        }
        .seat-count {
            font-size: 14px;
            font-weight: 800;
            color: #0f172a;
        }
        .delta-neutral {
            color: #64748b;
            font-weight: 600;
        }
        .delta-positive {
            color: #059669;
            font-weight: 600;
        }
        .delta-negative {
            color: #dc2626;
            font-weight: 600;
        }
        .footer-note {
            margin-top: 28px;
            padding-top: 16px;
            border-top: 1px dashed #cbd5e1;
            font-size: 11px;
            color: #64748b;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .footer-note span {
            display: block;
        }
        @media print {
            body {
                background: #ffffff !important;
                padding: 0 !important;
            }
            .page-container {
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                max-width: 100% !important;
            }
            .no-print {
                display: none !important;
            }
            @page {
                size: A4 portrait;
                margin: 15mm;
            }
        }
    </style>
</head>
<body>
    <div class="page-container">
        <div class="print-bar no-print">
            <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
            <span class="close-hint">Tip: Select &quot;Save as PDF&quot; destination in print dialog</span>
        </div>

        <div class="brand-header">
            <div class="brand-logo-col">
                <h1>EVP Trade Centre</h1>
                <p>Convention &amp; Exhibition Centre</p>
            </div>
            <div class="brand-contact-col">
                <b>Venue &amp; Sales Office</b><br>
                Chennai-Bangalore Highway, Poonamallee<br>
                Chennai, Tamil Nadu 600056<br>
                Tel: +91 85258 11111 | Email: info@evptradecentre.com<br>
                Web: www.evptradecentre.com
            </div>
        </div>

        <div class="doc-title-row">
            <h2>Technical Event Specification Sheet</h2>
            <div class="doc-ref-badge">${refCode} | ${dateFormatted}</div>
        </div>

        <div class="section-card">
            <div class="section-header">1. Hall &amp; Stage Footprint</div>
            <div class="grid-2">
                <div class="spec-item">
                    <span class="spec-label">Selected Venue</span>
                    <span class="spec-value">${hall.name} (${hall.grossDimensions})</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Net Exhibition Area</span>
                    <span class="spec-value">${hall.netAreaSqFt.toLocaleString()} sq.ft (${Math.round(hall.netAreaSqFt * HALL_CONFIG.sqFtToSqM).toLocaleString()} m²)</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Stage Width &times; Depth</span>
                    <span class="spec-value highlight">${HALL_CONFIG.masterWidthFt} ft &times; ${currentDepth} ft (${HALL_CONFIG.masterWidthM}m &times; ${depthM}m)</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Stage Area &amp; Hall Share</span>
                    <span class="spec-value highlight">${stageAreaSqFt.toLocaleString()} sq.ft (${stageAreaSqM} m²) &bull; ${coveragePct}% Coverage</span>
                </div>
            </div>
        </div>

        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Seating Style</th>
                        <th>Standard Capacity (40 ft Stage)</th>
                        <th>Simulated Capacity (${currentDepth} ft Stage)</th>
                        <th>Capacity Variance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><b>Theatre Style</b><br><span style="color:#64748b; font-size:11px;">Auditorium keynote arrangement</span></td>
                        <td>${hall.theatre.toLocaleString()} seats</td>
                        <td class="seat-count">${theatreCount}</td>
                        <td>${theatreDelta}</td>
                    </tr>
                    <tr>
                        <td><b>Classroom Style</b><br><span style="color:#64748b; font-size:11px;">Conference tables with seating</span></td>
                        <td>${hall.classroom.toLocaleString()} seats</td>
                        <td class="seat-count">${classroomCount}</td>
                        <td>${classroomDelta}</td>
                    </tr>
                    <tr>
                        <td><b>Cabaret Style</b><br><span style="color:#64748b; font-size:11px;">Banquet round tables facing stage</span></td>
                        <td>${hall.cabaret.toLocaleString()} seats</td>
                        <td class="seat-count">${cabaretCount}</td>
                        <td>${cabaretDelta}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section-card">
            <div class="section-header">2. Certified Engineering Specifications</div>
            <div class="grid-3">
                <div class="spec-item">
                    <span class="spec-label">Clear Ceiling Height</span>
                    <span class="spec-value">15 Metres (49.2 ft)</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Floor Load Bearing</span>
                    <span class="spec-value">5 T/m² (Heavy Industrial)</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Overhead Rigging</span>
                    <span class="spec-value">${rigging}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Air Conditioning</span>
                    <span class="spec-value">300 TR Precision HVAC</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Substation Power</span>
                    <span class="spec-value">11kV HT + 100% DG Backup</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Production Amenities</span>
                    <span class="spec-value">Green Rooms &amp; Loading Docks</span>
                </div>
            </div>
        </div>

        <div class="footer-note">
            <span>Generated via EVP Virtual Tour &bull; Stage &amp; Seating Simulation System</span>
            <span>Subject to final technical rider approval &bull; EVP Trade Centre</span>
        </div>
    </div>

    <script>
        window.addEventListener('load', function() {
            setTimeout(function() {
                window.print();
            }, 350);
        });
    <\/script>
</body>
</html>`;

        const printWin = window.open("", "_blank", "width=850,height=1000");
        if (printWin) {
            printWin.document.open();
            printWin.document.write(printHtml);
            printWin.document.close();
        } else {
            alert("Please allow popups to save or print the EVP Event Specification Sheet.");
        }
    }

    if (btnBlueprint) {
        btnBlueprint.addEventListener("click", function () {
            closeSimulator();
            if (window.evpLayoutGenerator && typeof window.evpLayoutGenerator.open === "function") {
                window.evpLayoutGenerator.setHall(selectedHallLetter);
                window.evpLayoutGenerator.setDepth(currentDepth);
                window.evpLayoutGenerator.open();
            }
        });
    }

    if (btnWa) {
        btnWa.addEventListener("click", exportToWhatsApp);
    }
    if (btnExport) {
        btnExport.addEventListener("click", exportToPrintablePDF);
    }

    closeBtn.addEventListener("click", closeSimulator);
    resetBtn.addEventListener("click", function () {
        updateSimulatorCalculations(HALL_CONFIG.defaultDepthFt);
    });

    backdrop.addEventListener("click", closeSimulator);

    // Mobile drag handle bar tap to dismiss
    const handleBar = popup.querySelector(".stage-sim-sheet-handle-bar");
    if (handleBar) {
        handleBar.addEventListener("click", closeSimulator);
    }

    // Mobile touch swipe down to dismiss
    let touchStartY = 0;
    let touchCurrentDiff = 0;
    let isDraggingSheet = false;

    popup.addEventListener("touchstart", function (e) {
        if (window.innerWidth > 768) return;
        if (e.target.closest(".stage-range-input") || e.target.closest("button") || e.target.closest(".stage-preset-btn")) {
            return;
        }
        const bodyEl = popup.querySelector(".stage-sim-body");
        const isScrolledToTop = !bodyEl || bodyEl.scrollTop <= 0;
        const isHeaderTouch = !!e.target.closest(".stage-sim-header") || !!e.target.closest(".stage-sim-sheet-handle-bar");

        if (isHeaderTouch || isScrolledToTop) {
            touchStartY = e.touches[0].clientY;
            touchCurrentDiff = 0;
            isDraggingSheet = true;
        }
    }, { passive: true });

    popup.addEventListener("touchmove", function (e) {
        if (!isDraggingSheet || window.innerWidth > 768) return;
        const currentY = e.touches[0].clientY;
        touchCurrentDiff = currentY - touchStartY;
        if (touchCurrentDiff > 0) {
            popup.style.transform = `translateY(${touchCurrentDiff}px)`;
            popup.style.transition = "none";
        } else {
            popup.style.transform = "";
        }
    }, { passive: true });

    popup.addEventListener("touchend", function () {
        if (!isDraggingSheet || window.innerWidth > 768) return;
        isDraggingSheet = false;
        popup.style.transition = "";
        if (touchCurrentDiff > 70) {
            closeSimulator();
        } else {
            popup.style.transform = "";
        }
        touchStartY = 0;
        touchCurrentDiff = 0;
    }, { passive: true });

    window.addEventListener("resize", function () {
        if (isSimulatorOpen) alignPopupWithButton();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isSimulatorOpen) {
            closeSimulator();
        }
    });

    // ── Top-Right Cluster Integration ────────────────────────────────────
    function createOrUpdateTopButton() {
        let btn = document.getElementById("btn-stage-sim");
        const topActions = document.getElementById("pcis-top-actions");

        if (!topActions) {
            return;
        }

        if (!btn) {
            btn = document.createElement("button");
            btn.id = "btn-stage-sim";
            btn.className = "pcis-action-btn btn-stage-sim";
            btn.type = "button";
            btn.setAttribute("aria-label", "Open Stage Size & Seating Simulator");
            btn.setAttribute("data-tooltip", "Stage Simulator");

            btn.innerHTML = `
                <i class="fi fi-rr-settings-sliders" aria-hidden="true"></i>
                <span class="stage-btn-tag" title="Hall A-D Tool"></span>
            `;

            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                toggleSimulator();
            });

            // Prepend before clean view eye button
            const eyeBtn = document.getElementById("btn-clean-mode");
            if (eyeBtn) {
                topActions.insertBefore(btn, eyeBtn);
            } else {
                topActions.appendChild(btn);
            }
        }

        syncSimulatorButtonVisibility();
    }

    // ── Visibility & Hall Synchronization ────────────────────────────────
    function syncSimulatorButtonVisibility() {
        const btn = document.getElementById("btn-stage-sim");
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

            // If user navigated away from Halls A-D, auto-close simulator immediately
            if (isSimulatorOpen) {
                closeSimulator();
            }
        }
    }

    // ── Listeners for Scene Changes & GSV POV Guard ──────────────────────
    function attachTourListeners() {
        function onSceneOrMediaChange() {
            syncSimulatorButtonVisibility();
            setTimeout(syncSimulatorButtonVisibility, 60);
            setTimeout(syncSimulatorButtonVisibility, 200);
            setTimeout(syncSimulatorButtonVisibility, 450);
        }

        if (window.tour && typeof window.tour.on === "function") {
            window.tour.on("mediaChange", onSceneOrMediaChange);
        }
        if (window.tour && window.tour.player && typeof window.tour.player.on === "function") {
            window.tour.player.on("mediaChange", onSceneOrMediaChange);
        }

        // GSV POV Guards: listen on BOTH document and window
        const gsvTargets = [document, window];
        gsvTargets.forEach(target => {
            target.addEventListener("gsvPovActivated", function () {
                closeSimulator();
                syncSimulatorButtonVisibility();
            });
            target.addEventListener("gsvPovDeactivated", function () {
                onSceneOrMediaChange();
            });
            target.addEventListener("cleanModeChanged", function (e) {
                if (e.detail && e.detail.isHidden && isSimulatorOpen) {
                    closeSimulator();
                }
            });
        });

        // DOM Observer on spatial location name in HUD (fires immediately on ANY scene switch)
        const locEl = document.getElementById("spatial-location-name");
        if (locEl) {
            const observer = new MutationObserver(function () {
                onSceneOrMediaChange();
            });
            observer.observe(locEl, { childList: true, characterData: true, subtree: true });
        }
    }

    // ── Initialization Cycle ─────────────────────────────────────────────
    function init() {
        updateSimulatorCalculations(HALL_CONFIG.defaultDepthFt);

        createOrUpdateTopButton();
        attachTourListeners();

        // Continuous watchdog: guarantees simulator button & modal NEVER persist outside Halls A-D
        setInterval(function () {
            createOrUpdateTopButton();
            syncSimulatorButtonVisibility();
        }, 250);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // Expose Global API for interoperability
    window.evpStageSimulator = {
        open: openSimulator,
        close: closeSimulator,
        toggle: toggleSimulator,
        setDepth: updateSimulatorCalculations,
        isHallActive: isHallScene
    };

})();
