# Cumbre IA - Landing Page Optimizada

Una landing page moderna y optimizada para Cumbre IA, empresa especializada en soluciones de inteligencia artificial para PyMEs.

## 🚀 Características

- **Diseño Moderno**: Glassmorphism, gradientes y animaciones fluidas
- **Totalmente Responsivo**: Desde 280px hasta 4K (2560px+)
- **Optimizado para Performance**: Lazy loading, preload de recursos críticos
- **Accesible**: Navegación por teclado, ARIA labels, semántica correcta
- **SEO Optimizado**: Meta tags, estructura semántica, Google verification

## 📁 Estructura del Proyecto

```
cumbre-ia/
├── index.html              # Archivo principal HTML
├── style.css              # Estilos CSS optimizados
├── script.js              # JavaScript funcional
├── CNAME                  # Configuración de dominio
├── README.md              # Documentación
└── assets/                # Recursos del proyecto
    ├── images/            # Imágenes optimizadas
    │   ├── pitch.svg      # Logo principal
    │   ├── robot.png      # Imagen del robot IA
    │   └── cumbre.png     # Imagen de fondo del footer
    ├── videos/            # Videos de fondo
    │   └── video.mp4      # Video de fondo del hero
    └── fonts/             # Fuentes personalizadas
        └── basetica-light.otf  # Fuente principal
```

## 🛠️ Instalación y Setup

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/cumbre-ia.git
cd cumbre-ia
```

### 2. Crear estructura de assets

```bash
mkdir -p assets/images assets/videos assets/fonts
```

### 3. Agregar los archivos multimedia

**Imágenes requeridas (`assets/images/`):**

- `pitch.svg` - Logo principal de Cumbre IA (formato SVG recomendado)
- `robot.png` - Imagen del robot IA para la sección features
- `cumbre.png` - Imagen de fondo para el footer

**Videos requeridos (`assets/videos/`):**

- `video.mp4` - Video de fondo para la sección hero (formato MP4, optimizado para web)

**Fuentes requeridas (`assets/fonts/`):**

- `basetica-light.otf` - Fuente personalizada Baseltica (formato OpenType)

### 4. Optimizaciones recomendadas para assets

**Para las imágenes:**

```bash
# Optimizar PNGs
pngquant --quality=65-80 assets/images/*.png

# Optimizar SVGs
svgo assets/images/*.svg

# Convertir a WebP (opcional, para mejor performance)
cwebp -q 80 assets/images/robot.png -o assets/images/robot.webp
cwebp -q 80 assets/images/cumbre.png -o assets/images/cumbre.webp
```

**Para el video:**

```bash
# Comprimir video para web
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k assets/videos/video.mp4
```

## 🎨 Personalización

### Colores principales

```css
:root {
  --primary-gradient: linear-gradient(45deg, #00d4ff, #0066ff);
  --secondary-gradient: linear-gradient(135deg, #667eea, #764ba2);
  --neural-gradient: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 50%,
    #f093fb 100%
  );
}
```

### Fuentes

- **Principal**: Baseltica (custom)
- **Fallback**: Inter (Google Fonts)
- **Configuración**: `font-display: swap` para mejor performance

### Breakpoints responsivos

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large Desktop**: 1440px+
- **4K**: 2560px+

## 🔧 Funcionalidades

### Navegación

- Header fijo con navegación suave
- Menú móvil hamburguesa
- Indicadores de sección activa
- Scroll indicator en hero

### Secciones

1. **Hero** - Video de fondo con CTA principal
2. **Tu Cumbre** - 4 etapas del proceso con robot animado
3. **Servicios** - Cards con efectos glassmorphism
4. **FAQ** - Acordeón interactivo
5. **Contacto** - Integración con Google Calendar
6. **Footer** - Links y redes sociales

### Animaciones

- Robot flotante con sombra animada
- Efectos hover en cards y botones
- Scroll reveal para elementos
- Shimmer effects en servicios

## 🔗 Integraciones

### Google Calendar

```javascript
// Configurado en section contacto
calendar.schedulingButton.load({
  url: "https://calendar.google.com/calendar/appointments/schedules/...",
  color: "#039BE5",
  label: "📅 Reservar Ahora",
});
```

### Analytics (opcional)

```html
<!-- Agregar en <head> -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

## 🛡️ Seguridad

### Content Security Policy (recomendado)

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  font-src 'self' fonts.gstatic.com;
  script-src 'self' calendar.google.com;
  img-src 'self' data:;
  media-src 'self';
"
/>
```

## 📱 Testing

### Responsive testing

```bash
# Usar las herramientas de desarrollo del navegador
# Probar en dispositivos reales
# Lighthouse para performance
# WAVE para accesibilidad
```

### Checklist de calidad

- [ ] ✅ Funciona en Chrome, Firefox, Safari, Edge
- [ ] ✅ Responsive en todos los breakpoints
- [ ] ✅ Navegación por teclado funcional
- [ ] ✅ Performance Score > 90
- [ ] ✅ Accesibilidad Score > 95
- [ ] ✅ SEO optimizado
- [ ] ✅ Formularios funcionando
- [ ] ✅ Links externos abren en nueva pestaña

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
- 📧 Email: contacto@cumbre.cloud

---

⚡ **Powered by [Mecantronics](https://mecantronic.com.ar/)**
