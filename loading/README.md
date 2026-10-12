# EVP Convention Centre — React Bits 3D Physics Lanyard & VIP Pass

> **Standalone Module** for the EVP Convention Centre Virtual Tour.  
> Directly ported from the [React Bits Lanyard Component](https://reactbits.dev/components/lanyard) into pure Vanilla JavaScript + Three.js.  
> Completely decoupled from the `Tour/` directory for zero-risk testing and clean architecture.

---

## 📁 Directory Structure

```
e:\Tours\EVP\loading\
├── index.html       # Standalone interactive 3D testbed (Open directly in browser)
├── Lanyard.css      # React Bits styling: canvas layout, ambient starfield & luxury HUD
├── lanyard.js       # Complete Vanilla JS + Three.js port with Verlet physics & GLSL holographic shaders
├── loading.css      # Legacy DOM-based loader stylesheet (kept as fallback)
├── loading.js       # Legacy DOM-based loader script (kept as fallback)
└── README.md        # Technical reference & integration blueprint
```

---

## 🚀 How to Experience the 3D Lanyard

1. Open `loading/index.html` directly in any modern browser (Chrome, Edge, Safari, Firefox).
2. **Interactive 3D Verlet Physics:**
   - **Drag & Swing:** Click and drag the pass to swing and toss it in 3D space with Verlet cloth physics and rigid-body inertia.
   - **Tap to Flip:** A single quick tap on the card flips it 180° around its vertical axis, displaying the campus details on the reverse side.
   - **Holographic Prismatic Shaders:** Watch the GLSL foil diffraction patterns (`foilGrating`, `foilShard`) shimmer dynamically under directional key, fill, and top lights.
3. **Single-Action Tour Entry (No 2nd Screen):**
   - Click the prominent pulsing button: **`TAP PASS TO ENTER TOUR`** (or double-tap the card).
   - Unlocks the browser Web Audio context, plays the synthesized EVP crystal harmonic chime, smoothly dismisses the HUD, and navigates straight to `../Tour/index.htm?audio=1`.
   - Clicking **`Explore in Silence`** navigates to `../Tour/index.htm?audio=0`.

---

## 💎 Features Ported from React Bits

* **Pure Vanilla Three.js:** Removed all React / JSX / bundler dependencies. Runs directly in any browser using standard `<script>` tags.
* **Full Cloth & Pendulum Physics:**
  - 4-joint Verlet cloth strap with spring stiffness, damping, and rest length constraints.
  - Catmull-Rom centripetal spline ribbon interpolation with 72 ribbon samples.
  - 3D rigid body pendulum solver with custom rotational inertia and impulse response.
* **Custom GLSL Foil Shaders:**
  - Prismatic diffraction grating injected via `Material.onBeforeCompile`.
  - Sparkle shard noise simulating luxury holographic VIP badges.
* **Procedural Vector Badge Graphics:**
  - Dynamic high-resolution canvas texturing with official transparent EVP Gold Crest, RFID microchip, security clearance matrix, and authentication barcode.
  - Woven dark nylon strap with metallic gold border ribbons and woven text: `"EVP • VIP DELEGATE"`.
  - Metallic gold clamp, eyelet, and split ring hardware.
* **Strict Tour Icon Rules:**
  - Uses only Flaticon UIcons (`fi fi-rr-*`) and Font Awesome 6.
  - Zero unicode emojis.
