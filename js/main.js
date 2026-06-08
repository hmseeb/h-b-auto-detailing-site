/* ============================================================
   H&B Auto Detailing – Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── Year in footer ─────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Sticky header on scroll ─────────────────────────────── */
  const header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateBackToTop();
    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ── Mobile nav toggle ───────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  nav.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ── Active nav link based on scroll position ────────────── */
  const sections = document.querySelectorAll('main section[id]');
  function updateActiveNav() {
    let current = '';
    sections.forEach(function (sec) {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  /* ── Back to top ─────────────────────────────────────────── */
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Contact form validation & submission ────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    const nameInput    = form.querySelector('#name');
    const emailInput   = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const submitBtn    = form.querySelector('#submitBtn');
    const formSuccess  = form.querySelector('#formSuccess');

    function showError(input, errorId, msg) {
      const err = document.getElementById(errorId);
      input.classList.add('error');
      err.textContent = msg;
      err.classList.add('visible');
    }

    function clearError(input, errorId) {
      const err = document.getElementById(errorId);
      input.classList.remove('error');
      err.textContent = '';
      err.classList.remove('visible');
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Live validation
    nameInput.addEventListener('blur', function () {
      if (!this.value.trim()) showError(this, 'nameError', 'Please enter your name.');
      else clearError(this, 'nameError');
    });
    emailInput.addEventListener('blur', function () {
      if (!this.value.trim()) showError(this, 'emailError', 'Please enter your email address.');
      else if (!validateEmail(this.value.trim())) showError(this, 'emailError', 'Please enter a valid email address.');
      else clearError(this, 'emailError');
    });
    messageInput.addEventListener('blur', function () {
      if (!this.value.trim()) showError(this, 'messageError', 'Please enter a message.');
      else clearError(this, 'messageError');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      // Name
      if (!nameInput.value.trim()) {
        showError(nameInput, 'nameError', 'Please enter your name.');
        valid = false;
      } else {
        clearError(nameInput, 'nameError');
      }

      // Email
      if (!emailInput.value.trim()) {
        showError(emailInput, 'emailError', 'Please enter your email address.');
        valid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'emailError', 'Please enter a valid email address.');
        valid = false;
      } else {
        clearError(emailInput, 'emailError');
      }

      // Message
      if (!messageInput.value.trim()) {
        showError(messageInput, 'messageError', 'Please enter a message.');
        valid = false;
      } else {
        clearError(messageInput, 'messageError');
      }

      if (!valid) return;

      // Simulate form submission
      const btnText    = submitBtn.querySelector('.btn__text');
      const btnSpinner = submitBtn.querySelector('.btn__spinner');

      submitBtn.disabled = true;
      btnText.hidden = true;
      btnSpinner.hidden = false;

      setTimeout(function () {
        submitBtn.disabled = false;
        btnText.hidden = false;
        btnSpinner.hidden = true;
        form.reset();
        formSuccess.hidden = false;
        formSuccess.removeAttribute('hidden');
        setTimeout(function () {
          formSuccess.hidden = true;
        }, 6000);
      }, 1500);
    });
  }

  /* ── Intersection Observer for fade-in animations ────────── */
  const fadeEls = document.querySelectorAll(
    '.service-card, .why-card, .gallery__item, .testimonial-card, .contact__info-item'
  );

  if ('IntersectionObserver' in window) {
    fadeEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4 * 0.1) + 's';
      observer.observe(el);
    });
  }

  /* ── Smooth scroll for all anchor links ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
