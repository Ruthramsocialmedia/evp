// ═══════════════════════════════════════════════════════════════════════
//  EVP TRADE & CONVENTION CENTRE — MULTILINGUAL LANGUAGE SELECTOR
//  Luxury Navy & Gold Modal with Headless Google Translate Core Engine
//  Instant live translation into major regional and national languages.
// ═══════════════════════════════════════════════════════════════════════

(function () {
    "use strict";

    if (document.getElementById("evp-lang-overlay")) return;

    // ── Supported Languages ──
    const LANGUAGES = [
        { code: "en", name: "English", native: "English", short: "En", region: "Default" },
        { code: "ta", name: "Tamil", native: "தமிழ்", short: "Ta", region: "Regional" },
        { code: "hi", name: "Hindi", native: "हिन्दी", short: "Hi", region: "National" },
        { code: "te", name: "Telugu", native: "తెలుగు", short: "Te", region: "AP & Tel." },
        { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", short: "Kn", region: "Karnataka" },
        { code: "ml", name: "Malayalam", native: "മലയാളം", short: "Ml", region: "Kerala" },
        { code: "gu", name: "Gujarati", native: "ગુજરાતી", short: "Gu", region: "Gujarat" },
        { code: "mr", name: "Marathi", native: "मराठी", short: "Mr", region: "Maharashtra" }
    ];

    // ── Read Current Language From Cookie ──
    function getCurrentLangFromCookie() {
        const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
        return match ? match[1] : "en";
    }
    let currentLang = getCurrentLangFromCookie();

    // ── Inject Component CSS ──
    const styleEl = document.createElement("style");
    styleEl.id = "evp-language-selector-styles";
    styleEl.textContent = `
        /* ═════════════════════════════════════════════════════════════
           EVP LANGUAGE SELECTOR — Frosted Glass & Luxury Theme
           ═════════════════════════════════════════════════════════════ */

        /* ── Overlay & Frosted Glass Backdrop (Matches Contact Us 100%) ── */
        .evp-lang-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(19, 19, 48, 0.42);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            backdrop-filter: blur(24px) saturate(180%);
            z-index: 100075;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            box-sizing: border-box;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1),
                        visibility 280ms ease;
        }
        .evp-lang-overlay.is-open {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        /* ── Modal Window ── */
        .evp-lang-modal {
            width: min(440px, 92vw);
            max-height: 88vh;
            background: #FFFFFF;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.9);
            box-shadow: 
                0 32px 80px -16px rgba(19, 19, 48, 0.35),
                0 0 0 1px rgba(19, 19, 48, 0.08);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transform: scale(0.95) translateY(16px);
            transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .evp-lang-overlay.is-open .evp-lang-modal {
            transform: scale(1) translateY(0);
        }

        /* Mobile Drag Handle */
        .evp-lang-drag-handle {
            display: none;
            width: 36px;
            height: 4px;
            background: #CBD5E1;
            border-radius: 2px;
            margin: 8px auto 0;
            flex-shrink: 0;
        }

        /* ── Header ── */
        .evp-lang-header {
            padding: 16px 20px 14px;
            background: #FFFFFF;
            border-bottom: 1px solid #EEF2F6;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-shrink: 0;
        }
        .evp-lang-header-left {
            display: flex;
            flex-direction: column;
            gap: 3px;
            min-width: 0;
        }
        .evp-lang-pill {
            background: #F1F5F9;
            color: #334155;
            border: 1px solid #E2E8F0;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            padding: 2px 7px;
            border-radius: 6px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            width: fit-content;
        }
        .evp-lang-pill i {
            color: #D97706;
            font-size: 11px;
        }
        .evp-lang-title {
            margin: 0;
            font-size: 17px;
            font-weight: 800;
            color: #131330;
            letter-spacing: -0.3px;
            line-height: 1.25;
        }
        .evp-lang-subtitle {
            margin: 0;
            font-size: 11px;
            color: #64748B;
            font-weight: 500;
        }

        /* ── Standard EVP Red Circular Close Button (360° Hover Spin) ── */
        .evp-lang-close-btn {
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
        .evp-lang-close-btn i {
            font-size: 18px;
            line-height: 1;
            display: inline-flex;
            margin: 0;
            padding: 0;
            pointer-events: none;
            color: #FFFFFF;
        }
        .evp-lang-close-btn:hover {
            background: #DC2626;
            color: #FFFFFF;
            transform: rotate(360deg);
        }
        .evp-lang-close-btn:active {
            transform: rotate(360deg) scale(0.94);
        }

        /* ── Scrollable Body Area ── */
        .evp-lang-body {
            padding: 16px 20px 20px;
            overflow-y: auto;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: #FAFBFD;
        }
        .evp-lang-body::-webkit-scrollbar {
            width: 5px;
        }
        .evp-lang-body::-webkit-scrollbar-thumb {
            background: rgba(19, 19, 48, 0.15);
            border-radius: 6px;
        }

        /* ── Language Cards Grid ── */
        .evp-lang-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            width: 100%;
        }
        .evp-lang-card {
            background: #FFFFFF;
            border: 1.5px solid #E2E8F0;
            border-radius: 12px;
            padding: 10px 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: all 160ms ease;
            user-select: none;
            position: relative;
            box-shadow: 0 1px 2px rgba(19, 19, 48, 0.02);
            font-family: inherit;
        }
        .evp-lang-card:hover {
            border-color: #CBD5E1;
            background: #FDFDFE;
            transform: translateY(-1px);
        }
        .evp-lang-card.is-active {
            border-color: #059669;
            background: rgba(5, 150, 105, 0.04);
            box-shadow: 0 2px 8px rgba(5, 150, 105, 0.12);
        }

        /* Avatar / Monogram */
        .evp-lang-avatar {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: #F1F5F9;
            color: #131330;
            font-size: 12px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 160ms ease;
            border: 1px solid #E2E8F0;
        }
        .evp-lang-card.is-active .evp-lang-avatar {
            background: #131330;
            color: #FFB703;
            border-color: #131330;
        }

        /* Language Text */
        .evp-lang-info {
            display: flex;
            flex-direction: column;
            gap: 1px;
            min-width: 0;
            flex: 1;
        }
        .evp-lang-name {
            font-size: 12px;
            font-weight: 800;
            color: #131330;
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .evp-lang-native {
            font-size: 11px;
            color: #64748B;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Active Badge */
        .evp-lang-check {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #059669;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            opacity: 0;
            transform: scale(0.6);
            transition: all 160ms ease;
            flex-shrink: 0;
        }
        .evp-lang-card.is-active .evp-lang-check {
            opacity: 1;
            transform: scale(1);
        }

        /* ── Footer ── */
        .evp-lang-footer {
            padding: 10px 20px 12px;
            background: #FFFFFF;
            border-top: 1px solid #EEF2F6;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            flex-shrink: 0;
        }
        .evp-lang-footer-status {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .evp-lang-status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #059669;
            box-shadow: 0 0 6px rgba(5, 150, 105, 0.4);
            animation: evpLangPulse 2.5s ease-in-out infinite;
        }
        @keyframes evpLangPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
        }
        .evp-lang-status-text {
            font-size: 11px;
            color: #64748B;
            font-weight: 600;
        }

        /* ── Fullscreen Fade for English Clean Restore ── */
        .evp-lang-page-fade {
            position: fixed;
            inset: 0;
            background: #FFFFFF;
            z-index: 999999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 300ms ease;
        }
        .evp-lang-page-fade.is-active {
            opacity: 1;
            pointer-events: auto;
        }

        /* ── Mobile Responsive (Bottom Sheet Drawer) ── */
        @media (max-width: 768px) {
            .evp-lang-overlay {
                padding: 0 !important;
                align-items: flex-end !important;
            }
            .evp-lang-modal {
                width: 100vw !important;
                max-width: 100vw !important;
                height: auto !important;
                max-height: 85vh !important;
                border-radius: 20px 20px 0 0 !important;
                border-bottom: none !important;
                border-left: none !important;
                border-right: none !important;
                margin: 0 !important;
                transform: translateY(100%) !important;
                box-shadow: 0 -8px 36px rgba(19, 19, 48, 0.35) !important;
            }
            .evp-lang-overlay.is-open .evp-lang-modal {
                transform: translateY(0) !important;
            }
            .evp-lang-drag-handle {
                display: block !important;
            }
            .evp-lang-header {
                padding: 10px 16px !important;
            }
            .evp-lang-title {
                font-size: 15px !important;
            }
            .evp-lang-body {
                padding: 12px 16px 16px !important;
            }
            .evp-lang-grid {
                gap: 6px !important;
            }
            .evp-lang-card {
                padding: 8px 10px !important;
                gap: 8px !important;
                border-radius: 10px !important;
            }
            .evp-lang-avatar {
                width: 28px !important;
                height: 28px !important;
                font-size: 11px !important;
            }
            .evp-lang-name {
                font-size: 11.5px !important;
            }
            .evp-lang-native {
                font-size: 10px !important;
            }
            .evp-lang-footer {
                padding: 8px 16px calc(10px + env(safe-area-inset-bottom, 0px)) !important;
            }
        }
    `;
    document.head.appendChild(styleEl);

    // ── Build DOM ──
    const overlay = document.createElement("div");
    overlay.className = "evp-lang-overlay notranslate";
    overlay.id = "evp-lang-overlay";
    overlay.setAttribute("translate", "no");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Language Selection");

    // Page fade overlay for smooth English restoration
    const pageFade = document.createElement("div");
    pageFade.className = "evp-lang-page-fade";
    document.body.appendChild(pageFade);

    const activeLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

    overlay.innerHTML = `
        <div class="evp-lang-modal">
            <!-- Mobile Drag Indicator -->
            <div class="evp-lang-drag-handle"></div>

            <!-- Header -->
            <div class="evp-lang-header">
                <div class="evp-lang-header-left">
                    <span class="evp-lang-pill"><i class="fi fi-sr-globe"></i> Language Selection</span>
                    <h2 class="evp-lang-title">Choose Tour Language</h2>
                    <p class="evp-lang-subtitle">Real-time live translation for the 360 virtual tour</p>
                </div>
                <button type="button" class="evp-lang-close-btn" id="evp-lang-close-btn" aria-label="Close language selector">
                    <i class="fi fi-rr-cross-small" aria-hidden="true"></i>
                </button>
            </div>

            <!-- Body: Grid -->
            <div class="evp-lang-body">
                <div class="evp-lang-grid" id="evp-lang-grid">
                    <!-- Cards populated via JS -->
                </div>
                <div id="google_translate_element" style="display:none;"></div>
            </div>

            <!-- Footer -->
            <div class="evp-lang-footer">
                <div class="evp-lang-footer-status">
                    <div class="evp-lang-status-dot"></div>
                    <span class="evp-lang-status-text" id="evp-lang-status-text">
                        ${currentLang === "en" ? "Default Language (English)" : "Active: " + activeLangObj.name + " (" + activeLangObj.native + ")"}
                    </span>
                </div>
                <span style="font-size: 10px; color: #94A3B8; font-weight: 700;">EVP Global Access</span>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // ── Generate Language Cards ──
    const grid = document.getElementById("evp-lang-grid");
    const cardMap = {};

    LANGUAGES.forEach(lang => {
        const card = document.createElement("div");
        card.className = "evp-lang-card notranslate" + (lang.code === currentLang ? " is-active" : "");
        card.setAttribute("translate", "no");
        card.setAttribute("data-code", lang.code);

        card.innerHTML = `
            <div class="evp-lang-avatar">${lang.short}</div>
            <div class="evp-lang-info">
                <span class="evp-lang-name notranslate">${lang.name}</span>
                <span class="evp-lang-native notranslate">${lang.native}</span>
            </div>
            <div class="evp-lang-check"><i class="fi fi-rr-check"></i></div>
        `;

        card.addEventListener("click", () => selectLanguage(lang.code));
        grid.appendChild(card);
        cardMap[lang.code] = card;
    });

    // ── Update Active Card & Status ──
    function setActiveCard(code) {
        Object.values(cardMap).forEach(c => c.classList.remove("is-active"));
        if (cardMap[code]) cardMap[code].classList.add("is-active");

        const statusEl = document.getElementById("evp-lang-status-text");
        if (statusEl) {
            const found = LANGUAGES.find(l => l.code === code);
            statusEl.textContent = code === "en"
                ? "Default Language (English)"
                : "Active: " + (found ? found.name + " (" + found.native + ")" : code);
        }
    }

    // ── Clear Google Translate Cookies (for English Revert) ──
    function clearGoogTransCookies() {
        const cookies = document.cookie.split("; ");
        for (let c of cookies) {
            const [name] = c.split("=");
            if (name.includes("googtrans")) {
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname;
            }
        }
    }

    // ── Language Selection Logic ──
    function selectLanguage(code) {
        if (code === currentLang) {
            closeLanguage();
            return;
        }

        // If English: Clear cookies, smooth fade, and clean reload
        if (code === "en") {
            clearGoogTransCookies();
            setActiveCard("en");
            closeLanguage();

            pageFade.classList.add("is-active");
            setTimeout(() => {
                window.location.reload();
            }, 300);
            return;
        }

        // Other Languages: Trigger headless Google Translate combo
        const googleSelect = document.querySelector(".goog-te-combo");
        if (googleSelect) {
            googleSelect.value = code;
            googleSelect.dispatchEvent(new Event("change"));
        }

        currentLang = code;
        setActiveCard(code);
        closeLanguage();
    }

    // ── Open / Close Controller ──
    function openLanguage() {
        overlay.classList.add("is-open");
        document.body.classList.add("is-lang-open");
    }

    function closeLanguage() {
        overlay.classList.remove("is-open");
        document.body.classList.remove("is-lang-open");
    }

    // Close button click
    const closeBtn = document.getElementById("evp-lang-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", closeLanguage);

    // Backdrop click
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeLanguage();
    });

    // Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("is-open")) {
            closeLanguage();
        }
    });

    // ── Expose Globally ──
    window.openLanguage = openLanguage;
    window.closeLanguage = closeLanguage;
    window.evpLanguage = {
        open: openLanguage,
        close: closeLanguage,
        select: selectLanguage,
        getCurrent: () => currentLang
    };

    // ── Initialize Headless Google Translate Element ──
    window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement({
            pageLanguage: "en",
            includedLanguages: "en,ta,hi,te,kn,ml,gu,mr",
            autoDisplay: false
        }, "google_translate_element");
    };

    const gtScript = document.createElement("script");
    gtScript.type = "text/javascript";
    gtScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(gtScript);

})();
