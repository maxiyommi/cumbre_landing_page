# Cumbre IA - Landing Page

Una landing page moderna para **Cumbre IA**, una agencia de inteligencia artificial especializada en PyMEs argentinas.

## ✨ Características

- 🏔️ **Diseño AI-themed** con metáforas de montañismo
- 📱 **Totalmente responsive** optimizado para todas las resoluciones
- 🎨 **Glassmorphism UI** con efectos de cristal y backdrop-filter
- 🔍 **SEO optimizado** con meta tags apropiados
- ⚡ **Código limpio** sin dependencias externas
- 🎯 **Scroll indicator** centrado y fijo en pantalla

## 🛠️ Tecnologías

- **HTML5** semántico con roles ARIA
- **CSS3** con custom properties, CSS Grid y Flexbox
- **JavaScript ES6+** modular con clase AILandingPage
- **Responsive Design** mobile-first con múltiples breakpoints
- **Google Calendar API** integrada para agendamiento

## 🚀 Instalación y Uso

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/cumbre_landing_page.git
   cd cumbre_landing_page
   ```

2. **Abrir en navegador**
   ```bash
   # Opción 1: Abrir directamente
   open index.html
   
   # Opción 2: Servidor local con Python
   python -m http.server 8000
   
   # Opción 3: Servidor local con Node.js
   npx serve
   ```

3. **Navegar a** `http://localhost:8000`

## 🎯 Funcionalidades

### Landing Page
- Navegación inteligente que se oculta en la sección inicio
- Scroll indicator centrado que se desvanece al hacer scroll
- Efecto parallax en imagen de montaña de fondo
- Logo clickeable para scroll to top

### Secciones
- **Inicio**: Hero con título, subtítulo e indicador de scroll
- **Tu Cumbre**: 4 etapas del proceso de transformación digital con robot animado
- **Servicios**: Agentes IA, Chatbots inteligentes y Consultoría tecnológica
- **FAQ**: Preguntas frecuentes con acordeón funcional
- **Contacto**: Integración con Google Calendar para agendamiento

### Características Técnicas
- Navbar responsive con menú hamburguesa para móviles
- Animaciones con Intersection Observer para scroll-triggered effects
- FAQ toggle con animación de rotación
- Optimización para múltiples resoluciones (320px-4K)

## 🎨 Diseño

- **Paleta**: Gradientes azules AI-themed (#00d4ff, #667eea, #764ba2)
- **Tipografía**: Inter font family con font-weights 300-800
- **Layout**: CSS Grid y Flexbox para layouts complejos
- **Efectos**: Glassmorphism, backdrop-filter, animaciones suaves
- **Iconografía**: SVG inline para iconos de montaña y features

## 📱 Responsive Design

- **Mobile Small**: 320px (elementos ultra-compactos)
- **Mobile Medium**: 375px (ajustes intermedios)  
- **Mobile Large**: 425px (optimización para móviles grandes)
- **Tablet**: 768px - 1024px (servicios en 2 columnas)
- **Desktop**: > 1024px (layout completo)
- **Large Desktop**: > 1440px (contenedores expandidos)
- **4K**: > 2560px (escalado para pantallas grandes)

## 🏗️ Arquitectura

### Archivos principales
- `index.html` - Estructura HTML semántica
- `style.css` - Estilos con CSS custom properties
- `script.js` - Funcionalidad JavaScript modular

### Recursos
- `cumbre.png` - Imagen de fondo de montañas
- `cumbre.svg` - Logo SVG escalable  
- `robot.png` - Imagen del robot animado

## 🔧 Desarrollo

Para desarrollo local, simplemente edita los archivos y recarga el navegador. No requiere build process.

### Comandos útiles
```bash
# Validar HTML
npx html-validate index.html

# Optimizar imágenes
npx imagemin-cli cumbre.png --out-dir=optimized/

# Servidor local
python -m http.server 8000
npx serve
```

### Estructura CSS
- Variables CSS en `:root` para temas consistentes
- Media queries mobile-first
- Clases BEM para componentes
- Animaciones CSS optimizadas

## 📄 Licencia

© 2025 Cumbre IA. Todos los derechos reservados.

---

**Desarrollado por** [Mecantronics](https://mecantronic.com.ar/) 🤖