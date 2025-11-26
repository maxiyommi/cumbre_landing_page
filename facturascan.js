// FacturaScan Page Script
class FacturaScanPage {
  constructor() {
    this.initializeComponents();
    this.setupEventListeners();
    this.setupScrollAnimations();
    this.setupVideoModal();
    this.setupBentoCards();
    this.setupImageModal();
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
      // Skip animation for cards inside facturascan-how-it-works section
      if (el.closest('.facturascan-how-it-works.section-transition-from-purple-gradient')) {
        return;
      }

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


  setupBentoCards() {
    const bentoCards = document.querySelectorAll('.bento-card');
    const agentCards = document.querySelectorAll('.agent-response-card');

    bentoCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });

    agentCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });
  }

  setupImageModal() {
    const clickableImages = document.querySelectorAll('.product-image-clickable');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.image-modal-close');
    const overlay = document.querySelector('.image-modal-overlay');

    if (!modal || !clickableImages.length) return;

    // Abrir modal al hacer clic en imagen
    clickableImages.forEach(img => {
      img.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalCaption.textContent = img.alt + ' · Imagen generada con IA';
        document.body.style.overflow = 'hidden';
      });
    });

    // Cerrar modal
    const closeModal = () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    if (overlay) {
      overlay.addEventListener('click', closeModal);
    }

    // Cerrar con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });
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

// Scroll Progress Indicator
function setupScrollProgress() {
  const scrollProgress = document.querySelector(".scroll-progress");
  const progressFill = document.querySelector(".scroll-progress__fill");
  const progressCurrent = document.querySelector(".scroll-progress__current");
  const stations = document.querySelectorAll(".scroll-progress__station");
  const scrollIndicator = document.querySelector(".scroll-indicator");

  if (!scrollProgress || !progressFill || !progressCurrent) return;

  // Detect which page we're on and map sections accordingly
  const isFacturaScan = document.querySelector('.facturascan-document-types') !== null;
  const isSyntheticAudience = document.querySelector('.example-section-no-animate') !== null;

  let sectionMap = {};

  if (isFacturaScan) {
    sectionMap = {
      hero: document.querySelector(".synthetic-hero"),
      features: document.querySelector(".facturascan-how-it-works"),
      documents: document.querySelector(".facturascan-document-types"),
      screenshots: document.querySelector(".facturascan-screenshots"),
      process: document.querySelector(".facturascan-process"),
      cta: document.querySelector(".facturascan-final-cta")
    };
  } else if (isSyntheticAudience) {
    sectionMap = {
      hero: document.querySelector(".synthetic-hero"),
      features: document.querySelector("#features"),
      documents: document.querySelector(".facturascan-document-types"),
      example: document.querySelector(".example-section-no-animate"),
      screenshots: document.querySelector(".facturascan-screenshots"),
      cta: document.querySelector(".facturascan-final-cta")
    };
  }

  const trackHeight = 300;
  let ticking = false;

  const positionStations = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    stations.forEach((station) => {
      const sectionId = station.dataset.section;
      const section = sectionMap[sectionId];

      if (section) {
        const sectionTop = section.offsetTop;
        const scrollToShowTitle = Math.max(0, sectionTop - 150);
        const sectionPercent = Math.min(scrollToShowTitle / docHeight, 1);
        const stationTop = sectionPercent * (trackHeight - 10);

        station.style.position = "absolute";
        station.style.top = `${stationTop}px`;
      }
    });
  };

  const updateProgress = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(scrollTop / docHeight, 1);

    if (scrollTop > 200) {
      scrollProgress.classList.add("visible");
      if (scrollIndicator) scrollIndicator.classList.add("hidden");
    } else {
      scrollProgress.classList.remove("visible");
      if (scrollIndicator) scrollIndicator.classList.remove("hidden");
    }

    progressFill.style.height = `${scrollPercent * 100}%`;

    const currentTop = scrollPercent * (trackHeight - 14);
    progressCurrent.style.top = `${currentTop}px`;

    stations.forEach((station) => {
      const sectionId = station.dataset.section;
      const section = sectionMap[sectionId];

      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        // Usar el título visible (con offset de 120px para el header)
        const titleVisibleAt = sectionTop - 120;
        const viewportTop = scrollTop;

        station.classList.remove("active", "passed");

        // Activo cuando el título está visible en la parte superior del viewport
        if (viewportTop >= titleVisibleAt && viewportTop < sectionBottom - window.innerHeight * 0.3) {
          station.classList.add("active");
        } else if (viewportTop >= sectionBottom - window.innerHeight * 0.3) {
          station.classList.add("passed");
        }
      }
    });

    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  };

  stations.forEach((station) => {
    station.style.pointerEvents = "auto";
    station.style.cursor = "pointer";
    station.addEventListener("click", () => {
      const sectionId = station.dataset.section;
      const section = sectionMap[sectionId];
      if (section) {
        const targetPosition = section.offsetTop - 100;
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: "smooth"
        });
      }
    });
  });

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", positionStations, { passive: true });

  positionStations();
  updateProgress();
}

// Initialize scroll progress after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupScrollProgress);
} else {
  setupScrollProgress();
}
