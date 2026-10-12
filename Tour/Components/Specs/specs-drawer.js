// ═══════════════════════════════════════════════════════════════════════
//  EVP TRADE & CONVENTION CENTRE — DYNAMIC BENTO SPECS DRAWER
//  White Frosted Glassmorphism with Imperial Gold & Obsidian styling
//  • Real-time synchronization with active 360° panorama scene
//  • 5 High-Impact Bento Cards: Dimensions, Capacities, Structural, Climate, Safety
//  • Direct Contextual 1-Tap Directions linking
// ═══════════════════════════════════════════════════════════════════════

(function () {
    "use strict";

    if (document.getElementById("pcis-specs-drawer-root")) return;

    // ── Inject Bento Drawer CSS ───────────────────────────────────────
    const style = document.createElement("style");
    style.id = "pcis-specs-drawer-styles";
    style.textContent = `
        /* ── Backdrop ────────────────────────────────────────── */
        .pcis-specs-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(19, 19, 48, 0.45);
            -webkit-backdrop-filter: blur(8px);
            backdrop-filter: blur(8px);
            z-index: 100070;
            opacity: 0;
            pointer-events: none;
            transition: opacity 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pcis-specs-backdrop.is-open {
            opacity: 1;
            pointer-events: auto;
        }

        /* ── Bento Drawer Container ──────────────────────────── */
        .pcis-specs-drawer {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            width: min(460px, 92vw);
            background: rgba(255, 255, 255, 0.94);
            -webkit-backdrop-filter: blur(32px) saturate(190%);
            backdrop-filter: blur(32px) saturate(190%);
            border-left: 1px solid rgba(255, 255, 255, 0.9);
            box-shadow: -10px 0 50px rgba(19, 19, 48, 0.22);
            z-index: 100075;
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 380ms cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
            box-sizing: border-box;
            font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
            color: #131330;
        }
        .pcis-specs-drawer.is-open {
            transform: translateX(0);
        }

        /* ── Drawer Header ────────────────────────────────────── */
        .pcis-specs-header {
            padding: 24px 24px 16px;
            border-bottom: 1px solid rgba(19, 19, 48, 0.08);
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
            background: rgba(255, 255, 255, 0.6);
        }
        .pcis-specs-header-titles {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .pcis-specs-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            background: rgba(255, 183, 3, 0.15);
            border: 1px solid rgba(255, 183, 3, 0.4);
            border-radius: 20px;
            color: #D97706;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            width: fit-content;
        }
        .pcis-specs-title {
            font-size: 20px;
            font-weight: 800;
            color: #131330;
            line-height: 1.2;
            margin: 0;
        }
        .pcis-specs-subtitle {
            font-size: 12px;
            color: #64748B;
            font-weight: 600;
            margin: 0;
        }
        /* Red Circular Close Button with 360° Hover Spin (Matching EVP Component Standard) */
        .pcis-specs-close-btn {
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
        .pcis-specs-close-btn i {
            font-size: 18px;
            line-height: 1;
            display: inline-flex;
            margin: 0;
            padding: 0;
            pointer-events: none;
            color: #FFFFFF;
        }
        .pcis-specs-close-btn:hover {
            background: #DC2626;
            color: #FFFFFF;
            transform: rotate(360deg);
        }
        .pcis-specs-close-btn:active {
            transform: rotate(360deg) scale(0.94);
        }

        /* ── Drawer Action Bar ────────────────────────────────── */
        .pcis-specs-actions {
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.7);
            border-bottom: 1px solid rgba(19, 19, 48, 0.06);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .pcis-specs-action-btn {
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
            font-family: inherit;
            cursor: pointer;
            border: none;
            outline: none;
            transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
            text-decoration: none;
        }
        .pcis-specs-action-nav {
            background: #131330;
            color: #FFFFFF;
            box-shadow: 0 4px 14px rgba(19, 19, 48, 0.2);
        }
        .pcis-specs-action-nav:hover {
            background: #FFB703;
            color: #131330;
            transform: translateY(-1px);
        }
        .pcis-specs-action-pdf {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(19, 19, 48, 0.12);
            color: #131330;
        }
        .pcis-specs-action-pdf:hover {
            border-color: #FFB703;
            color: #D97706;
            transform: translateY(-1px);
        }

        /* ── Bento Grid Content Area ──────────────────────────── */
        .pcis-specs-content {
            padding: 20px 24px 40px;
            overflow-y: auto;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 16px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 183, 3, 0.45) transparent;
        }

        .pcis-specs-content::-webkit-scrollbar {
            width: 5px;
        }

        .pcis-specs-content::-webkit-scrollbar-track {
            background: transparent;
            margin: 6px 0;
        }

        .pcis-specs-content::-webkit-scrollbar-thumb {
            background: rgba(255, 183, 3, 0.45);
            border-radius: 999px;
            transition: background 180ms ease;
        }

        .pcis-specs-content::-webkit-scrollbar-thumb:hover {
            background: #FFB703;
            box-shadow: 0 0 6px rgba(255, 183, 3, 0.45);
        }

        /* Bento Card Base */
        .pcis-bento-card {
            background: rgba(255, 255, 255, 0.75);
            border: 1px solid rgba(255, 255, 255, 0.9);
            border-radius: 16px;
            padding: 16px 18px;
            box-shadow: 0 4px 16px rgba(19, 19, 48, 0.04);
            display: flex;
            flex-direction: column;
            gap: 12px;
            transition: transform 220ms ease, box-shadow 220ms ease;
        }
        .pcis-bento-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(19, 19, 48, 0.08);
        }
        .pcis-bento-card-header {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .pcis-bento-icon-box {
            width: 32px;
            height: 32px;
            border-radius: 10px;
            background: rgba(255, 183, 3, 0.16);
            color: #D97706;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
        }
        .pcis-bento-card-title {
            font-size: 13px;
            font-weight: 800;
            color: #131330;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0;
        }

        /* Metric Grid inside Card */
        .pcis-bento-metrics {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        .pcis-bento-metric-item {
            background: rgba(248, 250, 252, 0.85);
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 12px;
            padding: 10px 12px;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .pcis-bento-metric-item.full-width {
            grid-column: span 2;
        }
        .pcis-bento-metric-label {
            font-size: 10px;
            font-weight: 700;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .pcis-bento-metric-value {
            font-size: 13px;
            font-weight: 800;
            color: #131330;
            line-height: 1.3;
        }
        .pcis-bento-metric-value.highlight {
            color: #D97706;
        }

        /* Seating Badges List */
        .pcis-bento-badge-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .pcis-bento-badge-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(248, 250, 252, 0.85);
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 10px;
            padding: 8px 12px;
            font-size: 12px;
        }
        .pcis-bento-badge-name {
            font-weight: 700;
            color: #131330;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .pcis-bento-badge-count {
            font-weight: 800;
            color: #D97706;
            background: rgba(255, 183, 3, 0.12);
            padding: 2px 8px;
            border-radius: 6px;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
            .pcis-specs-drawer {
                top: auto;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100vw;
                max-height: 82vh;
                border-left: none;
                border-top: 1px solid rgba(255, 255, 255, 0.9);
                border-radius: 24px 24px 0 0;
                transform: translateY(100%);
            }
            .pcis-specs-drawer.is-open {
                transform: translateY(0);
            }
            .pcis-specs-header {
                padding: 18px 20px 14px;
            }
            .pcis-specs-content {
                padding: 16px 20px 32px;
            }
        }
    `;
    document.head.appendChild(style);

    // ── Build DOM ─────────────────────────────────────────────────────
    const root = document.createElement("div");
    root.id = "pcis-specs-drawer-root";

    root.innerHTML = `
        <div class="pcis-specs-backdrop" id="pcis-specs-backdrop"></div>
        <div class="pcis-specs-drawer" id="pcis-specs-drawer" role="dialog" aria-label="EVP Technical Specifications">
            <!-- Header -->
            <div class="pcis-specs-header">
                <div class="pcis-specs-header-titles">
                    <span class="pcis-specs-pill" id="pcis-specs-badge">
                        <i class="fi fi-sr-document"></i> <span>Architectural Specs</span>
                    </span>
                    <h2 class="pcis-specs-title" id="pcis-specs-name">Exhibition Hall A</h2>
                    <p class="pcis-specs-subtitle" id="pcis-specs-category">Exhibition Halls • Official Factsheet</p>
                </div>
                <button class="pcis-specs-close-btn" id="pcis-specs-close" type="button" aria-label="Close specifications">
                    <i class="fi fi-rr-cross-small" aria-hidden="true"></i>
                </button>
            </div>

            <!-- Quick Action Bar -->
            <div class="pcis-specs-actions">
                <button class="pcis-specs-action-btn pcis-specs-action-nav" id="pcis-specs-nav-btn" type="button">
                    <i class="fi fi-ss-marker"></i> <span>Directions to Location</span>
                </button>
                <button class="pcis-specs-action-btn pcis-specs-action-pdf" id="pcis-specs-pdf-btn" type="button">
                    <i class="fi fi-rr-file-pdf"></i> <span>Full PDF Factsheet</span>
                </button>
            </div>

            <!-- Bento Content Cards -->
            <div class="pcis-specs-content" id="pcis-specs-cards-container">
                <!-- Dynamically populated -->
            </div>
        </div>
    `;
    document.body.appendChild(root);

    const backdrop = document.getElementById("pcis-specs-backdrop");
    const drawer = document.getElementById("pcis-specs-drawer");
    const closeBtn = document.getElementById("pcis-specs-close");
    const navBtn = document.getElementById("pcis-specs-nav-btn");
    const pdfBtn = document.getElementById("pcis-specs-pdf-btn");
    const cardsContainer = document.getElementById("pcis-specs-cards-container");

    let currentRenderedKey = null;

    // ── Helper to resolve current scene name ──────────────────────────
    function getActiveSceneName() {
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
        return "Hall A";
    }

    // ── Render Bento Cards ────────────────────────────────────────────
    function renderSpecs(sceneName) {
        if (!window.getSpecsForScene) return;
        const spec = window.getSpecsForScene(sceneName);
        if (!spec) return;

        currentRenderedKey = spec.title;

        // Header Updates
        document.getElementById("pcis-specs-badge").innerHTML = `<i class="fi fi-sr-check-circle"></i> <span>${spec.badge || "Verified Specs"}</span>`;
        document.getElementById("pcis-specs-name").textContent = spec.title;
        document.getElementById("pcis-specs-category").textContent = `${spec.category} • Official EVP Architecture`;

        // Wire Directions Button
        navBtn.onclick = function () {
            closeSpecs();
            if (typeof window.openDirectionsForLocation === "function") {
                window.openDirectionsForLocation(spec.title);
            } else if (typeof window.toggleLocation === "function") {
                window.toggleLocation();
            }
        };

        let html = "";

        // Card 1: Dimensions & Clearance
        if (spec.areaSqFt || spec.dimensionsMetric || spec.clearHeightMin) {
            html += `
                <div class="pcis-bento-card">
                    <div class="pcis-bento-card-header">
                        <div class="pcis-bento-icon-box"><i class="fi fi-rr-ruler-combined"></i></div>
                        <h3 class="pcis-bento-card-title">Dimensions & Clear Heights</h3>
                    </div>
                    <div class="pcis-bento-metrics">
                        ${spec.areaSqFt ? `
                            <div class="pcis-bento-metric-item">
                                <span class="pcis-bento-metric-label">Total Floor Area</span>
                                <span class="pcis-bento-metric-value highlight">${spec.areaSqFt.toLocaleString()} sq. ft</span>
                                <span style="font-size:10px; color:#64748B;">(${spec.areaM2} sq. m)</span>
                            </div>
                        ` : ""}
                        ${spec.exhibitSpaceSqFt ? `
                            <div class="pcis-bento-metric-item">
                                <span class="pcis-bento-metric-label">Exhibit Space</span>
                                <span class="pcis-bento-metric-value">${spec.exhibitSpaceSqFt.toLocaleString()} sq. ft</span>
                                <span style="font-size:10px; color:#64748B;">(${spec.exhibitSpaceM2} sq. m)</span>
                            </div>
                        ` : ""}
                        ${spec.dimensionsMetric ? `
                            <div class="pcis-bento-metric-item full-width">
                                <span class="pcis-bento-metric-label">Length × Width</span>
                                <span class="pcis-bento-metric-value">${spec.dimensionsImperial || spec.dimensionsMetric}</span>
                                <span style="font-size:10px; color:#64748B;">(${spec.dimensionsMetric})</span>
                            </div>
                        ` : ""}
                        ${spec.clearHeightMin ? `
                            <div class="pcis-bento-metric-item full-width">
                                <span class="pcis-bento-metric-label">Clear Heights (Min / Max)</span>
                                <span class="pcis-bento-metric-value">${spec.clearHeightMin} to ${spec.clearHeightMax}</span>
                            </div>
                        ` : ""}
                    </div>
                </div>
            `;
        }

        // Card 2: Seating & Event Capacities
        if (spec.capacities) {
            html += `
                <div class="pcis-bento-card">
                    <div class="pcis-bento-card-header">
                        <div class="pcis-bento-icon-box"><i class="fi fi-rr-users-class"></i></div>
                        <h3 class="pcis-bento-card-title">Capacities & Layout Configurations</h3>
                    </div>
                    <div class="pcis-bento-badge-list">
                        ${spec.capacities.classroom ? `
                            <div class="pcis-bento-badge-row">
                                <span class="pcis-bento-badge-name"><i class="fi fi-rr-users-class"></i> Classroom Setup</span>
                                <span class="pcis-bento-badge-count">${spec.capacities.classroom}</span>
                            </div>
                        ` : ""}
                        ${spec.capacities.theatre ? `
                            <div class="pcis-bento-badge-row">
                                <span class="pcis-bento-badge-name"><i class="fi fi-rr-chair"></i> Theatre Setup</span>
                                <span class="pcis-bento-badge-count">${spec.capacities.theatre}</span>
                            </div>
                        ` : ""}
                        ${spec.capacities.cabaret ? `
                            <div class="pcis-bento-badge-row">
                                <span class="pcis-bento-badge-name"><i class="fi fi-rr-glass-cheers"></i> Cabaret / Banquet</span>
                                <span class="pcis-bento-badge-count">${spec.capacities.cabaret}</span>
                            </div>
                        ` : ""}
                        ${spec.capacities.cocktail ? `
                            <div class="pcis-bento-badge-row">
                                <span class="pcis-bento-badge-name"><i class="fi fi-rr-cocktail"></i> Floating Expo / Cocktail</span>
                                <span class="pcis-bento-badge-count">${spec.capacities.cocktail}</span>
                            </div>
                        ` : ""}
                        ${spec.capacities.meeting ? `
                            <div class="pcis-bento-badge-row">
                                <span class="pcis-bento-badge-name"><i class="fi fi-rr-users"></i> Meeting Seating</span>
                                <span class="pcis-bento-badge-count">${spec.capacities.meeting}</span>
                            </div>
                        ` : ""}
                        ${spec.capacities.boardroom ? `
                            <div class="pcis-bento-badge-row">
                                <span class="pcis-bento-badge-name"><i class="fi fi-rr-briefcase"></i> Boardroom Seating</span>
                                <span class="pcis-bento-badge-count">${spec.capacities.boardroom}</span>
                            </div>
                        ` : ""}
                        ${/hall\s*[a-d]/i.test(spec.title || "") ? `
                            <div style="margin-top: 10px; padding: 10px 14px; background: rgba(255, 183, 3, 0.12); border: 1px solid rgba(255, 183, 3, 0.4); border-radius: 12px; display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <i class="fi fi-rr-settings-sliders" style="color: #d97706; font-size: 15px;"></i>
                                    <div>
                                        <div style="font-size: 12px; font-weight: 800; color: #131330;">Custom Stage Dimensions?</div>
                                        <div style="font-size: 10.5px; color: #5c5c7a; font-weight: 500;">Simulate live seating capacity delta</div>
                                    </div>
                                </div>
                                <button type="button" onclick="if(window.evpStageSimulator){window.evpStageSimulator.open(); if(typeof window.evpCloseSpecs==='function') window.evpCloseSpecs();}" style="background: #131330; color: #FFB703; border: none; border-radius: 8px; font-size: 11px; font-weight: 800; padding: 6px 12px; cursor: pointer;">
                                    Simulate
                                </button>
                            </div>
                        ` : ""}
                    </div>
                </div>
            `;
        }

        // Card 3: Structural & Rigging Strength
        if (spec.floorLoad || spec.riggingPoints) {
            html += `
                <div class="pcis-bento-card">
                    <div class="pcis-bento-card-header">
                        <div class="pcis-bento-icon-box"><i class="fi fi-rr-anchor"></i></div>
                        <h3 class="pcis-bento-card-title">Structural & Rigging Strength</h3>
                    </div>
                    <div class="pcis-bento-metrics">
                        ${spec.floorLoad ? `
                            <div class="pcis-bento-metric-item full-width">
                                <span class="pcis-bento-metric-label">Exhibit Floor Load</span>
                                <span class="pcis-bento-metric-value highlight">${spec.floorLoad}</span>
                            </div>
                        ` : ""}
                        ${spec.hangingLoad ? `
                            <div class="pcis-bento-metric-item">
                                <span class="pcis-bento-metric-label">Hanging Capacity</span>
                                <span class="pcis-bento-metric-value">${spec.hangingLoad}</span>
                            </div>
                        ` : ""}
                        ${spec.riggingPoints ? `
                            <div class="pcis-bento-metric-item">
                                <span class="pcis-bento-metric-label">Rigging Hooks</span>
                                <span class="pcis-bento-metric-value">${spec.riggingPoints}</span>
                            </div>
                        ` : ""}
                    </div>
                </div>
            `;
        }

        // Card 4: Electrical, HVAC & Utilities
        if (spec.coolingCapacity || spec.powerPoints || spec.lighting) {
            html += `
                <div class="pcis-bento-card">
                    <div class="pcis-bento-card-header">
                        <div class="pcis-bento-icon-box"><i class="fi fi-rr-bolt"></i></div>
                        <h3 class="pcis-bento-card-title">Electrical & Climate Engineering</h3>
                    </div>
                    <div class="pcis-bento-metrics">
                        ${spec.coolingCapacity ? `
                            <div class="pcis-bento-metric-item full-width">
                                <span class="pcis-bento-metric-label">HVAC Cooling</span>
                                <span class="pcis-bento-metric-value highlight">${spec.coolingCapacity}</span>
                                ${spec.airDistribution ? `<span style="font-size:10px; color:#64748B;">${spec.airDistribution}</span>` : ""}
                            </div>
                        ` : ""}
                        ${spec.powerPoints ? `
                            <div class="pcis-bento-metric-item">
                                <span class="pcis-bento-metric-label">Power Outlets</span>
                                <span class="pcis-bento-metric-value">${spec.powerPoints}</span>
                            </div>
                        ` : ""}
                        ${spec.dgBackup ? `
                            <div class="pcis-bento-metric-item">
                                <span class="pcis-bento-metric-label">Backup Power</span>
                                <span class="pcis-bento-metric-value">${spec.dgBackup}</span>
                            </div>
                        ` : ""}
                        ${spec.lighting ? `
                            <div class="pcis-bento-metric-item full-width">
                                <span class="pcis-bento-metric-label">Venue Illumination</span>
                                <span class="pcis-bento-metric-value">${spec.lighting}</span>
                            </div>
                        ` : ""}
                    </div>
                </div>
            `;
        }

        // Card 5: Ingress, Security & Amenities
        if (spec.accessDoors || spec.cctvCameras || spec.washrooms || spec.amenities) {
            html += `
                <div class="pcis-bento-card">
                    <div class="pcis-bento-card-header">
                        <div class="pcis-bento-icon-box"><i class="fi fi-rr-shield-check"></i></div>
                        <h3 class="pcis-bento-card-title">Access, Security & Facilities</h3>
                    </div>
                    <div class="pcis-bento-metrics">
                        ${spec.accessDoors ? `
                            <div class="pcis-bento-metric-item full-width">
                                <span class="pcis-bento-metric-label">Guest Access</span>
                                <span class="pcis-bento-metric-value">${spec.accessDoors}</span>
                            </div>
                        ` : ""}
                        ${spec.cargoShutters ? `
                            <div class="pcis-bento-metric-item">
                                <span class="pcis-bento-metric-label">Freight Rollers</span>
                                <span class="pcis-bento-metric-value">${spec.cargoShutters}</span>
                            </div>
                        ` : ""}
                        ${spec.cctvCameras ? `
                            <div class="pcis-bento-metric-item">
                                <span class="pcis-bento-metric-label">CCTV Security</span>
                                <span class="pcis-bento-metric-value">${spec.cctvCameras}</span>
                            </div>
                        ` : ""}
                        ${spec.washrooms ? `
                            <div class="pcis-bento-metric-item full-width">
                                <span class="pcis-bento-metric-label">Restrooms</span>
                                <span class="pcis-bento-metric-value">${spec.washrooms}</span>
                            </div>
                        ` : ""}
                    </div>
                </div>
            `;
        }

        cardsContainer.innerHTML = html;
    }

    // ── Public APIs ───────────────────────────────────────────────────
    function openSpecs(sceneName) {
        const targetScene = sceneName || getActiveSceneName();
        renderSpecs(targetScene);
        backdrop.classList.add("is-open");
        drawer.classList.add("is-open");
    }

    function closeSpecs() {
        backdrop.classList.remove("is-open");
        drawer.classList.remove("is-open");
    }

    function toggleSpecs(sceneName) {
        if (drawer.classList.contains("is-open")) {
            closeSpecs();
        } else {
            openSpecs(sceneName);
        }
    }

    closeBtn.addEventListener("click", closeSpecs);
    backdrop.addEventListener("click", closeSpecs);

    if (pdfBtn) {
        pdfBtn.addEventListener("click", function () {
            closeSpecs();
            if (typeof window.openDisclosure === "function") {
                window.openDisclosure();
            } else if (typeof window.toggleDisclosure === "function") {
                window.toggleDisclosure();
            } else {
                window.open("EVP%20SPECIFICATION.pdf", "_blank");
            }
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && drawer.classList.contains("is-open")) {
            closeSpecs();
        }
    });

    // Auto-update specs if drawer is currently open and panorama media changes
    function onSceneChanged() {
        if (drawer.classList.contains("is-open")) {
            setTimeout(function () {
                const active = getActiveSceneName();
                if (active && active !== currentRenderedKey) {
                    renderSpecs(active);
                }
            }, 300);
        }
    }

    if (window.tour && typeof window.tour.on === "function") {
        window.tour.on("mediaChange", onSceneChanged);
    } else if (window.tour && window.tour.player && typeof window.tour.player.on === "function") {
        window.tour.player.on("mediaChange", onSceneChanged);
    }

    // Expose globally
    window.evpOpenSpecs = openSpecs;
    window.evpCloseSpecs = closeSpecs;
    window.evpToggleSpecs = toggleSpecs;

})();
