/* Datos editables del sitio: precios y contacto. La contratación se coordina por WhatsApp. */
window.SITE = {
  marca: "Lanzate",
  email: "rosariogebala@gmail.com",
  whatsapp: "5491166035111",
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
      mensual: 29900,
      entrega: "Entrega rápida",

      incluye: [
        "Hasta 4 secciones de contenido",
        "Portal privado para editar campos habilitados",
        "Vista previa y aprobación humana antes de publicar",
        "Diseño adaptado a celular, tablet y compu",
        "Menú, WhatsApp flotante, ubicación y footer sin consumir cupo",
        "Estadísticas propias de Lanzate",
        "Hosting y certificado de seguridad (SSL)",
        "Subdominio incluido: tunegocio.lanzate.com.ar (sin dominio propio)",
        "Hasta 10 envíos de cambios de contenido por mes desde tu portal",
        "1 cambio asistido por mes"
      ]
    },
    {
      id: "negocio",
      nombre: "Negocio",
      para: "Para que te encuentren en Google y te elijan frente a la competencia.",
      inicial: 179000,
      mensual: 49900,
      entrega: "Entrega rápida",
      destacado: true,

      incluye: [
        "Todo lo incluido en Express",
        "Hasta 7 secciones de contenido",
        "Conexión y gestión técnica de tu dominio .com.ar (el registro y la renovación los paga el cliente)",
        "Formulario de contacto a tu mail",
        "Horarios y reseñas de Google",
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
      mensual: 79900,
      entrega: "Entrega prioritaria",

      incluye: [
        "Todo lo incluido en Negocio",
        "Hasta 10 secciones de contenido a elección",
        "Podés solicitar módulos adicionales con presupuesto previo",
        "Componentes avanzados y galerías de contenido",
        "Galería de fotos y videos",
        "Medición avanzada: Google Analytics, Tag Manager y Píxel de Meta, según configuración y consentimiento",
        "Soporte prioritario en horario de atención",
        "Envíos ilimitados de cambios de contenido desde tu portal",
        "5 cambios asistidos por mes"
      ]
    }
  ],
  comparar: [
    ["Entrega", "A coordinar", "A coordinar", "Prioritaria según disponibilidad"],
    ["Rondas de revisión inicial", "1", "2", "3"],
    ["Secciones de contenido", "Hasta 4", "Hasta 7", "Hasta 10"],
    ["Menú, WhatsApp flotante, ubicación y footer (sin consumir cupo)", true, true, true],
    ["Conexión y gestión técnica del dominio propio", false, true, true],
    ["Hosting y SSL", true, true, true],
    ["Botón de WhatsApp", true, true, true],
    ["Formulario de contacto", false, true, true],
    ["Reseñas de Google", false, true, true],
    ["Alta en Google Maps", false, true, true],
    ["Gestión de turnos a medida", "Adicional", "Adicional", "Adicional"],
    ["Analítica", "Propia de Lanzate", "Propia de Lanzate", "Propia + avanzada"],
    ["Google Analytics, Tag Manager y Píxel de Meta", false, false, true],
    ["Portal privado de edición", true, true, true],
    ["Vista previa de cambios", true, true, true],
    ["Publicación con aprobación humana", true, true, true],
    ["Solicitar módulos adicionales (con presupuesto)", true, true, true],
    ["Envíos de cambios desde tu portal / mes", "10", "30", "Ilimitados"],
    ["Cambios asistidos por mes", "1", "3", "5"],
    ["Funcionalidades e integraciones adicionales", "Se cotizan aparte", "Se cotizan aparte", "Se cotizan aparte"]
  ]
};
