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
        stepDepthFt: 2,
        hallNetAreaSqFt: 47160,        // Net usable column-free hall space (144 ft x 376 ft)
        safetyBufferDepthFt: 10,       // 10 ft front/side safety clearance buffer (800 sq. ft)
        sqFtToSqM: 0.092903,
        // Standard capacities at baseline 40 ft depth (3,200 sq. ft stage + 800 sq. ft safety buffer)
        baselines: {
            theatre: {
                name: "Theatre Layout",
                icon: "fi-rr-chair",
                baselineSeats: 2250,
                sqFtPerSeat: 19.182,   // Net seating floor density with aisles
                badge: "Plenary / Keynote"
            },
            classroom: {
                name: "Classroom Layout",
                icon: "fi-rr-screen",
                baselineSeats: 1120,
                sqFtPerSeat: 38.535,   // Net seating floor density with continuous tables
                badge: "Training / Seminar"
            },
            cabaret: {
                name: "Cabaret / Banquet Layout",
                icon: "fi-rr-restaurant",
                baselineSeats: 850,
                sqFtPerSeat: 50.776,   // Net seating floor density with 60\" rounds & aisles
                badge: "Gala / Dining"
            }
        },
        presets: [
            { depth: 40, label: "40 ft", sub: "Standard Baseline" },
            { depth: 50, label: "50 ft", sub: "Extended Stage" },
            { depth: 60, label: "60 ft", sub: "Mega Stage" }
        ]
    };

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
            border-top: none !important;
            box-shadow: 0 -2px 10px rgba(19, 19, 48, 0.02);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            font-size: 11px;
            color: #5c5c7a;
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
                flex-direction: row !important;
                align-items: center !important;
                justify-content: space-between !important;
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
        if (locEl && locEl.textContent && locEl.textContent.trim()) {
            return locEl.textContent.trim();
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
                    <span class="stage-sim-hall-pill" id="sim-hall-indicator">
                        <i class="fi fi-sr-apps"></i> HALL A
                    </span>
                    <span class="stage-sim-tag">Acoustic &amp; Capacity Modeler</span>
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
                    <span class="sim-metric-sub">of 47,160 sq.ft</span>
                </div>
            </div>

            <!-- Depth Slider Controls -->
            <div class="stage-slider-section">
                <div class="stage-slider-header">
                    <div class="stage-slider-label-wrap">
                        <span class="stage-slider-label">
                            <i class="fi fi-rr-settings-sliders" style="color:#FFB703;"></i> Adjust Stage Depth
                        </span>
                        <span class="stage-slider-hint">Scale stage projection from 40 ft to 60 ft</span>
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
            <div class="stage-sim-disclaimer">
                <i class="fi fi-sr-shield-check"></i>
                <span>Planning estimate (varies by aisle &amp; AV setup).</span>
            </div>
            <button type="button" class="stage-sim-reset-btn" id="stage-sim-reset-btn">
                Reset to 40 ft
            </button>
        </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(popup);

    // ── Cache DOM Elements ───────────────────────────────────────────────
    const rangeInput = document.getElementById("stage-depth-range");
    const sliderValEl = document.getElementById("sim-slider-val");
    const metricDepthEl = document.getElementById("sim-metric-depth");
    const metricDepthMEl = document.getElementById("sim-metric-depth-m");
    const metricAreaEl = document.getElementById("sim-metric-area");
    const metricAreaMEl = document.getElementById("sim-metric-area-m");
    const metricCoverageEl = document.getElementById("sim-metric-coverage");
    const hallIndicatorEl = document.getElementById("sim-hall-indicator");
    const closeBtn = document.getElementById("stage-sim-close-btn");
    const resetBtn = document.getElementById("stage-sim-reset-btn");
    const presetBtns = popup.querySelectorAll(".stage-preset-btn");

    const valTheatreEl = document.getElementById("val-theatre");
    const deltaTheatreEl = document.getElementById("delta-theatre");
    const valClassroomEl = document.getElementById("val-classroom");
    const deltaClassroomEl = document.getElementById("delta-classroom");
    const valCabaretEl = document.getElementById("val-cabaret");
    const deltaCabaretEl = document.getElementById("delta-cabaret");

    // ── Dynamic Recalculation Engine ─────────────────────────────────────
    function updateSimulatorCalculations(depth) {
        currentDepth = Number(depth);

        // Update range & readout
        rangeInput.value = currentDepth;
        sliderValEl.textContent = currentDepth;

        // Stage metrics
        const stageAreaSqFt = HALL_CONFIG.masterWidthFt * currentDepth;
        const stageAreaSqM = Math.round(stageAreaSqFt * HALL_CONFIG.sqFtToSqM);
        const depthM = (currentDepth * 0.3048).toFixed(1);
        const coveragePct = ((stageAreaSqFt / HALL_CONFIG.hallNetAreaSqFt) * 100).toFixed(1);

        metricDepthEl.textContent = `${currentDepth} ft`;
        metricDepthMEl.textContent = `${depthM} m`;
        metricAreaEl.textContent = `${stageAreaSqFt.toLocaleString()} sq.ft`;
        metricAreaMEl.textContent = `${stageAreaSqM} m²`;
        metricCoverageEl.textContent = `${coveragePct}%`;

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
        const theatreDelta = Math.round(areaDeltaSqFt / HALL_CONFIG.baselines.theatre.sqFtPerSeat);
        const theatreSeats = HALL_CONFIG.baselines.theatre.baselineSeats + theatreDelta;
        renderCapacityRow(valTheatreEl, deltaTheatreEl, theatreSeats, theatreDelta);

        // 2. Classroom
        const classroomDelta = Math.round(areaDeltaSqFt / HALL_CONFIG.baselines.classroom.sqFtPerSeat);
        const classroomSeats = HALL_CONFIG.baselines.classroom.baselineSeats + classroomDelta;
        renderCapacityRow(valClassroomEl, deltaClassroomEl, classroomSeats, classroomDelta);

        // 3. Cabaret
        const cabaretDelta = Math.round(areaDeltaSqFt / HALL_CONFIG.baselines.cabaret.sqFtPerSeat);
        const cabaretSeats = HALL_CONFIG.baselines.cabaret.baselineSeats + cabaretDelta;
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

        const hallLetter = getActiveHallLetter();
        hallIndicatorEl.innerHTML = `<i class="fi fi-sr-apps"></i> HALL ${hallLetter}`;
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
