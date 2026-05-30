(function () {
  const THEME_KEY = "portfolio-theme";
  const root = document.documentElement;
  const nav = document.getElementById("nav");
  const navLinks = document.getElementById("navLinks");
  const navToggle = document.getElementById("navToggle");
  const themeToggle = document.getElementById("themeToggle");
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav__links a[data-section]");

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }

  function initTheme() {
    applyTheme(getPreferredTheme());
    themeToggle?.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  function initNavScroll() {
    window.addEventListener("scroll", () => {
      nav?.classList.toggle("scrolled", window.scrollY > 12);
    }, { passive: true });
  }

  function initMobileNav() {
    navToggle?.addEventListener("click", () => {
      const open = navLinks?.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navAnchors.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks?.classList.remove("open");
        navToggle?.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initScrollSpy() {
    if (!sections.length || !navAnchors.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navAnchors.forEach((a) => {
            a.classList.toggle("active", a.dataset.section === id);
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  function initReveal() {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  function initContactForm() {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
    if (!form || !status) return;

    const apiUrl = "https://tzf78jd52c.execute-api.us-east-1.amazonaws.com/submit";

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "Sending…";
      status.className = "form__status";

      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim(),
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          status.textContent = "Message sent successfully. Thank you!";
          status.classList.add("success");
          form.reset();
        } else {
          let msg = "Failed to send message.";
          try {
            const err = await response.json();
            if (err.message) msg = err.message;
          } catch (_) { /* ignore */ }
          status.textContent = "Error: " + msg;
          status.classList.add("error");
        }
      } catch (_) {
        status.textContent = "Network error: Could not send message.";
        status.classList.add("error");
      }
    });
  }

  function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const triggers = document.querySelectorAll("[data-lightbox-src]");
    if (!lightbox || !lightboxImg || !triggers.length) return;

    function openLightbox(src, alt, caption) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      if (lightboxCaption) lightboxCaption.textContent = caption || "";
      lightbox.classList.add("is-open");
      lightbox.removeAttribute("hidden");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      lightbox.querySelector(".lightbox__close")?.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("hidden", "");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      lightboxImg.removeAttribute("src");
      lightboxImg.alt = "";
    }

    triggers.forEach((btn) => {
      btn.addEventListener("click", () => {
        openLightbox(
          btn.dataset.lightboxSrc,
          btn.dataset.lightboxAlt,
          btn.dataset.lightboxCaption
        );
      });
    });

    lightbox.querySelectorAll("[data-lightbox-close]").forEach((el) => {
      el.addEventListener("click", closeLightbox);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  initTheme();
  initNavScroll();
  initMobileNav();
  initScrollSpy();
  initReveal();
  initContactForm();
  initLightbox();
})();
