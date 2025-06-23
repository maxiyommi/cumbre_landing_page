// Enhanced AI Agency Landing Page Script
class AILandingPage {
    constructor() {
        this.initializeComponents();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupParallax();
        this.initializeAnimations();
        this.handleNavbarVisibility(); // inicializa visibilidad
    }

    initializeComponents() {
        this.header = document.querySelector('.header');
        this.navLinks = document.querySelectorAll('.header__nav-link');
        this.sections = document.querySelectorAll('.section');
        this.contactForm = document.querySelector('.contact__form');
        this.animatedElements = document.querySelectorAll('.glass-card, .feature-card, .service-card');
        // No bind aquí, los métodos ya son flecha o usan this correctamente
    }

    setupEventListeners() {
        // Scroll event for header
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
            this.handleNavbarVisibility();
            this.handleScrollIndicator(); // nuevo
        }, 16));
        
        // Navigation clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Form submission
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }

        // Button interactions
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', this.handleButtonHover.bind(this));
            btn.addEventListener('mouseleave', this.handleButtonLeave.bind(this));
        });

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardNav.bind(this));

        // Resize handling
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 250));

        // Mobile menu toggle
        const menuToggle = document.querySelector('.header__menu-toggle');
        const nav = document.querySelector('.header__nav');
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
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
        }
    }
    handleScrollIndicator() {
        // Solo mostrar en #inicio y solo si no se ha hecho scroll
        const indicator = document.querySelector('.scroll-indicator');
        const hero = document.getElementById('inicio');
        if (!indicator || !hero) return;
        const scrollY = window.scrollY || window.pageYOffset;
        const heroRect = hero.getBoundingClientRect();
        // Solo visible si estamos en la pantalla de inicio (parte visible del hero)
        const inHero = heroRect.top <= 0 && heroRect.bottom > window.innerHeight / 2;
        // Ocultar si se ha hecho scroll (>40px) o no estamos en hero
        if (scrollY > 40 || !inHero) {
            indicator.classList.add('hide');
        } else {
            indicator.classList.remove('hide');
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

    setupParallax() {
        const orbs = document.querySelectorAll('.hero__orb');
        
        window.addEventListener('mousemove', this.throttle((e) => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;

            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.5;
                const xMove = x * speed * 20;
                const yMove = y * speed * 20;
                
                orb.style.transform = `translate(${xMove}px, ${yMove}px)`;
            });
        }, 16));

        // Reset on mouse leave
        document.addEventListener('mouseleave', () => {
            orbs.forEach(orb => {
                orb.style.transform = '';
            });
        });
    }

    initializeAnimations() {
        // Stagger animation for service cards
        this.staggerAnimateElements('.service-card', 100);
        this.staggerAnimateElements('.feature-card', 150);

        // Loading animation
        document.body.style.opacity = '0';
        window.addEventListener('load', () => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        });
        this.handleScrollIndicator(); // inicializa estado del indicador
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

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Enhanced validation
        const validation = this.validateForm(data);
        
        if (validation.isValid) {
            this.submitForm(data, e.target);
        } else {
            this.showValidationErrors(validation.errors);
        }
    }

    validateForm(data) {
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!data.nombre || data.nombre.trim().length < 2) {
            errors.push({ field: 'nombre', message: 'El nombre debe tener al menos 2 caracteres' });
        }
        
        if (!data.email || !emailRegex.test(data.email)) {
            errors.push({ field: 'email', message: 'Ingresa un email válido' });
        }
        
        if (!data.mensaje || data.mensaje.trim().length < 10) {
            errors.push({ field: 'mensaje', message: 'El mensaje debe tener al menos 10 caracteres' });
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    submitForm(data, form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Loading state
        submitBtn.textContent = '🤖 Procesando con IA...';
        submitBtn.disabled = true;
        submitBtn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        
        // Simulate AI processing
        setTimeout(() => {
            submitBtn.textContent = '✅ ¡Proyecto Iniciado!';
            submitBtn.style.background = 'linear-gradient(45deg, #4ade80, #22c55e)';
            
            // Reset form
            form.reset();
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset button
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
            
            console.log('AI Project Initiated:', data);
        }, 2000);
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(45deg, #4ade80, #22c55e);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            ">
                <strong>🎉 ¡Excelente!</strong><br>
                Tu proyecto de IA ha sido iniciado. Te contactaremos pronto.
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 4000);
    }

    showValidationErrors(errors) {
        errors.forEach(error => {
            const field = document.getElementById(error.field);
            if (field) {
                field.style.borderColor = '#ef4444';
                field.style.animation = 'shake 0.5s ease';
                

                
                setTimeout(() => {
                    field.style.borderColor = '';
                    field.style.animation = '';
                }, 2000);
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

    handleButtonHover(e) {
        if (e.target.classList.contains('btn-primary')) {
            e.target.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.4), 0 0 30px rgba(0, 212, 255, 0.3)';
        }
    }

    handleButtonLeave(e) {
        if (e.target.classList.contains('btn-primary')) {
            e.target.style.boxShadow = '';
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

    handleResize() {
        this.setupParallax();
    }

    staggerAnimateElements(selector, delay) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * delay}ms`;
        });
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