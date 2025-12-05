// Enhanced AI Agency Landing Page Script with Video Optimization and Smooth Transitions
class AILandingPage {
    constructor() {
        this.initializeComponents();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.initializeAnimations();
        this.handleNavbarVisibility();
        this.handleScrollIndicator();
        this.optimizeBackgroundVideo(); // Nueva función para optimizar video
        this.initSmoothTransitions(); // Nueva función para transiciones suaves
    }

    initializeComponents() {
        this.header = document.querySelector('.header');
        this.navLinks = document.querySelectorAll('.header__nav-link');
        this.sections = document.querySelectorAll('.section');
        // Excluir las cards del timeline de las animaciones automáticas del observer
        this.animatedElements = document.querySelectorAll('.glass-card:not(.features__timeline .glass-card), .feature-card, .service-card');
        this.backgroundVideo = document.getElementById('bg-video'); // Referencia al video
        this.heroSection = document.getElementById('inicio');
        this.isParallaxEnabled = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    }

    // Nueva función para optimizar el video de fondo
    optimizeBackgroundVideo() {
        if (!this.backgroundVideo) return;

        // Configuraciones para reproducción suave
        const optimizeVideo = () => {
            // Asegurar que el video esté completamente cargado antes de reproducir
            this.backgroundVideo.load();
            
            // Configurar propiedades para mejor rendimiento
            this.backgroundVideo.defaultMuted = true;
            this.backgroundVideo.muted = true;
            this.backgroundVideo.playsInline = true;
            
            // Reducir calidad de renderizado para mejor performance en móviles
            if (window.innerWidth <= 768) {
                this.backgroundVideo.style.filter = 'brightness(0.6) contrast(1.1) saturate(1.1) blur(2px)';
            }

            // Forzar reproducción después de que esté listo
            const playVideo = () => {
                const playPromise = this.backgroundVideo.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            this.backgroundVideo.setAttribute('data-loaded', 'true');
                        })
                        .catch(() => {
                            // Fallback: intentar reproducir en la primera interacción del usuario
                            this.setupVideoFallback();
                        });
                }
            };

            // Reproducir cuando esté listo
            if (this.backgroundVideo.readyState >= 3) {
                playVideo();
            } else {
                this.backgroundVideo.addEventListener('canplaythrough', playVideo, { once: true });
            }
        };

        // Optimizar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', optimizeVideo);
        } else {
            optimizeVideo();
        }

        // Manejar eventos para reproducción continua con fade in/out
        this.setupVideoFadeLoop();

        // Prevenir pausas no deseadas
        this.backgroundVideo.addEventListener('pause', () => {
            if (!document.hidden) {
                this.backgroundVideo.play();
            }
        });

        // Reanudar cuando la página vuelva a estar visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.backgroundVideo.paused) {
                this.backgroundVideo.play();
            }
        });

        // Optimización para scroll suave
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            // Pausar temporalmente durante scroll intenso para mejor performance
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (this.backgroundVideo.paused && !document.hidden) {
                    this.backgroundVideo.play();
                }
            }, 100);
        });
    }

    // Fallback para dispositivos que bloquean autoplay
    setupVideoFallback() {
        const playOnInteraction = () => {
            this.backgroundVideo.play();
            // Remover listeners después del primer play exitoso
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
            document.removeEventListener('scroll', playOnInteraction);
        };

        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true });
        document.addEventListener('scroll', playOnInteraction, { once: true });
    }

    // Configurar fade in/out para loop suave del video con crossfade
    setupVideoFadeLoop() {
        if (!this.backgroundVideo) return;

        const fadeDuration = 400; // 0.4 segundos de fade (transición rápida)
        const crossfadeThreshold = 0.5; // Reiniciar cuando opacity llegue a 0.5 (mitad del fade)
        let fadeInterval;
        let isFading = false;
        let hasTriggeredFade = false;

        // Función para hacer crossfade (fade out + reinicio + fade in simultáneos)
        const startCrossfade = () => {
            if (isFading) return; // Prevenir múltiples fades simultáneos
            isFading = true;

            let opacity = 1;
            const fadeStep = 0.05;
            const stepTime = fadeDuration / (1 / fadeStep);
            let hasRestarted = false;

            if (fadeInterval) clearInterval(fadeInterval);

            fadeInterval = setInterval(() => {
                opacity -= fadeStep;

                // Cuando llegamos al threshold del crossfade, reiniciar el video
                if (!hasRestarted && opacity <= crossfadeThreshold) {
                    hasRestarted = true;
                    this.backgroundVideo.currentTime = 0;

                    // Iniciar fade in inmediatamente
                    let newOpacity = crossfadeThreshold;
                    if (fadeInterval) clearInterval(fadeInterval);

                    fadeInterval = setInterval(() => {
                        newOpacity += fadeStep;
                        if (newOpacity >= 1) {
                            newOpacity = 1;
                            clearInterval(fadeInterval);
                            this.backgroundVideo.style.opacity = '1';
                            isFading = false; // Permitir el siguiente fade
                            hasTriggeredFade = false; // Reset para el próximo ciclo
                        } else {
                            this.backgroundVideo.style.opacity = newOpacity.toString();
                        }
                    }, stepTime);
                } else if (!hasRestarted) {
                    this.backgroundVideo.style.opacity = opacity.toString();
                }
            }, stepTime);
        };

        // Monitorear el progreso del video para iniciar el crossfade antes de que termine
        this.backgroundVideo.addEventListener('timeupdate', () => {
            if (isFading || hasTriggeredFade) return; // No verificar si ya está haciendo fade

            const duration = this.backgroundVideo.duration;
            const currentTime = this.backgroundVideo.currentTime;
            const timeRemaining = duration - currentTime;

            // Iniciar crossfade 1 segundo antes de que termine
            if (timeRemaining <= (fadeDuration / 1000) && timeRemaining > 0) {
                hasTriggeredFade = true;
                startCrossfade();
            }
        });

        // Asegurar que el video se reinicie si llega al final sin fade
        this.backgroundVideo.addEventListener('ended', () => {
            if (!isFading) {
                this.backgroundVideo.currentTime = 0;
                this.backgroundVideo.style.opacity = '1';
                this.backgroundVideo.play();
                hasTriggeredFade = false;
            }
        });

        // Establecer opacidad inicial
        this.backgroundVideo.style.opacity = '1';
        this.backgroundVideo.style.transition = 'none'; // Desactivar transiciones CSS para control manual
    }

    // Inicializar transiciones suaves y efectos parallax
    initSmoothTransitions() {
        if (this.isParallaxEnabled) {
            this.initParallaxEffects();
        }
        
        this.initSectionTransitions();
    }

    // Efectos parallax para el video de fondo
    initParallaxEffects() {
        let ticking = false;
        
        const updateParallax = () => {
            if (!this.backgroundVideo || !this.heroSection) return;
            
            const scrolled = window.pageYOffset;
            const heroHeight = this.heroSection.offsetHeight;
            const heroRect = this.heroSection.getBoundingClientRect();
            
            // Solo aplicar parallax mientras el hero esté visible
            if (heroRect.bottom > 0 && scrolled < heroHeight) {
                // Parallax muy sutil para el video (movimiento lento hacia arriba)
                const parallaxSpeed = 0.3;
                const yPos = scrolled * parallaxSpeed;
                
                // Aplicar transformación suave
                this.backgroundVideo.style.transform = `translate(-50%, calc(-50% + ${yPos}px))`;
                
                // Fade out gradual del video mientras se hace scroll
                const fadeStart = heroHeight * 0.6;
                const fadeEnd = heroHeight * 0.9;
                
                if (scrolled > fadeStart) {
                    const fadeProgress = Math.min((scrolled - fadeStart) / (fadeEnd - fadeStart), 1);
                    const opacity = 1 - (fadeProgress * 0.4); // Reducir opacidad hasta 0.6
                    this.backgroundVideo.style.opacity = opacity;
                } else {
                    this.backgroundVideo.style.opacity = 1;
                }
            }
            
            ticking = false;
        };

        const requestParallaxUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        // Throttled scroll listener para performance
        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
        
        // Actualizar en resize
        window.addEventListener('resize', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // Observar transiciones entre secciones
    initSectionTransitions() {
        const sections = document.querySelectorAll('.section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Agregar clase para animaciones CSS cuando la sección es visible
                    entry.target.classList.add('section-visible');
                    
                    // Efectos específicos por sección
                    this.handleSectionTransition(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Manejar animaciones específicas por sección
    handleSectionTransition(section) {
        const sectionId = section.id;
        
        switch(sectionId) {
            case 'tu_cumbre':
                // Animar el robot cuando la sección features entra
                this.animateRobotOnEntry(section);
                break;
                
            case 'servicios':
                // Efecto de entrada para las cards de servicios
                this.animateServiceCards(section);
                break;
                
            case 'faq':
                // Animación sutil para FAQ
                this.animateFAQEntry(section);
                break;
                
            case 'contacto':
                // Efectos para la sección de contacto
                this.animateContactSection(section);
                break;
        }
    }

    animateRobotOnEntry(section) {
        const robot = section.querySelector('.robot-anim');
        if (robot && !robot.classList.contains('animated')) {
            robot.classList.add('animated');
            robot.style.animationDelay = '0.3s';
        }
    }

    animateServiceCards(section) {
        const cards = section.querySelectorAll('.service-card');
        cards.forEach((card, index) => {
            if (!card.classList.contains('animated')) {
                card.classList.add('animated');
                card.style.animationDelay = `${index * 0.2}s`;
                card.style.animation = 'slideInUp 0.6s ease-out forwards';
            }
        });
    }

    animateFAQEntry(section) {
        const faqItems = section.querySelectorAll('.faq__item');
        faqItems.forEach((item, index) => {
            if (!item.classList.contains('animated')) {
                item.classList.add('animated');
                item.style.animationDelay = `${index * 0.1}s`;
                item.style.animation = 'fadeInUp 0.5s ease-out forwards';
            }
        });
    }

    animateContactSection(section) {
        const contactCard = section.querySelector('.contact__card');
        if (contactCard && !contactCard.classList.contains('animated')) {
            contactCard.classList.add('animated');
            contactCard.style.animation = 'scaleIn 0.6s ease-out forwards';
        }
    }

    // Método para optimizar performance en dispositivos móviles
    optimizeForMobile() {
        if (window.innerWidth <= 768) {
            // Reducir efectos parallax en móviles para mejor performance
            this.isParallaxEnabled = false;
            
            // Simplificar transiciones
            const video = this.backgroundVideo;
            if (video) {
                video.style.transform = 'translate(-50%, -50%)';
                video.style.opacity = '1';
            }
        }
    }

    setupEventListeners() {
        // Scroll event for header
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
            this.handleNavbarVisibility();
            this.handleScrollIndicator();
            this.updateActiveNavLink(); // Actualizar nav activo en cada scroll
        }, 16));
        
        // Navigation clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardNav.bind(this));

        // Mobile menu toggle
        const menuToggle = document.querySelector('.header__menu-toggle');
        const nav = document.querySelector('.header__nav');
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                nav.classList.toggle('open');
                menuToggle.classList.toggle('open');
                const isOpen = nav.classList.contains('open');
                menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
                menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

                // Bloquear/desbloquear scroll del body
                if (isOpen) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            // Cerrar menú al hacer click en un link
            nav.querySelectorAll('.header__nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('open');
                    menuToggle.classList.remove('open');
                    menuToggle.setAttribute('aria-label', 'Abrir menú');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });

            // Prevenir que clicks dentro del nav cierren el menú
            nav.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Cerrar menú al hacer click fuera de él
            document.addEventListener('click', (e) => {
                if (nav.classList.contains('open') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
                    nav.classList.remove('open');
                    menuToggle.classList.remove('open');
                    menuToggle.setAttribute('aria-label', 'Abrir menú');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });

            // Cerrar menú con tecla Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nav.classList.contains('open')) {
                    nav.classList.remove('open');
                    menuToggle.classList.remove('open');
                    menuToggle.setAttribute('aria-label', 'Abrir menú');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.focus();
                    document.body.style.overflow = '';
                }
            });
        }


        // Logo scroll to top functionality
        const logo = document.querySelector('.header__logo');
        if (logo) {
            logo.addEventListener('click', () => {
                window.scrollTo({top: 0, behavior: 'smooth'});
            });
        }

        // Footer logo scroll to top functionality
        const footerLogo = document.querySelector('.footer__logo-container');
        if (footerLogo) {
            footerLogo.addEventListener('click', () => {
                window.scrollTo({top: 0, behavior: 'smooth'});
            });
        }

        // Resize event para optimizaciones
        window.addEventListener('resize', () => {
            this.optimizeForMobile();
        });
    }

    handleScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator--minimal');
        const hero = document.getElementById('inicio');
        if (!indicator || !hero) return;

        // Setup inicial: esperar a que termine la animación CSS
        if (!this.scrollIndicatorReady) {
            indicator.addEventListener('animationend', () => {
                // Remover la animación CSS y preparar para control JS
                indicator.style.animation = 'none';
                indicator.style.transition = 'opacity 0.6s ease-out';
                this.scrollIndicatorReady = true;

                // Forzar opacidad 1 después de la animación
                indicator.style.opacity = '1';
            }, { once: true });
            return;
        }

        const heroRect = hero.getBoundingClientRect();
        const heroBottomPosition = heroRect.bottom;
        const viewportHeight = window.innerHeight;

        // El indicator debe:
        // - Mantenerse visible mientras está en la parte superior
        // - Empezar a desvanecerse cuando el bottom del hero esté a 80% del viewport
        // - Desaparecer completamente a 50% del viewport (fade out rápido)

        if (heroBottomPosition > viewportHeight * 0.8) {
            // Hero todavía en la parte superior, mantener indicator visible
            indicator.style.opacity = '1';
        } else if (heroBottomPosition > viewportHeight * 0.5) {
            // Fade out rápido en la primera mitad del scroll
            const fadeStart = viewportHeight * 0.8;
            const fadeEnd = viewportHeight * 0.5;
            const fadeRange = fadeStart - fadeEnd;
            const fadeProgress = (heroBottomPosition - fadeEnd) / fadeRange;
            indicator.style.opacity = Math.max(0, fadeProgress).toString();
        } else {
            // Ocultar completamente
            indicator.style.opacity = '0';
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        // Navigation observer - ajustado para detectar mejor las secciones
        this.navObserver = new IntersectionObserver(this.handleNavObserver.bind(this), {
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
            rootMargin: '0px 0px -40% 0px'
        });

        this.sections.forEach(section => {
            this.navObserver.observe(section);
        });

        // Animation observer
        this.animationObserver = new IntersectionObserver(this.handleAnimationObserver.bind(this), observerOptions);
        
        this.animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            this.animationObserver.observe(el);
        });
    }

    initializeAnimations() {
        // Animaciones iniciales si son necesarias
    }

    handleScroll() {
        const scrolled = window.pageYOffset > 100;
        this.header.classList.toggle('scrolled', scrolled);
    }

    handleNavClick(e) {
        const targetId = e.target.getAttribute('href');

        // Solo prevenir el comportamiento por defecto si es un enlace interno (#)
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
        // Si no empieza con #, dejarlo navegar normalmente (servicios.html, etc.)
    }

    updateActiveNavLink() {
        // Obtener todas las secciones actualmente visibles
        const visibleSections = [];
        const headerOffset = this.header ? this.header.offsetHeight : 0;

        // Recorrer todas las secciones para ver cuáles están visibles
        this.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calcular qué porcentaje de la sección está visible
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, headerOffset);
            const visibilityRatio = visibleHeight / windowHeight;

            if (visibilityRatio > 0) { // Cualquier parte visible
                visibleSections.push({
                    section: section,
                    ratio: visibilityRatio,
                    distanceFromTop: Math.max(0, rect.top - headerOffset)
                });
            }
        });

        // Encontrar la sección más relevante (la que está más cerca del top y es más visible)
        if (visibleSections.length > 0) {
            // Ordenar por distancia desde el top (priorizar la que está más arriba)
            visibleSections.sort((a, b) => {
                return a.distanceFromTop - b.distanceFromTop;
            });

            const activeSection = visibleSections[0].section;
            const targetId = `#${activeSection.id}`;
            const sectionId = activeSection.id;

            // Remover active de todos los links y botones
            this.navLinks.forEach(link => {
                link.classList.remove('active');
            });

            const solucionesToggle = document.querySelector('.header__nav-contact-toggle[aria-label="Abrir menú de soluciones"]');
            if (solucionesToggle) {
                solucionesToggle.classList.remove('active');
            }

            // Activar el link correspondiente
            this.navLinks.forEach(link => {
                if (link.getAttribute('href') === targetId) {
                    link.classList.add('active');
                }
            });

            // Manejar caso especial: botón "Soluciones" (dropdown en desktop)
            if (sectionId === 'soluciones') {
                if (solucionesToggle) {
                    solucionesToggle.classList.add('active');
                }
            }
        }
    }

    handleNavObserver(entries) {
        // Delegar a updateActiveNavLink para mantener consistencia
        this.updateActiveNavLink();
    }

    handleAnimationObserver(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.animationObserver.unobserve(entry.target);
            }
        });
    }

    handleNavbarVisibility() {
        // Navbar is always visible - no special handling needed
    }

    handleKeyboardNav(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
        if (e.key === 'Escape') {
            document.activeElement.blur();
        }
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// CSS adicional para las animaciones mediante JavaScript
const additionalStyles = `
<style>
/* Animaciones para transiciones suaves */
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Clases para secciones visibles */
.section-visible {
    animation: sectionFadeIn 0.8s ease-out forwards;
}

@keyframes sectionFadeIn {
    from {
        opacity: 0.8;
    }
    to {
        opacity: 1;
    }
}

/* Optimización para dispositivos con movimiento reducido */
@media (prefers-reduced-motion: reduce) {
    .section-visible,
    .animated {
        animation: none !important;
        transform: none !important;
        opacity: 1 !important;
    }
}

/* Transiciones más suaves para elementos específicos */
.hero__background-video video {
    transition: opacity 0.3s ease-out, transform 0.1s ease-out;
}

.robot-anim.animated {
    animation-name: robot-float, robotEntrance;
    animation-duration: 3.2s, 0.8s;
    animation-timing-function: ease-in-out, ease-out;
    animation-iteration-count: infinite, 1;
    animation-direction: alternate, normal;
}

@keyframes robotEntrance {
    from {
        opacity: 0;
        transform: translateY(50px) scale(0.8);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Estilos para video cargado */
.hero__background-video video:not([data-loaded]) {
    opacity: 0;
    transition: opacity 0.5s ease-in;
}

.hero__background-video video[data-loaded] {
    opacity: 1;
}

/* Focus states para accesibilidad */
.keyboard-nav *:focus {
    outline: 2px solid #00d4ff !important;
    outline-offset: 2px !important;
}
</style>
`;

// Inyectar estilos adicionales
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Initialize the landing page enhancements
let aiLandingPage;
document.addEventListener('DOMContentLoaded', () => {
    aiLandingPage = new AILandingPage();
    window.aiLandingPage = aiLandingPage; // Hacer accesible globalmente

    // Initialize hero stats counter animation
    initHeroStatsCounter();
});

// Hero Stats Counter Animation
function initHeroStatsCounter() {
    const stats = document.querySelectorAll('.hero__stat-value[data-count]');
    if (!stats.length) return;

    const animateCounter = (el, target) => {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

            el.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(update);
    };

    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

// FAQ toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq__question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.closest('.faq__item');
            faqItem.classList.toggle('open');
        });
    });
});

// Robot hover animations
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.robot-anim').forEach(function(robotImg) {
        robotImg.addEventListener('mouseenter', function() {
            const shadow = robotImg.parentElement.querySelector('.robot-shadow');
            if (shadow) shadow.classList.add('robot-shadow-hover');
        });
        robotImg.addEventListener('mouseleave', function() {
            const shadow = robotImg.parentElement.querySelector('.robot-shadow');
            if (shadow) shadow.classList.remove('robot-shadow-hover');
        });
    });
});

// Optimización global en resize
window.addEventListener('resize', () => {
    if (window.aiLandingPage) {
        window.aiLandingPage.optimizeForMobile();
    }
});

// Manejo de errores global para el video
window.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'VIDEO') {
        setTimeout(() => {
            if (window.aiLandingPage && window.aiLandingPage.backgroundVideo) {
                window.aiLandingPage.backgroundVideo.load();
            }
        }, 1000);
    }
}, true);

// Soluciones - "Conocer más" buttons functionality
document.addEventListener('DOMContentLoaded', () => {
    const solucionButtons = document.querySelectorAll('.solucion-card__btn');

    solucionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const solucionName = button.getAttribute('data-solucion');

            // Solo prevenir el comportamiento por defecto si tiene data-solucion
            // (para soluciones que aún no tienen página dedicada)
            if (solucionName) {
                e.preventDefault();
                // Crear notificación estilo toast
                showProximamenteNotification(solucionName);
            }
            // Si no tiene data-solucion, dejar que el link funcione normalmente
        });
    });

    // Inicializar carruseles de soluciones
    initSolucionCarousels();
});

// Función para inicializar carruseles automáticos
function initSolucionCarousels() {
    const carousels = document.querySelectorAll('.solucion-carousel');

    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.solucion-carousel__slide');
        const indicators = carousel.querySelectorAll('.indicator');
        let currentSlide = 0;
        let autoplayInterval;

        // Función para cambiar de slide
        const goToSlide = (slideIndex) => {
            // Remover clase active de todos
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));

            // Agregar clase active al slide e indicator actual
            slides[slideIndex].classList.add('active');
            indicators[slideIndex].classList.add('active');

            currentSlide = slideIndex;
        };

        // Función para ir al siguiente slide
        const nextSlide = () => {
            const next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        };

        // Event listeners para los indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
                // Reiniciar autoplay al hacer click manual
                clearInterval(autoplayInterval);
                autoplayInterval = setInterval(nextSlide, 4000);
            });
        });

        // Pausar autoplay al hacer hover sobre la card
        const card = carousel.closest('.solucion-card');
        if (card) {
            card.addEventListener('mouseenter', () => {
                clearInterval(autoplayInterval);
            });

            card.addEventListener('mouseleave', () => {
                autoplayInterval = setInterval(nextSlide, 4000);
            });
        }

        // Iniciar autoplay (cambiar cada 4 segundos)
        autoplayInterval = setInterval(nextSlide, 4000);

        // Limpiar interval cuando la página se descarga
        window.addEventListener('beforeunload', () => {
            clearInterval(autoplayInterval);
        });
    });
}

// Función para mostrar notificación "Proximamente" con estilo AI
function showProximamenteNotification(solucionName) {
    // Remover notificación existente si hay alguna
    const existingNotification = document.querySelector('.ai-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'ai-notification';
    notification.innerHTML = `
        <div class="ai-notification__icon">🚀</div>
        <div class="ai-notification__content">
            <div class="ai-notification__title">Próximamente</div>
            <div class="ai-notification__message">Esta solución estará disponible muy pronto</div>
        </div>
        <button class="ai-notification__close" aria-label="Cerrar notificación">&times;</button>
    `;

    // Agregar estilos inline para la notificación
    const notificationStyles = `
        <style>
        .ai-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(102, 126, 234, 0.1) 100%);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 1rem;
            padding: 1.25rem;
            min-width: 320px;
            max-width: 400px;
            box-shadow: 0 16px 48px rgba(0, 212, 255, 0.2), 0 8px 24px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            gap: 1rem;
            align-items: flex-start;
            animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1), fadeOut 0.5s 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .ai-notification__icon {
            font-size: 2rem;
            flex-shrink: 0;
            animation: pulse 1.5s ease-in-out infinite;
        }

        .ai-notification__content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .ai-notification__title {
            color: #00d4ff;
            font-weight: 700;
            font-size: 1.1rem;
            letter-spacing: -0.3px;
        }

        .ai-notification__message {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.9rem;
            line-height: 1.4;
        }

        .ai-notification__close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s ease;
            flex-shrink: 0;
        }

        .ai-notification__close:hover {
            color: #00d4ff;
        }

        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }

        @media (max-width: 768px) {
            .ai-notification {
                top: 80px;
                right: 10px;
                left: 10px;
                min-width: auto;
                max-width: none;
            }

            @keyframes slideInRight {
                from {
                    transform: translateY(-100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @keyframes fadeOut {
                to {
                    transform: translateY(-100px);
                    opacity: 0;
                }
            }
        }
        </style>
    `;

    // Inyectar estilos si no existen
    if (!document.querySelector('#ai-notification-styles')) {
        const styleElement = document.createElement('div');
        styleElement.id = 'ai-notification-styles';
        styleElement.innerHTML = notificationStyles;
        document.head.appendChild(styleElement);
    }

    // Agregar notificación al DOM
    document.body.appendChild(notification);

    // Agregar event listener para cerrar
    const closeButton = notification.querySelector('.ai-notification__close');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-remover después de 3 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

/* ============================================
   SMART BANNER - PDF CASOS DE USO
   ============================================ */

class SmartBannerController {
    constructor() {
        this.banner = document.getElementById('smartBanner');
        this.tab = document.getElementById('smartBannerTab');
        this.autoHideDelay = 5000; // 5 segundos
        this.autoHideTimer = null;
        this.scrollCount = 0;
        this.scrollThreshold = 15; // Ocultar al 3er scroll
        this.lastScrollY = 0;
        this.tuCumbreSection = document.getElementById('tu_cumbre');

        if (this.banner && this.tab) {
            this.init();
        }
    }

    init() {
        // NO mostrar el tab al inicio - solo después de la sección "Tu Cumbre"
        // this.tab.classList.add('visible');

        // Click en tab para mostrar banner
        this.tab.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que se propague el click
            this.showBanner();
        });

        // Controlar visibilidad del tab según scroll y cerrar banner al hacer scroll
        window.addEventListener('scroll', () => {
            // Mostrar/ocultar tab basado en sección "Tu Cumbre"
            if (this.tuCumbreSection && !this.banner.classList.contains('visible')) {
                const tuCumbreTop = this.tuCumbreSection.offsetTop;
                const scrollTop = window.pageYOffset;

                if (scrollTop >= tuCumbreTop - 100) {
                    this.tab.classList.add('visible');
                } else {
                    this.tab.classList.remove('visible');
                }
            }

            // Cerrar banner al hacer scroll
            if (this.banner.classList.contains('visible')) {
                this.hideBanner();
            }
        }, { passive: true });

        // Cerrar banner al hacer clic fuera de él
        document.addEventListener('click', (e) => {
            if (this.banner.classList.contains('visible')) {
                // Verificar si el clic fue fuera del banner
                if (!this.banner.contains(e.target) && !this.tab.contains(e.target)) {
                    this.hideBanner();
                }
            }
        });
    }

    showBanner() {
        this.banner.classList.add('visible');
        this.tab.classList.remove('visible');
        this.scrollCount = 0; // Resetear contador de scrolls
        this.lastScrollY = window.scrollY; // Actualizar posición inicial
        this.startAutoHideTimer();
    }

    hideBanner() {
        this.clearAutoHideTimer();
        this.banner.classList.remove('visible');
        this.tab.classList.add('visible');
        this.scrollCount = 0; // Resetear contador
    }

    startAutoHideTimer() {
        this.clearAutoHideTimer();
        this.autoHideTimer = setTimeout(() => {
            this.hideBanner();
        }, this.autoHideDelay);
    }

    clearAutoHideTimer() {
        if (this.autoHideTimer) {
            clearTimeout(this.autoHideTimer);
            this.autoHideTimer = null;
        }
    }
}

// Inicializar Smart Banner
document.addEventListener('DOMContentLoaded', () => {
    new SmartBannerController();
});

// Scroll Progress Indicator
function setupScrollProgress() {
  const scrollProgress = document.querySelector(".scroll-progress");
  const progressFill = document.querySelector(".scroll-progress__fill");
  const progressCurrent = document.querySelector(".scroll-progress__current");
  const stations = document.querySelectorAll(".scroll-progress__station");
  const scrollIndicator = document.querySelector(".scroll-indicator");

  if (!scrollProgress || !progressFill || !progressCurrent) return;

  // Map sections by their IDs
  const sectionMap = {
    inicio: document.getElementById("inicio"),
    tu_cumbre: document.getElementById("tu_cumbre"),
    servicios: document.getElementById("servicios"),
    soluciones: document.getElementById("soluciones"),
    faq: document.getElementById("faq"),
    contacto: document.getElementById("contacto")
  };

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
// Only run if we're on index.html (not on facturascan or synthetic-audience)
if (!window.location.pathname.includes('facturascan') && !window.location.pathname.includes('synthetic-audience')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupScrollProgress);
  } else {
    setupScrollProgress();
  }
}