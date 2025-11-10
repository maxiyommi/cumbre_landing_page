// FacturaScan Page Script
class FacturaScanPage {
  constructor() {
    this.initializeComponents();
    this.setupEventListeners();
    this.setupScrollAnimations();
    this.handleMobileMenu();
    this.setupVideoModal();
    this.handleNavbarVisibility();
  }

  initializeComponents() {
    this.header = document.querySelector('.header');
    this.thumbnailButtons = document.querySelectorAll('.thumbnail-btn');
    this.mainScreenshot = document.getElementById('main-screenshot');
    this.videoModal = document.getElementById('videoModal');
    this.demoVideo = document.getElementById('demoVideo');
    this.openVideoBtn = document.getElementById('openVideoModal');
    this.closeVideoBtn = document.querySelector('.video-modal__close');
    this.modalBackdrop = document.querySelector('.video-modal__backdrop');
  }

  setupVideoModal() {
    if (!this.videoModal || !this.openVideoBtn) return;

    // Abrir modal
    this.openVideoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.openModal();
    });

    // Cerrar modal con botón X
    if (this.closeVideoBtn) {
      this.closeVideoBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Cerrar modal al hacer click en el backdrop
    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.videoModal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  openModal() {
    this.videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reproducir video automáticamente
    if (this.demoVideo) {
      this.demoVideo.play().catch(error => {
        console.log('Autoplay prevented:', error);
      });
    }
  }

  closeModal() {
    this.videoModal.classList.remove('active');
    document.body.style.overflow = '';

    // Pausar y resetear video
    if (this.demoVideo) {
      this.demoVideo.pause();
      this.demoVideo.currentTime = 0;
    }
  }

  setupEventListeners() {
    // Screenshot gallery functionality
    this.thumbnailButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleScreenshotChange(button);
      });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Header visibility and style on scroll
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Add/remove 'scrolled' class for styling (like index.html)
      const isScrolled = currentScroll > 100;
      this.header.classList.toggle('scrolled', isScrolled);

      // Handle navbar visibility (hide nav links in hero section)
      this.handleNavbarVisibility();
    });
  }

  handleScreenshotChange(button) {
    // Remove active class from all buttons
    this.thumbnailButtons.forEach(btn => btn.classList.remove('active'));

    // Add active class to clicked button
    button.classList.add('active');

    // Update main screenshot with fade transition
    const newScreenshot = button.dataset.screenshot;

    this.mainScreenshot.style.opacity = '0';
    this.mainScreenshot.style.transform = 'scale(0.95)';

    setTimeout(() => {
      this.mainScreenshot.src = newScreenshot;
      this.mainScreenshot.style.opacity = '1';
      this.mainScreenshot.style.transform = 'scale(1)';
    }, 200);

    this.mainScreenshot.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';

          // Trigger stat counter animation
          if (entry.target.classList.contains('facturascan-stats')) {
            this.animateStats();
          }
        }
      });
    }, observerOptions);

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll(
      '.glass-card, .how-it-works-step, .benefit-card, .document-type-item, .facturascan-stats'
    );

    animatedElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(el);
    });
  }

  animateStats() {
    const statValues = document.querySelectorAll('.stat-value');

    statValues.forEach(stat => {
      // Evitar re-animar si ya se animó
      if (stat.classList.contains('animated')) return;
      stat.classList.add('animated');

      const finalText = stat.textContent;
      const isPercentage = finalText.includes('%');
      const hasMultiplier = finalText.includes('x');

      // Extraer el número
      let targetNumber = parseInt(finalText.replace(/[^\d]/g, ''));

      // Configuración de la animación
      const duration = 2000; // 2 segundos
      const frameDuration = 1000 / 60; // 60 FPS
      const totalFrames = Math.round(duration / frameDuration);
      const easeOutQuad = t => t * (2 - t); // Easing function

      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentNumber = Math.round(targetNumber * progress);

        // Formatear el número según el tipo
        if (hasMultiplier) {
          stat.textContent = `x${currentNumber}`;
        } else if (isPercentage) {
          stat.textContent = `${currentNumber}%`;
        } else {
          stat.textContent = currentNumber;
        }

        // Agregar clase de pulsación en ciertos frames
        if (frame % 10 === 0) {
          stat.style.transform = 'scale(1.1)';
          setTimeout(() => {
            stat.style.transform = 'scale(1)';
          }, 100);
        }

        if (frame === totalFrames) {
          clearInterval(counter);
          stat.textContent = finalText; // Asegurar el valor final

          // Animación de "completado"
          stat.style.transform = 'scale(1.15)';
          setTimeout(() => {
            stat.style.transform = 'scale(1)';
          }, 200);
        }
      }, frameDuration);
    });
  }

  handleMobileMenu() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');

    if (menuToggle && nav) {
      menuToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('header__nav--open');
        menuToggle.setAttribute('aria-expanded', isOpen);
        menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');

        if (isOpen) {
          menuToggle.innerHTML = '<span aria-hidden="true">&times;</span>';
          document.body.style.overflow = 'hidden';
        } else {
          menuToggle.innerHTML = '<span aria-hidden="true">&#9776;</span>';
          document.body.style.overflow = '';
        }
      });

      // Close menu when clicking on a link
      const navLinks = document.querySelectorAll('.header__nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (nav.classList.contains('header__nav--open')) {
            nav.classList.remove('header__nav--open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Abrir menú');
            menuToggle.innerHTML = '<span aria-hidden="true">&#9776;</span>';
            document.body.style.overflow = '';
          }
        });
      });
    }
  }

  handleNavbarVisibility() {
    const nav = document.querySelector('.header__nav');
    const heroSection = document.querySelector('.facturascan-hero');

    if (!nav || !heroSection) return;

    const heroRect = heroSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Ocultar nav cuando estás en la sección hero (dejando solo el logo)
    const inHeroSection = heroRect.bottom > windowHeight * 0.2;

    if (inHeroSection) {
      nav.classList.add('header__nav--hidden');
      nav.classList.remove('header__nav--visible');
    } else {
      nav.classList.remove('header__nav--hidden');
      nav.classList.add('header__nav--visible');
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FacturaScanPage();
  });
} else {
  new FacturaScanPage();
}

// Performance optimization: lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });

  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => imageObserver.observe(img));
}
