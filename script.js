/* =========================================================
   Portfolio scripts - Mohammed Sameer H
   Vanilla JavaScript only.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTop = document.getElementById("back-to-top");

  /* ---------- 1. Mobile hamburger menu ---------- */
  function setMenu(open) {
    navMenu.classList.toggle("open", open);
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  }

  navToggle.addEventListener("click", () => {
    setMenu(!navMenu.classList.contains("open"));
  });

  // Close the menu when a link is clicked
  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  // Close with the Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- 2. Smooth scrolling ---------- */
  // CSS already sets scroll-behavior: smooth; this keeps the URL hash tidy and works as a fallback.
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- 3. Active nav link while scrolling ---------- */
  const sections = document.querySelectorAll("main section[id]");

  function updateActiveLink() {
    const offset = window.scrollY + header.offsetHeight + 120;
    let currentId = sections[0].id;
    sections.forEach((section) => {
      if (offset >= section.offsetTop) currentId = section.id;
    });
    // At the very bottom of the page, highlight the last section
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      currentId = sections[sections.length - 1].id;
    }
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });
  }

  /* ---------- Header style + back-to-top (7) ---------- */
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 20);
    backToTop.classList.toggle("show", window.scrollY > 500);
    updateActiveLink();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateActiveLink);
  onScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 4. Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el, i) => {
      // Small stagger for siblings inside grids
      el.style.transitionDelay = (i % 4) * 0.08 + "s";
      observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- 8. Current year in footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Profile photo fallback ---------- */
  // If profile.jpg is missing, hide the broken image and show the placeholder initials.
  const profileImg = document.getElementById("profile-img");
  const photoFrame = document.getElementById("photo-frame");
  function showPlaceholder() { photoFrame.classList.add("no-photo"); }
  profileImg.addEventListener("error", showPlaceholder);
  if (profileImg.complete && profileImg.naturalWidth === 0) showPlaceholder();

  // Same fallback for the small photo in the top-left logo
  const logoImg = document.getElementById("logo-img");
  const logoMark = document.getElementById("logo-mark");
  function showLogoInitials() { logoMark.classList.add("no-photo"); }
  logoImg.addEventListener("error", showLogoInitials);
  if (logoImg.complete && logoImg.naturalWidth === 0) showLogoInitials();

  /* ---------- 9. Subtle typing animation for the tagline ---------- */
  const typingEl = document.getElementById("typing-text");
  const fullText = "Electronics & Technology Enthusiast";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typingEl && !reduceMotion) {
    typingEl.textContent = "";
    let i = 0;
    const typeNext = () => {
      typingEl.textContent = fullText.slice(0, ++i);
      if (i < fullText.length) setTimeout(typeNext, 55);
    };
    setTimeout(typeNext, 500);
  }

  /* ---------- 6. Contact form validation (demo only, no backend) ---------- */
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");

  function setError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + "-error");
    errorEl.textContent = message;
    input.closest(".form-group").classList.toggle("invalid", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  // Look fields up by ID (form.name would return the form's own name attribute)
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  function validateName() {
    const v = nameInput.value.trim();
    return setError("name", v.length < 2 ? "Please enter your name (at least 2 characters)." : "");
  }
  function validateEmail() {
    const v = emailInput.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    return setError("email", ok ? "" : "Please enter a valid email address.");
  }
  function validateMessage() {
    const v = messageInput.value.trim();
    return setError("message", v.length < 10 ? "Please write a message (at least 10 characters)." : "");
  }

  nameInput.addEventListener("blur", validateName);
  emailInput.addEventListener("blur", validateEmail);
  messageInput.addEventListener("blur", validateMessage);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    statusEl.style.color = "";

    // Run every validator (don't stop at the first failure)
    const results = [validateName(), validateEmail(), validateMessage()];
    if (results.every(Boolean)) {
      // No backend: nothing is actually sent.
      statusEl.textContent = "Thanks! This form is currently a demo. Please contact me directly through email.";
      form.reset();
    } else {
      statusEl.style.color = "var(--danger)";
      statusEl.textContent = "Please fix the highlighted fields and try again.";
    }
  });
});
