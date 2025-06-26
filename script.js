// Enhanced AI Agency Landing Page Script
class AILandingPage {
    constructor() {
        this.initializeComponents();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.initializeAnimations();
        this.handleNavbarVisibility(); // inicializa visibilidad
        this.handleScrollIndicator(); // inicializa estado del indicador
    }

    initializeComponents() {
        this.header = document.querySelector('.header');
        this.navLinks = document.querySelectorAll('.header__nav-link');
        this.sections = document.querySelectorAll('.section');
        this.animatedElements = document.querySelectorAll('.glass-card, .feature-card, .service-card');
        // No bind aquí, los métodos ya son flecha o usan this correctamente
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
                    menuToggle.focus(); // Retornar foco al botón
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
    }

    handleScrollIndicator() {
        // Mostrar en #inicio y desvanecer al hacer scroll
        const indicator = document.querySelector('.scroll-indicator');
        const hero = document.getElementById('inicio');
        if (!indicator || !hero) return;
        
        const scrollY = window.scrollY || window.pageYOffset;
        const heroRect = hero.getBoundingClientRect();
        
        // Calcular opacidad basada en la posición de scroll
        // Visible al 100% al inicio, se desvanece gradualmente
        const fadeStart = 50; // Punto donde empieza a desvanecerse
        const fadeEnd = 300; // Punto donde desaparece completamente
        
        let opacity = 0.7; // Opacidad inicial
        
        if (scrollY >= fadeStart) {
            const fadeRange = fadeEnd - fadeStart;
            const fadeProgress = Math.min((scrollY - fadeStart) / fadeRange, 1);
            opacity = 0.7 * (1 - fadeProgress);
        }
        
        indicator.style.opacity = opacity;
        
        // Ocultar completamente si está fuera del hero
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
        
        // Determinar si estamos en la sección inicio
        // La sección inicio está visible si su parte superior está en el viewport
        // o si aún no hemos scrolleado completamente fuera de ella
        const inInicioSection = inicioRect.bottom > windowHeight * 0.2; // 20% del viewport como margen
        
        if (inInicioSection) {
            // Ocultar navbar cuando estamos en la sección inicio
            nav.style.opacity = '0';
            nav.style.pointerEvents = 'none';
        } else {
            // Mostrar navbar en todas las demás secciones
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

// Initialize the landing page enhancements
new AILandingPage();


// FAQ toggle functionality
document.querySelectorAll('.faq__question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.closest('.faq__item');
        faqItem.classList.toggle('open');
    });
});

// Pausar sombra al pasar mouse sobre el robot
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