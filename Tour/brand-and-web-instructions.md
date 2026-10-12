# EVP Trade & Convention Centre — Brand Guidelines & Web Instructions

> **Official Virtual Tour Design System & Technical Specification**  
> Virtual Tour Application — EVP Trade & Convention Centre, Chennai  
> White Frosted Glassmorphism, Imperial Gold (`#FFB703`), and Midnight Obsidian (`#131330`) System

---

## 1. Executive Summary & Design Philosophy

The visual identity of **EVP Trade & Convention Centre** embodies South India's premier, state-of-the-art mega exhibition and convention facility. Situated on the Chennai – Bengaluru National Highway (Chembarambakkam, Poonamallee), EVP represents monumental scale, world-class industrial engineering, and corporate luxury.

The virtual tour web layer follows a **White Frosted Glassmorphism** design language characterized by:
- **Pristine White Translucency**: High-blur, high-saturation frosted glass surfaces (`rgba(255, 255, 255, 0.88)` with `backdrop-filter: blur(24px)`).
- **EVP Imperial Gold (`#FFB703`)**: High-contrast, radiant gold accents representing premier prestige, active states, glowing pills, and focus rings.
- **Midnight Obsidian (`#131330`)**: Deep architectural charcoal for crystal-clear, high-readability typography, primary action buttons, and contrast structures.
- **No Coastal / School Legacy**: All coastal nautical blues, school emblems, and academic terminology are permanently eliminated.

---

## 2. Complete Brand Color System

Calibrated specifically for high-contrast accessibility, luxury trade venue branding, and multi-device readability.

### 2.1 Primary Brand Colors

| Role | Name | HEX | Usage |
| :--- | :--- | :--- | :--- |
| **Imperial Gold** | EVP Imperial Gold | `#FFB703` | Active tab indicators, focus rings, hover glow, brand highlights |
| **Gold Deep / Amber** | Burnished Amber | `#D97706` / `#B45309` | Text accents on white surfaces, distance tags, secondary highlights |
| **Midnight Obsidian** | Obsidian Charcoal | `#131330` | Dominant typography, primary buttons, high-contrast modal headers |
| **Midnight Hover** | Deep Royal Indigo | `#1C1C46` / `#232355` | Hover states for primary buttons and dark surfaces |
| **Abyss Base** | Venue Deep Base | `#0F0F26` | Deep drop shadows, maximum contrast outlines |

---

### 2.2 Neutral UI & Glassmorphism Surfaces

| Role | Name | HEX / Value | Usage |
| :--- | :--- | :--- | :--- |
| **Pure White** | Pure White | `#FFFFFF` | Card backgrounds, icon badges, contrast elements |
| **Glass Backdrop** | Frosted Overlay | `rgba(19, 19, 48, 0.42)` | Modal backdrops with `blur(24px) saturate(180%)` |
| **Glass Card Body** | White Translucent | `rgba(255, 255, 255, 0.90)` | Floating dock, modal containers with `blur(28px)` |
| **Card Border** | Glass Border | `rgba(255, 255, 255, 0.85)` | Crisp outer border for frosted glass elements |
| **Subtle Divider** | Border Hairline | `rgba(19, 19, 48, 0.08)` / `#E2E8F0` | Dividers, separators, inactive input borders |
| **Text Secondary** | Muted Slate | `#64748B` | Subtitles, metadata tags, descriptions |
| **Text Primary** | Obsidian Body | `#131330` | Headings, titles, labels, card names |

---

### 2.3 Production CSS Variables (`:root`)

```css
:root {
    /* Primary Brand Colors */
    --evp-gold: #FFB703;
    --evp-gold-deep: #B45309;
    --evp-obsidian: #131330;
    --evp-obsidian-hover: #1C1C46;
    --evp-abyss: #0F0F26;

    /* Surfaces & Glassmorphism */
    --evp-bg-pure: #FFFFFF;
    --evp-bg-glass: rgba(255, 255, 255, 0.90);
    --evp-border-glass: rgba(255, 255, 255, 0.85);
    --evp-backdrop-glass: rgba(19, 19, 48, 0.42);
    --evp-divider: rgba(19, 19, 48, 0.08);

    /* Typography */
    --evp-text-primary: #131330;
    --evp-text-secondary: #64748B;
    --evp-text-muted: #94A3B8;

    /* Font Definitions */
    --font-heading: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-body: 'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## 3. Strict Typography Rules

### 3.1 Primary Title & Heading Font: **Plus Jakarta Sans**
- **Font Family**: `'Plus Jakarta Sans', sans-serif`
- **Assigned Scope**:
  - `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
  - All Modal Titles & Subtitles (`.loc-header-titles h3`, `.gsv-header-heading h2`, `.contact-title`)
  - Venue Title on Brand Badges (`EVP TRADE & CONVENTION`)
  - Key Metric Values (`.loc-stat-value`, `.bento-stat`)
- **Supported Weights**:
  - `800` (ExtraBold) — Main modal titles, brand names
  - `700` (Bold) — Section headings, card titles
  - `600` (SemiBold) — Subtitles, category tags

---

### 3.2 General UI, Body & Button Font: **Satoshi**
- **Font Family**: `'Satoshi', sans-serif`
- **Assigned Scope**:
  - Body paragraphs (`p`), location descriptions, amenity details
  - Button labels (`.loc-card-btn`, `.pcis-dock-tab-label`, `.contact-btn`)
  - Form inputs (`input`, `textarea`, `select`)
  - Tooltips, status chips, and breadcrumb tags
- **Supported Weights**:
  - `700` (Bold) — Primary buttons, tags, badges
  - `600` / `500` (Medium) — Regular UI copy, descriptions

---

### 3.3 MANDATORY RULE: Strictly No Italic Styles
> **NO ITALIC STYLING IS PERMITTED ANYWHERE IN THE INTERFACE.**
> - `font-style: normal !important;` is enforced across all elements.
> - Do **not** use CSS `font-style: italic` or `font-style: oblique`.
> - Do **not** use HTML `<i>` tags for italicizing text. HTML `<i>` tags are reserved strictly for icon fonts.
> - Emphasis must be achieved through font weight (`800` vs `600`) or color hierarchy (`#FFB703` / `#131330`).

---

## 4. Strict Iconography Rules

### 4.1 Icons Only (Flaticon & Font Awesome)
- Use standard icon font classes (e.g., `<i class="fi fi-rr-marker"></i>`, `<i class="fi fi-sr-building"></i>`).
- Ensure `font-style: normal !important;` prevents accidental italics.

### 4.2 MANDATORY RULE: Zero Unicode Emojis
> **ABSOLUTELY NO UNICODE EMOJIS IN THE USER INTERFACE.**
> - Emojis are strictly forbidden in UI titles, buttons, tooltips, list items, and status indicators.
> - Always replace any intended emoji with standard icon font classes.

### 4.3 MANDATORY RULE: No Inline SVG Vectors Dumped in Markup
> **DO NOT HARDCODE RAW INLINE SVG VECTORS IN COMPONENT MARKUP.**
> - Use standard icon classes or reference dedicated asset files in `Components/Logo/Assets/` (e.g., `Logo.svg`).

---

## 5. Venue Layout & Engineering Specifications

### 5.1 Indoor 3DVista Panoramas (Exactly 17 Models)
The indoor virtual tour consists of exactly 17 spherical model panoramas exported from 3DVista:

1. **Entrance Plaza & Foyer** (`panorama_181093AC...`) — Grand welcome foyer & registration
2. **Exhibition Hall A** (`panorama_1CF56E62...`) — Mega exhibition hall ($54,144\text{ sq. ft.}$)
3. **Exhibition Hall B** (`panorama_18CE440E...`) — Mega exhibition hall ($54,144\text{ sq. ft.}$)
4. **Exhibition Hall C** (`panorama_18357926...`) — Mega exhibition hall ($54,144\text{ sq. ft.}$)
5. **Exhibition Hall D** (`panorama_181B81E4...`) — Grand convention hall ($47,762\text{ sq. ft.}$)
6. **Inter-Hall Covered Connection** (`panorama_1978B9D5...`) — Spine walkway between halls
7. **Executive Hospitality Pavilion** (`panorama_19E5A93E...`) — Dignitary & VIP lounge
8. **Corporate Boardroom** (`panorama_19E24946...`) — Executive high-table boardroom
9. **Executive Meeting Room** (`panorama_19E24943...`) — B2B conference suite
10. **Private Meeting Suites** (`panorama_19E20941...`) — Delegate meeting suites
11. **VIP Lounge** (`panorama_19E38948...`) — Executive hospitality lounge
12. **Co-Working Lounge** (`panorama_19E2694A...`) — Media & business center
13. **Food Court** (`panorama_18029649...`) — Central dining concourse
14. **Food Court Dining Area** (`panorama_187BC80C...`) — Multi-cuisine dining hall
15. **Curated Café Area** (`panorama_19E3994B...`) — Mezzanine bistro & coffee lounge
16. **On-Site Hotel** (`panorama_190396AC...`) — Luxury guest accommodation suites
17. **Washroom / Amenity Area** (`panorama_19711C92...`) — Executive restrooms & portals

### 5.2 Outdoor Grounds (Exclusively Google Street View)
Outdoor areas are handled strictly via **Google Street View (GSV)** nodes (25 confirmed locations documented in `EVP Tour Info.md`):
- **Highway Approach & Gate Portals**: Grand Main Entrance Gate, Main Exit Gate, Highway-Facing NH-4 Approach, External Access Gates, Venue Perimeter.
- **Vehicular & Pedestrian Circulation**: 8m Concreted Internal Driveway, Dedicated Entry & Exit Roads, 1.3m Elevated Landscaped Pedestrian Walkways, Main Campus Circulation Loop, Drive Route, Parking-to-Hall Approach Paths.
- **Open-Air Mega Event Grounds**: The Canvas 1 (93,980 sq. ft.), The Canvas 2 (1,89,564 sq. ft.), Main Open Space.
- **Parking Infrastructure**: Parking Zone 1 & Parking Zone 2 (8,000+ total vehicle capacity).
- **Architectural Exteriors & Facades**: Hall A–D Exterior Facades (with 20 ft rolling shutters), Entrance Plaza Frontage, Food Court Exterior, Light Pole Branding Corridor (15 poles / 30 boards), Landscaped Internal Road Areas.

---

## 6. Official Venue Specifications Reference

- **Location**: Chennai – Bengaluru National Highway, Chembarambakkam, Poonamallee, Chennai – 600123
- **Coordinates**: Lat `13.036611510717783` N, Lng `80.04798908216767` E
- **Hotline**: `+91 85258 11111`
- **Email**: `info@evptradecentre.com`
- **Website**: `www.evptradecentre.com`
- **Hall Clear Height**: $9.7\text{ m}$ to $15\text{ m}$
- **Floor Load**: $5\text{ T/m}^2$ (Heavy industrial capacity)
- **Air Conditioning**: $300\text{ TR}$ per hall (18 units per hall)

---

## 7. Component Architecture

### 7.1 Logo Component (`Components/Logo/Logo.js`)
- Renders full widescreen `Components/Logo/Assets/Luxury EVP Trade and Convention Logo.png` filling 95% of an Apple Mac squircle solid pure white card (`background: #FFFFFF`, `height: 78px`, `padding: 4px 12px`, `border-radius: 20px`), perfectly locked in rendered vertical height (`78px`), top baseline (`max(18px, env(safe-area-inset-top))`), and corner curvature with the "Now Exploring" Pano Indicator. Zero background translucency seams.
- **Pure Logo Presentation**: Zero redundant text blocks, subtitles, or vertical dividers next to the card; the luxury brand asset speaks for itself.
- **Favicon & Mobile Web App Icons**: Multi-resolution `favicon.ico`, `favicon.png` (32×32), and `apple-touch-icon.png` (180×180) generated directly from the official luxury brand asset.
- Interactive: Clicking the brand card resets camera view to Entrance Plaza (Panorama 0).

### 7.2 Navigation Dock (`Components/Menu/menu.js`)
- Floating 4-tab pill dock at bottom-center.
- Sliding active indicator: Solid `#FFB703` (Imperial Gold) with soft gold drop shadow.
- Action tabs: Home, Explore (17 Panos), Street View (GSV Outdoor), Connect (Hotline & Booking).

### 7.3 Scene Explorer (`Components/Panolist/Panolist.js`)
- Top-center "Now Exploring" widget showing the current active hall or suite name.
- Bottom expandable drawer displaying all 17 indoor panoramas with dynamic `.webp` thumbnail previews.

### 7.4 Direction & Location Hub (`Components/Location/location.js`)
- GPS Haversine calculation, real-time ETA, bearing, and distance tracking.
- 16 destination cards categorized into Halls, Executive Pavilion, Dining & Hotel, Outdoor & Arrival, Amenities.
- Integrated QR Code Scan-to-Drive modal (`#131330` fill) and native deep links (Apple Maps, Google Maps).

### 7.5 Contact Us Modal (`Components/Contact Us/contact.js`)
- High-contrast bento grid featuring booking hotline `+91 85258 11111`, WhatsApp chat, RFP inquiry email, and Poonamallee address.

### 7.6 Welcome & Audio Consent Modal (`Components/Music/music.js` & `music.css`)
- Renders the official widescreen luxury logo in an Apple squircle card scaled to `145px × 72px` (`border-radius: 14px`, `background: #FFFFFF`), perfectly proportioned within the `380px` modal without overwhelming the layout. Zero yellow border lines.

---

## 8. Quality & Verification Checklist

Before shipping any updates:
- [x] All legacy school / PCIS text and emblems removed
- [x] Frosted White Glassmorphism base applied (`rgba(255, 255, 255, 0.88)` + `blur(24px)`)
- [x] Primary accent uses `#FFB703` (EVP Imperial Gold)
- [x] Primary text uses `#131330` (Midnight Obsidian)
- [x] All titles use **Plus Jakarta Sans**
- [x] All body copy uses **Satoshi**
- [x] Strictly zero italic fonts (`font-style: normal !important;`)
- [x] Strictly zero unicode emojis
- [x] Indoor tour limited strictly to the 17 model panoramas
- [x] Outdoor locations routed through Google Street View (GSV)
- [x] Zero broken asset paths or missing scripts in `index.htm`

---

*EVP Trade & Convention Centre — Virtual Tour Design & Engineering Guidelines*
