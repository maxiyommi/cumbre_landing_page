# Cumbre IA - Landing Page Optimizada

Una landing page moderna y optimizada para Cumbre IA, empresa especializada en soluciones de inteligencia artificial para PyMEs.

## 🚀 Características

- **Diseño Moderno**: Glassmorphism, gradientes y animaciones fluidas
- **Totalmente Responsivo**: Desde 280px hasta 4K (2560px+)
- **Optimizado para Performance**: Lazy loading, preload de recursos críticos
- **Accesible**: Navegación por teclado, ARIA labels, semántica correcta
- **SEO Optimizado**: Meta tags, estructura semántica, Google verification
- **Integración Google Calendar**: Reserva de reuniones desde la landing
- **Animaciones Mejoradas**: Scroll reveal, shimmer y robot flotante

## 📁 Estructura del Proyecto

```
cumbre-ia/
├── index.html             # Archivo principal HTML
├── style.css              # Estilos CSS optimizados
├── script.js              # JavaScript funcional
├── CNAME                  # Configuración de dominio
├── README.md              # Documentación
└── assets/                # Recursos del proyecto
    ├── images/            # Imágenes optimizadas
    │   ├── pitch.svg      # Logo principal
    │   ├── robot.png      # Imagen del robot IA
    │   ├── cumbre.png     # Imagen de fondo del footer
    │   └── ...            # Otras imágenes recientes
    ├── videos/            # Videos de fondo
    │   └── video.mp4      # Video de fondo del hero
    └── fonts/             # Fuentes personalizadas
        └── basetica-light.otf  # Fuente principal
```

## 🛠️ Instalación y Setup

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/cumbre-ia.git
   cd cumbre-ia
   ```

2. **Crear estructura de assets**
   ```bash
   mkdir -p assets/images assets/videos assets/fonts
   ```

3. **Agregar los archivos multimedia**
   - Imágenes requeridas (`assets/images/`): `pitch.svg`, `robot.png`, `cumbre.png`, ...otras imágenes nuevas.
   - Videos requeridos (`assets/videos/`): `video.mp4`
   - Fuentes requeridas (`assets/fonts/`): `basetica-light.otf`

4. **Abrir en navegador**
   ```bash
   # Opción 1: Abrir directamente
   open index.html

   # Opción 2: Servidor local con Python
   python -m http.server 8000

   # Opción 3: Servidor local con Node.js
   npx serve
   ```

5. **Navegar a** `http://localhost:8000`

## 🎨 Personalización

- **Colores principales** y gradientes definidos en `:root` de CSS.
- **Fuentes**: Baseltica (custom), Inter (Google Fonts) como fallback.
- **Breakpoints responsivos**: Mobile, Tablet, Desktop, Large Desktop, 4K.

## 🔧 Funcionalidades

- **Header fijo** con navegación suave y menú hamburguesa móvil.
- **Indicadores de sección activa** y scroll indicator en hero.
- **Secciones**: Hero (video fondo), Tu Cumbre (etapas y robot animado), Servicios (cards glassmorphism), FAQ (acordeón), Contacto (Google Calendar), Footer (links y redes).
- **Animaciones**: Robot flotante, hover en cards/botones, scroll reveal, shimmer en servicios.

## 🔗 Integraciones

- **Google Calendar**: Reserva de reuniones desde la sección contacto.
- **Analytics**: Google Tag Manager (opcional).

## 🛡️ Seguridad

- **Content Security Policy** recomendada en `<head>`.

## 📱 Testing

- **Responsive testing**: Herramientas de navegador, dispositivos reales, Lighthouse, WAVE.
- **Checklist de calidad**: Compatibilidad, performance, accesibilidad, SEO, formularios, links externos.

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Contacto

**Cumbre IA**

- 🌐 Website: [cumbre.cloud](https://cumbre.cloud)
- 💼 LinkedIn: [@cumbre-ia](https://www.linkedin.com/company/cumbre-ia)
- 📧 Email: hola@cumbre.cloud

---
⚡ **Powered by [Mecantronic](https://mecantronic.com.ar/)**
