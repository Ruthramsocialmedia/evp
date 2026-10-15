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

    // ── 9 Calibrated Campus Destination Nodes (Exact User Footprint) ─────
    const CAMPUS_NODES = [
        {
            id: "hall-a",
            name: "Hall A",
            category: "halls",
            categoryLabel: "Mega Hall",
            lat: 13.034462787909025,
            lng: 80.04699913584706,
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
            name: "Hall B",
            category: "halls",
            categoryLabel: "Mega Hall",
            lat: 13.035014483306458,
            lng: 80.04753722010105,
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
            name: "Hall C",
            category: "halls",
            categoryLabel: "Mega Hall",
            lat: 13.035418267747495,
            lng: 80.04779128562771,
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
            name: "Hall D",
            category: "halls",
            categoryLabel: "Convention Hall",
            lat: 13.03594691231758,
            lng: 80.04784969228157,
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
            name: "Entrance Plaza",
            category: "hospitality",
            categoryLabel: "Pre-Function",
            lat: 13.034348815074798,
            lng: 80.04762056688891,
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
            name: "Food Court Open Dining Area",
            category: "hospitality",
            categoryLabel: "Culinary Hub",
            lat: 13.034145637407287,
            lng: 80.04717696430738,
            icon: "fi fi-sr-restaurant",
            area: "26,364 sq.ft (2,449 m²)",
            metric: "14 Modular Culinary Kiosks + 800-Seat Dining Hall",
            panoName: "Food Court",
            panoKey: "Food Court",
            isIndoor: true,
            gsvId: null
        },
        {
            id: "cafe",
            name: "Cafe",
            category: "hospitality",
            categoryLabel: "Dining & Cafe",
            lat: 13.033112499066256,
            lng: 80.04797984011672,
            icon: "fi fi-sr-restaurant",
            area: "Premium Coffee Lounge & Terrace",
            metric: "Artisanal Brews, Pastries & Executive Networking",
            panoName: "Food Court",
            panoKey: "Food Court",
            isIndoor: true,
            gsvId: null
        },
        {
            id: "parking-1",
            name: "Parking",
            category: "outdoor",
            categoryLabel: "Parking Bay",
            lat: 13.035240842658904,
            lng: 80.04852688595672,
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
            lat: 13.03661729730688,
            lng: 80.04795852152263,
            icon: "fi fi-sr-road",
            area: "NH-4 National Highway Access",
            metric: "Monumental Highway Portal & Security Checkpoints",
            panoName: null,
            panoKey: null,
            isIndoor: false,
            gsvId: "arrival-gate"
        }
    ];

    // ── Campus Walkway GPS Graph for Google Maps Avenue & Portico Routing ─────
    const CAMPUS_GPS_GRAPH = {
        // --- 9 Destination Hubs ---
        "arrival-gate": { lat: 13.03661729730688, lng: 80.04795852152263, neighbors: ["ave-d"] },
        "hall-d": { lat: 13.03594691231758, lng: 80.04784969228157, neighbors: ["ave-d"] },
        "hall-c": { lat: 13.035418267747495, lng: 80.04779128562771, neighbors: ["ave-c"] },
        "parking-1": { lat: 13.035240842658904, lng: 80.04852688595672, neighbors: ["ave-park"] },
        "hall-b": { lat: 13.035014483306458, lng: 80.04753722010105, neighbors: ["ave-b"] },
        "entrance-plaza": { lat: 13.034348815074798, lng: 80.04762056688891, neighbors: ["ave-plaza", "w-plaza-west"] },
        "hall-a": { lat: 13.034462787909025, lng: 80.04699913584706, neighbors: ["w-plaza-west"] },
        "food-court": { lat: 13.034145637407287, lng: 80.04717696430738, neighbors: ["w-plaza-west"] },
        "cafe": { lat: 13.033112499066256, lng: 80.04797984011672, neighbors: ["ave-plaza"] },

        // --- Straight North-South Main Avenue Spine (lng: 80.0479585) ---
        "ave-d": { lat: 13.03594691231758, lng: 80.04795852152263, neighbors: ["arrival-gate", "hall-d", "ave-c"] },
        "ave-c": { lat: 13.035418267747495, lng: 80.04795852152263, neighbors: ["ave-d", "hall-c", "ave-park"] },
        "ave-park": { lat: 13.035240842658904, lng: 80.04795852152263, neighbors: ["ave-c", "parking-1", "ave-b"] },
        "ave-b": { lat: 13.035014483306458, lng: 80.04795852152263, neighbors: ["ave-park", "hall-b", "ave-plaza"] },
        "ave-plaza": { lat: 13.034348815074798, lng: 80.04795852152263, neighbors: ["ave-b", "entrance-plaza", "cafe"] },

        // --- Plaza West Walkway to Hall A & Food Court ---
        "w-plaza-west": { lat: 13.034348815074798, lng: 80.04725000000000, neighbors: ["entrance-plaza", "hall-a", "food-court"] }
    };

    let isModalOpen = false;
    let activeFilter = "all";
    let activeNodeId = "hall-a";
    let activeDestinationNodeId = null;

    // Leaflet Map Runtime Variables
    let leafletMap = null;
    let activeTileLayer = null;
    let activeRouteGlow = null;
    let activeRouteDash = null;
    let activeCalloutMarker = null;
    const leafletMarkers = {};
    let activeLayerType = "satellite";

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

        /* ── Floor Plan Modal Container (90vw × 90vh) ── */
        .evp-fp-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.96);
            width: 90vw;
            height: 90vh;
            max-width: 90vw;
            max-height: 90vh;
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
            display: inline-flex;
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

        /* ── Real-Time Camera Radar Cone (FOV) ── */
        .evp-fp-radar-cone {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 84px;
            height: 84px;
            margin-top: -42px;
            margin-left: -42px;
            pointer-events: none;
            z-index: 20;
            opacity: 0;
            visibility: hidden;
            transform-origin: center center;
            transition: opacity 260ms ease;
        }
        .evp-fp-pin.is-active .evp-fp-radar-cone {
            opacity: 1;
            visibility: visible;
        }
        .evp-fp-radar-svg {
            width: 100%;
            height: 100%;
            display: block;
            filter: drop-shadow(0 0 6px rgba(255, 183, 3, 0.55));
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

        /* ── Leaflet Interactive Satellite Stage & Controls ── */
        .evp-fp-map-stage {
            position: relative;
            background: #0b0c16;
            flex: 1;
            height: 100%;
            min-height: 0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .evp-fp-leaflet-container {
            width: 100%;
            height: 100%;
            background: #0b0c16;
            outline: none;
            z-index: 10;
        }
        /* Leaflet custom marker wrapper */
        .evp-leaflet-div-icon {
            background: transparent !important;
            border: none !important;
            overflow: visible !important;
        }
        .evp-leaflet-pin-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            overflow: visible !important;
            pointer-events: auto !important;
        }
        .evp-leaflet-pin-wrapper .evp-fp-pin {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            transform: translate(-50%, -50%) !important;
        }
        /* Floating Map Controls (Top-Left) */
        .evp-fp-map-controls-left {
            position: absolute;
            top: 14px;
            left: 14px;
            z-index: 40;
            display: flex;
            align-items: center;
            gap: 8px;
            pointer-events: auto;
        }
        .evp-fp-ctrl-btn {
            width: 36px;
            height: 36px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.94);
            -webkit-backdrop-filter: blur(16px);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.95);
            color: #131330;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(19, 19, 48, 0.14);
            transition: all 180ms ease;
        }
        .evp-fp-ctrl-btn:hover {
            background: #ffffff;
            color: #FFB703;
            transform: scale(1.06);
            box-shadow: 0 6px 20px rgba(255, 183, 3, 0.35);
        }
        .evp-fp-ctrl-btn i {
            font-size: 15px;
            line-height: 1;
        }
        .evp-fp-ctrl-btn svg {
            width: 17px;
            height: 17px;
            display: block;
            pointer-events: none;
            transition: transform 180ms ease;
        }
        .evp-fp-layer-switcher {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.94);
            -webkit-backdrop-filter: blur(16px);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 3px;
            gap: 3px;
            box-shadow: 0 4px 16px rgba(19, 19, 48, 0.14);
        }
        .evp-fp-layer-btn {
            border: none;
            background: transparent;
            padding: 5px 10px;
            border-radius: 9px;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 11px;
            font-weight: 700;
            color: #5C5C7A;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: all 180ms ease;
        }
        .evp-fp-layer-btn.is-active {
            background: #131330;
            color: #FFB703;
            box-shadow: 0 2px 8px rgba(19, 19, 48, 0.25);
        }
        .evp-fp-zoom-controls {
            position: absolute;
            top: 14px;
            right: 14px;
            z-index: 40;
            display: flex;
            flex-direction: column;
            gap: 6px;
            pointer-events: auto;
        }
        .evp-fp-zoom-btn {
            width: 34px;
            height: 34px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.94);
            -webkit-backdrop-filter: blur(16px);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.95);
            color: #131330;
            font-size: 18px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(19, 19, 48, 0.12);
            transition: all 180ms ease;
            line-height: 1;
            padding: 0;
            margin: 0;
        }
        .evp-fp-zoom-btn:hover {
            background: #ffffff;
            color: #FFB703;
            transform: scale(1.08);
        }
        /* ── Google Maps Walking Route Dots ── */
        .evp-gmaps-dots-bg,
        .evp-gmaps-dots-fg {
            stroke-linecap: round !important;
            stroke-linejoin: round !important;
            animation: evpGmapsDotsFlow 1.4s linear infinite;
        }
        @keyframes evpGmapsDotsFlow {
            from {
                stroke-dashoffset: 15.1;
            }
            to {
                stroke-dashoffset: 0.1;
            }
        }

        /* ── Google Maps Floating Midpoint Callout Box ── */
        .evp-gmaps-callout-wrapper {
            position: relative;
        }
        .evp-gmaps-callout {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: #ffffff;
            color: #1f2937;
            border-radius: 6px;
            padding: 5px 9px;
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.35), 0 0 1px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 'Plus Jakarta Sans', sans-serif;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            white-space: nowrap;
            line-height: 1.15;
            z-index: 1000;
        }
        .evp-gmaps-callout::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px 5px 0 5px;
            border-style: solid;
            border-color: #ffffff transparent transparent transparent;
            filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.15));
        }
        .evp-gmaps-callout-header {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #111827;
        }
        .evp-gmaps-walker-svg {
            width: 12px;
            height: 12px;
            fill: #111827;
            flex-shrink: 0;
        }
        .evp-gmaps-callout-time {
            font-size: 12px;
            font-weight: 700;
            color: #111827;
            letter-spacing: -0.2px;
        }
        .evp-gmaps-callout-dist {
            font-size: 10px;
            font-weight: 500;
            color: #4b5563;
            margin-top: 1px;
        }

        /* ── Google Maps Destination Pin State (Red Pin & Ripple) ── */
        .evp-fp-pin.is-destination {
            z-index: 45 !important;
        }
        .evp-fp-pin.is-destination .evp-fp-pin-dot {
            background: #EA4335 !important;
            color: #FFFFFF !important;
            border-color: #FFFFFF !important;
            box-shadow: 0 0 0 3px rgba(234, 67, 53, 0.45), 0 4px 14px rgba(0, 0, 0, 0.4) !important;
            animation: evpGoogleDestPulse 1.6s infinite ease-in-out !important;
        }
        @keyframes evpGoogleDestPulse {
            0%, 100% {
                box-shadow: 0 0 0 3px rgba(234, 67, 53, 0.45), 0 0 16px rgba(234, 67, 53, 0.7);
                transform: scale(1);
            }
            50% {
                box-shadow: 0 0 0 7px rgba(234, 67, 53, 0.2), 0 0 24px rgba(234, 67, 53, 0.95);
                transform: scale(1.12);
            }
        }
        .evp-fp-dest-badge {
            position: absolute;
            bottom: calc(100% + 9px);
            left: 50%;
            transform: translateX(-50%);
            background: #EA4335;
            color: #FFFFFF;
            border: 1px solid rgba(255, 255, 255, 0.95);
            border-radius: 999px;
            padding: 2.5px 8px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 3px 10px rgba(234, 67, 53, 0.5);
            white-space: nowrap;
            pointer-events: none;
            z-index: 25;
            opacity: 0;
            visibility: hidden;
            transition: all 200ms ease;
        }
        .evp-fp-dest-badge.is-flipped-down {
            bottom: auto;
            top: calc(100% + 9px);
        }
        .evp-fp-pin.is-destination .evp-fp-dest-badge {
            opacity: 1;
            visibility: visible;
        }

        /* ── Floating Directions HUD ── */
        .evp-fp-dir-hud {
            position: absolute;
            bottom: 14px;
            left: 50%;
            transform: translateX(-50%) translateY(24px);
            width: min(560px, calc(100% - 24px));
            background: rgba(255, 255, 255, 0.94);
            -webkit-backdrop-filter: blur(24px) saturate(190%);
            backdrop-filter: blur(24px) saturate(190%);
            border: 1px solid rgba(255, 255, 255, 0.95);
            border-radius: 16px;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.08),
                0 20px 48px rgba(19, 19, 48, 0.22),
                inset 0 1px 1px rgba(255, 255, 255, 1);
            padding: 10px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            z-index: 50;
            box-sizing: border-box;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 240ms ease,
                        visibility 240ms ease;
        }
        .evp-fp-dir-hud.is-visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translateX(-50%) translateY(0);
        }
        .evp-fp-dir-left {
            display: flex;
            flex-direction: column;
            gap: 3px;
            min-width: 0;
            flex: 1;
        }
        .evp-fp-dir-top-row {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        .evp-fp-dir-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: rgba(255, 183, 3, 0.16);
            color: #B45309;
            border: 1px solid rgba(255, 183, 3, 0.45);
            border-radius: 6px;
            padding: 1.5px 6px;
            font-size: 9.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            line-height: 1.2;
        }
        .evp-fp-dir-badge i {
            font-size: 8.5px;
        }
        .evp-fp-dir-metrics {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 10.5px;
            color: #5C5C7A;
            font-weight: 600;
        }
        .evp-fp-dir-metric {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            white-space: nowrap;
        }
        .evp-fp-dir-metric i {
            color: #FFB703;
            font-size: 9px;
        }
        .evp-fp-dir-dot {
            color: #CBD5E1;
            font-size: 8px;
        }
        .evp-fp-dir-endpoints {
            display: flex;
            align-items: center;
            gap: 6px;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 13.5px;
            font-weight: 800;
            color: #131330;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .evp-fp-dir-from {
            color: #10B981;
        }
        .evp-fp-dir-arrow {
            font-size: 11px;
            color: #94A3B8;
        }
        .evp-fp-dir-to {
            color: #131330;
        }
        .evp-fp-dir-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
        }
        .evp-fp-btn-explore {
            background: #FFB703;
            color: #131330;
            border: none;
            border-radius: 10px;
            padding: 7px 14px;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 11.5px;
            font-weight: 800;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 2px 10px rgba(255, 183, 3, 0.4);
            white-space: nowrap;
        }
        .evp-fp-btn-explore:hover {
            background: #E0A100;
            transform: translateY(-1px) scale(1.03);
            box-shadow: 0 4px 16px rgba(255, 183, 3, 0.55);
        }
        .evp-fp-btn-explore i {
            font-size: 11px;
        }
        /* ── Standard EVP Red Circular Close Button (360° Hover Spin) ── */
        .evp-fp-btn-clear {
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
        .evp-fp-btn-clear i {
            font-size: 18px;
            line-height: 1;
            display: inline-flex;
            margin: 0;
            padding: 0;
            pointer-events: none;
            color: #FFFFFF;
        }
        .evp-fp-btn-clear:hover {
            background: #DC2626;
            color: #FFFFFF;
            transform: rotate(360deg);
        }
        .evp-fp-btn-clear:active {
            transform: rotate(360deg) scale(0.94);
        }

        /* ── Mobile Responsiveness ── */
        @media (max-width: 768px) {
            .evp-fp-modal {
                width: 90vw !important;
                height: 90vh !important;
                max-width: 90vw !important;
                max-height: 90vh !important;
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
            .evp-fp-close-btn,
            .evp-fp-btn-clear {
                width: 30px !important;
                height: 30px !important;
                min-width: 30px !important;
            }
            .evp-fp-close-btn i,
            .evp-fp-btn-clear i {
                font-size: 16px !important;
                display: inline-flex !important;
                margin: 0 !important;
                padding: 0 !important;
                color: #FFFFFF !important;
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

            /* ── Mobile Directions Route HUD (Compact Card Layout) ── */
            .evp-fp-dir-hud {
                bottom: 8px !important;
                left: 50% !important;
                transform: translateX(-50%) translateY(24px) !important;
                width: calc(100% - 14px) !important;
                max-width: 440px !important;
                box-sizing: border-box !important;
                padding: 10px 12px 10px 12px !important;
                border-radius: 14px !important;
                flex-direction: column !important;
                align-items: stretch !important;
                gap: 7px !important;
            }
            .evp-fp-dir-hud.is-visible {
                transform: translateX(-50%) translateY(0) !important;
            }
            .evp-fp-dir-left {
                width: 100% !important;
                gap: 4px !important;
            }
            .evp-fp-dir-top-row {
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
                flex-wrap: nowrap !important;
                padding-right: 36px !important;
            }
            .evp-fp-dir-badge {
                font-size: 8.5px !important;
                padding: 1px 5px !important;
                flex-shrink: 0 !important;
                white-space: nowrap !important;
            }
            .evp-fp-dir-metrics {
                display: inline-flex !important;
                align-items: center !important;
                gap: 5px !important;
                font-size: 10.5px !important;
                white-space: nowrap !important;
                flex-shrink: 0 !important;
            }
            .evp-fp-dir-metric {
                display: inline-flex !important;
                align-items: center !important;
                gap: 3px !important;
                white-space: nowrap !important;
                line-height: 1 !important;
            }
            .evp-fp-dir-dot {
                font-size: 7px !important;
            }
            .evp-fp-dir-endpoints {
                font-size: 12px !important;
                gap: 5px !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                padding-right: 36px !important;
            }
            .evp-fp-dir-actions {
                width: 100% !important;
                display: flex !important;
                gap: 6px !important;
                margin-top: 1px !important;
            }
            .evp-fp-btn-explore {
                flex: 1 1 auto !important;
                width: 100% !important;
                justify-content: center !important;
                padding: 8px 12px !important;
                font-size: 12px !important;
                border-radius: 9px !important;
                height: 34px !important;
                box-sizing: border-box !important;
            }
            .evp-fp-btn-clear {
                position: absolute !important;
                top: 8px !important;
                right: 9px !important;
                width: 30px !important;
                height: 30px !important;
                min-width: 30px !important;
                margin: 0 !important;
                z-index: 10 !important;
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
                <span class="evp-fp-btn-full">All Locations (9)</span>
                <span class="evp-fp-btn-short">All (9)</span>
            </button>
            <button type="button" class="evp-fp-filter-btn" data-filter="halls">
                <span class="evp-fp-btn-full">Halls (A–D)</span>
                <span class="evp-fp-btn-short">Halls (A–D)</span>
            </button>
            <button type="button" class="evp-fp-filter-btn" data-filter="hospitality">
                <span class="evp-fp-btn-full">Dining &amp; Hospitality</span>
                <span class="evp-fp-btn-short">Dining</span>
            </button>
            <button type="button" class="evp-fp-filter-btn" data-filter="outdoor">
                <span class="evp-fp-btn-full">Parking &amp; Arrival</span>
                <span class="evp-fp-btn-short">Parking</span>
            </button>
        </div>

        <!-- Map Stage (Interactive Satellite View) -->
        <div class="evp-fp-map-stage">
            <div id="evp-leaflet-map" class="evp-fp-leaflet-container"></div>

            <!-- Floating Top-Left Controls: Recenter + Layer Switcher -->
            <div class="evp-fp-map-controls-left">
                <button type="button" class="evp-fp-ctrl-btn" id="evp-fp-btn-recenter" title="Recenter Campus View" aria-label="Recenter campus view">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="2.2" />
                        <line x1="12" y1="1" x2="12" y2="4.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                        <line x1="12" y1="19.5" x2="12" y2="23" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                        <line x1="1" y1="12" x2="4.5" y2="12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                        <line x1="19.5" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
                        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                    </svg>
                </button>
                <div class="evp-fp-layer-switcher">
                    <button type="button" class="evp-fp-layer-btn is-active" id="evp-layer-satellite" data-layer="satellite" title="Pure Satellite (Only our campus pins)">
                        <i class="fi fi-sr-globe"></i> <span>Clean Satellite</span>
                    </button>
                    <button type="button" class="evp-fp-layer-btn" id="evp-layer-hybrid" data-layer="hybrid" title="Hybrid view (Includes external shops & POIs)">
                        <i class="fi fi-sr-map"></i> <span>External POIs</span>
                    </button>
                </div>
            </div>

            <!-- Floating Top-Right Zoom Controls -->
            <div class="evp-fp-zoom-controls">
                <button type="button" class="evp-fp-zoom-btn" id="evp-fp-zoom-in" title="Zoom In" aria-label="Zoom in">+</button>
                <button type="button" class="evp-fp-zoom-btn" id="evp-fp-zoom-out" title="Zoom Out" aria-label="Zoom out">−</button>
            </div>

            <!-- Floating Directions HUD -->
            <div class="evp-fp-dir-hud" id="evp-fp-dir-hud">
                <div class="evp-fp-dir-left">
                    <div class="evp-fp-dir-top-row">
                        <span class="evp-fp-dir-badge">
                            <i class="fi fi-sr-navigation"></i> Walking Route
                        </span>
                        <div class="evp-fp-dir-metrics">
                            <span class="evp-fp-dir-metric" id="evp-dir-metric-dist"><i class="fi fi-rr-ruler-triangle"></i> -- m</span>
                            <span class="evp-fp-dir-dot">•</span>
                            <span class="evp-fp-dir-metric" id="evp-dir-metric-time"><i class="fi fi-rr-clock"></i> ~-- min walk</span>
                        </div>
                    </div>
                    <div class="evp-fp-dir-endpoints">
                        <span class="evp-fp-dir-from" id="evp-dir-from-name">Origin</span>
                        <i class="fi fi-rr-arrow-right evp-fp-dir-arrow"></i>
                        <span class="evp-fp-dir-to" id="evp-dir-to-name">Destination</span>
                    </div>
                </div>
                <div class="evp-fp-dir-actions">
                    <button type="button" class="evp-fp-btn-explore" id="evp-fp-btn-explore" title="Enter 360° viewpoint">
                        <i class="fi fi-sr-eye"></i>
                        <span>Explore 360°</span>
                    </button>
                    <button type="button" class="evp-fp-btn-clear" id="evp-fp-btn-clear" aria-label="Clear route" title="Clear Route">
                        <i class="fi fi-rr-cross-small" aria-hidden="true"></i>
                    </button>
                </div>
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
        if (locEl) {
            const raw = locEl.getAttribute("data-english-name") || locEl.textContent;
            if (raw) currentLabel = raw.trim().toLowerCase();
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

        const changed = nodeId !== activeNodeId;
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

        // If user arrived at destination, clear route; otherwise re-route from new origin
        if (activeDestinationNodeId === nodeId) {
            clearDirectionRoute();
        } else if (activeDestinationNodeId && changed) {
            const destNode = CAMPUS_NODES.find(n => n.id === activeDestinationNodeId);
            if (destNode) {
                showDirectionToNode(destNode);
            }
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
        clearDirectionRoute();
        closeFloorPlan();
    }

    // ── GPS Haversine Distance Calculation (Meters) ──────────────────────
    function getGpsDistanceMeters(lat1, lon1, lat2, lon2) {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // ── Campus Walkway GPS Dijkstra Routing Engine ───────────────────────
    function findShortestGpsRoute(startId, targetId) {
        if (!CAMPUS_GPS_GRAPH[startId] || !CAMPUS_GPS_GRAPH[targetId]) {
            const s = CAMPUS_NODES.find(n => n.id === startId);
            const t = CAMPUS_NODES.find(n => n.id === targetId);
            return {
                latlngs: [
                    [s ? s.lat : 13.0336, s ? s.lng : 80.0522],
                    [t ? t.lat : 13.0336, t ? t.lng : 80.0522]
                ],
                meters: 150,
                minutes: 2
            };
        }

        const dist = {};
        const prev = {};
        const unvisited = new Set(Object.keys(CAMPUS_GPS_GRAPH));

        Object.keys(CAMPUS_GPS_GRAPH).forEach(id => {
            dist[id] = Infinity;
        });
        dist[startId] = 0;

        while (unvisited.size > 0) {
            let current = null;
            let lowestDist = Infinity;
            for (const id of unvisited) {
                if (dist[id] < lowestDist) {
                    lowestDist = dist[id];
                    current = id;
                }
            }

            if (current === null || dist[current] === Infinity || current === targetId) {
                break;
            }

            unvisited.delete(current);

            const currNode = CAMPUS_GPS_GRAPH[current];
            for (const neighborId of currNode.neighbors) {
                if (!unvisited.has(neighborId)) continue;
                const neighborNode = CAMPUS_GPS_GRAPH[neighborId];
                const weight = getGpsDistanceMeters(currNode.lat, currNode.lng, neighborNode.lat, neighborNode.lng);
                const alt = dist[current] + weight;
                if (alt < dist[neighborId]) {
                    dist[neighborId] = alt;
                    prev[neighborId] = current;
                }
            }
        }

        const latlngs = [];
        let curr = targetId;
        if (dist[targetId] !== Infinity || startId === targetId) {
            while (curr) {
                const node = CAMPUS_GPS_GRAPH[curr];
                latlngs.unshift([node.lat, node.lng]);
                curr = prev[curr];
            }
        }

        let totalMeters = 0;
        for (let i = 0; i < latlngs.length - 1; i++) {
            totalMeters += getGpsDistanceMeters(latlngs[i][0], latlngs[i][1], latlngs[i + 1][0], latlngs[i + 1][1]);
        }
        const meters = Math.round(totalMeters);
        const minutes = Math.max(1, Math.round(meters / 75));

        return { latlngs, meters, minutes };
    }

    // ── Calculate Geodesic Midpoint for Google Maps Route Callout Badge ──
    function getRouteMidpoint(latlngs, totalMeters) {
        if (!latlngs || latlngs.length === 0) return null;
        if (latlngs.length === 1) return latlngs[0];
        const halfDist = (totalMeters || 0) / 2;
        let accumulated = 0;
        for (let i = 0; i < latlngs.length - 1; i++) {
            const segDist = getGpsDistanceMeters(latlngs[i][0], latlngs[i][1], latlngs[i + 1][0], latlngs[i + 1][1]);
            if (accumulated + segDist >= halfDist && segDist > 0) {
                const fraction = (halfDist - accumulated) / segDist;
                return [
                    latlngs[i][0] + (latlngs[i + 1][0] - latlngs[i][0]) * fraction,
                    latlngs[i][1] + (latlngs[i + 1][1] - latlngs[i][1]) * fraction
                ];
            }
            accumulated += segDist;
        }
        return latlngs[Math.floor(latlngs.length / 2)];
    }

    // ── Custom Leaflet HTML Marker Factory ───────────────────────────────
    function createNodeMarker(node) {
        const isAct = node.id === activeNodeId;
        const isDest = node.id === activeDestinationNodeId;
        const wrapper = document.createElement("div");
        wrapper.className = "evp-leaflet-pin-wrapper";
        wrapper.innerHTML = `
            <div class="evp-fp-pin ${isAct ? "is-active" : ""} ${isDest ? "is-destination" : ""}" 
                 id="fp-pin-${node.id}" 
                 data-id="${node.id}"
                 data-cat="${node.category}">
                
                <!-- You Are Here Wayfinding Marker Badge -->
                <div class="evp-fp-yah-badge">
                    <span class="evp-fp-yah-dot"></span>
                    <span class="evp-fp-yah-text">You Are Here</span>
                </div>

                <!-- Destination Wayfinding Target Badge -->
                <div class="evp-fp-dest-badge">
                    <i class="fi fi-sr-flag"></i>
                    <span>Target</span>
                </div>

                <!-- Real-time Rotating Camera Radar FOV Cone -->
                <div class="evp-fp-radar-cone" id="fp-radar-${node.id}">
                    <svg viewBox="0 0 100 100" class="evp-fp-radar-svg">
                        <defs>
                            <radialGradient id="evp-radar-grad-${node.id}" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="#FFB703" stop-opacity="0.8" />
                                <stop offset="60%" stop-color="#FFB703" stop-opacity="0.32" />
                                <stop offset="100%" stop-color="#FFB703" stop-opacity="0" />
                            </radialGradient>
                        </defs>
                        <path d="M 50 50 L 15 5 A 50 50 0 0 1 85 5 Z" fill="url(#evp-radar-grad-${node.id})" />
                        <line x1="50" y1="50" x2="50" y2="5" stroke="#FFB703" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.85" />
                    </svg>
                </div>

                <!-- Pin Marker Dot -->
                <div class="evp-fp-pin-dot">
                    ${getNodeSvgIcon(node.icon)}
                </div>

                <!-- Interactive Tooltip -->
                <div class="evp-fp-tooltip">
                    <span class="evp-fp-tt-title">${node.name}</span>
                    <span class="evp-fp-tt-sub">${node.area}</span>
                    <span class="evp-fp-tt-hint"><i class="fi fi-rr-arrow-right"></i> Click to route</span>
                </div>
            </div>
        `;

        const icon = L.divIcon({
            className: "evp-leaflet-div-icon",
            html: wrapper,
            iconSize: [0, 0],
            iconAnchor: [0, 0]
        });

        const marker = L.marker([node.lat, node.lng], { icon: icon, riseOnHover: true });

        marker.on("click", function (e) {
            if (L.DomEvent) L.DomEvent.stopPropagation(e);
            handlePinClick(node);
        });

        return marker;
    }

    function handlePinClick(node) {
        if (!node) return;

        // If user clicked their current location ("You Are Here")
        if (node.id === activeNodeId) {
            clearDirectionRoute();
            return;
        }

        // If user clicked the already selected destination a 2nd time -> Explore 360°
        if (activeDestinationNodeId === node.id) {
            clearDirectionRoute();
            navigateToNode(node);
            return;
        }

        // 1st click -> Show animated walking direction route
        showDirectionToNode(node);
    }

    function showDirectionToNode(targetNode) {
        if (!targetNode || targetNode.id === activeNodeId) {
            clearDirectionRoute();
            return;
        }

        activeDestinationNodeId = targetNode.id;

        // 1. Mark destination pin DOM element
        document.querySelectorAll(".evp-fp-pin").forEach(pin => {
            const isDest = pin.getAttribute("data-id") === targetNode.id;
            pin.classList.toggle("is-destination", isDest);
        });

        // 2. Solve shortest GPS route
        const result = findShortestGpsRoute(activeNodeId, targetNode.id);

        // 3. Clear previous polylines & callout
        if (activeRouteGlow && leafletMap) {
            leafletMap.removeLayer(activeRouteGlow);
            activeRouteGlow = null;
        }
        if (activeRouteDash && leafletMap) {
            leafletMap.removeLayer(activeRouteDash);
            activeRouteDash = null;
        }
        if (activeCalloutMarker && leafletMap) {
            leafletMap.removeLayer(activeCalloutMarker);
            activeCalloutMarker = null;
        }

        // 4. Render Google Maps Walking Dots in Leaflet
        if (leafletMap && result.latlngs && result.latlngs.length >= 2) {
            // Background high-contrast navy shadow outline
            activeRouteGlow = L.polyline(result.latlngs, {
                color: "#0F172A",
                weight: 10,
                opacity: 0.92,
                dashArray: "0.1, 15",
                className: "evp-gmaps-dots-bg",
                lineCap: "round",
                lineJoin: "round"
            }).addTo(leafletMap);

            // Google Maps blue circular dots
            activeRouteDash = L.polyline(result.latlngs, {
                color: "#3B82F6",
                weight: 6.5,
                opacity: 1,
                dashArray: "0.1, 15",
                className: "evp-gmaps-dots-fg",
                lineCap: "round",
                lineJoin: "round"
            }).addTo(leafletMap);

            // Floating Google Maps Route Callout Badge at midpoint
            const midPoint = getRouteMidpoint(result.latlngs, result.meters);
            if (midPoint) {
                const distText = result.meters >= 1000 ? (result.meters / 1000).toFixed(1) + " km" : result.meters + "m";
                const calloutIcon = L.divIcon({
                    className: "evp-gmaps-callout-wrapper",
                    html: `
                        <div class="evp-gmaps-callout">
                            <div class="evp-gmaps-callout-header">
                                <svg class="evp-gmaps-walker-svg" viewBox="0 0 24 24">
                                    <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z"/>
                                </svg>
                                <span class="evp-gmaps-callout-time">${result.minutes} min</span>
                            </div>
                            <div class="evp-gmaps-callout-dist">${distText}</div>
                        </div>
                    `,
                    iconSize: [0, 0],
                    iconAnchor: [0, 0]
                });
                activeCalloutMarker = L.marker(midPoint, {
                    icon: calloutIcon,
                    interactive: false,
                    zIndexOffset: 1200
                }).addTo(leafletMap);
            }

            // Automatically frame the route smoothly with padding
            leafletMap.fitBounds(activeRouteDash.getBounds(), {
                padding: [60, 60],
                maxZoom: 18.5,
                animate: true
            });
        }

        // 5. Update Directions HUD
        const hud = document.getElementById("evp-fp-dir-hud");
        const originNode = CAMPUS_NODES.find(n => n.id === activeNodeId);
        const fromEl = document.getElementById("evp-dir-from-name");
        const toEl = document.getElementById("evp-dir-to-name");
        const distEl = document.getElementById("evp-dir-metric-dist");
        const timeEl = document.getElementById("evp-dir-metric-time");

        if (fromEl) fromEl.textContent = originNode ? originNode.name : "Origin";
        if (toEl) toEl.textContent = targetNode.name;
        if (distEl) distEl.innerHTML = `<i class="fi fi-rr-ruler-triangle"></i> ${result.meters >= 1000 ? (result.meters / 1000).toFixed(1) + " km" : result.meters + " m"}`;
        if (timeEl) timeEl.innerHTML = `<i class="fi fi-rr-clock"></i> ~${result.minutes} min walk`;

        if (hud) {
            hud.classList.add("is-visible");
        }
    }

    function clearDirectionRoute() {
        activeDestinationNodeId = null;

        // Clear pin destination styling
        document.querySelectorAll(".evp-fp-pin").forEach(pin => {
            pin.classList.remove("is-destination");
        });

        // Remove route polylines
        if (activeRouteGlow && leafletMap) {
            leafletMap.removeLayer(activeRouteGlow);
            activeRouteGlow = null;
        }
        if (activeRouteDash && leafletMap) {
            leafletMap.removeLayer(activeRouteDash);
            activeRouteDash = null;
        }
        if (activeCalloutMarker && leafletMap) {
            leafletMap.removeLayer(activeCalloutMarker);
            activeCalloutMarker = null;
        }

        // Hide HUD
        const hud = document.getElementById("evp-fp-dir-hud");
        if (hud) {
            hud.classList.remove("is-visible");
        }
    }

    // ── Leaflet Interactive Satellite Map Initializer ────────────────────
    function ensureLeafletInitialized() {
        if (!window.L) {
            setTimeout(ensureLeafletInitialized, 80);
            return;
        }

        if (!leafletMap) {
            const mapContainer = document.getElementById("evp-leaflet-map");
            if (!mapContainer) return;

            leafletMap = L.map(mapContainer, {
                center: [13.0349, 80.0478],
                zoom: 17.5,
                minZoom: 16,
                maxZoom: 19.5,
                zoomControl: false,
                attributionControl: false
            });

            // Set tile layer (Google Satellite Hybrid by default, identical to screenshot)
            const tileUrl = activeLayerType === "satellite"
                ? "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                : "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";

            activeTileLayer = L.tileLayer(tileUrl, {
                maxZoom: 20,
                subdomains: ["mt0", "mt1", "mt2", "mt3"]
            }).addTo(leafletMap);

            // Add all 10 campus markers
            CAMPUS_NODES.forEach(node => {
                const marker = createNodeMarker(node);
                marker.addTo(leafletMap);
                leafletMarkers[node.id] = marker;
            });

            // Recenter button
            const btnRecenter = modal.querySelector("#evp-fp-btn-recenter");
            if (btnRecenter) {
                btnRecenter.addEventListener("click", function (e) {
                    e.stopPropagation();
                    const targetNode = CAMPUS_NODES.find(n => n.id === activeNodeId);
                    const center = targetNode ? [targetNode.lat, targetNode.lng] : [13.0349, 80.0478];
                    leafletMap.flyTo(center, 17.5, { duration: 0.8 });
                });
            }

            // Layer switcher buttons
            const btnHybrid = modal.querySelector("#evp-layer-hybrid");
            const btnSat = modal.querySelector("#evp-layer-satellite");

            function switchLayer(mode) {
                if (!leafletMap || activeLayerType === mode) return;
                activeLayerType = mode;
                if (activeTileLayer) leafletMap.removeLayer(activeTileLayer);

                const newUrl = mode === "satellite"
                    ? "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    : "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";

                activeTileLayer = L.tileLayer(newUrl, {
                    maxZoom: 20,
                    subdomains: ["mt0", "mt1", "mt2", "mt3"]
                }).addTo(leafletMap);

                if (btnHybrid) btnHybrid.classList.toggle("is-active", mode === "hybrid");
                if (btnSat) btnSat.classList.toggle("is-active", mode === "satellite");
            }

            if (btnHybrid) btnHybrid.addEventListener("click", () => switchLayer("hybrid"));
            if (btnSat) btnSat.addEventListener("click", () => switchLayer("satellite"));

            // Custom zoom buttons
            const btnZoomIn = modal.querySelector("#evp-fp-zoom-in");
            const btnZoomOut = modal.querySelector("#evp-fp-zoom-out");
            if (btnZoomIn) btnZoomIn.addEventListener("click", () => leafletMap && leafletMap.zoomIn());
            if (btnZoomOut) btnZoomOut.addEventListener("click", () => leafletMap && leafletMap.zoomOut());
        }

        setTimeout(() => {
            if (leafletMap) {
                leafletMap.invalidateSize();
                if (!activeDestinationNodeId) {
                    const currNode = CAMPUS_NODES.find(n => n.id === activeNodeId);
                    if (currNode) {
                        leafletMap.setView([currNode.lat, currNode.lng], 17.5);
                    } else {
                        leafletMap.setView([13.0349, 80.0478], 17.5);
                    }
                }
            }
        }, 220);
    }

    // ── Live Camera Radar Cone Tracking Engine ───────────────────────────
    let radarAnimTimer = null;

    function getCameraYaw() {
        try {
            if (window.tour && typeof window.tour._getRootPlayer === "function") {
                const rootPlayer = window.tour._getRootPlayer();
                if (rootPlayer) {
                    const viewer = rootPlayer.getMainViewer();
                    if (viewer && typeof viewer.getPan === "function") {
                        return viewer.getPan();
                    }
                }
            }
        } catch (e) {}
        return 0;
    }

    function updateRadarConeOrientation() {
        if (!isModalOpen) return;
        const activeRadar = modal.querySelector(".evp-fp-pin.is-active .evp-fp-radar-cone");
        if (!activeRadar) return;

        const pan = getCameraYaw();
        activeRadar.style.transform = `rotate(${pan}deg)`;
    }

    function startRadarTracking() {
        if (radarAnimTimer) clearInterval(radarAnimTimer);
        updateRadarConeOrientation();
        radarAnimTimer = setInterval(updateRadarConeOrientation, 80);
    }

    function stopRadarTracking() {
        if (radarAnimTimer) {
            clearInterval(radarAnimTimer);
            radarAnimTimer = null;
        }
    }

    // ── Open / Close State Controller ────────────────────────────────────
    function openFloorPlan() {
        isModalOpen = true;
        syncActiveLocationFromTour();
        backdrop.classList.add("is-visible");
        modal.classList.add("is-visible");
        startRadarTracking();

        const btn = document.getElementById("btn-floorplan");
        if (btn) btn.classList.add("is-active");
        const popBtn = document.getElementById("popover-btn-sitemap");
        if (popBtn) popBtn.classList.add("is-active");

        // Initialize and center Leaflet interactive satellite map
        ensureLeafletInitialized();
    }

    function closeFloorPlan() {
        isModalOpen = false;
        stopRadarTracking();
        clearDirectionRoute();
        backdrop.classList.remove("is-visible");
        modal.classList.remove("is-visible");

        const btn = document.getElementById("btn-floorplan");
        if (btn) btn.classList.remove("is-active");
        const popBtn = document.getElementById("popover-btn-sitemap");
        if (popBtn) popBtn.classList.remove("is-active");
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

    // Directions HUD "Explore 360°" button
    const btnExplore = modal.querySelector("#evp-fp-btn-explore");
    if (btnExplore) {
        btnExplore.addEventListener("click", function (e) {
            e.stopPropagation();
            if (activeDestinationNodeId) {
                const destNode = CAMPUS_NODES.find(n => n.id === activeDestinationNodeId);
                clearDirectionRoute();
                if (destNode) {
                    navigateToNode(destNode);
                }
            }
        });
    }

    // Directions HUD "Clear Route" button
    const btnClearRoute = modal.querySelector("#evp-fp-btn-clear");
    if (btnClearRoute) {
        btnClearRoute.addEventListener("click", function (e) {
            e.stopPropagation();
            clearDirectionRoute();
        });
    }

    // Category filter tabs (toggle Leaflet markers smoothly)
    modal.querySelectorAll(".evp-fp-filter-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            modal.querySelectorAll(".evp-fp-filter-btn").forEach(b => b.classList.remove("is-active"));
            this.classList.add("is-active");

            activeFilter = this.getAttribute("data-filter");
            CAMPUS_NODES.forEach(node => {
                const marker = leafletMarkers[node.id];
                if (!marker || !leafletMap) return;
                const match = activeFilter === "all" || node.category === activeFilter;
                if (match) {
                    if (!leafletMap.hasLayer(marker)) leafletMap.addLayer(marker);
                } else {
                    if (leafletMap.hasLayer(marker)) leafletMap.removeLayer(marker);
                }
            });
        });
    });

    // ── Remove Top-Right Action Button (Relocated to More Features) ──────
    function removeTopButton() {
        const btn = document.getElementById("btn-floorplan");
        if (btn) btn.remove();
    }
    removeTopButton();
    setTimeout(removeTopButton, 400);
    setTimeout(removeTopButton, 1200);

    // Event listener from More Features menu or external triggers
    document.addEventListener("menuItemClick", function (e) {
        if (e.detail && (e.detail.id === "menu-floorplan" || e.detail.id === "popover-btn-sitemap")) {
            toggleFloorPlan();
        }
    });

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
