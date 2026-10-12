// ═══════════════════════════════════════════════════════════════════════
//  EVP TRADE & CONVENTION CENTRE — ARCHITECTURAL SPECIFICATIONS DATASET
//  Master Source: EVP SPECIFICATION.pdf (Architectural & Engineering Authority)
//  Covers all 25 indoor 360° panoramas and 7 outdoor campus ground locations.
// ═══════════════════════════════════════════════════════════════════════

(function () {
    "use strict";

    const EVP_VENUE_SPECS = {
        // ─── EXHIBITION HALL A ─────────────────────────────────────────
        "Hall A": {
            id: "hall-a",
            title: "Exhibition Hall A",
            category: "Exhibition Halls",
            badge: "Pillarless Mega Hall",
            areaM2: 5030,
            areaSqFt: 54144,
            exhibitSpaceM2: 4381,
            exhibitSpaceSqFt: 47160,
            dimensionsMetric: "114 m × 43 m",
            dimensionsImperial: "376 ft × 144 ft",
            clearHeightMin: "9.7 m (32 ft)",
            clearHeightMax: "15.0 m (52 ft)",
            floorLoad: "5,000 kg / sq. m (5 Tonne/m² / 460 kg/sq. ft)",
            hangingLoad: "450 kg / sq. m (41 kg/sq. ft)",
            riggingPoints: "252 hanging points (12 rafters × 21 hooks)",
            coolingCapacity: "300 TR (18 high-performance AC units)",
            airDistribution: "Long-throw jet nozzle distribution system",
            powerPoints: "48 distribution points (8 concealed floor units)",
            dgBackup: "750 kVA DG set + Online UPS backup",
            lighting: "1.87 Million Lumens (6 rows × 13 White LED fixtures = 78 fixtures)",
            frontageLighting: "7 rows × 3 LED fixtures (18,000 lumens/light)",
            accessDoors: "4 Automated sliding glass doors (10.7 ft × 9.6 ft, clear 6.2 ft)",
            cargoShutters: "2 Rolling shutters (20 ft / 6 m height) for vehicle & exhibit entry",
            fireExits: "6 Fire-compliant emergency exit doors",
            cctvCameras: "26 Cameras (12 inside, 4 entrance, 8 perimeter, 2 rear)",
            washrooms: "Men (8 urinals, 5 cubicles, 5 vanities), Women (11 cubicles, 6 vanities), 1 Accessible",
            capacities: {
                classroom: "1,200 – 1,300 Seats (Seminar & Training Tables)",
                theatre: "2,400 – 2,600 Seats (Plenary & Keynote Rows)",
                cabaret: "990 Seats (330 Banquet Tables)",
                cocktail: "4,500 – 5,000 Guests (Floating Expo Layout)"
            },
            idealFor: "Large-scale trade exhibitions, industrial expos, automotive launches, international conventions.",
            gps: { lat: 13.03445852239869, lng: 80.04703725458211 }
        },

        // ─── EXHIBITION HALL B ─────────────────────────────────────────
        "Hall B": {
            id: "hall-b",
            title: "Exhibition Hall B",
            category: "Exhibition Halls",
            badge: "Pillarless Mega Hall",
            areaM2: 5030,
            areaSqFt: 54144,
            exhibitSpaceM2: 4381,
            exhibitSpaceSqFt: 47160,
            dimensionsMetric: "114 m × 43 m",
            dimensionsImperial: "376 ft × 144 ft",
            clearHeightMin: "9.7 m (32 ft)",
            clearHeightMax: "15.0 m (52 ft)",
            floorLoad: "5,000 kg / sq. m (5 Tonne/m² / 460 kg/sq. ft)",
            hangingLoad: "450 kg / sq. m (41 kg/sq. ft)",
            riggingPoints: "252 hanging points (12 rafters × 21 hooks)",
            coolingCapacity: "300 TR (18 high-performance AC units)",
            airDistribution: "Long-throw jet nozzle distribution system",
            powerPoints: "48 distribution points (12 concealed floor units)",
            dgBackup: "750 kVA DG set + Online UPS backup",
            lighting: "1.87 Million Lumens (6 rows × 13 White LED fixtures = 78 fixtures)",
            frontageLighting: "7 rows × 3 LED fixtures (18,000 lumens/light)",
            accessDoors: "2 Automated + 2 Manual glass doors (10.7 ft × 9.6 ft, clear 6.2 ft)",
            cargoShutters: "2 Rolling shutters (20 ft / 6 m height) for vehicle & exhibit entry",
            fireExits: "6 Fire-compliant emergency exit doors",
            cctvCameras: "24 Cameras (12 inside, 4 entrance, 6 perimeter, 2 rear)",
            washrooms: "Men (8 urinals, 5 cubicles, 5 vanities), Women (11 cubicles, 6 vanities), 1 Accessible",
            capacities: {
                classroom: "1,200 – 1,300 Seats (Conference Layout)",
                theatre: "2,400 – 2,600 Seats (Auditorium Layout)",
                cabaret: "990 Seats (330 Banquet Tables)",
                cocktail: "4,500 – 5,000 Guests (Floating Expo Layout)"
            },
            idealFor: "International trade fairs, corporate summits, heavy machinery expos, plenary sessions.",
            gps: { lat: 13.034988852742798, lng: 80.04755151490868 }
        },

        // ─── EXHIBITION HALL C ─────────────────────────────────────────
        "Hall C": {
            id: "hall-c",
            title: "Exhibition Hall C",
            category: "Exhibition Halls",
            badge: "Pillarless Mega Hall",
            areaM2: 5030,
            areaSqFt: 54144,
            exhibitSpaceM2: 4381,
            exhibitSpaceSqFt: 47160,
            dimensionsMetric: "114 m × 43 m",
            dimensionsImperial: "376 ft × 144 ft",
            clearHeightMin: "9.7 m (32 ft)",
            clearHeightMax: "15.0 m (52 ft)",
            floorLoad: "5,000 kg / sq. m (5 Tonne/m² / 460 kg/sq. ft)",
            hangingLoad: "450 kg / sq. m (41 kg/sq. ft)",
            riggingPoints: "252 hanging points (12 rafters × 21 hooks)",
            coolingCapacity: "300 TR (18 high-performance AC units)",
            airDistribution: "Long-throw jet nozzle distribution system",
            powerPoints: "48 distribution points (12 concealed floor units)",
            dgBackup: "750 kVA DG set + Online UPS backup",
            lighting: "1.87 Million Lumens (6 rows × 13 White LED fixtures = 78 fixtures)",
            frontageLighting: "7 rows × 3 LED fixtures (18,000 lumens/light)",
            accessDoors: "2 Automated + 2 Manual glass doors; 3.8 m clear openings (total gate span 8 m)",
            cargoShutters: "2 Rolling shutters (20 ft / 6 m height) for vehicle & exhibit entry",
            fireExits: "7 Fire-compliant emergency exit doors",
            cctvCameras: "23 Cameras (12 inside, 4 entrance, 5 perimeter, 2 rear)",
            washrooms: "Men (8 urinals, 5 cubicles, 5 vanities), Women (11 cubicles, 6 vanities), 1 Accessible",
            capacities: {
                classroom: "1,200 – 1,300 Seats (Training & Work Tables)",
                theatre: "2,400 – 2,600 Seats (Summit & Keynote Rows)",
                cabaret: "990 Seats (330 Banquet Tables)",
                cocktail: "4,500 – 5,000 Guests (Floating Expo Layout)"
            },
            idealFor: "Consumer expos, tech exhibitions, global conventions, entertainment productions.",
            gps: { lat: 13.035953142758052, lng: 80.04789375882515 }
        },

        // ─── EXHIBITION HALL D ─────────────────────────────────────────
        "Hall D": {
            id: "hall-d",
            title: "Exhibition Hall D",
            category: "Exhibition Halls",
            badge: "Widest Pillarless Hall (150 ft Span)",
            areaM2: 4438,
            areaSqFt: 47762,
            exhibitSpaceM2: 4035,
            exhibitSpaceSqFt: 43428,
            dimensionsMetric: "96 m × 45 m",
            dimensionsImperial: "316 ft × 150 ft",
            clearHeightMin: "9.7 m (32 ft)",
            clearHeightMax: "15.0 m (52 ft)",
            floorLoad: "5,000 kg / sq. m (5 Tonne/m² / 460 kg/sq. ft)",
            hangingLoad: "450 kg / sq. m (41 kg/sq. ft)",
            riggingPoints: "231 hanging points (11 rafters × 21 hooks)",
            coolingCapacity: "300 TR (18 high-performance AC units)",
            airDistribution: "Long-throw jet nozzle distribution system",
            powerPoints: "48 distribution points (12 concealed floor units)",
            dgBackup: "750 kVA DG set + Online UPS backup",
            lighting: "1.73 Million Lumens (6 rows × 12 White LED fixtures = 72 fixtures)",
            frontageLighting: "6 rows × 3 LED fixtures",
            accessDoors: "2 Automated + 2 Manual glass doors; 3.8 m clear openings (total gate span 8 m)",
            cargoShutters: "2 Rolling shutters (20 ft / 6 m height) for vehicle & exhibit entry",
            fireExits: "6 Fire-compliant emergency exit doors",
            cctvCameras: "23 Cameras (12 inside, 4 entrance, 5 perimeter, 2 rear)",
            washrooms: "Men (8 urinals, 5 cubicles, 5 vanities), Women (11 cubicles, 6 vanities), 1 Accessible",
            capacities: {
                classroom: "900 – 1,000 Seats (Wide Seminar Tables)",
                theatre: "1,800 – 2,000 Seats (Wide Plenary Theatre)",
                cabaret: "765 Seats (255 Banquet Tables)",
                cocktail: "3,800 – 4,200 Guests (Wide Expo Format)"
            },
            idealFor: "Wide-format staging, galas, plenary keynotes, banquet dinners, and broadcast events.",
            gps: { lat: 13.02965, lng: 80.01190 }
        },

        // ─── ENTRANCE PLAZA & FOYER ────────────────────────────────────
        "Entrance Plaza & Foyer": {
            id: "entrance-plaza",
            title: "Entrance Plaza & Registration Foyer",
            category: "Executive Pavilion",
            badge: "Grand Arrival Concourse",
            areaM2: 1885,
            areaSqFt: 20300,
            dimensionsMetric: "50 m × 38 m",
            dimensionsImperial: "164 ft × 124 ft",
            clearHeightMin: "7.6 m (25 ft)",
            clearHeightMax: "10.0 m (33 ft)",
            floorLoad: "Heavy-duty pedestrian & light vehicular concrete paving",
            coolingCapacity: "Ambient open pre-function concourse with high-velocity air circulation",
            powerPoints: "Dedicated 500 kVA DG set for Plaza & Food Court operations",
            lighting: "Architectural LED illumination + Frontage branding lights",
            accessDoors: "High-throughput registration portals and grand pedestrian boulevard",
            cctvCameras: "7 High-definition surveillance cameras",
            washrooms: "Dedicated Plaza facilities (Men: 13 urinals, 4 cubicles; Women: 10 cubicles, vanities)",
            capacities: {
                registration: "5,000+ Attendees/hr Throughput",
                reception: "1,500 – 2,000 Guests Welcome Concourse",
                exhibits: "Branded experiential pavilions & automotive arrival pods"
            },
            idealFor: "Guest registration, VIP welcome receptions, sponsor activations, crowd concourse management.",
            gps: { lat: 13.036611510717783, lng: 80.04798908216767 }
        },

        // ─── EXECUTIVE HOSPITALITY PAVILION ───────────────────────────
        "Executive Hospitality Pavilion": {
            id: "hospitality-pavilion",
            title: "Executive Hospitality Pavilion",
            category: "Executive Pavilion",
            badge: "VIP Dignitary Wing",
            areaM2: 720,
            areaSqFt: 7750,
            clearHeightMin: "3.8 m (12.5 ft)",
            clearHeightMax: "4.5 m (14.8 ft)",
            coolingCapacity: "Independent climate-controlled VRV air conditioning",
            powerPoints: "Concealed executive workstation ports + backup UPS",
            lighting: "Dimmable warm architectural ambiance + task LED lighting",
            cctvCameras: "Discreet high-security executive surveillance coverage",
            amenities: "Dedicated VIP check-in, private concierge lounge, executive pantry",
            capacities: {
                hospitality: "150 – 200 VIP Delegates simultaneously",
                receptions: "Exclusive corporate cocktail and networking receptions"
            },
            idealFor: "Government dignitaries, corporate CXOs, high-level delegation summits, VIP media briefings.",
            gps: { lat: 13.02910, lng: 80.01110 }
        },

        // ─── PRIVATE MEETING SUITES ────────────────────────────────────
        "Private Meeting Suites": {
            id: "meeting-suites",
            title: "Private Meeting Suites",
            category: "Executive Pavilion",
            badge: "Acoustic B2B Suites",
            areaM2: 180,
            areaSqFt: 1940,
            clearHeightMin: "3.5 m (11.5 ft)",
            clearHeightMax: "4.0 m (13 ft)",
            coolingCapacity: "Individual room thermostat controls",
            powerPoints: "Private conference table power units (HDMI, USB-C, AC, LAN)",
            lighting: "Warm dimmable LED ambiance",
            cctvCameras: "Access-controlled entry corridor monitoring",
            amenities: "4 Suites × 4 Seating each (16 total capacity); acoustic soundproofing",
            capacities: {
                meeting: "4 Guests per suite (4 Dedicated private suites)",
                total: "16 Executives simultaneous private capacity"
            },
            idealFor: "Confidential B2B negotiations, investor pitch meetings, contract signings, private interviews.",
            gps: { lat: 13.02911, lng: 80.01111 }
        },

        // ─── EXECUTIVE MEETING ROOM ────────────────────────────────────
        "Executive Meeting Room": {
            id: "exec-meeting-room",
            title: "Executive Meeting Room",
            category: "Executive Pavilion",
            badge: "Hybrid Video Conference",
            areaM2: 65,
            areaSqFt: 700,
            clearHeightMin: "3.5 m (11.5 ft)",
            clearHeightMax: "4.0 m (13 ft)",
            coolingCapacity: "Quiet-mode dedicated climate system",
            powerPoints: "Embedded tabletop AV interface with high-speed fiber uplink",
            lighting: "Glare-free video conferencing lighting",
            cctvCameras: "Access door security camera",
            amenities: "4K Interactive digital display, PTZ videoconference camera, acoustic wall paneling",
            capacities: {
                meeting: "6 Executive Seating (Ergonomic leather chairs)"
            },
            idealFor: "Hybrid corporate meetings, virtual board delegations, steering committee deliberations.",
            gps: { lat: 13.02913, lng: 80.01113 }
        },

        // ─── CORPORATE BOARDROOM ───────────────────────────────────────
        "Corporate Boardroom": {
            id: "boardroom",
            title: "Corporate Boardroom",
            category: "Executive Pavilion",
            badge: "Flagship Executive Chamber",
            areaM2: 120,
            areaSqFt: 1290,
            clearHeightMin: "3.8 m (12.5 ft)",
            clearHeightMax: "4.2 m (13.8 ft)",
            coolingCapacity: "Precision silent-flow climate control",
            powerPoints: "Multi-point boardroom conference table integration with presentation hubs",
            lighting: "Bespoke architectural pendant & indirect cove illumination",
            cctvCameras: "Secure suite perimeter monitoring",
            amenities: "12 Executive leather armchairs, presentation screen, dedicated pantry annex",
            capacities: {
                boardroom: "12 Executive Seating (High-backed presidential seating)"
            },
            idealFor: "Annual general meetings, executive board assemblies, government bilateral discussions.",
            gps: { lat: 13.02912, lng: 80.01112 }
        },

        // ─── VIP LOUNGE ────────────────────────────────────────────────
        "VIP Lounge": {
            id: "vip-lounge",
            title: "VIP Lounge",
            category: "Executive Pavilion",
            badge: "Luxury Hospitality Enclave",
            areaM2: 195,
            areaSqFt: 2100,
            clearHeightMin: "3.8 m (12.5 ft)",
            clearHeightMax: "4.5 m (14.8 ft)",
            coolingCapacity: "Dedicated whisper-quiet VRV cooling",
            powerPoints: "Lounge sofa side-table concealed charging ports",
            lighting: "Ambient hospitality mood lighting with warm accents",
            cctvCameras: "Private foyer security camera",
            amenities: "Plush designer lounge seating, private restroom, dedicated butler station",
            capacities: {
                lounge: "40 – 50 VIP Guests (Relaxed luxury setting)"
            },
            idealFor: "Keynote speaker green room, VIP delegates hospitality, dignitary holding suite.",
            gps: { lat: 13.02914, lng: 80.01114 }
        },

        // ─── CO-WORKING LOUNGE ─────────────────────────────────────────
        "Co-Working Lounge": {
            id: "coworking-lounge",
            title: "Co-Working Lounge",
            category: "Executive Pavilion",
            badge: "Collaborative Work Hub",
            areaM2: 240,
            areaSqFt: 2580,
            clearHeightMin: "3.6 m (11.8 ft)",
            clearHeightMax: "4.2 m (13.8 ft)",
            coolingCapacity: "Continuous air filtration and climate management",
            powerPoints: "High-density multi-plug charging stations at all workstations",
            lighting: "Focused daylight-spectrum productivity lighting",
            cctvCameras: "Wide-angle common area surveillance",
            amenities: "High-speed mesh Wi-Fi 6, hot desks, ergonomic task seating, coffee bar access",
            capacities: {
                coworking: "Up to 35 Guests simultaneously"
            },
            idealFor: "Event organizers' operations hub, press media room, attendee productivity lounge.",
            gps: { lat: 13.02915, lng: 80.01115 }
        },

        // ─── CURATED CAFÉ AREA ─────────────────────────────────────────
        "Curated Café Area": {
            id: "curated-cafe",
            title: "Curated Café Area",
            category: "Executive Pavilion",
            badge: "Artisan Refreshment Bar",
            areaM2: 160,
            areaSqFt: 1720,
            clearHeightMin: "3.6 m (11.8 ft)",
            clearHeightMax: "4.0 m (13 ft)",
            coolingCapacity: "Dedicated café ventilation & climate control",
            powerPoints: "Commercial kitchen utility and espresso station supplies",
            lighting: "Bistro-style warm LED filament lighting",
            cctvCameras: "Service counter and dining area coverage",
            amenities: "Full commercial espresso machine setup, display chiller, standing bar tables",
            capacities: {
                cafe: "50 – 70 Guests (Casual beverage & snack layout)"
            },
            idealFor: "Specialty espresso service, artisan tea bar, executive networking breaks.",
            gps: { lat: 13.02916, lng: 80.01116 }
        },

        // ─── FOOD COURT ────────────────────────────────────────────────
        "Food Court": {
            id: "food-court",
            title: "Food Court",
            category: "Dining & Hospitality",
            badge: "Multi-Vendor Culinary Hub",
            areaM2: 1607,
            areaSqFt: 17300,
            dimensionsMetric: "High-capacity commercial dining concourse",
            clearHeightMin: "6.5 m (21 ft)",
            clearHeightMax: "8.5 m (28 ft)",
            coolingCapacity: "High-capacity ventilation & evaporative air management",
            powerPoints: "Heavy commercial 3-phase power for 14 individual kiosk kitchens",
            lighting: "High-lumen bright hospitality illumination",
            cctvCameras: "10 Dedicated surveillance cameras",
            amenities: "Configurable into 14 individual food vendor kiosks with exhaust ducts and water lines",
            capacities: {
                throughput: "3,000+ Meals/hr serving capacity",
                vendors: "14 Independent culinary brand kiosks"
            },
            idealFor: "Exhibition catering, quick-service attendee meals, beverage concessions.",
            gps: { lat: 13.02890, lng: 80.01050 }
        },

        // ─── FOOD COURT DINING AREA ────────────────────────────────────
        "Food Court Dining Area": {
            id: "dining-area",
            title: "Food Court Dining Area",
            category: "Dining & Hospitality",
            badge: "Seated Dining Hall",
            areaM2: 842,
            areaSqFt: 9064,
            dimensionsMetric: "Expansive seated pavilion",
            clearHeightMin: "6.5 m (21 ft)",
            clearHeightMax: "8.5 m (28 ft)",
            coolingCapacity: "Integrated climate control & ventilation",
            powerPoints: "Utility stations and service perimeter power",
            lighting: "Comfort dining ambient illumination",
            cctvCameras: "6 Perimeter and dining zone cameras",
            amenities: "Solid surface dining furniture, waste disposal stations, tray return concourses",
            capacities: {
                seated: "700 – 900 Seated Guests simultaneously",
                banquet: "Large-scale catering buffet operations"
            },
            combinedFoodFootprint: "2,449 sq. m (26,364 sq. ft) combined Food Court & Dining area",
            idealFor: "Sit-down attendee dining, buffet banquets, crew and exhibitor meal shifts.",
            gps: { lat: 13.02895, lng: 80.01040 }
        },

        // ─── ON-SITE HOTEL ─────────────────────────────────────────────
        "On-Site Hotel": {
            id: "onsite-hotel",
            title: "On-Site Hotel",
            category: "Dining & Hospitality",
            badge: "60-Key Accommodation",
            roomCount: "60 Well-appointed guest rooms",
            roomTypes: "30 Double Occupancy Rooms + 30 Triple Occupancy Rooms",
            coolingCapacity: "Individual split inverter AC units in each guest room",
            powerPoints: "Full guest convenience sockets, bedside USB ports, backup generator",
            lighting: "Residential hospitality LED lighting",
            cctvCameras: "24/7 Floor corridor and reception surveillance",
            amenities: "Ensuite bathrooms, room service, dedicated parking, elevator access",
            capacities: {
                guests: "150 – 180 Overnight guests capacity"
            },
            idealFor: "Exhibitor personnel accommodation, VIP keynote speakers, round-the-clock event crew.",
            gps: { lat: 13.02850, lng: 80.01020 }
        },

        // ─── INTER-HALL COVERED CONNECTION ─────────────────────────────
        "Inter-Hall Covered Connection": {
            id: "inter-hall-connection",
            title: "Inter-Hall Covered Connection",
            category: "Exhibition Halls",
            badge: "Weather-Protected Concourse Spine",
            areaM2: 950,
            areaSqFt: 10220,
            dimensionsMetric: "Central transit spine linking Halls A, B, C & D",
            clearHeightMin: "5.5 m (18 ft)",
            clearHeightMax: "6.5 m (21 ft)",
            coolingCapacity: "Weather-protected continuous pedestrian corridor",
            powerPoints: "Perimeter lighting and digital signage feeds",
            lighting: "Linear continuous LED guide illumination",
            cctvCameras: "5 Walkway security cameras (Walkway A: 2, Walkway B: 3)",
            amenities: "Modular canopy weatherproofing, non-slip flooring, directional signage points",
            capacities: {
                circulation: "Fluid bidirectional flow between all 4 exhibition halls"
            },
            idealFor: "Connecting standalone halls into a single unified 210,000+ sq. ft mega exhibition experience.",
            gps: { lat: 13.02940, lng: 80.01160 }
        },

        // ─── WASHROOM & AMENITY AREA ───────────────────────────────────
        "Washroom/Amenity Area": {
            id: "washrooms",
            title: "Washroom & Amenity Facilities",
            category: "Dining & Hospitality",
            badge: "High-Capacity Sanitary Hubs",
            perHallFacilities: "Men (8 urinals, 5 cubicles, 5 vanities), Women (11 cubicles, 6 vanities), 1 Accessible",
            plazaFacilities: "Men (13 urinals, 4 cubicles), Women (10 cubicles, expanded vanities)",
            commonAreaFacilities: "Men (34 urinals, 4 cubicles), Women (34 cubicles, 16 vanities), 2 Accessible",
            waterSupply: "Continuous pressurized gravity & pump supply with automatic sensor fixtures",
            cctvCameras: "External corridor access surveillance",
            amenities: "Touchless sensor faucets, commercial vanity mirrors, full janitorial maintenance stations",
            capacities: {
                totalUrinals: "79+ Urinals campus-wide",
                totalCubicles: "84+ Private cubicles campus-wide"
            },
            idealFor: "Peak event crowd hygiene management, universal accessibility compliance.",
            gps: { lat: 13.02900, lng: 80.01090 }
        },

        // ─── OUTDOOR: GRAND ARRIVAL ENTRANCE GATE ──────────────────────
        "Grand Arrival Entrance Gate": {
            id: "arrival-gate",
            title: "Grand Arrival Entrance Gate",
            category: "Campus Grounds",
            badge: "Highway Portal Arch",
            dimensionsImperial: "Overall Height: 42'-10\" (13.06 m) | Clear Width: 29'-6\" (8.99 m)",
            dimensionsMetric: "Height: 13.06 m | Width: 8.99 m",
            roadNetwork: "Dedicated entry and exit portals facing Bengaluru–Chennai National Highway",
            security: "24/7 Monitored security post with automated boom barriers and RFID scanning",
            lighting: "Pylon floodlighting and architectural gateway illumination",
            capacities: {
                vehicleThroughput: "1,200+ Vehicles/hr entry clearance"
            },
            idealFor: "Grand vehicular arrival, highway-visible brand identity, security screening.",
            gps: { lat: 13.036611510717783, lng: 80.04798908216767 }
        },

        // ─── OUTDOOR: INTERNAL DRIVEWAY & CIRCULATION NETWORK ──────────
        "Internal Driveway & Circulation Network": {
            id: "internal-driveways",
            title: "Internal Driveway & Circulation Network",
            category: "Campus Grounds",
            badge: "Heavy-Duty Concreted Roadway",
            roadWidthMetric: "8 m (26.2 ft) Entry Road + 8 m (26.2 ft) Exit Road",
            roadSurface: "Fully concreted heavy-duty industrial roadway with landscaped center dividers",
            sidewalks: "1.3 m (4.3 ft) Wide elevated pedestrian walkways on both sides with decorative lighting",
            cctvCameras: "14 Drive-route surveillance cameras",
            capacities: {
                circulation: "Simultaneous bidirectional bus, truck, and private car circulation"
            },
            idealFor: "Heavy exhibit transport logistics, visitor shuttle buses, pedestrian safety.",
            gps: { lat: 13.02850, lng: 80.01100 }
        },

        // ─── OUTDOOR: PARKING ZONES ────────────────────────────────────
        "Parking Zones (8,000+ Vehicles)": {
            id: "parking-infrastructure",
            title: "Campus Parking Infrastructure",
            category: "Campus Grounds",
            badge: "8,000+ Vehicle Capacity",
            totalCapacity: "8,000+ Vehicles across Zone 1 and Zone 2",
            parkingZone1: "Zone 1 (Directly opposite Trade Halls A–D): 5 Entry/Exit points for rapid vehicle dispersal",
            parkingZone2: "Zone 2 (Adjacent to Entrance Plaza): 4 Entry/Exit points; multi-purpose open format",
            lighting: "High-mast floodlighting towers covering all parking bays",
            cctvCameras: "Wide-area perimeter surveillance coverage",
            capacities: {
                cars: "6,500+ Cars",
                twoWheelers: "2,000+ Two-wheelers",
                buses: "100+ Commercial heavy buses"
            },
            idealFor: "Mega-scale exhibition parking, self-drive visitor access, valet staging.",
            gps: { lat: 13.035238604004954, lng: 80.04846145726795 }
        },

        // ─── OUTDOOR: THE CANVAS 1 ─────────────────────────────────────
        "THE CANVAS 1": {
            id: "the-canvas-1",
            title: "THE CANVAS 1 — Open Concrete Mega Venue",
            category: "Campus Grounds",
            badge: "93,980 sq. ft Open Arena",
            areaM2: 8732,
            areaSqFt: 93980,
            dimensionsMetric: "95 m (Length) × 32 m (Width)",
            dimensionsImperial: "312 ft (Length) × 105 ft (Width)",
            surface: "Reinforced concrete exhibit floor supporting heavy installations",
            position: "Located at the rear of Exhibition Halls A–D",
            clearSpan: "Uninterrupted sightlines with zero structural obstructions",
            capacities: {
                concertFestival: "12,000 – 15,000 Guests (Open-air concert festival format)",
                exhibition: "250+ Outdoor heavy machinery or automotive display stalls"
            },
            idealFor: "Music festivals, outdoor concerts, automotive test tracks, heavy equipment expos, luxury galas.",
            gps: { lat: 13.02980, lng: 80.01120 }
        },

        // ─── OUTDOOR: THE CANVAS 2 ─────────────────────────────────────
        "THE CANVAS 2": {
            id: "the-canvas-2",
            title: "THE CANVAS 2 — Mega Open-Format Venue",
            category: "Campus Grounds",
            badge: "1,89,564 sq. ft Transformative Arena",
            areaM2: 17611,
            areaSqFt: 189564,
            dimensionsMetric: "227 m (Length) × 50 m (Width)",
            dimensionsImperial: "745 ft (Length) × 164 ft (Width)",
            surface: "Expansive concrete campus arena transformed from Parking Zone 2",
            clearSpan: "Monumental clear span for mega-scale productions",
            totalOpenSpace: "Combined with Canvas 1: 21,553 sq. m (2,32,000 sq. ft) total open space",
            capacities: {
                megaEvents: "25,000 – 30,000 Guests (Stadium-scale public events & expos)",
                staging: "Massive outdoor staging, stunt arenas, global air & automotive shows"
            },
            idealFor: "International music festivals, automotive experiential centers, global brand launch spectacles.",
            gps: { lat: 13.02810, lng: 80.01250 }
        },

        // ─── OUTDOOR: LIGHT POLE BRANDING AVENUE ───────────────────────
        "Light Pole Branding Avenue": {
            id: "light-pole-branding",
            title: "High-Visibility Light Pole Branding Avenue",
            category: "Campus Grounds",
            badge: "Campus-Wide Media Corridor",
            totalPoles: "30 Total Light Poles across prime venue circulation routes",
            brandingPoles: "15 Strategic Branding Scope Poles (2 sides each = 30 display faces)",
            boardSpecifications: "25 Total temporary slip-over foam boards (4 ft × 2 ft / 1.2 m × 0.6 m)",
            mountType: "Screw-bolt assembly framework for swift branding installation and swaps",
            capacities: {
                impressions: "100% Guaranteed visual impression for all entering and exiting delegates"
            },
            idealFor: "Sponsor brand dominance, directional event branding, keynote speaker promotional avenues.",
            gps: { lat: 13.02860, lng: 80.01090 }
        },

        // ─── FIRE DEFENSE & WATER MATRIX ───────────────────────────────
        "Fire Defense & Water Infrastructure": {
            id: "fire-defense-matrix",
            title: "Engineering & Fire Defense Matrix",
            category: "Campus Grounds",
            badge: "210,000 Liter Primed Reserve",
            waterReserve: "210,000 Liters dedicated firefighting water (110k baseline + 100k integration)",
            mainPump: "60 HP (45 kW) Kirloskar Main Electrical Pump — 2,900 m³/hr flow rate at 2900 RPM",
            backupPump: "68 HP Kirloskar Diesel Backup Pump — 2,150 m³/hr flow rate at 2150 RPM",
            jockeyPump: "7.5 HP (5.5 kW) Kirloskar Jockey Priming Pump running at 3000 RPM",
            coverage: "Instant-access internal equipment in all halls + high-density external perimeter hydrants",
            capacities: {
                readiness: "100% Autonomous pressurized firefighting grid across the entire 45,000 m² campus"
            },
            idealFor: "Industrial-grade safety certification, compliance for high-density international summits.",
            gps: { lat: 13.02900, lng: 80.01100 }
        }
    };

    // ── Helper to resolve panorama name to specs entry ──────────────
    function getSpecsForScene(sceneName) {
        if (!sceneName) return EVP_VENUE_SPECS["Entrance Plaza & Foyer"] || EVP_VENUE_SPECS["Hall A"];
        const cleanName = sceneName.trim();

        // Direct key match
        if (EVP_VENUE_SPECS[cleanName]) {
            return EVP_VENUE_SPECS[cleanName];
        }

        // Match Hall A/B/C/D - Classroom/Theatre/Cabaret
        const hallMatch = cleanName.match(/^Hall\s+([ABCD])/i);
        if (hallMatch) {
            const hallKey = "Hall " + hallMatch[1].toUpperCase();
            if (EVP_VENUE_SPECS[hallKey]) {
                return EVP_VENUE_SPECS[hallKey];
            }
        }

        // Fuzzy search by substring
        for (const key in EVP_VENUE_SPECS) {
            if (cleanName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cleanName.toLowerCase())) {
                return EVP_VENUE_SPECS[key];
            }
        }

        // Clean dynamic fallback card for newly added or uncatalogued panoramas
        return {
            id: "evp-facility-" + cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            title: cleanName,
            category: "Convention Centre Facilities",
            badge: "EVP Campus Feature",
            idealFor: "Multi-purpose exhibition, conference, transit, and event operations across the EVP campus.",
            capacities: {
                classroom: "Customizable upon request",
                theatre: "Configurable layout",
                reception: "High-throughput circulation"
            },
            coolingCapacity: "Centrally climate-controlled facility with active ventilation",
            lighting: "Commercial high-efficiency LED illumination grid",
            cctvCameras: "Integrated 24/7 campus CCTV security coverage",
            powerPoints: "Commercial 3-phase and single-phase auxiliary power available",
            fireExits: "Direct connection to NFPA / NBC compliant fire escape egresses",
            gps: { lat: 13.036611510717783, lng: 80.04798908216767 }
        };
    }

    // Expose globally
    window.EVP_VENUE_SPECS = EVP_VENUE_SPECS;
    window.getSpecsForScene = getSpecsForScene;

})();
