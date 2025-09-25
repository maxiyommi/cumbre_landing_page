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
        this.animatedElements = document.querySelectorAll('.glass-card, .feature-card, .service-card');
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
                            console.log('Video background playing smoothly');
                            this.backgroundVideo.setAttribute('data-loaded', 'true');
                        })
                        .catch(error => {
                            console.log('Video autoplay prevented:', error);
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

        // Manejar eventos para reproducción continua
        this.backgroundVideo.addEventListener('ended', () => {
            // Reiniciar inmediatamente para evitar saltos
            this.backgroundVideo.currentTime = 0;
            this.backgroundVideo.play();
        });

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
                menuToggle.setAttribute('aria-label', nav.classList.contains('open') ? 'Cerrar menú' : 'Abrir menú');
            });
            
            // Cerrar menú al hacer click en un link
            nav.querySelectorAll('.header__nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('open');
                    menuToggle.setAttribute('aria-label', 'Abrir menú');
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
                    menuToggle.setAttribute('aria-label', 'Abrir menú');
                }
            });
            
            // Cerrar menú con tecla Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nav.classList.contains('open')) {
                    nav.classList.remove('open');
                    menuToggle.setAttribute('aria-label', 'Abrir menú');
                    menuToggle.focus();
                }
            });
        }

        // Contact dropdown (mobile/click)
        const contactToggle = document.querySelector('.header__nav-contact-toggle');
        const contactDropdown = document.querySelector('.header__nav-contact-dropdown');
        if (contactToggle && contactDropdown) {
            // Desktop: handled by CSS hover
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
                if (
                    window.innerWidth <= 700 &&
                    contactDropdown.style.display === 'block' &&
                    !contactDropdown.contains(e.target) &&
                    !contactToggle.contains(e.target)
                ) {
                    contactDropdown.style.display = 'none';
                    contactToggle.setAttribute('aria-expanded', 'false');
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
        const indicator = document.querySelector('.scroll-indicator');
        const hero = document.getElementById('inicio');
        if (!indicator || !hero) return;
        
        const scrollY = window.scrollY || window.pageYOffset;
        const heroRect = hero.getBoundingClientRect();
        
        const fadeStart = 50;
        const fadeEnd = 300;
        
        let opacity = 0.7;
        
        if (scrollY >= fadeStart) {
            const fadeRange = fadeEnd - fadeStart;
            const fadeProgress = Math.min((scrollY - fadeStart) / fadeRange, 1);
            opacity = 0.7 * (1 - fadeProgress);
        }
        
        indicator.style.opacity = opacity;
        
        if (heroRect.bottom < 0) {
            indicator.style.opacity = '0';
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        // Navigation observer
        this.navObserver = new IntersectionObserver(this.handleNavObserver.bind(this), {
            threshold: 0.5,
            rootMargin: '0px 0px -50% 0px'
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
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
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

    handleNavObserver(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = `#${entry.target.id}`;
                
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === targetId) {
                        link.classList.add('active');
                    }
                });
            }
        });
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
        const nav = document.querySelector('.header__nav');
        const inicioSection = document.getElementById('inicio');
        
        if (!nav || !inicioSection) return;
        
        const inicioRect = inicioSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const inInicioSection = inicioRect.bottom > windowHeight * 0.2;
        
        if (inInicioSection) {
            nav.style.opacity = '0';
            nav.style.pointerEvents = 'none';
        } else {
            nav.style.opacity = '1';
            nav.style.pointerEvents = 'auto';
        }
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
});

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
        console.warn('Video error detected, attempting recovery...');
        setTimeout(() => {
            if (window.aiLandingPage && window.aiLandingPage.backgroundVideo) {
                window.aiLandingPage.backgroundVideo.load();
            }
        }, 1000);
    }
}, true);