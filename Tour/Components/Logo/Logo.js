// ═══════════════════════════════════════════════════════════
//  EVP TRADE & CONVENTION CENTRE — Official Brand Header Card
//  White Frosted Glassmorphism with EVP Gold (#FFB703) & Midnight (#131330)
// ═══════════════════════════════════════════════════════════
(function () {
    "use strict";

    if (document.getElementById("pcis-brand-card")) return;

    // ─── Inject Styles ──────────────────────────────────────────
    const style = document.createElement("style");
    style.id = "pcis-brand-styles";
    style.textContent = `
        .pcis-brand-card {
            position: fixed;
            top: max(18px, env(safe-area-inset-top));
            left: max(20px, env(safe-area-inset-left));
            z-index: 100060;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 4px 12px;
            box-sizing: border-box;
            height: 78px;
            background: #FFFFFF;
            border: 1px solid rgba(19, 19, 48, 0.08);
            border-radius: 20px;
            box-shadow: 
                0 4px 14px rgba(19, 19, 48, 0.06),
                0 16px 36px rgba(19, 19, 48, 0.10);
            user-select: none;
            cursor: pointer;
            pointer-events: auto;
            transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 300ms ease,
                        box-shadow 260ms ease;
            font-style: normal !important;
        }

        .pcis-brand-card:hover {
            transform: translateY(-2px);
            box-shadow: 
                0 8px 24px rgba(19, 19, 48, 0.10),
                0 24px 54px rgba(19, 19, 48, 0.16);
        }

        .pcis-brand-logo-img {
            height: 92%;
            max-height: 70px;
            width: auto;
            object-fit: contain;
            display: block;
            pointer-events: none;
            transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pcis-brand-card:hover .pcis-brand-logo-img {
            transform: scale(1.02);
        }

        /* Clean Mode UI Toggle state */
        body.is-ui-hidden .pcis-brand-card {
            opacity: 0;
            transform: translateY(-24px);
            pointer-events: none;
        }

        /* Responsive (Mobile & Tablet) */
        @media (max-width: 1024px) {
            .pcis-brand-card {
                top: max(12px, env(safe-area-inset-top));
                left: max(12px, env(safe-area-inset-left));
                height: 48px;
                padding: 2px 8px;
                border-radius: 16px;
            }
            .pcis-brand-logo-img {
                max-height: 44px;
            }
        }

        @media (max-width: 480px) {
            .pcis-brand-card {
                top: max(10px, env(safe-area-inset-top));
                left: max(10px, env(safe-area-inset-left));
                height: 44px;
                padding: 2px 6px;
                border-radius: 14px;
            }
            .pcis-brand-logo-img {
                max-height: 40px;
            }
        }
    `;
    document.head.appendChild(style);

    // ─── Build DOM ──────────────────────────────────────────────
    const card = document.createElement("div");
    card.id = "pcis-brand-card";
    card.className = "pcis-brand-card";
    card.setAttribute("role", "banner");
    card.setAttribute("aria-label", "EVP Trade and Convention Centre");

    card.innerHTML = `
        <img src="Components/Logo/Assets/Luxury EVP Trade and Convention Logo.png" alt="EVP Trade and Convention Centre" class="pcis-brand-logo-img" />
    `;

    document.body.appendChild(card);

    // Fallback if primary logo fails to load
    const img = card.querySelector("img");
    if (img) {
        img.onerror = function () {
            this.src = "Components/Logo/Assets/Logo.png";
        };
    }

    // Click brand card to reset to home view (Entrance Plaza)
    card.addEventListener("click", function () {
        if (window.tour && typeof window.tour.setMediaByIndex === "function") {
            window.tour.setMediaByIndex(0);
        }
    });

    // Public API
    window.toggleLogo = function (visible) {
        if (typeof visible === "boolean") {
            card.style.display = visible ? "flex" : "none";
        } else {
            card.style.display = card.style.display === "none" ? "flex" : "none";
        }
    };
})();
