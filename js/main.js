/* ===================================================================
   Holy Joe Coffee — Main JavaScript
   =================================================================== */

(function () {
  'use strict';

  /* --- Mobile Nav Toggle --- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  /* --- Active Page Detection --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  /* --- Scroll-Shrink Nav --- */
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  /* --- Scroll Reveal (IntersectionObserver) --- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* --- FormSubmit.co AJAX Submission --- */
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const statusEl = document.getElementById('form-status');
      const originalText = submitBtn.textContent;

      // Loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.classList.add('loading');
      if (statusEl) {
        statusEl.className = 'form-status';
        statusEl.style.display = 'none';
      }

      try {
        const formData = new FormData(bookingForm);
        const response = await fetch(bookingForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          if (statusEl) {
            statusEl.textContent = 'Thank you! Your request has been sent. We\'ll be in touch within 1\u20132 business days.';
            statusEl.className = 'form-status success';
          }
          bookingForm.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        if (statusEl) {
          statusEl.textContent = 'Something went wrong. Please try again or email us directly at holyjoe.coffee@gmail.com.';
          statusEl.className = 'form-status error';
        }
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('loading');
      }
    });
  }

})();
