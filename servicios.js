/**
 * Servicios Page - Interactive Components
 * Maneja la funcionalidad de la página de casos de uso
 */

class ServiciosPage {
  constructor() {
    this.currentCaso = 1;
    this.modal = null;
    this.modalContent = null;
    this.modalContainer = null;
    this.focusedElementBeforeModal = null;
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.setupCasosTabs();
    this.setupScrollAnimations();
    this.setupSmoothScroll();
    this.checkURLHash();
    this.setupCurrentDate();
    this.setupScrollProgress();
    this.setupModal();
    this.setupResponsiveDetection();
  }

  /**
   * Configura el indicador de progreso de scroll
   */
  setupScrollProgress() {
    const scrollProgress = document.querySelector(".scroll-progress");
    const progressFill = document.querySelector(".scroll-progress__fill");
    const progressCurrent = document.querySelector(".scroll-progress__current");
    const stations = document.querySelectorAll(".scroll-progress__station");
    const scrollIndicator = document.querySelector(".scroll-indicator");

    if (!scrollProgress || !progressFill || !progressCurrent) return;

    // Map sections to their elements
    const sectionMap = {
      hero: document.querySelector(".servicios-hero"),
      resumen: document.querySelector(".servicios-resumen"),
      glosario: document.querySelector(".servicios-glosario"),
      casos: document.querySelector(".servicios-casos"),
      matriz: document.querySelector(".servicios-matriz"),
      cta: document.querySelector(".servicios-cta")
    };

    const trackHeight = 300; // Match CSS height
    let ticking = false;

    // Position stations based on actual section positions
    const positionStations = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      stations.forEach((station) => {
        const sectionId = station.dataset.section;
        const section = sectionMap[sectionId];

        if (section) {
          // Calculate scroll position where section title is visible
          // Use section top minus some offset to ensure title is in view
          const sectionTop = section.offsetTop;
          const scrollToShowTitle = Math.max(0, sectionTop - 150); // 150px offset for header + breathing room
          const sectionPercent = Math.min(scrollToShowTitle / docHeight, 1);
          const stationTop = sectionPercent * (trackHeight - 10); // 10 = station size

          station.style.position = "absolute";
          station.style.top = `${stationTop}px`;
        }
      });
    };

    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(scrollTop / docHeight, 1);

      // Show/hide based on scroll position
      if (scrollTop > 200) {
        scrollProgress.classList.add("visible");
        if (scrollIndicator) scrollIndicator.classList.add("hidden");
      } else {
        scrollProgress.classList.remove("visible");
        if (scrollIndicator) scrollIndicator.classList.remove("hidden");
      }

      // Update fill height
      progressFill.style.height = `${scrollPercent * 100}%`;

      // Update current position indicator
      const currentTop = scrollPercent * (trackHeight - 14); // 14 = indicator size
      progressCurrent.style.top = `${currentTop}px`;

      // Update station states
      stations.forEach((station) => {
        const sectionId = station.dataset.section;
        const section = sectionMap[sectionId];

        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          const viewportMiddle = scrollTop + window.innerHeight / 2;

          station.classList.remove("active", "passed");

          if (viewportMiddle >= sectionTop && viewportMiddle < sectionBottom) {
            station.classList.add("active");
          } else if (scrollTop > sectionBottom - window.innerHeight / 2) {
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

    // Click on stations to scroll to section
    stations.forEach((station) => {
      station.style.pointerEvents = "auto";
      station.style.cursor = "pointer";
      station.addEventListener("click", () => {
        const sectionId = station.dataset.section;
        const section = sectionMap[sectionId];
        if (section) {
          // Scroll to position where title is visible (with offset for header)
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

    // Initial setup
    positionStations();
    updateProgress();
  }

  /**
   * Configura la fecha actual en el badge del hero
   */
  setupCurrentDate() {
    const dateElement = document.getElementById("currentDate");
    if (dateElement) {
      const now = new Date();
      const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      dateElement.textContent = `${month} ${year}`;
    }
  }

  /**
   * Configura los tabs de casos de uso
   */
  setupCasosTabs() {
    const tabs = document.querySelectorAll(".casos-tab");
    const contents = document.querySelectorAll(".caso-content");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const casoNumber = tab.getAttribute("data-caso");

        // En mobile, abrir modal. En desktop, cambiar contenido inline
        if (this.isMobile) {
          this.openModal(casoNumber);
        } else {
          this.switchCaso(casoNumber, tabs, contents);
        }
      });
    });
  }

  /**
   * Actualiza el estado visual de los tabs
   */
  updateTabsActiveState(casoNumber) {
    const tabs = document.querySelectorAll(".casos-tab");

    // Remover clase active de todos los tabs
    tabs.forEach((t) => t.classList.remove("active"));

    // Agregar clase active al tab seleccionado
    const selectedTab = document.querySelector(
      `.casos-tab[data-caso="${casoNumber}"]`
    );

    if (selectedTab) {
      selectedTab.classList.add("active");
    }

    // Actualizar URL hash sin scroll
    history.replaceState(null, null, `#caso-${casoNumber}`);
  }

  /**
   * Cambia entre casos de uso
   */
  switchCaso(casoNumber, tabs, contents) {
    // Actualizar estado actual
    this.currentCaso = parseInt(casoNumber);

    // Remover clase active de todos los tabs y contents
    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));

    // Agregar clase active al tab y content seleccionados
    const selectedTab = document.querySelector(
      `.casos-tab[data-caso="${casoNumber}"]`
    );
    const selectedContent = document.getElementById(`caso-${casoNumber}`);

    if (selectedTab && selectedContent) {
      selectedTab.classList.add("active");
      selectedContent.classList.add("active");

      // Actualizar URL hash sin scroll
      history.replaceState(null, null, `#caso-${casoNumber}`);
    }
  }

  /**
   * Verifica si hay un hash en la URL para abrir un caso específico
   */
  checkURLHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith("#caso-")) {
      const casoNumber = hash.replace("#caso-", "");
      const tabs = document.querySelectorAll(".casos-tab");
      const contents = document.querySelectorAll(".caso-content");

      // Pequeño delay para asegurar que todo esté renderizado
      setTimeout(() => {
        this.switchCaso(casoNumber, tabs, contents);
      }, 100);
    }
  }

  /**
   * Configura animaciones al hacer scroll
   */
  setupScrollAnimations() {
    // Intersection Observer para animaciones al entrar en viewport
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // Observar elementos que queremos animar
    const animatedElements = document.querySelectorAll(
      ".glosario-card, .caso-card, .matriz-table, .cta-content"
    );

    animatedElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
  }

  /**
   * Configura scroll suave para links internos
   */
  setupSmoothScroll() {
    // Manejar clicks en links que apuntan a anclas
    document.querySelectorAll('a[href^="#caso-"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const casoNumber = targetId.replace("caso-", "");
          const tabs = document.querySelectorAll(".casos-tab");
          const contents = document.querySelectorAll(".caso-content");
          this.switchCaso(casoNumber, tabs, contents);
        }
      });
    });
  }

  /**
   * Detecta cambios de tamaño de pantalla
   */
  setupResponsiveDetection() {
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;

        // Si cambiamos de mobile a desktop o viceversa, cerrar modal
        if (wasMobile !== this.isMobile && this.modal?.classList.contains('active')) {
          this.closeModal();
        }
      }, 250);
    });
  }

  /**
   * Configura el sistema de modal para mobile
   */
  setupModal() {
    this.modal = document.getElementById('casoModal');
    this.modalContent = document.getElementById('casoModalContent');
    this.modalContainer = this.modal?.querySelector('.caso-modal__container');

    if (!this.modal || !this.modalContent || !this.modalContainer) {
      return;
    }

    // Cerrar modal con overlay o botón close
    this.modal.querySelectorAll('[data-modal-close]').forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeModal();
      });
    });

    // Swipe to close (mobile)
    this.setupSwipeToClose();

    // Keyboard accessibility
    this.setupModalKeyboard();

    // Prevent body scroll when modal is open
    this.modal.addEventListener('transitionend', () => {
      if (this.modal.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * Abre el modal con el contenido de un caso específico
   */
  openModal(casoNumber) {
    if (!this.modal || !this.modalContent) {
      console.error('Modal elements not found');
      return;
    }

    // Actualizar el estado actual
    this.currentCaso = parseInt(casoNumber);

    // Actualizar tabs para mostrar el caso activo
    this.updateTabsActiveState(casoNumber);

    // Guardar elemento enfocado antes de abrir modal
    this.focusedElementBeforeModal = document.activeElement;

    // Obtener el contenido del caso
    const casoContent = document.getElementById(`caso-${casoNumber}`);
    if (!casoContent) {
      console.error(`Caso ${casoNumber} content not found`);
      return;
    }

    // Obtener la tarjeta del caso (el contenido real)
    const casoCard = casoContent.querySelector('.caso-card');
    if (!casoCard) {
      console.error(`Caso card not found for caso ${casoNumber}`);
      return;
    }

    // Clonar la tarjeta (deep clone)
    const clonedCard = casoCard.cloneNode(true);

    // Eliminar estilos inline de animación que puedan ocultar el contenido
    clonedCard.style.opacity = '1';
    clonedCard.style.transform = 'none';
    clonedCard.style.transition = 'none';

    // También eliminar estilos inline de todos los elementos hijos que puedan tener animaciones
    const animatedChildren = clonedCard.querySelectorAll('[style*="opacity"], [style*="transform"]');
    animatedChildren.forEach(child => {
      child.style.opacity = '1';
      child.style.transform = 'none';
      child.style.transition = 'none';
    });

    // Limpiar contenido anterior y agregar nuevo
    this.modalContent.innerHTML = '';
    this.modalContent.appendChild(clonedCard);

    // Actualizar ARIA
    this.modal.setAttribute('aria-hidden', 'false');
    const title = clonedCard.querySelector('.caso-card__title');
    if (title) {
      title.id = 'casoModalTitle';
    }

    // Mostrar modal
    this.modal.style.display = 'flex';
    // Force reflow
    void this.modal.offsetHeight;

    // Usar requestAnimationFrame para asegurar que la animación se ejecute
    requestAnimationFrame(() => {
      this.modal.classList.add('active');
    });

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';

    // Focus en el modal
    setTimeout(() => {
      const closeButton = this.modal.querySelector('.caso-modal__close');
      if (closeButton) closeButton.focus();
    }, 100);

    // Track analytics
    this.trackModalView(casoNumber);
  }

  /**
   * Cierra el modal
   */
  closeModal() {
    if (!this.modal) return;

    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');

    // Restaurar scroll del body
    document.body.style.overflow = '';

    // Restaurar focus al elemento anterior
    setTimeout(() => {
      if (this.focusedElementBeforeModal) {
        this.focusedElementBeforeModal.focus();
      }
    }, 400);

    // Limpiar contenido después de la animación
    setTimeout(() => {
      if (!this.modal.classList.contains('active')) {
        this.modalContent.innerHTML = '';
        this.modal.style.display = 'none';
      }
    }, 400);
  }

  /**
   * Configura swipe to close para mobile
   */
  setupSwipeToClose() {
    if (!this.modalContainer) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const handleTouchStart = (e) => {
      // Solo activar si el contenedor está en la parte superior del scroll
      if (this.modalContainer.scrollTop === 0) {
        startY = e.touches[0].clientY;
        isDragging = true;
        this.modalContainer.style.transition = 'none';
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;

      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // Solo permitir arrastrar hacia abajo
      if (deltaY > 0) {
        e.preventDefault();
        const progress = Math.min(deltaY / 300, 1);
        this.modalContainer.style.transform = `translateY(${deltaY}px)`;
        this.modal.querySelector('.caso-modal__overlay').style.opacity = 1 - progress;
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;

      const deltaY = currentY - startY;
      this.modalContainer.style.transition = '';

      // Si arrastró más de 150px, cerrar modal
      if (deltaY > 150) {
        this.closeModal();
      } else {
        // Restaurar posición
        this.modalContainer.style.transform = '';
        this.modal.querySelector('.caso-modal__overlay').style.opacity = '';
      }

      isDragging = false;
      startY = 0;
      currentY = 0;
    };

    this.modalContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    this.modalContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    this.modalContainer.addEventListener('touchend', handleTouchEnd);
  }

  /**
   * Configura navegación por teclado del modal
   */
  setupModalKeyboard() {
    if (!this.modal) return;

    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;

      // Escape para cerrar
      if (e.key === 'Escape') {
        this.closeModal();
      }

      // Tab trap (mantener focus dentro del modal)
      if (e.key === 'Tab') {
        this.trapFocus(e);
      }
    });
  }

  /**
   * Mantiene el foco dentro del modal (focus trap)
   */
  trapFocus(e) {
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }

  /**
   * Track modal view para analytics
   */
  trackModalView(casoNumber) {
    if (typeof gtag !== "undefined") {
      gtag("event", "view_modal_caso", {
        event_category: "Servicios",
        event_label: `Caso ${casoNumber}`,
        method: this.isMobile ? 'mobile' : 'desktop'
      });
    }
  }
}

// Función para agregar contador de scroll en stats
function setupStatsCounter() {
  const stats = document.querySelectorAll(".stat-item__value");

  const animateValue = (element, start, end, duration) => {
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (
        (increment > 0 && current >= end) ||
        (increment < 0 && current <= end)
      ) {
        current = end;
        clearInterval(timer);
      }

      // Formatear el valor según el tipo
      const text = element.textContent;
      if (text.includes("-")) {
        // Para rangos como "60-90"
        const parts = text.split("-");
        element.textContent = `${Math.floor(current)}-${parts[1]}`;
      } else if (text.includes("%")) {
        element.textContent = `${Math.floor(current)}%`;
      } else if (text.includes("$")) {
        element.textContent = `$${Math.floor(current)}-${
          text.split("-")[1] || "490"
        }`;
      }
    }, 16);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const text = entry.target.textContent;
          const firstNumber = parseInt(text.match(/\d+/)[0]);
          animateValue(entry.target, 0, firstNumber, 1000);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((stat) => observer.observe(stat));
}

// Función para añadir tooltips informativos
function setupTooltips() {
  const badges = document.querySelectorAll(".feature-badge");

  badges.forEach((badge) => {
    badge.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
    });

    badge.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });
}


// Función para agregar animación de highlight al hacer hover en resultados
function setupResultadosHighlight() {
  const resultados = document.querySelectorAll(".resultado-item");

  resultados.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      const value = this.querySelector(".resultado-value");
      if (value) {
        value.style.transform = "scale(1.1)";
        value.style.transition = "transform 0.3s ease";
      }
    });

    item.addEventListener("mouseleave", function () {
      const value = this.querySelector(".resultado-value");
      if (value) {
        value.style.transform = "scale(1)";
      }
    });
  });
}

// Función para agregar efecto ripple en botones
function setupRippleEffect() {
  const buttons = document.querySelectorAll(".casos-tab, .btn");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      // Agregar estilos inline si no existen
      if (!document.getElementById("ripple-styles")) {
        const style = document.createElement("style");
        style.id = "ripple-styles";
        style.textContent = `
          .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
          }
          @keyframes ripple-animation {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Función para lazy loading de imágenes (si las hay en el futuro)
function setupLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// Función para compartir casos (placeholder para futura implementación)
function setupShareButtons() {
  // Funcionalidad de compartir casos - por implementar si es necesario
}

// Función para configurar el glosario colapsable en mobile
function setupGlosarioAccordion() {
  const glosarioItems = document.querySelectorAll('[data-glosario-item]');

  // Solo aplicar comportamiento de acordeón en mobile
  const checkAndSetup = () => {
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      // En desktop, mantener todos expandidos
      glosarioItems.forEach(item => {
        item.classList.add('open');
        const toggle = item.querySelector('[data-glosario-toggle]');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
      return;
    }

    // En mobile, configurar toggle handlers solo una vez
    glosarioItems.forEach((item) => {
      const toggle = item.querySelector('[data-glosario-toggle]');
      const content = item.querySelector('[data-glosario-content]');

      if (!toggle || !content) return;

      // Todos los items cerrados por defecto en mobile
      item.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');

      // Remover event listeners previos para evitar duplicados
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);

      // Agregar nuevo event listener
      newToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('open');

        // Toggle el item actual
        if (isOpen) {
          item.classList.remove('open');
          newToggle.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          newToggle.setAttribute('aria-expanded', 'true');
        }
      });
    });
  };

  // Configuración inicial
  checkAndSetup();

  // Reconfigurar en resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      checkAndSetup();
    }, 250);
  });
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar la clase principal
  new ServiciosPage();

  // Inicializar funcionalidades adicionales
  setupStatsCounter();
  setupTooltips();
  setupResultadosHighlight();
  setupRippleEffect();
  setupLazyLoading();
  setupShareButtons();
  setupGlosarioAccordion();
});


// Exportar para uso global si es necesario
if (typeof module !== "undefined" && module.exports) {
  module.exports = ServiciosPage;
}

/* ===================================================================
   PDF Download Modal Controller
   Descripción: Manejo del modal de captura de leads y envío a n8n webhook
   =================================================================== */

(function() {
  'use strict';

  // =========================================
  // CONFIGURACIÓN - IMPORTANTE: Actualizar con tu webhook de n8n
  // =========================================
  const CONFIG = {
    // URL del webhook de n8n (reemplazar con tu URL real)
    webhookURL: 'https://tu-n8n-instance.app/webhook/pdf-download',

    // URL del PDF para descargar (Google Drive direct download link)
    pdfURL: 'https://drive.google.com/uc?export=download&id=130tonmtNnHHzkrd0AFuyyodLcDtneaBW',

    // Timeout para la petición (ms)
    requestTimeout: 10000
  };

  // =========================================
  // DOM Elements
  // =========================================
  let modal, form, submitBtn, formStatus, fields, errors;

  // =========================================
  // Inicialización
  // =========================================
  function init() {
    // Obtener elementos del DOM
    modal = document.getElementById('pdfDownloadModal');
    form = document.getElementById('pdfDownloadForm');
    submitBtn = document.getElementById('submitBtn');
    formStatus = document.getElementById('formStatus');

    // Elementos del formulario
    fields = {
      fullName: document.getElementById('fullName'),
      email: document.getElementById('email'),
      company: document.getElementById('company'),
      industry: document.getElementById('industry'),
      phone: document.getElementById('phone'),
      useCase: document.getElementById('useCase')
    };

    // Elementos de error
    errors = {
      fullName: document.getElementById('fullNameError'),
      email: document.getElementById('emailError'),
      company: document.getElementById('companyError'),
      industry: document.getElementById('industryError'),
      useCase: document.getElementById('useCaseError')
    };

    // Verificar que existan los elementos antes de continuar
    if (!modal || !form) {
      console.warn('PDF Download Modal elements not found');
      return;
    }

    setupEventListeners();
    interceptPDFDownloadButton();
  }

  // =========================================
  // Event Listeners
  // =========================================
  function setupEventListeners() {
    // Cerrar modal con botón de cerrar
    const closeButtons = document.querySelectorAll('[data-pdf-modal-close]');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // Submit del formulario
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }

    // Limpiar errores al escribir (solo si ya hay un error mostrado)
    Object.keys(fields).forEach(key => {
      if (fields[key]) {
        fields[key].addEventListener('input', () => {
          // Solo limpiar si ya hay un error visible
          const formGroup = fields[key].closest('.form-group');
          if (formGroup && formGroup.classList.contains('has-error')) {
            clearFieldError(key);
          }
        });
      }
    });
  }

  // =========================================
  // Interceptar el botón de descarga del PDF
  // =========================================
  function interceptPDFDownloadButton() {
    // Buscar todos los enlaces que apunten al PDF
    const pdfLinks = document.querySelectorAll('a[href*="drive.google.com"]');

    pdfLinks.forEach(link => {
      const href = link.getAttribute('href');
      // Verificar si es el link del PDF completo
      if (href && href.includes('130tonmtNnHHzkrd0AFuyyodLcDtneaBW')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          openModal();
        });
      }
    });
  }

  // =========================================
  // Modal Control
  // =========================================
  function openModal() {
    if (!modal) return;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus en el primer campo
    setTimeout(() => {
      if (fields.fullName) {
        fields.fullName.focus();
      }
    }, 300);
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Reset del formulario después de cerrar
    setTimeout(() => {
      resetForm();
    }, 300);
  }

  // =========================================
  // Validación de Campos
  // =========================================
  function validateField(fieldName) {
    const field = fields[fieldName];
    const error = errors[fieldName];

    if (!field || !error) return true;

    // Limpiar error previo
    field.closest('.form-group').classList.remove('has-error');
    error.textContent = '';

    // Validaciones específicas
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'fullName':
        if (!field.value.trim()) {
          isValid = false;
          errorMessage = 'Por favor ingresá tu nombre completo';
        } else if (field.value.trim().length < 3) {
          isValid = false;
          errorMessage = 'El nombre debe tener al menos 3 caracteres';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!field.value.trim()) {
          isValid = false;
          errorMessage = 'Por favor ingresá tu email';
        } else if (!emailRegex.test(field.value)) {
          isValid = false;
          errorMessage = 'Por favor ingresá un email válido';
        }
        break;

      case 'company':
        if (!field.value.trim()) {
          isValid = false;
          errorMessage = 'Por favor ingresá el nombre de tu empresa';
        }
        break;

      case 'industry':
        if (!field.value) {
          isValid = false;
          errorMessage = 'Por favor seleccioná tu rubro';
        }
        break;

      case 'useCase':
        if (!field.value) {
          isValid = false;
          errorMessage = 'Por favor seleccioná un caso de uso';
        }
        break;
    }

    if (!isValid) {
      field.closest('.form-group').classList.add('has-error');
      error.textContent = errorMessage;
    }

    return isValid;
  }

  function clearFieldError(fieldName) {
    const field = fields[fieldName];
    const error = errors[fieldName];

    if (field && error) {
      field.closest('.form-group').classList.remove('has-error');
      error.textContent = '';
    }
  }

  function validateForm() {
    let isValid = true;

    // Validar campos requeridos
    ['fullName', 'email', 'company', 'industry', 'useCase'].forEach(fieldName => {
      if (!validateField(fieldName)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // =========================================
  // Manejo del Submit
  // =========================================
  async function handleSubmit(e) {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      showStatus('Por favor completá todos los campos requeridos', 'error');
      return;
    }

    // Preparar datos
    const formData = {
      fullName: fields.fullName.value.trim(),
      email: fields.email.value.trim(),
      company: fields.company.value.trim(),
      industry: fields.industry.value,
      phone: fields.phone.value.trim() || 'No proporcionado',
      useCase: fields.useCase.value,
      timestamp: new Date().toISOString(),
      source: 'servicios.html - PDF Download',
      userAgent: navigator.userAgent
    };

    // Mostrar loading
    setLoading(true);
    hideStatus();

    // Mostrar mensaje de éxito inmediatamente
    showStatus('¡Perfecto! Tu descarga comenzará en breve...', 'success');

    // Descargar el PDF inmediatamente (no esperar al webhook)
    setTimeout(() => {
      downloadPDF();

      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        closeModal();
      }, 1500);
    }, 800);

    // Enviar datos a n8n en segundo plano (sin bloquear la descarga)
    // TODO: Descomentar cuando el webhook de n8n esté configurado
    try {
      // Verificar si el webhook está configurado (no es la URL de ejemplo)
      if (CONFIG.webhookURL && !CONFIG.webhookURL.includes('tu-n8n-instance')) {
        await sendToWebhook(formData);
        console.log('✅ Datos enviados exitosamente a n8n');
      } else {
        console.log('ℹ️ Webhook de n8n no configurado. Los datos NO se enviaron.');
        console.log('📋 Datos del formulario:', formData);
      }
    } catch (error) {
      // Si falla el webhook, no importa - el usuario ya tiene su PDF
      console.warn('⚠️ No se pudieron enviar los datos a n8n, pero el PDF se descargó correctamente:', error);
    }
  }

  // =========================================
  // Envío a n8n Webhook
  // =========================================
  async function sendToWebhook(data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.requestTimeout);

    try {
      const response = await fetch(CONFIG.webhookURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result
      };

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('La solicitud tardó demasiado tiempo');
      }

      throw error;
    }
  }

  // =========================================
  // Descarga del PDF
  // =========================================
  function downloadPDF() {
    // Crear un enlace temporal y hacer click
    const link = document.createElement('a');
    link.href = CONFIG.pdfURL;
    link.download = 'Roadmap_Cumbre_IA_Completo.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // =========================================
  // UI Helpers
  // =========================================
  function setLoading(isLoading) {
    if (!submitBtn) return;

    if (isLoading) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      const loader = submitBtn.querySelector('.btn-loader');
      if (loader) loader.style.display = 'block';
    } else {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      const loader = submitBtn.querySelector('.btn-loader');
      if (loader) loader.style.display = 'none';
    }
  }

  function showStatus(message, type) {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = 'form-status ' + type;
    formStatus.style.display = 'block';
  }

  function hideStatus() {
    if (!formStatus) return;

    formStatus.style.display = 'none';
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  }

  function resetForm() {
    if (!form) return;

    form.reset();
    hideStatus();
    setLoading(false);

    // Limpiar errores
    Object.keys(fields).forEach(key => {
      clearFieldError(key);
    });
  }

  // =========================================
  // Inicializar cuando el DOM esté listo
  // =========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // =========================================
  // Exponer función para testing y configuración
  // =========================================
  window.PDFModalController = {
    open: openModal,
    close: closeModal,
    setWebhookURL: (url) => { CONFIG.webhookURL = url; },
    setPDFURL: (url) => { CONFIG.pdfURL = url; }
  };

})();
