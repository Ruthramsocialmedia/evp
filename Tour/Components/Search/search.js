(async function () {

  const style = document.createElement("style");
  style.textContent = `
    /* ═══════════════════════════════════════════
       SEARCH COMPONENT — Command Palette
       Project Link Launcher (opens in new tab)
       ═══════════════════════════════════════════ */

    #search-backdrop {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: transparent;
        z-index: 100065;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
    }
    #search-backdrop.show {
        opacity: 1;
    }

    /* ── Command Palette Shell ── */
    .pcis-search-popover {
        position: absolute;
        bottom: calc(100% + 14px);
        left: 50%;
        transform: translateX(-50%) translateY(10px) scale(0.95);
        transform-origin: bottom center;
        width: 480px;
        max-width: calc(100vw - 32px);
        background: rgba(255, 255, 255, 0.93);
        -webkit-backdrop-filter: blur(28px) saturate(200%);
        backdrop-filter: blur(28px) saturate(200%);
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 22px;
        box-shadow:
            0 4px 12px rgba(19, 19, 48, 0.04),
            0 24px 60px rgba(19, 19, 48, 0.22),
            inset 0 1px 1px rgba(255, 255, 255, 0.95);
        padding: 0;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        visibility: hidden;
        transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
                    transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
                    visibility 220ms ease;
        z-index: 100070;
        display: flex;
        flex-direction: column;
        gap: 0;
        box-sizing: border-box;
        font-family: 'Satoshi', sans-serif !important;
    }

    /* ── Header — Frosted White Glassmorphism ── */
    .pcis-search-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 13px 18px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%);
        border-bottom: 1px solid rgba(19, 19, 48, 0.08);
        position: relative;
        flex-shrink: 0;
        box-sizing: border-box;
        user-select: none;
    }

    .pcis-search-header-titles {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
    }

    .pcis-search-header-icon-box {
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

    .pcis-search-header-heading {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    .pcis-search-header-heading h2 {
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 16px;
        font-weight: 800;
        color: #131330;
        margin: 0;
        line-height: 1.2;
        letter-spacing: -0.01em;
        white-space: nowrap;
    }

    .pcis-search-header-heading p {
        font-family: 'Satoshi', sans-serif !important;
        font-size: 11px;
        color: #64748B;
        margin: 0;
        line-height: 1.2;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .pcis-search-body {
        padding: 10px 12px 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        box-sizing: border-box;
    }

    body > .pcis-search-popover {
        position: fixed;
        bottom: 84px;
        left: 50%;
        transform: translateX(-50%) translateY(10px) scale(0.95);
    }

    .pcis-search-popover.show {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translateX(-50%) translateY(0) scale(1);
    }
    body > .pcis-search-popover.show {
        transform: translateX(-50%) translateY(0) scale(1);
    }

    /* ── Search Input ── */
    .pcis-search-input-box {
        position: relative;
        display: flex;
        align-items: center;
        background: #FFFFFF;
        border: none;
        border-radius: 14px;
        padding: 0 12px;
        height: 46px;
        box-shadow: 0 2px 8px rgba(19, 19, 48, 0.04);
        transition: box-shadow 180ms ease;
        box-sizing: border-box;
        flex-shrink: 0;
    }

    .pcis-search-input-box:focus-within {
        box-shadow: 0 2px 12px rgba(19, 19, 48, 0.08);
    }

    .pcis-search-icon {
        font-size: 15px;
        color: #94A3B8;
        margin-right: 10px;
        flex-shrink: 0;
        display: grid;
        place-items: center;
        transition: color 180ms ease;
    }

    .pcis-search-input-box:focus-within .pcis-search-icon {
        color: #FFB703;
    }

    .pcis-search-input {
        width: 100%;
        border: none;
        outline: none;
        background: transparent;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        color: #131330;
        padding: 0;
        margin: 0;
    }

    .pcis-search-input::placeholder {
        color: #94A3B8;
        font-family: 'Satoshi', sans-serif !important;
        font-weight: 500;
        font-size: 13px;
    }

    .pcis-search-clear {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #E2E8F0;
        border: none;
        color: #64748B;
        cursor: pointer;
        display: grid;
        place-items: center;
        font-size: 11px;
        padding: 0;
        margin-left: 8px;
        flex-shrink: 0;
        transition: all 160ms ease;
        outline: none;
    }

    .pcis-search-clear:hover {
        background: #CBD5E1;
        color: #131330;
    }

    /* ── Section Label ── */
    .pcis-search-section-label {
        font-family: 'Satoshi', sans-serif !important;
        font-size: 10px;
        font-weight: 700;
        color: #94A3B8;
        text-transform: uppercase;
        letter-spacing: 0.09em;
        padding: 6px 12px 2px;
    }

    /* ── Scrollable Results ── */
    .pcis-search-scroll {
        max-height: 340px;
        overflow-y: auto;
        overscroll-behavior: contain;
        display: flex;
        flex-direction: column;
        gap: 2px;
        scrollbar-width: none;
        -ms-overflow-style: none;
        padding: 2px 0;
    }

    .pcis-search-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }

    /* ── Project Row ── */
    .pcis-proj-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 14px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
        transition: background 180ms ease, transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
        width: 100%;
        font-family: inherit;
        box-sizing: border-box;
    }

    .pcis-proj-item:hover,
    .pcis-proj-item.is-selected {
        background: rgba(255, 183, 3, 0.12);
        transform: translateX(2px);
    }

    .pcis-proj-item:active {
        transform: scale(0.99);
        background: rgba(255, 183, 3, 0.18);
    }

    /* Colored initial badge */
    .pcis-proj-icon {
        width: 42px;
        height: 42px;
        border-radius: 13px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 800;
        color: #FFFFFF;
        letter-spacing: -0.02em;
    }

    .pcis-proj-text {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }

    .pcis-proj-name {
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 13.5px;
        font-weight: 700;
        color: #131330;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
        letter-spacing: -0.01em;
        transition: color 140ms ease;
    }

    .pcis-proj-item:hover .pcis-proj-name,
    .pcis-proj-item.is-selected .pcis-proj-name {
        color: #131330;
    }

    .pcis-proj-url {
        font-family: 'Satoshi', sans-serif !important;
        font-size: 11px;
        font-weight: 500;
        color: #94A3B8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
    }

    .pcis-proj-arrow {
        font-size: 13px;
        color: #CBD5E1;
        flex-shrink: 0;
        display: grid;
        place-items: center;
        transition: color 180ms ease, transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .pcis-proj-item:hover .pcis-proj-arrow,
    .pcis-proj-item.is-selected .pcis-proj-arrow {
        color: #B45309;
        transform: translate(2px, -2px);
    }

    .pcis-search-highlight {
        color: #131330;
        background: rgba(255, 183, 3, 0.35);
        padding: 0 3px;
        border-radius: 4px;
        font-weight: 800;
    }

    /* ── Empty State ── */
    .pcis-search-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 28px 12px;
        gap: 8px;
        text-align: center;
    }
    .pcis-search-empty i { font-size: 22px; opacity: 0.45; color: #94A3B8; }
    .pcis-search-empty span { font-size: 12px; font-weight: 600; color: #94A3B8; }

    /* ── Footer ── */
    .pcis-search-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 8px 2px;
        border-top: 1px solid rgba(19, 19, 48, 0.06);
        margin-top: 2px;
    }

    .pcis-search-footer-status {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .pcis-search-pulse-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #10B981;
        box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
        animation: pcisSearchDotPulse 2s infinite ease-in-out;
    }

    @keyframes pcisSearchDotPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.15); }
    }

    .pcis-search-count-text {
        font-family: 'Satoshi', sans-serif !important;
        font-size: 11px;
        font-weight: 600;
        color: #64748B;
    }

    /* ── Red Close Button (matches all other modals) ── */
    .pcis-search-close-btn {
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

    .pcis-search-close-btn:hover {
        background: #DC2626;
        color: #FFFFFF;
        transform: rotate(360deg);
    }

    .pcis-search-close-btn:active {
        transform: rotate(360deg) scale(0.94);
    }

    .pcis-search-close-btn i {
        font-size: 18px;
        line-height: 1;
        display: inline-flex;
        margin: 0;
        padding: 0;
        pointer-events: none;
        color: #FFFFFF;
    }

    /* ── Mobile & Landscape Responsiveness ── */
    @media (max-width: 600px) {
        .pcis-search-popover,
        body > .pcis-search-popover {
            width: calc(100vw - 20px);
            max-width: calc(100vw - 20px);
            max-height: calc(100dvh - 90px);
            bottom: max(10px, env(safe-area-inset-bottom));
            border-radius: 18px;
        }
        .pcis-search-scroll {
            max-height: calc(100dvh - 200px);
            -webkit-overflow-scrolling: touch;
        }
        .pcis-search-header {
            padding: 10px 14px;
        }
        .pcis-search-header-heading h2 {
            font-size: 15px;
        }
        .pcis-search-input-box {
            height: 42px;
        }
        .pcis-proj-item {
            padding: 8px 10px;
        }
    }

    @media (max-height: 500px) {
        .pcis-search-popover,
        body > .pcis-search-popover {
            max-height: calc(100dvh - 24px);
            bottom: 8px;
        }
        .pcis-search-scroll {
            max-height: calc(100dvh - 140px);
        }
    }
  `;
  document.head.appendChild(style);

  // ─── DOM ───
  const backdrop = document.createElement("div");
  backdrop.id = "search-backdrop";
  document.body.appendChild(backdrop);

  const container = document.createElement("div");
  container.id = "container_search";
  container.className = "pcis-search-popover";
  container.setAttribute("role", "dialog");
  container.setAttribute("aria-label", "Search Portals & Specifications");

  container.innerHTML = `
    <!-- Header (matching GSV & Panolist) -->
    <div class="pcis-search-header">
        <div class="pcis-search-header-titles">
            <div class="pcis-search-header-icon-box"><i class="fi fi-rr-apps" aria-hidden="true"></i></div>
            <div class="pcis-search-header-heading">
                <h2>Venue Directories & Links</h2>
                <p>EVP Trade & Convention Centre</p>
            </div>
        </div>
        <button class="pcis-search-close-btn" id="searchCloseBtn" type="button" aria-label="Close search">
            <i class="fi fi-rr-cross-small" aria-hidden="true"></i>
        </button>
    </div>

    <!-- Body Area -->
    <div class="pcis-search-body">
        <div class="pcis-search-input-box">
            <i class="fi fi-rr-search pcis-search-icon" aria-hidden="true"></i>
            <input type="text" class="pcis-search-input" id="searchInput" placeholder="Search halls, facilities & portals..." autocomplete="off" spellcheck="false" />
            <button class="pcis-search-clear" id="searchClear" type="button" aria-label="Clear search" style="display:none;">
                <i class="fi fi-rr-cross-small"></i>
            </button>
        </div>

        <div class="pcis-search-section-label" id="searchSectionLabel">Venue Portals</div>

        <div class="pcis-search-scroll" id="itemList" role="listbox"></div>

        <div class="pcis-search-empty" id="noResults" style="display:none;">
            <i class="fi fi-rr-search"></i>
            <span>No matching venue portals found</span>
        </div>

        <div class="pcis-search-footer">
            <div class="pcis-search-footer-status">
                <div class="pcis-search-pulse-dot"></div>
                <span class="pcis-search-count-text" id="searchCountText">Loading...</span>
            </div>
        </div>
    </div>
  `;

  function mountSearchContainer() {
    const dockWrap = document.querySelector(".pcis-dock-wrap");
    if (dockWrap) {
      if (container.parentElement !== dockWrap) dockWrap.appendChild(container);
    } else if (!container.parentElement) {
      document.body.appendChild(container);
    }
  }

  mountSearchContainer();
  setTimeout(mountSearchContainer, 500);
  setTimeout(mountSearchContainer, 1500);
  window.SearchBox = container;

  // ─── Refs ───
  const input       = document.getElementById("searchInput");
  const ul          = document.getElementById("itemList");
  const clearBtn    = document.getElementById("searchClear");
  const noResultsEl = document.getElementById("noResults");
  const footerText  = document.getElementById("searchCountText");
  const sectionLbl  = document.getElementById("searchSectionLabel");

  let projectLinks   = [];
  let currentResults = [];
  let selectedIndex  = -1;

  // ─── Color palette ───
  const PALETTE = [
    { bg: "#131330", shadow: "rgba(19,19,48,0.30)"    },
    { bg: "#FFB703", shadow: "rgba(255,183,3,0.35)"   },
    { bg: "#0284C7", shadow: "rgba(2,132,199,0.30)"   },
    { bg: "#059669", shadow: "rgba(5,150,105,0.30)"   },
    { bg: "#D97706", shadow: "rgba(217,119,6,0.30)"   },
    { bg: "#7C3AED", shadow: "rgba(124,58,237,0.30)"  },
    { bg: "#BE185D", shadow: "rgba(190,24,93,0.30)"   },
    { bg: "#475569", shadow: "rgba(71,85,105,0.30)"   },
  ];

  function getInitials(title) {
    const words = title.trim().split(/\s+/);
    return words.length >= 2
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : title.substring(0, 2).toUpperCase();
  }

  function getHostname(url) {
    try {
      const u = new URL(url);
      return u.hostname + (u.port ? ":" + u.port : "");
    } catch (e) {
      return url;
    }
  }

  // ─── Load Links.txt ───
  async function loadLinks() {
    try {
      const text = await fetch("Components/Search/Links.txt?v=" + Date.now()).then(r => r.text()).catch(() => "");
      let colorIdx = 0;
      projectLinks = text.split("\n").map(function(line) {
        line = line.trim();
        if (!line || line.startsWith("#")) return null;
        var firstEq = line.indexOf("=");
        if (firstEq === -1) return null;
        var title = line.substring(0, firstEq).trim();
        var url   = line.substring(firstEq + 1).trim();
        if (!title || !url) return null;
        return { title: title, url: url, colorIndex: colorIdx++ };
      }).filter(Boolean);
    } catch (e) {}
  }

  loadLinks();

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    var regex = new RegExp("(" + escapeRegex(query) + ")", "gi");
    return text.replace(regex, '<mark class="pcis-search-highlight">$1</mark>');
  }

  // ─── Render ───
  function renderList(items, query) {
    ul.innerHTML = "";
    currentResults = items;
    selectedIndex  = -1;

    if (items.length === 0 && input.value.trim() !== "") {
      ul.style.display          = "none";
      noResultsEl.style.display  = "flex";
      sectionLbl.style.display   = "none";
      footerText.textContent     = "No matching projects";
      return;
    }

    ul.style.display          = "flex";
    noResultsEl.style.display  = "none";
    sectionLbl.style.display   = "block";
    sectionLbl.textContent     = query
      ? (items.length + " result" + (items.length !== 1 ? "s" : ""))
      : "Projects";
    footerText.textContent     = query
      ? (items.length + " match" + (items.length !== 1 ? "es" : "") + " found")
      : (items.length + " project" + (items.length !== 1 ? "s" : "") + " available");

    items.forEach(function(item, index) {
      var color    = PALETTE[item.colorIndex % PALETTE.length];
      var initials = getInitials(item.title);
      var hostname = getHostname(item.url);
      var highlighted = highlightMatch(item.title, query);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pcis-proj-item";
      btn.dataset.index = index;
      btn.setAttribute("role", "option");

      btn.innerHTML =
        '<div class="pcis-proj-icon" style="background:' + color.bg + ';box-shadow:0 4px 14px ' + color.shadow + ';">' + initials + '</div>' +
        '<div class="pcis-proj-text">' +
          '<span class="pcis-proj-name">' + highlighted + '</span>' +
          '<span class="pcis-proj-url">' + hostname + '</span>' +
        '</div>' +
        '<span class="pcis-proj-arrow"><i class="fi fi-rr-arrow-up-right-from-square"></i></span>';

      btn.addEventListener("click", function(e) {
        e.stopPropagation();
        selectItem(item);
      });

      ul.appendChild(btn);
    });
  }

  function selectItem(item) {
    window.closeSearchBox();
    window.open(item.url, "_blank");
  }

  function updateSelection() {
    ul.querySelectorAll(".pcis-proj-item").forEach(function(el) { el.classList.remove("is-selected"); });
    if (selectedIndex >= 0 && selectedIndex < currentResults.length) {
      var el = ul.querySelector('.pcis-proj-item[data-index="' + selectedIndex + '"]');
      if (el) { el.classList.add("is-selected"); el.scrollIntoView({ block: "nearest" }); }
    }
  }

  // ─── Input events ───
  var debounce = null;
  input.addEventListener("input", function() {
    if (clearBtn) clearBtn.style.display = input.value ? "grid" : "none";
    clearTimeout(debounce);
    debounce = setTimeout(function() {
      var q = input.value.toLowerCase().trim();
      if (!q) { renderList(projectLinks, ""); return; }
      renderList(projectLinks.filter(function(p) { return p.title.toLowerCase().includes(q); }), q);
    }, 100);
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", function() {
      input.value = "";
      clearBtn.style.display = "none";
      input.focus();
      renderList(projectLinks, "");
    });
  }

  var closeBtn = document.getElementById("searchCloseBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", function() {
      window.toggleSearchBox();
    });
  }

  input.addEventListener("keydown", function(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, currentResults.length - 1);
      updateSelection();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, -1);
      updateSelection();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && currentResults[selectedIndex]) selectItem(currentResults[selectedIndex]);
    } else if (e.key === "Escape") {
      if (container.classList.contains("show")) window.toggleSearchBox();
    }
  });

  // ─── Close handlers ───
  backdrop.addEventListener("click", function() { window.toggleSearchBox(); });

  document.addEventListener("click", function(e) {
    if (container.classList.contains("show")) {
      var dock = document.querySelector(".pcis-dock-wrap");
      if (!container.contains(e.target) && (!dock || !dock.contains(e.target))) {
        window.toggleSearchBox();
      }
    }
  });

  document.addEventListener("keydown", function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      window.toggleSearchBox();
    }
  });

  // ─── Public API ───
  window.toggleSearchBox = function() {
    if (!window.SearchBox) return;
    mountSearchContainer();
    var bd     = document.getElementById("search-backdrop");
    var isOpen = window.SearchBox.classList.contains("show");

    if (!isOpen) {
      window.SearchBox.classList.add("show");
      if (bd) bd.classList.add("show");
      loadLinks().then(function() {
        renderList(projectLinks, input.value.toLowerCase().trim());
      });
      renderList(projectLinks, "");
      setTimeout(function() { input.focus(); }, 70);
      if (typeof window.evpRetranslate === "function") {
        setTimeout(window.evpRetranslate, 60);
      }
      document.dispatchEvent(new CustomEvent("searchActive"));
    } else {
      window.SearchBox.classList.remove("show");
      if (bd) bd.classList.remove("show");
      document.dispatchEvent(new CustomEvent("searchDeactive"));
      document.dispatchEvent(new CustomEvent("menuItemDeactivate", { detail: { id: "menu-search" } }));
      input.value = "";
      if (clearBtn) clearBtn.style.display = "none";
      ul.innerHTML = "";
      if (noResultsEl) noResultsEl.style.display = "none";
    }
  };

  window.openSearchBox = function() {
    if (!window.SearchBox || !window.SearchBox.classList.contains("show")) window.toggleSearchBox();
  };

  window.closeSearchBox = function() {
    if (window.SearchBox && window.SearchBox.classList.contains("show")) window.toggleSearchBox();
  };

  // ─── Menu events ───
  document.addEventListener("menuItemClick", function(e) {
    if (e.detail && e.detail.id === "menu-search") {
      window.toggleSearchBox();
    } else if (window.SearchBox && window.SearchBox.classList.contains("show")) {
      window.closeSearchBox();
    }
  });

  document.addEventListener("menuItemActivate", function(e) {
    if (e.detail && e.detail.id !== "menu-search" && window.SearchBox && window.SearchBox.classList.contains("show")) {
      window.closeSearchBox();
    }
  });

})();