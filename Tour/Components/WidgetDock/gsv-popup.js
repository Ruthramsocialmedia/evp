// ═══════════════════════════════════════════════════════════
//  GSV POPUP — Google Street View Iframe Popup
//  Glassmorphism overlay with embedded Google Maps Street View
//  Same style as 3dvista.js iframe popup
// ═══════════════════════════════════════════════════════════
(function () {

    // ─── Font Awesome 6 CDN (Ensure CDN icons are loaded) ───────
    if (!document.querySelector('link[href*="font-awesome"], link[href*="fontawesome"]')) {
        const fa = document.createElement("link");
        fa.rel = "stylesheet";
        fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css";
        fa.crossOrigin = "anonymous";
        fa.referrerPolicy = "no-referrer";
        document.head.appendChild(fa);
    }

    /* ─── Styles matching Explore Venue Views ─── */
    const style = document.createElement("style");
    style.id = "gsv-popup-styles";
    style.textContent = `
        /* Backdrop */
        .gsv-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(19, 19, 48, 0.35);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            backdrop-filter: blur(24px) saturate(180%);
            z-index: 100090;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
            box-sizing: border-box;
            font-style: normal !important;
        }

        .gsv-backdrop.is-open {
            opacity: 1;
            pointer-events: auto;
        }

        /* Modal Box — Frosted Glass Shell */
        .gsv-modal-box {
            width: 90vw;
            height: 90vh;
            max-height: 90vh;
            position: relative;
            background: rgba(255, 255, 255, 0.90);
            -webkit-backdrop-filter: blur(28px) saturate(190%);
            backdrop-filter: blur(28px) saturate(190%);
            border: 1px solid rgba(255, 255, 255, 0.85);
            border-radius: 24px;
            box-shadow: 
                0 4px 12px rgba(19, 19, 48, 0.04),
                0 28px 64px rgba(19, 19, 48, 0.22),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            overflow: hidden;
            transform: scale(0.96);
            opacity: 0;
            transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease;
            display: flex;
            flex-direction: column;
            user-select: none;
            box-sizing: border-box;
            font-style: normal !important;
        }

        .gsv-modal-box.is-open {
            transform: scale(1);
            opacity: 1;
        }

        /* Header — Frosted Institutional Glass */
        .gsv-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 24px;
            background: rgba(255, 255, 255, 0.65);
            border-bottom: 1px solid rgba(19, 19, 48, 0.08);
            position: relative;
            gap: 16px;
            flex-shrink: 0;
            box-sizing: border-box;
            user-select: none;
        }

        .gsv-header-titles {
            display: flex;
            align-items: center;
            gap: 14px;
            min-width: 0;
        }

        .gsv-header-icon-box {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: #131330;
            border: 1px solid rgba(255, 183, 3, 0.35);
            color: #FFB703;
            display: grid;
            place-items: center;
            font-size: 19px;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(19, 19, 48, 0.12);
        }

        .gsv-header-heading {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
        }

        .gsv-header-heading h2 {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 18px;
            font-weight: 800;
            color: #131330;
            margin: 0;
            line-height: 1.2;
            letter-spacing: -0.01em;
            white-space: nowrap;
        }

        .gsv-header-heading p {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 12px;
            color: #64748B;
            margin: 0;
            line-height: 1.2;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Red Circular Close Button with 360deg Hover Spin */
        .gsv-close-btn {
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

        .gsv-close-btn i {
            font-size: 18px;
            line-height: 1;
            display: inline-flex;
            margin: 0;
            padding: 0;
            pointer-events: none;
            color: #FFFFFF;
        }

        .gsv-close-btn:hover {
            background: #DC2626;
            color: #FFFFFF;
            transform: rotate(360deg);
        }

        .gsv-close-btn:active {
            transform: rotate(360deg) scale(0.94);
        }

        /* Stage containing Iframe and Viewpoint Dock */
        .gsv-stage {
            position: relative;
            flex: 1;
            width: 100%;
            height: 100%;
            background: #131330;
            overflow: hidden;
        }

        .gsv-iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
            background: #131330;
        }

        /* Floating Viewpoint Switcher Dock */
        .gsv-viewpoint-dock {
            position: absolute;
            bottom: 22px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 35;
            background: rgba(255, 255, 255, 0.88);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.85);
            border-radius: 999px;
            padding: 5px 8px;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 
                0 8px 32px rgba(19, 19, 48, 0.24),
                0 2px 8px rgba(19, 19, 48, 0.06),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            user-select: none;
            max-width: calc(100% - 40px);
            overflow: visible !important;
            box-sizing: border-box;
        }

        .gsv-viewpoint-dock::-webkit-scrollbar {
            display: none;
        }

        .gsv-pill-btn {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 12.5px;
            font-weight: 700;
            padding: 8px 16px;
            border-radius: 999px;
            border: none;
            background: transparent;
            color: #334155;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            -webkit-tap-highlight-color: transparent;
            outline: none;
            text-decoration: none;
        }

        .gsv-pill-btn i {
            font-size: 13px;
            color: inherit;
            display: inline-flex;
            align-items: center;
        }

        .gsv-pill-btn:hover {
            color: #131330;
            background: rgba(255, 183, 3, 0.15);
        }

        .gsv-pill-btn:active {
            transform: scale(0.97);
        }

        .gsv-pill-btn.is-active {
            background: #131330;
            color: #FFB703;
            border: 1px solid #FFB703;
            box-shadow: 0 4px 14px rgba(19, 19, 48, 0.28);
        }

        .gsv-live-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #10B981;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            animation: gsvPulseDot 2s infinite;
            flex-shrink: 0;
            display: inline-block;
        }

        @keyframes gsvPulseDot {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .gsv-pill-external {
            color: #131330;
            font-weight: 700;
        }

        .gsv-pill-external:hover {
            background: rgba(255, 183, 3, 0.15);
            color: #131330;
        }

        .gsv-dock-sep {
            width: 1px;
            height: 20px;
            background: rgba(19, 19, 48, 0.12);
            margin: 0 4px;
            flex-shrink: 0;
        }

        /* Desktop Pills Container (Hidden in favor of universal viewpoint dropdown) */
        .gsv-desktop-pills {
            display: none !important;
        }

        /* Header Subtitle Dropdown Trigger */
        .gsv-header-subtitle-wrap {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            border-radius: 6px;
            padding: 1px 4px;
            margin-left: -4px;
            transition: background 160ms ease;
            -webkit-tap-highlight-color: transparent;
        }

        .gsv-header-subtitle-wrap:hover {
            background: rgba(255, 183, 3, 0.12);
        }

        .gsv-header-chevron {
            font-size: 13px;
            color: #FFB703;
            transition: transform 200ms ease;
        }

        .gsv-header-subtitle-wrap.is-open .gsv-header-chevron {
            transform: rotate(180deg);
        }

        /* Universal Dropdown Trigger Capsule */
        .gsv-mobile-trigger {
            display: flex !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 13px;
            font-weight: 700;
            padding: 8px 18px;
            border-radius: 999px;
            border: none;
            background: transparent;
            color: #131330;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            -webkit-tap-highlight-color: transparent;
            outline: none;
        }

        .gsv-mobile-trigger i.gsv-chevron {
            font-size: 13px;
            color: #FFB703;
            transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
            margin-left: 2px;
        }

        .gsv-mobile-trigger.is-open i.gsv-chevron {
            transform: rotate(180deg);
        }

        /* Transparent Backdrop to Catch Clicks Over Iframe */
        .gsv-dropdown-backdrop {
            position: absolute;
            inset: 0;
            z-index: 20;
            display: none;
            background: transparent;
        }

        .gsv-dropdown-backdrop.is-active {
            display: block;
        }

        /* ── Relative Dropdown Menu ── */
        .gsv-dropdown-menu {
            position: absolute;
            bottom: calc(100% + 12px);
            left: 50%;
            transform: translateX(-50%) translateY(8px) scale(0.96);
            width: min(320px, calc(100vw - 36px));
            background: rgba(255, 255, 255, 0.95);
            -webkit-backdrop-filter: blur(28px) saturate(190%);
            backdrop-filter: blur(28px) saturate(190%);
            border: 1px solid rgba(255, 255, 255, 0.85);
            border-radius: 20px;
            padding: 8px;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.06),
                0 24px 52px rgba(19, 19, 48, 0.22),
                inset 0 1px 1px rgba(255, 255, 255, 0.95);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
                        transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
                        visibility 220ms ease;
            z-index: 25;
            box-sizing: border-box;
            user-select: none;
        }

        .gsv-dropdown-menu.is-open {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0) scale(1);
            pointer-events: auto;
        }

        .gsv-dropdown-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 10px 8px 10px;
            border-bottom: 1px solid rgba(19, 19, 48, 0.08);
            margin-bottom: 6px;
        }

        .gsv-dropdown-title {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 11px;
            font-weight: 800;
            color: #131330;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .gsv-dropdown-count {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 10.5px;
            font-weight: 700;
            color: #B45309;
            background: rgba(255, 183, 3, 0.18);
            padding: 2px 8px;
            border-radius: 999px;
            transition: all 0.2s ease;
        }

        /* ── Search Input inside Dropdown ── */
        .gsv-dropdown-search-wrap {
            position: relative;
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            padding: 0 2px;
        }

        .gsv-dropdown-search-icon {
            position: absolute;
            left: 12px;
            font-size: 12px;
            color: #94A3B8;
            pointer-events: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .gsv-dropdown-search-input {
            width: 100%;
            height: 36px;
            padding: 0 32px 0 32px;
            background: #F8FAFC;
            border: 1px solid rgba(19, 19, 48, 0.1);
            border-radius: 10px;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 12px;
            font-weight: 600;
            color: #131330;
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
            -webkit-appearance: none;
        }

        .gsv-dropdown-search-input::placeholder {
            color: #94A3B8;
            font-weight: 500;
        }

        .gsv-dropdown-search-input:focus {
            background: #FFFFFF;
            border-color: #FFB703;
            box-shadow: 0 0 0 3px rgba(255, 183, 3, 0.18);
        }

        .gsv-dropdown-search-clear {
            position: absolute;
            right: 10px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: none;
            background: rgba(19, 19, 48, 0.08);
            color: #64748B;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 0;
            font-size: 11px;
            transition: all 0.15s ease;
        }

        .gsv-dropdown-search-clear i {
            font-size: 12px;
            line-height: 1;
            display: inline-flex;
            pointer-events: none;
        }

        .gsv-dropdown-search-clear:hover {
            background: #131330;
            color: #FFFFFF;
        }

        .gsv-dropdown-empty {
            display: none;
            padding: 24px 12px;
            text-align: center;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            color: #64748B;
            font-family: 'Satoshi', sans-serif !important;
            font-size: 12px;
            font-weight: 600;
        }

        .gsv-dropdown-empty i {
            font-size: 22px;
            color: #CBD5E1;
        }

        .gsv-dropdown-scroll {
            display: flex;
            flex-direction: column;
            gap: 3px;
            max-height: min(380px, 55vh);
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 183, 3, 0.4) transparent;
            padding-right: 3px;
        }

        .gsv-dropdown-scroll::-webkit-scrollbar {
            width: 4px;
        }

        .gsv-dropdown-scroll::-webkit-scrollbar-track {
            background: transparent;
        }

        .gsv-dropdown-scroll::-webkit-scrollbar-thumb {
            background: rgba(255, 183, 3, 0.4);
            border-radius: 4px;
        }

        .gsv-dropdown-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 10px;
            border-radius: 12px;
            border: none;
            background: transparent;
            cursor: pointer;
            text-align: left;
            width: 100%;
            box-sizing: border-box;
            font-family: inherit;
            transition: background 180ms ease, transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
            -webkit-tap-highlight-color: transparent;
            text-decoration: none;
        }

        .gsv-dropdown-item * {
            pointer-events: none;
        }

        .gsv-dropdown-item:hover,
        .gsv-dropdown-item:active {
            background: rgba(255, 183, 3, 0.12);
            transform: translateX(2px);
        }

        .gsv-dropdown-item.is-selected {
            background: rgba(255, 183, 3, 0.15);
        }

        .gsv-dropdown-item-icon {
            width: 32px;
            height: 32px;
            border-radius: 9px;
            background: #FFFFFF;
            border: 1px solid rgba(19, 19, 48, 0.1);
            color: #131330;
            display: grid;
            place-items: center;
            font-size: 14px;
            flex-shrink: 0;
            box-shadow: 0 2px 5px rgba(19, 19, 48, 0.04);
            transition: background 180ms ease, color 180ms ease;
        }

        .gsv-dropdown-item-icon i {
            font-style: normal !important;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .gsv-dropdown-item.is-selected .gsv-dropdown-item-icon {
            background: #131330;
            color: #FFB703;
            border-color: #FFB703;
        }

        .gsv-dropdown-item-info {
            display: flex;
            flex-direction: column;
            gap: 1.5px;
            flex: 1;
            min-width: 0;
        }

        .gsv-dropdown-item-label {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 12.5px;
            font-weight: 700;
            color: #131330;
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .gsv-dropdown-item.is-selected .gsv-dropdown-item-label {
            color: #131330;
            font-weight: 800;
        }

        .gsv-dropdown-item-sub {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 10.5px;
            color: #64748B;
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 500;
        }

        .gsv-dropdown-check {
            font-size: 12px;
            color: #FFB703;
            opacity: 0;
            transform: scale(0.8);
            transition: all 160ms ease;
            flex-shrink: 0;
            margin-right: 2px;
        }

        .gsv-dropdown-item.is-selected .gsv-dropdown-check {
            opacity: 1;
            transform: scale(1);
        }

        .gsv-dropdown-sep {
            height: 1px;
            background: rgba(19, 19, 48, 0.08);
            margin: 4px 6px;
        }

        .gsv-dropdown-external {
            color: #131330;
        }

        .gsv-dropdown-external .gsv-dropdown-item-icon {
            color: #131330;
            border-color: rgba(255, 183, 3, 0.3);
        }

        /* ── Tablet Responsiveness (<= 1024px) ── */
        @media (max-width: 1024px) {
            .gsv-modal-box {
                width: calc(100vw - 44px);
                max-width: 900px;
                height: 88vh;
                height: 88dvh;
                max-height: 88dvh;
                border-radius: 22px;
            }
            .gsv-header {
                padding: 14px 20px;
                gap: 14px;
            }
            .gsv-header-heading h2 {
                font-size: 16px;
            }
            .gsv-header-heading p {
                font-size: 11.5px;
            }
            .gsv-viewpoint-dock {
                bottom: max(16px, env(safe-area-inset-bottom));
                padding: 3px 6px;
                overflow: visible !important;
                max-width: calc(100% - 32px);
            }
            .gsv-desktop-pills {
                display: none !important;
            }
            .gsv-mobile-trigger {
                display: flex !important;
            }
            .gsv-dropdown-menu {
                width: min(300px, calc(100vw - 44px));
            }
        }

        /* ── Mobile Phone Responsiveness (<= 640px) ── */
        @media (max-width: 640px) {
            .gsv-modal-box {
                width: calc(100vw - 20px);
                max-width: 480px;
                height: 88vh;
                height: 88dvh;
                max-height: 88dvh;
                border-radius: 20px;
            }
            .gsv-header {
                padding: 12px 16px;
                gap: 12px;
            }
            .gsv-header-icon-box {
                width: 36px;
                height: 36px;
                font-size: 16px;
                border-radius: 10px;
            }
            .gsv-header-heading h2 {
                font-size: 15px;
            }
            .gsv-header-heading p {
                font-size: 10.5px;
            }
            .gsv-close-btn {
                width: 28px;
                height: 28px;
            }
            .gsv-close-btn i {
                font-size: 15px;
            }
            .gsv-viewpoint-dock {
                bottom: 14px;
                padding: 3px 6px;
                gap: 0;
                overflow: visible !important;
                max-width: calc(100% - 32px);
            }
            .gsv-desktop-pills {
                display: none !important;
            }
            .gsv-mobile-trigger {
                display: flex !important;
            }
            .gsv-dropdown-menu {
                width: min(290px, calc(100vw - 36px));
            }
        }
    `;
    document.head.appendChild(style);

    /* ─── State & Viewpoints Data ─── */
    let isGsvOpen = false;
    let currentPopup = null;

    const VIEWPOINTS = [
        {
            id: "arrival-gate",
            label: "Grand Arrival Entrance Gate",
            sub: "Chennai – Bengaluru NH-4 Visual Frontage",
            icon: "fi fi-rr-road",
            url: "https://www.google.com/maps/embed?pb=!4v1791625290672!6m8!1m7!1sCAoSHENJQUJJaERlU0xER2RoQkxkUjBJWmxRdjI5bFI.!2m2!1d37.27448127353812!2d-76.70193407387384!3f257.1172352664995!4f-1.3198630247315037!5f0.7820865974627469"
        },
        {
            id: "driveway-network",
            label: "Internal Driveway & Circulation Network",
            sub: "8m Wide Concreted Roadway & Pedestrian Walkways",
            icon: "fi fi-rr-shield-check",
            url: "https://www.google.com/maps/embed?pb=!4v1791625392568!6m8!1m7!1skfCrP9JD0hHMonYjaDp8eg!2m2!1d37.2736035229786!2d-76.70215985156645!3f13.082455949271491!4f-6.32999449836224!5f0.7820865974627469"
        },
        {
            id: "canvas1",
            label: "THE CANVAS 1 — Open Concrete Arena",
            sub: "93,980 sq. ft. Rear Open Concrete Venue",
            icon: "fi fi-rr-flag",
            url: "https://www.google.com/maps/embed?pb=!4v1791625526862!6m8!1m7!1sCAoSHENJQUJJaENpemZNTGt6WDZzMjItZVlRZWpJdms.!2m2!1d37.27426722555664!2d-76.70317271897548!3f178.51457424149163!4f-5.492995904685571!5f0.7820865974627469"
        },
        {
            id: "canvas2",
            label: "THE CANVAS 2 — Mega Concert Ground",
            sub: "1,89,564 sq. ft. Mega Open-Air Arena",
            icon: "fi fi-rr-flag",
            url: "https://www.google.com/maps/embed?pb=!4v1791625526862!6m8!1m7!1sCAoSHENJQUJJaENpemZNTGt6WDZzMjItZVlRZWpJdms.!2m2!1d37.27426722555664!2d-76.70317271897548!3f178.51457424149163!4f-5.492995904685571!5f0.7820865974627469"
        },
        {
            id: "parking1",
            label: "Parking Zone 1 (Trade Halls)",
            sub: "Direct Exhibition Hall Paved Parking",
            icon: "fi fi-rr-car",
            url: "https://www.google.com/maps/embed?pb=!4v1791625613742!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ194UGk1b3dF!2m2!1d37.27282497461028!2d-76.70679723424071!3f124.86643972651301!4f-4.195217436696268!5f0.7820865974627469"
        },
        {
            id: "parking2",
            label: "Parking Zone 2 (Entrance Plaza)",
            sub: "Entrance Plaza Parking (8,000+ Total Vehicles)",
            icon: "fi fi-rr-car-alt",
            url: "https://www.google.com/maps/embed?pb=!4v1791625613742!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ194UGk1b3dF!2m2!1d37.27282497461028!2d-76.70679723424071!3f124.86643972651301!4f-4.195217436696268!5f0.7820865974627469"
        },
        {
            id: "perimeter",
            label: "Venue Perimeter & Landscaping",
            sub: "Continuous Boundary Buffer & Landscaping",
            icon: "fi fi-rr-vector-alt",
            url: "https://www.google.com/maps/embed?pb=!4v1791625392568!6m8!1m7!1skfCrP9JD0hHMonYjaDp8eg!2m2!1d37.2736035229786!2d-76.70215985156645!3f13.082455949271491!4f-6.32999449836224!5f0.7820865974627469"
        }
    ];

    /* ─── Close GSV Popup ─── */
    function closePopup() {
        if (!isGsvOpen && !currentPopup) return;
        isGsvOpen = false;
        document.body.classList.remove("is-gsv-open");

        if (currentPopup) {
            const { backdrop, box, escHandler } = currentPopup;
            document.removeEventListener("keydown", escHandler);
            if (box) box.classList.remove("is-open");
            if (backdrop) {
                backdrop.classList.remove("is-open");
                setTimeout(function () {
                    if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
                }, 300);
            }
            currentPopup = null;
        }

        document.dispatchEvent(new CustomEvent("menuItemDeactivate", { detail: { id: "menu-street-view" } }));
    }

    /* ─── Open GSV Popup ─── */
    function openGsvPopup() {
        if (isGsvOpen) {
            closePopup();
            return;
        }

        isGsvOpen = true;
        if (typeof window.close3dTour === "function") {
            window.close3dTour();
        }
        if (typeof window.closePanoDrawer === "function") {
            window.closePanoDrawer();
        }
        document.body.classList.add("is-gsv-open");
        document.dispatchEvent(new CustomEvent("menuItemActivate", { detail: { id: "menu-street-view" } }));

        // 1. Backdrop
        const backdrop = document.createElement("div");
        backdrop.className = "gsv-backdrop";

        // 2. Modal Box
        const box = document.createElement("div");
        box.className = "gsv-modal-box";
        box.setAttribute("role", "dialog");
        box.setAttribute("aria-modal", "true");
        box.setAttribute("aria-labelledby", "gsv-title");

        // 3. Header — Frosted Institutional Glass
        const header = document.createElement("div");
        header.className = "gsv-header";

        const titles = document.createElement("div");
        titles.className = "gsv-header-titles";

        const iconBox = document.createElement("div");
        iconBox.className = "gsv-header-icon-box";
        iconBox.innerHTML = '<i class="fi fi-sr-street-view" aria-hidden="true"></i>';

        const heading = document.createElement("div");
        heading.className = "gsv-header-heading";

        const title = document.createElement("h2");
        title.id = "gsv-title";
        title.textContent = "Google Street View 360°";

        const subWrap = document.createElement("div");
        subWrap.className = "gsv-header-subtitle-wrap";
        subWrap.id = "gsv-header-selector";
        subWrap.setAttribute("role", "button");
        subWrap.setAttribute("aria-haspopup", "listbox");
        subWrap.setAttribute("aria-label", "Select Street View viewpoint");
        subWrap.title = "Click to switch viewpoint";

        const subTitle = document.createElement("p");
        subTitle.id = "gsv-subtitle";
        subTitle.textContent = VIEWPOINTS[0].sub;

        const headerChevron = document.createElement("i");
        headerChevron.className = "fi fi-rr-angle-small-down gsv-header-chevron";
        headerChevron.setAttribute("aria-hidden", "true");

        subWrap.appendChild(subTitle);
        subWrap.appendChild(headerChevron);

        heading.appendChild(title);
        heading.appendChild(subWrap);
        titles.appendChild(iconBox);
        titles.appendChild(heading);

        // Music-style Red Circular Close Button with 360° Hover Spin
        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "gsv-close-btn";
        closeBtn.setAttribute("aria-label", "Close Street View");
        closeBtn.innerHTML = '<i class="fi fi-rr-cross-small" aria-hidden="true"></i>';
        closeBtn.onclick = closePopup;

        header.appendChild(titles);
        header.appendChild(closeBtn);
        box.appendChild(header);

        // 4. Stage (Iframe + Floating Viewpoint Dock)
        const stage = document.createElement("div");
        stage.className = "gsv-stage";

        const iframe = document.createElement("iframe");
        iframe.className = "gsv-iframe";
        iframe.src = VIEWPOINTS[0].url;
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
        stage.appendChild(iframe);

        // Transparent backdrop to intercept clicks over iframe when dropdown is open
        const dropdownBackdrop = document.createElement("div");
        dropdownBackdrop.className = "gsv-dropdown-backdrop";
        stage.appendChild(dropdownBackdrop);

        // Floating Bottom Viewpoint Dock
        const dock = document.createElement("div");
        dock.className = "gsv-viewpoint-dock";

        // ── Relative Dropdown Menu ──
        const dropdownMenu = document.createElement("div");
        dropdownMenu.className = "gsv-dropdown-menu";
        dropdownMenu.id = "gsv-dropdown-menu";
        dropdownMenu.setAttribute("role", "listbox");
        dropdownMenu.setAttribute("aria-label", "Choose Street View location");

        const dropdownHead = document.createElement("div");
        dropdownHead.className = "gsv-dropdown-head";
        dropdownHead.innerHTML = `
            <span class="gsv-dropdown-title">Select Viewpoint</span>
            <span class="gsv-dropdown-count">${VIEWPOINTS.length} Locations</span>
        `;
        dropdownMenu.appendChild(dropdownHead);

        // Search Input Box inside Dropdown
        const searchWrap = document.createElement("div");
        searchWrap.className = "gsv-dropdown-search-wrap";
        searchWrap.innerHTML = `
            <i class="fi fi-rr-search gsv-dropdown-search-icon" aria-hidden="true"></i>
            <input type="text" class="gsv-dropdown-search-input" placeholder="Search outdoor locations..." aria-label="Search outdoor locations" spellcheck="false" autocomplete="off" />
            <button type="button" class="gsv-dropdown-search-clear" aria-label="Clear search"><i class="fi fi-rr-cross-small" aria-hidden="true"></i></button>
        `;
        dropdownMenu.appendChild(searchWrap);

        const dropdownScroll = document.createElement("div");
        dropdownScroll.className = "gsv-dropdown-scroll";

        const emptyNotice = document.createElement("div");
        emptyNotice.className = "gsv-dropdown-empty";
        emptyNotice.innerHTML = `
            <i class="fi fi-rr-search-alt" aria-hidden="true"></i>
            <span>No matching locations found</span>
        `;
        dropdownScroll.appendChild(emptyNotice);

        const dropdownItems = [];

        VIEWPOINTS.forEach(function (vp, index) {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "gsv-dropdown-item" + (index === 0 ? " is-selected" : "");
            item.setAttribute("role", "option");
            item.setAttribute("aria-selected", index === 0 ? "true" : "false");
            item.innerHTML = `
                <div class="gsv-dropdown-item-icon">
                    <i class="${vp.icon}" aria-hidden="true"></i>
                </div>
                <div class="gsv-dropdown-item-info">
                    <span class="gsv-dropdown-item-label">${vp.label}</span>
                    <span class="gsv-dropdown-item-sub">${vp.sub}</span>
                </div>
                <i class="fi fi-rr-check gsv-dropdown-check" aria-hidden="true"></i>
            `;

            item.onclick = function (e) {
                e.stopPropagation();
                switchViewpoint(index);
            };

            dropdownScroll.appendChild(item);
            dropdownItems.push(item);
        });

        // Dropdown separator & external maps link
        const dropSep = document.createElement("div");
        dropSep.className = "gsv-dropdown-sep";
        dropdownScroll.appendChild(dropSep);

        const dropMapsLink = document.createElement("a");
        dropMapsLink.href = "https://www.google.com/maps/search/?api=1&query=EVP+Trade+and+Convention+Centre+Chennai";
        dropMapsLink.target = "_blank";
        dropMapsLink.rel = "noopener noreferrer";
        dropMapsLink.className = "gsv-dropdown-item gsv-dropdown-external";
        dropMapsLink.innerHTML = `
            <div class="gsv-dropdown-item-icon">
                <i class="fi fi-rr-arrow-up-right-from-square" aria-hidden="true"></i>
            </div>
            <div class="gsv-dropdown-item-info">
                <span class="gsv-dropdown-item-label">Live Google Maps</span>
                <span class="gsv-dropdown-item-sub">Open in Maps App</span>
            </div>
        `;
        dropdownScroll.appendChild(dropMapsLink);
        dropdownMenu.appendChild(dropdownScroll);

        // ── Search & Live Filter Logic ──
        const searchInput = searchWrap.querySelector(".gsv-dropdown-search-input");
        const searchClear = searchWrap.querySelector(".gsv-dropdown-search-clear");
        const countBadge = dropdownHead.querySelector(".gsv-dropdown-count");

        function filterLocations(query) {
            const q = (query || "").trim().toLowerCase();
            let visibleCount = 0;

            if (searchClear) {
                searchClear.style.display = q ? "flex" : "none";
            }

            dropdownItems.forEach(function (item, idx) {
                const vp = VIEWPOINTS[idx];
                const matches = !q ||
                    vp.label.toLowerCase().indexOf(q) !== -1 ||
                    vp.sub.toLowerCase().indexOf(q) !== -1;

                item.style.display = matches ? "flex" : "none";
                if (matches) visibleCount++;
            });

            if (dropSep) dropSep.style.display = q ? "none" : "";
            if (dropMapsLink) dropMapsLink.style.display = q ? "none" : "";
            if (emptyNotice) emptyNotice.style.display = visibleCount === 0 ? "flex" : "none";

            if (countBadge) {
                countBadge.textContent = q ? `${visibleCount} Found` : `${VIEWPOINTS.length} Locations`;
            }
        }

        searchInput.addEventListener("input", function () {
            filterLocations(searchInput.value);
        });

        searchClear.addEventListener("click", function (e) {
            e.stopPropagation();
            searchInput.value = "";
            filterLocations("");
            searchInput.focus();
        });

        searchWrap.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        searchWrap.addEventListener("keydown", function (e) {
            e.stopPropagation();
            if (e.key === "Escape") {
                if (searchInput.value) {
                    searchInput.value = "";
                    filterLocations("");
                } else {
                    closeDropdown();
                }
            }
        });

        dropdownMenu.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        dock.appendChild(dropdownMenu);

        // ── Mobile Dropdown Trigger Capsule ──
        const mobileTrigger = document.createElement("button");
        mobileTrigger.type = "button";
        mobileTrigger.className = "gsv-mobile-trigger";
        mobileTrigger.id = "gsv-mobile-trigger";
        mobileTrigger.setAttribute("aria-haspopup", "listbox");
        mobileTrigger.setAttribute("aria-expanded", "false");
        mobileTrigger.setAttribute("aria-label", "Select venue viewpoint");
        mobileTrigger.innerHTML = `
            <span class="gsv-live-dot" aria-hidden="true"></span>
            <i class="${VIEWPOINTS[0].icon}" id="gsv-mobile-icon" aria-hidden="true"></i>
            <span id="gsv-mobile-label">${VIEWPOINTS[0].label}</span>
            <i class="fi fi-rr-angle-small-up gsv-chevron" aria-hidden="true"></i>
        `;
        dock.appendChild(mobileTrigger);

        // ── Desktop Horizontal Pills ──
        const desktopPills = document.createElement("div");
        desktopPills.className = "gsv-desktop-pills";

        const pillButtons = [];

        function updateActivePill(activeIdx) {
            pillButtons.forEach(function (pill, idx) {
                if (idx === activeIdx) {
                    pill.classList.add("is-active");
                    if (!pill.querySelector(".gsv-live-dot")) {
                        const dot = document.createElement("span");
                        dot.className = "gsv-live-dot";
                        dot.setAttribute("aria-hidden", "true");
                        pill.prepend(dot);
                    }
                } else {
                    pill.classList.remove("is-active");
                    const dot = pill.querySelector(".gsv-live-dot");
                    if (dot) dot.remove();
                }
            });
        }

        VIEWPOINTS.forEach(function (vp, index) {
            const pill = document.createElement("button");
            pill.type = "button";
            pill.className = "gsv-pill-btn";
            pill.innerHTML = '<i class="' + vp.icon + '" aria-hidden="true"></i><span>' + vp.label + '</span>';

            pill.onclick = function () {
                switchViewpoint(index);
            };

            desktopPills.appendChild(pill);
            pillButtons.push(pill);
        });

        // Dock Separator
        const sep = document.createElement("div");
        sep.className = "gsv-dock-sep";
        desktopPills.appendChild(sep);

        // External Google Maps Link
        const mapsLink = document.createElement("a");
        mapsLink.href = "https://www.google.com/maps/search/?api=1&query=EVP+Trade+and+Convention+Centre+Chennai";
        mapsLink.target = "_blank";
        mapsLink.rel = "noopener noreferrer";
        mapsLink.className = "gsv-pill-btn gsv-pill-external";
        mapsLink.innerHTML = '<i class="fi fi-rr-arrow-up-right-from-square" aria-hidden="true"></i><span>Live Maps</span>';
        desktopPills.appendChild(mapsLink);

        dock.appendChild(desktopPills);

        // ── Switch Viewpoint & Dropdown Controls ──
        let isDropdownOpen = false;

        function toggleDropdown(forceState) {
            isDropdownOpen = typeof forceState === "boolean" ? forceState : !isDropdownOpen;
            if (isDropdownOpen) {
                dropdownMenu.classList.add("is-open");
                mobileTrigger.classList.add("is-open");
                mobileTrigger.setAttribute("aria-expanded", "true");
                dropdownBackdrop.classList.add("is-active");
                subWrap.classList.add("is-open");
                setTimeout(function () {
                    if (isDropdownOpen && searchInput && window.innerWidth > 640) {
                        searchInput.focus();
                    }
                }, 100);
            } else {
                dropdownMenu.classList.remove("is-open");
                mobileTrigger.classList.remove("is-open");
                mobileTrigger.setAttribute("aria-expanded", "false");
                dropdownBackdrop.classList.remove("is-active");
                subWrap.classList.remove("is-open");
                if (searchInput && searchInput.value) {
                    searchInput.value = "";
                    filterLocations("");
                }
            }
        }

        function closeDropdown() {
            if (isDropdownOpen) toggleDropdown(false);
        }

        function switchViewpoint(index) {
            if (index < 0 || index >= VIEWPOINTS.length) return;
            const vp = VIEWPOINTS[index];
            if (iframe.src !== vp.url) {
                iframe.src = vp.url;
            }
            subTitle.textContent = vp.sub;

            // Desktop pills state
            updateActivePill(index);

            // Mobile trigger state
            const mobIcon = document.getElementById("gsv-mobile-icon");
            const mobLabel = document.getElementById("gsv-mobile-label");
            if (mobIcon) mobIcon.className = vp.icon;
            if (mobLabel) mobLabel.textContent = vp.label;

            // Dropdown items state
            dropdownItems.forEach(function (item, idx) {
                if (idx === index) {
                    item.classList.add("is-selected");
                    item.setAttribute("aria-selected", "true");
                } else {
                    item.classList.remove("is-selected");
                    item.setAttribute("aria-selected", "false");
                }
            });

            closeDropdown();
        }

        // Initialize first viewpoint active with emerald pulsing live dot
        updateActivePill(0);

        mobileTrigger.onclick = function (e) {
            e.stopPropagation();
            toggleDropdown();
        };

        subWrap.onclick = function (e) {
            e.stopPropagation();
            toggleDropdown();
        };

        dropdownBackdrop.onclick = function () {
            closeDropdown();
        };

        stage.appendChild(dock);
        box.appendChild(stage);

        backdrop.appendChild(box);
        document.body.appendChild(backdrop);

        // Animate in via class transitions
        requestAnimationFrame(function () {
            backdrop.classList.add("is-open");
            box.classList.add("is-open");
        });

        const escHandler = function (e) {
            if (e.key === "Escape" || e.key === "Esc") {
                if (isDropdownOpen) {
                    closeDropdown();
                } else {
                    closePopup();
                }
            }
        };
        document.addEventListener("keydown", escHandler);

        backdrop.addEventListener("click", function (e) {
            if (e.target === backdrop) closePopup();
        });

        currentPopup = { backdrop, box, escHandler };
    }

    /* ─── Public API ─── */
    window.openGsvPopup = openGsvPopup;
    window.closeGsvPopup = closePopup;

    /* ─── Listen for Menu & Dock Clicks ─── */
    document.addEventListener("menuItemClick", function (e) {
        if (e.detail && e.detail.id === "menu-street-view") {
            openGsvPopup();
        } else if (isGsvOpen) {
            closePopup();
        }
    });

    document.addEventListener("menuItemActivate", function (e) {
        if (e.detail && e.detail.id !== "menu-street-view" && isGsvOpen) {
            closePopup();
        }
    });

})();
