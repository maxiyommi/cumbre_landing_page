// Synthetic Audience Page Script
class SyntheticAudiencePage {
  constructor() {
    this.initializeComponents();
    this.setupEventListeners();
    this.setupScrollAnimations();
    this.setupVideoModal();
    this.setupBentoCards();
    this.setupImageModal();
    this.setupScreenshotLightbox();
    this.setupScreenshotsCarousel();
    this.setupAgentResponseCards();
    this.setupValuePropsText();
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
    // Screenshot gallery functionality - Open lightbox on click
    this.thumbnailButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        // Get screenshot data
        const screenshotSrc = button.dataset.screenshot;
        const screenshotAlt = button.querySelector('span')?.textContent || 'Screenshot';

        // Open lightbox with screenshot
        this.openScreenshotLightbox(screenshotSrc, screenshotAlt);

        // Update active state
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

      // Add/remove 'scrolled' class for styling
      const isScrolled = currentScroll > 100;
      this.header.classList.toggle('scrolled', isScrolled);
    });
  }

  handleScreenshotChange(button) {
    // Remove active class from all buttons
    this.thumbnailButtons.forEach(btn => btn.classList.remove('active'));

    // Add active class to clicked button
    button.classList.add('active');
  }

  openScreenshotLightbox(imageSrc, imageAlt) {
    const lightbox = document.getElementById('screenshotLightbox');
    const lightboxImg = document.getElementById('lightboxScreenshot');

    if (lightbox && lightboxImg) {
      lightboxImg.src = imageSrc;
      lightboxImg.alt = imageAlt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
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
        }
      });
    }, observerOptions);

    // Observe all cards and sections (excluding example section)
    const animatedElements = document.querySelectorAll(
      '.glass-card, .bento-card, .document-type-item'
    );

    animatedElements.forEach((el, index) => {
      // Skip animation for cards inside example section
      if (el.closest('.example-section-no-animate')) {
        return;
      }

      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(el);
    });
  }

  setupBentoCards() {
    const bentoCards = document.querySelectorAll('.bento-card');
    const agentCards = document.querySelectorAll('.agent-response-card');

    bentoCards.forEach(card => {
      // Mouse tracking effect (desktop)
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });

      // Collapsible functionality (mobile only)
      card.addEventListener('click', (e) => {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) return;

        // Evitar que el click en elementos internos expanda/colapse
        if (e.target.closest('a, button')) return;

        card.classList.toggle('expanded');
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

    // Inicializar estado de cards según viewport
    const initializeCards = () => {
      const isMobile = window.innerWidth <= 768;
      bentoCards.forEach(card => {
        if (!isMobile) {
          // En desktop, todas las cards están expandidas
          card.classList.add('expanded');
        } else {
          // En mobile, ninguna card está expandida inicialmente
          card.classList.remove('expanded');
        }
      });
    };

    // Inicializar estado de las cards
    initializeCards();

    // Reinicializar en resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initializeCards, 200);
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

  setupScreenshotLightbox() {
    const lightbox = document.getElementById('screenshotLightbox');
    const lightboxImage = document.getElementById('lightboxScreenshot');
    const closeLightboxBtn = document.querySelector('.screenshot-lightbox__close');
    const overlay = document.querySelector('.screenshot-lightbox__overlay');

    if (!lightbox || !lightboxImage || !closeLightboxBtn) return;

    // Cerrar lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    // Cerrar con botón X
    closeLightboxBtn.addEventListener('click', closeLightbox);

    // Cerrar al hacer click en el overlay
    if (overlay) {
      overlay.addEventListener('click', closeLightbox);
    }

    // Cerrar con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    // Prevenir scroll del body cuando el lightbox está abierto
    lightbox.addEventListener('touchmove', (e) => {
      if (e.target === lightbox || e.target === overlay) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  setupScreenshotsCarousel() {
    const carousel = document.getElementById('screenshotsCarousel');
    const indicators = document.querySelectorAll('.screenshot-dot');
    const thumbnails = document.querySelectorAll('.thumbnail-btn');

    if (!carousel || !indicators.length) return;

    // Detectar si estamos en mobile
    const isMobile = () => window.innerWidth <= 768;

    // Actualizar indicadores basado en scroll
    const updateIndicators = () => {
      if (!isMobile()) return;

      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.querySelector('.thumbnail-btn').offsetWidth;
      const gap = 16; // 1rem gap
      const totalWidth = cardWidth + gap;
      const currentIndex = Math.round(scrollLeft / totalWidth);

      // Actualizar indicadores
      indicators.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });

      // Actualizar botones activos
      thumbnails.forEach((btn, index) => {
        btn.classList.toggle('active', index === currentIndex);
      });
    };

    // Scroll al hacer click en indicadores
    indicators.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (!isMobile()) return;

        const cardWidth = carousel.querySelector('.thumbnail-btn').offsetWidth;
        const gap = 16;
        const scrollPosition = index * (cardWidth + gap);

        carousel.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      });
    });

    // Listener para scroll (con throttle para performance)
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(updateIndicators, 50);
    }, { passive: true });

    // Actualizar en resize
    window.addEventListener('resize', () => {
      if (isMobile()) {
        updateIndicators();
      }
    });

    // Inicializar
    if (isMobile()) {
      updateIndicators();
    }
  }

  setupAgentResponseCards() {
    const agentCards = document.querySelectorAll('.agent-response-card');
    const contextCard = document.querySelector('.context-card');
    const insightsCard = document.querySelector('.insights-card');
    const resultsCard = document.querySelector('.results-card');

    // Función para inicializar el estado de las cards según viewport
    const initializeAgentCards = () => {
      const isMobile = window.innerWidth <= 768;

      // Agent response cards
      agentCards.forEach(card => {
        if (isMobile) {
          // En mobile, colapsar todas las cards inicialmente
          card.classList.add('collapsed');

          // Agregar evento de click solo en mobile
          const clickHandler = (e) => {
            // Evitar que el click en links/botones active el colapso
            if (e.target.closest('a, button')) return;

            card.classList.toggle('collapsed');
          };

          // Guardar referencia al handler para poder removerlo después
          card._clickHandler = clickHandler;
          card.addEventListener('click', clickHandler);
        } else {
          // En desktop, expandir todas y remover eventos de click
          card.classList.remove('collapsed');

          if (card._clickHandler) {
            card.removeEventListener('click', card._clickHandler);
            card._clickHandler = null;
          }
        }
      });

      // Context card
      if (contextCard) {
        if (isMobile) {
          // En mobile, colapsar inicialmente
          contextCard.classList.add('collapsed');

          // Agregar evento de click solo en mobile
          const clickHandler = (e) => {
            // Evitar que el click en links/botones active el colapso
            if (e.target.closest('a, button')) return;

            contextCard.classList.toggle('collapsed');
          };

          // Guardar referencia al handler
          contextCard._clickHandler = clickHandler;
          contextCard.addEventListener('click', clickHandler);
        } else {
          // En desktop, expandir y remover evento de click
          contextCard.classList.remove('collapsed');

          if (contextCard._clickHandler) {
            contextCard.removeEventListener('click', contextCard._clickHandler);
            contextCard._clickHandler = null;
          }
        }
      }

      // Insights card
      if (insightsCard) {
        if (isMobile) {
          // En mobile, colapsar inicialmente
          insightsCard.classList.add('collapsed');

          // Agregar evento de click solo en mobile
          const clickHandler = (e) => {
            // Evitar que el click en links/botones active el colapso
            if (e.target.closest('a, button')) return;

            insightsCard.classList.toggle('collapsed');
          };

          // Guardar referencia al handler
          insightsCard._clickHandler = clickHandler;
          insightsCard.addEventListener('click', clickHandler);
        } else {
          // En desktop, expandir y remover evento de click
          insightsCard.classList.remove('collapsed');

          if (insightsCard._clickHandler) {
            insightsCard.removeEventListener('click', insightsCard._clickHandler);
            insightsCard._clickHandler = null;
          }
        }
      }

      // Results card
      if (resultsCard) {
        if (isMobile) {
          // En mobile, colapsar inicialmente
          resultsCard.classList.add('collapsed');

          // Agregar evento de click solo en mobile
          const clickHandler = (e) => {
            // Evitar que el click en links/botones active el colapso
            if (e.target.closest('a, button')) return;

            resultsCard.classList.toggle('collapsed');
          };

          // Guardar referencia al handler
          resultsCard._clickHandler = clickHandler;
          resultsCard.addEventListener('click', clickHandler);
        } else {
          // En desktop, expandir y remover evento de click
          resultsCard.classList.remove('collapsed');

          if (resultsCard._clickHandler) {
            resultsCard.removeEventListener('click', resultsCard._clickHandler);
            resultsCard._clickHandler = null;
          }
        }
      }
    };

    // Inicializar estado
    initializeAgentCards();

    // Reinicializar en resize con debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initializeAgentCards, 200);
    });
  }

  setupValuePropsText() {
    const valueProps = document.querySelectorAll('.value-prop .value-text strong');

    // Mobile-friendly short titles
    const mobileTexts = [
      'Perspectivas diversas',
      'Convergencias y divergencias',
      'Validación acelerada'
    ];

    // Desktop full titles
    const desktopTexts = [
      'Perspectivas diversas al instante',
      'Convergencias, divergencias, outliers',
      'Inteligencia temprana que acelera tu validación'
    ];

    const updateTexts = () => {
      const isMobile = window.innerWidth <= 768;
      valueProps.forEach((prop, index) => {
        prop.textContent = isMobile ? mobileTexts[index] : desktopTexts[index];
      });
    };

    // Inicializar
    updateTexts();

    // Actualizar en resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateTexts, 200);
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SyntheticAudiencePage();
  });
} else {
  new SyntheticAudiencePage();
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
        const titleVisibleAt = sectionTop - 120;
        const viewportTop = scrollTop;

        station.classList.remove("active", "passed");

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
