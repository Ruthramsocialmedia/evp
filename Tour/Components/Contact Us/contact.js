(function () {
    const style = document.createElement('style');
    style.textContent = `
        /* ═════════════════════════════════════════════
           CONTACT US — Bento Grid Layout
           Modern, dashboard-style grid of actions
           Standardized Navy Theme
           ═════════════════════════════════════════════ */

        .contact-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(19, 19, 48, 0.42);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            z-index: 100070;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .contact-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .contact-modal {
            width: 94%;
            max-width: 500px;
            height: auto;
            max-height: 90vh;
            background: #F8FAFC;
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.85);
            box-shadow:
                0 32px 80px -16px rgba(19, 19, 48, 0.32),
                0 0 0 1px rgba(19, 19, 48, 0.08);
            padding: 0;
            transform: translateY(30px) scale(0.96);
            transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
            overflow: hidden;
            font-family: 'Satoshi', sans-serif;
            display: flex;
            flex-direction: column;
        }
        .contact-overlay.active .contact-modal {
            transform: translateY(0) scale(1);
        }

        /* ── Header — Luminous Frosted Institutional Glass ────── */
        .contact-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 246, 255, 0.92) 100%);
            border-bottom: 1px solid rgba(19, 19, 48, 0.08);
            position: relative;
            flex-shrink: 0;
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
        }

        .contact-header-titles {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
        }

        .contact-header-icon-box {
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

        .contact-header-heading {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
        }

        .contact-header-heading h2 {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-size: 17px;
            font-weight: 800;
            color: #131330;
            margin: 0;
            line-height: 1.2;
            letter-spacing: -0.01em;
            white-space: nowrap;
        }

        .contact-header-heading p {
            font-family: 'Satoshi', sans-serif !important;
            font-size: 11.5px;
            color: #64748B;
            margin: 0;
            line-height: 1.2;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Signature Red Circular Close Button with 360° Hover Spin */
        /* Red Circular Close Button with 360° Hover Spin (Standardized) */
        .contact-close {
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

        .contact-close:hover {
            background: #DC2626;
            color: #FFFFFF;
            transform: rotate(360deg);
        }

        .contact-close:active {
            transform: rotate(360deg) scale(0.94);
        }

        .contact-close i {
            font-size: 18px;
            line-height: 1;
            display: inline-flex;
            margin: 0;
            padding: 0;
            pointer-events: none;
            color: #FFFFFF;
        }

        /* ── Bento Grid ────────────────────────────── */
        .contact-grid {
            padding: 24px 22px 30px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            overflow-y: auto;
            /* Hide Scrollbar */
            scrollbar-width: thin; 
            scrollbar-color: #CBD5E1 transparent;
        }
        .contact-grid::-webkit-scrollbar { width: 4px; }
        .contact-grid::-webkit-scrollbar-track { background: transparent; }
        .contact-grid::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.2); border-radius: 10px; }

        /* Grid Items */
        .bento-card {
            background: #FFFFFF;
            border-radius: 16px;
            padding: 16px;
            text-decoration: none;
            color: #0F172A;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255,255,255,0.8);
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .bento-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
            z-index: 2;
        }
        .bento-card:active { transform: scale(0.98); }

        /* Full Width Items */
        .bento-wide { grid-column: span 2; }

        /* Toast Notification */
        .bento-toast {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: #131330;
            color: #FFFFFF;
            border: 1px solid rgba(255, 183, 3, 0.3);
            box-shadow: 0 8px 24px rgba(19, 19, 48, 0.35);
            padding: 8px 18px;
            border-radius: 20px;
            font-family: 'Satoshi', sans-serif !important;
            font-size: 12px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: 0;
            pointer-events: none;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 25;
            white-space: nowrap;
        }
        .bento-toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        /* Micro Copy Buttons */
        .bento-copy-btn {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.25);
            color: inherit;
            width: 32px;
            height: 32px;
            border-radius: 9px;
            display: grid;
            place-items: center;
            cursor: pointer;
            font-size: 13px;
            margin-left: auto;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            outline: none;
            flex-shrink: 0;
        }
        .bento-copy-btn:hover {
            background: rgba(255, 255, 255, 0.28);
            transform: scale(1.08);
        }
        .bento-copy-btn-light {
            background: #F1F5F9;
            border: 1px solid rgba(19, 19, 48, 0.12);
            color: #475569;
        }
        .bento-copy-btn-light:hover {
            background: #E2E8F0;
            color: #131330;
            transform: scale(1.08);
        }

        /* Venue Hotline (Hero) */
        .bento-whatsapp {
            background: linear-gradient(135deg, #131330 0%, #1E1E45 100%);
            border: 1px solid rgba(255, 183, 3, 0.3);
            color: #FFFFFF;
            padding: 18px 20px;
            flex-direction: row;
            align-items: center;
            gap: 14px;
            min-height: 76px;
        }
        .bento-whatsapp .icon-box {
            background: rgba(255, 183, 3, 0.18);
            color: #FFB703;
            margin-bottom: 0;
        }
        .bento-wa-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 800; display: block; color: #FFFFFF; }
        .bento-wa-sub { font-size: 14px; color: #FFB703; margin-top: 2px; display: block; font-weight: 700; font-family: 'Satoshi', sans-serif;}

        /* Standard Card Content */
        .icon-box {
            width: 42px; height: 42px;
            border-radius: 12px;
            display: grid;
            place-items: center;
            font-size: 18px;
            margin-bottom: 12px;
            transition: transform 0.3s;
        }
        .bento-card:hover .icon-box { transform: scale(1.1) rotate(-5deg); }
        
        .bento-label {
            font-size: 11px;
            color: #64748B;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 4px;
            display: block;
        }
        .bento-value {
            font-size: 15px;
            color: #0F172A;
            font-weight: 700;
            line-height: 1.3;
        }
        
        /* Styles per type */
        .card-phone .icon-box { background: #E0F2FE; color: #0284C7; }
        .card-phone:hover { border-color: #BAE6FD; }

        .card-donate .icon-box { background: #FEF3C7; color: #D97706; }
        .card-donate:hover { border-color: #FDE68A; }

        .card-mail .icon-box { background: #F3E8FF; color: #7C3AED; }
        .card-mail:hover { border-color: #E9D5FF; }

        /* Venue Location Card */
        .card-location {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 16px 18px !important;
            gap: 14px;
        }
        .card-location:hover {
            border-color: rgba(255, 183, 3, 0.45);
        }
        .card-location .icon-box {
            background: #F1F5F9;
            color: #475569;
            margin-bottom: 0 !important;
            flex-shrink: 0;
        }
        .card-location-details {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            min-width: 0;
        }
        .card-location-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
            flex: 1;
        }
        .card-location .bento-copy-btn {
            margin: 0 !important;
            flex-shrink: 0;
            align-self: center;
        }
        
        .card-web .icon-box { background: #DCFCE7; color: #16A34A; }

        /* Email List */
        .bento-emails {
            gap: 10px;
            justify-content: flex-start;
        }
        .email-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px;
            background: #F8FAFC;
            border-radius: 10px;
            font-size: 13px;
            color: #334155;
            font-weight: 500;
            text-decoration: none;
            transition: background 0.2s;
            overflow: hidden; /* Safety */
            min-width: 0; /* CRITICAL: Allows grid item to shrink below content size */
        }
        .email-row:hover { background: #F1F5F9; color: #0F172A; }
        .email-row i { color: #94A3B8; font-size: 12px; transition: color 0.2s; flex-shrink: 0; }
        .email-row:hover i { color: #7C3AED; }
        .email-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 0;
            flex: 1; /* Ensure text takes available space */
        }

        /* ── Social Channels Row ── */
        .card-social {
            background: #FFFFFF;
        }
        .social-links-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            width: 100%;
            margin-top: 4px;
        }
        .social-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px 8px;
            border-radius: 12px;
            text-decoration: none !important;
            font-size: 12px;
            font-weight: 700;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            color: #131330;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, opacity 0.2s ease;
            box-shadow: 0 2px 8px rgba(19, 19, 48, 0.08);
            border: none;
        }
        .social-btn:hover {
            transform: translateY(-2px);
            opacity: 0.95;
            box-shadow: 0 6px 16px rgba(19, 19, 48, 0.16);
        }
        .social-btn:active {
            transform: scale(0.96);
        }
        .social-btn i {
            font-size: 15px;
            line-height: 1;
        }
        .social-fb { background: #1877F2; }
        .social-ig { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); }
        .social-yt { background: #FF0000; }
        .social-li { background: #0A66C2; }

        @media (max-width: 520px) {
            .social-links-row {
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }
            .social-btn {
                padding: 10px 8px;
                font-size: 11.5px;
            }
        }

        /* ═══════ Responsive ═══════ */

        /* Tablet / Small Desktop */
        @media (max-width: 768px) {
            .contact-modal {
                width: 100%;
                max-width: 100%;
                height: auto;
                max-height: 85vh;
                border-radius: 24px 24px 0 0;
                position: absolute;
                bottom: 0;
                transform: translateY(100%);
                padding-bottom: env(safe-area-inset-bottom);
            }
            .contact-overlay.active .contact-modal {
                transform: translateY(0);
            }
            .contact-header { padding: 14px 18px; }
            .contact-grid { 
                padding: 24px 24px 40px; 
                grid-template-columns: 1fr 1fr; 
                gap: 12px;
            }
            .mobile-wide { grid-column: span 2; }
            
            .bento-card { padding: 16px; }
            .icon-box { width: 36px; height: 36px; font-size: 16px; }
            .bento-value { font-size: 14px; }
        }

        /* Standard Mobile */
        @media (max-width: 480px) {
            .contact-modal {
                max-height: 80vh;
                border-radius: 20px 20px 0 0;
            }
            .contact-header {
                padding: 12px 14px;
            }
            .contact-header-heading h2 {
                font-size: 15px;
            }
            .contact-header-heading p {
                font-size: 10.5px;
            }
            .contact-header-icon-box {
                width: 34px;
                height: 34px;
                font-size: 15px;
                border-radius: 10px;
            }
            .contact-grid {
                padding: 16px 16px 32px;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            .bento-card {
                padding: 14px;
                border-radius: 14px;
            }
            .icon-box {
                width: 34px; height: 34px;
                font-size: 15px;
                border-radius: 10px;
                margin-bottom: 10px;
            }
            .bento-label { font-size: 10px; letter-spacing: 0.6px; }
            .bento-value { font-size: 13px; }
            .bento-wa-title { font-size: 15px; }
            .bento-wa-sub { font-size: 11px; }
            .bento-whatsapp { padding: 16px; min-height: 60px; gap: 12px; }
            .email-row { font-size: 12px; padding: 7px; }
        }

        /* Ultra-small phones */
        @media (max-width: 380px) {
            .contact-grid {
                grid-template-columns: 1fr;
                gap: 8px;
                padding: 14px 14px 28px;
            }
            .mobile-wide, .bento-wide { grid-column: span 1; }
            .bento-card {
                flex-direction: row;
                align-items: center;
                gap: 14px;
                text-align: left;
                padding: 14px;
            }
            .icon-box { margin-bottom: 0; flex-shrink: 0; }
            .bento-whatsapp {
                flex-direction: row;
                align-items: center;
            }
            .card-mail.bento-wide {
                flex-direction: column;
                align-items: stretch;
            }
            .card-mail .bento-label { margin-bottom: 8px; }
            .bento-label { font-size: 10px; }
            .bento-value { font-size: 13px; }
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.className = 'contact-overlay';

    // HTML Structure
    overlay.innerHTML = `
        <div class="contact-modal">
            <div class="contact-header">
                <div class="contact-header-titles">
                    <div class="contact-header-icon-box"><i class="fi fi-sr-building" aria-hidden="true"></i></div>
                    <div class="contact-header-heading">
                        <h2>Venue Booking &amp; Enquiries</h2>
                        <p>Sales Hotline, WhatsApp Desk &amp; Event Planning</p>
                    </div>
                </div>
                <button class="contact-close" type="button" aria-label="Close Venue Booking"><i class="fi fi-rr-cross-small" aria-hidden="true"></i></button>
            </div>
            
            <div class="contact-grid">
                <!-- Phone (Hero) -->
                <div class="bento-card bento-wide bento-whatsapp mobile-wide">
                    <div class="icon-box"><i class="fi fi-rr-phone-call"></i></div>
                    <div style="flex:1; min-width:0;">
                        <span class="bento-wa-title">Venue Booking Hotline</span>
                        <span class="bento-wa-sub">+91 85258 11111</span>
                    </div>
                    <a href="tel:+918525811111" class="bento-copy-btn" title="Call directly" aria-label="Call directly" style="text-decoration:none;"><i class="fi fi-rr-phone-call"></i></a>
                    <button class="bento-copy-btn" data-copy="+918525811111" title="Copy phone number" aria-label="Copy phone number" type="button"><i class="fi fi-rr-copy"></i></button>
                </div>

                <!-- WhatsApp -->
                <a href="https://wa.me/918525811111" target="_blank" rel="noopener noreferrer" class="bento-card card-wa">
                    <div class="icon-box" style="background:#E8FBF1; color:#25D366; margin-bottom:12px;"><i class="fi fi-brands-whatsapp"></i></div>
                    <div>
                        <span class="bento-label">WhatsApp Desk</span>
                        <span class="bento-value">Chat for Dates</span>
                    </div>
                </a>

                <!-- Email -->
                <div class="bento-card card-mail">
                    <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                        <div class="icon-box" style="margin-bottom:0;"><i class="fi fi-rr-envelope"></i></div>
                        <button class="bento-copy-btn bento-copy-btn-light" data-copy="info@evptradecentre.com" title="Copy email" aria-label="Copy email" type="button"><i class="fi fi-rr-copy"></i></button>
                    </div>
                    <div style="margin-top:10px;">
                        <span class="bento-label">RFP &amp; Enquiries</span>
                        <a href="mailto:info@evptradecentre.com" class="bento-value" style="font-size:12px; text-decoration:none; color:inherit; display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">info@evptradecentre.com</a>
                    </div>
                </div>

                <!-- Official Web & Portals (Wide) -->
                <div class="bento-card bento-wide card-social mobile-wide">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
                        <span class="bento-label" style="margin-bottom:0;">Official Web &amp; Portal</span>
                        <span style="font-size:11px; font-weight:600; color:#FFB703;">evptradecentre.com</span>
                    </div>
                    <div class="social-links-row">
                        <a href="https://www.evptradecentre.com" target="_blank" rel="noopener noreferrer" class="social-btn social-fb" aria-label="Official Website" style="background:#131330; color:#FFB703; border:1px solid #131330;">
                            <i class="fa-solid fa-globe" style="color:#FFB703;"></i>
                            <span style="color:#FFB703;">Website</span>
                        </a>
                        <a href="tel:+918525811111" class="social-btn social-yt" aria-label="Sales Phone" style="background:#F1F5F9; color:#131330; border:1px solid rgba(19, 19, 48, 0.08);">
                            <i class="fa-solid fa-phone" style="color:#131330;"></i>
                            <span style="color:#131330;">Call Sales</span>
                        </a>
                        <a href="mailto:info@evptradecentre.com" class="social-btn social-ig" aria-label="Email RFP" style="background:#F1F5F9; color:#131330; border:1px solid rgba(19, 19, 48, 0.08);">
                            <i class="fa-solid fa-envelope" style="color:#131330;"></i>
                            <span style="color:#131330;">Email RFP</span>
                        </a>
                    </div>
                </div>

                <!-- Address (Wide) -->
                <div class="bento-card bento-wide card-location mobile-wide">
                    <div class="card-location-details">
                        <div class="icon-box"><i class="fi fi-ss-marker" aria-hidden="true"></i></div>
                        <div class="card-location-text">
                            <span class="bento-label">Venue Location</span>
                            <span class="bento-value" style="font-size:12.5px; line-height:1.4;">EVP Trade and Convention Centre, Chennai – Bengaluru Highway, Chembarambakkam, Poonamallee, Chennai – 600123</span>
                        </div>
                    </div>
                    <button class="bento-copy-btn bento-copy-btn-light" data-copy="EVP Trade and Convention Centre, Chennai – Bengaluru Highway, Chembarambakkam, Poonamallee, Chennai – 600123" title="Copy address" aria-label="Copy address" type="button"><i class="fi fi-rr-copy" aria-hidden="true"></i></button>
                </div>
            </div>

            <!-- Copy Toast Notification -->
            <div class="bento-toast" id="bento-toast"><i class="fi fi-rr-check-circle" style="color:#25D366;"></i> Copied to clipboard!</div>
        </div>
    `;

    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.contact-close');

    function openContact() { overlay.classList.add('active'); }
    function closeContact() {
        overlay.classList.remove('active');
        document.dispatchEvent(new CustomEvent('menuItemDeactivate', { detail: { id: 'menu-contact' } }));
    }

    closeBtn.addEventListener('click', closeContact);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeContact();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeContact();
        }
    });

    window.openContactModal = openContact;
    window.closeContactModal = closeContact;

    document.addEventListener('menuItemClick', (e) => {
        if (e.detail && (e.detail.id === 'menu-contact' || e.detail.id === 'dock-tab-social')) {
            openContact();
        }
    });

    // ─── Clipboard Copy Handling ─────────────────────────────────
    overlay.querySelectorAll('[data-copy]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const text = btn.getAttribute('data-copy');
            if (!text) return;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(showToast).catch(() => fallbackCopy(text));
            } else {
                fallbackCopy(text);
            }
        });
    });

    let toastTimer = null;
    function showToast() {
        const toast = overlay.querySelector('#bento-toast');
        if (!toast) return;
        toast.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast();
        } catch (err) {
            console.error('[Copy] Failed:', err);
        }
        document.body.removeChild(textarea);
    }
})();
