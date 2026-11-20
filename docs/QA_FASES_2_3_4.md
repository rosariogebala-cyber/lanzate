# QA · Fases 2, 3 y 4

Rama de trabajo: `qa/fases-2-3-4-20261120`. No publicar sin revisión.

## Automatizado
- `node --test tests/site.test.mjs`: metadatos, anclas, sitemap y recursos locales.
- `find js -name '*.js' -exec node --check {} \\;`: sintaxis JavaScript.
- GitHub Actions ejecuta las comprobaciones en pushes y pull requests.

## Pendiente de ejecución local
1. W3C Nu Validator: validar la home y las páginas legales y de rubros.
2. axe-core: Chrome/Firefox, home, menús, modales y formularios; corregir hallazgos WCAG 2.2 AA.
3. Teclado y lector de pantalla: Tab, Shift+Tab, Enter, Escape; VoiceOver en Safari; retorno del foco tras cerrar modales.
4. Responsive: 320, 375, 768, 1024, 1440 px, zoom 200 % y reflujo 400 %.
5. Lighthouse móvil y escritorio: registrar LCP, CLS, INP y peso total antes de optimizar imágenes o animaciones.
6. Verificar Search Console, indexación real y que el sitemap corresponda a las rutas publicadas.
7. Probar las demos embebidas antes de aplicar `sandbox` a iframes: podría impedir funcionalidades legítimas.

## Alcance de las correcciones
- Navegación móvil: etiqueta accesible, cierre con Escape y clic exterior.
- Iframe demo: carga diferida y política de referrer.
- Metadatos comerciales: dominio .com.ar solo para Negocio y Pro.
- Enlace interno corregido y fecha del sitemap actualizada.
- Pruebas de humo y CI agregados.

Estas pruebas automatizadas NO equivalen a una certificación WCAG, una medición de Core Web Vitals ni una auditoría de seguridad del backend. No se modificó la rama main.

## Auditoría automatizada en navegador (requiere Node.js)
En una terminal, desde la raíz del proyecto:
```sh
npm install --no-save playwright @axe-core/playwright
npx playwright install chromium
python3 -m http.server 8000
```
En otra terminal, dentro de la misma carpeta:
```sh
node tests/browser-audit.mjs
```
El script guarda capturas para 320, 375, 768, 1024 y 1440 px y un informe JSON en `qa-reports/`. Comprueba overflow horizontal, errores JavaScript, menú móvil y reglas axe WCAG 2.2 AA. Si detecta problemas, termina con código distinto de cero: **esto es esperado durante el diagnóstico**.

Lighthouse, validación W3C, VoiceOver, zoom 200/400 %, modales y seguridad de las demos siguen requiriendo ejecución y revisión humana. El script no los certifica.
