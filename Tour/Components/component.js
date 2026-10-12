// Component Loader & Utilities
// Ensures all dynamic components initialize gracefully
(function () {
    console.log("Components loading...");

    // Shared Event Bus if needed, or just a namespace
    window.App = window.App || {};
    window.App.Components = window.App.Components || {};

    // Helper to create branded modals if needed universally
    window.App.createModal = function (id, content) {
        // Future shared logic
    };

    // ─── Inject Global Fonts ─────────────────────────────────────
    // 1. Plus Jakarta Sans (Main Titles & Subtitles)
    const pjsFont = document.createElement('link');
    pjsFont.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    pjsFont.rel = "stylesheet";
    document.head.appendChild(pjsFont);

    // 2. Satoshi (Body, Paragraphs, Tooltips, General UI)
    const satoshiFont = document.createElement('link');
    satoshiFont.href = "https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap";
    satoshiFont.rel = "stylesheet";
    document.head.appendChild(satoshiFont);

    // ─── Flaticon UIcons (CDN Icons) ─────────────────────────────
    if (!document.querySelector('link[href*="flaticon-uicons"]')) {
        const fiAll = document.createElement('link');
        fiAll.rel = 'stylesheet';
        fiAll.href = 'https://cdn.jsdelivr.net/npm/@flaticon/flaticon-uicons@3.3.1/css/all/all.min.css';
        fiAll.crossOrigin = 'anonymous';
        fiAll.referrerPolicy = 'no-referrer';
        document.head.appendChild(fiAll);

        const fiBrands = document.createElement('link');
        fiBrands.rel = 'stylesheet';
        fiBrands.href = 'https://cdn.jsdelivr.net/npm/@flaticon/flaticon-uicons@3.3.1/css/brands/all.min.css';
        fiBrands.crossOrigin = 'anonymous';
        fiBrands.referrerPolicy = 'no-referrer';
        document.head.appendChild(fiBrands);
    }

    // ─── FontAwesome 6 (CDN Fallback) ─────────────────────────────
    if (!document.querySelector('link[href*="font-awesome"], link[href*="fontawesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
        fa.crossOrigin = 'anonymous';
        fa.referrerPolicy = 'no-referrer';
        document.head.appendChild(fa);
    }

    const globalStyle = document.createElement('style');
    globalStyle.textContent = `
        /* Global Base: Satoshi for General UI, Paragraphs, Tooltips */
        body, button, input, select, textarea, p, span, label, div { 
            font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif;
            font-style: normal !important;
        }

        /* Titles & Subtitles: Plus Jakarta Sans */
        h1, h2, h3, h4, h5, h6,
        .main-title, .title, .subtitle,
        .menu-head-title, .menu-head-sub,
        .pano-title, .pano-subtitle,
        .search-title, .search-subtitle,
        .loc-title, .loc-subtitle,
        .contact-title,
        .venue-name-main, .venue-name-sub,
        .bento-wa-title, .bento-label,
        .group-header,
        .music-consent-title { 
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-style: normal !important;
        }

        /* Tooltips & Badges: Satoshi */
        .tooltip, .footer-text, .keyboard-hint, .bento-value, .menu-item-label, .music-consent-text {
            font-family: 'Satoshi', sans-serif !important;
            font-style: normal !important;
        }

        /* Universal Ban on Italic Styling */
        *, *::before, *::after {
            font-style: normal !important;
        }

        /* Explicitly Protect Flaticon & FontAwesome Icon Fonts */
        .fi, [class^="fi-"], [class*=" fi-"] {
            font-style: normal !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        .fas, .fa-solid, .far, .fa-regular, .fa { 
            font-family: "Font Awesome 6 Free" !important; 
            font-style: normal !important; 
        }
        .fab, .fa-brands { 
            font-family: "Font Awesome 6 Brands" !important; 
            font-style: normal !important; 
        }

        .pcis-dock-wrap, .pcis-top-actions, .pcis-brand-card, .pcis-location-widget {
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }

        /* ─── Staggered Spatial Cascade Entrance Animations ─── */
        @keyframes pcisSlideInTop {
            0% {
                opacity: 0;
                transform: translateY(-38px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pcisSlideInTopCenter {
            0% {
                opacity: 0;
                transform: translateX(-50%) translateY(-38px);
            }
            100% {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }

        @keyframes pcisSlideInBottom {
            0% {
                opacity: 0;
                transform: translateX(-50%) translateY(48px);
            }
            100% {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }

        @keyframes pcisSlideInBottomCorner {
            0% {
                opacity: 0;
                transform: translateY(48px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* 1. Top-Left: EVP Branding badge drops in first (0ms) */
        .pcis-brand-card {
            animation: pcisSlideInTop 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0ms backwards;
        }

        /* 2. Top-Center: "Now Exploring" scene widget drops in (+80ms) */
        .pcis-location-widget {
            animation: pcisSlideInTopCenter 0.65s cubic-bezier(0.16, 1, 0.3, 1) 80ms backwards;
        }

        /* 3. Top-Right: Quick Action cluster drops in (+160ms) */
        .pcis-top-actions {
            animation: pcisSlideInTop 0.65s cubic-bezier(0.16, 1, 0.3, 1) 160ms backwards;
        }

        /* 4. Bottom-Center: Navigation dock slides up with soft settle (+240ms) */
        .pcis-dock-wrap {
            animation: pcisSlideInBottom 0.72s cubic-bezier(0.16, 1, 0.3, 1) 240ms backwards;
        }

        /* ─── Smooth Dismissal of Tour Chrome when GSV, 3D Tour or Disclosure is Active ─── */
        body.is-gsv-open .pcis-brand-card,
        body.is-3d-open .pcis-brand-card,
        body.is-disclosure-open .pcis-brand-card {
            opacity: 0 !important;
            transform: translateY(-24px) !important;
            pointer-events: none !important;
        }

        body.is-gsv-open .pcis-location-widget,
        body.is-3d-open .pcis-location-widget,
        body.is-disclosure-open .pcis-location-widget {
            opacity: 0 !important;
            transform: translateX(-50%) translateY(-24px) !important;
            pointer-events: none !important;
        }

        body.is-gsv-open .pcis-top-actions,
        body.is-3d-open .pcis-top-actions,
        body.is-disclosure-open .pcis-top-actions {
            opacity: 0 !important;
            transform: translateY(-24px) !important;
            pointer-events: none !important;
        }

        body.is-gsv-open .pcis-dock-wrap,
        body.is-3d-open .pcis-dock-wrap,
        body.is-disclosure-open .pcis-dock-wrap {
            opacity: 0 !important;
            transform: translateX(-50%) translateY(32px) !important;
            pointer-events: none !important;
        }

        /* ─── 3DVista Player Controls / Skin Restyling ──────────────── */
        /* Unify 3DVista viewer buttons with SpatialUI High-Contrast White & Midnight Navy */
        #viewer button,
        #viewer .tdv-button,
        #viewer [class*="Button"],
        #viewer [class*="button"] {
            font-family: 'Satoshi', sans-serif !important;
            font-style: normal !important;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.2s ease !important;
        }

        #viewer button:hover,
        #viewer .tdv-button:hover {
            transform: scale(1.08) !important;
        }

        /* Canvas Hotspots & Navigation */
        #viewer canvas {
            outline: none !important;
            user-select: none !important;
        }
    `;
    document.head.appendChild(globalStyle);

    // Dock Widget removed — now handled by Components/WidgetDock/widget_dock.js
})();
