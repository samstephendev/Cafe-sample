/* ============================================================
   THE DAILY GRIND — script.js
   Handles: sticky nav, mobile menu, menu tabs, scroll-reveal,
   back-to-top, hero ken-burns, contact & newsletter forms.
============================================================ */

'use strict';

/* --------------------------------------------------------
   UTILITY — run after DOM is ready
-------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initMobileNav();
  initMenuTabs();
  initScrollReveal();
  initBackToTop();
  initHeroKenBurns();
  initContactForm();
  initNewsletterForm();
  initFooterYear();
});

/* --------------------------------------------------------
   1. STICKY NAV — adds .scrolled class after 60px scroll
-------------------------------------------------------- */
function initStickyNav() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const THRESHOLD = 60;

  const update = () => {
    if (window.scrollY > THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Throttle scroll handler with requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  update(); // run once on load
}

/* --------------------------------------------------------
   2. MOBILE NAV — toggle open/close, close on link click
-------------------------------------------------------- */
function initMobileNav() {
  const toggle   = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggle || !navLinks) return;

  const open  = () => {
    navLinks.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  };

  const close = () => {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? close() : open();
  });

  // Close when any nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      close();
      toggle.focus();
    }
  });

  // Close when clicking outside the nav on mobile
  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      close();
    }
  });
}

/* --------------------------------------------------------
   3. MENU TABS — switch between Coffee, Food, Pastries
-------------------------------------------------------- */
function initMenuTabs() {
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tab states
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update panel visibility
      panels.forEach(panel => {
        panel.classList.remove('active');
      });

      const targetPanel = document.getElementById(`tab-${target}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        // Re-trigger reveal animation for newly shown cards
        targetPanel.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('visible');
          // Slight timeout so the browser registers the removal
          setTimeout(() => el.classList.add('visible'), 30);
        });
      }
    });

    // Keyboard support: arrow keys to move between tabs
    tab.addEventListener('keydown', (e) => {
      const tabList  = [...tabs];
      const idx      = tabList.indexOf(tab);
      let   next     = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        next = (idx + 1) % tabList.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        next = (idx - 1 + tabList.length) % tabList.length;
      } else if (e.key === 'Home') {
        next = 0;
      } else if (e.key === 'End') {
        next = tabList.length - 1;
      }

      if (next >= 0) {
        e.preventDefault();
        tabList[next].focus();
        tabList[next].click();
      }
    });
  });
}

/* --------------------------------------------------------
   4. SCROLL REVEAL — fade-in elements as they enter viewport
-------------------------------------------------------- */
function initScrollReveal() {
  // Add .reveal class to elements we want to animate in
  const selectors = [
    '.about-image-wrap',
    '.about-text',
    '.menu-card',
    '.gallery-item',
    '.testimonial-card',
    '.info-block',
    '.location-map',
    '.contact-form',
    '.contact-aside',
    '.section-label',
    '.section-title',
    '.section-subtitle',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger children within the same parent grid/flex container
      const stagger = Math.min(i % 4, 3);
      if (stagger > 0) el.classList.add(`reveal-delay-${stagger}`);
    });
  });

  // Use IntersectionObserver if available, else fall back to showing all
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once only
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* --------------------------------------------------------
   5. BACK TO TOP — show button after scrolling 400px
-------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const SHOW_AFTER = 400;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > SHOW_AFTER) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------
   6. HERO KEN-BURNS — trigger subtle zoom-in animation
      once the hero image has loaded
-------------------------------------------------------- */
function initHeroKenBurns() {
  const hero = document.querySelector('.hero');
  const img  = hero ? hero.querySelector('.hero-bg-img') : null;
  if (!hero || !img) return;

  const activate = () => hero.classList.add('loaded');

  if (img.complete) {
    activate();
  } else {
    img.addEventListener('load', activate);
    // Fallback if image never fires load (e.g. placeholder service quirks)
    setTimeout(activate, 2000);
  }
}

/* --------------------------------------------------------
   7. CONTACT FORM — basic validation & success message
-------------------------------------------------------- */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple required-field validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#c0392b';
        field.addEventListener('input', () => {
          field.style.borderColor = '';
        }, { once: true });
      }
    });

    if (!valid) {
      success.style.color = '#c0392b';
      success.textContent = 'Please fill in all required fields.';
      return;
    }

    // Simulate send (demo site — no real backend)
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      success.style.color = '#4a7c59';
      success.textContent = '✓ Message sent! We\'ll be in touch soon.';

      // Clear success message after 6 seconds
      setTimeout(() => { success.textContent = ''; }, 6000);
    }, 1000);
  });
}

/* --------------------------------------------------------
   8. NEWSLETTER FORM — success feedback
-------------------------------------------------------- */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const input = form.querySelector('input[type="email"]');
    const btn   = form.querySelector('button');

    if (!input || !input.value.trim()) {
      input.style.borderColor = '#c0392b';
      input.addEventListener('input', () => {
        input.style.borderColor = '';
      }, { once: true });
      return;
    }

    const originalText = btn.textContent;
    btn.textContent    = '✓ Subscribed!';
    btn.disabled       = true;
    input.value        = '';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled    = false;
    }, 4000);
  });
}

/* --------------------------------------------------------
   9. FOOTER YEAR — keep copyright current automatically
-------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------
   10. SMOOTH SCROLL POLYFILL — for browsers that don't
       support scroll-behavior: smooth natively (rare now,
       but good practice for older Safari on iOS)
-------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return; // skip placeholder links

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Update URL hash without jumping
    history.pushState(null, '', targetId);
  });
});
