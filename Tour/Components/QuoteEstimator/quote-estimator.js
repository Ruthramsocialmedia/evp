// ═══════════════════════════════════════════════════════════════════════
//  EVP TRADE & CONVENTION CENTRE — EVENT COST & HALL RENTAL ESTIMATOR
//  Interactive Instant Quote Calculator with Real-time Capacity Matching
//  and Direct WhatsApp Commercial Booking Lead Handoff.
//  Note: All figures, dimensions, and capacities are approximate estimates.
// ═══════════════════════════════════════════════════════════════════════

(function () {
    "use strict";

    if (document.getElementById("evp-quote-modal-overlay")) return;

    // ── Master Venue Facilities & Base Commercial Rates (Chennai Benchmark) ──
    const VENUE_FACILITIES = {
        "hall-a": {
            id: "hall-a",
            name: "Exhibition Hall A",
            sqft: 54144,
            sqm: 5030,
            baseRatePerDay: 500000, // ₹ 5.0 Lakhs / day base
            maxCapacity: 5000,
            badge: "Pillarless Mega Hall (~54,144 sq.ft)",
            icon: "fi fi-sr-building"
        },
        "hall-b": {
            id: "hall-b",
            name: "Exhibition Hall B",
            sqft: 54144,
            sqm: 5030,
            baseRatePerDay: 500000,
            maxCapacity: 5000,
            badge: "Pillarless Mega Hall (~54,144 sq.ft)",
            icon: "fi fi-sr-building"
        },
        "hall-c": {
            id: "hall-c",
            name: "Exhibition Hall C",
            sqft: 54144,
            sqm: 5030,
            baseRatePerDay: 475000,
            maxCapacity: 3500,
            badge: "252 Rigging Points (~54,144 sq.ft)",
            icon: "fi fi-sr-building"
        },
        "hall-d": {
            id: "hall-d",
            name: "Exhibition Hall D",
            sqft: 47762,
            sqm: 4437,
            baseRatePerDay: 425000,
            maxCapacity: 2500,
            badge: "45m Clear Span (~47,762 sq.ft)",
            icon: "fi fi-sr-building"
        },
        "food-court": {
            id: "food-court",
            name: "Food Court & Open Dining Area",
            sqft: 26364,
            sqm: 2450,
            baseRatePerDay: 175000,
            maxCapacity: 1200,
            badge: "Dining Hub (~26,364 sq.ft)",
            icon: "fi fi-sr-restaurant"
        },
        "vip-pavilion": {
            id: "vip-pavilion",
            name: "Executive VIP Pavilion & Suites",
            sqft: 6500,
            sqm: 604,
            baseRatePerDay: 75000,
            maxCapacity: 150,
            badge: "VIP Wing (~6,500 sq.ft)",
            icon: "fi fi-sr-crown"
        }
    };

    // ── Optional Add-ons & Commercial Multipliers ──
    const ADD_ONS = {
        "ac": {
            id: "ac",
            name: "24/7 Central HVAC Air-Conditioning",
            ratePerDay: 60000,
            approxRateText: "Approx. ₹60,000/day",
            icon: "fi fi-sr-snowflake"
        },
        "power": {
            id: "power",
            name: "100% Heavy DG Power Backup & Sync",
            ratePerDay: 45000,
            approxRateText: "Approx. ₹45,000/day",
            icon: "fi fi-sr-bolt"
        },
        "valet": {
            id: "valet",
            name: "Dedicated Valet & Traffic Marshals",
            ratePerDay: 25000,
            approxRateText: "Approx. ₹25,000/day",
            icon: "fi fi-sr-car"
        },
        "cleaning": {
            id: "cleaning",
            name: "Post-Event Industrial Sanitization",
            ratePerDay: 20000,
            approxRateText: "Approx. ₹20,000/day",
            icon: "fi fi-sr-sparkles"
        }
    };

    // ── Multi-Day Discount Curves ──
    function getDurationDiscount(days) {
        if (days >= 4) return 0.15; // ~15% discount for 4+ days
        if (days === 3) return 0.10; // ~10% discount for 3 days
        if (days === 2) return 0.05; // ~5% discount for 2 days
        return 0;
    }

    // ── Inject Component CSS ──
    const styleEl = document.createElement("style");
    styleEl.id = "evp-quote-estimator-styles";
    styleEl.textContent = `
        /* ═════════════════════════════════════════════════════════════
           EVP QUOTE ESTIMATOR — Clean, Neat & Frosted Luxury Backdrop
           ═════════════════════════════════════════════════════════════ */

        /* ── Overlay & Frosted Glass Backdrop (Matches Contact Us 100%) ── */
        .evp-quote-overlay {
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
        .evp-quote-overlay.is-open {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        /* ── Modal Window ── */
        .evp-quote-modal {
            width: min(720px, 94vw);
            max-height: 90vh;
            background: #FFFFFF;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.85);
            box-shadow: 
                0 32px 80px -16px rgba(19, 19, 48, 0.32),
                0 0 0 1px rgba(19, 19, 48, 0.08);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transform: scale(0.95) translateY(16px);
            transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .evp-quote-overlay.is-open .evp-quote-modal {
            transform: scale(1) translateY(0);
        }

        /* ── Header ── */
        .evp-quote-header {
            padding: 16px 20px 14px;
            background: #FFFFFF;
            border-bottom: 1px solid #EEF2F6;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-shrink: 0;
        }
        .evp-quote-header-left {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
        }
        .evp-quote-badge-row {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        .evp-quote-pill {
            background: #F1F5F9;
            color: #334155;
            border: 1px solid #E2E8F0;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            padding: 3px 8px;
            border-radius: 6px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        .evp-quote-pill i {
            color: #D97706;
            font-size: 11px;
        }
        .evp-quote-aprox-badge {
            font-size: 10.5px;
            color: #0284C7;
            background: #E0F2FE;
            border: 1px solid #BAE6FD;
            padding: 2px 7px;
            border-radius: 6px;
            font-weight: 700;
        }
        .evp-quote-title {
            margin: 0;
            font-size: 18px;
            font-weight: 800;
            color: #131330;
            letter-spacing: -0.3px;
            line-height: 1.25;
        }
        .evp-quote-subtitle {
            margin: 0;
            font-size: 11.5px;
            color: #64748B;
            font-weight: 500;
            line-height: 1.35;
        }

        /* ── Standard EVP Red Circular Close Button (360° Hover Spin) ── */
        .evp-quote-close-btn {
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
        .evp-quote-close-btn i {
            font-size: 18px;
            line-height: 1;
            display: inline-flex;
            margin: 0;
            padding: 0;
            pointer-events: none;
            color: #FFFFFF;
        }
        .evp-quote-close-btn:hover {
            background: #DC2626;
            color: #FFFFFF;
            transform: rotate(360deg);
        }
        .evp-quote-close-btn:active {
            transform: rotate(360deg) scale(0.94);
        }

        /* ── Scrollable Body Area ── */
        .evp-quote-body {
            padding: 16px 20px 20px;
            overflow-y: auto;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: #FAFBFD;
        }
        .evp-quote-body::-webkit-scrollbar {
            width: 5px;
        }
        .evp-quote-body::-webkit-scrollbar-thumb {
            background: rgba(19, 19, 48, 0.15);
            border-radius: 6px;
        }

        /* ── Section Header ── */
        .evp-quote-sec-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 7px;
        }
        .evp-quote-sec-title {
            font-size: 12px;
            font-weight: 800;
            color: #131330;
            letter-spacing: 0.3px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .evp-quote-step-num {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #131330;
            color: #FFFFFF;
            font-size: 10px;
            font-weight: 800;
        }
        .evp-quote-sec-hint {
            font-size: 11px;
            color: #64748B;
            font-weight: 600;
        }

        /* ── Step 1: Event Type Segmented Strip ── */
        .evp-quote-event-types {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            padding: 4px;
        }
        .evp-quote-type-btn {
            background: transparent;
            border: 1px solid transparent;
            border-radius: 8px;
            padding: 8px 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            cursor: pointer;
            transition: all 160ms ease;
            text-align: center;
            font-family: inherit;
        }
        .evp-quote-type-btn i {
            font-size: 13px;
            color: #64748B;
            transition: color 160ms ease;
        }
        .evp-quote-type-btn span {
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            white-space: nowrap;
        }
        .evp-quote-type-btn:hover {
            background: #F8FAFC;
        }
        .evp-quote-type-btn.is-active {
            background: #131330;
            border-color: #131330;
            box-shadow: 0 2px 6px rgba(19, 19, 48, 0.12);
        }
        .evp-quote-type-btn.is-active i {
            color: #FFB703;
        }
        .evp-quote-type-btn.is-active span {
            color: #FFFFFF;
        }

        /* ── Step 2: Facilities Grid ── */
        .evp-quote-facilities {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }
        .evp-quote-fac-card {
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
            box-shadow: 0 1px 2px rgba(19, 19, 48, 0.02);
        }
        .evp-quote-fac-card:hover {
            border-color: #CBD5E1;
            background: #FDFDFE;
        }
        .evp-quote-fac-card.is-selected {
            border-color: #059669;
            background: rgba(5, 150, 105, 0.03);
            box-shadow: 0 2px 6px rgba(5, 150, 105, 0.08);
        }
        .evp-quote-checkbox {
            width: 18px;
            height: 18px;
            border-radius: 5px;
            border: 1.5px solid #CBD5E1;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            background: #FFFFFF;
            transition: all 160ms ease;
        }
        .evp-quote-fac-card.is-selected .evp-quote-checkbox {
            background: #059669;
            border-color: #059669;
            color: #FFFFFF;
        }
        .evp-quote-checkbox i {
            font-size: 10px;
            opacity: 0;
            transform: scale(0.6);
            transition: all 160ms ease;
        }
        .evp-quote-fac-card.is-selected .evp-quote-checkbox i {
            opacity: 1;
            transform: scale(1);
        }
        .evp-quote-fac-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
            flex: 1;
        }
        .evp-quote-fac-name {
            font-size: 12px;
            font-weight: 800;
            color: #131330;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .evp-quote-fac-meta {
            font-size: 10px;
            color: #64748B;
            font-weight: 600;
        }

        /* ── Step 3: Attendance & Duration Controls ── */
        .evp-quote-slider-row {
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            padding: 12px 14px;
            box-shadow: 0 1px 2px rgba(19, 19, 48, 0.02);
        }
        .evp-quote-slider-labels {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .evp-quote-slider-value {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .evp-quote-slider-value span {
            color: #131330;
            background: #F1F5F9;
            border: 1px solid #E2E8F0;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 12.5px;
            font-weight: 800;
        }
        .evp-quote-range {
            width: 100%;
            -webkit-appearance: none;
            height: 6px;
            border-radius: 6px;
            background: #E2E8F0;
            outline: none;
            margin: 4px 0;
        }
        .evp-quote-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #131330;
            border: 2px solid #FFB703;
            box-shadow: 0 2px 6px rgba(19, 19, 48, 0.25);
            cursor: pointer;
            transition: transform 140ms ease;
        }
        .evp-quote-range::-webkit-slider-thumb:hover {
            transform: scale(1.15);
        }

        /* Duration Chips */
        .evp-quote-days-row {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .evp-quote-day-chip {
            flex: 1;
            padding: 7px 4px;
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            text-align: center;
            cursor: pointer;
            transition: all 160ms ease;
            font-family: inherit;
        }
        .evp-quote-day-chip:hover {
            border-color: #CBD5E1;
            color: #131330;
        }
        .evp-quote-day-chip.is-active {
            background: #131330;
            border-color: #131330;
            color: #FFFFFF;
            box-shadow: 0 2px 6px rgba(19, 19, 48, 0.12);
        }

        /* ── Step 4: Add-ons Checklist ── */
        .evp-quote-addons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }
        .evp-quote-addon-chip {
            background: #FFFFFF;
            border: 1.5px solid #E2E8F0;
            border-radius: 12px;
            padding: 9px 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: all 160ms ease;
            user-select: none;
            box-shadow: 0 1px 2px rgba(19, 19, 48, 0.02);
        }
        .evp-quote-addon-chip:hover {
            border-color: #CBD5E1;
            background: #FDFDFE;
        }
        .evp-quote-addon-chip.is-active {
            border-color: #059669;
            background: rgba(5, 150, 105, 0.03);
            box-shadow: 0 2px 6px rgba(5, 150, 105, 0.08);
        }
        .evp-quote-addon-chip.is-active .evp-quote-checkbox {
            background: #059669;
            border-color: #059669;
            color: #FFFFFF;
        }
        .evp-quote-addon-chip.is-active .evp-quote-checkbox i {
            opacity: 1;
            transform: scale(1);
        }
        .evp-quote-addon-info {
            display: flex;
            flex-direction: column;
            gap: 1px;
            min-width: 0;
            flex: 1;
        }
        .evp-quote-addon-text {
            font-size: 11.5px;
            font-weight: 800;
            color: #131330;
            line-height: 1.25;
        }
        .evp-quote-addon-rate {
            font-size: 10px;
            color: #64748B;
            font-weight: 600;
        }

        /* ── Step 5: Dynamic Summary Result Box ── */
        .evp-quote-summary-box {
            background: linear-gradient(135deg, #131330 0%, #1A1A40 100%);
            border-radius: 14px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 14px 16px;
            color: #FFFFFF;
            display: flex;
            flex-direction: column;
            gap: 10px;
            box-shadow: 0 8px 24px rgba(19, 19, 48, 0.22);
        }
        .evp-quote-metrics-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 8px;
            gap: 8px;
        }
        .evp-quote-metric-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .evp-quote-metric-sub {
            font-size: 10px;
            color: #94A3B8;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        .evp-quote-metric-val {
            font-size: 13px;
            font-weight: 800;
            color: #FFFFFF;
        }
        .evp-quote-capacity-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 7px;
            border-radius: 6px;
            font-size: 10.5px;
            font-weight: 800;
        }
        .evp-quote-capacity-badge.is-good {
            background: rgba(16, 185, 129, 0.2);
            color: #34D399;
        }
        .evp-quote-capacity-badge.is-tight {
            background: rgba(245, 158, 11, 0.2);
            color: #FBBF24;
        }
        .evp-quote-capacity-badge.is-over {
            background: rgba(239, 68, 68, 0.2);
            color: #F87171;
        }

        .evp-quote-price-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .evp-quote-price-label {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .evp-quote-price-title {
            font-size: 11px;
            color: #FFB703;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .evp-quote-price-disclaimer {
            font-size: 9.5px;
            color: #94A3B8;
            line-height: 1.3;
        }
        .evp-quote-price-val {
            font-size: 20px;
            font-weight: 800;
            color: #FFFFFF;
            letter-spacing: -0.3px;
            white-space: nowrap;
            text-align: right;
        }
        .evp-quote-price-val small {
            font-size: 10.5px;
            color: #94A3B8;
            font-weight: 600;
            display: block;
        }

        /* ── Footer Actions ── */
        .evp-quote-footer {
            padding: 12px 20px 14px;
            background: #FFFFFF;
            border-top: 1px solid #EEF2F6;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
        }
        .evp-quote-btn-whatsapp {
            flex: 1.6;
            background: #25D366;
            color: #FFFFFF;
            border: none;
            border-radius: 10px;
            padding: 10px 16px;
            font-family: inherit;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 180ms ease;
            box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3);
            text-decoration: none;
            white-space: nowrap;
        }
        .evp-quote-btn-whatsapp:hover {
            background: #20BA5A;
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(37, 211, 102, 0.4);
        }
        .evp-quote-btn-whatsapp i {
            font-size: 17px;
        }

        .evp-quote-btn-copy {
            flex: 1;
            background: #F8FAFC;
            color: #131330;
            border: 1px solid #E2E8F0;
            border-radius: 10px;
            padding: 10px 14px;
            font-family: inherit;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 180ms ease;
            white-space: nowrap;
        }
        .evp-quote-btn-copy:hover {
            background: #F1F5F9;
            border-color: #CBD5E1;
        }

        /* Toast */
        .evp-quote-toast {
            position: absolute;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: #131330;
            color: #FFFFFF;
            padding: 8px 16px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
            opacity: 0;
            visibility: hidden;
            transition: all 220ms ease;
            z-index: 20;
            pointer-events: none;
        }
        .evp-quote-toast.is-shown {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }

        /* ── Mobile Responsiveness ── */
        @media (max-width: 768px) {
            .evp-quote-modal {
                width: 95vw !important;
                max-height: 92vh !important;
                border-radius: 16px !important;
            }
            .evp-quote-header {
                padding: 12px 16px !important;
            }
            .evp-quote-title {
                font-size: 16px !important;
            }
            .evp-quote-body {
                padding: 12px 16px !important;
                gap: 12px !important;
            }
            .evp-quote-event-types {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 4px !important;
            }
            .evp-quote-type-btn {
                padding: 7px 4px !important;
            }
            .evp-quote-type-btn span {
                font-size: 10.5px !important;
            }
            .evp-quote-facilities {
                grid-template-columns: 1fr !important;
                gap: 6px !important;
            }
            .evp-quote-addons {
                grid-template-columns: 1fr !important;
                gap: 6px !important;
            }
            .evp-quote-summary-box {
                padding: 12px 14px !important;
            }
            .evp-quote-price-val {
                font-size: 17px !important;
            }
            .evp-quote-footer {
                padding: 10px 14px 12px !important;
                flex-direction: column !important;
                gap: 8px !important;
            }
            .evp-quote-btn-whatsapp,
            .evp-quote-btn-copy {
                width: 100% !important;
                flex: none !important;
            }
        }
    `;
    document.head.appendChild(styleEl);

    // ── Build Modal DOM ──
    const overlay = document.createElement("div");
    overlay.className = "evp-quote-overlay";
    overlay.id = "evp-quote-modal-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "EVP Event Cost and Hall Rental Estimator");

    overlay.innerHTML = `
        <div class="evp-quote-modal">
            <!-- Header -->
            <div class="evp-quote-header">
                <div class="evp-quote-header-left">
                    <div class="evp-quote-badge-row">
                        <span class="evp-quote-pill"><i class="fi fi-sr-calculator"></i> Approximate Estimator</span>
                        <span class="evp-quote-aprox-badge">Indicative Details</span>
                    </div>
                    <h2 class="evp-quote-title">Venue Cost &amp; Rental Estimator</h2>
                    <p class="evp-quote-subtitle">All capacities, dimensions &amp; pricing are approximate estimates for event planning</p>
                </div>
                <button type="button" class="evp-quote-close-btn" id="evp-quote-close-btn" aria-label="Close quote estimator">
                    <i class="fi fi-rr-cross-small" aria-hidden="true"></i>
                </button>
            </div>

            <!-- Scrollable Form Body -->
            <div class="evp-quote-body">
                <!-- 1. Event Type -->
                <div class="evp-quote-section">
                    <div class="evp-quote-sec-header">
                        <span class="evp-quote-sec-title"><span class="evp-quote-step-num">1</span> Event Category</span>
                    </div>
                    <div class="evp-quote-event-types" id="evp-quote-event-types">
                        <button type="button" class="evp-quote-type-btn is-active" data-type="Trade Expo">
                            <i class="fi fi-sr-shop"></i>
                            <span>Trade Expo</span>
                        </button>
                        <button type="button" class="evp-quote-type-btn" data-type="Corporate Summit">
                            <i class="fi fi-sr-briefcase"></i>
                            <span>Corporate</span>
                        </button>
                        <button type="button" class="evp-quote-type-btn" data-type="Luxury Wedding">
                            <i class="fi fi-sr-heart"></i>
                            <span>Wedding</span>
                        </button>
                        <button type="button" class="evp-quote-type-btn" data-type="Concert / Gala">
                            <i class="fi fi-sr-music"></i>
                            <span>Concert / Gala</span>
                        </button>
                    </div>
                </div>

                <!-- 2. Facility Selection -->
                <div class="evp-quote-section">
                    <div class="evp-quote-sec-header">
                        <span class="evp-quote-sec-title"><span class="evp-quote-step-num">2</span> Select Facilities Required</span>
                        <span class="evp-quote-sec-hint">Approx. Dimensions &amp; Capacities</span>
                    </div>
                    <div class="evp-quote-facilities" id="evp-quote-facilities-grid">
                        <!-- Populated dynamically via JS -->
                    </div>
                </div>

                <!-- 3. Attendance & Duration -->
                <div class="evp-quote-section">
                    <div class="evp-quote-sec-header">
                        <span class="evp-quote-sec-title"><span class="evp-quote-step-num">3</span> Expected Attendees &amp; Duration</span>
                    </div>
                    <div class="evp-quote-slider-row">
                        <div class="evp-quote-slider-labels">
                            <span style="font-size: 11.5px; font-weight: 700; color:#64748B;">Estimated Attendees (Approx.)</span>
                            <div class="evp-quote-slider-value">
                                <span id="evp-quote-pax-display">~2,500 Pax</span>
                            </div>
                        </div>
                        <input type="range" class="evp-quote-range" id="evp-quote-pax-range" min="300" max="15000" step="100" value="2500" />
                        
                        <div style="margin-top: 4px;">
                            <span style="font-size: 11px; font-weight: 700; color:#64748B; display:block; margin-bottom: 4px;">Approx. Event Duration</span>
                            <div class="evp-quote-days-row" id="evp-quote-days-row">
                                <button type="button" class="evp-quote-day-chip" data-days="1">1 Day</button>
                                <button type="button" class="evp-quote-day-chip is-active" data-days="2">2 Days</button>
                                <button type="button" class="evp-quote-day-chip" data-days="3">3 Days (~10% off)</button>
                                <button type="button" class="evp-quote-day-chip" data-days="4">4+ Days (~15% off)</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 4. Key Add-on Services -->
                <div class="evp-quote-section">
                    <div class="evp-quote-sec-header">
                        <span class="evp-quote-sec-title"><span class="evp-quote-step-num">4</span> Key Facility Inclusions &amp; Utilities (Optional)</span>
                        <span class="evp-quote-sec-hint">Approx. Day Rates</span>
                    </div>
                    <div class="evp-quote-addons" id="evp-quote-addons-grid">
                        <!-- Populated dynamically -->
                    </div>
                </div>

                <!-- 5. Dynamic Quote Result Summary -->
                <div class="evp-quote-summary-box">
                    <div class="evp-quote-metrics-row">
                        <div class="evp-quote-metric-item">
                            <span class="evp-quote-metric-sub">Approx. Floor Space</span>
                            <span class="evp-quote-metric-val" id="evp-summary-area">~54,144 sq. ft</span>
                        </div>
                        <div class="evp-quote-metric-item">
                            <span class="evp-quote-metric-sub">Capacity Check</span>
                            <div id="evp-summary-capacity">
                                <span class="evp-quote-capacity-badge is-good"><i class="fi fi-sr-check-circle"></i> Comfortable Capacity</span>
                            </div>
                        </div>
                        <div class="evp-quote-metric-item">
                            <span class="evp-quote-metric-sub">Approx. Duration</span>
                            <span class="evp-quote-metric-val" id="evp-summary-span">2 Days (Trade Expo)</span>
                        </div>
                    </div>

                    <div class="evp-quote-price-row">
                        <div class="evp-quote-price-label">
                            <span class="evp-quote-price-title">Approx. Indicative Rental Estimate</span>
                            <span class="evp-quote-price-disclaimer">*Ballpark estimate for preliminary planning. Excludes 18% GST. Final proposal subject to official dates &amp; requirements.</span>
                        </div>
                        <div class="evp-quote-price-val" id="evp-summary-price">
                            ~₹ 9.5L – ₹ 11.0L
                            <small>Approx. Base Venue Hire</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Actions -->
            <div class="evp-quote-footer">
                <a href="#" target="_blank" rel="noopener noreferrer" class="evp-quote-btn-whatsapp" id="evp-quote-btn-whatsapp">
                    <i class="fi fi-brands-whatsapp"></i>
                    <span>Check Date Availability via WhatsApp</span>
                </a>
                <button type="button" class="evp-quote-btn-copy" id="evp-quote-btn-copy">
                    <i class="fi fi-rr-copy"></i>
                    <span>Copy Approx. Estimate</span>
                </button>
            </div>

            <!-- Toast -->
            <div class="evp-quote-toast" id="evp-quote-toast">
                <i class="fi fi-rr-check" style="color:#10B981;"></i> Approximate estimate copied to clipboard!
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // ── State ──
    const state = {
        eventType: "Trade Expo",
        selectedFacilities: ["hall-a"],
        pax: 2500,
        days: 2,
        selectedAddons: ["ac", "power"]
    };

    // ── Render Facility Cards ──
    const facGrid = document.getElementById("evp-quote-facilities-grid");
    Object.values(VENUE_FACILITIES).forEach(fac => {
        const card = document.createElement("div");
        card.className = "evp-quote-fac-card" + (state.selectedFacilities.includes(fac.id) ? " is-selected" : "");
        card.setAttribute("data-id", fac.id);
        card.innerHTML = `
            <div class="evp-quote-checkbox"><i class="fi fi-rr-check"></i></div>
            <div class="evp-quote-fac-info">
                <span class="evp-quote-fac-name">${fac.name}</span>
                <span class="evp-quote-fac-meta">Approx. ${fac.sqft.toLocaleString()} sq. ft • Up to ~${fac.maxCapacity.toLocaleString()} Pax</span>
            </div>
        `;
        card.addEventListener("click", () => {
            if (state.selectedFacilities.includes(fac.id)) {
                // Prevent unselecting all facilities
                if (state.selectedFacilities.length > 1) {
                    state.selectedFacilities = state.selectedFacilities.filter(id => id !== fac.id);
                    card.classList.remove("is-selected");
                }
            } else {
                state.selectedFacilities.push(fac.id);
                card.classList.add("is-selected");
            }
            recalculateQuote();
        });
        facGrid.appendChild(card);
    });

    // ── Render Add-on Chips ──
    const addGrid = document.getElementById("evp-quote-addons-grid");
    Object.values(ADD_ONS).forEach(addon => {
        const chip = document.createElement("div");
        chip.className = "evp-quote-addon-chip" + (state.selectedAddons.includes(addon.id) ? " is-active" : "");
        chip.setAttribute("data-id", addon.id);
        chip.innerHTML = `
            <div class="evp-quote-checkbox"><i class="fi fi-rr-check"></i></div>
            <div class="evp-quote-addon-info">
                <span class="evp-quote-addon-text">${addon.name}</span>
                <span class="evp-quote-addon-rate">${addon.approxRateText}</span>
            </div>
        `;
        chip.addEventListener("click", () => {
            if (state.selectedAddons.includes(addon.id)) {
                state.selectedAddons = state.selectedAddons.filter(id => id !== addon.id);
                chip.classList.remove("is-active");
            } else {
                state.selectedAddons.push(addon.id);
                chip.classList.add("is-active");
            }
            recalculateQuote();
        });
        addGrid.appendChild(chip);
    });

    // ── Event Type Handler ──
    const typeButtons = document.querySelectorAll(".evp-quote-type-btn");
    typeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            typeButtons.forEach(b => b.classList.remove("is-active"));
            btn.classList.add("is-active");
            state.eventType = btn.getAttribute("data-type");
            recalculateQuote();
        });
    });

    // ── Pax Slider Handler ──
    const paxRange = document.getElementById("evp-quote-pax-range");
    const paxDisplay = document.getElementById("evp-quote-pax-display");
    paxRange.addEventListener("input", (e) => {
        state.pax = parseInt(e.target.value, 10);
        paxDisplay.textContent = state.pax >= 15000 ? "15,000+ Pax (Approx.)" : `~${state.pax.toLocaleString()} Pax`;
        recalculateQuote();
    });

    // ── Duration Handler ──
    const dayChips = document.querySelectorAll(".evp-quote-day-chip");
    dayChips.forEach(chip => {
        chip.addEventListener("click", () => {
            dayChips.forEach(c => c.classList.remove("is-active"));
            chip.classList.add("is-active");
            state.days = parseInt(chip.getAttribute("data-days"), 10);
            recalculateQuote();
        });
    });

    // ── Calculation Logic ──
    function recalculateQuote() {
        let totalSqFt = 0;
        let totalDailyBase = 0;
        let maxCombinedPax = 0;

        // Sum facilities
        state.selectedFacilities.forEach(id => {
            const fac = VENUE_FACILITIES[id];
            if (fac) {
                totalSqFt += fac.sqft;
                totalDailyBase += fac.baseRatePerDay;
                maxCombinedPax += fac.maxCapacity;
            }
        });

        // Sum add-ons
        let totalAddonsDaily = 0;
        state.selectedAddons.forEach(id => {
            const add = ADD_ONS[id];
            if (add) {
                totalAddonsDaily += add.ratePerDay;
            }
        });

        // Multi-day discount
        const discountRate = getDurationDiscount(state.days);
        const dailyGross = totalDailyBase + totalAddonsDaily;
        const totalBaseBeforeDiscount = dailyGross * state.days;
        const netTotal = totalBaseBeforeDiscount * (1 - discountRate);

        // Low and High Range (±8% buffer for variation in setup days/timings)
        const lowEst = netTotal * 0.92;
        const highEst = netTotal * 1.08;

        // Format to Lakhs / Crores
        function formatINR(val) {
            if (val >= 10000000) {
                return "₹ " + (val / 10000000).toFixed(2) + " Cr";
            }
            return "₹ " + (val / 100000).toFixed(1) + "L";
        }

        // Update DOM
        const areaEl = document.getElementById("evp-summary-area");
        const spanEl = document.getElementById("evp-summary-span");
        const capEl = document.getElementById("evp-summary-capacity");
        const priceEl = document.getElementById("evp-summary-price");

        if (areaEl) areaEl.textContent = `~${totalSqFt.toLocaleString()} sq. ft`;
        if (spanEl) spanEl.textContent = `${state.days} Day${state.days > 1 ? "s" : ""} • ${state.eventType}`;

        // Capacity Health Status
        if (capEl) {
            if (state.pax > maxCombinedPax * 1.15) {
                capEl.innerHTML = `<span class="evp-quote-capacity-badge is-over"><i class="fi fi-sr-exclamation"></i> Overcrowded (~${state.pax.toLocaleString()} Pax > ~${maxCombinedPax.toLocaleString()} Cap)</span>`;
            } else if (state.pax > maxCombinedPax * 0.85) {
                capEl.innerHTML = `<span class="evp-quote-capacity-badge is-tight"><i class="fi fi-sr-info"></i> High Density (~${maxCombinedPax.toLocaleString()} Max)</span>`;
            } else {
                capEl.innerHTML = `<span class="evp-quote-capacity-badge is-good"><i class="fi fi-sr-check-circle"></i> Comfortable Capacity (~${maxCombinedPax.toLocaleString()} Max)</span>`;
            }
        }

        if (priceEl) {
            priceEl.innerHTML = `~${formatINR(lowEst)} – ${formatINR(highEst)}<small>Approx. Base Venue Hire</small>`;
        }

        // WhatsApp Link Generator
        updateWhatsAppLink(lowEst, highEst, totalSqFt);
    }

    // ── WhatsApp & Clipboard Formatting ──
    function getSummaryText(lowEst, highEst, totalSqFt) {
        function formatLakhs(val) {
            if (val >= 10000000) return "₹ " + (val / 10000000).toFixed(2) + " Cr";
            return "₹ " + (val / 100000).toFixed(1) + " Lakhs";
        }

        const facNames = state.selectedFacilities.map(id => VENUE_FACILITIES[id] ? VENUE_FACILITIES[id].name : id).join(", ");
        const addonNames = state.selectedAddons.length > 0 
            ? state.selectedAddons.map(id => ADD_ONS[id] ? ADD_ONS[id].name : id).join(", ")
            : "Standard Facility Package";

        return (
            `*EVP Trade & Convention Centre — Indicative Event Quote Inquiry*\n` +
            `• *Event Category:* ${state.eventType}\n` +
            `• *Selected Facilities:* ${facNames}\n` +
            `• *Approx. Total Floor Area:* ~${totalSqFt.toLocaleString()} sq. ft\n` +
            `• *Approx. Expected Guests:* ${state.pax >= 15000 ? "15,000+" : "~" + state.pax.toLocaleString()} Pax\n` +
            `• *Approx. Event Duration:* ${state.days} Day${state.days > 1 ? "s" : ""}\n` +
            `• *Inclusions & Add-ons:* ${addonNames}\n` +
            `• *Approx. Estimated Budget:* ~${formatLakhs(lowEst)} – ${formatLakhs(highEst)} (Base Venue Hire, Excl. GST)\n\n` +
            `_Note: These figures are approximate estimates configured via the 360 Virtual Tour._\n` +
            `Could you please check venue date availability for our tentative dates [Enter Dates Here]?`
        );
    }

    function updateWhatsAppLink(lowEst, highEst, totalSqFt) {
        const waBtn = document.getElementById("evp-quote-btn-whatsapp");
        if (!waBtn) return;

        const summaryText = getSummaryText(lowEst, highEst, totalSqFt);
        const encoded = encodeURIComponent(
            `Hello EVP Trade Centre Sales Team! 👋\n\nI just configured an indicative estimate on your 360 Virtual Tour:\n\n${summaryText}`
        );
        waBtn.href = `https://wa.me/918525811111?text=${encoded}`;
    }

    // ── Copy Quote Button ──
    const copyBtn = document.getElementById("evp-quote-btn-copy");
    const toast = document.getElementById("evp-quote-toast");
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            // Recompute values
            let totalSqFt = 0;
            let totalDailyBase = 0;
            state.selectedFacilities.forEach(id => {
                const fac = VENUE_FACILITIES[id];
                if (fac) {
                    totalSqFt += fac.sqft;
                    totalDailyBase += fac.baseRatePerDay;
                }
            });
            let totalAddonsDaily = 0;
            state.selectedAddons.forEach(id => {
                const add = ADD_ONS[id];
                if (add) totalAddonsDaily += add.ratePerDay;
            });
            const discountRate = getDurationDiscount(state.days);
            const netTotal = (totalDailyBase + totalAddonsDaily) * state.days * (1 - discountRate);

            const text = getSummaryText(netTotal * 0.92, netTotal * 1.08, totalSqFt);

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(showToast);
            } else {
                const ta = document.createElement("textarea");
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
                showToast();
            }
        });
    }

    function showToast() {
        if (!toast) return;
        toast.classList.add("is-shown");
        setTimeout(() => toast.classList.remove("is-shown"), 2400);
    }

    // ── Modal Open / Close Controller ──
    function openQuoteEstimator(options) {
        // If a specific hall is passed, pre-select it
        if (options && options.hall) {
            const hallIdMap = {
                "Hall A": "hall-a",
                "Hall B": "hall-b",
                "Hall C": "hall-c",
                "Hall D": "hall-d"
            };
            const mappedId = hallIdMap[options.hall] || options.hall;
            if (VENUE_FACILITIES[mappedId]) {
                state.selectedFacilities = [mappedId];
                document.querySelectorAll(".evp-quote-fac-card").forEach(c => {
                    const id = c.getAttribute("data-id");
                    c.classList.toggle("is-selected", id === mappedId);
                });
            }
        }

        recalculateQuote();
        overlay.classList.add("is-open");
        document.body.classList.add("is-quote-open");
    }

    function closeQuoteEstimator() {
        overlay.classList.remove("is-open");
        document.body.classList.remove("is-quote-open");
    }

    // Close on button click
    const closeBtn = document.getElementById("evp-quote-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", closeQuoteEstimator);

    // Close on backdrop click
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeQuoteEstimator();
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("is-open")) {
            closeQuoteEstimator();
        }
    });

    // ── Expose Globally ──
    window.openQuoteEstimator = openQuoteEstimator;
    window.closeQuoteEstimator = closeQuoteEstimator;
    window.evpQuoteEstimator = {
        open: openQuoteEstimator,
        close: closeQuoteEstimator,
        setFacilities: (facs) => { state.selectedFacilities = facs; recalculateQuote(); }
    };

    // Initial calculation
    recalculateQuote();

})();
