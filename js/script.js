const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("#year");

// ── System theme sync ────────────────────────────────────────

const root = document.documentElement;
const mq = window.matchMedia("(prefers-color-scheme: dark)");
const applySystemTheme = () => {
  root.dataset.theme = mq.matches ? "dark" : "light";
};
mq.addEventListener("change", applySystemTheme);

// ── Mobile menu ──────────────────────────────────────────────

function closeMenu() {
  if (!siteNav || !menuToggle) return;
  siteNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", !!isOpen);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && siteNav?.classList.contains("is-open")) {
    closeMenu();
    menuToggle?.focus();
  }
});

document.addEventListener("click", (e) => {
  if (
    siteNav?.classList.contains("is-open") &&
    !siteNav.contains(e.target) &&
    !menuToggle?.contains(e.target)
  ) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 800 && siteNav?.classList.contains("is-open")) {
    closeMenu();
  }
});

// ── Footer year ──────────────────────────────────────────────

if (year) year.textContent = new Date().getFullYear();

// ── Final layout refinements ─────────────────────────────────
// Keeps the existing multilingual/static architecture intact while
// correcting the visual hierarchy introduced by the previous redesign.

document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.querySelector(".hero h1");
  if (heroTitle) {
    const replacement = document.createElement("h2");
    [...heroTitle.attributes].forEach((attribute) => {
      replacement.setAttribute(attribute.name, attribute.value);
    });
    replacement.innerHTML = heroTitle.innerHTML;
    heroTitle.replaceWith(replacement);
  }

  // The About section now uses a sticky TOC + content grid layout.
  // Smooth-scroll and active-link highlighting are handled below.

  const refinementStyles = document.createElement("style");
  refinementStyles.textContent = `
    .hero-grid {
      align-items: center;
    }

    .hero-copy {
      min-width: 0;
    }

    .hero h2 {
      max-width: 760px;
      margin: 1.1rem 0 1.4rem;
      font-size: clamp(2.25rem, 5.2vw, 4.8rem);
      line-height: 1.03;
      letter-spacing: -0.055em;
      font-weight: 760;
    }

    .hero-card {
      align-self: center;
      justify-self: end;
      width: min(100%, 310px);
      display: grid;
      justify-items: start;
    }

    .profile-photo {
      width: 176px;
      height: 176px;
      margin-inline: auto;
      margin-bottom: 22px;
      object-fit: cover;
    }

    @media (max-width: 820px) {
      .hero h2 {
        font-size: clamp(2.5rem, 12vw, 4.8rem);
      }

      .hero-card {
        justify-self: start;
        width: min(100%, 520px);
      }
    }

    @media (max-width: 540px) {
      .hero h2 {
        font-size: clamp(2.5rem, 13vw, 4rem);
      }

      .profile-photo {
        width: 160px;
        height: 160px;
      }
    }
  `;
  document.head.appendChild(refinementStyles);

  const tocLinks = document.querySelectorAll(".about-toc a");
  const tocSections = Array.from(tocLinks).map((link) =>
    document.querySelector(link.getAttribute("href"))
  );

  function updateActiveToc() {
    if (tocSections.length === 0) return;
    let index = tocSections.length - 1;
    const scrollY = window.scrollY;
    const offset = 200;
    for (let i = 0; i < tocSections.length; i++) {
      const rect = tocSections[i].getBoundingClientRect();
      if (rect.top < offset) index = i;
    }
    tocLinks.forEach((link, i) => {
      link.classList.toggle("active", i === index);
    });
  }

  let tocTick = false;
  window.addEventListener("scroll", () => {
    if (!tocTick) {
      tocTick = true;
      requestAnimationFrame(() => {
        updateActiveToc();
        tocTick = false;
      });
    }
  });
  updateActiveToc();

  tocLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
});
