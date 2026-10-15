// ═══════════════════════════════════════════════════════════════════════
//  EVP TRADE & CONVENTION CENTRE — VENUE DIRECTION & TRANSIT HUB
//  White Frosted Glassmorphism with EVP Imperial Gold & Obsidian styling:
//  • Live GPS & Accuracy tracking with Haversine distance & compass bearing
//  • Dynamic driving & walking ETA with wall-clock arrival calculation
//  • Smart venue search & category filtering (Halls, Pavilion, Dining, Outdoor, Amenities)
//  • Official EVP convention venue destination cards linked to 360° panoramas
//  • 4-Stat metric inspection drawer (Distance, ETA, Arrival, Accuracy)
//  • Desktop-to-Phone QR Scan-to-Drive modal (QRCode.js)
//  • Native OS Deep Linking (Android Intent, Apple Maps, Google Maps)
//  • Direct 360° Panorama exploration jump bridge
// ═══════════════════════════════════════════════════════════════════════

(function () {
    "use strict";

    // ── Primary Venue Coordinates & Meta ──────────────────────────────
    const VENUE_LAT = 13.036611510717783;
    const VENUE_LNG = 80.04798908216767;
    const VENUE_NAME = "EVP Trade & Convention Centre";
    const VENUE_ADDRESS = "Chennai – Bengaluru National Highway, Chembarambakkam, Poonamallee, Chennai – 600123";
    const VENUE_GMAPS_LINK = "https://www.google.com/maps/search/?api=1&query=EVP+Trade+and+Convention+Centre+Chennai";

    // ── EVP Venue Destinations Dataset ────────────────────────────────
const EVP_DESTINATIONS = [
        {
                "id": 1,
                "name": "Entrance Plaza & Foyer",
                "area": "Main Welcome Concourse & Visitor Registration Desks (20,300 sq. ft.)",
                "category": "pavilion",
                "categoryLabel": "Arrival & Foyer",
                "isIndoor": true,
                "lat": 13.036611510717783,
                "lng": 80.04798908216767,
                "icon": "fi fi-sr-archway",
                "panoKey": "Entrance Plaza & Foyer",
                "povId": null,
                "tags": [
                        "entrance",
                        "plaza",
                        "registration",
                        "foyer",
                        "reception",
                        "arrival",
                        "lobby",
                        "concourse",
                        "indoor"
                ]
        },
        {
                "id": 2,
                "name": "Exhibition Hall A",
                "area": "Pillarless Exhibition Hall — 54,144 sq. ft. | 9.7m–15m Height | 5T/m² Floor Load",
                "category": "halls",
                "categoryLabel": "Exhibition Halls",
                "isIndoor": true,
                "lat": 13.03445852239869,
                "lng": 80.04703725458211,
                "icon": "fi fi-sr-building",
                "panoKey": "Hall A - Classroom",
                "povId": null,
                "tags": [
                        "hall a",
                        "exhibition hall a",
                        "trade show",
                        "pillarless",
                        "expo",
                        "300 tr",
                        "floor load 5t",
                        "indoor",
                        "mega hall"
                ]
        },
        {
                "id": 3,
                "name": "Exhibition Hall B",
                "area": "Pillarless Exhibition Hall — 54,144 sq. ft. | 9.7m–15m Height | 252 Rigging Points",
                "category": "halls",
                "categoryLabel": "Exhibition Halls",
                "isIndoor": true,
                "lat": 13.034988852742798,
                "lng": 80.04755151490868,
                "icon": "fi fi-sr-building",
                "panoKey": "Hall B - Classroom",
                "povId": null,
                "tags": [
                        "hall b",
                        "exhibition hall b",
                        "trade show",
                        "pillarless",
                        "expo",
                        "conventions",
                        "machinery",
                        "indoor",
                        "mega hall"
                ]
        },
        {
                "id": 4,
                "name": "Exhibition Hall C",
                "area": "Pillarless Exhibition Hall — 54,144 sq. ft. | 9.7m–15m Height | 7 Fire Exits",
                "category": "halls",
                "categoryLabel": "Exhibition Halls",
                "isIndoor": true,
                "lat": 13.035953142758052,
                "lng": 80.04789375882515,
                "icon": "fi fi-sr-building",
                "panoKey": "Hall C - Classroom",
                "povId": null,
                "tags": [
                        "hall c",
                        "exhibition hall c",
                        "trade show",
                        "pillarless",
                        "expo",
                        "heavy display",
                        "industrial",
                        "indoor",
                        "mega hall"
                ]
        },
        {
                "id": 5,
                "name": "Exhibition Hall D",
                "area": "Widest 45m Clear Span Hall — 47,762 sq. ft. | 9.7m–15m Height | 231 Rigging Points",
                "category": "halls",
                "categoryLabel": "Exhibition Halls",
                "isIndoor": true,
                "lat": 13.02965,
                "lng": 80.0119,
                "icon": "fi fi-sr-building",
                "panoKey": "Hall D - Classroom",
                "povId": null,
                "tags": [
                        "hall d",
                        "exhibition hall d",
                        "trade show",
                        "pillarless",
                        "expo",
                        "summit",
                        "plenary",
                        "widest hall",
                        "indoor"
                ]
        },
        {
                "id": 6,
                "name": "Inter-Hall Covered Connection",
                "area": "Weather-Protected Central Transit Spine Linking Halls A, B, C & D (10,220 sq. ft.)",
                "category": "halls",
                "categoryLabel": "Exhibition Halls",
                "isIndoor": true,
                "lat": 13.0294,
                "lng": 80.0116,
                "icon": "fi fi-sr-arrows-repeat",
                "panoKey": "Inter-Hall Covered Connection",
                "povId": null,
                "tags": [
                        "inter-hall",
                        "connection",
                        "spine",
                        "concourse",
                        "walkway",
                        "covered corridor",
                        "indoor",
                        "transit"
                ]
        },
        {
                "id": 7,
                "name": "Executive Hospitality Pavilion",
                "area": "VIP Business Delegation & Dignitary Hospitality Wing",
                "category": "pavilion",
                "categoryLabel": "Executive Pavilion",
                "isIndoor": true,
                "lat": 13.0291,
                "lng": 80.0111,
                "icon": "fi fi-sr-briefcase",
                "panoKey": "Executive Hospitality Pavilion",
                "povId": null,
                "tags": [
                        "executive pavilion",
                        "hospitality",
                        "vip wing",
                        "delegation",
                        "business lounge",
                        "dignitaries",
                        "indoor"
                ]
        },
        {
                "id": 8,
                "name": "Corporate Boardroom",
                "area": "12-Seater Flagship Presidential Chamber with Executive Conference Hub (120 m²)",
                "category": "pavilion",
                "categoryLabel": "Executive Pavilion",
                "isIndoor": true,
                "lat": 13.02912,
                "lng": 80.01112,
                "icon": "fi fi-sr-user-tie",
                "panoKey": "Corporate Boardroom",
                "povId": null,
                "tags": [
                        "corporate boardroom",
                        "boardroom",
                        "presidential",
                        "executive",
                        "meeting",
                        "conference",
                        "indoor"
                ]
        },
        {
                "id": 9,
                "name": "Executive Meeting Room",
                "area": "6-Seater Smart Hybrid Video-Conference Suite with 4K Interactive PTZ Hub",
                "category": "pavilion",
                "categoryLabel": "Executive Pavilion",
                "isIndoor": true,
                "lat": 13.02913,
                "lng": 80.01113,
                "icon": "fi fi-sr-screen",
                "panoKey": "Executive Meeting Room",
                "povId": null,
                "tags": [
                        "executive meeting room",
                        "smart suite",
                        "video conference",
                        "hybrid meeting",
                        "screen",
                        "indoor"
                ]
        },
        {
                "id": 10,
                "name": "VIP Lounge",
                "area": "Luxury Hospitality Enclave with Private Butler Station & Restroom (195 m²)",
                "category": "pavilion",
                "categoryLabel": "Executive Pavilion",
                "isIndoor": true,
                "lat": 13.02914,
                "lng": 80.01114,
                "icon": "fi fi-sr-crown",
                "panoKey": "VIP Lounge",
                "povId": null,
                "tags": [
                        "vip lounge",
                        "luxury enclave",
                        "butler station",
                        "hospitality",
                        "high profile",
                        "indoor"
                ]
        },
        {
                "id": 11,
                "name": "Private Meeting Suites",
                "area": "4 Dedicated Soundproof Acoustic Rooms (16 Capacity) for B2B Bilateral Deals",
                "category": "pavilion",
                "categoryLabel": "Executive Pavilion",
                "isIndoor": true,
                "lat": 13.02915,
                "lng": 80.01115,
                "icon": "fi fi-sr-users",
                "panoKey": "Private Meeting Suites",
                "povId": null,
                "tags": [
                        "private meeting suites",
                        "b2b",
                        "acoustic rooms",
                        "bilateral deals",
                        "suites",
                        "indoor"
                ]
        },
        {
                "id": 12,
                "name": "Co-Working Lounge",
                "area": "35-Desk Collaboration Hub with High-Density Charging & Wi-Fi 6 (240 m²)",
                "category": "pavilion",
                "categoryLabel": "Executive Pavilion",
                "isIndoor": true,
                "lat": 13.02916,
                "lng": 80.01116,
                "icon": "fi fi-sr-laptop",
                "panoKey": "Co-Working Lounge",
                "povId": null,
                "tags": [
                        "co-working",
                        "business lounge",
                        "workstations",
                        "collaboration",
                        "wifi 6",
                        "indoor"
                ]
        },
        {
                "id": 13,
                "name": "Curated Café Area",
                "area": "Specialty Barista Espresso Setup, Artisan Teas & Refreshment Bar (160 m²)",
                "category": "dining",
                "categoryLabel": "Dining & Hotel",
                "isIndoor": true,
                "lat": 13.02892,
                "lng": 80.01138,
                "icon": "fi fi-sr-coffee",
                "panoKey": "Curated Café Area",
                "povId": null,
                "tags": [
                        "curated cafe",
                        "bistro",
                        "coffee",
                        "espresso",
                        "barista",
                        "refreshment bar",
                        "indoor"
                ]
        },
        {
                "id": 14,
                "name": "Food Court",
                "area": "14 Modular Commercial Culinary Kiosks — 3,000+ Meals/hr (17,300 sq. ft.)",
                "category": "dining",
                "categoryLabel": "Dining & Hotel",
                "isIndoor": true,
                "lat": 13.0289,
                "lng": 80.0114,
                "icon": "fi fi-sr-restaurant",
                "panoKey": "Food Court",
                "povId": null,
                "tags": [
                        "food court",
                        "dining",
                        "culinary kiosks",
                        "f&b",
                        "meals",
                        "restaurant",
                        "indoor"
                ]
        },
        {
                "id": 15,
                "name": "Food Court Dining Area",
                "area": "800+ Seated Guests Dining Pavilion & Buffet Banquets (9,064 sq. ft.)",
                "category": "dining",
                "categoryLabel": "Dining & Hotel",
                "isIndoor": true,
                "lat": 13.02895,
                "lng": 80.01142,
                "icon": "fi fi-sr-utensils",
                "panoKey": "Food Court Dining Area",
                "povId": null,
                "tags": [
                        "food court dining",
                        "seating area",
                        "buffet",
                        "banquets",
                        "tables",
                        "dining pavilion",
                        "indoor"
                ]
        },
        {
                "id": 16,
                "name": "On-Site Hotel",
                "area": "60 Dedicated Guest Rooms (30 Double + 30 Triple) | 150–180 Overnight Capacity",
                "category": "dining",
                "categoryLabel": "Dining & Hotel",
                "isIndoor": true,
                "lat": 13.0286,
                "lng": 80.0116,
                "icon": "fi fi-sr-bed",
                "panoKey": "On-Site Hotel",
                "povId": null,
                "tags": [
                        "hotel",
                        "guest rooms",
                        "accommodation",
                        "overnight stay",
                        "suites",
                        "lodging",
                        "indoor"
                ]
        },
        {
                "id": 17,
                "name": "Washroom & Amenity Area",
                "area": "Executive Sanitation: 79+ Urinals, 84+ Cubicles, Vanities & Universal Restrooms",
                "category": "amenities",
                "categoryLabel": "Sanitation & Services",
                "isIndoor": true,
                "lat": 13.029,
                "lng": 80.0109,
                "icon": "fi fi-sr-sparkles",
                "panoKey": "Washroom/Amenity Area",
                "povId": null,
                "tags": [
                        "washroom complex",
                        "restrooms",
                        "toilets",
                        "amenities",
                        "sanitation",
                        "cubicles",
                        "indoor"
                ]
        },
        {
                "id": 18,
                "name": "Grand Arrival Gate",
                "area": "Grand Highway Arch on NH-48 — 42'-10\" Height | 29'-6\" Width Clearance",
                "category": "gates",
                "categoryLabel": "Gates & Approach",
                "isIndoor": false,
                "lat": 13.036611510717783,
                "lng": 80.04798908216767,
                "icon": "fi fi-sr-archway",
                "panoKey": null,
                "povId": "arrival-gate",
                "tags": [
                        "grand arrival gate",
                        "gate 1",
                        "main entrance gate",
                        "highway arch",
                        "nh-48",
                        "ingress portal",
                        "outdoor"
                ]
        },
        {
                "id": 19,
                "name": "Internal Driveways",
                "area": "Heavy-Duty 8m Concreted Roadway Network Across Campus with Landscaped Dividers",
                "category": "grounds",
                "categoryLabel": "Campus Grounds",
                "isIndoor": false,
                "lat": 13.0285,
                "lng": 80.011,
                "icon": "fi fi-sr-road",
                "panoKey": null,
                "povId": "driveway-network",
                "tags": [
                        "internal driveways",
                        "driveway network",
                        "8m road",
                        "campus roadway",
                        "main spine",
                        "outdoor"
                ]
        },
        {
                "id": 20,
                "name": "Outdoor Canvas 1",
                "area": "Reinforced Concrete Display Arena — 95m × 32m (93,980 sq. ft.) | 15,000 Capacity",
                "category": "outdoor",
                "categoryLabel": "Outdoor Arenas",
                "isIndoor": false,
                "lat": 13.0298,
                "lng": 80.0112,
                "icon": "fi fi-sr-layer-group",
                "panoKey": null,
                "povId": "canvas1",
                "tags": [
                        "outdoor canvas 1",
                        "canvas 1",
                        "open arena",
                        "heavy machinery",
                        "display arena",
                        "concrete floor",
                        "outdoor"
                ]
        },
        {
                "id": 21,
                "name": "Outdoor Canvas 2",
                "area": "Stadium-Scale Production Arena — 227m × 50m (1,89,564 sq. ft.) | 30,000 Capacity",
                "category": "outdoor",
                "categoryLabel": "Outdoor Arenas",
                "isIndoor": false,
                "lat": 13.0281,
                "lng": 80.0125,
                "icon": "fi fi-sr-music",
                "panoKey": null,
                "povId": "canvas2",
                "tags": [
                        "outdoor canvas 2",
                        "canvas 2",
                        "concert ground",
                        "festival ground",
                        "mega stadium",
                        "open ground",
                        "outdoor"
                ]
        },
        {
                "id": 22,
                "name": "Parking Zone 1",
                "area": "5 Entry/Exit Points Directly Opposite Exhibition Halls A–D (Trade Hall Parking)",
                "category": "parking",
                "categoryLabel": "Parking Bays",
                "isIndoor": false,
                "lat": 13.035238604004954,
                "lng": 80.04846145726795,
                "icon": "fi fi-sr-parking",
                "panoKey": null,
                "povId": "parking1",
                "tags": [
                        "parking zone 1",
                        "parking 1",
                        "hall parking",
                        "vehicle parking",
                        "trade halls parking",
                        "outdoor"
                ]
        },
        {
                "id": 23,
                "name": "Parking Zone 2",
                "area": "4 Entry/Exit Points Adjacent to Entrance Plaza (Convertible Open Event Ground)",
                "category": "parking",
                "categoryLabel": "Parking Bays",
                "isIndoor": false,
                "lat": 13.02835,
                "lng": 80.01045,
                "icon": "fi fi-sr-parking",
                "panoKey": null,
                "povId": "parking2",
                "tags": [
                        "parking zone 2",
                        "parking 2",
                        "visitor parking",
                        "plaza parking",
                        "car park",
                        "outdoor"
                ]
        },
        {
                "id": 24,
                "name": "Venue Perimeter",
                "area": "Continuous Green Buffer, Perimeter Security Walls & Campus Boundary Landscaping",
                "category": "gates",
                "categoryLabel": "Gates & Approach",
                "isIndoor": false,
                "lat": 13.0279,
                "lng": 80.0109,
                "icon": "fi fi-sr-trees",
                "panoKey": null,
                "povId": "perimeter",
                "tags": [
                        "venue perimeter",
                        "perimeter",
                        "venue boundary",
                        "landscaping",
                        "security wall",
                        "buffer zone",
                        "outdoor"
                ]
        }
];

    const PCIS_DESTINATIONS = EVP_DESTINATIONS; // Backward compatibility alias
    window.EVP_DESTINATIONS = EVP_DESTINATIONS;

    // ── Navigation Math & Utilities (Haversine & Deep Links) ───────────
    function toRad(deg) { return deg * (Math.PI / 180); }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function calculateETA(distanceKm) {
        if (!distanceKm || isNaN(distanceKm)) return 0;
        if (distanceKm < 1) {
            return Math.max(1, Math.round((distanceKm / 4.5) * 60));
        }
        return Math.max(2, Math.round((distanceKm / 40) * 60));
    }

    function formatDistance(km) {
        if (km === null || km === undefined || isNaN(km)) return "--";
        if (km < 1) return `${Math.round(km * 1000)} m`;
        return `${km.toFixed(1)} km`;
    }

    function formatETA(minutes) {
        if (!minutes || isNaN(minutes)) return "--";
        if (minutes < 60) return `${minutes} min`;
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
    }

    function formatArrival(minutes) {
        if (!minutes || isNaN(minutes)) return "--";
        const d = new Date(Date.now() + minutes * 60000);
        let hours = d.getHours();
        const mins = String(d.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${mins} ${ampm}`;
    }

    function formatAccuracy(meters, verbose = false) {
        if (!meters || isNaN(meters)) return "Good";
        if (meters >= 1000) {
            const km = Math.round(meters / 1000);
            return verbose ? `±${km} km (Coarse)` : `±${km} km`;
        }
        return `±${Math.round(meters)}m`;
    }

    function calculateBearing(lat1, lng1, lat2, lng2) {
        const dLng = toRad(lng2 - lng1);
        const y = Math.sin(dLng) * Math.cos(toRad(lat2));
        const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
                  Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
        const bearing = Math.atan2(y, x) * (180 / Math.PI);
        return (bearing + 360) % 360;
    }

    function compassDirection(degrees) {
        if (degrees === null || degrees === undefined || isNaN(degrees)) return "";
        const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                      "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return dirs[Math.round(((degrees % 360) + 360) % 360 / 22.5) % 16];
    }

    const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = () => /Android/.test(navigator.userAgent);

    function getNavigationUrl(dest, userCoords) {
        if (isAndroid()) {
            const webUrl = encodeURIComponent(`https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}`);
            if (userCoords) {
                return `intent://maps.google.com/maps?saddr=${userCoords.lat},${userCoords.lng}&daddr=${dest.lat},${dest.lng}#Intent;scheme=https;package=com.google.android.apps.maps;S.browser_fallback_url=${webUrl};end`;
            }
            return `intent://maps.google.com/maps?daddr=${dest.lat},${dest.lng}#Intent;scheme=https;package=com.google.android.apps.maps;S.browser_fallback_url=${webUrl};end`;
        }
        if (isIOS()) {
            if (userCoords) {
                return `http://maps.apple.com/?saddr=${userCoords.lat},${userCoords.lng}&daddr=${dest.lat},${dest.lng}&dirflg=d`;
            }
            return `http://maps.apple.com/?daddr=${dest.lat},${dest.lng}&dirflg=d`;
        }
        // Universal Web Google Maps
        if (userCoords) {
            return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${dest.lat},${dest.lng}&travelmode=driving`;
        }
        return `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}&travelmode=driving`;
    }

    // ── Dynamic QRCode.js Loader ──────────────────────────────────────
    function ensureQRCode(callback) {
        if (window.QRCode) {
            if (callback) callback();
            return;
        }
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
        s.async = true;
        s.onload = () => { if (callback) callback(); };
        s.onerror = () => { console.warn("[Location] QRCode library failed to load"); };
        document.head.appendChild(s);
    }

    // ── Inject Component Styles (EVP Glassmorphism System) ────────────
    const style = document.createElement("style");
    style.id = "evp-location-hub-styles";
    style.textContent = `
        #location-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(19, 19, 48, 0.42);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            z-index: 100070;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.32s ease;
        }
        #location-backdrop.show {
            opacity: 1;
            pointer-events: auto;
        }

        #location-container {
            position: fixed;
            inset: 0;
            z-index: 100072;
            display: flex !important;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.32s ease, visibility 0.32s ease;
        }
        #location-container.show {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        .location-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.96);
            z-index: 100075;
            width: 700px;
            max-width: 94vw;
            height: min(720px, 88vh);
            max-height: 740px;
            background: #FFFFFF;
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.85);
            box-shadow:
                0 32px 80px -16px rgba(19, 19, 48, 0.28),
                0 0 0 1px rgba(19, 19, 48, 0.06);
            opacity: 0;
            transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: 'Satoshi', -apple-system, sans-serif;
            color: #131330;
        }

        #location-container.show .location-modal {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }

        /* Auto-fit modal height in Detail View (Zero bottom gap) */
        .location-modal.drawer-open {
            height: auto !important;
            max-height: 88vh;
        }
        .location-modal.drawer-open .loc-header,
        .location-modal.drawer-open .loc-scroll-area {
            display: none !important;
        }
        .location-modal.drawer-open .loc-detail-drawer {
            position: relative !important;
            inset: auto !important;
            transform: none !important;
            height: auto !important;
            max-height: 88vh;
            overflow: visible;
            animation: locDrawerFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes locDrawerFadeIn {
            from {
                opacity: 0;
                transform: translateY(6px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* ── Header ─────────────────────────────────────────── */
        .loc-header {
            padding: 16px 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%);
            border-bottom: 1px solid rgba(19, 19, 48, 0.08);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            backdrop-filter: blur(20px);
            z-index: 10;
        }
        .loc-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
        }
        .loc-header-icon {
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
        .loc-header-titles h3 {
            margin: 0;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 17px;
            font-weight: 800;
            color: #131330;
            letter-spacing: -0.01em;
            line-height: 1.2;
        }
        .loc-header-titles p {
            margin: 2px 0 0 0;
            font-size: 12px;
            color: #64748B;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Red Circular 360° Hover-Spin Close Button */
        .loc-close {
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
            flex-shrink: 0;
            outline: none;
            transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
            -webkit-tap-highlight-color: transparent;
        }
        .loc-close:hover {
            background: #DC2626;
            transform: rotate(360deg);
        }
        .loc-close:active {
            transform: rotate(360deg) scale(0.92);
        }
        .loc-close i {
            font-size: 16px;
            line-height: 1;
            color: #FFFFFF;
            pointer-events: none;
        }

        /* ── Scrollable Body Area ────────────────────────────── */
        .loc-scroll-area {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            background: #F8FAFC;
            display: flex;
            flex-direction: column;
            scroll-behavior: smooth;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .loc-scroll-area::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
        }

        /* ── Compact Map Banner ──────────────────────────────── */
        .loc-map-strip {
            position: relative;
            width: 100%;
            height: 250px;
            background: #E2E8F0;
            flex-shrink: 0;
            overflow: hidden;
            border-bottom: 1px solid rgba(19, 19, 48, 0.08);
        }
        .loc-map-strip iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        .loc-map-overlay-badge {
            position: absolute;
            bottom: 12px;
            left: 14px;
            background: rgba(19, 19, 48, 0.88);
            backdrop-filter: blur(12px);
            color: #FFFFFF;
            border-radius: 20px;
            padding: 6px 14px;
            font-size: 12px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 7px;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
            pointer-events: none;
        }
        .loc-map-overlay-badge i { color: #38BDF8; font-size: 12px; }

        /* ── Live GPS Watchdog Bar ────────────────────────────── */
        .loc-gps-bar {
            padding: 10px 20px;
            background: #FFFFFF;
            border-bottom: 1px solid #EEF2F6;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-shrink: 0;
        }
        .loc-gps-status {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13.5px;
            font-weight: 600;
            color: #1E293B;
        }
        .loc-gps-pulse {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #94A3B8;
            flex-shrink: 0;
        }
        .loc-gps-pulse.active {
            background: #16A34A;
            box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.2);
            animation: locPulse 1.8s infinite;
        }
        @keyframes locPulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.5); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
        }

        .loc-nearest-toggle {
            background: #F1F5F9;
            border: 1px solid #E2E8F0;
            color: #131330;
            border-radius: 20px;
            padding: 6px 14px;
            font-size: 12.5px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
        }
        .loc-nearest-toggle:hover {
            background: #E2E8F0;
        }
        .loc-nearest-toggle.active {
            background: #131330;
            border-color: #131330;
            color: #FFB703;
        }

        /* ── Controls: Search & Category Chips ────────────────── */
        .loc-controls {
            padding: 16px 20px 8px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: #F8FAFC;
        }
        .loc-search-box {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
        }
        .loc-search-box i {
            position: absolute;
            left: 14px;
            color: #64748B;
            font-size: 14px;
            pointer-events: none;
        }
        .loc-search-input {
            width: 100%;
            height: 44px;
            padding: 0 16px 0 40px;
            background: #FFFFFF;
            border: 1.5px solid #E2E8F0;
            border-radius: 12px;
            font-size: 13.5px;
            font-family: inherit;
            color: #131330;
            outline: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .loc-search-input:focus {
            border-color: #FFB703;
            box-shadow: 0 0 0 3px rgba(255, 183, 3, 0.2);
        }

        /* Filter Chips */
        .loc-filter-chips {
            display: flex;
            align-items: center;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 4px;
            scrollbar-width: none;
        }
        .loc-filter-chips::-webkit-scrollbar { display: none; }
        .loc-chip {
            padding: 6px 14px;
            border-radius: 20px;
            border: 1px solid #E2E8F0;
            background: #FFFFFF;
            color: #475569;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
        }
        .loc-chip:hover {
            border-color: #FFB703;
            color: #131330;
        }
        .loc-chip.active {
            background: #131330;
            border-color: #131330;
            color: #FFB703;
            box-shadow: 0 2px 8px rgba(19, 19, 48, 0.25);
        }

        /* ── Destinations Grid ────────────────────────────────── */
        .loc-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            padding: 8px 20px 24px;
        }

        .loc-card {
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 16px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 12px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .loc-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 16px;
            width: 32px;
            height: 3px;
            background: #FFB703;
            border-radius: 0 0 3px 3px;
            opacity: 0.6;
            transition: width 0.2s ease, opacity 0.2s ease;
        }
        .loc-card:hover {
            transform: translateY(-2px);
            border-color: rgba(255, 183, 3, 0.6);
            box-shadow: 0 10px 24px -4px rgba(19, 19, 48, 0.12);
        }
        .loc-card:hover::before {
            width: 54px;
            opacity: 1;
        }

        .loc-card-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 10px;
        }
        .loc-card-iconbox {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: rgba(255, 183, 3, 0.12);
            color: #131330;
            display: grid;
            place-items: center;
            font-size: 16px;
            flex-shrink: 0;
        }
        .loc-card-badge {
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            background: #F1F5F9;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }

        .loc-card-body h4 {
            margin: 0 0 4px 0;
            font-size: 14.5px;
            font-weight: 700;
            color: #131330;
            line-height: 1.3;
        }
        .loc-card-body p {
            margin: 0;
            font-size: 12px;
            color: #64748B;
            line-height: 1.35;
        }

        .loc-card-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding-top: 10px;
            border-top: 1px solid #F1F5F9;
            font-size: 12px;
        }
        .loc-dist-tag {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-weight: 700;
            color: #B45309;
        }
        .loc-eta-tag {
            color: #64748B;
            font-weight: 600;
        }

        .loc-card-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 2px;
        }
        .loc-card-btn {
            flex: 1;
            height: 34px;
            padding: 0 12px;
            border-radius: 8px;
            border: none;
            background: #131330;
            color: #FFFFFF;
            font-size: 12px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.18s ease;
        }
        .loc-card-btn:hover { background: #1c1c46; color: #FFB703; }
        .loc-card-btn-icon {
            width: 34px;
            height: 34px;
            border-radius: 8px;
            border: 1px solid #E2E8F0;
            background: #FFFFFF;
            color: #475569;
            display: grid;
            place-items: center;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.18s ease;
        }
        .loc-card-btn-icon:hover {
            border-color: #131330;
            color: #FFB703;
            background: #131330;
        }

        /* ── Detail Drawer / Inspection Bottom Sheet ──────────── */
        .loc-detail-drawer {
            position: absolute;
            inset: 0;
            background: #FFFFFF;
            z-index: 50;
            display: flex;
            flex-direction: column;
            transform: translateY(100%);
            transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
            overflow-y: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .loc-detail-drawer::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
        }
        .loc-detail-drawer.open {
            transform: translateY(0);
        }
        .loc-drawer-header {
            padding: 16px 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%);
            border-bottom: 1px solid rgba(19, 19, 48, 0.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-shrink: 0;
            backdrop-filter: blur(20px);
            border-radius: 24px 24px 0 0;
        }
        .loc-drawer-header-right {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .loc-drawer-back {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 183, 3, 0.12);
            border: 1px solid rgba(255, 183, 3, 0.35);
            color: #131330;
            font-size: 13px;
            font-weight: 700;
            padding: 7px 14px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            -webkit-tap-highlight-color: transparent;
        }
        .loc-drawer-back:hover {
            background: #FFB703;
            border-color: #FFB703;
            color: #131330;
            transform: translateX(-2px);
        }
        .loc-drawer-back:active {
            transform: translateX(0) scale(0.97);
        }
        .loc-drawer-back svg,
        .loc-drawer-back i {
            width: 16px;
            height: 16px;
            font-size: 14px;
            line-height: 1;
            flex-shrink: 0;
            display: inline-block;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .loc-drawer-back:hover svg,
        .loc-drawer-back:hover i {
            transform: translateX(-3px);
        }
        .loc-drawer-content {
            padding: 14px 20px 18px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        /* Dedicated Destination Map in Drawer */
        .loc-drawer-map-strip {
            position: relative;
            width: 100%;
            height: 300px;
            background: #E2E8F0;
            border-radius: 14px;
            overflow: hidden;
            border: 1px solid rgba(19, 19, 48, 0.08);
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
            flex-shrink: 0;
        }
        .loc-drawer-map-strip iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
        }

        .loc-drawer-footer-note {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 6px 12px;
            background: #F8FAFC;
            border: 1px solid #EEF2F6;
            border-radius: 8px;
            color: #64748B;
            font-size: 11px;
            font-weight: 600;
            margin-top: 2px;
        }
        .loc-drawer-footer-note i {
            color: #FFB703;
            font-size: 12px;
        }

        .loc-drawer-title-group h2 {
            margin: 0 0 2px 0;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 18px;
            font-weight: 800;
            color: #131330;
            line-height: 1.2;
        }
        .loc-drawer-title-group p {
            margin: 0;
            font-size: 12.5px;
            color: #64748B;
        }

        /* 4-Stat Metrics Grid */
        .loc-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
        }
        .loc-stat-card {
            background: #FFFFFF;
            border: 1px solid rgba(19, 19, 48, 0.08);
            border-radius: 12px;
            padding: 10px 10px 8px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            gap: 2px;
            position: relative;
            box-shadow: 0 2px 8px rgba(19, 19, 48, 0.03);
            min-height: 56px;
            box-sizing: border-box;
            transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
        }
        .loc-stat-card:hover {
            border-color: rgba(255, 183, 3, 0.45);
            box-shadow: 0 4px 14px rgba(19, 19, 48, 0.08);
            transform: translateY(-1px);
        }
        .loc-stat-card i {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 22px;
            height: 22px;
            border-radius: 6px;
            background: rgba(255, 183, 3, 0.12);
            color: #B45309;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11.5px;
            margin: 0;
            line-height: 1;
            flex-shrink: 0;
        }
        .loc-stat-value {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 13.5px;
            font-weight: 800;
            color: #131330;
            line-height: 1.2;
            padding-right: 24px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
        }
        .loc-stat-label {
            font-size: 9.5px;
            color: #64748B;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            line-height: 1.1;
            text-align: left;
        }

        .loc-drawer-actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 2px;
        }
        .loc-drawer-btn-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        .loc-drawer-btn {
            height: 42px;
            border-radius: 10px !important;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            box-sizing: border-box;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            -webkit-tap-highlight-color: transparent;
        }
        .loc-btn-nav-primary {
            height: 44px;
            background: #131330;
            color: #FFB703 !important;
            box-shadow: 0 4px 14px rgba(19, 19, 48, 0.24);
        }
        .loc-btn-nav-primary:hover {
            box-shadow: 0 6px 18px rgba(19, 19, 48, 0.35);
            transform: translateY(-1px);
            background: #1c1c46;
        }
        .loc-btn-nav-primary:active {
            transform: translateY(0) scale(0.99);
        }
        .loc-btn-nav-secondary {
            background: #FFFFFF;
            border: 1.5px solid #CBD5E1;
            color: #131330 !important;
        }
        .loc-btn-nav-secondary:hover {
            background: #F8FAFC;
            border-color: #FFB703;
            color: #131330 !important;
            transform: translateY(-1px);
        }
        .loc-btn-nav-secondary:active {
            transform: translateY(0) scale(0.99);
        }
        .loc-btn-nav-tour {
            height: 40px;
            background: rgba(255, 183, 3, 0.12);
            border: 1.5px solid rgba(255, 183, 3, 0.4);
            color: #131330 !important;
        }
        .loc-btn-nav-tour:hover {
            background: #FFB703;
            color: #131330 !important;
            transform: translateY(-1px);
        }

        /* ── QR Code Modal Popup ──────────────────────────────── */
        .loc-qr-overlay {
            position: absolute;
            inset: 0;
            background: rgba(19, 19, 48, 0.65);
            backdrop-filter: blur(10px);
            z-index: 80;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .loc-qr-overlay.open {
            display: flex;
        }
        .loc-qr-box {
            background: #FFFFFF;
            border-radius: 24px;
            padding: 28px 24px 24px;
            max-width: 340px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            box-shadow: 0 24px 60px rgba(19, 19, 48, 0.32);
            position: relative;
        }
        .loc-qr-box h4 {
            margin: 0 0 6px 0;
            padding: 0 28px;
            box-sizing: border-box;
            max-width: 100%;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 17px;
            font-weight: 800;
            color: #131330;
            line-height: 1.25;
        }
        .loc-qr-box p {
            margin: 0 0 16px 0;
            font-size: 12.5px;
            color: #64748B;
            line-height: 1.4;
        }
        .loc-qr-wrapper {
            padding: 14px;
            background: #FFFFFF;
            border: 1.5px solid #E2E8F0;
            border-radius: 16px;
            margin-bottom: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 200px;
            min-width: 200px;
            box-shadow: inset 0 2px 6px rgba(19, 19, 48, 0.03);
        }
        .loc-qr-wrapper canvas, .loc-qr-wrapper img {
            border-radius: 8px;
            display: block;
        }
        .loc-qr-download-btn {
            width: 100%;
            height: 48px;
            border-radius: 12px;
            border: none;
            background: #131330;
            color: #FFB703;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.01em;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(19, 19, 48, 0.28);
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            -webkit-tap-highlight-color: transparent;
        }
        .loc-qr-download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(19, 19, 48, 0.38);
            background: #1c1c46;
        }
        .loc-qr-download-btn:active {
            transform: translateY(0) scale(0.98);
        }
        .loc-qr-download-btn i {
            font-size: 16px;
            line-height: 1;
        }
        .loc-qr-close-btn {
            position: absolute;
            top: 14px;
            right: 14px;
            z-index: 10;
        }

        /* ═════════════════════════════════════════════════════════════
           RESPONSIVE DESIGN SYSTEM (ALL DEVICES)
           Matching Contact Us, Panolist, GSV, and Menu Standards
           ═════════════════════════════════════════════════════════════ */

        /* ── Tablets & iPad / Small Laptops (<= 768px) ── */
        @media (max-width: 768px) {
            .location-modal {
                width: 100%;
                max-width: 100vw;
                height: 90vh;
                max-height: 90vh;
                top: auto;
                bottom: 0;
                left: 0;
                transform: translateY(100%);
                border-radius: 24px 24px 0 0;
                padding-bottom: env(safe-area-inset-bottom);
            }
            #location-container.show .location-modal {
                transform: translateY(0);
            }
            .location-modal.drawer-open {
                height: auto !important;
                max-height: 90vh;
            }
            .loc-header {
                padding: 14px 18px;
            }
            .loc-drawer-header {
                padding: 14px 18px;
            }
            .loc-map-strip {
                height: 200px;
            }
            .loc-drawer-map-strip {
                height: 220px;
            }
            .loc-grid {
                grid-template-columns: 1fr;
                gap: 12px;
                padding: 10px 16px 28px;
            }
            .loc-stats-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }
        }

        /* ── Standard Mobile Devices (<= 480px) ── */
        @media (max-width: 480px) {
            .location-modal {
                max-height: 92vh;
                border-radius: 20px 20px 0 0;
            }
            .location-modal.drawer-open {
                max-height: 92vh;
            }
            .loc-header {
                padding: 12px 14px;
            }
            .loc-header-icon {
                width: 36px;
                height: 36px;
                font-size: 16px;
                border-radius: 10px;
            }
            .loc-header-titles h3 {
                font-size: 15px;
            }
            .loc-header-titles p {
                font-size: 11px;
            }
            .loc-close {
                width: 30px;
                height: 30px;
            }

            /* Front Map & Proximity Bar on Mobile */
            .loc-map-strip {
                height: 180px;
            }
            .loc-map-overlay-badge {
                bottom: 8px;
                left: 10px;
                padding: 5px 11px;
                font-size: 11px;
                border-radius: 14px;
            }
            .loc-gps-bar {
                padding: 8px 14px;
                gap: 8px;
            }
            .loc-gps-status {
                font-size: 11.5px;
                gap: 6px;
            }
            .loc-nearest-toggle {
                padding: 4px 10px;
                font-size: 11px;
            }

            /* Search Controls on Mobile */
            .loc-controls {
                padding: 8px 14px;
                gap: 8px;
            }
            .loc-search-input {
                height: 40px;
                font-size: 12.5px;
                padding-left: 36px;
            }
            .loc-search-box i {
                left: 12px;
                font-size: 13px;
            }
            .loc-chip {
                padding: 5px 11px;
                font-size: 11px;
            }

            /* Destination Cards Grid on Mobile */
            .loc-grid {
                padding: 8px 14px 24px;
                gap: 10px;
            }
            .loc-card {
                padding: 12px;
                border-radius: 14px;
            }
            .loc-card-body h4 {
                font-size: 14px;
            }
            .loc-card-body p {
                font-size: 11.5px;
            }
            .loc-card-btn {
                height: 34px;
                font-size: 11.5px;
            }
            .loc-card-btn-icon {
                width: 34px;
                height: 34px;
                font-size: 13px;
            }

            /* Detail Drawer on Mobile */
            .loc-drawer-header {
                padding: 12px 14px;
                gap: 8px;
            }
            .loc-drawer-back {
                padding: 6px 11px;
                font-size: 12px;
                gap: 6px;
            }
            .loc-drawer-back svg {
                width: 14px;
                height: 14px;
            }
            .loc-card-badge {
                font-size: 10.5px;
                padding: 3px 8px;
            }
            .loc-drawer-content {
                padding: 12px 14px 20px;
                gap: 10px;
            }
            .loc-drawer-map-strip {
                height: 180px;
                border-radius: 12px;
            }
            .loc-drawer-title-group h2 {
                font-size: 16.5px;
            }
            .loc-drawer-title-group p {
                font-size: 12px;
            }
            .loc-stat-card {
                padding: 8px 8px 7px;
                min-height: 52px;
            }
            .loc-stat-card i {
                top: 6px;
                right: 6px;
                width: 20px;
                height: 20px;
                font-size: 10.5px;
            }
            .loc-stat-value {
                font-size: 12.5px;
                padding-right: 22px;
            }
            .loc-stat-label {
                font-size: 8.5px;
            }
            .loc-btn-nav-primary {
                height: 42px;
                font-size: 13px;
            }
            .loc-drawer-btn {
                height: 40px;
                font-size: 12px;
            }
            .loc-drawer-footer-note {
                font-size: 10.5px;
                padding: 5px 10px;
            }
        }

        /* ── Ultra-Compact Phones (<= 380px, e.g. iPhone SE) ── */
        @media (max-width: 380px) {
            .loc-drawer-back span {
                max-width: 135px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .loc-drawer-map-strip {
                height: 150px;
            }
            .loc-map-strip {
                height: 150px;
            }
            .loc-gps-bar {
                flex-direction: column;
                align-items: flex-start;
            }
            .loc-nearest-toggle {
                align-self: flex-end;
            }
            .loc-drawer-btn-row {
                grid-template-columns: 1fr;
                gap: 6px;
            }
        }

        /* ── Mobile Landscape Orientation (short screens) ── */
        @media (max-height: 540px) and (orientation: landscape) {
            .location-modal {
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                width: 100vw;
                max-width: 100vw;
                height: 100vh;
                max-height: 100vh;
                transform: none !important;
                border-radius: 0;
            }
            .location-modal.drawer-open {
                height: 100vh !important;
                max-height: 100vh;
                overflow-y: auto;
            }
            .loc-map-strip {
                height: 120px;
            }
            .loc-drawer-map-strip {
                height: 120px;
            }
            .loc-drawer-content {
                padding: 10px 14px 16px;
                gap: 8px;
            }
        }
    `;
    document.head.appendChild(style);

    // ── Build DOM Hierarchy ───────────────────────────────────────────
    const container = document.createElement("div");
    container.id = "location-container";

    const backdrop = document.createElement("div");
    backdrop.id = "location-backdrop";
    container.appendChild(backdrop);

    const modal = document.createElement("div");
    modal.className = "location-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-label", "EVP Trade & Convention Centre Direction Hub");

    modal.innerHTML = `
        <!-- Header -->
        <div class="loc-header">
            <div class="loc-header-left">
                <div class="loc-header-icon"><i class="fi fi-ss-marker" aria-hidden="true"></i></div>
                <div class="loc-header-titles">
                    <h3>Venue Directions</h3>
                    <p>${VENUE_NAME} • Poonamallee, Chennai</p>
                </div>
            </div>
            <button class="loc-close" id="loc-close-btn" type="button" aria-label="Close directions hub">
                <i class="fi fi-rr-cross-small" aria-hidden="true"></i>
            </button>
        </div>

        <!-- Scrollable Main Container -->
        <div class="loc-scroll-area">
            <!-- Compact Interactive Google Map Embed -->
            <div class="loc-map-strip">
                <iframe
                    src="https://maps.google.com/maps?q=${VENUE_LAT},${VENUE_LNG}&z=16&output=embed"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    title="EVP Trade & Convention Centre Map">
                </iframe>
                <div class="loc-map-overlay-badge">
                    <i class="fi fi-ss-marker"></i>
                    <span>Official Venue Coordinates</span>
                </div>
            </div>

            <!-- Live GPS Status & Proximity Bar -->
            <div class="loc-gps-bar">
                <div class="loc-gps-status" id="loc-gps-status">
                    <span class="loc-gps-pulse" id="loc-gps-pulse"></span>
                    <span id="loc-gps-text">Acquiring GPS location…</span>
                </div>
                <button class="loc-nearest-toggle" id="loc-sort-toggle" type="button" aria-pressed="false">
                    <i class="fi fi-rr-sort-alt"></i>
                    <span>Nearest</span>
                </button>
            </div>

            <!-- Search & Filters -->
            <div class="loc-controls">
                <div class="loc-search-box">
                    <i class="fi fi-rr-search"></i>
                    <input type="text" id="loc-search-input" class="loc-search-input" placeholder="Search exhibition halls, pavilion suites, dining, parking...">
                </div>
                <div class="loc-filter-chips" id="loc-filter-chips">
                    <button class="loc-chip active" data-category="all">All Locations (24)</button>
                    <button class="loc-chip" data-category="indoor">Indoor 360° (17)</button>
                    <button class="loc-chip" data-category="outdoor">Outdoor Street View (7)</button>
                    <button class="loc-chip" data-category="halls">Halls A–D (5)</button>
                    <button class="loc-chip" data-category="pavilion">Executive Pavilion (6)</button>
                    <button class="loc-chip" data-category="dining">Dining & Hotel (4)</button>
                    <button class="loc-chip" data-category="parking">Parking & Grounds (4)</button>
                </div>
            </div>

            <!-- Destinations Cards Grid -->
            <div class="loc-grid" id="loc-destinations-grid"></div>
        </div>

        <!-- Detail Inspection Drawer (Bottom Sheet Inside Modal) -->
        <div class="loc-detail-drawer" id="loc-detail-drawer">
            <div class="loc-drawer-header">
                <button class="loc-drawer-back" id="loc-drawer-back-btn" type="button" aria-label="Back to all destinations">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Back to all destinations</span>
                </button>
                <div class="loc-drawer-header-right">
                    <span class="loc-card-badge" id="loc-drawer-category">Venue Zone</span>
                    <button class="loc-close" id="loc-drawer-close-btn" type="button" aria-label="Close directions hub">
                        <i class="fi fi-rr-cross-small" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <div class="loc-drawer-content">
                <!-- Dedicated Map Preview for Selected Destination -->
                <div class="loc-drawer-map-strip">
                    <iframe
                        id="loc-drawer-map-frame"
                        src=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        title="Selected Destination Map">
                    </iframe>
                    <div class="loc-map-overlay-badge">
                        <i class="fi fi-ss-marker"></i>
                        <span id="loc-drawer-map-coords">Direct Venue Pin</span>
                    </div>
                </div>

                <div class="loc-drawer-title-group">
                    <h2 id="loc-drawer-name">Destination Name</h2>
                    <p id="loc-drawer-area">Venue Location Area</p>
                </div>

                <!-- 4-Stat Metric Cards -->
                <div class="loc-stats-grid">
                    <div class="loc-stat-card">
                        <i class="fi fi-rr-route"></i>
                        <span class="loc-stat-value" id="loc-stat-distance">--</span>
                        <span class="loc-stat-label">Distance</span>
                    </div>
                    <div class="loc-stat-card">
                        <i class="fi fi-rr-clock-three"></i>
                        <span class="loc-stat-value" id="loc-stat-eta">--</span>
                        <span class="loc-stat-label">Travel Time</span>
                    </div>
                    <div class="loc-stat-card">
                        <i class="fi fi-rr-time-forward"></i>
                        <span class="loc-stat-value" id="loc-stat-arrival">--</span>
                        <span class="loc-stat-label">Est. Arrival</span>
                    </div>
                    <div class="loc-stat-card">
                        <i class="fi fi-rr-signal-alt-2"></i>
                        <span class="loc-stat-value" id="loc-stat-accuracy">--</span>
                        <span class="loc-stat-label">GPS Accuracy</span>
                    </div>
                </div>

                <!-- Navigation Action Buttons -->
                <div class="loc-drawer-actions">
                    <a id="loc-drawer-btn-nav" href="#" target="_blank" class="loc-drawer-btn loc-btn-nav-primary">
                        <i class="fi fi-rr-diamond-turn-right"></i>
                        <span>Start Driving Navigation</span>
                    </a>
                    <div class="loc-drawer-btn-row">
                        <button id="loc-drawer-btn-qr" type="button" class="loc-drawer-btn loc-btn-nav-secondary">
                            <i class="fi fi-rr-qr-scan"></i>
                            <span>Scan QR Code</span>
                        </button>
                        <button id="loc-drawer-btn-share" type="button" class="loc-drawer-btn loc-btn-nav-secondary">
                            <i class="fi fi-rr-share"></i>
                            <span>Share Link</span>
                        </button>
                    </div>
                    <button id="loc-drawer-btn-tour" type="button" class="loc-drawer-btn loc-btn-nav-tour" style="display: none;">
                        <i class="fi fi-sr-tour-virtual"></i>
                        <span>Explore in 360° Tour</span>
                    </button>
                </div>

                <!-- Venue Footer Note -->
                <div class="loc-drawer-footer-note">
                    <i class="fi fi-rr-info"></i>
                    <span>EVP Trade & Convention Centre • Chembarambakkam, Poonamallee, Chennai</span>
                </div>
            </div>
        </div>

        <!-- QR Code Popup -->
        <div class="loc-qr-overlay" id="loc-qr-overlay">
            <div class="loc-qr-box">
                <button class="loc-close loc-qr-close-btn" id="loc-qr-close" type="button" aria-label="Close QR Code">
                    <i class="fi fi-rr-cross-small" aria-hidden="true"></i>
                </button>
                <h4 id="loc-qr-title">Destination Name</h4>
                <p>Scan with your phone camera to open GPS driving directions instantly.</p>
                <div class="loc-qr-wrapper" id="loc-qr-render-area"></div>
                <button class="loc-qr-download-btn" id="loc-qr-download-btn" type="button">
                    <i class="fi fi-rr-download"></i>
                    <span>Download QR Code</span>
                </button>
            </div>
        </div>
    `;

    container.appendChild(modal);
    document.body.appendChild(container);

    // ── Component State ───────────────────────────────────────────────
    let userCoords = null; // { lat, lng, accuracy }
    let activeCategory = "all";
    let searchQuery = "";
    let sortByNearest = false;
    let selectedDest = null;
    let qrInstance = null;

    // ── GPS Geolocation Watcher ───────────────────────────────────────
    function acquireUserLocation() {
        const pulse = document.getElementById("loc-gps-pulse");
        const statusText = document.getElementById("loc-gps-text");

        if (!navigator.geolocation) {
            if (statusText) statusText.textContent = "Geolocation not supported by browser";
            renderDestinations();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                userCoords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    accuracy: pos.coords.accuracy
                };
                if (pulse) pulse.classList.add("active");
                if (statusText) {
                    const mainDist = calculateDistance(userCoords.lat, userCoords.lng, VENUE_LAT, VENUE_LNG);
                    const bear = calculateBearing(userCoords.lat, userCoords.lng, VENUE_LAT, VENUE_LNG);
                    const dir = compassDirection(bear);
                    statusText.textContent = `You are ${formatDistance(mainDist)} away from venue (${dir}) • ${formatAccuracy(userCoords.accuracy, true)}`;
                }
                renderDestinations();
                if (selectedDest) updateDetailDrawer(selectedDest);
            },
            (err) => {
                if (statusText) {
                    if (err.code === 1) statusText.textContent = "Location permission denied — showing venue locations";
                    else statusText.textContent = "Venue GPS offline — showing standard routes";
                }
                renderDestinations();
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
        );
    }

    // ── Pre-mount all 24 destination cards into DOM ───────────────────
    function populateInitialDestinations() {
        const grid = document.getElementById("loc-destinations-grid");
        if (!grid || grid.querySelectorAll(".loc-card").length === EVP_DESTINATIONS.length) return;

        grid.innerHTML = EVP_DESTINATIONS.map((d) => {
            const distLabel = "Direct Route";
            const etaLabel = "Direct Pin";
            const navLink = getNavigationUrl(d, userCoords);

            return `
                <div class="loc-card" data-id="${d.id}" data-category="${d.category}" data-indoor="${d.isIndoor}">
                    <div class="loc-card-header">
                        <div class="loc-card-iconbox"><i class="${d.icon}"></i></div>
                        <span class="loc-card-badge">${d.categoryLabel}</span>
                    </div>
                    <div class="loc-card-body">
                        <h4>${d.name}</h4>
                        <p>${d.area}</p>
                    </div>
                    <div class="loc-card-meta">
                        <span class="loc-dist-tag"><i class="fi fi-rr-marker"></i>${distLabel}</span>
                        <span class="loc-eta-tag">${etaLabel}</span>
                    </div>
                    <div class="loc-card-actions" onclick="event.stopPropagation();">
                        <a href="${navLink}" target="_blank" class="loc-card-btn" title="Open navigation">
                            <i class="fi fi-rr-diamond-turn-right"></i>
                            <span>Directions</span>
                        </a>
                        <button type="button" class="loc-card-btn-icon btn-card-qr" data-id="${d.id}" title="Scan QR Code">
                            <i class="fi fi-rr-qr-scan"></i>
                        </button>
                        <button type="button" class="loc-card-btn-icon btn-card-share" data-id="${d.id}" title="Share link">
                            <i class="fi fi-rr-share"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join("");

        // Attach Card Click Handlers
        grid.querySelectorAll(".loc-card").forEach((card) => {
            card.addEventListener("click", () => {
                const id = parseInt(card.getAttribute("data-id"), 10);
                const dest = EVP_DESTINATIONS.find((x) => x.id === id);
                if (dest) openDetailDrawer(dest);
            });
        });

        // Attach QR and Share shortcuts
        grid.querySelectorAll(".btn-card-qr").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const id = parseInt(btn.getAttribute("data-id"), 10);
                const dest = EVP_DESTINATIONS.find((x) => x.id === id);
                if (dest) showQRCodeModal(dest);
            });
        });

        grid.querySelectorAll(".btn-card-share").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const id = parseInt(btn.getAttribute("data-id"), 10);
                const dest = EVP_DESTINATIONS.find((x) => x.id === id);
                if (dest) shareDestination(dest);
            });
        });
    }

    // ── Non-Destructive Card Filter & Live Metric Updater ─────────────
    function renderDestinations() {
        const grid = document.getElementById("loc-destinations-grid");
        if (!grid) return;
        populateInitialDestinations();

        const q = searchQuery.toLowerCase().trim();
        let visibleCount = 0;
        const cards = Array.from(grid.querySelectorAll(".loc-card"));

        cards.forEach((card) => {
            const id = parseInt(card.getAttribute("data-id"), 10);
            const d = EVP_DESTINATIONS.find((x) => x.id === id);
            if (!d) return;

            let matchesCat = false;
            if (activeCategory === "all") {
                matchesCat = true;
            } else if (activeCategory === "indoor") {
                matchesCat = d.isIndoor === true;
            } else if (activeCategory === "outdoor") {
                matchesCat = d.isIndoor === false;
            } else if (activeCategory === "halls") {
                matchesCat = d.category === "halls";
            } else if (activeCategory === "pavilion") {
                matchesCat = d.category === "pavilion";
            } else if (activeCategory === "dining") {
                matchesCat = d.category === "dining";
            } else if (activeCategory === "parking") {
                matchesCat = d.category === "parking" || d.category === "gates" || d.category === "grounds" || d.category === "outdoor";
            } else {
                matchesCat = d.category === activeCategory;
            }

            const matchesSearch = !q ||
                d.name.toLowerCase().includes(q) ||
                d.area.toLowerCase().includes(q) ||
                (d.tags && d.tags.some((t) => t.toLowerCase().includes(q)));

            const isVisible = matchesCat && matchesSearch;
            card.style.display = isVisible ? "" : "none";
            if (isVisible) visibleCount++;

            // Live metrics update without touching title, description, badge, or buttons
            let dist = null;
            let eta = null;
            let dir = "";
            if (userCoords) {
                dist = calculateDistance(userCoords.lat, userCoords.lng, d.lat, d.lng);
                eta = calculateETA(dist);
                dir = compassDirection(calculateBearing(userCoords.lat, userCoords.lng, d.lat, d.lng));
            }

            card._distVal = dist !== null ? dist : 999999;

            const distTag = card.querySelector(".loc-dist-tag");
            const etaTag = card.querySelector(".loc-eta-tag");
            const navBtn = card.querySelector(".loc-card-btn");

            if (distTag) {
                const distLabel = dist !== null ? `${formatDistance(dist)} • ${dir}` : "Direct Route";
                distTag.innerHTML = `<i class="fi fi-rr-marker"></i>${distLabel}`;
            }
            if (etaTag) {
                etaTag.textContent = eta !== null ? formatETA(eta) : "Direct Pin";
            }
            if (navBtn) {
                navBtn.href = getNavigationUrl(d, userCoords);
            }
        });

        // Reorder DOM cards if Nearest sort is toggled
        if (sortByNearest && userCoords) {
            cards.sort((a, b) => (a._distVal || 999999) - (b._distVal || 999999));
            cards.forEach((card) => grid.appendChild(card));
        }

        // Empty state
        let emptyMsg = document.getElementById("loc-empty-search-msg");
        if (visibleCount === 0) {
            if (!emptyMsg) {
                emptyMsg = document.createElement("div");
                emptyMsg.id = "loc-empty-search-msg";
                emptyMsg.style.cssText = "grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: #64748B;";
                emptyMsg.innerHTML = `
                    <i class="fi fi-rr-search-location" style="font-size: 32px; color: #94A3B8; margin-bottom: 8px; display: block;"></i>
                    <p style="margin: 0; font-weight: 700; font-size: 15px; color: #131330;">No venue locations found</p>
                    <p style="margin: 4px 0 0 0; font-size: 13px;">Try searching for "Hall A", "Executive Pavilion", "Food Court", or "Parking".</p>
                `;
                grid.appendChild(emptyMsg);
            }
            emptyMsg.style.display = "";
        } else if (emptyMsg) {
            emptyMsg.style.display = "none";
        }
    }

    // ── Detail Drawer Logic ───────────────────────────────────────────
    function openDetailDrawer(dest) {
        selectedDest = dest;
        updateDetailDrawer(dest);
        const drawer = document.getElementById("loc-detail-drawer");
        if (drawer) drawer.classList.add("open");
        modal.classList.add("drawer-open");
    }

    function closeDetailDrawer() {
        const drawer = document.getElementById("loc-detail-drawer");
        if (drawer) drawer.classList.remove("open");
        modal.classList.remove("drawer-open");
        const drawerMap = document.getElementById("loc-drawer-map-frame");
        if (drawerMap) drawerMap.src = "";
        selectedDest = null;
    }

    function updateDetailDrawer(dest) {
        let dist = null;
        let eta = null;
        let dir = "";
        if (userCoords) {
            dist = calculateDistance(userCoords.lat, userCoords.lng, dest.lat, dest.lng);
            eta = calculateETA(dist);
            dir = compassDirection(calculateBearing(userCoords.lat, userCoords.lng, dest.lat, dest.lng));
        }

        const nameEl = document.getElementById("loc-drawer-name");
        const areaEl = document.getElementById("loc-drawer-area");
        const catEl = document.getElementById("loc-drawer-category");
        const distEl = document.getElementById("loc-stat-distance");
        const etaEl = document.getElementById("loc-stat-eta");
        const arrivalEl = document.getElementById("loc-stat-arrival");
        const accEl = document.getElementById("loc-stat-accuracy");
        const navBtn = document.getElementById("loc-drawer-btn-nav");
        const tourBtn = document.getElementById("loc-drawer-btn-tour");
        const drawerMap = document.getElementById("loc-drawer-map-frame");
        const drawerCoords = document.getElementById("loc-drawer-map-coords");

        if (drawerMap) {
            drawerMap.src = `https://maps.google.com/maps?q=${dest.lat},${dest.lng}&z=17&output=embed`;
        }
        if (drawerCoords) {
            drawerCoords.textContent = `${dest.lat.toFixed(4)}° N, ${dest.lng.toFixed(4)}° E`;
        }

        const grid = document.getElementById("loc-destinations-grid");
        const card = grid ? grid.querySelector(`[data-id="${dest.id}"]`) : null;

        if (nameEl) {
            const cardH4 = card ? card.querySelector("h4") : null;
            if (cardH4 && cardH4.innerHTML && cardH4.textContent.trim() !== dest.name) {
                nameEl.innerHTML = cardH4.innerHTML;
            } else {
                nameEl.textContent = dest.name;
            }
        }
        if (areaEl) {
            const cardP = card ? card.querySelector("p") : null;
            if (cardP && cardP.innerHTML && cardP.textContent.trim() !== dest.area) {
                areaEl.innerHTML = cardP.innerHTML;
            } else {
                areaEl.textContent = dest.area;
            }
        }
        if (catEl) {
            const cardBadge = card ? card.querySelector(".loc-card-badge") : null;
            if (cardBadge && cardBadge.innerHTML && cardBadge.textContent.trim() !== dest.categoryLabel) {
                catEl.innerHTML = cardBadge.innerHTML;
            } else {
                catEl.textContent = dest.categoryLabel;
            }
        }

        if (distEl) distEl.textContent = dist !== null ? `${formatDistance(dist)} ${dir}` : "--";
        if (etaEl) etaEl.textContent = eta !== null ? formatETA(eta) : "--";
        if (arrivalEl) arrivalEl.textContent = eta !== null ? formatArrival(eta) : "--";
        if (accEl) accEl.textContent = userCoords && userCoords.accuracy ? formatAccuracy(userCoords.accuracy, false) : "Good";

        if (navBtn) {
            navBtn.href = getNavigationUrl(dest, userCoords);
        }

        // Check if destination has matching 360 panorama in tour or Street View
        if (tourBtn) {
            let hasValidIndoorPano = false;
            if (dest.panoKey && window.tour && typeof window.tour.setMediaByName === "function") {
                if (typeof window.getPanoramas === "function") {
                    const panos = window.getPanoramas();
                    if (panos && panos.length > 0) {
                        const targetKey = dest.panoKey.toLowerCase();
                        hasValidIndoorPano = panos.some(p => (p.label && p.label.toLowerCase() === targetKey) || (p.id && p.id.toLowerCase() === targetKey));
                    } else {
                        hasValidIndoorPano = true; // Still initializing
                    }
                } else {
                    hasValidIndoorPano = true;
                }
            }

            if (hasValidIndoorPano) {
                tourBtn.style.display = "flex";
                tourBtn.innerHTML = '<i class="fi fi-sr-tour-virtual"></i><span>Explore in 360° Tour</span>';
                tourBtn.onclick = () => {
                    window.toggleLocation();
                    try {
                        const success = window.tour.setMediaByName(dest.panoKey);
                        if (success === false && typeof window.tour.setMediaByIndex === "function") {
                            window.tour.setMediaByIndex(0);
                        }
                    } catch (e) {
                        if (typeof window.tour.setMediaByIndex === "function") {
                            window.tour.setMediaByIndex(0);
                        }
                    }
                };
            } else if (!dest.isIndoor && dest.povId && typeof window.playGsvPovLocation === "function") {
                tourBtn.style.display = "flex";
                tourBtn.innerHTML = '<i class="fi fi-sr-street-view"></i><span>Explore in Street View</span>';
                tourBtn.onclick = () => {
                    window.toggleLocation();
                    window.playGsvPovLocation(dest.povId);
                };
            } else if (!dest.isIndoor && typeof window.openGsvPopup === "function") {
                tourBtn.style.display = "flex";
                tourBtn.innerHTML = '<i class="fi fi-sr-street-view"></i><span>Explore in Street View</span>';
                tourBtn.onclick = () => {
                    window.toggleLocation();
                    window.openGsvPopup();
                };
            } else {
                tourBtn.style.display = "none";
            }
        }
    }

    // ── QR Code Modal Logic ───────────────────────────────────────────
    function showQRCodeModal(dest) {
        const overlay = document.getElementById("loc-qr-overlay");
        const title = document.getElementById("loc-qr-title");
        const renderArea = document.getElementById("loc-qr-render-area");
        if (!overlay || !renderArea) return;

        if (title) title.textContent = dest.name;
        renderArea.innerHTML = "";
        overlay.classList.add("open");

        const navUrl = getNavigationUrl(dest, userCoords);

        ensureQRCode(() => {
            if (!window.QRCode) {
                renderArea.innerHTML = `<p style="font-size:12px; color:#EF4444;">Unable to generate QR Code offline</p>`;
                return;
            }
            renderArea.innerHTML = "";
            qrInstance = new window.QRCode(renderArea, {
                text: navUrl,
                width: 180,
                height: 180,
                colorDark: "#131330",
                colorLight: "#FFFFFF",
                correctLevel: window.QRCode.CorrectLevel.H
            });
        });
    }

    function closeQRCodeModal() {
        const overlay = document.getElementById("loc-qr-overlay");
        if (overlay) overlay.classList.remove("open");
    }

    function downloadQRCode() {
        const area = document.getElementById("loc-qr-render-area");
        if (!area) return;
        const canvas = area.querySelector("canvas");
        const img = area.querySelector("img");
        let src = "";
        if (canvas && typeof canvas.toDataURL === "function") {
            try { src = canvas.toDataURL("image/png"); } catch (e) {}
        }
        if (!src && img && img.src) {
            src = img.src;
        }
        if (!src) return;

        const a = document.createElement("a");
        a.href = src;
        a.download = `EVP-Directions-${(selectedDest ? selectedDest.name : "Venue").replace(/\s+/g, "-")}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // ── Share Destination Logic ───────────────────────────────────────
    function shareDestination(dest) {
        const url = getNavigationUrl(dest, userCoords);
        const title = `${dest.name} — EVP Trade & Convention Centre`;
        const text = `Directions to ${dest.name} at EVP Trade & Convention Centre, Chennai:`;

        if (navigator.share) {
            navigator.share({ title, text, url }).catch(() => {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                alert(`Directions link for "${dest.name}" copied to clipboard!`);
            });
        }
    }

    // ── Event Handlers & Interactions ─────────────────────────────────
    // Search input
    let searchTimeout = null;
    document.getElementById("loc-search-input").addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = e.target.value;
            renderDestinations();
        }, 150);
    });

    // Category Filter Chips
    document.getElementById("loc-filter-chips").addEventListener("click", (e) => {
        const chip = e.target.closest(".loc-chip");
        if (!chip) return;
        document.querySelectorAll(".loc-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        activeCategory = chip.getAttribute("data-category");
        renderDestinations();
    });

    // Nearest Sort Toggle
    const sortBtn = document.getElementById("loc-sort-toggle");
    if (sortBtn) {
        sortBtn.addEventListener("click", () => {
            sortByNearest = !sortByNearest;
            sortBtn.classList.toggle("active", sortByNearest);
            sortBtn.setAttribute("aria-pressed", String(sortByNearest));
            renderDestinations();
        });
    }

    // Drawer back & close buttons
    document.getElementById("loc-drawer-back-btn").addEventListener("click", closeDetailDrawer);
    const drawerCloseBtn = document.getElementById("loc-drawer-close-btn");
    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener("click", () => window.toggleLocation());
    }

    // Drawer secondary actions
    document.getElementById("loc-drawer-btn-qr").addEventListener("click", () => {
        if (selectedDest) showQRCodeModal(selectedDest);
    });
    document.getElementById("loc-drawer-btn-share").addEventListener("click", () => {
        if (selectedDest) shareDestination(selectedDest);
    });

    // QR modal close & download
    document.getElementById("loc-qr-close").addEventListener("click", closeQRCodeModal);
    document.getElementById("loc-qr-download-btn").addEventListener("click", downloadQRCode);
    document.getElementById("loc-qr-overlay").addEventListener("click", (e) => {
        if (e.target.id === "loc-qr-overlay") closeQRCodeModal();
    });

    // ── Public Toggle APIs (Dock & Menu Integrated) ───────────────────
    window.toggleLocation = function () {
        const isOpen = container.classList.contains("show");
        if (!isOpen) {
            modal.classList.remove("drawer-open");
            container.classList.add("show");
            backdrop.classList.add("show");
            acquireUserLocation();
            renderDestinations();
            if (typeof window.evpRetranslate === "function") {
                setTimeout(window.evpRetranslate, 60);
            }
        } else {
            container.classList.remove("show");
            backdrop.classList.remove("show");
            closeDetailDrawer();
            closeQRCodeModal();
            document.dispatchEvent(new CustomEvent("menuItemDeactivate", { detail: { id: "menu-location" } }));
        }
    };

    window.openLocationModal = function () {
        if (!container.classList.contains("show")) window.toggleLocation();
    };

    window.closeLocationModal = function () {
        if (container.classList.contains("show")) window.toggleLocation();
    };

    window.openDirectionsForLocation = function (target) {
        if (!container.classList.contains("show")) {
            window.toggleLocation();
        }
        if (!target) return;
        const clean = String(target).trim().toLowerCase();
        let dest = EVP_DESTINATIONS.find((d) => {
            if (d.panoKey && clean.includes(d.panoKey.toLowerCase())) return true;
            if (d.name && clean.includes(d.name.toLowerCase())) return true;
            if (d.povId && clean === d.povId.toLowerCase()) return true;
            return false;
        });
        if (!dest) {
            const hallMatch = clean.match(/^hall\s+([abcd])/i);
            if (hallMatch) {
                const hallKey = "hall " + hallMatch[1].toLowerCase();
                dest = EVP_DESTINATIONS.find((d) => d.panoKey && d.panoKey.toLowerCase().startsWith(hallKey));
            }
        }
        if (!dest) {
            dest = EVP_DESTINATIONS[0];
        }
        if (dest) {
            openDetailDrawer(dest);
        }
    };

    // Close on backdrop or close button
    document.getElementById("loc-close-btn").addEventListener("click", () => window.toggleLocation());
    backdrop.addEventListener("click", () => window.toggleLocation());

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && container.classList.contains("show")) {
            const qrOpen = document.getElementById("loc-qr-overlay").classList.contains("open");
            const drawerOpen = document.getElementById("loc-detail-drawer").classList.contains("open");
            if (qrOpen) {
                closeQRCodeModal();
            } else if (drawerOpen) {
                closeDetailDrawer();
            } else {
                window.toggleLocation();
            }
        }
    });

    // Listen for custom menu clicks
    document.addEventListener("menuItemClick", (e) => {
        if (e.detail && e.detail.id === "menu-location") {
            window.toggleLocation();
        }
    });

    // Dismiss immediately when Clean Mode is activated
    document.addEventListener("cleanModeChanged", (e) => {
        if (e.detail && e.detail.isHidden && container.classList.contains("show")) {
            window.toggleLocation();
        }
    });

    // Initial render
    renderDestinations();
})();
