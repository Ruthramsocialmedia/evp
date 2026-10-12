// ═══════════════════════════════════════════════════════════════════════
//  EVP TRADE & CONVENTION CENTRE — INTERACTIVE CAMPUS FLOOR PLAN & RADAR
//  White Frosted Glassmorphism with Imperial Gold & Obsidian styling
//  • Interactive Venue Site Map with 10 calibrated campus destination nodes
//  • Real-time rotating camera Radar Cone synchronized with 3DVista viewer
//  • Two-way scene navigation (Indoor 360° Panoramas + Outdoor GSV POVs)
//  • Category filtering (Halls, Hospitality, Outdoor Arenas, Parking)
// ═══════════════════════════════════════════════════════════════════════

(function () {
    "use strict";

    if (document.getElementById("evp-floorplan-root")) return;

    // ── 10 Calibrated Campus Destination Nodes (Percentage Coordinates) ──
    const CAMPUS_NODES = [
        {
            id: "hall-a",
            name: "Exhibition Hall A",
            category: "halls",
            categoryLabel: "Mega Hall",
            x: 50.0,
            y: 34.0,
            icon: "fi fi-sr-apps",
            area: "54,144 sq.ft (5,030 m²)",
            metric: "5 Tonne/m² Floor Load | 252 Rigging Points",
            panoName: "Exhibition Hall A",
            panoKey: "Hall A - Classroom",
            isIndoor: true,
            gsvId: null
        },
        {
            id: "hall-b",
            name: "Exhibition Hall B",
            category: "halls",
            categoryLabel: "Mega Hall",
            x: 58.0,
            y: 47.0,
            icon: "fi fi-sr-apps",
            area: "54,144 sq.ft (5,030 m²)",
            metric: "5 Tonne/m² Floor Load | 252 Rigging Points",
            panoName: "Exhibition Hall B",
            panoKey: "Hall B - Classroom",
            isIndoor: true,
            gsvId: null
        },
        {
            id: "hall-c",
            name: "Exhibition Hall C",
            category: "halls",
            categoryLabel: "Mega Hall",
            x: 65.0,
            y: 54.0,
            icon: "fi fi-sr-apps",
            area: "54,144 sq.ft (5,030 m²)",
            metric: "5 Tonne/m² Floor Load | 7 Fire Exits",
            panoName: "Exhibition Hall C",
            panoKey: "Hall C - Classroom",
            isIndoor: true,
            gsvId: null
        },
        {
            id: "hall-d",
            name: "Exhibition Hall D (Widest)",
            category: "halls",
            categoryLabel: "Convention Hall",
            x: 72.0,
            y: 60.0,
            icon: "fi fi-sr-apps",
            area: "47,762 sq.ft (4,438 m²)",
            metric: "150 ft Clear Span Width | 231 Rigging Points",
            panoName: "Exhibition Hall D",
            panoKey: "Hall D - Classroom",
            isIndoor: true,
            gsvId: null
        },
        {
            id: "entrance-plaza",
            name: "Entrance Plaza & Foyer",
            category: "hospitality",
            categoryLabel: "Pre-Function",
            x: 49.5,
            y: 51.5,
            icon: "fi fi-sr-archway",
            area: "20,300 sq.ft (1,885 m²)",
            metric: "Grand Registration Concourse & Information Desks",
            panoName: "Entrance Plaza & Foyer",
            panoKey: "Entrance Plaza & Foyer",
            isIndoor: true,
            gsvId: null
        },
        {
            id: "food-court",
            name: "Central Food Court & Dining",
            category: "hospitality",
            categoryLabel: "Culinary Hub",
            x: 48.5,
            y: 64.5,
            icon: "fi fi-sr-restaurant",
            area: "26,364 sq.ft (2,449 m²)",
            metric: "14 Modular Culinary Kiosks + 800-Seat Dining Hall",
            panoName: "Food Court",
            panoKey: "Food Court",
            isIndoor: true,
            gsvId: null
        },
        {
            id: "canvas-1",
            name: "THE CANVAS 1 (Open Arena)",
            category: "outdoor",
            categoryLabel: "Outdoor Arena",
            x: 50.5,
            y: 8.5,
            icon: "fi fi-sr-flag",
            area: "93,980 sq.ft (8,732 m²)",
            metric: "Clear-Span Heavy Concrete Arena (15,000 Guests)",
            panoName: null,
            panoKey: null,
            isIndoor: false,
            gsvId: "canvas1"
        },
        {
            id: "canvas-2",
            name: "THE CANVAS 2 (Mega Concert Ground)",
            category: "outdoor",
            categoryLabel: "Concert Arena",
            x: 77.0,
            y: 38.0,
            icon: "fi fi-sr-flag",
            area: "1,89,564 sq.ft (17,611 m²)",
            metric: "Massive Open-Air Festival & Staging Grounds",
            panoName: null,
            panoKey: null,
            isIndoor: false,
            gsvId: "canvas2"
        },
        {
            id: "parking-1",
            name: "Parking Zone 1 (Main Campus Parking)",
            category: "outdoor",
            categoryLabel: "Parking Bay",
            x: 61.0,
            y: 82.5,
            icon: "fi fi-sr-car",
            area: "Paved Heavy Parking (8,000+ Vehicles)",
            metric: "Direct Access to Trade Halls & Heavy Transport",
            panoName: null,
            panoKey: null,
            isIndoor: false,
            gsvId: "parking1"
        },
        {
            id: "arrival-gate",
            name: "Grand Highway Arrival Gate",
            category: "outdoor",
            categoryLabel: "Highway Portal",
            x: 80.5,
            y: 74.0,
            icon: "fi fi-sr-road",
            area: "NH-4 National Highway Access",
            metric: "Monumental Highway Portal & Security Checkpoints",
            panoName: null,
            panoKey: null,
            isIndoor: false,
            gsvId: "arrival-gate"
        }
    ];

    let isModalOpen = false;
    let activeFilter = "all";
    let activeNodeId = "hall-a";

    // ── Inject Component CSS ─────────────────────────────────────────────
    const styleEl = document.createElement("style");
    styleEl.id = "evp-floorplan-styles";
    styleEl.textContent = `
        /* ── Top-Right Trigger Button ── */
        .pcis-action-btn.btn-floorplan {
            background: rgba(255, 255, 255, 0.88);
            color: #131330;
            transition: all 260ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pcis-action-btn.btn-floorplan:hover {
            border-color: rgba(255, 183, 3, 0.9);
            color: #FFB703;
            box-shadow: 0 8px 24px rgba(255, 183, 3, 0.28), 0 20px 48px rgba(19, 19, 48, 0.16);
            transform: translateY(-2px) scale(1.04);
        }
        .pcis-action-btn.btn-floorplan.is-active {
            background: #ffffff;
            color: #d97706;
            border: 2px solid #FFB703 !important;
            box-shadow: 0 0 18px rgba(255, 183, 3, 0.42), 0 4px 12px rgba(19, 19, 48, 0.1);
        }

        /* ── Backdrop Overlay ── */
        .evp-fp-backdrop {
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
        .evp-fp-backdrop.is-visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        /* ── Floor Plan Modal Container ── */
        .evp-fp-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.96);
            width: min(940px, 94vw);
            max-height: 92vh;
            background: rgba(255, 255, 255, 0.95);
            -webkit-backdrop-filter: blur(32px) saturate(190%);
            backdrop-filter: blur(32px) saturate(190%);
            border: 1px solid rgba(255, 255, 255, 0.95);
            border-radius: 24px;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.05),
                0 28px 70px rgba(19, 19, 48, 0.26),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            z-index: 100075;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 260ms cubic-bezier(0.16, 1, 0.3, 1),
                        visibility 260ms;
            color: #131330;
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            font-style: normal !important;
        }
        .evp-fp-modal.is-visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translate(-50%, -50%) scale(1);
        }

        /* ── Modal Header ── */
        .evp-fp-header {
            padding: 16px 22px 14px;
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 4px 16px -2px rgba(19, 19, 48, 0.04);
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            z-index: 10;
        }
        .evp-fp-header-left {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .evp-fp-badge-row {
            display: flex;
            align-items: center;
            gap: 7px;
        }
        .evp-fp-badge {
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
        .evp-fp-title {
            margin: 0;
            font-size: 18px;
            font-weight: 800;
            color: #131330;
            letter-spacing: -0.2px;
        }
        .evp-fp-subtitle {
            margin: 0;
            font-size: 11.5px;
            color: #5c5c7a;
            font-weight: 500;
        }

        /* ── Standard EVP Red Circular Close Button (360° Hover Spin) ── */
        .evp-fp-close-btn {
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
        .evp-fp-close-btn i {
            font-size: 18px;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1em;
            height: 1em;
            margin: 0;
            padding: 0;
            pointer-events: none;
            color: #FFFFFF;
        }
        .evp-fp-close-btn:hover {
            background: #DC2626;
            color: #FFFFFF;
            transform: rotate(360deg);
        }
        .evp-fp-close-btn:active {
            transform: rotate(360deg) scale(0.94);
        }

        /* ── Category Filter Bar ── */
        .evp-fp-filter-bar {
            padding: 10px 22px;
            background: #F8F9FC;
            border-bottom: 1px solid rgba(19, 19, 48, 0.05);
            display: flex;
            align-items: center;
            gap: 8px;
            overflow-x: auto;
            scrollbar-width: none;
        }
        .evp-fp-filter-bar::-webkit-scrollbar {
            display: none;
        }
        .evp-fp-filter-btn {
            background: #ffffff;
            border: 1px solid rgba(19, 19, 48, 0.08);
            border-radius: 18px;
            padding: 5px 12px;
            font-size: 11px;
            font-weight: 700;
            color: #5c5c7a;
            cursor: pointer;
            transition: all 180ms ease;
            white-space: nowrap;
            outline: none !important;
        }
        .evp-fp-filter-btn:hover {
            background: rgba(255, 183, 3, 0.1);
            color: #d97706;
            border-color: rgba(255, 183, 3, 0.5);
        }
        .evp-fp-filter-btn.is-active {
            background: #FFFBEB;
            border: 1.5px solid #FFB703;
            color: #d97706;
            box-shadow: 0 2px 8px rgba(255, 183, 3, 0.2);
        }
        .evp-fp-btn-short {
            display: none;
        }
        .evp-fp-btn-full {
            display: inline;
        }

        /* ── Map Canvas Stage ── */
        .evp-fp-map-stage {
            position: relative;
            width: 100%;
            background: #0B111E;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            max-height: calc(88vh - 160px);
        }
        .evp-fp-map-wrap {
            position: relative;
            width: 100%;
            max-width: 100%;
            line-height: 0;
            user-select: none;
        }
        .evp-fp-map-img {
            width: 100%;
            height: auto;
            display: block;
            pointer-events: none;
        }

        /* ── Calibrated Pins ── */
        .evp-fp-pin {
            position: absolute;
            transform: translate(-50%, -50%);
            z-index: 20;
            cursor: pointer;
            transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
            outline: none !important;
            line-height: normal;
        }
        .evp-fp-pin:hover {
            transform: translate(-50%, -50%) scale(1.18);
            z-index: 35;
        }
        .evp-fp-pin.is-hidden {
            display: none !important;
        }
        .evp-fp-pin-dot {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #FFB703;
            color: #131330;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
            transition: all 220ms ease;
            box-sizing: border-box;
            position: relative;
        }
        .evp-fp-svg {
            width: 14px;
            height: 14px;
            display: block;
            margin: auto;
            pointer-events: none;
            color: inherit;
            transform-origin: center center;
            transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .evp-fp-pin-dot i {
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            width: 1em;
            height: 1em;
            margin: 0;
            padding: 0;
            text-align: center;
            vertical-align: 0;
            transform: translateY(-1px);
            transform-origin: center center;
            transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), color 220ms ease;
        }
        .evp-fp-pin-dot i::before {
            display: block;
            line-height: 1;
            margin: 0;
            padding: 0;
            vertical-align: 0;
        }
        .evp-fp-pin:hover .evp-fp-pin-dot {
            background: #FFB703;
            color: #131330;
            border-color: #ffffff;
            box-shadow: 0 0 16px rgba(255, 183, 3, 0.8), 0 2px 8px rgba(0,0,0,0.4);
        }
        .evp-fp-pin:hover .evp-fp-pin-dot .evp-fp-svg {
            transform: scale(1.15);
        }
        .evp-fp-pin:hover .evp-fp-pin-dot i {
            transform: translateY(-1px) scale(1.24);
        }
        .evp-fp-pin.is-active {
            z-index: 36;
        }
        .evp-fp-pin.is-active .evp-fp-pin-dot {
            background: #FFB703;
            color: #131330;
            border-color: #ffffff;
            box-shadow: 0 0 16px rgba(255, 183, 3, 0.8), 0 2px 8px rgba(0, 0, 0, 0.35);
        }
        .evp-fp-pin.is-active .evp-fp-pin-dot .evp-fp-svg {
            transform: scale(1.12);
        }
        .evp-fp-pin.is-active:hover .evp-fp-pin-dot .evp-fp-svg {
            transform: scale(1.18);
        }
        .evp-fp-pin.is-active .evp-fp-pin-dot i {
            transform: translateY(-1px) scale(1.15);
        }
        .evp-fp-pin.is-active:hover .evp-fp-pin-dot i {
            transform: translateY(-1px) scale(1.24);
        }

        /* ── "YOU ARE HERE" Wayfinding Marker Badge (White Glassmorphism) ── */
        .evp-fp-yah-badge {
            position: absolute;
            bottom: calc(100% + 9px);
            left: 50%;
            transform: translateX(-50%) translateY(0);
            background: rgba(255, 255, 255, 0.95);
            -webkit-backdrop-filter: blur(20px) saturate(190%);
            backdrop-filter: blur(20px) saturate(190%);
            border: 1px solid rgba(255, 255, 255, 0.98);
            border-radius: 20px;
            padding: 4px 10px 4px 8px;
            display: inline-flex;
            align-items: center;
            gap: 5.5px;
            white-space: nowrap;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.12),
                0 14px 30px rgba(19, 19, 48, 0.16),
                inset 0 1px 1px rgba(255, 255, 255, 1);
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
            transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms ease;
            z-index: 38;
        }
        .evp-fp-yah-badge::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px 5px 0 5px;
            border-style: solid;
            border-color: rgba(255, 255, 255, 0.95) transparent transparent transparent;
            filter: drop-shadow(0 2px 2px rgba(19, 19, 48, 0.1));
        }
        .evp-fp-yah-badge.is-flipped-down {
            bottom: auto;
            top: calc(100% + 9px);
        }
        .evp-fp-yah-badge.is-flipped-down::after {
            top: auto;
            bottom: 100%;
            border-width: 0 5px 5px 5px;
            border-style: solid;
            border-color: transparent transparent rgba(255, 255, 255, 0.95) transparent;
            filter: drop-shadow(0 -2px 2px rgba(19, 19, 48, 0.1));
        }
        .evp-fp-pin.is-active .evp-fp-yah-badge {
            opacity: 1;
            visibility: visible;
        }
        /* Fade out YAH badge on pin hover so building tooltip displays cleanly */
        .evp-fp-pin.is-active:hover .evp-fp-yah-badge {
            opacity: 0;
            visibility: hidden;
        }
        .evp-fp-yah-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #10B981;
            box-shadow: 0 0 6px rgba(16, 185, 129, 0.9);
            flex-shrink: 0;
        }
        .evp-fp-yah-text {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
            font-size: 9.5px;
            font-weight: 800;
            letter-spacing: 0.6px;
            color: #131330;
            line-height: 1;
            text-transform: uppercase;
        }

        /* ── Clean White Glassmorphism Tooltip ── */
        .evp-fp-tooltip {
            position: absolute;
            bottom: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%) translateY(4px);
            background: rgba(255, 255, 255, 0.94);
            -webkit-backdrop-filter: blur(20px) saturate(190%);
            backdrop-filter: blur(20px) saturate(190%);
            border: 1px solid rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 8px 14px;
            color: #131330;
            font-size: 11px;
            line-height: 1.35 !important;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
            transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.08),
                0 16px 36px rgba(19, 19, 48, 0.16),
                inset 0 1px 1px rgba(255, 255, 255, 1);
            z-index: 40;
            display: flex;
            flex-direction: column;
            gap: 3px;
            align-items: center;
            text-align: center;
            box-sizing: border-box;
        }
        .evp-fp-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px 6px 0 6px;
            border-style: solid;
            border-color: rgba(255, 255, 255, 0.94) transparent transparent transparent;
            filter: drop-shadow(0 2px 2px rgba(19, 19, 48, 0.08));
        }
        .evp-fp-tooltip.is-flipped-down {
            bottom: auto;
            top: calc(100% + 10px);
            transform: translateX(-50%) translateY(-4px);
        }
        .evp-fp-tooltip.is-flipped-down::after {
            top: auto;
            bottom: 100%;
            border-width: 0 6px 5px 6px;
            border-style: solid;
            border-color: transparent transparent rgba(255, 255, 255, 0.94) transparent;
            filter: drop-shadow(0 -2px 2px rgba(19, 19, 48, 0.08));
        }
        .evp-fp-pin:hover .evp-fp-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }
        .evp-fp-pin:hover .evp-fp-tooltip.is-flipped-down {
            transform: translateX(-50%) translateY(0);
        }
        .evp-fp-tt-title {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-weight: 800;
            color: #131330;
            font-size: 11.5px;
            line-height: 1.35 !important;
            display: block;
            letter-spacing: -0.01em;
            margin: 0;
            padding: 0;
        }
        .evp-fp-tt-sub {
            font-family: 'Satoshi', sans-serif !important;
            color: #5C5C7A;
            font-size: 10px;
            font-weight: 600;
            line-height: 1.35 !important;
            display: block;
            margin: 0;
            padding: 0;
        }
        .evp-fp-tt-hint {
            font-family: 'Satoshi', sans-serif !important;
            color: #059669;
            font-size: 9.5px;
            font-weight: 700;
            line-height: 1.35 !important;
            margin-top: 2px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .evp-fp-tt-hint i {
            font-size: 8px;
            line-height: 1;
        }

        /* ── Modal Footer ── */
        .evp-fp-footer {
            padding: 10px 22px;
            background: #F8F9FC;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 11px;
            color: #5c5c7a;
            border-top: 1px solid rgba(19, 19, 48, 0.05);
        }
        .evp-fp-footer-hint {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .evp-fp-footer-hint i {
            color: #FFB703;
        }
        .evp-fp-active-pill {
            background: #ffffff;
            border: 1px solid rgba(19, 19, 48, 0.08);
            border-radius: 8px;
            padding: 4px 10px;
            font-weight: 700;
            color: #131330;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        .evp-fp-live-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #25D366;
            box-shadow: 0 0 6px rgba(37, 211, 102, 0.7);
        }

        /* ── Mobile Responsiveness ── */
        @media (max-width: 768px) {
            .evp-fp-modal {
                width: 95vw !important;
                max-width: 440px !important;
                max-height: 92vh !important;
                border-radius: 18px !important;
            }
            .evp-fp-header {
                padding: 10px 14px 8px !important;
            }
            .evp-fp-badge-row span:last-child {
                display: none !important;
            }
            .evp-fp-badge {
                font-size: 9px !important;
                padding: 2px 6px !important;
                border-radius: 6px !important;
            }
            .evp-fp-title {
                font-size: 15px !important;
            }
            .evp-fp-subtitle {
                font-size: 10px !important;
                line-height: 1.25 !important;
            }
            .evp-fp-close-btn {
                width: 30px !important;
                height: 30px !important;
                min-width: 30px !important;
            }
            .evp-fp-close-btn i {
                font-size: 16px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 1em !important;
                height: 1em !important;
            }
            .evp-fp-filter-bar {
                padding: 6px 8px !important;
                gap: 4px !important;
                overflow-x: hidden !important;
                display: flex !important;
                justify-content: space-between !important;
            }
            .evp-fp-filter-btn {
                flex: 1 1 0 !important;
                min-width: 0 !important;
                font-size: 9.5px !important;
                padding: 5px 2px !important;
                border-radius: 14px !important;
                text-align: center !important;
                white-space: nowrap !important;
            }
            .evp-fp-btn-full {
                display: none !important;
            }
            .evp-fp-btn-short {
                display: inline !important;
            }
            .evp-fp-pin {
                min-width: 32px !important;
                min-height: 32px !important;
                display: grid !important;
                place-items: center !important;
                -webkit-tap-highlight-color: transparent !important;
            }
            .evp-fp-pin:hover {
                transform: translate(-50%, -50%) scale(1.08) !important;
            }
            .evp-fp-pin-dot {
                width: 18px !important;
                height: 18px !important;
                border-width: 1.5px !important;
                box-shadow: 0 1px 6px rgba(0, 0, 0, 0.35) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                line-height: 0 !important;
            }
            .evp-fp-svg {
                width: 9.5px !important;
                height: 9.5px !important;
                display: block !important;
                margin: auto !important;
            }
            .evp-fp-pin:hover .evp-fp-pin-dot .evp-fp-svg {
                transform: scale(1.15) !important;
            }
            .evp-fp-pin.is-active .evp-fp-pin-dot .evp-fp-svg {
                transform: scale(1.1) !important;
            }
            .evp-fp-pin.is-active:hover .evp-fp-pin-dot .evp-fp-svg {
                transform: scale(1.18) !important;
            }
            .evp-fp-pin-dot i {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                line-height: 1 !important;
                width: 1em !important;
                height: 1em !important;
                margin: 0 !important;
                padding: 0 !important;
                vertical-align: 0 !important;
                transform: translateY(-0.8px) !important;
                transform-origin: center center !important;
                transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1) !important;
            }
            .evp-fp-pin-dot i::before {
                display: block !important;
                line-height: 1 !important;
                margin: 0 !important;
                padding: 0 !important;
                vertical-align: 0 !important;
            }
            .evp-fp-pin:hover .evp-fp-pin-dot i {
                transform: translateY(-0.8px) scale(1.22) !important;
            }
            .evp-fp-pin.is-active .evp-fp-pin-dot i {
                transform: translateY(-0.8px) scale(1.15) !important;
            }
            .evp-fp-pin.is-active:hover .evp-fp-pin-dot i {
                transform: translateY(-0.8px) scale(1.22) !important;
            }
            .evp-fp-yah-badge {
                padding: 3px 7px 3px 5px !important;
                gap: 4px !important;
                border-width: 1px !important;
                bottom: calc(100% + 6px) !important;
            }
            .evp-fp-yah-badge.is-flipped-down {
                bottom: auto !important;
                top: calc(100% + 6px) !important;
            }
            .evp-fp-yah-dot {
                width: 5px !important;
                height: 5px !important;
            }
            .evp-fp-yah-text {
                font-size: 8px !important;
                letter-spacing: 0.4px !important;
            }
            .evp-fp-tooltip {
                padding: 5px 9px !important;
                border-radius: 8px !important;
                font-size: 9.5px !important;
                gap: 2px !important;
            }
            .evp-fp-tt-title {
                font-size: 10px !important;
            }
            .evp-fp-tt-sub {
                font-size: 8.5px !important;
            }
            .evp-fp-tt-hint {
                font-size: 8px !important;
                margin-top: 1px !important;
            }
            .evp-fp-footer {
                padding: 8px 12px !important;
            }
            .evp-fp-footer-hint {
                display: none !important;
            }
            .evp-fp-active-pill {
                width: 100% !important;
                box-sizing: border-box !important;
                justify-content: center !important;
                font-size: 10.5px !important;
                padding: 5px 8px !important;
                text-align: center !important;
            }
        }
        @media (max-height: 500px) {
            .evp-fp-modal {
                max-height: 98vh !important;
                width: 96vw !important;
            }
            .evp-fp-header {
                padding: 6px 12px !important;
            }
            .evp-fp-filter-bar {
                padding: 4px 10px !important;
            }
            .evp-fp-footer {
                padding: 5px 10px !important;
            }
        }
    `;
    document.head.appendChild(styleEl);

    // ── High-Precision SVG Vector Icons (Mathematically Centered in 24x24 viewBox) ──
    function getNodeSvgIcon(iconName) {
        switch (iconName) {
            case "fi fi-sr-apps":
                return `<svg class="evp-fp-svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                    <rect x="4" y="4" width="6.5" height="6.5" rx="2" />
                    <rect x="13.5" y="4" width="6.5" height="6.5" rx="2" />
                    <rect x="4" y="13.5" width="6.5" height="6.5" rx="2" />
                    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2" />
                </svg>`;
            case "fi fi-sr-archway":
                return `<svg class="evp-fp-svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                    <path d="M4 21V9a8 8 0 0 1 16 0v12h-3v-9a5 5 0 0 0-10 0v9H4zm-1-17h18a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2z"/>
                </svg>`;
            case "fi fi-sr-restaurant":
                return `<svg class="evp-fp-svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                    <path d="M11 9H9V3H7v6H5V3H3v6a4 4 0 0 0 3 3.86V21h2v-8.14A4 4 0 0 0 11 9zm7-6a4 4 0 0 0-4 4v5h2v8h2V3z"/>
                </svg>`;
            case "fi fi-sr-flag":
                return `<svg class="evp-fp-svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                    <path d="M5 21h2V14h11.5a1 1 0 0 0 .8-1.6L16.5 8.5l2.8-3.9a1 1 0 0 0-.8-1.6H7V2H5v19z"/>
                </svg>`;
            case "fi fi-sr-car":
                return `<svg class="evp-fp-svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 16c-.83 0-1.5-.67-1.5-1.5S18.17 13 19 13s1.5.67 1.5 1.5S19.83 16 19 16zm-14 0c-.83 0-1.5-.67-1.5-1.5S4.17 13 5 13s1.5.67 1.5 1.5S5.83 16 5 16z"/>
                </svg>`;
            case "fi fi-sr-road":
                return `<svg class="evp-fp-svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                    <path d="M18.1 3H5.9L4 21h16L18.1 3zM11 6h2v3h-2V6zm0 5h2v3h-2v-3zm0 5h2v3h-2v-3z"/>
                </svg>`;
            default:
                return `<i class="${iconName}"></i>`;
        }
    }

    // ── Build Modal Elements ──
    const backdrop = document.createElement("div");
    backdrop.id = "evp-floorplan-backdrop";
    backdrop.className = "evp-fp-backdrop";

    const modal = document.createElement("div");
    modal.id = "evp-floorplan-modal";
    modal.className = "evp-fp-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-label", "EVP Campus Floor Plan and Site Map");

    modal.innerHTML = `
        <!-- Header -->
        <div class="evp-fp-header">
            <div class="evp-fp-header-left">
                <div class="evp-fp-badge-row">
                    <span class="evp-fp-badge">
                        <i class="fi fi-sr-map-marker"></i> Interactive Site Map
                    </span>
                    <span style="font-size: 11px; color:#5c5c7a; font-weight:600;">EVP Campus Navigator</span>
                </div>
                <h2 class="evp-fp-title">Venue Master Site Map</h2>
                <p class="evp-fp-subtitle">Tap any building pin to explore in 360°</p>
            </div>
            <button type="button" class="evp-fp-close-btn" id="evp-fp-close-btn" aria-label="Close campus map">
                <i class="fi fi-rr-cross-small" aria-hidden="true"></i>
            </button>
        </div>

        <!-- Filter Bar -->
        <div class="evp-fp-filter-bar">
            <button type="button" class="evp-fp-filter-btn is-active" data-filter="all">
                <span class="evp-fp-btn-full">All Locations (10)</span>
                <span class="evp-fp-btn-short">All (10)</span>
            </button>
            <button type="button" class="evp-fp-filter-btn" data-filter="halls">
                <span class="evp-fp-btn-full">Exhibition Halls (A–D)</span>
                <span class="evp-fp-btn-short">Halls (A–D)</span>
            </button>
            <button type="button" class="evp-fp-filter-btn" data-filter="hospitality">
                <span class="evp-fp-btn-full">Hospitality &amp; Dining</span>
                <span class="evp-fp-btn-short">Dining</span>
            </button>
            <button type="button" class="evp-fp-filter-btn" data-filter="outdoor">
                <span class="evp-fp-btn-full">Outdoor Arenas &amp; Parking</span>
                <span class="evp-fp-btn-short">Outdoor</span>
            </button>
        </div>

        <!-- Map Stage -->
        <div class="evp-fp-map-stage">
            <div class="evp-fp-map-wrap" id="evp-fp-map-wrap">
                <img src="Components/FloorPlan/Assets/floor-plan.png" class="evp-fp-map-img" alt="EVP Trade &amp; Convention Centre Site Map" />

                <!-- Nodes -->
                ${CAMPUS_NODES.map(node => `
                    <div class="evp-fp-pin ${node.id === activeNodeId ? "is-active" : ""}" 
                         id="fp-pin-${node.id}" 
                         data-id="${node.id}"
                         data-cat="${node.category}"
                         style="left: ${node.x}%; top: ${node.y}%;">
                        
                        <!-- You Are Here Wayfinding Marker Badge -->
                        <div class="evp-fp-yah-badge ${node.y < 22 ? "is-flipped-down" : ""}">
                            <span class="evp-fp-yah-dot"></span>
                            <span class="evp-fp-yah-text">You Are Here</span>
                        </div>

                        <!-- Pin Marker Dot -->
                        <div class="evp-fp-pin-dot">
                            ${getNodeSvgIcon(node.icon)}
                        </div>

                        <!-- Interactive Tooltip -->
                        <div class="evp-fp-tooltip ${node.y < 22 ? "is-flipped-down" : ""}">
                            <span class="evp-fp-tt-title">${node.name}</span>
                            <span class="evp-fp-tt-sub">${node.area}</span>
                            <span class="evp-fp-tt-hint"><i class="fi fi-rr-arrow-right"></i> Click to explore</span>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>

        <!-- Footer -->
        <div class="evp-fp-footer">
            <div class="evp-fp-footer-hint">
                <i class="fi fi-sr-info"></i>
                <span>Click any campus pin to explore that 360° viewpoint.</span>
            </div>
            <div class="evp-fp-active-pill" id="evp-fp-active-label">
                <span class="evp-fp-live-dot"></span>
                <span id="evp-fp-active-text">Viewing: Exhibition Hall A</span>
            </div>
        </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    // ── Active Node Synchronization with Tour ────────────────────────────
    function syncActiveLocationFromTour() {
        // 1. Check GSV POV
        if (typeof window.isGsvPovActive === "function" && window.isGsvPovActive()) {
            if (typeof window.getActiveGsvPovLocation === "function") {
                const gsv = window.getActiveGsvPovLocation();
                if (gsv && gsv.id) {
                    const matched = CAMPUS_NODES.find(n => n.gsvId === gsv.id);
                    if (matched) {
                        setActiveNode(matched.id);
                        return;
                    }
                }
            }
        }

        // 2. Check 3DVista Active Media
        let currentLabel = "";
        const locEl = document.getElementById("spatial-location-name");
        if (locEl && locEl.textContent) {
            currentLabel = locEl.textContent.trim().toLowerCase();
        }

        if (!currentLabel) {
            try {
                if (window.tour && typeof window.tour._getRootPlayer === "function") {
                    const rootPlayer = window.tour._getRootPlayer();
                    const viewer = rootPlayer.getMainViewer();
                    const media = rootPlayer.getActiveMediaWithViewer(viewer);
                    if (media) {
                        const data = media.get("data") || {};
                        currentLabel = (data.label || "").toLowerCase();
                    }
                }
            } catch (e) {}
        }

        if (currentLabel) {
            const matched = CAMPUS_NODES.find(n => {
                if (n.panoName && currentLabel.includes(n.panoName.toLowerCase())) return true;
                if (n.panoKey && currentLabel.includes(n.panoKey.toLowerCase())) return true;
                return currentLabel.includes(n.id);
            });
            if (matched) {
                setActiveNode(matched.id);
            }
        }
    }

    function setActiveNode(nodeId) {
        if (!nodeId || nodeId === activeNodeId && modal.querySelector(".evp-fp-pin.is-active")) {
            return;
        }

        activeNodeId = nodeId;

        // Update pin states
        modal.querySelectorAll(".evp-fp-pin").forEach(pin => {
            pin.classList.toggle("is-active", pin.getAttribute("data-id") === nodeId);
        });

        // Update footer active pill
        const activeNode = CAMPUS_NODES.find(n => n.id === nodeId);
        const textEl = document.getElementById("evp-fp-active-text");
        if (textEl && activeNode) {
            textEl.textContent = `Viewing: ${activeNode.name}`;
        }
    }

    // ── Teleport to Scene on Pin Click ────────────────────────────────────
    function navigateToNode(node) {
        if (!node) return;

        if (node.isIndoor) {
            // Exit GSV POV if active
            if (typeof window.exitGsvPov === "function" && window.isGsvPovActive && window.isGsvPovActive()) {
                window.exitGsvPov();
            }

            // Navigate 3DVista
            if (window.tour && typeof window.tour.setMediaByName === "function") {
                const targetKey = node.panoKey || node.panoName;
                window.tour.setMediaByName(targetKey);
            }
        } else if (node.gsvId) {
            // Outdoor GSV location
            if (typeof window.playGsvPovLocation === "function") {
                window.playGsvPovLocation(node.gsvId);
            }
        }

        setActiveNode(node.id);
        closeFloorPlan();
    }

    // ── Open / Close State Controller ────────────────────────────────────
    function openFloorPlan() {
        isModalOpen = true;
        syncActiveLocationFromTour();
        backdrop.classList.add("is-visible");
        modal.classList.add("is-visible");

        const btn = document.getElementById("btn-floorplan");
        if (btn) btn.classList.add("is-active");
    }

    function closeFloorPlan() {
        isModalOpen = false;
        backdrop.classList.remove("is-visible");
        modal.classList.remove("is-visible");

        const btn = document.getElementById("btn-floorplan");
        if (btn) btn.classList.remove("is-active");
    }

    function toggleFloorPlan() {
        if (isModalOpen) closeFloorPlan();
        else openFloorPlan();
    }

    // ── Event Bindings ───────────────────────────────────────────────────
    document.getElementById("evp-fp-close-btn").addEventListener("click", closeFloorPlan);
    backdrop.addEventListener("click", closeFloorPlan);

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isModalOpen) {
            closeFloorPlan();
        }
    });

    // Pin clicks
    modal.querySelectorAll(".evp-fp-pin").forEach(pin => {
        pin.addEventListener("click", function (e) {
            e.stopPropagation();
            const id = this.getAttribute("data-id");
            const node = CAMPUS_NODES.find(n => n.id === id);
            navigateToNode(node);
        });
    });

    // Category filter tabs
    modal.querySelectorAll(".evp-fp-filter-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            modal.querySelectorAll(".evp-fp-filter-btn").forEach(b => b.classList.remove("is-active"));
            this.classList.add("is-active");

            activeFilter = this.getAttribute("data-filter");
            modal.querySelectorAll(".evp-fp-pin").forEach(pin => {
                const cat = pin.getAttribute("data-cat");
                if (activeFilter === "all" || cat === activeFilter) {
                    pin.classList.remove("is-hidden");
                } else {
                    pin.classList.add("is-hidden");
                }
            });
        });
    });

    // ── Top-Right HUD Action Button Integration ──────────────────────────
    function createTopButton() {
        const topActions = document.getElementById("pcis-top-actions");
        if (!topActions) return;

        let btn = document.getElementById("btn-floorplan");
        if (!btn) {
            btn = document.createElement("button");
            btn.id = "btn-floorplan";
            btn.className = "pcis-action-btn btn-floorplan";
            btn.type = "button";
            btn.setAttribute("aria-label", "Open Campus Site Map and Floor Plan");
            btn.setAttribute("data-tooltip", "Site Map");

            btn.innerHTML = `<i class="fi fi-sr-map" aria-hidden="true"></i>`;

            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                toggleFloorPlan();
            });

            // Insert before clean view eye button
            const eyeBtn = document.getElementById("btn-clean-mode");
            if (eyeBtn) {
                topActions.insertBefore(btn, eyeBtn);
            } else {
                topActions.appendChild(btn);
            }
        }
    }

    // Attempt mount
    createTopButton();
    setTimeout(createTopButton, 400);
    setTimeout(createTopButton, 1200);

    // Tour media change listener for synchronization
    function onMediaChanged() {
        syncActiveLocationFromTour();
    }
    if (window.tour && typeof window.tour.on === "function") {
        window.tour.on("mediaChange", onMediaChanged);
    }
    if (window.tour && window.tour.player && typeof window.tour.player.on === "function") {
        window.tour.player.on("mediaChange", onMediaChanged);
    }

    // Expose global methods
    window.openFloorPlan = openFloorPlan;
    window.closeFloorPlan = closeFloorPlan;
    window.toggleFloorPlan = toggleFloorPlan;

})();
