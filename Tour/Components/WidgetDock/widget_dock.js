// ═══════════════════════════════════════════════════════════
//  EVP TRADE & CONVENTION CENTRE — Quick Action Cluster
//  Top-Right circular frosted glass controls:
//  1. Eye (Hide/Show UI for clean photo view)
//  2. Audio (Mute/Unmute background music)
//  3. Fullscreen (Enter/Exit full viewport)
// ═══════════════════════════════════════════════════════════
(function () {
    "use strict";

    if (document.getElementById("pcis-top-actions")) return;

    // ─── Inject Styles ──────────────────────────────────────────
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "Components/WidgetDock/widget_dock.css";
    document.head.appendChild(link);

    // ─── Build Container ────────────────────────────────────────
    const wrap = document.createElement("div");
    wrap.id = "pcis-top-actions";
    wrap.className = "pcis-top-actions";
    wrap.setAttribute("aria-label", "Tour Controls");

    wrap.innerHTML = `
        <!-- Eye: Clean Photo Mode -->
        <button class="pcis-action-btn btn-visibility" id="btn-clean-mode" type="button" aria-label="Hide tour controls" data-tooltip="Clean view">
            <i class="fi fi-sr-eye" aria-hidden="true"></i>
        </button>

        <!-- Audio: Mute / Unmute -->
        <button class="pcis-action-btn btn-audio" id="btn-audio-toggle" type="button" aria-label="Toggle background music" data-tooltip="Play audio">
            <i class="fi fi-sr-music-alt-slash" aria-hidden="true"></i>
        </button>

        <!-- Fullscreen: Expand / Compress -->
        <button class="pcis-action-btn btn-fullscreen" id="btn-fullscreen-toggle" type="button" aria-label="Enter fullscreen" data-tooltip="Fullscreen">
            <i class="fi fi-rr-expand" aria-hidden="true"></i>
        </button>
    `;

    document.body.appendChild(wrap);

    const eyeBtn = document.getElementById("btn-clean-mode");
    const audioBtn = document.getElementById("btn-audio-toggle");
    const fullBtn = document.getElementById("btn-fullscreen-toggle");

    // ─── 1. Eye: Clean Photo Mode ───────────────────────────────
    let isUiHidden = false;
    eyeBtn.addEventListener("click", function () {
        isUiHidden = !isUiHidden;
        document.body.classList.toggle("is-ui-hidden", isUiHidden);
        eyeBtn.classList.toggle("is-active", isUiHidden);
        
        const icon = eyeBtn.querySelector("i");
        if (icon) {
            icon.className = isUiHidden ? "fi fi-sr-eye-crossed" : "fi fi-sr-eye";
        }
        eyeBtn.setAttribute("aria-label", isUiHidden ? "Show tour controls" : "Hide tour controls");
        eyeBtn.setAttribute("data-tooltip", isUiHidden ? "Show controls" : "Clean view");

        // When entering clean mode, dismiss any open modals, drawers, and popovers immediately
        if (isUiHidden) {
            if (typeof window.closeGsvPopup === "function") window.closeGsvPopup();
            if (typeof window.close3dTour === "function") window.close3dTour();
            if (typeof window.closePanoDrawer === "function") window.closePanoDrawer();
            if (typeof window.closeContactModal === "function") window.closeContactModal();
            if (typeof window.closeDisclosureModal === "function") window.closeDisclosureModal();
            if (window.evpStageSimulator && typeof window.evpStageSimulator.close === "function") window.evpStageSimulator.close();
            document.querySelectorAll(".pcis-popover.is-open, .pcis-more-popover.is-open").forEach(function (pop) {
                pop.classList.remove("is-open");
            });
        }

        document.dispatchEvent(new CustomEvent("cleanModeChanged", { detail: { isHidden: isUiHidden } }));
    });

    // ─── 2. Audio: Mute / Unmute ────────────────────────────────
    function updateAudioUI(isPlaying) {
        if (!audioBtn) return;
        const icon = audioBtn.querySelector("i");
        if (isPlaying) {
            if (icon) icon.className = "fi fi-sr-music-note";
            audioBtn.classList.add("is-playing");
            audioBtn.setAttribute("aria-label", "Mute background music");
            audioBtn.setAttribute("data-tooltip", "Mute audio");
        } else {
            if (icon) icon.className = "fi fi-sr-music-alt-slash";
            audioBtn.classList.remove("is-playing");
            audioBtn.setAttribute("aria-label", "Play background music");
            audioBtn.setAttribute("data-tooltip", "Play audio");
        }
    }

    audioBtn.addEventListener("click", function () {
        if (!window.bgAudio) return;
        if (window.bgAudio.paused) {
            window.bgAudio.play().then(function () {
                updateAudioUI(true);
            }).catch(function (e) {
                console.error("[Audio] Playback failed:", e);
            });
        } else {
            window.bgAudio.pause();
            updateAudioUI(false);
        }
    });

    // Listen for state changes from music.js or external
    document.addEventListener("musicStateChanged", function (e) {
        updateAudioUI(e.detail && e.detail.playing);
    });

    // Sync on initial load
    setTimeout(function () {
        if (window.bgAudio && !window.bgAudio.paused) {
            updateAudioUI(true);
        } else {
            updateAudioUI(false);
        }
    }, 200);

    // ─── 3. Fullscreen: Toggle ──────────────────────────────────
    function updateFullscreenUI() {
        const isFull = Boolean(document.fullscreenElement);
        fullBtn.classList.toggle("is-fullscreen", isFull);
        const icon = fullBtn.querySelector("i");
        if (icon) {
            icon.className = isFull ? "fi fi-rr-compress" : "fi fi-rr-expand";
        }
        fullBtn.setAttribute("aria-label", isFull ? "Exit fullscreen" : "Enter fullscreen");
        fullBtn.setAttribute("data-tooltip", isFull ? "Exit fullscreen" : "Fullscreen");
    }

    fullBtn.addEventListener("click", function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(function (err) {
                console.warn("[Fullscreen] Failed:", err);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

    document.addEventListener("fullscreenchange", updateFullscreenUI);
})();
