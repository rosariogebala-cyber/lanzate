/* Datos editables del sitio: precios, links de pago y contacto.
   En "mp" va el link de pago de Mercado Pago de cada plan (Mercado Pago → Cobrar → Link de pago).
   Mientras esté vacío, el botón abre un mail con el plan elegido. */
window.SITE = {
  marca: "Lanzate",
  email: "hola@example.com",
  whatsapp: "5491123456789",
  /* Medición: pegá acá los IDs cuando los tengas. Mientras estén vacíos no se carga nada.
     ga4: el "ID de medición" de Google Analytics (G-XXXXXXX).
     metaPixel: el número del Píxel de Meta (Administrador de eventos de Meta). */
  medicion: {
    ga4: "",
    metaPixel: ""
  },
  /* Datos fiscales: se muestran en el pie y en las páginas legales cuando están completos.
     dataFiscal es el link del QR de "Data Fiscal" que da ARCA. */
  legal: {
    razonSocial: "",
    cuit: "",
    domicilio: "",
    dataFiscal: ""
  },
  promo: {
    activa: true,
    texto: "Precio de lanzamiento para los primeros clientes",
    hasta: "30 de noviembre"
  },
  planes: [
    {
      id: "express",
      nombre: "Express",
      para: "Para salir online ya, con lo esencial para que te contacten.",
      inicial: 99000,
      mensual: 19900,
      entrega: "Entrega rápida",
      mp: "",
      incluye: [
        "Hasta 4 secciones con módulos prediseñados",
        "Portal privado para editar campos habilitados",
        "Vista previa y aprobación humana antes de publicar",
        "Diseño adaptado a celular, tablet y compu",
        "Botón de WhatsApp siempre visible",
        "Hosting y certificado de seguridad (SSL)",
        "Subdominio tunegocio.lanzate.com.ar",
        "Hasta 10 envíos de cambios de contenido por mes desde tu portal",
        "1 cambio asistido por mes"
      ]
    },
    {
      id: "negocio",
      nombre: "Negocio",
      para: "Para que te encuentren en Google y te elijan frente a la competencia.",
      inicial: 179000,
      mensual: 34900,
      entrega: "Entrega rápida",
      destacado: true,
      mp: "",
      incluye: [
        "Todo lo incluido en Express",
        "Dominio propio .com.ar incluido",
        "Formulario de contacto a tu mail",
        "Mapa, horarios y reseñas de Google",
        "Asistencia inicial para configurar Google Business Profile, sujeta a verificación de Google",
        "Hasta 30 envíos de cambios de contenido por mes desde tu portal",
        "3 cambios asistidos por mes"
      ]
    },
    {
      id: "pro",
      nombre: "Pro",
      para: "Para crecer con más secciones, analítica y soporte prioritario.",
      inicial: 299000,
      mensual: 54900,
      entrega: "Entrega prioritaria",
      mp: "",
      incluye: [
        "Todo lo incluido en Negocio",
        "Hasta 10 secciones a elección",
        "Podés pedir agregar módulos nuevos",
        "Componentes avanzados y galerías de contenido",
        "Galería de fotos y videos",
        "Analítica ampliada, sujeta a configuración y consentimientos",
        "Soporte prioritario en horario de atención",
        "Envíos ilimitados de cambios de contenido desde tu portal",
        "5 cambios asistidos por mes"
      ]
    }
  ],
  comparar: [
    ["Entrega", "A coordinar", "A coordinar", "Prioritaria según disponibilidad"],
    ["Rondas de revisión inicial", "1", "2", "3"],
    ["Secciones", "Hasta 4", "Hasta 7", "Hasta 10"],
    ["Dominio propio .com.ar", false, true, true],
    ["Hosting y SSL", true, true, true],
    ["Botón de WhatsApp", true, true, true],
    ["Formulario de contacto", false, true, true],
    ["Mapa y reseñas de Google", false, true, true],
    ["Alta en Google Maps", false, true, true],
    ["Gestión de turnos a medida", "Adicional", "Adicional", "Adicional"],
    ["Analítica", "Básica", "Básica", "Ampliada"],
    ["Portal privado de edición", true, true, true],
    ["Vista previa de cambios", true, true, true],
    ["Publicación con aprobación humana", true, true, true],
    ["Pedir módulos nuevos", false, false, true],
    ["Envíos de cambios desde tu portal / mes", "10", "30", "Ilimitados"],
    ["Cambios asistidos por mes", "1", "3", "5"],
    ["Funcionalidades e integraciones adicionales", "Se cotizan aparte", "Se cotizan aparte", "Se cotizan aparte"]
  ]
};
