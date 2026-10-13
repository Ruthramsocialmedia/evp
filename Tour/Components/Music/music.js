(function () {
    // ─── Load CSS ─────────────────────────────────────────────
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'Components/Music/music.css?v=' + Date.now();
    document.head.appendChild(link);

    // ─── Audio Setup ──────────────────────────────────────────
    const audio = new Audio('Components/Music/chillout-7-1350.mp3');
    audio.loop = true;
    window.bgAudio = audio; // Expose globally for WidgetDock toggle

    // ─── Query Param Handoff (from 3D Lanyard VIP Pass) ───────
    const urlParams = new URLSearchParams(window.location.search);
    const audioParam = urlParams.get('audio');

    if (audioParam === '1') {
        audio.play().catch(function (err) {
            console.warn("Audio autoplay blocked by browser:", err);
        });
        setTimeout(function () {
            document.dispatchEvent(new CustomEvent('musicStateChanged', { detail: { playing: true } }));
            document.dispatchEvent(new CustomEvent('musicConsentResolved'));
        }, 80);
        return;
    } else if (audioParam === '0') {
        setTimeout(function () {
            document.dispatchEvent(new CustomEvent('musicStateChanged', { detail: { playing: false } }));
            document.dispatchEvent(new CustomEvent('musicConsentResolved'));
        }, 80);
        return;
    }

    // ─── Build Consent Popup ──────────────────────────────────
    const overlay = document.createElement('div');
    overlay.className = 'music-consent-overlay';
    overlay.id = 'music-consent-overlay';

    const modal = document.createElement('div');
    modal.className = 'music-consent-modal';

    modal.innerHTML = `
        <button class="music-consent-close" id="music-consent-close" aria-label="Close and continue in silence" type="button">
            <i class="fi fi-rr-cross-small" aria-hidden="true"></i>
        </button>
        <div class="music-consent-crest-box">
            <img src="Components/Logo/Assets/Luxury EVP Trade and Convention Logo.png" alt="EVP Trade and Convention Centre" class="music-consent-crest-img"/>
        </div>
        <div class="music-consent-tag">&bull; IMMERSIVE VENUE 360&deg; &bull;</div>
        <h3 class="music-consent-title">Welcome to Venue 360&deg;</h3>
        <p class="music-consent-text">Explore South India's premier exhibition and convention centre in immersive virtual reality with ambient music.</p>
        <div class="music-consent-actions">
            <button class="music-consent-btn btn-no" id="music-consent-no" type="button">
                <i class="fi fi-sr-music-alt-slash" aria-hidden="true"></i> Explore in Silence
            </button>
            <button class="music-consent-btn btn-yes" id="music-consent-yes" type="button">
                <i class="fi fi-sr-music-note" aria-hidden="true"></i> Start with Music
            </button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // ─── Event Listeners ──────────────────────────────────────
    const closeCornerBtn = document.getElementById('music-consent-close');
    if (closeCornerBtn) {
        closeCornerBtn.addEventListener('click', () => {
            closeCornerBtn.classList.add('is-closing');
            closeConsentModal();
            document.dispatchEvent(new CustomEvent('musicStateChanged', { detail: { playing: false } }));
        });
    }

    document.getElementById('music-consent-yes').addEventListener('click', () => {
        audio.play().catch(console.error);
        closeConsentModal();
        // Dispatch event that audio is playing (WidgetDock can use this to set initial state)
        document.dispatchEvent(new CustomEvent('musicStateChanged', { detail: { playing: true } }));
    });

    document.getElementById('music-consent-no').addEventListener('click', () => {
        closeConsentModal();
        document.dispatchEvent(new CustomEvent('musicStateChanged', { detail: { playing: false } }));
    });

    function closeConsentModal() {
        overlay.classList.add('closing');
        setTimeout(() => {
            overlay.remove();
            // Dispatch event for WidgetDock auto-open logic
            document.dispatchEvent(new CustomEvent('musicConsentResolved'));
        }, 300);
    }

})();
