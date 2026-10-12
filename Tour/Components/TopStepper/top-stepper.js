// ═══════════════════════════════════════════════════════════════════════
//  EVP TRADE & CONVENTION CENTRE — UNIFIED TOUR STEPPER COMPONENT
//  Dedicated Top-HUD Stepper (< 01 / Total v >) & Quick Scene Selector
//  • Connects Explore sequence: Dynamic Indoor 360° Panos + 7 Outdoor GSV POVs
//  • Eliminates Hall Layout duplicates (Classroom/Theatre/Cabaret are dock filters)
//  • Displays dynamic XX / Total in the top HUD
//  • Preserves Panolist.js drawer 100% intact as originally designed
// ═══════════════════════════════════════════════════════════════════════

(function () {
    "use strict";

    if (window.__evpTopStepperLoaded) return;
    window.__evpTopStepperLoaded = true;

    // ── 7 Fixed Outdoor Google Street View POVs ─────────────────────────
    const OUTDOOR_GSV_SCENES = [
        {
            label: "Grand Arrival Entrance Gate",
            isIndoor: false,
            panoKey: null,
            povId: "arrival-gate",
            thumb: "thumbnail.png"
        },
        {
            label: "Internal Driveway & Circulation Network",
            isIndoor: false,
            panoKey: null,
            povId: "driveway-network",
            thumb: "thumbnail.png"
        },
        {
            label: "THE CANVAS 1 — Open Concrete Arena",
            isIndoor: false,
            panoKey: null,
            povId: "canvas1",
            thumb: "thumbnail.png"
        },
        {
            label: "THE CANVAS 2 — Mega Concert Ground",
            isIndoor: false,
            panoKey: null,
            povId: "canvas2",
            thumb: "thumbnail.png"
        },
        {
            label: "Parking Zone 1 (Trade Halls)",
            isIndoor: false,
            panoKey: null,
            povId: "parking1",
            thumb: "thumbnail.png"
        },
        {
            label: "Parking Zone 2 (Entrance Plaza)",
            isIndoor: false,
            panoKey: null,
            povId: "parking2",
            thumb: "thumbnail.png"
        },
        {
            label: "Venue Perimeter & Landscaping",
            isIndoor: false,
            panoKey: null,
            povId: "perimeter",
            thumb: "thumbnail.png"
        }
    ];

    // ── Default 17 Initial Indoor Destinations Dataset (Fallback) ───────
    const DEFAULT_INDOOR_SCENES = [
        {
            label: "Entrance Plaza & Foyer",
            isIndoor: true,
            panoKey: "Entrance Plaza & Foyer",
            povId: null,
            thumb: "media/panorama_16732D79_1A36_AB9E_41B4_17DA451FAD1D_t.webp"
        },
        {
            label: "Hall A - Classroom",
            isIndoor: true,
            panoKey: "Hall A - Classroom",
            hallPrefix: "hall a",
            povId: null,
            thumb: "media/panorama_14632B5C_19C2_F01C_41B7_19C4ED3227EC_t.webp"
        },
        {
            label: "Hall B - Classroom",
            isIndoor: true,
            panoKey: "Hall B - Classroom",
            hallPrefix: "hall b",
            povId: null,
            thumb: "media/panorama_0A0E6ECC_1A42_707C_418D_CCE338F5D70E_t.webp"
        },
        {
            label: "Hall C - Classroom",
            isIndoor: true,
            panoKey: "Hall C - Classroom",
            hallPrefix: "hall c",
            povId: null,
            thumb: "media/panorama_149B71EE_1A42_B03D_41B4_24738D3F79F4_t.webp"
        },
        {
            label: "Hall D - Classroom",
            isIndoor: true,
            panoKey: "Hall D - Classroom",
            hallPrefix: "hall d",
            povId: null,
            thumb: "media/panorama_14F664E8_1A42_B024_41B1_96D22060E4C2_t.webp"
        },
        {
            label: "Inter-Hall Covered Connection",
            isIndoor: true,
            panoKey: "Inter-Hall Covered Connection",
            povId: null,
            thumb: "media/panorama_14096C80_1A35_E96D_4187_6E8C251903E8_t.webp"
        },
        {
            label: "Executive Hospitality Pavilion",
            isIndoor: true,
            panoKey: "Executive Hospitality Pavilion",
            povId: null,
            thumb: "media/panorama_17EBACD2_1A35_EAED_41B9_24102920D4D7_t.webp"
        },
        {
            label: "Corporate Boardroom",
            isIndoor: true,
            panoKey: "Corporate Boardroom",
            povId: null,
            thumb: "media/panorama_17CF12C3_1A35_FEF3_41A3_EBBC7502958A_t.webp"
        },
        {
            label: "Executive Meeting Room",
            isIndoor: true,
            panoKey: "Executive Meeting Room",
            povId: null,
            thumb: "media/panorama_17D9A0CA_1A35_FAFD_4196_CAFED30EBD28_t.webp"
        },
        {
            label: "VIP Lounge",
            isIndoor: true,
            panoKey: "VIP Lounge",
            povId: null,
            thumb: "media/panorama_1434249B_1A35_FA93_419A_FA79BE1231B2_t.webp"
        },
        {
            label: "Private Meeting Suites",
            isIndoor: true,
            panoKey: "Private Meeting Suites",
            povId: null,
            thumb: "media/panorama_17D2FED0_1A35_E6ED_41B9_16264B6669B1_t.webp"
        },
        {
            label: "Co-Working Lounge",
            isIndoor: true,
            panoKey: "Co-Working Lounge",
            povId: null,
            thumb: "media/panorama_14390653_1A35_F993_419E_5200101D22EA_t.webp"
        },
        {
            label: "Curated Café Area",
            isIndoor: true,
            panoKey: "Curated Café Area",
            povId: null,
            thumb: "media/panorama_142C182A_1A35_E9BD_41AB_34F141C2458B_t.webp"
        },
        {
            label: "Food Court",
            isIndoor: true,
            panoKey: "Food Court",
            povId: null,
            thumb: "media/panorama_0A7DA10A_1A35_DB7D_41B4_BF70473A2B81_t.webp"
        },
        {
            label: "Food Court Dining Area",
            isIndoor: true,
            panoKey: "Food Court Dining Area",
            povId: null,
            thumb: "media/panorama_17FA28A5_1A35_EAB7_41AA_3D3507B87DCE_t.webp"
        },
        {
            label: "On-Site Hotel",
            isIndoor: true,
            panoKey: "On-Site Hotel",
            povId: null,
            thumb: "media/panorama_141CBA91_1A35_E96F_41B4_7CACC79D7D5D_t.webp"
        },
        {
            label: "Washroom/Amenity Area",
            isIndoor: true,
            panoKey: "Washroom/Amenity Area",
            povId: null,
            thumb: "media/panorama_1465AE93_1A35_E693_4186_8710BFE5B257_t.webp"
        }
    ];

    // Active dynamically synchronized destinations list
    let tourScenes = DEFAULT_INDOOR_SCENES.concat(OUTDOOR_GSV_SCENES).map((s, idx) => ({
        ...s,
        id: idx + 1
    }));
    let currentScene = tourScenes[0];
    let isDropdownOpen = false;

    // ── Dynamic Scene Synchronizer from 3DVista Player ─────────────────
    function syncTourScenesFromPlayer() {
        let rawPanos = [];
        if (typeof window.getPanoramas === "function") {
            const list = window.getPanoramas();
            if (Array.isArray(list) && list.length > 0) {
                rawPanos = list;
            }
        }

        if (!rawPanos.length && window.tour && window.tour.player && typeof window.tour.player.getById === "function") {
            try {
                const playlist = window.tour.player.getById("mainPlayList");
                if (playlist) {
                    const items = playlist.get("items");
                    if (items && items.length) {
                        rawPanos = items.map((item, idx) => {
                            const media = item.get("media");
                            const id = media ? media.get("id") : "pano_" + idx;
                            const label = media && media.get("data") && media.get("data").label ? media.get("data").label : (id || "Panorama " + (idx + 1));
                            let thumb = "";
                            if (media && typeof media.get === "function") {
                                thumb = media.get("thumbnailUrl") || "";
                            }
                            if (!thumb && media && media.get("frames") && media.get("frames")[0]) {
                                thumb = media.get("frames")[0].thumbnailUrl || "";
                            }
                            const baseId = id.startsWith("panorama_") ? id : `panorama_${id}`;
                            return {
                                id: id,
                                label: label,
                                thumb: thumb || `media/${baseId}_t.webp`
                            };
                        });
                    }
                }
            } catch (e) {}
        }

        if (!rawPanos.length) return;

        // Group / deduplicate hall layouts (Classroom, Theatre, Cabaret) so each hall appears once in stepper
        const seenHallPrefixes = new Set();
        const indoorList = [];

        rawPanos.forEach((p) => {
            const rawLabel = (p.label || p.id || "").trim();
            const lower = rawLabel.toLowerCase();

            // Check if this is a hall with layout variants (Hall A/B/C/D)
            const hallMatch = lower.match(/^hall\s+([a-d])/i);
            if (hallMatch) {
                const prefix = "hall " + hallMatch[1].toLowerCase();
                if (seenHallPrefixes.has(prefix)) {
                    return; // Skip duplicate layout variant in stepper
                }
                seenHallPrefixes.add(prefix);

                const def = DEFAULT_INDOOR_SCENES.find(d => d.hallPrefix === prefix);
                indoorList.push({
                    label: rawLabel,
                    isIndoor: true,
                    panoKey: rawLabel,
                    hallPrefix: prefix,
                    povId: null,
                    thumb: p.thumb || (def ? def.thumb : "thumbnail.png")
                });
                return;
            }

            // Regular indoor panorama (existing or newly added)
            const def = DEFAULT_INDOOR_SCENES.find(d => d.panoKey && d.panoKey.toLowerCase() === lower);
            indoorList.push({
                label: rawLabel,
                isIndoor: true,
                panoKey: rawLabel,
                povId: null,
                thumb: p.thumb || (def ? def.thumb : "thumbnail.png")
            });
        });

        // Combine dynamically resolved indoor scenes + fixed outdoor GSV scenes
        const combined = indoorList.concat(OUTDOOR_GSV_SCENES).map((s, idx) => ({
            ...s,
            id: idx + 1
        }));

        tourScenes = combined;

        // Re-align currentScene pointer with updated tourScenes array
        if (currentScene) {
            const match = currentScene.isIndoor
                ? tourScenes.find(s => s.isIndoor && ((s.panoKey && currentScene.panoKey && s.panoKey.toLowerCase() === currentScene.panoKey.toLowerCase()) || (s.hallPrefix && currentScene.hallPrefix && s.hallPrefix === currentScene.hallPrefix) || s.label.toLowerCase() === currentScene.label.toLowerCase()))
                : tourScenes.find(s => !s.isIndoor && s.povId === currentScene.povId);
            if (match) currentScene = match;
            else currentScene = tourScenes[0];
        } else {
            currentScene = tourScenes[0];
        }
    }

    // ── Inject Stepper Component Styles ────────────────────────────────
    const style = document.createElement("style");
    style.id = "evp-top-stepper-styles";
    style.textContent = `
        /* Top Stepper Group */
        .evp-stepper-group {
            display: inline-flex;
            align-items: center;
            gap: 2px;
            background: transparent;
            border: none;
            box-shadow: none;
            flex-shrink: 0;
            user-select: none;
        }

        .evp-stepper-btn {
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

        .evp-stepper-btn:hover {
            background: rgba(255, 183, 3, 0.14);
            color: #B45309;
            transform: scale(1.08);
        }

        .evp-stepper-btn:active {
            transform: scale(0.92);
        }

        /* ── Prominent Quick Feature Action Badges ────────────── */
        .evp-quick-dir-btn,
        .evp-quick-specs-btn {
            width: 30px;
            height: 30px;
            margin: 0 1px;
            position: relative;
            transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Directions Pin Button - Warm Amber Glassmorphism */
        .evp-quick-dir-btn {
            background: rgba(255, 183, 3, 0.14);
            border: 1px solid rgba(255, 183, 3, 0.42);
            color: #B45309;
            box-shadow: 0 2px 6px rgba(255, 183, 3, 0.15);
        }
        .evp-quick-dir-btn i {
            font-size: 13px;
            transition: transform 180ms ease;
        }
        .evp-quick-dir-btn:hover {
            background: #FFB703;
            border-color: #FFB703;
            color: #131330;
            transform: translateY(-1px) scale(1.08);
            box-shadow: 0 4px 14px rgba(255, 183, 3, 0.45);
        }
        .evp-quick-dir-btn:hover i {
            transform: translateY(-1px);
        }
        .evp-quick-dir-btn:active {
            transform: translateY(0) scale(0.94);
        }

        /* Specifications Button - Midnight Tech Blueprint Glassmorphism */
        .evp-quick-specs-btn {
            background: rgba(19, 19, 48, 0.08);
            border: 1px solid rgba(19, 19, 48, 0.16);
            color: #131330;
            box-shadow: 0 2px 6px rgba(19, 19, 48, 0.06);
        }
        .evp-quick-specs-btn i {
            font-size: 13px;
            transition: transform 180ms ease;
        }
        .evp-quick-specs-btn:hover {
            background: #131330;
            border-color: #131330;
            color: #FFB703;
            transform: translateY(-1px) scale(1.08);
            box-shadow: 0 4px 14px rgba(19, 19, 48, 0.28);
        }
        .evp-quick-specs-btn:hover i {
            transform: rotate(-6deg);
        }
        .evp-quick-specs-btn:active {
            transform: translateY(0) scale(0.94);
        }

        .evp-stepper-pill {
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

        .evp-stepper-pill:hover,
        .evp-stepper-pill.is-active {
            background: rgba(255, 183, 3, 0.14);
        }

        .evp-stepper-count {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 11px;
            font-weight: 700;
            color: #131330;
            letter-spacing: 0.04em;
            white-space: nowrap;
            line-height: 1;
        }

        .evp-stepper-chevron {
            font-size: 11px;
            color: #B45309;
            transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }

        .evp-stepper-pill.is-active .evp-stepper-chevron {
            transform: rotate(180deg);
        }

        /* Dedicated 24-view Dropdown - Perfectly Centered Below Widget */
        .evp-tour-dropdown {
            position: fixed;
            background: rgba(255, 255, 255, 0.94);
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
            left: 50% !important;
            transform: translate(-50%, -8px) scale(0.98);
            transform-origin: top center;
            transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1),
                        transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
                        visibility 200ms ease;
            z-index: 100075;
            pointer-events: none;
            cursor: default;
            box-sizing: border-box;
            width: min(440px, 94vw);
            max-width: 94vw;
        }

        .evp-tour-dropdown.is-open {
            opacity: 1;
            visibility: visible;
            transform: translate(-50%, 0) scale(1);
            pointer-events: auto;
        }

        .evp-tour-dropdown-scroll {
            max-height: 290px;
            overflow-y: auto;
            overscroll-behavior: contain;
            display: flex;
            flex-direction: column;
            gap: 3px;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        .evp-tour-dropdown-scroll::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
        }

        .evp-tour-dropdown-item {
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

        .evp-tour-dropdown-item:hover {
            background: rgba(255, 183, 3, 0.12);
            transform: translateX(2px);
        }

        .evp-tour-dropdown-item.is-selected {
            background: rgba(255, 183, 3, 0.16);
        }

        .evp-tour-dropdown-thumb-wrap {
            position: relative;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            overflow: hidden;
            flex-shrink: 0;
            background: #FFFFFF;
            box-shadow: 0 2px 6px rgba(19, 19, 48, 0.05);
            border: 1px solid rgba(19, 19, 48, 0.1);
        }

        .evp-tour-dropdown-thumb {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .evp-tour-dropdown-type-badge {
            position: absolute;
            bottom: 2px;
            right: 2px;
            background: rgba(19, 19, 48, 0.88);
            color: #FFB703;
            width: 14px;
            height: 14px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            border: 0.5px solid rgba(255, 183, 3, 0.4);
        }

        .evp-tour-dropdown-num {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 11px;
            font-weight: 700;
            color: #64748B;
            line-height: 1;
            flex-shrink: 0;
            min-width: 18px;
        }

        .evp-tour-dropdown-item.is-selected .evp-tour-dropdown-num {
            color: #B45309;
            font-weight: 800;
        }

        .evp-tour-dropdown-col {
            display: flex;
            flex-direction: column;
            min-width: 0;
            flex: 1;
            gap: 1px;
        }

        .evp-tour-dropdown-title {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 13px;
            font-weight: 600;
            color: #131330;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.25;
            transition: color 180ms ease;
        }

        .evp-tour-dropdown-sub {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 10px;
            color: #64748B;
            line-height: 1.1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .evp-tour-dropdown-item:hover .evp-tour-dropdown-title,
        .evp-tour-dropdown-item.is-selected .evp-tour-dropdown-title {
            color: #B45309;
            font-weight: 700;
        }

        .evp-tour-dropdown-item-check {
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

        .evp-tour-dropdown-item.is-selected .evp-tour-dropdown-item-check {
            opacity: 1;
            transform: scale(1);
        }
    `;
    document.head.appendChild(style);

    // ── Build Dropdown DOM ─────────────────────────────────────────────
    let dropdown = document.getElementById("evp-tour-dropdown");
    if (!dropdown) {
        dropdown = document.createElement("div");
        dropdown.id = "evp-tour-dropdown";
        dropdown.className = "evp-tour-dropdown";
        dropdown.setAttribute("role", "listbox");
        dropdown.setAttribute("aria-label", "Master Tour Scene Selector");
        dropdown.innerHTML = `<div class="evp-tour-dropdown-scroll" id="evp-tour-dropdown-scroll"></div>`;
        document.body.appendChild(dropdown);
    }
    const dropdownScroll = document.getElementById("evp-tour-dropdown-scroll");

    // ── Find Active Scene ──────────────────────────────────────────────
    function findActiveScene() {
        // 1. Check if Google Street View POV is active
        if (window.isGsvPovActive && window.isGsvPovActive()) {
            const activePov = typeof window.getActiveGsvPovLocation === "function" ? window.getActiveGsvPovLocation() : null;
            if (activePov && activePov.id) {
                const match = tourScenes.find(s => !s.isIndoor && s.povId === activePov.id);
                if (match) return match;
            }
            if (activePov && activePov.name) {
                const match = tourScenes.find(s => !s.isIndoor && s.label.toLowerCase() === activePov.name.toLowerCase());
                if (match) return match;
            }
            if (currentScene && !currentScene.isIndoor) {
                return currentScene;
            }
            return tourScenes.find(s => !s.isIndoor) || tourScenes[tourScenes.length - 1];
        }

        // 2. 3DVista Indoor Panorama
        let mediaLabel = "";
        try {
            const rootPlayer = window.tour && window.tour._getRootPlayer ? window.tour._getRootPlayer() : null;
            if (rootPlayer) {
                const viewer = rootPlayer.getMainViewer();
                const media = rootPlayer.getActiveMediaWithViewer(viewer);
                if (media) {
                    const data = media.get("data") || {};
                    mediaLabel = data.label || media.get("id") || "";
                }
            }
        } catch (e) {}

        if (mediaLabel) {
            const clean = mediaLabel.trim().toLowerCase();
            // Exhibition Hall layout filter mapping: Classroom, Theatre, Cabaret -> canonical single Hall A-D
            const hallMatch = clean.match(/^hall\s+([a-d])/i);
            if (hallMatch) {
                const prefix = "hall " + hallMatch[1].toLowerCase();
                const s = tourScenes.find(s => s.hallPrefix === prefix);
                if (s) {
                    s.label = mediaLabel;
                    s.panoKey = mediaLabel;
                    return s;
                }
            }

            // Washroom / Amenity check
            if (clean.includes("washroom") || clean.includes("amenity")) {
                const washroomScene = tourScenes.find(s => s.isIndoor && (s.label.toLowerCase().includes("washroom") || s.label.toLowerCase().includes("amenity")));
                if (washroomScene) return washroomScene;
            }

            const match = tourScenes.find(s => s.isIndoor && (s.panoKey && s.panoKey.toLowerCase() === clean || s.label.toLowerCase() === clean));
            if (match) return match;

            const partial = tourScenes.find(s => s.isIndoor && (clean.includes(s.label.toLowerCase()) || s.label.toLowerCase().includes(clean)));
            if (partial) return partial;
        }

        return tourScenes[0] || currentScene;
    }

    // ── Update Stepper UI ──────────────────────────────────────────────
    function updateStepperUI(scene) {
        syncTourScenesFromPlayer();
        if (!scene) scene = findActiveScene();
        currentScene = scene;

        const totalCount = tourScenes.length || 24;
        const currentIdx = tourScenes.findIndex(s => s === scene || (scene && s.id === scene.id));
        const currentNum = currentIdx >= 0 ? currentIdx + 1 : (scene && scene.id ? scene.id : 1);
        const countText = `${String(currentNum).padStart(2, "0")} / ${String(totalCount).padStart(2, "0")}`;

        const countEl = document.getElementById("evp-scene-count");
        if (countEl) {
            countEl.textContent = countText;
        }

        // Keep Panolist's old countEl synced if it still exists
        const oldPanoCount = document.getElementById("spatial-scene-count");
        if (oldPanoCount && oldPanoCount !== countEl) {
            oldPanoCount.textContent = countText;
        }

        const nameEl = document.getElementById("spatial-location-name");
        if (nameEl && scene) {
            nameEl.textContent = scene.label;
        }

        if (isDropdownOpen) {
            renderDropdown();
        }
    }

    // ── Navigate to Scene ──────────────────────────────────────────────
    function navigateToScene(scene) {
        if (!scene) return;
        currentScene = scene;
        closeDropdown();

        if (scene.isIndoor) {
            // Dismiss Google Street View if active
            if (typeof window.exitGsvPov === "function") {
                window.exitGsvPov();
            }

            // Set 3DVista Panorama
            const targetMediaName = scene.panoKey || scene.label;
            if (window.tour && typeof window.tour.setMediaByName === "function") {
                window.tour.setMediaByName(targetMediaName);
            }

            // If Hall A-D, reveal dock setup bar & activate halls tab; otherwise cleanly reset
            if (scene.hallPrefix) {
                const setupBar = document.getElementById("pcis-dock-setup-bar");
                if (setupBar) setupBar.classList.add("is-visible");
                const hallsBtn = document.getElementById("dock-tab-halls");
                if (hallsBtn) hallsBtn.classList.add("is-active");
            } else {
                const setupBar = document.getElementById("pcis-dock-setup-bar");
                if (setupBar) setupBar.classList.remove("is-visible");
                const hallsBtn = document.getElementById("dock-tab-halls");
                if (hallsBtn) hallsBtn.classList.remove("is-active");
            }
        } else {
            // Outdoor Google Street View POV
            const setupBar = document.getElementById("pcis-dock-setup-bar");
            if (setupBar) setupBar.classList.remove("is-visible");
            const hallsBtn = document.getElementById("dock-tab-halls");
            if (hallsBtn) hallsBtn.classList.remove("is-active");
            const pill = document.getElementById("pcis-dock-pill");
            if (pill) pill.style.opacity = "0";

            if (scene.povId && typeof window.playGsvPovLocation === "function") {
                window.playGsvPovLocation(scene.povId);
            } else if (typeof window.openGsvPopup === "function") {
                window.openGsvPopup();
            }
        }

        updateStepperUI(scene);
    }

    // ── Stepper Navigation (< and >) ───────────────────────────────────
    function stepScene(dir) {
        if (!tourScenes.length) syncTourScenesFromPlayer();
        const total = tourScenes.length || 24;
        const curIdx = currentScene ? tourScenes.findIndex(s => s.id === currentScene.id) : 0;
        const safeIdx = curIdx >= 0 ? curIdx : 0;
        const targetIdx = (safeIdx + dir + total) % total;
        const target = tourScenes[targetIdx];
        navigateToScene(target);
    }

    // ── Dropdown Menu Controls ─────────────────────────────────────────
    function toggleDropdown(forceState) {
        isDropdownOpen = typeof forceState === "boolean" ? forceState : !isDropdownOpen;
        const pillBtn = document.getElementById("evp-stepper-pill");
        const widget = document.getElementById("pcis-location-widget");

        if (isDropdownOpen && widget && dropdown) {
            renderDropdown();
            const rect = widget.getBoundingClientRect();
            const gap = window.innerWidth <= 768 ? 12 : 14;
            dropdown.style.top = (rect.bottom + gap) + "px";
            dropdown.style.left = "50%";
            const desiredWidth = Math.min(Math.max(rect.width, 420), window.innerWidth * 0.94);
            dropdown.style.width = desiredWidth + "px";
            dropdown.classList.add("is-open");
            if (pillBtn) {
                pillBtn.classList.add("is-active");
                pillBtn.setAttribute("aria-expanded", "true");
            }

            setTimeout(() => {
                if (!dropdownScroll) return;
                const activeItem = dropdownScroll.querySelector(".is-selected");
                if (activeItem) {
                    activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
                }
            }, 60);
        } else if (dropdown) {
            dropdown.classList.remove("is-open");
            if (pillBtn) {
                pillBtn.classList.remove("is-active");
                pillBtn.setAttribute("aria-expanded", "false");
            }
        }
    }

    function closeDropdown() {
        isDropdownOpen = false;
        if (dropdown) dropdown.classList.remove("is-open");
        const pillBtn = document.getElementById("evp-stepper-pill");
        if (pillBtn) {
            pillBtn.classList.remove("is-active");
            pillBtn.setAttribute("aria-expanded", "false");
        }
    }

    function renderDropdown() {
        if (!dropdownScroll) return;
        dropdownScroll.innerHTML = "";

        tourScenes.forEach((scene, idx) => {
            const isCurrent = currentScene && scene.id === currentScene.id;
            const item = document.createElement("button");
            item.type = "button";
            item.className = "evp-tour-dropdown-item" + (isCurrent ? " is-selected" : "");
            item.setAttribute("role", "option");
            item.setAttribute("aria-selected", isCurrent ? "true" : "false");

            const iconClass = scene.isIndoor ? "fi fi-sr-tour-virtual" : "fi fi-sr-street-view";
            const typeLabel = scene.isIndoor ? "360° Virtual Tour" : "Outdoor • Google Street View";
            const thumbImg = `<img src="${scene.thumb}" class="evp-tour-dropdown-thumb" loading="lazy" onerror="this.onerror=null; this.src='thumbnail.png';"/>`;

            item.innerHTML = `
                <div class="evp-tour-dropdown-thumb-wrap">
                    ${thumbImg}
                    <span class="evp-tour-dropdown-type-badge" title="${typeLabel}"><i class="${iconClass}"></i></span>
                </div>
                <span class="evp-tour-dropdown-num">${String(idx + 1).padStart(2, '0')}</span>
                <div class="evp-tour-dropdown-col">
                    <span class="evp-tour-dropdown-title">${scene.label}</span>
                    <span class="evp-tour-dropdown-sub">${typeLabel}</span>
                </div>
                <span class="evp-tour-dropdown-item-check" aria-hidden="true"><i class="fi fi-sr-check"></i></span>
            `;

            item.addEventListener("click", function (e) {
                e.stopPropagation();
                closeDropdown();
                navigateToScene(scene);
            });

            dropdownScroll.appendChild(item);
        });
    }

    // ── Mount & Replace Stepper Controls ───────────────────────────────
    function initStepper() {
        const widget = document.getElementById("pcis-location-widget");
        const rightCluster = widget ? widget.querySelector(".pcis-location-right") : null;
        if (!widget || !rightCluster) {
            setTimeout(initStepper, 80);
            return;
        }

        // Avoid re-initialization if already mounted
        if (document.getElementById("evp-stepper-group")) {
            updateStepperUI();
            return;
        }

        // Build clean dynamic navigation group
        const totalCount = tourScenes.length || 24;
        rightCluster.innerHTML = `
            <div class="evp-stepper-group" id="evp-stepper-group" role="group" aria-label="Scene navigation controls">
                <button class="evp-stepper-btn evp-stepper-prev" id="evp-stepper-prev" type="button" aria-label="Previous scene">
                    <i class="fi fi-rr-angle-small-left"></i>
                </button>
                <div class="evp-stepper-pill" id="evp-stepper-pill" role="button" aria-expanded="false" aria-haspopup="listbox" aria-label="Quick-select scene">
                    <span class="evp-stepper-count" id="evp-scene-count">01 / ${String(totalCount).padStart(2, "0")}</span>
                    <span class="evp-stepper-chevron" aria-hidden="true"><i class="fi fi-rr-angle-small-down"></i></span>
                </div>
                <button class="evp-stepper-btn evp-stepper-next" id="evp-stepper-next" type="button" aria-label="Next scene">
                    <i class="fi fi-rr-angle-small-right"></i>
                </button>
                <span style="width: 1px; height: 18px; background: rgba(19, 19, 48, 0.14); margin: 0 4px;" aria-hidden="true"></span>
                <button class="evp-stepper-btn evp-quick-dir-btn" id="evp-quick-dir-btn" type="button" aria-label="Get directions to this location" title="Directions to active location">
                    <i class="fi fi-ss-marker"></i>
                </button>
                <button class="evp-stepper-btn evp-quick-specs-btn" id="evp-quick-specs-btn" type="button" aria-label="View technical specifications" title="Specifications for active location">
                    <i class="fi fi-rr-document-signed"></i>
                </button>
            </div>
        `;

        const prevBtn = document.getElementById("evp-stepper-prev");
        const nextBtn = document.getElementById("evp-stepper-next");
        const pillBtn = document.getElementById("evp-stepper-pill");
        const quickDirBtn = document.getElementById("evp-quick-dir-btn");
        const quickSpecsBtn = document.getElementById("evp-quick-specs-btn");

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

        if (quickDirBtn) {
            quickDirBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                closeDropdown();
                const locName = currentScene ? currentScene.label : "";
                if (typeof window.openDirectionsForLocation === "function") {
                    window.openDirectionsForLocation(locName);
                } else if (typeof window.toggleLocation === "function") {
                    window.toggleLocation();
                }
            });
        }

        if (quickSpecsBtn) {
            quickSpecsBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                closeDropdown();
                const locName = currentScene ? currentScene.label : "";
                if (typeof window.evpToggleSpecs === "function") {
                    window.evpToggleSpecs(locName);
                } else if (typeof window.evpOpenSpecs === "function") {
                    window.evpOpenSpecs(locName);
                }
            });
        }

        // Hide Panolist's old dropdown if it exists to prevent overlapping
        const oldDropdown = document.getElementById("pcis-scene-dropdown");
        if (oldDropdown) {
            oldDropdown.style.display = "none";
        }

        // Intercept clicks on "NOW EXPLORING" (#pcis-location-copy) to prevent Panolist drawer from opening
        const locationCopy = document.getElementById("pcis-location-copy");
        if (locationCopy && !locationCopy._hasTopStepperCapture) {
            locationCopy._hasTopStepperCapture = true;
            locationCopy.addEventListener("click", function (e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
                toggleDropdown();
            }, true);
        }

        if (widget && !widget._hasWidgetLocationCapture) {
            widget._hasWidgetLocationCapture = true;
            widget.addEventListener("click", function (e) {
                const targetCopy = e.target.closest("#pcis-location-copy");
                if (targetCopy) {
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    e.preventDefault();
                    toggleDropdown();
                }
            }, true);
        }

        // Prevent background timers from overwriting HUD title while GSV POV is active
        const nameEl = document.getElementById("spatial-location-name");
        if (nameEl && !nameEl._hasGsvGuard) {
            nameEl._hasGsvGuard = true;
            let isSyncing = false;
            const observer = new MutationObserver(() => {
                if (isSyncing) return;
                if (window.isGsvPovActive && window.isGsvPovActive()) {
                    const activePov = typeof window.getActiveGsvPovLocation === "function" ? window.getActiveGsvPovLocation() : null;
                    const match = activePov ? tourScenes.find(s => !s.isIndoor && (s.povId === activePov.id || (activePov.name && s.label.toLowerCase() === activePov.name.toLowerCase()))) : null;
                    const expected = match ? match.label : (activePov ? activePov.name : "");
                    if (expected && nameEl.textContent.trim() !== expected.trim()) {
                        isSyncing = true;
                        nameEl.textContent = expected;
                        isSyncing = false;
                    }
                }
            });
            observer.observe(nameEl, { childList: true, characterData: true, subtree: true });
        }

        updateStepperUI();
    }

    // ── Global Event Handlers ──────────────────────────────────────────
    document.addEventListener("click", function (e) {
        if (isDropdownOpen && dropdown && !dropdown.contains(e.target)) {
            const pillBtn = document.getElementById("evp-stepper-pill");
            if (!pillBtn || !pillBtn.contains(e.target)) {
                closeDropdown();
            }
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isDropdownOpen) {
            closeDropdown();
        }
    });

    window.addEventListener("resize", function () {
        if (isDropdownOpen && dropdown) {
            const widget = document.getElementById("pcis-location-widget");
            if (widget) {
                const rect = widget.getBoundingClientRect();
                const gap = window.innerWidth <= 768 ? 12 : 14;
                dropdown.style.top = (rect.bottom + gap) + "px";
                dropdown.style.left = "50%";
                const desiredWidth = Math.min(Math.max(rect.width, 420), window.innerWidth * 0.94);
                dropdown.style.width = desiredWidth + "px";
            }
        }
    });

    // Synchronize with Google Street View events
    document.addEventListener("gsvPovActivated", function (e) {
        const loc = e.detail && e.detail.location;
        if (loc && loc.id) {
            const match = tourScenes.find(s => !s.isIndoor && s.povId === loc.id);
            if (match) {
                updateStepperUI(match);
                return;
            }
        }
        updateStepperUI();
    });

    document.addEventListener("gsvPovDeactivated", function () {
        setTimeout(updateStepperUI, 120);
    });

    // Synchronize with 3DVista Tour media changes
    function attachVistaListeners() {
        const handleVistaChange = () => {
            if (window.isGsvPovActive && window.isGsvPovActive()) {
                return;
            }
            syncTourScenesFromPlayer();
            updateStepperUI();
        };
        if (window.tour && typeof window.tour.on === "function") {
            window.tour.on("mediaChange", handleVistaChange);
        } else if (window.tour && window.tour.player && typeof window.tour.player.on === "function") {
            window.tour.player.on("mediaChange", handleVistaChange);
        } else {
            setTimeout(attachVistaListeners, 400);
        }
    }
    attachVistaListeners();

    // Periodic safety sync (keeps stepper strictly accurate)
    setInterval(updateStepperUI, 2500);

    // Initial mount
    initStepper();

    // Expose public API
    window.stepTourScene = stepScene;
    window.navigateToTourScene = navigateToScene;
    window.getTourScenes = function () { return tourScenes; };
    window.syncTourScenes = syncTourScenesFromPlayer;
})();
