/* ============================================================
   Tidewave UI — Shared page behaviour
   Zero dependencies. Everything degrades gracefully without JS.
   ============================================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "tidewave-theme";

  function preferredTheme() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.dispatchEvent(new CustomEvent("tw:themechange", { detail: { theme: theme } }));
  }

  function toggleTheme() {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
  }

  // Apply before paint to avoid a flash of the wrong theme.
  applyTheme(preferredTheme());

  document.addEventListener("DOMContentLoaded", function () {

    /* Toast */
    var toastHost = document.createElement("div");
    toastHost.style.cssText =
      "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);" +
      "z-index:200;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none";
    document.body.appendChild(toastHost);

    window.twToast = function (message) {
      var el = document.createElement("div");
      el.textContent = message;
      el.style.cssText =
        "padding:10px 16px;border-radius:10px;font-size:13px;font-weight:560;" +
        "background:#101828;color:#fff;box-shadow:0 12px 32px -8px rgba(16,24,40,.4);" +
        "opacity:0;transform:translateY(8px);transition:all .22s cubic-bezier(.22,1,.36,1)";
      toastHost.appendChild(el);
      requestAnimationFrame(function () {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
      setTimeout(function () {
        el.style.opacity = "0";
        el.style.transform = "translateY(8px)";
        setTimeout(function () { el.remove(); }, 260);
      }, 2200);
    };

    /* Theme toggles */
    document.querySelectorAll("[data-tw-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", toggleTheme);
    });

    /* Modals */
    document.querySelectorAll("[data-tw-modal-open]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var target = document.getElementById(trigger.dataset.twModalOpen);
        if (target) openModal(target);
      });
    });

    document.querySelectorAll(".tw-modal").forEach(function (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal(modal);
        if (e.target.closest("[data-tw-modal-close]")) closeModal(modal);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      document.querySelectorAll(".tw-modal.is-open").forEach(closeModal);
    });

    function openModal(modal) {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var focusable = modal.querySelector("button, [href], input, select, textarea");
      if (focusable) focusable.focus();
    }

    function closeModal(modal) {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    /* Tabs */
    document.querySelectorAll("[data-tw-tabs]").forEach(function (group) {
      var tabs = group.querySelectorAll("[data-tw-tab]");
      var panels = group.querySelectorAll("[data-tw-panel]");
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          tabs.forEach(function (t) {
            t.setAttribute("aria-selected", t === tab ? "true" : "false");
          });
          panels.forEach(function (p) {
            p.hidden = p.dataset.twPanel !== tab.dataset.twTab;
          });
        });
      });
    });

    /* Chip toggles */
    document.querySelectorAll(".tw-chip[role='button']").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var on = chip.getAttribute("aria-pressed") === "true";
        chip.setAttribute("aria-pressed", on ? "false" : "true");
      });
    });

    /* Copy buttons */
    document.querySelectorAll("[data-tw-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.dataset.twCopy;
        if (!text) return;
        navigator.clipboard.writeText(text).then(
          function () { window.twToast("Copied to clipboard"); },
          function () { window.twToast("Copy failed"); }
        );
      });
    });

    /* Docs scrollspy */
    var sideLinks = document.querySelectorAll(".tw-docs__side a[href^='#']");
    if (sideLinks.length) {
      var sections = [];
      sideLinks.forEach(function (link) {
        var el = document.querySelector(link.getAttribute("href"));
        if (el) sections.push({ el: el, link: link });
      });

      var spy = function () {
        var best = null;
        sections.forEach(function (s) {
          if (s.el.getBoundingClientRect().top <= 140) best = s;
        });
        sideLinks.forEach(function (l) { l.classList.remove("is-active"); });
        if (best) best.link.classList.add("is-active");
      };

      window.addEventListener("scroll", spy, { passive: true });
      spy();
    }

    /* Reveal on scroll */
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("tw-reveal");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      document.querySelectorAll("[data-tw-reveal]").forEach(function (el) { io.observe(el); });
    }

    /* Progress bars */
    document.querySelectorAll(".tw-progress__bar[data-value]").forEach(function (bar) {
      var value = Number(bar.dataset.value) || 0;
      bar.style.width = "0%";
      setTimeout(function () { bar.style.width = value + "%"; }, 120);
    });
  });
})();
