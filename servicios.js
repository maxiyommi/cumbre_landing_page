/**
 * Servicios Page - Interactive Components
 * Maneja la funcionalidad de la página de casos de uso
 */

class ServiciosPage {
  constructor() {
    this.currentCaso = 1;
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
        this.switchCaso(casoNumber, tabs, contents);
      });
    });
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

// Función para tracking de analytics (opcional)
function trackCasoView(casoNumber) {
  // Si tienes Google Analytics o similar, puedes trackear aquí
  if (typeof gtag !== "undefined") {
    gtag("event", "view_caso", {
      event_category: "Servicios",
      event_label: `Caso ${casoNumber}`,
    });
  }

  // También puedes enviar a tu propio sistema de analytics
  console.log(`Usuario viendo Caso ${casoNumber}`);
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

// Función para copiar al portapapeles (útil para compartir casos)
function setupShareButtons() {
  // Agregar botones de compartir si es necesario
  const casos = document.querySelectorAll(".caso-card");

  casos.forEach((caso, index) => {
    const casoNumber = index + 1;
    const shareUrl = `${window.location.origin}${window.location.pathname}#caso-${casoNumber}`;

    // Aquí podrías agregar botones de compartir si los necesitas
    // Por ejemplo, agregar un botón "Compartir este caso"
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

  // Log para debugging
  console.log("Servicios Page initialized successfully");
});

// Manejo de resize para ajustar elementos responsive
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    console.log("Window resized - adjusting layout");
  }, 250);
});

// Exportar para uso global si es necesario
if (typeof module !== "undefined" && module.exports) {
  module.exports = ServiciosPage;
}
