/* ============================================
   NAVIGATION COMPONENT
   ============================================ */

import { throttle } from '../utils/helpers.js';

export class Navigation {
  constructor() {
    this.header = document.querySelector('.header');
    this.navLinks = document.querySelectorAll('.header__nav-link');
    this.sections = document.querySelectorAll('.section');
    this.menuToggle = document.querySelector('.header__menu-toggle');
    this.nav = document.querySelector('.header__nav');

    if (this.header) {
      this.init();
    }
  }

  init() {
    this.setupScrollBehavior();
    this.setupMobileMenu();
    this.setupContactDropdown();
    this.setupLogoClick();
    this.setupNavObserver();
  }

  setupScrollBehavior() {
    window.addEventListener('scroll', throttle(() => {
      this.handleScroll();
      this.updateActiveNavLink();
    }, 16));

    // Navigation clicks
    this.navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });
  }

  handleScroll() {
    const scrolled = window.pageYOffset > 100;
    this.header?.classList.toggle('scrolled', scrolled);
  }

  handleNavClick(e) {
    const targetId = e.target.getAttribute('href');

    // Only prevent default for internal links
    if (targetId && targetId.startsWith('#')) {
      e.preventDefault();
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = this.header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  }

  updateActiveNavLink() {
    const visibleSections = [];
    const headerOffset = this.header ? this.header.offsetHeight : 0;

    this.sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, headerOffset);
      const visibilityRatio = visibleHeight / windowHeight;

      if (visibilityRatio > 0) {
        visibleSections.push({
          section: section,
          ratio: visibilityRatio,
          distanceFromTop: Math.max(0, rect.top - headerOffset)
        });
      }
    });

    if (visibleSections.length > 0) {
      visibleSections.sort((a, b) => a.distanceFromTop - b.distanceFromTop);

      const activeSection = visibleSections[0].section;
      const targetId = `#${activeSection.id}`;
      const sectionId = activeSection.id;

      // Remove active from all links
      this.navLinks.forEach(link => link.classList.remove('active'));

      const solucionesToggle = document.querySelector('.header__nav-contact-toggle[aria-label="Abrir menú de soluciones"]');
      if (solucionesToggle) {
        solucionesToggle.classList.remove('active');
      }

      // Add active to current link
      this.navLinks.forEach(link => {
        if (link.getAttribute('href') === targetId) {
          link.classList.add('active');
        }
      });

      // Handle special case: Soluciones dropdown
      if (sectionId === 'soluciones' && solucionesToggle) {
        solucionesToggle.classList.add('active');
      }
    }
  }

  setupMobileMenu() {
    if (!this.menuToggle || !this.nav) return;

    this.menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.nav.classList.toggle('open');
      this.menuToggle.setAttribute(
        'aria-label',
        this.nav.classList.contains('open') ? 'Cerrar menú' : 'Abrir menú'
      );
    });

    // Close menu on link click
    this.nav.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.nav.classList.remove('open');
        this.menuToggle.setAttribute('aria-label', 'Abrir menú');
      });
    });

    // Prevent clicks inside nav from closing menu
    this.nav.addEventListener('click', (e) => e.stopPropagation());

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (this.nav.classList.contains('open') &&
          !this.nav.contains(e.target) &&
          !this.menuToggle.contains(e.target)) {
        this.nav.classList.remove('open');
        this.menuToggle.setAttribute('aria-label', 'Abrir menú');
      }
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.nav.classList.contains('open')) {
        this.nav.classList.remove('open');
        this.menuToggle.setAttribute('aria-label', 'Abrir menú');
        this.menuToggle.focus();
      }
    });
  }

  setupContactDropdown() {
    const contactToggle = document.querySelector('.header__nav-contact-toggle');
    const contactDropdown = document.querySelector('.header__nav-contact-dropdown');

    if (!contactToggle || !contactDropdown) return;

    // Mobile: toggle on click
    contactToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 700) {
        e.preventDefault();
        const expanded = contactDropdown.style.display === 'block';
        contactDropdown.style.display = expanded ? 'none' : 'block';
        contactToggle.setAttribute('aria-expanded', !expanded);
      }
    });

    // Close dropdown on outside click (mobile)
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 700 &&
          contactDropdown.style.display === 'block' &&
          !contactDropdown.contains(e.target) &&
          !contactToggle.contains(e.target)) {
        contactDropdown.style.display = 'none';
        contactToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  setupLogoClick() {
    const logo = document.querySelector('.header__logo');
    const footerLogo = document.querySelector('.footer__logo-container');

    if (logo) {
      logo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (footerLogo) {
      footerLogo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  setupNavObserver() {
    this.navObserver = new IntersectionObserver(
      () => this.updateActiveNavLink(),
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px 0px -40% 0px'
      }
    );

    this.sections.forEach(section => {
      this.navObserver.observe(section);
    });
  }
}
