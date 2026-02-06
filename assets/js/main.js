/* ============================================
   CUMBRE IA - MAIN JAVASCRIPT
   Modular ES6 Architecture
   ============================================ */

import { Navigation } from './components/Navigation.js';
import { VideoBackground } from './components/VideoBackground.js';
import { throttle, prefersReducedMotion } from './utils/helpers.js';

class CumbreIA {
  constructor() {
    this.navigation = null;
    this.videoBackground = null;
    this.init();
  }

  init() {
    // Initialize components
    this.navigation = new Navigation();

    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) {
      this.videoBackground = new VideoBackground(bgVideo);
    }

    // Initialize other features
    this.setupScrollIndicator();
    this.setupAnimationObserver();
    this.setupKeyboardNavigation();
    this.setupFAQ();

    // Instance kept local (not exposed on window for security)
  }

  setupScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator--minimal');
    const hero = document.getElementById('inicio');

    if (!indicator || !hero) return;

    let scrollIndicatorReady = false;

    indicator.addEventListener('animationend', () => {
      indicator.style.animation = 'none';
      indicator.style.transition = 'opacity 0.6s ease-out';
      scrollIndicatorReady = true;
      indicator.style.opacity = '1';
    }, { once: true });

    window.addEventListener('scroll', throttle(() => {
      if (!scrollIndicatorReady) return;

      const heroRect = hero.getBoundingClientRect();
      const heroBottomPosition = heroRect.bottom;
      const viewportHeight = window.innerHeight;

      if (heroBottomPosition > viewportHeight * 0.8) {
        indicator.style.opacity = '1';
      } else if (heroBottomPosition > viewportHeight * 0.5) {
        const fadeStart = viewportHeight * 0.8;
        const fadeEnd = viewportHeight * 0.5;
        const fadeRange = fadeStart - fadeEnd;
        const fadeProgress = (heroBottomPosition - fadeEnd) / fadeRange;
        indicator.style.opacity = Math.max(0, fadeProgress).toString();
      } else {
        indicator.style.opacity = '0';
      }
    }, 16));
  }

  setupAnimationObserver() {
    const animatedElements = document.querySelectorAll('.glass-card:not(.features__timeline .glass-card), .feature-card, .service-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(el);
    });
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
      if (e.key === 'Escape') {
        document.activeElement.blur();
      }
    });
  }

  setupFAQ() {
    document.querySelectorAll('.faq__question').forEach(button => {
      button.addEventListener('click', () => {
        const faqItem = button.closest('.faq__item');
        faqItem.classList.toggle('open');
      });
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CumbreIA());
} else {
  new CumbreIA();
}
