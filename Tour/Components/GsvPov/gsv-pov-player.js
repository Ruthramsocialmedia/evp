// ═══════════════════════════════════════════════════════════════════════
//  EVP TRADE & CONVENTION CENTRE — GSV-PANO-POV VIEWPORT PLAYER ENGINE
//  Layered Architecture:
//  [Layer 3: Components / HUD (z-index: 100060)]
//         │
//  [Layer 2: gsv-pano-pov Player Viewport (z-index: 100)]
//         │
//  [Layer 1: 3DVista Indoor Panorama Player (z-index: 1)]
//
//  Preserves legacy GSV popup modal (gsv-popup.js) 100% intact.
// ═══════════════════════════════════════════════════════════════════════

(function () {
    "use strict";

    if (document.getElementById("pcis-gsv-pov-root")) return;

    // ── Outdoor Campus POV Dataset ─────────────────────────────────────
    const GSV_POV_LOCATIONS = [
        {
            id: "arrival-gate",
            name: "Grand Arrival Entrance Gate",
            sub: "Chennai – Bengaluru NH-4 Visual Frontage",
            category: "Campus Grounds",
            icon: "fi fi-rr-road",
            url: "https://www.google.com/maps/embed?pb=!4v1791625290672!6m8!1m7!1sCAoSHENJQUJJaERlU0xER2RoQkxkUjBJWmxRdjI5bFI.!2m2!1d37.27448127353812!2d-76.70193407387384!3f257.1172352664995!4f-1.3198630247315037!5f0.7820865974627469"
        },
        {
            id: "driveway-network",
            name: "Internal Driveway & Circulation Network",
            sub: "8m Wide Concreted Roadway & Pedestrian Walkways",
            category: "Campus Grounds",
            icon: "fi fi-rr-shield-check",
            url: "https://www.google.com/maps/embed?pb=!4v1791625392568!6m8!1m7!1skfCrP9JD0hHMonYjaDp8eg!2m2!1d37.2736035229786!2d-76.70215985156645!3f13.082455949271491!4f-6.32999449836224!5f0.7820865974627469"
        },
        {
            id: "canvas1",
            name: "THE CANVAS 1 — Open Concrete Arena",
            sub: "93,980 sq. ft. Rear Open Concrete Venue",
            category: "Campus Grounds",
            icon: "fi fi-rr-flag",
            url: "https://www.google.com/maps/embed?pb=!4v1791625526862!6m8!1m7!1sCAoSHENJQUJJaENpemZNTGt6WDZzMjItZVlRZWpJdms.!2m2!1d37.27426722555664!2d-76.70317271897548!3f178.51457424149163!4f-5.492995904685571!5f0.7820865974627469"
        },
        {
            id: "canvas2",
            name: "THE CANVAS 2 — Mega Concert Ground",
            sub: "1,89,564 sq. ft. Mega Open-Air Arena",
            category: "Campus Grounds",
            icon: "fi fi-rr-flag",
            url: "https://www.google.com/maps/embed?pb=!4v1791625526862!6m8!1m7!1sCAoSHENJQUJJaENpemZNTGt6WDZzMjItZVlRZWpJdms.!2m2!1d37.27426722555664!2d-76.70317271897548!3f178.51457424149163!4f-5.492995904685571!5f0.7820865974627469"
        },
        {
            id: "parking1",
            name: "Parking Zone 1 (Trade Halls)",
            sub: "Direct Exhibition Hall Paved Parking",
            category: "Campus Grounds",
            icon: "fi fi-rr-car",
            url: "https://www.google.com/maps/embed?pb=!4v1791625613742!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ194UGk1b3dF!2m2!1d37.27282497461028!2d-76.70679723424071!3f124.86643972651301!4f-4.195217436696268!5f0.7820865974627469"
        },
        {
            id: "parking2",
            name: "Parking Zone 2 (Entrance Plaza)",
            sub: "Entrance Plaza Parking (8,000+ Total Vehicles)",
            category: "Campus Grounds",
            icon: "fi fi-rr-car-alt",
            url: "https://www.google.com/maps/embed?pb=!4v1791625613742!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ194UGk1b3dF!2m2!1d37.27282497461028!2d-76.70679723424071!3f124.86643972651301!4f-4.195217436696268!5f0.7820865974627469"
        },
        {
            id: "perimeter",
            name: "Venue Perimeter & Landscaping",
            sub: "Continuous Boundary Buffer & Landscaping",
            category: "Campus Grounds",
            icon: "fi fi-rr-vector-alt",
            url: "https://www.google.com/maps/embed?pb=!4v1791625392568!6m8!1m7!1skfCrP9JD0hHMonYjaDp8eg!2m2!1d37.2736035229786!2d-76.70215985156645!3f13.082455949271491!4f-6.32999449836224!5f0.7820865974627469"
        }
    ];

    // ── Inject Player Viewport Styles ─────────────────────────────────
    const style = document.createElement("style");
    style.id = "pcis-gsv-pov-styles";
    style.textContent = `
        /* ── Full-Bleed Middle Layer (z-index: 100) ── */
        .pcis-gsv-pov-viewport {
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            z-index: 100;
            background: #0B0B1E;
            opacity: 0;
            pointer-events: none;
            transition: opacity 380ms cubic-bezier(0.16, 1, 0.3, 1);
            overflow: hidden;
        }

        .pcis-gsv-pov-viewport.is-active {
            opacity: 1;
            pointer-events: auto;
        }

        .pcis-gsv-pov-frame {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
            background: #0B0B1E;
        }

    `;
    document.head.appendChild(style);

    // ── Build DOM ─────────────────────────────────────────────────────
    const root = document.createElement("div");
    root.id = "pcis-gsv-pov-root";
    root.innerHTML = `
        <div class="pcis-gsv-pov-viewport" id="pcis-gsv-pov-viewport" aria-hidden="true">
            <iframe class="pcis-gsv-pov-frame" id="pcis-gsv-pov-iframe" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
    `;
    document.body.appendChild(root);

    const viewport = document.getElementById("pcis-gsv-pov-viewport");
    const iframe = document.getElementById("pcis-gsv-pov-iframe");

    let isPovActive = false;
    let currentPovLocation = null;
    let lastIndoorSceneName = "Entrance Plaza & Foyer";
    let ignoreMediaChangeUntil = 0;

    // ── Public Viewport Engine Controls ───────────────────────────────
    function playGsvPovLocation(locationIdOrObject) {
        let loc = null;
        if (typeof locationIdOrObject === "string") {
            loc = GSV_POV_LOCATIONS.find(l => l.id === locationIdOrObject || l.name.toLowerCase().includes(locationIdOrObject.toLowerCase()));
        } else if (typeof locationIdOrObject === "object" && locationIdOrObject) {
            loc = locationIdOrObject;
        }

        if (!loc) {
            loc = GSV_POV_LOCATIONS[0];
        }

        // Save active indoor scene name before switching
        const locEl = document.getElementById("spatial-location-name");
        if (locEl && !isPovActive && locEl.textContent) {
            lastIndoorSceneName = locEl.textContent.trim();
        }

        currentPovLocation = loc;
        isPovActive = true;
        ignoreMediaChangeUntil = Date.now() + 600;

        // Set iframe source
        if (iframe.src !== loc.url) {
            iframe.src = loc.url;
        }

        // Activate viewport smoothly
        viewport.classList.add("is-active");
        viewport.setAttribute("aria-hidden", "false");

        // Update Top HUD "Now Exploring" widget
        if (locEl) {
            locEl.textContent = loc.name;
        }
        // Top HUD counter and name are synchronized via Panolist with unified 24-step master sequence

        // Hide hall setup bar if currently visible
        const setupBar = document.getElementById("pcis-dock-setup-bar");
        if (setupBar) {
            setupBar.style.display = "none";
        }

        // Completely stop and hide background 3DVista panorama layer (#viewer) to prevent conflicts & save GPU
        const viewerEl = document.getElementById("viewer");
        if (viewerEl) {
            viewerEl.style.visibility = "hidden";
            viewerEl.style.pointerEvents = "none";
        }

        // Freeze background 3DVista panorama camera rotation, loop & audio
        if (window.tour) {
            try {
                if (typeof window.tour.pauseAutorotation === "function") window.tour.pauseAutorotation();
                if (typeof window.tour.setAutorotation === "function") window.tour.setAutorotation(false);
                if (typeof window.tour.pause === "function") window.tour.pause();
                const rootPlayer = typeof window.tour._getRootPlayer === "function" ? window.tour._getRootPlayer() : null;
                if (rootPlayer) {
                    if (typeof rootPlayer.pauseCamera === "function") rootPlayer.pauseCamera();
                    if (typeof rootPlayer.pause === "function") rootPlayer.pause();
                    const mainViewer = typeof rootPlayer.getMainViewer === "function" ? rootPlayer.getMainViewer() : null;
                    if (mainViewer && typeof mainViewer.pauseCamera === "function") mainViewer.pauseCamera();
                }
            } catch (e) {}
        }

        // Notify other components
        document.dispatchEvent(new CustomEvent("gsvPovActivated", { detail: { location: loc } }));
    }

    function exitGsvPov(targetSceneName) {
        if (!isPovActive) return;

        isPovActive = false;
        viewport.classList.remove("is-active");
        viewport.setAttribute("aria-hidden", "true");

        // Restore hall setup bar inline style (allowing CSS .is-visible to control it)
        const setupBar = document.getElementById("pcis-dock-setup-bar");
        if (setupBar) {
            setupBar.style.display = "";
        }

        // Restore background 3DVista panorama layer (#viewer)
        const viewerEl = document.getElementById("viewer");
        if (viewerEl) {
            viewerEl.style.visibility = "";
            viewerEl.style.pointerEvents = "";
        }

        // Resume 3DVista background panorama camera rotation & playback
        if (window.tour) {
            try {
                if (typeof window.tour.resumeAutorotation === "function") window.tour.resumeAutorotation();
                if (typeof window.tour.setAutorotation === "function") window.tour.setAutorotation(true);
                if (typeof window.tour.resume === "function") window.tour.resume();
                const rootPlayer = typeof window.tour._getRootPlayer === "function" ? window.tour._getRootPlayer() : null;
                if (rootPlayer) {
                    if (typeof rootPlayer.resumeCamera === "function") rootPlayer.resumeCamera();
                    if (typeof rootPlayer.resume === "function") rootPlayer.resume();
                    const mainViewer = typeof rootPlayer.getMainViewer === "function" ? rootPlayer.getMainViewer() : null;
                    if (mainViewer && typeof mainViewer.resumeCamera === "function") mainViewer.resumeCamera();
                }
            } catch (e) {}
        }

        // Reset iframe after fade out to release GPU memory
        setTimeout(() => {
            if (!isPovActive) {
                iframe.src = "about:blank";
            }
        }, 400);

        // If a specific target scene was explicitly supplied, navigate to it
        if (targetSceneName && window.tour && typeof window.tour.setMediaByName === "function") {
            window.tour.setMediaByName(targetSceneName);
        }

        document.dispatchEvent(new CustomEvent("gsvPovDeactivated"));
    }

    // ── Universal Auto-Close on Any 3DVista Panorama Change ─────────
    function handleMediaChange() {
        if (isPovActive) {
            // Ignore lingering mediaChange events right after POV activation
            if (Date.now() < ignoreMediaChangeUntil) {
                return;
            }
            exitGsvPov();
        }
    }

    function attachTourListener() {
        if (window.tour && typeof window.tour.on === "function") {
            window.tour.on("mediaChange", handleMediaChange);
        } else if (window.tour && window.tour.player && typeof window.tour.player.on === "function") {
            window.tour.player.on("mediaChange", handleMediaChange);
        } else {
            setTimeout(attachTourListener, 400);
        }
    }
    attachTourListener();

    // Escape key exits POV player
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isPovActive) {
            exitGsvPov();
        }
    });

    // Expose globally
    window.GSV_POV_LOCATIONS = GSV_POV_LOCATIONS;
    window.playGsvPovLocation = playGsvPovLocation;
    window.exitGsvPov = exitGsvPov;
    window.isGsvPovActive = function () { return isPovActive; };
    window.getActiveGsvPovLocation = function () { return currentPovLocation; };

})();
